import { writeFileSync, mkdirSync } from "fs";
import { getAdapter } from "../../src/init.mjs";

export function getGpuModel() {
  const device = getAdapter().info.device;
  if (!device) return null;
  // normalise: lowercase, non-alphanumeric → '-' (spec doesn't guarantee format)
  return device
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

export function printHeader(labels) {
  console.log(labels.map((l) => l.padEnd(colWidth(l))).join("  "));
  console.log(labels.map((l) => "-".repeat(colWidth(l))).join("  "));
}

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
