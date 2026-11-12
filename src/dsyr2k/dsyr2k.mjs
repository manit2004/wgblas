import {
  uploadBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
  vec4ViewBinding,
  vec4Usable,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { BM_SMALL, BN_SMALL } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dsyr2k: C := uplo(alpha*op(A)*op(B)^T + alpha*op(B)*op(A)^T + beta*C),
// double-double f64 emulation of ssyr2k. No dedicated shader — two dgemmtr
// passes (dgemm_small with its uplo triangle mask) on one
// encoder, the second with beta=1, as ssyr2k does on sgemmtr's kernels.
export async function dsyr2k(
  device,
  uplo,
  trans,
  n,
  k,
  alpha,
  A,
  lda,
  B,
  ldb,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  requireGpuDevice(device);
  requireSameDevice(device, "dsyr2k", { A, B, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("n, k, lda, ldb, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float64Array))
    throw new Error("B must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (BIsGpu && B.dtype !== Float64Array)
    throw new Error("B must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (n === 0) return CIsGpu ? {} : { C };

  // GpuMatrix's own .layout wins over the shared `layout` argument.
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;

  // A: op(A) is n x k; A itself is n x k or k x n depending on trans.
  const aRows = effLayoutA === "column-major" ? k : n;
  const aCols = effLayoutA === "column-major" ? n : k;
  const aOuter = trans === "no-transpose" ? aRows : aCols;
  const aInner = trans === "no-transpose" ? aCols : aRows;
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }

  // B: same shape rule as A — netlib's syr2k shares one trans across both operands.
  const bRows = effLayoutB === "column-major" ? k : n;
  const bCols = effLayoutB === "column-major" ? n : k;
  const bOuter = trans === "no-transpose" ? bRows : bCols;
  const bInner = trans === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and trans.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }

  // C: always n x n symmetric — layout only affects storage order, not size.
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n)
      throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }

  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");

  // Column-major A/B reinterpreted row-major is A^T/B^T — flip trans per operand.
  const effTransA = effLayoutA === "column-major" ? flip(trans) : trans;
  const effTransB = effLayoutB === "column-major" ? flip(trans) : trans;
  const uploEff =
    effLayoutC === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;

  // One pass: op(X) as-is, op(Y) transposed. Column-major C swaps the
  // operands (C^T = Y'X'^T), same as ssyr2k. X/Y are { hi, lo, ld }.
  function passShape(transOwnX, X, transOwnY, Y) {
    const transX = transOwnX;
    const transY = flip(transOwnY);
    if (effLayoutC !== "column-major") return { transX, X, transY, Y };
    return { transX: flip(transY), X: Y, transY: flip(transX), Y: X };
  }

  // Always dgemm_small: dgemm_large (BM=BN=64), sgemm's large-tile split
  // carried over, measured ~2x slower at every size from 128 to 2048 on a
  // GTX 1650 — double-double tiles need twice the registers and smem.

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, "dgemm_small"],
    "main",
  );
  const wgCount = {
    x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "dsyr2k", "x"),
    y: requireWorkgroupCount(device, Math.ceil(n / BM_SMALL), "dsyr2k", "y"),
  };

  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let paramsBuffer1 = null;
  let paramsBuffer2 = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyr2k-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyr2k-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dsyr2k-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dsyr2k-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dsyr2k-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dsyr2k-CLo", true);
    }

    const opA = { hi: AHiBuffer, lo: ALoBuffer, ld: lda };
    const opB = { hi: BHiBuffer, lo: BLoBuffer, ld: ldb };
    const pass1 = passShape(effTransA, opA, effTransB, opB);
    const pass2 = passShape(effTransB, opB, effTransA, opA);

    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );

    // Vectorized-load enablement per pass — same rules as dgemm.mjs, gemm
    // frame m=n=n, checked against the Hi buffers (the only ones with vec4 views).
    const makeParams = (p, betaVal, label) => {
      const xNot = p.transX === "no-transpose";
      const yNot = p.transY === "no-transpose";
      const useVecX = xNot && vec4Usable(p.X.hi, p.X.ld, n, k); // transposed-A vec stores bank-conflict smem — measured slower than scalar for sgemm
      const useVecY = vec4Usable(p.Y.hi, p.Y.ld, yNot ? k : n, yNot ? n : k);
      const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
        new Float64Array([betaVal]),
      );
      return createParamsBuffer(
        device,
        [
          { value: n, type: "u32" }, // gemmtr's m
          { value: n, type: "u32" }, // gemmtr's n
          { value: k, type: "u32" },
          { value: alphaHi[0], type: "f32" },
          { value: alphaLo[0], type: "f32" },
          { value: betaHi[0], type: "f32" },
          { value: betaLo[0], type: "f32" },
          { value: p.X.ld, type: "u32" },
          { value: p.Y.ld, type: "u32" },
          { value: ldc, type: "u32" },
          { value: p.transX === "transpose" ? 1 : 0, type: "u32" },
          { value: p.transY === "transpose" ? 1 : 0, type: "u32" },
          { value: useVecX ? 1 : 0, type: "u32" },
          { value: useVecY ? 1 : 0, type: "u32" },
          { value: uploEff === "lower" ? 1 : 2, type: "u32" }, // the kernels' mask: 1 = lower, 2 = upper
        ],
        label,
      );
    };
    paramsBuffer1 = makeParams(pass1, beta, "dsyr2k-params1");
    paramsBuffer2 = makeParams(pass2, 1.0, "dsyr2k-params2");

    const makeBindGroup = (p, paramsBuffer) =>
      createBindGroup(device, pipeline.getBindGroupLayout(0), [
        p.X.hi,
        vec4ViewBinding(device, p.X.hi),
        p.X.lo,
        p.Y.hi,
        vec4ViewBinding(device, p.Y.hi),
        p.Y.lo,
        CHiBuffer,
        CLoBuffer,
        paramsBuffer,
      ]);
    const bindGroup1 = makeBindGroup(pass1, paramsBuffer1);
    const bindGroup2 = makeBindGroup(pass2, paramsBuffer2);

    // Both passes on one encoder; the timestamp brackets them (begin on pass
    // 1, end on pass 2), as in ssyr2k.
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    const desc1 = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : undefined;
    const desc2 = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : undefined;
    encodePass(commandEncoder, pipeline, bindGroup1, wgCount, desc1);
    encodePass(commandEncoder, pipeline, bindGroup2, wgCount, desc2);

    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CHiBuffer);
    readLoBuffer = CIsGpu
      ? null
      : stageReadback(device, commandEncoder, CLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (CIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (paramsBuffer1) destroyBuffers(paramsBuffer1);
    if (paramsBuffer2) destroyBuffers(paramsBuffer2);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
