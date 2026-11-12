import { strsv } from "wgblas/strsv";
import { runBenchmark, vector, matrix, refresh } from "../../utils/harness.mjs";
import { L2_SIZES, PADS, STRIDES } from "../../utils/params.mjs";

// Base sizes: L2_SIZES without 1280, as this benchmark has always run.
const TRSV_SIZES = [32, 64, 128, 256, 512, 1024, 2048, 4096];

await runBenchmark({
  routine: "strsv",
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
  }),
  call: (device, p, o) =>
    strsv(device, p.uplo, p.trans, p.diag, p.n, o.A, p.lda, o.x, p.inc),
  // One triangle of A + x read + x written (in place)
  bytes: (p) => ((p.n * (p.n + 1)) / 2 + 2 * p.n) * 4,
  sweeps: {
    // Column-major A (cuBLAS's native layout), unit stride.
    base: {
      axes: { n: TRSV_SIZES },
      fixed: { layout: "column-major" },
      // Solves in place, so x is refreshed (untimed) before every call.
      beforeEach: refresh("x"),
      // Each 64-row block is a dependent step; time per block is the story.
      derive: (p) => ({ ...p, numBlocks: Math.ceil(p.n / 64) }),
      record: ["n", "numBlocks"],
      metrics: (p, m) => ({
        compute_ms: m.compute_ms,
        ms_per_block: m.compute_ms / p.numBlocks,
        compute_GBs: m.compute_GBs,
      }),
    },

    // Non-unit incx/incy, as when x/y are rows/columns of a larger matrix.
    stride: {
      axes: { stride: STRIDES, n: L2_SIZES },
      derive: (p) => ({ ...p, inc: p.stride }),
    },

    // Padding on A's leading dimension (row-major); same logical work.
    lda: { axes: { pad: PADS, n: L2_SIZES } },

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
