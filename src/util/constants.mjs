/** @module devdocs/utility-functions/constants */

/**
 * Single source of truth for every constant the JS dispatch side shares with a
 * shader.
 *
 * WGSL has no import mechanism, so each shader necessarily declares its own
 * copy of these values. That makes them a silent-corruption hazard: change
 * `BM` in `sgemm_large.wgsl` without changing `BM_LARGE` here and the host
 * dispatches the wrong grid — too few workgroups computes part of the matrix
 * and reports success. Hoisting them here removes the JS-to-JS duplication;
 * `tests/constants/src/test.constants.js` closes the remaining JS-to-WGSL gap
 * by parsing the shader sources and asserting they still agree.
 *
 * Every export below names the shader declaration it mirrors. Changing one
 * means changing both, and the test will tell you if you forget.
 */

// --- gemm block tiles ------------------------------------------------------

/** `BM` in sgemm_small.wgsl / sgemmtr_small.wgsl. */
export const BM_SMALL = 32;
/** `BN` in sgemm_small.wgsl / sgemmtr_small.wgsl. */
export const BN_SMALL = 32;
/** `BM` in sgemm_large.wgsl / sgemmtr_large.wgsl. */
export const BM_LARGE = 64;
/** `BN` in sgemm_large.wgsl / sgemmtr_large.wgsl. */
export const BN_LARGE = 64;

/**
 * The large tile only pays for its bigger workgroups once the problem needs at
 * least a 6x6 grid of them; below that the small tile wins. JS-only (no shader
 * counterpart) — it selects *which* shader runs.
 */
export const LARGE_TILE_WORKGROUP_THRESHOLD = 36;

// --- 1D / reduction kernels ------------------------------------------------

/**
 * `const WGS: u32 = 64` — declared by every 1D and reduction shader, and the
 * workgroup size `calcWorkgroups` divides by for a 1D dispatch.
 */
export const WGS = 64;

// --- 2D helper kernels -----------------------------------------------------

/**
 * `@workgroup_size(8, 8)` in symmetrize.wgsl, triangularize.wgsl and
 * block_transfer.wgsl, and the size `calcWorkgroups` divides by per dimension
 * for a 2D dispatch.
 */
export const TILE_WG_2D = 8;

// --- triangular solve ------------------------------------------------------

/** `BLOCK_SIZE` in strsv_invert_block.wgsl — the diagonal block order. */
export const BLOCK_SIZE = 64;
