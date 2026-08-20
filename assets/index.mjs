/**
 * Static assets embedded in the wgblas docs site.
 *
 * ## Folder Structure
 *
 * ```
 * assets/
 *   docs/
 *     runner.js       — browser execution layer, injected into every docs page
 *   benchmarks/
 *     <gpu-slug>/
 *       <routine>/
 *         gbps-default.svg, ms-default.svg, ...   — generated chart images
 * ```
 *
 * `benchmarks/` holds the chart images `scripts/gen-bench-tables.py` generates
 * from `benchmarks/results/` — one `<gpu-slug>/<routine>/` folder per GPU ×
 * routine pair, each with a GB/s and a ms chart per sweep variant (`-default`,
 * `-stride32`, `-transno-transpose`, etc.). These are pure generated output —
 * see `benchmarks/index.mjs` for how they're produced and linked into the
 * `benchmarks` module's tables. `docs/runner.js` is the one file here with
 * actual logic, detailed below.
 *
 * ## `docs/runner.js`
 *
 * Loaded by TypeDoc as a custom JS file on every docs page. It scans the page
 * for two kinds of code blocks and turns each into a live, editable, runnable
 * example — no leaving the page:
 *
 * - **JS blocks** containing an `import` statement — edited and run against
 *   the real `wgblas` bundle, with console output captured below the block.
 * - **Standalone HTML blocks** starting with `<!doctype html>` — edited and
 *   rendered live in a sandboxed `<iframe>` below the block.
 *
 * ### How It Works
 *
 * On page load `runner.js` walks all `<pre>` elements looking for a
 * qualifying `code.js` or `code.html` block. For each match it:
 *
 * 1. **Injects a ▶ Run button** — appended to the code block's container,
 *    positioned so it clears TypeDoc's own top-right "Copy" button.
 * 2. **Swaps in an editable CodeMirror instance** — lazily loaded once from
 *    a CDN (unpkg) and shared across every block on the page. Until it
 *    finishes loading (or if it fails to), Run still works against the
 *    original static text — the editor is progressive enhancement, not a
 *    dependency.
 * 3. **On click**, for a JS block:
 *    - **Transforms imports** — rewrites every
 *      `import { a, b } from "wgblas/..."` line in the *current editor
 *      contents* into `const { a, b } = window.wgblas;`, pointing at the
 *      IIFE bundle `build-browser.mjs` publishes as `docs/wgblas.browser.js`.
 *    - Wraps the transformed source in an `async` IIFE and runs it via
 *      `eval`, capturing `console.log`/`warn`/`error`/`table` output
 *      (typed arrays and tables formatted for readability) into a panel
 *      injected directly below the block. Bails out early with a warning if
 *      `navigator.gpu` isn't available.
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
