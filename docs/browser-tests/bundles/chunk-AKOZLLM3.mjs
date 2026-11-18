// tests/browser/stand-ins/url.mjs
function fileURLToPath(url) {
  return new URL(String(url)).pathname;
}

export { fileURLToPath };
