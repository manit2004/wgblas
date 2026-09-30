// Stride sweep — dgemv.js is entirely incx=incy=1 (coalesced, best case).
// Real BLAS usage hits non-unit stride whenever x/y are rows/columns of a
// larger matrix, so this characterizes that cost separately, at the same
// square shapes dgemv.js uses. trans stays "no-transpose" and lda stays
// tight — trans is covered by trans.dgemv.js.
//
// Strides are the same set the Level 1 sweeps use (see stride.dscal.js).
// stride=1 itself is covered by dgemv.js, not repeated here.

import { init, cleanup } from "wgblas";
import { dgemv } from "wgblas/dgemv";
import { GpuVector } from "wgblas/classes/GpuVector";
import { GpuMatrix } from "wgblas/classes/GpuMatrix";
import { randomFloat64Array } from "wgblas/random";
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
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
// Three magnitudes, each paired with an odd neighbour: the gap inside a pair is
// misalignment alone (~0% at 4, ~9% by 32). 255 not 257, to fit where 256 fits.
const STRIDES = [4, 5, 32, 33, 255, 256];

const COLS = ["stride", "m", "n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

for (const stride of STRIDES) {
  for (const size of SIZES) {
    const m = size;
    const n = size;
    const lda = m; // column-major: lda >= m, matching cuBLAS's native layout
    const alpha = 1.0;
    const beta = 0.0;

    // A itself isn't strided (only x/y are) — 8 bytes/element (double-double).
    const bytesA = m * n * 8;
    const bytesX = n * stride * 8;
    const bytesY = m * stride * 8;
    const maxBytes = Math.max(bytesA, bytesX, bytesY);
    if (maxBytes > device.limits.maxStorageBufferBindingSize) {
      console.log(
        `  (skipped stride=${stride}, m=${m}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`,
      );
      continue;
    }

    const AGpu = GpuMatrix.from(
      toColumnMajor(randomFloat64Array(m * n), m, n),
      m,
      n,
      lda,
      "column-major",
    );
    const xGpu = GpuVector.from(randomFloat64Array(n * stride));
    const yGpu = GpuVector.from(new Float64Array(m * stride));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await dgemv(
        device,
        "no-transpose",
        m,
        n,
        alpha,
        AGpu,
        lda,
        xGpu,
        stride,
        beta,
        yGpu,
        stride,
      );
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await dgemv(
        device,
        "no-transpose",
        m,
        n,
        alpha,
        AGpu,
        lda,
        xGpu,
        stride,
        beta,
        yGpu,
        stride,
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;

    const med = median(times);
    // A read + x read + y read + y write — 8 bytes/element, same regardless of stride
    const bytes = (m * n + n + 2 * m) * 8;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [stride, m, n, med, gbs]);
    records.push({ stride, m, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("dgemv", gpuModel, records, {
  folder: "dgemv",
  fileName: "stride.dgemv",
});

cleanup();
