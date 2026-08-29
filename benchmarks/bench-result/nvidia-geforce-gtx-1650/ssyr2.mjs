/**
 * Benchmark results for ssyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0037 | 1.2174 | 59.9% |
 * | 64 | 0.0061 | 2.7917 | 0.0041 | 4.1875 | 66.7% |
 * | 128 | 0.0064 | 10.5327 | 0.0039 | 17.2510 | 61.1% |
 * | 256 | 0.0072 | 36.5916 | 0.0044 | 60.9412 | 60.0% |
 * | 512 | 0.0097 | 108.4211 | 0.0072 | 146.4889 | 74.0% |
 * | 1024 | 0.0559 | 75.2683 | 0.0332 | 126.5217 | 59.5% |
 * | 1280 | 0.0930 | 70.6522 | 0.0695 | 94.5120 | 74.8% |
 * | 2048 | 0.2294 | 73.2500 | 0.1190 | 141.2200 | 51.9% |
 * | 4096 | 0.8366 | 80.2757 | 0.4790 | 140.2023 | 57.3% |
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
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5932 | 0.0036 | 1.2389 | 47.9% |
 * | 64 | 0.0080 | 2.1397 | 0.0037 | 4.5812 | 46.7% |
 * | 128 | 0.0082 | 8.1875 | 0.0038 | 17.7627 | 46.1% |
 * | 256 | 0.0097 | 27.2632 | 0.0042 | 63.7538 | 42.8% |
 * | 512 | 0.0143 | 73.5714 | 0.0068 | 154.7418 | 47.5% |
 * | 1024 | 0.0389 | 108.1053 | 0.0440 | 95.6391 | 113.0% |
 * | 1280 | 0.0578 | 113.5712 | 0.0695 | 94.5773 | 120.1% |
 * | 2048 | 0.1597 | 105.1795 | 0.1272 | 132.1394 | 79.6% |
 * | 4096 | 0.7999 | 83.9576 | 0.4895 | 137.2050 | 61.2% |
 *
 * ![ssyr2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride4.svg)
 *
 * ![ssyr2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5957 | 0.0038 | 1.1864 | 50.2% |
 * | 64 | 0.0081 | 2.1228 | 0.0038 | 4.5424 | 46.7% |
 * | 128 | 0.0094 | 7.1658 | 0.0039 | 17.3223 | 41.4% |
 * | 256 | 0.0164 | 16.1402 | 0.0047 | 56.7671 | 28.4% |
 * | 512 | 0.0395 | 26.6775 | 0.0082 | 128.7500 | 20.7% |
 * | 1024 | 0.1495 | 28.1370 | 0.0353 | 119.0725 | 23.6% |
 * | 1280 | 0.2298 | 28.5905 | 0.0710 | 92.4893 | 30.9% |
 * | 2048 | 0.5595 | 30.0324 | 0.1314 | 127.8442 | 23.5% |
 * | 4096 | 1.8779 | 35.7631 | 0.6141 | 109.3636 | 32.7% |
 *
 * ![ssyr2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride32.svg)
 *
 * ![ssyr2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0039 | 1.1475 | 63.5% |
 * | 64 | 0.0066 | 2.6146 | 0.0039 | 4.4298 | 59.0% |
 * | 128 | 0.0079 | 8.4858 | 0.0039 | 17.3223 | 49.0% |
 * | 256 | 0.0142 | 18.6247 | 0.0048 | 55.6242 | 33.5% |
 * | 512 | 0.0313 | 33.7359 | 0.0081 | 129.7638 | 26.0% |
 * | 1024 | 0.1250 | 33.6592 | 0.0350 | 120.3259 | 28.0% |
 * | 1280 | 0.1928 | 34.0799 | 0.0696 | 94.3382 | 36.1% |
 * | 2048 | 0.4760 | 35.2955 | 0.1352 | 124.3030 | 28.4% |
 * | 4096 | 1.8876 | 35.5791 | 0.6349 | 105.7806 | 33.6% |
 *
 * ![ssyr2-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride256.svg)
 *
 * ![ssyr2-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/stride.ssyr2.js) — WebGPU stride-sweep benchmark script
 * - [stride.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/stride.ssyr2.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0061 | 0.7292 | 0.0036 | 1.2500 | 58.3% |
 * | 64 | 0.0061 | 2.7917 | 0.0041 | 4.2205 | 66.1% |
 * | 128 | 0.0064 | 10.5327 | 0.0038 | 17.4667 | 60.3% |
 * | 256 | 0.0076 | 35.1186 | 0.0041 | 64.2481 | 54.7% |
 * | 512 | 0.0096 | 109.8667 | 0.0067 | 156.9524 | 70.0% |
 * | 1024 | 0.0335 | 125.6149 | 0.0326 | 129.1317 | 97.3% |
 * | 1280 | 0.0512 | 128.3000 | 0.0677 | 97.0132 | 132.3% |
 * | 2048 | 0.1148 | 146.3979 | 0.1260 | 133.2968 | 109.8% |
 * | 4096 | 0.4342 | 154.6792 | 0.4664 | 143.9874 | 107.4% |
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
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2785 | 57.0% |
 * | 64 | 0.0062 | 2.7844 | 0.0036 | 4.7857 | 58.2% |
 * | 128 | 0.0064 | 10.5327 | 0.0038 | 17.6134 | 59.8% |
 * | 256 | 0.0074 | 35.9566 | 0.0041 | 64.7500 | 55.5% |
 * | 512 | 0.0099 | 106.1514 | 0.0070 | 151.5402 | 70.0% |
 * | 1024 | 0.0524 | 80.2785 | 0.0331 | 127.0106 | 63.2% |
 * | 1280 | 0.0893 | 73.5244 | 0.0676 | 97.1970 | 75.6% |
 * | 2048 | 0.2068 | 81.2277 | 0.1262 | 133.0940 | 61.0% |
 * | 4096 | 0.7737 | 86.7980 | 0.4590 | 146.3010 | 59.3% |
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
 * | 32 | 0.0077 | 0.5797 | 0.0036 | 1.2500 | 46.4% |
 * | 64 | 0.0077 | 2.2333 | 0.0037 | 4.5812 | 48.7% |
 * | 128 | 0.0080 | 8.3673 | 0.0039 | 17.3223 | 48.3% |
 * | 256 | 0.0091 | 29.0298 | 0.0043 | 61.8507 | 46.9% |
 * | 512 | 0.0120 | 87.7763 | 0.0070 | 151.5402 | 57.9% |
 * | 1024 | 0.0367 | 114.6085 | 0.0328 | 128.3750 | 89.3% |
 * | 1280 | 0.0544 | 120.6820 | 0.0689 | 95.3018 | 126.6% |
 * | 2048 | 0.1206 | 139.2906 | 0.1189 | 141.2770 | 98.6% |
 * | 4096 | 0.4444 | 151.1152 | 0.4813 | 139.5451 | 108.3% |
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
 * | 32 | 0.0075 | 0.6009 | 0.0038 | 1.1864 | 50.6% |
 * | 64 | 0.0078 | 2.2058 | 0.0038 | 4.4667 | 49.4% |
 * | 128 | 0.0082 | 8.1875 | 0.0038 | 17.4667 | 46.9% |
 * | 256 | 0.0093 | 28.4811 | 0.0054 | 49.0414 | 58.1% |
 * | 512 | 0.0123 | 85.8333 | 0.0073 | 144.5614 | 59.4% |
 * | 1024 | 0.0614 | 68.4667 | 0.0409 | 102.7401 | 66.6% |
 * | 1280 | 0.0965 | 68.0411 | 0.0778 | 84.4253 | 80.6% |
 * | 2048 | 0.2320 | 72.4165 | 0.1553 | 108.1920 | 66.9% |
 * | 4096 | 0.8857 | 75.8279 | 0.7662 | 87.6517 | 86.5% |
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
 * | 32 | 0.0064 | 0.6983 | 0.0043 | 1.0448 | 66.8% |
 * | 64 | 0.0065 | 2.6210 | 0.0041 | 4.1875 | 62.6% |
 * | 128 | 0.0071 | 9.5057 | 0.0040 | 16.9032 | 56.2% |
 * | 256 | 0.0082 | 32.5020 | 0.0045 | 58.9893 | 55.1% |
 * | 512 | 0.0103 | 102.3602 | 0.0076 | 138.7789 | 73.8% |
 * | 1024 | 0.0568 | 74.0806 | 0.0445 | 94.6067 | 78.3% |
 * | 1280 | 0.0927 | 70.8717 | 0.0758 | 86.6160 | 81.8% |
 * | 2048 | 0.2156 | 77.9188 | 0.1817 | 92.4720 | 84.3% |
 * | 4096 | 0.8132 | 82.5865 | 0.7572 | 88.6944 | 93.1% |
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
 * | 32 | 0.0065 | 0.6880 | 0.0037 | 1.2069 | 57.0% |
 * | 64 | 0.0065 | 2.6210 | 0.0036 | 4.7857 | 54.8% |
 * | 128 | 0.0073 | 9.2132 | 0.0036 | 18.3860 | 50.1% |
 * | 256 | 0.0082 | 32.3750 | 0.0042 | 62.7879 | 51.6% |
 * | 512 | 0.0102 | 103.0000 | 0.0068 | 155.4717 | 66.2% |
 * | 1024 | 0.0573 | 73.3571 | 0.0451 | 93.3636 | 78.6% |
 * | 1280 | 0.0911 | 72.1040 | 0.0708 | 92.8239 | 77.7% |
 * | 2048 | 0.2199 | 76.4051 | 0.1494 | 112.4919 | 67.9% |
 * | 4096 | 0.8131 | 82.5995 | 0.7872 | 85.3091 | 96.8% |
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
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2670 | 57.6% |
 * | 64 | 0.0063 | 2.7347 | 0.0036 | 4.7857 | 57.1% |
 * | 128 | 0.0065 | 10.3251 | 0.0037 | 18.2261 | 56.7% |
 * | 256 | 0.0079 | 33.6227 | 0.0041 | 64.7500 | 51.9% |
 * | 512 | 0.0097 | 108.2430 | 0.0067 | 157.7034 | 68.6% |
 * | 1024 | 0.0346 | 121.4374 | 0.0395 | 106.6148 | 113.9% |
 * | 1280 | 0.0512 | 128.2599 | 0.0604 | 108.6713 | 118.0% |
 * | 2048 | 0.1154 | 145.6062 | 0.1433 | 117.2262 | 124.2% |
 * | 4096 | 0.4483 | 149.7993 | 0.6189 | 108.5154 | 138.0% |
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
 * | 32 | 0.0061 | 0.7292 | 0.0036 | 1.2281 | 59.4% |
 * | 64 | 0.0061 | 2.7917 | 0.0037 | 4.6207 | 60.4% |
 * | 128 | 0.0066 | 10.2244 | 0.0037 | 18.2261 | 56.1% |
 * | 256 | 0.0078 | 34.1773 | 0.0041 | 64.2481 | 53.2% |
 * | 512 | 0.0097 | 108.7789 | 0.0070 | 150.5023 | 72.3% |
 * | 1024 | 0.0585 | 71.9321 | 0.0462 | 91.0991 | 79.0% |
 * | 1280 | 0.0880 | 74.6608 | 0.0695 | 94.5337 | 79.0% |
 * | 2048 | 0.2191 | 76.6953 | 0.1677 | 100.1633 | 76.6% |
 * | 4096 | 0.8149 | 82.4130 | 0.8247 | 81.4313 | 101.2% |
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
 * | 32 | 0.0061 | 0.7292 | 0.0037 | 1.2174 | 59.9% |
 * | 64 | 0.0061 | 2.7917 | 0.0038 | 4.5424 | 61.5% |
 * | 128 | 0.0065 | 10.2745 | 0.0041 | 16.3750 | 62.7% |
 * | 256 | 0.0077 | 34.4615 | 0.0042 | 62.5509 | 55.1% |
 * | 512 | 0.0096 | 109.5017 | 0.0068 | 156.2085 | 70.1% |
 * | 1024 | 0.0348 | 120.7126 | 0.0431 | 97.7005 | 123.6% |
 * | 1280 | 0.0506 | 129.8829 | 0.0593 | 110.7825 | 117.2% |
 * | 2048 | 0.1191 | 141.0493 | 0.1560 | 107.7038 | 131.0% |
 * | 4096 | 0.4440 | 151.2677 | 0.6017 | 111.6145 | 135.5% |
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
 * | 32 | 0.0061 | 0.7292 | 0.0042 | 1.0566 | 69.0% |
 * | 64 | 0.0063 | 2.7347 | 0.0041 | 4.1712 | 65.6% |
 * | 128 | 0.0065 | 10.2745 | 0.0043 | 15.6418 | 65.7% |
 * | 256 | 0.0075 | 35.2681 | 0.0044 | 59.6259 | 59.1% |
 * | 512 | 0.0100 | 105.3035 | 0.0070 | 149.8182 | 70.3% |
 * | 1024 | 0.0346 | 121.4374 | 0.0428 | 98.3952 | 123.4% |
 * | 1280 | 0.0512 | 128.3000 | 0.0630 | 104.2560 | 123.1% |
 * | 2048 | 0.1188 | 141.4483 | 0.1909 | 87.9933 | 160.7% |
 * | 4096 | 0.4873 | 137.8268 | 0.6371 | 105.4061 | 130.8% |
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
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 0.6061 | 0.0043 | 1.0448 | 58.0% |
 * | 64 | 0.0077 | 2.2149 | 0.0040 | 4.2709 | 51.9% |
 * | 128 | 0.0079 | 8.4858 | 0.0041 | 16.3750 | 51.8% |
 * | 256 | 0.0093 | 28.5301 | 0.0047 | 56.7671 | 50.3% |
 * | 512 | 0.0120 | 88.2463 | 0.0076 | 137.9080 | 64.0% |
 * | 1024 | 0.0368 | 114.3096 | 0.0328 | 128.0623 | 89.3% |
 * | 1280 | 0.0544 | 120.8596 | 0.0680 | 96.5796 | 125.1% |
 * | 2048 | 0.1204 | 139.5869 | 0.1267 | 132.6569 | 105.2% |
 * | 4096 | 0.4451 | 150.8871 | 0.4814 | 139.5172 | 108.1% |
 *
 * ![ssyr2-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alphaneg3p75.svg)
 *
 * ![ssyr2-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0014 | 3.1111 | 23.4% |
 * | 64 | 0.0061 | 2.7917 | 0.0015 | 11.2842 | 24.7% |
 * | 128 | 0.0064 | 10.5327 | 0.0016 | 41.9200 | 25.1% |
 * | 256 | 0.0075 | 35.1932 | 0.0015 | 178.2365 | 19.7% |
 * | 512 | 0.0096 | 109.8667 | 0.0014 | 749.0909 | 14.7% |
 * | 1024 | 0.0334 | 126.0364 | 0.0018 | 2390.1091 | 5.3% |
 * | 1280 | 0.0512 | 128.3000 | 0.0015 | 4276.6665 | 3.0% |
 * | 2048 | 0.1149 | 146.2144 | 0.0014 | 11799.0098 | 1.2% |
 * | 4096 | 0.4342 | 154.6849 | 0.0017 | 38508.0352 | 0.4% |
 *
 * ![ssyr2-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha0.svg)
 *
 * ![ssyr2-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5983 | 0.0044 | 1.0182 | 58.8% |
 * | 64 | 0.0077 | 2.2333 | 0.0040 | 4.2880 | 52.1% |
 * | 128 | 0.0081 | 8.2358 | 0.0041 | 16.3750 | 50.3% |
 * | 256 | 0.0093 | 28.5301 | 0.0049 | 53.6440 | 53.2% |
 * | 512 | 0.0118 | 89.0811 | 0.0076 | 139.3658 | 63.9% |
 * | 1024 | 0.0369 | 114.1111 | 0.0328 | 128.3750 | 88.9% |
 * | 1280 | 0.0545 | 120.4695 | 0.0678 | 96.9445 | 124.3% |
 * | 2048 | 0.1204 | 139.4942 | 0.1259 | 133.4832 | 104.5% |
 * | 4096 | 0.5176 | 129.7449 | 0.4813 | 139.5404 | 93.0% |
 *
 * ![ssyr2-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha1eneg38.svg)
 *
 * ![ssyr2-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0051 | 0.8723 | 83.6% |
 * | 64 | 0.0061 | 2.7917 | 0.0045 | 3.8286 | 72.9% |
 * | 128 | 0.0064 | 10.5592 | 0.0045 | 14.9714 | 70.5% |
 * | 256 | 0.0077 | 34.5333 | 0.0052 | 50.8466 | 67.9% |
 * | 512 | 0.0096 | 109.8667 | 0.0083 | 127.0135 | 86.5% |
 * | 1024 | 0.0334 | 126.0969 | 0.0328 | 128.3750 | 98.2% |
 * | 1280 | 0.0512 | 128.3000 | 0.0678 | 96.8302 | 132.5% |
 * | 2048 | 0.1149 | 146.2552 | 0.1270 | 132.3226 | 110.5% |
 * | 4096 | 0.4404 | 152.4766 | 0.4813 | 139.5404 | 109.3% |
 *
 * ![ssyr2-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha1.svg)
 *
 * ![ssyr2-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5945 | 0.0044 | 1.0256 | 58.0% |
 * | 64 | 0.0077 | 2.2380 | 0.0041 | 4.1875 | 53.4% |
 * | 128 | 0.0079 | 8.4516 | 0.0041 | 16.3750 | 51.6% |
 * | 256 | 0.0092 | 28.8278 | 0.0045 | 58.3662 | 49.4% |
 * | 512 | 0.0120 | 87.8933 | 0.0072 | 145.5188 | 60.4% |
 * | 1024 | 0.0367 | 114.7586 | 0.0327 | 128.5005 | 89.3% |
 * | 1280 | 0.0540 | 121.5394 | 0.0678 | 96.8302 | 125.5% |
 * | 2048 | 0.1203 | 139.7169 | 0.1269 | 132.4227 | 105.5% |
 * | 4096 | 0.4447 | 151.0228 | 0.4813 | 139.5404 | 108.2% |
 *
 * ![ssyr2-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha2p5.svg)
 *
 * ![ssyr2-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/alpha.ssyr2.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/alpha.ssyr2.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0076 | 0.5858 |
 * | 64 | 0.0079 | 2.1789 |
 * | 128 | 0.0079 | 8.4516 |
 * | 256 | 0.0085 | 31.0994 |
 * | 512 | 0.0122 | 86.6229 |
 * | 1024 | 0.0576 | 72.9906 |
 * | 1280 | 0.0942 | 69.7283 |
 * | 2048 | 0.2259 | 74.3916 |
 * | 4096 | 0.8418 | 79.7753 |
 *
 * ![ssyr2-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-layoutcolumnmajor.svg)
 *
 * ![ssyr2-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0076 | 0.5858 |
 * | 64 | 0.0078 | 2.2058 |
 * | 128 | 0.0080 | 8.4346 |
 * | 256 | 0.0092 | 28.6782 |
 * | 512 | 0.0120 | 87.5432 |
 * | 1024 | 0.0369 | 114.1111 |
 * | 1280 | 0.0541 | 121.3956 |
 * | 2048 | 0.1206 | 139.3461 |
 * | 4096 | 0.4461 | 150.5569 |
 *
 * ![ssyr2-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-layoutrowmajor.svg)
 *
 * ![ssyr2-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/layout.ssyr2.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2
 */
