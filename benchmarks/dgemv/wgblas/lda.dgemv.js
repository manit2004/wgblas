// lda sweep — dgemv.js pins lda to its baseline. Measured (not assumed): no
// sharp 128-byte-boundary split like sgemv's own (sgemv's lda.sgemv.js) —
// instead a gradual, roughly monotonic decline as pad grows (0→~114 GB/s,
// 128→~44 GB/s at n=2048), matching the same gradual-not-sharp shape already
// found for dsyr/dsyr2/dger. Likely the same explanation: AHi/ALo are two
// separate f32 buffers instead of one, so the byte-alignment arithmetic
// behind sgemv's sharp boundary doesn't carry over directly.

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
const PADS = [0, 1, 8, 16, 32, 48, 64, 128];

const COLS = ["pad", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const pad of PADS) {
  for (const n of SIZES) {
    const lda = n + pad;

    // 8 bytes/element (double-double), not 4 — see dgemv_n.wgsl.
    const bytesA = n * lda * 8;
    const bytesVec = n * 8;
    if (
      Math.max(bytesA, bytesVec) > device.limits.maxStorageBufferBindingSize
    ) {
      console.log(
        `  (skipped pad=${pad}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
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
        1.0,
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
    // A read + x read + y read/write — 8 bytes/element, same for every pad
    const bytes = (n * n + 2 * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [pad, n, med, gbs]);
    records.push({ pad, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dgemv", gpuModel, records, {
  folder: "dgemv",
  fileName: "lda.dgemv",
});

cleanup();
