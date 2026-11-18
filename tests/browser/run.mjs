// make test-browser: the test files in a real browser's WebGPU instead of
// Node's (the "webgpu" npm package). Chrome (Dawn; on Windows it compiles
// shaders with DXC, which the npm package's Dawn can't) or Firefox (wgpu, the
// build Firefox ships rather than Deno's), driven by Playwright; or, with
// --serve, any browser that can open a URL.
//
// The test files are bundled for the browser and built into a test page
// (build-page.mjs, page/), served locally (server.mjs). The page runs the files itself, each
// in an iframe of its own, as node --test runs each file in a process of its
// own, and posts every result back to the server, which prints it as it
// arrives (report.mjs). Test files that need Node itself are listed as not
// run.
//
// Usage: node tests/browser/run.mjs [--serve] [test files, relative to the
//        repo root]
//   --serve  Don't launch a browser: print the page's URL and wait for one to
//            run it — Safari, a phone (through `adb reverse`; WebGPU needs a
//            secure context, which localhost is and a LAN address isn't), a
//            simulator (`xcrun simctl openurl booted <url>`).
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
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  FILE_TIMEOUT_MS,
  buildTestPage,
  findTestFiles,
} from "./build-page.mjs";
import { serveDirectory } from "./server.mjs";
import { collectEvents, printSummary } from "./report.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

const args = process.argv.slice(2);
const config = {
  serve: args.includes("--serve"),
  browser: process.env.WGBLAS_BROWSER ?? "chrome",
  headless: process.env.WGBLAS_BROWSER_HEADED !== "1",
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
if (!config.serve && !(config.browser in LAUNCH)) {
  console.error(
    `WGBLAS_BROWSER must be one of: ${Object.keys(LAUNCH).join(", ")}`,
  );
  process.exit(2);
}

// Fails the run if the page, once started, goes quiet for longer than a file
// may take: it hung outside any file, or lost its connection.
function watchForSilence(events) {
  const limitMs = FILE_TIMEOUT_MS + 60 * 1000;
  const timer = setInterval(() => {
    if (events.lastEventAt && Date.now() - events.lastEventAt > limitMs)
      events.fail(`no word from the page for ${limitMs / 60000} min`);
  }, 10 * 1000);
  return () => clearInterval(timer);
}

// Opens the page in a browser Playwright launches, and waits for its run.
async function runInPlaywright(url, events) {
  const browser = await LAUNCH[config.browser]();
  try {
    events.browser = `${config.browser} ${browser.version()}`;
    const page = await browser.newPage();
    page.on("crash", () => events.fail("the page crashed"));
    page.on("close", () => events.fail("the page closed"));
    await page.goto(url);
    await events.done;
  } finally {
    await browser.close();
  }
}

const named = args.filter((a) => !a.startsWith("--"));
const files = named.length
  ? named.map((f) => join(ROOT, f)).sort()
  : findTestFiles();

const outdir = mkdtempSync(join(tmpdir(), "wgblas-browser-"));
let events;
let server;
let stopWatching = () => {};
try {
  const nodeOnly = await buildTestPage(files, outdir, { report: true });
  events = collectEvents({ nodeOnly });
  server = await serveDirectory(outdir, (event) => events.handle(event));
  stopWatching = watchForSilence(events);
  if (config.serve) {
    console.log(
      `Open ${server.url} in a browser with WebGPU to run the tests.`,
    );
    console.log("Waiting for its results…\n");
    await events.done;
  } else await runInPlaywright(server.url, events);
} finally {
  stopWatching();
  server?.close();
  rmSync(outdir, { recursive: true, force: true });
}

if (events.missingAdapter) {
  console.error(
    `the browser offers no WebGPU adapter: ${events.missingAdapter}`,
  );
  process.exit(1);
}
printSummary(events.summary);
process.exit(events.summary.failed.length ? 1 : 0);
