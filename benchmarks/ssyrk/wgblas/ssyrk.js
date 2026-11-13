import { ssyrk } from "wgblas/ssyrk";
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

// Same kernel as sgemmtr, with A in both operand slots. uplo is a
// confirmed non-effect; trans and lda are real but coupled (see
// temp/scope_ssyrk.mjs). trans flips both operand roles at once, so unlike
// sgemm/sgemmtr, trans = "transpose" is ~1.4-1.5x faster; lda only
// matters for trans = "no-transpose", where it drives the internal
// transB-like read (sgemm's ldb finding). The default trans =
// "no-transpose" matches BLAS/cuBLAS convention despite being the slower one.
await runBenchmark({
  routine: "ssyrk",
  warmup: 5,
  iters: 50,
  defaults: {
    uplo: "lower",
    trans: "no-transpose",
    alpha: 1.0,
    beta: 0.0,
    layout: "row-major",
  },
  // Tight lda/ldc; A is n×k as stored (k×n when transposed).
  derive: (p) => {
    const k = p.k ?? p.n;
    const [rows, cols] = p.trans === "no-transpose" ? [p.n, k] : [k, p.n];
    const lda = p.layout === "column-major" ? rows : cols;
    return { ...p, k, rows, cols, lda, ldc: p.n };
  },
  operands: (p) => ({
    A: matrix(Float32Array, p.rows, p.cols, p.lda, p.layout),
    C: matrix(Float32Array, p.n, p.n, p.ldc, p.layout),
  }),
  call: (device, p, o) =>
    ssyrk(
      device,
      p.uplo,
      p.trans,
      p.n,
      p.k,
      p.alpha,
      o.A,
      p.lda,
      p.beta,
      o.C,
      p.ldc,
    ),
  // k multiply-adds per element of the n(n+1)/2 triangle.
  flops: (p) => p.n * (p.n + 1) * p.k,
  // A read + the touched half of C read and written.
  bytes: (p) => (p.n * p.k + p.n * p.n) * 4,
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

    // Padding on A's leading dimension, both ways of trans — the two are
    // coupled (see the note above).
    lda: {
      axes: {
        trans: ["no-transpose", "transpose"],
        n: L3_LDA_SIZES,
        pad: L3_LDA_PADS,
      },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
      record: ["trans", "pad", "n"],
      iters: 30,
    },

    // Padding on C's leading dimension: write coalescing.
    ldc: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldc: p.ldc + p.pad }),
    },

    // trans flips both operand roles at once (A plays both).
    trans: {
      axes: { trans: ["no-transpose", "transpose"], n: L3_TRANS_SIZES },
      iters: 30,
    },

    // Which triangle: whether the heavy tiles dispatch first or last.
    uplo: { axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES } },
  },
});
