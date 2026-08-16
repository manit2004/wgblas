// lda sweep — ssyr2k.js is entirely tight lda/ldb. lda and ldb behave
// identically (the two-pass design treats them symmetrically — see
// temp/scope_ssyr2k.mjs, which swept them independently and found the same
// numbers either way), so this sweeps both together rather than separately.
// Only matters for trans="no-transpose"; flat for trans="transpose" —
// same mechanism as ssyrk's lda finding.

import { init, cleanup } from "wgblas";
import { ssyr2k } from "wgblas/ssyr2k";
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
      const lda = k + pad, ldb = k + pad;
      const bytesA = n * lda * 4;
      if (bytesA > device.limits.maxStorageBufferBindingSize) {
        console.log(`  (skipped trans=${trans} pad=${pad}, n=${n}: A would exceed maxStorageBufferBindingSize)`);
        continue;
      }

      const A = GpuMatrix.from(new Float32Array(n * lda), n, k, lda, "row-major");
      const B = GpuMatrix.from(new Float32Array(n * ldb), n, k, ldb, "row-major");
      const C = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

      for (let i = 0; i < WARMUP_ITERS; i++) {
        await ssyr2k(device, "lower", trans, n, k, 1.0, A, lda, B, ldb, 0.0, C, n);
      }

      const times = [];
      for (let i = 0; i < BENCH_ITERS; i++) {
        const { gpuTimeMs } = await ssyr2k(device, "lower", trans, n, k, 1.0, A, lda, B, ldb, 0.0, C, n);
        if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
      }

      A.destroy();
      B.destroy();
      C.destroy();

      if (times.length === 0) continue;
      const med = median(times);
      const bytes = (n * k + n * k + n * n) * 4;
      const gbs = bytes / 1e9 / (med / 1e3);
      printRow(COLS, [trans, pad, n, med, gbs]);
      records.push({ trans, pad, n, compute_ms: med, compute_GBs: gbs });
    }
  }
}

saveResults("ssyr2k", gpuModel, records, { folder: "ssyr2k", fileName: "lda.ssyr2k" });

cleanup();
