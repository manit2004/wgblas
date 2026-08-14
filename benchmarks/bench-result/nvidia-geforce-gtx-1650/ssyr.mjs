/**
 * Benchmark results for ssyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5751 | 0.0041 | 1.0625 | 54.1% |
 * | 64 | 0.0076 | 2.2185 | 0.0041 | 4.1250 | 53.8% |
 * | 128 | 0.0080 | 8.3702 | 0.0041 | 16.2500 | 51.5% |
 * | 256 | 0.0086 | 30.6914 | 0.0044 | 60.7059 | 50.6% |
 * | 512 | 0.0118 | 89.5129 | 0.0077 | 135.9339 | 65.9% |
 * | 1024 | 0.0572 | 73.4086 | 0.0342 | 122.7364 | 59.8% |
 * | 1280 | 0.0938 | 69.9710 | 0.0715 | 91.8174 | 76.2% |
 * | 2048 | 0.2246 | 74.7738 | 0.1247 | 134.6504 | 55.5% |
 * | 4096 | 0.8136 | 82.5241 | 0.4865 | 138.0016 | 59.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyr-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-default.svg)
 *
 * ![ssyr-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/ssyr.js) — WebGPU benchmark script
 * - [ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/ssyr.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0078 | 0.5608 | 0.0041 | 1.0667 | 52.6% |
 * | 64 | 0.0076 | 2.2185 | 0.0041 | 4.1250 | 53.8% |
 * | 128 | 0.0081 | 8.2540 | 0.0041 | 16.2500 | 50.8% |
 * | 256 | 0.0092 | 28.8671 | 0.0044 | 59.8261 | 48.3% |
 * | 512 | 0.0119 | 88.6685 | 0.0079 | 133.1822 | 66.6% |
 * | 1024 | 0.0365 | 115.1495 | 0.0345 | 121.9387 | 94.4% |
 * | 1280 | 0.0540 | 121.4446 | 0.0716 | 91.7147 | 132.4% |
 * | 2048 | 0.1208 | 138.9831 | 0.1251 | 134.2886 | 103.5% |
 * | 4096 | 0.4443 | 151.1164 | 0.4867 | 137.9517 | 109.5% |
 *
 * ![ssyr-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-uplolower.svg)
 *
 * ![ssyr-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5824 | 0.0040 | 1.0924 | 53.3% |
 * | 64 | 0.0077 | 2.1863 | 0.0041 | 4.1089 | 53.2% |
 * | 128 | 0.0078 | 8.4898 | 0.0045 | 14.6479 | 58.0% |
 * | 256 | 0.0084 | 31.3916 | 0.0044 | 60.7059 | 51.7% |
 * | 512 | 0.0120 | 87.6059 | 0.0079 | 133.1822 | 65.8% |
 * | 1024 | 0.0558 | 75.3676 | 0.0350 | 119.9342 | 62.8% |
 * | 1280 | 0.0922 | 71.2222 | 0.0701 | 93.6194 | 76.1% |
 * | 2048 | 0.2245 | 74.8165 | 0.1199 | 140.0587 | 53.4% |
 * | 4096 | 0.8049 | 83.4198 | 0.4669 | 143.7944 | 58.0% |
 *
 * ![ssyr-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-uploupper.svg)
 *
 * ![ssyr-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/uplo.ssyr.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/uplo.ssyr.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0075 | 0.5787 | 0.0041 | 1.0709 | 54.0% |
 * | 64 | 0.0078 | 2.1728 | 0.0041 | 4.1250 | 52.7% |
 * | 128 | 0.0080 | 8.2704 | 0.0041 | 16.2500 | 50.9% |
 * | 256 | 0.0090 | 29.3808 | 0.0044 | 60.2628 | 48.8% |
 * | 512 | 0.0119 | 88.7881 | 0.0076 | 137.9287 | 64.4% |
 * | 1024 | 0.0367 | 114.4969 | 0.0343 | 122.3933 | 93.5% |
 * | 1280 | 0.0538 | 122.0226 | 0.0716 | 91.6328 | 133.2% |
 * | 2048 | 0.1208 | 138.9831 | 0.1249 | 134.4435 | 103.4% |
 * | 4096 | 0.4428 | 151.6187 | 0.4862 | 138.0879 | 109.8% |
 *
 * ![ssyr-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad0.svg)
 *
 * ![ssyr-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5726 | 0.0041 | 1.0709 | 53.5% |
 * | 64 | 0.0076 | 2.2138 | 0.0041 | 4.1250 | 53.7% |
 * | 128 | 0.0082 | 8.1250 | 0.0041 | 16.2500 | 50.0% |
 * | 256 | 0.0091 | 28.9177 | 0.0048 | 55.2241 | 52.4% |
 * | 512 | 0.0123 | 85.6667 | 0.0082 | 128.5000 | 66.7% |
 * | 1024 | 0.0594 | 70.7586 | 0.0432 | 97.1720 | 72.8% |
 * | 1280 | 0.0967 | 67.8644 | 0.0800 | 82.0973 | 82.7% |
 * | 2048 | 0.2260 | 74.3080 | 0.1516 | 110.7757 | 67.1% |
 * | 4096 | 0.8512 | 78.8832 | 0.7779 | 86.3127 | 91.4% |
 *
 * ![ssyr-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad1.svg)
 *
 * ![ssyr-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0073 | 0.5939 | 0.0040 | 1.0794 | 55.0% |
 * | 64 | 0.0072 | 2.3363 | 0.0041 | 4.1575 | 56.2% |
 * | 128 | 0.0077 | 8.5950 | 0.0041 | 16.2500 | 52.9% |
 * | 256 | 0.0086 | 30.8060 | 0.0045 | 58.9714 | 52.2% |
 * | 512 | 0.0113 | 92.7955 | 0.0076 | 137.6402 | 67.4% |
 * | 1024 | 0.0593 | 70.8159 | 0.0470 | 89.4605 | 79.2% |
 * | 1280 | 0.0942 | 69.6857 | 0.0746 | 87.9400 | 79.2% |
 * | 2048 | 0.2171 | 77.3414 | 0.1787 | 93.9828 | 82.3% |
 * | 4096 | 0.8072 | 83.1751 | 0.7619 | 88.1290 | 94.4% |
 *
 * ![ssyr-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad8.svg)
 *
 * ![ssyr-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.6182 | 0.0035 | 1.2593 | 49.1% |
 * | 64 | 0.0062 | 2.7216 | 0.0035 | 4.8664 | 55.9% |
 * | 128 | 0.0067 | 10.0000 | 0.0035 | 19.0826 | 52.4% |
 * | 256 | 0.0077 | 34.4000 | 0.0040 | 66.5807 | 51.7% |
 * | 512 | 0.0100 | 105.7749 | 0.0061 | 172.2304 | 61.4% |
 * | 1024 | 0.0554 | 75.8683 | 0.0444 | 94.5486 | 80.2% |
 * | 1280 | 0.0860 | 76.3095 | 0.0687 | 95.5602 | 79.9% |
 * | 2048 | 0.2086 | 80.4970 | 0.1409 | 119.1509 | 67.6% |
 * | 4096 | 0.7577 | 88.6129 | 0.7432 | 90.3471 | 98.1% |
 *
 * ![ssyr-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad16.svg)
 *
 * ![ssyr-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0036 | 1.2197 | 58.1% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8440 | 56.8% |
 * | 128 | 0.0065 | 10.2970 | 0.0037 | 17.7778 | 57.9% |
 * | 256 | 0.0076 | 34.8354 | 0.0039 | 67.1219 | 51.9% |
 * | 512 | 0.0096 | 110.0201 | 0.0061 | 172.6824 | 63.7% |
 * | 1024 | 0.0343 | 122.6791 | 0.0384 | 109.5770 | 112.0% |
 * | 1280 | 0.0512 | 128.2000 | 0.0580 | 113.1073 | 113.3% |
 * | 2048 | 0.1151 | 145.8588 | 0.1374 | 122.1886 | 119.4% |
 * | 4096 | 0.4480 | 149.8590 | 0.6183 | 108.5900 | 138.0% |
 *
 * ![ssyr-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad32.svg)
 *
 * ![ssyr-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2477 | 56.8% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8889 | 56.2% |
 * | 128 | 0.0065 | 10.1961 | 0.0035 | 18.8235 | 54.2% |
 * | 256 | 0.0076 | 34.9091 | 0.0039 | 68.2314 | 51.2% |
 * | 512 | 0.0097 | 108.5677 | 0.0061 | 171.3333 | 63.4% |
 * | 1024 | 0.0556 | 75.6498 | 0.0451 | 93.2727 | 81.1% |
 * | 1280 | 0.0853 | 76.9248 | 0.0690 | 95.0950 | 80.9% |
 * | 2048 | 0.2126 | 78.9945 | 0.1636 | 102.6504 | 77.0% |
 * | 4096 | 0.7858 | 85.4480 | 0.8350 | 80.4099 | 106.3% |
 *
 * ![ssyr-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad48.svg)
 *
 * ![ssyr-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0034 | 1.2651 | 56.0% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8889 | 56.2% |
 * | 128 | 0.0065 | 10.2970 | 0.0035 | 19.1705 | 53.7% |
 * | 256 | 0.0076 | 34.7621 | 0.0038 | 69.3782 | 50.1% |
 * | 512 | 0.0096 | 109.2890 | 0.0061 | 171.3333 | 63.8% |
 * | 1024 | 0.0348 | 120.7059 | 0.0406 | 103.5302 | 116.6% |
 * | 1280 | 0.0492 | 133.3680 | 0.0573 | 114.5922 | 116.4% |
 * | 2048 | 0.1192 | 140.8670 | 0.1469 | 114.3480 | 123.2% |
 * | 4096 | 0.4432 | 151.4983 | 0.5932 | 113.1855 | 133.8% |
 *
 * ![ssyr-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad64.svg)
 *
 * ![ssyr-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2364 | 57.3% |
 * | 64 | 0.0061 | 2.7500 | 0.0036 | 4.7354 | 58.1% |
 * | 128 | 0.0064 | 10.3226 | 0.0036 | 18.6547 | 55.3% |
 * | 256 | 0.0077 | 34.2573 | 0.0038 | 69.9661 | 49.0% |
 * | 512 | 0.0097 | 108.2105 | 0.0061 | 171.3333 | 63.2% |
 * | 1024 | 0.0343 | 122.6218 | 0.0410 | 102.4399 | 119.7% |
 * | 1280 | 0.0512 | 128.2000 | 0.0615 | 106.6667 | 120.2% |
 * | 2048 | 0.1193 | 140.7537 | 0.1817 | 92.4188 | 152.3% |
 * | 4096 | 0.4855 | 138.2835 | 0.6323 | 106.1884 | 130.2% |
 *
 * ![ssyr-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad128.svg)
 *
 * ![ssyr-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/lda.ssyr.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/lda.ssyr.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr
 */
