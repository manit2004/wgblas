/**
 * @module docs
 */
export { GpuVector } from "./src/classes/GpuVector.mjs";
export { GpuMatrix } from "./src/classes/GpuMatrix.mjs";
export {
  randomFloat32Array,
  randomFloat64Array,
  randomTriangularFloat32Array,
} from "./src/random/random.mjs";
export { sscal } from "./src/sscal/sscal.mjs";
export { sswap } from "./src/sswap/sswap.mjs";
export { saxpy } from "./src/saxpy/saxpy.mjs";
export { scopy } from "./src/scopy/scopy.mjs";
export { sdot } from "./src/sdot/sdot.mjs";
export { sasum } from "./src/sasum/sasum.mjs";
export { dasum } from "./src/dasum/dasum.mjs";
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
 * @example Default (high-performance GPU)
 * ```js
 * import { init, gpuName } from "wgblas";
 * await init();
 * const { description, device } = gpuName();
 * console.log("description:", description, "device:", device);
 * ```
 *
 * @example Low-power (integrated GPU)
 * ```js
 * import { init, gpuName } from "wgblas";
 * await init({ powerPreference: "low-power" });
 * const { description, device } = gpuName();
 * console.log("description:", description, "device:", device);
 * ```
 *
 * @example Benchmark mode
 * ```js
 * import { init, sscal } from "wgblas";
 * const device = await init({ benchmark: true });
 * const n = 5;
 * const alpha = 2.0;
 * const x = new Float32Array([1, 2, 3, 4, 5]);
 * const { x: result, gpuTimeMs } = await sscal(device, n, alpha, x, 1);
 * console.log(`Result: [${Array.from(result).join(", ")}]`);
 * console.log(`GPU time: ${gpuTimeMs.toFixed(3)} ms`);
 * ```
 * @example Two GPUs at once
 * ```js
 * import { init, cleanup, gpuName, sscal } from "wgblas";
 * const dGpu = await init({ powerPreference: "high-performance" });
 * const iGpu = await init({ powerPreference: "low-power" });
 * console.log(gpuName(dGpu).description, "and", gpuName(iGpu).description);
 * const [a, b] = await Promise.all([
 *   sscal(dGpu, 4, 2, new Float32Array([1, 2, 3, 4]), 1),
 *   sscal(iGpu, 4, 5, new Float32Array([1, 2, 3, 4]), 1),
 * ]);
 * cleanup(); // releases both
 * ```
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
 * @example
 * ```js
 * import { init, cleanup, gpuName } from "wgblas";
 *
 * await init();
 * console.log("GPU:", gpuName().description);
 * if (typeof process !== "undefined") cleanup(); // Node.js only — browser cleanup is automatic
 * ```
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
 * @example
 * ```js
 * import { init, gpuName } from "wgblas";
 * await init();
 * const { description, device } = gpuName();
 * console.log("description:", description, "device:", device);
 * ```
 * @see [Source code: init.mjs](https://github.com/manit2004/wgblas/blob/main/src/init.mjs#L81-L87)
 * @category Core
 */
export declare function gpuName(device?: GPUDevice): { description: string; device: string };
