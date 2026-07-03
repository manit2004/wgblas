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
 * @param options.powerPreference - GPU power preference (default: "high-performance")
 * @param options.benchmark - enable GPU timestamp queries; BLAS functions return { result, gpuTimeMs } (default: false)
 */
export declare function init(options?: {
  powerPreference?: GPUPowerPreference;
  benchmark?: boolean;
}): Promise<string>;

/**
 * Destroys the WebGPU device. Call when done (required in Node.js to prevent crash on exit).
 */
export declare function cleanup(): void;
