import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the Euclidean norm of a vector: result = sqrt(sum(x[i] * x[i]))
 *
 * {@includeCode ../../examples/snrm2/snrm2.js}
 *
 * **Browser (standalone HTML):**
 * {@includeCode ../../examples/snrm2/web/snrm2.html}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns Euclidean norm scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/snrm2/snrm2.mjs#L18">Source code: snrm2.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function snrm2(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
): Promise<{ nrm2: number } | { nrm2: number; gpuTimeMs: number }>;

/**
 * Computes the Euclidean norm of a vector: result = sqrt(sum(x[i] * x[i]))
 *
 * {@includeCode ../../examples/snrm2/gpu.snrm2.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns Euclidean norm scalar — always a CPU readback, even for GpuVector inputs
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/snrm2/snrm2.mjs#L18">Source code: snrm2.mjs (L18)</a>
 * @category BLAS Level 1
 */
export declare function snrm2(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
): Promise<{ nrm2: number } | { nrm2: number; gpuTimeMs: number }>;
