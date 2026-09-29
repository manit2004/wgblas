import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-2 update $$A \leftarrow \alpha x y^{T} + \alpha y x^{T} + A$$
 * in double precision (double-double emulation — WGSL has no native f64 type).
 *
 * A is an n×n symmetric matrix stored in row-major order, updated in place.
 * Only the triangle specified by `uplo` is referenced and updated; the other
 * triangle is left untouched (implied by symmetry).
 *
 * {@includeCode ../../examples/dsyr2/dsyr2.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dsyr2/web/dsyr2.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A (number of rows and columns)
 * @param alpha  - scalar multiplier for x*y^T + y*x^T
 * @param x      - Float64Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float64Array input vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - Float64Array, row-major or column-major (see `layout`), at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n either way — A is square)
 * @param layout - storage layout of `A` (default: `'row-major'`); for a symmetric
 *   matrix, column-major storage just means the *other* triangle is the one
 *   physically referenced for a given `uplo`
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsyr2/dsyr2.mjs#L19">Source code: dsyr2.mjs (L19)</a>
 * @category BLAS Level 2
 */
export declare function dsyr2(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
  A: Float64Array,
  lda: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ A: Float64Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-2 update $$A \leftarrow \alpha x y^{T} + \alpha y x^{T} + A$$
 * in double precision (double-double emulation).
 *
 * x, y, and A are all kept resident on the GPU. `A`'s own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here.
 *
 * {@includeCode ../../examples/dsyr2/gpu.dsyr2.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for x*y^T + y*x^T
 * @param x      - GpuVector input vector (not mutated), Float64-backed
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - GpuVector input vector (not mutated), Float64-backed
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - GpuMatrix (Float64Array-backed), mutated in place
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsyr2/dsyr2.mjs#L19">Source code: dsyr2.mjs (L19)</a>
 * @category BLAS Level 2
 */
export declare function dsyr2(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ gpuTimeMs?: number }>;
