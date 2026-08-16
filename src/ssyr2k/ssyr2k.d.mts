import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-2k update
 * C := uplo(alpha * op(A) * op(B)^T + alpha * op(B) * op(A)^T + beta * C) —
 * only the triangle of C named by `uplo` is read or written (`'lower'`:
 * `col <= row`, `'upper'`: `col >= row`). C is always n×n.
 *
 * - `trans='no-transpose'`: op(A) = A, op(B) = B (both n×k)
 * - `trans='transpose'`:    op(A) = A^T, op(B) = B^T (A, B stored k×n)
 *
 * No dedicated kernel — two passes of `sgemmtr`'s kernel
 * (`sgemmtr_small.wgsl`/`sgemmtr_large.wgsl`) on one command encoder, the
 * second accumulating with `beta=1` so C never leaves the GPU between them.
 *
 * {@includeCode ../../examples/ssyr2k/ssyr2k.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/ssyr2k/web/ssyr2k.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
 * @param trans  - `'no-transpose'` for A*B^T + B*A^T, `'transpose'` for A^T*B + B^T*A
 * @param n      - order of C (C is n×n); rows of op(A) and op(B)
 * @param k      - columns of op(A) and op(B) — the shared/contracted dimension
 * @param alpha  - scalar multiplier for both rank-k terms
 * @param A      - Float32Array, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float32Array, row-major or column-major (see `layout`)
 * @param ldb    - leading dimension of B as stored
 * @param beta   - scalar multiplier for C
 * @param C      - Float32Array input/output matrix, row-major or column-major
 * @param ldc    - leading dimension of C as stored
 * @param layout - storage layout shared by A/B/C when they're Float32Array
 *   (default: `'row-major'`) — same handling as `sgemmtr`; column-major C
 *   flips `uplo` internally so it still names the triangle you asked for
 * @returns updated C as a Float32Array (only the requested triangle changed)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr2k/ssyr2k.mjs#L20">Source code: ssyr2k.mjs (L20)</a>
 * @category BLAS Level 3
 */
export declare function ssyr2k(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
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
 * Performs the symmetric rank-2k update
 * C := uplo(alpha * op(A) * op(B)^T + alpha * op(B) * op(A)^T + beta * C)
 *
 * A, B, and C are all kept GPU-resident. Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A and B must be GpuMatrix whenever C is, and vice
 * versa — mixing a GpuMatrix with a plain Float32Array is not supported.
 *
 * {@includeCode ../../examples/ssyr2k/gpu.ssyr2k.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
 * @param trans  - `'no-transpose'` for A*B^T + B*A^T, `'transpose'` for A^T*B + B^T*A
 * @param n      - order of C (C is n×n); rows of op(A) and op(B)
 * @param k      - columns of op(A) and op(B) — the shared/contracted dimension
 * @param alpha  - scalar multiplier for both rank-k terms
 * @param A      - GpuMatrix
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @param beta   - scalar multiplier for C
 * @param C      - GpuMatrix (mutated in place; only the requested triangle changes)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @returns no C — it stays GPU-resident; call `C.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyr2k/ssyr2k.mjs#L20">Source code: ssyr2k.mjs (L20)</a>
 * @category BLAS Level 3
 */
export declare function ssyr2k(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
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
