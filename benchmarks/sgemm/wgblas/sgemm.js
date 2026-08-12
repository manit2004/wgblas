import { init, cleanup } from "wgblas";
import { sgemm } from "wgblas/sgemm";
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

// O(n^3) compute vs sgemv's O(n^2), so far fewer/smaller sizes and
// iterations than the Level 1/2 benchmarks, to keep total runtime
// reasonable. Uses the autotuned two-tier tiled/register-blocked dispatch
// (sgemm_small/sgemm_large, see those shaders) — trans="no-transpose" for
// both operands and lda/ldb/ldc tight throughout; see trans.sgemm.js for
// the transA/transB effect (transB dominates, transA is small/mixed — an
// asymmetry from B's tile dimension (BN=64) spanning a full warp where
// A's (BK=8) doesn't) and ldb.sgemm.js for the lda/ldb/ldc-padding effect
// (only ldb matters, and only when transB="transpose"). Shape/aspect-ratio
// (m vs n skew) was scoped and found to be shape-robust here, unlike
// sgemv — not swept separately.
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
  // column-major: lda >= rows, matching cuBLAS's native layout
  const lda = m, ldb = k, ldc = m;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * k), m, k), m, k, lda, "column-major");
  const BGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(k * n), k, n), k, n, ldb, "column-major");
  const CGpu = GpuMatrix.from(new Float32Array(m * n), m, n, ldc, "column-major");

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sgemm(device, "no-transpose", "no-transpose", m, n, k, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sgemm(
      device, "no-transpose", "no-transpose", m, n, k, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  // 2*m*n*k multiply-adds, plus 2*m*n for the alpha/beta step
  const flops = 2 * m * n * k + 2 * m * n;
  // A read + B read + C read + C write
  const bytes = (m * k + k * n + 2 * m * n) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, k, med, gflops, gbs]);
  records.push({ m, n, k, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("sgemm", gpuModel, records, { folder: "sgemm" });

cleanup();
