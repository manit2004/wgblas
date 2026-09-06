// Stride sweep — cscal.js is entirely incx=1 (coalesced, best case).
// Same rationale as sscal's stride.sscal.js: a Level 1 op run on a
// row/column of a larger matrix hits incx = lda, so this characterizes that
// cost separately. stride=1 itself is covered by cscal.js, not repeated here.

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
const SIZES = [
  32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304,
  16777216,
];
// Same three magnitudes + odd-neighbour pairing as sscal's own stride sweep.
const STRIDES = [4, 5, 32, 33, 255, 256];

const COLS = ["stride", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

const alpha = new Complex32(2, 3);

for (const stride of STRIDES) {
  for (const n of SIZES) {
    if (stride > n) continue; // stride itself already exceeds n — not a meaningful case

    // See sscal's stride sweep for why this is checked against
    // maxStorageBufferBindingSize, not the larger maxBufferSize. 8 bytes per
    // complex element (re+im, f32 each), not 4.
    const bytesPerBuffer = n * stride * 8;
    if (bytesPerBuffer > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped stride=${stride}, n=${n}: buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(new Complex32Array(randomFloat32Array(2 * n * stride)));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await cscal(device, n, alpha, xGpu, stride);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await cscal(device, n, alpha, xGpu, stride);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = 2 * n * 8; // logical elements touched, same regardless of stride
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [stride, n, med, gbs]);
    records.push({ stride, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("cscal", gpuModel, records, { folder: "cscal", fileName: "stride.cscal" });

cleanup();
