// Bundles test files into ES modules a browser can import: each test, its
// helpers, the library's source and its shaders, @stdlib's reference BLAS,
// fast-check. What doesn't exist in a browser is swapped for
// a stand-in (stand-ins/); a test file that needs Node itself — a node:fs or
// node:child_process import — is reported as Node-only, not run.
import esbuild from "esbuild";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, join, relative, sep } from "node:path";
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
// test files import those only to do Node things, and leaving them as imports
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

// A node: import no stand-in took: left as an import in the output, where it
// marks the test file that reaches it as Node-only.
const nodeImports = {
  name: "node-imports",
  setup(build) {
    build.onResolve({ filter: /^node:/ }, ({ path }) => ({
      path,
      external: true,
    }));
  },
};

/**
 * Bundles test files into `outdir` in one build: an ES module per file, with
 * the code they share (the library, its shaders, @stdlib, fast-check) split
 * into chunks they import. One build keeps one module graph in memory rather
 * than one per file, and the chunks keep the output small.
 * @param {string[]} files - absolute paths of test files
 * @param {string} outdir - where the bundles and chunks go
 * @returns {Promise<{ bundles: { file: string, bundle: string }[],
 *   nodeOnly: { file: string, reason: string }[] }>} each file's bundle (a
 *   file name inside `outdir`), or why it needs Node: the node: modules it
 *   imports, directly or through its helpers
 * @throws if the files fail to bundle
 */
export async function bundleTestFiles(files, outdir) {
  const names = new Map(
    files.map((f) => [relative(ROOT, f).split(sep).join("/"), f]),
  );
  const { metafile } = await esbuild.build({
    absWorkingDir: ROOT,
    // tests/sdot/src/test.sdot.js -> tests__sdot__src__test.sdot.js: plain
    // .js, which every static server (GitHub Pages among them) labels as
    // JavaScript, as a browser insists for a module; not all know .mjs.
    entryPoints: Object.fromEntries(
      [...names.keys()].map((rel) => [
        rel.split("/").join("__").replace(/\.js$/, ""),
        rel,
      ]),
    ),
    outdir,
    chunkNames: "chunk-[hash]",
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    loader: { ".wgsl": "text" },
    // @stdlib's reference BLAS looks for a native addon beside __dirname;
    // in a browser the lookup fails and it uses its JavaScript version.
    define: { __dirname: '"/"', __filename: '"/index.js"' },
    plugins: [browserModules, nodeImports],
    metafile: true,
    logLevel: "silent",
  });

  // The node: modules an output reaches, through the chunks it imports.
  const outputs = metafile.outputs;
  const reachesNode = (out, seen = new Set()) => {
    if (seen.has(out)) return [];
    seen.add(out);
    return outputs[out].imports.flatMap((i) =>
      i.external
        ? i.path.startsWith("node:")
          ? [i.path]
          : []
        : reachesNode(i.path, seen),
    );
  };

  const bundles = [];
  const nodeOnly = [];
  for (const [out, { entryPoint }] of Object.entries(outputs)) {
    // Not a test file's own output: a chunk, or a module some code imports
    // dynamically (splitting makes each of those an entry point too).
    const file = names.get(entryPoint);
    if (!file) continue;
    const node = [...new Set(reachesNode(out))].sort();
    if (node.length)
      nodeOnly.push({ file, reason: `imports ${node.join(", ")}` });
    else bundles.push({ file, bundle: basename(out) });
  }
  return { bundles, nodeOnly };
}

/** Stops esbuild's background service, which otherwise keeps Node running. */
export function stopBundler() {
  return esbuild.stop();
}
