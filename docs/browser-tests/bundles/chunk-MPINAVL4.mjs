import { __esm, __export } from "./chunk-WQXBGQU4.mjs";

// tests/browser/stand-ins/path.mjs
var path_exports = {};
__export(path_exports, {
  dirname: () => dirname,
  join: () => join,
});
function join(...parts) {
  return parts.join("/").replace(/\/+/g, "/");
}
function dirname(path) {
  return path.slice(0, path.lastIndexOf("/")) || "/";
}
var init_path = __esm({
  "tests/browser/stand-ins/path.mjs"() {},
});

export { join, dirname, path_exports, init_path };
