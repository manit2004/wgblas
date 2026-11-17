// Bundles one test file into a single ES module a browser can import: the
// test, its helpers, the library's source and its shaders, @stdlib's
// reference BLAS, fast-check. What doesn't exist in a browser is swapped for
// a stand-in (stand-ins/); a test file that needs Node itself — a node:fs or
// node:child_process import — can't be bundled and is reported as Node-only.
import esbuild from "esbuild";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const STAND_INS_DIR = fileURLToPath(new URL("./stand-ins/", import.meta.url));
const PARAMS_DIR = join(ROOT, "tests/validation/params");
const pkg = createRequire(import.meta.url)("../../package.json");

// Import specifier -> its stand-in in stand-ins/. node:test and node:assert
// are what every test file imports. The bare fs/url/path/webgpu are imported
// by tests/helpers/validation.js (its parameter specs) and by the library's
// Node-only branches (src/init.mjs, src/util/pipeline.mjs), which a browser
// never takes. The node:-prefixed fs, url and path are deliberately absent:
// test files import those only to do Node things, and leaving them unresolved
// is what marks such a file Node-only.
const STAND_INS = {
  "node:test": "node-test.mjs",
  "node:assert": "assert.mjs",
  "node:assert/strict": "assert.mjs",
  fs: "fs.mjs",
  url: "url.mjs",
  path: "path.mjs",
  webgpu: "webgpu.mjs",
};

// The "assert" package and the "util" package it uses read process
// (NODE_DEBUG, emitWarning, stderr's TTY details). They, and only they, get a
// local stand-in: a global process would change what the library and every
// other package see.
const PROCESS_USERS = /node_modules[\\/](assert|util)[\\/].*\.js$/;
const PROCESS_STAND_IN =
  "const process = { env: {}, emitWarning() {}, stderr: {} };\n";

// tests/validation/params/*.json as { "<name>.json": "<contents>" }, the
// "validation-params" module stand-ins/fs.mjs serves them from.
function validationParams() {
  return Object.fromEntries(
    readdirSync(PARAMS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => [f, readFileSync(join(PARAMS_DIR, f), "utf8")]),
  );
}

// The package's own name and its subpath exports ("wgblas", "wgblas/sscal")
// to their source files, as package.json's exports map them for Node.
function resolveOwnPackage(specifier) {
  const key =
    specifier === pkg.name ? "." : `.${specifier.slice(pkg.name.length)}`;
  const target = pkg.exports[key];
  return typeof target === "string" ? target : target?.import;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

const browserModules = {
  name: "browser-modules",
  setup(build) {
    const standIn = new RegExp(
      `^(${Object.keys(STAND_INS).map(escape).join("|")})$`,
    );
    build.onResolve({ filter: standIn }, ({ path }) => ({
      path: join(STAND_INS_DIR, STAND_INS[path]),
    }));

    build.onResolve({ filter: /^validation-params$/ }, ({ path }) => ({
      path,
      namespace: "validation-params",
    }));
    build.onLoad({ filter: /.*/, namespace: "validation-params" }, () => ({
      contents: JSON.stringify(validationParams()),
      loader: "json",
    }));

    build.onLoad({ filter: PROCESS_USERS }, ({ path }) => ({
      contents: PROCESS_STAND_IN + readFileSync(path, "utf8"),
      loader: "js",
    }));

    build.onResolve(
      { filter: new RegExp(`^${escape(pkg.name)}(/.*)?$`) },
      ({ path }) => {
        const file = resolveOwnPackage(path);
        return file ? { path: join(ROOT, file) } : undefined;
      },
    );
  },
};

// An unresolved node: import: the file needs Node, not a bug in the bundle.
const isNodeOnly = (error) => /^Could not resolve "node:/.test(error.text);

/**
 * Bundles `file` into `outdir`.
 * @param {string} file - absolute path of a test file
 * @param {string} outdir - where the bundle goes
 * @returns {Promise<{ bundle: string } | { nodeOnly: string }>} the bundle's
 *   file name (inside `outdir`), or why the test file needs Node
 * @throws if the file fails to bundle for any other reason
 */
export async function bundleTestFile(file, outdir) {
  const name = `${relative(ROOT, file).split(sep).join("__")}.mjs`;
  try {
    await esbuild.build({
      entryPoints: [file],
      outfile: join(outdir, name),
      bundle: true,
      format: "esm",
      platform: "browser",
      loader: { ".wgsl": "text" },
      // @stdlib's reference BLAS looks for a native addon beside __dirname;
      // in a browser the lookup fails and it uses its JavaScript version.
      define: { __dirname: '"/"', __filename: '"/index.js"' },
      plugins: [browserModules],
      logLevel: "silent",
    });
    return { bundle: name };
  } catch (err) {
    const errors = err.errors ?? [];
    if (errors.length && errors.every(isNodeOnly))
      return { nodeOnly: errors[0].text };
    throw err;
  }
}

/** Stops esbuild's background service, which otherwise keeps Node running. */
export function stopBundler() {
  return esbuild.stop();
}
