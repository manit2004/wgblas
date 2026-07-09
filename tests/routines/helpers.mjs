/**
 * Forward error factor — the error metric for FMA routines.
 *
 * Four routines use a `forwardFactor` function in `tests/<routine>/helpers.js`
 * instead of raw ULP distance: **saxpy**, **sdot**, **srot**, and **srotm**.
 *
 * ## Why Not ULP?
 *
 * WGSL §15.7.2 / §17.5.32 permits implementations to fuse multiply-add (FMA)
 * into a single rounding. The GPU may execute `α*x + y` as one FMA while the
 * CPU stdlib performs two separate roundings. Near cancellation — when the
 * terms nearly cancel each other — the raw ULP distance between the two results
 * is unbounded even though both are individually correct (each is within one
 * rounding of the true result).
 *
 * ## Formula
 *
 * ```
 * factor = |err| / (eps × |bound|)
 * ```
 *
 * `err` is the difference between the GPU output and the CPU reference.
 * `bound` is the sum of absolute values of the input terms being combined.
 * `eps = 2^-23` is one f32 machine epsilon.
 *
 * `factor ≤ 1` means the error is within one rounding of the true result,
 * which is the correct criterion regardless of whether FMA was used.
 *
 * ## Per-Routine Bound
 *
 * **saxpy** — `y[i] = α*x[i] + y[i]`. Bound per element:
 * ```
 * eps × (|α × x[i]| + |y[i]|)
 * ```
 * The factor is the maximum across all `n` elements.
 *
 * **sdot** — `Σ x[i]*y[i]`. Bound over the whole sum:
 * ```
 * n × eps × Σ |x[i] × y[i]|
 * ```
 *
 * **srot** — `x[i] = c*x[i] + s*y[i]`, `y[i] = c*y[i] − s*x[i]`.
 * Two bounds per element (one for the new x, one for the new y):
 * ```
 * x bound: eps × (|c × x[i]| + |s × y[i]|)
 * y bound: eps × (|c × y[i]| + |s × x[i]|)
 * ```
 * The factor is the maximum across all elements and both outputs.
 *
 * **srotm** — same structure as srot but the coefficients `h11`, `h12`,
 * `h21`, `h22` are decoded from `param[0]` (the flag):
 * - flag `−2`: identity — h11=h22=1, h12=h21=0
 * - flag `−1`: all four from `param[1..4]`
 * - flag ` 0`: h11=h22=1, h12=`param[3]`, h21=`param[2]`
 * - flag ` 1`: h12=1, h21=−1, h11=`param[1]`, h22=`param[4]`
 *
 * @module tests/routines/helpers
 */
