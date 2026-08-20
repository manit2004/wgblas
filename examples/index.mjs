/**
 * Runnable examples for all BLAS routines — one plain Float32Array variant
 * and one GPU-resident variant (`GpuVector`, or `GpuMatrix` for routines
 * whose GPU-resident overload doesn't involve a vector at all, e.g. sgemm)
 * per routine. Run locally with `make example-<routine>` or
 * `make example-gpu-<routine>`.
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
 * | `make example-gpu` | Runs `gpu.<routine>.js` for all routines in sequence |
 * | `make example-gpu-<routine>` | Runs the GPU-resident example for one routine, e.g. `make example-gpu-saxpy` |
 * | `make example-<routine>-web` | Opens one routine's HTML stub in Vite dev server |
 * | `make example-web` | Starts Vite on port 5173 and opens all routine HTML stubs at once |
 *
 * @module examples
 */
