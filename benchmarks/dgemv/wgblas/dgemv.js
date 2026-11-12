import { dgemv } from "wgblas/dgemv";
import { runBenchmark, vector, matrix } from "../../utils/harness.mjs";
import { L2_SIZES, PADS, STRIDES, ALPHAS, BETAS } from "../../utils/params.mjs";

await runBenchmark({
  routine: "dgemv",
  warmup: 5,
  iters: 100,
  defaults: {
    trans: "no-transpose",
    alpha: 1.0,
    beta: 0.0,
    inc: 1,
    pad: 0,
    layout: "row-major",
  },
  derive: (p) => {
    const m = p.m ?? p.n;
    const noTrans = p.trans === "no-transpose";
    return {
      ...p,
      m,
      lda: (p.layout === "column-major" ? m : p.n) + p.pad,
      xLen: noTrans ? p.n : m,
      yLen: noTrans ? m : p.n,
    };
  },
  operands: (p) => ({
    A: matrix(Float64Array, p.m, p.n, p.lda, p.layout),
    x: vector(Float64Array, p.xLen * p.inc),
    y: vector(Float64Array, p.yLen * p.inc),
  }),
  call: (device, p, o) =>
    dgemv(
      device,
      p.trans,
      p.m,
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
  // A read + x read + y read + y written
  bytes: (p) => (p.m * p.n + p.xLen + 2 * p.yLen) * 8,
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
      fixed: { layout: "column-major" },
      derive: (p) => ({ ...p, inc: p.stride }),
      record: ["stride", "m", "n"],
    },

    // Padding on A's leading dimension (row-major); same logical work.
    lda: {
      axes: { pad: PADS, n: L2_SIZES },
      bytes: (p) => (p.n * p.n + 2 * p.n) * 8, // these sweeps count y once
    },

    // Row- vs column-major A (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L2_SIZES },
      bytes: (p) => (p.n * p.n + 2 * p.n) * 8, // these sweeps count y once
    },

    // Every (m, n) pair both ways: transposed reads depend on aspect ratio.
    trans: {
      axes: { trans: ["no-transpose", "transpose"], m: L2_SIZES, n: L2_SIZES },
    },

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: {
      axes: { alpha: ALPHAS, n: L2_SIZES },
      bytes: (p) => (p.n * p.n + 2 * p.n) * 8, // these sweeps count y once
    },

    // beta = 0 lets a kernel skip reading y; a step at 0 is that shortcut.
    beta: {
      axes: { beta: BETAS, n: L2_SIZES },
      bytes: (p) => (p.n * p.n + 2 * p.n) * 8, // these sweeps count y once
    },
  },
});
