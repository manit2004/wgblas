// lda sweep — ssyr2.js is entirely tight lda (lda = n). Reproduces ssyr's
// 128-byte row-stride alignment finding almost exactly (ssyr2.wgsl is
// structurally identical to ssyr.wgsl apart from the extra vector). pad ∈
// {0, 32, 64, 128} elements (0/128/256/512 bytes) are all fast, everything
// else measured ~1.8x slower regardless of amount — not a power-of-2 story.

import { init, cleanup } from "wgblas";
import { ssyr2 } from "wgblas/ssyr2";
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
    const yGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(new Float32Array(n * lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyr2(device, "lower", n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyr2(device, "lower", n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower triangle A read + A write + x read + y read — logical elements touched, same regardless of pad
    const bytes = (n * (n + 1) + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssyr2", gpuModel, records, { folder: "ssyr2", fileName: "lda.ssyr2" });

cleanup();
