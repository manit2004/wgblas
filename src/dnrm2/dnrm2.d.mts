import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the Euclidean norm of a double-precision vector:
 * $$\text{result} = \sqrt{\sum_{i} x_i^2}$$
 * — double-double (Dekker) f64 emulation of {@link snrm2}, since WGSL has
 * no native f64 type.
 *
 * {@includeCode ../../examples/dnrm2/dnrm2.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/dnrm2/web/dnrm2.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float64Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns Euclidean norm scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dnrm2/dnrm2.mjs#L21">Source code: dnrm2.mjs (L21)</a>
 * @category BLAS Level 1
 */
export declare function dnrm2(
  device: GPUDevice,
  n: number,
  x: Float64Array,
  incx: number,
): Promise<{ nrm2: number } | { nrm2: number; gpuTimeMs: number }>;

/**
 * Computes the Euclidean norm of a double-precision vector:
 * $$\text{result} = \sqrt{\sum_{i} x_i^2}$$
 * — GPU-resident overload; see the Float64Array overload above for the
 * routine itself.
 *
 * {@includeCode ../../examples/dnrm2/gpu.dnrm2.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector (must be Float64Array-backed)
 * @param incx - stride for x (must be a positive integer)
 * @returns Euclidean norm scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/dnrm2/dnrm2.mjs#L21">Source code: dnrm2.mjs (L21)</a>
 * @category BLAS Level 1
 */
export declare function dnrm2(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
): Promise<{ nrm2: number } | { nrm2: number; gpuTimeMs: number }>;
