/**
 * Represents a row-major Float32Array matrix stored in GPU memory.
 *
 * The buffer holds `rows * lda` elements. `lda` (leading dimension) is the
 * number of floats between the start of consecutive rows — must be >= `cols`.
 * When `lda === cols` the matrix is dense with no padding.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/GpuMatrix.mjs#L7">Source code: GpuMatrix.mjs (L7)</a>
 * @see [MDN: GPUBuffer](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer)
 * @category Classes
 */
export declare class GpuMatrix {
  private constructor();

  /** @internal */
  readonly _buf: GPUBuffer;

  /** Number of rows. */
  readonly rows: number;

  /** Number of columns. */
  readonly cols: number;

  /** Leading dimension — stride between row starts (>= cols). */
  readonly lda: number;

  /**
   * Uploads a row-major Float32Array or Float64Array matrix to GPU memory. A
   * Float64Array is packed as two f32s per element (WGSL has no f64 type)
   * and stored across two GPU buffers internally; `read()` reassembles the
   * original doubles.
   *
   * `lda` defaults to `cols` (dense, no padding between rows).
   * `data` must have at least `rows * lda` elements.
   *
   * @param data - matrix data in row-major order
   * @param rows - number of rows
   * @param cols - number of columns
   * @param lda  - leading dimension (default: cols)
   *
   * @example
   * ```js
   * import { init, GpuMatrix } from "wgblas";
   *
   * await init();
   * // 2×3 matrix: [[1,2,3],[4,5,6]]
   * const mat = GpuMatrix.from(new Float32Array([1,2,3,4,5,6]), 2, 3);
   * console.log(mat.rows, mat.cols, mat.lda); // 2 3 3
   * ```
   */
  static from(data: Float32Array | Float64Array, rows: number, cols: number, lda?: number): GpuMatrix;

  /**
   * Downloads the matrix from GPU memory and returns a dense row-major
   * array of shape `rows × cols` — a `Float32Array`, or a `Float64Array` if
   * this matrix was created from one. If `lda > cols`, the leading-dimension
   * padding is stripped so the returned array is always tightly packed.
   *
   * @example
   * ```js
   * import { init, GpuMatrix } from "wgblas";
   *
   * await init();
   * const mat = GpuMatrix.from(new Float32Array([1,2,3,4,5,6]), 2, 3);
   * const data = await mat.read();
   * console.log(data); // Float32Array [1, 2, 3, 4, 5, 6]
   * ```
   */
  read(): Promise<Float32Array | Float64Array>;

  /**
   * Destroys the underlying GPU buffer. Call when the matrix is no longer
   * needed to free GPU memory.
   *
   * @example
   * ```js
   * import { init, GpuMatrix } from "wgblas";
   *
   * await init();
   * const mat = GpuMatrix.from(new Float32Array([1,2,3,4,5,6]), 2, 3);
   * mat.destroy();
   * ```
   */
  destroy(): void;
}
