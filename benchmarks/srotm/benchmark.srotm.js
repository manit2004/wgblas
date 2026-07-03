import { init, cleanup } from "wgblas";
import { srotm } from "wgblas/srotm";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../utils/helpers.mjs";

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

// flag=-1: full 2x2 H matrix  [[0.6, 0.8], [-0.8, 0.6]]
const param = new Float32Array([-1, 0.6, -0.8, 0.8, 0.6]);

for (const n of SIZES) {
  const xGpu = GpuVector.from(randomFloat32Array(n));
  const yGpu = GpuVector.from(randomFloat32Array(n));

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await srotm(device, n, xGpu, 1, yGpu, 1, param);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await srotm(device, n, xGpu, 1, yGpu, 1, param);
    times.push(gpuTimeMs);
  }

  xGpu.destroy();
  yGpu.destroy();

  const med = median(times);
  const bytes = 4 * n * 4; // x read + x written + y read + y written (param is 5 floats, negligible)
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("srotm", gpuModel, records);

cleanup();
