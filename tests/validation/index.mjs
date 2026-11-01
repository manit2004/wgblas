/**
 * Validation param spec system for wgblas tests — 25 param files covering
 * every parameter across Level 1, 2, and 3 routines, single and double
 * precision and complex.
 *
 * Each routine declares its parameters by calling `loadParam(name)`, which
 * reads a JSON file from `tests/validation/params/<name>.json`. The JSON
 * describes what values are valid, what values must throw, and boundary cases
 * that must not throw. `runValidation` drives all those cases automatically,
 * and the fixtures tests generate their random inputs from the same specs.
 * See `tests/helpers/validation.js` for the runner itself; this page is the
 * reference for the JSON schema it reads.
 *
 * ## Param Spec JSON Format
 *
 * ```json
 * {
 *   "_note": "human-readable description — doc-only, never read by code",
 *   "type": "integer" | "float" | "float32array" | "string" | "srotm_param" | "complex32" | "complex32array",
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
 * `device.json` is the one spec with no `type`: it only lists `invalid`
 * entries, and the device itself comes from `runtimeBaselines`.
 *
 * ## `type` and Its Matching `range` Shape
 *
 * `range`'s shape depends on `type` — they're not interchangeable:
 *
 * | `type` | `range` shape | Used by |
 * |---|---|---|
 * | `integer` | `{ min, max }` | n, m, k, incx, incy, lda, ld (and ldb, ldc through `ld`) |
 * | `float` | `{ min, max }` | alpha, beta, cosine (`c`), `s` |
 * | `float32array` | `{ elementMin, elementMax }` | x, y, A, B, C |
 * | `string` | none — a top-level `values` array instead, e.g. `"values": ["lower", "upper"]` | uplo, trans, layout, diag, side |
 * | `srotm_param` | `{ flags: [...], coeff: { min, max } }` — srotm/drotm only | param |
 * | `complex32` | `{ min, max }`, applied to each of `re`/`im`; baseline `{ re, im }` | alphaComplex (cscal's alpha) |
 * | `complex32array` | `{ elementMin, elementMax }` | xComplex (cscal's x) |
 *
 * Array specs also carry `dependsOn` — the scalar params (`n`, `incx`,
 * `lda`, ...) their required length is computed from. `A`/`B`/`C`'s
 * `dependsOn` differs by BLAS level (e.g. Level 2's `A` depends on
 * `["m", "n", "lda"]`; Level 3's shares an inner dimension `k` instead).
 * Rather than a separate file per level, `A.json` carries a `"level-3"`
 * override key with its own `dependsOn`/`invalid`/`edge` — fetched via
 * `loadParam('A')['level-3']` when a Level 3 routine needs it (see `A.json`'s
 * own `_note`). No other param currently needs a level override.
 *
 * ## Double-Precision Specs Are Derived, Not Stored
 *
 * No file declares a `float64array` or `float64` type. Asking for a name
 * ending in `64` — `loadParam("x64")`, `"A64"`, `"alpha64"`, `"param64"`, … —
 * loads the f32 spec without the suffix and derives the f64 one on the fly
 * (`derive64` in `tests/helpers/validation.js`):
 *
 * - `float32array` (and `srotm_param`) become `float64array`, `float` becomes
 *   `float64`; everything else (`dependsOn`, `range`, scenarios) is shared.
 * - Every `invalid` error message has `Float32Array` replaced with
 *   `Float64Array`.
 * - Vector specs gain a `wrongDtypeGpuVector` case and matrix specs a
 *   `wrongDtypeGpuMatrix` case: a GPU-resident operand backed by a
 *   `Float32Array` must be rejected with `must be a Float64Array-backed …`.
 *
 * So one file per parameter covers both precisions, and the two can never
 * disagree about ranges or edge cases.
 *
 * ## Entry Types
 *
 * Entries in `invalid` and `edge` are resolved by one of three forms:
 *
 * **value** — a literal value substituted directly (an array literal becomes
 * the spec's typed array, `{ re, im }` a `Complex32`):
 * ```json
 * { "value": 0, "error": "must be positive", "label": "zero" }
 * ```
 *
 * **special** — a named non-serialisable value (`NaN`, `Infinity`,
 * `-Infinity`, `null`, `undefined`, `string`, `array`, `object`, `number`):
 * ```json
 * { "special": "NaN", "error": "must be integers", "label": "NaN" }
 * ```
 *
 * **scenario** — a named construction rule:
 *
 * - **vectors and matrices** (including `complex32array`): `"minimal"`
 *   (exactly the minimum valid length, e.g. `(n-1)*inc+1` for a vector) and
 *   `"tooShort"` (one element short);
 * - **srotm/drotm `param`**: `"tooShort"`, `"tooLong"`, `"identity"`,
 *   `"fullMatrix"`, `"diagOne"`, `"offDiagOne"`;
 * - **`complex32`**: `"nanRe"`, `"nanIm"`, `"infRe"`, `"infIm"` — a value
 *   with one bad component;
 * - **GPU-resident dtype mismatch**: `"wrongDtypeGpuVector"`,
 *   `"wrongDtypeGpuMatrix"` — added automatically to derived f64 specs (see
 *   above) and written explicitly in `xComplex.json`.
 *
 * ```json
 * { "scenario": "tooShort", "error": "does not have enough elements", "label": "..." }
 * ```
 *
 * ## Baseline Substitution
 *
 * Every scalar and string spec supplies its own explicit `"baseline"` value;
 * array specs are built as the spec's own typed array (`Float32Array`,
 * `Float64Array` or `Complex32Array`) and, without a baseline, sized
 * automatically from their `dependsOn` dimensions. For each test case,
 * exactly one param is replaced with the invalid or edge value while
 * everything else stays at baseline — isolating the parameter under test. The
 * device is the only param with no static baseline; it's supplied at runtime
 * via `runtimeBaselines`.
 *
 * ## The 27 Params
 *
 * 27 logical parameter names, from 25 files — `ldb`/`ldc` don't get their
 * own file, they just reuse `ld.json` (loaded via `loadParam("ld")`) for the
 * same generic leading-dimension check. Each array, float and `param` spec
 * also has its derived `…64` form.
 *
 * - **Integers**: `n`, `m`, `k`, `incx`, `incy`, `lda`, `ldb`, `ldc`, `ld`
 *   (generic Level 3 leading-dimension check reused across routines)
 * - **Floats**: `alpha`, `beta`, `cosine` (`c`), `s`
 * - **Strings**: `uplo`, `trans`, `layout`, `diag`, `side`
 * - **Arrays**: `x`, `y`, `A`, `B`, `C`
 * - **Complex**: `alphaComplex`, `xComplex` (cscal)
 * - **One-off**: `param` (srotm/drotm's 5-element `[flag, h11, h21, h12, h22]`),
 *   `device`
 *
 * @module tests/validation
 */
