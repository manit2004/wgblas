import { dsymv } from "wgblas/dsymv";
import { runBenchmark, vector, matrix } from "../../utils/harness.mjs";
import { L2_SIZES, STRIDES, ALPHAS, BETAS } from "../../utils/params.mjs";

// Fewer pads than the other lda sweeps.
const SYMV_PADS = [0, 1, 8, 32, 64, 128];

await runBenchmark({
  routine: "dsymv",
  warmup: 5,
  iters: 100,
  defaults: {
    uplo: "lower",
    alpha: 1.0,
    beta: 0.0,
    inc: 1,
    pad: 0,
    layout: "row-major",
  },
  derive: (p) => ({ ...p, lda: p.n + p.pad }),
  operands: (p) => ({
    A: matrix(Float64Array, p.n, p.n, p.lda, p.layout),
    x: vector(Float64Array, p.n * p.inc),
    y: vector(Float64Array, p.n * p.inc),
  }),
  call: (device, p, o) =>
    dsymv(
      device,
      p.uplo,
      p.n,
      p.alpha,
      o.A,
      p.lda,
      o.x,
      p.inc,
      p.beta,
      o.y,
      p.inc,
    ),
  // One triangle of A + x read + y read + y written
  bytes: (p) => ((p.n * (p.n + 1)) / 2 + p.n + 2 * p.n) * 8,
  sweeps: {
    // Column-major A (cuBLAS's native layout), unit stride, every size.
    base: { axes: { n: L2_SIZES }, fixed: { layout: "column-major" } },

    // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
    stride: {
      axes: { stride: STRIDES, n: L2_SIZES },
      derive: (p) => ({ ...p, inc: p.stride }),
      bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 8, // these sweeps count y once
    },

    // Padding on A's leading dimension (row-major); same logical work.
    lda: { axes: { pad: SYMV_PADS, n: L2_SIZES } },

    // Row- vs column-major A (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L2_SIZES },
      bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 8, // these sweeps count y once
    },

    // Lower vs upper triangle of A.
    uplo: {
      axes: { uplo: ["lower", "upper"], n: L2_SIZES },
      bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 8, // these sweeps count y once
    },

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: {
      axes: { alpha: ALPHAS, n: L2_SIZES },
      bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 8, // these sweeps count y once
    },

    // beta = 0 lets a kernel skip reading y; a step at 0 is that shortcut.
    beta: {
      axes: { beta: BETAS, n: L2_SIZES },
      bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 8, // these sweeps count y once
    },
  },
});
