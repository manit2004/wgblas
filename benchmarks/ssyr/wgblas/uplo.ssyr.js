// uplo sweep — ssyr.js is entirely uplo="lower". ssyr.wgsl is genuinely
// triangular (row i touches only its stored range, no mirroring), so row
// work is imbalanced by construction, and GPU workgroups dispatch in
// increasing wgid.x order: "upper" front-loads the heaviest rows first
// (worse — long-running heavy workgroups have nothing to overlap with),
// "lower" back-loads them (better — light rows clear fast, the heavy tail
// gets full GPU to itself). Measured ~1.7-1.8x slower for upper at n≥2048.

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
const UPLOS = ["lower", "upper"];

const COLS = ["uplo", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const uplo of UPLOS) {
  for (const size of SIZES) {
    const n = size;
    const lda = n;
    const alpha = 1.0;

    const xGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(new Float32Array(n * n), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyr(device, uplo, n, alpha, xGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyr(device, uplo, n, alpha, xGpu, 1, AGpu, lda);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower/upper triangle A read + A write + x read — same element count either way
    const bytes = (n * (n + 1) + n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [uplo, n, med, gbs]);
    records.push({ uplo, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssyr", gpuModel, records, { folder: "ssyr", fileName: "uplo.ssyr" });

cleanup();
