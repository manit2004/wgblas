// path in the browser: the two functions the bundled code calls, on
// "/"-separated paths. tests/helpers/validation.js only builds a path that
// fs.mjs reduces to its file name; src/util/pipeline.mjs calls them only in
// its Node branch.

export function join(...parts) {
  return parts.join("/").replace(/\/+/g, "/");
}

export function dirname(path) {
  return path.slice(0, path.lastIndexOf("/")) || "/";
}
