// Every shader survives naga's translation to each backend Firefox runs it
// on, and the native toolchain accepts the result: SPIR-V (Vulkan, Linux and
// Android), HLSL (D3D12, Windows), GLSL ES (the GL fallback) and MSL (Metal,
// macOS — translated only, since only Apple's compiler can check it). naga's
// validation (test.naga.js) passing doesn't guarantee its backends emit code
// the driver-side compiler takes, and HLSL is where they most often don't.
//
// No GPU needed. `make install-shader-tools` installs the validators (naga is
// `make install-naga`). Each tool is found via its env var or PATH (dxc also
// in ~/.local/share/dxc, where that target puts it), and its test is skipped
// without it.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import {
  findTool,
  naga,
  shaderModules,
  moduleSource,
  lineRanges,
} from "../helpers.js";

const spirvVal = findTool(process.env.SPIRV_VAL, "spirv-val");
const glslang = findTool(process.env.GLSLANG, "glslangValidator");
const dxc = findTool(
  process.env.DXC,
  "dxc",
  join(homedir(), ".local", "share", "dxc", "bin", "dxc"),
);

const HOW = {
  naga: "make install-naga (needs Rust), or set NAGA",
  "spirv-val": "make install-shader-tools, or set SPIRV_VAL",
  glslangValidator: "make install-shader-tools, or set GLSLANG",
  dxc: "make install-shader-tools, or set DXC",
};

/** `skip` option: the first missing tool's reason, else false. */
function needs(tools) {
  const missing = Object.entries(tools).find(([, bin]) => !bin);
  return missing ? `${missing[0]} not found: ${HOW[missing[0]]}` : false;
}

const tmp = mkdtempSync(join(tmpdir(), "wgblas-backends-"));
after(() => rmSync(tmp, { recursive: true, force: true }));

function run(bin, args) {
  const r = spawnSync(bin, args, { encoding: "utf8" });
  return { ok: r.status === 0, output: (r.stderr || r.stdout).trim() };
}

/**
 * naga's translation of the module to `ext`, which picks the backend;
 * returns the output file's path.
 */
function translate({ name, files }, ext, flags = []) {
  const base = join(tmp, name.replaceAll("/", "__"));
  const out = `${base}.${ext}`;
  writeFileSync(`${base}.wgsl`, moduleSource(files));
  const r = run(naga, [...flags, `${base}.wgsl`, out]);
  assert.ok(r.ok, `naga -> .${ext}: ${r.output}\nmodule: ${lineRanges(files)}`);
  return out;
}

const entryPoints = (src, pattern) =>
  [...src.matchAll(pattern)].map((m) => m[1]);

test(
  "SPIR-V (Vulkan): spirv-val accepts naga's output",
  { skip: needs({ naga, "spirv-val": spirvVal }) },
  async (t) => {
    for (const mod of shaderModules) {
      await t.test(mod.name, () => {
        const spv = translate(mod, "spv");
        // Generic SPIR-V rules, not --target-env vulkan1.x: naga 30 puts
        // explicit layouts on var<workgroup> arrays, which a recent Vulkan
        // rule (VUID-StandaloneSpirv-None-10684) forbids. That's naga's
        // output, not the WGSL, and drivers accept it — wgpu runs the whole
        // suite on Vulkan.
        const r = run(spirvVal, ["--target-env", "spv1.3", spv]);
        assert.ok(r.ok, r.output);
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
        // Read from the HLSL: naga renames some entry points (a trailing
        // digit gets a `_`, so reduce_f64 becomes reduce_f64_).
        const entries = entryPoints(
          readFileSync(hlsl, "utf8"),
          /\[numthreads\([^)]*\)\]\s*void\s+(\w+)/g,
        );
        assert.ok(entries.length > 0, "no compute entry point in the HLSL");
        for (const entry of entries) {
          // HLSL 2018, as wgpu compiles it: naga writes a vector select()
          // as `cond ? a : b`, which HLSL 2021 (dxc's default) rejects.
          const r = run(dxc, [
            ...["-HV", "2018", "-T", "cs_6_0", "-E", entry, hlsl],
            ...["-Fo", join(tmp, "out.dxil")],
          ]);
          assert.ok(r.ok, `${entry}: ${r.output}`);
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
        // GLSL holds one entry point per file, named by its WGSL name.
        const entries = entryPoints(
          moduleSource(mod.files),
          /@compute\b[^{]*?\bfn\s+(\w+)/g,
        );
        assert.ok(entries.length > 0, "no @compute entry point in the WGSL");
        for (const entry of entries) {
          const comp = translate(mod, `${entry}.comp`, [
            ...["--profile", "es310", "--shader-stage", "compute"],
            ...["--entry-point", entry],
          ]);
          const r = run(glslang, ["-S", "comp", comp]);
          assert.ok(r.ok, `${entry}: ${r.output}`);
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
