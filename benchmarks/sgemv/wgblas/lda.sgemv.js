// lda sweep — sgemv.js pins lda to its baseline.
//
// Row byte-stride is lda*4, so padding moves every row relative to the 128-byte
// coalescing boundary. 0/32/64/128 elements land on it, 1/8/16/48 do not — the same
// split that lda.ssyr.js measured at ~1.8x.

import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
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
  for (const n of SIZES) {
    const lda = n + pad;

    const bytesA = n * lda * 4;
    const bytesVec = n * 4;
    if (Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped pad=${pad}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(randomFloat32Array(n * lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await sgemv(device, "no-transpose", n, n, 1.0, AGpu, lda, xGpu, 1, 0.0, yGpu, 1, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await sgemv(device, "no-transpose", n, n, 1.0, AGpu, lda, xGpu, 1, 0.0, yGpu, 1, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // A read + x read + y read/write — logical elements touched, same for every pad
    const bytes = (n * n + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("sgemv", gpuModel, records, { folder: "sgemv", fileName: "lda.sgemv" });

cleanup();
