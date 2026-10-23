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
import { WGS, SPLITK_CHUNK_ROWS_DD } from "../util/constants.mjs";
import { gatherStridedPass, worthPackingDD } from "../util/strided.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

const COLUMN_KERNEL_MIN_N = 512;

// dtrmv: y := op(A) * x, double-double (Dekker) f64 emulation of strmv — A,
// x, and y are each split into an f32 (hi, lo) pair; WGSL has no f64 type.
export async function dtrmv(
  device,
  uplo,
  trans,
  diag,
  n,
  A,
  lda,
  x,
  incx,
  y,
  incy,
  layout = "row-major",
) {
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;
  const AIsGpu = A instanceof GpuMatrix;
  const isUnit = diag === "unit";

  requireGpuDevice(device);
  requireSameDevice(device, "dtrmv", { A, x, y });
  if (uplo !== "lower" && uplo !== "upper")
    throw new Error("uplo must be 'lower' or 'upper'.");
  if (trans !== "no-transpose" && trans !== "transpose")
    throw new Error("trans must be 'no-transpose' or 'transpose'.");
  if (!isUnit && diag !== "non-unit")
    throw new Error("diag must be 'unit' or 'non-unit'.");
  if (layout !== "row-major" && layout !== "column-major")
    throw new Error("layout must be 'row-major' or 'column-major'.");
  if (
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("n, incx, incy, and lda must be integers.");
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
  if (xIsGpu && x._buf === y._buf)
    throw new Error(
      "x and y must not reference the same GPU buffer when both are GpuVectors.",
    );
  if (xIsGpu && !AIsGpu)
    throw new Error("A must be a GpuMatrix when x and y are GpuVectors.");
  if (AIsGpu && !xIsGpu)
    throw new Error("x and y must be GpuVectors when A is a GpuMatrix.");
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

  // GpuMatrix's own layout wins over the argument; column-major A reinterpreted row-major is A^T, so flip both uplo and trans to reproduce the requested op(A).
  const effLayout = AIsGpu ? A.layout : layout;
  const isColMajor = effLayout === "column-major";
  const isLower = isColMajor ? uplo === "upper" : uplo === "lower";
  const isNoTrans = isColMajor
    ? trans === "transpose"
    : trans === "no-transpose";

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  // Transpose path: one thread per output column (coalesced A reads), with
  // rows split into chunks for parallelism — see dtrmv_t.wgsl. Below
  // COLUMN_KERNEL_MIN_N the row kernel wins: its n workgroups each run only
  // n/64 terms plus a tree reduction, where a column thread runs a serial
  // chain of up to SPLITK_CHUNK_ROWS_DD protected terms (measured on a GTX
  // 1650: n=64 0.008 vs 0.028 ms, even at n=512, 0.31× at n=1024).
  const useColumnKernel = !isNoTrans && n >= COLUMN_KERNEL_MIN_N;
  const numChunks = useColumnKernel ? Math.ceil(n / SPLITK_CHUNK_ROWS_DD) : 1;
  const pipeline = await getPipeline(
    device,
    [...f64Deps, useColumnKernel ? "dtrmv_t" : "dtrmv"],
    useColumnKernel ? "dtrmv_t_main" : "dtrmv_main",
  );
  const reducePipeline =
    numChunks > 1
      ? await getPipeline(
          device,
          [...f64Deps, "reduce_partials_f64"],
          "reduce_partials_f64",
        )
      : null;

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
  let xHiPacked = null;
  let xLoPacked = null;
  let readHiBuffer = null;
  let readLoBuffer = null;

  try {
    if (AIsGpu) {
      AHiBuffer = A._buf;
      ALoBuffer = A._loBuf;
    } else {
      const ASplit = splitDoubleDouble(A);
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dtrmv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dtrmv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dtrmv-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dtrmv-xLo", false);
    }
    if (yIsGpu) {
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const ySplit = splitDoubleDouble(y);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dtrmv-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dtrmv-yLo", true);
    }
    // x is re-read for every output — pack a strided x (both DD halves) once
    // when it pays (worthPackingDD), as strmv does (see util/strided.mjs).
    if (worthPackingDD(incx, n)) {
      xHiPacked = await gatherStridedPass(
        device,
        xHiBuffer,
        n,
        incx,
        "dtrmv-xHi-packed",
      );
      xLoPacked = await gatherStridedPass(
        device,
        xLoBuffer,
        n,
        incx,
        "dtrmv-xLo-packed",
      );
    }
    const xHiSrc = xHiPacked ? xHiPacked.buffer : xHiBuffer;
    const xLoSrc = xLoPacked ? xLoPacked.buffer : xLoBuffer;
    const xInc = xHiPacked ? 1 : incx;
    let passes;
    if (useColumnKernel) {
      if (numChunks > 1) {
        partialHiBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dtrmv-partialsHi",
        );
        partialLoBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dtrmv-partialsLo",
        );
        reduceParams = createParamsBuffer(
          device,
          [
            { value: n, type: "u32" },
            { value: numChunks, type: "u32" },
            { value: incy, type: "u32" },
            { value: 1, type: "f32" },
            { value: 0, type: "f32" },
            { value: 0, type: "f32" },
            { value: 0, type: "f32" },
          ],
          "dtrmv-reduce-params",
        );
      }
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: xInc, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
          { value: SPLITK_CHUNK_ROWS_DD, type: "u32" },
          { value: numChunks > 1 ? 0 : 1, type: "u32" },
        ],
        "dtrmv-t-params",
      );
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiSrc,
            xLoSrc,
            partialHiBuffer ?? yHiBuffer,
            partialLoBuffer ?? yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: {
            x: requireWorkgroupCount(device, Math.ceil(n / WGS), "dtrmv", "x"),
            y: requireWorkgroupCount(device, numChunks, "dtrmv", "y"),
          },
        },
      ];
      if (numChunks > 1)
        passes.push({
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
          workgroups: Math.min(
            Math.ceil(n / WGS),
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        });
    } else {
      paramsBuffer = createParamsBuffer(
        device,
        [
          { value: n, type: "u32" },
          { value: xInc, type: "u32" },
          { value: incy, type: "u32" },
          { value: lda, type: "u32" },
          { value: isNoTrans ? 0 : 1, type: "u32" },
          { value: isLower ? 0 : 1, type: "u32" },
          { value: isUnit ? 1 : 0, type: "u32" },
        ],
        "dtrmv-params",
      );
      // One workgroup per row of A; clamped to device limit — the shader's
      // grid-stride loop handles remaining rows when n > dispatch count.
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiSrc,
            xLoSrc,
            yHiBuffer,
            yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: Math.min(
            n,
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        },
      ];
    }

    if (xHiPacked) passes.unshift(xHiPacked.pass, xLoPacked.pass);
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
    for (const p of [xHiPacked, xLoPacked])
      if (p) destroyBuffers(p.buffer, p.params);
    if (readHiBuffer) destroyBuffers(readHiBuffer);
    if (readLoBuffer) destroyBuffers(readLoBuffer);
  }
}
