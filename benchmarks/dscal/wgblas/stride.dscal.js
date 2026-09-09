// Stride sweep — dscal.js is entirely incx=1 (coalesced, best case).
// Same rationale as sscal's stride.sscal.js. stride=1 itself is covered by
// dscal.js, not repeated here.

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

const alpha = 2.0;

for (const stride of STRIDES) {
  for (const n of SIZES) {
    if (stride > n) continue; // stride itself already exceeds n — not a meaningful case

    // 8 bytes per double-double-emulated element, not 4 — see dscal.js.
    const bytesPerBuffer = n * stride * 8;
    if (bytesPerBuffer > device.limits.maxStorageBufferBindingSize) {
      console.log(
        `  (skipped stride=${stride}, n=${n}: buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n * stride));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dscal(device, n, alpha, xGpu, stride);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dscal(device, n, alpha, xGpu, stride);
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

saveResults("dscal", gpuModel, records, {
  folder: "dscal",
  fileName: "stride.dscal",
});

cleanup();
