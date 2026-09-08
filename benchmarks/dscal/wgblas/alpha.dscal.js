// Alpha sweep — dscal.js runs entirely at alpha=2.0.
//
// dscal.wgsl contains no branch on alpha's value at all — every element runs
// the same ddMulProtected formula regardless — so, exactly like sscal's own
// alpha sweep, a flat row across alpha is the expected result, recorded as
// a measured null rather than an untested assumption.
//
// Values hit the cases a shader *could* special-case: 0 (result independent
// of x), 1 (identity), a plain scalar, a negative, and a denormal-producing
// multiplier.

import { init, cleanup } from "wgblas";
import { dscal } from "wgblas/dscal";
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

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dscal(device, n, alpha, xGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dscal(device, n, alpha, xGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 2 * n * 8; // one read + one write per double-double element
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dscal", gpuModel, records, { folder: "dscal", fileName: "alpha.dscal" });

cleanup();
