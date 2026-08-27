import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Returns the 0-based index of the element with the largest absolute value,
 * for a vector of doubles: $$\text{index} = \arg\max_{i} |x_i|$$
 * Each element of `x` is split into a (hi, lo)
 * double-double f32 pair (see `splitDoubleDouble`/`f64.mjs`) since WGSL has
 * no f64 type; comparisons use the double-double pair directly (hi, falling
 * back to lo on an exact tie), giving ~48 bits of discriminating precision —
 * more than a single f32 (24 bits) but less than true f64 (52 bits). Ties
 * are broken in favour of the lower index, matching CBLAS behaviour.
 *
 * **NaN handling.** The search compares with `>`, which is false for NaN, so
 * NaN elements are skipped rather than selected: a vector of all NaN returns
 * `0`. This matches CBLAS except when `x[0]` itself is NaN — CBLAS seeds its
 * running maximum from `x[0]`, and since no comparison against NaN succeeds it
 * returns `0` however large the later elements are, whereas this returns the
 * index of the largest non-NaN element. `+-Infinity` compares normally and is
 * selected as the maximum.
 *
 * {@includeCode ../../examples/idamax/idamax.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/idamax/web/idamax.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns 0-based index of max |x[i]|
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/idamax/idamax.mjs#L19">Source code: idamax.mjs (L19)</a>
 * @category BLAS Level 1
 */
export declare function idamax(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
): Promise<{ index: number } | { index: number; gpuTimeMs: number }>;

/**
 * Returns the 0-based index of the element with the largest absolute value:
 * $$\text{index} = \arg\max_{i} |x_i|$$
 * Ties are broken in favour of the lower index, matching CBLAS behaviour.
 *
 * **NaN handling.** The search compares with `>`, which is false for NaN, so
 * NaN elements are skipped rather than selected: a vector of all NaN returns
 * `0`. This matches CBLAS except when `x[0]` itself is NaN — CBLAS seeds its
 * running maximum from `x[0]`, and since no comparison against NaN succeeds it
 * returns `0` however large the later elements are, whereas this returns the
 * index of the largest non-NaN element. `+-Infinity` compares normally and is
 * selected as the maximum.
 *
 * {@includeCode ../../examples/idamax/gpu.idamax.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array-backed GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns 0-based index of max |x[i]|
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/idamax/idamax.mjs#L19">Source code: idamax.mjs (L19)</a>
 * @category BLAS Level 1
 */
export declare function idamax(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
): Promise<{ index: number } | { index: number; gpuTimeMs: number }>;
