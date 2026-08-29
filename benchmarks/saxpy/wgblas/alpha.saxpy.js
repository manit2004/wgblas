// Alpha sweep — saxpy.js runs entirely at alpha=2.0.
//
// saxpy.wgsl has no branch: the kernel is `y[i] = alpha * x[i] + y[i]`
// unconditionally, so no value of alpha selects a different path. Unlike
// sscal, alpha=0 here is not a no-op — y is still read and written — so a flat
// row across alpha is what a correct implementation should produce, and any
// step at 0 or 1 would mean an optimisation was applied that BLAS does not
// promise.
//
// See also strsm, where alpha genuinely is special-cased (an extra pre-scale
// pass when alpha != 1, and the solve skipped entirely at alpha = 0) — the
// parameter is only inert for the routines whose kernels never branch on it.

import { init, cleanup } from "wgblas";
import { saxpy } from "wgblas/saxpy";
import { GpuVector } from "wgblas/classes/GpuVector";
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
    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(randomFloat32Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await saxpy(device, n, alpha, xGpu, 1, yGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await saxpy(device, n, alpha, xGpu, 1, yGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 3 * n * 4; // read x, read y, write y
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("saxpy", gpuModel, records, { folder: "saxpy", fileName: "alpha.saxpy" });

cleanup();
