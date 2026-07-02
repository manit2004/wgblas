import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Applies a modified Givens plane rotation H to vectors x and y:
 *   x = H[0][0]*x + H[0][1]*y
 *   y = H[1][0]*x + H[1][1]*y
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input/output vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @param y - input/output vector (Float32Array or GpuVector)
 * @param incy - stride for y (must be a positive integer)
 * @param param - 5-element Float32Array: [flag, h11, h21, h12, h22]
 *   flag = -2: identity (no-op), -1: full H, 0: unit diagonal, 1: unit off-diagonal
 */
export declare function srotm(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  param: Float32Array
): Promise<{ x: Float32Array; y: Float32Array }>;

export declare function srotm(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  param: Float32Array
): Promise<{ x: Float32Array; y: Float32Array; gpuTimeMs: number }>;

export declare function srotm(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  param: Float32Array
): Promise<{}>;

export declare function srotm(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  param: Float32Array
): Promise<{ gpuTimeMs: number }>;
