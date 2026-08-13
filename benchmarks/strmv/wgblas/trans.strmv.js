// trans sweep — strmv.js is entirely trans="no-transpose". Unlike sgemv,
// strmv uses a single pipeline for both trans values (uplo/trans/diag are
// all runtime branches) — but trans still dominates and *grows with n*:
// no-transpose reads A[i*lda+j] (coalesced, j varies by thread);
// transpose reads A[j*lda+i] (cross-thread lda-strided mirror, same shape
// as ssymv's mechanism). Measured ratio grew from ~2.3x at n=1024 to
// ~4.2x at n=4096. uplo was scoped and found to be only a minor effect
// here (~4%, unlike ssyr) — strmv's per-row barrier-synchronized reduction
// means even "light" rows pay the full reduction overhead, unlike ssyr's
// no-reduction write-only rows — so it's not swept separately.

import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
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
const TRANS = ["no-transpose", "transpose"];

const COLS = ["trans", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const trans of TRANS) {
  for (const size of SIZES) {
    const n = size;
    const lda = n;

    const AGpu = GpuMatrix.from(new Float32Array(n * n), n, n, lda, "row-major");
    const xGpu = GpuVector.from(randomFloat32Array(n));
    const yGpu = GpuVector.from(new Float32Array(n));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await strmv(device, "lower", trans, "non-unit", n, AGpu, lda, xGpu, 1, yGpu, 1);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await strmv(device, "lower", trans, "non-unit", n, AGpu, lda, xGpu, 1, yGpu, 1);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // lower triangle A read + x read + y write — same element count either way
    const bytes = (n * (n + 1) / 2 + n + n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [trans, n, med, gbs]);
    records.push({ trans, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("strmv", gpuModel, records, { folder: "strmv", fileName: "trans.strmv" });

cleanup();
