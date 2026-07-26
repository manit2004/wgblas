import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";
import { packF64, unpackF64 } from "../util/f64pack.mjs";

export class GpuMatrix {
  constructor(buffer, rows, cols, lda, auxBuffer = null) {
    this._buf = buffer;
    // Non-null only for Float64Array-backed matrices — see GpuVector for why
    // (packF64 splits each element into a "main"/_buf f32 and "aux"/_auxBuf
    // raw u32 — never a Float32Array, see f64pack.mjs).
    this._auxBuf = auxBuffer;
    this.rows = rows;
    this.cols = cols;
    this.lda  = lda;
  }

  /**
   * Uploads a row-major Float32Array or Float64Array matrix to GPU memory.
   * lda defaults to cols (dense, no padding between rows).
   * data must have at least rows * lda elements.
   */
  static from(data, rows, cols, lda = cols) {
    if (!(data instanceof Float32Array) && !(data instanceof Float64Array))
      throw new Error("GpuMatrix.from expects a Float32Array or Float64Array.");
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

    if (data instanceof Float64Array) {
      const n = rows * lda;
      const main = new Float32Array(n);
      const aux = new Uint32Array(n);
      for (let i = 0; i < n; i++) {
        const packed = packF64(data[i]);
        main[i] = packed[0];
        aux[i] = packed[1];
      }
      const mainBuf = uploadBuffer(main, "gpu-matrix-f64-main", true);
      const auxBuf = uploadBuffer(aux, "gpu-matrix-f64-aux", true);
      return new GpuMatrix(mainBuf, rows, cols, lda, auxBuf);
    }

    const buf = uploadBuffer(data.subarray(0, rows * lda), "gpu-matrix", true);
    return new GpuMatrix(buf, rows, cols, lda);
  }

  async read() {
    const device = getDevice();
    const enc = device.createCommandEncoder();
    const rb = stageReadback(enc, this._buf);
    device.queue.submit([enc.finish()]);

    if (this._auxBuf) {
      const encAux = device.createCommandEncoder();
      const rbAux = stageReadback(encAux, this._auxBuf);
      device.queue.submit([encAux.finish()]);

      const [main, aux] = await Promise.all([
        extractResult(rb, Float32Array),
        extractResult(rbAux, Uint32Array),
      ]);
      const raw = new Float64Array(this.rows * this.lda);
      for (let i = 0; i < raw.length; i++) raw[i] = unpackF64(main[i], aux[i]);
      if (this.lda === this.cols) return raw;
      const out = new Float64Array(this.rows * this.cols);
      for (let r = 0; r < this.rows; r++)
        out.set(raw.subarray(r * this.lda, r * this.lda + this.cols), r * this.cols);
      return out;
    }

    const raw = await extractResult(rb, Float32Array);
    if (this.lda === this.cols) return raw;
    const out = new Float32Array(this.rows * this.cols);
    for (let r = 0; r < this.rows; r++)
      out.set(raw.subarray(r * this.lda, r * this.lda + this.cols), r * this.cols);
    return out;
  }

  destroy() {
    this._buf.destroy();
    if (this._auxBuf) this._auxBuf.destroy();
  }
}
