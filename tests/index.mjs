/**
 * Test suite architecture for wgblas.
 *
 * Each routine has three tests:
 *
 * 1. **validation** — rejects bad inputs (wrong type, wrong size, out-of-range)
 * 2. **fixtures** — 100 property-based random runs comparing GPU vs CPU stdlib
 * 3. **edge cases** — deterministic checks for routine-specific behaviour
 *
 * ## Directory Layout
 *
 * ```
 * tests/
 *   helpers/
 *     ulp.js         ulpDiff, maxUlp, assertUlp
 *     fixtures.js    floatArb, runFixtures (re-exports ulp helpers)
 *     validation.js  loadParam, runValidation
 *   validation/params/*.json   shared param specs (invalid + edge cases)
 *   <routine>/
 *     test.<routine>.js   the three tests
 *     helpers.js          forwardFactor (FMA routines only)
 * ```
 *
 * ## Error Metrics
 *
 * | Routine | Metric            | Threshold | Reason |
 * |---------|-------------------|-----------|--------|
 * | isamax  | exact index match | 0         | index must be exact |
 * | scopy   | maxUlp            | 0         | bitwise copy, no rounding |
 * | sswap   | maxUlp            | 0         | bitwise swap, no rounding |
 * | sscal   | maxUlp            | 0         | single multiply, exact at f32 |
 * | sasum   | ulpDiff           | 50        | tree reduction; GPU and CPU use different summation orders |
 * | snrm2   | ulpDiff           | 50        | tree reduction; GPU and CPU use different summation orders |
 * | saxpy   | forwardFactor     | 1         | FMA: GPU may fuse α×x+y into a single rounding |
 * | sdot    | forwardFactor     | 1         | near cancellation makes raw ULP unbounded even when correct |
 * | srot    | forwardFactor     | 1         | near cancellation makes raw ULP unbounded even when correct |
 * | srotm   | forwardFactor     | 1         | near cancellation makes raw ULP unbounded even when correct |
 *
 * ## Forward Error Factor
 *
 * Used instead of raw ULP for FMA routines (saxpy, sdot, srot, srotm):
 *
 * ```
 * factor = |err| / (eps × |bound|)
 * ```
 *
 * where `bound` is the sum of absolute values of the input terms and
 * `eps = 2^-23` (one f32 machine epsilon). `factor ≤ 1` means the GPU
 * result is within one rounding of the true result regardless of whether
 * the implementation uses FMA or two separate rounds.
 *
 * WGSL §15.7.2 / §17.5.32 permits fused multiply-add, so the GPU may
 * execute `α*x+y` as a single-rounding FMA while the CPU stdlib does two
 * roundings. Near cancellation the raw ULP difference is unbounded even
 * though both results are individually correct.
 *
 * ## FTZ — Flush to Zero
 *
 * WGSL may flush subnormals to zero (§15.7.2). Filtering inputs for
 * subnormals is not enough — products of two small-but-normal values can
 * still land in the subnormal range. `floatArb` uses `1e-3` as the minimum
 * magnitude so any pairwise product stays far above `F32_MIN_NORMAL`
 * (`1e-3 × 1e-3 = 1e-6 >> 1.175e-38`).
 *
 * ## Recurring Edge Case Patterns
 *
 * | Pattern | Routines |
 * |---------|----------|
 * | `n=1` — single-element sanity check | all |
 * | `alpha`/`c`/`s=0` — no-op or identity | saxpy, sscal, srot |
 * | `incx≠incy` — independent strides; catches index-mixing bugs | saxpy, sdot, scopy, sswap, srot, srotm |
 * | Gap elements — 99s at non-strided positions must survive | scopy, sscal, sswap, srot, srotm, saxpy |
 * | 90° rotation (`c=0, s=1`) — exact integer results | srot |
 * | Pythagorean triple (`[3,4]→5`) — exact result from sqrt | snrm2 |
 * | Flag per value (`-2`/`-1`/`0`/`1` each tested) | srotm |
 *
 * @module tests
 */
