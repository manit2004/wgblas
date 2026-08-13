import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Performs the operation y = alpha * x + y
 *
 * {@includeCode ../../examples/saxpy/saxpy.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/saxpy/web/saxpy.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - Float32Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float32Array input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/saxpy/saxpy.mjs#L15">Source code: saxpy.mjs (L15)</a>
 * @category BLAS Level 1
 */
export declare function saxpy(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
): Promise<{ y: Float32Array } | { y: Float32Array; gpuTimeMs: number }>;

/**
 * Performs the operation y = alpha * x + y
 *
 * {@includeCode ../../examples/saxpy/gpu.saxpy.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input/output vector (mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/saxpy/saxpy.mjs#L15">Source code: saxpy.mjs (L15)</a>
 * @category BLAS Level 1
 */
export declare function saxpy(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{} | { gpuTimeMs: number }>;
