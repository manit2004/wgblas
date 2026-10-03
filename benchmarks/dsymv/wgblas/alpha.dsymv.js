// alpha sweep — dsymv.js pins alpha to its baseline.
//
// `alpha` only ever multiplies the fully-reduced per-row dot product once
// (dsymv.wgsl) — the O(n) inner loop's arithmetic never references it — so a
// flat sweep was expected, and alpha ∈ {1, 2.5, -3.75, 1e-38} are indeed
// flat with each other (~23-26 GB/s across sizes). Measured (not assumed):
// alpha=0 reproduces the same anomaly dgemv found (see alpha.dgemv.js) —
// reproducibly ~20% slower at matched sizes (20.5 vs 26.0 GB/s at n=2048).
// Same unexplained mechanism as dgemv's case: the shader has no
// alpha-dependent branch, so this isn't accounted for by the code, just
// consistently reproduced across two independent per-row-reduction kernels.

import { init, cleanup } from "wgblas";
import { dsymv } from "wgblas/dsymv";
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
const ALPHAS = [0, 1, 2.5, -3.75, 1e-38];

const COLS = ["alpha", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const alpha of ALPHAS) {
  for (const n of SIZES) {
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dsymv.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped alpha=${alpha}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
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
      await dsymv(
        device,
        "lower",
        n,
        alpha,
        AGpu,
        lda,
        xGpu,
        1,
        0.0,
        yGpu,
        1,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsymv(
        device,
        "lower",
        n,
        alpha,
        AGpu,
        lda,
        xGpu,
        1,
        0.0,
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
    // stored triangle + x + y — 8 bytes/element, same for every alpha
    const bytes = ((n * (n + 1)) / 2 + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsymv", gpuModel, records, {
  folder: "dsymv",
  fileName: "alpha.dsymv",
});

cleanup();
