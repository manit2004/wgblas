import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Applies a modified Givens plane rotation H to vectors x and y:
 *   x = H[0][0]*x + H[0][1]*y
 *   y = H[1][0]*x + H[1][1]*y
 *
 * {@includeCode ../../examples/srotm/srotm.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/srotm/web/srotm.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float32Array input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @param param - 5-element Float32Array: [flag, h11, h21, h12, h22]
 *   flag = -2: identity (no-op), -1: full H, 0: unit diagonal, 1: unit off-diagonal
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/srotm/srotm.mjs#L15">Source code: srotm.mjs (L15)</a>
 * @category BLAS Level 1
 */
export declare function srotm(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  param: Float32Array,
): Promise<{ x: Float32Array; y: Float32Array } | { x: Float32Array; y: Float32Array; gpuTimeMs: number }>;

/**
 * Applies a modified Givens plane rotation H to vectors x and y:
 *   x = H[0][0]*x + H[0][1]*y
 *   y = H[1][0]*x + H[1][1]*y
 *
 * {@includeCode ../../examples/srotm/gpuvec.srotm.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input/output vector (mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input/output vector (mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @param param - 5-element Float32Array: [flag, h11, h21, h12, h22]
 *   flag = -2: identity (no-op), -1: full H, 0: unit diagonal, 1: unit off-diagonal
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/srotm/srotm.mjs#L15">Source code: srotm.mjs (L15)</a>
 * @category BLAS Level 1
 */
export declare function srotm(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  param: Float32Array,
): Promise<{} | { gpuTimeMs: number }>;
