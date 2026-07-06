import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import assert from "node:assert/strict";

const PARAMS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../validation/params",
);

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

function resolveVector(scenario, n, inc) {
  if (scenario === "minimal")
    return new Float32Array((n - 1) * inc + 1).fill(1);
  if (scenario === "tooShort")
    return new Float32Array(Math.max(0, (n - 1) * inc)).fill(1);
  throw new Error(`Unknown vector scenario: "${scenario}"`);
}

function resolveEntry(entry, paramName, baselines) {
  if ("scenario" in entry) {
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

export async function runValidation(t, specs, call, runtimeBaselines = {}) {
  const baselines = {};
  for (const name of Object.keys(specs)) {
    if (name in SCALAR_DEFAULTS) baselines[name] = SCALAR_DEFAULTS[name];
  }
  const n = baselines.n ?? 100;
  if ("x" in specs) baselines.x = new Float32Array((n - 1) * 10 + 1).fill(1);
  if ("y" in specs) baselines.y = new Float32Array((n - 1) * 10 + 1).fill(1);
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
