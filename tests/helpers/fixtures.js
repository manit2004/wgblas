/**
 * Property-based fixture runner using [fast-check](https://fast-check.dev/).
 *
 * Each routine's fixtures test calls `runFixtures` with 100 random inputs,
 * comparing the GPU result against the CPU stdlib reference using a
 * routine-specific error metric and threshold.
 *
 * ## Input Generation
 *
 * `buildArb` constructs a fast-check arbitrary that produces a complete args
 * object for one test run. Scalar params (`n`, `incx`, `incy`, `alpha`, `c`,
 * `s`) are generated first; vectors `x` and `y` are then sized to exactly
 * `(n-1)*inc+1` elements so their length is always consistent with the
 * generated `n` and stride.
 *
 * ## FTZ — Flush to Zero
 *
 * WGSL may flush subnormals to zero: *"To flush to zero is to replace a
 * subnormal value for a floating point type with a zero value of that type."*
 * ([WGSL §15.7.2](https://www.w3.org/TR/WGSL/#floating-point-evaluation))
 *
 * Filtering generated values for subnormals is not enough — the product of two
 * small-but-normal values can itself land in the subnormal range (e.g.
 * `F32_MIN_NORMAL * 5.96e-8 ≈ 7e-46`). `floatArb` uses `1e-3` as the minimum
 * non-zero magnitude, ensuring any pairwise product stays well above
 * `F32_MIN_NORMAL` (`1e-3 × 1e-3 = 1e-6 >> 1.175e-38`).
 *
 * ## Error Metrics and Thresholds
 *
 * `runFixtures` accepts an `errorMetric` function and a `threshold`. Each run
 * passes if `errorMetric(gpuResult, refResult, args) <= threshold`. Despite
 * the name, it isn't always a ULP count — it's `maxUlp`/`ulpDiff` for exact
 * and reduction routines, but `forwardFactor`/`backwardResidualFactor` for
 * everything else (see `tests/index.mjs` for the full per-routine table).
 *
 * @module tests/helpers/fixtures
 */

import fc from "fast-check";
import { ulpDiff, maxUlp } from "./ulp.js";
import { ndArrayLen, matrixShape } from "./validation.js";

export { ulpDiff, maxUlp };

/**
 * Builds a correctly-sized vector for an edge case from n/inc alone, filled
 * with a sentinel (99) at every position. A routine that only ever touches
 * `vec[i*inc]` for i in [0,n) — whether overwriting it or accumulating into
 * it — leaves every other position exactly as it started, so a uniform
 * sentinel fill makes "the right positions changed" and "the gap positions
 * were left alone" both observable, without hand-typing a buffer sized to
 * match n/inc.
 * @public
 */
export function makeVec(n, inc, sentinel = 99) {
  return new Float32Array((n - 1) * inc + 1).fill(sentinel);
}

// WGSL may flush subnormals to zero (FTZ): "To flush to zero is to replace a subnormal value
// for a floating point type with a zero value of that type."
// https://www.w3.org/TR/WGSL/#floating-point-evaluation §15.7.2
// Filtering inputs for subnormals is not enough — products of two small-but-normal values can
// still land in the subnormal range (e.g. F32_MIN_NORMAL * 5.96e-8 ≈ 7e-46). Using 1e-3 as
// the minimum magnitude ensures any pairwise product stays far above F32_MIN_NORMAL
// (1e-3 * 1e-3 = 1e-6 >> 1.175e-38).
const FLOAT_MIN_MAGNITUDE = 1e-3;
const isUsable = (v) => v === 0.0 || Math.abs(v) >= FLOAT_MIN_MAGNITUDE;

/**
 * A fast-check arbitrary for f32 scalars in `[min, max]`, excluding subnormals.
 * Zero is allowed; any non-zero value has `|v| >= 1e-3`.
 * @returns fast-check arbitrary that generates usable f32 scalars
 * @public
 */
export function floatArb(min, max) {
  return fc.float({ min, max, noNaN: true, noDefaultInfinity: true }).filter(isUsable);
}

/**
 * A fast-check arbitrary for f64 scalars in `[min, max]`, excluding subnormals.
 * Used for dasum's x (Float64Array): the double-double kernel splits each
 * double into a (hi, lo) f32 pair, so the same FTZ-safety floor as `floatArb`
 * applies to both halves. hi/lo are always genuine f32 values (never raw
 * bits), so no NaN-bit-pattern filter is needed here — see f64.mjs.
 * @returns fast-check arbitrary that generates usable f64 scalars
 * @public
 */
export function float64Arb(min, max) {
  return fc.double({ min, max, noNaN: true, noDefaultInfinity: true }).filter(isUsable);
}

/**
 * Arbitrary for a single scalar param — integers for `n`/`incx`/`incy`, floats for `alpha`/`c`/`s`.
 * @param spec loaded JSON param spec; `spec.type` selects integer vs float, `spec.range` gives bounds
 * @returns fast-check arbitrary that generates a single scalar matching the param spec
 * @public
 */
export function scalarArb(spec) {
  const { min, max } = spec.range;
  if (spec.type === "integer") return fc.integer({ min, max });
  return floatArb(min, max);
}

// Generates a single param value for any scalar type: integer, float, or string enum.
// Returns null for non-scalar types (float32array, device, etc.) so callers can skip them.
function paramArb(spec) {
  if (spec.type === "integer") return fc.integer(spec.range);
  if (spec.type === "float")   return floatArb(spec.range.min, spec.range.max);
  if (spec.type === "string")  return fc.constantFrom(...spec.values);
  return null;
}

/**
 * Arbitrary for a typed array of exactly `len` elements — works for both vectors and matrices.
 * Callers compute `len` from dimensions: `(n-1)*inc+1` for vectors, `(m-1)*lda+n` for matrices.
 * `spec.type === "float64array"` (e.g. dasum's x) builds a Float64Array; everything else
 * (including the default) builds a Float32Array.
 * @param spec loaded JSON param spec; `spec.range.elementMin/elementMax` give element bounds
 * @param len exact number of elements to generate
 * @returns fast-check arbitrary that generates a typed array of exactly `len` elements
 * @public
 */
export function ndArrayArb(spec, len) {
  const { elementMin: min, elementMax: max } = spec.range;
  const isF64 = spec.type === "float64array";
  const arb = isF64 ? float64Arb(min, max) : floatArb(min, max);
  const Ctor = isF64 ? Float64Array : Float32Array;
  return fc.array(arb, { minLength: len, maxLength: len }).map((a) => new Ctor(a));
}

/**
 * Wraps a matrix arbitrary so its n diagonal entries (`A[i*lda+i]`) are
 * overridden to a fixed away-from-zero band instead of whatever the base
 * arbitrary generated there. A plain uniform fill (including near-zero or
 * exactly-zero diagonal entries) is a perfectly legal general matrix, but a
 * routine that divides by the diagonal (e.g. a triangular solve) needs it
 * bounded away from 0 — a near-singular fixture would make even a bug-free
 * GPU/CPU pair disagree wildly, since large relative error there is expected
 * ill-conditioning, not incorrectness.
 * @param arrArb base Float32Array arbitrary (from `ndArrayArb`)
 * @param n matrix order — number of diagonal entries
 * @param lda leading dimension — diagonal entries sit at `i*lda+i`
 * @param diagLow lower bound for `|diagonal entry|` (default: 5)
 * @param diagHigh upper bound for `|diagonal entry|` (default: 15)
 * @returns fast-check arbitrary producing the same-shaped array with its diagonal patched
 * @public
 */
export function triangularDiagonalArb(arrArb, n, lda, diagLow = 5, diagHigh = 15) {
  const magArb = fc.array(floatArb(diagLow, diagHigh), { minLength: n, maxLength: n });
  const signArb = fc.array(fc.constantFrom(-1, 1), { minLength: n, maxLength: n });
  return fc.tuple(arrArb, magArb, signArb).map(([A, mags, signs]) => {
    const out = Float32Array.from(A);
    for (let i = 0; i < n; i++) out[i * lda + i] = signs[i] * mags[i];
    return out;
  });
}

/**
 * Builds a fast-check arbitrary that produces a complete args object for one test run.
 *
 * Scalar params are generated first from their spec types (integer, float, string).
 * Every `ld*` field referenced by an array spec's own `dependsOn` (`lda`/`ldb`/`ldc`, ...)
 * is then chained in `[floor, floor + pad]`, where `floor` is `matrixShape`'s `inner` —
 * the same formula `ndArrayLen` uses to size the backing array, so e.g. `lda >= n`
 * (row-major) or `lda >= m` (column-major) is always satisfied. This covers both L2
 * (one matrix, `lda`) and Level 3 (multiple independently-shaped matrices, `lda`/`ldb`/`ldc`)
 * routines with a single formula.
 *
 * All `float32array`/`float64array` params are then sized via `ndArrayLen` which reads
 * each spec's `dependsOn` — the same formula used in validation's `resolveNdArray`. A matrix spec
 * with `triangular: true` (e.g. for `strsv`) additionally gets its diagonal patched via
 * `triangularDiagonalArb` — see `diagLow`/`diagHigh` on the spec to override the default band.
 *
 * @param specs record of param specs keyed by param name, from `loadParam`
 * @param extras optional additional arbitraries for routine-specific params (e.g. srotm's `param`)
 * @returns fast-check arbitrary that generates a complete args object
 * @public
 */
export function buildArb(specs, extras = {}) {
  // Every ld* field an array spec actually depends on — sizing formula lives
  // in matrixShape, keyed off that array's own dependsOn (e.g. A~lda,
  // B~ldb, C~ldc for sgemm; just A~lda for any L2 routine).
  const arraySpecs = Object.values(specs).filter((s) => s.type === "float32array" || s.type === "float64array");
  const ldFields = [...new Set(arraySpecs.map((s) => s.dependsOn?.find((d) => d.startsWith("ld"))).filter(Boolean))];

  // Generate all scalar params; skip ld* fields here — they're chained below.
  const scalarEntries = Object.entries(specs)
    .filter(([k, s]) => paramArb(s) !== null && !ldFields.includes(k));
  const scalarRec = fc.record(
    Object.fromEntries(scalarEntries.map(([k, s]) => [k, paramArb(s)]))
  );

  const dimsArb = ldFields.length
    ? scalarRec.chain((s) => {
        const ldArbs = {};
        for (const ldKey of ldFields) {
          const pad = specs[ldKey].range.max - specs[ldKey].range.min;
          const arraySpec = arraySpecs.find((sp) => sp.dependsOn?.includes(ldKey));
          const floor = matrixShape(arraySpec.dependsOn, s).inner;
          ldArbs[ldKey] = fc.integer({ min: floor, max: floor + pad });
        }
        return fc.record(ldArbs).map((generated) => ({ ...s, ...generated }));
      })
    : scalarRec;

  // Chain array generation — each array sized via ndArrayLen reading spec.dependsOn.
  return dimsArb.chain((dims) => {
    const fields = Object.fromEntries(Object.keys(dims).map((k) => [k, fc.constant(dims[k])]));
    for (const [name, spec] of Object.entries(specs)) {
      if (spec.type !== "float32array" && spec.type !== "float64array") continue;
      const arrArb = ndArrayArb(spec, ndArrayLen(spec.dependsOn, dims));
      fields[name] = spec.triangular
        ? triangularDiagonalArb(
            arrArb,
            matrixShape(spec.dependsOn, dims).inner, // order — side-aware via matrixShape, not just dims.n
            dims[spec.dependsOn.find((d) => d.startsWith("ld"))],
            spec.diagLow,
            spec.diagHigh,
          )
        : arrArb;
    }
    for (const [k, arb] of Object.entries(extras)) fields[k] = arb;
    return fc.record(fields);
  });
}

/**
 * Runs `numRuns` property-based random tests comparing the GPU routine against
 * a CPU reference. Passes if `errorMetric(gpuResult, refResult, args) <= threshold`
 * for every run. Emits a diagnostic with the maximum observed value.
 *
 * @param t - node:test context
 * @param routineName - used in the diagnostic label
 * @param device - WebGPU device instance
 * @param numRuns - number of random inputs to generate (typically 100)
 * @param threshold - maximum allowed value from `errorMetric`
 * @param specsOrArb - param specs from `loadParam`, or a pre-built fc arbitrary
 * @param callGpu - async function that calls the GPU routine
 * @param callRef - function that calls the CPU reference
 * @param errorMetric - `(gpuResult, refResult, args) => number`; e.g. `maxUlp`/
 *   `ulpDiff` for exact/reduction routines, `forwardFactor`/`backwardResidualFactor`
 *   for the rest — not always a ULP count despite routines commonly naming their
 *   own version `...Ulp`/`...Diff`
 * @param extras - optional extra arbitraries for routine-specific params (e.g. srotm's param)
 * @returns promise that resolves when all runs pass, or rejects on the first failing run
 * @public
 */
export async function runFixtures(
  t,
  routineName,
  device,
  numRuns,
  threshold,
  specsOrArb,   // either a specs object (L1: uses buildArb) or a pre-built fc arbitrary (L2)
  callGpu,
  callRef,
  errorMetric,
  extras = {}
) {
  // fc arbitraries have both generate and filter; plain spec objects have neither.
  const arb = typeof specsOrArb?.generate === "function" && typeof specsOrArb?.filter === "function"
    ? specsOrArb
    : buildArb(specsOrArb, extras);
  let maxObserved = 0;

  await fc.assert(
    fc.asyncProperty(arb, async (args) => {
      const gpuResult = await callGpu(device, args);
      const refResult = callRef(args);
      const metric = errorMetric(gpuResult, refResult, args);
      if (metric > maxObserved) maxObserved = metric;
      return metric <= threshold;
    }),
    { numRuns, verbose: true }
  );

  t.diagnostic(
    `${routineName} max metric: ${maxObserved} / threshold ${threshold} (${numRuns} runs)`
  );
}
