import { Complex32Array } from "./Complex32.mjs";
import { Complex64Array } from "./Complex64.mjs";

/**
 * Represents a Float32Array stored in GPU memory.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/GpuVector.mjs#L7">Source code: GpuVector.mjs (L7)</a>
 * @see [MDN: GPUBuffer](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer)
 * @category Classes
 */
export declare class GpuVector {
  /** @internal */
  readonly _buf: GPUBuffer;

  /** Number of elements in the vector. */
  readonly length: number;

  /** Typed array (or complex array) constructor used when reading data back from the GPU. */
  readonly dtype: Float32ArrayConstructor | Float64ArrayConstructor | typeof Complex32Array | typeof Complex64Array;

  /**
   * Uploads a Float32Array, Float64Array, Complex32Array, or Complex64Array
   * to GPU memory. A Float64Array is split into a double-double (hi, lo) f32
   * pair per element (WGSL has no f64 type) and stored across two GPU
   * buffers internally; `read()` reassembles doubles from these pairs. This
   * gives ~48 bits of mantissa (vs. 24 for a single f32) but less than true
   * f64 precision (52 bits), so round-tripped values are not always
   * bit-exact with the original input. A Complex32Array is stored
   * interleaved (`[re0, im0, re1, im1, ...]`) in one buffer; a
   * Complex64Array gets the same double-double split applied independently
   * to its real and imaginary components, interleaved per (hi, lo) channel.
   *
   * @param data - input vector data
   * @returns GpuVector backed by a GPU buffer
   *
   * @example
   * ```js
   * import { init, GpuVector } from "wgblas";
   *
   * await init();
   * const vec = GpuVector.from(new Float32Array([1, 2, 3, 4]));
   * console.log("length:", vec.length, "dtype:", vec.dtype.name);
   *
   * const dvec = GpuVector.from(new Float64Array([1.1, 2.2, 3.3]));
   * console.log("dtype:", dvec.dtype.name); // Float64Array
   * ```
   */
  static from(data: Float32Array | Float64Array | Complex32Array | Complex64Array): GpuVector;

  /**
   * Reads the vector data back from GPU memory.
   *
   * @returns vector data in the same shape it was created from — a
   * Float32Array, Float64Array, Complex32Array, or Complex64Array
   *
   * @example
   * ```js
   * import { init, GpuVector } from "wgblas";
   *
   * await init();
   * const vec = GpuVector.from(new Float32Array([1, 2, 3, 4]));
   * const data = await vec.read();
   * console.log(data);
   * ```
   */
  read(): Promise<Float32Array | Float64Array | Complex32Array | Complex64Array>;

  /**
   * Destroys the underlying GPU buffer. Call when the vector is no longer needed
   * to free GPU memory — especially important in long-running programs.
   *
   * @example
   * ```js
   * import { init, GpuVector } from "wgblas";
   *
   * await init();
   * const vec = GpuVector.from(new Float32Array([1, 2, 3, 4]));
   * vec.destroy();
   * console.log("GPU buffer released");
   * ```
   */
  destroy(): void;
}
