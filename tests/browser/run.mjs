// make test-browser: the test files in a real browser's WebGPU instead of
// Node's (the "webgpu" npm package), driven by Playwright. Chrome (Dawn; on
// Windows it compiles shaders with DXC, which the npm package's Dawn can't) or
// Firefox (wgpu, the build Firefox ships rather than Deno's).
//
// Each test file is bundled for the browser (bundle.mjs), served locally
// (server.mjs), and run in a page of its own, as node --test runs each file
// in a process of its own. Results print as each test finishes (report.mjs).
// Test files that need Node itself are listed as not run.
//
// Usage: node tests/browser/run.mjs [test files, relative to the repo root]
// Environment:
//   WGBLAS_BROWSER          "chrome" (default) or "firefox". Firefox is
//                           Playwright's own build: install it once with
//                           `npx playwright-core install firefox`.
//   WGBLAS_BROWSER_CHANNEL  Chrome only: Playwright's Chromium channel,
//                           "chrome" (default, the installed Google Chrome),
//                           "msedge", …
//   WGBLAS_BROWSER_HEADED   "1" for a visible window. Headless Chrome renders
//                           on SwiftShader, its CPU renderer; headed uses the
//                           GPU (and needs a display).
//   WGBLAS_BROWSER_ARGS     Chrome only: extra flags, space-separated
import { chromium, firefox } from "playwright-core";
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
  browser: process.env.WGBLAS_BROWSER ?? "chrome",
  headless: process.env.WGBLAS_BROWSER_HEADED !== "1",
  fileTimeoutMs: 20 * 60 * 1000,
};

// Each browser launched with WebGPU on, whatever its default on this
// platform, and its GPU blocklist out of the way.
const LAUNCH = {
  chrome: () =>
    chromium.launch({
      channel: process.env.WGBLAS_BROWSER_CHANNEL ?? "chrome",
      headless: config.headless,
      args: [
        // Behind a flag on Linux, where Vulkan is its backend.
        "--enable-unsafe-webgpu",
        "--enable-features=Vulkan",
        "--ignore-gpu-blocklist",
        ...(process.env.WGBLAS_BROWSER_ARGS?.split(" ").filter(Boolean) ?? []),
      ],
    }),
  firefox: () =>
    firefox.launch({
      headless: config.headless,
      firefoxUserPrefs: {
        "dom.webgpu.enabled": true,
        "gfx.webgpu.ignore-blocklist": true,
      },
    }),
};
if (!(config.browser in LAUNCH)) {
  console.error(
    `WGBLAS_BROWSER must be one of: ${Object.keys(LAUNCH).join(", ")}`,
  );
  process.exit(2);
}

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
// The browser's WebGPU adapter: { adapter } described, or { missing } saying
// how there's none, which is what a failed CI run needs to show (no
// navigator.gpu at all, or requestAdapter() resolving null, which is what
// headless Firefox does with no display).
async function describeAdapter(context, baseUrl) {
  const page = await context.newPage();
  try {
    await page.goto(baseUrl);
    return await page.evaluate(async () => {
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
      const { vendor, architecture, description } = adapter.info;
      // Firefox reports these empty (it doesn't reveal the hardware).
      return {
        adapter:
          [vendor, architecture, description].filter(Boolean).join(" ") ||
          "(not named by the browser)",
      };
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
  page.on("console", (msg) => {
    // Firefox's own deprecation notices about the page, not test output.
    if (!msg.text().startsWith("[JavaScript Warning:"))
      printConsole(msg.text());
  });
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
const browser = await LAUNCH[config.browser]();
try {
  const context = await browser.newContext();
  const { adapter, missing } = await describeAdapter(context, server.url);
  console.log(
    `${config.browser} ${browser.version()}, WebGPU adapter: ${adapter ?? `none: ${missing}`}\n`,
  );
  if (!adapter)
    throw new Error(`the browser offers no WebGPU adapter: ${missing}`);
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
