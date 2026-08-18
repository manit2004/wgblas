import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Solves the triangular matrix equation
 * op(A) * X = alpha * B (`side='left'`) or
 * X * op(A) = alpha * B (`side='right'`), overwriting `B` with the
 * solution `X` — `A` is triangular, only its `uplo` triangle stored; `B` is
 * a general m×n matrix.
 *
 * - `side='left'`:  `A` is m×m — solves `op(A)*X = alpha*B`
 * - `side='right'`: `A` is n×n — solves `X*op(A) = alpha*B`
 *
 * Blocked substitution (strsv's own technique, generalized to a matrix
 * RHS): strsv_invert_block + sgemm, both unmodified. A near-zero diagonal
 * entry amplifies error, same as any triangular solve.
 *
 * {@includeCode ../../examples/strsm/strsm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/strsm/web/strsm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` to solve op(A)*X=alpha*B, `'right'` to solve X*op(A)=alpha*B
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for B
 * @param A      - Float32Array, triangular, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float32Array input/output matrix, overwritten with the solution, row-major or column-major
 * @param ldb    - leading dimension of B as stored
 * @param layout - storage layout shared by A/B when they're Float32Array
 *   (default: `'row-major'`) — column-major A is a genuine transpose (A isn't
 *   symmetric like ssymm's), so both `transA` and `uplo` are adjusted
 *   internally to compensate
 * @returns the solution X, written into B, as a Float32Array
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strsm/strsm.mjs#L25">Source code: strsm.mjs (L25)</a>
 * @category BLAS Level 3
 */
export declare function strsm(
  device: GPUDevice,
  side: 'left' | 'right',
  uplo: 'lower' | 'upper',
  transA: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  m: number,
  n: number,
  alpha: number,
  A: Float32Array,
  lda: number,
  B: Float32Array,
  ldb: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ B: Float32Array; gpuTimeMs?: number }>;

/**
 * Solves the triangular matrix equation
 * op(A) * X = alpha * B (`side='left'`) or
 * X * op(A) = alpha * B (`side='right'`), overwriting `B` in place with `X`.
 *
 * A and B are both kept GPU-resident. Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A and B must both be GpuMatrix or both be
 * Float32Array — mixing is not supported.
 *
 * {@includeCode ../../examples/strsm/gpu.strsm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` to solve op(A)*X=alpha*B, `'right'` to solve X*op(A)=alpha*B
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for B
 * @param A      - GpuMatrix, triangular
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix (overwritten in place with the solution)
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @returns no B — it stays GPU-resident; call `B.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strsm/strsm.mjs#L25">Source code: strsm.mjs (L25)</a>
 * @category BLAS Level 3
 */
export declare function strsm(
  device: GPUDevice,
  side: 'left' | 'right',
  uplo: 'lower' | 'upper',
  transA: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  m: number,
  n: number,
  alpha: number,
  A: GpuMatrix,
  lda: number,
  B: GpuMatrix,
  ldb: number,
): Promise<{ gpuTimeMs?: number }>;
