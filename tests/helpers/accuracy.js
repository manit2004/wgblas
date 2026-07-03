import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const accuracyPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "accuracy.json",
);
const accuracy = JSON.parse(readFileSync(accuracyPath, "utf8"));

export function getUlpThreshold(op) {
  if (!accuracy[op])
    throw new Error(`No accuracy entry for "${op}" in accuracy.json`);
  return accuracy[op].max_ulp;
}
