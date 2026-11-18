import {
  libraryNames,
  lineRanges,
  moduleSource,
  naga,
  shaderModules,
} from "./chunk-32RUOGEA.mjs";
import { assert_default, test } from "./chunk-I62COF5X.mjs";
import "./chunk-WQXBGQU4.mjs";

// tests/shaders/src/test.naga.js
import { spawnSync } from "node:child_process";
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
        const run = spawnSync(naga, ["--stdin-file-path", `${name}.wgsl`], {
          input: moduleSource(files),
          encoding: "utf8",
        });
        assert_default.equal(
          run.status,
          0,
          `${run.stderr || run.stdout}
module: ${lineRanges(files)}`,
        );
      });
    }
  },
);
test("shader module list", () => {
  assert_default.ok(shaderModules.length > 0);
  for (const lib of libraryNames)
    assert_default.ok(
      shaderModules.some((m) => m.files.includes(lib)),
      `${lib} is pulled in by no kernel`,
    );
});
