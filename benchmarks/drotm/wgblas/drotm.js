import { init, cleanup } from "wgblas";
import { drotm } from "wgblas/drotm";
import { GpuVector } from "wgblas/classes/GpuVector";
import { randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  getGpuModel,
  saveResults,
} from "../../utils/helpers.mjs";

const STRIDE = 1; // unit stride — coalesced, best case. See stride.drotm.js for incx/incy > 1.
// flag = -2.0 (identity H) is not swept here: drotm.mjs returns before any
// GPU dispatch in that case, so timing is ~flat JS-return overhead, not a
// throughput number — not representative of this sweep's n-dependent shape.
const WARMUP_ITERS = 5;
const BENCH_ITERS = 100;
const SIZES = [
  32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304,
  16777216,
];

const COLS = ["n", "compute_ms", "compute_GBs"];

const powerPreference =
  process.argv[2] === "low-power" ? "low-power" : "high-performance";
const device = await init({ benchmark: true, powerPreference });

const gpuModel = getGpuModel();
const records = [];

printHeader(COLS);

// flag=-1: full 2x2 H matrix  [[0.6, 0.8], [-0.8, 0.6]]
const param = new Float64Array([-1, 0.6, -0.8, 0.8, 0.6]);

for (const n of SIZES) {
  const xGpu = GpuVector.from(randomFloat64Array(n));
  const yGpu = GpuVector.from(randomFloat64Array(n));

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await drotm(device, n, xGpu, STRIDE, yGpu, STRIDE, param);
  }

  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await drotm(
      device,
      n,
      xGpu,
      STRIDE,
      yGpu,
      STRIDE,
      param,
    );
    if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
  }

  xGpu.destroy();
  yGpu.destroy();

  if (times.length === 0) continue;
  const med = median(times);
  // x read + x written + y read + y written, double-double (hi, lo) f32
  // pairs — 8 bytes/element (param is 5 double-doubles, negligible).
  const bytes = 4 * n * 8;
  const gbs = bytes / 1e9 / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
  records.push({ n, compute_ms: med, compute_GBs: gbs });
}

saveResults("drotm", gpuModel, records, { folder: "drotm" });

cleanup();
