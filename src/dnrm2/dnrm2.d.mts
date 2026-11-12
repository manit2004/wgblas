import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the Euclidean norm of a double-precision vector:
 * $$\text{result} = \sqrt{\sum_{i} x_i^2}$$
 * — double-double (Dekker) f64 emulation of {@link snrm2}, since WGSL has
 * no native f64 type.
 *
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU), and a result or
 * intermediate past ±3.4e38 overflows to ±Infinity, where real f64 would
 * stay finite.
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
 * **Range:** double-double keeps its leading part in an f32, so it has
 * ~48 bits of precision but f32's exponent range. A double beyond ±3.4e38
 * reads as ±Infinity and one below ~1.2e-38 in magnitude as 0 (f32
 * subnormals may flush too, depending on the GPU), and a result or
 * intermediate past ±3.4e38 overflows to ±Infinity, where real f64 would
 * stay finite.
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
