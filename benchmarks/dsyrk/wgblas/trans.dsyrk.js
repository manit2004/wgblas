// trans sweep — dsyrk.js is entirely trans="no-transpose". `trans` flips
// both operand roles at once here (B := A); for ssyrk that made
// trans="transpose" ~1.4-1.5x faster, while dgemm measured its trans axes
// flat (the DD barriers dominate).

import { init, cleanup } from "wgblas";
import { dsyrk } from "wgblas/dsyrk";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
  warmClocks,
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
    const A = GpuMatrix.from(new Float64Array(n * k), n, k, k, "row-major");
    const C = GpuMatrix.from(new Float64Array(n * n), n, n, n, "row-major");

    await warmClocks(device); // full clocks first — see helpers.mjs

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dsyrk(device, "lower", trans, n, k, 1.0, A, k, 0.0, C, n);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dsyrk(
        device,
        "lower",
        trans,
        n,
        k,
        1.0,
        A,
        k,
        0.0,
        C,
        n,
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    A.destroy();
    C.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = (n * k + n * n) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [trans, n, med, gbs]);
    records.push({ trans, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dsyrk", gpuModel, records, {
  folder: "dsyrk",
  fileName: "trans.dsyrk",
});

cleanup();
