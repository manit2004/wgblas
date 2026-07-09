/**
 * Test suite architecture for wgblas
 *
 * Each routine has three tests:
 *
 *   1. validation  — rejects bad inputs (wrong type, wrong size, out-of-range)
 *   2. fixtures    — 100 property-based random runs comparing GPU vs CPU stdlib
 *   3. edge cases  — deterministic checks for routine-specific behaviour
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DIRECTORY LAYOUT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   tests/
 *     index.js                  ← this file
 *     helpers/
 *       ulp.js                  ← ulpDiff, maxUlp, assertUlp
 *       fixtures.js             ← floatArb, runFixtures (re-exports ulp helpers)
 *       validation.js           ← loadParam, runValidation
 *     validation/
 *       params/
 *         n.json                ← shared param specs (invalid + edge cases)
 *         incx.json
 *         x.json
 *         ...
 *     <routine>/
 *       test.<routine>.js       ← the three tests
 *       helpers.js              ← forwardFactor (only for FMA routines)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ERROR METRICS  — which metric each routine uses in runFixtures
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   Routine          metric              threshold  reason
 *   ─────────────    ──────────────────  ─────────  ──────────────────────────
 *   isamax           exact index match   0          index must be exact
 *   scopy            maxUlp              0          bitwise copy, no rounding
 *   sswap            maxUlp              0          bitwise swap, no rounding
 *   sscal            maxUlp              0          single multiply, exact at f32
 *   sasum            ulpDiff             50         tree reduction; GPU and CPU
 *   snrm2            ulpDiff             50         use different summation orders
 *   saxpy            forwardFactor       1          FMA: GPU may fuse α*x+y into
 *   sdot             forwardFactor       1          a single rounding; near
 *   srot             forwardFactor       1          cancellation makes raw ULP
 *   srotm            forwardFactor       1          unbounded even when correct
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ULP HELPERS  (tests/helpers/ulp.js)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   ulpDiff(a, b)         → integer ULP distance between two f32 scalars.
 *                           ±0 are treated as equal (WGSL §15.7.1).
 *
 *   maxUlp(actual, expected)  → { max, worstIndex } over two Float32Arrays.
 *
 *   assertUlp(actual, expected, threshold, label?)
 *                         → throws if max ULP exceeds threshold.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FORWARD ERROR FACTOR  (tests/<routine>/helpers.js, FMA routines only)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   factor = |err| / (eps * |bound|)
 *
 *   where bound is the sum of absolute values of the input terms and
 *   eps = 2^-23 (one f32 machine epsilon).
 *
 *   factor ≤ 1 means the GPU result is within one rounding of the true result
 *   regardless of whether the implementation uses FMA or two separate rounds.
 *
 *   WGSL §15.7.2 / §17.5.32 permits fused multiply-add, so the GPU may execute
 *   α*x+y as a single-rounding FMA while the CPU stdlib does two roundings.
 *   Near cancellation the raw ULP difference between the two is unbounded even
 *   though both results are individually correct.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FTZ (FLUSH TO ZERO)  (tests/helpers/fixtures.js)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   WGSL may flush subnormals to zero: "To flush to zero is to replace a
 *   subnormal value for a floating point type with a zero value of that type."
 *   https://www.w3.org/TR/WGSL/#floating-point-evaluation §15.7.2
 *
 *   Filtering inputs for subnormals is not enough — products of two
 *   small-but-normal values can land in the subnormal range
 *   (e.g. F32_MIN_NORMAL * 5.96e-8 ≈ 7e-46).  floatArb uses 1e-3 as the
 *   minimum magnitude so any pairwise product stays far above F32_MIN_NORMAL
 *   (1e-3 * 1e-3 = 1e-6 >> 1.175e-38).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROPERTY-BASED INPUT GENERATION  (tests/helpers/fixtures.js buildArb)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   Scalar params (n, incx, incy, alpha, c, s) are generated first.
 *   Vectors x and y are then sized to exactly (n-1)*inc+1 so they always
 *   have a valid length for the generated n and stride.
 *
 *   srotm's param array is a custom arbitrary (paramArb in test.srotm.js)
 *   that picks the flag first, then generates the relevant coefficients.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VALIDATION PARAM SPECS  (tests/validation/params/*.json)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   Each JSON file describes one parameter:
 *     type     — "integer" | "float" | "float32array"
 *     range    — valid range used by buildArb
 *     invalid  — cases that must throw (value | special | scenario + error msg)
 *     edge     — cases that must not throw (minimum valid, boundary values)
 *
 *   loadParam(name) reads the file; runValidation iterates invalid and edge
 *   cases, substituting one param at a time while holding the rest at safe
 *   baseline values.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EDGE CASE PATTERNS  (recurring across routines)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   n=1             single-element sanity check for every routine
 *   alpha/c/s=0     no-op or identity — catches missing short-circuit guards
 *   incx≠incy       independent strides; catches index-mixing bugs
 *   gap elements    99s at non-strided positions must survive unchanged
 *                   (scopy, sscal, sswap, srot, srotm, saxpy)
 *   90° rotation    c=0, s=1 gives exact integer results for srot
 *   Pythagorean     [3,4]→5 gives exact integer result for snrm2
 *   flag per value  flag=-2/-1/0/1 each tested separately for srotm
 */
