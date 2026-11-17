// make test-browser: the test files in a real browser's WebGPU instead of
// Node's (the "webgpu" npm package). Chrome by default, driven by Playwright;
// on Windows it compiles shaders with DXC, which the npm package's Dawn can't.
//
// Each test file is bundled for the browser (bundle.mjs), served locally
// (server.mjs), and run in a page of its own, as node --test runs each file
// in a process of its own. Results print as each test finishes (report.mjs).
// Test files that need Node itself are listed as not run.
//
// Usage: node tests/browser/run.mjs [test files, relative to the repo root]
// Environment:
//   WGBLAS_BROWSER_CHANNEL  Playwright's Chromium channel: "chrome" (default,
//                           the installed Google Chrome), "msedge", …
//   WGBLAS_BROWSER_HEADED   "1" for a visible window. Headless Chrome renders
//                           on SwiftShader, its CPU renderer; headed uses the
//                           GPU (and needs a display).
//   WGBLAS_BROWSER_ARGS     extra Chrome flags, space-separated
import { chromium } from "playwright-core";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleTestFile, stopBundler } from "./bundle.mjs";
import { serveDirectory } from "./server.mjs";
import {
  printConsole,
  printProblem,
  printResult,
  printSummary,
} from "./report.mjs";

/** @typedef {import("./stand-ins/node-test.mjs").TestResult} TestResult */

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

const config = {
  channel: process.env.WGBLAS_BROWSER_CHANNEL ?? "chrome",
  headless: process.env.WGBLAS_BROWSER_HEADED !== "1",
  args: [
    // WebGPU is still behind a flag on some platforms (Linux), where Vulkan
    // is its backend; the blocklist would turn it off on some GPUs.
    "--enable-unsafe-webgpu",
    "--enable-features=Vulkan",
    "--ignore-gpu-blocklist",
    ...(process.env.WGBLAS_BROWSER_ARGS?.split(" ").filter(Boolean) ?? []),
  ],
  fileTimeoutMs: 20 * 60 * 1000,
};

// Every test.*.js and gpustorage.*.js under dir, as `make test` and `make
// test-gpu` pick them.
function findTestFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === "node_modules" ? [] : findTestFiles(path);
    return /^(test|gpustorage)\..*\.js$/.test(entry.name) ? [path] : [];
  });
}

function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// The browser's WebGPU adapter, described, or null if it offers none.
async function describeAdapter(context, baseUrl) {
  const page = await context.newPage();
  try {
    await page.goto(baseUrl);
    return await page.evaluate(async () => {
      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter) return null;
      const { vendor, architecture, description } = adapter.info;
      return [vendor, architecture, description].filter(Boolean).join(" ");
    });
  } finally {
    await page.close();
  }
}

/**
 * Runs one bundled test file in a fresh page, printing each result as its
 * test finishes.
 * @returns {Promise<{ results: TestResult[], problems: string[] }>} the
 *   results, and failures outside any test (an uncaught error, a timeout, a
 *   crashed page)
 */
async function runInPage(context, baseUrl, bundle) {
  const page = await context.newPage();
  const streamed = [];
  const problems = [];
  await page.exposeFunction("__wgblasReport", (result) => {
    streamed.push(result);
    printResult(result);
  });
  page.on("console", (msg) => printConsole(msg.text()));
  page.on("pageerror", (err) => problems.push(`uncaught: ${err.message}`));
  try {
    await page.goto(baseUrl);
    const results = await withTimeout(
      page.evaluate(async (url) => {
        await import(url);
        return globalThis.__wgblasRunTests();
      }, baseUrl + bundle),
      config.fileTimeoutMs,
      `timed out after ${config.fileTimeoutMs / 60000} min`,
    );
    return { results, problems };
  } catch (err) {
    // What finished before the page failed.
    return { results: streamed, problems: [...problems, err.message] };
  } finally {
    await page.close();
  }
}

const summary = {
  passed: [],
  failed: [],
  nodeOnly: [],
  tests: { pass: 0, fail: 0, skip: 0 },
};

async function runTestFile(file, context, baseUrl, outdir) {
  const name = relative(ROOT, file);
  let built;
  try {
    built = await bundleTestFile(file, outdir);
  } catch (err) {
    console.log(name);
    printProblem(`didn't bundle: ${err.message}`);
    summary.failed.push(name);
    return;
  }
  if (built.nodeOnly) {
    summary.nodeOnly.push(`${name} (${built.nodeOnly})`);
    return;
  }

  console.log(name);
  const { results, problems } = await runInPage(context, baseUrl, built.bundle);
  problems.forEach(printProblem);
  for (const r of results) summary.tests[r.status]++;
  const failed = problems.length || results.some((r) => r.status === "fail");
  (failed ? summary.failed : summary.passed).push(name);
  console.log();
}

const files = (
  process.argv.length > 2
    ? process.argv.slice(2).map((f) => join(ROOT, f))
    : findTestFiles(join(ROOT, "tests"))
).sort();

const outdir = mkdtempSync(join(tmpdir(), "wgblas-browser-"));
const server = await serveDirectory(outdir);
const browser = await chromium.launch({
  channel: config.channel,
  headless: config.headless,
  args: config.args,
});
try {
  const context = await browser.newContext();
  const adapter = await describeAdapter(context, server.url);
  console.log(
    `${config.channel} ${browser.version()}, WebGPU adapter: ${adapter ?? "none"}\n`,
  );
  if (!adapter) throw new Error("the browser offers no WebGPU adapter");
  for (const file of files)
    await runTestFile(file, context, server.url, outdir);
} finally {
  await browser.close();
  await stopBundler();
  server.close();
  rmSync(outdir, { recursive: true, force: true });
}

printSummary(summary);
process.exit(summary.failed.length ? 1 : 0);
