/**
 * Benchmark results for cscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0836 | 0.0035 | 0.1475 | 56.6% |
 * | 64 | 0.0061 | 0.1675 | 0.0034 | 0.3019 | 55.5% |
 * | 128 | 0.0060 | 0.3413 | 0.0036 | 0.5740 | 59.5% |
 * | 512 | 0.0061 | 1.3368 | 0.0040 | 2.0317 | 65.8% |
 * | 1024 | 0.0061 | 2.6947 | 0.0034 | 4.8302 | 55.8% |
 * | 4096 | 0.0061 | 10.6945 | 0.0038 | 17.3559 | 61.6% |
 * | 16384 | 0.0065 | 40.5545 | 0.0042 | 62.2966 | 65.1% |
 * | 65536 | 0.0082 | 128.0000 | 0.0068 | 153.4801 | 83.4% |
 * | 262144 | 0.0282 | 148.6077 | 0.0272 | 154.0211 | 96.5% |
 * | 1048576 | 0.1018 | 164.7409 | 0.0992 | 169.1252 | 97.4% |
 * | 4194304 | 0.3895 | 172.3073 | 0.3877 | 173.1038 | 99.5% |
 * | 16777216 | 1.5458 | 173.6538 | 1.5646 | 171.5655 | 101.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![cscal-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-default.svg)
 *
 * ![cscal-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-default.svg)
 *
 * ## See also
 *
 * - [cscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/wgblas/cscal.js) — WebGPU benchmark script
 * - [cscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/cuda/cscal.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0060 | 0.0851 | 0.0034 | 0.1509 | 56.4% |
 * | 64 | 0.0060 | 0.1698 | 0.0032 | 0.3200 | 53.1% |
 * | 128 | 0.0060 | 0.3404 | 0.0033 | 0.6124 | 55.6% |
 * | 512 | 0.0061 | 1.3403 | 0.0034 | 2.3814 | 56.3% |
 * | 1024 | 0.0061 | 2.6667 | 0.0036 | 4.5714 | 58.3% |
 * | 4096 | 0.0065 | 10.0887 | 0.0039 | 16.7869 | 60.1% |
 * | 16384 | 0.0096 | 27.2159 | 0.0061 | 42.6667 | 63.8% |
 * | 65536 | 0.0275 | 38.1911 | 0.0268 | 39.1962 | 97.4% |
 * | 262144 | 0.1011 | 41.4785 | 0.0987 | 42.5006 | 97.6% |
 * | 1048576 | 0.3901 | 43.0062 | 0.3869 | 43.3600 | 99.2% |
 * | 4194304 | 1.5438 | 43.4697 | 1.5401 | 43.5754 | 99.8% |
 *
 * ![cscal-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride4.svg)
 *
 * ![cscal-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0027 | 0.1905 | 43.7% |
 * | 64 | 0.0061 | 0.1675 | 0.0029 | 0.3516 | 47.7% |
 * | 128 | 0.0061 | 0.3351 | 0.0027 | 0.7619 | 44.0% |
 * | 512 | 0.0061 | 1.3333 | 0.0031 | 2.6256 | 50.8% |
 * | 1024 | 0.0061 | 2.6667 | 0.0029 | 5.6889 | 46.9% |
 * | 4096 | 0.0066 | 9.9902 | 0.0033 | 19.8835 | 50.2% |
 * | 16384 | 0.0101 | 25.9241 | 0.0060 | 43.8075 | 59.2% |
 * | 65536 | 0.0343 | 30.5672 | 0.0312 | 33.6082 | 91.0% |
 * | 262144 | 0.1208 | 34.7119 | 0.1183 | 35.4632 | 97.9% |
 * | 1048576 | 0.6553 | 25.6019 | 0.4653 | 36.0558 | 71.0% |
 *
 * ![cscal-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride5.svg)
 *
 * ![cscal-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0118 | 0.0435 | 0.0027 | 0.1905 | 22.8% |
 * | 64 | 0.0124 | 0.0829 | 0.0026 | 0.3902 | 21.2% |
 * | 128 | 0.0125 | 0.1641 | 0.0028 | 0.7232 | 22.7% |
 * | 512 | 0.0142 | 0.5779 | 0.0035 | 2.3379 | 24.7% |
 * | 1024 | 0.0149 | 1.0964 | 0.0035 | 4.7407 | 23.1% |
 * | 4096 | 0.0211 | 3.1101 | 0.0039 | 16.7869 | 18.5% |
 * | 16384 | 0.0503 | 5.2145 | 0.0197 | 13.2771 | 39.3% |
 * | 65536 | 0.4833 | 2.1695 | 0.0777 | 13.4903 | 16.1% |
 * | 262144 | 0.3174 | 13.2136 | 0.3174 | 13.2142 | 100.0% |
 *
 * ![cscal-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride32.svg)
 *
 * ![cscal-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0072 | 0.1429 | 0.0033 | 0.3137 | 45.5% |
 * | 128 | 0.0071 | 0.2870 | 0.0028 | 0.7399 | 38.8% |
 * | 512 | 0.0078 | 1.0449 | 0.0032 | 2.5473 | 41.0% |
 * | 1024 | 0.0080 | 2.0562 | 0.0032 | 5.0443 | 40.8% |
 * | 4096 | 0.0100 | 6.5327 | 0.0037 | 17.5794 | 37.2% |
 * | 16384 | 0.0256 | 10.2400 | 0.0227 | 11.5625 | 88.6% |
 * | 65536 | 0.1059 | 9.9057 | 0.0901 | 11.6322 | 85.2% |
 * | 262144 | 0.4256 | 9.8543 | 0.3851 | 10.8904 | 90.5% |
 *
 * ![cscal-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride33.svg)
 *
 * ![cscal-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0078 | 1.0557 | 0.0032 | 2.5600 | 41.2% |
 * | 1024 | 0.0080 | 2.0480 | 0.0036 | 4.6126 | 44.4% |
 * | 4096 | 0.0100 | 6.5327 | 0.0039 | 16.9256 | 38.6% |
 * | 16384 | 0.0367 | 7.1452 | 0.0350 | 7.4881 | 95.4% |
 * | 65536 | 1.6196 | 0.6474 | 0.1412 | 7.4287 | 8.7% |
 *
 * ![cscal-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride255.svg)
 *
 * ![cscal-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0118 | 0.6966 | 0.0041 | 2.0157 | 34.6% |
 * | 1024 | 0.0121 | 1.3527 | 0.0038 | 4.3390 | 31.2% |
 * | 4096 | 0.0160 | 4.0878 | 0.0039 | 16.6504 | 24.6% |
 * | 16384 | 0.3381 | 0.7754 | 0.0326 | 8.0511 | 9.6% |
 * | 65536 | 0.1372 | 7.6418 | 0.1339 | 7.8289 | 97.6% |
 *
 * ![cscal-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride256.svg)
 *
 * ![cscal-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.cscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/wgblas/stride.cscal.js) — WebGPU stride-sweep benchmark script
 * - [stride.cscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/cuda/stride.cscal.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0+0i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0071 | 2.2960 | 0.0027 | 6.0952 | 37.7% |
 * | 65536 | 0.0102 | 102.4000 | 0.0051 | 205.4420 | 49.8% |
 * | 1048576 | 0.1021 | 164.3278 | 0.1004 | 167.1837 | 98.3% |
 * | 16777216 | 1.5462 | 173.6053 | 1.5499 | 173.1949 | 100.2% |
 *
 * ![cscal-alpha0plus0i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha0plus0i.svg)
 *
 * ![cscal-alpha0plus0i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha0plus0i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1+0i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0027 | 6.1687 | 43.2% |
 * | 65536 | 0.0082 | 128.0000 | 0.0053 | 198.5939 | 64.5% |
 * | 1048576 | 0.1012 | 165.7828 | 0.1004 | 167.1837 | 99.2% |
 * | 16777216 | 1.5462 | 173.6107 | 1.5658 | 171.4392 | 101.3% |
 *
 * ![cscal-alpha1plus0i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha1plus0i.svg)
 *
 * ![cscal-alpha1plus0i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha1plus0i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5-3.75i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0026 | 6.2439 | 42.7% |
 * | 65536 | 0.0082 | 127.5019 | 0.0056 | 186.7122 | 68.3% |
 * | 1048576 | 0.1011 | 166.0190 | 0.1004 | 167.1837 | 99.3% |
 * | 16777216 | 1.5462 | 173.6125 | 1.5658 | 171.4375 | 101.3% |
 *
 * ![cscal-alpha2p5neg3p75i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha2p5neg3p75i.svg)
 *
 * ![cscal-alpha2p5neg3p75i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha2p5neg3p75i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0+1i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6877 | 0.0026 | 6.2439 | 43.0% |
 * | 65536 | 0.0082 | 127.2544 | 0.0051 | 204.1620 | 62.3% |
 * | 1048576 | 0.1013 | 165.5995 | 0.1004 | 167.1837 | 99.1% |
 * | 16777216 | 1.5459 | 173.6412 | 1.5658 | 171.4375 | 101.3% |
 *
 * ![cscal-alpha0plus1i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha0plus1i.svg)
 *
 * ![cscal-alpha0plus1i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha0plus1i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38+0i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0026 | 6.2439 | 42.7% |
 * | 65536 | 0.0082 | 128.0000 | 0.0058 | 180.0439 | 71.1% |
 * | 1048576 | 0.1014 | 165.4949 | 0.1004 | 167.1837 | 99.0% |
 * | 16777216 | 1.5462 | 173.6053 | 1.5664 | 171.3727 | 101.3% |
 *
 * ![cscal-alpha1eneg38plus0i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha1eneg38plus0i.svg)
 *
 * ![cscal-alpha1eneg38plus0i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha1eneg38plus0i.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.cscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/wgblas/alpha.cscal.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.cscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/cuda/alpha.cscal.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/cscal
 */
