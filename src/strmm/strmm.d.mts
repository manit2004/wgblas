import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the triangular matrix-matrix operation
 * B := alpha * op(A) * B (`side='left'`) or
 * B := alpha * B * op(A) (`side='right'`) — `A` is triangular, only its
 * `uplo` triangle stored; `B` is a general m×n matrix, overwritten in place.
 *
 * - `side='left'`:  `A` is m×m — `A` premultiplies `B`
 * - `side='right'`: `A` is n×n — `A` postmultiplies `B`
 *
 * No dedicated fused kernel — a `triangularize` pass materializes a dense
 * copy of `op(A)` (zero-filling the unstored triangle, substituting the
 * implicit diagonal when `diag='unit'`), then a plain `sgemm` pass
 * (`sgemm_small.wgsl`/`sgemm_large.wgsl`, unmodified) does the actual
 * multiply, both on one command encoder.
 *
 * {@includeCode ../../examples/strmm/strmm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/strmm/web/strmm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for op(A)*B, `'right'` for B*op(A)
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - Float32Array, triangular, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float32Array input/output matrix, overwritten with the result, row-major or column-major
 * @param ldb    - leading dimension of B as stored
 * @param layout - storage layout shared by A/B when they're Float32Array
 *   (default: `'row-major'`) — column-major A is a genuine transpose (A isn't
 *   symmetric like ssymm's), so both `transA` and `uplo` are adjusted
 *   internally to compensate
 * @returns updated B as a Float32Array
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strmm/strmm.mjs#L25">Source code: strmm.mjs (L25)</a>
 * @category BLAS Level 3
 */
export declare function strmm(
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
 * Performs the triangular matrix-matrix operation
 * B := alpha * op(A) * B (`side='left'`) or
 * B := alpha * B * op(A) (`side='right'`)
 *
 * A and B are both kept GPU-resident; B is mutated in place. Each matrix's
 * own `layout` (set at `GpuMatrix.from` time) determines the operation —
 * there is no separate `layout` argument here. A and B must both be
 * GpuMatrix or both be Float32Array — mixing is not supported.
 *
 * {@includeCode ../../examples/strmm/gpu.strmm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for op(A)*B, `'right'` for B*op(A)
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param transA - `'no-transpose'` for A, `'transpose'` for A^T
 * @param diag   - `'unit'` to treat A's diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param m      - rows of B
 * @param n      - columns of B
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - GpuMatrix, triangular
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix (mutated in place)
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @returns no B — it stays GPU-resident; call `B.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strmm/strmm.mjs#L25">Source code: strmm.mjs (L25)</a>
 * @category BLAS Level 3
 */
export declare function strmm(
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
