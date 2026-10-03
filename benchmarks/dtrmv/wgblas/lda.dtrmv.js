// lda sweep — dtrmv.js is entirely tight lda (lda = n). strmv's own finding
// is that lda only matters for trans="transpose" (no-transpose flat) — swept
// at both trans values here too to check. Measured (not assumed): that does
// NOT fully hold at DD precision. no-transpose is flat for small pads
// (97-99 GB/s at pad 0-16, n=2048) but does degrade at pad>=32 (down to
// ~47-55 GB/s by pad=128) — a real effect strmv's f32 kernel doesn't show.
// transpose reproduces strmv's own pattern closely: pad=0 is dramatically
// the worst case (15.4 GB/s at n=2048), pad=1 is ~2.9x faster (44.6 GB/s),
// and the curve is non-monotonic beyond that (pad=32 dips again to 21.7,
// matching strmv's "pad=32 is the worst point measured" finding on its own
// axis) rather than a clean "more padding is worse" story.

import { init, cleanup } from "wgblas";
import { dtrmv } from "wgblas/dtrmv";
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
const TRANS = ["no-transpose", "transpose"];

const COLS = ["trans", "pad", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const trans of TRANS) {
  for (const pad of PADS) {
    for (const size of SIZES) {
      const n = size;
      const lda = n + pad;

      // 8 bytes/element (double-double), not 4 — see dtrmv.wgsl.
      const bytesA = n * lda * 8;
      if (bytesA > device.limits.maxStorageBufferBindingSize) {
        console.log(
          `  (skipped trans=${trans}, pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`,
        );
        continue;
      }

      const AGpu = GpuMatrix.from(
        new Float64Array(n * lda),
        n,
        n,
        lda,
        "row-major",
      );
      const xGpu = GpuVector.from(randomFloat64Array(n));
      const yGpu = GpuVector.from(new Float64Array(n));

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await dtrmv(
          device,
          "lower",
          trans,
          "non-unit",
          n,
          AGpu,
          lda,
          xGpu,
          1,
          yGpu,
          1,
        );
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await dtrmv(
          device,
          "lower",
          trans,
          "non-unit",
          n,
          AGpu,
          lda,
          xGpu,
          1,
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
      // lower triangle A read + x read + y write — 8 bytes/element, same regardless of pad
      const bytes = ((n * (n + 1)) / 2 + n + n) * 8;
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [trans, pad, n, med, gbs]);
      records.push({ trans, pad, n, compute_ms: med, compute_GBs: gbs });
    }
  }
}

saveResults("dtrmv", gpuModel, records, {
  folder: "dtrmv",
  fileName: "lda.dtrmv",
});

cleanup();
