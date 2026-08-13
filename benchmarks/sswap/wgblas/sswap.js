import { init, cleanup } from "wgblas";
import { sswap } from "wgblas/sswap";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const STRIDE = 1; // unit stride — coalesced, best case. See stride.sswap.js for incx/incy > 1.
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

for (const n of SIZES) {
  const xGpu = GpuVector.from(randomFloat32Array(n));
  const yGpu = GpuVector.from(randomFloat32Array(n));

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sswap(device, n, xGpu, STRIDE, yGpu, STRIDE);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sswap(device, n, xGpu, STRIDE, yGpu, STRIDE);
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();
  yGpu.destroy();

  if (times.length === 0) continue;
  const med = median(times);
  const bytes = 4 * n * 4; // x read + x written + y read + y written
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("sswap", gpuModel, records, { folder: "sswap" });

cleanup();
