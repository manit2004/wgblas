import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Performs the operation y = x
 *
 * {@includeCode ../../examples/scopy/scopy.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float32Array output vector
 * @param incy - stride for y (must be a positive integer)
 * @see [scopy.mjs](https://github.com/manit2004/wgblas/blob/main/src/scopy/scopy.mjs#L15-L85)
 * @category BLAS Level 1
 */
export declare function scopy(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
): Promise<{ y: Float32Array } | { y: Float32Array; gpuTimeMs: number }>;

/**
 * Performs the operation y = x
 *
 * {@includeCode ../../examples/scopy/gpuvec.scopy.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector output vector (mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @see [scopy.mjs](https://github.com/manit2004/wgblas/blob/main/src/scopy/scopy.mjs)
 * @category BLAS Level 1
 */
export declare function scopy(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{} | { gpuTimeMs: number }>;
