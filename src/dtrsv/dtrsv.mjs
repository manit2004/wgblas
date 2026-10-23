import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { beginTimedEncoder, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { resolveTimestamp, extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { BLOCK_SIZE, STRSV_TILE_ROWS, WGS } from "../util/constants.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// Blocked triangular solve over 64-row diagonal blocks, double-double
// (Dekker) f64 emulation of strsv — A, Ainv, and x are each split into an
// f32 (hi, lo) pair; WGSL has no f64 type. Same structure as strsv: up to
// SUBSTITUTION_MAX_BLOCKS blocks, each block solved by substitution in place
// on x (dtrsv_small.wgsl), then an update-only dtrsv_step — one block is a
// single dispatch. More blocks: every block's inverse up front (one parallel
// dtrsv_small dispatch in invert mode), then one fused solve-and-update
// dispatch per block (dtrsv_step.wgsl), then a copy of the solution into x.

// One shared buffer holds all blocks' params (offset blockIndex*stride) instead of one buffer per block — avoids the O(numBlocks) createBuffer/writeBuffer calls that dominated CPU time.
function packBlockParams(numBlocks, stride, fieldsPerBlock) {
  const data = new ArrayBuffer(numBlocks * stride);
  const view = new DataView(data);
  for (let blockIndex = 0; blockIndex < numBlocks; blockIndex++) {
    const fields = fieldsPerBlock(blockIndex);
    const base = blockIndex * stride;
    fields.forEach((value, i) => view.setUint32(base + i * 4, value, true));
  }
  return data;
}

// dtrsv_step's Params: nine u32 fields, padded to a 16-byte multiple.
const STEP_PARAMS_BYTES = 48;

// Up to this many blocks, solving each block by substitution on the critical
// path beats inverting every block up front and applying the inverses.
const SUBSTITUTION_MAX_BLOCKS = 2;

function createSharedParamsBuffer(device, data, label) {
  const buffer = device.createBuffer({
    label,
    size: data.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
}

export async function dtrsv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";

  requireGpuDevice(device);
  requireSameDevice(device, "dtrsv", { A, x });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(lda))
    throw new Error("n, incx, and lda must be integers.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x is a GpuVector.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x must be a GpuVector when A is a GpuMatrix.");
  if (AIsGpu && xIsGpu && A._buf === x._buf)
    throw new Error("A and x must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return xIsGpu ? {} : { x };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );

  // GpuMatrix's own layout wins over the argument; column-major A reinterpreted row-major is A^T, so flip both uplo and trans to reproduce the requested system.
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";

  const f64Deps = [
    "f64/dekker",
    "f64/utils/add",
    "f64/utils/multiply",
    "f64/utils/divide",
  ];
  const smallPipeline = await getPipeline(
    device,
    [...f64Deps, "dtrsv_small"],
    "dtrsv_small_main",
  );
  const stepPipeline = await getPipeline(
    device,
    [...f64Deps, "dtrsv_step"],
    "dtrsv_step_main",
  );

  // Same forward/backward pairing the shaders use.
  const forward = isNoTrans === isLower;
  const blockStarts = [];
  for (let s = 0; s < n; s += BLOCK_SIZE) blockStarts.push(s);
  if (!forward) blockStarts.reverse();
  const numBlocks = blockStarts.length;

  const stride = device.limits.minUniformBufferOffsetAlignment;
  const useSubstitution = numBlocks <= SUBSTITUTION_MAX_BLOCKS;
  const scatterPipeline = useSubstitution
    ? null
    : await getPipeline(device, "scatter_strided");
  // op(A) element (i, j) in the solve frame.
  const aRs = isNoTrans ? lda : 1;
  const aCs = isNoTrans ? 1 : lda;

  // Every block's step params are fixed by its natural index regardless of
  // traversal direction, so the packed buffer is indexed by blockIndex
  // (0..numBlocks-1), not by loop position.
  const stepParamsData = (presolved) =>
    packBlockParams(numBlocks, stride, (blockIndex) => {
      const blockStart = blockIndex * BLOCK_SIZE;
      const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
      // forward: remaining rows are [blockEnd, n); backward: [0, blockStart).
      const rangeStart = forward ? blockEnd : 0;
      const rowCount = forward ? n - blockEnd : blockStart;
      return [
        incx,
        lda,
        isNoTrans ? 0 : 1,
        blockIndex,
        blockStart,
        blockEnd,
        rangeStart,
        rowCount,
        presolved,
      ];
    });

  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let AinvHiBuffer = null;
  let AinvLoBuffer = null;
  let solHiBuffer = null;
  let solLoBuffer = null;
  let stepParamsBuffer = null;
  let invertParams = null;
  let scatterParams = null;
  const solveParamsList = [];
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dtrsv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dtrsv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dtrsv-xHi", true);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dtrsv-xLo", true);
    }
    // Contiguous solution: the substitution path's packed copy for the
    // presolved update, or the inverse path's, written block by block and
    // copied into x at the end — see dtrsv_step.wgsl for why it can't go
    // straight into x.
    solHiBuffer = createStorageBuffer(device, n * 4, "dtrsv-solHi");
    solLoBuffer = createStorageBuffer(device, n * 4, "dtrsv-solLo");

    // Every dispatch goes in ONE compute pass: each dispatch is still its own
    // synchronization scope (WebGPU orders them and makes each one's storage
    // writes visible to the next), but the solve is a long chain of small
    // dependent dispatches, and a separate pass per dispatch added a fixed
    // per-pass cost that dominated it.
    const { commandEncoder, querySet, passDescriptor } =
      beginTimedEncoder(device);
    const pass = commandEncoder.beginComputePass(passDescriptor);
    const stepBindGroup = (AinvHi, AinvLo, blockIndex) =>
      createBindGroup(device, stepPipeline.getBindGroupLayout(0), [
        AHiBuffer,
        ALoBuffer,
        AinvHi,
        AinvLo,
        xHiBuffer,
        xLoBuffer,
        solHiBuffer,
        solLoBuffer,
        {
          buffer: stepParamsBuffer,
          offset: blockIndex * stride,
          size: STEP_PARAMS_BYTES,
        },
      ]);

    if (useSubstitution) {
      // Few blocks: solve each diagonal block by substitution, in place on x
      // (dtrsv_small.wgsl, which also leaves a packed copy in sol), then a
      // presolved dtrsv_step does just the trailing update. No inverse, no
      // final scatter; one block is a single dispatch.
      if (numBlocks > 1) {
        stepParamsBuffer = createSharedParamsBuffer(
          device,
          stepParamsData(1),
          "dtrsv-step-params",
        );
      }
      for (const blockStart of blockStarts) {
        const blockIndex = blockStart / BLOCK_SIZE;
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
        const blockLen = blockEnd - blockStart;
        const rowCount = forward ? n - blockEnd : blockStart;
        const solveParams = createParamsBuffer(
          device,
          [
            { value: blockLen, type: "u32" },
            { value: blockStart * (aRs + aCs), type: "u32" }, // A view
            { value: aRs, type: "u32" },
            { value: aCs, type: "u32" },
            { value: blockStart * incx, type: "u32" }, // x view
            { value: incx, type: "u32" },
            { value: forward ? 0 : 1, type: "u32" },
            { value: isUnit ? 1 : 0, type: "u32" },
            { value: 0, type: "u32" }, // solve, not invert
            { value: rowCount > 0 ? 1 : 0, type: "u32" }, // packed copy for the update
          ],
          "dtrsv-solve-params",
        );
        solveParamsList.push(solveParams);
        // Block starts are multiples of 64 floats, so the offsets meet the
        // 256-byte storage-binding alignment.
        const solView = (buffer) => ({
          buffer,
          offset: blockStart * 4,
          size: blockLen * 4,
        });
        pass.setPipeline(smallPipeline);
        pass.setBindGroup(
          0,
          createBindGroup(device, smallPipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            solView(solHiBuffer),
            solView(solLoBuffer),
            solveParams,
          ]),
        );
        pass.dispatchWorkgroups(1);
        if (rowCount === 0) continue;
        pass.setPipeline(stepPipeline);
        // Ainv slots get A, unread when presolved.
        pass.setBindGroup(0, stepBindGroup(AHiBuffer, ALoBuffer, blockIndex));
        pass.dispatchWorkgroups(
          requireWorkgroupCount(
            device,
            Math.ceil(rowCount / STRSV_TILE_ROWS),
            "dtrsv",
          ),
        );
      }
    } else {
      // One BLOCK_SIZE x BLOCK_SIZE dense region per block (column-major),
      // even though only a triangular half is ever nonzero — see
      // dtrsv_small.wgsl's invert mode.
      AinvHiBuffer = createStorageBuffer(
        device,
        numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
        "dtrsv-AinvHi",
      );
      AinvLoBuffer = createStorageBuffer(
        device,
        numBlocks * BLOCK_SIZE * BLOCK_SIZE * 4,
        "dtrsv-AinvLo",
      );
      stepParamsBuffer = createSharedParamsBuffer(
        device,
        stepParamsData(0),
        "dtrsv-step-params",
      );
      invertParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: 0, type: "u32" },
          { value: aRs, type: "u32" },
          { value: aCs, type: "u32" },
          { value: 0, type: "u32" },
          { value: 1, type: "u32" },
          { value: forward ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: 1, type: "u32" }, // invert
          { value: 0, type: "u32" },
        ],
        "dtrsv-invert-params",
      );
      scatterParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: incx, type: "u32" },
        ],
        "dtrsv-scatter-params",
      );

      // Every block's inverse, fully parallel: four columns per workgroup.
      pass.setPipeline(smallPipeline);
      pass.setBindGroup(
        0,
        createBindGroup(device, smallPipeline.getBindGroupLayout(0), [
          AHiBuffer,
          ALoBuffer,
          AinvHiBuffer,
          AinvLoBuffer,
          solHiBuffer, // unused when inverting
          solLoBuffer,
          invertParams,
        ]),
      );
      pass.dispatchWorkgroups(
        BLOCK_SIZE / 4,
        requireWorkgroupCount(device, numBlocks, "dtrsv", "y"),
      );

      // One fused solve-and-update dispatch per block, in dependency order.
      pass.setPipeline(stepPipeline);
      for (const blockStart of blockStarts) {
        const blockIndex = blockStart / BLOCK_SIZE;
        const blockEnd = Math.min(blockStart + BLOCK_SIZE, n);
        const rowCount = forward ? n - blockEnd : blockStart;
        pass.setBindGroup(
          0,
          stepBindGroup(AinvHiBuffer, AinvLoBuffer, blockIndex),
        );
        pass.dispatchWorkgroups(
          requireWorkgroupCount(
            device,
            Math.max(1, Math.ceil(rowCount / STRSV_TILE_ROWS)),
            "dtrsv",
          ),
        );
      }

      // Copy the solution into x, both halves (leaving stride gaps untouched).
      pass.setPipeline(scatterPipeline);
      for (const [src, dst] of [
        [solHiBuffer, xHiBuffer],
        [solLoBuffer, xLoBuffer],
      ]) {
        pass.setBindGroup(
          0,
          createBindGroup(device, scatterPipeline.getBindGroupLayout(0), [
            src,
            dst,
            scatterParams,
          ]),
        );
        pass.dispatchWorkgroups(
          Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        );
      }
    }
    pass.end();

    const ts = resolveTimestamp(device, commandEncoder, querySet);
    readHiBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xHiBuffer);
    readLoBuffer = xIsGpu
      ? null
      : stageReadback(device, commandEncoder, xLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (xIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { x: result, gpuTimeMs };
    return { x: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (AinvHiBuffer) destroyBuffers(AinvHiBuffer);
    if (AinvLoBuffer) destroyBuffers(AinvLoBuffer);
    if (solHiBuffer) destroyBuffers(solHiBuffer);
    if (solLoBuffer) destroyBuffers(solLoBuffer);
    if (stepParamsBuffer) destroyBuffers(stepParamsBuffer);
    if (invertParams) destroyBuffers(invertParams);
    if (scatterParams) destroyBuffers(scatterParams);
    destroyBuffers(solveParamsList);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
