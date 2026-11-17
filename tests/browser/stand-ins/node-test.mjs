// node:test in the browser: the part of its API the test files use — test(),
// before(), after() at the top level; t.test(), t.skip(), t.diagnostic(),
// t.after() on a test's context; the { skip } option. Once a test file's
// module has run (registering its tests), run.mjs calls
// globalThis.__wgblasRunTests() in the page.
//
// As in node:test, a file's top-level tests run one after another, and so do
// a test's subtests, awaited or not: GPU tests share a device, so nothing
// here overlaps. A failing subtest fails its parent.

/**
 * One test's outcome, as __wgblasRunTests() returns it and run.mjs reports it.
 * @typedef {object} TestResult
 * @property {string[]} path - test names, from the top-level test down
 * @property {"pass" | "fail" | "skip"} status
 * @property {string} [reason] - why it was skipped
 * @property {string} [error] - why it failed: the error and its stack
 * @property {string[]} [diagnostics] - its t.diagnostic() messages
 * @property {number} [ms] - how long it ran
 */

const tests = [];
const beforeHooks = [];
const afterHooks = [];

// Each result as it's recorded, and to run.mjs as it happens (the page's
// __wgblasReport, from page.exposeFunction), so a slow or hung file shows how
// far it got.
function record(results, result) {
  results.push(result);
  globalThis.__wgblasReport?.(result);
}

function args(name, options, fn) {
  return typeof options === "function"
    ? { name, options: {}, fn: options }
    : { name, options: options ?? {}, fn };
}

export function test(name, options, fn) {
  tests.push(args(name, options, fn));
}
export function before(fn) {
  beforeHooks.push(fn);
}
export function after(fn) {
  afterHooks.push(fn);
}

// The error and the top of its stack. A stack starts with the message, which
// can span lines (assert's diffs do), so the frames are what follows it.
function describeError(err) {
  if (!(err instanceof Error)) return String(err);
  const head = `${err.name}: ${err.message}`;
  const stack = err.stack ?? "";
  const frames = (stack.startsWith(head) ? stack.slice(head.length) : stack)
    .split("\n")
    .filter((line) => line.trim().startsWith("at "))
    .slice(0, 5);
  return [head, ...frames].join("\n");
}

class Context {
  constructor(path, results) {
    this.path = path;
    this.name = path[path.length - 1];
    this.results = results;
    this.queue = Promise.resolve();
    this.subtestFailed = false;
    this.skipReason = undefined;
    this.diagnostics = [];
    this.afterHooks = [];
  }

  test(name, options, fn) {
    const sub = args(name, options, fn);
    this.queue = this.queue.then(async () => {
      const ok = await run(sub, this.path, this.results);
      if (!ok) this.subtestFailed = true;
    });
    return this.queue;
  }

  skip(message = "") {
    this.skipReason = message;
  }

  diagnostic(message) {
    this.diagnostics.push(String(message));
  }

  after(fn) {
    this.afterHooks.push(fn);
  }
}

// Runs one test and its subtests; records each in results. True unless it
// failed.
async function run({ name, options, fn }, parentPath, results) {
  const path = [...parentPath, name];
  if (options.skip) {
    const reason = typeof options.skip === "string" ? options.skip : "";
    record(results, { path, status: "skip", reason });
    return true;
  }
  const t = new Context(path, results);
  const start = performance.now();
  let error;
  try {
    await fn(t);
  } catch (err) {
    error = err;
  }
  try {
    await t.queue; // subtests started but not awaited
  } catch (err) {
    error ??= err;
  }
  for (const hook of t.afterHooks.reverse()) {
    try {
      await hook();
    } catch (err) {
      error ??= err;
    }
  }
  const ms = performance.now() - start;
  const failed = error !== undefined || t.subtestFailed;
  record(results, {
    path,
    status: failed ? "fail" : t.skipReason !== undefined ? "skip" : "pass",
    reason: t.skipReason,
    error: error === undefined ? undefined : describeError(error),
    diagnostics: t.diagnostics,
    ms,
  });
  return !failed;
}

globalThis.__wgblasRunTests = async () => {
  const results = [];
  let hookError;
  for (const hook of beforeHooks) {
    try {
      await hook();
    } catch (err) {
      hookError = err;
      break;
    }
  }
  if (hookError)
    record(results, {
      path: ["before()"],
      status: "fail",
      error: describeError(hookError),
    });
  else for (const t of tests) await run(t, [], results);
  for (const hook of afterHooks) {
    try {
      await hook();
    } catch (err) {
      record(results, {
        path: ["after()"],
        status: "fail",
        error: describeError(err),
      });
    }
  }
  return results;
};
