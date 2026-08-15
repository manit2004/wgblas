import { init, cleanup } from "wgblas";
import { ssyrk } from "wgblas/ssyrk";
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

// Same kernel as sgemmtr (A duplicated into both operand slots). uplo is a
// confirmed non-effect; trans and lda are real but coupled — see
// trans.ssyrk.js/lda.ssyrk.js and temp/scope_ssyrk.mjs. trans="no-transpose"
// used below to match BLAS/cuBLAS convention, despite being the slower one.
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
  const lda = n, ldc = n;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(n * k), n, k), n, k, lda, "column-major");
  const CGpu = GpuMatrix.from(new Float32Array(n * n), n, n, ldc, "column-major");

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await ssyrk(device, "lower", "no-transpose", n, k, alpha, AGpu, lda, beta, CGpu, ldc);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await ssyrk(
      device, "lower", "no-transpose", n, k, alpha, AGpu, lda, beta, CGpu, ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // Full compute regardless of uplo (see header comment) — same cost as
  // gemm's 2*n*n*k, plus the alpha/beta step for the ~half of C touched.
  const flops = 2 * n * n * k + n * n;
  // A read (full n*k) + touched-half-of-C read + touched-half-of-C write
  const bytes = (n * k + n * n) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, k, med, gflops, gbs]);
  records.push({ n, k, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("ssyrk", gpuModel, records, { folder: "ssyrk" });

cleanup();
