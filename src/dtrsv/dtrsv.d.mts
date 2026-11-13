import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Solves the triangular system for $x$, in place — x holds b on input, the
 * solution on output, in double precision (double-double emulation — WGSL
 * has no native f64 type):
 * $$\mathrm{op}(A) x = b$$
 *
 * A is an n×n triangular matrix stored in row-major order. Only the triangle
 * specified by `uplo` is referenced; the other triangle is not accessed.
 *
 * **Infinity and NaN** land exactly where substitution-based BLAS (stdlib,
 * the reference BLAS) puts them for Float64Array calls: with a non-finite
 * value in b or A's referenced triangle, the solve uses substitution at any
 * size. GPU-resident data can't be checked without a readback, so it keeps
 * the faster blocked path above n = 128, where an Infinity in b that
 * reaches a later row of its 64-row block along several paths can give
 * ±Infinity where substitution gives NaN (Inf − Inf).
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/dtrsv/dtrsv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dtrsv/web/dtrsv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` to solve A*x=b, `'transpose'` to solve A^T*x=b
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A (number of rows and columns)
 * @param A      - Float64Array, row-major or column-major (see `layout`), at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n either way — A is square)
 * @param x      - Float64Array holding b on input, the solution on output; length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param layout - storage layout of `A` (default: `'row-major'`); column-major
 *   flips both the stored triangle and the effective `trans` (the system
 *   being solved stays what you asked for either way)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrsv/dtrsv.mjs#L48">Source code: dtrsv.mjs (L48)</a>
 * @category BLAS Level 2
 */
export declare function dtrsv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: Float64Array,
  lda: number,
  x: Float64Array,
  incx: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ x: Float64Array; gpuTimeMs?: number }>;

/**
 * Solves the triangular system for $x$, in place, in double precision
 * (double-double emulation):
 * $$\mathrm{op}(A) x = b$$
 *
 * x is kept resident on the GPU (mutated in place). A must be a GpuMatrix
 * (Float64Array-backed); its own `layout` (set at `GpuMatrix.from` time)
 * determines the operation — there is no separate `layout` argument here.
 *
 * **Infinity and NaN** land exactly where substitution-based BLAS (stdlib,
 * the reference BLAS) puts them for Float64Array calls: with a non-finite
 * value in b or A's referenced triangle, the solve uses substitution at any
 * size. GPU-resident data can't be checked without a readback, so it keeps
 * the faster blocked path above n = 128, where an Infinity in b that
 * reaches a later row of its 64-row block along several paths can give
 * ±Infinity where substitution gives NaN (Inf − Inf).
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU) — including elements of
 * an output array the routine never touches (stride gaps, padding, an
 * unreferenced triangle) — and a result or intermediate past ±3.4e38
 * overflows to ±Infinity, where real f64 would stay finite.
 *
 * {@includeCode ../../examples/dtrsv/gpu.dtrsv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` to solve A*x=b, `'transpose'` to solve A^T*x=b
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A
 * @param A      - GpuMatrix (Float64Array-backed), GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector (Float64Array-backed) holding b on input, the solution on output (mutated in place)
 * @param incx   - stride for x (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dtrsv/dtrsv.mjs#L48">Source code: dtrsv.mjs (L48)</a>
 * @category BLAS Level 2
 */
export declare function dtrsv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: GpuMatrix,
  lda: number,
  x: GpuVector,
  incx: number,
): Promise<{ gpuTimeMs?: number }>;
