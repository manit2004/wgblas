import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric matrix-matrix operation
 * C := alpha * A * B + beta * C (`side='left'`) or
 * C := alpha * B * A + beta * C (`side='right'`) — `A` is symmetric, only
 * its `uplo` triangle stored; `B` and `C` are general m×n matrices.
 *
 * - `side='left'`:  `A` is m×m — `A` premultiplies `B`
 * - `side='right'`: `A` is n×n — `A` postmultiplies `B`
 *
 * No dedicated fused kernel — a `symmetrize` pass materializes a dense
 * copy of `A` (mirroring the unstored triangle), then a plain `sgemm`
 * pass (`sgemm_small.wgsl`/`sgemm_large.wgsl`, unmodified) does the
 * actual multiply, both on one command encoder.
 *
 * {@includeCode ../../examples/ssymm/ssymm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/ssymm/web/ssymm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for A*B, `'right'` for B*A
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param m      - rows of B and C
 * @param n      - columns of B and C
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - Float32Array, symmetric, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float32Array, row-major or column-major (see `layout`)
 * @param ldb    - leading dimension of B as stored
 * @param beta   - scalar multiplier for C
 * @param C      - Float32Array input/output matrix, row-major or column-major
 * @param ldc    - leading dimension of C as stored
 * @param layout - storage layout shared by A/B/C when they're Float32Array
 *   (default: `'row-major'`) — column-major A keeps representing the same
 *   symmetric matrix but flips which physical triangle looks stored, so
 *   `uplo` is adjusted internally to compensate
 * @returns updated C as a Float32Array
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssymm/ssymm.mjs#L23">Source code: ssymm.mjs (L23)</a>
 * @category BLAS Level 3
 */
export declare function ssymm(
  device: GPUDevice,
  side: 'left' | 'right',
  uplo: 'lower' | 'upper',
  m: number,
  n: number,
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
 * Performs the symmetric matrix-matrix operation
 * C := alpha * A * B + beta * C (`side='left'`) or
 * C := alpha * B * A + beta * C (`side='right'`)
 *
 * A, B, and C are all kept GPU-resident. Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A and B must be GpuMatrix whenever C is, and vice
 * versa — mixing a GpuMatrix with a plain Float32Array is not supported.
 *
 * {@includeCode ../../examples/ssymm/gpu.ssymm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param side   - `'left'` for A*B, `'right'` for B*A
 * @param uplo   - `'lower'` if only `A`'s lower triangle is stored, `'upper'` for upper
 * @param m      - rows of B and C
 * @param n      - columns of B and C
 * @param alpha  - scalar multiplier for the matrix product
 * @param A      - GpuMatrix, symmetric
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @param beta   - scalar multiplier for C
 * @param C      - GpuMatrix (mutated in place)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @returns no C — it stays GPU-resident; call `C.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/ssymm/ssymm.mjs#L23">Source code: ssymm.mjs (L23)</a>
 * @category BLAS Level 3
 */
export declare function ssymm(
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
