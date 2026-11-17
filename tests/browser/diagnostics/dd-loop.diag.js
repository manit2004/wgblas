// Diagnostic, not part of the suite: run with
//   node tests/browser/run.mjs tests/browser/diagnostics/dd-loop.diag.js
// (browser only — it reads the bundled shader sources). Add
// WGBLAS_BROWSER_ARGS=--disable-dawn-features=use_dxc for FXC as a control.
//
// dtrsv_small gave wrong answers in Chrome on Windows (DXC's code on D3D12's
// WARP) for every n > 1; FXC's code was right, and DXC's was wrong with its
// optimizer on or off. Each kernel here has dtrsv_small's shape — 256
// threads, a loop bounded by a uniform, the protected double-double ops (with
// their barriers) inside it — and computes b_i = 100 − Σ_j a_ij·x_j over 8
// rows, changing one thing at a time.
//
// Found (Chrome 156, windows-latest, WARP): only "a_ij loaded a step ahead"
// fails under DXC — `let aj = aNext; aNext = load(j + 1)` runs with aj already
// holding the next step's value (row 1 gives 100 − a₁₁·x₀, not a₁₀). Every
// variant passes under FXC, and "next a_ij loaded at the end of the step",
// dtrsv_small's fix, passes under both. A minimal repro for a bug report.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { init, cleanup } from "wgblas";
import { shaderSources } from "../../../src/shaders/index.mjs";
import {
  uploadBuffer,
  createResultBuffer,
  stageReadback,
} from "../../../src/util/buffer.mjs";
import { extractResult } from "../../../src/util/result.mjs";

const LEN = 8;
const THREADS = 256;
const B0 = 100;
const f = Math.fround;
const aAt = (i, j) => f(0.25 + 0.01 * (i + j));
const xAt = (j) => f(1 + 0.5 * j);

const LIBRARY = [
  "f64/dekker",
  "f64/utils/add",
  "f64/utils/multiply",
  "f64/utils/divide",
]
  .map((name) => shaderSources[name])
  .join("\n");

// What b_i should come out as, for each kind of computation below.
const EXPECTED = {
  // b_i = B0 − Σ_j a_ij·x_j
  all: (i) =>
    B0 - [...Array(LEN).keys()].reduce((s, j) => s + aAt(i, j) * xAt(j), 0),
  // only the steps below the diagonal: B0 − Σ_{j<i} a_ij·x_j
  lower: (i) =>
    B0 - [...Array(i).keys()].reduce((s, j) => s + aAt(i, j) * xAt(j), 0),
  // one step: B0 − a_i0·x_0
  once: (i) => B0 - aAt(i, 0) * xAt(0),
  // forward substitution with every b starting at B0 and x_j = b_j·scale
  // (scale 1: unit diagonal; 0.5: a diagonal of 2): b_i after its steps
  solve: (scale) => (i) => {
    const b = Array(LEN).fill(B0);
    for (let j = 0; j < LEN; j++)
      for (let r = j + 1; r < LEN; r++) b[r] -= aAt(r, j) * (b[j] * scale);
    return b[i];
  },
};

// Each variant: WGSL before the loop (`pre`), the loop body (`body`; `a` and
// `x` are step j's DDs, `b` the running DD, `tid` the thread's slot), and
// what b_i should be. A variant with no body does its work in `pre` alone.
const VARIANTS = {
  // dtrsv_small's update, minus its select.
  "ddSub in loop": {
    body: "b = ddSubProtected(b, ddMulProtected(a, x, tid), tid);",
    want: EXPECTED.all,
  },
  // dtrsv_small's update exactly: only rows below the step change.
  "ddSub in loop, select i > j": {
    body: `
    let nb = ddSubProtected(b, ddMulProtected(a, x, tid), tid);
    b = DD(select(b.hi, nb.hi, i > j), select(b.lo, nb.lo, i > j));`,
    want: EXPECTED.lower,
  },
  // Negation by arithmetic instead of negf's sign-bit XOR.
  "ddAdd of arithmetic negation": {
    body: `
    let m = ddMulProtected(a, x, tid);
    b = ddAddProtected(b, DD(-m.hi, -m.lo), tid);`,
    want: EXPECTED.all,
  },
  // Negate a factor instead of the product.
  "ddAdd of product with negated a": {
    body: "b = ddAddProtected(b, ddMulProtected(DD(-a.hi, -a.lo), x, tid), tid);",
    want: EXPECTED.all,
  },
  // Plain f32, with a barrier, no DD.
  "f32 subtract in loop": {
    body: `
    b = DD(b.hi - a.hi * x.hi, 0.0);
    workgroupBarrier();`,
    want: EXPECTED.all,
  },
  // The DD subtract once, outside the loop (as in n = 1, which passes).
  "ddSub once, no loop": {
    pre: `
  let a = DD(A[i * LEN], 0.0);
  let x = DD(X[min(0u, params.len)], 0.0); // X[0]; reads params so the layout keeps it
  b = ddSubProtected(b, ddMulProtected(a, x, tid), tid);`,
    want: EXPECTED.once,
  },
  // dtrsv_small's step: x_j published through workgroup memory by every
  // thread, row j's slot read after the barrier (unit diagonal: x_j = b_j).
  "solve: x_j published through workgroup memory": {
    body: `
    candHi[tid] = b.hi;
    candLo[tid] = b.lo;
    workgroupBarrier();
    let xj = DD(candHi[(tid / LEN) * LEN + j], candLo[(tid / LEN) * LEN + j]);
    let nb = ddSubProtected(b, ddMulProtected(a, xj, tid), tid);
    b = DD(select(b.hi, nb.hi, i > j), select(b.lo, nb.lo, i > j));`,
    want: EXPECTED.solve(1),
  },
  // ... with x_j = b_j · rinv, rinv from ddDivProtected before the loop (a
  // diagonal of 2), as dtrsv_small forms it.
  "solve: x_j = b_j · rinv, rinv from ddDivProtected": {
    pre: "let rinv = ddDivProtected(DD(1.0, 0.0), DD(2.0, 0.0), tid);",
    body: `
    let cand = ddMulProtected(b, rinv, tid);
    candHi[tid] = cand.hi;
    candLo[tid] = cand.lo;
    workgroupBarrier();
    let xj = DD(candHi[(tid / LEN) * LEN + j], candLo[(tid / LEN) * LEN + j]);
    let nb = ddSubProtected(b, ddMulProtected(a, xj, tid), tid);
    b = DD(select(b.hi, nb.hi, i > j), select(b.lo, nb.lo, i > j));`,
    want: EXPECTED.solve(0.5),
  },
  // ... with a_ij loaded a step ahead (aNext), as dtrsv_small does.
  "solve: a_ij loaded a step ahead": {
    pre: "var aNext = DD(A[i * LEN], 0.0);",
    body: `
    let aj = aNext;
    let jn = min(j + 1u, params.len - 1u);
    aNext = DD(A[i * LEN + jn], 0.0);
    candHi[tid] = b.hi;
    candLo[tid] = b.lo;
    workgroupBarrier();
    let xj = DD(candHi[(tid / LEN) * LEN + j], candLo[(tid / LEN) * LEN + j]);
    let nb = ddSubProtected(b, ddMulProtected(aj, xj, tid), tid);
    b = DD(select(b.hi, nb.hi, i > j), select(b.lo, nb.lo, i > j));`,
    want: EXPECTED.solve(1),
  },
  // ... with the next a_ij loaded at the end of the step instead, after the
  // current one's last use (dtrsv_small's fix): one value alive at a time.
  "solve: next a_ij loaded at the end of the step": {
    pre: "var aCur = DD(A[i * LEN], 0.0);",
    body: `
    let aj = aCur;
    candHi[tid] = b.hi;
    candLo[tid] = b.lo;
    workgroupBarrier();
    let xj = DD(candHi[(tid / LEN) * LEN + j], candLo[(tid / LEN) * LEN + j]);
    let nb = ddSubProtected(b, ddMulProtected(aj, xj, tid), tid);
    b = DD(select(b.hi, nb.hi, i > j), select(b.lo, nb.lo, i > j));
    let jn = min(j + 1u, params.len - 1u);
    aCur = DD(A[i * LEN + jn], 0.0);`,
    want: EXPECTED.solve(1),
  },
};

function kernel({ pre = "", body }) {
  const loop = body
    ? `for (var j = 0u; j < params.len; j++) {
    let a = DD(A[i * LEN + j], 0.0);
    let x = DD(X[j], 0.0);
    ${body}
  }`
    : "";
  return /* wgsl */ `
const LEN: u32 = ${LEN}u;
struct Params { len: u32 }
@group(0) @binding(0) var<storage, read> A: array<f32>;
@group(0) @binding(1) var<storage, read> X: array<f32>;
@group(0) @binding(2) var<storage, read_write> out: array<f32>;
@group(0) @binding(3) var<uniform> params: Params;
var<workgroup> candHi: array<f32, ${THREADS}>;
var<workgroup> candLo: array<f32, ${THREADS}>;

@compute @workgroup_size(${THREADS})
fn main(@builtin(local_invocation_index) tid: u32) {
  let i = tid % LEN;
  var b = DD(${B0}.0, 0.0);
  ${pre}
  ${loop}
  out[2u * tid] = b.hi;
  out[2u * tid + 1u] = b.lo;
}`;
}

let device;
before(async () => {
  device = await init();
});
after(() => cleanup());

test("dtrsv_small-shaped loops, one change at a time", async (t) => {
  const A = new Float32Array(LEN * LEN).map((_, k) =>
    aAt(Math.floor(k / LEN), k % LEN),
  );
  const X = new Float32Array(LEN).map((_, j) => xAt(j));
  const aBuf = uploadBuffer(device, A, "diag-A");
  const xBuf = uploadBuffer(device, X, "diag-X");
  const params = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(params, 0, new Uint32Array([LEN, 0, 0, 0]));

  for (const [name, variant] of Object.entries(VARIANTS)) {
    await t.test(name, async () => {
      const module = device.createShaderModule({
        code: `${LIBRARY}\n${kernel(variant)}`,
      });
      const pipeline = await device.createComputePipelineAsync({
        layout: "auto",
        compute: { module, entryPoint: "main" },
      });
      const outBuf = createResultBuffer(device, THREADS * 2 * 4, "diag-out");
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(
        0,
        device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [aBuf, xBuf, outBuf, params].map((buffer, binding) => ({
            binding,
            resource: { buffer },
          })),
        }),
      );
      pass.dispatchWorkgroups(1);
      pass.end();
      const read = stageReadback(device, enc, outBuf);
      device.queue.submit([enc.finish()]);
      const out = await extractResult(read);
      outBuf.destroy();

      const wrong = [];
      for (let tid = 0; tid < THREADS; tid++) {
        const i = tid % LEN;
        const got = out[2 * tid] + out[2 * tid + 1];
        const want = variant.want(i);
        if (!(Math.abs(got - want) <= 1e-5 * Math.abs(want)))
          wrong.push(`row ${i} (thread ${tid}): got ${got}, want ${want}`);
      }
      assert.equal(
        wrong.length,
        0,
        `${wrong.length}/${THREADS} threads wrong, e.g.\n  ${wrong.slice(0, 4).join("\n  ")}`,
      );
    });
  }
});
