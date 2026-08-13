// lda sweep — ssymv.js is entirely tight lda (lda = n). uplo was scoped and
// found to be a non-effect (~1.0x, single shader, same dispatch shape either
// way, coalesced/scattered access mix washes out in aggregate — not swept
// here). lda IS a real lever: the mirror-read path (A[j*lda+i] for the
// un-stored triangle) has cross-thread lda-strided addressing, which hits
// DRAM bank conflicts at power-of-2 lda — measured ~1.4x slower than
// lda+1 at matched n. {0, 1, 8, 32, 64, 128} are the pad amounts verified
// during scoping.

import { init, cleanup } from "wgblas";
import { ssymv } from "wgblas/ssymv";
import { GpuVector } from "wgblas/classes/GpuVector";
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

    const bytesA = n * lda * 4;
    if (bytesA > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    // A must be row-major here — the padded lda story is about the physical
    // row stride, which column-major storage (used by ssymv.js) would hide
    // behind a swap; row-major keeps it a direct lda*4-byte row pitch.
    const buf = new Float32Array(n * lda);
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) buf[r * lda + c] = Math.random() * 2 - 1;
    const AGpu = GpuMatrix.from(buf, n, n, lda, "row-major");
    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(new Float32Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssymv(device, "lower", n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssymv(device, "lower", n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower triangle A read + x read + y read + y write — logical elements
    // touched, same regardless of pad
    const bytes = (n * (n + 1) / 2 + n + 2 * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssymv", gpuModel, records, { folder: "ssymv", fileName: "lda.ssymv" });

cleanup();
