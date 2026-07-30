import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-2 update A = alpha * x * y^T + alpha * y * x^T + A
 *
 * A is an n×n symmetric matrix stored in row-major order, updated in place.
 * Only the triangle specified by `uplo` is referenced and updated; the other
 * triangle is left untouched (implied by symmetry).
 *
 * {@includeCode ../../examples/ssyr2/ssyr2.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/ssyr2/web/ssyr2.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A (number of rows and columns)
 * @param alpha  - scalar multiplier for x*y^T + y*x^T
 * @param x      - Float32Array input vector, length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float32Array input vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - Float32Array, row-major, at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr2/ssyr2.mjs#L15">Source code: ssyr2.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssyr2(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  A: Float32Array,
  lda: number,
): Promise<{ A: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-2 update A = alpha * x * y^T + alpha * y * x^T + A
 *
 * A is kept GPU-resident; x and y are CPU Float32Arrays.
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for x*y^T + y*x^T
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float32Array input vector
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - GpuMatrix, row-major, GPU-resident, Float32-backed
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr2/ssyr2.mjs#L15">Source code: ssyr2.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssyr2(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-2 update A = alpha * x * y^T + alpha * y * x^T + A
 *
 * x, y, and A are all kept resident on the GPU.
 *
 * {@includeCode ../../examples/ssyr2/gpuvec.ssyr2.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param n      - order of the matrix A
 * @param alpha  - scalar multiplier for x*y^T + y*x^T
 * @param x      - GpuVector input vector (not mutated), Float32-backed
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - GpuVector input vector (not mutated), Float32-backed
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - GpuMatrix, row-major, mutated in place, Float32-backed
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr2/ssyr2.mjs#L15">Source code: ssyr2.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function ssyr2(
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
