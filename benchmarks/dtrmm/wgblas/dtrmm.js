import { dtrmm } from "wgblas/dtrmm";
import { runBenchmark, matrix, refresh } from "../../utils/harness.mjs";
import { L3_SIZES, L3_SWEEP_SIZES, PADS, ALPHAS } from "../../utils/params.mjs";

// Triangularize A's hi and lo halves, then a full dense dgemm_small (no
// k-band skip, unlike strmm). B is overwritten in place, so it's refreshed
// (untimed) before every call.
const refreshB = refresh("B");

await runBenchmark({
  routine: "dtrmm",
  warmup: 5,
  iters: 50,
  defaults: {
    side: "left",
    uplo: "lower",
    transA: "no-transpose",
    diag: "non-unit",
    alpha: 1.0,
    layout: "row-major",
  },
  // Square m = n, so A's order is n on either side; tight lda/ldb.
  derive: (p) => {
    const m = p.n;
    const aOrder = p.side === "left" ? m : p.n;
    const ldb = p.layout === "column-major" ? m : p.n;
    return { ...p, m, aOrder, lda: aOrder, ldb };
  },
  operands: (p) => ({
    A: matrix(Float64Array, p.aOrder, p.aOrder, p.lda, p.layout, "triangular"),
    B: matrix(Float64Array, p.m, p.n, p.ldb, p.layout),
  }),
  call: (device, p, o) =>
    dtrmm(
      device,
      p.side,
      p.uplo,
      p.transA,
      p.diag,
      p.m,
      p.n,
      p.alpha,
      o.A,
      p.lda,
      o.B,
      p.ldb,
    ),
  // gemm-shaped 2·m·n·aOrder multiply-adds, plus m·n for the alpha scale
  // (no beta term — dtrmm has no C accumulation) — as strmm.
  flops: (p) => 2 * p.m * p.n * p.aOrder + p.m * p.n,
  // strmm's count at 8 B (hi + lo) per element: triangularize A read +
  // dense write (2·aOrder²); seed copy B read + output write (2·m·n); gemm
  // dense re-read (aOrder²) + B read + output read and write (3·m·n).
  bytes: (p) => (3 * p.aOrder * p.aOrder + 5 * p.m * p.n) * 8,
  sweeps: {
    // Column-major (cuBLAS's native layout), m = n.
    base: {
      axes: { n: L3_SIZES },
      fixed: { layout: "column-major" },
      record: ["m", "n"],
      warmup: 3,
      iters: 20,
      beforeEach: refreshB,
    },

    // alpha is a plain scale in the gemm pass (0 zeroes the product term),
    // so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L3_SWEEP_SIZES }, beforeEach: refreshB },

    // A unit diagonal skips the diagonal load — any difference is that.
    diag: {
      axes: { diag: ["non-unit", "unit"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // Row- vs column-major (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // Padding on A's leading dimension: only triangularize reads A directly.
    lda: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
      beforeEach: refreshB,
    },

    // Padding on B's: the gemm's other operand, and the output's stride.
    ldb: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldb: p.ldb + p.pad }),
      beforeEach: refreshB,
    },

    // A on the left or the right: a traversal-order question, not arithmetic.
    side: {
      axes: { side: ["left", "right"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // op(A): whether the dense copy is read along rows or columns.
    transA: {
      axes: { transA: ["no-transpose", "transpose"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // Which triangle triangularize keeps.
    uplo: {
      axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },
  },
});
