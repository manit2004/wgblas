// trans sweep — strsv.js pins trans to its baseline.
//
// op(A) decides whether the kernel walks A along rows or columns, so the two settings
// have different coalescing behaviour on identical data.

import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
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
const TRANS = ["no-transpose", "transpose"];

const COLS = ["trans", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const trans of TRANS) {
  for (const n of SIZES) {
    const lda = n;

    const bytesA = n * lda * 4;
    const bytesVec = n * 4;
    if (Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped trans=${trans}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await strsv(device, "lower", trans, "non-unit", n, AGpu, lda, xGpu, 1, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await strsv(device, "lower", trans, "non-unit", n, AGpu, lda, xGpu, 1, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x read/write — logical elements touched, same for every trans
    const bytes = (n * (n + 1) / 2 + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [trans, n, med, gbs]);
    records.push({ trans, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("strsv", gpuModel, records, { folder: "strsv", fileName: "trans.strsv" });

cleanup();
