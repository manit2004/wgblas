/**
 * Benchmark results for dswap on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.1422 | 0.0034 | 0.3048 | 46.7% |
 * | 64 | 0.0073 | 0.2801 | 0.0037 | 0.5541 | 50.5% |
 * | 128 | 0.0073 | 0.5639 | 0.0037 | 1.1082 | 50.9% |
 * | 512 | 0.0071 | 2.3063 | 0.0036 | 4.6126 | 50.0% |
 * | 1024 | 0.0074 | 4.4425 | 0.0036 | 9.1429 | 48.6% |
 * | 4096 | 0.0075 | 17.4298 | 0.0039 | 33.9917 | 51.3% |
 * | 16384 | 0.0091 | 57.7919 | 0.0050 | 105.0256 | 55.0% |
 * | 65536 | 0.0156 | 134.0204 | 0.0104 | 201.6492 | 66.5% |
 * | 262144 | 0.0545 | 153.7952 | 0.0514 | 163.3296 | 94.2% |
 * | 1048576 | 0.1996 | 168.0949 | 0.1954 | 171.7569 | 97.9% |
 * | 4194304 | 0.7762 | 172.9075 | 0.7717 | 173.9328 | 99.4% |
 * | 16777216 | 3.1903 | 168.2837 | 3.1234 | 171.8854 | 97.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dswap-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-default.svg)
 *
 * ![dswap-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-default.svg)
 *
 * ## See also
 *
 * - [dswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dswap/wgblas/dswap.js) — WebGPU benchmark script
 * - [dswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dswap/cuda/dswap.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0060 | 0.1711 | 0.0029 | 0.3497 | 48.9% |
 * | 64 | 0.0061 | 0.3333 | 0.0032 | 0.6465 | 51.6% |
 * | 128 | 0.0061 | 0.6667 | 0.0031 | 1.3333 | 50.0% |
 * | 512 | 0.0061 | 2.6736 | 0.0036 | 4.5310 | 59.0% |
 * | 1024 | 0.0061 | 5.3333 | 0.0041 | 8.0630 | 66.1% |
 * | 4096 | 0.0072 | 18.0839 | 0.0041 | 32.0000 | 56.5% |
 * | 16384 | 0.0129 | 40.7562 | 0.0095 | 55.1650 | 73.9% |
 * | 65536 | 0.0573 | 36.5714 | 0.0550 | 38.1134 | 96.0% |
 * | 262144 | 0.2283 | 36.7380 | 0.2092 | 40.1016 | 91.6% |
 * | 1048576 | 0.9134 | 36.7354 | 0.8257 | 40.6362 | 90.4% |
 * | 4194304 | 3.6478 | 36.7944 | 3.2923 | 40.7677 | 90.3% |
 *
 * ![dswap-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-stride4.svg)
 *
 * ![dswap-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.1667 | 0.0029 | 0.3556 | 46.9% |
 * | 64 | 0.0061 | 0.3333 | 0.0030 | 0.6809 | 49.0% |
 * | 128 | 0.0061 | 0.6667 | 0.0029 | 1.3913 | 47.9% |
 * | 512 | 0.0061 | 2.6667 | 0.0035 | 4.6758 | 57.0% |
 * | 1024 | 0.0063 | 5.2245 | 0.0036 | 8.9825 | 58.2% |
 * | 4096 | 0.0077 | 17.0667 | 0.0042 | 31.5077 | 54.2% |
 * | 16384 | 0.0182 | 28.7439 | 0.0184 | 28.4444 | 101.1% |
 * | 65536 | 0.0770 | 27.2273 | 0.0686 | 30.5672 | 89.1% |
 * | 262144 | 0.3012 | 27.8491 | 0.2657 | 31.5684 | 88.2% |
 * | 1048576 | 1.1973 | 28.0259 | 1.0547 | 31.8136 | 88.1% |
 *
 * ![dswap-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-stride5.svg)
 *
 * ![dswap-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.1667 | 0.0029 | 0.3478 | 47.9% |
 * | 64 | 0.0062 | 0.3299 | 0.0031 | 0.6667 | 49.5% |
 * | 128 | 0.0063 | 0.6497 | 0.0033 | 1.2249 | 53.0% |
 * | 512 | 0.0068 | 2.4151 | 0.0044 | 3.7101 | 65.1% |
 * | 1024 | 0.0077 | 4.2490 | 0.0044 | 7.5018 | 56.6% |
 * | 4096 | 0.0179 | 7.3339 | 0.0064 | 20.3781 | 36.0% |
 * | 16384 | 0.0688 | 7.6205 | 0.0430 | 12.1905 | 62.5% |
 * | 65536 | 0.2765 | 7.5852 | 0.1864 | 11.2527 | 67.4% |
 * | 262144 | 1.1201 | 7.4890 | 0.7566 | 11.0876 | 67.5% |
 *
 * ![dswap-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-stride32.svg)
 *
 * ![dswap-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.3333 | 0.0033 | 0.6275 | 53.1% |
 * | 128 | 0.0062 | 0.6598 | 0.0033 | 1.2427 | 53.1% |
 * | 512 | 0.0065 | 2.5037 | 0.0050 | 3.2821 | 76.3% |
 * | 1024 | 0.0072 | 4.5714 | 0.0041 | 8.0000 | 57.1% |
 * | 4096 | 0.0185 | 7.0926 | 0.0102 | 12.8000 | 55.4% |
 * | 16384 | 0.0758 | 6.9189 | 0.0491 | 10.6701 | 64.8% |
 * | 65536 | 0.3297 | 6.3612 | 0.2153 | 9.7415 | 65.3% |
 * | 262144 | 1.3640 | 6.1502 | 0.8911 | 9.4136 | 65.3% |
 *
 * ![dswap-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-stride33.svg)
 *
 * ![dswap-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0066 | 2.4976 | 0.0041 | 3.9537 | 63.2% |
 * | 1024 | 0.0073 | 4.4912 | 0.0041 | 8.0000 | 56.1% |
 * | 4096 | 0.0301 | 4.3598 | 0.0123 | 10.6667 | 40.9% |
 * | 16384 | 0.1434 | 3.6563 | 0.0737 | 7.1111 | 51.4% |
 * | 65536 | 0.6287 | 3.3355 | 0.3108 | 6.7469 | 49.4% |
 *
 * ![dswap-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-stride255.svg)
 *
 * ![dswap-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0068 | 2.4265 | 0.0048 | 3.3907 | 71.6% |
 * | 1024 | 0.0076 | 4.2845 | 0.0048 | 6.8725 | 62.3% |
 * | 4096 | 0.0267 | 4.9025 | 0.0095 | 13.8378 | 35.4% |
 * | 16384 | 0.1327 | 3.9499 | 0.0692 | 7.5782 | 52.1% |
 * | 65536 | 0.6427 | 3.2630 | 0.2992 | 7.0096 | 46.6% |
 *
 * ![dswap-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/gbps-stride256.svg)
 *
 * ![dswap-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dswap/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dswap/wgblas/stride.dswap.js) — WebGPU stride-sweep benchmark script
 * - [stride.dswap.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dswap/cuda/stride.dswap.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dswap
 */
