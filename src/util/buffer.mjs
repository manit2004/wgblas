/** @module devdocs/utility-functions/buffer */

/**
 * Destroys one or more GPU buffers. Accepts individual buffers or arrays of buffers.
 * @param {...(GPUBuffer|GPUBuffer[])} buffers
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/destroy GPUBuffer.destroy()}
 */
export function destroyBuffers(...buffers) {
  buffers.flat().forEach((b) => b.destroy());
}

/**
 * Throws if `byteSize` is more than this device can bind as a storage buffer.
 *
 * Every storage buffer the library creates goes through here. WebGPU accepts an
 * oversized `createBuffer` and only rejects it later, when it is bound — as a
 * `GPUValidationError` naming a bind group index rather than an operand, which
 * gives no clue which allocation was at fault. Failing at creation, with the
 * buffer's own label, points straight at it.
 *
 * @param {GPUDevice} device
 * @param {number} byteSize
 * @param {string} label - the buffer's debug label, quoted in the error
 * @throws {Error} if `byteSize` exceeds `maxStorageBufferBindingSize`
 * @internal
 */
function requireStorageSize(device, byteSize, label) {
  const maxSize = device.limits.maxStorageBufferBindingSize;
  if (byteSize > maxSize) {
    throw new Error(
      `Buffer "${label}" needs ${byteSize} bytes, exceeding this device's ` +
      `maxStorageBufferBindingSize (${maxSize} bytes). The operands are too large for this device.`,
    );
  }
}

/**
 * Creates a GPU storage buffer and uploads `data` into it via mapped-at-creation.
 * The mapped view is constructed from `data`'s own typed-array constructor, so
 * bits are copied as-is regardless of element type (e.g. a Uint32Array's raw
 * bit patterns are preserved — critical for dasum's aux half, which must
 * never pass through a Float32Array view and risk NaN-bit-pattern canonicalization).
 * @param {GPUDevice} device
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
export function uploadBuffer(device, data, label = "blas-input", readback = false) {
  const byteSize = data.byteLength;
  requireStorageSize(device, byteSize, label);

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
 * @param {GPUDevice} device
 * @param {number} size - byte size
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @param {number} [extraUsage=0] - additional `GPUBufferUsage` flags OR'd in alongside `STORAGE`
 *   (e.g. `GPUBufferUsage.COPY_DST` for a buffer that's also a `copyBufferToBuffer` destination)
 * @returns {GPUBuffer}
 * @throws {Error} if `size` exceeds the device's `maxStorageBufferBindingSize`
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer GPUDevice.createBuffer()}
 */
export function createStorageBuffer(device, size, label = "blas-storage", extraUsage = 0) {
  requireStorageSize(device, size, label);
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE | extraUsage,
  });
}

/**
 * Creates a GPU storage buffer with `COPY_SRC` so its contents can be
 * copied to a CPU-readable readback buffer after the shader runs.
 * @param {GPUDevice} device
 * @param {number} size - byte size
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @returns {GPUBuffer}
 * @throws {Error} if `size` exceeds the device's `maxStorageBufferBindingSize`
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer GPUDevice.createBuffer()}
 */
export function createResultBuffer(device, size, label = "blas-result") {
  requireStorageSize(device, size, label);
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
 * @param {GPUDevice} device
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPUBuffer} sourceBuffer
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/copyBufferToBuffer GPUCommandEncoder.copyBufferToBuffer()}
 */
export function stageReadback(device, commandEncoder, sourceBuffer) {

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

// Minimum bindable size for an array<vec4<f32>> view: one 16-byte element.
const VEC4_ELEM_BYTES = 16;

// Dummy STORAGE buffer bound into a kernel's unused vec4-view slot when the
// real operand can't host even one vec4 (tiny-matrix edge cases, where the
// stride check forces the scalar path anyway). Cached per device.
const _vec4Fallbacks = new WeakMap();
function vec4FallbackBuffer(device) {
  let b = _vec4Fallbacks.get(device);
  if (!b) {
    b = device.createBuffer({
      label: "blas-vec4-fallback",
      size: VEC4_ELEM_BYTES,
      usage: GPUBufferUsage.STORAGE,
    });
    _vec4Fallbacks.set(device, b);
  }
  return b;
}

/**
 * Bind-group entry exposing `buffer`'s bytes as an `array<vec4<f32>>` view —
 * the twin binding that lets a shader issue 16-byte vector loads alongside
 * scalar access of the same storage (bind the same GPUBuffer twice: once as
 * `array<f32>`, once through this). The view's size is rounded down to a
 * multiple of 16 because some backends reject non-multiple-of-16 ranges for
 * vec4 arrays; whenever a kernel's vector path is usable (stride % 4 == 0)
 * the buffer size is itself a multiple of 16, so the rounding never truncates
 * a component the vector path would actually read. Buffers smaller than one
 * vec4 element get a shared dummy storage buffer bound instead — the shader
 * never dereferences it on those shapes.
 * @param {GPUBuffer|{buffer: GPUBuffer, offset?: number, size?: number}} entry - whole buffer or sub-range, matching what the scalar slot binds
 * @returns {{buffer: GPUBuffer, offset: number, size: number}}
 */
export function vec4ViewBinding(device, entry) {
  const buffer = entry instanceof GPUBuffer ? entry : entry.buffer;
  const offset = entry instanceof GPUBuffer ? 0 : (entry.offset ?? 0);
  const avail = (entry instanceof GPUBuffer ? entry.size : (entry.size ?? buffer.size - offset));
  const size = Math.floor(avail / VEC4_ELEM_BYTES) * VEC4_ELEM_BYTES;
  if (size < VEC4_ELEM_BYTES) {
    return { buffer: vec4FallbackBuffer(device), offset: 0, size: VEC4_ELEM_BYTES };
  }
  return { buffer, offset, size };
}

/**
 * Whether every in-bounds element of a matrix operand is reachable through
 * the `array<vec4<f32>>` view that {@link vec4ViewBinding} produces for it.
 * The view truncates the binding down to a multiple of 16 bytes, so a
 * tightly-uploaded array can hold valid matrix elements past the view's end
 * even while its stride is 4-aligned (e.g. a column-major m×1 operand with
 * padded lda uploaded without padding cells). Call this with the kernel-side
 * dimensions and only take a shader's vectorized path when it returns true;
 * the scalar fallback reads the full storage and is always correct.
 * @param {GPUBuffer|{buffer: GPUBuffer, offset?: number, size?: number}} entry - what the scalar slot binds
 * @param {number} stride - the operand's leading dimension as seen by the kernel
 * @param {number} outerCount - extent of the stride-multiplied dimension
 * @param {number} innerCount - extent of the contiguous dimension
 * @returns {boolean}
 */
export function vec4Usable(entry, stride, outerCount, innerCount) {
  if (stride % 4 !== 0) return false;
  const buffer = entry instanceof GPUBuffer ? entry : entry.buffer;
  const offset = entry instanceof GPUBuffer ? 0 : (entry.offset ?? 0);
  const avail = (entry instanceof GPUBuffer ? buffer.size : (entry.size ?? buffer.size - offset));
  const viewFloats = Math.floor(avail / VEC4_ELEM_BYTES) * 4;
  if (viewFloats <= 0) return false;
  // Highest flat index any masked-in component can touch; usable iff its
  // containing vec4 ends within the view.
  const maxFlat = (Math.max(outerCount, 1) - 1) * stride + (Math.max(innerCount, 1) - 1);
  return Math.floor(maxFlat / 4) * 4 + 4 <= viewFloats;
}

/**
 * Packs an array of typed scalar values into a uniform buffer aligned to 16 bytes.
 * Each entry specifies the value and its WGSL type (`"f32"`, `"u32"`, or `"i32"`).
 * The order of entries must match the field order in the shader's `Params` struct.
 * @param {GPUDevice} device
 * @param {{ value: number, type: "f32"|"u32"|"i32" }[]} params
 * @param {string} [label] - debug label visible in browser DevTools GPU inspection
 * @returns {GPUBuffer}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/writeBuffer GPUQueue.writeBuffer()}
 */
export function createParamsBuffer(device, params, label = "blas-params") {

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
