// layout sweep — ssymv.js pins layout to its baseline.
//
// Column-major swaps the effective m/n and flips the transpose flag internally, which
// changes which axis is contiguous and therefore how the matrix reads coalesce. This is
// the one Level 2 parameter with a mechanism to matter on every routine.

import { init, cleanup } from "wgblas";
import { ssymv } from "wgblas/ssymv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";
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
const LAYOUTS = ["row-major", "column-major"];

const COLS = ["layout", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const layout of LAYOUTS) {
  for (const n of SIZES) {
    const lda = n;

    const bytesA = n * lda * 4;
    const bytesVec = n * 4;
    if (Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped layout=${layout}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(randomFloat32Array(n * lda), n, n, lda, layout);

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssymv(device, "lower", n, 1.0, AGpu, lda, xGpu, 1, 0.0, yGpu, 1, layout);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssymv(device, "lower", n, 1.0, AGpu, lda, xGpu, 1, 0.0, yGpu, 1, layout);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x + y — logical elements touched, same for every layout
    const bytes = (n * (n + 1) / 2 + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [layout, n, med, gbs]);
    records.push({ layout, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssymv", gpuModel, records, { folder: "ssymv", fileName: "layout.ssymv" });

cleanup();
