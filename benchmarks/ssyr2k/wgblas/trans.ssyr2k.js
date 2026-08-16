// trans sweep — ssyr2k.js is entirely trans="no-transpose". `trans` couples
// both internal passes the same way ssyrk's single trans does (both passes
// share it), so trans="transpose" is ~1.4x FASTER, same direction/magnitude
// as ssyrk's finding. See temp/scope_ssyr2k.mjs.

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
const SIZES = [256, 512, 1024, 2048];
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
    const k = n;
    const A = GpuMatrix.from(new Float32Array(n * k), n, k, k, "row-major");
    const B = GpuMatrix.from(new Float32Array(n * k), n, k, k, "row-major");
    const C = GpuMatrix.from(new Float32Array(n * n), n, n, n, "row-major");

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await ssyr2k(device, "lower", trans, n, k, 1.0, A, k, B, k, 0.0, C, n);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await ssyr2k(device, "lower", trans, n, k, 1.0, A, k, B, k, 0.0, C, n);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    A.destroy();
    B.destroy();
    C.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = (n * k + n * k + n * n) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [trans, n, med, gbs]);
    records.push({ trans, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("ssyr2k", gpuModel, records, { folder: "ssyr2k", fileName: "trans.ssyr2k" });

cleanup();
