import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the dot product of two vectors: result = sum(x[i] * y[i])
 *
 * {@includeCode ../../examples/sdot/sdot.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float32Array input vector
 * @param incy - stride for y (must be a positive integer)
 * @returns dot product scalar — always a CPU readback, even for GpuVector inputs
 * @see [Source code: sdot.mjs](https://github.com/manit2004/wgblas/blob/main/src/sdot/sdot.mjs#L18-L116)
 * @category BLAS Level 1
 */
export declare function sdot(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
): Promise<{ dot: number } | { dot: number; gpuTimeMs: number }>;

/**
 * Computes the dot product of two vectors: result = sum(x[i] * y[i])
 *
 * {@includeCode ../../examples/sdot/gpuvec.sdot.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input vector
 * @param incy - stride for y (must be a positive integer)
 * @returns dot product scalar — always a CPU readback, even for GpuVector inputs
 * @see [Source code: sdot.mjs](https://github.com/manit2004/wgblas/blob/main/src/sdot/sdot.mjs)
 * @category BLAS Level 1
 */
export declare function sdot(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{ dot: number } | { dot: number; gpuTimeMs: number }>;
