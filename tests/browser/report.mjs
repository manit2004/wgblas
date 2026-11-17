// Prints test results, in the spirit of node --test's spec reporter.

/** @typedef {import("./stand-ins/node-test.mjs").TestResult} TestResult */

const indented = (text, indent) =>
  indent + text.split("\n").join(`\n${indent}`);

/**
 * Prints one test's result, indented by its depth. Results arrive as each
 * test finishes, so subtests print before their parent.
 * @param {TestResult} r
 */
export function printResult(r) {
  const indent = "  ".repeat(r.path.length);
  const name = r.path[r.path.length - 1];
  if (r.status === "pass")
    console.log(`${indent}✔ ${name} (${Math.round(r.ms)}ms)`);
  else if (r.status === "skip")
    console.log(`${indent}﹣ ${name} # SKIP${r.reason ? ` ${r.reason}` : ""}`);
  else {
    console.log(`${indent}✖ ${name}`);
    if (r.error) console.log(indented(r.error, `${indent}  `));
  }
  for (const d of r.diagnostics ?? []) console.log(`${indent}  ℹ ${d}`);
}

/**
 * Prints a failure that belongs to no test: an uncaught error, a timeout, a
 * crashed page, a file that wouldn't bundle.
 * @param {string} message
 */
export function printProblem(message) {
  console.log(`  ✖ ${indented(message, "    ").trimStart()}`);
}

/** Prints what a test page logged to its console. */
export function printConsole(text) {
  if (text) console.log(indented(text, "    "));
}

/**
 * Prints the run's totals and which files failed or need Node.
 * @param {{ passed: string[], failed: string[], nodeOnly: string[],
 *   tests: Record<TestResult["status"], number> }} summary - file names, and
 *   test counts (every test and subtest) by status
 */
export function printSummary({ passed, failed, nodeOnly, tests }) {
  const ran = passed.length + failed.length;
  console.log(
    `browser: ${passed.length}/${ran} files passed; ` +
      `tests: ${tests.pass} passed, ${tests.fail} failed, ${tests.skip} skipped`,
  );
  if (nodeOnly.length)
    console.log(
      `not run, need Node:\n${nodeOnly.map((f) => `  ${f}`).join("\n")}`,
    );
  if (failed.length)
    console.log(`failed:\n${failed.map((f) => `  ${f}`).join("\n")}`);
}
