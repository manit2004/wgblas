/**
 * Benchmark results for sgemmtr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0115 | 1.0711 |
 * | 64 | 0.0143 | 3.4286 |
 * | 128 | 0.0237 | 8.2971 |
 * | 256 | 0.0777 | 10.1198 |
 * | 512 | 0.2848 | 11.0448 |
 * | 1024 | 1.9912 | 6.3194 |
 *
 * ![sgemmtr-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-default.svg)
 *
 * ![sgemmtr-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/sgemmtr.js) — WebGPU benchmark script
 *
 * ## transB sweep
 *
 * `op(B)` — the counterpart to the transA sweep, on the operand streamed along the kernel's inner loop, where a stride change has the most room to matter.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = no-transpose</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0109 | 6.0235 |
 * | 128 | 0.0182 | 14.4099 |
 * | 256 | 0.0612 | 17.1470 |
 * | 512 | 0.2296 | 18.2653 |
 * | 1024 | 1.6342 | 10.2665 |
 * | 2048 | 12.3310 | 5.4423 |
 *
 * ![sgemmtr-transBnotranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-transBnotranspose.svg)
 *
 * ![sgemmtr-transBnotranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-transBnotranspose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = transpose</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0124 | 5.2920 |
 * | 128 | 0.0237 | 11.0404 |
 * | 256 | 0.1041 | 10.0685 |
 * | 512 | 0.3392 | 12.3653 |
 * | 1024 | 2.4498 | 6.8483 |
 * | 2048 | 18.6041 | 3.6072 |
 *
 * ![sgemmtr-transBtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-transBtranspose.svg)
 *
 * ![sgemmtr-transBtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-transBtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [transB.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/transB.sgemmtr.js) — WebGPU transB-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemmtr
 */
