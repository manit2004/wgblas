import { init, cleanup } from "wgblas";
import { dger } from "wgblas/dger";
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
// Square m=n; max 4096 gives 4096²=16,777,216 total matrix elements (same as sger's).
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

  const xGpu = GpuVector.from(randomFloat64Array(m));
  const yGpu = GpuVector.from(randomFloat64Array(n));
  const AGpu = GpuMatrix.from(
    toColumnMajor(randomFloat64Array(m * n), m, n),
    m,
    n,
    lda,
    "column-major",
  );

  // warm up — lda tight; see lda.dger.js for the alignment effect. dger has
  // no uplo (general dense rank-1 update).
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await dger(device, m, n, alpha, xGpu, 1, yGpu, 1, AGpu, lda);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await dger(
      device,
      m,
      n,
      alpha,
      xGpu,
      1,
      yGpu,
      1,
      AGpu,
      lda,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();
  yGpu.destroy();
  AGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // A read + A write + x read + y read — 8 bytes/element (double-double).
  const bytes = (2 * m * n + m + n) * 8;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, med, gbs]);
  records.push({ m, n, compute_ms: med, compute_GBs: gbs });
}

saveResults("dger", gpuModel, records, { folder: "dger" });

cleanup();
