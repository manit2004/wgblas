import { init, cleanup } from "wgblas";
import { sger } from "wgblas/sger";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
  toColumnMajor,
} from "../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
// Square m=n; max 4096 gives 4096²=16,777,216 total matrix elements ≈ 16.8M (same range as sgemv/ssymv).
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];

const COLS = ["m", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const m = size;
  const n = size;
  const lda = m; // column-major: lda >= m, matching cuBLAS's native layout
  const alpha = 1.0;

  const xGpu = GpuVector.from(randomFloat32Array(m));
  const yGpu = GpuVector.from(randomFloat32Array(n));
  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * n), m, n), m, n, lda, "column-major");

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sger(device, m, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sger(
      device, m, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();
  yGpu.destroy();
  AGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // A read + A write + x read + y read
  const bytes = (2 * m * n + m + n) * 4;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, med, gbs]);
  records.push({ m, n, compute_ms: med, compute_GBs: gbs });
}

saveResults("sger", gpuModel, records);

cleanup();
