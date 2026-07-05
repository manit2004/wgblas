/**
 * A repo tour for contributors, learners, and anyone curious how a GPU BLAS
 * library is built. Each section mirrors a major folder or system in the
 * repository and explains the reasoning behind it — not just what the code
 * does, but why it is shaped the way it is.
 *
 * ## What is BLAS?
 *
 * BLAS (Basic Linear Algebra Subprograms) is a standard API for vector and
 * matrix operations — dot products, norms, scalar multiplies, matrix-vector
 * products. It is the computational backbone of numerical computing, machine
 * learning frameworks, and scientific software. The reference spec lives at
 * [netlib.org/blas](https://www.netlib.org/blas/).
 *
 * GPUs are well-suited for BLAS: operations like saxpy (y = αx + y) are
 * embarrassingly parallel — each element is independent — so thousands of GPU
 * threads can work simultaneously. NVIDIA's
 * [cuBLAS](https://docs.nvidia.com/cuda/cublas/) is the canonical example;
 * this library applies the same idea to the browser via WebGPU.
 *
 * ## What is WebGPU?
 *
 * WebGPU is the modern browser GPU API, shipping in Chrome 113+ and Firefox
 * nightly. It lets JavaScript programs upload data to the GPU, run compute
 * programs on it, and read results back — without plugins or native code.
 *
 * > **Note:** WGSL does not support `f64` natively, so this library currently
 * > implements single-precision (`f32`) routines only.
 *
 * ## What is a compute shader?
 *
 * Each routine runs a **compute shader** written in WGSL (a GPU program that
 * runs thousands of instances in parallel, each processing one element). WebGPU
 * has vertex and fragment shaders for graphics too — compute shaders are
 * specifically for general computation. This library only uses compute shaders,
 * so we call them simply "shaders" throughout.
 *
 * ## New to GPU programming?
 *
 * Read these two chapters from the CUDA Programming Guide — the mental models
 * transfer directly to WebGPU; only the terminology changes. Then come back here.
 *
 * - [Introduction](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/introduction.html) —
 *   why GPUs exist, GPU vs CPU design philosophy
 * - [Programming Model](https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html) —
 *   threads, blocks, grids, warps, memory hierarchy
 *
 * ### CUDA → WebGPU terminology
 *
 * | CUDA | WebGPU |
 * |---|---|
 * | Thread | Invocation |
 * | Thread block | Workgroup |
 * | Grid | Dispatch |
 * | `__global__` function | `@compute` shader |
 * | `threadIdx.x` | `local_invocation_id` |
 * | `blockIdx.x` | `workgroup_id` |
 * | `blockDim.x` | `@workgroup_size(N)` |
 * | Shared memory | `var<workgroup>` |
 * | Global memory | Storage buffer |
 * | `cudaMemcpy` host→device | `device.queue.writeBuffer` |
 * | `cudaMemcpy` device→host | `mapAsync` + `getMappedRange` |
 *
 * ## WebGPU resources
 *
 * - [WebGPU Fundamentals](https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html#a-run-computations-on-the-gpu) —
 *   running computations on the GPU
 * - [WebGPU Compute Shaders](https://webgpufundamentals.org/webgpu/lessons/webgpu-compute-shaders.html)
 * - [GPU Compute with WebGPU](https://developer.chrome.com/docs/capabilities/web-apis/gpu-compute?hl=en) —
 *   Chrome's practical guide to compute pipelines
 * - [Chrome WebGPU overview](https://developer.chrome.com/docs/web-platform/webgpu/overview?hl=en)
 *
 * ### Further reading
 *
 * - [Chrome "New in WebGPU" series](https://developer.chrome.com/tags/new-in-webgpu) —
 *   feature-by-feature changelog with code examples
 * - [MDN WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
 * - [W3C WebGPU spec](https://www.w3.org/TR/webgpu/)
 *
 * @module devdocs
 */
