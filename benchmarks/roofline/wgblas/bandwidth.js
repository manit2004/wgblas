// Peak memory bandwidth probe — the memory roof for scripts/roofline.py.
//
// The companion to fma.js. Between them the two roofs are measured rather than
// typed in from a datasheet, which matters because every "% of roof" figure in
// the analysis is divided by them.
//
// Three access patterns, because no single one is fastest everywhere and a
// ceiling has to be the best of them — a roof below what the routines under it
// achieve is worse than useless. Read-only wins on the discrete card; in-place
// read-modify-write wins on the integrated one, where touching one buffer
// instead of two halves the footprint and the locality pays more than the
// saved write. Measuring only a copy understated both.
//
// vec4 rather than scalar f32 because a 16-byte access per lane is what
// saturates the bus; a scalar version leaves bandwidth on the table.
//
// Deliberately not reused from scopy or sdot: those are the kernels being
// measured against this ceiling, so taking the ceiling from them would be
// circular.

import { init, cleanup } from "wgblas";
import {
  beginTimestamp,
  resolveTimestamp,
  extractTimestamp,
} from "../../../src/util/benchmark.mjs";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const WORKGROUP_SIZE = 256;
// Passes encoded into a single submit. One pass over 64 MiB finishes in well
// under a millisecond, where the fixed cost of a submit is a large enough
// fraction to drag the measured rate below what the BLAS kernels themselves
// reach — which would make the roof lower than the routines under it. Batching
// pushes each timed region into the millisecond range and amortises it away.
const PASSES = 20;
const WARMUP_ITERS = 5;
const BENCH_ITERS = 20;

const COLS = ["pattern", "bytes", "compute_ms", "compute_GBs"];

// No bounds check in either kernel: the element count is rounded to a whole
// number of workgroups below, so every invocation is in range. The check is
// not free — an arrayLength() plus a branch on every invocation of a kernel
// that does nothing but move 16 bytes measurably depresses the result, and a
// roof that reads low is worse than useless.
const COPY_WGSL = `
@group(0) @binding(0) var<storage, read> src: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> dst: array<vec4<f32>>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  dst[gid.x] = src[gid.x];
}
`;

// Read-only. The store is guarded by a condition the data never satisfies, so
// nothing is written in practice, but the compiler cannot prove that and so
// cannot drop the load.
// In-place read-modify-write over a single buffer — the sscal shape. It binds
// only the one buffer: `layout: "auto"` derives the layout from what the
// shader actually uses, so binding a second, unused buffer here is an error.
const SCALE_WGSL = `
@group(0) @binding(0) var<storage, read_write> buf: array<vec4<f32>>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  buf[gid.x] = buf[gid.x] * 1.0000001;
}
`;

// Scalar counterparts. vec4 saturates the bus on the discrete card, but a
// 16-byte-per-lane access is not universally best — the integrated GPU reaches
// a higher rate with plain f32, which is the shape sscal itself uses.
const SCALE_F32_WGSL = `
@group(0) @binding(0) var<storage, read_write> buf: array<f32>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  buf[gid.x] = buf[gid.x] * 1.0000001;
}
`;

const READ_F32_WGSL = `
@group(0) @binding(0) var<storage, read> src: array<f32>;
@group(0) @binding(1) var<storage, read_write> dst: array<f32>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let v = src[gid.x];
  if (v == 1e30) {
    dst[0] = v;
  }
}
`;

const READ_WGSL = `
@group(0) @binding(0) var<storage, read> src: array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> dst: array<vec4<f32>>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let v = src[gid.x];
  if (v.x + v.y + v.z + v.w == 1e30) {
    dst[0] = v;
  }
}
`;

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();

// As large as the device will bind, so the copy runs well past every cache and
// measures DRAM rather than SRAM. Two buffers, hence half the limit each.
const cap = device.limits.maxStorageBufferBindingSize;
const bytesPerBuffer = Math.min(cap, 64 * 1024 * 1024);
// Rounded down to a whole number of workgroups so the kernels need no bounds
// check.
const vec4Count =
  Math.floor(bytesPerBuffer / 16 / WORKGROUP_SIZE) * WORKGROUP_SIZE;
const elems = vec4Count * 4;

const src = device.createBuffer({
  size: vec4Count * 16,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
const dst = device.createBuffer({
  size: vec4Count * 16,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
const seed = new Float32Array(elems).fill(1);
device.queue.writeBuffer(src, 0, seed);
device.queue.writeBuffer(dst, 0, seed);

const workgroups = vec4Count / WORKGROUP_SIZE;

function build(code, buffers) {
  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module: device.createShaderModule({ code }), entryPoint: "main" },
  });
  return {
    pipeline,
    bindGroup: device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: buffers.map((buffer, binding) => ({
        binding,
        resource: { buffer },
      })),
    }),
  };
}

// Timed with the same timestamp queries the routines use, not wall clock. That
// matters for a ceiling: wall time includes submit and sync overhead the
// routines' own gpuTimeMs excludes, which made an earlier version of this
// probe read ~8% low — below what sscal achieves on the integrated GPU, so the
// roof sat under the routines it was meant to bound.
async function runOnce(p, wg) {
  const { querySet, passDescriptor } = beginTimestamp(device);
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass(passDescriptor);
  pass.setPipeline(p.pipeline);
  pass.setBindGroup(0, p.bindGroup);
  for (let i = 0; i < PASSES; i++) pass.dispatchWorkgroups(wg);
  pass.end();
  const ts = resolveTimestamp(device, encoder, querySet);
  device.queue.submit([encoder.finish()]);
  return await extractTimestamp(ts);
}

printHeader(COLS);

const records = [];
for (const [pattern, code, perElem, buffers] of [
  // pattern, shader, bytes moved per element, buffers to bind
  ["copy", COPY_WGSL, 32, [src, dst]],  // read + write, two buffers
  ["scale", SCALE_WGSL, 32, [dst]],     // read + write, one buffer, in place
  ["read", READ_WGSL, 16, [src, dst]],  // read only
  ["scale_f32", SCALE_F32_WGSL, 8, [dst]],    // scalar, read + write, in place
  ["read_f32", READ_F32_WGSL, 4, [src, dst]], // scalar, read only
]) {
  const scalar = pattern.endsWith("_f32");
  // A scalar kernel needs one invocation per f32, four times as many as the
  // vec4 kernels, which lands just past maxComputeWorkgroupsPerDimension —
  // clamp, and count only the elements actually dispatched over.
  const wg = Math.min(
    device.limits.maxComputeWorkgroupsPerDimension,
    scalar ? workgroups * 4 : workgroups,
  );
  const elemsDone = wg * WORKGROUP_SIZE;
  const p = build(code, buffers);
  for (let i = 0; i < WARMUP_ITERS; i++) await runOnce(p, wg);
  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const ms = await runOnce(p, wg);
    if (Number.isFinite(ms) && ms > 0) times.push(ms);
  }
  const med = median(times);
  // perElem is per f32 for the scalar kernels, per vec4 for the others.
  const bytes = elemsDone * perElem * PASSES;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [pattern, bytes, med, gbs]);
  records.push({ pattern, bytes, compute_ms: med, compute_GBs: gbs });
}

src.destroy();
dst.destroy();

saveResults("roofline", gpuModel, records, {
  folder: "roofline",
  fileName: "bandwidth",
});

cleanup();
