// trans sweep — dgemv.js is entirely trans="no-transpose". Same shader
// split as sgemv (dgemv_n one workgroup per row, dgemv_t one thread per
// column tiling over x). Measured (not assumed): the same aspect-ratio
// effect sgemv documents holds at DD precision too, and is dramatic on
// tall-narrow shapes — at m=4096, n=32, no-transpose (parallel over 4096
// rows) reaches 5.4 GB/s while transpose (parallel over only 32 columns,
// mostly idle threads in a single workgroup) manages 0.64 GB/s, an ~8.5x
// gap. At square 4096×4096 the gap narrows to ~103 vs ~70 GB/s (~1.5x).
// SIZES × SIZES below is a full cross-product; square shapes alone can't
// show this. layout isn't swept separately — it's just m/n+trans swapped
// before dispatch (dgemv.mjs), already covered here (see layout.dgemv.js).

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
// mirrors dgemv.js's own SIZES; every (m, n) pair is swept below, not just m=n
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
const TRANS = ["no-transpose", "transpose"];

const COLS = ["trans", "m", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const trans of TRANS) {
  for (const m of SIZES) {
    for (const n of SIZES) {
      // A is always m×n row-major, tight-packed.
      const lda = n;
      const alpha = 1.0;
      const beta = 0.0;

      // NoTrans: x has n elements, y has m; Trans: x has m elements, y has n.
      const xLen = trans === "no-transpose" ? n : m;
      const yLen = trans === "no-transpose" ? m : n;

      // 8 bytes/element (double-double), not 4 — see dgemv_n.wgsl/dgemv_t.wgsl.
      const bytesPerMatrix = m * n * 8;
      if (bytesPerMatrix > device.limits.maxStorageBufferBindingSize) {
        console.log(
          `  (skipped trans=${trans}, m=${m}, n=${n}: A would exceed maxStorageBufferBindingSize)`,
        );
        continue;
      }

      const AGpu = GpuMatrix.from(
        randomFloat64Array(m * n),
        m,
        n,
        lda,
        "row-major",
      );
      const xGpu = GpuVector.from(randomFloat64Array(xLen));
      const yGpu = GpuVector.from(new Float64Array(yLen));

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await dgemv(
          device,
          trans,
          m,
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
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await dgemv(
          device,
          trans,
          m,
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
      // A read + x read + y read + y write — 8 bytes/element (double-double)
      const bytes = (m * n + xLen + 2 * yLen) * 8;
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [trans, m, n, med, gbs]);
      records.push({ trans, m, n, compute_ms: med, compute_GBs: gbs });
    }
  }
}

saveResults("dgemv", gpuModel, records, {
  folder: "dgemv",
  fileName: "trans.dgemv",
});

cleanup();
