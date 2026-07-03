import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Scales a single-precision vector by a constant: x = alpha * x
 *
 * {@includeCode ../../examples/sscal/sscal.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - Float32Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @see [sscal.mjs](https://github.com/manit2004/wgblas/blob/main/src/sscal/sscal.mjs/L15-L68)
 * @category BLAS Level 1
 */
export declare function sscal(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
): Promise<Float32Array | { result: Float32Array; gpuTimeMs: number }>;

/**
 * Scales a single-precision vector by a constant: x = alpha * x
 *
 * {@includeCode ../../examples/sscal/gpuvec.sscal.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - GpuVector input/output vector (mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @see [sscal.mjs](https://github.com/manit2004/wgblas/blob/main/src/sscal/sscal.mjs)
 * @category BLAS Level 1
 */
export declare function sscal(
  device: GPUDevice,
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
): Promise<{} | { gpuTimeMs: number }>;
