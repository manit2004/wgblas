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
 * `runFixtures` accepts a `computeUlp` function and a `threshold`. Each run
 * passes if `computeUlp(gpuResult, refResult, args) <= threshold`. See
 * `tests/index.mjs` for the full per-routine table.
 *
 * @module tests/helpers/fixtures
 */

import fc from "fast-check";
import { ulpDiff, maxUlp } from "./ulp.js";
import { ndArrayLen } from "./validation.js";

export { ulpDiff, maxUlp };

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
 * Arbitrary for a Float32Array of exactly `len` elements — works for both vectors and matrices.
 * Callers compute `len` from dimensions: `(n-1)*inc+1` for vectors, `(m-1)*lda+n` for matrices.
 * @param spec loaded JSON param spec; `spec.range.elementMin/elementMax` give element bounds
 * @param len exact number of elements to generate
 * @returns fast-check arbitrary that generates a Float32Array of exactly `len` elements
 * @public
 */
export function ndArrayArb(spec, len) {
  const { elementMin: min, elementMax: max } = spec.range;
  return fc
    .array(floatArb(min, max), { minLength: len, maxLength: len })
    .map((a) => new Float32Array(a));
}

/**
 * Builds a fast-check arbitrary that produces a complete args object for one test run.
 *
 * Scalar params are generated first from their spec types (integer, float, string).
 * For L2 routines (`specs` includes `A`), `lda` is chained after `n` to enforce `lda >= n`.
 * All `float32array` params are then sized via `ndArrayLen` which reads each spec's
 * `dependsOn` — the same formula used in validation's `resolveNdArray`.
 *
 * @param specs record of param specs keyed by param name, from `loadParam`
 * @param extras optional additional arbitraries for routine-specific params (e.g. srotm's `param`)
 * @returns fast-check arbitrary that generates a complete args object
 * @public
 */
export function buildArb(specs, extras = {}) {
  const isL2 = "A" in specs;

  // Generate all scalar params; for L2, skip lda here — it's chained off n below.
  const scalarEntries = Object.entries(specs)
    .filter(([k, s]) => paramArb(s) !== null && !(isL2 && k === "lda"));
  const scalarRec = fc.record(
    Object.fromEntries(scalarEntries.map(([k, s]) => [k, paramArb(s)]))
  );

  // For L2, chain lda in [n, n + ldaPad] so lda >= n is always satisfied.
  const dimsArb = isL2 && specs.lda
    ? scalarRec.chain((s) => {
        const ldaPad = specs.lda.range.max - specs.lda.range.min;
        return fc.integer({ min: s.n, max: s.n + ldaPad }).map((lda) => ({ ...s, lda }));
      })
    : scalarRec;

  // Chain array generation — each array sized via ndArrayLen reading spec.dependsOn.
  return dimsArb.chain((dims) => {
    const fields = Object.fromEntries(Object.keys(dims).map((k) => [k, fc.constant(dims[k])]));
    for (const [name, spec] of Object.entries(specs)) {
      if (spec.type === "float32array") fields[name] = ndArrayArb(spec, ndArrayLen(spec.dependsOn, dims));
    }
    for (const [k, arb] of Object.entries(extras)) fields[k] = arb;
    return fc.record(fields);
  });
}

/**
 * Runs `numRuns` property-based random tests comparing the GPU routine against
 * a CPU reference. Passes if `computeUlp(gpuResult, refResult, args) <= threshold`
 * for every run. Emits a diagnostic with the maximum observed value.
 *
 * @param t - node:test context
 * @param routineName - used in the diagnostic label
 * @param device - WebGPU device instance
 * @param numRuns - number of random inputs to generate (typically 100)
 * @param threshold - maximum allowed value from `computeUlp`
 * @param specs - param specs from `loadParam`, used to build the input arbitrary
 * @param callGpu - async function that calls the GPU routine
 * @param callRef - function that calls the CPU reference
 * @param computeUlp - error metric: `(gpuResult, refResult, args) => number`
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
  computeUlp,
  extras = {}
) {
  const arb = typeof specsOrArb?.generate === "function"
    ? specsOrArb
    : buildArb(specsOrArb, extras);
  let maxObserved = 0;

  await fc.assert(
    fc.asyncProperty(arb, async (args) => {
      const gpuResult = await callGpu(device, args);
      const refResult = callRef(args);
      const diff = computeUlp(gpuResult, refResult, args);
      if (diff > maxObserved) maxObserved = diff;
return diff <= threshold;
    }),
    { numRuns, verbose: true }
  );

  t.diagnostic(
    `${routineName} max ULP: ${maxObserved} / threshold ${threshold} (${numRuns} runs)`
  );
}
