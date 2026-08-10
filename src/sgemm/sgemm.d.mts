import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the matrix-matrix operation C = alpha * op(A) * op(B) + beta * C
 *
 * - `transA/transB='no-transpose'`: op(A) = A (m×k), op(B) = B (k×n)
 * - `transA/transB='transpose'`:    op(A) = A^T,     op(B) = B^T
 *
 * A, B, C are row-major or column-major (see `layout`) — backed by one of
 * two shared-memory-tiled, register-blocked kernels chosen by shape:
 * `sgemm_small.wgsl` (BM=BN=32) below a 6x6 workgroup grid, `sgemm_large.wgsl`
 * (BM=BN=64) above it.
 *
 * {@includeCode ../../examples/sgemm/sgemm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/sgemm/web/sgemm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param transB - `'no-transpose'` for B, `'transpose'` for B^T
 * @param m      - rows of op(A) and C
 * @param n      - columns of op(B) and C
 * @param k      - columns of op(A), rows of op(B)
 * @param alpha  - scalar multiplier for op(A)*op(B)
 * @param A      - Float32Array, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float32Array, row-major or column-major (see `layout`)
 * @param ldb    - leading dimension of B as stored
 * @param beta   - scalar multiplier for C
 * @param C      - Float32Array input/output matrix, row-major or column-major
 * @param ldc    - leading dimension of C as stored
 * @param layout - storage layout shared by A/B/C when they're Float32Array
 *   (default: `'row-major'`); column-major A/B flips the respective trans
 *   flag internally, column-major C computes C^T = op(B)^T*op(A)^T instead
 *   (same underlying bytes) — op(A)*op(B) stays what you asked for either way
 * @returns updated C — always a CPU readback, even for GpuMatrix inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemm/sgemm.mjs#L17">Source code: sgemm.mjs (L17)</a>
 * @category BLAS Level 3
 */
export declare function sgemm(
  device: GPUDevice,
  transA: 'no-transpose' | 'transpose',
  transB: 'no-transpose' | 'transpose',
  m: number,
  n: number,
  k: number,
  alpha: number,
  A: Float32Array,
  lda: number,
  B: Float32Array,
  ldb: number,
  beta: number,
  C: Float32Array,
  ldc: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ C: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the matrix-matrix operation C = alpha * op(A) * op(B) + beta * C
 *
 * A, B, and C are all kept GPU-resident. Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A and B must be GpuMatrix whenever C is, and vice
 * versa — mixing a GpuMatrix with a plain Float32Array is not supported.
 *
 * {@includeCode ../../examples/sgemm/gpumat.sgemm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param transB - `'no-transpose'` for B, `'transpose'` for B^T
 * @param m      - rows of op(A) and C
 * @param n      - columns of op(B) and C
 * @param k      - columns of op(A), rows of op(B)
 * @param alpha  - scalar multiplier for op(A)*op(B)
 * @param A      - GpuMatrix
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @param beta   - scalar multiplier for C
 * @param C      - GpuMatrix (mutated in place)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemm/sgemm.mjs#L17">Source code: sgemm.mjs (L17)</a>
 * @category BLAS Level 3
 */
export declare function sgemm(
  device: GPUDevice,
  transA: 'no-transpose' | 'transpose',
  transB: 'no-transpose' | 'transpose',
  m: number,
  n: number,
  k: number,
  alpha: number,
  A: GpuMatrix,
  lda: number,
  B: GpuMatrix,
  ldb: number,
  beta: number,
  C: GpuMatrix,
  ldc: number,
): Promise<{ gpuTimeMs?: number }>;
