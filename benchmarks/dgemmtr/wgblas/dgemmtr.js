import { init, cleanup } from "wgblas";
import { dgemmtr } from "wgblas/dgemmtr";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
  toColumnMajor,
  warmClocks,
} from "../../utils/helpers.mjs";

// Same kernels as dgemm (dgemm_small/dgemm_large), write gated to one
// triangle by uplo; the swept params mirror sgemmtr's (see uplo.dgemmtr.js
// and its siblings). No cuBLAS counterpart — cuBLAS has no gemmt routine —
// so wgblas-only. flops/bytes count the triangle only: the kernels skip
// every tile wholly outside it. Bytes are 8 per element (a hi and a lo f32).
const WARMUP_ITERS = 3;
const BENCH_ITERS = 20;
const SIZES = [32, 64, 128, 256, 512, 1024];

const COLS = ["m", "n", "k", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const m = size,
    n = size,
    k = size;
  // column-major, consistent with sgemm's own benchmark — not for a cuBLAS
  // comparison here (there is none), just so the two remain directly
  // comparable to each other.
  const lda = m,
    ldb = k,
    ldc = m;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(
    toColumnMajor(randomFloat64Array(m * k), m, k),
    m,
    k,
    lda,
    "column-major",
  );
  const BGpu = GpuMatrix.from(
    toColumnMajor(randomFloat64Array(k * n), k, n),
    k,
    n,
    ldb,
    "column-major",
  );
  const CGpu = GpuMatrix.from(
    new Float64Array(m * n),
    m,
    n,
    ldc,
    "column-major",
  );

  // warm up
  await warmClocks(device); // full clocks first — see helpers.mjs
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await dgemmtr(
      device,
      "lower",
      "no-transpose",
      "no-transpose",
      m,
      n,
      k,
      alpha,
      AGpu,
      lda,
      BGpu,
      ldb,
      beta,
      CGpu,
      ldc,
    );
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await dgemmtr(
      device,
      "lower",
      "no-transpose",
      "no-transpose",
      m,
      n,
      k,
      alpha,
      AGpu,
      lda,
      BGpu,
      ldb,
      beta,
      CGpu,
      ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // Useful work (C is square here, m == n): k multiply-adds for each of the
  // n(n+1)/2 elements of the triangle written — what the kernels do, since
  // they skip every tile wholly outside it. (Charging the full 2*m*n*k
  // product reported ~1.9x the real rate, past the card's FMA peak.)
  const flops = n * (n + 1) * k;
  // A read + B read + touched-half-of-C read + touched-half-of-C write
  const bytes = (m * k + k * n + m * n) * 8;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, k, med, gflops, gbs]);
  records.push({
    m,
    n,
    k,
    compute_ms: med,
    compute_GFLOPs: gflops,
    compute_GBs: gbs,
  });
}

saveResults("dgemmtr", gpuModel, records, { folder: "dgemmtr" });

cleanup();
