import { ssyr2 } from "wgblas/ssyr2";
import { runBenchmark, vector, matrix } from "../../utils/harness.mjs";
import { L2_SIZES, PADS, STRIDES, ALPHAS } from "../../utils/params.mjs";

await runBenchmark({
  routine: "ssyr2",
  warmup: 5,
  iters: 100,
  defaults: { uplo: "lower", alpha: 1.0, inc: 1, pad: 0, layout: "row-major" },
  derive: (p) => ({ ...p, lda: p.n + p.pad }),
  operands: (p) => ({
    A: matrix(Float32Array, p.n, p.n, p.lda, p.layout),
    x: vector(Float32Array, p.n * p.inc),
    y: vector(Float32Array, p.n * p.inc),
  }),
  call: (device, p, o) =>
    ssyr2(device, p.uplo, p.n, p.alpha, o.x, p.inc, o.y, p.inc, o.A, p.lda),
  // One triangle of A read + written + x and y read
  bytes: (p) => (p.n * (p.n + 1) + 2 * p.n) * 4,
  sweeps: {
    // Column-major A (cuBLAS's native layout), unit stride, every size.
    base: { axes: { n: L2_SIZES }, fixed: { layout: "column-major" } },

    // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
    stride: {
      axes: { stride: STRIDES, n: L2_SIZES },
      derive: (p) => ({ ...p, inc: p.stride }),
    },

    // Padding on A's leading dimension (row-major); same logical work.
    lda: { axes: { pad: PADS, n: L2_SIZES } },

    // Row- vs column-major A (wgblas only: cuBLAS is column-major).
    layout: { axes: { layout: ["row-major", "column-major"], n: L2_SIZES } },

    // Lower vs upper triangle of A.
    uplo: { axes: { uplo: ["lower", "upper"], n: L2_SIZES } },

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L2_SIZES } },
  },
});
