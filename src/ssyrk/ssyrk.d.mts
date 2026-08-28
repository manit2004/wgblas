import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-k update $$C \leftarrow \mathrm{uplo}(\alpha \mathrm{op}(A) \mathrm{op}(A)^{T} + \beta C)$$
 *
 * only the triangle of C named by `uplo` is read or written (`'lower'`: `col <= row`,
 * `'upper'`: `col >= row`). C is always n×n.
 *
 * - `trans='no-transpose'`: op(A) = A (n×k), computes alpha*A*A^T + beta*C
 * - `trans='transpose'`:    op(A) = A^T (A stored k×n), computes alpha*A^T*A + beta*C
 *
 * No dedicated kernel — this is `sgemmtr`'s exact kernel
 * (`sgemmtr_small.wgsl`/`sgemmtr_large.wgsl`) with `A` aliased into both
 * operand slots (`B := A`).
 *
 * {@includeCode ../../examples/ssyrk/ssyrk.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/ssyrk/web/ssyrk.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
 * @param trans  - `'no-transpose'` for A*A^T, `'transpose'` for A^T*A
 * @param n      - order of C (C is n×n); rows of op(A)
 * @param k      - columns of op(A) — the shared/contracted dimension
 * @param alpha  - scalar multiplier for op(A)*op(A)^T
 * @param A      - Float32Array, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param beta   - scalar multiplier for C
 * @param C      - Float32Array input/output matrix, row-major or column-major
 * @param ldc    - leading dimension of C as stored
 * @param layout - storage layout shared by A/C when they're Float32Array
 *   (default: `'row-major'`) — same handling as `sgemmtr`; column-major C
 *   flips `uplo` internally so it still names the triangle you asked for
 * @returns updated C as a Float32Array (only the requested triangle changed)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyrk/ssyrk.mjs#L21">Source code: ssyrk.mjs (L21)</a>
 * @category BLAS Level 3
 */
export declare function ssyrk(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  n: number,
  k: number,
  alpha: number,
  A: Float32Array,
  lda: number,
  beta: number,
  C: Float32Array,
  ldc: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ C: Float32Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric rank-k update $$C \leftarrow \mathrm{uplo}(\alpha \mathrm{op}(A) \mathrm{op}(A)^{T} + \beta C)$$
 *
 * A and C are both kept GPU-resident. Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A must be a GpuMatrix whenever C is, and vice
 * versa — mixing a GpuMatrix with a plain Float32Array is not supported.
 *
 * {@includeCode ../../examples/ssyrk/gpu.ssyrk.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
 * @param trans  - `'no-transpose'` for A*A^T, `'transpose'` for A^T*A
 * @param n      - order of C (C is n×n); rows of op(A)
 * @param k      - columns of op(A) — the shared/contracted dimension
 * @param alpha  - scalar multiplier for op(A)*op(A)^T
 * @param A      - GpuMatrix
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param beta   - scalar multiplier for C
 * @param C      - GpuMatrix (mutated in place; only the requested triangle changes)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @returns no C — it stays GPU-resident; call `C.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssyrk/ssyrk.mjs#L21">Source code: ssyrk.mjs (L21)</a>
 * @category BLAS Level 3
 */
export declare function ssyrk(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  n: number,
  k: number,
  alpha: number,
  A: GpuMatrix,
  lda: number,
  beta: number,
  C: GpuMatrix,
  ldc: number,
): Promise<{ gpuTimeMs?: number }>;
