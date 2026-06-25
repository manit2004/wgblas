import { init, cleanup } from "wgblas";
import { isamax } from "wgblas/isamax";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/util/random";
import { median, printHeader, printRow, getGpuModel, saveResults } from "../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS  = 100;
const SIZES = [32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216];

const COLS = ["n", "compute_ms", "compute_GBs"];

await init({ benchmark: true });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const n of SIZES) {
  const xGpu = GpuVector.from(randomFloat32Array(n));

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await isamax(n, xGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await isamax(n, xGpu, 1);
    times.push(gpuTimeMs);
  }

  xGpu.destroy();

  const med = median(times);
  const bytes = n * 4; // x read only
  const gbs = (bytes / 1e9) / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("isamax", gpuModel, records);

cleanup();
