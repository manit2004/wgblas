import { init, cleanup } from "wgblas";
import { ssyr2 } from "wgblas/ssyr2";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
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
// Square n×n symmetric matrix; lower triangle stored.
// Max 4096 gives 4096²=16,777,216 total elements ≈ 16.8M (same range as ssyr/ssymv).
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];

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
  const alpha = 1.0;

  const xGpu = GpuVector.from(randomFloat32Array(n));
  const yGpu = GpuVector.from(randomFloat32Array(n));
  const AGpu = GpuMatrix.from(randomFloat32Array(n * n), n, n, lda);

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await ssyr2(device, "lower", n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await ssyr2(
      device, "lower", n, alpha, xGpu, 1, yGpu, 1, AGpu, lda,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();
  yGpu.destroy();
  AGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // lower triangle A read + A write + x read + y read
  const bytes = (n * (n + 1) + 2 * n) * 4;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("ssyr2", gpuModel, records);

cleanup();
