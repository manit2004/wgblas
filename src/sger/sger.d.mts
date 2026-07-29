import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the rank-1 update A = alpha * x * y^T + A
 *
 * A is an m×n matrix stored in row-major order, updated in place. `lda` is
 * the leading dimension (number of floats between the start of consecutive
 * rows — must be >= n).
 *
 * @param device - GPUDevice from `init()`
 * @param m      - number of rows in A (length of x)
 * @param n      - number of columns in A (length of y)
 * @param alpha  - scalar multiplier for x*y^T
 * @param x      - Float32Array input vector, length at least (m-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float32Array input vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - Float32Array or GpuMatrix, row-major, at least (m-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sger/sger.mjs#L15">Source code: sger.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function sger(
  device: GPUDevice,
  m: number,
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  A: Float32Array | GpuMatrix,
  lda: number,
): Promise<{ A: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the rank-1 update A = alpha * x * y^T + A
 *
 * A is kept GPU-resident; x and y are CPU Float32Arrays.
 *
 * @param device - GPUDevice from `init()`
 * @param m      - number of rows in A
 * @param n      - number of columns in A
 * @param alpha  - scalar multiplier for x*y^T
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float32Array input vector
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - GpuMatrix, row-major, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sger/sger.mjs#L15">Source code: sger.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function sger(
  device: GPUDevice,
  m: number,
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ A: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the rank-1 update A = alpha * x * y^T + A
 *
 * x, y, and A are all kept resident on the GPU.
 *
 * @param device - GPUDevice from `init()`
 * @param m      - number of rows in A
 * @param n      - number of columns in A
 * @param alpha  - scalar multiplier for x*y^T
 * @param x      - GpuVector input vector (not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - GpuVector input vector (not mutated)
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - GpuMatrix, row-major, mutated in place
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sger/sger.mjs#L15">Source code: sger.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function sger(
  device: GPUDevice,
  m: number,
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ gpuTimeMs?: number }>;
