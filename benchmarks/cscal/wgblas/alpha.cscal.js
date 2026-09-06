// Alpha sweep — cscal.js runs entirely at alpha=2+3i.
//
// cscal.wgsl contains no branch on alpha at all — every element runs the
// same complex-multiply formula regardless of alpha's value — so, exactly
// like sscal's own alpha sweep, a flat row across alpha is the expected
// result, recorded as a measured null rather than an untested assumption.
//
// Values hit the cases a shader *could* special-case: 0+0i (result
// independent of x, BLAS's "operand not referenced" case), 1+0i (real
// identity), a plain complex value, a pure-imaginary rotation, and a
// denormal-producing magnitude.

import { init, cleanup } from "wgblas";
import { cscal } from "wgblas/cscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { Complex32, Complex32Array } from "wgblas/classes/Complex32";
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
const ALPHAS = [
  new Complex32(0, 0),
  new Complex32(1, 0),
  new Complex32(2.5, -3.75),
  new Complex32(0, 1),
  new Complex32(1e-38, 0),
];

const COLS = ["alpha", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

const fmt = (z) => `${z.re}${z.im < 0 ? "" : "+"}${z.im}i`;

for (const alpha of ALPHAS) {
  for (const n of SIZES) {
    const xGpu = GpuVector.from(new Complex32Array(randomFloat32Array(2 * n)));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await cscal(device, n, alpha, xGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await cscal(device, n, alpha, xGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 2 * n * 8; // one read + one write per complex element
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [fmt(alpha), n, med, gbs]);
    records.push({ alpha: fmt(alpha), n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("cscal", gpuModel, records, { folder: "cscal", fileName: "alpha.cscal" });

cleanup();
