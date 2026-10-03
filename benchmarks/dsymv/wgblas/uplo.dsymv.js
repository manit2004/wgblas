// uplo sweep — dsymv.js pins uplo to its baseline. ssymv.js's own uplo sweep
// found no measurable effect for f32 either (single shader, same dispatch
// shape either way). Measured (not assumed): still no effect at DD
// precision — lower/upper land within ~5% of each other at every size
// (22.8 vs 21.5 GB/s at n=4096, 26.0 vs 26.4 at n=2048).

import { init, cleanup } from "wgblas";
import { dsymv } from "wgblas/dsymv";
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
const UPLOS = ["lower", "upper"];

const COLS = ["uplo", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const uplo of UPLOS) {
  for (const n of SIZES) {
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dsymv.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped uplo=${uplo}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n));
    const yGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(
      randomFloat64Array(n * lda),
      n,
      n,
      lda,
      "row-major",
    );

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dsymv(
        device,
        uplo,
        n,
        1.0,
        AGpu,
        lda,
        xGpu,
        1,
        0.0,
        yGpu,
        1,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsymv(
        device,
        uplo,
        n,
        1.0,
        AGpu,
        lda,
        xGpu,
        1,
        0.0,
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
    // stored triangle + x + y — 8 bytes/element, same for every uplo
    const bytes = ((n * (n + 1)) / 2 + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [uplo, n, med, gbs]);
    records.push({ uplo, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsymv", gpuModel, records, {
  folder: "dsymv",
  fileName: "uplo.dsymv",
});

cleanup();
