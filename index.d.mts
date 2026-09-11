/**
 * @module docs
 */
export { GpuVector } from "./src/classes/GpuVector.mjs";
export { GpuMatrix } from "./src/classes/GpuMatrix.mjs";
export { Complex32, Complex32Array } from "./src/classes/Complex32.mjs";
export { Complex64, Complex64Array } from "./src/classes/Complex64.mjs";
export {
  randomFloat32Array,
  randomFloat64Array,
  randomTriangularFloat32Array,
} from "./src/random/random.mjs";
export { sscal } from "./src/sscal/sscal.mjs";
export { cscal } from "./src/cscal/cscal.mjs";
export { dscal } from "./src/dscal/dscal.mjs";
export { sswap } from "./src/sswap/sswap.mjs";
export { saxpy } from "./src/saxpy/saxpy.mjs";
export { daxpy } from "./src/daxpy/daxpy.mjs";
export { scopy } from "./src/scopy/scopy.mjs";
export { sdot } from "./src/sdot/sdot.mjs";
export { sasum } from "./src/sasum/sasum.mjs";
export { dasum } from "./src/dasum/dasum.mjs";
export { ddot } from "./src/ddot/ddot.mjs";
export { snrm2 } from "./src/snrm2/snrm2.mjs";
export { isamax } from "./src/isamax/isamax.mjs";
export { idamax } from "./src/idamax/idamax.mjs";
export { srot } from "./src/srot/srot.mjs";
export { srotm } from "./src/srotm/srotm.mjs";
export { sgemv } from "./src/sgemv/sgemv.mjs";
export { ssymv } from "./src/ssymv/ssymv.mjs";
export { strmv } from "./src/strmv/strmv.mjs";
export { strsv } from "./src/strsv/strsv.mjs";
export { sger } from "./src/sger/sger.mjs";
export { ssyr } from "./src/ssyr/ssyr.mjs";
export { ssyr2 } from "./src/ssyr2/ssyr2.mjs";
export { sgemm } from "./src/sgemm/sgemm.mjs";
export { sgemmtr } from "./src/sgemmtr/sgemmtr.mjs";
export { ssyrk } from "./src/ssyrk/ssyrk.mjs";
export { ssyr2k } from "./src/ssyr2k/ssyr2k.mjs";
export { ssymm } from "./src/ssymm/ssymm.mjs";
export { strmm } from "./src/strmm/strmm.mjs";
export { strsm } from "./src/strsm/strsm.mjs";

/**
 * Initializes the WebGPU device.
 *
 * Devices are cached per option set: the same options return the same device,
 * different options a separate one — so one process can drive several GPUs
 * (`"high-performance"` and `"low-power"` typically resolve to the discrete and
 * integrated adapters). Each routine dispatches to the device you pass it; GPU
 * buffers cannot cross devices, so a `GpuVector`/`GpuMatrix` from one is
 * rejected by another. {@link cleanup} releases them all.
 *
 * @param options.powerPreference - GPU power preference (default: `"high-performance"`).
 *   This is a hint to the browser: on dual-GPU systems, `"high-performance"` typically favors the discrete GPU
 *   and `"low-power"` favors the integrated one.
 *   See [MDN: GPU.requestAdapter()](https://developer.mozilla.org/en-US/docs/Web/API/GPU/requestAdapter).
 * @param options.benchmark - enable GPU timestamp queries; BLAS functions then also return `gpuTimeMs`
 *   alongside their normal result (e.g. sscal returns `{ x, gpuTimeMs }`, saxpy returns `{ y, gpuTimeMs }`) —
 *   see each routine's own docs for its exact return shape (default: `false`)
 * @param options.dumpShaders - Node-only. Forwards Dawn's `dump_shaders` debug toggle, printing
 *   each pipeline's WGSL and compiled backend IR (SPIR-V/Vulkan, MSL/Metal, or HLSL/D3D12,
 *   whichever Dawn picked) to stderr as it compiles. A Dawn passthrough, not a wgblas format —
 *   no effect in the browser, which gives pages no API to request compiled shader IR (default: `false`)
 *
 * **Default (high-performance GPU):**
 * {@includeCode examples/init/init.js}
 *
 * **Low-power (integrated GPU):**
 * {@includeCode examples/init-low-power/init-low-power.js}
 *
 * **Benchmark mode:**
 * {@includeCode examples/init-benchmark/init-benchmark.js}
 *
 * **Two GPUs at once:**
 * {@includeCode examples/init-two-gpus/init-two-gpus.js}
 *
 * @see [Source code: init.mjs](https://github.com/manit2004/wgblas/blob/main/src/init.mjs#L18-L54)
 * @category Core
 */
export declare function init(options?: {
  powerPreference?: GPUPowerPreference;
  benchmark?: boolean;
  dumpShaders?: boolean;
}): Promise<GPUDevice>;

/**
 * Destroys devices created by {@link init} and releases their cached pipelines and buffers.
 * Call when done (required in Node.js to prevent crash on exit).
 *
 * With no argument, releases every device at once. Pass a device to release
 * just that one and leave the others usable — handy when driving several GPUs.
 * Unknown or already-released devices are ignored, so this is safe to call
 * more than once.
 *
 * @param device - the device to release; omit to release all of them.
 *
 * {@includeCode examples/cleanup/cleanup.js}
 * @see [Source code: init.mjs](https://github.com/manit2004/wgblas/blob/main/src/init.mjs#L56-L65)
 * @category Core
 */
export declare function cleanup(device?: GPUDevice): void;

/**
 * Returns the GPU device name from the WebGPU adapter info. Must be called after `init()`.
 *
 * @param device - which device to report on; defaults to the one from the first
 *   `init()` call. Pass it explicitly when driving more than one GPU.
 *
 * {@includeCode examples/init/init.js}
 * @see [Source code: init.mjs](https://github.com/manit2004/wgblas/blob/main/src/init.mjs#L81-L87)
 * @category Core
 */
export declare function gpuName(device?: GPUDevice): { description: string; device: string };
