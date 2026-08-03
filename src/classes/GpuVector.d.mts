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

  /** Typed array constructor used when reading data back from the GPU. */
  readonly dtype: Float32ArrayConstructor | Float64ArrayConstructor;

  /**
   * Uploads a Float32Array or Float64Array to GPU memory. A Float64Array is
   * split into a double-double (hi, lo) f32 pair per element (WGSL has no
   * f64 type) and stored across two GPU buffers internally; `read()`
   * reassembles doubles from these pairs. This gives ~48 bits of mantissa
   * (vs. 24 for a single f32) but less than true f64 precision (52 bits), so
   * round-tripped values are not always bit-exact with the original input.
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
  static from(data: Float32Array | Float64Array): GpuVector;

  /**
   * Reads the vector data back from GPU memory.
   *
   * @returns vector data as a Float32Array, or a Float64Array if this vector
   * was created from one
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
  read(): Promise<Float32Array | Float64Array>;

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
