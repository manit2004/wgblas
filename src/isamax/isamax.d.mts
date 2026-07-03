import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Returns the 0-based index of the element with the largest absolute value.
 * Ties are broken in favour of the lower index, matching CBLAS behaviour.
 *
 * {@includeCode ../../examples/isamax/isamax.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns 0-based index of max |x[i]|
 * @see [Source code: isamax.mjs](https://github.com/manit2004/wgblas/blob/main/src/isamax/isamax.mjs#L18-L113)
 * @category BLAS Level 1
 */
export declare function isamax(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
): Promise<{ index: number } | { index: number; gpuTimeMs: number }>;

/**
 * Returns the 0-based index of the element with the largest absolute value.
 * Ties are broken in favour of the lower index, matching CBLAS behaviour.
 *
 * {@includeCode ../../examples/isamax/gpuvec.isamax.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns 0-based index of max |x[i]|
 * @see [Source code: isamax.mjs](https://github.com/manit2004/wgblas/blob/main/src/isamax/isamax.mjs)
 * @category BLAS Level 1
 */
export declare function isamax(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
): Promise<{ index: number } | { index: number; gpuTimeMs: number }>;
