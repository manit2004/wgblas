import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Applies a Givens plane rotation to vectors x and y:
 *   x = c*x + s*y
 *   y = -s*x + c*y
 *
 * @param n - number of elements (must be a positive integer)
 * @param x - input/output vector (Float32Array or GpuVector)
 * @param incx - stride for x (must be a positive integer)
 * @param y - input/output vector (Float32Array or GpuVector)
 * @param incy - stride for y (must be a positive integer)
 * @param c - cosine of rotation angle
 * @param s - sine of rotation angle
 */
export declare function srot(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  c: number,
  s: number
): Promise<{ x: Float32Array; y: Float32Array }>;

export declare function srot(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  c: number,
  s: number
): Promise<{ x: Float32Array; y: Float32Array; gpuTimeMs: number }>;

export declare function srot(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  c: number,
  s: number
): Promise<{}>;

export declare function srot(
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  c: number,
  s: number
): Promise<{ gpuTimeMs: number }>;
