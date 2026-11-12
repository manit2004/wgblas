import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Swaps the elements of two double-precision vectors: $$x \leftrightarrow y$$
 * — double-double (Dekker) f64 emulation of {@link sswap}, since WGSL has
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
 * {@includeCode ../../examples/dswap/dswap.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dswap/web/dswap.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - Float64Array first input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array second input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dswap/dswap.mjs#L22">Source code: dswap.mjs (L22)</a>
 * @category BLAS Level 1
 */
export declare function dswap(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
): Promise<
  | { x: Float64Array; y: Float64Array }
  | { x: Float64Array; y: Float64Array; gpuTimeMs: number }
>;

/**
 * Swaps the elements of two double-precision vectors: $$x \leftrightarrow y$$
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
 * {@includeCode ../../examples/dswap/gpu.dswap.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - GpuVector first input/output vector (must be Float64Array-backed, mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector second input/output vector (must be Float64Array-backed, mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dswap/dswap.mjs#L22">Source code: dswap.mjs (L22)</a>
 * @category BLAS Level 1
 */
export declare function dswap(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{} | { gpuTimeMs: number }>;
