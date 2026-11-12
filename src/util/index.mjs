/**
 * WebGPU is intentionally low-level. Every routine needs to create buffers, set up bind groups,
 * compile a pipeline, encode a compute pass, and map results back to the CPU. Writing that inline
 * for each BLAS routine means dozens of near-identical code paths that are hard to read, test,
 * or change consistently.
 *
 * These utilities factor out each concern into a focused function. A typical routine calls
 * `getPipeline`, `uploadBuffer` and `createParamsBuffer`, `createBindGroup`, `runComputePass`,
 * `stageReadback` and `submit`, `extractResult`, then `destroyBuffers` — one line per step —
 * rather than managing raw WebGPU objects directly. The `blas-routines` page walks through
 * those steps in order; each module below documents one concern:
 *
 * | Module | Concern |
 * |---|---|
 * | `pipeline` | compiling and caching pipelines, concatenating shader files |
 * | `buffer` | storage, params, result and readback buffers; the readback pool; vec4 views |
 * | `bindgroup` | binding buffers in `@binding` order |
 * | `compute` | encoding passes and submitting them, single- or multi-pass |
 * | `workgroup` | dispatch sizes, clamped or checked against the device limit |
 * | `result` | mapping a readback buffer and copying the result out |
 * | `benchmark` | timestamp queries behind `gpuTimeMs` |
 * | `device` | the guards every routine runs first |
 * | `constants` | values the JS dispatch side shares with shaders |
 * | `strided` | packing a strided vector before an O(n²) Level 2 kernel |
 * | `f64` | splitting `Float64Array`s into double-double halves and back |
 * | `finite` | non-finite checks that steer triangular solves to substitution |
 * | `complex` | interleaving complex arrays for upload and back |
 *
 * @module devdocs/utility-functions
 */
