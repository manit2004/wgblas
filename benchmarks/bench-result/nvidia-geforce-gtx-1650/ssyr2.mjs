/**
 * Benchmark results for ssyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.6236 | 0.0041 | 1.0938 | 57.0% |
 * | 64 | 0.0072 | 2.3664 | 0.0041 | 4.1550 | 57.0% |
 * | 128 | 0.0075 | 8.9957 | 0.0042 | 15.8788 | 56.7% |
 * | 256 | 0.0082 | 32.3750 | 0.0051 | 52.4557 | 61.7% |
 * | 512 | 0.0109 | 96.7988 | 0.0084 | 126.0421 | 76.8% |
 * | 1024 | 0.0568 | 74.1015 | 0.0365 | 115.1608 | 64.3% |
 * | 1280 | 0.0922 | 71.2778 | 0.0730 | 89.9759 | 79.2% |
 * | 2048 | 0.2153 | 78.0288 | 0.1341 | 125.2818 | 62.3% |
 * | 4096 | 0.8073 | 83.1855 | 0.5161 | 130.1270 | 63.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyr2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-default.svg)
 *
 * ![ssyr2-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/ssyr2.js) — WebGPU benchmark script
 * - [ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/ssyr2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0068 | 0.6542 | 0.0041 | 1.0938 | 59.8% |
 * | 64 | 0.0069 | 2.4758 | 0.0042 | 4.1231 | 60.0% |
 * | 128 | 0.0073 | 9.1930 | 0.0042 | 15.8788 | 57.9% |
 * | 256 | 0.0084 | 31.5133 | 0.0050 | 52.6222 | 59.9% |
 * | 512 | 0.0121 | 87.0806 | 0.0084 | 125.8015 | 69.2% |
 * | 1024 | 0.0369 | 114.1111 | 0.0366 | 114.8589 | 99.3% |
 * | 1280 | 0.0543 | 121.0021 | 0.0731 | 89.8971 | 134.6% |
 * | 2048 | 0.1210 | 138.8302 | 0.1341 | 125.3267 | 110.8% |
 * | 4096 | 0.4444 | 151.1206 | 0.5161 | 130.1270 | 116.1% |
 *
 * ![ssyr2-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-uplolower.svg)
 *
 * ![ssyr2-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5996 | 0.0041 | 1.0980 | 54.6% |
 * | 64 | 0.0076 | 2.2521 | 0.0041 | 4.1390 | 54.4% |
 * | 128 | 0.0081 | 8.2846 | 0.0042 | 16.0000 | 51.8% |
 * | 256 | 0.0085 | 31.0994 | 0.0049 | 53.8182 | 57.8% |
 * | 512 | 0.0123 | 85.8333 | 0.0087 | 121.6236 | 70.6% |
 * | 1024 | 0.0590 | 71.3078 | 0.0370 | 113.7163 | 62.7% |
 * | 1280 | 0.0958 | 68.5752 | 0.0712 | 92.2192 | 74.4% |
 * | 2048 | 0.2253 | 74.5765 | 0.1311 | 128.1562 | 58.2% |
 * | 4096 | 0.8459 | 79.3965 | 0.5018 | 133.8236 | 59.3% |
 *
 * ![ssyr2-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-uploupper.svg)
 *
 * ![ssyr2-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/uplo.ssyr2.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/uplo.ssyr2.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0062 | 0.7179 | 0.0040 | 1.1200 | 64.1% |
 * | 64 | 0.0064 | 2.6935 | 0.0041 | 4.1875 | 64.3% |
 * | 128 | 0.0066 | 10.1256 | 0.0041 | 16.3750 | 61.8% |
 * | 256 | 0.0079 | 33.4869 | 0.0049 | 53.9935 | 62.0% |
 * | 512 | 0.0100 | 105.6410 | 0.0082 | 128.7500 | 82.1% |
 * | 1024 | 0.0341 | 123.2015 | 0.0357 | 117.7921 | 104.6% |
 * | 1280 | 0.0513 | 128.1398 | 0.0721 | 91.0736 | 140.7% |
 * | 2048 | 0.1165 | 144.1669 | 0.1322 | 127.1322 | 113.4% |
 * | 4096 | 0.4325 | 155.2801 | 0.5066 | 132.5641 | 117.1% |
 *
 * ![ssyr2-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad0.svg)
 *
 * ![ssyr2-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7179 | 0.0040 | 1.1290 | 63.6% |
 * | 64 | 0.0063 | 2.7071 | 0.0041 | 4.1875 | 64.6% |
 * | 128 | 0.0068 | 9.9336 | 0.0041 | 16.2481 | 61.1% |
 * | 256 | 0.0081 | 32.6299 | 0.0050 | 52.9585 | 61.6% |
 * | 512 | 0.0103 | 102.6791 | 0.0084 | 125.3232 | 81.9% |
 * | 1024 | 0.0555 | 75.7453 | 0.0448 | 93.8301 | 80.7% |
 * | 1280 | 0.0898 | 73.1184 | 0.0806 | 81.4765 | 89.7% |
 * | 2048 | 0.2150 | 78.1333 | 0.1555 | 108.0473 | 72.3% |
 * | 4096 | 0.8373 | 80.2036 | 0.7870 | 85.3333 | 94.0% |
 *
 * ![ssyr2-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad1.svg)
 *
 * ![ssyr2-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7179 | 0.0041 | 1.0938 | 65.6% |
 * | 64 | 0.0063 | 2.7071 | 0.0041 | 4.1712 | 64.9% |
 * | 128 | 0.0072 | 9.2949 | 0.0042 | 16.1231 | 57.6% |
 * | 256 | 0.0082 | 32.3750 | 0.0052 | 50.8466 | 63.7% |
 * | 512 | 0.0102 | 103.0000 | 0.0084 | 126.2835 | 81.6% |
 * | 1024 | 0.0594 | 70.8276 | 0.0475 | 88.4928 | 80.0% |
 * | 1280 | 0.0963 | 68.2447 | 0.0763 | 86.1255 | 79.2% |
 * | 2048 | 0.2145 | 78.3198 | 0.1797 | 93.4929 | 83.8% |
 * | 4096 | 0.8446 | 79.5138 | 0.7629 | 88.0304 | 90.3% |
 *
 * ![ssyr2-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad8.svg)
 *
 * ![ssyr2-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2785 | 57.0% |
 * | 64 | 0.0061 | 2.7917 | 0.0038 | 4.5042 | 62.0% |
 * | 128 | 0.0066 | 10.1256 | 0.0038 | 17.4667 | 58.0% |
 * | 256 | 0.0077 | 34.2479 | 0.0041 | 64.7500 | 52.9% |
 * | 512 | 0.0096 | 109.8667 | 0.0067 | 156.9524 | 70.0% |
 * | 1024 | 0.0560 | 75.0534 | 0.0448 | 93.7967 | 80.0% |
 * | 1280 | 0.0886 | 74.1083 | 0.0695 | 94.5120 | 78.4% |
 * | 2048 | 0.2171 | 77.3848 | 0.1444 | 116.3172 | 66.5% |
 * | 4096 | 0.7887 | 85.1498 | 0.7446 | 90.1963 | 94.4% |
 *
 * ![ssyr2-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad16.svg)
 *
 * ![ssyr2-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0034 | 1.3084 | 55.7% |
 * | 64 | 0.0061 | 2.7917 | 0.0036 | 4.7857 | 58.3% |
 * | 128 | 0.0065 | 10.3251 | 0.0036 | 18.4670 | 55.9% |
 * | 256 | 0.0077 | 34.5333 | 0.0041 | 64.2481 | 53.7% |
 * | 512 | 0.0098 | 108.0656 | 0.0066 | 160.0000 | 67.5% |
 * | 1024 | 0.0343 | 122.5126 | 0.0392 | 107.3110 | 114.2% |
 * | 1280 | 0.0512 | 128.3000 | 0.0598 | 109.9224 | 116.7% |
 * | 2048 | 0.1154 | 145.6466 | 0.1414 | 118.8447 | 122.6% |
 * | 4096 | 0.4485 | 149.7458 | 0.6225 | 107.8878 | 138.8% |
 *
 * ![ssyr2-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad32.svg)
 *
 * ![ssyr2-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2903 | 56.5% |
 * | 64 | 0.0061 | 2.7917 | 0.0036 | 4.7434 | 58.9% |
 * | 128 | 0.0065 | 10.3251 | 0.0036 | 18.7982 | 54.9% |
 * | 256 | 0.0077 | 34.5333 | 0.0041 | 64.7500 | 53.3% |
 * | 512 | 0.0097 | 108.9587 | 0.0067 | 158.4615 | 68.8% |
 * | 1024 | 0.0587 | 71.6772 | 0.0455 | 92.4120 | 77.6% |
 * | 1280 | 0.0874 | 75.1941 | 0.0696 | 94.3382 | 79.7% |
 * | 2048 | 0.2160 | 77.7918 | 0.1658 | 101.3426 | 76.8% |
 * | 4096 | 0.8060 | 83.3226 | 0.8364 | 80.2987 | 103.8% |
 *
 * ![ssyr2-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad48.svg)
 *
 * ![ssyr2-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2727 | 57.3% |
 * | 64 | 0.0061 | 2.7917 | 0.0036 | 4.7644 | 58.6% |
 * | 128 | 0.0065 | 10.2745 | 0.0038 | 17.7627 | 57.8% |
 * | 256 | 0.0077 | 34.6054 | 0.0041 | 64.7500 | 53.4% |
 * | 512 | 0.0096 | 109.5017 | 0.0067 | 158.4615 | 69.1% |
 * | 1024 | 0.0348 | 120.7126 | 0.0412 | 102.1414 | 118.2% |
 * | 1280 | 0.0500 | 131.2532 | 0.0592 | 110.9622 | 118.3% |
 * | 2048 | 0.1198 | 140.2955 | 0.1498 | 112.1435 | 125.1% |
 * | 4096 | 0.4436 | 151.3877 | 0.5980 | 112.3014 | 134.8% |
 *
 * ![ssyr2-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad64.svg)
 *
 * ![ssyr2-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2670 | 57.6% |
 * | 64 | 0.0063 | 2.7347 | 0.0037 | 4.6207 | 59.2% |
 * | 128 | 0.0065 | 10.3251 | 0.0037 | 18.0690 | 57.1% |
 * | 256 | 0.0075 | 35.2681 | 0.0041 | 64.7500 | 54.5% |
 * | 512 | 0.0099 | 106.3226 | 0.0071 | 147.8027 | 71.9% |
 * | 1024 | 0.0347 | 121.3813 | 0.0420 | 100.2716 | 121.1% |
 * | 1280 | 0.0512 | 128.3000 | 0.0631 | 104.1238 | 123.2% |
 * | 2048 | 0.1206 | 139.3091 | 0.1837 | 91.4572 | 152.3% |
 * | 4096 | 0.4859 | 138.2080 | 0.6361 | 105.5731 | 130.9% |
 *
 * ![ssyr2-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad128.svg)
 *
 * ![ssyr2-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/lda.ssyr2.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/lda.ssyr2.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2
 */
