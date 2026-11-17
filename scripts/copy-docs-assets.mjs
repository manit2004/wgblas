// Last step of `npm run docs`: puts the benchmark viewer on the docs root,
// where runner.js loads it on the benchmarks/results and benchmarks/roofline
// pages (TypeDoc copies only its one customJs file):
//   - assets/docs/bench.js, copied as is;
//   - results-reader.js, benchmarks/results-reader.mjs bundled as a plain
//     script that sets window.wgblasResultsReader. Not the module itself:
//     browsers won't load modules on a page opened from disk (file://),
//     only plain scripts, as wgblas.browser.js is for the same reason.
//   - results-index.js, every file in benchmarks/results as of this build
//     (window.wgblasResultsIndex): the list the viewer falls back on when
//     GitHub's API won't list the folder (60 calls an hour per address);
//   - routine-params.js, assets/routines/routine_params.json
//     (window.wgblasRoutineParams): the roofline's levels and FLOP counts, as
//     of the code this build ships, not whatever main has since.
import esbuild from "esbuild";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { localSource } from "../benchmarks/results-reader.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
// The docs root: docs/, or another TypeDoc output given as the argument.
const out = process.argv[2] ?? join(root, "docs");

copyFileSync(join(root, "assets/docs/bench.js"), join(out, "bench.js"));
console.log(`assets/docs/bench.js -> ${join(out, "bench.js")}`);

await esbuild.build({
  entryPoints: [join(root, "benchmarks/results-reader.mjs")],
  outfile: join(out, "results-reader.js"),
  bundle: true,
  format: "iife",
  globalName: "wgblasResultsReader",
  platform: "browser",
  // localSource()'s Node imports: only reached in Node, left as written.
  external: ["node:*"],
  logLevel: "warning",
});
console.log(
  `benchmarks/results-reader.mjs -> ${join(out, "results-reader.js")} (window.wgblasResultsReader)`,
);

const paths = (
  await localSource(join(root, "benchmarks/results")).list()
).sort();
writeFileSync(
  join(out, "results-index.js"),
  `window.wgblasResultsIndex = ${JSON.stringify(paths)};\n`,
);
console.log(`${paths.length} result files -> ${join(out, "results-index.js")}`);

const params = readFileSync(
  join(root, "assets/routines/routine_params.json"),
  "utf8",
);
writeFileSync(
  join(out, "routine-params.js"),
  `window.wgblasRoutineParams = ${JSON.stringify(JSON.parse(params))};\n`,
);
console.log(
  `assets/routines/routine_params.json -> ${join(out, "routine-params.js")}`,
);
