// ldb sweep — sgemm.js is entirely tight lda/ldb/ldc. lda and ldc were
// scoped and found to be non-effects (checked flat across padding); ldb
// only matters when transB="transpose" — swept at both transB values below
// so that's visible in the data, not just claimed. transA stays
// "no-transpose" throughout (transA/lda were confirmed non-effects, see
// trans.sgemm.js). This is a fourth distinct alignment pattern, not
// matching ssymv's, ssyr's, or strmv's — pad=8 is the sweet spot here.

import { init, cleanup } from "wgblas";
import { sgemm } from "wgblas/sgemm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 3;
const BENCH_ITERS = 20;
const SIZES = [32, 64, 128, 256, 512, 1024];
const PADS = [0, 1, 8, 16, 32, 64];
const TRANS_B = ["no-transpose", "transpose"];

const COLS = ["transB", "pad", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const transB of TRANS_B) {
  for (const pad of PADS) {
    for (const size of SIZES) {
      const m = size, n = size, k = size;
      const lda = k;
      const [bRows, bCols] = transB === "no-transpose" ? [k, n] : [n, k];
      const ldb = bCols + pad;
      const ldc = n;

      const bytesB = bRows * ldb * 4;
      if (bytesB > device.limits.maxStorageBufferBindingSize) {
        console.log(`  (skipped transB=${transB}, pad=${pad}, n=${size}: B would exceed maxStorageBufferBindingSize)`);
        continue;
      }

      const AGpu = GpuMatrix.from(randomFloat32Array(m * k), m, k, lda, "row-major");
      const BGpu = GpuMatrix.from(new Float32Array(bRows * ldb), bRows, bCols, ldb, "row-major");
      const CGpu = GpuMatrix.from(new Float32Array(m * n), m, n, ldc, "row-major");

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await sgemm(device, "no-transpose", transB, m, n, k, 1.0, AGpu, lda, BGpu, ldb, 0.0, CGpu, ldc);
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await sgemm(device, "no-transpose", transB, m, n, k, 1.0, AGpu, lda, BGpu, ldb, 0.0, CGpu, ldc);
        if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
      }

      AGpu.destroy();
      BGpu.destroy();
      CGpu.destroy();

      if (times.length === 0) continue;
      const med = median(times);
      // logical elements touched, same regardless of pad
      const flops = 2 * m * n * k + 2 * m * n;
      const bytes = (m * k + k * n + 2 * m * n) * 4;
      const gflops = flops / 1e9 / (med / 1e3);
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [transB, pad, size, med, gflops, gbs]);
      records.push({ transB, pad, n: size, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
    }
  }
}

saveResults("sgemm", gpuModel, records, { folder: "sgemm", fileName: "ldb.sgemm" });

cleanup();
