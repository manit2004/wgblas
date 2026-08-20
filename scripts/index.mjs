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
 * ## Table Generation — `gen-bench-tables.py`
 *
 * `scripts/gen-bench-tables.py` reads GPU folder names from the local
 * `benchmarks/results/` directory to discover which GPUs have results, then
 * **fetches the JSON files from GitHub** (not local disk) so that
 * skip-worktree'd local files are never used, falling back to local disk only
 * if the fetch fails (e.g. results not pushed yet).
 *
 * For each GPU × routine pair it generates a **TypeDoc module entry point**
 * at `benchmarks/bench-result/<gpu>/<routine>.mjs` (plus one `index.mjs` per
 * GPU) — a JSDoc comment embedding a markdown results table and links to the
 * chart images under `assets/benchmarks/<gpu>/<routine>/`, e.g.
 * `gbps-default.svg` for the base sweep, `gbps-stride32.svg` /
 * `gbps-transno-transpose.svg` / `gbps-lda-no-transpose-pad0.svg` etc. for
 * each sweep companion. TypeDoc then nests these under the `benchmarks`
 * module in the published docs. On NVIDIA GPUs the table includes cuBLAS
 * columns and an efficiency column (`wgblas GB/s ÷ cuBLAS GB/s × 100`); on
 * other GPUs it shows wgblas only.
 *
 * Routines are discovered by intersecting `src/<routine>/<routine>.mjs`
 * existence with `results/<gpu>/wgblas/` having a matching JSON (flat or
 * nested under `<routine>/<routine>.json`). By default, a routine already
 * generated for a GPU (an existing `<routine>.mjs` there) is skipped — pass
 * `--force` to regenerate anyway.
 *
 * ### Arguments
 *
 * | Argument | Effect |
 * |---|---|
 * | `--local` | Read result JSON from local disk instead of fetching from GitHub |
 * | `--force` | Regenerate `.mjs` files even if they already exist |
 * | `--routine NAME` | Only regenerate this one routine (implies `--force` for it) |
 *
 * ```sh
 * python3 scripts/gen-bench-tables.py                  # generate everything not yet generated
 * python3 scripts/gen-bench-tables.py --force           # regenerate everything
 * python3 scripts/gen-bench-tables.py --routine saxpy   # just saxpy, on every GPU with results
 * python3 scripts/gen-bench-tables.py --local           # use benchmarks/results/ on disk, not GitHub
 * ```
 *
 * @module scripts
 */
