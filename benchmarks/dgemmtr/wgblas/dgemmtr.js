import { dgemmtr } from "wgblas/dgemmtr";
import { runBenchmark, matrix } from "../../utils/harness.mjs";
import {
  L3_SIZES,
  L3_SWEEP_SIZES,
  PADS,
  ALPHAS,
  BETAS,
} from "../../utils/params.mjs";

// Same kernel as dgemm (dgemm_small), with the write gated to one triangle
// by uplo; the sweeps mirror sgemmtr's.
await runBenchmark({
  routine: "dgemmtr",
  warmup: 5,
  iters: 50,
  defaults: {
    uplo: "lower",
    transA: "no-transpose",
    transB: "no-transpose",
    alpha: 1.0,
    beta: 0.0,
    layout: "row-major",
  },
  // Square m = n = k, tight lda/ldb/ldc (A and B are square either way of trans).
  derive: (p) => {
    const [m, k] = [p.n, p.n];
    return { ...p, m, k, lda: k, ldb: k, ldc: p.n };
  },
  operands: (p) => ({
    A: matrix(Float64Array, p.m, p.k, p.lda, p.layout),
    B: matrix(Float64Array, p.k, p.n, p.ldb, p.layout),
    C: matrix(Float64Array, p.m, p.n, p.ldc, p.layout),
  }),
  call: (device, p, o) =>
    dgemmtr(
      device,
      p.uplo,
      p.transA,
      p.transB,
      p.m,
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
  // The triangle only (the kernels skip every tile wholly outside it): k
  // multiply-adds for each of C's n(n+1)/2 elements.
  flops: (p) => p.n * (p.n + 1) * p.k,
  // A read + B read + the touched half of C read and written (8 B: hi + lo).
  bytes: (p) => (p.m * p.k + p.k * p.n + p.m * p.n) * 8,
  sweeps: {
    // Column-major, m = n = k (wgblas only: cuBLAS has no gemmt routine).
    base: {
      axes: { n: L3_SIZES },
      fixed: { layout: "column-major" },
      record: ["m", "n", "k"],
      warmup: 3,
      iters: 20,
    },

    // No branch on alpha in the kernel, so expect a flat row.
    alpha: { axes: { alpha: ALPHAS, n: L3_SWEEP_SIZES } },

    // beta = 0 could skip reading C; a step at 0 is that shortcut.
    beta: { axes: { beta: BETAS, n: L3_SWEEP_SIZES } },

    // Row- vs column-major.
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L3_SWEEP_SIZES },
    },

    // Padding on A's leading dimension: its rows move relative to the
    // 128-byte coalescing boundary.
    lda: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, lda: p.lda + p.pad }),
    },

    // Padding on B's: the operand the kernel streams along its inner loop.
    ldb: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldb: p.ldb + p.pad }),
    },

    // Padding on C's leading dimension: write coalescing.
    ldc: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldc: p.ldc + p.pad }),
    },

    // op(A): whether A's tile loads walk rows or columns.
    transA: {
      axes: { transA: ["no-transpose", "transpose"], n: L3_SWEEP_SIZES },
    },

    // op(B): the same on the operand streamed along the inner loop.
    transB: {
      axes: { transB: ["no-transpose", "transpose"], n: L3_SWEEP_SIZES },
    },

    // Which triangle of C: whether the heavy tiles dispatch first or last.
    uplo: { axes: { uplo: ["lower", "upper"], n: L3_SWEEP_SIZES } },
  },
});
