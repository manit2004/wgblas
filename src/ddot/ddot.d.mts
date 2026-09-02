import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the dot product of two vectors of doubles in extended precision:
 * $$\text{result} = \sum_{i} x_i y_i$$
 * Each element of `x` and `y` is split into a (hi, lo) double-double f32 pair
 * (see `splitDoubleDouble`/`f64.mjs`) since WGSL has no f64 type; the
 * elementwise products and their accumulation both use Dekker's double-double
 * algorithm (see `shaders/f64/`), giving ~48 bits of mantissa — more than a
 * single f32 (24 bits) but less than true f64 (52 bits), so results are not
 * bit-exact with a CPU double.
 *
 * {@includeCode ../../examples/ddot/ddot.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/ddot/web/ddot.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array input vector
 * @param incy - stride for y (must be a positive integer)
 * @returns dot product scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ddot/ddot.mjs#L20">Source code: ddot.mjs (L20)</a>
 * @category BLAS Level 1
 */
export declare function ddot(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
): Promise<{ dot: number } | { dot: number; gpuTimeMs: number }>;

/**
 * Computes the dot product of two vectors of doubles in extended precision:
 * $$\text{result} = \sum_{i} x_i y_i$$
 * Accumulation uses Dekker's double-double algorithm (see `shaders/f64/`),
 * giving ~48 bits of mantissa.
 *
 * {@includeCode ../../examples/ddot/gpu.ddot.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array-backed GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float64Array-backed GpuVector input vector
 * @param incy - stride for y (must be a positive integer)
 * @returns dot product scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ddot/ddot.mjs#L20">Source code: ddot.mjs (L20)</a>
 * @category BLAS Level 1
 */
export declare function ddot(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{ dot: number } | { dot: number; gpuTimeMs: number }>;
