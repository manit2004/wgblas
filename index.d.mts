export { GpuVector } from "./src/classes/GpuVector.mjs";
export {
  randomFloat32Array,
  randomFloat64Array,
} from "./src/random/random.mjs";
export { sscal } from "./src/sscal/sscal.mjs";
export { sswap } from "./src/sswap/sswap.mjs";
export { saxpy } from "./src/saxpy/saxpy.mjs";
export { scopy } from "./src/scopy/scopy.mjs";
export { sdot } from "./src/sdot/sdot.mjs";
export { sasum } from "./src/sasum/sasum.mjs";
export { snrm2 } from "./src/snrm2/snrm2.mjs";
export { isamax } from "./src/isamax/isamax.mjs";
export { srot } from "./src/srot/srot.mjs";
export { srotm } from "./src/srotm/srotm.mjs";

/**
 * Initializes the WebGPU device.
 *
 * @param options.powerPreference - GPU power preference (default: `"high-performance"`).
 *   This is a hint to the browser: on dual-GPU systems, `"high-performance"` typically favors the discrete GPU
 *   and `"low-power"` favors the integrated one.
 *   See [MDN: GPU.requestAdapter()](https://developer.mozilla.org/en-US/docs/Web/API/GPU/requestAdapter).
 * @param options.benchmark - enable GPU timestamp queries; BLAS functions return `{ result, gpuTimeMs }` (default: `false`)
 *
 * @example Default (high-performance GPU)
 * ```js
 * import { init } from "wgblas";
 * const device = await init();
 * ```
 *
 * @example Low-power (integrated GPU)
 * ```js
 * import { init } from "wgblas";
 * const device = await init({ powerPreference: "low-power" });
 * ```
 *
 * @example Benchmark mode
 * ```js
 * import { init, sscal } from "wgblas";
 * const device = await init({ benchmark: true });
 * const { result, gpuTimeMs } = await sscal(device, n, alpha, x, 1);
 * console.log(`GPU time: ${gpuTimeMs} ms`);
 * ```
 * @see [init.mjs](https://github.com/manit2004/wgblas/blob/main/src/init.mjs#L18-L54)
 * @category Core
 */
export declare function init(options?: {
  powerPreference?: GPUPowerPreference;
  benchmark?: boolean;
}): Promise<string>;

/**
 * Destroys the WebGPU device, releases the adapter, resets benchmark state, and fires all internal
 * cleanup callbacks (e.g. releasing cached GPU pipelines and buffers). Call when done (required in Node.js to prevent crash on exit).
 *
 * @example
 * ```js
 * import { init, cleanup } from "wgblas";
 *
 * const device = await init();
 * // ... use BLAS routines ...
 * if (typeof process !== "undefined") cleanup();
 * ```
 * @see [init.mjs](https://github.com/manit2004/wgblas/blob/main/src/init.mjs#L56-L65)
 * @category Core
 */
export declare function cleanup(): void;
