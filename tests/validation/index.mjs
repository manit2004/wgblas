/**
 * Validation param spec system for wgblas tests.
 *
 * Each routine declares its parameters by calling `loadParam(name)`, which
 * reads a JSON file from `tests/validation/params/<name>.json`. The JSON
 * describes what values are valid, what values must throw, and boundary cases
 * that must not throw. `runValidation` drives all those cases automatically.
 *
 * ## Param Spec JSON Format
 *
 * ```json
 * {
 *   "type": "integer" | "float" | "float32array",
 *   "range": { "min": 1, "max": 4 },
 *   "invalid": [ ... ],
 *   "edge":    [ ... ]
 * }
 * ```
 *
 * Each entry in `invalid` must cause the routine to reject with a message
 * containing the `error` string. Each entry in `edge` must not throw.
 *
 * ## Entry Types
 *
 * Entries in `invalid` and `edge` are resolved by one of three forms:
 *
 * **value** — a literal value substituted directly:
 * ```json
 * { "value": 0, "error": "must be positive", "label": "zero" }
 * ```
 *
 * **special** — a named non-serialisable value (`NaN`, `Infinity`, `null`,
 * `undefined`, `string`, `array`, `object`, `number`):
 * ```json
 * { "special": "NaN", "error": "must be integers", "label": "NaN" }
 * ```
 *
 * **scenario** — a named construction rule for vectors and the srotm `param`
 * array. Vector scenarios: `"minimal"` (exactly `(n-1)*inc+1` elements, minimum
 * valid length) and `"tooShort"` (one element short). Param scenarios:
 * `"tooShort"`, `"tooLong"`, `"identity"`, `"fullMatrix"`, `"diagOne"`,
 * `"offDiagOne"`:
 * ```json
 * { "scenario": "tooShort", "error": "does not have enough elements", "label": "..." }
 * ```
 *
 * ## Baseline Substitution
 *
 * `runValidation` builds a baseline args object with safe defaults for every
 * param the routine uses — `n=100`, `incx=1`, `x` sized to `(n-1)*10+1`, and
 * so on. For each test case exactly one param is replaced with the invalid or
 * edge value while all others stay at baseline, isolating the parameter under
 * test. The device is the only param that cannot be defaulted statically and
 * must be supplied via `runtimeBaselines`.
 *
 * @module tests/validation
 */
