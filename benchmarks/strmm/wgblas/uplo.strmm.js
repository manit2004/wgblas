// uplo sweep — strmm.js pins uplo to its baseline.
//
// Which triangle of C is computed and written. Workgroups dispatch in increasing index
// order, so uplo decides whether the heavy tiles are front- or back-loaded.

import { init, cleanup } from "wgblas";
import { strmm } from "wgblas/strmm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

// Diagonally dominant so the triangular solve stays well conditioned at every size.
function triangular(n, lda) {
  const a = randomFloat32Array(n * lda);
  for (let i = 0; i < n; i++) a[i * lda + i] = 8 + n;
  return a;
}

const WARMUP_ITERS = 5;
const BENCH_ITERS = 50;
const SIZES = [64, 128, 256, 512, 1024, 2048];
const UPLOS = ["lower", "upper"];

const COLS = ["uplo", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const uplo of UPLOS) {
  for (const n of SIZES) {
    const lda = n;
    const ldb = n;

    if (Math.max(n * lda * 4, n * ldb * 4) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped uplo=${uplo}, n=${n}: a matrix would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");
    const BGpu = GpuMatrix.from(randomFloat32Array(n * ldb), n, n, ldb, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await strmm(device, "left", uplo, "no-transpose", "non-unit", n, n, 1.0, AGpu, lda, BGpu, ldb, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await strmm(device, "left", uplo, "no-transpose", "non-unit", n, n, 1.0, AGpu, lda, BGpu, ldb, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    BGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const gflops = (n * n * n) / 1e9 / (med / 1e3);
    // Both metrics: L3 is compute-bound so GFLOP/s is the headline, but the
    // shared table builder keys off compute_GBs.
    const bytes = (3 * n * n + 5 * n * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [uplo, n, med, gflops, gbs]);
    records.push({ uplo, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
  }
}

saveResults("strmm", gpuModel, records, { folder: "strmm", fileName: "uplo.strmm" });

cleanup();
