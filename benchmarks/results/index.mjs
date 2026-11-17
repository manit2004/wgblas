/**
 * Every committed benchmark result: wgblas against cuBLAS for each routine and
 * parameter sweep, per GPU. Pick a GPU, routine, sweep and configuration; the
 * charts and table are drawn in your browser from the JSON in
 * [`benchmarks/results/`](https://github.com/manit2004/wgblas/tree/main/benchmarks/results)
 * on GitHub, so they always show what's committed. Nothing here is generated
 * ahead of time.
 *
 * <div data-wgblas-bench></div>
 *
 * The viewer is `assets/docs/bench.js`; the listing and reading of the results
 * is `benchmarks/results-reader.mjs`, which the docs MCP server's
 * `get_benchmarks` tool uses too. How the numbers are measured is on the
 * `benchmarks` page; each GPU's roofline is on the `benchmarks/roofline`
 * page.
 *
 * @module benchmarks/results
 */
export {};
