export { sscal } from "./src/sscal/sscal.js";
export { sswap } from "./src/sswap/sswap.js";
export { saxpy } from "./src/saxpy/saxpy.js";
export { scopy } from "./src/scopy/scopy.js";
export { sdot } from "./src/sdot/sdot.js";
export { sasum } from "./src/sasum/sasum.js";
export { snrm2 } from "./src/snrm2/snrm2.js";
export { isamax } from "./src/isamax/isamax.js";
export { srot } from "./src/srot/srot.js";
export { srotm } from "./src/srotm/srotm.js";
export { GpuVector } from "./src/classes/GpuVector.js";

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
