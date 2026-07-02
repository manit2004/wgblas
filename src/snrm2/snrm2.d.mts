import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the Euclidean norm of a vector: result = sqrt(sum(x[i] * x[i]))
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @returns Euclidean norm scalar — always a CPU readback, even for GpuVector inputs
 */
export declare function snrm2(
  n: number,
  x: Float32Array,
  incx: number
): Promise<{ nrm2: number }>;

export declare function snrm2(
  n: number,
  x: Float32Array,
  incx: number
): Promise<{ nrm2: number; gpuTimeMs: number }>;

export declare function snrm2(
  n: number,
  x: GpuVector,
  incx: number
): Promise<{ nrm2: number }>;

export declare function snrm2(
  n: number,
  x: GpuVector,
  incx: number
): Promise<{ nrm2: number; gpuTimeMs: number }>;
