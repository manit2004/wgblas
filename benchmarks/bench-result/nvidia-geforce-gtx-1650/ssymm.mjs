/**
 * Benchmark results for ssymm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0151 | 1.6271 | 0.0059 | 4.1626 | 39.1% |
 * | 64 | 0.0194 | 5.0651 | 0.0088 | 11.1103 | 45.6% |
 * | 128 | 0.0340 | 11.5761 | 0.0246 | 16.0000 | 72.4% |
 * | 256 | 0.1455 | 10.8086 | 0.4520 | 3.4797 | 310.6% |
 * | 512 | 0.4731 | 13.2987 | 1.0060 | 6.2538 | 212.6% |
 * | 1024 | 3.2689 | 7.6986 | 6.3954 | 3.9350 | 195.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-default.svg)
 *
 * ![ssymm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ssymm.js) — WebGPU benchmark script
 * - [ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ssymm.c) — CUDA / cuBLAS reference script
 *
 * ## side sweep
 *
 * Whether `A` pre- or post-multiplies `B`. The two settings traverse the same data in different orders, so this is a scheduling and coalescing question rather than an arithmetic one — both do identical flops.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = left</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0084 | 11.7476 | 58.4% |
 * | 128 | 0.0226 | 17.3928 | 0.0244 | 16.1366 | 107.8% |
 * | 256 | 0.0756 | 20.8051 | 0.1093 | 14.3909 | 144.6% |
 * | 512 | 0.2724 | 23.1005 | 0.2550 | 24.6731 | 93.6% |
 * | 1024 | 1.6404 | 15.3408 | 1.5392 | 16.3498 | 93.8% |
 * | 2048 | 12.2895 | 8.1910 | 11.3719 | 8.8519 | 92.5% |
 *
 * ![ssymm-sideleft GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-sideleft.svg)
 *
 * ![ssymm-sideleft ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-sideleft.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = right</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0152 | 6.4606 | 0.0094 | 10.4668 | 61.7% |
 * | 128 | 0.0232 | 16.9841 | 0.0266 | 14.7692 | 115.0% |
 * | 256 | 0.0758 | 20.7436 | 0.1223 | 12.8620 | 161.3% |
 * | 512 | 0.2763 | 22.7727 | 0.2269 | 27.7303 | 82.1% |
 * | 1024 | 1.6404 | 15.3414 | 1.3991 | 17.9877 | 85.3% |
 * | 2048 | 12.3509 | 8.1503 | 10.3863 | 9.6919 | 84.1% |
 *
 * ![ssymm-sideright GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-sideright.svg)
 *
 * ![ssymm-sideright ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-sideright.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [side.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/side.ssymm.js) — WebGPU side-sweep benchmark script
 * - [side.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/side.ssymm.c) — CUDA / cuBLAS side-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymm
 */
