// trans sweep — dgemm.js is entirely transA=transB="no-transpose". Both
// shaders load A/B into shared memory with a transpose-dependent index
// (aIdx = select(gRowA*lda+gColA, gColA*lda+gRowA, transA), same for B/ldb)
// — when transposed, the fast-varying thread index gets multiplied by the
// leading dimension instead of added, scattering what would otherwise be a
// coalesced load. But it's asymmetric: B's tile dimension (BN=64) spans a
// full warp in the no-transpose case (so transpose scatters *every* warp),
// while A's (BK=8) never gets a full-warp-coalesced load to begin with —
// so transB dominates (measured +22-57% at n=1024) while transA is small
// and can even be *negative* (TN measured faster than NN at n=1024). All 4
// combos are swept together since it's cheap and the asymmetry itself is
// the finding.

import { init, cleanup } from "wgblas";
import { dgemm } from "wgblas/dgemm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
  warmClocks,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 3;
const BENCH_ITERS = 20;
const SIZES = [32, 64, 128, 256, 512, 1024];
const TRANS = ["no-transpose", "transpose"];

const COLS = [
  "transA",
  "transB",
  "n",
  "compute_ms",
  "compute_GFLOPs",
  "compute_GBs",
];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const transA of TRANS) {
  for (const transB of TRANS) {
    for (const size of SIZES) {
      const m = size,
        n = size,
        k = size;
      // A stored as m×k (no-transpose) or k×m (transpose); same for B/k×n.
      const [aRows, aCols] = transA === "no-transpose" ? [m, k] : [k, m];
      const [bRows, bCols] = transB === "no-transpose" ? [k, n] : [n, k];
      const lda = aCols,
        ldb = bCols,
        ldc = n;

      const AGpu = GpuMatrix.from(
        randomFloat64Array(aRows * aCols),
        aRows,
        aCols,
        lda,
        "row-major",
      );
      const BGpu = GpuMatrix.from(
        randomFloat64Array(bRows * bCols),
        bRows,
        bCols,
        ldb,
        "row-major",
      );
      const CGpu = GpuMatrix.from(
        new Float64Array(m * n),
        m,
        n,
        ldc,
        "row-major",
      );

      await warmClocks(device); // full clocks first — see helpers.mjs

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await dgemm(
          device,
          transA,
          transB,
          m,
          n,
          k,
          1.0,
          AGpu,
          lda,
          BGpu,
          ldb,
          0.0,
          CGpu,
          ldc,
        );
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await dgemm(
          device,
          transA,
          transB,
          m,
          n,
          k,
          1.0,
          AGpu,
          lda,
          BGpu,
          ldb,
          0.0,
          CGpu,
          ldc,
        );
        if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
      }

      AGpu.destroy();
      BGpu.destroy();
      CGpu.destroy();

      if (times.length === 0) continue;
      const med = median(times);
      const flops = 2 * m * n * k + 2 * m * n;
      const bytes = (m * k + k * n + 2 * m * n) * 8;
      const gflops = flops / 1e9 / (med / 1e3);
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [transA, transB, size, med, gflops, gbs]);
      records.push({
        transA,
        transB,
        n: size,
        compute_ms: med,
        compute_GFLOPs: gflops,
        compute_GBs: gbs,
      });
    }
  }
}

saveResults("dgemm", gpuModel, records, {
  folder: "dgemm",
  fileName: "trans.dgemm",
});

cleanup();
