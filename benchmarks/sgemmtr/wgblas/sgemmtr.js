import { init, cleanup } from "wgblas";
import { sgemmtr } from "wgblas/sgemmtr";
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

// Same kernels as sgemm, write gated to one triangle by uplo — a confirmed
// non-effect (see temp/scope_sgemmtr.mjs); other params inherited from
// sgemm's own scoping (trans.sgemm.js/ldb.sgemm.js). No cuBLAS counterpart —
// cuBLAS has no gemmt routine — so wgblas-only. flops/bytes reflect actual
// work: full compute regardless of uplo, but only half of C's traffic.
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
  const m = size, n = size, k = size;
  // column-major, consistent with sgemm's own benchmark — not for a cuBLAS
  // comparison here (there is none), just so the two remain directly
  // comparable to each other.
  const lda = m, ldb = k, ldc = m;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * k), m, k), m, k, lda, "column-major");
  const BGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(k * n), k, n), k, n, ldb, "column-major");
  const CGpu = GpuMatrix.from(new Float32Array(m * n), m, n, ldc, "column-major");

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sgemmtr(device, "lower", "no-transpose", "no-transpose", m, n, k, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sgemmtr(
      device, "lower", "no-transpose", "no-transpose", m, n, k, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // Full tile compute regardless of uplo (see header comment) — same cost
  // as sgemm's 2*m*n*k, plus the alpha/beta step only for the ~half of C
  // that's actually touched.
  const flops = 2 * m * n * k + m * n;
  // A read + B read + touched-half-of-C read + touched-half-of-C write
  const bytes = (m * k + k * n + m * n) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, k, med, gflops, gbs]);
  records.push({ m, n, k, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("sgemmtr", gpuModel, records, { folder: "sgemmtr" });

cleanup();
