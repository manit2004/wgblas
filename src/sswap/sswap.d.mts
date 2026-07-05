import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Swaps the elements of two single-precision vectors: x <-> y
 *
 * {@includeCode ../../examples/sswap/sswap.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/sswap/web/sswap.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - Float32Array first input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float32Array second input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @see [Source code: sswap.mjs (L15–L88)](https://github.com/manit2004/wgblas/blob/main/src/sswap/sswap.mjs#L15-L88)
 * @category BLAS Level 1
 */
export declare function sswap(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
): Promise<{ x: Float32Array; y: Float32Array } | { x: Float32Array; y: Float32Array; gpuTimeMs: number }>;

/**
 * Swaps the elements of two single-precision vectors: x <-> y
 *
 * {@includeCode ../../examples/sswap/gpuvec.sswap.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - GpuVector first input/output vector (mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector second input/output vector (mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sswap/sswap.mjs#L15-L88">Source code: sswap.mjs (L15–L88)</a>
 * @category BLAS Level 1
 */
export declare function sswap(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{} | { gpuTimeMs: number }>;
