# BLAS Routine Patterns

Every routine in this library follows the same structure. Understanding it once means you can read any routine file. BLAS reference spec lives at
 * [netlib.org/blas](https://www.netlib.org/blas/).

## The general flow

1. **Compile** — the WGSL shader is loaded and compiled into a compute pipeline by name (e.g. `getPipeline(device, "saxpy")`)
2. **Upload** — input `Float32Array`s are written to GPU storage buffers
3. **Bind** — buffers are grouped into a bind group so the shader can access them
4. **Dispatch** — the pipeline runs the shader with enough workgroups to cover all `n` elements; if benchmarking was enabled at `init()` time, a timestamp query is attached to this pass to record GPU start and end times
5. **Read back** — the result buffer is mapped to CPU memory and copied into a `Float32Array`; if benchmarking is active, the resolved timestamp query set is read back alongside the result and converted to a duration in milliseconds
6. **Destroy** — GPU buffers are explicitly freed via `destroyBuffers` (WebGPU does not garbage-collect them)

All routines are `async` because GPU operations — dispatching and mapping — are asynchronous by nature.

## Naming

This follows the BLAS naming convention:
- `s` — single precision (f32)
- `d` — double precision (f64, not yet supported — WGSL has no native f64)
- `c` / `z` — complex (not implemented yet)

## Inputs

Routines accept either `Float32Array` (raw arrays) or `GpuVector` (a wrapper that keeps buffers alive on the GPU between calls). Use `GpuVector` when calling the same routine repeatedly on the same data to avoid re-uploading on every call.

## Utility functions

The boilerplate — creating buffers, bind groups, pipelines, and compute passes — is factored into {@link devdocs/utility-functions}. Each step maps to one utility function rather than raw WebGPU objects inline.
