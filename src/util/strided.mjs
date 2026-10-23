/** @module devdocs/utility-functions/strided */
import { createParamsBuffer, createStorageBuffer } from "./buffer.mjs";
import { createBindGroup } from "./bindgroup.mjs";
import { getPipeline } from "./pipeline.mjs";
import { WGS } from "./constants.mjs";

/**
 * Builds a pass that packs a strided vector (`src[i*inc]`, `i < n`) into a
 * new contiguous buffer. Level 2 kernels re-read a vector once per matrix
 * row, so a non-unit stride repeats the scattered gather n times; packing
 * first costs one O(n) pass and lets the O(n²) kernel run at unit stride.
 *
 * Returns the pass (for {@link runComputePasses}) plus the buffers the
 * caller must destroy.
 * @param {GPUDevice} device
 * @param {GPUBuffer} src - the strided vector's buffer
 * @param {number} n - logical length
 * @param {number} inc - stride (> 1)
 * @param {string} label
 * @returns {Promise<{ buffer: GPUBuffer, params: GPUBuffer, pass: object }>}
 */
export async function gatherStridedPass(device, src, n, inc, label) {
  const pipeline = await getPipeline(device, "gather_strided");
  const buffer = createStorageBuffer(device, n * 4, label);
  const params = createParamsBuffer(
    device,
    [
      { value: n, type: "u32" },
      { value: inc, type: "u32" },
    ],
    `${label}-params`,
  );
  const bindGroup = createBindGroup(device, pipeline.getBindGroupLayout(0), [
    src,
    buffer,
    params,
  ]);
  const workgroups = Math.min(
    Math.ceil(n / WGS),
    device.limits.maxComputeWorkgroupsPerDimension,
  );
  return { buffer, params, pass: { pipeline, bindGroup, workgroups } };
}

/**
 * Whether packing a strided vector pays for itself when `rereads` rows each
 * read the whole vector. Packing a double-double vector costs two extra
 * dispatches (one per half), which at small sizes outweighs the gain
 * (measured on a GTX 1650: dger/dsyr/dsyr2 at stride 4-5 dropped ~15 points
 * of cuBLAS efficiency at n=256 when packed), while at large sizes or wide
 * strides — every element on its own 32-byte sector — it's a 2-8x win.
 * Measured crossover: pack from 2048 rows, or from 1024 rows at stride >= 8.
 * @param {number} inc - the vector's stride
 * @param {number} rereads - how many rows re-read the whole vector
 * @returns {boolean}
 */
export function worthPackingDD(inc, rereads) {
  return inc > 1 && (rereads >= 2048 || (rereads >= 1024 && inc >= 8));
}
