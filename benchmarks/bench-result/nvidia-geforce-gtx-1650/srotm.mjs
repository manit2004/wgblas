/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0842 | 0.0029 | 0.1778 | 47.4% |
 * | 64 | 0.0061 | 0.1667 | 0.0028 | 0.3657 | 45.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0028 | 0.7314 | 45.6% |
 * | 512 | 0.0061 | 1.3333 | 0.0029 | 2.8132 | 47.4% |
 * | 1024 | 0.0061 | 2.6667 | 0.0029 | 5.6264 | 47.4% |
 * | 4096 | 0.0061 | 10.6667 | 0.0031 | 21.3333 | 50.0% |
 * | 16384 | 0.0069 | 38.0139 | 0.0039 | 67.4239 | 56.4% |
 * | 65536 | 0.0085 | 123.6528 | 0.0072 | 145.6356 | 84.9% |
 * | 262144 | 0.0289 | 145.3126 | 0.0274 | 153.1215 | 94.9% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1008 | 166.5199 | 98.4% |
 * | 4194304 | 0.3963 | 169.3437 | 0.3936 | 170.4863 | 99.3% |
 * | 16777216 | 1.5601 | 172.0617 | 1.5664 | 171.3692 | 100.4% |
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
 * | 32 | 0.0061 | 0.0833 | 0.0031 | 0.1633 | 51.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3536 | 47.1% |
 * | 128 | 0.0061 | 0.3333 | 0.0037 | 0.5590 | 59.6% |
 * | 512 | 0.0061 | 1.3333 | 0.0032 | 2.5347 | 52.6% |
 * | 1024 | 0.0061 | 2.6667 | 0.0035 | 4.7407 | 56.3% |
 * | 4096 | 0.0066 | 9.8937 | 0.0038 | 17.3559 | 57.0% |
 * | 16384 | 0.0085 | 30.6816 | 0.0054 | 48.9075 | 62.7% |
 * | 65536 | 0.0304 | 34.5290 | 0.0270 | 38.8707 | 88.8% |
 * | 262144 | 0.1024 | 40.9600 | 0.1005 | 41.7360 | 98.1% |
 * | 1048576 | 0.3921 | 42.7833 | 0.3950 | 42.4765 | 100.7% |
 * | 4194304 | 1.5442 | 43.4589 | 1.5708 | 42.7240 | 101.7% |
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
 * | 32 | 0.0061 | 0.0833 | 0.0032 | 0.1616 | 51.6% |
 * | 64 | 0.0061 | 0.1667 | 0.0032 | 0.3168 | 52.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0037 | 0.5590 | 59.6% |
 * | 512 | 0.0065 | 1.2611 | 0.0040 | 2.0645 | 61.1% |
 * | 1024 | 0.0067 | 2.4498 | 0.0040 | 4.0960 | 59.8% |
 * | 4096 | 0.0099 | 6.6278 | 0.0058 | 11.2527 | 58.9% |
 * | 16384 | 0.0362 | 7.2367 | 0.0348 | 7.5294 | 96.1% |
 * | 65536 | 0.1331 | 7.8769 | 0.1340 | 7.8243 | 100.7% |
 * | 262144 | 0.5156 | 8.1348 | 0.5330 | 7.8694 | 103.4% |
 * | 1048576 | 2.1496 | 7.8049 | 2.1507 | 7.8007 | 100.1% |
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
 * | 512 | 0.0065 | 1.2549 | 0.0041 | 2.0157 | 62.3% |
 * | 1024 | 0.0067 | 2.4381 | 0.0038 | 4.2667 | 57.1% |
 * | 4096 | 0.0113 | 5.7935 | 0.0084 | 7.7576 | 74.7% |
 * | 16384 | 0.0635 | 4.1301 | 0.0672 | 3.9000 | 105.9% |
 * | 65536 | 0.2888 | 3.6312 | 0.3006 | 3.4878 | 104.1% |
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
