import esbuild from "esbuild";
import { copyFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsBundle = join(root, "docs/wgblas.browser.js");
const distBundle = join(root, "dist/wgblas.browser.js");

await esbuild.build({
  entryPoints: [join(root, "index.mjs")],
  bundle: true,
  format: "iife",
  globalName: "wgblas",
  platform: "browser",
  external: ["webgpu", "fs", "url", "path"],
  loader: { ".wgsl": "text" },
  logOverride: { "empty-import-meta": "silent" },
  outfile: docsBundle,
  minify: true,
});

console.log("Browser bundle saved to docs/wgblas.browser.js");

mkdirSync(join(root, "dist"), { recursive: true });
copyFileSync(docsBundle, distBundle);
console.log("Browser bundle copied to dist/wgblas.browser.js");
