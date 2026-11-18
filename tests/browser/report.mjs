// Prints a test run as the test page reports it (page/runner.js lists its
// events), through the page's own transcript (page/transcript.js), so the
// terminal shows what the page's "Copy report" copies.
import { createTranscript, formatSummary } from "./page/transcript.js";

/** Prints the run's totals and which files failed or need Node. */
export function printSummary(summary) {
  console.log(formatSummary(summary));
}

/**
 * Follows the test page's events, printing each as it arrives.
 * @param {object} options
 * @param {string[]} options.nodeOnly - test files that need Node, and why
 * @returns the transcript (its browser, summary, missingAdapter), plus
 *   handle(event) for each event, fail(message) to end the run with a failure
 *   of its own (once the page is done, ignored), lastEventAt, and done, which
 *   resolves when the page says it's done or the run fails
 */
export function collectEvents({ nodeOnly }) {
  const transcript = createTranscript({
    nodeOnly,
    write: (text) => console.log(text),
  });
  const { handle, fail } = transcript;
  let finished = false;
  let resolveDone;
  const done = new Promise((resolve) => (resolveDone = resolve));
  const finish = () => {
    finished = true;
    resolveDone();
  };
  return Object.assign(transcript, {
    /** When the page last reported, once it has started. */
    lastEventAt: undefined,
    done,
    handle(event) {
      transcript.lastEventAt = Date.now();
      handle(event);
      if (event.type === "done") finish();
    },
    fail(message) {
      if (finished) return;
      fail(message);
      finish();
    },
  });
}
