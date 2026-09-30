// alpha sweep — dgemv.js pins alpha to its baseline.
//
// `alpha` only ever multiplies the fully-reduced per-row dot product once
// (dgemv_n.wgsl) — the O(n) inner loop's arithmetic never references it — so
// a flat sweep was expected, and alpha ∈ {1, 2.5, -3.75, 1e-38} are indeed
// flat with each other (all ~127 GB/s at n=4096). Measured (not assumed):
// alpha=0 specifically is NOT flat with them — reproducibly ~20% slower at
// every size (~100 vs ~127 GB/s at n=4096, confirmed across repeated runs).
// beta=0 shows no such effect in beta.dgemv.js despite also being first in
// that sweep, so this isn't just a "first value in the script" artifact —
// but the shader has no alpha-dependent branch, so the mechanism is unclear;
// not worth a stronger claim than that.

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

    // 8 bytes/element (double-double), not 4 — see dgemv_n.wgsl.
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
      await dgemv(
        device,
        "no-transpose",
        n,
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
      const { gpuTimeMs } = await dgemv(
        device,
        "no-transpose",
        n,
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
    // A read + x read + y read/write — 8 bytes/element, same for every alpha
    const bytes = (n * n + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gbs]);
    records.push({ alpha, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dgemv", gpuModel, records, {
  folder: "dgemv",
  fileName: "alpha.dgemv",
});

cleanup();
