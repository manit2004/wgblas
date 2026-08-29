// Sine sweep — the counterpart to cosine.srot.js: s varies while c is pinned,
// so the other half of the plane rotation is attributed on its own.
//
// As with c, srot.wgsl has no branch on s — x' = c*x + s*y and y' = c*y - s*x
// are both evaluated unconditionally. A flat row is the expected result. Note
// s = 0 makes the rotation an identity in exact arithmetic but is still fully
// computed and written, so a step there would indicate a short-circuit rather
// than a property of the maths.

import { init, cleanup } from "wgblas";
import { srot } from "wgblas/srot";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const STRIDE = 1; // unit stride — see stride.srot.js for the incx/incy sweep
const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [1024, 65536, 1048576, 16777216];
const SINES = [0, 0.5, Math.fround(Math.sin(Math.PI / 4)), 1, -0.75];

// c is pinned so that only s varies between rows.
const c = Math.fround(Math.cos(Math.PI / 4));

const COLS = ["s", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const s of SINES) {
  for (const n of SIZES) {
    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(randomFloat32Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await srot(device, n, xGpu, STRIDE, yGpu, STRIDE, c, s);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await srot(device, n, xGpu, STRIDE, yGpu, STRIDE, c, s);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 4 * n * 4; // read x, read y, write x, write y
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [s, n, med, gbs]);
    records.push({ c, s, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("srot", gpuModel, records, { folder: "srot", fileName: "sine.srot" });

cleanup();
