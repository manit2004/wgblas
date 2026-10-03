import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the triangular matrix-vector operation $$y \leftarrow \mathrm{op}(A) x$$
 * in double precision (double-double emulation — WGSL has no native f64 type).
 *
 * A is an n×n triangular matrix stored in row-major order. Only the triangle
 * specified by `uplo` is referenced; the other triangle is not accessed.
 *
 * {@includeCode ../../examples/dtrmv/dtrmv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dtrmv/web/dtrmv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A (number of rows and columns)
 * @param A      - Float64Array, row-major or column-major (see `layout`), at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n either way — A is square)
 * @param x      - Float64Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float64Array output vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @param layout - storage layout of `A` (default: `'row-major'`); column-major
 *   flips both the stored triangle and the effective `trans` (op(A) stays
 *   what you asked for either way)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrmv/dtrmv.mjs#L18">Source code: dtrmv.mjs (L18)</a>
 * @category BLAS Level 2
 */
export declare function dtrmv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: Float64Array,
  lda: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ y: Float64Array; gpuTimeMs?: number }>;

/**
 * Performs the triangular matrix-vector operation $$y \leftarrow \mathrm{op}(A) x$$
 * in double precision (double-double emulation).
 *
 * x and y are kept resident on the GPU. A must be a GpuMatrix (Float64Array-
 * backed); its own `layout` (set at `GpuMatrix.from` time) determines the
 * operation — there is no separate `layout` argument here.
 *
 * {@includeCode ../../examples/dtrmv/gpu.dtrmv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A
 * @param A      - GpuMatrix (Float64Array-backed), GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector input vector (Float64Array-backed, not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - GpuVector output vector (Float64Array-backed, mutated in place)
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrmv/dtrmv.mjs#L18">Source code: dtrmv.mjs (L18)</a>
 * @category BLAS Level 2
 */
export declare function dtrmv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: GpuMatrix,
  lda: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
): Promise<{ gpuTimeMs?: number }>;
