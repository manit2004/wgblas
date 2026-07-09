/**
 * Test suite for wgblas — 10 BLAS Level 1 routines, each covered by three tests.
 *
 * **validation** — rejects every class of bad input defined in
 * `tests/validation/params/*.json`: wrong type, wrong size, out-of-range value.
 *
 * **fixtures** — 100 property-based random runs via fast-check, comparing the
 * GPU result against `@stdlib` as the CPU reference. Inputs avoid subnormals
 * to stay safe under WGSL's flush-to-zero (FTZ) rule.
 *
 * **edge cases** — deterministic checks for routine-specific behaviour: ties,
 * strides, identity parameters, exact Pythagorean results, per-flag srotm paths.
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
 * @module tests
 */
