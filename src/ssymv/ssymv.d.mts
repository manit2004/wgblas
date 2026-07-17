import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric matrix-vector operation y = alpha * A * x + beta * y
 *
 * A is an n×n symmetric matrix stored in row-major order. Only the triangle
 * specified by `uplo` is referenced; the other triangle is inferred by symmetry.
 *
 * {@includeCode ../../examples/ssymv/ssymv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/ssymv/web/ssymv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A (number of rows and columns)
 * @param alpha  - scalar multiplier for A*x
 * @param A      - Float32Array or GpuMatrix, row-major, at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n)
 * @param x      - Float32Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - Float32Array input/output vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssymv/ssymv.mjs#L15">Source code: ssymv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssymv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  A: Float32Array | GpuMatrix,
  lda: number,
  x: Float32Array,
  incx: number,
  beta: number,
  y: Float32Array,
  incy: number,
): Promise<{ y: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric matrix-vector operation y = alpha * A * x + beta * y
 *
 * A is kept GPU-resident; x and y are CPU Float32Arrays.
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for A*x
 * @param A      - GpuMatrix, row-major, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - Float32Array input/output vector
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssymv/ssymv.mjs#L15">Source code: ssymv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssymv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  A: GpuMatrix,
  lda: number,
  x: Float32Array,
  incx: number,
  beta: number,
  y: Float32Array,
  incy: number,
): Promise<{ y: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric matrix-vector operation y = alpha * A * x + beta * y
 *
 * x and y are kept resident on the GPU. A must be a GpuMatrix.
 *
 * {@includeCode ../../examples/ssymv/gpuvec.ssymv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for A*x
 * @param A      - GpuMatrix, row-major, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector input vector (not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - GpuVector input/output vector (mutated in place)
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssymv/ssymv.mjs#L15">Source code: ssymv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssymv(
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