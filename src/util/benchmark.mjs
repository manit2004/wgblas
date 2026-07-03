import { getDevice, isBenchmarkEnabled } from "../init.mjs";

export function benchmarkMode(adapter, enabled) {
  if (!enabled) return {};
  if (adapter.features.has("timestamp-query"))
    return { requiredFeatures: ["timestamp-query"] };
  console.warn(
    "timestamp-query not supported on this device — benchmark mode disabled.",
  );
  return {};
}

export function beginTimestamp() {
  if (!isBenchmarkEnabled())
    return { querySet: null, passDescriptor: undefined };
  const device = getDevice();
  const querySet = device.createQuerySet({ type: "timestamp", count: 2 });
  const passDescriptor = {
    timestampWrites: {
      querySet,
      beginningOfPassWriteIndex: 0,
      endOfPassWriteIndex: 1,
    },
  };
  return { querySet, passDescriptor };
}

export function resolveTimestamp(commandEncoder, querySet) {
  if (!querySet) return null;
  const device = getDevice();
  const resolveBuffer = device.createBuffer({
    label: "timestamp-resolve",
    size: 16,
    usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
  });
  commandEncoder.resolveQuerySet(querySet, 0, 2, resolveBuffer, 0);
  const tsReadBuffer = device.createBuffer({
    label: "timestamp-readback",
    size: 16,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  commandEncoder.copyBufferToBuffer(resolveBuffer, 0, tsReadBuffer, 0, 16);
  return { tsReadBuffer, resolveBuffer, querySet };
}

export async function extractTimestamp(ts) {
  if (!ts) return undefined;
  const { tsReadBuffer, resolveBuffer, querySet } = ts;
  await tsReadBuffer.mapAsync(GPUMapMode.READ);
  const timestamps = new BigInt64Array(tsReadBuffer.getMappedRange().slice());
  tsReadBuffer.unmap();
  tsReadBuffer.destroy();
  resolveBuffer.destroy();
  querySet.destroy();
  return Number(timestamps[1] - timestamps[0]) / 1e6;
}
