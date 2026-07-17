import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";

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
    const buf = uploadBuffer(data.subarray(0, rows * lda), "gpu-matrix", true);
    return new GpuMatrix(buf, rows, cols, lda);
  }
  
  async read() {
    const device = getDevice();
    const enc = device.createCommandEncoder();
    const rb = stageReadback(enc, this._buf);
    device.queue.submit([enc.finish()]);
    const raw = await extractResult(rb, Float32Array);
    if (this.lda === this.cols) return raw;
    const out = new Float32Array(this.rows * this.cols);
    for (let r = 0; r < this.rows; r++)
      out.set(raw.subarray(r * this.lda, r * this.lda + this.cols), r * this.cols);
    return out;
  }

  destroy() {
    this._buf.destroy();
  }
}
