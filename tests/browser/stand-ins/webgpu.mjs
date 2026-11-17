// The "webgpu" npm package (Dawn for Node) in the browser. src/init.mjs
// imports it only when there's no navigator.gpu, which a browser that runs
// the tests always has; this lets the import resolve and fails loudly if it's
// ever reached.

export function create() {
  throw new Error("the webgpu npm package is Node-only");
}

export const globals = {};
