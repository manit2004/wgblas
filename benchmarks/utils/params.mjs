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
