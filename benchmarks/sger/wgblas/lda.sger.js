// lda sweep — sger.js is entirely tight lda (lda = m). sger has no uplo
// (general dense rank-1 update, not symmetric) — reproduces ssyr's
// 128-byte row-stride alignment finding almost exactly (~1.7-1.8x penalty
// when lda*4 isn't a multiple of 128 bytes), which confirms the mechanism
// is about write density per row/workgroup (read-modify-write across the
// whole row), not triangularity or mirroring: sger has neither.

import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
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
const PADS = [0, 1, 8, 16, 32, 48, 64, 128];

const COLS = ["pad", "m", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const pad of PADS) {
  for (const size of SIZES) {
    const m = size;
    const n = size;
    const lda = n + pad; // sger's row-major A here has lda >= n (row stride)
    const alpha = 1.0;

    const bytesA = m * lda * 4;
    if (bytesA > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped pad=${pad}, m=${m}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(m));
    const yGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(new Float32Array(m * lda), m, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await sger(device, m, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await sger(device, m, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // A read + A write + x read + y read — logical elements touched, same regardless of pad
    const bytes = (2 * m * n + m + n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, m, n, med, gbs]);
    records.push({ pad, m, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("sger", gpuModel, records, { folder: "sger", fileName: "lda.sger" });

cleanup();
