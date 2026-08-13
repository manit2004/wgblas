import { init, cleanup } from "wgblas";
import { strsv } from "wgblas/strsv";
import { GpuVector } from "wgblas/classes/GpuVector";
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
const BENCH_ITERS = 100;
// Square n×n triangular matrix; lower triangle stored. Blocked solve: each
// 64-row diagonal block is still a genuine sequential dependency (single
// workgroup, like strmv is NOT), but propagating a solved block onto the
// remaining rows is a dense, fully parallel update (same shape as strmv) —
// see strsv_block.wgsl/strsv_update.wgsl/strsv.mjs. That turns n sequential
// stages into ceil(n/64), so this scales to the same sizes strmv does.
//
// Unlike every other Level 2 routine here, strsv's dominant performance
// story isn't uplo/trans/lda — it's dispatch-count overhead: each block is
// ~2 sequential GPU dispatches (apply + update), so total time is bound by
// fixed per-dispatch overhead at small n and by growing per-block update
// work at large n. numBlocks and ms_per_block below make that curve
// directly visible instead of requiring the reader to derive it. uplo was
// scoped and found to be a minor effect (~2-4%, matches strmv); trans is
// real but modest (~1.2-1.3x, diluted since it only affects the "update"
// pass, a fraction of total dispatch-dominated time); lda (no-transpose)
// and diag are both confirmed non-effects — none of the four are swept as
// separate files, since they're not the story here.
const SIZES = [32, 64, 128, 256, 512, 1024, 2048, 4096];
const BLOCK_SIZE = 64; // matches strsv.mjs's own BLOCK_SIZE

const COLS = ["n", "numBlocks", "compute_ms", "ms_per_block", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const size of SIZES) {
  const n = size;
  const lda = n;

  // Well-conditioned diagonal (away from 0) — strsv divides by it. Generated
  // row-major then transposed to genuine column-major storage of the same
  // logical (still well-conditioned, still lower-triangular) matrix.
  const AGpu = GpuMatrix.from(
    toColumnMajor(randomTriangularFloat32Array(n, lda, "lower"), n, n), n, n, lda, "column-major",
  );
  const b = randomFloat32Array(n);

  // strsv solves in place, so reset x to b before every call, or later
  // iterations solve using drifted-toward-0 leftovers from earlier ones.
  // GpuVector has no COPY_DST usage, so writeBuffer can't target it —
  // destroy+recreate instead, before the timed strsv call.
  let xGpu = null;
  const resetX = () => {
    if (xGpu) xGpu.destroy();
    xGpu = GpuVector.from(b);
  };

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    resetX();
    await strsv(device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, 1);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    resetX();
    const { gpuTimeMs } = await strsv(
      device, "lower", "no-transpose", "non-unit", n, AGpu, lda, xGpu, 1,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  xGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  const numBlocks = Math.ceil(n / BLOCK_SIZE);
  const msPerBlock = med / numBlocks;
  // lower triangle A read + x read + x write (in place)
  const bytes = (n * (n + 1) / 2 + n + n) * 4;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, numBlocks, med, msPerBlock, gbs]);
  records.push({ n, numBlocks, compute_ms: med, ms_per_block: msPerBlock, compute_GBs: gbs });
}

saveResults("strsv", gpuModel, records, { folder: "strsv" });

cleanup();
