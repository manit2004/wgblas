// transA sweep — sgemmtr.js pins transA to its baseline.
//
// op(A) decides whether the kernel walks A along rows or columns, which changes how its
// tile loads coalesce.

import { init, cleanup } from "wgblas";
import { sgemmtr } from "wgblas/sgemmtr";
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
const BENCH_ITERS = 50;
const SIZES = [64, 128, 256, 512, 1024, 2048];
const TRANSA = ["no-transpose", "transpose"];

const COLS = ["transA", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const transA of TRANSA) {
  for (const n of SIZES) {
    const lda = n;
    const ldb = n;
    const ldc = n;

    if (Math.max(n * lda * 4, n * ldb * 4, n * ldc * 4) > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped transA=${transA}, n=${n}: a matrix would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const AGpu = GpuMatrix.from(randomFloat32Array(n * lda), n, n, lda, "row-major");
    const BGpu = GpuMatrix.from(randomFloat32Array(n * ldb), n, n, ldb, "row-major");
    const CGpu = GpuMatrix.from(new Float32Array(n * ldc), n, n, ldc, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await sgemmtr(device, "lower", transA, "no-transpose", n, n, n, 1.0, AGpu, lda, BGpu, ldb, 0.0, CGpu, ldc, "row-major");
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await sgemmtr(device, "lower", transA, "no-transpose", n, n, n, 1.0, AGpu, lda, BGpu, ldb, 0.0, CGpu, ldc, "row-major");
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    BGpu.destroy();
    CGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const gflops = (n * n * n) / 1e9 / (med / 1e3);
    // Both metrics: L3 is compute-bound so GFLOP/s is the headline, but the
    // shared table builder keys off compute_GBs.
    const bytes = (n * n + n * n + 2 * n * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [transA, n, med, gflops, gbs]);
    records.push({ transA, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
  }
}

saveResults("sgemmtr", gpuModel, records, { folder: "sgemmtr", fileName: "transA.sgemmtr" });

cleanup();
