// Cosine sweep — srot.js runs at the single rotation angle pi/4, i.e.
// c = s = cos(pi/4). This varies c while holding s fixed, so the two halves of
// the plane rotation can be attributed separately.
//
// srot.wgsl has no branch: both outputs are computed unconditionally as
// x' = c*x + s*y and y' = c*y - s*x, so no value of c selects a different path.
// A flat row is the expected result and is worth recording as a measured null;
// a step at c = 0 or c = 1 would mean an identity case is being short-circuited
// somewhere, which BLAS does not promise.
//
// Values span the full legal range of a cosine, including both endpoints and a
// negative (rotations past pi/2).

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
const COSINES = [0, 0.5, Math.fround(Math.cos(Math.PI / 4)), 1, -0.75];

// s is pinned so that only c varies between rows.
const s = Math.fround(Math.sin(Math.PI / 4));

const COLS = ["c", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const c of COSINES) {
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
    printRow(COLS, [c, n, med, gbs]);
    records.push({ c, s, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("srot", gpuModel, records, { folder: "srot", fileName: "cosine.srot" });

cleanup();
