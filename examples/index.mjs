/**
 * Runnable examples for all BLAS Level 1 routines — one plain and one
 * GpuVector variant per routine. Every example works in Node (run it with
 * `make example-<routine>` or `make example-gpuvec-<routine>`) and in
 * the browser via the embedded ▶ Run buttons in these docs.
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
 * ## Per-Routine HTML Stubs
 *
 * Each routine has a `examples/<routine>/web/<routine>.html` file — a minimal
 * HTML page that loads `wgblas.browser.js` and embeds the plain-pattern example
 * inline. These stubs are used by the docs site to host the live playground for
 * each routine.
 *
 * ## Make Commands
 *
 * | Command | What it does |
 * |---|---|
 * | `make example` | Runs the plain `<routine>.js` for all routines in sequence |
 * | `make example-<routine>` | Runs the plain example for one routine, e.g. `make example-saxpy` |
 * | `make example-gpuvec` | Runs `gpuvec.<routine>.js` for all routines in sequence |
 * | `make example-gpuvec-<routine>` | Runs the GpuVector example for one routine, e.g. `make example-gpuvec-saxpy` |
 * | `make example-<routine>-web` | Opens one routine's HTML stub in Vite dev server |
 * | `make example-web` | Starts Vite on port 5173 and opens all routine HTML stubs at once |
 *
 * @module examples
 */
