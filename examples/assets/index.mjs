/**
 * Browser execution layer for the wgblas docs site.
 *
 * `assets/docs/runner.js` is loaded by TypeDoc as a custom JS file on every
 * docs page. It scans the page for code blocks and injects a **▶ Run** button
 * next to any block that contains an `import` statement, making every example
 * in these docs live-executable in the browser without leaving the page.
 *
 * ## How It Works
 *
 * On page load `runner.js` walks all `<pre>` elements. For each one that
 * contains at least one `import` line it:
 *
 * 1. **Transforms imports** — rewrites every
 *    `import { a, b } from "wgblas/..."` line into
 *    `const { a, b } = window.wgblas;`, pointing at the IIFE bundle that
 *    `build-browser.mjs` publishes as `docs/wgblas.browser.js`.
 * 2. **Injects a ▶ Run button** — appended to the code block's container.
 * 3. **On click** — wraps the transformed source in an `async` IIFE, runs it
 *    via `eval`, and captures `console.log`, `console.warn`, and
 *    `console.error` output into a panel injected directly below the block.
 *
 * ## Why `window.wgblas`
 *
 * ES module `import` statements cannot be evaluated at runtime via `eval`
 * because they are static declarations resolved at parse time. The transform
 * replaces them with destructuring assignments against `window.wgblas`, which
 * is the global the IIFE bundle registers on load. This gives eval-able code
 * that still reads like normal module imports in the source.
 *
 * @module examples/assets
 */
