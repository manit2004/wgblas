import { init, cleanup } from "wgblas";
import { dtrsv } from "wgblas/dtrsv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
// Square n×n triangular matrix; lower triangle stored. Blocked solve: each
// 64-row diagonal block is still a genuine sequential dependency (single
// workgroup), but propagating a solved block onto the remaining rows is a
// dense, fully parallel update — see dtrsv_invert_block.wgsl/
// dtrsv_update.wgsl/dtrsv.mjs. That turns n sequential stages into
// ceil(n/64), same shape as strsv.js's own story, now at DD precision.
//
// Unlike every other Level 2 routine here, strsv/dtrsv's dominant
// performance story isn't uplo/trans/lda — it's dispatch-count overhead:
// each block is 3 sequential GPU dispatches (invert + apply + update, one
// more than strsv's 2 since the inverse can't be precomputed on the CPU at
// DD precision), so total time is bound by fixed per-dispatch overhead at
// small n and by growing per-block update work at large n. numBlocks and
// ms_per_block below make that curve directly visible. Measured (not
// assumed): ms_per_block grows from 0.084ms (n=32, 1 block) to 0.128ms
// (n=4096, 64 blocks) — a ~1.5x rise, confirming the per-block cost isn't
// flat but grows as each later block's "update" pass covers more remaining
// rows.
const SIZES = [32, 64, 128, 256, 512, 1024, 2048, 4096];
const BLOCK_SIZE = 64; // matches dtrsv.mjs's own BLOCK_SIZE

const COLS = ["n", "numBlocks", "compute_ms", "ms_per_block", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

// Diagonally dominant so the triangular solve stays well conditioned across sizes.
function triangular(n, lda) {
  const a = randomFloat64Array(n * lda);
  for (let i = 0; i < n; i++) a[i * lda + i] = 8 + n;
  return a;
}

printHeader(COLS);

for (const size of SIZES) {
  const n = size;
  const lda = n;

  // 8 bytes/element (double-double), not 4 — see dtrsv_invert_block.wgsl.
  const bytesA = n * lda * 8;
  if (bytesA > device.limits.maxStorageBufferBindingSize) {
    console.log(
      `  (skipped n=${n}: A would exceed maxStorageBufferBindingSize)`,
    );
    continue;
  }

  const AGpu = GpuMatrix.from(triangular(n, lda), n, n, lda, "row-major");
  const b = randomFloat64Array(n);

  // dtrsv solves in place, so reset x to b before every call, or later
  // iterations solve using drifted-toward-0 leftovers from earlier ones.
  // GpuVector has no COPY_DST usage, so writeBuffer can't target it —
  // destroy+recreate instead, before the timed dtrsv call.
  let xGpu = null;
  const resetX = () => {
    if (xGpu) xGpu.destroy();
    xGpu = GpuVector.from(b);
  };

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    resetX();
    await dtrsv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      n,
      AGpu,
      lda,
      xGpu,
      1,
    );
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    resetX();
    const { gpuTimeMs } = await dtrsv(
      device,
      "lower",
      "no-transpose",
      "non-unit",
      n,
      AGpu,
      lda,
      xGpu,
      1,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  AGpu.destroy();
  xGpu.destroy();

  if (times.length === 0) continue;

  const med = median(times);
  const numBlocks = Math.ceil(n / BLOCK_SIZE);
  const msPerBlock = med / numBlocks;
  // lower triangle A read + x read + x write (in place) — 8 bytes/element
  const bytes = ((n * (n + 1)) / 2 + n + n) * 8;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, numBlocks, med, msPerBlock, gbs]);
  records.push({
    n,
    numBlocks,
    compute_ms: med,
    ms_per_block: msPerBlock,
    compute_GBs: gbs,
  });
}

saveResults("dtrsv", gpuModel, records, { folder: "dtrsv" });

cleanup();
