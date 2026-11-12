import { drot } from "wgblas/drot";
import { runBenchmark, vector } from "../../utils/harness.mjs";
import { L1_SIZES, L1_SWEEP_SIZES, STRIDES } from "../../utils/params.mjs";

// 45° rotation.
const c45 = Math.cos(Math.PI / 4);
const s45 = Math.sin(Math.PI / 4);

await runBenchmark({
  routine: "drot",
  warmup: 5,
  iters: 100,
  defaults: { c: c45, s: s45, inc: 1 },
  operands: (p) => ({
    x: vector(Float64Array, p.n * p.inc),
    y: vector(Float64Array, p.n * p.inc),
  }),
  call: (device, p, o) => drot(device, p.n, o.x, p.inc, o.y, p.inc, p.c, p.s),
  // x, y each read + written, 8 B each (hi + lo)
  bytes: (p) => 4 * p.n * 8,
  sweeps: {
    // Unit stride (coalesced, best case) at every size.
    base: { axes: { n: L1_SIZES } },

    // Non-unit stride, as when the op runs on a matrix row/column (inc = lda).
    // 4/32/256 sample each coalescing regime; 5/33/255 isolate misalignment.
    stride: {
      axes: { stride: STRIDES, n: L1_SIZES },
      skip: (p) => p.stride > p.n, // not meaningful
      derive: (p) => ({ ...p, inc: p.stride }),
    },

    // Vary c with s pinned; no branch on c, so expect a flat row.
    cosine: {
      axes: { c: [0, 0.5, c45, 1, -0.75], n: L1_SWEEP_SIZES },
      record: ["c", "s", "n"],
    },

    // Vary s with c pinned; s = 0 still runs in full, so expect a flat row.
    sine: {
      axes: { s: [0, 0.5, s45, 1, -0.75], n: L1_SWEEP_SIZES },
      record: ["c", "s", "n"],
    },
  },
});
