import { ssyr2k } from "wgblas/ssyr2k";
import { runBenchmark, matrix } from "../../utils/harness.mjs";
import {
  L3_SIZES,
  L3_SWEEP_SIZES,
  L3_TRANS_SIZES,
  L3_LDA_SIZES,
  L3_LDA_PADS,
  PADS,
  ALPHAS,
  BETAS,
} from "../../utils/params.mjs";

// Two sgemmtr passes per call (see ssyr2k.mjs). uplo is a confirmed
// non-effect; trans and lda/ldb are real but coupled (see
// temp/scope_ssyr2k.mjs). lda and ldb behave identically — the two-pass
// design treats them symmetrically — so the lda sweep pads both together.
// trans couples both passes the way ssyrk's single trans does, so
// trans = "transpose" is ~1.4x faster, and padding only matters for
// trans = "no-transpose". The default trans = "no-transpose" matches
// BLAS/cuBLAS convention despite being the slower choice.
await runBenchmark({
  routine: "ssyr2k",
  warmup: 5,
  iters: 50,
  defaults: {
    uplo: "lower",
    trans: "no-transpose",
    alpha: 1.0,
    beta: 0.0,
    layout: "row-major",
  },
  // Tight lda/ldb/ldc; A and B are n×k as stored (k×n when transposed).
  derive: (p) => {
    const k = p.k ?? p.n;
    const [rows, cols] = p.trans === "no-transpose" ? [p.n, k] : [k, p.n];
    const ld = p.layout === "column-major" ? rows : cols;
    return { ...p, k, rows, cols, lda: ld, ldb: ld, ldc: p.n };
  },
  operands: (p) => ({
    A: matrix(Float32Array, p.rows, p.cols, p.lda, p.layout),
    B: matrix(Float32Array, p.rows, p.cols, p.ldb, p.layout),
    C: matrix(Float32Array, p.n, p.n, p.ldc, p.layout),
  }),
  call: (device, p, o) =>
    ssyr2k(
      device,
      p.uplo,
      p.trans,
      p.n,
      p.k,
      p.alpha,
      o.A,
      p.lda,
      o.B,
      p.ldb,
      p.beta,
      o.C,
      p.ldc,
    ),
  // Two rank-k terms, k multiply-adds each per element of the n(n+1)/2 triangle.
  flops: (p) => 2 * p.n * (p.n + 1) * p.k,
  // A + B read + the touched half of C read and written
  bytes: (p) => (2 * p.n * p.k + p.n * p.n) * 4,
  sweeps: {
    // Column-major (cuBLAS's native layout), n = k.
    base: {
      axes: { n: L3_SIZES },
      fixed: { layout: "column-major" },
      record: ["n", "k"],
      warmup: 3,
      iters: 20,
    },

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L3_SWEEP_SIZES } },

    // beta = 0 could skip reading C; a step at 0 is that shortcut.
    beta: { axes: { beta: BETAS, n: L3_SWEEP_SIZES } },

    // Row- vs column-major (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L3_SWEEP_SIZES },
    },

    // Padding on lda and ldb together, both ways of trans.
    lda: {
      axes: {
        trans: ["no-transpose", "transpose"],
        n: L3_LDA_SIZES,
        pad: L3_LDA_PADS,
      },
      derive: (p) => ({ ...p, lda: p.lda + p.pad, ldb: p.ldb + p.pad }),
      record: ["trans", "pad", "n"],
      iters: 30,
    },

    // Padding on ldb alone.
    ldb: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldb: p.ldb + p.pad }),
    },

    // Padding on C's leading dimension: write coalescing.
    ldc: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldc: p.ldc + p.pad }),
    },

    // trans flips both operands' read direction at once.
    trans: {
      axes: { trans: ["no-transpose", "transpose"], n: L3_TRANS_SIZES },
      iters: 30,
    },

    // Which triangle: whether the heavy tiles dispatch first or last.
    uplo: { axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES } },
  },
});
