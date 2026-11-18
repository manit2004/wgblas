// A test run as text, built from the test page's events (runner.js lists
// them), in the spirit of node --test's spec reporter. run.mjs prints it as
// the events arrive (report.mjs); the page keeps it for its "Copy report"
// button. Either way it reads the same, and ends with the same summary.

/** @typedef {import("../stand-ins/node-test.mjs").TestResult} TestResult */

/**
 * The run's totals, by file and by test.
 * @typedef {object} Summary
 * @property {string[]} passed - test files that passed
 * @property {string[]} failed - test files that failed, and failures that
 *   belong to no file (in parentheses)
 * @property {string[]} nodeOnly - test files not run because they need Node,
 *   each with why
 * @property {Record<TestResult["status"], number>} tests - every test and
 *   subtest, by status
 */

const indented = (text, indent) =>
  indent + text.split("\n").join(`\n${indent}`);

/**
 * One test's result, indented by its depth. Results arrive as each test
 * finishes, so subtests come before their parent.
 * @param {TestResult} r
 */
export function formatResult(r) {
  const indent = "  ".repeat(r.path.length);
  const name = r.path[r.path.length - 1];
  const lines =
    r.status === "pass"
      ? [`${indent}✔ ${name} (${Math.round(r.ms)}ms)`]
      : r.status === "skip"
        ? [`${indent}﹣ ${name} # SKIP${r.reason ? ` ${r.reason}` : ""}`]
        : [
            `${indent}✖ ${name}`,
            ...(r.error ? [indented(r.error, `${indent}  `)] : []),
          ];
  for (const d of r.diagnostics ?? []) lines.push(`${indent}  ℹ ${d}`);
  return lines.join("\n");
}

/** A failure that belongs to no test: an uncaught error, a timeout. */
export function formatProblem(message) {
  return `  ✖ ${indented(message, "    ").trimStart()}`;
}

/**
 * The run's totals and which files failed or need Node.
 * @param {Summary} summary
 */
export function formatSummary({ passed, failed, nodeOnly, tests }) {
  const ran = passed.length + failed.length;
  const lines = [
    `browser: ${passed.length}/${ran} files passed; ` +
      `tests: ${tests.pass} passed, ${tests.fail} failed, ${tests.skip} skipped`,
  ];
  if (nodeOnly.length)
    lines.push(
      `not run, need Node:\n${nodeOnly.map((f) => `  ${f}`).join("\n")}`,
    );
  if (failed.length)
    lines.push(`failed:\n${failed.map((f) => `  ${f}`).join("\n")}`);
  return lines.join("\n");
}

/**
 * Follows a run's events, writing each as text and keeping the summary.
 * @param {object} options
 * @param {string[]} options.nodeOnly - test files that need Node, and why
 * @param {(text: string) => void} options.write - takes each piece of text,
 *   one or more lines
 */
export function createTranscript({ nodeOnly, write }) {
  const fresh = () => ({
    passed: [],
    failed: [],
    nodeOnly,
    tests: { pass: 0, fail: 0, skip: 0 },
  });
  let started = false;
  let fileFailed = false;
  const failure = (message) => {
    write(formatProblem(message));
    transcript.summary.failed.push(`(${message})`);
  };
  const transcript = {
    /** How to name the browser; by default, the name the page gives itself. */
    browser: undefined,
    /** @type {Summary} */
    summary: fresh(),
    /** How the page found no WebGPU adapter, if it didn't. */
    missingAdapter: undefined,

    /** A failure that belongs to no test file: the page crashed, say. */
    fail: failure,

    handle(event) {
      switch (event.type) {
        case "start":
          if (started) {
            write("\nThe page was reloaded; the run starts again.\n");
            transcript.summary = fresh();
          }
          started = true;
          transcript.browser ??= event.browser;
          break;
        case "adapter":
          write(
            `${transcript.browser}, WebGPU adapter: ` +
              `${event.adapter ?? `none: ${event.missing}`}\n`,
          );
          transcript.missingAdapter = event.missing;
          break;
        case "file-start":
          write(event.file);
          fileFailed = false;
          break;
        case "result":
          write(formatResult(event.result));
          transcript.summary.tests[event.result.status]++;
          if (event.result.status === "fail") fileFailed = true;
          break;
        case "console":
          if (event.text) write(indented(event.text, "    "));
          break;
        case "problem":
          if (event.file) {
            write(formatProblem(event.message));
            fileFailed = true;
          } else failure(event.message);
          break;
        case "file-end":
          (fileFailed
            ? transcript.summary.failed
            : transcript.summary.passed
          ).push(event.file);
          write("");
          break;
      }
    },
  };
  return transcript;
}
