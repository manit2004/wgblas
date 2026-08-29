/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0369 | 0.0642 | 0.0084 | 0.2830 | 22.7% |
 * | 64 | 0.0676 | 0.1307 | 0.0102 | 0.8625 | 15.2% |
 * | 128 | 0.0834 | 0.4084 | 0.0140 | 2.4376 | 16.8% |
 * | 256 | 0.1322 | 1.0111 | 0.0210 | 6.3756 | 15.9% |
 * | 512 | 0.2736 | 1.9353 | 0.0354 | 14.9449 | 12.9% |
 * | 1024 | 0.5813 | 3.6252 | 0.0828 | 25.4614 | 14.2% |
 * | 2048 | 1.3230 | 6.3560 | 0.1697 | 49.5398 | 12.8% |
 * | 4096 | 3.3645 | 9.9852 | 0.3760 | 89.3380 | 11.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strsv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-default.svg)
 *
 * ![strsv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-default.svg)
 *
 * ## See also
 *
 * - [strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/strsv.js) — WebGPU benchmark script
 * - [strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/strsv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0358 | 0.0661 | 0.0086 | 0.2761 | 24.0% |
 * | 64 | 0.0649 | 0.1361 | 0.0104 | 0.8492 | 16.0% |
 * | 128 | 0.0773 | 0.4407 | 0.0140 | 2.4348 | 18.1% |
 * | 256 | 0.1162 | 1.1503 | 0.0208 | 6.4395 | 17.9% |
 * | 512 | 0.2353 | 2.2500 | 0.0351 | 15.0949 | 14.9% |
 * | 1024 | 0.4894 | 4.3064 | 0.0821 | 25.6598 | 16.8% |
 * | 1280 | 0.6243 | 5.2696 | 0.1036 | 31.7578 | 16.6% |
 * | 2048 | 1.0708 | 7.8533 | 0.1682 | 50.0065 | 15.7% |
 * | 4096 | 2.8397 | 11.8307 | 0.3791 | 88.6179 | 13.4% |
 *
 * ![strsv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride4.svg)
 *
 * ![strsv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0358 | 0.0662 | 0.0082 | 0.2891 | 22.9% |
 * | 64 | 0.0651 | 0.1356 | 0.0098 | 0.8990 | 15.1% |
 * | 128 | 0.0776 | 0.4389 | 0.0134 | 2.5394 | 17.3% |
 * | 256 | 0.1182 | 1.1303 | 0.0206 | 6.4744 | 17.5% |
 * | 512 | 0.2418 | 2.1895 | 0.0355 | 14.9045 | 14.7% |
 * | 1024 | 0.5183 | 4.0657 | 0.0864 | 24.4001 | 16.7% |
 * | 1280 | 0.6730 | 4.8880 | 0.1105 | 29.7669 | 16.4% |
 * | 2048 | 1.2017 | 6.9976 | 0.1756 | 47.8834 | 14.6% |
 * | 4096 | 3.1294 | 10.7355 | 0.3911 | 85.8918 | 12.5% |
 *
 * ![strsv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride32.svg)
 *
 * ![strsv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0355 | 0.0667 | 0.0079 | 0.3008 | 22.2% |
 * | 64 | 0.0652 | 0.1355 | 0.0098 | 0.9020 | 15.0% |
 * | 128 | 0.0778 | 0.4379 | 0.0200 | 1.7038 | 25.7% |
 * | 256 | 0.1182 | 1.1303 | 0.0220 | 6.0698 | 18.6% |
 * | 512 | 0.2440 | 2.1697 | 0.0456 | 11.6098 | 18.7% |
 * | 1024 | 0.5196 | 4.0562 | 0.0880 | 23.9476 | 16.9% |
 * | 1280 | 0.6738 | 4.8822 | 0.1107 | 29.7239 | 16.4% |
 * | 2048 | 1.2003 | 7.0059 | 0.1738 | 48.3859 | 14.5% |
 * | 4096 | 3.1325 | 10.7247 | 0.3917 | 85.7690 | 12.5% |
 *
 * ![strsv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride256.svg)
 *
 * ![strsv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/stride.strsv.js) — WebGPU stride-sweep benchmark script
 * - [stride.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/stride.strsv.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `trans = "no-transpose"`. `trans = "transpose"` reads A with a cross-thread `lda`-strided mirror pattern instead of a coalesced one, and the gap grows with `n` — collapsed below by default, expand a `trans` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0356 | 0.0666 | 0.0092 | 0.2587 | 25.7% |
 * | 64 | 0.0650 | 0.1359 | 0.0106 | 0.8313 | 16.3% |
 * | 128 | 0.0774 | 0.4401 | 0.0142 | 2.3964 | 18.4% |
 * | 256 | 0.1160 | 1.1525 | 0.0210 | 6.3513 | 18.1% |
 * | 512 | 0.2314 | 2.2876 | 0.0354 | 14.9719 | 15.3% |
 * | 1024 | 0.4874 | 4.3237 | 0.0833 | 25.3000 | 17.1% |
 * | 1280 | 0.6226 | 5.2837 | 0.1044 | 31.4951 | 16.8% |
 * | 2048 | 1.0650 | 7.8960 | 0.1696 | 49.5912 | 15.9% |
 * | 4096 | 2.6925 | 12.4773 | 0.3768 | 89.1711 | 14.0% |
 *
 * ![strsv-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-transno-transpose.svg)
 *
 * ![strsv-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0374 | 0.0633 | 0.0100 | 0.2357 | 26.9% |
 * | 64 | 0.0671 | 0.1316 | 0.0119 | 0.7449 | 17.7% |
 * | 128 | 0.0856 | 0.3980 | 0.0153 | 2.2259 | 17.9% |
 * | 256 | 0.1415 | 0.9442 | 0.0226 | 5.9066 | 16.0% |
 * | 512 | 0.2771 | 1.9107 | 0.0380 | 13.9142 | 13.7% |
 * | 1024 | 0.5838 | 3.6096 | 0.0800 | 26.3266 | 13.7% |
 * | 1280 | 0.7598 | 4.3295 | 0.1051 | 31.3081 | 13.8% |
 * | 2048 | 1.3230 | 6.3560 | 0.1638 | 51.3501 | 12.4% |
 * | 4096 | 3.3600 | 9.9985 | 0.4002 | 83.9515 | 11.9% |
 *
 * ![strsv-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-transtranspose.svg)
 *
 * ![strsv-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/trans.strsv.js) — WebGPU trans-sweep benchmark script
 * - [trans.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/trans.strsv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0356 | 0.0666 | 0.0086 | 0.2751 | 24.2% |
 * | 64 | 0.0653 | 0.1353 | 0.0106 | 0.8326 | 16.3% |
 * | 128 | 0.0773 | 0.4405 | 0.0141 | 2.4100 | 18.3% |
 * | 256 | 0.1150 | 1.1621 | 0.0213 | 6.2750 | 18.5% |
 * | 512 | 0.2335 | 2.2675 | 0.0356 | 14.8844 | 15.2% |
 * | 1024 | 0.4872 | 4.3252 | 0.0833 | 25.2903 | 17.1% |
 * | 1280 | 0.6218 | 5.2908 | 0.1044 | 31.4951 | 16.8% |
 * | 2048 | 1.0652 | 7.8943 | 0.1697 | 49.5492 | 15.9% |
 * | 4096 | 2.8069 | 11.9689 | 0.3761 | 89.3266 | 13.4% |
 *
 * ![strsv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-uplolower.svg)
 *
 * ![strsv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0366 | 0.0648 | 0.0084 | 0.2824 | 22.9% |
 * | 64 | 0.0656 | 0.1345 | 0.0102 | 0.8625 | 15.6% |
 * | 128 | 0.0787 | 0.4327 | 0.0138 | 2.4630 | 17.6% |
 * | 256 | 0.1246 | 1.0723 | 0.0205 | 6.5250 | 16.4% |
 * | 512 | 0.2353 | 2.2497 | 0.0350 | 15.1087 | 14.9% |
 * | 1024 | 0.4896 | 4.3045 | 0.0671 | 31.4049 | 13.7% |
 * | 1280 | 0.6256 | 5.2583 | 0.0835 | 39.4021 | 13.3% |
 * | 2048 | 1.0670 | 7.8810 | 0.1302 | 64.5899 | 12.2% |
 * | 4096 | 2.5761 | 13.0410 | 0.2888 | 116.3404 | 11.2% |
 *
 * ![strsv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-uploupper.svg)
 *
 * ![strsv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/uplo.strsv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/uplo.strsv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0355 | 0.0667 | 0.0102 | 0.2313 | 28.8% |
 * | 64 | 0.0653 | 0.1353 | 0.0125 | 0.7059 | 19.2% |
 * | 128 | 0.0772 | 0.4413 | 0.0169 | 2.0190 | 21.9% |
 * | 256 | 0.1159 | 1.1533 | 0.0265 | 5.0435 | 22.9% |
 * | 512 | 0.2315 | 2.2867 | 0.0451 | 11.7500 | 19.5% |
 * | 1024 | 0.4874 | 4.3235 | 0.0967 | 21.7850 | 19.8% |
 * | 1280 | 0.6215 | 5.2930 | 0.1204 | 27.3114 | 19.4% |
 * | 2048 | 1.0659 | 7.8892 | 0.1952 | 43.0829 | 18.3% |
 * | 4096 | 2.6961 | 12.4609 | 0.4243 | 79.1836 | 15.7% |
 *
 * ![strsv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad0.svg)
 *
 * ![strsv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0369 | 0.0642 | 0.0099 | 0.2395 | 26.8% |
 * | 64 | 0.0671 | 0.1317 | 0.0121 | 0.7282 | 18.1% |
 * | 128 | 0.0790 | 0.4311 | 0.0164 | 2.0781 | 20.7% |
 * | 256 | 0.1201 | 1.1124 | 0.0256 | 5.2200 | 21.3% |
 * | 512 | 0.2412 | 2.1946 | 0.0444 | 11.9193 | 18.4% |
 * | 1024 | 0.5038 | 4.1829 | 0.0949 | 22.2149 | 18.8% |
 * | 1280 | 0.6427 | 5.1185 | 0.1188 | 27.6940 | 18.5% |
 * | 2048 | 1.0979 | 7.6590 | 0.1802 | 46.6591 | 16.4% |
 * | 4096 | 2.6166 | 12.8391 | 0.4055 | 82.8485 | 15.5% |
 *
 * ![strsv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad1.svg)
 *
 * ![strsv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0356 | 0.0666 | 0.0088 | 0.2686 | 24.8% |
 * | 64 | 0.0650 | 0.1360 | 0.0112 | 0.7897 | 17.2% |
 * | 128 | 0.0767 | 0.4440 | 0.0147 | 2.3206 | 19.1% |
 * | 256 | 0.1163 | 1.1491 | 0.0230 | 5.8162 | 19.8% |
 * | 512 | 0.2319 | 2.2833 | 0.0390 | 13.5829 | 16.8% |
 * | 1024 | 0.4895 | 4.3054 | 0.0879 | 23.9825 | 18.0% |
 * | 1280 | 0.6232 | 5.2784 | 0.1106 | 29.7454 | 17.7% |
 * | 2048 | 1.0652 | 7.8941 | 0.1823 | 46.1348 | 17.1% |
 * | 4096 | 2.5847 | 12.9980 | 0.4082 | 82.3094 | 15.8% |
 *
 * ![strsv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad8.svg)
 *
 * ![strsv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0356 | 0.0665 | 0.0092 | 0.2583 | 25.8% |
 * | 64 | 0.0649 | 0.1360 | 0.0111 | 0.7988 | 17.0% |
 * | 128 | 0.0766 | 0.4445 | 0.0150 | 2.2735 | 19.6% |
 * | 256 | 0.1156 | 1.1565 | 0.0229 | 5.8324 | 19.8% |
 * | 512 | 0.2315 | 2.2865 | 0.0391 | 13.5274 | 16.9% |
 * | 1024 | 0.4875 | 4.3228 | 0.0886 | 23.7833 | 18.2% |
 * | 1280 | 0.6226 | 5.2837 | 0.1106 | 29.7454 | 17.8% |
 * | 2048 | 1.0669 | 7.8819 | 0.1819 | 46.2363 | 17.0% |
 * | 4096 | 2.5743 | 13.0501 | 0.3932 | 85.4375 | 15.3% |
 *
 * ![strsv-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad16.svg)
 *
 * ![strsv-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0356 | 0.0666 | 0.0084 | 0.2835 | 23.5% |
 * | 64 | 0.0648 | 0.1363 | 0.0102 | 0.8625 | 15.8% |
 * | 128 | 0.0766 | 0.4446 | 0.0140 | 2.4348 | 18.3% |
 * | 256 | 0.1157 | 1.1549 | 0.0209 | 6.3902 | 18.1% |
 * | 512 | 0.2338 | 2.2648 | 0.0352 | 15.0400 | 15.1% |
 * | 1024 | 0.4876 | 4.3218 | 0.0832 | 25.3292 | 17.1% |
 * | 1280 | 0.6227 | 5.2826 | 0.1044 | 31.4951 | 16.8% |
 * | 2048 | 1.0655 | 7.8922 | 0.1726 | 48.7314 | 16.2% |
 * | 4096 | 2.5702 | 13.0709 | 0.3927 | 85.5593 | 15.3% |
 *
 * ![strsv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad32.svg)
 *
 * ![strsv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0356 | 0.0665 | 0.0082 | 0.2891 | 23.0% |
 * | 64 | 0.0648 | 0.1362 | 0.0102 | 0.8625 | 15.8% |
 * | 128 | 0.0769 | 0.4427 | 0.0140 | 2.4376 | 18.2% |
 * | 256 | 0.1152 | 1.1595 | 0.0210 | 6.3610 | 18.2% |
 * | 512 | 0.2335 | 2.2675 | 0.0355 | 14.9314 | 15.2% |
 * | 1024 | 0.4894 | 4.3064 | 0.0839 | 25.1311 | 17.1% |
 * | 1280 | 0.6240 | 5.2722 | 0.1049 | 31.3462 | 16.8% |
 * | 2048 | 1.0670 | 7.8810 | 0.1733 | 48.5199 | 16.2% |
 * | 4096 | 2.5760 | 13.0415 | 0.3974 | 84.5329 | 15.4% |
 *
 * ![strsv-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad48.svg)
 *
 * ![strsv-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0357 | 0.0664 | 0.0082 | 0.2891 | 23.0% |
 * | 64 | 0.0650 | 0.1359 | 0.0102 | 0.8625 | 15.8% |
 * | 128 | 0.0770 | 0.4423 | 0.0140 | 2.4292 | 18.2% |
 * | 256 | 0.1161 | 1.1512 | 0.0208 | 6.4197 | 17.9% |
 * | 512 | 0.2332 | 2.2707 | 0.0353 | 14.9855 | 15.2% |
 * | 1024 | 0.4875 | 4.3225 | 0.0831 | 25.3487 | 17.1% |
 * | 1280 | 0.6244 | 5.2688 | 0.1044 | 31.4951 | 16.7% |
 * | 2048 | 1.0650 | 7.8957 | 0.1736 | 48.4528 | 16.3% |
 * | 4096 | 2.5635 | 13.1054 | 0.3953 | 84.9948 | 15.4% |
 *
 * ![strsv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad64.svg)
 *
 * ![strsv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0355 | 0.0667 | 0.0084 | 0.2835 | 23.5% |
 * | 64 | 0.0651 | 0.1357 | 0.0102 | 0.8652 | 15.7% |
 * | 128 | 0.0771 | 0.4418 | 0.0138 | 2.4687 | 17.9% |
 * | 256 | 0.1155 | 1.1568 | 0.0206 | 6.4744 | 17.9% |
 * | 512 | 0.2338 | 2.2648 | 0.0351 | 15.0949 | 15.0% |
 * | 1024 | 0.4874 | 4.3234 | 0.0838 | 25.1407 | 17.2% |
 * | 1280 | 0.6226 | 5.2837 | 0.1044 | 31.4951 | 16.8% |
 * | 2048 | 1.0669 | 7.8816 | 0.1756 | 47.8965 | 16.5% |
 * | 4096 | 2.5666 | 13.0897 | 0.4055 | 82.8485 | 15.8% |
 *
 * ![strsv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad128.svg)
 *
 * ![strsv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/lda.strsv.js) — WebGPU lda-sweep benchmark script
 * - [lda.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/lda.strsv.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * ## diag sweep
 *
 * A unit diagonal lets the kernel skip the diagonal load — and for the triangular solve, the reciprocal as well — so any difference here is exactly that skipped work.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = non-unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0360 | 0.0658 | 0.0086 | 0.2756 | 23.9% |
 * | 64 | 0.0651 | 0.1356 | 0.0107 | 0.8239 | 16.5% |
 * | 128 | 0.0769 | 0.4428 | 0.0142 | 2.3991 | 18.5% |
 * | 256 | 0.1155 | 1.1573 | 0.0209 | 6.3804 | 18.1% |
 * | 512 | 0.2318 | 2.2843 | 0.0353 | 15.0127 | 15.2% |
 * | 1024 | 0.4874 | 4.3235 | 0.0829 | 25.4074 | 17.0% |
 * | 1280 | 0.6220 | 5.2887 | 0.1044 | 31.4951 | 16.8% |
 * | 2048 | 1.0664 | 7.8855 | 0.1699 | 49.4885 | 15.9% |
 * | 4096 | 2.7976 | 12.0086 | 0.3763 | 89.2887 | 13.4% |
 *
 * ![strsv-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-diagnonunit.svg)
 *
 * ![strsv-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0363 | 0.0652 | 0.0076 | 0.3103 | 21.0% |
 * | 64 | 0.0659 | 0.1340 | 0.0086 | 1.0299 | 13.0% |
 * | 128 | 0.0781 | 0.4362 | 0.0122 | 2.7890 | 15.6% |
 * | 256 | 0.1188 | 1.1250 | 0.0187 | 7.1385 | 15.8% |
 * | 512 | 0.2413 | 2.1936 | 0.0322 | 16.4617 | 13.3% |
 * | 1024 | 0.5014 | 4.2034 | 0.0735 | 28.6829 | 14.7% |
 * | 1280 | 0.6394 | 5.1445 | 0.0942 | 34.9244 | 14.7% |
 * | 2048 | 1.0977 | 7.6604 | 0.1499 | 56.1085 | 13.7% |
 * | 4096 | 2.5683 | 13.0808 | 0.3850 | 87.2553 | 15.0% |
 *
 * ![strsv-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-diagunit.svg)
 *
 * ![strsv-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/diag.strsv.js) — WebGPU diag-sweep benchmark script
 * - [diag.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/diag.strsv.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 32 | 0.0369 | 0.0641 |
 * | 64 | 0.0682 | 0.1295 |
 * | 128 | 0.0843 | 0.4041 |
 * | 256 | 0.1351 | 0.9893 |
 * | 512 | 0.2742 | 1.9307 |
 * | 1024 | 0.5870 | 3.5902 |
 * | 1280 | 0.7656 | 4.2966 |
 * | 2048 | 1.3302 | 6.3216 |
 * | 4096 | 3.3589 | 10.0020 |
 *
 * ![strsv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-layoutcolumnmajor.svg)
 *
 * ![strsv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0356 | 0.0666 |
 * | 64 | 0.0650 | 0.1359 |
 * | 128 | 0.0772 | 0.4408 |
 * | 256 | 0.1161 | 1.1510 |
 * | 512 | 0.2333 | 2.2693 |
 * | 1024 | 0.4874 | 4.3235 |
 * | 1280 | 0.6226 | 5.2837 |
 * | 2048 | 1.0663 | 7.8864 |
 * | 4096 | 2.6699 | 12.5831 |
 *
 * ![strsv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-layoutrowmajor.svg)
 *
 * ![strsv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/layout.strsv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
