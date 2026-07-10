/**
 * Build tooling for the wgblas browser bundle.
 *
 * `scripts/build-browser.mjs` uses [esbuild](https://esbuild.github.io/) to
 * bundle the entire library into a single minified IIFE file that the docs
 * site loads via `<script>`. This is what makes the ▶ Run buttons in the docs
 * work — the bundle registers `window.wgblas` so that `runner.js` can
 * destructure any routine or utility from it.
 *
 * ## Bundle Configuration
 *
 * | Option | Value | Effect |
 * |---|---|---|
 * | Entry point | `src/index.mjs` | Re-exports every routine and utility |
 * | Format | `iife` | Wraps output in an immediately-invoked function expression |
 * | Global name | `wgblas` | Assigns the exports to `window.wgblas` |
 * | Output | `docs/wgblas.browser.js` | Loaded by `<script>` in the published docs |
 * | Minified | yes | Reduces download size |
 *
 * ## Why IIFE
 *
 * The docs site is a static HTML tree — it cannot use ES module imports from
 * a `<script type="module">` tag reliably across all browsers and hosting
 * environments. An IIFE bundle is a single self-contained file: no import
 * maps, no module resolution, no CORS restrictions. Everything the examples
 * need is in one file assigned to a single global.
 *
 * @module examples/scripts
 */
