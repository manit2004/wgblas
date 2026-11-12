import { init, cleanup } from "wgblas";
import { dsyrk } from "wgblas/dsyrk";
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

// Same kernel as dgemmtr (dgemm_small in triangle mode), A
// duplicated into both operand slots; the swept params mirror ssyrk's (see
// trans.dsyrk.js and its siblings). trans="no-transpose" used below to match
// BLAS/cuBLAS convention. Bytes are 8 per element (a hi and a lo f32).
const WARMUP_ITERS = 3;
const BENCH_ITERS = 20;
const SIZES = [32, 64, 128, 256, 512, 1024];

const COLS = ["n", "k", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const n = size,
    k = size;
  // column-major: lda >= rows, matching cuBLAS's native layout
  const lda = n,
    ldc = n;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(
    toColumnMajor(randomFloat64Array(n * k), n, k),
    n,
    k,
    lda,
    "column-major",
  );
  const CGpu = GpuMatrix.from(
    new Float64Array(n * n),
    n,
    n,
    ldc,
    "column-major",
  );

  await warmClocks(device); // full clocks first — see helpers.mjs

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await dsyrk(
      device,
      "lower",
      "no-transpose",
      n,
      k,
      alpha,
      AGpu,
      lda,
      beta,
      CGpu,
      ldc,
    );
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await dsyrk(
      device,
      "lower",
      "no-transpose",
      n,
      k,
      alpha,
      AGpu,
      lda,
      beta,
      CGpu,
      ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // Useful work, the BLAS/LAPACK convention: k multiply-adds for each of the
  // n(n+1)/2 elements of the triangle written — the same count cuBLAS's
  // dsyrk.c charges, and what the kernel does: it skips every tile wholly
  // outside the triangle. (Charging the full 2*n*n*k product reported ~1.9x
  // the real rate, past the card's measured FMA peak.)
  const flops = n * (n + 1) * k;
  // A read (full n*k) + touched-half-of-C read + touched-half-of-C write
  const bytes = (n * k + n * n) * 8;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, k, med, gflops, gbs]);
  records.push({
    n,
    k,
    compute_ms: med,
    compute_GFLOPs: gflops,
    compute_GBs: gbs,
  });
}

saveResults("dsyrk", gpuModel, records, { folder: "dsyrk" });

cleanup();
