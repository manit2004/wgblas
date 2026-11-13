import { dsymm } from "wgblas/dsymm";
import { runBenchmark, matrix } from "../../utils/harness.mjs";
import {
  L3_SIZES,
  L3_SWEEP_SIZES,
  L3_LDA_SIZES,
  L3_LDA_PADS,
  PADS,
  ALPHAS,
  BETAS,
} from "../../utils/params.mjs";

// Three passes per call (see dsymm.mjs): symmetrize A's hi and lo halves,
// then dgemm_small. Square m = n, so A's order is n on either side.
await runBenchmark({
  routine: "dsymm",
  warmup: 5,
  iters: 50,
  defaults: {
    side: "left",
    uplo: "lower",
    alpha: 1.0,
    beta: 0.0,
    layout: "row-major",
  },
  // Tight lda/ldb/ldc; B and C are m×n as stored.
  derive: (p) => {
    const m = p.m ?? p.n;
    const aOrder = p.side === "left" ? m : p.n;
    const ld = p.layout === "column-major" ? m : p.n;
    return { ...p, m, aOrder, lda: aOrder, ldb: ld, ldc: ld };
  },
  operands: (p) => ({
    A: matrix(Float64Array, p.aOrder, p.aOrder, p.lda, p.layout),
    B: matrix(Float64Array, p.m, p.n, p.ldb, p.layout),
    C: matrix(Float64Array, p.m, p.n, p.ldc, p.layout),
  }),
  call: (device, p, o) =>
    dsymm(
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
  // m·n dot products of length aOrder, plus the beta·C update — as ssymm.
  flops: (p) => 2 * p.m * p.n * p.aOrder + 2 * p.m * p.n,
  // symmetrize reads A and writes its dense copy, gemm reads that copy; B
  // read, C read and written — ssymm's count at 8 B (hi + lo) per element.
  bytes: (p) => (3 * p.aOrder * p.aOrder + 3 * p.m * p.n) * 8,
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

    // A on the left or the right: which gemm operand the dense copy becomes.
    side: { axes: { side: ["left", "right"], n: L3_SWEEP_SIZES } },

    // Which triangle symmetrize reads from.
    uplo: { axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES } },

    // Padding on A's leading dimension: only symmetrize reads A directly.
    lda: {
      axes: { n: L3_LDA_SIZES, pad: L3_LDA_PADS },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
      record: ["pad", "n"],
      iters: 30,
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
  },
});
