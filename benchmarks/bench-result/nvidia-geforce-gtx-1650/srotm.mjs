/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 0.0694 | 0.0143 | 0.0357 | 194.4% |
 * | 64 | 0.0075 | 0.1359 | 0.0143 | 0.0714 | 190.3% |
 * | 128 | 0.0075 | 0.2735 | 0.0143 | 0.1429 | 191.4% |
 * | 512 | 0.0075 | 1.0917 | 0.0143 | 0.5714 | 191.1% |
 * | 1024 | 0.0075 | 2.1974 | 0.0143 | 1.1429 | 192.3% |
 * | 4096 | 0.0075 | 8.7149 | 0.0143 | 4.5714 | 190.6% |
 * | 16384 | 0.0082 | 32.0000 | 0.0155 | 16.9081 | 189.3% |
 * | 65536 | 0.0103 | 102.0810 | 0.0184 | 56.8889 | 179.4% |
 * | 262144 | 0.0307 | 136.5333 | 0.0420 | 99.7504 | 136.9% |
 * | 1048576 | 0.1031 | 162.6708 | 0.1188 | 141.2794 | 115.1% |
 * | 4194304 | 0.3930 | 170.7500 | 0.3958 | 169.5627 | 100.7% |
 * | 16777216 | 1.5646 | 171.5690 | 1.5605 | 172.0175 | 99.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![srotm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-default.svg)
 *
 * ![srotm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-default.svg)
 *
 * ## See also
 *
 * - [srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/srotm.js) — WebGPU benchmark script
 * - [srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/srotm.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0029 | 0.1739 | 47.9% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3575 | 46.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6737 | 49.5% |
 * | 512 | 0.0061 | 1.3333 | 0.0034 | 2.4151 | 55.2% |
 * | 1024 | 0.0063 | 2.5990 | 0.0032 | 5.1200 | 50.8% |
 * | 4096 | 0.0070 | 9.3730 | 0.0037 | 17.6552 | 53.1% |
 * | 16384 | 0.0088 | 29.9525 | 0.0053 | 49.4985 | 60.5% |
 * | 65536 | 0.0287 | 36.5714 | 0.0270 | 38.8246 | 94.2% |
 * | 262144 | 0.1023 | 40.9920 | 0.1004 | 41.7626 | 98.2% |
 * | 1048576 | 0.3973 | 42.2268 | 0.3946 | 42.5213 | 99.3% |
 * | 4194304 | 1.5454 | 43.4238 | 1.5709 | 42.7192 | 101.6% |
 *
 * ![srotm-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride4.svg)
 *
 * ![srotm-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0030 | 0.1693 | 49.2% |
 * | 64 | 0.0061 | 0.1667 | 0.0034 | 0.3048 | 54.7% |
 * | 128 | 0.0063 | 0.3265 | 0.0035 | 0.5899 | 55.4% |
 * | 512 | 0.0066 | 1.2397 | 0.0039 | 2.0984 | 59.1% |
 * | 1024 | 0.0069 | 2.3814 | 0.0039 | 4.1967 | 56.7% |
 * | 4096 | 0.0099 | 6.6278 | 0.0058 | 11.2527 | 58.9% |
 * | 16384 | 0.0356 | 7.3537 | 0.0344 | 7.6134 | 96.6% |
 * | 65536 | 0.1308 | 8.0157 | 0.1345 | 7.7963 | 102.8% |
 * | 262144 | 0.5181 | 8.0961 | 0.5365 | 7.8180 | 103.6% |
 * | 1048576 | 2.1463 | 7.8168 | 4.4330 | 3.7846 | 206.5% |
 *
 * ![srotm-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride32.svg)
 *
 * ![srotm-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0067 | 1.2278 | 0.0041 | 2.0000 | 61.4% |
 * | 1024 | 0.0071 | 2.3167 | 0.0041 | 4.0315 | 57.5% |
 * | 4096 | 0.0114 | 5.7690 | 0.0082 | 8.0000 | 72.1% |
 * | 16384 | 0.0637 | 4.1155 | 0.0676 | 3.8788 | 106.1% |
 * | 65536 | 0.2909 | 3.6046 | 0.2924 | 3.5865 | 100.5% |
 *
 * ![srotm-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride256.svg)
 *
 * ![srotm-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/stride.srotm.js) — WebGPU stride-sweep benchmark script
 * - [stride.srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/stride.srotm.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srotm
 */
