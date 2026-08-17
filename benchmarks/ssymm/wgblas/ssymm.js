import { init, cleanup } from "wgblas";
import { ssymm } from "wgblas/ssymm";
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

// Two-pass pipeline: symmetrize (dense-expand A) then an unmodified sgemm
// pass. uplo/side/A's lda scoped as non-effects (temp/scope_ssymm.mjs); the
// gemm pass's ldb/ldc/layout behavior is sgemm's own, unswept here — see
// ldb.sgemm.js/trans.sgemm.js.
const WARMUP_ITERS = 3;
const BENCH_ITERS = 20;
const SIZES = [32, 64, 128, 256, 512, 1024];

const COLS = ["m", "n", "compute_ms", "compute_GFLOPs", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const m = size, n = size; // square: aOrder (side='left') = m = n
  // column-major: lda/ldb/ldc >= rows, matching cuBLAS's native layout
  const lda = m, ldb = m, ldc = m;
  const alpha = 1.0;
  const beta = 0.0;

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * lda), m, m), m, m, lda, "column-major");
  const BGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * n), m, n), m, n, ldb, "column-major");
  const CGpu = GpuMatrix.from(new Float32Array(m * n), m, n, ldc, "column-major");

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await ssymm(device, "left", "lower", m, n, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await ssymm(
      device, "left", "lower", m, n, alpha, AGpu, lda, BGpu, ldb, beta, CGpu, ldc,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();
  CGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  const aOrder = m; // side='left'
  // gemm-shaped 2*m*n*aOrder multiply-adds, plus 2*m*n for the alpha/beta step
  const flops = 2 * m * n * aOrder + 2 * m * n;
  // symmetrize: A read + Adense write (both aOrder^2); gemm: Adense re-read
  // (aOrder^2) + B read (m*n) + C read + C write (2*m*n)
  const bytes = (3 * aOrder * aOrder + 3 * m * n) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, med, gflops, gbs]);
  records.push({ m, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("ssymm", gpuModel, records, { folder: "ssymm" });

cleanup();
