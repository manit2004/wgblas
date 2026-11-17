/**
 * Static assets embedded in the wgblas docs site.
 *
 * ## Folder Structure
 *
 * ```
 * assets/
 *   docs/
 *     runner.js                     — browser execution layer, injected into every docs page
 *     bench.js                      — the benchmark results viewer, loaded by runner.js
 *     google53e32ad8e8c1b544.html   — Google Search Console site verification
 *   routines/
 *     routine_params.json           — every routine's parameters, tagged by role
 *     params.json                   — which parameters are worth a benchmark sweep
 * ```
 *
 * ## `routines/`
 *
 * Planning data for the benchmark sweeps, kept as JSON so it can be read by
 * tools as well as people. The roofline reads `routine_params.json`'s levels
 * and FLOP counts (`benchmarks/results-reader.mjs`); nothing else reads them.
 *
 * - **`routine_params.json`** — each routine's real parameters (from
 *   `src/<routine>/<routine>.mjs`) with its BLAS level and each parameter's
 *   role: `size`, `scalar`, `increment`, `leading-dimension`, `flag`,
 *   `layout` or `data`; and, for routines whose benchmarks record bytes but
 *   not FLOPs, `flops`: the standard BLAS FLOP count as a formula over the
 *   sizes a result row records (`n`, `m`, `k`, `order`) and `bytes`.
 * - **`params.json`** — derived from it: every unique parameter name,
 *   the ones excluded as sweep axes (`data`, and `size`, which every
 *   benchmark already sweeps), and the remaining sweep candidates grouped by
 *   role, each with an expected-effect priority, the baseline it's pinned to
 *   while other parameters are swept, and the levels its own sweep walks.
 *
 * Both predate the double-precision ports: they cover the 26 single-precision
 * routines plus `dasum` and `idamax`, not the other f64 routines or `cscal`.
 *
 * ## `docs/google53e32ad8e8c1b544.html`
 *
 * The file Google Search Console fetches to verify site ownership. It has to
 * sit at the docs root, but TypeDoc wipes `docs/` on every build, so it
 * lives here and `scripts/gen-sitemap.mjs` (run by `npm run docs`) copies it
 * into `docs/` after each build.
 *
 * ## `docs/runner.js`
 *
 * Loaded by TypeDoc as a custom JS file on every docs page (`customJs` in
 * `typedoc.json`). It scans the page for two kinds of code blocks and turns
 * each into a live, editable, runnable example — no leaving the page:
 *
 * - **Code blocks containing `import`** — edited and run against the real
 *   `wgblas` bundle, with console output captured below the block.
 * - **HTML blocks starting with `<!doctype html>`** — edited and rendered
 *   live in a sandboxed `<iframe>` below the block.
 *
 * ### How It Works
 *
 * On page load `runner.js` walks every `<pre>` element looking for a
 * qualifying block. For each match it:
 *
 * 1. **Injects a ▶ Run button** — in the block's top-left corner, clear of
 *    TypeDoc's own top-right "Copy" button.
 * 2. **Swaps in an editable CodeMirror 5 editor** — loaded once from unpkg
 *    (pinned version, `CM_VERSION`) and shared by every block on the page,
 *    with its theme kept in step with the site's light/dark switch. Until it
 *    finishes loading (or if it fails to), Run still works against the
 *    original static text — the editor is progressive enhancement, not a
 *    dependency.
 * 3. **On click**, for a JS block:
 *    - Stops with a warning if `navigator.gpu` isn't available.
 *    - Loads `wgblas.browser.js` from the docs root on the first click (the
 *      IIFE bundle `scripts/build-browser.mjs` publishes there), shared by
 *      every block afterwards.
 *    - **Transforms imports** — removes every named import from `wgblas` or
 *      `wgblas/...` in the *current editor contents* and gathers the names
 *      into one `const { a, b } = window.wgblas;` at the top. Only named
 *      imports (`import { … }`) are handled — default and namespace imports
 *      are left as-is and will fail to run.
 *    - Wraps the result in an `async` IIFE and runs it via `eval`, capturing
 *      `console.log`/`warn`/`error`/`table` output (typed arrays and tables
 *      formatted for readability) into a panel below the block; a thrown
 *      error shows there as `❌ <message>`.
 *    - Calls `wgblas.cleanup()` afterwards, so every run starts on a fresh
 *      device.
 * 4. **On click**, for an HTML block:
 *    - Takes the current editor contents, injects a small `<style>` block
 *      matching the site's active light/dark theme (the iframe's document is
 *      separate from the parent page and doesn't inherit its CSS), and
 *      assigns it to an `<iframe srcdoc>` — reassigning `srcdoc` reloads the
 *      iframe, so re-running executes the page fresh each click.
 *
 * ### Why `window.wgblas`
 *
 * ES module `import` statements cannot be evaluated at runtime via `eval`
 * because they are static declarations resolved at parse time. The transform
 * replaces them with destructuring assignments against `window.wgblas`, which
 * is the global the IIFE bundle registers on load. This gives eval-able code
 * that still reads like normal module imports in the source.
 *
 * @module assets
 */
