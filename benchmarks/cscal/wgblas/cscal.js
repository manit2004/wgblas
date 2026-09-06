import { init, cleanup } from "wgblas";
import { cscal } from "wgblas/cscal";
import { GpuVector } from "wgblas/classes/GpuVector";
import { Complex32, Complex32Array } from "wgblas/classes/Complex32";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const STRIDE = 1; // unit stride — coalesced, best case. See stride.cscal.js for incx > 1.
const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [
  32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304,
  16777216,
];

const COLS = ["n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

const alpha = new Complex32(2, 3);

for (const n of SIZES) {
  const xGpu = GpuVector.from(new Complex32Array(randomFloat32Array(2 * n)));

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await cscal(device, n, alpha, xGpu, STRIDE);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await cscal(device, n, alpha, xGpu, STRIDE);
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();

  if (times.length === 0) continue;
  const med = median(times);
  const bytes = 2 * n * 8; // x read + x written (in-place); 8 bytes/element (re+im, f32 each)
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("cscal", gpuModel, records, { folder: "cscal" });

cleanup();
