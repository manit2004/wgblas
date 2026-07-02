import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Swaps the elements of two single-precision vectors: x <-> y
 *
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - first input/output vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @param y - second input/output vector (Float32Array or GpuVector)
 * @param incy - stride for y (must be a positive integer)
 * @returns swapped vectors, or empty object if inputs are GpuVectors
 */
export declare function sswap(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ x: Float32Array; y: Float32Array }>;

export declare function sswap(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ x: Float32Array; y: Float32Array; gpuTimeMs: number }>;

export declare function sswap(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number
): Promise<{}>;

export declare function sswap(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number
): Promise<{ gpuTimeMs: number }>;
