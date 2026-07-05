/**
 * WebGPU is intentionally low-level. Every routine needs to create buffers, set up bind groups,
 * compile a pipeline, encode a compute pass, and map results back to the CPU. Writing that inline
 * for each BLAS routine means dozens of near-identical code paths that are hard to read, test,
 * or change consistently.
 *
 * These utilities factor out each concern into a focused function. A routine calls
 * `createStorageBuffer`, `createBindGroup`, `loadShader`, `runComputePass`, and `extractResult`
 * — one line per step — rather than managing raw WebGPU objects directly.
 *
 * @module devdocs/utility-functions
 */
