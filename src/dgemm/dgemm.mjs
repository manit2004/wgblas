import {
  uploadBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
  vec4ViewBinding,
  vec4Usable,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import {
  BM_SMALL,
  BN_SMALL,
  BM_LARGE,
  BN_LARGE,
  LARGE_TILE_WORKGROUP_THRESHOLD,
} from "../util/constants.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dgemm: C := alpha * op(A) * op(B) + beta * C, double-double (Dekker) f64
// emulation of sgemm — A, B, C, alpha, and beta are each split into an f32
// (hi, lo) pair; WGSL has no f64 type. Same two-tier dispatch as sgemm.
export async function dgemm(
  device,
  transA,
  transB,
  m,
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
  let AIsGpu = A instanceof GpuMatrix;
  let BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  requireGpuDevice(device);
  requireSameDevice(device, "dgemm", { A, B, C });
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (transB !== "no-transpose" && transB !== "transpose")
    throw new Error("transB must be 'no-transpose' or 'transpose'.");
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
    !Number.isInteger(k) ||
    !Number.isInteger(lda) ||
    !Number.isInteger(ldb) ||
    !Number.isInteger(ldc)
  )
    throw new Error("m, n, k, lda, ldb, and ldc must be integers.");
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
  if (m < 0 || n < 0 || k < 0)
    throw new Error("m, n, and k must be non-negative.");
  if (lda <= 0 || ldb <= 0 || ldc <= 0)
    throw new Error("lda, ldb, and ldc must be positive.");
  if (m === 0 || n === 0) return CIsGpu ? {} : { C };

  // GpuMatrix's own .layout wins over the shared `layout` argument.
  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;
  const effLayoutC = CIsGpu ? C.layout : layout;

  // Shape validation, before any layout-driven swapping below.
  // A: op(A) is m x k; A itself is m x k or k x m depending on transA.
  const aRows = effLayoutA === "column-major" ? k : m;
  const aCols = effLayoutA === "column-major" ? m : k;
  const aOuter = transA === "no-transpose" ? aRows : aCols; // # of stored chunks
  const aInner = transA === "no-transpose" ? aCols : aRows; // required chunk length
  if (lda < aInner)
    throw new Error(
      `lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`,
    );
  if (AIsGpu) {
    if (lda !== A.lda)
      throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = transA === "no-transpose" ? [m, k] : [k, m];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given m, k, and transA.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error(
      "A does not have enough elements for the given dimensions and lda.",
    );
  }

  // B: same reasoning as A, with op(B) = k x n.
  const bRows = effLayoutB === "column-major" ? n : k;
  const bCols = effLayoutB === "column-major" ? k : n;
  const bOuter = transB === "no-transpose" ? bRows : bCols;
  const bInner = transB === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(
      `ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`,
    );
  if (BIsGpu) {
    if (ldb !== B.lda)
      throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = transB === "no-transpose" ? [k, n] : [n, k];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and transB.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error(
      "B does not have enough elements for the given dimensions and ldb.",
    );
  }

  // C: always m x n (no trans flag) — layout only affects lda/storage order.
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

  // Column-major A/B reinterpreted row-major is A^T/B^T — flip the trans flag.
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  if (effLayoutB === "column-major")
    transB = transB === "no-transpose" ? "transpose" : "no-transpose";

  // Column-major C: compute C^T = op(B)^T * op(A)^T instead (swap A/B, flip trans, swap m<->n).
  if (effLayoutC === "column-major") {
    [A, B] = [B, A];
    [AIsGpu, BIsGpu] = [BIsGpu, AIsGpu];
    [lda, ldb] = [ldb, lda];
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    [m, n] = [n, m];
  }

  // Shape-based auto-select — same threshold as sgemm (see dgemm_small.wgsl/dgemm_large.wgsl).
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(m / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const pipeline = await getPipeline(
    device,
    [...f64Deps, useLargeTile ? "dgemm_large" : "dgemm_small"],
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
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dgemm-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dgemm-ALo", false);
    }
    if (BIsGpu) {
      BHiBuffer = B._buf;
      BLoBuffer = B._loBuf;
    } else {
      const BSplit = splitDoubleDouble(B);
      BHiBuffer = uploadBuffer(device, BSplit.hi, "dgemm-BHi", false);
      BLoBuffer = uploadBuffer(device, BSplit.lo, "dgemm-BLo", false);
    }
    if (CIsGpu) {
      CHiBuffer = C._buf;
      CLoBuffer = C._loBuf;
    } else {
      const CSplit = splitDoubleDouble(C);
      CHiBuffer = uploadBuffer(device, CSplit.hi, "dgemm-CHi", true);
      CLoBuffer = uploadBuffer(device, CSplit.lo, "dgemm-CLo", true);
    }

    // Vectorized-load enablement, kernel-side view after the column-major
    // swap — same rules as sgemm.mjs, checked against the Hi buffers (the
    // only ones with vec4 views). Lo is the same size as Hi, so every index
    // the vec4 path touches in Hi also exists in Lo.
    const aNot = transA === "no-transpose";
    const bNot = transB === "no-transpose";
    const useVecA = aNot && vec4Usable(AHiBuffer, lda, m, k); // transposed-A vec stores bank-conflict smem — measured slower than scalar for sgemm
    const useVecB = vec4Usable(BHiBuffer, ldb, bNot ? k : n, bNot ? n : k);

    const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
      new Float64Array([alpha]),
    );
    const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
      new Float64Array([beta]),
    );

    paramsBuffer = createParamsBuffer(
      device,
      [
        { value: m, type: "u32" },
        { value: n, type: "u32" },
        { value: k, type: "u32" },
        { value: alphaHi[0], type: "f32" },
        { value: alphaLo[0], type: "f32" },
        { value: betaHi[0], type: "f32" },
        { value: betaLo[0], type: "f32" },
        { value: lda, type: "u32" },
        { value: ldb, type: "u32" },
        { value: ldc, type: "u32" },
        { value: transA === "transpose" ? 1 : 0, type: "u32" },
        { value: transB === "transpose" ? 1 : 0, type: "u32" },
        { value: useVecA ? 1 : 0, type: "u32" },
        { value: useVecB ? 1 : 0, type: "u32" },
      ],
      "dgemm-params",
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

    const wgCount = useLargeTile
      ? {
          x: requireWorkgroupCount(device, largeWgX, "dgemm", "x"),
          y: requireWorkgroupCount(device, largeWgY, "dgemm", "y"),
        }
      : {
          x: requireWorkgroupCount(
            device,
            Math.ceil(n / BN_SMALL),
            "dgemm",
            "x",
          ),
          y: requireWorkgroupCount(
            device,
            Math.ceil(m / BM_SMALL),
            "dgemm",
            "y",
          ),
        };
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      bindGroup,
      wgCount,
    );
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
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
