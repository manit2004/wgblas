import { cscal } from "wgblas/cscal";
import { Complex32, Complex32Array } from "wgblas/classes/Complex32";
import { runBenchmark, vector } from "../../utils/harness.mjs";
import { L1_SIZES, L1_SWEEP_SIZES, STRIDES } from "../../utils/params.mjs";

// %g-style label matching alpha.cscal.c (%g%+gi), so cuBLAS rows pair up.
const g = (v) => Number(v.toPrecision(6)).toString();
const fmt = (z) => `${g(z.re)}${z.im < 0 ? "" : "+"}${g(z.im)}i`;

await runBenchmark({
  routine: "cscal",
  warmup: 5,
  iters: 100,
  defaults: { alpha: new Complex32(2, 3), inc: 1 },
  operands: (p) => ({ x: vector(Complex32Array, p.n * p.inc) }),
  call: (device, p, o) => cscal(device, p.n, p.alpha, o.x, p.inc),
  // x read + written in place, 8 B each (re + im)
  bytes: (p) => 2 * p.n * 8,
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

    // Values a kernel could special-case: 0, 1, general, imaginary, denormal.
    alpha: {
      axes: {
        alpha: [
          new Complex32(0, 0),
          new Complex32(1, 0),
          new Complex32(2.5, -3.75),
          new Complex32(0, 1),
          new Complex32(1e-38, 0),
        ],
        n: L1_SWEEP_SIZES,
      },
      format: { alpha: fmt },
    },
  },
});
