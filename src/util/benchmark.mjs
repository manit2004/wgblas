/** @module devdocs/utility-functions/benchmark */
import { isBenchmarkEnabled } from "../init.mjs";

/**
 * Returns the `requestDevice` descriptor to pass to `adapter.requestDevice()`.
 * Includes `requiredFeatures: ["timestamp-query"]` when benchmark is enabled and supported;
 * returns an empty descriptor otherwise so the device is still created without benchmark support.
 * @param {GPUAdapter} adapter
 * @param {boolean} enabled
 * @returns {{ requiredFeatures?: string[] }}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUSupportedFeatures GPUSupportedFeatures.has()} (`timestamp-query`)
 * @see {@link https://developer.chrome.com/blog/new-in-webgpu-121 Chrome 121 — timestamp queries}
 */
export function benchmarkMode(adapter, enabled) {
  if (!enabled) return {};
  if (adapter.features.has("timestamp-query"))
    return { requiredFeatures: ["timestamp-query"] };
  console.warn(
    "timestamp-query not supported on this device — benchmark mode disabled.",
  );
  return {};
}

/**
 * Creates a `GPUQuerySet` with two timestamp slots and a `passDescriptor` to pass
 * to `beginComputePass`. Index 0 = beginning of pass, index 1 = end of pass.
 * Returns nulls if benchmark mode is off.
 * @returns {{ querySet: GPUQuerySet|null, passDescriptor: object|undefined }}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUQuerySet GPUQuerySet}
 * @see {@link https://developer.chrome.com/blog/new-in-webgpu-121 Chrome 121 — timestamp queries (querySet + timestampWrites pattern, quantization caveat)}
 */
export function beginTimestamp(device) {
  if (!isBenchmarkEnabled(device))
    return { querySet: null, passDescriptor: undefined };
  // Two slots: index 0 written when the pass begins, index 1 when it ends.
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

/**
 * Encodes commands to resolve the two timestamp slots into a CPU-readable buffer.
 * Timestamps are stored as 64-bit unsigned integers (nanoseconds); `extractTimestamp`
 * reads them back. Returns `null` if `querySet` is null (benchmark mode off).
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPUQuerySet|null} querySet
 * @returns {{ tsReadBuffer: GPUBuffer, resolveBuffer: GPUBuffer, querySet: GPUQuerySet }|null}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/resolveQuerySet GPUCommandEncoder.resolveQuerySet()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/copyBufferToBuffer GPUCommandEncoder.copyBufferToBuffer()}
 */
export function resolveTimestamp(device, commandEncoder, querySet) {
  if (!querySet) return null;
  // QUERY_RESOLVE and MAP_READ cannot be combined — two buffers are required.
  // resolveBuffer: GPU writes resolved nanosecond timestamps here.
  const resolveBuffer = device.createBuffer({
    label: "timestamp-resolve",
    size: 16, // 2 × BigInt64 (8 bytes each)
    usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
  });
  commandEncoder.resolveQuerySet(querySet, 0, 2, resolveBuffer, 0);
  // tsReadBuffer: CPU-readable copy of resolveBuffer, mapped in extractTimestamp.
  const tsReadBuffer = device.createBuffer({
    label: "timestamp-readback",
    size: 16,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  commandEncoder.copyBufferToBuffer(
    resolveBuffer, 0,   // src, srcOffset
    tsReadBuffer,  0,   // dst, dstOffset
    16,                 // full 16 bytes (both timestamps)
  );
  // resolveBuffer is returned to prevent GC — the copy command is only encoded here, not yet executed.
  return { tsReadBuffer, resolveBuffer, querySet };
}

/**
 * Maps the readback buffer, computes `timestamps[1] - timestamps[0]` (nanoseconds),
 * converts to milliseconds, then destroys all three handles.
 * Returns `undefined` if `ts` is null (benchmark mode off).
 * @param {{ tsReadBuffer: GPUBuffer, resolveBuffer: GPUBuffer, querySet: GPUQuerySet }|null} ts
 * @returns {Promise<number|undefined>} elapsed GPU time in ms
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/mapAsync GPUBuffer.mapAsync()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/getMappedRange GPUBuffer.getMappedRange()}
 */
export async function extractTimestamp(ts) {
  if (!ts) return undefined;
  const { tsReadBuffer, resolveBuffer, querySet } = ts;
  await tsReadBuffer.mapAsync(GPUMapMode.READ);
  const timestamps = new BigInt64Array(tsReadBuffer.getMappedRange().slice());
  tsReadBuffer.unmap();
  tsReadBuffer.destroy();
  resolveBuffer.destroy(); // never mapped — no unmap() needed
  querySet.destroy();
  return Math.max(0, Number(timestamps[1] - timestamps[0])) / 1e6;
}
