// stride sweep — strmv.js pins stride to its baseline.
//
// Non-unit stride breaks coalescing on the vector operands. Real BLAS hits it whenever
// x/y are rows or columns of a larger matrix. Strides are the same set the Level 1
// sweeps use (see stride.sscal.js). stride=1 is the baseline file, not repeated here.

import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

// Diagonally dominant so the triangular solve stays well conditioned across sizes.
function triangular(n, lda) {
  const a = randomFloat32Array(n * lda);
  for (let i = 0; i < n; i++) a[i * lda + i] = 8 + n;
  return a;
}

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
// Three magnitudes, each paired with an odd neighbour: the gap inside a pair is
// misalignment alone (~0% at 4, ~9% by 32). 255 not 257, to fit where 256 fits.
const STRIDES = [4, 5, 32, 33, 255, 256];

const COLS = ["stride", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const stride of STRIDES) {
  for (const n of SIZES) {
    const lda = n;

    const bytesA = n * lda * 4;
    const bytesVec = n * stride * 4;
    if (Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped stride=${stride}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n * stride));
    const yGpu = GpuVector.from(randomFloat32Array(n * stride));
    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await strmv(device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, stride, yGpu, stride, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await strmv(device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, stride, yGpu, stride, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x + y — logical elements touched, same for every stride
    const bytes = (n * (n + 1) / 2 + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [stride, n, med, gbs]);
    records.push({ stride, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("strmv", gpuModel, records, { folder: "strmv", fileName: "stride.strmv" });

cleanup();
