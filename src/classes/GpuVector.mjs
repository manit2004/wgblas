import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";
import { packF64, unpackF64 } from "../util/f64pack.mjs";

export class GpuVector {
  constructor(buffer, length, dtype = Float32Array, auxBuffer = null) {
    this._buf = buffer;
    // Non-null only for Float64Array-backed vectors: WGSL has no f64 type, so
    // each element is packed into two f32s (packF64) — _buf holds the "main"
    // half of every element, _auxBuf the "aux" half.
    this._auxBuf = auxBuffer;
    this.length = length;
    this.dtype = dtype;
  }

  static from(data) {
    if (data instanceof Float64Array) {
      const main = new Float32Array(data.length);
      const aux = new Float32Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const packed = packF64(data[i]);
        main[i] = packed[0];
        aux[i] = packed[1];
      }
      const mainBuf = uploadBuffer(main, "gpu-vector-f64-main", true);
      const auxBuf = uploadBuffer(aux, "gpu-vector-f64-aux", true);
      return new GpuVector(mainBuf, data.length, Float64Array, auxBuf);
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

    if (!this._auxBuf) return extractResult(rb, this.dtype);

    const encAux = device.createCommandEncoder();
    const rbAux = stageReadback(encAux, this._auxBuf);
    device.queue.submit([encAux.finish()]);

    const [main, aux] = await Promise.all([
      extractResult(rb, Float32Array),
      extractResult(rbAux, Float32Array),
    ]);
    const out = new Float64Array(this.length);
    for (let i = 0; i < this.length; i++) out[i] = unpackF64(main[i], aux[i]);
    return out;
  }

  destroy() {
    this._buf.destroy();
    if (this._auxBuf) this._auxBuf.destroy();
  }
}
