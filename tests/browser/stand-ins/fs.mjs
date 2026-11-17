// fs in the browser. The only files the tests read at runtime are
// tests/helpers/validation.js's parameter specs (tests/validation/params/);
// bundle.mjs embeds that directory as the "validation-params" module, and
// readFileSync serves its files by name. Any other read throws.
import params from "validation-params";

export function readFileSync(path) {
  const name = String(path).split(/[\\/]/).pop();
  if (Object.hasOwn(params, name)) return params[name];
  throw new Error(`fs.readFileSync(${path}): not available in the browser`);
}
