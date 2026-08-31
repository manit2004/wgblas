// Peak FP32 throughput probe — the compute roof for scripts/roofline.py.
//
// A roofline needs a compute ceiling, and taking it from the BLAS kernels
// themselves is circular: whichever kernel is fastest defines the roof and then
// scores 100% of it by construction. This measures the ceiling independently,
// with a kernel that touches memory once at the end and otherwise does nothing
// but fused multiply-adds out of registers.
//
// The shape matters. A single dependent chain of FMAs measures FMA *latency*,
// not throughput — each instruction waits on the previous one. CHAINS
// independent accumulators per thread keep enough in flight to saturate the
// issue rate instead, which is what a roof is supposed to represent.
//
// Timed with the same timestamp queries the routines use, so the ceiling and
// the measurements under it come from one clock.

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
const WORKGROUPS = 1024;
const CHAINS = 8; // independent FMA chains per thread — enough to hide latency
const ITERS = 4096;
const WARMUP_ITERS = 3;
const BENCH_ITERS = 20;

const THREADS = WORKGROUPS * WORKGROUP_SIZE;
// Two flops per FMA, one FMA per chain per iteration, per thread.
const FLOPS = THREADS * ITERS * CHAINS * 2;

const COLS = ["threads", "iters", "chains", "compute_ms", "compute_GFLOPs"];

const decls = Array.from(
  { length: CHAINS },
  (_, i) => `  var a${i} = seed + ${(i * 0.125).toFixed(3)};`,
).join("\n");
const body = Array.from(
  { length: CHAINS },
  (_, i) => `    a${i} = fma(a${i}, b, c);`,
).join("\n");
const total = Array.from({ length: CHAINS }, (_, i) => `a${i}`).join(" + ");

// b and c are just off 1.0 and 0.0 so the values stay finite over ITERS
// rounds while remaining opaque to the shader compiler — the accumulators
// feed `sink`, so none of this can be folded away as dead code.
const WGSL = `
@group(0) @binding(0) var<storage, read_write> sink: array<f32>;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let seed = f32(gid.x) * 1e-7;
  let b = 1.0000001;
  let c = 0.0000001;
${decls}
  for (var i = 0u; i < ${ITERS}u; i = i + 1u) {
${body}
  }
  sink[gid.x] = ${total};
}
`;

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();

const sink = device.createBuffer({
  size: THREADS * 4,
  usage: GPUBufferUsage.STORAGE,
});
const module = device.createShaderModule({ code: WGSL });
const pipeline = device.createComputePipeline({
  layout: "auto",
  compute: { module, entryPoint: "main" },
});
const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: sink } }],
});

async function runOnce() {
  const { querySet, passDescriptor } = beginTimestamp(device);
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass(passDescriptor);
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.dispatchWorkgroups(WORKGROUPS);
  pass.end();
  const ts = resolveTimestamp(device, encoder, querySet);
  device.queue.submit([encoder.finish()]);
  return await extractTimestamp(ts);
}

printHeader(COLS);

for (let i = 0; i < WARMUP_ITERS; i++) await runOnce();

const times = [];
for (let i = 0; i < BENCH_ITERS; i++) {
  const ms = await runOnce();
  if (Number.isFinite(ms) && ms > 0) times.push(ms);
}

sink.destroy();

const med = median(times);
const gflops = FLOPS / 1e9 / (med / 1e3);
printRow(COLS, [THREADS, ITERS, CHAINS, med, gflops]);

const records = [
  {
    threads: THREADS,
    iters: ITERS,
    chains: CHAINS,
    compute_ms: med,
    compute_GFLOPs: gflops,
  },
];

saveResults("roofline", gpuModel, records, {
  folder: "roofline",
  fileName: "fma",
});

cleanup();
