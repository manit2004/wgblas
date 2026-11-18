import {
  cleanup,
  createBindGroup,
  createParamsBuffer,
  destroyBuffers,
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

// tests/utils/test.bindgroup.js
var device;
var pipeline;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
  pipeline = await getPipeline(device, "sscal");
});
after(() => cleanup());
async function runWith(build, data, alpha) {
  const xBuf = uploadBuffer(device, data, "bg-x", true);
  const params = createParamsBuffer(
    device,
    [
      { value: data.length, type: "u32" },
      { value: alpha, type: "f32" },
      { value: 1, type: "u32" },
    ],
    "bg-params",
  );
  try {
    const bindGroup = build(xBuf, params);
    const { commandEncoder } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, data.length),
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
    new Float32Array([1, 2, 3, 4]),
    3,
  );
  assert_default.deepEqual(
    out,
    new Float32Array([3, 6, 9, 12]),
    "kernel should have seen x at 0 and params at 1",
  );
});
test("plain GPUBuffers and {buffer, offset, size} entries are interchangeable", async () => {
  const out = await runWith(
    (x, p) =>
      createBindGroup(device, pipeline.getBindGroupLayout(0), [
        { buffer: x, offset: 0, size: x.size },
        { buffer: p, offset: 0, size: p.size },
      ]),
    new Float32Array([1, 2, 3, 4]),
    2,
  );
  assert_default.deepEqual(out, new Float32Array([2, 4, 6, 8]));
});
test("a sub-range entry binds only its slice of a shared buffer", async () => {
  const n = 4;
  const data = new Float32Array([1, 2, 3, 4]);
  const xBuf = uploadBuffer(device, data, "bg-x", true);
  const first = createParamsBuffer(
    device,
    [
      { value: n, type: "u32" },
      { value: 10, type: "f32" },
      { value: 1, type: "u32" },
    ],
    "bg-p0",
  );
  const second = createParamsBuffer(
    device,
    [
      { value: n, type: "u32" },
      { value: 5, type: "f32" },
      { value: 1, type: "u32" },
    ],
    "bg-p1",
  );
  try {
    const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
      xBuf,
      { buffer: second, offset: 0, size: second.size },
    ]);
    const { commandEncoder } = runComputePass(
      device,
      pipeline,
      bindGroup,
      calcWorkgroups(device, n),
    );
    const rb = stageReadback(device, commandEncoder, xBuf);
    submit(device, commandEncoder);
    assert_default.deepEqual(
      await extractResult(rb, Float32Array),
      new Float32Array([5, 10, 15, 20]),
      "should have used the second struct's alpha",
    );
  } finally {
    destroyBuffers(xBuf, first, second);
  }
});
test("startBinding shifts every entry's index", async () => {
  const xBuf = uploadBuffer(device, new Float32Array([1, 2]), "bg-x", true);
  const params = createParamsBuffer(
    device,
    [
      { value: 2, type: "u32" },
      { value: 2, type: "f32" },
      { value: 1, type: "u32" },
    ],
    "bg-params",
  );
  try {
    device.pushErrorScope("validation");
    createBindGroup(device, pipeline.getBindGroupLayout(0), [xBuf, params], 1);
    const err = await device.popErrorScope();
    assert_default.ok(
      err,
      "binding at an offset the layout does not declare should be a validation error",
    );
  } finally {
    destroyBuffers(xBuf, params);
  }
});
test("an empty buffer list produces an empty bind group", async () => {
  device.pushErrorScope("validation");
  createBindGroup(device, pipeline.getBindGroupLayout(0), []);
  const err = await device.popErrorScope();
  assert_default.ok(
    err,
    "sscal's layout requires two bindings, so an empty group is invalid",
  );
});
