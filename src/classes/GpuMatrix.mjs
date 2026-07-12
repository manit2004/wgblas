import { uploadBuffer } from "../util/buffer.mjs";

export class GpuMatrix {
  constructor(buffer, rows, cols, lda) {
    this._buf = buffer;
    this.rows = rows;
    this.cols = cols;
    this.lda  = lda;
  }

  /**
   * Uploads a row-major Float32Array matrix to GPU memory.
   * lda defaults to cols (dense, no padding between rows).
   * data must have at least rows * lda elements.
   */
  static from(data, rows, cols, lda = cols) {
    if (!(data instanceof Float32Array))
      throw new Error("GpuMatrix.from expects a Float32Array.");
    if (!Number.isInteger(rows) || rows <= 0)
      throw new Error("rows must be a positive integer.");
    if (!Number.isInteger(cols) || cols <= 0)
      throw new Error("cols must be a positive integer.");
    if (!Number.isInteger(lda) || lda < cols)
      throw new Error("lda must be an integer >= cols.");
    if (data.length < rows * lda)
      throw new Error(
        "data does not have enough elements for the given rows and lda.",
      );
    const buf = uploadBuffer(data.subarray(0, rows * lda), "gpu-matrix", false);
    return new GpuMatrix(buf, rows, cols, lda);
  }

  destroy() {
    this._buf.destroy();
  }
}
