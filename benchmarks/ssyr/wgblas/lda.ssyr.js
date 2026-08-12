// lda sweep — ssyr.js is entirely tight lda (lda = n). NOT a power-of-2
// story like ssymv's: ssyr.wgsl has no cross-thread lda-strided reads at
// all (every access is within-row, row_base = row*lda offset per
// workgroup). Verified via a fine-grained sweep that the row byte-stride
// (lda*4) just needs to stay a multiple of 128 bytes — pad ∈ {0, 32, 64,
// 128} elements (0/128/256/512 bytes) are all fast, everything else
// (1, 8, 16, 48 elements) measured ~1.8x slower regardless of amount.

import { init, cleanup } from "wgblas";
import { ssyr } from "wgblas/ssyr";
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

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
// 0/32/64/128 land on the 128-byte boundary (fast); 1/8/16/48 don't (slow).
const PADS = [0, 1, 8, 16, 32, 48, 64, 128];

const COLS = ["pad", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const pad of PADS) {
  for (const size of SIZES) {
    const n = size;
    const lda = n + pad;
    const alpha = 1.0;

    const bytesA = n * lda * 4;
    if (bytesA > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(new Float32Array(n * lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyr(device, "lower", n, alpha, xGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyr(device, "lower", n, alpha, xGpu, 1, AGpu, lda);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower triangle A read + A write + x read — logical elements touched, same regardless of pad
    const bytes = (n * (n + 1) + n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssyr", gpuModel, records, { folder: "ssyr", fileName: "lda.ssyr" });

cleanup();
