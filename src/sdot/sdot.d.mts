import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the dot product of two vectors: result = sum(x[i] * y[i])
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @param y - input vector (Float32Array or GpuVector)
 * @param incy - stride for y (must be a positive integer)
 * @returns dot product scalar — always a CPU readback, even for GpuVector inputs
 */
export declare function sdot(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ dot: number }>;

export declare function sdot(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ dot: number; gpuTimeMs: number }>;

export declare function sdot(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number
): Promise<{ dot: number }>;

export declare function sdot(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number
): Promise<{ dot: number; gpuTimeMs: number }>;
