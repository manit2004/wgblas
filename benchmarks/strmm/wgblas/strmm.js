import { strmm } from "wgblas/strmm";
import { runBenchmark, matrix } from "../../utils/harness.mjs";
import { L3_SIZES, L3_SWEEP_SIZES, PADS, ALPHAS } from "../../utils/params.mjs";

// Two passes per call: triangularize (zero-fill op(A)), then an unmodified
// sgemm pass, plus a seed copy (B → the output, keeping stride-padding
// gaps). uplo, side, transA, diag and A's lda were all scoped as
// non-effects (see temp/scope_strmm.mjs); the gemm pass's ldb/layout
// behavior is sgemm's own (see sgemm.js). A is diagonally dominant
// ("triangular" fill), as for the triangular solves.
await runBenchmark({
  routine: "strmm",
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
    A: matrix(Float32Array, p.aOrder, p.aOrder, p.lda, p.layout, "triangular"),
    B: matrix(Float32Array, p.m, p.n, p.ldb, p.layout),
  }),
  call: (device, p, o) =>
    strmm(
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
  // (no beta term — strmm has no C accumulation).
  flops: (p) => 2 * p.m * p.n * p.aOrder + p.m * p.n,
  // triangularize: A read + dense write (2·aOrder²); seed copy: B read +
  // output write (2·m·n); gemm: dense re-read (aOrder²) + B read + output
  // read and write (3·m·n).
  bytes: (p) => (3 * p.aOrder * p.aOrder + 5 * p.m * p.n) * 4,
  sweeps: {
    // Column-major (cuBLAS's native layout), m = n.
    base: {
      axes: { n: L3_SIZES },
      fixed: { layout: "column-major" },
      record: ["m", "n"],
      warmup: 3,
      iters: 20,
    },

    // alpha is a plain scale in the gemm pass, so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L3_SWEEP_SIZES } },

    // A unit diagonal skips the diagonal load — any difference is that.
    diag: { axes: { diag: ["non-unit", "unit"], n: L3_SWEEP_SIZES } },

    // Row- vs column-major (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L3_SWEEP_SIZES },
    },

    // Padding on A's leading dimension: only triangularize reads A directly.
    lda: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
    },

    // Padding on B's: the operand the gemm pass streams along its inner loop.
    ldb: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldb: p.ldb + p.pad }),
    },

    // A on the left or the right: a traversal-order question, not arithmetic.
    side: { axes: { side: ["left", "right"], n: L3_SWEEP_SIZES } },

    // op(A): whether the dense copy is read along rows or columns.
    transA: {
      axes: { transA: ["no-transpose", "transpose"], n: L3_SWEEP_SIZES },
    },

    // Which triangle triangularize keeps.
    uplo: { axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES } },
  },
});
