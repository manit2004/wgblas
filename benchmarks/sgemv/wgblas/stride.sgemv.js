// Stride sweep — sgemv.js is entirely incx=incy=1 (coalesced, best case).
// Real BLAS usage hits non-unit stride whenever x/y are rows/columns of a
// larger matrix, so this characterizes that cost separately, at the same
// square shapes sgemv.js uses. trans stays "no-transpose" and lda stays
// tight — trans is covered by trans.sgemv.js, and lda padding was checked
// there too and found to have no measurable effect.
//
// {4, 32, 256} are the same representative strides used across the Level 1
// sweeps — stride=1 itself is covered by sgemv.js, not repeated here.

import { init, cleanup } from "wgblas";
import { sgemv } from "wgblas/sgemv";
import { GpuVector } from "wgblas/classes/GpuVector";
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

const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];
const STRIDES = [4, 32, 256];

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

    // A itself isn't strided (only x/y are) — check the largest buffer of
    // the three against the same limit the Level 1 stride sweeps check.
    const bytesA = m * n * 4;
    const bytesX = n * stride * 4;
    const bytesY = m * stride * 4;
    const maxBytes = Math.max(bytesA, bytesX, bytesY);
    if (maxBytes > device.limits.maxStorageBufferBindingSize) {
      console.log(`  (skipped stride=${stride}, m=${m}, n=${n}: a buffer would exceed maxStorageBufferBindingSize)`);
      continue;
    }

    const AGpu = GpuMatrix.from(toColumnMajor(randomFloat32Array(m * n), m, n), m, n, lda, "column-major");
    const xGpu = GpuVector.from(randomFloat32Array(n * stride));
    const yGpu = GpuVector.from(new Float32Array(m * stride));

    for (let i = 0; i < WARMUP_ITERS; i++) {
      await sgemv(device, "no-transpose", m, n, alpha, AGpu, lda, xGpu, stride, beta, yGpu, stride);
    }

    const times = [];
    for (let i = 0; i < BENCH_ITERS; i++) {
      const { gpuTimeMs } = await sgemv(
        device, "no-transpose", m, n, alpha, AGpu, lda, xGpu, stride, beta, yGpu, stride,
      );
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }

    AGpu.destroy();
    xGpu.destroy();
    yGpu.destroy();

    if (times.length === 0) continue;

    const med = median(times);
    // A read + x read + y read + y write — logical elements touched, same regardless of stride
    const bytes = (m * n + n + 2 * m) * 4;
    const gbs = bytes / 1e9 / (med / 1e3);
    printRow(COLS, [stride, m, n, med, gbs]);
    records.push({ stride, m, n, compute_ms: med, compute_GBs: gbs });
  }
}

saveResults("sgemv", gpuModel, records, { folder: "sgemv", fileName: "stride.sgemv" });

cleanup();
