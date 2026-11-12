import { drotm } from "wgblas/drotm";
import { runBenchmark, vector } from "../../utils/harness.mjs";
import { L1_SIZES, STRIDES } from "../../utils/params.mjs";

// flag = -1 (full H); flag = -2 returns before any dispatch, so isn't timed.
const param = new Float64Array([-1, 0.6, -0.8, 0.8, 0.6]);

await runBenchmark({
  routine: "drotm",
  warmup: 5,
  iters: 100,
  defaults: { inc: 1 },
  operands: (p) => ({
    x: vector(Float64Array, p.n * p.inc),
    y: vector(Float64Array, p.n * p.inc),
  }),
  call: (device, p, o) => drotm(device, p.n, o.x, p.inc, o.y, p.inc, param),
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
  },
});
