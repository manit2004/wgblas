// Every compute shader in src/shaders as the module it compiles into. WGSL has
// no #include, so a kernel that calls the double-double library gets the
// library files it needs concatenated in front, as getPipeline does at
// runtime. Here the set comes from the identifiers the kernel uses (and those
// files use in turn), not from each routine's hand-written list, so a new
// shader is covered without touching this file. WGSL is order-independent at
// module scope, so the order within the set doesn't change what compiles.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SHADER_DIR = fileURLToPath(
  new URL("../../src/shaders/", import.meta.url),
);

// The double-double library: no entry point of its own.
const LIB_PREFIX = "f64/";

// Fixtures for tests/utils/test.pipeline.js, invalid on purpose.
const isFixture = (name) => name.split("/").pop().startsWith("__");

function shaderNames(dir = SHADER_DIR) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return shaderNames(path);
    if (!e.name.endsWith(".wgsl")) return [];
    return [relative(SHADER_DIR, path).split(sep).join("/").slice(0, -5)];
  });
}

/** Source of `src/shaders/<name>.wgsl`. */
export const read = (name) =>
  readFileSync(join(SHADER_DIR, `${name}.wgsl`), "utf8");

const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

// Module-scope declarations start unindented, so locals inside fn bodies
// don't count.
const DECL =
  /^(?:(?:fn|struct|const|alias|override)\s+|var(?:<[^>]*>)?\s+)([A-Za-z_]\w*)/gm;

// dekker first (it defines DD), then the utils by name.
const lib = shaderNames()
  .filter((n) => n.startsWith(LIB_PREFIX))
  .sort((a, b) =>
    a === "f64/dekker" ? -1 : b === "f64/dekker" ? 1 : a < b ? -1 : 1,
  )
  .map((name) => {
    const src = stripComments(read(name));
    const ids = [...src.matchAll(DECL)].map((m) => m[1]);
    return { name, src, uses: new RegExp(`\\b(?:${ids.join("|")})\\b`) };
  });

// Library files `src` needs, transitively, in library order.
function libraryFor(src) {
  const needed = new Set();
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

/** Library file names, e.g. `"f64/utils/add"`. */
export const libraryNames = lib.map((l) => l.name);

/**
 * One entry per kernel: `files` are the shader names in concatenation order,
 * library first, the kernel last.
 * @type {{ name: string, files: string[] }[]}
 */
export const shaderModules = shaderNames()
  .filter((n) => !n.startsWith(LIB_PREFIX) && !isFixture(n))
  .sort()
  .map((name) => ({ name, files: [...libraryFor(read(name)), name] }));

/** The module's WGSL, joined as loadShader joins it. */
export const moduleSource = (files) => files.map(read).join("\n");

/** Which file each line of {@link moduleSource} came from, for error messages. */
export function lineRanges(files) {
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

/**
 * The first of `candidates` that runs (`<bin> --version`), or null. Each is a
 * name looked up on PATH or a path; unset entries (an env var that isn't set)
 * are passed over.
 */
export function findTool(...candidates) {
  for (const bin of candidates)
    if (bin && !spawnSync(bin, ["--version"]).error) return bin;
  return null;
}

/** naga, from $NAGA, PATH or ~/.cargo/bin (`make install-naga`). */
export const naga = findTool(
  process.env.NAGA,
  "naga",
  join(homedir(), ".cargo", "bin", "naga"),
);
