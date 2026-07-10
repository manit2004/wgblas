/**
 * Shared utilities for wgblas benchmark scripts.
 *
 * Used by every `benchmarks/<routine>/benchmark.<routine>.js` file for
 * consistent timing output, result persistence, and table formatting.
 *
 * @module benchmarks/utils
 */

import { writeFileSync, mkdirSync } from "fs";
import { getAdapter } from "../../src/init.mjs";

/**
 * Returns the current GPU's model name normalised to a filesystem-safe slug
 * (lowercase, non-alphanumeric runs replaced with `-`, leading/trailing `-`
 * stripped). Used as the directory name under `benchmarks/results/`.
 * @returns the slug string, or `null` if the adapter exposes no device name
 */
export function getGpuModel() {
  const device = getAdapter().info.device;
  if (!device) return null;
  // normalise: lowercase, non-alphanumeric → '-' (spec doesn't guarantee format)
  return device
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Writes `results` to `benchmarks/results/<gpuModel>/wgblas/<routineName>.json`,
 * creating the directory if needed. No-ops with a warning when `gpuModel` is null.
 * @param routineName - e.g. `"saxpy"`
 * @param gpuModel - slug from {@link getGpuModel}
 * @param results - array of `{ n, compute_ms, compute_GBs }` records
 */
export function saveResults(routineName, gpuModel, results) {
  if (!gpuModel) {
    console.warn("Warning: couldn't fetch GPU model — skipping result save.");
    return;
  }
  const outDir = `benchmarks/results/${gpuModel}/wgblas`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    `${outDir}/${routineName}.json`,
    JSON.stringify(results, null, 2),
  ); // 2-space indent for human-readable diffs in git
}

/**
 * Returns the median value of a numeric array.
 * Copies the array before sorting so the original is not mutated.
 * @param arr - array of numbers
 * @returns the median value
 */
export function median(arr) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function colWidth(label) {
  return Math.max(label.length + 2, 12);
}

/**
 * Prints a formatted table header row followed by a separator row.
 * @param labels - column label strings, e.g. `["n", "compute_ms", "compute_GBs"]`
 */
export function printHeader(labels) {
  console.log(labels.map((l) => l.padEnd(colWidth(l))).join("  "));
  console.log(labels.map((l) => "-".repeat(colWidth(l))).join("  "));
}

/**
 * Prints one table data row. Floats are formatted to 4 decimal places;
 * integers are printed as-is. Column widths match those used by {@link printHeader}.
 * @param labels - column labels (used only for width calculation)
 * @param values - values to print, in the same order as `labels`
 */
export function printRow(labels, values) {
  console.log(
    labels
      .map((l, i) => {
        const v = values[i];
        const s =
          typeof v === "number" && !Number.isInteger(v)
            ? v.toFixed(4)
            : String(v);
        return s.padEnd(colWidth(l));
      })
      .join("  "),
  );
}
