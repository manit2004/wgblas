// Alpha sweep — sscal.js runs entirely at alpha=2.0.
//
// sscal.wgsl contains no branch at all: the kernel is `x[i] = alpha * x[i]`
// for every value of alpha, so there is no code path for a particular alpha to
// select. This sweep exists to hold that claim to evidence rather than to
// reading, and to give the parameter screen a measured null instead of an
// untested assumption. A flat row across alpha is the expected — and useful —
// result; a non-flat one would mean the multiply itself is value-dependent
// (denormal or NaN handling), which would be worth knowing.
//
// Values are chosen to hit the cases a shader *could* special-case if it ever
// grew a branch: 0 (result independent of x), 1 (identity), a plain scalar, a
// negative, and a denormal-producing multiplier.

import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
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

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await sscal(device, n, alpha, xGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await sscal(device, n, alpha, xGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 2 * n * 4; // one read + one write per element
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("sscal", gpuModel, records, { folder: "sscal", fileName: "alpha.sscal" });

cleanup();
