/**
 * Returns a Float32Array of n random values uniformly sampled from [low, high).
 *
 * @param n - number of elements
 * @param low - lower bound (default: -1)
 * @param high - upper bound (default: 1)
 *
 * @example Default range [-1, 1)
 * ```js
 * import { randomFloat32Array } from "wgblas";
 *
 * const x = randomFloat32Array(4);
 * console.log(x); // Float32Array [ -0.42, 0.81, -0.07, 0.55 ]
 * ```
 *
 * @example Custom range [0, 10)
 * ```js
 * import { randomFloat32Array } from "wgblas";
 *
 * const x = randomFloat32Array(4, 0, 10);
 * console.log(x);
 * ```
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/random/random.mjs#L1">Source code: random.mjs (L1)</a>
 * @category Utilities
 */
export declare function randomFloat32Array(
  n: number,
  low?: number,
  high?: number,
): Float32Array;

/**
 * Returns a Float64Array of n random values uniformly sampled from [low, high).
 *
 * @param n - number of elements
 * @param low - lower bound (default: -1)
 * @param high - upper bound (default: 1)
 *
 * @example Default range [-1, 1)
 * ```js
 * import { randomFloat64Array } from "wgblas";
 *
 * const x = randomFloat64Array(4);
 * console.log(x); // Float64Array [ -0.42, 0.81, -0.07, 0.55 ]
 * ```
 *
 * @example Custom range [0, 10)
 * ```js
 * import { randomFloat64Array } from "wgblas";
 *
 * const x = randomFloat64Array(4, 0, 10);
 * console.log(x);
 * ```
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/random/random.mjs#L7">Source code: random.mjs (L7)</a>
 * @category Utilities
 */
export declare function randomFloat64Array(
  n: number,
  low?: number,
  high?: number,
): Float64Array;

/**
 * Returns a Float32Array of n*lda elements, row-major with leading dimension
 * `lda`, representing an actual lower- or upper-triangular matrix for a
 * triangular routine (`strmv`/`strsv`) example: entries in the `uplo`
 * triangle are uniform in `[low, high)`, the n diagonal entries
 * (`A[i*lda+i]`) are uniform in `[diagLow, diagHigh)` — kept well away from 0
 * so a triangular solve doesn't divide by a near-zero pivot — and every entry
 * in the other triangle is 0.
 *
 * @param n - matrix order (rows/cols read by the triangular routine)
 * @param lda - leading dimension; throws if `lda < n`
 * @param uplo - `'lower'` to fill the lower triangle, `'upper'` to fill the upper triangle (default: `'lower'`)
 * @param low - lower bound for off-diagonal entries (default: -1)
 * @param high - upper bound for off-diagonal entries (default: 1)
 * @param diagLow - lower bound for diagonal entries (default: 5)
 * @param diagHigh - upper bound for diagonal entries (default: 15)
 *
 * @example
 * ```js
 * import { randomTriangularFloat32Array } from "wgblas";
 *
 * const n = 4, lda = n;
 * const A = randomTriangularFloat32Array(n, lda, "lower");
 * console.log(A);
 * ```
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/random/random.mjs#L13">Source code: random.mjs (L13)</a>
 * @category Utilities
 */
export declare function randomTriangularFloat32Array(
  n: number,
  lda: number,
  uplo?: 'lower' | 'upper',
  low?: number,
  high?: number,
  diagLow?: number,
  diagHigh?: number,
): Float32Array;
