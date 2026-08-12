import { init, cleanup } from "wgblas";
import { strmv } from "wgblas/strmv";
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
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
// Square n×n triangular matrix; lower triangle stored.
// Max 4096 gives 4096²=16,777,216 total elements ≈ 16.8M (same range as ssymv).
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

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(n * n), n, n), n, n, lda, "column-major");
  const xGpu = GpuVector.from(randomFloat32Array(n));
  const yGpu = GpuVector.from(new Float32Array(n));

  // warm up — trans="no-transpose", uplo="lower", diag="non-unit", lda tight.
  // See trans.strmv.js (dominant effect, grows with n) and lda.strmv.js
  // (real, but only for transpose). uplo and diag were scoped and found
  // to be non-effects — not swept separately.
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await strmv(device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, 1, yGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await strmv(
      device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, 1, yGpu, 1,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  xGpu.destroy();
  yGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // lower triangle A read + x read + y write
  const bytes = (n * (n + 1) / 2 + n + n) * 4;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("strmv", gpuModel, records, { folder: "strmv" });

cleanup();
