import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Applies a modified Givens plane rotation H to double-precision vectors x
 * and y:
 * $$\begin{pmatrix} x \\\\ y \end{pmatrix} \leftarrow \begin{pmatrix} h_{11} & h_{12} \\\\ h_{21} & h_{22} \end{pmatrix} \begin{pmatrix} x \\\\ y \end{pmatrix}$$
 * — double-double (Dekker) f64 emulation of {@link srotm}, since WGSL has
 * no native f64 type.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/drotm/drotm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/drotm/web/drotm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @param param - 5-element Float64Array: [flag, h11, h21, h12, h22]
 *   flag = -2: identity (no-op), -1: full H, 0: unit diagonal, 1: unit off-diagonal
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/drotm/drotm.mjs#L18">Source code: drotm.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function drotm(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
  param: Float64Array,
): Promise<
  | { x: Float64Array; y: Float64Array }
  | { x: Float64Array; y: Float64Array; gpuTimeMs: number }
>;

/**
 * Applies a modified Givens plane rotation H to double-precision vectors x
 * and y:
 * $$\begin{pmatrix} x \\\\ y \end{pmatrix} \leftarrow \begin{pmatrix} h_{11} & h_{12} \\\\ h_{21} & h_{22} \end{pmatrix} \begin{pmatrix} x \\\\ y \end{pmatrix}$$
 * — GPU-resident overload; see the Float64Array overload above for the
 * routine itself.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/drotm/gpu.drotm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input/output vector (must be Float64Array-backed, mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input/output vector (must be Float64Array-backed, mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @param param - 5-element Float64Array: [flag, h11, h21, h12, h22]
 *   flag = -2: identity (no-op), -1: full H, 0: unit diagonal, 1: unit off-diagonal
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/drotm/drotm.mjs#L18">Source code: drotm.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function drotm(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  param: Float64Array,
): Promise<{} | { gpuTimeMs: number }>;
