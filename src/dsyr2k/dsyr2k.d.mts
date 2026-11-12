import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the symmetric rank-2k update
 * $$C \leftarrow \mathrm{uplo}(\alpha \mathrm{op}(A) \mathrm{op}(B)^{T} + \alpha \mathrm{op}(B) \mathrm{op}(A)^{T} + \beta C)$$
 * in double precision (double-double emulation — WGSL has no native f64 type).
 *
 * Only the triangle of C named by `uplo` is read or written (`'lower'`:
 * `col <= row`, `'upper'`: `col >= row`). C is always n×n.
 *
 * - `trans='no-transpose'`: op(A) = A, op(B) = B (both n×k)
 * - `trans='transpose'`:    op(A) = A^T, op(B) = B^T (A, B stored k×n)
 *
 * No dedicated kernel — two passes of `dgemm`'s kernel in triangle mode
 * (`dgemm_small.wgsl`) on one command encoder, the
 * second accumulating with `beta=1` so C never leaves the GPU between them.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/dsyr2k/dsyr2k.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dsyr2k/web/dsyr2k.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
 * @param trans  - `'no-transpose'` for A*B^T + B*A^T, `'transpose'` for A^T*B + B^T*A
 * @param n      - order of C (C is n×n); rows of op(A) and op(B)
 * @param k      - columns of op(A) and op(B) — the shared/contracted dimension
 * @param alpha  - scalar multiplier for both rank-k terms
 * @param A      - Float64Array, row-major or column-major (see `layout`)
 * @param lda    - leading dimension of A as stored
 * @param B      - Float64Array, row-major or column-major (see `layout`)
 * @param ldb    - leading dimension of B as stored
 * @param beta   - scalar multiplier for C
 * @param C      - Float64Array input/output matrix, row-major or column-major
 * @param ldc    - leading dimension of C as stored
 * @param layout - storage layout shared by A/B/C when they're Float64Array
 *   (default: `'row-major'`) — same handling as `dgemmtr`; column-major C
 *   flips `uplo` internally so it still names the triangle you asked for
 * @returns updated C as a Float64Array (only the requested triangle changed)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsyr2k/dsyr2k.mjs#L30">Source code: dsyr2k.mjs (L30)</a>
 * @category BLAS Level 3
 */
export declare function dsyr2k(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  n: number,
  k: number,
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
 * Performs the symmetric rank-2k update
 * $$C \leftarrow \mathrm{uplo}(\alpha \mathrm{op}(A) \mathrm{op}(B)^{T} + \alpha \mathrm{op}(B) \mathrm{op}(A)^{T} + \beta C)$$
 * in double precision (double-double emulation).
 *
 * A, B, and C are all kept GPU-resident (Float64Array-backed GpuMatrix). Each matrix's own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here. A and B must be GpuMatrix whenever C is, and vice
 * versa — mixing a GpuMatrix with a plain Float64Array is not supported.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/dsyr2k/gpu.dsyr2k.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to update only `col <= row`, `'upper'` for `col >= row`
 * @param trans  - `'no-transpose'` for A*B^T + B*A^T, `'transpose'` for A^T*B + B^T*A
 * @param n      - order of C (C is n×n); rows of op(A) and op(B)
 * @param k      - columns of op(A) and op(B) — the shared/contracted dimension
 * @param alpha  - scalar multiplier for both rank-k terms
 * @param A      - GpuMatrix (Float64Array-backed)
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param B      - GpuMatrix (Float64Array-backed)
 * @param ldb    - leading dimension of B (must equal B.lda)
 * @param beta   - scalar multiplier for C
 * @param C      - GpuMatrix (Float64Array-backed, mutated in place; only the requested triangle changes)
 * @param ldc    - leading dimension of C (must equal C.lda)
 * @returns no C — it stays GPU-resident; call `C.read()` yourself for a CPU readback (see the example)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dsyr2k/dsyr2k.mjs#L30">Source code: dsyr2k.mjs (L30)</a>
 * @category BLAS Level 3
 */
export declare function dsyr2k(
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
