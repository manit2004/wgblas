/**
 * Benchmark results for dsyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3268 | 0.0036 | 2.4071 | 55.1% |
 * | 64 | 0.0068 | 4.9577 | 0.0036 | 9.2632 | 53.5% |
 * | 128 | 0.0076 | 17.6271 | 0.0041 | 32.1236 | 54.9% |
 * | 256 | 0.0098 | 53.7850 | 0.0057 | 92.7640 | 58.0% |
 * | 512 | 0.0194 | 108.2996 | 0.0129 | 163.0533 | 66.4% |
 * | 1024 | 0.0610 | 137.6965 | 0.0531 | 158.4174 | 86.9% |
 * | 1280 | 0.1013 | 129.6382 | 0.0880 | 149.2325 | 86.9% |
 * | 2048 | 0.2269 | 147.9977 | 0.2007 | 167.3469 | 88.4% |
 * | 4096 | 0.8499 | 157.9952 | 0.8176 | 164.2311 | 96.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dsyr-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-default.svg)
 *
 * ![dsyr-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-default.svg)
 *
 * ## See also
 *
 * - [dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/dsyr.js) — WebGPU benchmark script
 * - [dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/dsyr.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0067 | 1.3077 | 0.0037 | 2.3448 | 55.8% |
 * | 64 | 0.0068 | 4.9694 | 0.0037 | 9.1826 | 54.1% |
 * | 128 | 0.0077 | 17.1901 | 0.0041 | 32.1236 | 53.5% |
 * | 256 | 0.0107 | 49.5856 | 0.0058 | 90.4767 | 54.8% |
 * | 512 | 0.0237 | 88.8481 | 0.0129 | 162.8515 | 54.6% |
 * | 1024 | 0.0642 | 130.9352 | 0.0532 | 158.0361 | 82.9% |
 * | 1280 | 0.0966 | 135.9536 | 0.0880 | 149.1782 | 91.1% |
 * | 2048 | 0.2221 | 151.2283 | 0.2010 | 167.1338 | 90.5% |
 * | 4096 | 0.8335 | 161.1038 | 0.8251 | 162.7565 | 99.0% |
 *
 * ![dsyr-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride4.svg)
 *
 * ![dsyr-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 1.2770 | 0.0036 | 2.3860 | 53.5% |
 * | 64 | 0.0070 | 4.8219 | 0.0037 | 9.1826 | 52.5% |
 * | 128 | 0.0079 | 16.9106 | 0.0042 | 32.0000 | 52.8% |
 * | 256 | 0.0102 | 51.6000 | 0.0058 | 91.7333 | 56.3% |
 * | 512 | 0.0217 | 96.8241 | 0.0130 | 162.0493 | 59.7% |
 * | 1024 | 0.0635 | 132.4205 | 0.0532 | 158.0361 | 83.8% |
 * | 1280 | 0.0960 | 136.7923 | 0.0879 | 149.2868 | 91.6% |
 * | 2048 | 0.2230 | 150.6098 | 0.2011 | 167.0141 | 90.2% |
 * | 4096 | 0.8352 | 160.7705 | 0.8289 | 161.9932 | 99.2% |
 *
 * ![dsyr-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride5.svg)
 *
 * ![dsyr-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 1.2861 | 0.0037 | 2.3755 | 54.1% |
 * | 64 | 0.0072 | 4.7038 | 0.0036 | 9.2632 | 50.8% |
 * | 128 | 0.0090 | 14.7780 | 0.0042 | 32.0000 | 46.2% |
 * | 256 | 0.0177 | 29.9130 | 0.0058 | 90.9752 | 32.9% |
 * | 512 | 0.0435 | 48.3765 | 0.0137 | 153.7196 | 31.5% |
 * | 1024 | 0.0695 | 120.9282 | 0.0532 | 157.8936 | 76.6% |
 * | 1280 | 0.0986 | 133.1516 | 0.0921 | 142.5187 | 93.4% |
 * | 2048 | 0.2237 | 150.1574 | 0.2046 | 164.1796 | 91.5% |
 * | 4096 | 0.8373 | 160.3742 | 0.9235 | 145.4062 | 110.3% |
 *
 * ![dsyr-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride32.svg)
 *
 * ![dsyr-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.2952 | 0.0037 | 2.3755 | 54.5% |
 * | 64 | 0.0067 | 5.0286 | 0.0037 | 9.1826 | 54.8% |
 * | 128 | 0.0080 | 16.6068 | 0.0042 | 32.0000 | 51.9% |
 * | 256 | 0.0112 | 47.1098 | 0.0058 | 91.4792 | 51.5% |
 * | 512 | 0.0267 | 78.9820 | 0.0138 | 152.1202 | 51.9% |
 * | 1024 | 0.0693 | 121.2352 | 0.0532 | 157.8461 | 76.8% |
 * | 1280 | 0.0987 | 133.0220 | 0.0927 | 141.5841 | 94.0% |
 * | 2048 | 0.2240 | 149.9536 | 0.2054 | 163.5018 | 91.7% |
 * | 4096 | 0.8378 | 160.2854 | 0.9372 | 143.2838 | 111.9% |
 *
 * ![dsyr-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride33.svg)
 *
 * ![dsyr-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 1.2891 | 0.0037 | 2.3448 | 55.0% |
 * | 64 | 0.0070 | 4.8109 | 0.0037 | 9.1429 | 52.6% |
 * | 128 | 0.0079 | 16.7742 | 0.0041 | 32.2481 | 52.0% |
 * | 256 | 0.0114 | 46.1874 | 0.0058 | 91.4792 | 50.5% |
 * | 512 | 0.0270 | 77.8604 | 0.0139 | 151.0723 | 51.5% |
 * | 1024 | 0.0696 | 120.7059 | 0.0532 | 157.8461 | 76.5% |
 * | 1280 | 0.0996 | 131.8040 | 0.0924 | 142.0499 | 92.8% |
 * | 2048 | 0.2236 | 150.2433 | 0.2050 | 163.8336 | 91.7% |
 * | 4096 | 0.8401 | 159.8428 | 0.9492 | 141.4675 | 113.0% |
 *
 * ![dsyr-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride255.svg)
 *
 * ![dsyr-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 1.2308 | 0.0036 | 2.3860 | 51.6% |
 * | 64 | 0.0076 | 4.4463 | 0.0036 | 9.4286 | 47.2% |
 * | 128 | 0.0091 | 14.6479 | 0.0042 | 32.0000 | 45.8% |
 * | 256 | 0.0174 | 30.4088 | 0.0058 | 90.7253 | 33.5% |
 * | 512 | 0.0444 | 47.3665 | 0.0139 | 151.9446 | 31.2% |
 * | 1024 | 0.0695 | 120.9282 | 0.0532 | 157.8461 | 76.6% |
 * | 1280 | 0.1004 | 130.8163 | 0.0923 | 142.1976 | 92.0% |
 * | 2048 | 0.2236 | 150.2003 | 0.2046 | 164.1667 | 91.5% |
 * | 4096 | 0.8377 | 160.3038 | 0.9522 | 141.0207 | 113.7% |
 *
 * ![dsyr-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride256.svg)
 *
 * ![dsyr-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/stride.dsyr.js) — WebGPU stride-sweep benchmark script
 * - [stride.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/stride.dsyr.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0067 | 1.3014 | 0.0036 | 2.4286 | 53.6% |
 * | 64 | 0.0068 | 4.9811 | 0.0037 | 9.2227 | 54.0% |
 * | 128 | 0.0077 | 17.3695 | 0.0041 | 32.5000 | 53.4% |
 * | 256 | 0.0102 | 51.9245 | 0.0057 | 92.7640 | 56.0% |
 * | 512 | 0.0212 | 99.3087 | 0.0129 | 163.6617 | 60.7% |
 * | 1024 | 0.0622 | 135.1806 | 0.0530 | 158.5130 | 85.3% |
 * | 1280 | 0.0937 | 140.0615 | 0.0878 | 149.5316 | 93.7% |
 * | 2048 | 0.2172 | 154.6144 | 0.2007 | 167.3469 | 92.4% |
 * | 4096 | 0.8304 | 161.7029 | 0.8178 | 164.2086 | 98.5% |
 *
 * ![dsyr-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-uplolower.svg)
 *
 * ![dsyr-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3172 | 0.0036 | 2.4286 | 54.2% |
 * | 64 | 0.0068 | 4.9346 | 0.0036 | 9.2632 | 53.3% |
 * | 128 | 0.0077 | 17.3695 | 0.0041 | 32.2481 | 53.9% |
 * | 256 | 0.0098 | 53.8728 | 0.0057 | 92.2458 | 58.4% |
 * | 512 | 0.0196 | 107.3279 | 0.0136 | 155.1698 | 69.2% |
 * | 1024 | 0.0612 | 137.2647 | 0.0532 | 157.9411 | 86.9% |
 * | 1280 | 0.1016 | 129.1891 | 0.0881 | 149.0698 | 86.7% |
 * | 2048 | 0.2273 | 147.7477 | 0.2007 | 167.3469 | 88.3% |
 * | 4096 | 0.8507 | 157.8496 | 0.8190 | 163.9584 | 96.3% |
 *
 * ![dsyr-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-uploupper.svg)
 *
 * ![dsyr-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/uplo.dsyr.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/uplo.dsyr.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0068 | 1.2861 | 0.0036 | 2.4071 | 53.4% |
 * | 64 | 0.0068 | 4.9929 | 0.0036 | 9.2632 | 53.9% |
 * | 128 | 0.0076 | 17.4059 | 0.0041 | 32.2481 | 54.0% |
 * | 256 | 0.0102 | 51.6808 | 0.0057 | 92.5042 | 55.9% |
 * | 512 | 0.0212 | 99.3087 | 0.0128 | 164.0698 | 60.5% |
 * | 1024 | 0.0621 | 135.3548 | 0.0531 | 158.3219 | 85.5% |
 * | 1280 | 0.0940 | 139.6799 | 0.0878 | 149.5316 | 93.4% |
 * | 2048 | 0.2174 | 154.5234 | 0.2007 | 167.3469 | 92.3% |
 * | 4096 | 0.8312 | 161.5566 | 0.8174 | 164.2826 | 98.3% |
 *
 * ![dsyr-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad0.svg)
 *
 * ![dsyr-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.3046 | 0.0037 | 2.3652 | 55.2% |
 * | 64 | 0.0068 | 4.9461 | 0.0036 | 9.2632 | 53.4% |
 * | 128 | 0.0077 | 17.3333 | 0.0041 | 32.2481 | 53.7% |
 * | 256 | 0.0102 | 51.6000 | 0.0059 | 90.2295 | 57.2% |
 * | 512 | 0.0217 | 97.1817 | 0.0147 | 143.1817 | 67.9% |
 * | 1024 | 0.0655 | 128.2500 | 0.0645 | 130.3180 | 98.4% |
 * | 1280 | 0.1063 | 123.4733 | 0.1271 | 103.2700 | 119.6% |
 * | 2048 | 0.2355 | 142.6087 | 0.2583 | 130.0458 | 109.7% |
 *
 * ![dsyr-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad1.svg)
 *
 * ![dsyr-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 1.3301 | 0.0036 | 2.3965 | 55.5% |
 * | 64 | 0.0067 | 5.0286 | 0.0037 | 9.1429 | 55.0% |
 * | 128 | 0.0076 | 17.4790 | 0.0041 | 32.5000 | 53.8% |
 * | 256 | 0.0102 | 51.6000 | 0.0057 | 92.7640 | 55.6% |
 * | 512 | 0.0217 | 97.1817 | 0.0160 | 131.3214 | 74.0% |
 * | 1024 | 0.0657 | 127.9065 | 0.0592 | 141.8995 | 90.1% |
 * | 1280 | 0.1065 | 123.2692 | 0.1162 | 113.0138 | 109.1% |
 * | 2048 | 0.2435 | 137.9328 | 0.2846 | 118.0121 | 116.9% |
 *
 * ![dsyr-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad8.svg)
 *
 * ![dsyr-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3268 | 0.0037 | 2.3348 | 56.8% |
 * | 64 | 0.0068 | 4.9346 | 0.0036 | 9.3451 | 52.8% |
 * | 128 | 0.0078 | 17.0842 | 0.0041 | 32.5000 | 52.6% |
 * | 256 | 0.0102 | 51.6000 | 0.0057 | 92.7640 | 55.6% |
 * | 512 | 0.0212 | 99.1590 | 0.0143 | 146.8571 | 67.5% |
 * | 1024 | 0.0655 | 128.2500 | 0.0573 | 146.5714 | 87.5% |
 * | 1280 | 0.1034 | 126.9111 | 0.1101 | 119.2385 | 106.4% |
 * | 2048 | 0.2423 | 138.6434 | 0.2523 | 133.1304 | 104.1% |
 *
 * ![dsyr-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad16.svg)
 *
 * ![dsyr-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 1.1057 | 0.0036 | 2.4286 | 45.5% |
 * | 64 | 0.0079 | 4.3014 | 0.0036 | 9.3867 | 45.8% |
 * | 128 | 0.0087 | 15.2661 | 0.0041 | 32.1236 | 47.5% |
 * | 256 | 0.0118 | 44.7480 | 0.0058 | 91.7333 | 48.8% |
 * | 512 | 0.0236 | 89.3913 | 0.0141 | 148.8507 | 60.1% |
 * | 1024 | 0.0676 | 124.3636 | 0.0537 | 156.4360 | 79.5% |
 * | 1280 | 0.1000 | 131.2768 | 0.0840 | 156.2522 | 84.0% |
 * | 2048 | 0.2273 | 147.7477 | 0.2158 | 155.6346 | 94.9% |
 *
 * ![dsyr-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad32.svg)
 *
 * ![dsyr-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 1.1148 | 0.0037 | 2.3348 | 47.7% |
 * | 64 | 0.0079 | 4.3014 | 0.0036 | 9.3040 | 46.2% |
 * | 128 | 0.0083 | 16.0618 | 0.0041 | 32.5000 | 49.4% |
 * | 256 | 0.0116 | 45.5503 | 0.0056 | 94.8965 | 48.0% |
 * | 512 | 0.0240 | 87.5476 | 0.0161 | 131.0598 | 66.8% |
 * | 1024 | 0.0676 | 124.3931 | 0.0639 | 131.5253 | 94.6% |
 * | 1280 | 0.1010 | 129.9873 | 0.1085 | 120.9791 | 107.4% |
 * | 2048 | 0.2478 | 135.5372 | 0.2689 | 124.9003 | 108.5% |
 *
 * ![dsyr-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad48.svg)
 *
 * ![dsyr-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0077 | 1.1240 | 0.0037 | 2.3755 | 47.3% |
 * | 64 | 0.0077 | 4.4092 | 0.0036 | 9.2632 | 47.6% |
 * | 128 | 0.0082 | 16.2500 | 0.0041 | 32.2481 | 50.4% |
 * | 256 | 0.0108 | 48.7080 | 0.0058 | 91.4792 | 53.2% |
 * | 512 | 0.0227 | 92.6648 | 0.0142 | 148.5147 | 62.4% |
 * | 1024 | 0.0651 | 129.0693 | 0.0599 | 140.2328 | 92.0% |
 * | 1280 | 0.0936 | 140.2051 | 0.0856 | 153.4468 | 91.4% |
 * | 2048 | 0.2253 | 149.0909 | 0.2089 | 160.7843 | 92.7% |
 *
 * ![dsyr-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad64.svg)
 *
 * ![dsyr-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 1.1477 | 0.0037 | 2.3652 | 48.5% |
 * | 64 | 0.0076 | 4.4277 | 0.0036 | 9.3451 | 47.4% |
 * | 128 | 0.0082 | 16.2500 | 0.0041 | 32.1236 | 50.6% |
 * | 256 | 0.0115 | 45.9305 | 0.0058 | 91.2265 | 50.3% |
 * | 512 | 0.0229 | 91.8883 | 0.0147 | 143.6507 | 64.0% |
 * | 1024 | 0.0635 | 132.3871 | 0.0573 | 146.6123 | 90.3% |
 * | 1280 | 0.0944 | 139.0173 | 0.0860 | 152.6190 | 91.1% |
 * | 2048 | 0.2255 | 148.9534 | 0.2401 | 139.9094 | 106.5% |
 *
 * ![dsyr-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad128.svg)
 *
 * ![dsyr-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/lda.dsyr.js) — WebGPU lda-sweep benchmark script
 * - [lda.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/lda.dsyr.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0065 | 1.3333 | 0.0035 | 2.4727 | 53.9% |
 * | 64 | 0.0067 | 5.0286 | 0.0036 | 9.2632 | 54.3% |
 * | 128 | 0.0077 | 17.3333 | 0.0041 | 32.3735 | 53.5% |
 * | 256 | 0.0101 | 52.0883 | 0.0057 | 92.7640 | 56.2% |
 * | 512 | 0.0212 | 99.4588 | 0.0129 | 163.6617 | 60.8% |
 * | 1024 | 0.0622 | 135.2154 | 0.0530 | 158.6566 | 85.2% |
 * | 1280 | 0.0937 | 140.1332 | 0.0877 | 149.6680 | 93.6% |
 * | 2048 | 0.2172 | 154.6600 | 0.2007 | 167.3736 | 92.4% |
 * | 4096 | 0.8294 | 161.8963 | 0.8176 | 164.2311 | 98.6% |
 *
 * ![dsyr-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alphaneg3p75.svg)
 *
 * ![dsyr-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3204 | 0.0015 | 5.9130 | 22.3% |
 * | 64 | 0.0068 | 4.9577 | 0.0015 | 22.4681 | 22.1% |
 * | 128 | 0.0077 | 17.3695 | 0.0016 | 83.2000 | 20.9% |
 * | 256 | 0.0102 | 51.6000 | 0.0016 | 340.4536 | 15.2% |
 * | 512 | 0.0211 | 99.9878 | 0.0014 | 1530.0466 | 6.5% |
 * | 1024 | 0.0621 | 135.3548 | 0.0016 | 5360.3267 | 2.5% |
 * | 1280 | 0.0936 | 140.2051 | 0.0015 | 8918.2607 | 1.6% |
 * | 2048 | 0.2171 | 154.6828 | 0.0016 | 21420.4082 | 0.7% |
 * | 4096 | 0.8294 | 161.8963 | 0.0015 | 91225.0391 | 0.2% |
 *
 * ![dsyr-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha0.svg)
 *
 * ![dsyr-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3140 | 0.0036 | 2.4286 | 54.1% |
 * | 64 | 0.0069 | 4.9116 | 0.0037 | 9.1034 | 54.0% |
 * | 128 | 0.0076 | 17.4423 | 0.0041 | 32.2481 | 54.1% |
 * | 256 | 0.0102 | 51.7618 | 0.0057 | 91.9889 | 56.3% |
 * | 512 | 0.0212 | 99.4588 | 0.0128 | 163.8655 | 60.7% |
 * | 1024 | 0.0619 | 135.7045 | 0.0530 | 158.6566 | 85.5% |
 * | 1280 | 0.0938 | 139.9420 | 0.0879 | 149.3139 | 93.7% |
 * | 2048 | 0.2173 | 154.5916 | 0.2007 | 167.3469 | 92.4% |
 * | 4096 | 0.8315 | 161.4882 | 0.8172 | 164.3147 | 98.3% |
 *
 * ![dsyr-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha1eneg38.svg)
 *
 * ![dsyr-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3204 | 0.0036 | 2.4071 | 54.9% |
 * | 64 | 0.0068 | 4.9929 | 0.0036 | 9.3451 | 53.4% |
 * | 128 | 0.0077 | 17.2973 | 0.0041 | 32.5000 | 53.2% |
 * | 256 | 0.0102 | 51.6000 | 0.0057 | 92.7640 | 55.6% |
 * | 512 | 0.0211 | 99.6094 | 0.0128 | 163.8655 | 60.8% |
 * | 1024 | 0.0617 | 136.1617 | 0.0531 | 158.4174 | 86.0% |
 * | 1280 | 0.0936 | 140.2051 | 0.0879 | 149.3139 | 93.9% |
 * | 2048 | 0.2172 | 154.6372 | 0.2007 | 167.3469 | 92.4% |
 * | 4096 | 0.8294 | 161.8963 | 0.8177 | 164.2183 | 98.6% |
 *
 * ![dsyr-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha1.svg)
 *
 * ![dsyr-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.3014 | 0.0037 | 2.3755 | 54.8% |
 * | 64 | 0.0067 | 5.0166 | 0.0037 | 9.1429 | 54.9% |
 * | 128 | 0.0076 | 17.4790 | 0.0042 | 32.0000 | 54.6% |
 * | 256 | 0.0102 | 51.6000 | 0.0057 | 93.2881 | 55.3% |
 * | 512 | 0.0212 | 99.1590 | 0.0129 | 162.8515 | 60.9% |
 * | 1024 | 0.0620 | 135.6344 | 0.0530 | 158.4651 | 85.6% |
 * | 1280 | 0.0938 | 139.9181 | 0.0879 | 149.2868 | 93.7% |
 * | 2048 | 0.2173 | 154.5575 | 0.2007 | 167.3469 | 92.4% |
 * | 4096 | 0.8282 | 162.1309 | 0.8173 | 164.3051 | 98.7% |
 *
 * ![dsyr-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha2p5.svg)
 *
 * ![dsyr-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/alpha.dsyr.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/alpha.dsyr.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0067 | 1.3014 |
 * | 64 | 0.0067 | 5.0166 |
 * | 128 | 0.0075 | 17.7778 |
 * | 256 | 0.0098 | 54.1377 |
 * | 512 | 0.0198 | 106.2018 |
 * | 1024 | 0.0613 | 137.1572 |
 * | 1280 | 0.1016 | 129.2705 |
 * | 2048 | 0.2273 | 147.7685 |
 * | 4096 | 0.8508 | 157.8347 |
 *
 * ![dsyr-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-layoutcolumnmajor.svg)
 *
 * ![dsyr-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0066 | 1.3204 |
 * | 64 | 0.0068 | 4.9346 |
 * | 128 | 0.0076 | 17.5527 |
 * | 256 | 0.0102 | 51.6000 |
 * | 512 | 0.0211 | 99.9119 |
 * | 1024 | 0.0625 | 134.3853 |
 * | 1280 | 0.0938 | 139.9181 |
 * | 2048 | 0.2171 | 154.7170 |
 * | 4096 | 0.8312 | 161.5628 |
 *
 * ![dsyr-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-layoutrowmajor.svg)
 *
 * ![dsyr-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/layout.dsyr.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dsyr
 */
