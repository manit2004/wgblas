/**
 * Benchmark results for sswap on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0847 | 0.0028 | 0.1798 | 47.1% |
 * | 64 | 0.0060 | 0.1693 | 0.0028 | 0.3616 | 46.8% |
 * | 128 | 0.0060 | 0.3395 | 0.0028 | 0.7191 | 47.2% |
 * | 512 | 0.0061 | 1.3474 | 0.0029 | 2.7978 | 48.2% |
 * | 1024 | 0.0061 | 2.6947 | 0.0032 | 5.1980 | 51.8% |
 * | 4096 | 0.0061 | 10.6667 | 0.0031 | 21.3333 | 50.0% |
 * | 16384 | 0.0066 | 39.5749 | 0.0039 | 67.7025 | 58.5% |
 * | 65536 | 0.0082 | 128.0000 | 0.0069 | 151.3534 | 84.6% |
 * | 262144 | 0.0284 | 147.8534 | 0.0284 | 147.9368 | 99.9% |
 * | 1048576 | 0.1018 | 164.8186 | 0.1024 | 163.8400 | 100.6% |
 * | 4194304 | 0.3955 | 169.6931 | 0.4220 | 159.0197 | 106.7% |
 * | 16777216 | 1.5747 | 170.4690 | 1.5967 | 168.1218 | 101.4% |
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
 * | 32 | 0.0060 | 0.0851 | 0.0029 | 0.1778 | 47.9% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3516 | 47.4% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6919 | 48.2% |
 * | 512 | 0.0060 | 1.3617 | 0.0032 | 2.5729 | 52.9% |
 * | 1024 | 0.0061 | 2.6667 | 0.0032 | 5.0693 | 52.6% |
 * | 4096 | 0.0067 | 9.7524 | 0.0036 | 18.2044 | 53.6% |
 * | 16384 | 0.0084 | 31.1483 | 0.0054 | 48.6172 | 64.1% |
 * | 65536 | 0.0274 | 38.3251 | 0.0270 | 38.7787 | 98.8% |
 * | 262144 | 0.1016 | 41.2825 | 0.1004 | 41.7959 | 98.8% |
 * | 1048576 | 0.3949 | 42.4800 | 0.3938 | 42.6043 | 99.7% |
 * | 4194304 | 1.5706 | 42.7271 | 1.5668 | 42.8322 | 99.8% |
 *
 * ![sswap-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride4.svg)
 *
 * ![sswap-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0028 | 0.1860 | 44.8% |
 * | 64 | 0.0061 | 0.1675 | 0.0029 | 0.3536 | 47.4% |
 * | 128 | 0.0061 | 0.3333 | 0.0029 | 0.6995 | 47.7% |
 * | 512 | 0.0061 | 1.3474 | 0.0032 | 2.5222 | 53.4% |
 * | 1024 | 0.0061 | 2.6736 | 0.0035 | 4.6972 | 56.9% |
 * | 4096 | 0.0065 | 10.0887 | 0.0038 | 17.4298 | 57.9% |
 * | 16384 | 0.0091 | 28.6935 | 0.0060 | 44.0430 | 65.1% |
 * | 65536 | 0.0344 | 30.4960 | 0.0333 | 31.4925 | 96.8% |
 * | 262144 | 0.1270 | 33.0323 | 0.1252 | 33.5094 | 98.6% |
 * | 1048576 | 0.4978 | 33.7043 | 0.4929 | 34.0380 | 99.0% |
 * | 4194304 | 1.9768 | 33.9488 | 1.9625 | 34.1948 | 99.3% |
 *
 * ![sswap-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride5.svg)
 *
 * ![sswap-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0029 | 0.1749 | 47.6% |
 * | 64 | 0.0061 | 0.1667 | 0.0031 | 0.3333 | 50.0% |
 * | 128 | 0.0061 | 0.3333 | 0.0034 | 0.6095 | 54.7% |
 * | 512 | 0.0064 | 1.2897 | 0.0043 | 1.9248 | 67.0% |
 * | 1024 | 0.0066 | 2.4794 | 0.0042 | 3.8788 | 63.9% |
 * | 4096 | 0.0094 | 6.9660 | 0.0058 | 11.2527 | 61.9% |
 * | 16384 | 0.0351 | 7.4745 | 0.0339 | 7.7247 | 96.8% |
 * | 65536 | 0.1367 | 7.6704 | 0.1340 | 7.8233 | 98.0% |
 * | 262144 | 0.5429 | 7.7263 | 0.5243 | 8.0000 | 96.6% |
 * | 1048576 | 2.1913 | 7.6561 | 2.1134 | 7.9385 | 96.4% |
 *
 * ![sswap-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride32.svg)
 *
 * ![sswap-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1667 | 0.0030 | 0.3422 | 48.7% |
 * | 128 | 0.0061 | 0.3333 | 0.0032 | 0.6305 | 52.9% |
 * | 512 | 0.0063 | 1.2929 | 0.0041 | 2.0000 | 64.6% |
 * | 1024 | 0.0064 | 2.5600 | 0.0041 | 4.0000 | 64.0% |
 * | 4096 | 0.0092 | 7.1111 | 0.0061 | 10.6667 | 66.7% |
 * | 16384 | 0.0383 | 6.8495 | 0.0375 | 6.9898 | 98.0% |
 * | 65536 | 0.1597 | 6.5641 | 0.1504 | 6.9712 | 94.2% |
 * | 262144 | 0.6456 | 6.4969 | 0.5995 | 6.9959 | 92.9% |
 *
 * ![sswap-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride33.svg)
 *
 * ![sswap-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0065 | 1.2642 | 0.0041 | 2.0000 | 63.2% |
 * | 1024 | 0.0067 | 2.4381 | 0.0041 | 4.0157 | 60.7% |
 * | 4096 | 0.0137 | 4.7683 | 0.0125 | 5.2513 | 90.8% |
 * | 16384 | 0.0701 | 3.7372 | 0.0756 | 3.4697 | 107.7% |
 * | 65536 | 0.3119 | 3.3615 | 0.3052 | 3.4362 | 97.8% |
 *
 * ![sswap-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/gbps-stride255.svg)
 *
 * ![sswap-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sswap/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0064 | 1.2736 | 0.0043 | 1.9248 | 66.2% |
 * | 1024 | 0.0066 | 2.4976 | 0.0043 | 3.8496 | 64.9% |
 * | 4096 | 0.0106 | 6.2061 | 0.0091 | 7.2367 | 85.8% |
 * | 16384 | 0.0635 | 4.1290 | 0.0725 | 3.6168 | 114.2% |
 * | 65536 | 0.2890 | 3.6282 | 0.2952 | 3.5527 | 102.1% |
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
