/**
 * Per-routine test structure for wgblas BLAS Level 1 routines.
 *
 * Every routine follows the same three-test pattern. Each test
 * (`test.<routine>.js`) imports from the shared helpers in `tests/helpers/`
 * and, for FMA routines, from its own `helpers.js`.
 *
 * ## 1 — Validation
 *
 * Calls `runValidation` with the routine's `validationSpecs` object. Each
 * spec is a loaded JSON file from `tests/validation/params/` describing what
 * inputs must throw and what boundary inputs must not throw.
 *
 * This layer catches type errors, range errors, and size errors — the guard
 * checks at the JS boundary before any GPU work begins.
 *
 * ## 2 — Fixtures
 *
 * Calls `runFixtures` with 100 fast-check random inputs. For each input the
 * GPU result is compared against the `@stdlib` CPU reference using a
 * routine-specific error metric:
 *
 * - **exact routines** (isamax, scopy, sswap, sscal) — threshold 0, result
 *   must match bit-for-bit.
 * - **reduction routines** (sasum, snrm2) — threshold 50 ULP, allowing for
 *   the different summation order between GPU tree-reduction and sequential
 *   CPU accumulation.
 * - **FMA routines** (saxpy, sdot, srot, srotm) — threshold 1 forward error
 *   factor, tolerating the difference between a fused and an unfused
 *   multiply-add. See `tests/routines/helpers.mjs` for the formula.
 *
 * ## 3 — Edge Cases
 *
 * Deterministic `assert.strictEqual` / `assert.deepEqual` checks that target
 * behaviour the random test cannot reliably hit:
 *
 * - **n=1** — single-element operation.
 * - **alpha/c/s=0** — no-op or identity; catches missing short-circuit guards.
 * - **incx≠incy** — independent strides; catches index-mixing bugs.
 * - **gap elements** — 99s placed at non-strided positions must survive
 *   unchanged (scopy, sscal, sswap, srot, srotm, saxpy).
 * - **ties** — smallest-index tie-breaking in isamax.
 * - **Pythagorean triple** (`[3,4]→5`) — exact integer result from sqrt in snrm2.
 * - **flag per value** — each of `-2`/`-1`/`0`/`1` tested separately for srotm.
 *
 * @module tests/routines
 */
