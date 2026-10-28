/**
 * Benchmark results for dsyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 1.2389 | 0.0045 | 2.0000 | 61.9% |
 * | 64 | 0.0075 | 4.6009 | 0.0047 | 7.3425 | 62.7% |
 * | 128 | 0.0083 | 16.1231 | 0.0056 | 24.0920 | 66.9% |
 * | 256 | 0.0123 | 43.1667 | 0.0082 | 64.7500 | 66.7% |
 * | 512 | 0.0274 | 77.0544 | 0.0179 | 117.7143 | 65.5% |
 * | 1024 | 0.0773 | 108.7762 | 0.0547 | 153.7497 | 70.7% |
 * | 1280 | 0.1161 | 113.1331 | 0.0873 | 150.4985 | 75.2% |
 * | 2048 | 0.2678 | 125.4839 | 0.2028 | 165.7243 | 75.7% |
 * | 4096 | 1.0565 | 127.1354 | 0.8118 | 165.4464 | 76.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dsyr2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-default.svg)
 *
 * ![dsyr2-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-default.svg)
 *
 * ## See also
 *
 * - [dsyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/wgblas/dsyr2.js) — WebGPU benchmark script
 * - [dsyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/cuda/dsyr2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0072 | 1.2500 | 0.0045 | 1.9858 | 62.9% |
 * | 64 | 0.0076 | 4.5328 | 0.0047 | 7.2925 | 62.2% |
 * | 128 | 0.0086 | 15.6127 | 0.0058 | 23.2889 | 67.0% |
 * | 256 | 0.0146 | 36.4308 | 0.0082 | 64.4980 | 56.5% |
 * | 512 | 0.0331 | 63.7524 | 0.0180 | 116.9831 | 54.5% |
 * | 1024 | 0.0969 | 86.7840 | 0.0547 | 153.7497 | 56.4% |
 * | 1280 | 0.1432 | 91.7658 | 0.0877 | 149.7574 | 61.3% |
 * | 2048 | 0.2818 | 119.2293 | 0.2042 | 164.5815 | 72.4% |
 * | 4096 | 1.0260 | 130.9123 | 0.8442 | 159.1060 | 82.3% |
 *
 * ![dsyr2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-stride4.svg)
 *
 * ![dsyr2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 1.1814 | 0.0046 | 1.9649 | 60.1% |
 * | 64 | 0.0076 | 4.4948 | 0.0047 | 7.2432 | 62.1% |
 * | 128 | 0.0085 | 15.7004 | 0.0057 | 23.3538 | 67.2% |
 * | 256 | 0.0141 | 37.5873 | 0.0083 | 64.0000 | 58.7% |
 * | 512 | 0.0299 | 70.6160 | 0.0182 | 115.9543 | 60.9% |
 * | 1024 | 0.0858 | 98.0466 | 0.0549 | 153.1675 | 64.0% |
 * | 1280 | 0.1252 | 104.9355 | 0.0879 | 149.4848 | 70.2% |
 * | 2048 | 0.2816 | 119.3309 | 0.2044 | 164.4268 | 72.6% |
 * | 4096 | 1.0301 | 130.3857 | 0.8622 | 155.7815 | 83.7% |
 *
 * ![dsyr2-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-stride5.svg)
 *
 * ![dsyr2-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 1.1789 | 0.0046 | 1.9649 | 60.0% |
 * | 64 | 0.0081 | 4.2372 | 0.0047 | 7.2432 | 58.5% |
 * | 128 | 0.0114 | 11.7753 | 0.0057 | 23.5506 | 50.0% |
 * | 256 | 0.0266 | 19.9591 | 0.0084 | 63.5096 | 31.4% |
 * | 512 | 0.0754 | 27.9737 | 0.0184 | 114.4444 | 24.4% |
 * | 1024 | 0.0942 | 89.2740 | 0.0565 | 148.9586 | 59.9% |
 * | 1280 | 0.1270 | 103.4677 | 0.0942 | 139.5039 | 74.2% |
 * | 2048 | 0.2854 | 117.7454 | 0.2233 | 150.4997 | 78.2% |
 * | 4096 | 1.0320 | 130.1552 | 1.0348 | 129.8030 | 100.3% |
 *
 * ![dsyr2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-stride32.svg)
 *
 * ![dsyr2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 1.1523 | 0.0044 | 2.0290 | 56.8% |
 * | 64 | 0.0078 | 4.3755 | 0.0047 | 7.3425 | 59.6% |
 * | 128 | 0.0091 | 14.7866 | 0.0057 | 23.6836 | 62.4% |
 * | 256 | 0.0159 | 33.2851 | 0.0082 | 64.6238 | 51.5% |
 * | 512 | 0.0471 | 44.7826 | 0.0181 | 116.4664 | 38.5% |
 * | 1024 | 0.0948 | 88.7766 | 0.0562 | 149.8074 | 59.3% |
 * | 1280 | 0.1271 | 103.4026 | 0.0960 | 136.8761 | 75.5% |
 * | 2048 | 0.2848 | 117.9702 | 0.2272 | 147.9031 | 79.8% |
 * | 4096 | 1.0353 | 129.7409 | 1.0383 | 129.3670 | 100.3% |
 *
 * ![dsyr2-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-stride33.svg)
 *
 * ![dsyr2-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 1.1966 | 0.0045 | 1.9718 | 60.7% |
 * | 64 | 0.0076 | 4.4948 | 0.0047 | 7.3425 | 61.2% |
 * | 128 | 0.0090 | 14.8652 | 0.0057 | 23.4846 | 63.3% |
 * | 256 | 0.0158 | 33.6569 | 0.0083 | 64.2481 | 52.4% |
 * | 512 | 0.0472 | 44.6612 | 0.0183 | 115.0436 | 38.8% |
 * | 1024 | 0.0961 | 87.5644 | 0.0561 | 149.9783 | 58.4% |
 * | 1280 | 0.1294 | 101.5232 | 0.0963 | 136.4894 | 74.4% |
 * | 2048 | 0.2872 | 117.0041 | 0.2271 | 147.9656 | 79.1% |
 * | 4096 | 1.0387 | 129.3072 | 1.1121 | 120.7791 | 107.1% |
 *
 * ![dsyr2-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-stride255.svg)
 *
 * ![dsyr2-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 1.1499 | 0.0045 | 1.9718 | 58.3% |
 * | 64 | 0.0081 | 4.2372 | 0.0047 | 7.3174 | 57.9% |
 * | 128 | 0.0117 | 11.4536 | 0.0057 | 23.5506 | 48.6% |
 * | 256 | 0.0266 | 19.9231 | 0.0083 | 64.0000 | 31.1% |
 * | 512 | 0.0758 | 27.8378 | 0.0184 | 114.4444 | 24.3% |
 * | 1024 | 0.0963 | 87.4043 | 0.0563 | 149.3394 | 58.5% |
 * | 1280 | 0.1291 | 101.7623 | 0.0955 | 137.5410 | 74.0% |
 * | 2048 | 0.2868 | 117.1804 | 0.2245 | 149.6739 | 78.3% |
 * | 4096 | 1.0413 | 128.9873 | 1.0901 | 123.2185 | 104.7% |
 *
 * ![dsyr2-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-stride256.svg)
 *
 * ![dsyr2-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dsyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/wgblas/stride.dsyr2.js) — WebGPU stride-sweep benchmark script
 * - [stride.dsyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/cuda/stride.dsyr2.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0075 | 1.1915 | 0.0044 | 2.0144 | 59.1% |
 * | 64 | 0.0074 | 4.6609 | 0.0046 | 7.3931 | 63.0% |
 * | 128 | 0.0085 | 15.8189 | 0.0057 | 23.6836 | 66.8% |
 * | 256 | 0.0135 | 39.2331 | 0.0082 | 64.7500 | 60.6% |
 * | 512 | 0.0293 | 71.9258 | 0.0180 | 117.2954 | 61.3% |
 * | 1024 | 0.0803 | 104.7250 | 0.0544 | 154.5178 | 67.8% |
 * | 1280 | 0.1167 | 112.5439 | 0.0873 | 150.4709 | 74.8% |
 * | 2048 | 0.2727 | 123.2309 | 0.2029 | 165.6459 | 74.4% |
 * | 4096 | 1.0445 | 128.5961 | 0.8123 | 165.3584 | 77.8% |
 *
 * ![dsyr2-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-uplolower.svg)
 *
 * ![dsyr2-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 1.1966 | 0.0044 | 2.0144 | 59.4% |
 * | 64 | 0.0076 | 4.5328 | 0.0047 | 7.2432 | 62.6% |
 * | 128 | 0.0082 | 16.3750 | 0.0056 | 23.8182 | 68.7% |
 * | 256 | 0.0123 | 43.1667 | 0.0082 | 65.0039 | 66.4% |
 * | 512 | 0.0274 | 76.9644 | 0.0180 | 117.1911 | 65.7% |
 * | 1024 | 0.0774 | 108.6413 | 0.0553 | 152.1922 | 71.4% |
 * | 1280 | 0.1162 | 113.0708 | 0.0885 | 148.4041 | 76.2% |
 * | 2048 | 0.2674 | 125.6867 | 0.2034 | 165.2159 | 76.1% |
 * | 4096 | 1.0584 | 126.9067 | 0.8131 | 165.1990 | 76.8% |
 *
 * ![dsyr2-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-uploupper.svg)
 *
 * ![dsyr2-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dsyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/wgblas/uplo.dsyr2.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dsyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/cuda/uplo.dsyr2.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0073 | 1.2281 | 0.0045 | 1.9718 | 62.3% |
 * | 64 | 0.0074 | 4.6407 | 0.0047 | 7.3677 | 63.0% |
 * | 128 | 0.0085 | 15.8488 | 0.0055 | 24.3014 | 65.2% |
 * | 256 | 0.0135 | 39.4197 | 0.0082 | 64.7500 | 60.9% |
 * | 512 | 0.0292 | 72.2015 | 0.0177 | 119.3122 | 60.5% |
 * | 1024 | 0.0801 | 105.0807 | 0.0547 | 153.7497 | 68.3% |
 * | 1280 | 0.1168 | 112.5284 | 0.0876 | 150.0311 | 75.0% |
 * | 2048 | 0.2726 | 123.2888 | 0.2028 | 165.7374 | 74.4% |
 * | 4096 | 1.0393 | 129.2335 | 0.8121 | 165.3943 | 78.1% |
 *
 * ![dsyr2-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad0.svg)
 *
 * ![dsyr2-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0077 | 1.1667 | 0.0045 | 2.0000 | 58.3% |
 * | 64 | 0.0075 | 4.5910 | 0.0047 | 7.3174 | 62.7% |
 * | 128 | 0.0085 | 15.8488 | 0.0056 | 23.8182 | 66.5% |
 * | 256 | 0.0136 | 39.0943 | 0.0082 | 64.7500 | 60.4% |
 * | 512 | 0.0295 | 71.4967 | 0.0181 | 116.4664 | 61.4% |
 * | 1024 | 0.0818 | 102.8607 | 0.0672 | 125.1962 | 82.2% |
 * | 1280 | 0.1188 | 110.6034 | 0.1281 | 102.5631 | 107.8% |
 * | 2048 | 0.2783 | 120.7580 | 0.2680 | 125.4090 | 96.3% |
 *
 * ![dsyr2-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad1.svg)
 *
 * ![dsyr2-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 1.2613 | 0.0045 | 1.9858 | 63.5% |
 * | 64 | 0.0073 | 4.6710 | 0.0046 | 7.3931 | 63.2% |
 * | 128 | 0.0083 | 16.1231 | 0.0056 | 23.8182 | 67.7% |
 * | 256 | 0.0136 | 39.0024 | 0.0082 | 64.7500 | 60.2% |
 * | 512 | 0.0292 | 72.3204 | 0.0182 | 116.0563 | 62.3% |
 * | 1024 | 0.0816 | 103.0825 | 0.0622 | 135.3124 | 76.2% |
 * | 1280 | 0.1194 | 110.0107 | 0.1149 | 114.3143 | 96.2% |
 * | 2048 | 0.2765 | 121.5407 | 0.2876 | 116.8479 | 104.0% |
 *
 * ![dsyr2-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad8.svg)
 *
 * ![dsyr2-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 1.2148 | 0.0045 | 1.9858 | 61.2% |
 * | 64 | 0.0073 | 4.6915 | 0.0047 | 7.3677 | 63.7% |
 * | 128 | 0.0085 | 15.8189 | 0.0056 | 24.0920 | 65.7% |
 * | 256 | 0.0135 | 39.2796 | 0.0082 | 64.7500 | 60.7% |
 * | 512 | 0.0291 | 72.5592 | 0.0177 | 119.4203 | 60.8% |
 * | 1024 | 0.0813 | 103.5087 | 0.0587 | 143.4326 | 72.2% |
 * | 1280 | 0.1191 | 110.3359 | 0.1094 | 120.0468 | 91.9% |
 * | 2048 | 0.2795 | 120.2395 | 0.2577 | 130.3839 | 92.2% |
 *
 * ![dsyr2-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad16.svg)
 *
 * ![dsyr2-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 1.2698 | 0.0045 | 1.9858 | 63.9% |
 * | 64 | 0.0075 | 4.5520 | 0.0046 | 7.4187 | 61.4% |
 * | 128 | 0.0085 | 15.7891 | 0.0056 | 24.0920 | 65.5% |
 * | 256 | 0.0136 | 39.0024 | 0.0082 | 64.7500 | 60.2% |
 * | 512 | 0.0287 | 73.5714 | 0.0175 | 120.2920 | 61.2% |
 * | 1024 | 0.0804 | 104.6416 | 0.0553 | 152.1481 | 68.8% |
 * | 1280 | 0.1246 | 105.4611 | 0.0858 | 153.1369 | 68.9% |
 * | 2048 | 0.2873 | 116.9715 | 0.2188 | 153.5588 | 76.2% |
 *
 * ![dsyr2-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad32.svg)
 *
 * ![dsyr2-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 1.1789 | 0.0045 | 1.9788 | 59.6% |
 * | 64 | 0.0078 | 4.3755 | 0.0047 | 7.3425 | 59.6% |
 * | 128 | 0.0089 | 15.0521 | 0.0057 | 23.5506 | 63.9% |
 * | 256 | 0.0145 | 36.6320 | 0.0082 | 64.6238 | 56.7% |
 * | 512 | 0.0319 | 66.1515 | 0.0177 | 118.9892 | 55.6% |
 * | 1024 | 0.0885 | 95.0513 | 0.0651 | 129.3222 | 73.5% |
 * | 1280 | 0.1292 | 101.6993 | 0.1086 | 120.9664 | 84.1% |
 * | 2048 | 0.3087 | 108.8481 | 0.2744 | 122.4478 | 88.9% |
 *
 * ![dsyr2-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad48.svg)
 *
 * ![dsyr2-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0938 | 0.0044 | 2.0290 | 53.9% |
 * | 64 | 0.0077 | 4.4667 | 0.0047 | 7.3677 | 60.6% |
 * | 128 | 0.0085 | 15.7891 | 0.0056 | 23.8182 | 66.3% |
 * | 256 | 0.0135 | 39.3262 | 0.0082 | 65.0039 | 60.5% |
 * | 512 | 0.0293 | 72.0831 | 0.0175 | 120.4018 | 59.9% |
 * | 1024 | 0.0803 | 104.8293 | 0.0603 | 139.5499 | 75.1% |
 * | 1280 | 0.1168 | 112.4668 | 0.0872 | 150.7472 | 74.6% |
 * | 2048 | 0.2735 | 122.8632 | 0.2140 | 157.0143 | 78.2% |
 *
 * ![dsyr2-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad64.svg)
 *
 * ![dsyr2-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 1.2069 | 0.0046 | 1.9580 | 61.6% |
 * | 64 | 0.0078 | 4.3934 | 0.0047 | 7.2925 | 60.2% |
 * | 128 | 0.0085 | 15.7594 | 0.0056 | 23.8182 | 66.2% |
 * | 256 | 0.0135 | 39.2796 | 0.0082 | 64.7500 | 60.7% |
 * | 512 | 0.0289 | 73.0011 | 0.0176 | 119.9636 | 60.9% |
 * | 1024 | 0.0799 | 105.2911 | 0.0576 | 146.0217 | 72.1% |
 * | 1280 | 0.1168 | 112.4822 | 0.0888 | 148.0296 | 76.0% |
 * | 2048 | 0.2744 | 122.4478 | 0.2402 | 139.8844 | 87.5% |
 *
 * ![dsyr2-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-pad128.svg)
 *
 * ![dsyr2-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dsyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/wgblas/lda.dsyr2.js) — WebGPU lda-sweep benchmark script
 * - [lda.dsyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/cuda/lda.dsyr2.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0073 | 1.2200 | 0.0046 | 1.9649 | 62.1% |
 * | 64 | 0.0075 | 4.5812 | 0.0047 | 7.2925 | 62.8% |
 * | 128 | 0.0083 | 16.0921 | 0.0056 | 23.9543 | 67.2% |
 * | 256 | 0.0134 | 39.6555 | 0.0082 | 64.7500 | 61.2% |
 * | 512 | 0.0292 | 72.2015 | 0.0181 | 116.3636 | 62.0% |
 * | 1024 | 0.0804 | 104.6208 | 0.0546 | 153.9748 | 67.9% |
 * | 1280 | 0.1167 | 112.5439 | 0.0874 | 150.3057 | 74.9% |
 * | 2048 | 0.2727 | 123.2309 | 0.2028 | 165.7374 | 74.4% |
 * | 4096 | 1.0431 | 128.7618 | 0.8116 | 165.4856 | 77.8% |
 *
 * ![dsyr2-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-alphaneg3p75.svg)
 *
 * ![dsyr2-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0073 | 1.2308 | 0.0015 | 6.0870 | 20.2% |
 * | 64 | 0.0074 | 4.6307 | 0.0015 | 23.3043 | 19.9% |
 * | 128 | 0.0084 | 15.9392 | 0.0015 | 87.3333 | 18.3% |
 * | 256 | 0.0136 | 39.0943 | 0.0016 | 341.7732 | 11.4% |
 * | 512 | 0.0293 | 72.0831 | 0.0014 | 1481.3483 | 4.9% |
 * | 1024 | 0.0802 | 104.8712 | 0.0014 | 6043.9541 | 1.7% |
 * | 1280 | 0.1169 | 112.3591 | 0.0015 | 8829.2471 | 1.3% |
 * | 2048 | 0.2726 | 123.2671 | 0.0015 | 22828.5215 | 0.5% |
 * | 4096 | 1.0185 | 131.8727 | 0.0015 | 91247.2969 | 0.1% |
 *
 * ![dsyr2-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-alpha0.svg)
 *
 * ![dsyr2-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 1.2069 | 0.0045 | 1.9718 | 61.2% |
 * | 64 | 0.0076 | 4.5232 | 0.0047 | 7.3677 | 61.4% |
 * | 128 | 0.0084 | 15.9089 | 0.0056 | 23.7507 | 67.0% |
 * | 256 | 0.0135 | 39.1868 | 0.0082 | 64.7500 | 60.5% |
 * | 512 | 0.0290 | 72.6391 | 0.0180 | 117.5044 | 61.8% |
 * | 1024 | 0.0801 | 104.9968 | 0.0546 | 154.1554 | 68.1% |
 * | 1280 | 0.1167 | 112.5439 | 0.0874 | 150.3332 | 74.9% |
 * | 2048 | 0.2728 | 123.1731 | 0.2028 | 165.7374 | 74.3% |
 * | 4096 | 1.0185 | 131.8706 | 0.8119 | 165.4268 | 79.7% |
 *
 * ![dsyr2-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-alpha1eneg38.svg)
 *
 * ![dsyr2-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0073 | 1.2308 | 0.0045 | 1.9858 | 62.0% |
 * | 64 | 0.0074 | 4.6108 | 0.0046 | 7.3931 | 62.4% |
 * | 128 | 0.0084 | 15.8788 | 0.0056 | 24.1614 | 65.7% |
 * | 256 | 0.0136 | 38.9108 | 0.0082 | 64.7500 | 60.1% |
 * | 512 | 0.0292 | 72.1620 | 0.0180 | 117.5044 | 61.4% |
 * | 1024 | 0.0804 | 104.6208 | 0.0545 | 154.3364 | 67.8% |
 * | 1280 | 0.1167 | 112.5439 | 0.0873 | 150.4985 | 74.8% |
 * | 2048 | 0.2727 | 123.2381 | 0.2028 | 165.7112 | 74.4% |
 * | 4096 | 1.0413 | 128.9873 | 0.8119 | 165.4366 | 78.0% |
 *
 * ![dsyr2-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-alpha1.svg)
 *
 * ![dsyr2-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 1.2174 | 0.0044 | 2.0144 | 60.4% |
 * | 64 | 0.0075 | 4.5520 | 0.0047 | 7.3425 | 62.0% |
 * | 128 | 0.0085 | 15.8189 | 0.0056 | 24.0229 | 65.8% |
 * | 256 | 0.0136 | 39.0483 | 0.0082 | 64.7500 | 60.3% |
 * | 512 | 0.0292 | 72.1620 | 0.0180 | 117.3998 | 61.5% |
 * | 1024 | 0.0808 | 104.1236 | 0.0546 | 154.2006 | 67.5% |
 * | 1280 | 0.1167 | 112.5439 | 0.0875 | 150.1957 | 74.9% |
 * | 2048 | 0.2726 | 123.2815 | 0.2028 | 165.7112 | 74.4% |
 * | 4096 | 1.0425 | 128.8349 | 0.8113 | 165.5476 | 77.8% |
 *
 * ![dsyr2-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-alpha2p5.svg)
 *
 * ![dsyr2-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dsyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/wgblas/alpha.dsyr2.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dsyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/cuda/alpha.dsyr2.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0076 | 1.1839 |
 * | 64 | 0.0076 | 4.5137 |
 * | 128 | 0.0083 | 16.1231 |
 * | 256 | 0.0123 | 43.1667 |
 * | 512 | 0.0273 | 77.3709 |
 * | 1024 | 0.0778 | 108.1053 |
 * | 1280 | 0.1163 | 112.9464 |
 * | 2048 | 0.2680 | 125.4015 |
 * | 4096 | 1.0547 | 127.3534 |
 *
 * ![dsyr2-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-layoutcolumnmajor.svg)
 *
 * ![dsyr2-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0072 | 1.2417 |
 * | 64 | 0.0074 | 4.6207 |
 * | 128 | 0.0084 | 15.8788 |
 * | 256 | 0.0137 | 38.6838 |
 * | 512 | 0.0292 | 72.2015 |
 * | 1024 | 0.0801 | 104.9968 |
 * | 1280 | 0.1167 | 112.5439 |
 * | 2048 | 0.2727 | 123.2309 |
 * | 4096 | 1.0427 | 128.8210 |
 *
 * ![dsyr2-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/gbps-layoutrowmajor.svg)
 *
 * ![dsyr2-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr2/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dsyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr2/wgblas/layout.dsyr2.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dsyr2
 */
