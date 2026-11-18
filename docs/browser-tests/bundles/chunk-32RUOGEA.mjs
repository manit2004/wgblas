// tests/shaders/helpers.js
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
var SHADER_DIR = fileURLToPath(new URL("../../src/shaders/", import.meta.url));
var LIB_PREFIX = "f64/";
var isFixture = (name) => name.split("/").pop().startsWith("__");
function shaderNames(dir = SHADER_DIR) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return shaderNames(path);
    if (!e.name.endsWith(".wgsl")) return [];
    return [relative(SHADER_DIR, path).split(sep).join("/").slice(0, -5)];
  });
}
var read = (name) => readFileSync(join(SHADER_DIR, `${name}.wgsl`), "utf8");
var stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
var DECL =
  /^(?:(?:fn|struct|const|alias|override)\s+|var(?:<[^>]*>)?\s+)([A-Za-z_]\w*)/gm;
var lib = shaderNames()
  .filter((n) => n.startsWith(LIB_PREFIX))
  .sort((a, b) =>
    a === "f64/dekker" ? -1 : b === "f64/dekker" ? 1 : a < b ? -1 : 1,
  )
  .map((name) => {
    const src = stripComments(read(name));
    const ids = [...src.matchAll(DECL)].map((m) => m[1]);
    return { name, src, uses: new RegExp(`\\b(?:${ids.join("|")})\\b`) };
  });
function libraryFor(src) {
  const needed = /* @__PURE__ */ new Set();
  const pending = [stripComments(src)];
  while (pending.length) {
    const s = pending.pop();
    for (const l of lib)
      if (!needed.has(l.name) && l.uses.test(s)) {
        needed.add(l.name);
        pending.push(l.src);
      }
  }
  return lib.filter((l) => needed.has(l.name)).map((l) => l.name);
}
var libraryNames = lib.map((l) => l.name);
var shaderModules = shaderNames()
  .filter((n) => !n.startsWith(LIB_PREFIX) && !isFixture(n))
  .sort()
  .map((name) => ({ name, files: [...libraryFor(read(name)), name] }));
var moduleSource = (files) => files.map(read).join("\n");
function lineRanges(files) {
  let start = 1;
  return files
    .map((name) => {
      const end = start + read(name).split("\n").length - 1;
      const range = `${name}.wgsl = lines ${start}-${end}`;
      start = end + 1;
      return range;
    })
    .join(", ");
}
function findTool(...candidates) {
  for (const bin of candidates)
    if (bin && !spawnSync(bin, ["--version"]).error) return bin;
  return null;
}
var naga = findTool(
  process.env.NAGA,
  "naga",
  join(homedir(), ".cargo", "bin", "naga"),
);

export {
  libraryNames,
  shaderModules,
  moduleSource,
  lineRanges,
  findTool,
  naga,
};
