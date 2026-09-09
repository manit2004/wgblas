import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Performs the operation $$y \leftarrow \alpha x + y$$ — double-double
 * (Dekker) f64 emulation of {@link saxpy}, since WGSL has no native f64 type.
 *
 * {@includeCode ../../examples/daxpy/daxpy.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/daxpy/web/daxpy.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - Float64Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/daxpy/daxpy.mjs#L18">Source code: daxpy.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function daxpy(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
): Promise<{ y: Float64Array } | { y: Float64Array; gpuTimeMs: number }>;

/**
 * Performs the operation $$y \leftarrow \alpha x + y$$ — GPU-resident
 * overload; see the Float64Array overload above for the routine itself.
 *
 * {@includeCode ../../examples/daxpy/gpu.daxpy.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - GpuVector input vector (must be Float64Array-backed)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input/output vector (must be Float64Array-backed, mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/daxpy/daxpy.mjs#L18">Source code: daxpy.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function daxpy(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{} | { gpuTimeMs: number }>;
