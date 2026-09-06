import { GpuVector } from "../classes/GpuVector.mjs";
import { Complex32, Complex32Array } from "../classes/Complex32.mjs";

/**
 * Scales a complex vector by a complex constant: $$x \leftarrow \alpha x$$
 *
 * {@includeCode ../../examples/cscal/cscal.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/cscal/web/cscal.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - complex scalar multiplier
 * @param x - Complex32Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/cscal/cscal.mjs">Source code: cscal.mjs</a>
 * @category BLAS Level 1
 */
export declare function cscal(
  device: GPUDevice,
  n: number,
  alpha: Complex32,
  x: Complex32Array,
  incx: number,
): Promise<{ x: Complex32Array } | { x: Complex32Array; gpuTimeMs: number }>;

/**
 * Scales a complex vector by a complex constant: $$x \leftarrow \alpha x$$
 *
 * {@includeCode ../../examples/cscal/gpu.cscal.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - complex scalar multiplier
 * @param x - Complex32Array-backed GpuVector input/output vector (mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/cscal/cscal.mjs">Source code: cscal.mjs</a>
 * @category BLAS Level 1
 */
export declare function cscal(
  device: GPUDevice,
  n: number,
  alpha: Complex32,
  x: GpuVector,
  incx: number,
): Promise<{} | { gpuTimeMs: number }>;
