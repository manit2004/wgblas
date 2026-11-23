import { dtrsm } from "wgblas/dtrsm";
import { runBenchmark, matrix, refresh } from "../../utils/harness.mjs";
import { L3_SWEEP_SIZES, PADS, ALPHAS } from "../../utils/params.mjs";

// Base orders: strsm's, so the two compare point for point.
const TRSM_SIZES = [64, 128, 256, 512, 1024, 2048, 4096];
// dtrsm.mjs's own diagonal-block size.
const BLOCK_SIZE = 64;

// Solves in place, so B is refreshed (untimed) before every call. A is
// diagonally dominant ("triangular" fill), keeping every solve well
// conditioned.
const refreshB = refresh("B");

await runBenchmark({
  routine: "dtrsm",
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
  // m = order (base) or n; A's order follows side; tight lda/ldb.
  derive: (p) => {
    const m = p.order ?? p.n;
    const aOrder = p.side === "left" ? m : p.n;
    const ldb = p.layout === "column-major" ? m : p.n;
    return { ...p, m, aOrder, lda: aOrder, ldb };
  },
  operands: (p) => ({
    A: matrix(Float64Array, p.aOrder, p.aOrder, p.lda, p.layout, "triangular"),
    B: matrix(Float64Array, p.m, p.n, p.ldb, p.layout),
  }),
  call: (device, p, o) =>
    dtrsm(
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
  // m·n·aOrder multiply-adds: n solves of an aOrder-order triangle (side
  // = 'left'), as strsm counts them.
  flops: (p) => p.m * p.n * p.aOrder,
  // strsm's count at 8 B (hi + lo) per element: the triangle of A read + B
  // read and written in place, without the update's gathers and scatters.
  bytes: (p) => ((p.aOrder * (p.aOrder + 1)) / 2 + 2 * p.m * p.n) * 8,
  sweeps: {
    // Column-major (cuBLAS's native layout), a 64-column right-hand side.
    // Each 64-row diagonal block is a dependent step — a substitution solve,
    // then the trailing update (two gathers, a dgemm_small, a scatter) — so
    // time per block is the story, as for strsm.
    base: {
      axes: { order: TRSM_SIZES },
      fixed: { n: 64, layout: "column-major" },
      derive: (p) => ({ ...p, numBlocks: Math.ceil(p.order / BLOCK_SIZE) }),
      record: ["order", "numBlocks"],
      metrics: (p, m) => ({
        compute_ms: m.compute_ms,
        ms_per_block: m.compute_ms / p.numBlocks,
        compute_GBs: m.compute_GBs,
      }),
      beforeEach: refreshB,
      iters: 30,
    },

    // alpha rides on passes that run anyway (the first block's solve and
    // the first update's beta), so expect a flat row — except alpha = 0,
    // which skips the solve and only zeroes B.
    alpha: {
      axes: { alpha: ALPHAS, n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
      flops: (p) => (p.alpha === 0 ? 0 : p.m * p.n * p.aOrder),
      bytes: (p) =>
        p.alpha === 0
          ? p.m * p.n * 8
          : ((p.aOrder * (p.aOrder + 1)) / 2 + 2 * p.m * p.n) * 8,
    },

    // A unit diagonal: the solve still forms a reciprocal (of 1), so any
    // difference is the skipped load.
    diag: {
      axes: { diag: ["non-unit", "unit"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // Row- vs column-major (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // Padding on A's leading dimension.
    lda: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
      beforeEach: refreshB,
    },

    // Padding on B's leading dimension.
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

    // op(A): whether the solve walks A along rows or columns.
    transA: {
      axes: { transA: ["no-transpose", "transpose"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },

    // Lower vs upper triangle of A (upper solves backward).
    uplo: {
      axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES },
      beforeEach: refreshB,
    },
  },
});
