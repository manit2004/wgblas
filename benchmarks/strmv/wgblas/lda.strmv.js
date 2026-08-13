// lda sweep — strmv.js is entirely tight lda (lda = n). lda only matters
// for trans="transpose" (no-transpose is flat here, confirming the
// coalescing story — swept at both trans values below so that's visible in
// the data, not just claimed). transpose's curve is a *third* distinct
// pattern, not matching ssymv's "any padding helps" or ssyr's
// "128-byte-multiple helps": verified via interleaved rounds that lda+1 (4
// bytes) is best (~1.86x faster than tight lda), degrading roughly
// monotonically as padding grows — pad=32 (128 bytes, ssyr's sweet spot)
// is actually the worst point measured. Likely a DRAM bank/channel-conflict
// pattern specific to how 64 threads' lda-strided addresses map onto this
// device's interleaving — device- and pattern-specific, doesn't generalize
// from ssyr's finding even though both are cross-thread lda-stride stories.

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

      const bytesA = n * lda * 4;
      if (bytesA > device.limits.maxStorageBufferBindingSize) {
        console.log(`  (skipped trans=${trans}, pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
        continue;
      }

      const AGpu = GpuMatrix.from(new Float32Array(n * lda), n, n, lda, "row-major");
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
      // lower triangle A read + x read + y write — logical elements touched, same regardless of pad
      const bytes = (n * (n + 1) / 2 + n + n) * 4;
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [trans, pad, n, med, gbs]);
      records.push({ trans, pad, n, compute_ms: med, compute_GBs: gbs });
    }
  }
}

saveResults("strmv", gpuModel, records, { folder: "strmv", fileName: "lda.strmv" });

cleanup();
