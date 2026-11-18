import {
  BLOCK_SIZE,
  BM_LARGE,
  BM_SMALL,
  BN_LARGE,
  BN_SMALL,
  DNRM2_PARTIAL_LEN,
  SSYMV_TILE,
  STRSM_SMALL_RHS_PER_WG,
  STRSV_TILE_ROWS,
  TILE_WG_2D,
  WGS,
} from "./chunk-2ZD6UYXN.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/utils/test.constants.js
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
var SHADER_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/shaders",
);
var source = (name) => readFileSync(join(SHADER_DIR, `${name}.wgsl`), "utf8");
function wgslConst(src, name) {
  const m = src.match(
    new RegExp(`const\\s+${name}\\s*:\\s*u32\\s*=\\s*(\\d+)u?\\s*;`),
  );
  return m ? Number(m[1]) : null;
}
function wgslWorkgroupSize(src) {
  const m = src.match(/@workgroup_size\((\d+)\s*,\s*(\d+)\)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}
test("gemm block tiles match their shaders", () => {
  for (const name of ["sgemm_small", "dgemm_small"]) {
    const src = source(name);
    assert_default.equal(
      wgslConst(src, "BM"),
      BM_SMALL,
      `${name}.wgsl BM !== BM_SMALL`,
    );
    assert_default.equal(
      wgslConst(src, "BN"),
      BN_SMALL,
      `${name}.wgsl BN !== BN_SMALL`,
    );
  }
  for (const name of ["sgemm_large", "dgemm_large"]) {
    const src = source(name);
    assert_default.equal(
      wgslConst(src, "BM"),
      BM_LARGE,
      `${name}.wgsl BM !== BM_LARGE`,
    );
    assert_default.equal(
      wgslConst(src, "BN"),
      BN_LARGE,
      `${name}.wgsl BN !== BN_LARGE`,
    );
  }
});
test("every shader declaring WGS agrees with constants.mjs", () => {
  const shaders = readdirSync(SHADER_DIR).filter((f) => f.endsWith(".wgsl"));
  const checked = [];
  for (const file of shaders) {
    const value = wgslConst(
      readFileSync(join(SHADER_DIR, file), "utf8"),
      "WGS",
    );
    if (value === null) continue;
    assert_default.equal(
      value,
      WGS,
      `${file} declares WGS = ${value}, expected ${WGS}`,
    );
    checked.push(file);
  }
  assert_default.ok(
    checked.length > 10,
    `expected many shaders to declare WGS, matched ${checked.length}`,
  );
});
test("strsv diagonal block order matches its shader", () => {
  assert_default.equal(
    wgslConst(source("strsv_invert_block"), "BLOCK_SIZE"),
    BLOCK_SIZE,
    "strsv_invert_block.wgsl BLOCK_SIZE !== BLOCK_SIZE",
  );
});
test("strsv step tile matches its shader", () => {
  assert_default.equal(
    wgslConst(source("strsv_step"), "TILE_ROWS"),
    STRSV_TILE_ROWS,
    "strsv_step.wgsl TILE_ROWS !== STRSV_TILE_ROWS",
  );
  assert_default.equal(
    wgslConst(source("strsv_step"), "BLOCK_SIZE"),
    BLOCK_SIZE,
    "strsv_step.wgsl BLOCK_SIZE !== BLOCK_SIZE",
  );
});
test("strsm_small block order and RHS grouping match its shader", () => {
  assert_default.equal(
    wgslConst(source("strsm_small"), "BLOCK_SIZE"),
    BLOCK_SIZE,
    "strsm_small.wgsl BLOCK_SIZE !== BLOCK_SIZE",
  );
  assert_default.equal(
    wgslConst(source("strsm_small"), "RHS_PER_WG"),
    STRSM_SMALL_RHS_PER_WG,
    "strsm_small.wgsl RHS_PER_WG !== STRSM_SMALL_RHS_PER_WG",
  );
});
test("dnrm2 partial layout matches both of its shaders", () => {
  for (const name of ["dnrm2", "reduction/scaledSumF64"]) {
    assert_default.equal(
      wgslConst(source(name), "PARTIAL_LEN"),
      DNRM2_PARTIAL_LEN,
      `${name}.wgsl PARTIAL_LEN !== DNRM2_PARTIAL_LEN`,
    );
  }
});
test("ssymv tile size matches its shader", () => {
  assert_default.equal(
    wgslConst(source("ssymv"), "TILE"),
    SSYMV_TILE,
    "ssymv.wgsl TILE !== SSYMV_TILE",
  );
});
test("2D helper kernels are dispatched at their declared workgroup size", () => {
  for (const name of ["symmetrize", "triangularize", "block_transfer"]) {
    assert_default.deepEqual(
      wgslWorkgroupSize(source(name)),
      [TILE_WG_2D, TILE_WG_2D],
      `${name}.wgsl @workgroup_size !== (${TILE_WG_2D}, ${TILE_WG_2D})`,
    );
  }
});
