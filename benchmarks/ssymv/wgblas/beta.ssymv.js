// beta sweep — ssymv.js pins beta to its baseline.
//
// `beta` scales the existing y before accumulation. Reference BLAS is allowed to skip
// reading y when beta is 0; this sweep shows whether that shortcut is taken here, and
// what it costs when it is not.

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
const BETAS = [0, 1, 2.5, -3.75];

const COLS = ["beta", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const beta of BETAS) {
  for (const n of SIZES) {
    const lda = n;

    const bytesA = n * lda * 4;
    const bytesVec = n * 4;
    if (Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped beta=${beta}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(randomFloat32Array(n * lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssymv(device, "lower", n, 1.0, AGpu, lda, xGpu, 1, beta, yGpu, 1, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssymv(device, "lower", n, 1.0, AGpu, lda, xGpu, 1, beta, yGpu, 1, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x + y — logical elements touched, same for every beta
    const bytes = (n * (n + 1) / 2 + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [beta, n, med, gbs]);
    records.push({ beta, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssymv", gpuModel, records, { folder: "ssymv", fileName: "beta.ssymv" });

cleanup();
