import {
  uploadBuffer,
  createStorageBuffer,
  createParamsBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { BM_SMALL, BN_SMALL, BM_LARGE, BN_LARGE, LARGE_TILE_WORKGROUP_THRESHOLD } from "../util/constants.mjs";
import { requireSameDevice } from "../util/device.mjs";


// ssyrk: C := uplo(alpha*op(A)*op(A)^T + beta*C). No dedicated shader —
// sgemmtr's kernel with A duplicated into a separate B buffer (B := A).
export async function ssyrk(
  device, uplo, trans, n, k, alpha, A, lda, beta, C, ldc, layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const CIsGpu = C instanceof GpuMatrix;

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  requireSameDevice(device, "ssyrk", { A, C });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
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
  if (!Number.isInteger(n) || !Number.isInteger(k) || !Number.isInteger(lda) || !Number.isInteger(ldc))
    throw new Error("n, k, lda, and ldc must be integers.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!CIsGpu && !(C instanceof Float32Array))
    throw new Error("C must be a Float32Array or GpuMatrix.");
  if (AIsGpu && !CIsGpu)
    throw new Error("C must be a GpuMatrix when A is a GpuMatrix.");
  if (CIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when C is a GpuMatrix.");
  if (n < 0 || k < 0) throw new Error("n and k must be non-negative.");
  if (lda <= 0 || ldc <= 0)
    throw new Error("lda and ldc must be positive.");
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
    throw new Error(`lda must be >= ${effLayoutA === "column-major" ? "rows" : "cols"} of A as stored.`);
  if (AIsGpu) {
    if (lda !== A.lda) throw new Error("lda must match A.lda when A is a GpuMatrix.");
    const [aLogRows, aLogCols] = trans === "no-transpose" ? [n, k] : [k, n];
    if (A.rows < aLogRows || A.cols < aLogCols)
      throw new Error("A is too small for the given n, k, and trans.");
  } else if (A.length < (aOuter - 1) * lda + aInner) {
    throw new Error("A does not have enough elements for the given dimensions and lda.");
  }

  // C: always n x n symmetric — layout only affects storage order, not size.
  if (ldc < n) throw new Error("ldc must be >= n.");
  if (CIsGpu) {
    if (ldc !== C.lda) throw new Error("ldc must match C.lda when C is a GpuMatrix.");
    if (C.rows < n || C.cols < n) throw new Error("C is too small for the given n.");
  } else if (C.length < (n - 1) * ldc + n) {
    throw new Error("C does not have enough elements for the given dimensions and ldc.");
  }

  // Column-major A reinterpreted row-major is A^T — flip trans, same trick sgemm/sgemmtr use.
  let transA = trans;
  if (effLayoutA === "column-major")
    transA = transA === "no-transpose" ? "transpose" : "no-transpose";
  // op(B) := op(A)^T (B is A itself) — opposite of transA.
  let transB = transA === "no-transpose" ? "transpose" : "no-transpose";

  // Column-major C: same swap trick sgemm/sgemmtr use, simplified since A === B and m=n.
  let uploEff = uplo;
  if (effLayoutC === "column-major") {
    [transA, transB] = [
      transB === "no-transpose" ? "transpose" : "no-transpose",
      transA === "no-transpose" ? "transpose" : "no-transpose",
    ];
    uploEff = uploEff === "lower" ? "upper" : "lower";
  }

  // Shape-based auto-select — see sgemmtr_small.wgsl/sgemmtr_large.wgsl. m=n=n here (square C).
  const largeWgX = Math.ceil(n / BN_LARGE);
  const largeWgY = Math.ceil(n / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;

  const pipeline = await getPipeline(device, useLargeTile ? "sgemmtr_large" : "sgemmtr_small");

  const ABuffer = AIsGpu ? A._buf : uploadBuffer(device, A, "ssyrk-A", false);
  const CBuffer = CIsGpu ? C._buf : uploadBuffer(device, C, "ssyrk-C", true);
  // B := A, but as a genuinely separate buffer — re-uploaded for Float32Array,
  // GPU-copied (see below) for GpuMatrix, since the caller owns ABuffer.
  const BBuffer = AIsGpu
    ? createStorageBuffer(device, ABuffer.size, "ssyrk-B", GPUBufferUsage.COPY_DST)
    : uploadBuffer(device, A, "ssyrk-B", false);
  const paramsBuffer = createParamsBuffer(device,
    [
      { value: n,   type: "u32" }, // gemmtr's m
      { value: n,   type: "u32" }, // gemmtr's n
      { value: k,   type: "u32" },
      { value: alpha, type: "f32" },
      { value: beta,  type: "f32" },
      { value: lda, type: "u32" }, // gemmtr's lda
      { value: lda, type: "u32" }, // gemmtr's ldb — B := A, same lda
      { value: ldc, type: "u32" },
      { value: transA === "transpose" ? 1 : 0, type: "u32" },
      { value: transB === "transpose" ? 1 : 0, type: "u32" },
      { value: uploEff === "upper" ? 1 : 0, type: "u32" },
    ],
    "ssyrk-params",
  );

  try {
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      ABuffer,
      BBuffer,
      CBuffer,
      paramsBuffer,
    ]);

    const wgCount = useLargeTile
      ? {
        x: requireWorkgroupCount(device, largeWgX, "ssyrk", "x"),
        y: requireWorkgroupCount(device, largeWgY, "ssyrk", "y"),
      }
      : {
        x: requireWorkgroupCount(device, Math.ceil(n / BN_SMALL), "ssyrk", "x"),
        y: requireWorkgroupCount(device, Math.ceil(n / BM_SMALL), "ssyrk", "y"),
      };
    // Manual encoder (not runComputePass) so the A->B duplicate copy lands
    // on the same command encoder, strictly before the compute pass reads B.
    const { commandEncoder, querySet, passDescriptor } = beginTimedEncoder(device);
    if (AIsGpu) commandEncoder.copyBufferToBuffer(ABuffer, 0, BBuffer, 0, ABuffer.size);
    encodePass(commandEncoder, pipeline, bindGroup, wgCount, passDescriptor);
    const ts = resolveTimestamp(device, commandEncoder, querySet);
    const readBuffer = CIsGpu ? null : stageReadback(device, commandEncoder, CBuffer);

    submit(device, commandEncoder);

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
    destroyBuffers(BBuffer); // always our own buffer, never the caller's
    if (!CIsGpu) destroyBuffers(CBuffer);
    destroyBuffers(paramsBuffer);
  }
}
