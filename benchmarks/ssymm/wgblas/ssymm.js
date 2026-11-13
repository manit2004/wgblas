import { ssymm } from "wgblas/ssymm";
import { runBenchmark, matrix } from "../../utils/harness.mjs";
import {
  L3_SIZES,
  L3_SWEEP_SIZES,
  PADS,
  ALPHAS,
  BETAS,
} from "../../utils/params.mjs";

// Two passes per call: symmetrize (dense-expand A), then an unmodified
// sgemm pass. uplo, side and A's lda were scoped as non-effects (see
// temp/scope_ssymm.mjs); the gemm pass's ldb/ldc/layout behavior is
// sgemm's own (see sgemm.js).
await runBenchmark({
  routine: "ssymm",
  warmup: 5,
  iters: 50,
  defaults: {
    side: "left",
    uplo: "lower",
    alpha: 1.0,
    beta: 0.0,
    layout: "row-major",
  },
  // Square m = n, so A's order is n on either side; tight lda/ldb/ldc.
  derive: (p) => {
    const m = p.n;
    const aOrder = p.side === "left" ? m : p.n;
    const ld = p.layout === "column-major" ? m : p.n;
    return { ...p, m, aOrder, lda: aOrder, ldb: ld, ldc: ld };
  },
  operands: (p) => ({
    A: matrix(Float32Array, p.aOrder, p.aOrder, p.lda, p.layout),
    B: matrix(Float32Array, p.m, p.n, p.ldb, p.layout),
    C: matrix(Float32Array, p.m, p.n, p.ldc, p.layout),
  }),
  call: (device, p, o) =>
    ssymm(
      device,
      p.side,
      p.uplo,
      p.m,
      p.n,
      p.alpha,
      o.A,
      p.lda,
      o.B,
      p.ldb,
      p.beta,
      o.C,
      p.ldc,
    ),
  // m·n dot products of length aOrder, plus the beta·C update.
  flops: (p) => 2 * p.m * p.n * p.aOrder + 2 * p.m * p.n,
  // symmetrize reads A and writes its dense copy, gemm reads that copy; B
  // read, C read and written.
  bytes: (p) => (3 * p.aOrder * p.aOrder + 3 * p.m * p.n) * 4,
  sweeps: {
    // Column-major (cuBLAS's native layout), m = n.
    base: {
      axes: { n: L3_SIZES },
      fixed: { layout: "column-major" },
      record: ["m", "n"],
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

    // Padding on A's leading dimension: only symmetrize reads A directly.
    lda: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
    },

    // Padding on B's leading dimension: the gemm's other operand.
    ldb: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldb: p.ldb + p.pad }),
    },

    // Padding on C's leading dimension: write coalescing.
    ldc: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldc: p.ldc + p.pad }),
    },

    // A on the left or the right: which gemm operand the dense copy becomes.
    side: { axes: { side: ["left", "right"], n: L3_SWEEP_SIZES } },

    // Which triangle symmetrize reads A from.
    uplo: { axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES } },
  },
});
