// uplo sweep — ssyr2.js is entirely uplo="lower". ssyr2.wgsl is structurally
// identical to ssyr.wgsl (same triangular colStart/colEnd, same
// row_base=row*lda addressing) apart from the extra vector read/arithmetic,
// and reproduces the same mechanism: GPU workgroups dispatch in increasing
// wgid.x order, so "upper" front-loads the heaviest rows first (worse),
// "lower" back-loads them (better). Measured ~1.6-1.8x slower for upper at
// n>=1024, matching ssyr almost exactly.

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
    const yGpu = GpuVector.from(randomFloat32Array(n));
    const AGpu = GpuMatrix.from(new Float32Array(n * n), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyr2(device, uplo, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyr2(device, uplo, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower/upper triangle A read + A write + x read + y read — same element count either way
    const bytes = (n * (n + 1) + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [uplo, n, med, gbs]);
    records.push({ uplo, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssyr2", gpuModel, records, { folder: "ssyr2", fileName: "uplo.ssyr2" });

cleanup();
