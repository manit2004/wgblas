// Bind group assembly.
//
// createBindGroup maps an array of buffers onto consecutive @binding indices,
// so the array order must match the shader's declared bindings. It also accepts
// {buffer, offset, size} sub-ranges, which is how routines pack many small
// per-call param structs into one shared buffer instead of allocating a tiny
// buffer per call (strsm does this heavily).
//
// Correctness here is only observable through a real dispatch, so these tests
// bind against sscal's actual layout — @binding(0) storage x, @binding(1)
// uniform params — and check the kernel read what we intended.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { uploadBuffer, createParamsBuffer, stageReadback, destroyBuffers } from "../../src/util/buffer.mjs";
import { createBindGroup } from "../../src/util/bindgroup.mjs";
import { getPipeline } from "../../src/util/pipeline.mjs";
import { runComputePass, submit } from "../../src/util/compute.mjs";
import { extractResult } from "../../src/util/result.mjs";
import { calcWorkgroups } from "../../src/util/workgroup.mjs";
import { getPowerPreference } from "../helpers/device.js";

let device;
let pipeline;

before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
  pipeline = await getPipeline(device, "sscal");
});
after(() => cleanup());

/** Runs sscal via a bind group built by `build`, returning the scaled vector. */
async function runWith(build, data, alpha) {
  const xBuf = uploadBuffer(device, data, "bg-x", true);
  const params = createParamsBuffer(device, [
    { value: data.length, type: "u32" },
    { value: alpha, type: "f32" },
    { value: 1, type: "u32" },
  ], "bg-params");
  try {
    const bindGroup = build(xBuf, params);
    const { commandEncoder } = runComputePass(
      device, pipeline, bindGroup, calcWorkgroups(device, data.length),
    );
    const rb = stageReadback(device, commandEncoder, xBuf);
    submit(device, commandEncoder);
    return await extractResult(rb, Float32Array);
  } finally {
    destroyBuffers(xBuf, params);
  }
}

test("binds buffers to consecutive indices starting at 0", async () => {
  const out = await runWith(
    (x, p) => createBindGroup(device, pipeline.getBindGroupLayout(0), [x, p]),
    new Float32Array([1, 2, 3, 4]), 3,
  );
  assert.deepEqual(out, new Float32Array([3, 6, 9, 12]), "kernel should have seen x at 0 and params at 1");
});

test("plain GPUBuffers and {buffer, offset, size} entries are interchangeable", async () => {
  // An explicit whole-buffer range must behave exactly like passing the buffer.
  const out = await runWith(
    (x, p) => createBindGroup(device, pipeline.getBindGroupLayout(0), [
      { buffer: x, offset: 0, size: x.size },
      { buffer: p, offset: 0, size: p.size },
    ]),
    new Float32Array([1, 2, 3, 4]), 2,
  );
  assert.deepEqual(out, new Float32Array([2, 4, 6, 8]));
});

test("a sub-range entry binds only its slice of a shared buffer", async () => {
  // Two param structs packed into one buffer; binding the second slice must
  // make the kernel read the second struct's alpha, not the first's.
  const n = 4;
  const data = new Float32Array([1, 2, 3, 4]);
  const xBuf = uploadBuffer(device, data, "bg-x", true);
  const first = createParamsBuffer(device, [
    { value: n, type: "u32" }, { value: 10, type: "f32" }, { value: 1, type: "u32" },
  ], "bg-p0");
  const second = createParamsBuffer(device, [
    { value: n, type: "u32" }, { value: 5, type: "f32" }, { value: 1, type: "u32" },
  ], "bg-p1");
  try {
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuf,
      { buffer: second, offset: 0, size: second.size },
    ]);
    const { commandEncoder } = runComputePass(device, pipeline, bindGroup, calcWorkgroups(device, n));
    const rb = stageReadback(device, commandEncoder, xBuf);
    submit(device, commandEncoder);
    assert.deepEqual(await extractResult(rb, Float32Array), new Float32Array([5, 10, 15, 20]),
      "should have used the second struct's alpha");
  } finally {
    destroyBuffers(xBuf, first, second);
  }
});

test("startBinding shifts every entry's index", async () => {
  // sscal's layout has no binding 1..2, so shifting must be rejected by
  // WebGPU — proving the offset is really applied rather than ignored.
  const xBuf = uploadBuffer(device, new Float32Array([1, 2]), "bg-x", true);
  const params = createParamsBuffer(device, [
    { value: 2, type: "u32" }, { value: 2, type: "f32" }, { value: 1, type: "u32" },
  ], "bg-params");
  try {
    device.pushErrorScope("validation");
    createBindGroup(device, pipeline.getBindGroupLayout(0), [xBuf, params], 1);
    const err = await device.popErrorScope();
    assert.ok(err, "binding at an offset the layout does not declare should be a validation error");
  } finally {
    destroyBuffers(xBuf, params);
  }
});

test("an empty buffer list produces an empty bind group", async () => {
  // No entries is structurally valid; it just cannot satisfy sscal's layout.
  device.pushErrorScope("validation");
  createBindGroup(device, pipeline.getBindGroupLayout(0), []);
  const err = await device.popErrorScope();
  assert.ok(err, "sscal's layout requires two bindings, so an empty group is invalid");
});
