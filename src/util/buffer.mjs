import { getDevice } from "../init.mjs";

export function destroyBuffers(...buffers) {
  buffers.flat().forEach((b) => b.destroy());
}

export function uploadBuffer(data, label = "blas-input", readback = false) {
  const device = getDevice();

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

  const mappedArray = new Float32Array(buffer.getMappedRange());
  mappedArray.set(data);
  buffer.unmap();

  return buffer;
}

export function createStorageBuffer(size, label = "blas-storage") {
  const device = getDevice();
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE,
  });
}

export function createResultBuffer(size, label = "blas-result") {
  const device = getDevice();
  return device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
}

export function stageReadback(commandEncoder, sourceBuffer) {
  const device = getDevice();

  const readBuffer = device.createBuffer({
    label: "blas-readback",
    size: sourceBuffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(
    sourceBuffer,
    0,
    readBuffer,
    0,
    sourceBuffer.size,
  );

  return readBuffer;
}

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

  const buffer = device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(buffer, 0, arrayBuffer);

  return buffer;
}
