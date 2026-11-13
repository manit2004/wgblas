import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
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
import { splitDoubleDouble, mergeDoubleDoubleExact } from "../util/f64.mjs";
import { BM_SMALL, BN_SMALL, TILE_WG_2D } from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dsymm: C := alpha*A*B + beta*C (side='left') or alpha*B*A + beta*C
// (side='right'), A symmetric — double-double f64 emulation of ssymm. No
// dedicated shader: symmetrize.wgsl expands A's stored triangle into a dense
// copy (run once on the Hi half and once on the Lo half — it only moves
// values, so the copy is exact), then dgemm_small, all on one encoder.
export async function dsymm(
  device,
  side,
  uplo,
  m,
  n,
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
  requireSameDevice(device, "dsymm", { A, B, C });
  if (side !== "left" && side !== "right")
    throw new Error("side must be 'left' or 'right'.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, lda, ldb, and ldc must be integers.");
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
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };

  // GpuMatrix's own .layout wins over the shared `layout` argument.
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;

  // A: symmetric, order = m (side='left') or n (side='right').
  const aOrder = side === "left" ? m : n;
  if (lda < aOrder)
    throw new Error("lda must be >= " + (side === "left" ? "m" : "n") + ".");
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (A.rows < aOrder || A.cols < aOrder)
      throw new Error("A is too small for the given m/n and side.");
  } else if (A.length < (aOrder - 1) * lda + aOrder) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }

  // B: always m x n, no trans flag — same shape rule as dgemm's C.
  const bOuter = effLayoutB === "column-major" ? n : m;
  const bInner = effLayoutB === "column-major" ? m : n;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    if (B.rows < m || B.cols < n)
      throw new Error("B is too small for the given m and n.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }

  // C: always m x n.
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(
      `ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`,
    );
  if (CIsGpu) {
    if (ldc !== C.lda)
      throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n)
      throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error(
      "C does not have enough elements for the given dimensions and ldc.",
    );
  }

  // Reference BLAS quick return: alpha = 0 with beta = 1 leaves C as it is —
  // no GPU round trip, which would also round full-precision doubles.
  if (alpha === 0 && beta === 1) return CIsGpu ? {} : { C };

  // A = A^T, so column-major storage is still A, but the populated
  // triangle swaps — uplo flips (same reasoning dsyr/dsyrk use).
  const uploEffA =
    effLayoutA === "column-major"
      ? uplo === "lower"
        ? "upper"
        : "lower"
      : uplo;

  const transB = effLayoutB === "column-major" ? "transpose" : "no-transpose";
  const transDense = "no-transpose"; // Adense is always row-major

  // X*Y (X=Adense,Y=B for side='left', swapped for 'right'). Column-major
  // C: compute C^T instead (swap X/Y, flip trans, swap m_g/n_g) — dgemm's own trick.
  let mg = m,
    ng = n;
  const kg = aOrder;
  let transX = side === "left" ? transDense : transB;
  let transY = side === "left" ? transB : transDense;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  let swapXY = side === "right"; // which operand plays "X" vs "Y" below
  if (effLayoutC === "column-major") {
    [transX, transY] = [flip(transY), flip(transX)];
    swapXY = !swapXY;
    [mg, ng] = [ng, mg];
  }

  // Always dgemm_small — dgemm_large measured ~2x slower (see dgemm.mjs).
  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const gemmPipeline = await getPipeline(
    device,
    [...f64Deps, "f64/utils/batch", "dgemm_small"],
    "main",
  );
  const symPipeline = await getPipeline(device, "symmetrize");
  const gemmWgCount = {
    x: requireWorkgroupCount(device, Math.ceil(ng / BN_SMALL), "dsymm", "x"),
    y: requireWorkgroupCount(device, Math.ceil(mg / BM_SMALL), "dsymm", "y"),
  };
  const symWgCount = {
    x: Math.ceil(aOrder / TILE_WG_2D),
    y: Math.ceil(aOrder / TILE_WG_2D),
  };

  const ldDense = aOrder; // Adense is tightly packed, row-major
  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let AdenseHiBuffer = null;
  let AdenseLoBuffer = null;
  let symParams = null;
  let gemmParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsymm-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsymm-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dsymm-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dsymm-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dsymm-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dsymm-CLo", true);
    }
    AdenseHiBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "dsymm-AdenseHi",
    );
    AdenseLoBuffer = createStorageBuffer(
      device,
      aOrder * ldDense * 4,
      "dsymm-AdenseLo",
    );

    symParams = createParamsBuffer(
      device,
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: ldDense, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
      ],
      "dsymm-sym-params",
    );
    const symLayout = symPipeline.getBindGroupLayout(0);
    const symHiBindGroup = createBindGroup(device, symLayout, [
      AHiBuffer,
      AdenseHiBuffer,
      symParams,
    ]);
    const symLoBindGroup = createBindGroup(device, symLayout, [
      ALoBuffer,
      AdenseLoBuffer,
      symParams,
    ]);

    // X/Y operands ({ hi, lo, ld }), matching swapXY above.
    const dense = { hi: AdenseHiBuffer, lo: AdenseLoBuffer, ld: ldDense };
    const opB = { hi: BHiBuffer, lo: BLoBuffer, ld: ldb };
    const X = swapXY ? opB : dense;
    const Y = swapXY ? dense : opB;
    // Vectorized-load enablement — same rules as dgemm.mjs, checked against
    // the Hi buffers (the only ones with vec4 views).
    const xNot = transX === "no-transpose";
    const yNot = transY === "no-transpose";
    const useVecX = xNot && vec4Usable(X.hi, X.ld, mg, kg); // transposed-A vec stores bank-conflict smem — measured slower than scalar for sgemm
    const useVecY = vec4Usable(Y.hi, Y.ld, yNot ? kg : ng, yNot ? ng : kg);

    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );
    gemmParams = createParamsBuffer(
      device,
      [
        { value: mg, type: "u32" },
        { value: ng, type: "u32" },
        { value: kg, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: X.ld, type: "u32" },
        { value: Y.ld, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecX ? 1 : 0, type: "u32" },
        { value: useVecY ? 1 : 0, type: "u32" },
        { value: 0, type: "u32" }, // uplo: full C
      ],
      "dsymm-gemm-params",
    );
    const gemmBindGroup = createBindGroup(
      device,
      gemmPipeline.getBindGroupLayout(0),
      [
        X.hi,
        vec4ViewBinding(device, X.hi),
        X.lo,
        Y.hi,
        vec4ViewBinding(device, Y.hi),
        Y.lo,
        CHiBuffer,
        CLoBuffer,
        gemmParams,
      ],
    );

    // Three passes on one encoder; the timestamp brackets them (begin on the
    // first symmetrize, end on the gemm), as in ssymm.
    const { commandEncoder, querySet } = beginTimedEncoder(device);
    const symDesc = querySet
      ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } }
      : undefined;
    const gemmDesc = querySet
      ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } }
      : undefined;
    encodePass(
      commandEncoder,
      symPipeline,
      symHiBindGroup,
      symWgCount,
      symDesc,
    );
    encodePass(commandEncoder, symPipeline, symLoBindGroup, symWgCount);
    encodePass(
      commandEncoder,
      gemmPipeline,
      gemmBindGroup,
      gemmWgCount,
      gemmDesc,
    );

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
    const result = mergeDoubleDoubleExact(hi, lo, C);
    if (gpuTimeMs !== undefined) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!BIsGpu && BHiBuffer) destroyBuffers(BHiBuffer);
    if (!BIsGpu && BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (AdenseHiBuffer) destroyBuffers(AdenseHiBuffer);
    if (AdenseLoBuffer) destroyBuffers(AdenseLoBuffer);
    if (symParams) destroyBuffers(symParams);
    if (gemmParams) destroyBuffers(gemmParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
