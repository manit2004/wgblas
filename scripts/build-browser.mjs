import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

await esbuild.build({
  entryPoints: [join(root, "index.mjs")],
  bundle: true,
  format: "iife",
  globalName: "wgblas",
  platform: "browser",
  external: ["webgpu", "fs", "url", "path"],
  loader: { ".wgsl": "text" },
  logOverride: { "empty-import-meta": "silent" },
  outfile: join(root, "docs/wgblas.browser.js"),
  minify: true,
});

console.log("Browser bundle saved to docs/wgblas.browser.js");
