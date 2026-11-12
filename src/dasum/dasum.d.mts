import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the sum of absolute values of a vector of doubles in extended
 * precision: $$\text{result} = \sum_{i} |x_i|$$
 * Each element of `x` has abs() applied, then is split into a (hi, lo) double-double f32 pair 
 * (see `splitDoubleDouble`/`f64.mjs`) since WGSL has no f64 type; accumulation
 * uses Dekker's double-double algorithm (see `shaders/f64/`), giving ~48 bits
 * of mantissa — more than a single f32 (24 bits) but less than true f64
 * (52 bits), so results are not bit-exact with a CPU double.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU), and a result or
 * intermediate past ±3.4e38 overflows to ±Infinity, where real f64 would
 * stay finite.
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
 * precision: $$\text{result} = \sum_{i} |x_i|$$.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU), and a result or
 * intermediate past ±3.4e38 overflows to ±Infinity, where real f64 would
 * stay finite.
 *
 * {@includeCode ../../examples/dasum/gpu.dasum.js}
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
