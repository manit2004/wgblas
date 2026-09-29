// uplo sweep — dsyr.js is entirely uplo="lower". Same genuinely-triangular
// shader structure as ssyr.wgsl, but measured (not assumed): the ~1.7-1.8x
// upper-vs-lower dispatch-order effect ssyr.js documents does NOT reproduce
// here — lower/upper land within ~±10% of each other at every size, i.e.
// noise, not a real effect. Not a DD-specific artifact either: cuBLAS's own
// native (non-emulated) double-precision cublasDsyr shows the identical
// absence of the effect (see uplo.dsyr.c) — so whatever makes upper slower
// for f32 specifically doesn't carry over to f64, on either implementation.

import { init, cleanup } from "wgblas";
import { dsyr } from "wgblas/dsyr";
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

    const xGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(
      new Float64Array(n * n),
      n,
      n,
      lda,
      "row-major",
    );

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dsyr(device, uplo, n, alpha, xGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsyr(
        device,
        uplo,
        n,
        alpha,
        xGpu,
        1,
        AGpu,
        lda,
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower/upper triangle A read + A write + x read — same element count either way
    const bytes = (n * (n + 1) + n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [uplo, n, med, gbs]);
    records.push({ uplo, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsyr", gpuModel, records, {
  folder: "dsyr",
  fileName: "uplo.dsyr",
});

cleanup();
