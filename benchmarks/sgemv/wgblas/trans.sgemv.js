// trans sweep — sgemv.js is entirely trans="no-transpose". transpose's
// parallelism is bounded by n (one workgroup per 64 output columns) rather
// than m, so it's slower at matched square shapes and much worse on
// tall-narrow shapes. SIZES × SIZES below is a full cross-product;
// square shapes alone can't show the aspect-ratio effect.
// element count can't show whether that effect holds across scales or is
// specific to that scale, so this sweeps every (m, n) pair to answer both.
// layout isn't swept separately — it's just m/n+trans swapped before
// dispatch (sgemv.mjs:74-78), already covered here. lda padding was checked
// and has no measurable effect, so it's skipped too.

import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
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
// mirrors sgemv.js's own SIZES; every (m, n) pair is swept below, not just m=n
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
      // A is always m×n row-major, tight-packed (lda padding confirmed a
      // non-effect above, so no need to sweep it here too).
      const lda = n;
      const alpha = 1.0;
      const beta = 0.0;

      // NoTrans: x has n elements, y has m; Trans: x has m elements, y has n.
      const xLen = trans === "no-transpose" ? n : m;
      const yLen = trans === "no-transpose" ? m : n;

      const bytesPerMatrix = m * n * 4;
      if (bytesPerMatrix > device.limits.maxStorageBufferBindingSize) {
        console.log(`  (skipped trans=${trans}, m=${m}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
        continue;
      }

      const AGpu = GpuMatrix.from(randomFloat32Array(m * n), m, n, lda, "row-major");
      const xGpu = GpuVector.from(randomFloat32Array(xLen));
      const yGpu = GpuVector.from(new Float32Array(yLen));

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await sgemv(device, trans, m, n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1);
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await sgemv(device, trans, m, n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1);
        if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
      }

      AGpu.destroy();
      xGpu.destroy();
      yGpu.destroy();

      if (times.length === 0) continue;
      const med = median(times);
      // A read + x read + y read + y write
      const bytes = (m * n + xLen + 2 * yLen) * 4;
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [trans, m, n, med, gbs]);
      records.push({ trans, m, n, compute_ms: med, compute_GBs: gbs });
    }
  }
}

saveResults("sgemv", gpuModel, records, { folder: "sgemv", fileName: "trans.sgemv" });

cleanup();
