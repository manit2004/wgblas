import { saxpy } from "wgblas/saxpy";
import { runBenchmark, vector } from "../../utils/harness.mjs";
import {
  L1_SIZES,
  L1_SWEEP_SIZES,
  STRIDES,
  ALPHAS,
} from "../../utils/params.mjs";

await runBenchmark({
  routine: "saxpy",
  warmup: 5,
  iters: 100,
  defaults: { alpha: 2.0, inc: 1 },
  operands: (p) => ({
    x: vector(Float32Array, p.n * p.inc),
    y: vector(Float32Array, p.n * p.inc),
  }),
  call: (device, p, o) => saxpy(device, p.n, p.alpha, o.x, p.inc, o.y, p.inc),
  // x read + y read + y written
  bytes: (p) => 3 * p.n * 4,
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

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L1_SWEEP_SIZES } },
  },
});
