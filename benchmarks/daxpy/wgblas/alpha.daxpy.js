// Alpha sweep — daxpy.js runs entirely at alpha=2.0.
//
// daxpy.wgsl has no branch: the kernel computes ddMulProtected then
// ddAddProtected unconditionally for every element, so — same as saxpy's own
// alpha sweep — a flat row across alpha is what a correct implementation
// should produce, recorded as a measured null rather than an untested
// assumption. alpha=0 is not a no-op here either: y is still read and written.

import { init, cleanup } from "wgblas";
import { daxpy } from "wgblas/daxpy";
import { GpuVector } from "wgblas/classes/GpuVector";
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
const SIZES = [1024, 65536, 1048576, 16777216];
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
    const xGpu = GpuVector.from(randomFloat64Array(n));
    const yGpu = GpuVector.from(randomFloat64Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await daxpy(device, n, alpha, xGpu, 1, yGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await daxpy(device, n, alpha, xGpu, 1, yGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 3 * n * 8; // read x, read y, write y — 8 bytes/double-double element
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("daxpy", gpuModel, records, { folder: "daxpy", fileName: "alpha.daxpy" });

cleanup();
