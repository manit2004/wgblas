import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Computes the sum of absolute values of a vector: result = sum(|x[i]|)
 *
 * {@includeCode ../../examples/sasum/sasum.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns absolute sum scalar — always a CPU readback, even for GpuVector inputs
 * @see [Source code: sasum.mjs](https://github.com/manit2004/wgblas/blob/main/src/sasum/sasum.mjs#L18-L96)
 * @category BLAS Level 1
 */
export declare function sasum(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
): Promise<{ asum: number } | { asum: number; gpuTimeMs: number }>;

/**
 * Computes the sum of absolute values of a vector: result = sum(|x[i]|)
 *
 * {@includeCode ../../examples/sasum/gpuvec.sasum.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input vector
 * @param incx - stride for x (must be a positive integer)
 * @returns absolute sum scalar — always a CPU readback, even for GpuVector inputs
 * @see [Source code: sasum.mjs](https://github.com/manit2004/wgblas/blob/main/src/sasum/sasum.mjs)
 * @category BLAS Level 1
 */
export declare function sasum(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
): Promise<{ asum: number } | { asum: number; gpuTimeMs: number }>;
