/**
 * Returns a Float32Array of n random values uniformly sampled from [low, high).
 *
 * @param n - number of elements
 * @param low - lower bound (default: -1)
 * @param high - upper bound (default: 1)
 *
 * @example Default range [-1, 1)
 * {@includeCode ../../examples/randomfloat32array/randomfloat32array.js}
 *
 * @example Custom range [0, 10)
 * {@includeCode ../../examples/randomfloat32array-custom/randomfloat32array-custom.js}
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
 * {@includeCode ../../examples/randomfloat64array/randomfloat64array.js}
 *
 * @example Custom range [0, 10)
 * {@includeCode ../../examples/randomfloat64array-custom/randomfloat64array-custom.js}
 * @see <a href="https://github.com/manit2004/wgblas/blob/main/src/random/random.mjs#L7">Source code: random.mjs (L7)</a>
 * @category Utilities
 */
export declare function randomFloat64Array(
  n: number,
  low?: number,
  high?: number,
): Float64Array;

/**
 * Returns a Float32Array of n*lda elements, with leading dimension `lda`
 * under the given `layout`, representing an actual lower- or
 * upper-triangular matrix for a triangular routine (`strmv`/`strsv`)
 * example: entries in the `uplo` triangle are uniform in `[low, high)`, the
 * n diagonal entries are uniform in `[diagLow, diagHigh)` — kept well away
 * from 0 so a triangular solve doesn't divide by a near-zero pivot — and
 * every entry in the other triangle is 0. `uplo` always describes the
 * logical triangle, regardless of storage order: only the flat index each
 * (row, col) maps to changes between layouts (`A[row*lda+col]` for
 * row-major, `A[col*lda+row]` for column-major).
 *
 * @param n - matrix order (rows/cols read by the triangular routine)
 * @param lda - leading dimension; throws if `lda < n`
 * @param uplo - `'lower'` to fill the lower triangle, `'upper'` to fill the upper triangle (default: `'lower'`)
 * @param low - lower bound for off-diagonal entries (default: -1)
 * @param high - upper bound for off-diagonal entries (default: 1)
 * @param diagLow - lower bound for diagonal entries (default: 5)
 * @param diagHigh - upper bound for diagonal entries (default: 15)
 * @param layout - `'row-major'` or `'column-major'` storage order (default: `'row-major'`)
 *
 * @example
 * {@includeCode ../../examples/randomtriangularfloat32array/randomtriangularfloat32array.js}
 *
 * @example Column-major storage
 * {@includeCode ../../examples/randomtriangularfloat32array-columnmajor/randomtriangularfloat32array-columnmajor.js}
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
  layout?: 'row-major' | 'column-major',
): Float32Array;
