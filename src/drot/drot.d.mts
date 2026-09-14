import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Applies a Givens plane rotation to double-precision vectors x and y:
 * $$\begin{aligned} x &\leftarrow cx + sy \\\\ y &\leftarrow -sx + cy \end{aligned}$$
 * — double-double (Dekker) f64 emulation of {@link srot}, since WGSL has no
 * native f64 type.
 *
 * {@includeCode ../../examples/drot/drot.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/drot/web/drot.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @param c - cosine of rotation angle
 * @param s - sine of rotation angle
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/drot/drot.mjs#L19">Source code: drot.mjs (L19)</a>
 * @category BLAS Level 1
 */
export declare function drot(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
  c: number,
  s: number,
): Promise<
  | { x: Float64Array; y: Float64Array }
  | { x: Float64Array; y: Float64Array; gpuTimeMs: number }
>;

/**
 * Applies a Givens plane rotation to double-precision vectors x and y:
 * $$\begin{aligned} x &\leftarrow cx + sy \\\\ y &\leftarrow -sx + cy \end{aligned}$$
 * — GPU-resident overload; see the Float64Array overload above for the
 * routine itself.
 *
 * {@includeCode ../../examples/drot/gpu.drot.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input/output vector (must be Float64Array-backed, mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input/output vector (must be Float64Array-backed, mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @param c - cosine of rotation angle
 * @param s - sine of rotation angle
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/drot/drot.mjs#L19">Source code: drot.mjs (L19)</a>
 * @category BLAS Level 1
 */
export declare function drot(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  c: number,
  s: number,
): Promise<{} | { gpuTimeMs: number }>;
