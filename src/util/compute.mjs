/** @module devdocs/utility-functions/compute */
import { beginTimestamp, resolveTimestamp } from "./benchmark.mjs";

// Anchors the pass encoder to its command encoder to prevent premature GC.
const _passEncoders = new WeakMap();

/**
 * Finalises `commandEncoder` into a command buffer and submits it to the GPU queue.
 * @param {GPUCommandEncoder} commandEncoder
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/submit GPUQueue.submit()}
 */
export function submit(device, commandEncoder) {
  device.queue.submit([commandEncoder.finish()]);
}

/**
 * Starts a new command encoder together with its GPU timestamp query (if
 * benchmarking is enabled) — the pairing every routine needs before encoding
 * its first pass, whether that's `runComputePass`'s single pass or a
 * multi-pass routine (e.g. strsv's blocked solve) encoding several by hand.
 * @returns {{ commandEncoder: GPUCommandEncoder, querySet: GPUQuerySet|null, passDescriptor: object|undefined }}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createCommandEncoder GPUDevice.createCommandEncoder()}
 */
export function beginTimedEncoder(device) {
  const { querySet, passDescriptor } = beginTimestamp(device);
  const commandEncoder = device.createCommandEncoder();
  return { commandEncoder, querySet, passDescriptor };
}

/**
 * Encodes one compute pass (set pipeline, set bind group, dispatch, end) onto an
 * existing command encoder — the shared building block behind `runComputePass`,
 * also used directly by routines that need several passes on one encoder (e.g.
 * strsv's blocked solve, where each pass depends on the previous one completing).
 * @param {GPUCommandEncoder} commandEncoder
 * @param {GPUComputePipeline} pipeline
 * @param {GPUBindGroup} bindGroup
 * @param {number | { x: number, y: number, z?: number }} workgroups - workgroup count;
 *   number for 1D dispatch, `{x, y}` for 2D, `{x, y, z}` for 3D (z defaults to 1)
 * @param {object} [passDescriptor] - passed to `beginComputePass`, e.g. for timestamp writes
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginComputePass GPUCommandEncoder.beginComputePass()}
 */
export function encodePass(commandEncoder, pipeline, bindGroup, workgroups, passDescriptor) {
  const passEncoder = commandEncoder.beginComputePass(passDescriptor);

  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  if (typeof workgroups === "number") {
    passEncoder.dispatchWorkgroups(workgroups);
  } else {
    // `?? 1` is load-bearing — confirmed passing undefined (from an {x,y}-only caller) crashes the process, not just no-ops.
    passEncoder.dispatchWorkgroups(workgroups.x, workgroups.y, workgroups.z ?? 1);
  }

  passEncoder.end();

  _passEncoders.set(commandEncoder, passEncoder);
}

/**
 * Encodes and submits a single compute pass: sets the pipeline and bind group,
 * dispatches workgroups, and optionally wraps the pass in GPU timestamp queries.
 * @param {GPUComputePipeline} pipeline
 * @param {GPUBindGroup} bindGroup
 * @param {number | { x: number, y: number, z?: number }} workgroups - workgroup count;
 *   number for 1D dispatch, `{x, y}` for 2D, `{x, y, z}` for 3D (z defaults to 1)
 * @returns {{ commandEncoder: GPUCommandEncoder, ts: any }} encoded commands and timestamp handle
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createCommandEncoder GPUDevice.createCommandEncoder()}
 */
export function runComputePass(device, pipeline, bindGroup, workgroups) {
  const { commandEncoder, querySet, passDescriptor } = beginTimedEncoder(device);
  encodePass(commandEncoder, pipeline, bindGroup, workgroups, passDescriptor);

  const ts = resolveTimestamp(device, commandEncoder, querySet);

  return { commandEncoder, ts };
}
