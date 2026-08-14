/**
 * Benchmark results for sswap on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0064 | 0.0806 | 0.0027 | 0.1893 | 42.6% |
 * | 64 | 0.0064 | 0.1604 | 0.0028 | 0.3721 | 43.1% |
 * | 128 | 0.0064 | 0.3200 | 0.0028 | 0.7356 | 43.5% |
 * | 512 | 0.0064 | 1.2864 | 0.0028 | 2.8764 | 44.7% |
 * | 1024 | 0.0064 | 2.5793 | 0.0028 | 5.8514 | 44.1% |
 * | 4096 | 0.0065 | 10.0392 | 0.0029 | 22.7556 | 44.1% |
 * | 16384 | 0.0074 | 35.2344 | 0.0039 | 67.7025 | 52.0% |
 * | 65536 | 0.0091 | 115.7880 | 0.0068 | 153.1215 | 75.6% |
 * | 262144 | 0.0289 | 145.1517 | 0.0284 | 147.8533 | 98.2% |
 * | 1048576 | 0.1020 | 164.4825 | 0.1021 | 164.3794 | 100.1% |
 * | 4194304 | 0.3928 | 170.8405 | 0.3988 | 168.2972 | 101.5% |
 * | 16777216 | 1.5606 | 172.0105 | 1.6036 | 167.3972 | 102.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sswap-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-default.svg)
 *
 * ![sswap-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-default.svg)
 *
 * ## See also
 *
 * - [sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/wgblas/sswap.js) — WebGPU benchmark script
 * - [sswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/cuda/sswap.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0071 | 0.0717 | 0.0029 | 0.1788 | 40.1% |
 * | 64 | 0.0069 | 0.1478 | 0.0028 | 0.3596 | 41.1% |
 * | 128 | 0.0072 | 0.2857 | 0.0029 | 0.6995 | 40.8% |
 * | 512 | 0.0072 | 1.1353 | 0.0031 | 2.6528 | 42.8% |
 * | 1024 | 0.0073 | 2.2456 | 0.0031 | 5.2784 | 42.5% |
 * | 4096 | 0.0080 | 8.1431 | 0.0034 | 19.1402 | 42.5% |
 * | 16384 | 0.0103 | 25.3622 | 0.0054 | 48.6172 | 52.2% |
 * | 65536 | 0.0287 | 36.5714 | 0.0269 | 39.0095 | 93.8% |
 * | 262144 | 0.1005 | 41.7493 | 0.1004 | 41.7560 | 100.0% |
 * | 1048576 | 0.3893 | 43.0910 | 0.3937 | 42.6146 | 101.1% |
 * | 4194304 | 1.5422 | 43.5143 | 1.5677 | 42.8082 | 101.6% |
 *
 * ![sswap-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride4.svg)
 *
 * ![sswap-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0031 | 0.1667 | 50.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0031 | 0.3351 | 49.7% |
 * | 128 | 0.0061 | 0.3333 | 0.0034 | 0.6009 | 55.5% |
 * | 512 | 0.0063 | 1.2995 | 0.0043 | 1.9176 | 67.8% |
 * | 1024 | 0.0065 | 2.5222 | 0.0042 | 3.9084 | 64.5% |
 * | 4096 | 0.0094 | 7.0017 | 0.0058 | 11.2527 | 62.2% |
 * | 16384 | 0.0352 | 7.4540 | 0.0338 | 7.7649 | 96.0% |
 * | 65536 | 0.1385 | 7.5729 | 0.1336 | 7.8486 | 96.5% |
 * | 262144 | 0.5427 | 7.7283 | 0.5253 | 7.9849 | 96.8% |
 * | 1048576 | 2.1908 | 7.6579 | 2.0900 | 8.0272 | 95.4% |
 *
 * ![sswap-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride32.svg)
 *
 * ![sswap-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2929 | 0.0042 | 1.9692 | 65.7% |
 * | 1024 | 0.0066 | 2.4976 | 0.0042 | 3.8788 | 64.4% |
 * | 4096 | 0.0103 | 6.3504 | 0.0093 | 7.0621 | 89.9% |
 * | 16384 | 0.0638 | 4.1094 | 0.0698 | 3.7561 | 109.4% |
 * | 65536 | 0.2908 | 3.6056 | 0.2972 | 3.5284 | 102.2% |
 *
 * ![sswap-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride256.svg)
 *
 * ![sswap-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/wgblas/stride.sswap.js) — WebGPU stride-sweep benchmark script
 * - [stride.sswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/cuda/stride.sswap.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sswap
 */
