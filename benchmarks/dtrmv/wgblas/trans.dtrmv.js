// trans sweep — dtrmv.js is entirely trans="no-transpose". Like strmv,
// dtrmv uses a single pipeline for both trans values (uplo/trans/diag are
// all runtime branches) — no-transpose reads A[i*lda+j] (coalesced, j
// varies by thread), transpose reads A[j*lda+i] (cross-thread lda-strided
// mirror, same shape as dsymv's mechanism). Measured (not assumed): the
// effect reproduces almost exactly at DD precision — ~2.4x at n=1024
// (71.7 vs 29.4 GB/s) growing to ~4.6x at n=4096 (118.0 vs 25.9 GB/s),
// matching strmv's own f32 finding (~2.3x → ~4.2x) closely in both
// magnitude and growth trend.

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

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
const TRANS = ["no-transpose", "transpose"];

const COLS = ["trans", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const trans of TRANS) {
  for (const size of SIZES) {
    const n = size;
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dtrmv.wgsl.
    const bytesA = n * lda * 8;
    if (bytesA > device.limits.maxStorageBufferBindingSize) {
      console.log(
        `  (skipped trans=${trans}, n=${n}: A would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const AGpu = GpuMatrix.from(
      new Float64Array(n * n),
      n,
      n,
      lda,
      "row-major",
    );
    const xGpu = GpuVector.from(randomFloat64Array(n));
    const yGpu = GpuVector.from(new Float64Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dtrmv(
        device,
        "lower",
        trans,
        "non-unit",
        n,
        AGpu,
        lda,
        xGpu,
        1,
        yGpu,
        1,
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dtrmv(
        device,
        "lower",
        trans,
        "non-unit",
        n,
        AGpu,
        lda,
        xGpu,
        1,
        yGpu,
        1,
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower triangle A read + x read + y write — same element count either way
    const bytes = ((n * (n + 1)) / 2 + n + n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [trans, n, med, gbs]);
    records.push({ trans, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dtrmv", gpuModel, records, {
  folder: "dtrmv",
  fileName: "trans.dtrmv",
});

cleanup();
