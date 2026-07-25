import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array, randomTriangularFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
// Square n×n triangular matrix; lower triangle stored. Unlike strmv (one
// workgroup per row, fully parallel), strsv always dispatches a SINGLE
// workgroup regardless of n (each row depends on the previous — see
// strsv.wgsl), so it doesn't scale down to more parallelism at large n.
// Sizes are capped well below strmv's 4096 to keep the benchmark practical.
const SIZES = [32, 64, 128, 256, 512, 1024, 2048];

const COLS = ["n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const n = size;
  const lda = n;

  // Well-conditioned diagonal (away from 0) — strsv divides by it.
  const AGpu = GpuMatrix.from(randomTriangularFloat32Array(n, lda, "lower"), n, n, lda);
  const xGpu = GpuVector.from(randomFloat32Array(n));

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await strsv(device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await strsv(
      device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, 1,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  xGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // lower triangle A read + x read + x write (in place)
  const bytes = (n * (n + 1) / 2 + n + n) * 4;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("strsv", gpuModel, records);

cleanup();
