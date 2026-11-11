// alpha sweep — dsyrk.js pins alpha to its baseline.
//
// `alpha` is applied unconditionally by the kernel — no branch on its value — so a flat
// sweep is the expected result, recorded as a measured null. `strsm` is the exception in
// this library: it adds a pre-scale pass when alpha != 1 and skips the solve at alpha = 0.

import { init, cleanup } from "wgblas";
import { dsyrk } from "wgblas/dsyrk";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
  warmClocks,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 50;
const SIZES = [64, 128, 256, 512, 1024, 2048];
const ALPHAS = [0, 1, 2.5, -3.75, 1e-38];

const COLS = ["alpha", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const alpha of ALPHAS) {
  for (const n of SIZES) {
    const lda = n;
    const ldc = n;

    if (
      Math.max(n * lda * 4, n * ldc * 4) >
      device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped alpha=${alpha}, n=${n}: a matrix would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const AGpu = GpuMatrix.from(
      randomFloat64Array(n * lda),
      n,
      n,
      lda,
      "row-major",
    );
    const CGpu = GpuMatrix.from(
      new Float64Array(n * ldc),
      n,
      n,
      ldc,
      "row-major",
    );

    await warmClocks(device); // full clocks first — see helpers.mjs

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dsyrk(
        device,
        "lower",
        "no-transpose",
        n,
        n,
        alpha,
        AGpu,
        lda,
        0.0,
        CGpu,
        ldc,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsyrk(
        device,
        "lower",
        "no-transpose",
        n,
        n,
        alpha,
        AGpu,
        lda,
        0.0,
        CGpu,
        ldc,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    CGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const gflops = (n * n * n) / 1e9 / (med / 1e3);
    // Both metrics: L3 is compute-bound so GFLOP/s is the headline, but the
    // shared table builder keys off compute_GBs.
    const bytes = (n * n + 2 * n * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [alpha, n, med, gflops, gbs]);
    records.push({
      alpha,
      n,
      compute_ms: med,
      compute_GFLOPs: gflops,
      compute_GBs: gbs,
    });
  }
}

saveResults("dsyrk", gpuModel, records, {
  folder: "dsyrk",
  fileName: "alpha.dsyrk",
});

cleanup();
