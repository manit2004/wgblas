// make test-wgpu: the test files under Deno's WebGPU, which is wgpu (Firefox's
// engine), instead of Dawn. Every test.*.js and gpustorage.*.js file, or the
// files given as arguments. One Deno process per file, as `node --test` does:
// each file's after() destroys its device. init() takes Deno's navigator.gpu
// over the Dawn npm package on its own.
//
// Deno doesn't resolve the package's own name (`wgblas/saxpy`), and an import
// map turns off its node_modules lookup, so the map covers both: every
// package.json export, and every dependency as an npm: specifier read from
// the existing node_modules.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir, tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const pkg = createRequire(import.meta.url)("../../package.json");

function findDeno() {
  const candidates = [
    process.env.DENO,
    "deno",
    join(homedir(), ".deno", "bin", "deno"),
  ];
  for (const bin of candidates)
    if (bin && !spawnSync(bin, ["--version"]).error) return bin;
  return null;
}

function importMap() {
  const imports = {};
  for (const [key, target] of Object.entries(pkg.exports)) {
    const file = typeof target === "string" ? target : target.import;
    if (!file) continue;
    const name = key === "." ? pkg.name : `${pkg.name}/${key.slice(2)}`;
    imports[name] = pathToFileURL(join(ROOT, file)).href;
  }
  for (const dep of Object.keys({
    ...pkg.dependencies,
    ...pkg.devDependencies,
  }))
    Object.assign(imports, {
      [dep]: `npm:${dep}`,
      [`${dep}/`]: `npm:/${dep}/`,
    });
  return { imports };
}

function testFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const path = join(dir, e.name);
    if (e.isDirectory())
      return e.name === "node_modules" ? [] : testFiles(path);
    return /^(test|gpustorage)\..*\.js$/.test(e.name) ? [path] : [];
  });
}

const deno = findDeno();
if (!deno) {
  console.error("deno not found: make install-deno, or set DENO");
  process.exit(1);
}

const files =
  process.argv.length > 2
    ? process.argv.slice(2)
    : testFiles(join(ROOT, "tests"))
        .map((f) => relative(ROOT, f))
        .sort();

// Two devices on one GPU break some setups (probe.mjs); if so, the tests that
// need them skip (tests/helpers/device.js's multiDevice).
const probe = spawnSync(
  deno,
  [
    "run",
    "--unstable-webgpu",
    "--no-lock",
    join(ROOT, "tests/wgpu/probe.mjs"),
    process.env.WGBLAS_POWER_PREFERENCE ?? "",
  ],
  { cwd: ROOT, encoding: "utf8" },
);
const singleDevice = probe.stdout.trim() !== "ok";
if (singleDevice)
  console.log(
    "wgpu: a second device breaks this GPU, so multi-device tests will skip\n",
  );
const env = {
  ...process.env,
  ...(singleDevice && { WGBLAS_SINGLE_DEVICE: "1" }),
};

const tmp = mkdtempSync(join(tmpdir(), "wgblas-wgpu-"));
const mapPath = join(tmp, "import-map.json");
writeFileSync(mapPath, JSON.stringify(importMap()));

// How a test process ended, when not with 0. A process that crashes prints
// nothing itself; on Windows its exit code is the NTSTATUS, e.g. 0xC0000005
// (access violation) or 0xC00000FD (stack overflow), so show that in hex.
function exitReason(status, signal) {
  if (signal) return `signal ${signal}`;
  if (status === null) return "no exit status";
  return status > 255
    ? `exit 0x${(status >>> 0).toString(16).toUpperCase()}`
    : `exit ${status}`;
}

const failed = [];
try {
  for (const file of files) {
    const { status, signal } = spawnSync(
      deno,
      [
        "test",
        "-A",
        "--unstable-webgpu",
        "--node-modules-dir=manual",
        "--no-lock",
        `--import-map=${mapPath}`,
        file,
      ],
      { cwd: ROOT, stdio: "inherit", env },
    );
    if (status !== 0) failed.push(`${file} (${exitReason(status, signal)})`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(
  `\nwgpu: ${files.length - failed.length}/${files.length} files passed`,
);
if (failed.length) {
  console.log(`failed:\n${failed.map((f) => `  ${f}`).join("\n")}`);
  process.exit(1);
}
