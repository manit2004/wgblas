/**
 * Benchmark results for dswap on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.1680 | 0.0028 | 0.3721 | 45.1% |
 * | 64 | 0.0061 | 0.3333 | 0.0028 | 0.7273 | 45.8% |
 * | 128 | 0.0061 | 0.6667 | 0.0029 | 1.4144 | 47.1% |
 * | 512 | 0.0060 | 2.7380 | 0.0031 | 5.3613 | 51.1% |
 * | 1024 | 0.0061 | 5.3613 | 0.0031 | 10.5026 | 51.0% |
 * | 4096 | 0.0061 | 21.3333 | 0.0031 | 42.2268 | 50.5% |
 * | 16384 | 0.0075 | 70.0171 | 0.0041 | 128.0000 | 54.7% |
 * | 65536 | 0.0123 | 170.6667 | 0.0087 | 240.9412 | 70.8% |
 * | 262144 | 0.0532 | 157.5385 | 0.0515 | 162.8224 | 96.8% |
 * | 1048576 | 0.2007 | 167.1837 | 0.1982 | 169.3163 | 98.7% |
 * | 4194304 | 0.7885 | 170.2234 | 0.7841 | 171.1786 | 99.4% |
 * | 16777216 | 3.1642 | 169.6682 | 3.1280 | 171.6339 | 98.9% |
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
 * | 32 | 0.0061 | 0.1667 | 0.0028 | 0.3596 | 46.3% |
 * | 64 | 0.0061 | 0.3333 | 0.0030 | 0.6919 | 48.2% |
 * | 128 | 0.0061 | 0.6667 | 0.0030 | 1.3474 | 49.5% |
 * | 512 | 0.0061 | 2.6667 | 0.0036 | 4.5714 | 58.3% |
 * | 1024 | 0.0061 | 5.3333 | 0.0036 | 8.9825 | 59.4% |
 * | 4096 | 0.0076 | 17.3192 | 0.0041 | 32.0000 | 54.1% |
 * | 16384 | 0.0130 | 40.4543 | 0.0086 | 61.1343 | 66.2% |
 * | 65536 | 0.0573 | 36.5714 | 0.0553 | 37.9479 | 96.4% |
 * | 262144 | 0.2274 | 36.8931 | 0.2094 | 40.0617 | 92.1% |
 * | 1048576 | 0.9131 | 36.7483 | 0.8247 | 40.6858 | 90.3% |
 * | 4194304 | 3.6359 | 36.9149 | 3.2930 | 40.7584 | 90.6% |
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
 * | 32 | 0.0061 | 0.1667 | 0.0028 | 0.3596 | 46.3% |
 * | 64 | 0.0061 | 0.3333 | 0.0029 | 0.7111 | 46.9% |
 * | 128 | 0.0061 | 0.6667 | 0.0030 | 1.3474 | 49.5% |
 * | 512 | 0.0061 | 2.6667 | 0.0036 | 4.5714 | 58.3% |
 * | 1024 | 0.0062 | 5.2784 | 0.0037 | 8.9043 | 59.3% |
 * | 4096 | 0.0078 | 16.8560 | 0.0041 | 31.7519 | 53.1% |
 * | 16384 | 0.0183 | 28.5934 | 0.0182 | 28.7439 | 99.5% |
 * | 65536 | 0.0770 | 27.2442 | 0.0683 | 30.6960 | 88.8% |
 * | 262144 | 0.3031 | 27.6757 | 0.2660 | 31.5399 | 87.7% |
 * | 1048576 | 1.1960 | 28.0548 | 1.0542 | 31.8305 | 88.1% |
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
 * | 32 | 0.0061 | 0.1667 | 0.0029 | 0.3575 | 46.6% |
 * | 64 | 0.0064 | 0.3184 | 0.0031 | 0.6702 | 47.5% |
 * | 128 | 0.0065 | 0.6290 | 0.0034 | 1.1963 | 52.6% |
 * | 512 | 0.0072 | 2.2857 | 0.0043 | 3.8496 | 59.4% |
 * | 1024 | 0.0075 | 4.3854 | 0.0043 | 7.6418 | 57.4% |
 * | 4096 | 0.0184 | 7.1359 | 0.0063 | 20.8448 | 34.2% |
 * | 16384 | 0.0693 | 7.5607 | 0.0425 | 12.3327 | 61.3% |
 * | 65536 | 0.2763 | 7.5896 | 0.1883 | 11.1361 | 68.2% |
 * | 262144 | 1.1223 | 7.4745 | 0.7493 | 11.1946 | 66.8% |
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
 * | 64 | 0.0061 | 0.3333 | 0.0030 | 0.6882 | 48.4% |
 * | 128 | 0.0063 | 0.6547 | 0.0031 | 1.3196 | 49.6% |
 * | 512 | 0.0066 | 2.4976 | 0.0041 | 4.0000 | 62.4% |
 * | 1024 | 0.0071 | 4.6335 | 0.0041 | 8.0000 | 57.9% |
 * | 4096 | 0.0186 | 7.0621 | 0.0096 | 13.6080 | 51.9% |
 * | 16384 | 0.0762 | 6.8826 | 0.0492 | 10.6667 | 64.5% |
 * | 65536 | 0.3271 | 6.4110 | 0.2155 | 9.7307 | 65.9% |
 * | 262144 | 1.3570 | 6.1815 | 0.8924 | 9.4002 | 65.8% |
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
 * | 512 | 0.0067 | 2.4381 | 0.0041 | 4.0315 | 60.5% |
 * | 1024 | 0.0076 | 4.2935 | 0.0041 | 8.0000 | 53.7% |
 * | 4096 | 0.0296 | 4.4353 | 0.0128 | 10.2528 | 43.3% |
 * | 16384 | 0.1444 | 3.6320 | 0.0737 | 7.1111 | 51.1% |
 * | 65536 | 0.6283 | 3.3380 | 0.3111 | 6.7407 | 49.5% |
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
 * | 512 | 0.0071 | 2.3167 | 0.0042 | 3.9084 | 59.3% |
 * | 1024 | 0.0078 | 4.1967 | 0.0043 | 7.6418 | 54.9% |
 * | 4096 | 0.0268 | 4.8966 | 0.0093 | 14.0998 | 34.7% |
 * | 16384 | 0.1331 | 3.9385 | 0.0687 | 7.6329 | 51.6% |
 * | 65536 | 0.5928 | 3.5374 | 0.3015 | 6.9553 | 50.9% |
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
