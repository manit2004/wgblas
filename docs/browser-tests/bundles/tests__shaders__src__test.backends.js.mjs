import {
  findTool,
  lineRanges,
  moduleSource,
  naga,
  shaderModules,
} from "./chunk-32RUOGEA.mjs";
import { after, assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/shaders/src/test.backends.js
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
var spirvVal = findTool(process.env.SPIRV_VAL, "spirv-val");
var glslang = findTool(process.env.GLSLANG, "glslangValidator");
var dxc = findTool(
  process.env.DXC,
  "dxc",
  join(homedir(), ".local", "share", "dxc", "bin", "dxc"),
);
var HOW = {
  naga: "make install-naga (needs Rust), or set NAGA",
  "spirv-val": "make install-shader-tools, or set SPIRV_VAL",
  glslangValidator: "make install-shader-tools, or set GLSLANG",
  dxc: "make install-shader-tools, or set DXC",
};
function needs(tools) {
  const missing = Object.entries(tools).find(([, bin]) => !bin);
  return missing ? `${missing[0]} not found: ${HOW[missing[0]]}` : false;
}
var tmp = mkdtempSync(join(tmpdir(), "wgblas-backends-"));
after(() => rmSync(tmp, { recursive: true, force: true }));
function run(bin, args) {
  const r = spawnSync(bin, args, { encoding: "utf8" });
  return { ok: r.status === 0, output: (r.stderr || r.stdout).trim() };
}
function translate({ name, files }, ext, flags = []) {
  const base = join(tmp, name.replaceAll("/", "__"));
  const out = `${base}.${ext}`;
  writeFileSync(`${base}.wgsl`, moduleSource(files));
  const r = run(naga, [...flags, `${base}.wgsl`, out]);
  assert_default.ok(
    r.ok,
    `naga -> .${ext}: ${r.output}
module: ${lineRanges(files)}`,
  );
  return out;
}
var entryPoints = (src, pattern) => [...src.matchAll(pattern)].map((m) => m[1]);
test(
  "SPIR-V (Vulkan): spirv-val accepts naga's output",
  { skip: needs({ naga, "spirv-val": spirvVal }) },
  async (t) => {
    for (const mod of shaderModules) {
      await t.test(mod.name, () => {
        const spv = translate(mod, "spv");
        const r = run(spirvVal, ["--target-env", "spv1.3", spv]);
        assert_default.ok(r.ok, r.output);
      });
    }
  },
);
test(
  "HLSL (D3D12): dxc compiles naga's output",
  { skip: needs({ naga, dxc }) },
  async (t) => {
    for (const mod of shaderModules) {
      await t.test(mod.name, () => {
        const hlsl = translate(mod, "hlsl", ["--shader-model", "60"]);
        const entries = entryPoints(
          readFileSync(hlsl, "utf8"),
          /\[numthreads\([^)]*\)\]\s*void\s+(\w+)/g,
        );
        assert_default.ok(
          entries.length > 0,
          "no compute entry point in the HLSL",
        );
        for (const entry of entries) {
          const r = run(dxc, [
            ...["-HV", "2018", "-T", "cs_6_0", "-E", entry, hlsl],
            ...["-Fo", join(tmp, "out.dxil")],
          ]);
          assert_default.ok(r.ok, `${entry}: ${r.output}`);
        }
      });
    }
  },
);
test(
  "GLSL ES (GL fallback): glslangValidator accepts naga's output",
  { skip: needs({ naga, glslangValidator: glslang }) },
  async (t) => {
    for (const mod of shaderModules) {
      await t.test(mod.name, () => {
        const entries = entryPoints(
          moduleSource(mod.files),
          /@compute\b[^{]*?\bfn\s+(\w+)/g,
        );
        assert_default.ok(
          entries.length > 0,
          "no @compute entry point in the WGSL",
        );
        for (const entry of entries) {
          const comp = translate(mod, `${entry}.comp`, [
            ...["--profile", "es310", "--shader-stage", "compute"],
            ...["--entry-point", entry],
          ]);
          const r = run(glslang, ["-S", "comp", comp]);
          assert_default.ok(r.ok, `${entry}: ${r.output}`);
        }
      });
    }
  },
);
test(
  "MSL (Metal): naga translates (unchecked off macOS)",
  { skip: needs({ naga }) },
  async (t) => {
    for (const mod of shaderModules)
      await t.test(mod.name, () => {
        translate(mod, "metal");
      });
  },
);
