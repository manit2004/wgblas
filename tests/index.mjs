/**
 * Test suite for wgblas — 26 BLAS Level 1, 2, and 3 routines, each covered
 * by four kinds of test.
 *
 * ## Test Types
 *
 * The first three live in `test.<routine>.js`; the fourth is a separate file:
 *
 * 1. **validation** — rejects every class of bad input defined in
 *    `tests/validation/params/*.json`: wrong type, wrong size, out-of-range
 *    value. Catches guard-clause bugs before any GPU work begins.
 * 2. **fixtures** — 100 property-based random runs via fast-check, comparing
 *    the GPU result against `@stdlib` (or a hand-written reference, for
 *    routines `@stdlib` doesn't cover) as the CPU oracle, using a
 *    routine-specific error metric — see below. Inputs avoid subnormals to
 *    stay safe under WGSL's flush-to-zero (FTZ) rule.
 * 3. **edge cases** — deterministic checks for routine-specific behaviour:
 *    ties, strides, identity parameters, exact Pythagorean results, per-flag
 *    srotm paths. The 14 routines with a `layout` parameter (matrix
 *    routines that accept row-major or column-major storage) get a second
 *    edge-cases pass — `edge-cases-column-major.json` — run as its own test.
 * 4. **GPU-resident coverage** (`gpustorage.<routine>.js`) — the same
 *    fixtures inputs and stdlib oracle as test 2 and 3, but run through the
 *    `GpuVector`/`GpuMatrix`-resident overload instead of the plain-array
 *    one. Runs via `make test-gpu`/`make test-gpu-<routine>`, a separate
 *    invocation from `make test` — and not part of the Kaggle CI kernel,
 *    which only runs `make test`.
 *
 * ## Error Metrics
 *
 * Four metric families, chosen per routine by what kind of floating-point
 * error the operation can legitimately produce:
 *
 * - **exact match** — the operation has no rounding to tolerate (a copy, a
 *   swap, a single multiply, an index) so GPU and CPU must agree bit-for-bit
 *   (or index-for-index); threshold `0`.
 * - **reduction ULP** (`ulpDiff`/`ulpDiff64`) — GPU sum/norm routines use a
 *   tree reduction while the CPU reference sums sequentially; different
 *   summation order gives a different (still correct) rounding, bounded in
 *   ULPs rather than required to match exactly.
 * - **forward-error factor** (`forwardFactor`) — normalizes the raw error by
 *   a routine-derived rounding-error bound instead of counting ULPs, so a
 *   legal FMA fusion or a cancellation-shrunk result doesn't read as a
 *   failure:
 *   $$\text{factor} = \max&#95;i \frac{|\text{err}&#95;i|}{\varepsilon \cdot \text{bound}&#95;i}, \qquad \varepsilon = 2^{-23}$$
 *   `err_i = |gpu_i - ref_i|` at each output index `i` (or `i,j` for a
 *   matrix output) — `bound_i` is routine-specific; every routine's is in
 *   the Equation column of the table below.
 * - **backward-residual factor** (`backwardResidualFactor`) — for
 *   triangular solves, forward-comparing to a computed "true" `x` is the
 *   wrong question (a solve can be ill-conditioned without being wrong).
 *   Plugs the GPU's answer back into the original equation and checks the
 *   residual instead, LAPACK-style — same shape as forward-error factor
 *   above, but `err_i` is now a residual, not a `gpu`-vs-`ref` difference:
 *   $$\text{factor} = \max&#95;i \frac{|\text{err}&#95;i|}{\varepsilon \cdot \text{bound}&#95;i}, \qquad \text{err}&#95;i = \left|(\operatorname{op}(A)x&#95;{\text{gpu}})&#95;i - b&#95;i\right|$$
 *   (`strsm`'s right-hand side is `\alpha B_{ij}`, indexed `i,j` — a matrix,
 *   not a vector `b`). `bound_i` is again routine-specific — `strsv`'s and
 *   `strsm`'s are in the table below, and differ for the reason given there.
 *
 * `n`/`k` below are each routine's own reduction length; `r` = `aOrder`, the
 * shared dimension `A` is read over (`m` for `side="left"`, `n` for
 * `side="right"`, in ssymm/strmm/strsm).
 *
 * | Routine | Level | Metric | Threshold | Equation (bound, or backward residual ÷ ε) |
 * |---|---|---|---|---|
 * | isamax | 1 | exact index match | 0 | — |
 * | idamax | 1 | exact index match | 0 | — |
 * | scopy | 1 | maxUlp | 0 | — |
 * | sswap | 1 | maxUlp | 0 | — |
 * | sscal | 1 | maxUlp | 0 | — |
 * | sasum | 1 | ulpDiff | 50 | — |
 * | snrm2 | 1 | ulpDiff | 50 | — |
 * | dasum | 1 | ulpDiff64 | 64 | — |
 * | saxpy | 1 | forwardFactor | 1 | $\|\alpha x&#95;i\|+\|y&#95;i\|$ |
 * | sdot | 1 | forwardFactor | 1 | $n\sum&#95;i\|x&#95;iy&#95;i\|$ |
 * | srot | 1 | forwardFactor | 1 | $\|cx&#95;i\|{+}\|sy&#95;i\|$ (x), $\|cy&#95;i\|{+}\|sx&#95;i\|$ (y) |
 * | srotm | 1 | forwardFactor | 1 | $\|h&#95;{11}x&#95;i\|{+}\|h&#95;{12}y&#95;i\|$ (x), $\|h&#95;{21}x&#95;i\|{+}\|h&#95;{22}y&#95;i\|$ (y) |
 * | ssymv | 2 | forwardFactor | 2 | $(n{+}2)\|\alpha\|\sum&#95;j\|A&#95;{ij}\|\|x&#95;j\|+2\|\beta\|\|y&#95;i\|$ |
 * | strmv | 2 | forwardFactor | 2 | $(n{+}1)\sum&#95;j\|A&#95;{ij}\|\|x&#95;j\|$ |
 * | sger | 2 | forwardFactor | 2 | $\|\alpha x&#95;iy&#95;j\|+\|A&#95;{ij}\|$ |
 * | ssyr | 2 | forwardFactor | 2 | $\|\alpha x&#95;ix&#95;j\|+\|A&#95;{ij}\|$ |
 * | ssyr2 | 2 | forwardFactor | 2 | $\|\alpha x&#95;iy&#95;j\|+\|\alpha y&#95;ix&#95;j\|+\|A&#95;{ij}\|$ |
 * | sgemv | 2 | forwardFactor | 4 | $(n{+}1)\|\alpha\|\sum&#95;j\|A&#95;{ij}\|\|x&#95;j\|+\|\beta\|\|y&#95;i\|$ |
 * | strsv | 2 | backwardResidualFactor | 3 | $(n{+}1)\sum&#95;j\|A&#95;{ij}\|\|x&#95;j\|$ |
 * | sgemm | 3 | forwardFactor | 1 | $(k{+}1)\|\alpha\|\sum&#95;p\|A&#95;{ip}\|\|B&#95;{pj}\|+\|\beta\|\|C&#95;{ij}\|$ |
 * | sgemmtr | 3 | forwardFactor | 1 | same as sgemm, restricted to the uplo triangle |
 * | ssyrk | 3 | forwardFactor | 1 | $(k{+}1)\|\alpha\|\sum&#95;p\|A&#95;{ip}\|\|A&#95;{jp}\|+\|\beta\|\|C&#95;{ij}\|$ |
 * | ssyr2k | 3 | forwardFactor | 1 | $(k{+}3)\|\alpha\|\sum&#95;p\|A&#95;{ip}\|\|B&#95;{jp}\|+(k{+}2)\|\alpha\|\sum&#95;p\|B&#95;{ip}\|\|A&#95;{jp}\|+3\|\beta\|\|C&#95;{ij}\|$ |
 * | ssymm | 3 | forwardFactor | 1 | $(r{+}1)\|\alpha\|\sum&#95;p\|A&#95;{ip}\|\|B&#95;{pj}\|+\|\beta\|\|C&#95;{ij}\|$ |
 * | strmm | 3 | forwardFactor | 1 | $(r{+}1)\|\alpha\|\sum&#95;p\|A&#95;{ip}\|\|B&#95;{pj}\|$ |
 * | strsm | 3 | backwardResidualFactor | 5 | $(r{+}1)\sum&#95;k\|A&#95;{ik}\|\|X&#95;{kj}\|$ |
 *
 * ## Make Commands
 *
 * | Command | What it does |
 * |---|---|
 * | `make test` | Runs validation + fixtures + edge cases for all 26 routines (`test.*.js`) |
 * | `make test-<routine>` | Runs one routine's `test.<routine>.js`, e.g. `make test-saxpy` |
 * | `make test-gpu` | Runs GPU-resident coverage for all 26 routines (`gpustorage.*.js`) |
 * | `make test-gpu-<routine>` | Runs one routine's `gpustorage.<routine>.js` |
 *
 * Pass `ARGS=low-power` to prefer the integrated GPU on dual-GPU machines:
 * `make test-saxpy ARGS=low-power`. Node's test runner doesn't forward
 * trailing CLI args the way a plain `node script.js` invocation does, so
 * this goes through the `WGBLAS_POWER_PREFERENCE` env var instead — see
 * `tests/helpers/device.js`.
 *
 * @module tests
 */
