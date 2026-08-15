// lda sweep — ssyrk.js is entirely tight lda. Only matters for
// trans="no-transpose" (where lda drives the internal transB-like read,
// the dominant mechanism inherited from sgemm/sgemmtr's own ldb finding);
// flat for trans="transpose" (internal transB-like read becomes
// no-transpose, a confirmed non-effect there too). See temp/scope_ssyrk.mjs.

import { init, cleanup } from "wgblas";
import { ssyrk } from "wgblas/ssyrk";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 30;
const SIZES = [512, 1024, 2048];
const PADS = [0, 1, 8, 16, 32, 64];
const TRANS = ["no-transpose", "transpose"];

const COLS = ["trans", "pad", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const trans of TRANS) {
  for (const n of SIZES) {
    const k = n;
    for (const pad of PADS) {
      const lda = k + pad;
      const bytesA = n * lda * 4;
      if (bytesA > device.limits.maxStorageBufferBindingSize) {
        console.log(`  (skipped trans=${trans} pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
        continue;
      }

      const A = GpuMatrix.from(new Float32Array(n * lda), n, k, lda, "row-major");
      const C = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await ssyrk(device, "lower", trans, n, k, 1.0, A, lda, 0.0, C, n);
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await ssyrk(device, "lower", trans, n, k, 1.0, A, lda, 0.0, C, n);
        if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
      }

      A.destroy();
      C.destroy();

      if (times.length === 0) continue;
      const med = median(times);
      const bytes = (n * k + n * n) * 4;
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [trans, pad, n, med, gbs]);
      records.push({ trans, pad, n, compute_ms: med, compute_GBs: gbs });
    }
  }
}

saveResults("ssyrk", gpuModel, records, { folder: "ssyrk", fileName: "lda.ssyrk" });

cleanup();
