import { init, cleanup } from "wgblas";
import { strsm } from "wgblas/strsm";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat32Array, randomTriangularFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
  toColumnMajor,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 30;
// Same dispatch-count-dominated story as strsv.js, generalized to a matrix RHS; scoped non-effects (uplo/side/diag/lda/ldb/transA/otherLen) get no dedicated sweep, per strsv's precedent.
const SIZES = [64, 128, 256, 512, 1024, 2048, 4096];
const OTHER_LEN = 64; // representative matrix-RHS width
const BLOCK_SIZE = 64; // matches strsm.mjs's own BLOCK_SIZE

const COLS = ["order", "numBlocks", "compute_ms", "ms_per_block", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const order = size, n = OTHER_LEN;
  // column-major: lda/ldb >= rows, matching cuBLAS's native layout. B is
  // order x n (side='left'), so its row count is order, not n.
  const lda = order, ldb = order;

  // Well-conditioned diagonal (away from 0) — strsm divides by it via its
  // own block-inversion pass. column-major, matching cuBLAS's native layout.
  const AGpu = GpuMatrix.from(
    toColumnMajor(randomTriangularFloat32Array(order, lda, "lower"), order, order), order, order, lda, "column-major",
  );
  const B = randomFloat32Array(order * n, -10, 10);

  // strsm solves in place, so reset B to the same values before every call.
  let BGpu = null;
  const resetB = () => {
    if (BGpu) BGpu.destroy();
    BGpu = GpuMatrix.from(toColumnMajor(B, order, n), order, n, ldb, "column-major");
  };

  for (let i = 0; i < WARMUP_ITERS; i++) {
    resetB();
    await strsm(device, "left", "lower", "no-transpose", "non-unit", order, n, 1.0, AGpu, lda, BGpu, ldb);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    resetB();
    const { gpuTimeMs } = await strsm(
      device, "left", "lower", "no-transpose", "non-unit", order, n, 1.0, AGpu, lda, BGpu, ldb,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  BGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  const numBlocks = Math.ceil(order / BLOCK_SIZE);
  const msPerBlock = med / numBlocks;
  // lower triangle A read + B read + B write (in place) — coarse, same
  // approximation strsv.js uses, not counting internal scratch traffic.
  const bytes = (order * (order + 1) / 2 + 2 * order * n) * 4;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [order, numBlocks, med, msPerBlock, gbs]);
  records.push({ order, numBlocks, compute_ms: med, ms_per_block: msPerBlock, compute_GBs: gbs });
}

saveResults("strsm", gpuModel, records, { folder: "strsm" });

cleanup();
