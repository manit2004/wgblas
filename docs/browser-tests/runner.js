// The test page: runs the bundled test files listed in manifest.json, one
// after another, each in an iframe of its own (frame.js), and shows the
// results as they come. It needs nothing but a browser that can open its URL.
//
// It runs in one of two ways, as manifest.json says (build-page.mjs):
//   - report: for run.mjs. The page starts on load and posts every event to
//     its server (POST /report), one at a time and in order, where run.mjs
//     prints it and decides the exit code: Playwright opens it, or, with
//     --serve, any browser does (Safari, a phone, a simulator).
//   - otherwise: the docs site's copy (docs/browser-tests/), with no server
//     behind it. The page waits for its Run button, can run one routine's
//     files (picked from a dropdown) or all of them, and offers its results as text ("Copy report") to
//     paste wherever they're wanted.
//
// The events, which also build the page's transcript (transcript.js):
//   { type: "start", browser, files }      the run begins (or begins again,
//                                          if the page was reloaded)
//   { type: "adapter", adapter }           the WebGPU adapter, described,
//   { type: "adapter", missing }           or how there's none (then "done")
//   { type: "file-start", file }
//   { type: "result", file, result }       one test's TestResult
//   { type: "console", file, text }        what the file logged
//   { type: "problem", file, message }     a failure outside any test: an
//                                          uncaught error, a timeout (file
//                                          null: the page's own)
//   { type: "file-end", file }
//   { type: "done" }
import { browserName, describeEnvironment } from "./environment.js";
import { createTranscript, formatSummary } from "./transcript.js";

/** @typedef {import("../stand-ins/node-test.mjs").TestResult} TestResult */

const $ = (id) => document.getElementById(id);

// The docs site passes its theme (#theme=light|dark|os); styles follow it.
// In the fragment, not a query: servers that redirect a page's URL keep the
// fragment, and some drop the query.
const theme = new URLSearchParams(location.hash.slice(1)).get("theme");
if (theme) document.documentElement.dataset.theme = theme;

// --- Events: to the transcript, and to the server if there is one ---------

/** @type {{ report: boolean, fileTimeoutMs: number, nodeOnly: string[],
 *   files: { name: string, bundle: string }[] }} */
let manifest;
let transcript;
let transcriptText = [];
/** The last run, for its report: what ran, when, how long, and where. */
let lastRun;
let posted = Promise.resolve();

function send(event) {
  transcript.handle(event);
  if (!manifest.report) return posted;
  posted = posted
    .then(() =>
      fetch("report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(event),
      }),
    )
    // Opened from a server that has gone (its run finished): the page still
    // runs and shows its results.
    .catch(() => {});
  return posted;
}

// --- The browser and its adapter ------------------------------------------

// { adapter } described (and gpuAdapter, the adapter itself), or { missing }
// saying how there's none: no
// navigator.gpu at all, or requestAdapter() resolving null (headless Firefox
// with no display, a blocklisted GPU).
async function describeAdapter() {
  if (!navigator.gpu)
    return { missing: "navigator.gpu is undefined (WebGPU is off)" };
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    const fallback = await navigator.gpu.requestAdapter({
      forceFallbackAdapter: true,
    });
    return {
      missing:
        "requestAdapter() resolved null" +
        (fallback
          ? ", though a fallback adapter exists"
          : ", also with forceFallbackAdapter"),
    };
  }
  const { vendor, architecture, description } = adapter.info ?? {};
  // Firefox reports these empty (it doesn't reveal the hardware).
  return {
    adapter:
      [vendor, architecture, description].filter(Boolean).join(" ") ||
      "(not named by the browser)",
    gpuAdapter: adapter,
  };
}

// --- The results on the page ----------------------------------------------

const totals = { pass: 0, fail: 0, skip: 0, files: 0, failedFiles: 0 };

function updateTotals() {
  for (const status of ["pass", "fail", "skip"])
    $(`n-${status}`).textContent = totals[status];
  $("files-done").textContent = totals.files;
  $("progress").value = totals.files;
}

function setStatus(text, className = "") {
  $("status").textContent = text;
  $("status").className = `status ${className}`;
}

// A file's row: a summary line (its mark, name, tally) and, opened, one line
// per test result, in the spirit of node --test's spec reporter.
function fileRow(name) {
  const li = document.createElement("li");
  li.innerHTML = `<details><summary><span class="mark run">…</span>
    <span class="name"></span><span class="tally"></span></summary>
    <div class="lines"></div></details>`;
  li.querySelector(".name").textContent = name;
  $("files").append(li);
  const counts = { pass: 0, fail: 0, skip: 0 };
  const lines = li.querySelector(".lines");
  const details = li.querySelector("details");
  const line = (text, className = "") => {
    const div = document.createElement("div");
    div.textContent = text;
    div.className = className;
    lines.append(div);
  };
  const tally = () =>
    (li.querySelector(".tally").textContent = Object.entries(counts)
      .filter(([, n]) => n)
      .map(([status, n]) => `${n} ${status}`)
      .join(" · "));
  return {
    /** @param {TestResult} r */
    result(r) {
      counts[r.status]++;
      tally();
      const indent = "  ".repeat(r.path.length - 1);
      const name = r.path[r.path.length - 1];
      if (r.status === "pass")
        line(`${indent}✔ ${name} (${Math.round(r.ms)}ms)`, "pass");
      else if (r.status === "skip")
        line(
          `${indent}﹣ ${name} # SKIP${r.reason ? ` ${r.reason}` : ""}`,
          "skip",
        );
      else {
        line(`${indent}✖ ${name}`, "fail");
        if (r.error) line(r.error.replace(/^/gm, `${indent}  `));
      }
      for (const d of r.diagnostics ?? []) line(`${indent}  ℹ ${d}`, "note");
    },
    console: (text) => line(text, "note"),
    problem: (message) => line(`✖ ${message}`, "fail"),
    finish(failed) {
      const mark = li.querySelector(".mark");
      mark.textContent = failed ? "✖" : "✔";
      mark.className = `mark ${failed ? "fail" : "pass"}`;
      if (failed) details.open = true;
    },
  };
}

// --- Running the files ----------------------------------------------------

// The frame of the file running now sends its events here (frame.js).
let onFrameEvent = () => {};
window.__wgblasFrameEvent = (bundle, event) => onFrameEvent(bundle, event);

/**
 * Runs one bundled test file in a fresh iframe, sending each event.
 * @param {{ name: string, bundle: string }} file
 */
function runFile({ name, bundle }) {
  const row = fileRow(name);
  let failed = false;
  send({ type: "file-start", file: name });
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    const problem = (message) => {
      failed = true;
      row.problem(message);
      send({ type: "problem", file: name, message });
    };
    const finish = () => {
      clearTimeout(timer);
      onFrameEvent = () => {};
      frame.remove();
      totals.files++;
      if (failed) totals.failedFiles++;
      updateTotals();
      row.finish(failed);
      send({ type: "file-end", file: name });
      resolve();
    };
    const timer = setTimeout(() => {
      problem(`timed out after ${manifest.fileTimeoutMs / 60000} min`);
      finish();
    }, manifest.fileTimeoutMs);

    onFrameEvent = (from, event) => {
      if (from !== bundle) return;
      if (event.type === "result") {
        const r = event.result;
        totals[r.status]++;
        updateTotals();
        if (r.status === "fail") failed = true;
        row.result(r);
        send({ type: "result", file: name, result: r });
      } else if (event.type === "console") {
        row.console(event.text);
        send({ type: "console", file: name, text: event.text });
      } else if (event.type === "problem") problem(event.message);
      else if (event.type === "end") finish();
    };
    frame.src = `frame.html#${encodeURIComponent(bundle)}`;
    $("frames").append(frame);
  });
}

// Starts afresh: no rows, zero counts, an empty transcript.
function reset(fileCount) {
  Object.keys(totals).forEach((k) => (totals[k] = 0));
  updateTotals();
  $("files").replaceChildren();
  $("files-total").textContent = fileCount;
  $("progress").max = Math.max(fileCount, 1);
  transcriptText = [];
  transcript = createTranscript({
    nodeOnly: manifest.nodeOnly,
    write: (text) => transcriptText.push(text),
  });
}

/**
 * Runs `files`, from the adapter check to the summary.
 * @param {{ name: string, bundle: string }[]} files
 * @param {string} label - what they are, for the report: "sdot (2 files)"
 */
async function run(files, label) {
  reset(files.length);
  const started = new Date();
  const browser = browserName();
  send({ type: "start", browser, files: files.length });
  const { adapter, missing, gpuAdapter } = await describeAdapter();
  lastRun = {
    label,
    started,
    environment: await describeEnvironment(gpuAdapter, missing),
  };
  $("adapter").textContent = `WebGPU adapter: ${adapter ?? `none: ${missing}`}`;
  send({ type: "adapter", adapter, missing });
  if (!adapter) {
    setStatus("No WebGPU adapter", "fail");
  } else {
    setStatus("Running…", "run");
    for (const file of files) await runFile(file);
    setStatus(
      totals.failedFiles
        ? `Done: ${totals.failedFiles} of ${totals.files} files failed`
        : `Done: all ${totals.files} files passed`,
      totals.failedFiles ? "fail" : "pass",
    );
  }
  transcriptText.push(formatSummary(transcript.summary));
  lastRun.seconds = Math.round((Date.now() - started) / 1000);
  await send({ type: "done" });
}

// The last run as text: what ran and where, then its transcript, which is
// what run.mjs prints in a terminal.
function reportText() {
  const { label, started, seconds, environment } = lastRun;
  return (
    [
      `wgblas browser tests: ${label}`,
      `Run: ${started.toISOString()}, took ${seconds} s`,
      `Page: ${location.origin}${location.pathname}`,
      ...environment,
      "",
      ...transcriptText,
    ].join("\n") + "\n"
  );
}

// --- The docs site's controls ----------------------------------------------

// The test files by what they test, from their paths: tests/<group>/…,
// where a group is a BLAS routine (with its GPU-resident test,
// gpustorage.<routine>.js) or a part of the library (init, utils).
function groups() {
  const byGroup = new Map();
  for (const file of manifest.files) {
    const group = file.name.split("/")[1];
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group).push(file);
  }
  const isRoutine = (group, files) =>
    files.some((f) => f.name.endsWith(`/gpustorage.${group}.js`));
  const entries = [...byGroup].sort(([a], [b]) => (a < b ? -1 : 1));
  return {
    routines: entries.filter(([g, files]) => isRoutine(g, files)),
    library: entries.filter(([g, files]) => !isRoutine(g, files)),
    byGroup,
  };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// The dropdown: every file, then each routine's, then each library part's.
function fillSuitePicker(select, { routines, library }) {
  const option = (value, label) => {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    return o;
  };
  select.append(
    option("", `All tests (${plural(manifest.files.length, "file")})`),
  );
  for (const [label, entries] of [
    ["BLAS routines", routines],
    ["Library", library],
  ]) {
    if (!entries.length) continue;
    const optgroup = document.createElement("optgroup");
    optgroup.label = label;
    for (const [group, files] of entries)
      optgroup.append(
        option(group, `${group} (${plural(files.length, "file")})`),
      );
    select.append(optgroup);
  }
}

function setUpControls() {
  $("controls").hidden = false;
  const runButton = $("run");
  const picker = $("suite");
  const { byGroup, ...listed } = groups();
  fillSuitePicker(picker, listed);
  const chosen = () =>
    picker.value ? byGroup.get(picker.value) : manifest.files;
  const showChoice = () => {
    $("files-total").textContent = chosen().length;
    runButton.textContent = picker.value ? `Run ${picker.value}` : "Run all";
  };
  picker.addEventListener("change", showChoice);
  showChoice();

  runButton.addEventListener("click", async () => {
    runButton.disabled = picker.disabled = true;
    $("copy").hidden = true;
    const files = chosen();
    const count = `${files.length} file${files.length === 1 ? "" : "s"}`;
    await run(files, `${picker.value || "all tests"} (${count})`);
    runButton.disabled = picker.disabled = false;
    $("copy").hidden = false;
  });

  $("copy").addEventListener("click", async () => {
    const text = reportText();
    try {
      await navigator.clipboard.writeText(text);
      $("copy").textContent = "Copied";
    } catch {
      // No clipboard access (an http page on a LAN address, say): show the
      // text to copy by hand.
      $("report-text").hidden = false;
      $("report-text").value = text;
      $("report-text").select();
    }
    setTimeout(() => ($("copy").textContent = "Copy report"), 2000);
  });
}

async function main() {
  manifest = await (await fetch("manifest.json")).json();
  $("browser").textContent = `${browserName()} — ${navigator.userAgent}`;
  if (manifest.nodeOnly.length) {
    const box = $("node-only");
    box.hidden = false;
    box.querySelector("summary").textContent =
      `${manifest.nodeOnly.length} test files need Node and aren't run here`;
    for (const file of manifest.nodeOnly) {
      const li = document.createElement("li");
      li.textContent = file;
      box.querySelector("ul").append(li);
    }
  }
  reset(manifest.files.length);
  if (manifest.report) {
    await run(manifest.files, "all tests");
    return;
  }
  const { adapter, missing } = await describeAdapter();
  $("adapter").textContent = `WebGPU adapter: ${adapter ?? `none: ${missing}`}`;
  setStatus(
    adapter ? "Ready" : "No WebGPU adapter: the tests can't run here",
    adapter ? "" : "fail",
  );
  setUpControls();
}

main().catch((err) => {
  setStatus(`The runner failed: ${err.message}`, "fail");
  if (transcript) {
    send({ type: "problem", file: null, message: `runner: ${err.message}` });
    send({ type: "done" });
  }
});
