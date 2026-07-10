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
 *   "type": "integer" | "float" | "float32array",
 *   "range": { "min": 1, "max": 4 },
 *   "invalid": [
 *     { "value": 0,       "error": "must be positive", "label": "zero" },
 *     { "special": "NaN", "error": "must be integers", "label": "NaN" },
 *     { "scenario": "tooShort", "error": "does not have enough elements", "label": "..." }
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
 * A baseline args object is built with safe defaults for every param the routine
 * uses (e.g. `n=100`, `incx=1`, `x` sized to `(n-1)*10+1`). Then for each test
 * case, exactly one param is replaced with the invalid or edge value while the
 * rest stay at baseline — isolating the parameter under test.
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
 * Reads and parses `tests/validation/params/<name>.json`.
 * @returns the parsed param spec object with `type`, `range`, `invalid`, and `edge` fields
 * @public
 */
export function loadParam(name) {
  return JSON.parse(readFileSync(join(PARAMS_DIR, `${name}.json`), "utf8"));
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

const SCALAR_DEFAULTS = { n: 100, incx: 1, incy: 1, alpha: 1.0, c: 1.0, s: 0.0 };

// Default valid param for srotm (flag=0, identity-like coefficients)
const PARAM_DEFAULT = new Float32Array([0, 1, 0, 0, 1]);

/**
 * Builds a Float32Array for a named vector scenario.
 * @param scenario `"minimal"` → exactly `(n-1)*inc+1` elements (minimum valid length);
 *                 `"tooShort"` → one element short, must cause a length error
 * @param n baseline value of `n`
 * @param inc baseline stride (`incx` or `incy`)
 * @returns Float32Array sized and filled according to the scenario
 */
export function resolveVector(scenario, n, inc) {
  if (scenario === "minimal")
    return new Float32Array((n - 1) * inc + 1).fill(1);
  if (scenario === "tooShort")
    return new Float32Array(Math.max(0, (n - 1) * inc)).fill(1);
  throw new Error(`Unknown vector scenario: "${scenario}"`);
}

/**
 * Builds a Float32Array for a named srotm `param` scenario.
 * @param scenario one of `"tooShort"` (4 elements), `"tooLong"` (6 elements),
 *   `"identity"` (flag=−2), `"fullMatrix"` (flag=−1), `"diagOne"` (flag=0), `"offDiagOne"` (flag=1)
 * @returns Float32Array of length 5 with the appropriate flag and coefficients
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
 * or `entry.scenario` (named construction rule for vectors and `param`).
 * @param entry one entry from `spec.invalid` or `spec.edge`
 * @param paramName name of the parameter being tested (used to select vector vs param resolution)
 * @param baselines current baseline args (needed to size vectors from `n` and stride)
 * @returns the concrete JS value to substitute for the param under test
 */
export function resolveEntry(entry, paramName, baselines) {
  if ("scenario" in entry) {
    if (paramName === "param") return resolveParam(entry.scenario);
    const n = baselines.n;
    const inc = paramName === "x" ? baselines.incx : baselines.incy;
    return resolveVector(entry.scenario, n, inc);
  }
  if ("value" in entry) return entry.value;
  if ("special" in entry) {
    if (!(entry.special in SPECIALS))
      throw new Error(`Unknown special value: "${entry.special}"`);
    return SPECIALS[entry.special];
  }
  throw new Error(`Cannot resolve entry: ${JSON.stringify(entry)}`);
}

/**
 * Runs all invalid and edge cases defined in `specs` against `call`.
 *
 * Invalid cases assert that the routine throws with the expected message.
 * Edge cases assert that the routine does not throw.
 *
 * @param t - node:test context
 * @param specs - object mapping param names to their loaded JSON specs
 * @param call - function that invokes the routine with an args object
 * @param runtimeBaselines - values that cannot be defaulted statically (e.g. `device`)
 * @returns promise that resolves when all cases pass, or rejects on the first assertion failure
 * @public
 */
export async function runValidation(t, specs, call, runtimeBaselines = {}) {
  const baselines = {};
  for (const name of Object.keys(specs)) {
    if (name in SCALAR_DEFAULTS) baselines[name] = SCALAR_DEFAULTS[name];
  }
  const n = baselines.n ?? 100;
  if ("x" in specs) baselines.x = new Float32Array((n - 1) * 10 + 1).fill(1);
  if ("y" in specs) baselines.y = new Float32Array((n - 1) * 10 + 1).fill(1);
  if ("param" in specs) baselines.param = PARAM_DEFAULT;
  if ("device" in specs) {
    if (!("device" in runtimeBaselines))
      throw new Error("device spec requires runtimeBaselines.device");
    baselines.device = runtimeBaselines.device;
  }

  for (const [paramName, spec] of Object.entries(specs)) {
    for (const invalidCase of spec.invalid ?? []) {
      const label = invalidCase.label ?? JSON.stringify(invalidCase);
      await t.test(`${paramName} invalid: ${label}`, async () => {
        const args = { ...baselines };
        args[paramName] = resolveEntry(invalidCase, paramName, baselines);
        await assert.rejects(
          () => call(args),
          (err) => {
            assert.ok(
              err.message.includes(invalidCase.error),
              `Expected error containing "${invalidCase.error}", got: "${err.message}"`,
            );
            return true;
          },
        );
      });
    }
  }

  for (const [paramName, spec] of Object.entries(specs)) {
    for (const edgeCase of spec.edge ?? []) {
      const label = edgeCase.label ?? JSON.stringify(edgeCase);
      await t.test(`${paramName} edge: ${label}`, async () => {
        const args = { ...baselines };
        args[paramName] = resolveEntry(edgeCase, paramName, baselines);
        await call(args);
      });
    }
  }
}
