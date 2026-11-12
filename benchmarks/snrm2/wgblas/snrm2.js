import { snrm2 } from "wgblas/snrm2";
import { runBenchmark, vector } from "../../utils/harness.mjs";
import { L1_SIZES, STRIDES } from "../../utils/params.mjs";

await runBenchmark({
  routine: "snrm2",
  warmup: 5,
  iters: 100,
  defaults: { inc: 1 },
  operands: (p) => ({ x: vector(Float32Array, p.n * p.inc) }),
  call: (device, p, o) => snrm2(device, p.n, o.x, p.inc),
  // x read only
  bytes: (p) => p.n * 4,
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
