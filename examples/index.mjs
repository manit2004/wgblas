/**
 * Runnable examples for every BLAS routine and every other public API —
 * each one a small, self-contained script that prints what it computed.
 *
 * ## What's Here
 *
 * **Routines** (`examples/<routine>/`, all 43) — three variants each:
 *
 * - `<routine>.js` — the plain variant, on host typed arrays
 *   (`Float32Array` for `s*`, `Float64Array` for `d*`, `Complex32Array`
 *   for `cscal`).
 * - `gpu.<routine>.js` — the GPU-resident variant: operands built with
 *   `GpuVector.from()` / `GpuMatrix.from()` (or `GpuMatrix` alone, for
 *   routines like sgemm whose GPU-resident overload has no vector), result
 *   read back with `read()`.
 * - `web/<routine>.html` — the plain variant as a standalone browser page.
 *
 * **Everything else** — one plain script per API, in a folder named after it:
 * `init`, `init-benchmark`, `init-low-power`, `init-two-gpus`, `cleanup`;
 * `gpuvector-from`, `-from-device`, `-read`, `-destroy` and the same four for
 * `gpumatrix`; `complex32`, `complex32array`, `complex64`, `complex64array`;
 * and the random generators (`randomfloat32array`, `-custom`, `-seeded`, the
 * same three for `randomfloat64array`, and `randomtriangularfloat32array`
 * plus its `-columnmajor` variant).
 *
 * ## How the Docs Use Them
 *
 * Every example file is pulled into the API reference with `{@includeCode}`
 * from the matching `.d.mts` — a routine's page shows all three variants, an
 * API's page its scripts (`init`'s shows all four `init*` ones) — so the code
 * in the docs is always the code in this folder, never a hand-copied
 * duplicate. On the docs site,
 * `assets/docs/runner.js` makes each one live: the JS variants get a ▶ Run
 * button that runs them against the site's own `wgblas.browser.js`, and the
 * HTML page renders in an editable `<iframe>` preview.
 *
 * ## The Cleanup Guard
 *
 * ```js
 * if (typeof process !== "undefined") cleanup();
 * ```
 *
 * `cleanup()` releases the WebGPU device. In Node it is necessary — without it
 * the process hangs because the GPU event loop keeps running. In the browser
 * the docs' ▶ Run button already calls `cleanup()` once an example finishes
 * (see `assets/docs/runner.js`), so the guard leaves it to that. Examples that
 * never call `init()` — the complex classes and the random generators — have
 * no device to release and no guard.
 *
 * The standalone `web/<routine>.html` pages call `cleanup()` unconditionally
 * at the end: nothing else will.
 *
 * ## The HTML Pages Load the Published Release
 *
 * Each `web/<routine>.html` loads `wgblas` from unpkg
 * (`https://unpkg.com/wgblas/dist/wgblas.browser.js`), the latest version
 * published to npm — not this checkout. They show what a user gets from a
 * `<script>` tag, so local changes to `src/` don't reach them until a
 * release; use the Node examples (or the docs site built with
 * `npm run docs`, which runs against the local bundle) to try local changes.
 *
 * ## Make Commands
 *
 * | Command | What it does |
 * |---|---|
 * | `make example` | Runs every plain `<name>.js` in sequence — routines and the other APIs; a failing one doesn't stop the rest |
 * | `make example-<name>` | Runs one plain example, e.g. `make example-saxpy` or `make example-init` |
 * | `make example-gpu` | Runs every `gpu.<routine>.js` in sequence |
 * | `make example-gpu-<routine>` | Runs one GPU-resident example, e.g. `make example-gpu-saxpy` |
 * | `make example-<routine>-web` | Opens one routine's HTML page in the Vite dev server |
 * | `make example-web` | Starts Vite on port 5173 and opens every routine's HTML page at once |
 *
 * `init-two-gpus` is meant for a machine with both a discrete and an
 * integrated GPU — it opens one device on each (`powerPreference:
 * "high-performance"` and `"low-power"`) and runs on both at once. On a
 * single-GPU machine both requests may land on the same adapter.
 *
 * @module examples
 */
