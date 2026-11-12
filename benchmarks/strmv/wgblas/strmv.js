import { strmv } from "wgblas/strmv";
import { runBenchmark, vector, matrix } from "../../utils/harness.mjs";
import { L2_SIZES, PADS, STRIDES } from "../../utils/params.mjs";

await runBenchmark({
  routine: "strmv",
  warmup: 5,
  iters: 100,
  defaults: {
    uplo: "lower",
    trans: "no-transpose",
    diag: "non-unit",
    inc: 1,
    pad: 0,
    layout: "row-major",
  },
  derive: (p) => ({ ...p, lda: p.n + p.pad }),
  operands: (p) => ({
    A: matrix(Float32Array, p.n, p.n, p.lda, p.layout, "triangular"),
    x: vector(Float32Array, p.n * p.inc),
    y: vector(Float32Array, p.n * p.inc),
  }),
  call: (device, p, o) =>
    strmv(
      device,
      p.uplo,
      p.trans,
      p.diag,
      p.n,
      o.A,
      p.lda,
      o.x,
      p.inc,
      o.y,
      p.inc,
    ),
  // One triangle of A + x read + y written
  bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 4,
  sweeps: {
    // Column-major A (cuBLAS's native layout), unit stride, every size.
    base: { axes: { n: L2_SIZES }, fixed: { layout: "column-major" } },

    // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
    stride: {
      axes: { stride: STRIDES, n: L2_SIZES },
      derive: (p) => ({ ...p, inc: p.stride }),
    },

    // Padding on A's leading dimension, both ways round (row-major).
    lda: {
      axes: { trans: ["no-transpose", "transpose"], pad: PADS, n: L2_SIZES },
    },

    // Row- vs column-major A (wgblas only: cuBLAS is column-major).
    layout: { axes: { layout: ["row-major", "column-major"], n: L2_SIZES } },

    // op(A) = A vs Aᵀ.
    trans: { axes: { trans: ["no-transpose", "transpose"], n: L2_SIZES } },

    // Lower vs upper triangle of A.
    uplo: { axes: { uplo: ["lower", "upper"], n: L2_SIZES } },

    // Non-unit vs unit diagonal.
    diag: { axes: { diag: ["non-unit", "unit"], n: L2_SIZES } },
  },
});
