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
export function getPowerPreference() {
  return process.env.WGBLAS_POWER_PREFERENCE === "low-power" ? "low-power" : "high-performance";
}
