// diag sweep — dtrmv.js pins diag to its baseline.
//
// `unit` lets the kernel skip the diagonal load — dtrmv.wgsl still always
// reads AHi/ALo at that address via select() (protected ops need uniform
// control flow across threads, and this read isn't gated behind one anyway),
// discarding the result rather than skipping the memory access the way
// strmv.wgsl's `if` branch does. Measured (not assumed): unit is
// consistently ~5% faster than non-unit at larger sizes (98.5 vs 93.9 GB/s
// at n=4096) — a real but small effect, not the wasted-read-is-free null a
// branch-free reader might expect.

import { init, cleanup } from "wgblas";
import { dtrmv } from "wgblas/dtrmv";
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

    // 8 bytes/element (double-double), not 4 — see dtrmv.wgsl.
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
    const yGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dtrmv(
        device,
        "lower",
        "no-transpose",
        diag,
        n,
        AGpu,
        lda,
        xGpu,
        1,
        yGpu,
        1,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dtrmv(
        device,
        "lower",
        "no-transpose",
        diag,
        n,
        AGpu,
        lda,
        xGpu,
        1,
        yGpu,
        1,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x + y — 8 bytes/element, same for every diag
    const bytes = ((n * (n + 1)) / 2 + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [diag, n, med, gbs]);
    records.push({ diag, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dtrmv", gpuModel, records, {
  folder: "dtrmv",
  fileName: "diag.dtrmv",
});

cleanup();
