// url in the browser: fileURLToPath for tests/helpers/validation.js and
// src/util/pipeline.mjs's Node branch. In a bundle, import.meta.url is an
// http: URL; its path is as good as any, since fs.mjs only uses the file name.

export function fileURLToPath(url) {
  return new URL(String(url)).pathname;
}
