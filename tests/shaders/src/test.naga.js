// Every shader compiles under naga (Firefox's WGSL compiler, part of wgpu).
// No GPU needed. naga is a separate Rust install (`make install-naga`, see
// .cargo/config.toml), found via $NAGA, PATH or ~/.cargo/bin; without it the
// naga test is skipped.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  naga,
  shaderModules,
  libraryNames,
  moduleSource,
  lineRanges,
} from "../helpers.js";

test(
  "shaders compile under naga",
  {
    skip: naga
      ? false
      : "naga not found: make install-naga (needs Rust), or set NAGA",
  },
  async (t) => {
    for (const { name, files } of shaderModules) {
      await t.test(name, () => {
        // No output file: naga only parses and validates.
        const run = spawnSync(naga, ["--stdin-file-path", `${name}.wgsl`], {
          input: moduleSource(files),
          encoding: "utf8",
        });
        assert.equal(
          run.status,
          0,
          `${run.stderr || run.stdout}\nmodule: ${lineRanges(files)}`,
        );
      });
    }
  },
);

// Guards the module list itself: a broken declaration scan would leave
// library files out and the f64 kernels failing for the wrong reason.
test("shader module list", () => {
  assert.ok(shaderModules.length > 0);
  for (const lib of libraryNames)
    assert.ok(
      shaderModules.some((m) => m.files.includes(lib)),
      `${lib} is pulled in by no kernel`,
    );
});
