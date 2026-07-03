import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Scales a single-precision vector by a constant: x = alpha * x
 *
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - input/output vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @returns scaled vector, or empty object if x is a GpuVector
 */
export declare function sscal(
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
): Promise<Float32Array>;

export declare function sscal(
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
): Promise<{ result: Float32Array; gpuTimeMs: number }>;

export declare function sscal(
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
): Promise<{}>;

export declare function sscal(
  n: number,
  alpha: number,
  x: GpuVector,
  incx: number,
): Promise<{ gpuTimeMs: number }>;
