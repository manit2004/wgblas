import { moduleSource } from "./chunk-32RUOGEA.mjs";
import {
  cleanup,
  createResultBuffer,
  extractResult,
  init,
  stageReadback,
  uploadBuffer,
} from "./chunk-DRWHW5N5.mjs";
import { getPowerPreference } from "./chunk-CMILENUZ.mjs";
import "./chunk-AIAZUKYM.mjs";
import "./chunk-KEJR4IRF.mjs";
import "./chunk-UIYSXR5Q.mjs";
import "./chunk-3HAMCUKM.mjs";
import "./chunk-2ZD6UYXN.mjs";
import "./chunk-XFYS3TNK.mjs";
import { after, assert_default, before, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/shaders/src/test.dekker.js
var LIBRARY = [
  "f64/dekker",
  "f64/utils/add",
  "f64/utils/multiply",
  "f64/utils/batch",
];
var KERNEL =
  /* wgsl */
  `
struct Case {
  aHi: vec4<f32>,
  aLo: vec4<f32>,
  bHi: vec4<f32>,
  bLo: vec4<f32>,
}
@group(0) @binding(0) var<storage, read> cases: array<Case>;
@group(0) @binding(1) var<storage, read_write> out: array<vec4<f32>>;

fn put(base: u32, op: u32, r: DD4) {
  out[base + 2u * op] = r.hi;
  out[base + 2u * op + 1u] = r.lo;
}

// v with lane l set to d, by vector select: like lane4 (batch.wgsl) for
// reads, a runtime-indexed write v[l] = x isn't safe next to Inf/NaN.
fn withLane(v: DD4, l: u32, d: DD) -> DD4 {
  let at = vec4<u32>(0u, 1u, 2u, 3u) == vec4<u32>(l);
  return DD4(select(v.hi, vec4<f32>(d.hi), at), select(v.lo, vec4<f32>(d.lo), at));
}

@compute @workgroup_size(1)
fn main(@builtin(workgroup_id) wg: vec3<u32>) {
  let c = cases[wg.x];
  let a = DD4(c.aHi, c.aLo);
  let b = DD4(c.bHi, c.bLo);
  let base = wg.x * 16u;

  put(base, 0u, twoSum4Protected(c.aHi, c.bHi, 0u));
  put(base, 1u, twoProdBit4(c.aHi, c.bHi));
  put(base, 2u, ddAdd4Protected(a, b, 0u));
  put(base, 3u, ddMul4Protected(a, b, 0u));

  var sum: DD4;
  var prod: DD4;
  var ddSum: DD4;
  var ddProd: DD4;
  // The scalar ops, one lane at a time. Lanes are read with lane4 \u2014 so this
  // also checks it with a runtime index \u2014 and written with withLane.
  for (var l = 0u; l < 4u; l++) {
    let al = dd4Lane(a, l);
    let bl = dd4Lane(b, l);
    sum = withLane(sum, l, twoSumProtected(al.hi, bl.hi, 0u));
    prod = withLane(prod, l, twoProdBit(al.hi, bl.hi));
    ddSum = withLane(ddSum, l, ddAddProtected(al, bl, 0u));
    ddProd = withLane(ddProd, l, ddMulProtected(al, bl, 0u));
  }
  put(base, 4u, sum);
  put(base, 5u, prod);
  put(base, 6u, ddSum);
  put(base, 7u, ddProd);
}
`;
var OPS = [
  "twoSum4Protected",
  "twoProdBit4",
  "ddAdd4Protected",
  "ddMul4Protected",
  "twoSumProtected",
  "twoProdBit",
  "ddAddProtected",
  "ddMulProtected",
];
var f = Math.fround;
var low = (hi) => (Number.isFinite(hi) ? f(hi * 2 ** -26) : 0);
var CASES = [
  ["finite", [1.5, -7.25, 1e10, 3], [3 * 2 ** -30, 0.1, -33e8, 1 / 3]],
  [
    "Inf next to finite",
    [1.5, Infinity, -7.25, -Infinity],
    [0.1, 1, 2 ** -29, 2],
  ],
  ["NaN next to finite", [NaN, 1.5, 3, NaN], [1, 0.1, 2 ** -29, 2]],
  ["overflow next to finite", [3e38, 1.5, -3e38, 2], [3e38, 0.25, -3e38, 1e-3]],
].map(([label, aHi, bHi]) => {
  const ah = aHi.map(f);
  const bh = bHi.map(f);
  return { label, aHi: ah, aLo: ah.map(low), bHi: bh, bLo: bh.map(low) };
});
function expected(op, c, l) {
  const a = c.aHi[l];
  const b = c.bHi[l];
  const exact = (v) => {
    const hi = f(v);
    return { hi, lo: Number.isFinite(hi) ? v - hi : 0 };
  };
  const dd = (v) => {
    const hi = f(v);
    return Number.isFinite(hi) ? { value: v, rel: 2 ** -40 } : { hi, lo: 0 };
  };
  const name = op.replace("4", "").replace("Protected", "");
  if (name === "twoSum") return exact(a + b);
  if (name === "twoProdBit") return exact(a * b);
  const av = a + c.aLo[l];
  const bv = b + c.bLo[l];
  return dd(name === "ddAdd" ? av + bv : av * bv);
}
function check(got, want, where) {
  if ("value" in want) {
    const v = got.hi + got.lo;
    const err = Math.abs(v - want.value) / Math.abs(want.value);
    assert_default.ok(
      err <= want.rel,
      `${where}: hi+lo = ${v} (hi ${got.hi}, lo ${got.lo}), want ${want.value} (rel error ${err})`,
    );
    return;
  }
  assert_default.ok(
    Object.is(got.hi, want.hi),
    `${where}: hi = ${got.hi}, want ${want.hi}`,
  );
  assert_default.ok(
    Number.isFinite(want.hi) ? got.lo === want.lo : got.lo === 0,
    `${where}: lo = ${got.lo}, want ${Number.isFinite(want.hi) ? want.lo : 0} (hi ${got.hi})`,
  );
}
var device;
before(async () => {
  device = await init({ powerPreference: getPowerPreference() });
});
after(() => cleanup());
test("f64 library ops lane by lane, finite next to Inf/NaN/overflow", async (t) => {
  const module = device.createShaderModule({
    code: `${moduleSource(LIBRARY)}
${KERNEL}`,
  });
  const pipeline = await device.createComputePipelineAsync({
    layout: "auto",
    compute: { module, entryPoint: "main" },
  });
  const input = new Float32Array(
    CASES.flatMap((c) => [...c.aHi, ...c.aLo, ...c.bHi, ...c.bLo]),
  );
  const inBuf = uploadBuffer(device, input, "dekker-test-cases");
  const outBuf = createResultBuffer(
    device,
    CASES.length * OPS.length * 2 * 16,
    "dekker-test-out",
  );
  const enc = device.createCommandEncoder();
  const pass = enc.beginComputePass();
  pass.setPipeline(pipeline);
  pass.setBindGroup(
    0,
    device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: inBuf } },
        { binding: 1, resource: { buffer: outBuf } },
      ],
    }),
  );
  pass.dispatchWorkgroups(CASES.length);
  pass.end();
  const readBuffer = stageReadback(device, enc, outBuf);
  device.queue.submit([enc.finish()]);
  const out = await extractResult(readBuffer);
  inBuf.destroy();
  outBuf.destroy();
  for (const [ci, c] of CASES.entries())
    for (const [oi, op] of OPS.entries()) {
      const base = (ci * OPS.length + oi) * 2 * 4;
      for (let l = 0; l < 4; l++) {
        const got = { hi: out[base + l], lo: out[base + 4 + l] };
        const where = `${c.label}, ${op}, lane ${l} (a=${c.aHi[l]}, b=${c.bHi[l]})`;
        await t.test(where, () => check(got, expected(op, c, l), where));
      }
    }
});
