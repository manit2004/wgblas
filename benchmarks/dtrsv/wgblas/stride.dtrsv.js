// stride sweep — dtrsv.js pins stride to its baseline.
//
// Non-unit stride breaks coalescing on the vector operands. Real BLAS hits it whenever
// x is a row or column of a larger matrix. Strides are the same set the Level 1
// sweeps use (see stride.dscal.js). stride=1 is the baseline file, not repeated here.
// Measured (not assumed): a real misalignment effect at the 32/256 magnitudes
// (~15% slower at n=4096: 7.08 vs 8.16 GB/s at stride 32 vs 33, 7.07 vs 8.16
// at 255 vs 256) but no gap at magnitude 4 (8.11 vs 8.23, within noise) — the
// A matrix, not x, dominates bandwidth here, so this is smaller than a
// vector-bound L1 routine's own stride effect.

import { init, cleanup } from "wgblas";
import { dtrsv } from "wgblas/dtrsv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

// Diagonally dominant so the triangular solve stays well conditioned across sizes.
function triangular(n, lda) {
  const a = randomFloat64Array(n * lda);
  for (let i = 0; i < n; i++) a[i * lda + i] = 8 + n;
  return a;
}

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
// Three magnitudes, each paired with an odd neighbour: the gap inside a pair is
// misalignment alone (~0% at 4, ~9% by 32). 255 not 257, to fit where 256 fits.
const STRIDES = [4, 5, 32, 33, 255, 256];

const COLS = ["stride", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const stride of STRIDES) {
  for (const n of SIZES) {
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dtrsv_invert_block.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * stride * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped stride=${stride}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n * stride));
    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dtrsv(
        device,
        "lower",
        "no-transpose",
        "non-unit",
        n,
        AGpu,
        lda,
        xGpu,
        stride,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dtrsv(
        device,
        "lower",
        "no-transpose",
        "non-unit",
        n,
        AGpu,
        lda,
        xGpu,
        stride,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x read/write — 8 bytes/element, same for every stride
    const bytes = ((n * (n + 1)) / 2 + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [stride, n, med, gbs]);
    records.push({ stride, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dtrsv", gpuModel, records, {
  folder: "dtrsv",
  fileName: "stride.dtrsv",
});

cleanup();
