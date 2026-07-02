import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Returns the 0-based index of the element with the largest absolute value.
 * Ties are broken in favour of the lower index, matching CBLAS behaviour.
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @returns 0-based index of max |x[i]|
 */
export declare function isamax(
  n: number,
  x: Float32Array,
  incx: number
): Promise<{ index: number }>;

export declare function isamax(
  n: number,
  x: Float32Array,
  incx: number
): Promise<{ index: number; gpuTimeMs: number }>;

export declare function isamax(
  n: number,
  x: GpuVector,
  incx: number
): Promise<{ index: number }>;

export declare function isamax(
  n: number,
  x: GpuVector,
  incx: number
): Promise<{ index: number; gpuTimeMs: number }>;
