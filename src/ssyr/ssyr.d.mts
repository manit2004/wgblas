import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-1 update A = alpha * x * x^T + A
 *
 * A is an n×n symmetric matrix stored in row-major order, updated in place.
 * Only the triangle specified by `uplo` is referenced and updated; the other
 * triangle is left untouched (implied by symmetry).
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A (number of rows and columns)
 * @param alpha  - scalar multiplier for x*x^T
 * @param x      - Float32Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param A      - Float32Array or GpuMatrix, row-major, at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr/ssyr.mjs#L15">Source code: ssyr.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssyr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  A: Float32Array | GpuMatrix,
  lda: number,
): Promise<{ A: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-1 update A = alpha * x * x^T + A
 *
 * A is kept GPU-resident; x is a CPU Float32Array.
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for x*x^T
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param A      - GpuMatrix, row-major, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr/ssyr.mjs#L15">Source code: ssyr.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssyr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ A: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-1 update A = alpha * x * x^T + A
 *
 * x and A are both kept resident on the GPU.
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for x*x^T
 * @param x      - GpuVector input vector (not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param A      - GpuMatrix, row-major, mutated in place
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr/ssyr.mjs#L15">Source code: ssyr.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssyr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ gpuTimeMs?: number }>;
