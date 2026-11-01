# BLAS Routine Patterns

Every routine in this library follows the same structure. Understanding it once means you can read any routine file. The BLAS reference spec lives at [netlib.org/blas](https://www.netlib.org/blas/).

## The general flow

0. **Validate** — `requireGpuDevice` and `requireSameDevice` first, then the routine's own argument checks, all before any GPU work
1. **Compile** — the WGSL shader is loaded and compiled into a compute pipeline by name, cached per device (e.g. `getPipeline(device, "saxpy")`; f64 routines pass an array of shader files, concatenated into one module)
2. **Upload** — host arrays are written to GPU storage buffers with `uploadBuffer` (f64 data split into hi/lo `f32` halves first), skipped for operands already on the GPU (`GpuVector`/`GpuMatrix`); scalars and sizes go into a uniform buffer via `createParamsBuffer`
3. **Bind** — buffers are grouped into a bind group with `createBindGroup`, in the order the shader declares its `@binding`s
4. **Dispatch** — `runComputePass` (or `runComputePasses` for dependent multi-pass routines, one command encoder) dispatches enough workgroups to cover the work, sized by `calcWorkgroups`; if benchmarking was enabled at `init()` time, timestamp writes bracket the pass(es) to record GPU start and end times
5. **Read back** — `stageReadback` encodes a copy into a pooled `MAP_READ` buffer, `submit` sends the encoder, and `extractResult` maps it and copies the result out (merging hi/lo back into `f64` for double precision); with benchmarking on, `extractTimestamp` turns the timestamps into `gpuTimeMs`. Skipped when the output is a GPU-resident operand
6. **Destroy** — temporary GPU buffers are freed in a `finally` via `destroyBuffers` (WebGPU does not garbage-collect them); GPU-resident operands are left alone

All routines are `async` because GPU operations — dispatching and mapping — are asynchronous by nature.

## Naming

This follows the BLAS naming convention:

- `s` — single precision (f32)
- `d` — double precision, emulated with double-double arithmetic (WGSL has no native f64)
- `c` — single-precision complex (`cscal` so far)
- `z` — double-precision complex (not implemented yet)
- `i` — returns an index (`isamax`, `idamax`)

## Inputs

Routines accept either host typed arrays — `Float32Array` for `s`, `Float64Array` for `d`, `Complex32Array` for `c` — or GPU-resident operands: `GpuVector` for vectors and `GpuMatrix` for matrices, wrappers that keep buffers alive on the GPU between calls. Use the GPU-resident forms when calling routines repeatedly on the same data, to avoid re-uploading on every call; their results stay on the GPU too.

## Utility functions

The boilerplate — creating buffers, bind groups, pipelines, and compute passes — is factored into {@link devdocs/utility-functions}. Each step maps to one utility function rather than raw WebGPU objects inline.
