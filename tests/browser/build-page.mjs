// Builds the test page into a directory: the page itself (page/), every test
// file bundled for the browser (bundle.mjs) into bundles/, and manifest.json,
// which tells the page what to run and how. run.mjs builds it into a
// temporary directory to serve; `npm run docs` builds it into
// docs/browser-tests/ (scripts/copy-docs-assets.mjs), where anyone can open it
// from the docs site and press Run.
import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleTestFiles, stopBundler } from "./bundle.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const PAGE_DIR = fileURLToPath(new URL("./page/", import.meta.url));

/** How long one test file may run before the page gives up on it. */
export const FILE_TIMEOUT_MS = 20 * 60 * 1000;

/**
 * Every test.*.js and gpustorage.*.js under the repo's tests/, as `make test`
 * and `make test-gpu` pick them, sorted.
 * @returns {string[]} absolute paths
 */
export function findTestFiles(dir = join(ROOT, "tests")) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory())
        return entry.name === "node_modules" ? [] : findTestFiles(path);
      return /^(test|gpustorage)\..*\.js$/.test(entry.name) ? [path] : [];
    })
    .sort();
}

/**
 * Builds the test page into `outdir`, which must exist.
 * @param {string[]} files - absolute paths of the test files
 * @param {string} outdir
 * @param {object} options
 * @param {boolean} options.report - true: the page starts on load and posts
 *   every event to its server (run.mjs). false: it waits for its Run button
 *   and keeps its results to itself (the docs site, which has no server).
 * @returns {Promise<string[]>} the files that need Node, each with why: the
 *   page lists them as not run
 */
export async function buildTestPage(files, outdir, { report }) {
  let built;
  try {
    built = await bundleTestFiles(files, join(outdir, "bundles"));
  } finally {
    await stopBundler();
  }
  const name = (file) => relative(ROOT, file).split("\\").join("/");
  const manifest = {
    report,
    fileTimeoutMs: FILE_TIMEOUT_MS,
    files: built.bundles
      .map(({ file, bundle }) => ({ name: name(file), bundle }))
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
    nodeOnly: built.nodeOnly
      .map(({ file, reason }) => `${name(file)} (${reason})`)
      .sort(),
  };
  mkdirSync(outdir, { recursive: true });
  for (const f of readdirSync(PAGE_DIR))
    copyFileSync(join(PAGE_DIR, f), join(outdir, f));
  writeFileSync(join(outdir, "manifest.json"), JSON.stringify(manifest));
  return manifest.nodeOnly;
}
