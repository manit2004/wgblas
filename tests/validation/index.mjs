/**
 * Validation param spec system for wgblas tests — 23 param files covering
 * every parameter across Level 1, 2, and 3 routines.
 *
 * Each routine declares its parameters by calling `loadParam(name)`, which
 * reads a JSON file from `tests/validation/params/<name>.json`. The JSON
 * describes what values are valid, what values must throw, and boundary cases
 * that must not throw. `runValidation` drives all those cases automatically.
 * See `tests/helpers/validation.js` for the runner itself; this page is the
 * reference for the JSON schema it reads.
 *
 * ## Param Spec JSON Format
 *
 * ```json
 * {
 *   "_note": "human-readable description — doc-only, never read by code",
 *   "type": "integer" | "float" | "float32array" | "float64array" | "string" | "srotm_param",
 *   "baseline": 1,
 *   "dependsOn": ["n"],
 *   "range": { "min": 1, "max": 4 },
 *   "invalid": [ ... ],
 *   "edge":    [ ... ]
 * }
 * ```
 *
 * Each entry in `invalid` must cause the routine to reject with a message
 * containing the `error` string. Each entry in `edge` must not throw.
 *
 * ## `type` and Its Matching `range` Shape
 *
 * `range`'s shape depends on `type` — they're not interchangeable:
 *
 * | `type` | `range` shape | Used by |
 * |---|---|---|
 * | `integer` | `{ min, max }` | n, m, k, incx, incy, lda, ldb, ldc, ld |
 * | `float` | `{ min, max }` | alpha, beta, cosine (`c`), `s` |
 * | `float32array` / `float64array` | `{ elementMin, elementMax }` | x, y, A, B, C |
 * | `string` | none — a top-level `values` array instead, e.g. `"values": ["lower", "upper"]` | uplo, trans, layout, diag, side |
 * | `srotm_param` | `{ flags: [...], coeff: { min, max } }` — one-off, srotm only | param |
 *
 * `float32array`/`float64array` specs also carry `dependsOn` — the scalar
 * params (`n`, `incx`, `lda`, ...) their required length is computed from.
 * `A`/`B`/`C`'s `dependsOn` differs by BLAS level (e.g. Level 2's `A` depends
 * on `["m", "n", "lda"]`; Level 3's shares an inner dimension `k` instead).
 * Rather than a separate file per level, `A.json` carries a `"level-3"`
 * override key with its own `dependsOn`/`invalid`/`edge` — fetched via
 * `loadParam('A')['level-3']` when a Level 3 routine needs it (see `A.json`'s
 * own `_note`). No other param currently needs a level override.
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
 * Every scalar and string spec supplies its own explicit `"baseline"` value
 * (arrays are wrapped as `Float32Array`). `float32array`/`float64array` specs
 * without one are sized automatically from their `dependsOn` dimensions. For
 * each test case, exactly one param is replaced with the invalid or edge
 * value while everything else stays at baseline — isolating the parameter
 * under test. The device is the only param with no static baseline; it's
 * supplied at runtime via `runtimeBaselines`.
 *
 * ## The 25 Params
 *
 * 25 logical parameter names, though only 23 files — `ldb`/`ldc` don't get
 * their own file, they just reuse `ld.json` (loaded via `loadParam("ld")`)
 * for the same generic leading-dimension check.
 *
 * - **Integers**: `n`, `m`, `k`, `incx`, `incy`, `lda`, `ldb`, `ldc`, `ld`
 *   (generic Level 3 leading-dimension check reused across routines)
 * - **Floats**: `alpha`, `beta`, `cosine` (`c`), `s`
 * - **Strings**: `uplo`, `trans`, `layout`, `diag`, `side`
 * - **Arrays**: `x`, `y`, `A`, `B`, `C`
 * - **One-off**: `param` (srotm's 5-element `[flag, h11, h21, h12, h22]`),
 *   `device`
 *
 * @module tests/validation
 */
