import {
  beginTimedEncoder,
  cleanup,
  createBindGroup,
  createParamsBuffer,
  destroyBuffers,
  encodePass,
  extractResult,
  getPipeline,
  init,
  runComputePass,
  stageReadback,
  submit,
  uploadBuffer,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import { calcWorkgroups } from "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.compute.js
var device;
var pipeline;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
  pipeline = await getPipeline(device, "sscal");
});
after(() => cleanup());
function sscalSetup(data, alpha) {
  const xBuf = uploadBuffer(device, data, "compute-x", true);
  const params = createParamsBuffer(
    device,
    [
      { value: data.length, type: "u32" },
      { value: alpha, type: "f32" },
      { value: 1, type: "u32" },
    ],
    "compute-params",
  );
  const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
    xBuf,
    params,
  ]);
  return { xBuf, params, bindGroup, free: () => destroyBuffers(xBuf, params) };
}
test("beginTimedEncoder returns an encoder, with no query set off benchmark mode", () => {
  const { commandEncoder, querySet, passDescriptor } =
    beginTimedEncoder(device);
  assert_default.ok(commandEncoder, "expected a command encoder");
  assert_default.equal(
    querySet,
    null,
    "benchmark mode is off, so there should be no query set",
  );
  assert_default.equal(
    passDescriptor,
    void 0,
    "and no timestampWrites descriptor",
  );
});
test("runComputePass encodes a dispatch that actually runs", async () => {
  const s = sscalSetup(new Float32Array([1, 2, 3, 4]), 3);
  try {
    const { commandEncoder, ts } = runComputePass(
      device,
      pipeline,
      s.bindGroup,
      calcWorkgroups(device, 4),
    );
    assert_default.equal(ts, null, "no timestamps without benchmark mode");
    const rb = stageReadback(device, commandEncoder, s.xBuf);
    submit(device, commandEncoder);
    assert_default.deepEqual(
      await extractResult(rb, Float32Array),
      new Float32Array([3, 6, 9, 12]),
    );
  } finally {
    s.free();
  }
});
test("encodePass can put several dependent passes on one encoder", async () => {
  const s = sscalSetup(new Float32Array([1, 2, 3, 4]), 2);
  try {
    const { commandEncoder } = beginTimedEncoder(device);
    const wg = calcWorkgroups(device, 4);
    encodePass(commandEncoder, pipeline, s.bindGroup, wg);
    encodePass(commandEncoder, pipeline, s.bindGroup, wg);
    encodePass(commandEncoder, pipeline, s.bindGroup, wg);
    const rb = stageReadback(device, commandEncoder, s.xBuf);
    submit(device, commandEncoder);
    assert_default.deepEqual(
      await extractResult(rb, Float32Array),
      new Float32Array([8, 16, 24, 32]),
      "three sequential doublings should compound",
    );
  } finally {
    s.free();
  }
});
test("a {x, y} count dispatches the same as an explicit z of 1", async () => {
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
  assert_default.deepEqual(
    twoD,
    new Float32Array([2, 4, 6, 8]),
    "{x, y} should dispatch normally",
  );
  assert_default.deepEqual(
    await run({ x: 1, y: 1, z: 1 }),
    twoD,
    "an explicit z of 1 must match",
  );
});
test("submitting an encoder twice is rejected", async () => {
  const s = sscalSetup(new Float32Array([1, 2]), 2);
  try {
    const { commandEncoder } = beginTimedEncoder(device);
    encodePass(
      commandEncoder,
      pipeline,
      s.bindGroup,
      calcWorkgroups(device, 2),
    );
    submit(device, commandEncoder);
    device.pushErrorScope("validation");
    submit(device, commandEncoder);
    const err = await device.popErrorScope();
    assert_default.ok(
      err,
      "re-finishing a consumed encoder should be a validation error",
    );
  } finally {
    s.free();
  }
});
test("an encoder with no passes submits cleanly", async () => {
  const { commandEncoder } = beginTimedEncoder(device);
  device.pushErrorScope("validation");
  submit(device, commandEncoder);
  assert_default.equal(
    await device.popErrorScope(),
    null,
    "an empty encoder is valid",
  );
});
