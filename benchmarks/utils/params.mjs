/**
 * Sizes and swept values shared by the Level 1 benchmark files, so every
 * routine and every sweep uses the same points. The cuBLAS twins in
 * `benchmarks/<routine>/cuda/*.c` must use the same values (checked by
 * `node <file> --check` against each GPU's committed results).
 * @module
 */

/** Base-benchmark sizes for every Level 1 routine: 12 element counts, 32 to 16777216. */
export const L1_SIZES = [
  32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304,
  16777216,
];

/** Sizes for the Level 1 parameter sweeps (alpha, c, s): four, spanning the range. */
export const L1_SWEEP_SIZES = [1024, 65536, 1048576, 16777216];

/**
 * Stride-sweep values: three magnitudes (one per regime of the coalescing
 * breakdown — steep 1/stride falloff, transition, plateau), each paired with
 * an odd neighbour to isolate misalignment from magnitude. 255 not 257, to
 * fit where 256 fits.
 */
export const STRIDES = [4, 5, 32, 33, 255, 256];

/** Real alpha-sweep values: 0 and 1 (what a kernel could special-case), two ordinary values, and a denormal-producing 1e-38. */
export const ALPHAS = [0, 1, 2.5, -3.75, 1e-38];

/** Level 2 sizes: square m = n, 32 to 4096 (4096² ≈ Level 1's largest n), plus 1280. */
export const L2_SIZES = [32, 64, 128, 256, 512, 1024, 1280, 2048, 4096];

/** Leading-dimension padding for the `lda` sweeps (lda = n + pad). */
export const PADS = [0, 1, 8, 16, 32, 48, 64, 128];

/** Real beta values: 0 (lets a kernel skip reading y), 1, and two ordinary values. */
export const BETAS = [0, 1, 2.5, -3.75];
