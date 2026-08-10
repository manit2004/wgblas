import {
  uploadBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

const BM = 32, BN = 32;

export async function sgemm(
  device, transA, transB, m, n, k, alpha, A, lda, B, ldb, beta, C, ldc, layout = "row-major",
) {
  let AIsGpu = A instanceof GpuMatrix;
  let BIsGpu = B instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (transB !== "no-transpose" && transB !== "transpose")
    throw new Error("transB must be 'no-transpose' or 'transpose'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number")
    throw new Error("beta must be a number.");
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
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float32Array))
    throw new Error("B must be a Float32Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float32Array))
    throw new Error("C must be a Float32Array or GpuMatrix.");
  if ((AIsGpu || BIsGpu) && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A or B is a GpuMatrix.");
  if (CIsGpu && (!AIsGpu || !BIsGpu))
    throw new Error("A and B must be GpuMatrix when C is a GpuMatrix.");
  if (m < 0 || n < 0 || k < 0) throw new Error("m, n, and k must be non-negative.");
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
    throw new Error(`lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`);
  if (AIsGpu) {
    if (lda !== A.lda) throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = transA === "no-transpose" ? [m, k] : [k, m];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given m, k, and transA.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error("A does not have enough elements for the given dimensions and lda.");
  }

  // B: same reasoning as A, with op(B) = k x n.
  const bRows = effLayoutB === "column-major" ? n : k;
  const bCols = effLayoutB === "column-major" ? k : n;
  const bOuter = transB === "no-transpose" ? bRows : bCols;
  const bInner = transB === "no-transpose" ? bCols : bRows;
  if (ldb < bInner)
    throw new Error(`ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`);
  if (BIsGpu) {
    if (ldb !== B.lda) throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    const [bLogRows, bLogCols] = transB === "no-transpose" ? [k, n] : [n, k];
    if (B.rows < bLogRows || B.cols < bLogCols)
      throw new Error("B is too small for the given n, k, and transB.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error("B does not have enough elements for the given dimensions and ldb.");
  }

  // C: always m x n (no trans flag) — layout only affects lda/storage order.
  const cOuter = effLayoutC === "column-major" ? n : m;
  const cInner = effLayoutC === "column-major" ? m : n;
  if (ldc < cInner)
    throw new Error(`ldc must be >= ${effLayoutC === "column-major" ? "rows" : "cols"} of C as stored.`);
  if (CIsGpu) {
    if (ldc !== C.lda) throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < m || C.cols < n) throw new Error("C is too small for the given m and n.");
  } else if (C.length < (cOuter - 1) * ldc + cInner) {
    throw new Error("C does not have enough elements for the given dimensions and ldc.");
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

  const pipeline = await getPipeline(device, "sgemm");

  const ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "sgemm-A", false);
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(B, "sgemm-B", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(C, "sgemm-C", true);
  const paramsBuffer = createParamsBuffer(
    [
      { value: m,   type: "u32" },
      { value: n,   type: "u32" },
      { value: k,   type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta,  type: "f32" },
      { value: lda, type: "u32" },
      { value: ldb, type: "u32" },
      { value: ldc, type: "u32" },
      { value: transA === "transpose" ? 1 : 0, type: "u32" },
      { value: transB === "transpose" ? 1 : 0, type: "u32" },
    ],
    "sgemm-params",
  );

  try {
    const bindGroup = createBindGroup(pipeline.getBindGroupLayout(0), [
      ABuffer,
      BBuffer,
      CBuffer,
      paramsBuffer,
    ]);

    const wgCount = {
      x: Math.min(Math.ceil(n / BN), device.limits.maxComputeWorkgroupsPerDimension),
      y: Math.min(Math.ceil(m / BM), device.limits.maxComputeWorkgroupsPerDimension),
    };
    const { commandEncoder, ts } = runComputePass(pipeline, bindGroup, wgCount);
    const readBuffer = CIsGpu ? null : stageReadback(commandEncoder, CBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (CIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { C: result, gpuTimeMs };
    return { C: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!BIsGpu) destroyBuffers(BBuffer);
    if (!CIsGpu) destroyBuffers(CBuffer);
    destroyBuffers(paramsBuffer);
  }
}
