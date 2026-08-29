// alpha sweep — ssyr.js pins alpha to its baseline.
//
// `alpha` is applied unconditionally by the kernel — there is no branch on its value — so a
// flat sweep is the expected result, recorded as a measured null. `0`, `1` and a
// denormal-producing `1e-38` are included because those are the values a shader could
// special-case if it ever grew a branch.

import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";
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
const ALPHAS = [0, 1, 2.5, -3.75, 1e-38];

const COLS = ["alpha", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const alpha of ALPHAS) {
  for (const n of SIZES) {
    const lda = n;

    const bytesA = n * lda * 4;
    const bytesVec = n * 4;
    if (Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped alpha=${alpha}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(randomFloat32Array(n * lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyr(device, "lower", n, alpha, xGpu, 1, AGpu, lda, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyr(device, "lower", n, alpha, xGpu, 1, AGpu, lda, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // triangle read + write + x — logical elements touched, same for every alpha
    const bytes = (n * (n + 1) + n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssyr", gpuModel, records, { folder: "ssyr", fileName: "alpha.ssyr" });

cleanup();
