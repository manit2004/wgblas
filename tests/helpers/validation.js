/**
 * Validation test runner driven by JSON param specs.
 *
 * Each routine declares its parameters by calling `loadParam(name)` which reads
 * a JSON file from `tests/validation/params/`. The JSON describes what values
 * are valid, what values must throw, and boundary cases that must not throw.
 * `runValidation` iterates those cases automatically.
 *
 * ## Param Spec Format
 *
 * ```json
 * {
 *   "type": "integer" | "float" | "float32array" | "float64array",
 *   "baseline": 1,
 *   "dependsOn": ["n"],
 *   "range": { "min": 1, "max": 4 },
 *   "invalid": [
 *     { "value": 0,            "error": "must be positive",           "label": "zero" },
 *     { "special": "NaN",      "error": "must be integers",           "label": "NaN" },
 *     { "scenario": "tooShort","error": "does not have enough elements","label": "..." }
 *   ],
 *   "edge": [
 *     { "value": 1, "label": "incx=1 contiguous access" }
 *   ]
 * }
 * ```
 *
 * Each entry in `invalid` must cause the routine to throw with a message
 * containing the specified `error` string. Each entry in `edge` must not throw.
 *
 * ## How runValidation Works
 *
 * A baseline args object is built from each spec's `"baseline"` field (scalars
 * used as-is, arrays wrapped as `Float32Array`). `float32array` params without a
 * baseline are sized automatically via `resolveNdArray` using `dependsOn`.
 * Then for each test case, exactly one param is replaced with the invalid or edge
 * value while the rest stay at baseline — isolating the parameter under test.
 *
 * @module tests/helpers/validation
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import assert from "node:assert/strict";

const PARAMS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../validation/params",
);

/**
 * Reads and parses one or more param specs from `tests/validation/params/`.
 * Pass a string to get one spec; pass an array to get a record keyed by name.
 * A name ending in `64` (e.g. `"x64"`) derives a Float64Array variant of the
 * base spec (`"x"`) on the fly, rather than requiring a hand-duplicated file —
 * see `derive64`.
 * @public
 */
export function loadParam(name) {
  if (Array.isArray(name))
    return Object.fromEntries(name.map((n) => [n, loadParam(n)]));
  if (name.endsWith("64")) return derive64(loadParam(name.slice(0, -2)));
  return JSON.parse(readFileSync(join(PARAMS_DIR, `${name}.json`), "utf8"));
}

/**
 * Derives a Float64Array param spec from its Float32Array base (e.g. `"x"` →
 * `"x64"`), for routines that emulate f64 on the GPU (e.g. dasum). Only
 * `type` and the `"FloatNNArray"` substring in each `invalid.error` message
 * actually differ between the two — everything else (dependsOn, range,
 * scenarios) is identical, so this rewrites just those rather than
 * maintaining a whole second spec file per array param.
 * @internal
 */
function derive64(base) {
  return {
    ...base,
    type: "float64array",
    invalid: base.invalid?.map((entry) => ({
      ...entry,
      error: typeof entry.error === "string"
        ? entry.error.replace("Float32Array", "Float64Array")
        : entry.error,
    })),
  };
}

const SPECIALS = {
  NaN: NaN,
  Infinity: Infinity,
  "-Infinity": -Infinity,
  null: null,
  undefined: undefined,
  string: "100",
  array: [],
  object: {},
  number: 42,
};


/**
 * Computes the logical `{ outer, inner }` shape of a matrix param from its
 * `dependsOn` and `dims` — `inner` doubles as the minimum valid value for
 * whichever `ld*` field it depends on. Returns `null` for non-matrix specs
 * (no `ld*` in `dependsOn`).
 *
 * - `dependsOn` has a `trans*` field and `"k"` → Level 3 matrix whose shape
 *   swaps between (m,k)/(k,m) (A~transA) or (k,n)/(n,k) (B~transB) with its
 *   own trans flag — see A.json's "level-3" section / B.json.
 * - `dependsOn` has `"m"` and `"n"` (no trans) → plain matrix: m×n
 *   (row-major) or n×m (column-major) — sgemv/ssyr2/etc.'s A, sgemm's C.
 * - `dependsOn` has `"n"` alone → symmetric: square n×n (ssymv/ssyr's A).
 *
 * Shared by `ndArrayLen` (array sizing) and `buildArb` (fixtures, to chain
 * `ld*` in `[inner, inner+pad]`) so the two never drift apart.
 * @public
 */
export function matrixShape(dependsOn, dims) {
  const deps = new Set(dependsOn ?? []);
  const transKey = dependsOn?.find((d) => d.startsWith("trans"));
  const isCM = dims.layout === "column-major";
  if (transKey && deps.has("k")) {
    const [dim1, dim2] = deps.has("m") ? [dims.m, dims.k] : [dims.k, dims.n];
    const rows = isCM ? dim2 : dim1;
    const cols = isCM ? dim1 : dim2;
    const isNoTrans = (dims[transKey] ?? "no-transpose") === "no-transpose";
    return isNoTrans ? { outer: rows, inner: cols } : { outer: cols, inner: rows };
  }
  if (deps.has("m") && deps.has("n"))
    return isCM ? { outer: dims.n, inner: dims.m } : { outer: dims.m, inner: dims.n };
  if (deps.has("n"))
    return { outer: dims.n, inner: dims.n };
  return null;
}

/**
 * Computes the minimum valid Float32Array length for a param from its `dependsOn` and `dims`.
 *
 * - `dependsOn` contains an `"ld*"` field → matrix, sized via `matrixShape`:
 *   `(outer-1)*ld+inner`
 * - `dependsOn` contains `"trans"` (and `m` is in dims) → L2 vector: size from `dims.trans`
 * - otherwise → L1 vector: `(n-1)*inc+1`
 *
 * Shared by `resolveNdArray` (validation) and `buildArb` (fixtures) to keep formulas in sync.
 * @public
 */
export function ndArrayLen(dependsOn, dims) {
  const deps = new Set(dependsOn ?? []);
  const ldKey = dependsOn?.find((d) => d.startsWith("ld"));
  if (ldKey) {
    const shape = matrixShape(dependsOn, dims);
    if (shape) return Math.max(0, (shape.outer - 1) * dims[ldKey] + shape.inner);
  }
  if (deps.has("trans") && deps.has("m") && deps.has("n") && "m" in dims) {
    const isNoTrans = (dims.trans ?? "no-transpose") === "no-transpose";
    const dim = deps.has("incx")
      ? (isNoTrans ? dims.n : dims.m)
      : (isNoTrans ? dims.m : dims.n);
    const inc = deps.has("incx") ? (dims.incx ?? 1) : (dims.incy ?? 1);
    return (dim - 1) * inc + 1;
  }
  // Vector sized by m alone, no trans involved (sger's x: length m, independent of n).
  if (deps.has("m") && !deps.has("n") && !ldKey && !deps.has("trans")) {
    const inc = deps.has("incx") ? (dims.incx ?? 1) : (dims.incy ?? 1);
    return (dims.m - 1) * inc + 1;
  }
  const n = dims.n ?? 4;
  const inc = deps.has("incx") ? (dims.incx ?? 1) : (dims.incy ?? 1);
  return (n - 1) * inc + 1;
}

/**
 * Builds a typed array for a test scenario using `ndArrayLen` for the normal path,
 * or `xN`/`yN` with pre-patched strides for the oversize baseline-building path.
 * `type: "float64array"` builds a Float64Array (e.g. dasum's x); everything else
 * (including the default) builds a Float32Array.
 * @internal
 */
function resolveNdArray(scenario, dependsOn, baselines, oversize = false, type = "float32array") {
  const deps = new Set(dependsOn ?? []);
  let minLen;
  if (oversize && deps.has("trans") && deps.has("m") && deps.has("n") && "m" in baselines) {
    const dim = deps.has("incx") ? (baselines.xN ?? baselines.n) : (baselines.yN ?? baselines.n);
    const inc = deps.has("incx") ? (baselines.incx ?? 1) : (baselines.incy ?? 1);
    minLen = (dim - 1) * inc + 1;
  } else {
    minLen = ndArrayLen(dependsOn, baselines);
  }

  const Ctor = type === "float64array" ? Float64Array : Float32Array;
  if (scenario === "minimal")  return new Ctor(minLen).fill(1);
  if (scenario === "tooShort") return new Ctor(Math.max(0, minLen - 1)).fill(1);
  throw new Error(`Unknown array scenario: "${scenario}"`);
}

/**
 * Builds a Float32Array for a named srotm `param` scenario.
 * @param scenario one of `"tooShort"` (4 elements), `"tooLong"` (6 elements),
 *   `"identity"` (flag=−2), `"fullMatrix"` (flag=−1), `"diagOne"` (flag=0), `"offDiagOne"` (flag=1)
 * @returns Float32Array of length 5 with the appropriate flag and coefficients
 * @internal
 */
export function resolveParam(scenario) {
  if (scenario === "tooShort")  return new Float32Array(4).fill(0);
  if (scenario === "tooLong")   return new Float32Array(6).fill(0);
  if (scenario === "identity")  return new Float32Array([-2, 0, 0, 0, 0]);
  if (scenario === "fullMatrix") return new Float32Array([-1, 0.5, -0.5, 0.5, 0.5]);
  if (scenario === "diagOne")   return new Float32Array([0, 0, 0.5, -0.5, 0]);
  if (scenario === "offDiagOne") return new Float32Array([1, 0.5, 0, 0, 0.5]);
  throw new Error(`Unknown param scenario: "${scenario}"`);
}

/**
 * Resolves a single JSON spec entry to a concrete JS value.
 * Dispatches on `entry.value` (literal), `entry.special` (named non-serialisable),
 * or `entry.scenario` (named construction rule for arrays and `param`).
 * A literal `entry.value` for an array-typed param (`type` is `"float32array"`/
 * `"float64array"`) is coerced into the matching typed array — routines whose
 * shape doesn't fit `dependsOn`/`scenario`'s sizing formulas (e.g. sgemm, whose
 * A/B shape depends on transA/transB rather than a static m/n pair) can still
 * spell out exact arrays literally instead of relying on that machinery.
 * @param entry one entry from `spec.invalid` or `spec.edge`
 * @param paramName name of the parameter being tested (selects `resolveParam` vs `resolveNdArray`)
 * @param baselines current baseline args (needed to size arrays from dimensions and stride)
 * @param dependsOn `spec.dependsOn` array for the param under test — passed to `resolveNdArray`
 * @param type `spec.type` for the param under test — `"float64array"` builds a Float64Array
 * @returns the concrete JS value to substitute for the param under test
 * @internal
 */
export function resolveEntry(entry, paramName, baselines, dependsOn, type) {
  if ("scenario" in entry) {
    if (paramName === "param") return resolveParam(entry.scenario);
    return resolveNdArray(entry.scenario, dependsOn, baselines, false, type);
  }
  if ("value" in entry) {
    if (Array.isArray(entry.value) && (type === "float32array" || type === "float64array")) {
      const Ctor = type === "float64array" ? Float64Array : Float32Array;
      return new Ctor(entry.value);
    }
    return entry.value;
  }
  if ("special" in entry) {
    if (!(entry.special in SPECIALS))
      throw new Error(`Unknown special value: "${entry.special}"`);
    return SPECIALS[entry.special];
  }
  throw new Error(`Cannot resolve entry: ${JSON.stringify(entry)}`);
}

const ARRAY_TYPES = new Set(["float32array", "float64array"]);

/**
 * Builds baseline typed arrays for all `float32array`/`float64array` specs that
 * lack a static baseline. Matrix params (`dependsOn` includes `"lda"`) are sized
 * with `lda = lda.range.max` so the baseline array survives lda edge cases
 * without triggering a length error.
 * @param specs record of param specs keyed by param name
 * @param baselines baseline args object — mutated in place
 * @internal
 */
function buildArrayBaselines(specs, baselines) {
  for (const [name, spec] of Object.entries(specs)) {
    if (!ARRAY_TYPES.has(spec.type) || baselines[name]) continue;
    const deps = new Set(spec.dependsOn ?? []);
    if (deps.has("lda")) {
      const ldaMax = specs.lda?.range?.max ?? baselines.lda ?? baselines.n ?? 4;
      baselines[name] = resolveNdArray("minimal", spec.dependsOn, { ...baselines, lda: ldaMax }, true, spec.type);
    } else {
      // Patch incx/incy to range max so the baseline array survives stride edge cases.
      const patched = { ...baselines };
      if (deps.has("incx") && specs.incx?.range?.max) patched.incx = specs.incx.range.max;
      if (deps.has("incy") && specs.incy?.range?.max) patched.incy = specs.incy.range.max;
      baselines[name] = resolveNdArray("minimal", spec.dependsOn, patched, true, spec.type);
    }
  }
}

/**
 * For L2 routines, sets `baselines.xN` and `baselines.yN` to `max(m, n)` so
 * baseline x/y are long enough for both trans orientations during edge-case testing.
 * No-ops for L1 routines (no spec declares `dependsOn` containing `"trans"`).
 * @param specs record of param specs keyed by param name
 * @param baselines baseline args object — mutated in place
 * @internal
 */
function applyTransBaselines(specs, baselines) {
  if (!Object.values(specs).some((s) => s.dependsOn?.includes("trans"))) return;
  if (!("m" in baselines) || !("n" in baselines)) return;
  const maxDim = Math.max(baselines.m, baselines.n);
  if (!baselines.xN) baselines.xN = maxDim;
  if (!baselines.yN) baselines.yN = maxDim;
}

/**
 * Runs all invalid and edge cases defined in `specs` against `call`.
 *
 * Invalid cases assert that the routine throws with the expected message.
 * Edge cases assert that the routine does not throw.
 *
 * @param t node:test context
 * @param specs record mapping param names to their loaded JSON specs
 * @param call function that invokes the routine under test with an args object
 * @param runtimeBaselines values that cannot be defaulted statically (e.g. `{ device }`)
 * @returns promise that resolves when all cases pass
 * @public
 */
export async function runValidation(t, specs, call, runtimeBaselines = {}) {
  const baselines = {};
  for (const [name, spec] of Object.entries(specs)) {
    if ("baseline" in spec) {
      if (Array.isArray(spec.baseline)) {
        const Ctor = spec.type === "float64array" ? Float64Array : Float32Array;
        baselines[name] = new Ctor(spec.baseline);
      } else {
        baselines[name] = spec.baseline;
      }
    }
  }
  Object.assign(baselines, runtimeBaselines);

  if ("device" in specs && !baselines.device)
    throw new Error("device spec requires runtimeBaselines.device");

  applyTransBaselines(specs, baselines);
  buildArrayBaselines(specs, baselines);
  
  await runInvalidCases(t, specs, baselines, call);
  await runEdgeCases(t, specs, baselines, call);
}

/**
 * Substitutes each invalid value in turn and asserts the routine throws with the expected message.
 * @internal
 */
async function runInvalidCases(t, specs, baselines, call) {
  for (const [paramName, spec] of Object.entries(specs)) {
    for (const entry of spec.invalid ?? []) {
      const label = entry.label ?? JSON.stringify(entry);
      await t.test(`${paramName} invalid: ${label}`, async () => {
        const args = { ...baselines, [paramName]: resolveEntry(entry, paramName, baselines, spec.dependsOn, spec.type) };
        await assert.rejects(
          () => call(args),
          (err) => {
            assert.ok(
              err.message.includes(entry.error),
              `Expected error containing "${entry.error}", got: "${err.message}"`,
            );
            return true;
          },
        );
      });
    }
  }
}

/**
 * Substitutes each boundary value in turn and asserts the routine does not throw.
 * @internal
 */
async function runEdgeCases(t, specs, baselines, call) {
  for (const [paramName, spec] of Object.entries(specs)) {
    for (const entry of spec.edge ?? []) {
      const label = entry.label ?? JSON.stringify(entry);
      await t.test(`${paramName} edge: ${label}`, async () => {
        const args = { ...baselines, [paramName]: resolveEntry(entry, paramName, baselines, spec.dependsOn, spec.type) };
        await call(args);
      });
    }
  }
}
