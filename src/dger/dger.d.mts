import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Performs the rank-1 update $$A \leftarrow \alpha x y^{T} + A$$ in double
 * precision (double-double emulation — WGSL has no native f64 type).
 *
 * A is an m×n matrix stored in row-major order, updated in place. `lda` is
 * the leading dimension (number of doubles between the start of consecutive
 * rows — must be >= n).
 *
 * {@includeCode ../../examples/dger/dger.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dger/web/dger.html}
 *
 * @param device - GPUDevice from `init()`
 * @param m      - number of rows in A (length of x)
 * @param n      - number of columns in A (length of y)
 * @param alpha  - scalar multiplier for x*y^T
 * @param x      - Float64Array input vector, length at least (m-1)*incx+1
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - Float64Array input vector, length at least (n-1)*incy+1
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - Float64Array, row-major or column-major (see `layout`), at least
 *   (m-1)*lda+n elements for row-major or (n-1)*lda+m elements for column-major
 * @param lda    - leading dimension of A (>= n for row-major, >= m for column-major)
 * @param layout - storage layout of `A` (default: `'row-major'`)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dger/dger.mjs#L18">Source code: dger.mjs (L18)</a>
 * @category BLAS Level 2
 */
export declare function dger(
  device: GPUDevice,
  m: number,
  n: number,
  alpha: number,
  x: Float64Array,
  incx: number,
  y: Float64Array,
  incy: number,
  A: Float64Array,
  lda: number,
  layout?: 'row-major' | 'column-major',
): Promise<{ A: Float64Array; gpuTimeMs?: number }>;

/**
 * Performs the rank-1 update $$A \leftarrow \alpha x y^{T} + A$$ in double
 * precision (double-double emulation).
 *
 * x, y, and A are all kept resident on the GPU. `A`'s own `layout` (set at
 * `GpuMatrix.from` time) determines the operation — there is no separate
 * `layout` argument here.
 *
 * {@includeCode ../../examples/dger/gpu.dger.js}
 *
 * @param device - GPUDevice from `init()`
 * @param m      - number of rows in A
 * @param n      - number of columns in A
 * @param alpha  - scalar multiplier for x*y^T
 * @param x      - GpuVector input vector (Float64Array-backed, not mutated)
 * @param incx   - stride for x (must be a positive integer)
 * @param y      - GpuVector input vector (Float64Array-backed, not mutated)
 * @param incy   - stride for y (must be a positive integer)
 * @param A      - GpuMatrix (Float64Array-backed), mutated in place
 * @param lda    - leading dimension of A (must equal A.lda)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dger/dger.mjs#L18">Source code: dger.mjs (L18)</a>
 * @category BLAS Level 2
 */
export declare function dger(
  device: GPUDevice,
  m: number,
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  A: GpuMatrix,
  lda: number,
): Promise<{ gpuTimeMs?: number }>;
