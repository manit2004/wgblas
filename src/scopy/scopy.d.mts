import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Performs the operation y = x
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @param y - output vector (Float32Array or GpuVector)
 * @param incy - stride for y (must be a positive integer)
 * @returns updated y vector, or empty object if y is a GpuVector
 */
export declare function scopy(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ y: Float32Array }>;

export declare function scopy(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ y: Float32Array; gpuTimeMs: number }>;

export declare function scopy(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number
): Promise<{}>;

export declare function scopy(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number
): Promise<{ gpuTimeMs: number }>;
