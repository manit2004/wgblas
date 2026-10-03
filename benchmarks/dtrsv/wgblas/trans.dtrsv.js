// trans sweep — dtrsv.js pins trans to its baseline.
//
// op(A) decides whether the "update" pass walks A along rows or columns, so
// the two settings have different coalescing behaviour on identical data —
// same mechanism as trans.dtrmv.js, but diluted here since trans only
// affects the update dispatch, a fraction of total dispatch-dominated time
// (see dtrsv.js's own comment). Measured (not assumed): real but modest, as
// expected — ~1.2x at n=4096 (8.23 vs 6.79 GB/s), close to strsv's own f32
// finding (~1.2-1.3x) and much smaller than dtrmv's undiluted ~4.6x.

import { init, cleanup } from "wgblas";
import { dtrsv } from "wgblas/dtrsv";
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

// Diagonally dominant so the triangular solve stays well conditioned across sizes.
function triangular(n, lda) {
  const a = randomFloat64Array(n * lda);
  for (let i = 0; i < n; i++) a[i * lda + i] = 8 + n;
  return a;
}

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
  for (const n of SIZES) {
    const lda = n;

    // 8 bytes/element (double-double), not 4 — see dtrsv_invert_block.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped trans=${trans}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const xGpu = GpuVector.from(randomFloat64Array(n));
    const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dtrsv(
        device,
        "lower",
        trans,
        "non-unit",
        n,
        AGpu,
        lda,
        xGpu,
        1,
        "row-major",
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dtrsv(
        device,
        "lower",
        trans,
        "non-unit",
        n,
        AGpu,
        lda,
        xGpu,
        1,
        "row-major",
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();
    AGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    // stored triangle + x read/write — 8 bytes/element, same for every trans
    const bytes = ((n * (n + 1)) / 2 + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [trans, n, med, gbs]);
    records.push({ trans, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dtrsv", gpuModel, records, {
  folder: "dtrsv",
  fileName: "trans.dtrsv",
});

cleanup();
