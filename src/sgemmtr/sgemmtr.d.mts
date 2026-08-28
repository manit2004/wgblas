import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the matrix-matrix operation $$C \leftarrow \mathrm{uplo}(\alpha \mathrm{op}(A) \mathrm{op}(B) + \beta C)$$
 *
 * `sgemm`'s operation, but only the triangle of C named by `uplo` is read or
 * written (`'lower'`: `col <= row`, `'upper'`: `col >= row`; C need not be
 * square — the test applies over the full m×n grid).
 *
 * Same kernels as `sgemm` (`sgemmtr_small.wgsl`/`sgemmtr_large.wgsl`,
 * identical tiling), with the final output write masked to one triangle.
 *
 * {@includeCode ../../examples/sgemmtr/sgemmtr.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/sgemmtr/web/sgemmtr.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
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
 *   (default: `'row-major'`) — same handling as `sgemm`, plus `uplo` is
 *   flipped internally for column-major C so it still names the triangle
 *   you asked for
 * @returns updated C as a Float32Array (only the requested triangle changed)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemmtr/sgemmtr.mjs#L19">Source code: sgemmtr.mjs (L19)</a>
 * @category BLAS Level 3
 */
export declare function sgemmtr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
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
 * Performs the matrix-matrix operation $$C \leftarrow \mathrm{uplo}(\alpha \mathrm{op}(A) \mathrm{op}(B) + \beta C)$$
 *
 * A, B, and C are all kept GPU-resident. Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A and B must be GpuMatrix whenever C is, and vice
 * versa — mixing a GpuMatrix with a plain Float32Array is not supported.
 *
 * {@includeCode ../../examples/sgemmtr/gpu.sgemmtr.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
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
 * @param C      - GpuMatrix (mutated in place; only the requested triangle changes)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @returns no C — it stays GPU-resident; call `C.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/sgemmtr/sgemmtr.mjs#L19">Source code: sgemmtr.mjs (L19)</a>
 * @category BLAS Level 3
 */
export declare function sgemmtr(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
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
