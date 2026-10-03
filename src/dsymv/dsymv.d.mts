import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric matrix-vector operation $$y \leftarrow \alpha A x + \beta y$$
 * in double precision (double-double emulation — WGSL has no native f64 type).
 *
 * A is an n×n symmetric matrix stored in row-major order. Only the triangle
 * specified by `uplo` is referenced; the other triangle is inferred by symmetry.
 *
 * {@includeCode ../../examples/dsymv/dsymv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dsymv/web/dsymv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A (number of rows and columns)
 * @param alpha  - scalar multiplier for A*x
 * @param A      - Float64Array, row-major or column-major (see `layout`), at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n either way — A is square)
 * @param x      - Float64Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - Float64Array input/output vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @param layout - storage layout of `A` (default: `'row-major'`); for a symmetric
 *   matrix, column-major storage just means the *other* triangle is the one
 *   physically referenced for a given `uplo`
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsymv/dsymv.mjs#L19">Source code: dsymv.mjs (L19)</a>
 * @category BLAS Level 2
 */
export declare function dsymv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  A: Float64Array,
  lda: number,
  x: Float64Array,
  incx: number,
  beta: number,
  y: Float64Array,
  incy: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ y: Float64Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric matrix-vector operation $$y \leftarrow \alpha A x + \beta y$$
 * in double precision (double-double emulation).
 *
 * x and y are kept resident on the GPU. A must be a GpuMatrix (Float64Array-
 * backed); its own `layout` (set at `GpuMatrix.from` time) determines the
 * operation — there is no separate `layout` argument here.
 *
 * {@includeCode ../../examples/dsymv/gpu.dsymv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for A*x
 * @param A      - GpuMatrix (Float64Array-backed), GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector input vector (Float64Array-backed, not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - GpuVector input/output vector (Float64Array-backed, mutated in place)
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsymv/dsymv.mjs#L19">Source code: dsymv.mjs (L19)</a>
 * @category BLAS Level 2
 */
export declare function dsymv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  A: GpuMatrix,
  lda: number,
  x: GpuVector,
  incx: number,
  beta: number,
  y: GpuVector,
  incy: number,
): Promise<{ gpuTimeMs?: number }>;
