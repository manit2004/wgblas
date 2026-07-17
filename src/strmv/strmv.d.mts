import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the triangular matrix-vector operation y = op(A) * x
 *
 * A is an n×n triangular matrix stored in row-major order. Only the triangle
 * specified by `uplo` is referenced; the other triangle is not accessed.
 *
 * {@includeCode ../../examples/strmv/strmv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/strmv/web/strmv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A (number of rows and columns)
 * @param A      - Float32Array or GpuMatrix, row-major, at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n)
 * @param x      - Float32Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float32Array output vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strmv/strmv.mjs#L15">Source code: strmv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function strmv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: Float32Array | GpuMatrix,
  lda: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
): Promise<{ y: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the triangular matrix-vector operation y = op(A) * x
 *
 * A is kept GPU-resident; x and y are CPU Float32Arrays.
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A
 * @param A      - GpuMatrix, row-major, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float32Array output vector
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/develop/src/strmv/strmv.mjs#L15">Source code: strmv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function strmv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: GpuMatrix,
  lda: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
): Promise<{ y: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the triangular matrix-vector operation y = op(A) * x
 *
 * x and y are kept resident on the GPU. A must be a GpuMatrix.
 *
 * {@includeCode ../../examples/strmv/gpuvec.strmv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A
 * @param A      - GpuMatrix, row-major, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector input vector (not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - GpuVector output vector (mutated in place)
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/develop/src/strmv/strmv.mjs#L15">Source code: strmv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function strmv(
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
