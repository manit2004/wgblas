// Cross-checks src/util/constants.mjs against the WGSL sources that declare
// the same values. WGSL has no imports, so every shader carries its own copy;
// nothing but this test stops the two sides drifting apart. Drift is silent
// and destructive — a stale BM_LARGE dispatches too few workgroups, which
// computes part of the matrix and returns success.
//
// No GPU required: this parses the .wgsl files as text.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BM_SMALL, BN_SMALL, BM_LARGE, BN_LARGE, WGS, TILE_WG_2D, BLOCK_SIZE,
} from "../../../src/util/constants.mjs";

const SHADER_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../src/shaders");

const source = (name) => readFileSync(join(SHADER_DIR, `${name}.wgsl`), "utf8");

/** Reads `const <name>: u32 = <n>u?;` out of a shader, or null if absent. */
function wgslConst(src, name) {
  const m = src.match(new RegExp(`const\\s+${name}\\s*:\\s*u32\\s*=\\s*(\\d+)u?\\s*;`));
  return m ? Number(m[1]) : null;
}

/** Reads the literal `@workgroup_size(x, y)` pair, or null if it isn't literal. */
function wgslWorkgroupSize(src) {
  const m = src.match(/@workgroup_size\((\d+)\s*,\s*(\d+)\)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

test("gemm block tiles match their shaders", () => {
  for (const name of ["sgemm_small", "sgemmtr_small"]) {
    const src = source(name);
    assert.equal(wgslConst(src, "BM"), BM_SMALL, `${name}.wgsl BM !== BM_SMALL`);
    assert.equal(wgslConst(src, "BN"), BN_SMALL, `${name}.wgsl BN !== BN_SMALL`);
  }
  for (const name of ["sgemm_large", "sgemmtr_large"]) {
    const src = source(name);
    assert.equal(wgslConst(src, "BM"), BM_LARGE, `${name}.wgsl BM !== BM_LARGE`);
    assert.equal(wgslConst(src, "BN"), BN_LARGE, `${name}.wgsl BN !== BN_LARGE`);
  }
});

test("every shader declaring WGS agrees with constants.mjs", () => {
  const shaders = readdirSync(SHADER_DIR).filter((f) => f.endsWith(".wgsl"));
  const checked = [];
  for (const file of shaders) {
    const value = wgslConst(readFileSync(join(SHADER_DIR, file), "utf8"), "WGS");
    if (value === null) continue; // shader doesn't use a WGS constant
    assert.equal(value, WGS, `${file} declares WGS = ${value}, expected ${WGS}`);
    checked.push(file);
  }
  // Guard the guard: if the regex silently stops matching, this test would
  // pass vacuously while checking nothing.
  assert.ok(checked.length > 10, `expected many shaders to declare WGS, matched ${checked.length}`);
});

test("strsv diagonal block order matches its shader", () => {
  assert.equal(
    wgslConst(source("strsv_invert_block"), "BLOCK_SIZE"), BLOCK_SIZE,
    "strsv_invert_block.wgsl BLOCK_SIZE !== BLOCK_SIZE",
  );
});

test("2D helper kernels are dispatched at their declared workgroup size", () => {
  for (const name of ["symmetrize", "triangularize", "block_transfer"]) {
    assert.deepEqual(
      wgslWorkgroupSize(source(name)), [TILE_WG_2D, TILE_WG_2D],
      `${name}.wgsl @workgroup_size !== (${TILE_WG_2D}, ${TILE_WG_2D})`,
    );
  }
});
