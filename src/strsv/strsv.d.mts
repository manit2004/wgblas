import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Solves the triangular system for $x$, in place — x holds b on input, the
 * solution on output:
 * $$\mathrm{op}(A) x = b$$
 *
 * A is an n×n triangular matrix stored in row-major order. Only the triangle
 * specified by `uplo` is referenced; the other triangle is not accessed.
 *
 * {@includeCode ../../examples/strsv/strsv.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/strsv/web/strsv.html}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` to solve A*x=b, `'transpose'` to solve A^T*x=b
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A (number of rows and columns)
 * @param A      - Float32Array, row-major or column-major (see `layout`), at least (n-1)*lda+n elements
 * @param lda    - leading dimension of A (>= n either way — A is square)
 * @param x      - Float32Array holding b on input, the solution on output; length at least (n-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param layout - storage layout of `A` (default: `'row-major'`); column-major
 *   flips both the stored triangle and the effective `trans` (the system
 *   being solved stays what you asked for either way)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strsv/strsv.mjs#L15">Source code: strsv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function strsv(
  device: GPUDevice,
  uplo: 'lower' | 'upper',
  trans: 'no-transpose' | 'transpose',
  diag: 'unit' | 'non-unit',
  n: number,
  A: Float32Array,
  lda: number,
  x: Float32Array,
  incx: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ x: Float32Array; gpuTimeMs?: number }>;

/**
 * Solves the triangular system for $x$, in place:
 * $$\mathrm{op}(A) x = b$$
 *
 * x is kept resident on the GPU (mutated in place). A must be a GpuMatrix;
 * its own `layout` (set at `GpuMatrix.from` time) determines the operation —
 * there is no separate `layout` argument here.
 *
 * {@includeCode ../../examples/strsv/gpu.strsv.js}
 *
 * @param device - GPUDevice from `init()`
 * @param uplo   - `'lower'` to use the lower triangle, `'upper'` to use the upper triangle
 * @param trans  - `'no-transpose'` to solve A*x=b, `'transpose'` to solve A^T*x=b
 * @param diag   - `'unit'` to treat the diagonal as all-ones (A's diagonal is not read), `'non-unit'` to read it
 * @param n      - order of the matrix A
 * @param A      - GpuMatrix, GPU-resident
 * @param lda    - leading dimension of A (must equal A.lda)
 * @param x      - GpuVector holding b on input, the solution on output (mutated in place)
 * @param incx   - stride for x (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/strsv/strsv.mjs#L15">Source code: strsv.mjs (L15)</a>
 * @category BLAS Level 2
 */
export declare function strsv(
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
