import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the sum of absolute values of a vector of doubles in extended
 * precision: result = sum(|x[i]|). Each element of `x` has abs() applied,
 * then is split into a (hi, lo) double-double f32 pair (see
 * `splitDoubleDouble`/`f64.mjs`) since WGSL has no f64 type; accumulation
 * uses Dekker's double-double algorithm (see `shaders/f64/`), giving ~48 bits
 * of mantissa — more than a single f32 (24 bits) but less than true f64
 * (52 bits), so results are not bit-exact with a CPU double.
 *
 * {@includeCode ../../examples/dasum/dasum.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dasum/web/dasum.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns absolute sum scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dasum/dasum.mjs#L18">Source code: dasum.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function dasum(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
): Promise<{ asum: number } | { asum: number; gpuTimeMs: number }>;

/**
 * Computes the sum of absolute values of a vector of doubles in double
 * precision: result = sum(|x[i]|).
 *
 * {@includeCode ../../examples/dasum/gpuvec.dasum.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array-backed GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns absolute sum scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dasum/dasum.mjs#L18">Source code: dasum.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function dasum(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
): Promise<{ asum: number } | { asum: number; gpuTimeMs: number }>;
