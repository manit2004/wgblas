import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
  vec4ViewBinding,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, encodePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { calcWorkgroups, requireWorkgroups, requireWorkgroupCount } from "../util/workgroup.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

const BLOCK_SIZE = 64; // must match strsv_invert_block.wgsl's own constant
const BM_SMALL = 32, BN_SMALL = 32; // sgemm_small.wgsl's block tile
const BM_LARGE = 64, BN_LARGE = 64; // sgemm_large.wgsl's block tile
const LARGE_TILE_WORKGROUP_THRESHOLD = 36; // same threshold sgemm/ssymm/strmm use

// strsm: B := alpha*op(A)^-1*B (side='left') or alpha*B*op(A)^-1 (side='right'),
// A triangular. Blocked substitution (strsv's own technique, generalized to
// a matrix RHS): strsv_invert_block + sgemm, unchanged; every per-block B/A
// access goes through block_transfer.wgsl (see that shader for why).
export async function strsm(
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

  const otherLen = side === "left" ? n : m;
  const blockIsRow = side === "left";

  // Forward iff op(A) is lower (side='left') — side='right' flips this,
  // since it solves via columns instead of rows.
  const opIsLower = (transEffA === "no-transpose") === (uploEffA === "lower");
  const forward = side === "left" ? opIsLower : !opIsLower;

  const blockStarts = [];
  for (let s = 0; s < aOrder; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;

  const invertPipeline = await getPipeline(device, "strsv_invert_block");
  const transferPipeline = await getPipeline(device, "block_transfer");
  const scalarPipeline = await getPipeline(device, "sscal");

  // Null-init here and allocate inside the try below, so a throw partway
  // through the sequence still reaches finally with every handle visible
  // (strsv.mjs is the reference for this pattern).
  let ABuffer = null;
  let BBuffer = null;
  let AinvBuffer = null;

  const paramsBuffers = [];
  const scratchBuffers = [];
  function scratch(size, label) {
    const buf = createStorageBuffer(size, label);
    scratchBuffers.push(buf);
    return buf;
  }
  function params(entries, label) {
    const buf = createParamsBuffer(entries, label);
    paramsBuffers.push(buf);
    return buf;
  }

  // Minimal valid length for B's own buffer (matches its own validation
  // above) — NOT bOuter*ldb, which can exceed a Float32Array-path buffer's
  // actual allocation (only guaranteed padded up to GpuMatrix's own size).
  const bScaleLen = (bOuter - 1) * ldb + bInner;

  try {
    ABuffer = AIsGpu ? A._buf : uploadBuffer(A, "strsm-A", false);
    BBuffer = BIsGpu ? B._buf : uploadBuffer(B, "strsm-B", true);
    AinvBuffer = createStorageBuffer(numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4, "strsm-Ainv");

    // Pre-scale B by alpha once (reuses sscal, so no per-block alpha handling).
    let preScaleBindGroup = null;
    if (alpha !== 1.0) {
      const scaleParams = params(
        [
          { value: bScaleLen, type: "u32" },
          { value: alpha, type: "f32" },
          { value: 1, type: "u32" },
        ],
        "strsm-scale-params",
      );
      preScaleBindGroup = createBindGroup(scalarPipeline.getBindGroupLayout(0), [BBuffer, scaleParams]);
    }

    // Every diagonal block's inverse, fully parallel, one dispatch, unchanged.
    const invertParams = params(
      [
        { value: aOrder, type: "u32" },
        { value: lda, type: "u32" },
        { value: transEffA === "transpose" ? 1 : 0, type: "u32" },
        { value: uploEffA === "upper" ? 1 : 0, type: "u32" },
        { value: isUnit ? 1 : 0, type: "u32" },
      ],
      "strsm-invert-params",
    );
    const invertBindGroup = createBindGroup(invertPipeline.getBindGroupLayout(0), [ABuffer, AinvBuffer, invertParams]);

    // Reusable scratch buffers, sized for the worst case, bound at offset 0.
    const Bblock = scratch(BLOCK_SIZE * otherLen * 4, "strsm-Bblock");
    const Xblock = scratch(BLOCK_SIZE * otherLen * 4, "strsm-Xblock");
    const Aoff = scratch(aOrder * BLOCK_SIZE * 4, "strsm-Aoff");
    const delta = scratch(aOrder * otherLen * 4, "strsm-delta");

    const { commandEncoder, querySet } = beginTimedEncoder();

    if (alpha === 0) {
      // BLAS: alpha=0 means A is not referenced — skip straight to B:=0.
      const zeroDesc = querySet ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 } } : undefined;
      encodePass(commandEncoder, scalarPipeline, preScaleBindGroup, calcWorkgroups(bScaleLen), zeroDesc);
    } else {
      if (preScaleBindGroup) {
        encodePass(commandEncoder, scalarPipeline, preScaleBindGroup, calcWorkgroups(bScaleLen));
      }
      const invertDesc = querySet ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0 } } : undefined;
      encodePass(commandEncoder, invertPipeline, invertBindGroup, { x: BLOCK_SIZE, y: numBlocks }, invertDesc);

      for (let bi = 0; bi < blockStarts.length; bi++) {
      const blockStart = blockStarts[bi];
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, aOrder);
      const blockLen = blockEnd - blockStart;
      const blockIndex = blockStart / BLOCK_SIZE;
      const isLastPass = bi === blockStarts.length - 1;

      // 1) gather B's current block into a tight scratch buffer.
      const gatherBParams = params(
        [
          { value: blockStart, type: "u32" },
          { value: blockLen, type: "u32" },
          { value: 0, type: "u32" },
          { value: otherLen, type: "u32" },
          { value: ldb, type: "u32" },
          { value: effLayoutB === "column-major" ? 1 : 0, type: "u32" },
          { value: blockIsRow ? 1 : 0, type: "u32" },
          { value: 2, type: "u32" }, // gather
        ],
        "strsm-gather-B-params",
      );
      const gatherBBindGroup = createBindGroup(transferPipeline.getBindGroupLayout(0), [Bblock, BBuffer, gatherBParams]);
      encodePass(commandEncoder, transferPipeline, gatherBBindGroup, requireWorkgroups("strsm", blockLen, otherLen));

      // 2) apply: Xblock := op(Ainv_block) @ Bblock (side='left'), or the
      // transpose-trick equivalent for side='right' (same trick strmm uses).
      {
        const mg = blockLen, ng = otherLen, kg = blockLen;
        const largeWgX = Math.ceil(ng / BN_LARGE), largeWgY = Math.ceil(mg / BM_LARGE);
        const useLarge = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
        const gemmPipeline = await getPipeline(device, useLarge ? "sgemm_large" : "sgemm_small");
        const applyParams = params(
          [
            { value: mg, type: "u32" },
            { value: ng, type: "u32" },
            { value: kg, type: "u32" },
            { value: 1.0, type: "f32" }, // alpha already applied to B up front
            { value: 0.0, type: "f32" }, // beta — fresh output, no accumulation
            { value: BLOCK_SIZE, type: "u32" }, // ldX = Ainv's own dense stride
            { value: otherLen, type: "u32" }, // ldY = Bblock's own tight stride
            { value: otherLen, type: "u32" }, // ldc = Xblock's own tight stride
            { value: side === "right" ? 1 : 0, type: "u32" }, // transX: side='right' needs Ainv^T
            { value: 0, type: "u32" }, // transY: Bblock is always read as-is
          ],
          "strsm-apply-params",
        );
        const ainvBlock = { buffer: AinvBuffer, offset: blockIndex * BLOCK_SIZE * BLOCK_SIZE * 4, size: BLOCK_SIZE * BLOCK_SIZE * 4 };
        const applyBindGroup = createBindGroup(gemmPipeline.getBindGroupLayout(0), [
          ainvBlock,
          vec4ViewBinding(ainvBlock),
          Bblock,
          vec4ViewBinding(Bblock),
          Xblock,
          applyParams,
        ]);
        const wg = useLarge
          ? { x: requireWorkgroupCount(largeWgX, "strsm", "x"), y: requireWorkgroupCount(largeWgY, "strsm", "y") }
          : { x: requireWorkgroupCount(Math.ceil(ng / BN_SMALL), "strsm", "x"), y: requireWorkgroupCount(Math.ceil(mg / BM_SMALL), "strsm", "y") };
        encodePass(commandEncoder, gemmPipeline, applyBindGroup, wg);
      }

      // 3) scatter the solved block back into B.
      const rangeStart = forward ? blockEnd : 0;
      const rangeEnd = forward ? aOrder : blockStart;
      const hasRemaining = rangeStart < rangeEnd;
      const scatterParams = params(
        [
          { value: blockStart, type: "u32" },
          { value: blockLen, type: "u32" },
          { value: 0, type: "u32" },
          { value: otherLen, type: "u32" },
          { value: ldb, type: "u32" },
          { value: effLayoutB === "column-major" ? 1 : 0, type: "u32" },
          { value: blockIsRow ? 1 : 0, type: "u32" },
          { value: 0, type: "u32" }, // overwrite
        ],
        "strsm-scatter-params",
      );
      const scatterBindGroup = createBindGroup(transferPipeline.getBindGroupLayout(0), [Xblock, BBuffer, scatterParams]);
      const scatterDesc = isLastPass && !hasRemaining && querySet ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } } : undefined;
      encodePass(commandEncoder, transferPipeline, scatterBindGroup, requireWorkgroups("strsm", blockLen, otherLen), scatterDesc);

      // 4) trailing update: subtract this block's contribution from B.
      if (!hasRemaining) continue;
      const remCount = rangeEnd - rangeStart;

      const gatherAParams = params(
        [
          { value: rangeStart, type: "u32" },
          { value: remCount, type: "u32" },
          { value: blockStart, type: "u32" },
          { value: blockLen, type: "u32" },
          { value: lda, type: "u32" },
          { value: transEffA === "transpose" ? 1 : 0, type: "u32" },
          { value: blockIsRow ? 1 : 0, type: "u32" },
          { value: 2, type: "u32" }, // gather
        ],
        "strsm-gather-A-params",
      );
      const gatherABindGroup = createBindGroup(transferPipeline.getBindGroupLayout(0), [Aoff, ABuffer, gatherAParams]);
      encodePass(commandEncoder, transferPipeline, gatherABindGroup, requireWorkgroups("strsm", remCount, blockLen));

      {
        const mg = remCount, ng = otherLen, kg = blockLen;
        const largeWgX = Math.ceil(ng / BN_LARGE), largeWgY = Math.ceil(mg / BM_LARGE);
        const useLarge = largeWgX * largeWgY >= LARGE_TILE_WORKGROUP_THRESHOLD;
        const gemmPipeline = await getPipeline(device, useLarge ? "sgemm_large" : "sgemm_small");
        const updateParams = params(
          [
            { value: mg, type: "u32" },
            { value: ng, type: "u32" },
            { value: kg, type: "u32" },
            { value: 1.0, type: "f32" },
            { value: 0.0, type: "f32" },
            { value: blockLen, type: "u32" }, // ldX = Aoff's own tight stride
            { value: otherLen, type: "u32" }, // ldY = Xblock's own tight stride
            { value: otherLen, type: "u32" }, // ldc = delta's own tight stride
            { value: 0, type: "u32" }, // transX: Aoff already read in the right orientation
            { value: 0, type: "u32" }, // transY: Xblock read as-is
          ],
          "strsm-update-params",
        );
        const updateBindGroup = createBindGroup(gemmPipeline.getBindGroupLayout(0), [
          Aoff,
          vec4ViewBinding(Aoff),
          Xblock,
          vec4ViewBinding(Xblock),
          delta,
          updateParams,
        ]);
        const wg = useLarge
          ? { x: requireWorkgroupCount(largeWgX, "strsm", "x"), y: requireWorkgroupCount(largeWgY, "strsm", "y") }
          : { x: requireWorkgroupCount(Math.ceil(ng / BN_SMALL), "strsm", "x"), y: requireWorkgroupCount(Math.ceil(mg / BM_SMALL), "strsm", "y") };
        encodePass(commandEncoder, gemmPipeline, updateBindGroup, wg);
      }

      const scatterSubParams = params(
        [
          { value: rangeStart, type: "u32" },
          { value: remCount, type: "u32" },
          { value: 0, type: "u32" },
          { value: otherLen, type: "u32" },
          { value: ldb, type: "u32" },
          { value: effLayoutB === "column-major" ? 1 : 0, type: "u32" },
          { value: blockIsRow ? 1 : 0, type: "u32" },
          { value: 1, type: "u32" }, // subtract
        ],
        "strsm-scatter-sub-params",
      );
      const scatterSubBindGroup = createBindGroup(transferPipeline.getBindGroupLayout(0), [delta, BBuffer, scatterSubParams]);
      const subDesc = isLastPass && querySet ? { timestampWrites: { querySet, endOfPassWriteIndex: 1 } } : undefined;
      encodePass(commandEncoder, transferPipeline, scatterSubBindGroup, requireWorkgroups("strsm", remCount, otherLen), subDesc);
      }
    }

    const ts = resolveTimestamp(commandEncoder, querySet);
    const readBuffer = BIsGpu ? null : stageReadback(commandEncoder, BBuffer);

    submit(commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (BIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const result = await extractResult(readBuffer, Float32Array);
    if (gpuTimeMs !== undefined) return { B: result, gpuTimeMs };
    return { B: result };
  } finally {
    if (!AIsGpu && ABuffer) destroyBuffers(ABuffer);
    if (!BIsGpu && BBuffer) destroyBuffers(BBuffer);
    if (AinvBuffer) destroyBuffers(AinvBuffer);
    destroyBuffers(scratchBuffers);
    destroyBuffers(paramsBuffers);
  }
}
