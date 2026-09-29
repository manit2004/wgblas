import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-1 update $$A \leftarrow \alpha x x^{T} + A$$ in
 * double precision (double-double emulation — WGSL has no native f64 type).
 *
 * A is an n×n symmetric matrix stored in row-major order, updated in place.
 * Only the triangle specified by `uplo` is referenced and updated; the other
 * triangle is left untouched (implied by symmetry).
 *
 * {@includeCode ../../examples/dsyr/dsyr.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dsyr/web/dsyr.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A (number of rows and columns)
 * @param alpha  - scalar multiplier for x*x^T
 * @param x      - Float64Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param A      - Float64Array, row-major or column-major (see `layout`), at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n either way — A is square)
 * @param layout - storage layout of `A` (default: `'row-major'`); for a symmetric
 *   matrix, column-major storage just means the *other* triangle is the one
 *   physically referenced for a given `uplo`
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsyr/dsyr.mjs#L18">Source code: dsyr.mjs (L18)</a>
 * @category BLAS Level 2
 */
export declare function dsyr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: Float64Array,
  incx: number,
  A: Float64Array,
  lda: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ A: Float64Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-1 update $$A \leftarrow \alpha x x^{T} + A$$ in
 * double precision (double-double emulation).
 *
 * x and A are both kept resident on the GPU. `A`'s own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here.
 *
 * {@includeCode ../../examples/dsyr/gpu.dsyr.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for x*x^T
 * @param x      - GpuVector input vector (Float64Array-backed, not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param A      - GpuMatrix (Float64Array-backed), mutated in place
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsyr/dsyr.mjs#L18">Source code: dsyr.mjs (L18)</a>
 * @category BLAS Level 2
 */
export declare function dsyr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ gpuTimeMs?: number }>;
