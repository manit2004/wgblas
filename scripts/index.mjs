/**
 * Build and docs tooling: the browser bundle, the docs site's extras, the
 * benchmark viewer's files, the roofline checks, and the docs MCP server.
 *
 * | Script | What it does | Run by |
 * |---|---|---|
 * | `build-browser.mjs` | Bundles the library into one IIFE file, `window.wgblas` | `npm run build:browser`, `npm run docs`, `prepublishOnly` |
 * | `gen-sitemap.mjs` | Writes `docs/sitemap.xml` and `robots.txt`; copies site-verification files into `docs/` | `npm run docs` |
 * | `copy-docs-assets.mjs` | Puts the benchmark results viewer, a plain-script build of `benchmarks/results-reader.mjs`, and the browser test page (`docs/browser-tests/`, embedded on the `tests/browser` page) into `docs/` | `npm run docs` |
 * | `roofline.mjs` | Prints each GPU's roofline from the local results, with checks for suspect rows | by hand |
 * | `docs-mcp.mjs` | Serves this checkout's `docs/api.json` and benchmark results over MCP | an MCP client |
 *
 * `npm run docs` is `typedoc` → `gen-sitemap.mjs` → `build-browser.mjs` →
 * `copy-docs-assets.mjs`, in that order: TypeDoc wipes `docs/` on every build, so everything else that
 * lives there has to be written after it.
 *
 * `docs/` is build output, not committed. The live site is built by
 * `.github/workflows/docs.yml`, which runs `npm run docs` on every push to
 * `main` and deploys the result to GitHub Pages; CI's link check builds it on
 * pull requests too.
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
 * ## `copy-docs-assets.mjs` — the benchmark results viewer's files
 *
 * Puts the benchmark results viewer on the docs root: copies
 * `assets/docs/bench.js`, and bundles `benchmarks/results-reader.mjs` (which
 * lists and reads the results) with esbuild into a plain script,
 * `results-reader.js`, that sets `window.wgblasResultsReader`. A plain script
 * rather than the module because browsers won't load modules on a page opened
 * from disk (`file://`). It also writes `results-index.js`, the list of
 * result files as of the build: the viewer lists them with GitHub's API
 * (60 calls an hour per address) and falls back on this list when refused.
 * And `routine-params.js`, `assets/routines/routine_params.json` as of the
 * build, so the roofline's FLOP counts match the code the site ships. `runner.js` loads the viewer on the
 * `benchmarks/results` and `benchmarks/roofline` pages, which then draw their
 * charts and tables from the result JSON on GitHub. TypeDoc copies only its
 * one `customJs` file, so these need this step.
 *
 * ## `roofline.mjs` — roofline checks
 *
 * Prints each GPU's roofline from the local `benchmarks/results/`: the table
 * the `benchmarks/roofline` page draws (same code, `results-reader.mjs`'s
 * `readRoofline`), plus two checks the page leaves out. Rows above the
 * measured roofs are kept and listed with how far past they sit: a few percent
 * is usually a real measurement the probes didn't match, an order of
 * magnitude a FLOP or byte count that doesn't describe the work. Rows that
 * can't be placed (no FLOP count, or missing a size) are counted. It writes
 * nothing; a GPU without both probe results is skipped.
 *
 * | Argument | Effect |
 * |---|---|
 * | `--gpu SLUG` | Only this GPU (default: every one under `benchmarks/results/`) |
 * | `-v`, `--verbose` | List every row that can't be placed |
 *
 * ```sh
 * node scripts/roofline.mjs                                  # every GPU
 * node scripts/roofline.mjs --gpu nvidia-geforce-gtx-1650    # one GPU
 * ```
 *
 * ## `docs-mcp.mjs` — the docs MCP server, against this checkout
 *
 * A thin wrapper around `mcp/docs-mcp.mjs` (published to npm as
 * `wgblas-docs-mcp`) that points it at this checkout's `docs/api.json` —
 * TypeDoc's JSON output, written by `npm run docs` — and its
 * `benchmarks/results/`, with no network access, so doc and result changes
 * are queryable before they're deployed:
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
