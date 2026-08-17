import { init, cleanup } from "wgblas";
import { strmm } from "wgblas/strmm";
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

// Two-pass pipeline: triangularize (zero-fill op(A)) then an unmodified
// sgemm pass, plus a seed copy (B -> outBuffer, preserves stride-padding
// gaps). uplo/side/transA/diag/A's lda all scoped as non-effects
// (temp/scope_strmm.mjs); the gemm pass's ldb/layout behavior is sgemm's
// own, unswept here — see ldb.sgemm.js/trans.sgemm.js.
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
  // column-major: lda/ldb >= rows, matching cuBLAS's native layout
  const lda = m, ldb = m;
  const alpha = 1.0;

  const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * lda), m, m), m, m, lda, "column-major");
  const BGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * n), m, n), m, n, ldb, "column-major");

  for (let i = 0; i < WARMUP_ITERS; i++) {
    await strmm(device, "left", "lower", "no-transpose", "non-unit", m, n, alpha, AGpu, lda, BGpu, ldb);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await strmm(
      device, "left", "lower", "no-transpose", "non-unit", m, n, alpha, AGpu, lda, BGpu, ldb,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  const aOrder = m; // side='left'
  // gemm-shaped 2*m*n*aOrder multiply-adds, plus m*n for the alpha scale
  // (no beta term — strmm has no C accumulation).
  const flops = 2 * m * n * aOrder + m * n;
  // triangularize: A read + Adense write (2*aOrder^2); seed copy: B read +
  // outBuffer write (2*m*n); gemm: Adense re-read (aOrder^2) + B read +
  // outBuffer read (beta term) + outBuffer write (3*m*n)
  const bytes = (3 * aOrder * aOrder + 5 * m * n) * 4;
  const gflops = flops / 1e9 / (med / 1e3);
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [m, n, med, gflops, gbs]);
  records.push({ m, n, compute_ms: med, compute_GFLOPs: gflops, compute_GBs: gbs });
}

saveResults("strmm", gpuModel, records, { folder: "strmm" });

cleanup();
