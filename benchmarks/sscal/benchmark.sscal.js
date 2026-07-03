import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
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

// save results to benchmarks/results/<gpuModel>/sscal.wgblas.json
const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const n of SIZES) {
  const alpha = 2.0;
  const xGpu = GpuVector.from(randomFloat32Array(n));

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sscal(device, n, alpha, xGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sscal(device, n, alpha, xGpu, 1);
    times.push(gpuTimeMs);
  }

  xGpu.destroy();

  const med = median(times);
  const bytes = 2 * n * 4; // x read + x written (in-place)
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("sscal", gpuModel, records);

cleanup();
