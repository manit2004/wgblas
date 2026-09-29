import { init, cleanup } from "wgblas";
import { dsyr } from "wgblas/dsyr";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
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
// Square n×n symmetric matrix; lower triangle stored. Same size range as ssyr's own.
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

  const xGpu = GpuVector.from(randomFloat64Array(n));
  const AGpu = GpuMatrix.from(
    toColumnMajor(randomFloat64Array(n * n), n, n),
    n,
    n,
    lda,
    "column-major",
  );

  // warm up — uplo="lower", lda tight; see uplo.dsyr.js (no real effect,
  // unlike ssyr) and lda.dsyr.js (a real but gradual ~2x decline as pad
  // grows, not ssyr's sharp 128-byte-boundary split).
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await dsyr(device, "lower", n, alpha, xGpu, 1, AGpu, lda);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await dsyr(
      device,
      "lower",
      n,
      alpha,
      xGpu,
      1,
      AGpu,
      lda,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();
  AGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // lower triangle A read + A write + x read — 8 bytes/element (double-double).
  const bytes = (n * (n + 1) + n) * 8;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("dsyr", gpuModel, records, { folder: "dsyr" });

cleanup();
