/** @module devdocs/utility-functions/device */
import { GpuVector } from "../classes/GpuVector.mjs";
import { GpuMatrix } from "../classes/GpuMatrix.mjs";

/**
 * Throws if any GPU-resident operand belongs to a device other than the one
 * the routine was called with.
 *
 * A `GPUBuffer` is bound to the device that created it, and WebGPU has no way
 * to share one across devices. Handing a routine a `GpuMatrix` from device A
 * while passing device B fails deep inside bind-group creation as a
 * `GPUValidationError` with no indication that two devices are involved —
 * this turns it into a named, actionable error at the call boundary.
 *
 * Scalars, plain typed arrays and `undefined` entries are ignored, so callers
 * can pass their whole operand set without filtering.
 *
 * @param {GPUDevice} device - the device the routine will dispatch on
 * @param {string} routine - routine name, for the error message
 * @param {Record<string, unknown>} operands - operand name -> value
 * @throws {Error} if an operand is GPU-resident on a different device
 */
export function requireSameDevice(device, routine, operands) {
  for (const [name, value] of Object.entries(operands)) {
    if (!(value instanceof GpuVector) && !(value instanceof GpuMatrix)) continue;
    if (value.device !== device) {
      throw new Error(
        `${routine}: ${name} belongs to a different GPUDevice than the one passed in. ` +
        "GPU buffers cannot be shared across devices — recreate the operand on this " +
        "device, or call the routine with the device that owns it.",
      );
    }
  }
}
