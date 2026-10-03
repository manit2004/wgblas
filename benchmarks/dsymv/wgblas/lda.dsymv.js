// lda sweep — dsymv.js is entirely tight lda (lda = n). ssymv.js documents a
// ~1.4x bank-conflict penalty for tight (power-of-2) lda vs lda+1, from the
// mirror-read path's cross-thread lda-strided addressing. Measured (not
// assumed) at DD precision: the direction holds for small pads — pad=1 and
// pad=8 are genuinely faster than pad=0 (33.6/31.6 vs 26.0 GB/s at n=2048,
// matching the bank-conflict story) — but it does NOT hold uniformly: pad=32
// (itself a power of 2) is the worst performer at n=2048 (19.8 GB/s, slower
// than tight lda), and pad=64/128 land back in between (~23-24 GB/s). So
// "any non-zero pad helps" is too strong a generalization here — only small,
// non-power-of-2 pads reliably do.

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
const PADS = [0, 1, 8, 32, 64, 128];

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
    const beta = 0.0;

    // 8 bytes/element (double-double), not 4 — see dsymv.wgsl.
    const bytesA = n * lda * 8;
    if (bytesA > device.limits.maxStorageBufferBindingSize) {
      console.log(
        `  (skipped pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    // A must be row-major here — the padded lda story is about the physical
    // row stride, which column-major storage (used by dsymv.js) would hide
    // behind a swap; row-major keeps it a direct lda*8-byte row pitch.
    const buf = new Float64Array(n * lda);
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) buf[r * lda + c] = Math.random() * 2 - 1;
    const AGpu = GpuMatrix.from(buf, n, n, lda, "row-major");
    const xGpu = GpuVector.from(randomFloat64Array(n));
    const yGpu = GpuVector.from(new Float64Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dsymv(device, "lower", n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1);
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
        beta,
        yGpu,
        1,
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower triangle A read + x read + y read + y write — 8 bytes/element,
    // same regardless of pad
    const bytes = ((n * (n + 1)) / 2 + n + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsymv", gpuModel, records, {
  folder: "dsymv",
  fileName: "lda.dsymv",
});

cleanup();
