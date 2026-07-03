/**
 * Represents a Float32Array stored in GPU memory.
 *
 * @see [Source code: GpuVector.mjs](https://github.com/manit2004/wgblas/blob/main/src/classes/GpuVector.mjs#L7-L33)
 * @see [MDN: GPUBuffer](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer)
 * @category Classes
 */
export declare class GpuVector {
  /** @internal */
  readonly _buf: GPUBuffer;

  /** Number of elements in the vector. */
  readonly length: number;

  // TODO: widen to Float32ArrayConstructor | Float64ArrayConstructor when Float64 support is added
  /** Typed array constructor used when reading data back from the GPU. */
  readonly dtype: Float32ArrayConstructor;

  /**
   * Uploads a Float32Array to GPU memory.
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
   * ```
   */
  static from(data: Float32Array): GpuVector;

  // TODO: return type will widen to Promise<Float32Array | Float64Array> when Float64 support is added
  /**
   * Reads the vector data back from GPU memory.
   *
   * @returns vector data as a Float32Array
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
  read(): Promise<Float32Array>;

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
