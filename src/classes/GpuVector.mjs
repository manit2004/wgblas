import { getDevice } from "../init.mjs";
import { uploadBuffer, stageReadback } from "../util/buffer.mjs";
import { extractResult } from "../util/result.mjs";
import { splitDoubleDouble, mergeDoubleDouble } from "../util/f64.mjs";
import { interleaveComplex32, splitComplex64, mergeComplex64 } from "../util/complex.mjs";
import { Complex32Array } from "./Complex32.mjs";
import { Complex64Array } from "./Complex64.mjs";

export class GpuVector {
  constructor(buffer, length, dtype = Float32Array, loBuffer = null, device = null) {
    this._buf = buffer;
    this._loBuf = loBuffer; // Non-null only for Float64Array-backed vectors
    this.length = length;
    this.dtype = dtype;
    // A GPUBuffer belongs to exactly one device and WebGPU rejects any attempt
    // to use it with another, so every handle remembers where it lives. Routines
    // check this to reject mixed-device operands with a clear message instead of
    // a raw GPUValidationError.
    this.device = device ?? getDevice();
  }

  /**
   * Uploads a vector to GPU memory.
   *
   * Pass the target `GPUDevice` first — matching every routine's own
   * `(device, ...)` convention. Omitting it falls back to the device from the
   * last `init()`, which is the historical form and only works single-device.
   *
   * @param {GPUDevice|Float32Array|Float64Array} deviceOrData
   */
  static from(deviceOrData, maybeData) {
    const explicit = deviceOrData instanceof GPUDevice;
    const device = explicit ? deviceOrData : getDevice();
    const data = explicit ? maybeData : deviceOrData;

    if (data instanceof Float64Array) {
      const { hi, lo } = splitDoubleDouble(data);
      const hiBuf = uploadBuffer(device, hi, "gpu-vector-f64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-vector-f64-lo", true);
      return new GpuVector(hiBuf, data.length, Float64Array, loBuf, device);
    }
    if (data instanceof Complex32Array) {
      const buf = uploadBuffer(device, interleaveComplex32(data), "gpu-vector-complex32", true);
      return new GpuVector(buf, data.length, Complex32Array, null, device);
    }
    if (data instanceof Complex64Array) {
      const { hi, lo } = splitComplex64(data);
      const hiBuf = uploadBuffer(device, hi, "gpu-vector-complex64-hi", true);
      const loBuf = uploadBuffer(device, lo, "gpu-vector-complex64-lo", true);
      return new GpuVector(hiBuf, data.length, Complex64Array, loBuf, device);
    }
    if (!(data instanceof Float32Array)) {
      throw new Error("GpuVector.from expects a Float32Array, Float64Array, Complex32Array, or Complex64Array.");
    }
    const buf = uploadBuffer(device, data, "gpu-vector", true);
    return new GpuVector(buf, data.length, data.constructor, null, device);
  }

  async read() {
    const device = this.device;
    const enc = device.createCommandEncoder();
    const rb = stageReadback(device, enc, this._buf);
    device.queue.submit([enc.finish()]);

    if (this.dtype === Complex32Array) {
      // Complex32Array's own interleaved-numbers constructor overload does
      // the de-interleaving — see complex.mjs.
      return new Complex32Array(await extractResult(rb, Float32Array));
    }

    if (!this._loBuf) return extractResult(rb, this.dtype);

    const encLo = device.createCommandEncoder();
    const rbLo = stageReadback(device, encLo, this._loBuf);
    device.queue.submit([encLo.finish()]);

    const [hi, lo] = await Promise.all([
      extractResult(rb, Float32Array),
      extractResult(rbLo, Float32Array),
    ]);
    if (this.dtype === Complex64Array) return mergeComplex64(hi, lo);
    return mergeDoubleDouble(hi, lo);
  }

  destroy() {
    this._buf.destroy();
    if (this._loBuf) this._loBuf.destroy();
  }
}
