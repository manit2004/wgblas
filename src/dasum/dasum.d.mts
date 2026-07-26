import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the sum of absolute values of a vector of doubles in double
 * precision: result = sum(|x[i]|). Each element of `x` is packed into a
 * [main, aux] f32 pair (see `packF64`/`GpuVector`) since WGSL has no f64
 * type; accumulation is done with f64add.wgsl's IEEE-754 binary64 addition.
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
