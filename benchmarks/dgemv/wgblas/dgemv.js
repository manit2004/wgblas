import { init, cleanup } from "wgblas";
import { dgemv } from "wgblas/dgemv";
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

const STRIDE = 1; // unit stride — coalesced, best case. See stride.dgemv.js for incx/incy > 1.
const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
// Square matrices m=n; covers sub-tile (m<64), tiled (m>=64) paths. Same size range as sgemv's own.
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
  const beta = 0.0;

  const AGpu = GpuMatrix.from(
    toColumnMajor(randomFloat64Array(m * n), m, n),
    m,
    n,
    lda,
    "column-major",
  );
  const xGpu = GpuVector.from(randomFloat64Array(n));
  const yGpu = GpuVector.from(new Float64Array(m));

  // warm up — trans="no-transpose" only; see trans.dgemv.js for
  // trans="transpose" and its aspect-ratio sensitivity.
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await dgemv(
      device,
      "no-transpose",
      m,
      n,
      alpha,
      AGpu,
      lda,
      xGpu,
      STRIDE,
      beta,
      yGpu,
      STRIDE,
    );
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await dgemv(
      device,
      "no-transpose",
      m,
      n,
      alpha,
      AGpu,
      lda,
      xGpu,
      STRIDE,
      beta,
      yGpu,
      STRIDE,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  xGpu.destroy();
  yGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // A read + x read + y read + y write — 8 bytes/element (double-double).
  const bytes = (m * n + n + 2 * m) * 8;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, med, gbs]);
  records.push({ m, n, compute_ms: med, compute_GBs: gbs });
}

saveResults("dgemv", gpuModel, records, { folder: "dgemv" });

cleanup();
