/**
 * Runnable examples for all 10 BLAS Level 1 routines — one plain and one
 * GpuVector variant per routine. Every example works in Node (run it with
 * `node --experimental-vm-modules examples/<routine>/<routine>.js`) and in
 * the browser via the embedded ▶ Run buttons in these docs.
 *
 * ## Two Patterns
 *
 * **Plain Float32Array** — allocate on CPU, pass to the routine, read the
 * result from the returned object. Simple and stateless; the library handles
 * the GPU upload and download internally.
 *
 * ```js
 * import { init, cleanup } from "wgblas";
 * import { saxpy } from "wgblas/saxpy";
 * import { randomFloat32Array } from "wgblas/random";
 *
 * const device = await init();
 * const n = 10, alpha = 2;
 * const x = randomFloat32Array(n, -10, 10);
 * const y = randomFloat32Array(n, -10, 10);
 * const { y: result } = await saxpy(device, n, alpha, x, 1, y, 1);
 * console.log("y = αx + y:", result);
 *
 * if (typeof process !== "undefined") cleanup();
 * ```
 *
 * **GpuVector** — wrap arrays in `GpuVector.from()` so the data stays on the
 * GPU between calls. Use this when chaining multiple operations; only the final
 * `.read()` crosses the PCIe bus, avoiding the per-call round-trip cost.
 *
 * ```js
 * import { init, cleanup } from "wgblas";
 * import { saxpy } from "wgblas/saxpy";
 * import { sscal } from "wgblas/sscal";
 * import { GpuVector } from "wgblas/classes/GpuVector";
 * import { randomFloat32Array } from "wgblas/random";
 *
 * const device = await init();
 * const n = 10, alpha = 2, scale = 0.5;
 * const x = randomFloat32Array(n, -10, 10);
 * const y = randomFloat32Array(n, -10, 10);
 *
 * const xGpu = GpuVector.from(x);
 * const yGpu = GpuVector.from(y);
 *
 * await saxpy(device, n, alpha, xGpu, 1, yGpu, 1);  // stays on GPU
 * await sscal(device, n, scale, yGpu, 1);            // stays on GPU
 * const result = await yGpu.read();                  // one readback
 * console.log("result:", result);
 *
 * xGpu.destroy();
 * yGpu.destroy();
 *
 * if (typeof process !== "undefined") cleanup();
 * ```
 *
 * ## Common Conventions
 *
 * All examples share the same parameter choices so they are easy to compare:
 *
 * | Parameter | Value | Why |
 * |---|---|---|
 * | `n` | 10 | Small enough to print, large enough to show parallel dispatch |
 * | element range | −10 to 10 | Fits f32 exactly; avoids overflow in multi-step examples |
 * | `incx`, `incy` | 1 | Contiguous stride — the most common production use case |
 * | `alpha`, scalar | 2.0 or −0.5 | Non-trivial but easy to verify mentally |
 *
 * ## The Cleanup Guard
 *
 * ```js
 * if (typeof process !== "undefined") cleanup();
 * ```
 *
 * `cleanup()` releases the WebGPU device. In Node it is necessary — without it
 * the process hangs because the GPU event loop keeps running. In the browser
 * it would destroy the shared device that the page's ▶ Run buttons reuse, so
 * the guard skips it there.
 *
 * ## Running in the Browser — `runner.js`
 *
 * The docs site bundles `assets/docs/runner.js` as a custom JS file via TypeDoc.
 * On page load it scans every `<pre>` block that contains an `import` statement
 * and injects a **▶ Run** button. When clicked, it:
 *
 * 1. Transforms `import { a, b } from "wgblas/..."` into
 *    `const { a, b } = window.wgblas;` — pointing at the IIFE bundle below.
 * 2. Wraps the transformed source in an `async` IIFE and runs it via `eval`.
 * 3. Redirects `console.log`, `console.warn`, and `console.error` to an output
 *    panel injected below the code block.
 *
 * ## Browser Bundle — `build-browser.mjs`
 *
 * `scripts/build-browser.mjs` uses [esbuild](https://esbuild.github.io/) to
 * produce a self-contained browser bundle:
 *
 * - **Entry point**: `src/index.mjs` (re-exports every routine and utility)
 * - **Format**: IIFE (`format: "iife"`, `globalName: "wgblas"`)
 * - **Output**: `docs/wgblas.browser.js` (minified, loaded by `<script>` in the docs)
 *
 * The bundle assigns the entire library to `window.wgblas`, which is why the
 * import transform in `runner.js` destructures from that name.
 *
 * ## Per-Routine HTML Stubs
 *
 * Each routine has a `examples/<routine>/web/<routine>.html` file — a minimal
 * HTML page that loads `wgblas.browser.js` and embeds the plain-pattern example
 * inline. These stubs are used by the docs site to host the live playground for
 * each routine.
 *
 * @module examples
 */
