import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
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
// Square matrices m=n; covers sub-tile (m<64), tiled (m>=64) paths.
// Max 1280 gives 1280²=1,638,400 total matrix elements ≈ 1.6M.
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];

const COLS = ["m", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const m = size;
  const n = size;
  const lda = n;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(randomFloat32Array(m * n), m, n, lda);
  const xGpu = GpuVector.from(randomFloat32Array(n));
  const yGpu = GpuVector.from(new Float32Array(m));

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sgemv(device, "no-transpose", m, n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sgemv(
      device, "no-transpose", m, n, alpha, AGpu, lda, xGpu, 1, beta, yGpu, 1,
    );
    times.push(gpuTimeMs);
  }

  AGpu.destroy();
  xGpu.destroy();
  yGpu.destroy();

  const med = median(times);
  // 2*m*n multiply-adds for the dot products, plus 2*m for the alpha/beta step
  const flops = 2 * m * n + 2 * m;
  // A read + x read + y read + y write
  const bytes = (m * n + n + 2 * m) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, med, gflops, gbs]);
  records.push({ m, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("sgemv", gpuModel, records);

cleanup();
