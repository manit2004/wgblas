/**
 * Benchmark results for dscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.0648 | 0.0033 | 0.1561 | 41.5% |
 * | 64 | 0.0076 | 0.1339 | 0.0031 | 0.3333 | 40.2% |
 * | 128 | 0.0076 | 0.2689 | 0.0033 | 0.6275 | 42.9% |
 * | 512 | 0.0076 | 1.0734 | 0.0035 | 2.3704 | 45.3% |
 * | 1024 | 0.0076 | 2.1649 | 0.0034 | 4.8075 | 45.0% |
 * | 4096 | 0.0079 | 8.3083 | 0.0035 | 18.8756 | 44.0% |
 * | 16384 | 0.0087 | 30.0073 | 0.0041 | 64.0000 | 46.9% |
 * | 65536 | 0.0122 | 86.2316 | 0.0069 | 151.7037 | 56.8% |
 * | 262144 | 0.0334 | 125.6683 | 0.0279 | 150.3119 | 83.6% |
 * | 1048576 | 0.1059 | 158.4430 | 0.1002 | 167.3705 | 94.7% |
 * | 4194304 | 0.4025 | 166.7384 | 0.3897 | 172.2153 | 96.8% |
 * | 16777216 | 1.5551 | 172.6158 | 1.5483 | 173.3757 | 99.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dscal-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-default.svg)
 *
 * ![dscal-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-default.svg)
 *
 * ## See also
 *
 * - [dscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/wgblas/dscal.js) — WebGPU benchmark script
 * - [dscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/cuda/dscal.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0062 | 0.0821 | 0.0036 | 0.1441 | 56.9% |
 * | 64 | 0.0061 | 0.1667 | 0.0034 | 0.3033 | 55.0% |
 * | 128 | 0.0061 | 0.3333 | 0.0035 | 0.5872 | 56.8% |
 * | 512 | 0.0061 | 1.3333 | 0.0038 | 2.1513 | 62.0% |
 * | 1024 | 0.0061 | 2.6667 | 0.0038 | 4.3390 | 61.5% |
 * | 4096 | 0.0067 | 9.7990 | 0.0042 | 15.7538 | 62.2% |
 * | 16384 | 0.0095 | 27.5361 | 0.0062 | 42.0103 | 65.5% |
 * | 65536 | 0.0288 | 36.3483 | 0.0270 | 38.7787 | 93.7% |
 * | 262144 | 0.1022 | 41.0241 | 0.0991 | 42.3428 | 96.9% |
 * | 1048576 | 0.3980 | 42.1555 | 0.3871 | 43.3439 | 97.3% |
 * | 4194304 | 1.5762 | 42.5757 | 1.5388 | 43.6121 | 97.6% |
 *
 * ![dscal-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride4.svg)
 *
 * ![dscal-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.0816 | 0.0028 | 0.1860 | 43.9% |
 * | 64 | 0.0061 | 0.1667 | 0.0028 | 0.3721 | 44.8% |
 * | 128 | 0.0062 | 0.3316 | 0.0028 | 0.7399 | 44.8% |
 * | 512 | 0.0061 | 1.3333 | 0.0032 | 2.5990 | 51.3% |
 * | 1024 | 0.0062 | 2.6256 | 0.0032 | 5.0693 | 51.8% |
 * | 4096 | 0.0074 | 8.8276 | 0.0036 | 18.4505 | 47.8% |
 * | 16384 | 0.0099 | 26.5974 | 0.0055 | 48.0469 | 55.4% |
 * | 65536 | 0.0351 | 29.8706 | 0.0311 | 33.6773 | 88.7% |
 * | 262144 | 0.1290 | 32.5079 | 0.1183 | 35.4680 | 91.7% |
 * | 1048576 | 0.5041 | 33.2828 | 0.4649 | 36.0881 | 92.2% |
 *
 * ![dscal-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride5.svg)
 *
 * ![dscal-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.0810 | 0.0028 | 0.1829 | 44.3% |
 * | 64 | 0.0062 | 0.1658 | 0.0028 | 0.3678 | 45.1% |
 * | 128 | 0.0063 | 0.3265 | 0.0028 | 0.7273 | 44.9% |
 * | 512 | 0.0065 | 1.2549 | 0.0035 | 2.3273 | 53.9% |
 * | 1024 | 0.0068 | 2.3925 | 0.0036 | 4.6126 | 51.9% |
 * | 4096 | 0.0100 | 6.5223 | 0.0041 | 16.0000 | 40.8% |
 * | 16384 | 0.0369 | 7.1111 | 0.0201 | 13.0550 | 54.5% |
 * | 65536 | 0.1377 | 7.6125 | 0.0778 | 13.4737 | 56.5% |
 * | 262144 | 0.5397 | 7.7716 | 0.3165 | 13.2510 | 58.6% |
 *
 * ![dscal-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride32.svg)
 *
 * ![dscal-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0062 | 0.1645 | 0.0028 | 0.3616 | 45.5% |
 * | 128 | 0.0062 | 0.3282 | 0.0029 | 0.6995 | 46.9% |
 * | 512 | 0.0066 | 1.2457 | 0.0033 | 2.4615 | 50.6% |
 * | 1024 | 0.0068 | 2.4265 | 0.0035 | 4.7407 | 51.2% |
 * | 4096 | 0.0092 | 7.1483 | 0.0041 | 16.0000 | 44.7% |
 * | 16384 | 0.0392 | 6.6928 | 0.0227 | 11.5625 | 57.9% |
 * | 65536 | 0.1541 | 6.8054 | 0.0900 | 11.6488 | 58.4% |
 * | 262144 | 0.6237 | 6.7244 | 0.3858 | 10.8715 | 61.9% |
 *
 * ![dscal-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride33.svg)
 *
 * ![dscal-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0080 | 1.0261 | 0.0034 | 2.3814 | 43.1% |
 * | 1024 | 0.0082 | 2.0000 | 0.0035 | 4.6335 | 43.2% |
 * | 4096 | 0.0149 | 4.3854 | 0.0040 | 16.4498 | 26.7% |
 * | 16384 | 0.0696 | 3.7647 | 0.0348 | 7.5294 | 50.0% |
 * | 65536 | 0.3227 | 3.2497 | 0.1413 | 7.4203 | 43.8% |
 *
 * ![dscal-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride255.svg)
 *
 * ![dscal-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0092 | 0.8873 | 0.0041 | 2.0000 | 44.4% |
 * | 1024 | 0.0099 | 1.6623 | 0.0036 | 4.4912 | 37.0% |
 * | 4096 | 0.0156 | 4.2097 | 0.0041 | 16.0000 | 26.3% |
 * | 16384 | 0.0655 | 4.0049 | 0.0331 | 7.9150 | 50.6% |
 * | 65536 | 0.3256 | 3.2209 | 0.1352 | 7.7576 | 41.5% |
 *
 * ![dscal-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride256.svg)
 *
 * ![dscal-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/wgblas/stride.dscal.js) — WebGPU stride-sweep benchmark script
 * - [stride.dscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/cuda/stride.dscal.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 1024 | 0.0062 | 2.6392 | 0.0028 | 5.8851 | 44.8% |
 * | 65536 | 0.0098 | 107.0850 | 0.0058 | 182.0444 | 58.8% |
 * | 1048576 | 0.1040 | 161.3690 | 0.1004 | 167.1304 | 96.6% |
 * | 16777216 | 1.5770 | 170.2234 | 1.5653 | 171.4901 | 99.3% |
 *
 * ![dscal-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alphaneg3p75.svg)
 *
 * ![dscal-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0076 | 2.1695 | 0.0029 | 5.5652 | 39.0% |
 * | 65536 | 0.0123 | 85.5561 | 0.0060 | 173.3757 | 49.3% |
 * | 1048576 | 0.1063 | 157.8230 | 0.1004 | 167.0239 | 94.5% |
 * | 16777216 | 1.5580 | 172.2914 | 1.5656 | 171.4568 | 100.5% |
 *
 * ![dscal-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha0.svg)
 *
 * ![dscal-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0028 | 5.9535 | 44.8% |
 * | 65536 | 0.0098 | 106.9103 | 0.0057 | 184.0899 | 58.1% |
 * | 1048576 | 0.1038 | 161.5928 | 0.1004 | 167.1304 | 96.7% |
 * | 16777216 | 1.5770 | 170.2234 | 1.5653 | 171.4866 | 99.3% |
 *
 * ![dscal-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha1eneg38.svg)
 *
 * ![dscal-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0027 | 6.0235 | 44.3% |
 * | 65536 | 0.0099 | 106.3896 | 0.0057 | 184.6084 | 57.6% |
 * | 1048576 | 0.1037 | 161.7424 | 0.1004 | 167.0771 | 96.8% |
 * | 16777216 | 1.5768 | 170.2441 | 1.5654 | 171.4796 | 99.3% |
 *
 * ![dscal-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha1.svg)
 *
 * ![dscal-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0027 | 6.0235 | 44.3% |
 * | 65536 | 0.0099 | 105.8740 | 0.0057 | 182.5515 | 58.0% |
 * | 1048576 | 0.1037 | 161.8173 | 0.1004 | 167.1837 | 96.8% |
 * | 16777216 | 1.5769 | 170.2337 | 1.5654 | 171.4778 | 99.3% |
 *
 * ![dscal-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha2p5.svg)
 *
 * ![dscal-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/wgblas/alpha.dscal.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/cuda/alpha.dscal.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dscal
 */
