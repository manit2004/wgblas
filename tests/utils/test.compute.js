// Command encoding and submission.
//
// beginTimedEncoder pairs a command encoder with a timestamp query set (null
// unless the device was created with benchmark: true). encodePass writes one
// compute pass onto an existing encoder — routines that need several dependent
// passes (strsv's blocked solve) call it directly. runComputePass is the
// single-pass shorthand. submit finishes the encoder onto the device queue.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { uploadBuffer, createParamsBuffer, stageReadback, destroyBuffers } from "../../src/util/buffer.mjs";
import { createBindGroup } from "../../src/util/bindgroup.mjs";
import { getPipeline } from "../../src/util/pipeline.mjs";
import { beginTimedEncoder, encodePass, runComputePass, submit } from "../../src/util/compute.mjs";
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

/** Buffers plus a bind group for `x := alpha*x`. Caller destroys via `.free()`. */
function sscalSetup(data, alpha) {
  const xBuf = uploadBuffer(device, data, "compute-x", true);
  const params = createParamsBuffer(device, [
    { value: data.length, type: "u32" },
    { value: alpha, type: "f32" },
    { value: 1, type: "u32" },
  ], "compute-params");
  const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [xBuf, params]);
  return { xBuf, params, bindGroup, free: () => destroyBuffers(xBuf, params) };
}

test("beginTimedEncoder returns an encoder, with no query set off benchmark mode", () => {
  const { commandEncoder, querySet, passDescriptor } = beginTimedEncoder(device);
  assert.ok(commandEncoder, "expected a command encoder");
  assert.equal(querySet, null, "benchmark mode is off, so there should be no query set");
  assert.equal(passDescriptor, undefined, "and no timestampWrites descriptor");
});

test("runComputePass encodes a dispatch that actually runs", async () => {
  const s = sscalSetup(new Float32Array([1, 2, 3, 4]), 3);
  try {
    const { commandEncoder, ts } = runComputePass(device, pipeline, s.bindGroup, calcWorkgroups(device, 4));
    assert.equal(ts, null, "no timestamps without benchmark mode");
    const rb = stageReadback(device, commandEncoder, s.xBuf);
    submit(device, commandEncoder);
    assert.deepEqual(await extractResult(rb, Float32Array), new Float32Array([3, 6, 9, 12]));
  } finally {
    s.free();
  }
});

test("encodePass can put several dependent passes on one encoder", async () => {
  // The multi-pass path (strsv, strsm): passes on one encoder run in order, so
  // scaling by 2 three times must compound to 8x rather than racing.
  const s = sscalSetup(new Float32Array([1, 2, 3, 4]), 2);
  try {
    const { commandEncoder } = beginTimedEncoder(device);
    const wg = calcWorkgroups(device, 4);
    encodePass(commandEncoder, pipeline, s.bindGroup, wg);
    encodePass(commandEncoder, pipeline, s.bindGroup, wg);
    encodePass(commandEncoder, pipeline, s.bindGroup, wg);
    const rb = stageReadback(device, commandEncoder, s.xBuf);
    submit(device, commandEncoder);
    assert.deepEqual(await extractResult(rb, Float32Array), new Float32Array([8, 16, 24, 32]),
      "three sequential doublings should compound");
  } finally {
    s.free();
  }
});

test("a {x, y} count dispatches the same as an explicit z of 1", async () => {
  // encodePass supplies `workgroups.z ?? 1`, so 2D callers behave as 3D with
  // depth 1. Note this does NOT reproduce the crash compute.mjs's comment
  // describes: on this Dawn build dispatchWorkgroups(1, 1, undefined) is
  // simply equivalent to z=1, so the `?? 1` cannot be shown to be
  // load-bearing here. This pins the observable behaviour instead.
  const run = async (workgroups) => {
    const s = sscalSetup(new Float32Array([1, 2, 3, 4]), 2);
    try {
      const { commandEncoder } = beginTimedEncoder(device);
      encodePass(commandEncoder, pipeline, s.bindGroup, workgroups);
      const rb = stageReadback(device, commandEncoder, s.xBuf);
      submit(device, commandEncoder);
      return await extractResult(rb, Float32Array);
    } finally {
      s.free();
    }
  };
  const twoD = await run({ x: 1, y: 1 });
  assert.deepEqual(twoD, new Float32Array([2, 4, 6, 8]), "{x, y} should dispatch normally");
  assert.deepEqual(await run({ x: 1, y: 1, z: 1 }), twoD, "an explicit z of 1 must match");
});

test("submitting an encoder twice is rejected", async () => {
  // finish() consumes the encoder; a double submit is a validation error, not
  // a silent replay.
  const s = sscalSetup(new Float32Array([1, 2]), 2);
  try {
    const { commandEncoder } = beginTimedEncoder(device);
    encodePass(commandEncoder, pipeline, s.bindGroup, calcWorkgroups(device, 2));
    submit(device, commandEncoder);
    device.pushErrorScope("validation");
    submit(device, commandEncoder); // encoder already consumed
    const err = await device.popErrorScope();
    assert.ok(err, "re-finishing a consumed encoder should be a validation error");
  } finally {
    s.free();
  }
});

test("an encoder with no passes submits cleanly", async () => {
  const { commandEncoder } = beginTimedEncoder(device);
  device.pushErrorScope("validation");
  submit(device, commandEncoder);
  assert.equal(await device.popErrorScope(), null, "an empty encoder is valid");
});
