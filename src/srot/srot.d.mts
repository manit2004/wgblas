import { GpuVector } from "../classes/GpuVector.mjs";

/**
 * Applies a Givens plane rotation to vectors x and y:
 *   x = c*x + s*y
 *   y = -s*x + c*y
 *
 * {@includeCode ../../examples/srot/srot.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - Float32Array input/output vector
 * @param incx - stride for x (must be a positive integer)
 * @param y - Float32Array input/output vector
 * @param incy - stride for y (must be a positive integer)
 * @param c - cosine of rotation angle
 * @param s - sine of rotation angle
 * @see [Source code: srot.mjs](https://github.com/manit2004/wgblas/blob/main/src/srot/srot.mjs#L15-L91)
 * @category BLAS Level 1
 */
export declare function srot(
  device: GPUDevice,
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number,
  c: number,
  s: number,
): Promise<{ x: Float32Array; y: Float32Array } | { x: Float32Array; y: Float32Array; gpuTimeMs: number }>;

/**
 * Applies a Givens plane rotation to vectors x and y:
 *   x = c*x + s*y
 *   y = -s*x + c*y
 *
 * {@includeCode ../../examples/srot/gpuvec.srot.js}
 *
 * @param device - GPUDevice from `init()`
 * @param n - number of elements (must be a positive integer)
 * @param x - GpuVector input/output vector (mutated in place)
 * @param incx - stride for x (must be a positive integer)
 * @param y - GpuVector input/output vector (mutated in place)
 * @param incy - stride for y (must be a positive integer)
 * @param c - cosine of rotation angle
 * @param s - sine of rotation angle
 * @see [Source code: srot.mjs](https://github.com/manit2004/wgblas/blob/main/src/srot/srot.mjs)
 * @category BLAS Level 1
 */
export declare function srot(
  device: GPUDevice,
  n: number,
  x: GpuVector,
  incx: number,
  y: GpuVector,
  incy: number,
  c: number,
  s: number,
): Promise<{} | { gpuTimeMs: number }>;
