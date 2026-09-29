// lda sweep — dsyr.js is entirely tight lda (lda = n). Same shader structure
// as ssyr.wgsl, but measured (not assumed): ssyr.js's sharp 128-byte-
// boundary fast/slow split does NOT reproduce here — instead pad shows a
// gradual, roughly monotonic decline as it grows (0→~85 GB/s, 128→~43 GB/s
// at these sizes), no clean threshold. Likely explanation: AHi/ALo are two
// separate f32 buffers instead of one f32 buffer, so the byte-alignment
// arithmetic that produced ssyr's sharp boundary doesn't carry over directly.

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
const PADS = [0, 1, 8, 16, 32, 48, 64, 128];

const COLS = ["pad", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const pad of PADS) {
  for (const size of SIZES) {
    const n = size;
    const lda = n + pad;
    const alpha = 1.0;

    // 8 bytes/element (double-double), not 4 — see dsyr.wgsl.
    const bytesA = n * lda * 8;
    if (bytesA > device.limits.maxStorageBufferBindingSize) {
      console.log(
        `  (skipped pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(
      new Float64Array(n * lda),
      n,
      n,
      lda,
      "row-major",
    );

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dsyr(device, "lower", n, alpha, xGpu, 1, AGpu, lda);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsyr(
        device,
        "lower",
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
    // lower triangle A read + A write + x read — 8 bytes/element, same regardless of pad
    const bytes = (n * (n + 1) + n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsyr", gpuModel, records, {
  folder: "dsyr",
  fileName: "lda.dsyr",
});

cleanup();
