/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.2994 | 0.0041 | 0.6142 | 48.8% |
 * | 64 | 0.0087 | 1.0499 | 0.0045 | 2.0142 | 52.1% |
 * | 128 | 0.0102 | 3.3750 | 0.0055 | 6.2791 | 53.7% |
 * | 256 | 0.0164 | 8.2188 | 0.0063 | 21.3063 | 38.6% |
 * | 512 | 0.0287 | 18.5357 | 0.0108 | 49.3551 | 37.6% |
 * | 1024 | 0.0722 | 29.2417 | 0.0331 | 63.8143 | 45.8% |
 * | 1280 | 0.1147 | 28.7277 | 0.0477 | 69.0080 | 41.6% |
 * | 2048 | 0.2575 | 32.6920 | 0.1097 | 76.7440 | 42.6% |
 * | 4096 | 1.2717 | 26.4300 | 0.4049 | 83.0199 | 31.8% |
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
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.3184 | 0.0040 | 0.6190 | 51.4% |
 * | 64 | 0.0068 | 1.3271 | 0.0044 | 2.0882 | 63.6% |
 * | 128 | 0.0081 | 4.2772 | 0.0056 | 6.2069 | 68.9% |
 * | 256 | 0.0122 | 11.0446 | 0.0062 | 21.6907 | 50.9% |
 * | 512 | 0.0245 | 21.6956 | 0.0106 | 50.0996 | 43.3% |
 * | 1024 | 0.0696 | 30.3235 | 0.0328 | 64.4375 | 47.1% |
 * | 1280 | 0.1106 | 29.7917 | 0.0476 | 69.2401 | 43.0% |
 * | 2048 | 0.2477 | 33.9779 | 0.1086 | 77.4786 | 43.9% |
 * | 4096 | 1.1981 | 28.0536 | 0.4029 | 83.4287 | 33.6% |
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
 * | 32 | 0.0066 | 0.3786 | 0.0040 | 0.6240 | 60.7% |
 * | 64 | 0.0068 | 1.3396 | 0.0044 | 2.0882 | 64.2% |
 * | 128 | 0.0081 | 4.2688 | 0.0054 | 6.4286 | 66.4% |
 * | 256 | 0.0105 | 12.8489 | 0.0063 | 21.3604 | 60.2% |
 * | 512 | 0.0184 | 28.8333 | 0.0113 | 46.9816 | 61.4% |
 * | 1024 | 0.0532 | 39.6538 | 0.0335 | 63.0220 | 62.9% |
 * | 1280 | 0.0920 | 35.8184 | 0.0492 | 66.9223 | 53.5% |
 * | 2048 | 0.1884 | 44.6739 | 0.1114 | 75.5645 | 59.1% |
 * | 4096 | 1.0898 | 30.8428 | 0.3966 | 84.7549 | 36.4% |
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
 * | 32 | 0.0066 | 0.3786 | 0.0036 | 0.6842 | 55.3% |
 * | 64 | 0.0070 | 1.3057 | 0.0041 | 2.2362 | 58.4% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.2483 | 58.2% |
 * | 256 | 0.0108 | 12.5238 | 0.0058 | 23.2486 | 53.9% |
 * | 512 | 0.0198 | 26.8087 | 0.0096 | 55.4524 | 48.3% |
 * | 1024 | 0.0577 | 36.5866 | 0.0300 | 70.3454 | 52.0% |
 * | 1280 | 0.0933 | 35.3147 | 0.0460 | 71.6493 | 49.3% |
 * | 2048 | 0.2012 | 41.8387 | 0.1061 | 79.3365 | 52.7% |
 * | 4096 | 1.1387 | 29.5180 | 0.3935 | 85.4270 | 34.6% |
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
 * | 32 | 0.0066 | 0.3786 | 0.0037 | 0.6812 | 55.6% |
 * | 64 | 0.0068 | 1.3333 | 0.0040 | 2.2903 | 58.2% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.2241 | 58.4% |
 * | 256 | 0.0121 | 11.1323 | 0.0057 | 23.6404 | 47.1% |
 * | 512 | 0.0240 | 22.1736 | 0.0096 | 55.3600 | 40.1% |
 * | 1024 | 0.0701 | 30.1022 | 0.0298 | 70.8363 | 42.5% |
 * | 1280 | 0.1065 | 30.9421 | 0.0437 | 75.3182 | 41.1% |
 * | 2048 | 0.2583 | 32.5887 | 0.1034 | 81.3861 | 40.0% |
 * | 4096 | 1.1898 | 28.2494 | 0.3903 | 86.1098 | 32.8% |
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
 * | 32 | 0.0066 | 0.3786 | 0.0036 | 0.6903 | 54.9% |
 * | 64 | 0.0068 | 1.3302 | 0.0041 | 2.2362 | 59.5% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.1523 | 59.0% |
 * | 256 | 0.0122 | 11.0013 | 0.0058 | 23.2486 | 47.3% |
 * | 512 | 0.0240 | 22.1440 | 0.0096 | 55.3600 | 40.0% |
 * | 1024 | 0.0718 | 29.4046 | 0.0301 | 70.1584 | 41.9% |
 * | 1280 | 0.1067 | 30.8772 | 0.0448 | 73.5954 | 42.0% |
 * | 2048 | 0.2561 | 32.8697 | 0.1035 | 81.2981 | 40.4% |
 * | 4096 | 1.1927 | 28.1815 | 0.3928 | 85.5697 | 32.9% |
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
 * | 32 | 0.0066 | 0.3805 | 0.0037 | 0.6724 | 56.6% |
 * | 64 | 0.0070 | 1.2909 | 0.0041 | 2.2188 | 58.2% |
 * | 128 | 0.0082 | 4.2188 | 0.0047 | 7.2973 | 57.8% |
 * | 256 | 0.0123 | 10.9583 | 0.0057 | 23.6404 | 46.4% |
 * | 512 | 0.0238 | 22.3677 | 0.0095 | 55.7315 | 40.1% |
 * | 1024 | 0.0714 | 29.5693 | 0.0302 | 69.9724 | 42.3% |
 * | 1280 | 0.1062 | 31.0214 | 0.0449 | 73.3333 | 42.3% |
 * | 2048 | 0.2692 | 31.2659 | 0.1047 | 80.3912 | 38.9% |
 * | 4096 | 1.2349 | 27.2183 | 0.4133 | 81.3325 | 33.5% |
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
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
