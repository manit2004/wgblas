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
