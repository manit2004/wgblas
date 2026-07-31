import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the matrix-vector operation y = alpha * op(A) * x + beta * y
 *
 * - `trans='no-transpose'`: op(A) = A,   x is length n, y is length m
 * - `trans='transpose'`:    op(A) = A^T, x is length m, y is length n
 *
 * A is an m×n matrix stored in row-major order. `lda` is the leading dimension
 * (number of floats between the start of consecutive rows — must be >= n).
 *
 * {@includeCode ../../examples/sgemv/sgemv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/sgemv/web/sgemv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param m      - number of rows in A
 * @param n      - number of columns in A
 * @param alpha  - scalar multiplier for op(A)*x
 * @param A      - Float32Array, row-major or column-major (see `layout`), at least (m-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n for row-major, >= m for column-major)
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - Float32Array input/output vector
 * @param incy   - stride for y (must be a positive integer)
 * @param layout - storage layout of `A` (default: `'row-major'`); column-major
 *   swaps the effective `m`/`n` and flips `trans` internally (op(A) stays
 *   what you asked for either way — x/y keep their original lengths)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemv/sgemv.mjs#L16">Source code: sgemv.mjs (L16)</a>
 * @category BLAS Level 2
 */
export declare function sgemv(
  device: GPUDevice,
  trans: 'no-transpose' | 'transpose',
  m: number,
  n: number,
  alpha: number,
  A: Float32Array,
  lda: number,
  x: Float32Array,
  incx: number,
  beta: number,
  y: Float32Array,
  incy: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ y: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the matrix-vector operation y = alpha * op(A) * x + beta * y
 *
 * A is kept GPU-resident; x and y are CPU Float32Arrays. `A`'s own `layout`
 * (set at `GpuMatrix.from` time) determines the operation — there is no
 * separate `layout` argument here.
 *
 * @param device - GPUDevice from `init()`
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param m      - number of rows in A
 * @param n      - number of columns in A
 * @param alpha  - scalar multiplier for op(A)*x
 * @param A      - GpuMatrix, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - Float32Array input vector
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - Float32Array input/output vector
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemv/sgemv.mjs#L16">Source code: sgemv.mjs (L16)</a>
 * @category BLAS Level 2
 */
export declare function sgemv(
  device: GPUDevice,
  trans: 'no-transpose' | 'transpose',
  m: number,
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
 * Performs the matrix-vector operation y = alpha * op(A) * x + beta * y
 *
 * x and y are kept resident on the GPU. A must be a GpuMatrix; its own
 * `layout` (set at `GpuMatrix.from` time) determines the operation — there is
 * no separate `layout` argument here.
 *
 * {@includeCode ../../examples/sgemv/gpuvec.sgemv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param trans  - `'no-transpose'` for A, `'transpose'` for A^T
 * @param m      - number of rows in A
 * @param n      - number of columns in A
 * @param alpha  - scalar multiplier for op(A)*x
 * @param A      - GpuMatrix
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector input vector (not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param beta   - scalar multiplier for y
 * @param y      - GpuVector input/output vector (mutated in place)
 * @param incy   - stride for y (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemv/sgemv.mjs#L16">Source code: sgemv.mjs (L16)</a>
 * @category BLAS Level 2
 */
export declare function sgemv(
  device: GPUDevice,
  trans: 'no-transpose' | 'transpose',
  m: number,
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
