// diag sweep — dtrsv.js pins diag to its baseline.
//
// `unit` lets the block-inversion kernel skip the diagonal entirely — no
// load, and no ddDivProtected call — so any difference here is that skipped
// division (dtrsv's one DD-arithmetic-heavy step; strsv's own f32 finding
// was a confirmed non-effect since f32 has no equivalent protected-op cost).
// Measured (not assumed): unlike strsv, this is a real small effect at DD
// precision — unit is consistently ~5-8% faster (8.87 vs 8.24 GB/s at
// n=4096), the skipped ddDivProtected call costing more than dtrmv's own
// skipped-read-only diag effect (~5%).

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
const DIAGS = ["non-unit", "unit"];

const COLS = ["diag", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const diag of DIAGS) {
  for (const n of SIZES) {
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dtrsv_invert_block.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped diag=${diag}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dtrsv(
        device,
        "lower",
        "no-transpose",
        diag,
        n,
        AGpu,
        lda,
        xGpu,
        1,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dtrsv(
        device,
        "lower",
        "no-transpose",
        diag,
        n,
        AGpu,
        lda,
        xGpu,
        1,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x read/write — 8 bytes/element, same for every diag
    const bytes = ((n * (n + 1)) / 2 + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [diag, n, med, gbs]);
    records.push({ diag, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dtrsv", gpuModel, records, {
  folder: "dtrsv",
  fileName: "diag.dtrsv",
});

cleanup();
