/**
 * ## Structure
 *
 * `shaders/*.wgsl` — one WGSL compute shader per BLAS routine (sscal, saxpy, sdot, …).
 *
 * `shaders/browser-shaders.mjs` — the browser's runtime shader source. In Node.js, shaders are
 * read directly from disk via `readFileSync`. In the browser there is no filesystem, so this file
 * provides all shader strings inline. Vite bundles it by importing each `.wgsl` file as a string.
 *
 * ## Cross-shader patterns
 *
 * **Fixed workgroup size of 64.** Every shader declares `const WGS: u32 = 64` and
 * `@workgroup_size(64)`. 64 is the minimum `maxComputeInvocationsPerWorkgroup` guaranteed across
 * all WebGPU devices, so this works everywhere without querying device limits.
 *
 * **Single bind group.** All bindings use `@group(0)`. This means the JS side always calls
 * `pipeline.getBindGroupLayout(0)` — no secondary groups to track.
 *
 * The `@binding` indices must match the position of each resource in the array passed to
 * `createBindGroup` — it assigns `binding: 0, 1, 2 …` sequentially, with `resultBuffer` appended last.
 *
 * **All counts and strides are `u32`.** `n`, `x_inc`, `y_inc`, and any other index fields in the
 * `Params` uniform struct are unsigned. This avoids implicit sign-extension when they appear in
 * index expressions like `id * params.x_inc`.
 *
 * @module devdocs/shaders
 */
