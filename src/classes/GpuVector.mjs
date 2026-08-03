import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";

export class GpuVector {
  constructor(buffer, length, dtype = Float32Array, loBuffer = null) {
    this._buf = buffer;
    this._loBuf = loBuffer; // Non-null only for Float64Array-backed vectors
    this.length = length;
    this.dtype = dtype;
  }

  static from(data) {
    if (data instanceof Float64Array) {
      const { hi, lo } = splitDoubleDouble(data);
      const hiBuf = uploadBuffer(hi, "gpu-vector-f64-hi", true);
      const loBuf = uploadBuffer(lo, "gpu-vector-f64-lo", true);
      return new GpuVector(hiBuf, data.length, Float64Array, loBuf);
    }
    if (!(data instanceof Float32Array)) {
      throw new Error("GpuVector.from expects a Float32Array or Float64Array.");
    }
    const buf = uploadBuffer(data, "gpu-vector", true);
    return new GpuVector(buf, data.length, data.constructor);
  }

  async read() {
    const device = getDevice();
    const enc = device.createCommandEncoder();
    const rb = stageReadback(enc, this._buf);
    device.queue.submit([enc.finish()]);

    if (!this._loBuf) return extractResult(rb, this.dtype);

    const encLo = device.createCommandEncoder();
    const rbLo = stageReadback(encLo, this._loBuf);
    device.queue.submit([encLo.finish()]);

    const [hi, lo] = await Promise.all([
      extractResult(rb, Float32Array),
      extractResult(rbLo, Float32Array),
    ]);
    return mergeDoubleDouble(hi, lo);
  }

  destroy() {
    this._buf.destroy();
    if (this._loBuf) this._loBuf.destroy();
  }
}
