import { sgemm } from "wgblas/sgemm";
import { runBenchmark, matrix } from "../../utils/harness.mjs";
import {
  L3_SIZES,
  L3_SWEEP_SIZES,
  L3_LDA_PADS,
  PADS,
  ALPHAS,
  BETAS,
} from "../../utils/params.mjs";

// Autotuned two-tier tiled/register-blocked dispatch (sgemm_small/
// sgemm_large). transB dominates the trans effect and transA is small or
// even negative — B's tile dimension (BN=64) spans a full warp where A's
// (BK=8) doesn't, so transposing B scatters every warp's load. Padding
// only matters on ldb, and only when transB = "transpose" (pad = 8 is the
// sweet spot). Shape/aspect ratio (m vs n skew) was scoped as shape-robust
// here, unlike sgemv, so it isn't swept.
await runBenchmark({
  routine: "sgemm",
  warmup: 5,
  iters: 50,
  defaults: {
    transA: "no-transpose",
    transB: "no-transpose",
    alpha: 1.0,
    beta: 0.0,
    layout: "row-major",
  },
  // Square m = n = k, tight lda/ldb/ldc; A is m×k as stored (k×m when
  // transposed), B k×n (n×k).
  derive: (p) => {
    const [m, k] = [p.n, p.n];
    const [aRows, aCols] = p.transA === "no-transpose" ? [m, k] : [k, m];
    const [bRows, bCols] = p.transB === "no-transpose" ? [k, p.n] : [p.n, k];
    const cm = p.layout === "column-major";
    return {
      ...p,
      m,
      k,
      aRows,
      aCols,
      bRows,
      bCols,
      lda: cm ? aRows : aCols,
      ldb: cm ? bRows : bCols,
      ldc: cm ? m : p.n,
    };
  },
  operands: (p) => ({
    A: matrix(Float32Array, p.aRows, p.aCols, p.lda, p.layout),
    B: matrix(Float32Array, p.bRows, p.bCols, p.ldb, p.layout),
    C: matrix(Float32Array, p.m, p.n, p.ldc, p.layout),
  }),
  call: (device, p, o) =>
    sgemm(
      device,
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
  // 2·m·n·k multiply-adds, plus 2·m·n for the alpha/beta step.
  flops: (p) => 2 * p.m * p.n * p.k + 2 * p.m * p.n,
  // A read + B read + C read + C write.
  bytes: (p) => (p.m * p.k + p.k * p.n + 2 * p.m * p.n) * 4,
  sweeps: {
    // Column-major (cuBLAS's native layout), m = n = k.
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

    // Row- vs column-major (wgblas only: cuBLAS is column-major).
    layout: {
      axes: { layout: ["row-major", "column-major"], n: L3_SWEEP_SIZES },
    },

    // Padding on B's leading dimension, both ways of transB. lda and ldc
    // were scoped as non-effects, and transA stays "no-transpose".
    ldb: {
      axes: {
        transB: ["no-transpose", "transpose"],
        pad: L3_LDA_PADS,
        n: L3_SIZES,
      },
      derive: (p) => ({ ...p, ldb: p.ldb + p.pad }),
      warmup: 3,
      iters: 20,
    },

    // Padding on C's leading dimension: write coalescing.
    ldc: {
      axes: { pad: PADS, n: L3_SWEEP_SIZES },
      derive: (p) => ({ ...p, ldc: p.ldc + p.pad }),
    },

    // All four transA × transB combinations — the asymmetry is the finding.
    trans: {
      axes: {
        transA: ["no-transpose", "transpose"],
        transB: ["no-transpose", "transpose"],
        n: L3_SIZES,
      },
      warmup: 3,
      iters: 20,
    },
  },
});
