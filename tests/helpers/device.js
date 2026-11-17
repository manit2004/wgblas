/**
 * GPU power preference for tests, overridable via the `WGBLAS_POWER_PREFERENCE`
 * env var — e.g. `make test-isamax ARGS=low-power` (see tests/tests.mk).
 *
 * Node's built-in test runner doesn't pass trailing CLI args through to
 * `process.argv` the way a plain `node script.js` invocation does (unlike
 * benchmarks/*, which read `process.argv[2]` directly per benchmarks/bench.mk's
 * `$(ARGS)` — a `node --test file.js low-power` invocation silently drops
 * "low-power" instead), so this goes through an env var the Makefile sets
 * from `$(ARGS)` instead.
 * @returns {"low-power"|"high-performance"}
 */
// Environment variables, or none in a browser (make test-browser), which has
// no process.
const env = globalThis.process?.env ?? {};

/**
 * `skip` option for tests of the "webgpu" npm package's Dawn specifically (a
 * writable adapter.info, Dawn toggles): a skip reason when the tests run on
 * wgpu (Deno's WebGPU, via `make test-wgpu`) or in a browser (`make
 * test-browser`), else false.
 */
export const dawnOnly = globalThis.Deno
  ? "Dawn only (running on wgpu)"
  : typeof window !== "undefined"
    ? "the webgpu npm package's Dawn only (running in a browser)"
    : false;

/**
 * `skip` option for tests that fake a browser inside Node by replacing
 * `window` and `navigator`: a skip reason in a real browser (`make
 * test-browser`), where both are fixed and the real ones already apply, else
 * false.
 */
export const nodeOnly =
  typeof window !== "undefined"
    ? "fakes a browser in Node; a real browser's window can't be replaced"
    : false;

/**
 * `skip` option for tests that hold two devices on the same GPU at once: a
 * skip reason when `make test-wgpu`'s probe found this GPU can't (see
 * tests/wgpu/probe.mjs), else false.
 */
export const multiDevice = env.WGBLAS_SINGLE_DEVICE
  ? "a second device breaks wgpu on this GPU (tests/wgpu/probe.mjs)"
  : false;

export function getPowerPreference() {
  return env.WGBLAS_POWER_PREFERENCE === "low-power"
    ? "low-power"
    : "high-performance";
}
