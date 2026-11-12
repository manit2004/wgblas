import { dger } from "wgblas/dger";
import { runBenchmark, vector, matrix } from "../../utils/harness.mjs";
import { L2_SIZES, PADS, STRIDES, ALPHAS } from "../../utils/params.mjs";

await runBenchmark({
  routine: "dger",
  warmup: 5,
  iters: 100,
  defaults: { alpha: 1.0, inc: 1, pad: 0, layout: "row-major" },
  derive: (p) => {
    const m = p.m ?? p.n;
    return { ...p, m, lda: (p.layout === "column-major" ? m : p.n) + p.pad };
  },
  operands: (p) => ({
    A: matrix(Float64Array, p.m, p.n, p.lda, p.layout),
    x: vector(Float64Array, p.m * p.inc),
    y: vector(Float64Array, p.n * p.inc),
  }),
  call: (device, p, o) =>
    dger(device, p.m, p.n, p.alpha, o.x, p.inc, o.y, p.inc, o.A, p.lda),
  // A read + written + x read + y read
  bytes: (p) => (2 * p.m * p.n + p.m + p.n) * 8,
  sweeps: {
    // Column-major A (cuBLAS's native layout), unit stride, every size.
    base: {
      axes: { n: L2_SIZES },
      fixed: { layout: "column-major" },
      record: ["m", "n"],
    },

    // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
    stride: {
      axes: { stride: STRIDES, n: L2_SIZES },
      derive: (p) => ({ ...p, inc: p.stride }),
    },

    // Padding on A's leading dimension (row-major); same logical work.
    lda: { axes: { pad: PADS, n: L2_SIZES }, record: ["pad", "m", "n"] },

    // Row- vs column-major A (wgblas only: cuBLAS is column-major).
    layout: { axes: { layout: ["row-major", "column-major"], n: L2_SIZES } },

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L2_SIZES } },
  },
});
