// Stride sweep — sasum.js is entirely incx=1 (coalesced, best case).
// Real BLAS usage hits non-unit stride whenever a Level 1 op runs on a
// row/column of a larger matrix (incx = lda), so this characterizes that
// cost separately rather than folding it into the main sweep and
// multiplying its already-large runtime by every stride value.
//
// 4/32/256 are one representative point from each distinct regime of the
// coalescing-breakdown curve (steep 1/stride falloff, transition, plateau);
// 5/33/255 pair each of those with an odd neighbour, isolating the cost of
// misalignment from the cost of stride magnitude.
//
// stride=1 itself is covered by sasum.js, not repeated here.

import { init, cleanup } from "wgblas";
import { sasum } from "wgblas/sasum";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat32Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [
  32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304,
  16777216,
];
// Three magnitudes, each paired with an odd neighbour: the gap inside a pair is
// misalignment alone (~0% at 4, ~9% by 32). 255 not 257, to fit where 256 fits.
const STRIDES = [4, 5, 32, 33, 255, 256];

const COLS = ["stride", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const stride of STRIDES) {
  for (const n of SIZES) {
    if (stride > n) continue; // stride itself already exceeds n — not a meaningful case

    // maxBufferSize is the general buffer-creation limit; the one actually
    // enforced for a storage buffer binding (what GpuVector uses) is the
    // smaller maxStorageBufferBindingSize — confirmed empirically (this
    // device reports 256MB for the former, 128MB for the latter).
    const bytesPerBuffer = n * stride * 4;
    if (bytesPerBuffer > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped stride=${stride}, n=${n}: buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const xGpu = GpuVector.from(randomFloat32Array(n * stride));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await sasum(device, n, xGpu, stride);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await sasum(device, n, xGpu, stride);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    xGpu.destroy();

    if (times.length === 0) continue;
    const med = median(times);
    const bytes = n * 4; // logical elements touched, same regardless of stride
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [stride, n, med, gbs]);
    records.push({ stride, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("sasum", gpuModel, records, { folder: "sasum", fileName: "stride.sasum" });

cleanup();
