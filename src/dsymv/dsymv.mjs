import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePasses, submit } from "../util/compute.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { WGS, SSYMV_TILE } from "../util/constants.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

const TILE_KERNEL_MIN_N = 256;

// dsymv: y := alpha * A * x + beta * y, double-double (Dekker) f64 emulation
// of ssymv — A, x, y, alpha, and beta are each split into an f32 (hi, lo)
// pair; WGSL has no f64 type.
export async function dsymv(
  device,
  uplo,
  n,
  alpha,
  A,
  lda,
  x,
  incx,
  beta,
  y,
  incy,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;

  requireGpuDevice(device);
  requireSameDevice(device, "dsymv", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
  if (typeof alpha !== "number") throw new Error("alpha must be a number.");
  if (Number.isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (!Number.isFinite(alpha)) throw new Error("alpha must be finite.");
  if (typeof beta !== "number") throw new Error("beta must be a number.");
  if (Number.isNaN(beta)) throw new Error("beta must not be NaN.");
  if (!Number.isFinite(beta)) throw new Error("beta must be finite.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && !(A instanceof Float64Array))
    throw new Error("A must be a Float64Array or GpuMatrix.");
  if (AIsGpu && A.dtype !== Float64Array)
    throw new Error("A must be a Float64Array-backed GpuMatrix.");
  if (!xIsGpu && !(x instanceof Float64Array))
    throw new Error("x must be a Float64Array or GpuVector.");
  if (!yIsGpu && !(y instanceof Float64Array))
    throw new Error("y must be a Float64Array or GpuVector.");
  if (xIsGpu && x.dtype !== Float64Array)
    throw new Error("x must be a Float64Array-backed GpuVector.");
  if (yIsGpu && y.dtype !== Float64Array)
    throw new Error("y must be a Float64Array-backed GpuVector.");
  if (xIsGpu !== yIsGpu)
    throw new Error(
      "x and y must be the same type (both Float64Array or both GpuVector).",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (AIsGpu && yIsGpu && A._buf === y._buf)
    throw new Error("A and y must not reference the same GPU buffer.");
  if (AIsGpu && lda !== A.lda)
    throw new Error("lda must match A.lda when A is a GpuMatrix.");
  if (AIsGpu && (A.rows < n || A.cols < n))
    throw new Error("A is too small for the given n.");
  if (n < 0) throw new Error("n must be non-negative.");
  if (n === 0) return yIsGpu ? {} : { y };

  if (!AIsGpu && A.length < (n - 1) * lda + n)
    throw new Error("A does not have enough elements for the given n and lda.");
  if (x.length < (n - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given n and incx.",
    );
  if (y.length < (n - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given n and incy.",
    );

  // GpuMatrix's own layout wins over the argument; A is symmetric, so column-major A reinterpreted row-major just flips which triangle is stored — flip uplo to match.
  const effLayout = AIsGpu ? A.layout : layout;
  const isLower =
    effLayout === "column-major" ? uplo === "upper" : uplo === "lower";

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  // From TILE_KERNEL_MIN_N up, two passes: tiled partial sums over the
  // stored triangle, then a reduce that applies alpha/beta — see
  // dsymv_tile.wgsl. Below it the per-row kernel (dsymv.wgsl) wins: n
  // workgroups each with an n/64-term chain plus a tree reduction, against
  // the tile kernel's fixed ~50 protected-op barriers per tile and a second
  // pass (measured on a GTX 1650: n=128 0.0107 vs 0.013 ms; n=256 0.033 vs
  // 0.026 ms).
  const useTiles = n >= TILE_KERNEL_MIN_N;
  const pipeline = useTiles
    ? await getPipeline(device, [...f64Deps, "dsymv_tile"], "dsymv_tile_main")
    : await getPipeline(device, [...f64Deps, "dsymv"], "dsymv_main");
  const reducePipeline = useTiles
    ? await getPipeline(
        device,
        [...f64Deps, "reduce_partials_f64"],
        "reduce_partials_f64",
      )
    : null;
  const numBlocks = Math.ceil(n / SSYMV_TILE);

  const { hi: alphaHi, lo: alphaLo } = splitDoubleDouble(
    new Float64Array([alpha]),
  );
  const { hi: betaHi, lo: betaLo } = splitDoubleDouble(
    new Float64Array([beta]),
  );

  let AHiBuffer = null;
  let ALoBuffer = null;
  let xHiBuffer = null;
  let xLoBuffer = null;
  let yHiBuffer = null;
  let yLoBuffer = null;
  let paramsBuffer = null;
  let partialHiBuffer = null;
  let partialLoBuffer = null;
  let reduceParams = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dsymv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dsymv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dsymv-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dsymv-xLo", false);
    }
    if (yIsGpu) {
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const ySplit = splitDoubleDouble(y);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dsymv-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dsymv-yLo", true);
    }
    let passes;
    if (!useTiles) {
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: alphaHi[0], type: "f32" },
          { value: alphaLo[0], type: "f32" },
          { value: betaHi[0], type: "f32" },
          { value: betaLo[0], type: "f32" },
          { value: incx, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
        ],
        "dsymv-params",
      );
      // One workgroup per row of A (n is small here, well under the limit).
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            yHiBuffer,
            yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: n,
        },
      ];
    } else {
      partialHiBuffer = createStorageBuffer(
        device,
        numBlocks * n * 4,
        "dsymv-partialsHi",
      );
      partialLoBuffer = createStorageBuffer(
        device,
        numBlocks * n * 4,
        "dsymv-partialsLo",
      );
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: numBlocks, type: "u32" },
          { value: incx, type: "u32" },
        ],
        "dsymv-tile-params",
      );
      reduceParams = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: numBlocks, type: "u32" },
          { value: incy, type: "u32" },
          { value: alphaHi[0], type: "f32" },
          { value: alphaLo[0], type: "f32" },
          { value: betaHi[0], type: "f32" },
          { value: betaLo[0], type: "f32" },
        ],
        "dsymv-reduce-params",
      );

      // One workgroup per stored-triangle tile, linear index spread over 2D.
      const numTiles = (numBlocks * (numBlocks + 1)) / 2;
      const maxWg = device.limits.maxComputeWorkgroupsPerDimension;
      const tilesX = Math.min(numTiles, maxWg);
      const tilesY = requireWorkgroupCount(
        device,
        Math.ceil(numTiles / tilesX),
        "dsymv",
        "y",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            partialHiBuffer,
            partialLoBuffer,
            paramsBuffer,
          ]),
          workgroups: { x: tilesX, y: tilesY },
        },
        {
          pipeline: reducePipeline,
          bindGroup: createBindGroup(
            device,
            reducePipeline.getBindGroupLayout(0),
            [
              partialHiBuffer,
              partialLoBuffer,
              yHiBuffer,
              yLoBuffer,
              reduceParams,
            ],
          ),
          workgroups: Math.min(Math.ceil(n / WGS), maxWg),
        },
      ];
    }
    const { commandEncoder, ts } = runComputePasses(device, passes);
    readHiBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yHiBuffer);
    readLoBuffer = yIsGpu
      ? null
      : stageReadback(device, commandEncoder, yLoBuffer);

    submit(device, commandEncoder);

    const gpuTimeMs = await extractTimestamp(ts);

    if (yIsGpu) {
      if (gpuTimeMs !== undefined) return { gpuTimeMs };
      return {};
    }

    const hi = await extractResult(readHiBuffer, Float32Array);
    readHiBuffer = null;
    const lo = await extractResult(readLoBuffer, Float32Array);
    readLoBuffer = null;
    const result = mergeDoubleDouble(hi, lo);
    if (gpuTimeMs !== undefined) return { y: result, gpuTimeMs };
    return { y: result };
  } finally {
    if (!AIsGpu && AHiBuffer) destroyBuffers(AHiBuffer);
    if (!AIsGpu && ALoBuffer) destroyBuffers(ALoBuffer);
    if (!xIsGpu && xHiBuffer) destroyBuffers(xHiBuffer);
    if (!xIsGpu && xLoBuffer) destroyBuffers(xLoBuffer);
    if (!yIsGpu && yHiBuffer) destroyBuffers(yHiBuffer);
    if (!yIsGpu && yLoBuffer) destroyBuffers(yLoBuffer);
    if (paramsBuffer) destroyBuffers(paramsBuffer);
    if (partialHiBuffer) destroyBuffers(partialHiBuffer);
    if (partialLoBuffer) destroyBuffers(partialLoBuffer);
    if (reduceParams) destroyBuffers(reduceParams);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
