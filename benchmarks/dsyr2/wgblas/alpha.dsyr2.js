// alpha sweep — dsyr2.js pins alpha to its baseline.
//
// `alpha` is applied unconditionally by the kernel — there is no branch on its value — so a
// flat sweep is the expected result, recorded as a measured null. `0`, `1` and a
// denormal-producing `1e-38` are included because those are the values a shader could
// special-case if it ever grew a branch.

import { init, cleanup } from "wgblas";
import { dsyr2 } from "wgblas/dsyr2";
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

    // 8 bytes/element (double-double), not 4 — see dsyr2.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped alpha=${alpha}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
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
      await dsyr2(
        device,
        "lower",
        n,
        alpha,
        xGpu,
        1,
        yGpu,
        1,
        AGpu,
        lda,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsyr2(
        device,
        "lower",
        n,
        alpha,
        xGpu,
        1,
        yGpu,
        1,
        AGpu,
        lda,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // triangle read + write + x + y — 8 bytes/element (double-double), same for every alpha
    const bytes = (n * (n + 1) + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsyr2", gpuModel, records, {
  folder: "dsyr2",
  fileName: "alpha.dsyr2",
});

cleanup();
