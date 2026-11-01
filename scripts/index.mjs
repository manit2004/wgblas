/**
 * Build and docs tooling: the browser bundle, the docs site's extras, the
 * benchmark results pages, the roofline analysis, and the docs MCP server.
 *
 * | Script | What it does | Run by |
 * |---|---|---|
 * | `build-browser.mjs` | Bundles the library into one IIFE file, `window.wgblas` | `npm run build:browser`, `npm run docs`, `prepublishOnly` |
 * | `gen-sitemap.mjs` | Writes `docs/sitemap.xml` and `robots.txt`; copies site-verification files into `docs/` | `npm run docs` |
 * | `gen-bench-tables.py` | Generates the per-GPU benchmark results pages and their charts | `make bench-tables` |
 * | `roofline.py` | Roofline analysis over the benchmark results; writes `roofline.json` and the chart | by hand |
 * | `docs-mcp.mjs` | Serves this checkout's `docs/api.json` over MCP | an MCP client |
 *
 * `npm run docs` is `typedoc` → `gen-sitemap.mjs` → `build-browser.mjs`, in
 * that order: TypeDoc wipes `docs/` on every build, so everything else that
 * lives there has to be written after it.
 *
 * ## `build-browser.mjs` — the browser bundle
 *
 * Uses [esbuild](https://esbuild.github.io/) to bundle the whole library into
 * a single minified IIFE that registers `window.wgblas`.
 *
 * | Option | Value | Effect |
 * |---|---|---|
 * | Entry point | `index.mjs` (repo root) | The package's public entry — every routine, class and utility it exports |
 * | Format | `iife`, global name `wgblas` | Wraps the output in one function that assigns the exports to `window.wgblas` |
 * | Shaders | `.wgsl` loaded as text | Every shader is inlined, through `src/shaders/index.mjs`'s imports — no fetches at run time |
 * | External | `webgpu`, `fs`, `url`, `path` | The Node-only code paths, never reached in a browser |
 * | Output | `docs/wgblas.browser.js`, copied to `dist/wgblas.browser.js` | The docs site loads the first; the second is published to npm |
 * | Minified | yes | Reduces download size (`npm run size` checks it against a 50 KB brotli budget) |
 *
 * The two copies serve two audiences:
 *
 * - **The docs site** — `assets/docs/runner.js` loads `docs/wgblas.browser.js`
 *   so the ▶ Run buttons run every example against this build. Examples are
 *   evaluated with `eval`, where `import` statements can't run, so the runner
 *   rewrites `import { … } from "wgblas"` into a destructure of
 *   `window.wgblas` — which needs a bundle that sets a global.
 * - **Users without a bundler** — `dist/wgblas.browser.js` ships in the npm
 *   package (`files`, and the `wgblas/browser` export), so a page can load it
 *   with a plain `<script>` tag from unpkg; the examples' `web/<routine>.html`
 *   pages do exactly that.
 *
 * ## `gen-sitemap.mjs` — sitemap and site-verification files
 *
 * Walks every `.html` page TypeDoc just built and writes `docs/sitemap.xml`
 * (one URL each, under `https://manit2004.github.io/wgblas/`) and a
 * `docs/robots.txt` that points crawlers at it. Also copies the files listed
 * in its `STATIC_ROOT_FILES` — search-engine ownership verification files,
 * currently Google's — from `assets/docs/` into `docs/`, since they must be
 * served from the site root but TypeDoc would delete them there.
 *
 * ## `gen-bench-tables.py` — benchmark results pages
 *
 * Reads GPU folder names from the local `benchmarks/results/` directory to
 * discover which GPUs have results, then **fetches the JSON files from
 * GitHub** (the `main` branch, not local disk) so that skip-worktree'd local
 * files are never used — falling back to local disk only if a fetch fails
 * (e.g. results not pushed yet). Routines are every `src/<routine>/` that has
 * a `<routine>.mjs`.
 *
 * For each GPU it writes, under `benchmarks/bench-result/<gpu>/`:
 *
 * - **`<routine>.mjs`** per routine with results — a TypeDoc module whose
 *   comment holds the default-size table, then one section per parameter
 *   sweep, each with links to its charts and its benchmark scripts. When the
 *   GPU has a `cuda/` results folder the tables add cuBLAS columns and an
 *   efficiency column (`wgblas GB/s ÷ cuBLAS GB/s × 100`); otherwise they show
 *   wgblas only.
 * - **`index.mjs`** — the GPU's own page, including its roofline section when
 *   `roofline.py` has produced a `roofline.json` for it.
 *
 * Charts go to `assets/benchmarks/<gpu>/<routine>/`, a GB/s and a ms chart
 * per table, named `<metric>-<variant>.svg`: `gbps-default.svg` for the
 * default sizes, then e.g. `gbps-stride32.svg`, `gbps-alpha0.svg`,
 * `gbps-trans-no-transpose-transpose.svg`, `gbps-ldb-transpose-pad8.svg`.
 * TypeDoc nests the generated modules under `benchmarks` and copies the
 * charts they link into `docs/media/`.
 *
 * By default, a routine already generated for a GPU (an existing
 * `<routine>.mjs` there) is skipped, and a GPU with nothing left to generate
 * is skipped entirely — its `index.mjs` included. After new results or a
 * fresh `roofline.py` run, pass `--force` (or `--routine`) so the pages
 * actually change.
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
 * python3 scripts/gen-bench-tables.py --force          # regenerate everything
 * python3 scripts/gen-bench-tables.py --routine saxpy  # just saxpy, on every GPU with results
 * python3 scripts/gen-bench-tables.py --local          # use benchmarks/results/ on disk, not GitHub
 * ```
 *
 * ## `roofline.py` — roofline analysis
 *
 * Places every routine at its arithmetic intensity against what it achieved,
 * under a memory roof and a compute roof measured by
 * `benchmarks/roofline/wgblas/bandwidth.js` and `fma.js` (see the
 * `benchmarks` module's Roofline section for the method). Reads the local
 * `benchmarks/results/` tree; a GPU without both probe results is skipped.
 * For each GPU it prints a report and writes
 * `benchmarks/results/<gpu>/wgblas/roofline/roofline.json`, which
 * `gen-bench-tables.py` turns into the GPU page's roofline section.
 *
 * | Argument | Effect |
 * |---|---|
 * | `--gpu SLUG` | Only this GPU (default: every one under `benchmarks/results/`) |
 * | `--svg` | Also write the chart, `assets/benchmarks/<gpu>/roofline/roofline.svg` |
 * | `--empirical-roof` | Use the best observed rates as the roofs instead of the probes (circular — sgemm then scores 100% of a roof it set) |
 * | `--peak-flops N` / `--peak-bw N` | Override the compute roof (GFLOP/s) / memory roof (GB/s) |
 * | `-v`, `--verbose` | List every excluded row |
 *
 * ```sh
 * python3 scripts/roofline.py --svg                                  # every GPU, with charts
 * python3 scripts/roofline.py --gpu nvidia-geforce-gtx-1650 --svg   # one GPU
 * ```
 *
 * ## `docs-mcp.mjs` — the docs MCP server, against this checkout
 *
 * A thin wrapper around `mcp/docs-mcp.mjs` (published to npm as
 * `wgblas-docs-mcp`) that points it at this checkout's `docs/api.json` —
 * TypeDoc's JSON output, written by `npm run docs` — with no network access,
 * so doc changes are queryable before they're deployed:
 *
 * ```sh
 * claude mcp add wgblas-docs -- node scripts/docs-mcp.mjs
 * ```
 *
 * It serves four tools: `search_docs`, `get_doc`, `list_modules` and
 * `get_benchmarks`. It reads `api.json` once at startup, so reconnect the
 * server after `npm run docs` to pick up changes. See `mcp/README.md` for
 * the published package.
 *
 * @module scripts
 */
