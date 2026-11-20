import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Solves the triangular matrix equation
 * $$\mathrm{op}(A) X = \alpha B \quad (\texttt{side='left'})$$
 * $$X \mathrm{op}(A) = \alpha B \quad (\texttt{side='right'})$$
 * in double precision (double-double emulation — WGSL has no native f64
 * type), overwriting `B` with the solution `X` — `A` is triangular, only its
 * `uplo` triangle stored; `B` is a general m×n matrix.
 *
 * - `side='left'`:  `A` is m×m — solves `op(A)*X = alpha*B`
 * - `side='right'`: `A` is n×n — solves `X*op(A) = alpha*B`
 *
 * Blocked over 64-row diagonal blocks, all in one compute pass: each block
 * is solved by substitution in place on `B`, then `dgemm`'s kernel
 * (`dgemm_small.wgsl`) applies the trailing update to the rows (columns, for
 * `side='right'`) still to solve. A single block (order <= 64) is one
 * dispatch. A near-zero diagonal entry amplifies error, same as any
 * triangular solve.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU), and a result or
 * intermediate past ±3.4e38 overflows to ±Infinity, where real f64 would
 * stay finite.
 *
 * {@includeCode ../../examples/dtrsm/dtrsm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dtrsm/web/dtrsm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` to solve op(A)*X=alpha*B, `'right'` to solve X*op(A)=alpha*B
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for B
 * @param A      - Float64Array, triangular, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float64Array input/output matrix, overwritten with the solution, row-major or column-major
 * @param ldb    - leading dimension of B as stored
 * @param layout - storage layout shared by A/B when they're Float64Array
 *   (default: `'row-major'`) — column-major A is a genuine transpose (A isn't
 *   symmetric like dsymm's), so both `transA` and `uplo` are adjusted
 *   internally to compensate
 * @returns the solution X, written into B, as a Float64Array
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrsm/dtrsm.mjs#L48">Source code: dtrsm.mjs (L48)</a>
 * @category BLAS Level 3
 */
export declare function dtrsm(
  device: GPUDevice,
  side: 'left' | 'right',
  uplo: 'lower' | 'upper',
  transA: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  m: number,
  n: number,
  alpha: number,
  A: Float64Array,
  lda: number,
  B: Float64Array,
  ldb: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ B: Float64Array; gpuTimeMs?: number }>;

/**
 * Solves the triangular matrix equation
 * $$\mathrm{op}(A) X = \alpha B \quad (\texttt{side='left'})$$
 * $$X \mathrm{op}(A) = \alpha B \quad (\texttt{side='right'})$$
 * in double precision, overwriting `B` in place with `X`.
 *
 * A and B are both kept GPU-resident (Float64Array-backed GpuMatrix). Each
 * matrix's own `layout` (set at `GpuMatrix.from` time) determines the
 * operation — there is no separate `layout` argument here. A and B must both
 * be GpuMatrix or both be Float64Array — mixing is not supported.
 *
 * {@includeCode ../../examples/dtrsm/gpu.dtrsm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` to solve op(A)*X=alpha*B, `'right'` to solve X*op(A)=alpha*B
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for B
 * @param A      - GpuMatrix (Float64Array-backed), triangular
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix (Float64Array-backed), overwritten in place with the solution
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @returns no B — it stays GPU-resident; call `B.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrsm/dtrsm.mjs#L48">Source code: dtrsm.mjs (L48)</a>
 * @category BLAS Level 3
 */
export declare function dtrsm(
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
