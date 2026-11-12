/**
 * Shared benchmark runner (the benchmark counterpart of
 * `tests/helpers/fixtures.js`). Each `benchmarks/<routine>/wgblas/<routine>.js`
 * passes a spec to {@link runBenchmark}, which handles the points, operands,
 * clock warming, timing, metrics, table and results JSON.
 *
 * ```js
 * {
 *   routine: "saxpy", warmup: 5, iters: 100,
 *   defaults: { alpha: 2, inc: 1 },
 *   operands: (p) => ({ x: vector(Float32Array, p.n * p.inc), ... }),
 *   call: (device, p, o) => saxpy(device, p.n, p.alpha, o.x, p.inc, ...),
 *   bytes: (p) => 3 * p.n * 4, // → compute_GBs
 *   flops: (p) => 2 * p.n,     // optional → compute_GFLOPs
 *   sweeps: {
 *     base:   { axes: { n: SIZES } },                // → saxpy.json
 *     stride: { axes: { stride: STRIDES, n: SIZES }, // → stride.saxpy.json
 *               skip: (p) => p.stride > p.n,
 *               derive: (p) => ({ ...p, inc: p.stride }) },
 *   },
 * }
 * ```
 *
 * Optional sweep fields: `fixed` (extra params), `record` (JSON keys if not
 * the axes), `format` (display per key), `beforeEach` (untimed, per call),
 * `warmup`/`iters`. Points over `maxStorageBufferBindingSize` are skipped.
 *
 * Flags: `--sweeps=a,b` (subset), `--plan` (list points, no GPU),
 * `--check[=<gpu-slug>]` (diff points against committed results),
 * `--out=<dir>` (other results root), `low-power`.
 *
 * @module
 */
import { readFileSync, existsSync } from "node:fs";
import { init, cleanup } from "wgblas";
import { GpuVector } from "wgblas/classes/GpuVector";
import { Complex32Array } from "wgblas/classes/Complex32";
import { randomFloat32Array, randomFloat64Array } from "wgblas/random";
import {
  median,
  printHeader,
  printRow,
  saveResults,
  getGpuModel,
  warmClocks,
} from "./helpers.mjs";

/** WebGPU's default `maxStorageBufferBindingSize` (128 MiB) — the `--plan` stand-in for a real device. */
export const DEFAULT_MAX_BINDING = 134217728;

/**
 * Operand descriptor for a GPU-resident vector of `length` elements filled
 * with uniform random values in [-1, 1].
 * @param {Float32ArrayConstructor | Float64ArrayConstructor | typeof Complex32Array} dtype
 * @param {number} length - elements (complex: complex elements)
 */
export const vector = (dtype, length) => ({ kind: "vector", dtype, length });

/**
 * Bytes of the largest single storage binding an operand creates — what
 * `maxStorageBufferBindingSize` limits. A Float64Array operand is two
 * separate f32 buffers (double-double hi and lo), so 4 bytes per element per
 * binding, not 8.
 * @param {{ dtype: Function, length: number }} op
 * @returns {number}
 */
export function bindingBytes(op) {
  return op.length * (op.dtype === Complex32Array ? 8 : 4);
}

function createOperand(op) {
  if (op.kind !== "vector") throw new Error(`unknown operand kind ${op.kind}`);
  if (op.dtype === Float32Array)
    return GpuVector.from(randomFloat32Array(op.length));
  if (op.dtype === Float64Array)
    return GpuVector.from(randomFloat64Array(op.length));
  if (op.dtype === Complex32Array)
    return GpuVector.from(
      new Complex32Array(randomFloat32Array(2 * op.length)),
    );
  throw new Error(`unsupported dtype ${op.dtype?.name}`);
}

/**
 * Results file name for a sweep: `base` → `<routine>`, else `<sweep>.<routine>`.
 * @param {{ routine: string }} spec
 * @param {string} sweepName
 */
export function fileName(spec, sweepName) {
  return sweepName === "base" ? spec.routine : `${sweepName}.${spec.routine}`;
}

/** JSON keys a sweep records per point, before the metrics. */
export function recordKeys(sweep) {
  return sweep.record ?? Object.keys(sweep.axes);
}

/**
 * Every point a sweep visits, in run order, without touching a GPU.
 * @param {object} spec
 * @param {string} sweepName
 * @param {{ maxBinding?: number }} [opts]
 * @returns {Array<{ p: object, skipped: string | null }>} `skipped` holds the
 *   reason a point won't run (buffer too large), else null
 */
export function planPoints(
  spec,
  sweepName,
  { maxBinding = DEFAULT_MAX_BINDING } = {},
) {
  const sweep = spec.sweeps[sweepName];
  if (!sweep) throw new Error(`${spec.routine} has no sweep "${sweepName}"`);
  const axes = Object.entries(sweep.axes);
  const out = [];
  const walk = (i, acc) => {
    if (i === axes.length) {
      let p = { ...spec.defaults, ...sweep.fixed, ...acc };
      if (sweep.derive) p = sweep.derive(p);
      if (sweep.skip?.(p)) return;
      const ops = Object.values(spec.operands(p));
      const tooBig = ops.some((op) => bindingBytes(op) > maxBinding);
      out.push({
        p,
        skipped: tooBig
          ? "a buffer would exceed maxStorageBufferBindingSize"
          : null,
      });
      return;
    }
    const [name, values] = axes[i];
    for (const v of values) walk(i + 1, { ...acc, [name]: v });
  };
  walk(0, {});
  return out;
}

function recordOf(sweep, p) {
  const rec = {};
  for (const k of recordKeys(sweep))
    rec[k] = sweep.format?.[k] ? sweep.format[k](p[k]) : p[k];
  return rec;
}

/**
 * Runs one sweep of a spec on `device` and saves its results JSON.
 * @param {GPUDevice} device - from `init({ benchmark: true })`
 * @param {object} spec
 * @param {string} sweepName
 * @param {{ gpuModel: string | null, root?: string }} opts - `root`: results
 *   root for {@link saveResults} (default: the published results)
 * @returns {Promise<object[]>} the saved records
 */
export async function runSweep(device, spec, sweepName, { gpuModel, root }) {
  const sweep = spec.sweeps[sweepName];
  const warmup = sweep.warmup ?? spec.warmup;
  const iters = sweep.iters ?? spec.iters;
  const axisNames = Object.keys(sweep.axes);
  const metricCols = spec.flops
    ? ["compute_ms", "compute_GFLOPs", "compute_GBs"]
    : ["compute_ms", "compute_GBs"];
  const cols = [...axisNames, ...metricCols];
  const fmt = (k, v) => (sweep.format?.[k] ? sweep.format[k](v) : v);

  console.log(`\n=== ${fileName(spec, sweepName)} ===`);
  printHeader(cols);
  const records = [];
  const maxBinding = device.limits.maxStorageBufferBindingSize;

  for (const { p, skipped } of planPoints(spec, sweepName, { maxBinding })) {
    if (skipped) {
      const where = axisNames.map((k) => `${k}=${fmt(k, p[k])}`).join(", ");
      console.log(`  (skipped ${where}: ${skipped})`);
      continue;
    }
    const descriptors = spec.operands(p);
    const ops = {};
    for (const [name, op] of Object.entries(descriptors))
      ops[name] = createOperand(op);

    await warmClocks(device); // full clocks first — see helpers.mjs
    for (let i = 0; i < warmup; i++) {
      await sweep.beforeEach?.(p, ops);
      await spec.call(device, p, ops);
    }
    const times = [];
    for (let i = 0; i < iters; i++) {
      await sweep.beforeEach?.(p, ops);
      const { gpuTimeMs } = await spec.call(device, p, ops);
      if (Number.isFinite(gpuTimeMs) && gpuTimeMs > 0) times.push(gpuTimeMs);
    }
    for (const op of Object.values(ops)) op.destroy();
    if (times.length === 0) continue;

    const med = median(times);
    const seconds = med / 1e3;
    const gbs = spec.bytes(p) / 1e9 / seconds;
    const metrics = spec.flops
      ? {
          compute_ms: med,
          compute_GFLOPs: spec.flops(p) / 1e9 / seconds,
          compute_GBs: gbs,
        }
      : { compute_ms: med, compute_GBs: gbs };
    printRow(cols, [
      ...axisNames.map((k) => fmt(k, p[k])),
      ...Object.values(metrics),
    ]);
    records.push({ ...recordOf(sweep, p), ...metrics });
  }

  saveResults(spec.routine, gpuModel, records, {
    folder: spec.routine,
    fileName: fileName(spec, sweepName),
    root,
  });
  return records;
}

/**
 * Record keys of every point a sweep would run (formatted as they'd be
 * saved), for comparing a plan against committed results.
 * @param {object} spec
 * @param {string} sweepName
 * @param {{ maxBinding?: number }} [opts]
 */
export function plannedRecords(spec, sweepName, opts) {
  const sweep = spec.sweeps[sweepName];
  return planPoints(spec, sweepName, opts)
    .filter((pt) => !pt.skipped)
    .map((pt) => recordOf(sweep, pt.p));
}

// Keys compared at 6 significant figures for non-integers — f32 sweep values
// (fround'd c/s) carry more digits than the CUDA side's labels but are the
// same point.
function keyOf(rec, keys) {
  return keys
    .map((k) => {
      const v = rec[k];
      const shown =
        typeof v === "number" && !Number.isInteger(v)
          ? Number(v.toPrecision(6))
          : v;
      return `${k}=${shown}`;
    })
    .join(",");
}

function checkSweep(spec, sweepName, gpu) {
  const file = `benchmarks/results/${gpu}/wgblas/${spec.routine}/${fileName(spec, sweepName)}.json`;
  const keys = recordKeys(spec.sweeps[sweepName]);
  if (!existsSync(file)) {
    console.log(`MISSING  ${file}`);
    return false;
  }
  const committed = new Set(
    JSON.parse(readFileSync(file, "utf8")).map((r) => keyOf(r, keys)),
  );
  const planned = new Set(
    plannedRecords(spec, sweepName).map((r) => keyOf(r, keys)),
  );
  const onlyPlan = [...planned].filter((k) => !committed.has(k));
  const onlyCommitted = [...committed].filter((k) => !planned.has(k));
  const ok = onlyPlan.length === 0 && onlyCommitted.length === 0;
  console.log(
    `${ok ? "OK      " : "DIFFERS "} ${fileName(spec, sweepName)} (${planned.size} planned, ${committed.size} committed)`,
  );
  for (const k of onlyPlan) console.log(`           + planned only:   ${k}`);
  for (const k of onlyCommitted)
    console.log(`           - committed only: ${k}`);
  return ok;
}

/**
 * Entry point of a benchmark file: runs every sweep in `spec` (or those
 * named by `--sweeps=`) and saves each sweep's results JSON — or, with `--plan` /
 * `--check` on the command line, lists / verifies its points without a GPU.
 * See the module docs for the flags.
 * @param {object} spec
 * @param {string[]} [argv] - defaults to `process.argv.slice(2)`
 * @returns {Promise<void>}
 */
export async function runBenchmark(spec, argv = process.argv.slice(2)) {
  const flag = (name) => {
    const a = argv.find((x) => x === `--${name}` || x.startsWith(`--${name}=`));
    if (!a) return undefined;
    return a.includes("=") ? a.slice(a.indexOf("=") + 1) : true;
  };
  const only = flag("sweeps");
  const sweepNames = Object.keys(spec.sweeps).filter(
    (name) => typeof only !== "string" || only.split(",").includes(name),
  );
  if (sweepNames.length === 0)
    throw new Error(
      `${spec.routine}: no sweep matches --sweeps=${only} (has: ${Object.keys(spec.sweeps).join(", ")})`,
    );

  if (flag("plan")) {
    for (const sweepName of sweepNames) {
      const pts = planPoints(spec, sweepName);
      const keys = recordKeys(spec.sweeps[sweepName]);
      console.log(`${fileName(spec, sweepName)} — ${pts.length} points`);
      for (const { p, skipped } of pts)
        console.log(
          `  ${keyOf(p, keys)}${skipped ? `  (skipped: ${skipped})` : ""}`,
        );
    }
    return;
  }
  if (flag("check")) {
    const gpu =
      flag("check") === true ? "nvidia-geforce-gtx-1650" : flag("check");
    const ok = sweepNames.every((sweepName) =>
      checkSweep(spec, sweepName, gpu),
    );
    if (!ok) process.exitCode = 1;
    return;
  }

  const powerPreference = argv.includes("low-power")
    ? "low-power"
    : "high-performance";
  const device = await init({ benchmark: true, powerPreference });
  const gpuModel = getGpuModel();
  const out = flag("out");
  const root = out === true ? undefined : out;
  for (const sweepName of sweepNames)
    await runSweep(device, spec, sweepName, { gpuModel, root });
  cleanup();
}
