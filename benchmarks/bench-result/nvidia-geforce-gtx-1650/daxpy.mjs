/**
 * Benchmark results for daxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.0954 | 0.0028 | 0.2791 | 34.2% |
 * | 64 | 0.0078 | 0.1979 | 0.0028 | 0.5455 | 36.3% |
 * | 128 | 0.0075 | 0.4120 | 0.0029 | 1.0726 | 38.4% |
 * | 512 | 0.0077 | 1.5934 | 0.0028 | 4.4138 | 36.1% |
 * | 1024 | 0.0071 | 3.4830 | 0.0029 | 8.5333 | 40.8% |
 * | 4096 | 0.0066 | 14.9854 | 0.0031 | 31.6701 | 47.3% |
 * | 16384 | 0.0082 | 48.0000 | 0.0039 | 99.9024 | 48.0% |
 * | 65536 | 0.0164 | 96.0000 | 0.0072 | 217.0066 | 44.2% |
 * | 262144 | 0.0451 | 139.6364 | 0.0386 | 162.8898 | 85.7% |
 * | 1048576 | 0.1564 | 160.8739 | 0.1455 | 172.9372 | 93.0% |
 * | 4194304 | 0.6058 | 166.1681 | 0.5739 | 175.4058 | 94.7% |
 * | 16777216 | 2.5907 | 155.4204 | 2.2885 | 175.9442 | 88.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![daxpy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-default.svg)
 *
 * ![daxpy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/daxpy.js) — WebGPU benchmark script
 * - [daxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/cuda/daxpy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0066 | 0.1171 | 0.0028 | 0.2727 | 42.9% |
 * | 64 | 0.0080 | 0.1916 | 0.0031 | 0.4948 | 38.7% |
 * | 128 | 0.0065 | 0.4706 | 0.0031 | 1.0000 | 47.1% |
 * | 512 | 0.0065 | 1.9010 | 0.0033 | 3.7282 | 51.0% |
 * | 1024 | 0.0065 | 3.7647 | 0.0033 | 7.3846 | 51.0% |
 * | 4096 | 0.0077 | 12.8000 | 0.0037 | 26.8297 | 47.7% |
 * | 16384 | 0.0118 | 33.4367 | 0.0066 | 59.9415 | 55.8% |
 * | 65536 | 0.0425 | 36.9981 | 0.0405 | 38.7940 | 95.4% |
 * | 262144 | 0.1502 | 41.8983 | 0.1549 | 40.6257 | 103.1% |
 * | 1048576 | 0.5796 | 43.4205 | 0.6127 | 41.0734 | 105.7% |
 * | 4194304 | 2.6846 | 37.4965 | 2.4372 | 41.3026 | 90.8% |
 *
 * ![daxpy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride4.svg)
 *
 * ![daxpy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0081 | 0.0943 | 0.0028 | 0.2697 | 35.0% |
 * | 64 | 0.0071 | 0.2157 | 0.0028 | 0.5486 | 39.3% |
 * | 128 | 0.0073 | 0.4192 | 0.0028 | 1.0787 | 38.9% |
 * | 512 | 0.0065 | 1.8916 | 0.0033 | 3.7647 | 50.2% |
 * | 1024 | 0.0068 | 3.6226 | 0.0034 | 7.2113 | 50.2% |
 * | 4096 | 0.0100 | 9.8147 | 0.0036 | 27.4286 | 35.8% |
 * | 16384 | 0.0154 | 25.5202 | 0.0101 | 38.7634 | 65.8% |
 * | 65536 | 0.0513 | 30.6338 | 0.0498 | 31.6090 | 96.9% |
 * | 262144 | 0.1878 | 33.4937 | 0.1928 | 32.6375 | 102.6% |
 * | 1048576 | 0.7358 | 34.2038 | 0.7653 | 32.8831 | 104.0% |
 *
 * ![daxpy-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride5.svg)
 *
 * ![daxpy-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.0938 | 0.0029 | 0.2609 | 35.9% |
 * | 64 | 0.0065 | 0.2353 | 0.0028 | 0.5455 | 43.1% |
 * | 128 | 0.0066 | 0.4649 | 0.0030 | 1.0323 | 45.0% |
 * | 512 | 0.0071 | 1.7376 | 0.0036 | 3.3982 | 51.1% |
 * | 1024 | 0.0072 | 3.4362 | 0.0038 | 6.4810 | 53.0% |
 * | 4096 | 0.0143 | 6.8571 | 0.0048 | 20.4800 | 33.5% |
 * | 16384 | 0.0492 | 8.0000 | 0.0264 | 14.8675 | 53.8% |
 * | 65536 | 0.1767 | 8.9035 | 0.1026 | 15.3265 | 58.1% |
 * | 262144 | 0.6918 | 9.0942 | 0.4085 | 15.4015 | 59.0% |
 *
 * ![daxpy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride32.svg)
 *
 * ![daxpy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0064 | 0.2388 | 0.0029 | 0.5333 | 44.8% |
 * | 128 | 0.0066 | 0.4660 | 0.0030 | 1.0267 | 45.4% |
 * | 512 | 0.0069 | 1.7696 | 0.0036 | 3.4439 | 51.4% |
 * | 1024 | 0.0073 | 3.3833 | 0.0037 | 6.6494 | 50.9% |
 * | 4096 | 0.0143 | 6.8571 | 0.0049 | 20.1443 | 34.0% |
 * | 16384 | 0.0519 | 7.5805 | 0.0305 | 12.8940 | 58.8% |
 * | 65536 | 0.1884 | 8.3478 | 0.1195 | 13.1616 | 63.4% |
 * | 262144 | 0.7738 | 8.1310 | 0.4854 | 12.9620 | 62.7% |
 *
 * ![daxpy-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride33.svg)
 *
 * ![daxpy-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0084 | 1.4713 | 0.0036 | 3.3982 | 43.3% |
 * | 1024 | 0.0086 | 2.8444 | 0.0037 | 6.6207 | 43.0% |
 * | 4096 | 0.0219 | 4.4912 | 0.0061 | 16.0000 | 28.1% |
 * | 16384 | 0.0992 | 3.9652 | 0.0508 | 7.7356 | 51.3% |
 * | 65536 | 0.4045 | 3.8886 | 0.1991 | 7.8991 | 49.2% |
 *
 * ![daxpy-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride255.svg)
 *
 * ![daxpy-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0084 | 1.4545 | 0.0038 | 3.2542 | 44.7% |
 * | 1024 | 0.0089 | 2.7626 | 0.0038 | 6.4000 | 43.2% |
 * | 4096 | 0.0187 | 5.2603 | 0.0046 | 21.4825 | 24.5% |
 * | 16384 | 0.0840 | 4.6829 | 0.0486 | 8.0949 | 57.9% |
 * | 65536 | 0.4272 | 3.6819 | 0.1935 | 8.1277 | 45.3% |
 *
 * ![daxpy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride256.svg)
 *
 * ![daxpy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/stride.daxpy.js) — WebGPU stride-sweep benchmark script
 * - [stride.daxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/cuda/stride.daxpy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0081 | 3.0296 | 0.0028 | 8.7273 | 34.7% |
 * | 65536 | 0.0164 | 96.0000 | 0.0074 | 213.7043 | 44.9% |
 * | 1048576 | 0.1550 | 162.3518 | 0.1456 | 172.8612 | 93.9% |
 * | 16777216 | 2.6100 | 154.2742 | 2.2885 | 175.9442 | 87.7% |
 *
 * ![daxpy-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alphaneg3p75.svg)
 *
 * ![daxpy-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0062 | 3.9385 | 0.0030 | 8.3027 | 47.4% |
 * | 65536 | 0.0143 | 109.7143 | 0.0050 | 313.0701 | 35.0% |
 * | 1048576 | 0.1556 | 161.6842 | 0.0352 | 715.5887 | 22.6% |
 * | 16777216 | 2.3295 | 172.8493 | 0.5197 | 774.7144 | 22.3% |
 *
 * ![daxpy-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha0.svg)
 *
 * ![daxpy-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0072 | 3.3907 | 0.0029 | 8.5333 | 39.7% |
 * | 65536 | 0.0143 | 109.7143 | 0.0071 | 222.9116 | 49.2% |
 * | 1048576 | 0.1562 | 161.1046 | 0.1456 | 172.8612 | 93.2% |
 * | 16777216 | 3.8175 | 105.4768 | 2.2885 | 175.9491 | 59.9% |
 *
 * ![daxpy-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha1eneg38.svg)
 *
 * ![daxpy-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0064 | 3.8400 | 0.0029 | 8.4862 | 45.2% |
 * | 65536 | 0.0164 | 96.0000 | 0.0072 | 217.0066 | 44.2% |
 * | 1048576 | 0.1559 | 161.4353 | 0.1455 | 172.9182 | 93.4% |
 * | 16777216 | 2.5743 | 156.4105 | 2.2884 | 175.9553 | 88.9% |
 *
 * ![daxpy-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha1.svg)
 *
 * ![daxpy-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0079 | 3.1156 | 0.0029 | 8.4396 | 36.9% |
 * | 65536 | 0.0164 | 96.0000 | 0.0072 | 219.4286 | 43.7% |
 * | 1048576 | 0.1564 | 160.8739 | 0.1456 | 172.8802 | 93.1% |
 * | 16777216 | 2.3238 | 173.2754 | 2.2883 | 175.9639 | 98.5% |
 *
 * ![daxpy-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha2p5.svg)
 *
 * ![daxpy-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/alpha.daxpy.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.daxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/cuda/alpha.daxpy.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/daxpy
 */
