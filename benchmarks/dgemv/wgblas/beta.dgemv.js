// beta sweep — dgemv.js pins beta to its baseline.
//
// `beta` scales the existing y before accumulation. dgemv_n.wgsl/dgemv_t.wgsl
// always read y and compute both the beta=0 and beta!=0 branches
// unconditionally (protected ops need uniform control flow), selecting the
// result at the end — so unlike reference BLAS, there's no shortcut to skip
// reading y when beta is 0. Measured (not assumed): completely flat across
// beta ∈ {0, 1, 2.5, -3.75} at every size (all ~127 GB/s at n=4096) — the
// always-compute-both-branches design costs exactly nothing extra here, the
// per-row/per-column work already dominates.

import { init, cleanup } from "wgblas";
import { dgemv } from "wgblas/dgemv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
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
const BETAS = [0, 1, 2.5, -3.75];

const COLS = ["beta", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const beta of BETAS) {
  for (const n of SIZES) {
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dgemv_n.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped beta=${beta}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n));
    const yGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(
      randomFloat64Array(n * lda),
      n,
      n,
      lda,
      "row-major",
    );

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dgemv(
        device,
        "no-transpose",
        n,
        n,
        1.0,
        AGpu,
        lda,
        xGpu,
        1,
        beta,
        yGpu,
        1,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dgemv(
        device,
        "no-transpose",
        n,
        n,
        1.0,
        AGpu,
        lda,
        xGpu,
        1,
        beta,
        yGpu,
        1,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    yGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // A read + x read + y read/write — 8 bytes/element, same for every beta
    const bytes = (n * n + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [beta, n, med, gbs]);
    records.push({ beta, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dgemv", gpuModel, records, {
  folder: "dgemv",
  fileName: "beta.dgemv",
});

cleanup();
