import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Scales a double-precision vector by a constant: $$x \leftarrow \alpha x$$
 *
 * `x` and `alpha` are each split into a (hi, lo) double-double f32 pair (see
 * `splitDoubleDouble`/`f64.mjs`) since WGSL has no f64 type; the multiply
 * uses Dekker's double-double algorithm (see `shaders/f64/`), giving ~48
 * bits of mantissa — more than a single f32 (24 bits) but less than true
 * f64 (52 bits), so results are not bit-exact with a CPU double.
 *
 * {@includeCode ../../examples/dscal/dscal.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dscal/web/dscal.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - Float64Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dscal/dscal.mjs">Source code: dscal.mjs</a>
 * @category BLAS Level 1
 */
export declare function dscal(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: Float64Array,
  incx: number,
): Promise<{ x: Float64Array } | { x: Float64Array; gpuTimeMs: number }>;

/**
 * Scales a double-precision vector by a constant: $$x \leftarrow \alpha x$$
 *
 * {@includeCode ../../examples/dscal/gpu.dscal.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - Float64Array-backed GpuVector input/output vector (mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dscal/dscal.mjs">Source code: dscal.mjs</a>
 * @category BLAS Level 1
 */
export declare function dscal(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
): Promise<{} | { gpuTimeMs: number }>;
