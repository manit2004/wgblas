import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the triangular matrix-matrix operation
 * $$B \leftarrow \alpha \mathrm{op}(A) B \quad (\texttt{side='left'})$$
 * $$B \leftarrow \alpha B \mathrm{op}(A) \quad (\texttt{side='right'})$$
 * in double precision (double-double emulation — WGSL has no native f64 type).
 * `A` is triangular, only its `uplo` triangle stored; `B` is a general m×n
 * matrix, overwritten with the result.
 *
 * - `side='left'`:  `A` is m×m — `A` premultiplies `B`
 * - `side='right'`: `A` is n×n — `A` postmultiplies `B`
 *
 * No dedicated fused kernel — a `triangularize` pass over each half of the
 * double-double pair materializes a dense copy of `op(A)` (zero-filling the
 * unstored triangle, substituting the implicit diagonal when `diag='unit'`),
 * then `dgemm`'s kernel (`dgemm_small.wgsl`) does the multiply, all on one
 * command encoder.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding) — and a
 * result or intermediate past ±3.4e38 overflows to ±Infinity, where real
 * f64 would stay finite.
 *
 * {@includeCode ../../examples/dtrmm/dtrmm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dtrmm/web/dtrmm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for op(A)*B, `'right'` for B*op(A)
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - Float64Array, triangular, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float64Array input/output matrix, row-major or column-major
 * @param ldb    - leading dimension of B as stored
 * @param layout - storage layout shared by A/B when they're Float64Array
 *   (default: `'row-major'`) — column-major A is a genuine transpose (A isn't
 *   symmetric like dsymm's), so both `transA` and `uplo` are adjusted
 *   internally to compensate
 * @returns updated B as a new Float64Array (the input array is not modified)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrmm/dtrmm.mjs#L28">Source code: dtrmm.mjs (L28)</a>
 * @category BLAS Level 3
 */
export declare function dtrmm(
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
 * Performs the triangular matrix-matrix operation
 * $$B \leftarrow \alpha \mathrm{op}(A) B \quad (\texttt{side='left'})$$
 * $$B \leftarrow \alpha B \mathrm{op}(A) \quad (\texttt{side='right'})$$
 * in double precision (double-double emulation).
 *
 * A and B are both kept GPU-resident (Float64Array-backed GpuMatrix); B is
 * mutated in place. Each matrix's own `layout` (set at `GpuMatrix.from`
 * time) determines the operation — there is no separate `layout` argument
 * here. A and B must both be GpuMatrix or both be Float64Array — mixing is
 * not supported.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding) — and a
 * result or intermediate past ±3.4e38 overflows to ±Infinity, where real
 * f64 would stay finite.
 *
 * {@includeCode ../../examples/dtrmm/gpu.dtrmm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for op(A)*B, `'right'` for B*op(A)
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - GpuMatrix (Float64Array-backed), triangular
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix (Float64Array-backed, mutated in place)
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @returns no B — it stays GPU-resident; call `B.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrmm/dtrmm.mjs#L28">Source code: dtrmm.mjs (L28)</a>
 * @category BLAS Level 3
 */
export declare function dtrmm(
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
