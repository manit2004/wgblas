/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3759 | 0.0036 | 0.6933 | 54.2% |
 * | 64 | 0.0068 | 1.3396 | 0.0041 | 2.2101 | 60.6% |
 * | 128 | 0.0080 | 4.3028 | 0.0044 | 7.8545 | 54.8% |
 * | 256 | 0.0125 | 10.7347 | 0.0053 | 25.3494 | 42.3% |
 * | 512 | 0.0246 | 21.6109 | 0.0085 | 62.6717 | 34.5% |
 * | 1024 | 0.0721 | 29.2807 | 0.0326 | 64.7537 | 45.2% |
 * | 1280 | 0.1147 | 28.7277 | 0.0471 | 69.9694 | 41.1% |
 * | 2048 | 0.2548 | 33.0307 | 0.1025 | 82.1487 | 40.2% |
 * | 4096 | 1.1444 | 29.3711 | 0.3873 | 86.7786 | 33.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-default.svg)
 *
 * ![ssymv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 * - [ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/ssymv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0066 | 0.3575 | 0.0040 | 0.5920 | 60.4% |
 * | 64 | 0.0069 | 1.2748 | 0.0039 | 2.2905 | 55.7% |
 * | 128 | 0.0081 | 4.2222 | 0.0045 | 7.6000 | 55.6% |
 * | 256 | 0.0123 | 10.8750 | 0.0054 | 24.7834 | 43.9% |
 * | 512 | 0.0246 | 21.5417 | 0.0088 | 60.1600 | 35.8% |
 * | 1024 | 0.0742 | 28.4046 | 0.0282 | 74.7514 | 38.0% |
 * | 1280 | 0.1195 | 27.5234 | 0.0563 | 58.4257 | 47.1% |
 * | 2048 | 0.2800 | 30.0307 | 0.1068 | 78.7604 | 38.1% |
 * | 4096 | 1.3358 | 25.1502 | 0.3961 | 84.8163 | 29.7% |
 *
 * ![ssymv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride4.svg)
 *
 * ![ssymv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3549 | 0.0043 | 0.5522 | 64.3% |
 * | 64 | 0.0071 | 1.2432 | 0.0044 | 1.9856 | 62.6% |
 * | 128 | 0.0091 | 3.7333 | 0.0054 | 6.3333 | 58.9% |
 * | 256 | 0.0170 | 7.8644 | 0.0061 | 21.9213 | 35.9% |
 * | 512 | 0.0431 | 12.2867 | 0.0105 | 50.5933 | 24.3% |
 * | 1024 | 0.1550 | 13.5940 | 0.0311 | 67.7182 | 20.1% |
 * | 1280 | 0.2470 | 13.3204 | 0.0466 | 70.6044 | 18.9% |
 * | 2048 | 0.5909 | 14.2303 | 0.1128 | 74.5804 | 19.1% |
 * | 4096 | 2.3681 | 14.1868 | 0.4191 | 80.1539 | 17.7% |
 *
 * ![ssymv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride32.svg)
 *
 * ![ssymv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3524 | 0.0038 | 0.6218 | 56.7% |
 * | 64 | 0.0073 | 1.2026 | 0.0042 | 2.1231 | 56.6% |
 * | 128 | 0.0091 | 3.7399 | 0.0056 | 6.0800 | 61.5% |
 * | 256 | 0.0170 | 7.8718 | 0.0061 | 21.8639 | 36.0% |
 * | 512 | 0.0432 | 12.2548 | 0.0100 | 52.9408 | 23.1% |
 * | 1024 | 0.1553 | 13.5730 | 0.0310 | 67.8928 | 20.0% |
 * | 1280 | 0.2478 | 13.2748 | 0.0499 | 65.9397 | 20.1% |
 * | 2048 | 0.5917 | 14.2122 | 0.1063 | 79.1280 | 18.0% |
 * | 4096 | 2.3979 | 14.0103 | 0.4192 | 80.1417 | 17.5% |
 *
 * ![ssymv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride256.svg)
 *
 * ![ssymv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/stride.ssymv.js) — WebGPU stride-sweep benchmark script
 * - [stride.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/stride.ssymv.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## Uplo sweep
 *
 * Unless noted otherwise, every result above uses `uplo = "lower"`. Real workgroups dispatch in increasing index order, so `uplo = "upper"` front-loads the heaviest rows first (worse — long-running heavy workgroups have nothing to overlap with) while `lower` back-loads them (better — light rows clear fast, the heavy tail gets full GPU to itself) — collapsed below by default, expand a `uplo` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = lower</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0040 | 0.5968 | 60.2% |
 * | 64 | 0.0068 | 1.2958 | 0.0039 | 2.2623 | 57.3% |
 * | 128 | 0.0080 | 4.2560 | 0.0044 | 7.7101 | 55.2% |
 * | 256 | 0.0121 | 11.0769 | 0.0054 | 24.7834 | 44.7% |
 * | 512 | 0.0238 | 22.2216 | 0.0085 | 62.0788 | 35.8% |
 * | 1024 | 0.0692 | 30.4466 | 0.0330 | 63.8759 | 47.7% |
 * | 1280 | 0.1104 | 29.7971 | 0.0471 | 69.8370 | 42.7% |
 * | 2048 | 0.2471 | 34.0350 | 0.1030 | 81.6353 | 41.7% |
 * | 4096 | 1.1940 | 28.1372 | 0.3913 | 85.8602 | 32.8% |
 *
 * ![ssymv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-uplolower.svg)
 *
 * ![ssymv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3558 | 0.0037 | 0.6463 | 55.0% |
 * | 64 | 0.0068 | 1.2958 | 0.0041 | 2.1732 | 59.6% |
 * | 128 | 0.0081 | 4.1972 | 0.0048 | 7.0698 | 59.4% |
 * | 256 | 0.0125 | 10.6803 | 0.0068 | 19.7915 | 54.0% |
 * | 512 | 0.0248 | 21.3059 | 0.0110 | 48.0930 | 44.3% |
 * | 1024 | 0.0722 | 29.2044 | 0.0360 | 58.4867 | 49.9% |
 * | 1280 | 0.1147 | 28.6830 | 0.0611 | 53.8220 | 53.3% |
 * | 2048 | 0.2547 | 33.0172 | 0.1305 | 64.4236 | 51.3% |
 * | 4096 | 1.1428 | 29.3978 | 0.5178 | 64.8840 | 45.3% |
 *
 * ![ssymv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-uploupper.svg)
 *
 * ![ssymv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/uplo.ssymv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/uplo.ssymv.c) — CUDA / cuBLAS uplo-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0041 | 0.6023 | 62.9% |
 * | 64 | 0.0068 | 1.3271 | 0.0041 | 2.2188 | 59.8% |
 * | 128 | 0.0082 | 4.2353 | 0.0048 | 7.2483 | 58.4% |
 * | 256 | 0.0121 | 11.1323 | 0.0064 | 21.1457 | 52.6% |
 * | 512 | 0.0236 | 22.4736 | 0.0123 | 43.2500 | 52.0% |
 * | 1024 | 0.0695 | 30.3794 | 0.0284 | 74.3901 | 40.8% |
 * | 1280 | 0.1103 | 29.8781 | 0.0428 | 77.0082 | 38.8% |
 * | 2048 | 0.2470 | 34.0836 | 0.1046 | 80.4650 | 42.4% |
 * | 4096 | 1.1956 | 28.1125 | 0.3867 | 86.9150 | 32.3% |
 *
 * ![ssymv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad0.svg)
 *
 * ![ssymv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0041 | 0.6094 | 62.1% |
 * | 64 | 0.0068 | 1.3396 | 0.0042 | 2.1762 | 61.6% |
 * | 128 | 0.0080 | 4.3028 | 0.0048 | 7.2000 | 59.8% |
 * | 256 | 0.0106 | 12.7515 | 0.0067 | 20.1340 | 63.3% |
 * | 512 | 0.0184 | 28.8333 | 0.0116 | 45.7521 | 63.0% |
 * | 1024 | 0.0532 | 39.6538 | 0.0289 | 73.0720 | 54.3% |
 * | 1280 | 0.0910 | 36.2153 | 0.0445 | 73.9921 | 48.9% |
 * | 2048 | 0.2109 | 39.9029 | 0.1076 | 78.2392 | 51.0% |
 * | 4096 | 1.4087 | 23.8598 | 0.3998 | 84.0765 | 28.4% |
 *
 * ![ssymv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad1.svg)
 *
 * ![ssymv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3768 | 0.0041 | 0.6094 | 61.8% |
 * | 64 | 0.0069 | 1.3240 | 0.0041 | 2.2188 | 59.7% |
 * | 128 | 0.0081 | 4.2436 | 0.0049 | 7.0588 | 60.1% |
 * | 256 | 0.0108 | 12.4497 | 0.0064 | 20.9353 | 59.5% |
 * | 512 | 0.0200 | 26.5516 | 0.0123 | 43.2500 | 61.4% |
 * | 1024 | 0.0577 | 36.6171 | 0.0287 | 73.6429 | 49.7% |
 * | 1280 | 0.0936 | 35.2181 | 0.0448 | 73.4904 | 47.9% |
 * | 2048 | 0.2016 | 41.7458 | 0.1076 | 78.2624 | 53.3% |
 * | 4096 | 1.1469 | 29.3067 | 0.3969 | 84.6866 | 34.6% |
 *
 * ![ssymv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad8.svg)
 *
 * ![ssymv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3768 | 0.0041 | 0.6047 | 62.3% |
 * | 64 | 0.0072 | 1.2622 | 0.0041 | 2.2188 | 56.9% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.2727 | 58.0% |
 * | 256 | 0.0122 | 11.0737 | 0.0059 | 22.7459 | 48.7% |
 * | 512 | 0.0241 | 22.0119 | 0.0096 | 55.5452 | 39.6% |
 * | 1024 | 0.0704 | 30.0132 | 0.0287 | 73.6429 | 40.8% |
 * | 1280 | 0.1065 | 30.9375 | 0.0418 | 78.8663 | 39.2% |
 * | 2048 | 0.2592 | 32.4741 | 0.1001 | 84.0652 | 38.6% |
 * | 4096 | 1.1862 | 28.3359 | 0.3807 | 88.2848 | 32.1% |
 *
 * ![ssymv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad32.svg)
 *
 * ![ssymv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0035 | 0.7091 | 53.4% |
 * | 64 | 0.0070 | 1.2968 | 0.0039 | 2.3279 | 55.7% |
 * | 128 | 0.0082 | 4.2188 | 0.0044 | 7.7698 | 54.3% |
 * | 256 | 0.0123 | 10.9583 | 0.0053 | 25.2733 | 43.4% |
 * | 512 | 0.0242 | 21.9392 | 0.0088 | 60.0651 | 36.5% |
 * | 1024 | 0.0718 | 29.3915 | 0.0283 | 74.5582 | 39.4% |
 * | 1280 | 0.1067 | 30.8772 | 0.0427 | 77.0947 | 40.1% |
 * | 2048 | 0.2565 | 32.8123 | 0.1068 | 78.8135 | 41.6% |
 * | 4096 | 1.1894 | 28.2585 | 0.3883 | 86.5569 | 32.6% |
 *
 * ![ssymv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad64.svg)
 *
 * ![ssymv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3750 | 0.0042 | 0.5954 | 63.0% |
 * | 64 | 0.0072 | 1.2622 | 0.0041 | 2.2188 | 56.9% |
 * | 128 | 0.0082 | 4.2188 | 0.0047 | 7.4227 | 56.8% |
 * | 256 | 0.0123 | 10.9583 | 0.0057 | 23.5084 | 46.6% |
 * | 512 | 0.0242 | 21.9683 | 0.0093 | 57.0722 | 38.5% |
 * | 1024 | 0.0717 | 29.4571 | 0.0287 | 73.6429 | 40.0% |
 * | 1280 | 0.1058 | 31.1528 | 0.0425 | 77.5009 | 40.2% |
 * | 2048 | 0.2703 | 31.1364 | 0.1030 | 81.7148 | 38.1% |
 * | 4096 | 1.2350 | 27.2162 | 0.3932 | 85.4792 | 31.8% |
 *
 * ![ssymv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad128.svg)
 *
 * ![ssymv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/lda.ssymv.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/lda.ssymv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0068 | 0.3507 | 0.0038 | 0.6218 | 56.4% |
 * | 64 | 0.0067 | 1.3112 | 0.0039 | 2.2810 | 57.5% |
 * | 128 | 0.0081 | 4.2139 | 0.0044 | 7.6547 | 55.0% |
 * | 256 | 0.0121 | 11.0623 | 0.0057 | 23.5932 | 46.9% |
 * | 512 | 0.0239 | 22.1769 | 0.0086 | 61.2741 | 36.2% |
 * | 1024 | 0.0695 | 30.3274 | 0.0277 | 76.1781 | 39.8% |
 * | 1280 | 0.1106 | 29.7454 | 0.0449 | 73.2194 | 40.6% |
 * | 2048 | 0.2478 | 33.9339 | 0.0996 | 84.4015 | 40.2% |
 * | 4096 | 1.1960 | 28.0890 | 0.3859 | 87.0563 | 32.3% |
 *
 * ![ssymv-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alphaneg3p75.svg)
 *
 * ![ssymv-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0039 | 0.6066 | 59.2% |
 * | 64 | 0.0070 | 1.2603 | 0.0041 | 2.1732 | 58.0% |
 * | 128 | 0.0081 | 4.1807 | 0.0050 | 6.8205 | 61.3% |
 * | 256 | 0.0120 | 11.0916 | 0.0053 | 25.3860 | 43.7% |
 * | 512 | 0.0236 | 22.4173 | 0.0086 | 61.8467 | 36.2% |
 * | 1024 | 0.0695 | 30.3065 | 0.0274 | 76.8448 | 39.4% |
 * | 1280 | 0.1103 | 29.8317 | 0.0423 | 77.8198 | 38.3% |
 * | 2048 | 0.2467 | 34.0813 | 0.0996 | 84.4422 | 40.4% |
 * | 4096 | 1.1962 | 28.0860 | 0.3764 | 89.2659 | 31.5% |
 *
 * ![ssymv-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha0.svg)
 *
 * ![ssymv-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3541 | 0.0041 | 0.5781 | 61.2% |
 * | 64 | 0.0069 | 1.2719 | 0.0045 | 1.9437 | 65.4% |
 * | 128 | 0.0080 | 4.2306 | 0.0055 | 6.2222 | 68.0% |
 * | 256 | 0.0122 | 10.9463 | 0.0061 | 21.8068 | 50.2% |
 * | 512 | 0.0241 | 21.9416 | 0.0094 | 56.3680 | 38.9% |
 * | 1024 | 0.0695 | 30.3065 | 0.0284 | 74.1204 | 40.9% |
 * | 1280 | 0.1106 | 29.7454 | 0.0423 | 77.7610 | 38.3% |
 * | 2048 | 0.2476 | 33.9668 | 0.1041 | 80.7696 | 42.1% |
 * | 4096 | 1.1940 | 28.1372 | 0.3864 | 86.9374 | 32.4% |
 *
 * ![ssymv-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha1eneg38.svg)
 *
 * ![ssymv-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3524 | 0.0041 | 0.5781 | 61.0% |
 * | 64 | 0.0069 | 1.2837 | 0.0044 | 2.0000 | 64.2% |
 * | 128 | 0.0082 | 4.1563 | 0.0048 | 7.0698 | 58.8% |
 * | 256 | 0.0120 | 11.0916 | 0.0061 | 21.8639 | 50.7% |
 * | 512 | 0.0242 | 21.9126 | 0.0097 | 54.4211 | 40.3% |
 * | 1024 | 0.0695 | 30.3065 | 0.0285 | 73.9125 | 41.0% |
 * | 1280 | 0.1106 | 29.7540 | 0.0428 | 76.8311 | 38.7% |
 * | 2048 | 0.2472 | 34.0173 | 0.1024 | 82.1457 | 41.4% |
 * | 4096 | 1.1878 | 28.2847 | 0.3756 | 89.4408 | 31.6% |
 *
 * ![ssymv-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha1.svg)
 *
 * ![ssymv-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3524 | 0.0036 | 0.6549 | 53.8% |
 * | 64 | 0.0068 | 1.2958 | 0.0039 | 2.2531 | 57.5% |
 * | 128 | 0.0081 | 4.2222 | 0.0045 | 7.4930 | 56.3% |
 * | 256 | 0.0121 | 11.0623 | 0.0054 | 24.8571 | 44.5% |
 * | 512 | 0.0235 | 22.5088 | 0.0088 | 60.0508 | 37.5% |
 * | 1024 | 0.0692 | 30.4607 | 0.0279 | 75.4364 | 40.4% |
 * | 1280 | 0.1105 | 29.7669 | 0.0420 | 78.2642 | 38.0% |
 * | 2048 | 0.2470 | 34.0416 | 0.1009 | 83.3706 | 40.8% |
 * | 4096 | 1.1919 | 28.1856 | 0.3775 | 89.0048 | 31.7% |
 *
 * ![ssymv-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha2p5.svg)
 *
 * ![ssymv-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/alpha.ssymv.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/alpha.ssymv.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * ## beta sweep
 *
 * `beta` scales the existing `y`/`C` before accumulation. Reference BLAS is permitted to skip reading that operand entirely when `beta` is 0, so unlike `alpha` this sweep has a mechanism to be non-flat — a step at 0 means the shortcut is taken, and its size is what it saves.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3541 | 0.0044 | 0.5324 | 66.5% |
 * | 64 | 0.0068 | 1.3019 | 0.0043 | 2.0752 | 62.7% |
 * | 128 | 0.0081 | 4.2139 | 0.0051 | 6.7129 | 62.8% |
 * | 256 | 0.0121 | 11.0623 | 0.0060 | 22.4516 | 49.3% |
 * | 512 | 0.0241 | 21.9416 | 0.0097 | 54.7815 | 40.1% |
 * | 1024 | 0.0695 | 30.3065 | 0.0292 | 72.2105 | 42.0% |
 * | 1280 | 0.1104 | 29.7885 | 0.0431 | 76.3461 | 39.0% |
 * | 2048 | 0.2470 | 34.0482 | 0.1003 | 83.8360 | 40.6% |
 * | 4096 | 1.1967 | 28.0736 | 0.3807 | 88.2454 | 31.8% |
 *
 * ![ssymv-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-betaneg3p75.svg)
 *
 * ![ssymv-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0039 | 0.6116 | 58.7% |
 * | 64 | 0.0070 | 1.2661 | 0.0043 | 2.0674 | 61.2% |
 * | 128 | 0.0081 | 4.1890 | 0.0048 | 7.0933 | 59.1% |
 * | 256 | 0.0120 | 11.1658 | 0.0058 | 23.0083 | 48.5% |
 * | 512 | 0.0240 | 22.0440 | 0.0095 | 55.7037 | 39.6% |
 * | 1024 | 0.0695 | 30.3344 | 0.0284 | 74.1622 | 40.9% |
 * | 1280 | 0.1101 | 29.8794 | 0.0426 | 77.1772 | 38.7% |
 * | 2048 | 0.2464 | 34.1278 | 0.0994 | 84.5780 | 40.4% |
 * | 4096 | 1.1856 | 28.3354 | 0.3871 | 86.7936 | 32.6% |
 *
 * ![ssymv-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-beta0.svg)
 *
 * ![ssymv-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3515 | 0.0040 | 0.5920 | 59.4% |
 * | 64 | 0.0069 | 1.2719 | 0.0041 | 2.1563 | 59.0% |
 * | 128 | 0.0082 | 4.1725 | 0.0050 | 6.8205 | 61.2% |
 * | 256 | 0.0121 | 11.0476 | 0.0059 | 22.5730 | 48.9% |
 * | 512 | 0.0240 | 22.0587 | 0.0091 | 58.4594 | 37.7% |
 * | 1024 | 0.0695 | 30.3065 | 0.0287 | 73.5000 | 41.2% |
 * | 1280 | 0.1106 | 29.7454 | 0.0434 | 75.7553 | 39.3% |
 * | 2048 | 0.2469 | 34.0636 | 0.1063 | 79.1280 | 43.0% |
 * | 4096 | 1.1843 | 28.3668 | 0.3890 | 86.3617 | 32.8% |
 *
 * ![ssymv-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-beta1.svg)
 *
 * ![ssymv-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0046 | 0.5121 | 70.1% |
 * | 64 | 0.0069 | 1.2778 | 0.0041 | 2.1395 | 59.7% |
 * | 128 | 0.0082 | 4.1644 | 0.0051 | 6.7342 | 61.8% |
 * | 256 | 0.0121 | 11.0040 | 0.0070 | 18.9818 | 58.0% |
 * | 512 | 0.0237 | 22.3568 | 0.0123 | 43.0833 | 51.9% |
 * | 1024 | 0.0695 | 30.3344 | 0.0287 | 73.5000 | 41.3% |
 * | 1280 | 0.1105 | 29.7669 | 0.0433 | 75.9512 | 39.2% |
 * | 2048 | 0.2468 | 34.0791 | 0.1064 | 79.0684 | 43.1% |
 * | 4096 | 1.1959 | 28.0924 | 0.3891 | 86.3368 | 32.5% |
 *
 * ![ssymv-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-beta2p5.svg)
 *
 * ![ssymv-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/beta.ssymv.js) — WebGPU beta-sweep benchmark script
 * - [beta.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/beta.ssymv.c) — CUDA / cuBLAS beta-sweep reference script
 *
 * ## layout sweep
 *
 * Column-major swaps the effective `m`/`n` and flips the transpose flag internally, changing which axis is contiguous and therefore how the matrix reads coalesce. wgblas-only: cuBLAS is column-major and has no layout argument, so there is no reference curve to compare against.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = column-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0066 | 0.3610 |
 * | 64 | 0.0068 | 1.3019 |
 * | 128 | 0.0082 | 4.1563 |
 * | 256 | 0.0124 | 10.7907 |
 * | 512 | 0.0248 | 21.3196 |
 * | 1024 | 0.0722 | 29.1721 |
 * | 1280 | 0.1147 | 28.6830 |
 * | 2048 | 0.2983 | 28.1866 |
 * | 4096 | 1.4468 | 23.2213 |
 *
 * ![ssymv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-layoutcolumnmajor.svg)
 *
 * ![ssymv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0066 | 0.3592 |
 * | 64 | 0.0068 | 1.2927 |
 * | 128 | 0.0082 | 4.1563 |
 * | 256 | 0.0120 | 11.1509 |
 * | 512 | 0.0238 | 22.2067 |
 * | 1024 | 0.0695 | 30.3204 |
 * | 1280 | 0.1104 | 29.8101 |
 * | 2048 | 0.2469 | 34.0614 |
 * | 4096 | 1.1964 | 28.0797 |
 *
 * ![ssymv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-layoutrowmajor.svg)
 *
 * ![ssymv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/layout.ssymv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
