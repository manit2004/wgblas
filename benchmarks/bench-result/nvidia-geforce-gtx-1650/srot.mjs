/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.0739 | 0.0029 | 0.1758 | 42.0% |
 * | 64 | 0.0073 | 0.1400 | 0.0028 | 0.3636 | 38.5% |
 * | 128 | 0.0074 | 0.2753 | 0.0028 | 0.7191 | 38.3% |
 * | 512 | 0.0072 | 1.1353 | 0.0029 | 2.8444 | 39.9% |
 * | 1024 | 0.0069 | 2.3649 | 0.0037 | 4.3761 | 54.0% |
 * | 4096 | 0.0074 | 8.8086 | 0.0035 | 18.6182 | 47.3% |
 * | 16384 | 0.0082 | 32.0000 | 0.0039 | 66.6016 | 48.0% |
 * | 65536 | 0.0102 | 102.4000 | 0.0070 | 150.3119 | 68.1% |
 * | 262144 | 0.0302 | 138.9210 | 0.0283 | 148.2715 | 93.7% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1016 | 165.1821 | 99.2% |
 * | 4194304 | 0.3911 | 171.5813 | 0.3969 | 169.0842 | 101.5% |
 * | 16777216 | 1.5503 | 173.1466 | 1.5915 | 168.6644 | 102.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![srot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-default.svg)
 *
 * ![srot-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-default.svg)
 *
 * ## See also
 *
 * - [srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/srot.js) — WebGPU benchmark script
 * - [srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/srot.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0072 | 0.0714 | 0.0034 | 0.1509 | 47.3% |
 * | 64 | 0.0073 | 0.1407 | 0.0034 | 0.3005 | 46.8% |
 * | 128 | 0.0070 | 0.2929 | 0.0035 | 0.5792 | 50.6% |
 * | 512 | 0.0073 | 1.1179 | 0.0037 | 2.1880 | 51.1% |
 * | 1024 | 0.0073 | 2.2407 | 0.0038 | 4.3025 | 52.1% |
 * | 4096 | 0.0081 | 8.0630 | 0.0041 | 16.0000 | 50.4% |
 * | 16384 | 0.0103 | 25.5202 | 0.0066 | 39.4795 | 64.6% |
 * | 65536 | 0.0287 | 36.5714 | 0.0272 | 38.5053 | 95.0% |
 * | 262144 | 0.1010 | 41.5113 | 0.0996 | 42.1115 | 98.6% |
 * | 1048576 | 0.3908 | 42.9287 | 0.3871 | 43.3403 | 99.1% |
 * | 4194304 | 1.5422 | 43.5139 | 1.5391 | 43.6030 | 99.8% |
 *
 * ![srot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride4.svg)
 *
 * ![srot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0030 | 0.1702 | 49.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0030 | 0.3368 | 49.5% |
 * | 128 | 0.0061 | 0.3333 | 0.0032 | 0.6337 | 52.6% |
 * | 512 | 0.0063 | 1.3061 | 0.0042 | 1.9542 | 66.8% |
 * | 1024 | 0.0065 | 2.5222 | 0.0042 | 3.9084 | 64.5% |
 * | 4096 | 0.0095 | 6.9306 | 0.0057 | 11.4413 | 60.6% |
 * | 16384 | 0.0349 | 7.5122 | 0.0339 | 7.7393 | 97.1% |
 * | 65536 | 0.1411 | 7.4338 | 0.1331 | 7.8760 | 94.4% |
 * | 262144 | 0.5513 | 7.6083 | 0.5293 | 7.9245 | 96.0% |
 * | 1048576 | 2.2176 | 7.5656 | 2.1139 | 7.9367 | 95.3% |
 *
 * ![srot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride32.svg)
 *
 * ![srot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2995 | 0.0042 | 1.9542 | 66.5% |
 * | 1024 | 0.0065 | 2.5222 | 0.0042 | 3.9084 | 64.5% |
 * | 4096 | 0.0106 | 6.1873 | 0.0090 | 7.3143 | 84.6% |
 * | 16384 | 0.0614 | 4.2667 | 0.0690 | 3.7979 | 112.3% |
 * | 65536 | 0.2888 | 3.6312 | 0.2950 | 3.5540 | 102.2% |
 *
 * ![srot-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride256.svg)
 *
 * ![srot-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/stride.srot.js) — WebGPU stride-sweep benchmark script
 * - [stride.srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/stride.srot.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
