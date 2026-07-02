import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the sum of absolute values of a vector: result = sum(|x[i]|)
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @returns absolute sum scalar — always a CPU readback, even for GpuVector inputs
 */
export declare function sasum(
  n: number,
  x: Float32Array,
  incx: number
): Promise<{ asum: number }>;

export declare function sasum(
  n: number,
  x: Float32Array,
  incx: number
): Promise<{ asum: number; gpuTimeMs: number }>;

export declare function sasum(
  n: number,
  x: GpuVector,
  incx: number
): Promise<{ asum: number }>;

export declare function sasum(
  n: number,
  x: GpuVector,
  incx: number
): Promise<{ asum: number; gpuTimeMs: number }>;
