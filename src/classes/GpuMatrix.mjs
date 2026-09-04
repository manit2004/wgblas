import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { interleaveComplex32, splitComplex64, mergeComplex64 } from "../util/complex.mjs";
import { Complex32Array } from "./Complex32.mjs";
import { Complex64Array } from "./Complex64.mjs";

export class GpuMatrix {
  constructor(buffer, rows, cols, lda, loBuffer = null, layout = "row-major", device = null, dtype = Float32Array) {
    this._buf = buffer;
    this._loBuf = loBuffer; // Non-null only for Float64Array-backed matrices
    this.rows = rows;
    this.cols = cols;
    this.lda  = lda;
    this.layout = layout;
    this.dtype = dtype; // disambiguates Complex32Array from Float32Array — both have _loBuf === null
    // See GpuVector: a GPUBuffer is bound to one device for life.
    this.device = device ?? getDevice();
  }

  /**
   * Uploads a Float32Array or Float64Array matrix to GPU memory, row-major or
   * column-major. `rows`/`cols` always describe the logical shape regardless
   * of layout. `lda` is the stride between consecutive rows (row-major) or
   * columns (column-major) — defaults to `cols`/`rows` respectively (dense,
   * no padding). `data` must have at least `rows * lda` (row-major) or
   * `cols * lda` (column-major) elements.
   */
  static from(deviceOrData, ...rest) {
    const explicit = deviceOrData instanceof GPUDevice;
    const device = explicit ? deviceOrData : getDevice();
    const data = explicit ? rest.shift() : deviceOrData;
    let [rows, cols, lda, layout = "row-major"] = rest;

    if (layout !== "row-major" && layout !== "column-major")
      throw new Error("layout must be 'row-major' or 'column-major'.");
    const isRowMajor = layout === "row-major";
    if (lda === undefined) lda = isRowMajor ? cols : rows;

    if (
      !(data instanceof Float32Array) &&
      !(data instanceof Float64Array) &&
      !(data instanceof Complex32Array) &&
      !(data instanceof Complex64Array)
    )
      throw new Error("GpuMatrix.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.");
    if (!Number.isInteger(rows) || rows <= 0)
      throw new Error("rows must be a positive integer.");
    if (!Number.isInteger(cols) || cols <= 0)
      throw new Error("cols must be a positive integer.");
    const minLda = isRowMajor ? cols : rows;
    if (!Number.isInteger(lda) || lda < minLda)
      throw new Error(`lda must be an integer >= ${isRowMajor ? "cols" : "rows"}.`);

    // Row-major: `rows` chunks of length `lda` (only the first `cols` of each used).
    // Column-major: `cols` chunks of length `lda` (only the first `rows` of each used).
    const outerCount = isRowMajor ? rows : cols;
    if (data.length < outerCount * lda)
      throw new Error(
        "data does not have enough elements for the given rows, cols, and lda.",
      );

    if (data instanceof Float64Array) {
      const n = outerCount * lda;
      const { hi, lo } = splitDoubleDouble(data.subarray(0, n));
      const hiBuf = uploadBuffer(device, hi, "gpu-matrix-f64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-matrix-f64-lo", true);
      return new GpuMatrix(hiBuf, rows, cols, lda, loBuf, layout, device, Float64Array);
    }

    if (data instanceof Complex32Array) {
      const buf = uploadBuffer(device, interleaveComplex32(data, outerCount * lda), "gpu-matrix-complex32", true);
      return new GpuMatrix(buf, rows, cols, lda, null, layout, device, Complex32Array);
    }

    if (data instanceof Complex64Array) {
      const { hi, lo } = splitComplex64(data, outerCount * lda);
      const hiBuf = uploadBuffer(device, hi, "gpu-matrix-complex64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-matrix-complex64-lo", true);
      return new GpuMatrix(hiBuf, rows, cols, lda, loBuf, layout, device, Complex64Array);
    }

    const buf = uploadBuffer(device, data.subarray(0, outerCount * lda), "gpu-matrix", true);
    return new GpuMatrix(buf, rows, cols, lda, null, layout, device);
  }

  async read() {
    const device = this.device;
    const enc = device.createCommandEncoder();
    const rb = stageReadback(device, enc, this._buf);
    device.queue.submit([enc.finish()]);

    const isRowMajor = this.layout !== "column-major";
    const outerCount = isRowMajor ? this.rows : this.cols;
    const innerLen   = isRowMajor ? this.cols : this.rows;

    if (this.dtype === Complex32Array) {
      const raw = new Complex32Array(await extractResult(rb, Float32Array));
      if (this.lda === innerLen) return raw;
      const out = new Complex32Array(outerCount * innerLen);
      for (let r = 0; r < outerCount; r++)
        for (let c = 0; c < innerLen; c++)
          out[r * innerLen + c] = raw[r * this.lda + c];
      return out;
    }

    if (this._loBuf) {
      const encLo = device.createCommandEncoder();
      const rbLo = stageReadback(device, encLo, this._loBuf);
      device.queue.submit([encLo.finish()]);

      const [hi, lo] = await Promise.all([
        extractResult(rb, Float32Array),
        extractResult(rbLo, Float32Array),
      ]);

      if (this.dtype === Complex64Array) {
        const raw = mergeComplex64(hi, lo);
        if (this.lda === innerLen) return raw;
        const out = new Complex64Array(outerCount * innerLen);
        for (let r = 0; r < outerCount; r++)
          for (let c = 0; c < innerLen; c++)
            out[r * innerLen + c] = raw[r * this.lda + c];
        return out;
      }

      const raw = mergeDoubleDouble(hi, lo);
      if (this.lda === innerLen) return raw;
      const out = new Float64Array(outerCount * innerLen);
      for (let r = 0; r < outerCount; r++)
        out.set(raw.subarray(r * this.lda, r * this.lda + innerLen), r * innerLen);
      return out;
    }

    const raw = await extractResult(rb, Float32Array);
    if (this.lda === innerLen) return raw;
    const out = new Float32Array(outerCount * innerLen);
    for (let r = 0; r < outerCount; r++)
      out.set(raw.subarray(r * this.lda, r * this.lda + innerLen), r * innerLen);
    return out;
  }

  destroy() {
    this._buf.destroy();
    if (this._loBuf) this._loBuf.destroy();
  }
}
