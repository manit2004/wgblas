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
 */
export function scalarArb(spec) {
  const { min, max } = spec.range;
  if (spec.type === "integer") return fc.integer({ min, max });
  return floatArb(min, max);
}

/**
 * Arbitrary for a Float32Array of exactly `len` elements drawn from `floatArb`.
 * @param spec loaded JSON param spec; `spec.range.elementMin/elementMax` give element bounds
 * @param len exact array length — always `(n-1)*inc+1`, computed by `buildArb` after generating `n` and `inc`
 * @returns fast-check arbitrary that generates a Float32Array of exactly `len` elements
 */
export function vectorArb(spec, len) {
  const { elementMin: min, elementMax: max } = spec.range;
  return fc
    .array(floatArb(min, max), { minLength: len, maxLength: len })
    .map((a) => new Float32Array(a));
}

/**
 * Builds a fast-check arbitrary that produces a complete args object for one test run.
 * Scalar params (`n`, `incx`, `incy`, `alpha`, `c`, `s`) are generated first; vectors
 * `x` and `y` are then sized to `(n-1)*inc+1` so their lengths are always consistent
 * with the generated `n` and stride.
 * @param specs record of param specs keyed by param name, from `loadParam`
 * @param extras optional additional arbitraries for routine-specific params (e.g. srotm's `param`)
 * @returns fast-check arbitrary that generates a complete args object ready to pass to `callGpu` and `callRef`
 */
export function buildArb(specs, extras = {}) {
  const scalarOrder = ["n", "incx", "incy", "alpha", "c", "s"];
  const present = scalarOrder.filter((k) => specs[k]);

  const scalarRec = fc.record(
    Object.fromEntries(present.map((k) => [k, scalarArb(specs[k])]))
  );

  return scalarRec.chain((s) => {
    const fields = Object.fromEntries(present.map((k) => [k, fc.constant(s[k])]));

    if (specs.x) {
      const len = (s.n - 1) * (s.incx ?? 1) + 1;
      fields.x = vectorArb(specs.x, len);
    }
    if (specs.y) {
      const len = (s.n - 1) * (s.incy ?? s.incx ?? 1) + 1;
      fields.y = vectorArb(specs.y, len);
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
  specs,
  callGpu,
  callRef,
  computeUlp,
  extras = {}
) {
  let maxObserved = 0;

  await fc.assert(
    fc.asyncProperty(buildArb(specs, extras), async (args) => {
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
