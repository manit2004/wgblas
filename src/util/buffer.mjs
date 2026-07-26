/** @module devdocs/utility-functions/buffer */
import { getDevice } from "../init.mjs";

/**
 * Destroys one or more GPU buffers. Accepts individual buffers or arrays of buffers.
 * @param {...(GPUBuffer|GPUBuffer[])} buffers
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/destroy GPUBuffer.destroy()}
 */
export function destroyBuffers(...buffers) {
  buffers.flat().forEach((b) => b.destroy());
}

/**
 * Creates a GPU storage buffer and uploads `data` into it via mapped-at-creation.
 * The mapped view is constructed from `data`'s own typed-array constructor, so
 * bits are copied as-is regardless of element type (e.g. a Uint32Array's raw
 * bit patterns are preserved — critical for dasum's aux half, which must
 * never pass through a Float32Array view and risk NaN-bit-pattern canonicalization).
 * @param {Float32Array|Uint32Array|Int32Array} data
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @param {boolean} [readback=false] - add `COPY_SRC` so the buffer can be copied to a readback buffer
 * @throws {Error} if `data.byteLength` exceeds the device's `maxStorageBufferBindingSize`
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer GPUDevice.createBuffer()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/getMappedRange GPUBuffer.getMappedRange()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/unmap GPUBuffer.unmap()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUSupportedLimits GPUSupportedLimits} (`maxStorageBufferBindingSize`)
 */
export function uploadBuffer(data, label = "blas-input", readback = false) {
  const device = getDevice();

  // User-facing boundary: give a clear error instead of a cryptic GPUValidationError.
  const maxSize = device.limits.maxStorageBufferBindingSize;
  const byteSize = data.byteLength;
  if (byteSize > maxSize) {
    throw new Error(
      `Buffer size ${byteSize} bytes exceeds device limit of ${maxSize} bytes.`,
    );
  }

  const usage = readback
    ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    : GPUBufferUsage.STORAGE;

  const buffer = device.createBuffer({
    label,
    size: byteSize,
    usage,
    mappedAtCreation: true,
  });

  const ViewCtor = data.constructor;
  const mappedArray = new ViewCtor(buffer.getMappedRange());
  mappedArray.set(data);
  buffer.unmap();

  return buffer;
}

/**
 * Creates an uninitialised GPU storage buffer. Used for intermediate buffers
 * that are written by a shader before being read.
 * @param {number} size - byte size
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer GPUDevice.createBuffer()}
 */
export function createStorageBuffer(size, label = "blas-storage") {
  const device = getDevice();
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE,
  });
}

/**
 * Creates a GPU storage buffer with `COPY_SRC` so its contents can be
 * copied to a CPU-readable readback buffer after the shader runs.
 * @param {number} size - byte size
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer GPUDevice.createBuffer()}
 */
export function createResultBuffer(size, label = "blas-result") {
  const device = getDevice();
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
}

/**
 * Appends a `copyBufferToBuffer` command to `commandEncoder` that copies
 * `sourceBuffer` into a new `MAP_READ` buffer. Returns that readback buffer;
 * call `readBuffer.mapAsync(GPUMapMode.READ)` after submitting the encoder.
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPUBuffer} sourceBuffer
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/copyBufferToBuffer GPUCommandEncoder.copyBufferToBuffer()}
 */
export function stageReadback(commandEncoder, sourceBuffer) {
  const device = getDevice();

  // COPY_DST: receives the copyBufferToBuffer transfer; MAP_READ: lets the CPU map and read it back.
  const readBuffer = device.createBuffer({
    label: "blas-readback",
    size: sourceBuffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(
    sourceBuffer, 0,              // src, srcOffset
    readBuffer,   0,              // dst, dstOffset
    sourceBuffer.size,            // full copy, no partial reads
  );

  return readBuffer;
}

/**
 * Packs an array of typed scalar values into a uniform buffer aligned to 16 bytes.
 * Each entry specifies the value and its WGSL type (`"f32"`, `"u32"`, or `"i32"`).
 * The order of entries must match the field order in the shader's `Params` struct.
 * @param {{ value: number, type: "f32"|"u32"|"i32" }[]} params
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/writeBuffer GPUQueue.writeBuffer()}
 */
export function createParamsBuffer(params, label = "blas-params") {
  const device = getDevice();

  const rawSize = params.length * 4;
  const size = Math.ceil(rawSize / 16) * 16;

  const arrayBuffer = new ArrayBuffer(size);
  const view = new DataView(arrayBuffer);

  params.forEach(({ value, type }, i) => {
    const offset = i * 4;
    if (type === "u32") {
      view.setUint32(offset, value, true);
    } else if (type === "i32") {
      view.setInt32(offset, value, true);
    } else if (type === "f32") {
      view.setFloat32(offset, value, true);
    } else {
      throw new Error(
        `Unknown param type "${type}". Use "f32", "u32", or "i32".`,
      );
    }
  });

  // UNIFORM: binds as var<uniform> in the shader; COPY_DST: allows writeBuffer to upload the packed data.
  const buffer = device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(buffer, 0, arrayBuffer);

  return buffer;
}
