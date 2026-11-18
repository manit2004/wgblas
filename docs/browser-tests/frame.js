// Runs one bundled test file, frame.html#<name>, in an iframe of the
// test page: a document of its own, so each file starts with a fresh
// JavaScript realm (its own module instances, its own GPU device), as each
// file gets a process of its own under node --test.
//
// Everything the file does goes to the page (runner.js) as it happens: each
// test's result (the node:test stand-in calls __wgblasReport), what it logs,
// uncaught errors, then "end".

// In the fragment, not a query: servers that redirect frame.html to frame
// keep the fragment, and some drop the query.
const bundle = decodeURIComponent(location.hash.slice(1));
const send = (event) => parent.__wgblasFrameEvent?.(bundle, event);

function format(value) {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack ?? String(value);
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

for (const level of ["log", "info", "warn", "error", "debug"]) {
  const original = console[level].bind(console);
  console[level] = (...args) => {
    original(...args);
    send({ type: "console", text: args.map(format).join(" ") });
  };
}

const uncaught = (reason) =>
  send({
    type: "problem",
    message: `uncaught: ${reason?.message ?? String(reason)}`,
  });
addEventListener("error", (e) => uncaught(e.error ?? e.message));
addEventListener("unhandledrejection", (e) => uncaught(e.reason));

globalThis.__wgblasReport = (result) => send({ type: "result", result });

try {
  await import(`./bundles/${encodeURIComponent(bundle)}`);
  await globalThis.__wgblasRunTests();
} catch (err) {
  send({ type: "problem", message: err?.message ?? String(err) });
} finally {
  // Browsers dispatch unhandledrejection for a promise rejected during the
  // tests in a later task; let it arrive before the file ends.
  await new Promise((resolve) => setTimeout(resolve, 50));
  send({ type: "end" });
}
