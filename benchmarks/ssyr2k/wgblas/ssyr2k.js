import { init, cleanup } from "wgblas";
import { ssyr2k } from "wgblas/ssyr2k";
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

// Two sgemmtr passes per call (see ssyr2k.mjs). uplo is a confirmed
// non-effect; trans and lda/ldb are real but coupled (lda and ldb behave
// identically — the two-pass design treats them symmetrically) — see
// trans.ssyr2k.js/lda.ssyr2k.js and temp/scope_ssyr2k.mjs. trans="no-
// transpose" used below to match BLAS/cuBLAS convention, despite being the
// slower choice.
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
  const n = size, k = size;
  // column-major: lda >= rows, matching cuBLAS's native layout
  const lda = n, ldb = n, ldc = n;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(n * k), n, k), n, k, lda, "column-major");
  const BGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(n * k), n, k), n, k, ldb, "column-major");
  const CGpu = GpuMatrix.from(new Float32Array(n * n), n, n, ldc, "column-major");

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await ssyr2k(device, "lower", "no-transpose", n, k, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await ssyr2k(
      device, "lower", "no-transpose", n, k, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // Two full-tile passes regardless of uplo (see header comment) — 2x
  // sgemmtr's 2*n*n*k FMA cost, plus the alpha/beta step for the touched
  // half of C (only paid once, on the first pass's beta*C read).
  const flops = 2 * (2 * n * n * k) + n * n;
  // A read + B read (both full, once each) + touched-half-of-C read + write
  const bytes = (n * k + n * k + n * n) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, k, med, gflops, gbs]);
  records.push({ n, k, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("ssyr2k", gpuModel, records, { folder: "ssyr2k" });

cleanup();
