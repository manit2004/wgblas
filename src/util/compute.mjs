/** @module devdocs/utility-functions/compute */
import { getDevice } from "../init.mjs";
import { beginTimestamp, resolveTimestamp } from "./benchmark.mjs";

/**
 * Finalises `commandEncoder` into a command buffer and submits it to the GPU queue.
 * @param {GPUCommandEncoder} commandEncoder
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/submit GPUQueue.submit()}
 */
export function submit(commandEncoder) {
  const device = getDevice();
  device.queue.submit([commandEncoder.finish()]);
}

/**
 * Encodes and submits a single compute pass: sets the pipeline and bind group,
 * dispatches workgroups, and optionally wraps the pass in GPU timestamp queries.
 * @param {GPUComputePipeline} pipeline
 * @param {GPUBindGroup} bindGroup
 * @param {number | { x: number, y: number }} workgroups - workgroup count; number for 1D dispatch, `{x, y}` for 2D
 * @returns {{ commandEncoder: GPUCommandEncoder, ts: any }} encoded commands and timestamp handle
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createCommandEncoder GPUDevice.createCommandEncoder()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder/beginComputePass GPUCommandEncoder.beginComputePass()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/setPipeline GPUComputePassEncoder.setPipeline()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/setBindGroup GPUComputePassEncoder.setBindGroup()}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/dispatchWorkgroups GPUComputePassEncoder.dispatchWorkgroups()}
 */
export function runComputePass(pipeline, bindGroup, workgroups) {
  const device = getDevice();

  const { querySet, passDescriptor } = beginTimestamp();

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass(passDescriptor);

  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  if (typeof workgroups === "number") {
    passEncoder.dispatchWorkgroups(workgroups);
  } else {
    passEncoder.dispatchWorkgroups(workgroups.x, workgroups.y);
  }

  passEncoder.end();

  const ts = resolveTimestamp(commandEncoder, querySet);

  commandEncoder._passEncoder = passEncoder; // anchor — GC'd passEncoder may crash native encoder

  return { commandEncoder, ts };
}
