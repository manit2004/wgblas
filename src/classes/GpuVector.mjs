import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";

//TODO: Need to update this when we support Float64Array.

export class GpuVector {
  constructor(buffer, length, dtype = Float32Array) {
    this._buf = buffer;
    this.length = length;
    this.dtype = dtype;
  }

  static from(data) {
    if (!(data instanceof Float32Array)) {
      throw new Error("GpuVector.from expects a Float32Array.");
    }
    const buf = uploadBuffer(data, "gpu-vector", true);
    return new GpuVector(buf, data.length, data.constructor);
  }

  async read() {
    const device = getDevice();
    const enc = device.createCommandEncoder();
    const rb = stageReadback(enc, this._buf);
    device.queue.submit([enc.finish()]);
    return extractResult(rb, this.dtype);
  }

  destroy() {
    this._buf.destroy();
  }
}
