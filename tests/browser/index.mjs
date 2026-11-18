/**
 * Run the test suite in this browser, on this device's GPU: pick a routine
 * and press **Run**, or **Run all**. **Copy report** copies the results as
 * text, to paste into an issue.
 *
 * <div data-wgblas-tests></div>
 *
 * Needs a browser with WebGPU (Chrome on Linux: enable
 * `chrome://flags/#enable-unsafe-webgpu`) and a page served over HTTPS or
 * from `localhost`, not opened from disk. Locally:
 * `python3 -m http.server -d docs`.
 *
 * The tests are bundled when the docs are built, so they match this build.
 * Files that test Node itself aren't run. From a terminal, the same page runs
 * via `make test-browser`, or `node tests/browser/run.mjs --serve` for any
 * other browser.
 *
 * @module tests/browser
 */
export {};
