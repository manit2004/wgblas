/**
 * Represents a Float32Array (or Float64Array) matrix stored in GPU memory,
 * row-major or column-major.
 *
 * `rows`/`cols` always describe the logical shape regardless of layout.
 * `lda` (leading dimension) is the stride between consecutive rows
 * (row-major) or columns (column-major) — must be >= `cols` (row-major) or
 * >= `rows` (column-major). When `lda` equals that minimum the matrix is
 * dense with no padding.
 *
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/classes/GpuMatrix.mjs#L7">Source code: GpuMatrix.mjs (L7)</a>
 * @see [MDN: GPUBuffer](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer)
 * @category Classes
 */
export declare class GpuMatrix {
  private constructor();

  /** @internal */
  readonly _buf: GPUBuffer;

  /** Number of rows (logical shape, independent of layout). */
  readonly rows: number;

  /** Number of columns (logical shape, independent of layout). */
  readonly cols: number;

  /** Leading dimension — stride between row starts (row-major) or column starts (column-major). */
  readonly lda: number;

  /** Storage layout this matrix was created with — every routine that accepts a GpuMatrix reads this automatically. */
  readonly layout: 'row-major' | 'column-major';

  /**
   * Uploads a Float32Array or Float64Array matrix to GPU memory, row-major
   * or column-major. A Float64Array is split into a double-double (hi, lo)
   * f32 pair per element (WGSL has no f64 type) and stored across two GPU
   * buffers internally; `read()` reassembles doubles from these pairs. This
   * gives ~48 bits of mantissa (vs. 24 for a single f32) but less than true
   * f64 precision (52 bits), so round-tripped values are not always
   * bit-exact with the original input.
   *
   * `rows`/`cols` always describe the logical shape regardless of layout.
   * `lda` defaults to `cols` (row-major) or `rows` (column-major) — dense, no
   * padding. `data` must have at least `rows * lda` (row-major) or
   * `cols * lda` (column-major) elements.
   *
   * @param data   - matrix data, in the order matching `layout`
   * @param rows   - number of rows
   * @param cols   - number of columns
   * @param lda    - leading dimension (default: `cols` for row-major, `rows` for column-major)
   * @param layout - storage layout (default: `'row-major'`)
   *
   * @example
   * ```js
   * import { init, GpuMatrix } from "wgblas";
   *
   * await init();
   * // 2×3 matrix: [[1,2,3],[4,5,6]]
   * const mat = GpuMatrix.from(new Float32Array([1,2,3,4,5,6]), 2, 3);
   * console.log(mat.rows, mat.cols, mat.lda); // 2 3 3
   *
   * // Same logical matrix, column-major storage
   * const matCol = GpuMatrix.from(new Float32Array([1,4,2,5,3,6]), 2, 3, undefined, "column-major");
   * ```
   */
  static from(data: Float32Array | Float64Array, rows: number, cols: number, lda?: number, layout?: 'row-major' | 'column-major'): GpuMatrix;

  /**
   * Downloads the matrix from GPU memory and returns a dense array of shape
   * `rows × cols`, in the same layout it was created with — a `Float32Array`,
   * or a `Float64Array` if this matrix was created from one. If `lda` exceeds
   * the dense minimum, the leading-dimension padding is stripped so the
   * returned array is always tightly packed.
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
