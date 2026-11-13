import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric matrix-matrix operation
 * $$C \leftarrow \alpha A B + \beta C \quad (\texttt{side='left'})$$
 * $$C \leftarrow \alpha B A + \beta C \quad (\texttt{side='right'})$$
 * in double precision (double-double emulation — WGSL has no native f64 type).
 * `A` is symmetric, only its `uplo` triangle stored; `B` and `C` are general
 * m×n matrices.
 *
 * - `side='left'`:  `A` is m×m — `A` premultiplies `B`
 * - `side='right'`: `A` is n×n — `A` postmultiplies `B`
 *
 * No dedicated fused kernel — a `symmetrize` pass over each half of the
 * double-double pair materializes a dense copy of `A` (mirroring the
 * unstored triangle), then `dgemm`'s kernel (`dgemm_small.wgsl`) does the
 * actual multiply, all on one command encoder.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/dsymm/dsymm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dsymm/web/dsymm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for A*B, `'right'` for B*A
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param m      - rows of B and C
 * @param n      - columns of B and C
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - Float64Array, symmetric, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float64Array, row-major or column-major (see `layout`)
 * @param ldb    - leading dimension of B as stored
 * @param beta   - scalar multiplier for C
 * @param C      - Float64Array input/output matrix, row-major or column-major
 * @param ldc    - leading dimension of C as stored
 * @param layout - storage layout shared by A/B/C when they're Float64Array
 *   (default: `'row-major'`) — column-major A keeps representing the same
 *   symmetric matrix but flips which physical triangle looks stored, so
 *   `uplo` is adjusted internally to compensate
 * @returns updated C as a Float64Array
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsymm/dsymm.mjs#L26">Source code: dsymm.mjs (L26)</a>
 * @category BLAS Level 3
 */
export declare function dsymm(
  device: GPUDevice,
  side: 'left' | 'right',
  uplo: 'lower' | 'upper',
  m: number,
  n: number,
  alpha: number,
  A: Float64Array,
  lda: number,
  B: Float64Array,
  ldb: number,
  beta: number,
  C: Float64Array,
  ldc: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ C: Float64Array; gpuTimeMs?: number }>;

/**
 * Performs the symmetric matrix-matrix operation
 * $$C \leftarrow \alpha A B + \beta C \quad (\texttt{side='left'})$$
 * $$C \leftarrow \alpha B A + \beta C \quad (\texttt{side='right'})$$
 * in double precision (double-double emulation).
 *
 * A, B, and C are all kept GPU-resident (Float64Array-backed GpuMatrix). Each
 * matrix's own `layout` (set at `GpuMatrix.from` time) determines the
 * operation — there is no separate `layout` argument here. A and B must be
 * GpuMatrix whenever C is, and vice versa — mixing a GpuMatrix with a plain
 * Float64Array is not supported.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/dsymm/gpu.dsymm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for A*B, `'right'` for B*A
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param m      - rows of B and C
 * @param n      - columns of B and C
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - GpuMatrix (Float64Array-backed), symmetric
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix (Float64Array-backed)
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @param beta   - scalar multiplier for C
 * @param C      - GpuMatrix (Float64Array-backed, mutated in place)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @returns no C — it stays GPU-resident; call `C.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsymm/dsymm.mjs#L26">Source code: dsymm.mjs (L26)</a>
 * @category BLAS Level 3
 */
export declare function dsymm(
  device: GPUDevice,
  side: 'left' | 'right',
  uplo: 'lower' | 'upper',
  m: number,
  n: number,
  alpha: number,
  A: GpuMatrix,
  lda: number,
  B: GpuMatrix,
  ldb: number,
  beta: number,
  C: GpuMatrix,
  ldc: number,
): Promise<{ gpuTimeMs?: number }>;
