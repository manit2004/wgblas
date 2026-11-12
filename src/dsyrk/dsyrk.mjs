import {
  uploadBuffer,
  createStorageBuffer,
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

// dsyrk: C := uplo(alpha*op(A)*op(A)^T + beta*C), double-double f64 emulation
// of ssyrk. No dedicated shader — dgemmtr's kernel (dgemm_small
// with their uplo triangle mask) with A duplicated into a separate B buffer
// (B := A), the same relationship ssyrk has to sgemmtr.
export async function dsyrk(
  device,
  uplo,
  trans,
  n,
  k,
  alpha,
  A,
  lda,
  beta,
  C,
  ldc,
  layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  requireGpuDevice(device);
  requireSameDevice(device, "dsyrk", { A, C });
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
    !Number.isInteger(ldc)
  )
    throw new Error("n, k, lda, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float64Array))
    throw new Error("C must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (CIsGpu && C.dtype !== Float64Array)
    throw new Error("C must be a Float64Array-backed GpuMatrix.");
  if (AIsGpu && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
  if (CIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (lda <= 0 || ldc <= 0) throw new Error("lda and ldc must be positive.");
  if (n === 0) return CIsGpu ? {} : { C };

  // GpuMatrix's own .layout wins over the shared `layout` argument.
  const effLayoutA = AIsGpu ? A.layout : layout;
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

  // Column-major A reinterpreted row-major is A^T — flip trans, same trick
  // dgemm/dgemmtr use.
  let transA = trans;
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  // op(B) := op(A)^T (B is A itself) — opposite of transA.
  let transB = transA === "no-transpose" ? "transpose" : "no-transpose";

  // Column-major C: same swap trick dgemmtr uses, simplified since A === B
  // and m=n — the swap only flips both trans flags, and uplo flips too.
  let uploEff = uplo;
  if (effLayoutC === "column-major") {
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    uploEff = uploEff === "lower" ? "upper" : "lower";
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

  let AHiBuffer = null;
  let ALoBuffer = null;
  let BHiBuffer = null;
  let BLoBuffer = null;
  let CHiBuffer = null;
  let CLoBuffer = null;
  let paramsBuffer = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    // B := A, but as genuinely separate buffers (as in ssyrk) — the split is
    // uploaded twice for Float64Array, GPU-copied (see below) for GpuMatrix,
    // since the caller owns A's buffers.
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
      BHiBuffer = createStorageBuffer(
        device,
        AHiBuffer.size,
        "dsyrk-BHi",
        GPUBufferUsage.COPY_DST,
      );
      BLoBuffer = createStorageBuffer(
        device,
        ALoBuffer.size,
        "dsyrk-BLo",
        GPUBufferUsage.COPY_DST,
      );
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsyrk-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsyrk-ALo", false);
      BHiBuffer = uploadBuffer(device, ASplit.hi, "dsyrk-BHi", false);
      BLoBuffer = uploadBuffer(device, ASplit.lo, "dsyrk-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dsyrk-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dsyrk-CLo", true);
    }

    // Vectorized-load enablement — same rules as dgemm.mjs, gemm frame m=n=n,
    // checked against the Hi buffers (the only ones with vec4 views).
    const aNot = transA === "no-transpose";
    const bNot = transB === "no-transpose";
    const useVecA = aNot && vec4Usable(AHiBuffer, lda, n, k); // transposed-A vec stores bank-conflict smem — measured slower than scalar for sgemm
    const useVecB = vec4Usable(BHiBuffer, lda, bNot ? k : n, bNot ? n : k);

    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );

    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: n, type: "u32" }, // gemmtr's m
        { value: n, type: "u32" }, // gemmtr's n
        { value: k, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: lda, type: "u32" }, // gemmtr's lda
        { value: lda, type: "u32" }, // gemmtr's ldb — B := A, same lda
        { value: ldc, type: "u32" },
        { value: transA === "transpose" ? 1 : 0, type: "u32" },
        { value: transB === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
        { value: uploEff === "lower" ? 1 : 2, type: "u32" }, // the kernels' mask: 1 = lower, 2 = upper
      ],
      "dsyrk-params",
    );

    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      AHiBuffer,
      vec4ViewBinding(device, AHiBuffer),
      ALoBuffer,
      BHiBuffer,
      vec4ViewBinding(device, BHiBuffer),
      BLoBuffer,
      CHiBuffer,
      CLoBuffer,
      paramsBuffer,
    ]);

    const wgCount = {
      x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "dsyrk", "x"),
      y: requireWorkgroupCount(device, Math.ceil(n / BM_SMALL), "dsyrk", "y"),
    };
    // Manual encoder (not runComputePass) so the A->B duplicate copies land
    // on the same command encoder, strictly before the compute pass reads B.
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    if (AIsGpu) {
      commandEncoder.copyBufferToBuffer(
        AHiBuffer,
        0,
        BHiBuffer,
        0,
        AHiBuffer.size,
      );
      commandEncoder.copyBufferToBuffer(
        ALoBuffer,
        0,
        BLoBuffer,
        0,
        ALoBuffer.size,
      );
    }
    encodePass(commandEncoder, pipeline, bindGroup, wgCount, passDescriptor);
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
    // B is always our own, never the caller's.
    if (BHiBuffer) destroyBuffers(BHiBuffer);
    if (BLoBuffer) destroyBuffers(BLoBuffer);
    if (!CIsGpu && CHiBuffer) destroyBuffers(CHiBuffer);
    if (!CIsGpu && CLoBuffer) destroyBuffers(CLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
