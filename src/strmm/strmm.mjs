import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

const BM_SMALL = 32, BN_SMALL = 32; // sgemm_small.wgsl's block tile
const BM_LARGE = 64, BN_LARGE = 64; // sgemm_large.wgsl's block tile
const LARGE_TILE_WORKGROUP_THRESHOLD = 36; // same threshold sgemm/sgemmtr/ssyrk/ssymm use
const TRI_WG = 8; // triangularize.wgsl's @workgroup_size(8, 8)

// strmm: B := alpha*op(A)*B (side='left') or alpha*B*op(A) (side='right'), A
// triangular. Triangularize then sgemm, one command encoder. B is both
// input and output, so gemm writes to a fresh buffer (no aliasing race),
// copied back into B (GpuMatrix) or read back directly (Float32Array).
export async function strmm(
  device, side, uplo, transA, diag, m, n, alpha, A, lda, B, ldb, layout = "row-major",
) {
  const AIsGpu = A instanceof GpuMatrix;
  const BIsGpu = B instanceof GpuMatrix;
  const isUnit = diag === "unit";

  if (!(device instanceof GPUDevice))
    throw new Error("device must be a GPUDevice.");
  if (side !== "left" && side !== "right")
    throw new Error("side must be 'left' or 'right'.");
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (transA !== "no-transpose" && transA !== "transpose")
    throw new Error("transA must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (typeof alpha !== "number")
    throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (!Number.isInteger(m) || !Number.isInteger(n) || !Number.isInteger(lda) || !Number.isInteger(ldb))
    throw new Error("m, n, lda, and ldb must be integers.");
  if (!AIsGpu && !(A instanceof Float32Array))
    throw new Error("A must be a Float32Array or GpuMatrix.");
  if (!BIsGpu && !(B instanceof Float32Array))
    throw new Error("B must be a Float32Array or GpuMatrix.");
  if (AIsGpu !== BIsGpu)
    throw new Error("A and B must both be GpuMatrix or both be Float32Array.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return BIsGpu ? {} : { B };

  const effLayoutA = AIsGpu ? A.layout : layout;
  const effLayoutB = BIsGpu ? B.layout : layout;

  // A: triangular, order = m (side='left') or n (side='right').
  const aOrder = side === "left" ? m : n;
  if (lda < aOrder) throw new Error("lda must be >= " + (side === "left" ? "m" : "n") + ".");
  if (AIsGpu) {
    if (lda !== A.lda) throw new Error("lda must match A.lda when A is a GpuMatrix.");
    if (A.rows < aOrder || A.cols < aOrder) throw new Error("A is too small for the given m/n and side.");
  } else if (A.length < (aOrder - 1) * lda + aOrder) {
    throw new Error("A does not have enough elements for the given dimensions and lda.");
  }

  // B: always m x n, overwritten in place with the same ldb.
  const bOuter = effLayoutB === "column-major" ? n : m;
  const bInner = effLayoutB === "column-major" ? m : n;
  if (ldb < bInner)
    throw new Error(`ldb must be >= ${effLayoutB === "column-major" ? "rows" : "cols"} of B as stored.`);
  if (BIsGpu) {
    if (ldb !== B.lda) throw new Error("ldb must match B.lda when B is a GpuMatrix.");
    if (B.rows < m || B.cols < n) throw new Error("B is too small for the given m and n.");
  } else if (B.length < (bOuter - 1) * ldb + bInner) {
    throw new Error("B does not have enough elements for the given dimensions and ldb.");
  }

  // A isn't symmetric: column-major = genuine transpose, so flip transA;
  // transposing also swaps which triangle looks stored, so flip uplo too.
  const uploEffA = effLayoutA === "column-major" ? (uplo === "lower" ? "upper" : "lower") : uplo;
  const transEffA = effLayoutA === "column-major" ? (transA === "no-transpose" ? "transpose" : "no-transpose") : transA;

  const transB = effLayoutB === "column-major" ? "transpose" : "no-transpose";
  const transDense = "no-transpose"; // Adense already embodies op(A)

  // X*Y (X=Adense,Y=B for side='left', swapped for 'right'). Column-major
  // output: compute (B_out)^T instead — sgemm's own trick, same as ssymm's.
  let mg = m, ng = n;
  const kg = aOrder;
  let transX = side === "left" ? transDense : transB;
  let transY = side === "left" ? transB : transDense;
  const flip = (t) => (t === "no-transpose" ? "transpose" : "no-transpose");
  let swapXY = side === "right";
  if (effLayoutB === "column-major") {
    [transX, transY] = [flip(transY), flip(transX)];
    swapXY = !swapXY;
    [mg, ng] = [ng, mg];
  }

  const ldDense = aOrder; // Adense is tightly packed, row-major
  const largeWgX = Math.ceil(ng / BN_LARGE);
  const largeWgY = Math.ceil(mg / BM_LARGE);
  const useLargeTile = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
  const gemmPipeline = await getPipeline(device, useLargeTile ? "sgemm_large" : "sgemm_small");
  const triPipeline = await getPipeline(device, "triangularize");
  const gemmWgCount = useLargeTile
    ? {
      x: Math.min(largeWgX, device.limits.maxComputeWorkgroupsPerDimension),
      y: Math.min(largeWgY, device.limits.maxComputeWorkgroupsPerDimension),
    }
    : {
      x: Math.min(Math.ceil(ng / BN_SMALL), device.limits.maxComputeWorkgroupsPerDimension),
      y: Math.min(Math.ceil(mg / BM_SMALL), device.limits.maxComputeWorkgroupsPerDimension),
    };

  const ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strmm-A", false);
  // readback=true (COPY_SRC): BBuffer is also the source that seeds outBuffer.
  const BBuffer = BIsGpu ? B._buf : uploadBuffer(B, "strmm-B", true);
  const AdenseBuffer = createStorageBuffer(aOrder * ldDense * 4, "strmm-Adense");
  // COPY_DST: seeded from B's own content before gemm runs, so stride-padding
  // gaps (never written by gemm's tight m x n loop) keep B's original bytes
  // instead of reading back as zero. COPY_SRC: read back / adopted by B after.
  const outBuffer = createStorageBuffer(
    bOuter * ldb * 4, "strmm-out", GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
  );
  let triParams = null, gemmParams = null;
  let outBufferAdopted = false; // true once B._buf is repointed at outBuffer

  try {
    triParams = createParamsBuffer(
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: ldDense, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
        { value: transEffA === "transpose" ? 1 : 0, type: "u32" },
        { value: isUnit ? 1 : 0, type: "u32" },
      ],
      "strmm-tri-params",
    );
    const triBindGroup = createBindGroup(triPipeline.getBindGroupLayout(0), [ABuffer, AdenseBuffer, triParams]);

    // X/Y buffers and their own ld, matching swapXY above.
    const XBuffer = swapXY ? BBuffer : AdenseBuffer;
    const ldX = swapXY ? ldb : ldDense;
    const YBuffer = swapXY ? AdenseBuffer : BBuffer;
    const ldY = swapXY ? ldDense : ldb;

    gemmParams = createParamsBuffer(
      [
        { value: mg,  type: "u32" },
        { value: ng,  type: "u32" },
        { value: kg,  type: "u32" },
        { value: alpha, type: "f32" },
        { value: 0.0,   type: "f32" }, // beta — strmm has no C accumulation term
        { value: ldX, type: "u32" },
        { value: ldY, type: "u32" },
        { value: ldb, type: "u32" },
        { value: transX === "transpose" ? 1 : 0, type: "u32" },
        { value: transY === "transpose" ? 1 : 0, type: "u32" },
      ],
      "strmm-gemm-params",
    );
    const gemmBindGroup = createBindGroup(gemmPipeline.getBindGroupLayout(0), [XBuffer, YBuffer, outBuffer, gemmParams]);

    const { commandEncoder, querySet } = beginTimedEncoder();
    // Seed outBuffer with B's own bytes first, so gemm's tight m x n write
    // leaves stride-padding gaps holding B's original content, not zero.
    // BBuffer may be larger than outBuffer (e.g. a validation-test baseline
    // over-provisioned for a bigger ldb it might later be substituted with).
    commandEncoder.copyBufferToBuffer(BBuffer, 0, outBuffer, 0, Math.min(BBuffer.size, outBuffer.size));
    const triDesc = querySet ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } } : undefined;
    const gemmDesc = querySet ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } } : undefined;
    encodePass(commandEncoder, triPipeline, triBindGroup, { x: Math.ceil(aOrder / TRI_WG), y: Math.ceil(aOrder / TRI_WG) }, triDesc);
    encodePass(commandEncoder, gemmPipeline, gemmBindGroup, gemmWgCount, gemmDesc);

    const ts = resolveTimestamp(commandEncoder, querySet);
    const readBuffer = BIsGpu ? null : stageReadback(commandEncoder, outBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (BIsGpu) {
      // Adopt outBuffer as B's own backing buffer instead of copying into the
      // old one (B._buf has no COPY_DST usage) — cheaper and avoids needing
      // an extra buffer-usage flag on every GpuMatrix for this one routine.
      destroyBuffers(B._buf);
      B._buf = outBuffer;
      outBufferAdopted = true;
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu) destroyBuffers(ABuffer);
    if (!BIsGpu) destroyBuffers(BBuffer);
    destroyBuffers(AdenseBuffer);
    if (!outBufferAdopted) destroyBuffers(outBuffer);
    if (triParams) destroyBuffers(triParams);
    if (gemmParams) destroyBuffers(gemmParams);
  }
}
