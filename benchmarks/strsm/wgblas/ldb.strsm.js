// ldb sweep — strsm.js pins ldb to its baseline.
//
// Same idea as the lda sweep, on B. B is the operand the gemm kernels stream along their
// inner loop, so its stride is the one most likely to matter.

import { init, cleanup } from "wgblas";
import { strsm } from "wgblas/strsm";
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
const PADS = [0, 1, 8, 16, 32, 48, 64, 128];

const COLS = ["pad", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const pad of PADS) {
  for (const n of SIZES) {
    const lda = n;
    const ldb = n + pad;

    if (Math.max(n * lda * 4, n * ldb * 4) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped pad=${pad}, n=${n}: a matrix would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");
    const BGpu = GpuMatrix.from(randomFloat32Array(n * ldb), n, n, ldb, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await strsm(device, "left", "lower", "no-transpose", "non-unit", n, n, 1.0, AGpu, lda, BGpu, ldb, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await strsm(device, "left", "lower", "no-transpose", "non-unit", n, n, 1.0, AGpu, lda, BGpu, ldb, "row-major");
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
    printRow(COLS, [pad, n, med, gflops, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
  }
}

saveResults("strsm", gpuModel, records, { folder: "strsm", fileName: "ldb.strsm" });

cleanup();
