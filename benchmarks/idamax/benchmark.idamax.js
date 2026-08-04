import { init, cleanup } from "wgblas";
import { idamax } from "wgblas/idamax";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat64Array } from "wgblas/random";
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

for (const n of SIZES) {
  const xGpu = GpuVector.from(randomFloat64Array(n));

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await idamax(device, n, xGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await idamax(device, n, xGpu, 1);
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();

  if (times.length === 0) continue;
  const med = median(times);
  // x read only, but emulated as double-double (hi, lo) f32 pairs — 8 bytes/element,
  // matching the memory traffic a real f64 buffer of the same length would need.
  const bytes = n * 8;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("idamax", gpuModel, records);

cleanup();
