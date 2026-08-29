// beta sweep — ssyrk.js pins beta to its baseline.
//
// `beta` scales C before accumulation. An implementation may skip reading C entirely when
// beta is 0, so unlike alpha this has a mechanism to be non-flat — a step at 0 is that
// shortcut, and its size is what it saves.

import { init, cleanup } from "wgblas";
import { ssyrk } from "wgblas/ssyrk";
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
const BENCH_ITERS = 50;
const SIZES = [64, 128, 256, 512, 1024, 2048];
const BETAS = [0, 1, 2.5, -3.75];

const COLS = ["beta", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const beta of BETAS) {
  for (const n of SIZES) {
    const lda = n;
    const ldc = n;

    if (Math.max(n * lda * 4, n * ldc * 4) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped beta=${beta}, n=${n}: a matrix would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const AGpu = GpuMatrix.from(randomFloat32Array(n * lda), n, n, lda, "row-major");
    const CGpu = GpuMatrix.from(new Float32Array(n * ldc), n, n, ldc, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyrk(device, "lower", "no-transpose", n, n, 1.0, AGpu, lda, beta, CGpu, ldc, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyrk(device, "lower", "no-transpose", n, n, 1.0, AGpu, lda, beta, CGpu, ldc, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    CGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const gflops = (n * n * n) / 1e9 / (med / 1e3);
    // Both metrics: L3 is compute-bound so GFLOP/s is the headline, but the
    // shared table builder keys off compute_GBs.
    const bytes = (n * n + 2 * n * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [beta, n, med, gflops, gbs]);
    records.push({ beta, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
  }
}

saveResults("ssyrk", gpuModel, records, { folder: "ssyrk", fileName: "beta.ssyrk" });

cleanup();
