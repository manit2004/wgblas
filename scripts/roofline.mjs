// Roofline analysis of the local benchmark results, for maintainers: the table
// the docs site's benchmarks/roofline page draws, plus two checks the page
// leaves out. Same code as the page (benchmarks/results-reader.mjs), with the
// routines' levels and FLOP counts from assets/routines/routine_params.json.
// Writes nothing: the page computes the roofline from the results itself.
//
//   node scripts/roofline.mjs                  every GPU with probe results
//   node scripts/roofline.mjs --gpu <slug>     one GPU
//   node scripts/roofline.mjs -v               also list every unusable row
//
// The checks:
//   - Rows above the measured roofs. Kept, never dropped, because a row lands
//     there for two different reasons: a real measurement the probes didn't
//     match (a short kernel on an integrated GPU can run in a turbo state the
//     probe's sustained load doesn't hold), or a FLOP or byte count that
//     doesn't describe the work that ran (alpha.strsm once charged the full
//     solve at alpha = 0 and scored 11x the card's peak). Percent-level
//     overshoot is usually the first, order-of-magnitude the second.
//   - Rows that can't be placed: no FLOP count, or missing a size.
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  catalog,
  hasRoofline,
  localSource,
  readRoofline,
} from "../benchmarks/results-reader.mjs";

const { values: args } = parseArgs({
  options: {
    gpu: { type: "string" },
    verbose: { type: "boolean", short: "v" },
  },
});

const results = fileURLToPath(
  new URL("../benchmarks/results", import.meta.url),
);
const source = localSource(results);
const cat = catalog(await source.list());
const slugs = args.gpu ? [args.gpu] : [...cat.keys()];

const pad = (v, n) => String(v).padStart(n);
const fixed = (v, d) => v.toFixed(d);

for (const slug of slugs) {
  const gpu = cat.get(slug);
  if (!gpu) {
    console.error(`${slug}: no results`);
    process.exitCode = 1;
    continue;
  }
  if (!hasRoofline(gpu)) {
    console.error(
      `\n${slug}: skipped, no measured roofs. Run \`make bench-roofline\` on that ` +
        "device (both fma.js and bandwidth.js).",
    );
    continue;
  }
  const roof = await readRoofline(source, gpu, { allSweeps: true });
  const pf = roof.peak_GFLOPs;
  const pb = roof.peak_GBs;

  console.log(`\n${"=".repeat(86)}`);
  console.log(
    `${slug}   roofs: ${pf.toLocaleString("en-US", { maximumFractionDigits: 0 })} GFLOP/s ` +
      `x ${fixed(pb, 1)} GB/s   (${roof.roof_source})`,
  );
  console.log(
    `ridge point: ${fixed(roof.ridge_FLOP_per_byte, 2)} FLOP/byte; below it a kernel can't be compute-bound`,
  );
  console.log("=".repeat(86));
  const header = `${"routine".padEnd(10)}${pad("level", 6)}${pad("size", 10)}${pad("FLOP/B", 9)}${pad("GFLOP/s", 10)}${pad("GB/s", 8)}${pad("roof", 10)}${pad("% roof", 8)}  bound`;
  console.log(header);
  console.log("-".repeat(header.length));
  for (const r of roof.routines)
    console.log(
      `${(r.routine + (r.flops_measured ? "" : "*")).padEnd(10)}${pad(r.level, 6)}${pad(r.size, 10)}` +
        `${pad(fixed(r.arithmetic_intensity, 3), 9)}${pad(fixed(r.compute_GFLOPs, 1), 10)}` +
        `${pad(fixed(r.compute_GBs, 1), 8)}${pad(fixed(r.roof_GFLOPs, 1), 10)}` +
        `${pad(fixed(r.pct_of_roof, 0), 7)}%  ${r.bound}`,
    );
  console.log(
    "\n* FLOP count from routine_params.json: the benchmark records bytes only.",
  );

  const over = roof.points
    .map((p) => ({ ...p, ratio: Math.max(p.gflops / pf, p.gbs / pb) }))
    .filter((p) => p.ratio > 1)
    .sort((a, b) => b.ratio - a.ratio);
  if (over.length) {
    console.log(
      `\n  ${over.length} row(s) above the measured roofs (kept; see this script's header):`,
    );
    for (const p of over.slice(0, 8))
      console.log(
        `    ${`${p.routine} ${p.sweep}`.padEnd(22)} size=${String(p.size).padEnd(9)}` +
          `${pad(fixed(p.gflops, 1), 9)} GFLOP/s ${pad(fixed(p.gbs, 1), 7)} GB/s  ${fixed(p.ratio, 2)}x roof`,
      );
    if (over.length > 8) console.log(`    ... and ${over.length - 8} more`);
  }

  if (roof.skipped.length) {
    const counts = new Map();
    for (const s of roof.skipped)
      counts.set(s.why, (counts.get(s.why) ?? 0) + 1);
    console.log("\n  rows not placed:");
    for (const [why, n] of [...counts].sort((a, b) => b[1] - a[1]))
      console.log(`    ${pad(n, 5)}  ${why}`);
    if (args.verbose)
      for (const s of roof.skipped) console.log(`      ${s.file}: ${s.why}`);
  }
}
