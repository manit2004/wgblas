import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Performs the operation $$y \leftarrow x$$ — double-double (Dekker) f64
 * emulation of {@link scopy}, since WGSL has no native f64 type.
 *
 * {@includeCode ../../examples/dcopy/dcopy.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dcopy/web/dcopy.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array output vector
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dcopy/dcopy.mjs#L20">Source code: dcopy.mjs (L20)</a>
 * @category BLAS Level 1
 */
export declare function dcopy(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
): Promise<{ y: Float64Array } | { y: Float64Array; gpuTimeMs: number }>;

/**
 * Performs the operation $$y \leftarrow x$$ — GPU-resident overload; see the
 * Float64Array overload above for the routine itself.
 *
 * {@includeCode ../../examples/dcopy/gpu.dcopy.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector (must be Float64Array-backed)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector output vector (must be Float64Array-backed, mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dcopy/dcopy.mjs#L20">Source code: dcopy.mjs (L20)</a>
 * @category BLAS Level 1
 */
export declare function dcopy(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{} | { gpuTimeMs: number }>;
