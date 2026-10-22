import {
  uploadBuffer,
  createParamsBuffer,
  createStorageBuffer,
  stageReadback,
  destroyBuffers,
} from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePasses, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { getPipeline } from "../util/pipeline.mjs";
import { requireWorkgroupCount } from "../util/workgroup.mjs";
import { WGS, SPLITK_CHUNK_ROWS_DD } from "../util/constants.mjs";
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { requireGpuDevice, requireSameDevice } from "../util/device.mjs";

// dgemv: y := alpha * op(A) * x + beta * y, double-double (Dekker) f64
// emulation of sgemv — A, x, y, alpha, and beta are each split into an f32
// (hi, lo) pair; WGSL has no f64 type.
export async function dgemv(
  device,
  trans,
  m,
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
  const AIsGpu = A instanceof GpuMatrix;
  const xIsGpu = x instanceof GpuVector;
  const yIsGpu = y instanceof GpuVector;

  requireGpuDevice(device);
  requireSameDevice(device, "dgemv", { A, x, y });
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
    !Number.isInteger(m) ||
    !Number.isInteger(n) ||
    !Number.isInteger(incx) ||
    !Number.isInteger(incy) ||
    !Number.isInteger(lda)
  )
    throw new Error("m, n, incx, incy, and lda must be integers.");
  if (incx <= 0 || incy <= 0)
    throw new Error("incx and incy must be positive.");
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
  if (AIsGpu && (A.rows < m || A.cols < n))
    throw new Error("A is too small for the given m and n.");
  if (m < 0 || n < 0) throw new Error("m and n must be non-negative.");
  if (m === 0 || n === 0) return yIsGpu ? {} : { y };

  // Column-major A reinterpreted row-major is A^T — swap to the kernel's
  // view of m/n/trans now that the shape checks above are done.
  const effLayout = AIsGpu ? A.layout : layout;
  if (effLayout === "column-major") {
    [m, n] = [n, m];
    trans = trans === "no-transpose" ? "transpose" : "no-transpose";
  }
  const isNoTrans = trans === "no-transpose";

  // NoTrans: x has n elements, y has m elements; Trans: x has m elements, y has n elements.
  const xLen = isNoTrans ? n : m;
  const yLen = isNoTrans ? m : n;

  if (lda < n) throw new Error("lda must be >= n.");
  if (!AIsGpu && A.length < (m - 1) * lda + n)
    throw new Error(
      "A does not have enough elements for the given m, n, and lda.",
    );
  if (x.length < (xLen - 1) * incx + 1)
    throw new Error(
      "x does not have enough elements for the given dimensions and incx.",
    );
  if (y.length < (yLen - 1) * incy + 1)
    throw new Error(
      "y does not have enough elements for the given dimensions and incy.",
    );

  const f64Deps = ["f64/dekker", "f64/utils/add", "f64/utils/multiply"];
  const shaderName = isNoTrans ? "dgemv_n" : "dgemv_t";
  const entryPoint = isNoTrans ? "dgemv_n_main" : "dgemv_t_main";
  const pipeline = await getPipeline(
    device,
    [...f64Deps, shaderName],
    entryPoint,
  );
  // Transpose: rows split into chunks for parallelism (dgemv_t.wgsl).
  const numChunks = isNoTrans ? 1 : Math.ceil(m / SPLITK_CHUNK_ROWS_DD);
  const reducePipeline =
    numChunks > 1
      ? await getPipeline(
          device,
          [...f64Deps, "reduce_partials_f64"],
          "reduce_partials_f64",
        )
      : null;

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
      AHiBuffer = uploadBuffer(device, ASplit.hi, "dgemv-AHi", false);
      ALoBuffer = uploadBuffer(device, ASplit.lo, "dgemv-ALo", false);
    }
    if (xIsGpu) {
      xHiBuffer = x._buf;
      xLoBuffer = x._loBuf;
    } else {
      const xSplit = splitDoubleDouble(x);
      xHiBuffer = uploadBuffer(device, xSplit.hi, "dgemv-xHi", false);
      xLoBuffer = uploadBuffer(device, xSplit.lo, "dgemv-xLo", false);
    }
    if (yIsGpu) {
      yHiBuffer = y._buf;
      yLoBuffer = y._loBuf;
    } else {
      const ySplit = splitDoubleDouble(y);
      yHiBuffer = uploadBuffer(device, ySplit.hi, "dgemv-yHi", true);
      yLoBuffer = uploadBuffer(device, ySplit.lo, "dgemv-yLo", true);
    }
    const commonParams = [
      { value: m, type: "u32" },
      { value: n, type: "u32" },
      { value: alphaHi[0], type: "f32" },
      { value: alphaLo[0], type: "f32" },
      { value: betaHi[0], type: "f32" },
      { value: betaLo[0], type: "f32" },
      { value: incx, type: "u32" },
      { value: incy, type: "u32" },
      { value: lda, type: "u32" },
    ];
    let passes;
    if (isNoTrans) {
      paramsBuffer = createParamsBuffer(device, commonParams, "dgemv-params");
      // One workgroup per row — dgemv_n.wgsl is a grid-stride loop, so
      // clamping here only costs parallelism.
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
          workgroups: Math.min(
            m,
            device.limits.maxComputeWorkgroupsPerDimension,
          ),
        },
      ];
    } else {
      if (numChunks > 1) {
        partialHiBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dgemv-partialsHi",
        );
        partialLoBuffer = createStorageBuffer(
          device,
          numChunks * n * 4,
          "dgemv-partialsLo",
        );
        reduceParams = createParamsBuffer(
          device,
          [
            { value: n, type: "u32" },
            { value: numChunks, type: "u32" },
            { value: incy, type: "u32" },
            { value: alphaHi[0], type: "f32" },
            { value: alphaLo[0], type: "f32" },
            { value: betaHi[0], type: "f32" },
            { value: betaLo[0], type: "f32" },
          ],
          "dgemv-reduce-params",
        );
      }
      paramsBuffer = createParamsBuffer(
        device,
        [
          ...commonParams,
          { value: SPLITK_CHUNK_ROWS_DD, type: "u32" },
          { value: numChunks > 1 ? 0 : 1, type: "u32" },
        ],
        "dgemv-t-params",
      );
      // One thread per output column, no grid-stride fallback — dgemv_t.wgsl
      // masks (not skips) out-of-range columns, so an over-limit dispatch
      // must be refused, not truncated.
      passes = [
        {
          pipeline,
          bindGroup: createBindGroup(device, pipeline.getBindGroupLayout(0), [
            AHiBuffer,
            ALoBuffer,
            xHiBuffer,
            xLoBuffer,
            partialHiBuffer ?? yHiBuffer,
            partialLoBuffer ?? yLoBuffer,
            paramsBuffer,
          ]),
          workgroups: {
            x: requireWorkgroupCount(device, Math.ceil(n / WGS), "dgemv", "x"),
            y: requireWorkgroupCount(device, numChunks, "dgemv", "y"),
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
