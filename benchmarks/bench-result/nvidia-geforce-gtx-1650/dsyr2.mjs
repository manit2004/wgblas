/**
 * Benchmark results for dsyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 1.2148 | 0.0045 | 1.9858 | 61.2% |
 * | 64 | 0.0074 | 4.6609 | 0.0045 | 7.5493 | 61.7% |
 * | 128 | 0.0082 | 16.3750 | 0.0057 | 23.6169 | 69.3% |
 * | 256 | 0.0123 | 43.1667 | 0.0084 | 62.7879 | 68.7% |
 * | 512 | 0.0271 | 77.8736 | 0.0183 | 115.1441 | 67.6% |
 * | 1024 | 0.0773 | 108.8888 | 0.0547 | 153.7048 | 70.8% |
 * | 1280 | 0.1149 | 114.2984 | 0.0873 | 150.4434 | 76.0% |
 * | 2048 | 0.2662 | 126.2154 | 0.2028 | 165.7243 | 76.2% |
 * | 4096 | 1.0280 | 130.6556 | 0.8126 | 165.2933 | 79.0% |
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
 * | 32 | 0.0088 | 1.0219 | 0.0049 | 1.8182 | 56.2% |
 * | 64 | 0.0091 | 3.7880 | 0.0054 | 6.3432 | 59.7% |
 * | 128 | 0.0107 | 12.5886 | 0.0061 | 21.8333 | 57.7% |
 * | 256 | 0.0180 | 29.5209 | 0.0094 | 56.3810 | 52.4% |
 * | 512 | 0.0410 | 51.5000 | 0.0184 | 114.4444 | 45.0% |
 * | 1024 | 0.1208 | 69.6179 | 0.0555 | 151.5780 | 45.9% |
 * | 1280 | 0.1802 | 72.8977 | 0.0895 | 146.7334 | 49.7% |
 * | 2048 | 0.4301 | 78.1246 | 0.2067 | 162.5434 | 48.1% |
 * | 4096 | 1.7221 | 77.9935 | 0.8520 | 157.6509 | 49.5% |
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
 * | 32 | 0.0073 | 1.2335 | 0.0044 | 2.0217 | 61.0% |
 * | 64 | 0.0078 | 4.3934 | 0.0047 | 7.3174 | 60.0% |
 * | 128 | 0.0085 | 15.7594 | 0.0058 | 22.9699 | 68.6% |
 * | 256 | 0.0140 | 37.9748 | 0.0089 | 59.6259 | 63.7% |
 * | 512 | 0.0299 | 70.6538 | 0.0183 | 115.4466 | 61.2% |
 * | 1024 | 0.0854 | 98.5058 | 0.0555 | 151.4906 | 65.0% |
 * | 1280 | 0.1252 | 104.9489 | 0.0899 | 146.0808 | 71.8% |
 * | 2048 | 0.3026 | 111.0466 | 0.2067 | 162.5434 | 68.3% |
 * | 4096 | 1.2959 | 103.6466 | 0.8700 | 154.3777 | 67.1% |
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
 * | 32 | 0.0075 | 1.1966 | 0.0056 | 1.5909 | 75.2% |
 * | 64 | 0.0079 | 4.3226 | 0.0056 | 6.1257 | 70.6% |
 * | 128 | 0.0115 | 11.6444 | 0.0062 | 21.6082 | 53.9% |
 * | 256 | 0.0266 | 19.9231 | 0.0088 | 60.1670 | 33.1% |
 * | 512 | 0.0757 | 27.8790 | 0.0193 | 109.3201 | 25.5% |
 * | 1024 | 0.2662 | 31.6000 | 0.0578 | 145.4964 | 21.7% |
 * | 1280 | 0.4043 | 32.4990 | 0.0981 | 133.9729 | 24.3% |
 * | 2048 | 1.0041 | 33.4654 | 0.2263 | 148.4992 | 22.5% |
 * | 4096 | 5.3321 | 25.1901 | 1.0361 | 129.6366 | 19.4% |
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
 * | 32 | 0.0074 | 1.2095 | 0.0052 | 1.7231 | 70.2% |
 * | 64 | 0.0076 | 4.5232 | 0.0058 | 5.9227 | 76.4% |
 * | 128 | 0.0089 | 15.0791 | 0.0062 | 21.7202 | 69.4% |
 * | 256 | 0.0155 | 34.2126 | 0.0085 | 62.1989 | 55.0% |
 * | 512 | 0.0466 | 45.2903 | 0.0187 | 112.8767 | 40.1% |
 * | 1024 | 0.1802 | 46.6818 | 0.0573 | 146.8782 | 31.8% |
 * | 1280 | 0.2799 | 46.9372 | 0.0983 | 133.6458 | 35.1% |
 * | 2048 | 0.7148 | 47.0080 | 0.2279 | 147.4359 | 31.9% |
 * | 4096 | 4.8842 | 27.5002 | 1.0407 | 129.0646 | 21.3% |
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
 * | 32 | 0.0075 | 1.1991 | 0.0052 | 1.7391 | 69.0% |
 * | 64 | 0.0076 | 4.4854 | 0.0051 | 6.7210 | 66.7% |
 * | 128 | 0.0091 | 14.7346 | 0.0061 | 22.0052 | 67.0% |
 * | 256 | 0.0156 | 34.0370 | 0.0082 | 64.7500 | 52.6% |
 * | 512 | 0.0471 | 44.7826 | 0.0186 | 113.3620 | 39.5% |
 * | 1024 | 0.1839 | 45.7437 | 0.0570 | 147.7034 | 31.0% |
 * | 1280 | 0.2847 | 46.1511 | 0.0999 | 131.5686 | 35.1% |
 * | 2048 | 0.7434 | 45.2011 | 0.2292 | 146.5818 | 30.8% |
 * | 4096 | 8.8679 | 15.1464 | 1.1033 | 121.7442 | 12.4% |
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
 * | 32 | 0.0074 | 1.2121 | 0.0054 | 1.6568 | 73.2% |
 * | 64 | 0.0082 | 4.1875 | 0.0058 | 5.9227 | 70.7% |
 * | 128 | 0.0115 | 11.6283 | 0.0061 | 21.8333 | 53.3% |
 * | 256 | 0.0265 | 20.0314 | 0.0092 | 57.6557 | 34.7% |
 * | 512 | 0.0754 | 27.9618 | 0.0196 | 107.4491 | 26.0% |
 * | 1024 | 0.2662 | 31.6000 | 0.0572 | 147.0836 | 21.5% |
 * | 1280 | 0.4055 | 32.3990 | 0.0977 | 134.4776 | 24.1% |
 * | 2048 | 0.9885 | 33.9958 | 0.2270 | 148.0282 | 23.0% |
 * | 4096 | 7.6562 | 17.5434 | 1.1084 | 121.1836 | 14.5% |
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
 * | 32 | 0.0072 | 1.2362 | 0.0054 | 1.6568 | 74.6% |
 * | 64 | 0.0073 | 4.6710 | 0.0056 | 6.0909 | 76.7% |
 * | 128 | 0.0083 | 16.0921 | 0.0062 | 21.6641 | 74.3% |
 * | 256 | 0.0131 | 40.6275 | 0.0094 | 56.5734 | 71.8% |
 * | 512 | 0.0290 | 72.7594 | 0.0181 | 116.4664 | 62.5% |
 * | 1024 | 0.0799 | 105.3333 | 0.0553 | 152.1481 | 69.2% |
 * | 1280 | 0.1166 | 112.6829 | 0.0886 | 148.3237 | 76.0% |
 * | 2048 | 0.2728 | 123.1658 | 0.2068 | 162.4554 | 75.8% |
 * | 4096 | 1.0177 | 131.9847 | 0.8192 | 163.9600 | 80.5% |
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
 * | 32 | 0.0074 | 1.2043 | 0.0055 | 1.6185 | 74.4% |
 * | 64 | 0.0075 | 4.5520 | 0.0046 | 7.3931 | 61.6% |
 * | 128 | 0.0082 | 16.3750 | 0.0059 | 22.5984 | 72.5% |
 * | 256 | 0.0123 | 43.1667 | 0.0083 | 63.6315 | 67.8% |
 * | 512 | 0.0270 | 78.1043 | 0.0185 | 113.8515 | 68.6% |
 * | 1024 | 0.0767 | 109.7525 | 0.0555 | 151.5780 | 72.4% |
 * | 1280 | 0.1150 | 114.2825 | 0.0912 | 144.0309 | 79.3% |
 * | 2048 | 0.2664 | 126.1244 | 0.2069 | 162.4177 | 77.7% |
 * | 4096 | 1.0268 | 130.8144 | 0.8191 | 163.9792 | 79.8% |
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
 * | 32 | 0.0071 | 1.2556 | 0.0045 | 2.0000 | 62.8% |
 * | 64 | 0.0074 | 4.6207 | 0.0046 | 7.3931 | 62.5% |
 * | 128 | 0.0083 | 16.1853 | 0.0056 | 23.8182 | 68.0% |
 * | 256 | 0.0135 | 39.2331 | 0.0082 | 64.7500 | 60.6% |
 * | 512 | 0.0287 | 73.4485 | 0.0182 | 115.8524 | 63.4% |
 * | 1024 | 0.0799 | 105.3333 | 0.0553 | 152.2363 | 69.2% |
 * | 1280 | 0.1167 | 112.5439 | 0.0873 | 150.4158 | 74.8% |
 * | 2048 | 0.2736 | 122.8201 | 0.2028 | 165.6851 | 74.1% |
 * | 4096 | 1.0162 | 132.1696 | 0.8129 | 165.2250 | 80.0% |
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
 * | 32 | 0.0071 | 1.2698 | 0.0045 | 1.9718 | 64.4% |
 * | 64 | 0.0075 | 4.5520 | 0.0046 | 7.4444 | 61.1% |
 * | 128 | 0.0084 | 16.0000 | 0.0055 | 24.3721 | 65.6% |
 * | 256 | 0.0134 | 39.4667 | 0.0082 | 64.7500 | 61.0% |
 * | 512 | 0.0295 | 71.4193 | 0.0184 | 114.4444 | 62.4% |
 * | 1024 | 0.0810 | 103.9178 | 0.0692 | 121.4935 | 85.5% |
 * | 1280 | 0.1188 | 110.6034 | 0.1249 | 105.1639 | 105.2% |
 * | 2048 | 0.2817 | 119.2970 | 0.2704 | 124.2663 | 96.0% |
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
 * | 32 | 0.0072 | 1.2500 | 0.0044 | 2.0588 | 60.7% |
 * | 64 | 0.0073 | 4.7225 | 0.0046 | 7.4965 | 63.0% |
 * | 128 | 0.0083 | 16.0921 | 0.0055 | 24.5865 | 65.5% |
 * | 256 | 0.0135 | 39.3729 | 0.0081 | 65.2598 | 60.3% |
 * | 512 | 0.0289 | 72.9204 | 0.0184 | 114.4444 | 63.7% |
 * | 1024 | 0.0801 | 105.0597 | 0.0629 | 133.7294 | 78.6% |
 * | 1280 | 0.1200 | 109.5119 | 0.1161 | 113.1799 | 96.8% |
 * | 2048 | 0.2757 | 121.8793 | 0.2924 | 114.9422 | 106.0% |
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
 * | 32 | 0.0071 | 1.2556 | 0.0044 | 2.0144 | 62.3% |
 * | 64 | 0.0075 | 4.5910 | 0.0048 | 7.2189 | 63.6% |
 * | 128 | 0.0084 | 16.0000 | 0.0055 | 24.5146 | 65.3% |
 * | 256 | 0.0133 | 39.9903 | 0.0082 | 64.7500 | 61.8% |
 * | 512 | 0.0291 | 72.5991 | 0.0177 | 118.8819 | 61.1% |
 * | 1024 | 0.0799 | 105.3333 | 0.0589 | 142.7706 | 73.8% |
 * | 1280 | 0.1188 | 110.6034 | 0.1114 | 117.9770 | 93.8% |
 * | 2048 | 0.2802 | 119.9237 | 0.2593 | 129.5874 | 92.5% |
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
 * | 32 | 0.0087 | 1.0256 | 0.0045 | 2.0000 | 51.3% |
 * | 64 | 0.0089 | 3.8631 | 0.0046 | 7.4444 | 51.9% |
 * | 128 | 0.0103 | 13.0389 | 0.0060 | 22.4171 | 58.2% |
 * | 256 | 0.0163 | 32.6299 | 0.0088 | 59.9494 | 54.4% |
 * | 512 | 0.0360 | 58.5175 | 0.0174 | 121.3996 | 48.2% |
 * | 1024 | 0.1004 | 83.8367 | 0.0564 | 149.1276 | 56.2% |
 * | 1280 | 0.1472 | 89.2425 | 0.0855 | 153.6814 | 58.1% |
 * | 2048 | 0.3453 | 97.3227 | 0.2189 | 153.5251 | 63.4% |
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
 * | 32 | 0.0087 | 1.0351 | 0.0049 | 1.8301 | 56.6% |
 * | 64 | 0.0091 | 3.7880 | 0.0045 | 7.5760 | 50.0% |
 * | 128 | 0.0104 | 12.9383 | 0.0060 | 22.2387 | 58.2% |
 * | 256 | 0.0162 | 32.7589 | 0.0084 | 62.7879 | 52.2% |
 * | 512 | 0.0483 | 43.7135 | 0.0182 | 115.8524 | 37.7% |
 * | 1024 | 0.1393 | 60.4118 | 0.0646 | 130.3158 | 46.4% |
 * | 1280 | 0.2096 | 62.6857 | 0.1081 | 121.5214 | 51.6% |
 * | 2048 | 0.4894 | 68.6572 | 0.2747 | 122.3479 | 56.1% |
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
 * | 32 | 0.0124 | 0.7254 | 0.0051 | 1.7666 | 41.1% |
 * | 64 | 0.0128 | 2.6733 | 0.0048 | 7.1467 | 37.4% |
 * | 128 | 0.0160 | 8.4008 | 0.0061 | 22.0632 | 38.1% |
 * | 256 | 0.0243 | 21.8537 | 0.0085 | 62.5509 | 34.9% |
 * | 512 | 0.0552 | 38.1924 | 0.0177 | 119.4203 | 32.0% |
 * | 1024 | 0.1577 | 53.3506 | 0.0576 | 146.0217 | 36.5% |
 * | 1280 | 0.2429 | 54.0815 | 0.0867 | 151.5821 | 35.7% |
 * | 2048 | 0.5898 | 56.9738 | 0.2150 | 156.2899 | 36.5% |
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
 * | 32 | 0.0137 | 0.6542 | 0.0054 | 1.6716 | 39.1% |
 * | 64 | 0.0143 | 2.4036 | 0.0057 | 6.0565 | 39.7% |
 * | 128 | 0.0169 | 7.9169 | 0.0061 | 21.8333 | 36.3% |
 * | 256 | 0.0266 | 19.9231 | 0.0083 | 64.0000 | 31.1% |
 * | 512 | 0.0594 | 35.5364 | 0.0184 | 114.4444 | 31.1% |
 * | 1024 | 0.1734 | 48.5122 | 0.0600 | 140.2197 | 34.6% |
 * | 1280 | 0.2601 | 50.5118 | 0.0920 | 142.8283 | 35.4% |
 * | 2048 | 0.6498 | 51.7118 | 0.2334 | 143.9594 | 35.9% |
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
 * | 32 | 0.0074 | 1.2121 | 0.0045 | 2.0000 | 60.6% |
 * | 64 | 0.0079 | 4.3577 | 0.0046 | 7.4965 | 58.1% |
 * | 128 | 0.0083 | 16.1231 | 0.0057 | 23.6836 | 68.1% |
 * | 256 | 0.0136 | 39.1405 | 0.0082 | 64.7500 | 60.4% |
 * | 512 | 0.0291 | 72.4794 | 0.0184 | 114.4444 | 63.3% |
 * | 1024 | 0.0799 | 105.3333 | 0.0545 | 154.3364 | 68.2% |
 * | 1280 | 0.1167 | 112.5439 | 0.0875 | 150.1957 | 74.9% |
 * | 2048 | 0.2754 | 122.0351 | 0.2028 | 165.6851 | 73.7% |
 * | 4096 | 1.0172 | 132.0511 | 0.8126 | 165.2933 | 79.9% |
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
 * | 32 | 0.0073 | 1.2308 | 0.0016 | 5.4369 | 22.6% |
 * | 64 | 0.0074 | 4.6207 | 0.0016 | 21.6566 | 21.3% |
 * | 128 | 0.0084 | 15.9392 | 0.0016 | 85.5510 | 18.6% |
 * | 256 | 0.0148 | 35.9566 | 0.0016 | 328.2376 | 11.0% |
 * | 512 | 0.0291 | 72.5592 | 0.0016 | 1318.4001 | 5.5% |
 * | 1024 | 0.0799 | 105.3333 | 0.0020 | 4240.5166 | 2.5% |
 * | 1280 | 0.1165 | 112.7602 | 0.0015 | 8643.3682 | 1.3% |
 * | 2048 | 0.2730 | 123.1081 | 0.0016 | 21002.2402 | 0.6% |
 * | 4096 | 1.0179 | 131.9598 | 0.0018 | 74953.1406 | 0.2% |
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
 * | 32 | 0.0075 | 1.2017 | 0.0047 | 1.9048 | 63.1% |
 * | 64 | 0.0077 | 4.4389 | 0.0051 | 6.7848 | 65.4% |
 * | 128 | 0.0084 | 15.8788 | 0.0056 | 23.8860 | 66.5% |
 * | 256 | 0.0136 | 39.0943 | 0.0082 | 64.7500 | 60.4% |
 * | 512 | 0.0292 | 72.3600 | 0.0182 | 116.1586 | 62.3% |
 * | 1024 | 0.0799 | 105.3333 | 0.0548 | 153.5253 | 68.6% |
 * | 1280 | 0.1165 | 112.7912 | 0.0873 | 150.5537 | 74.9% |
 * | 2048 | 0.2716 | 123.7391 | 0.2028 | 165.7112 | 74.7% |
 * | 4096 | 1.0159 | 132.2091 | 0.8123 | 165.3617 | 80.0% |
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
 * | 32 | 0.0071 | 1.2698 | 0.0061 | 1.4583 | 87.1% |
 * | 64 | 0.0081 | 4.2288 | 0.0060 | 5.6720 | 74.6% |
 * | 128 | 0.0084 | 16.0000 | 0.0068 | 19.7736 | 80.9% |
 * | 256 | 0.0136 | 39.0024 | 0.0102 | 51.8000 | 75.3% |
 * | 512 | 0.0292 | 72.3600 | 0.0224 | 94.3062 | 76.7% |
 * | 1024 | 0.0798 | 105.4178 | 0.0675 | 124.6619 | 84.6% |
 * | 1280 | 0.1167 | 112.5439 | 0.1018 | 129.0461 | 87.2% |
 * | 2048 | 0.2724 | 123.3684 | 0.2494 | 134.7507 | 91.6% |
 * | 4096 | 1.0239 | 131.1823 | 0.9710 | 138.3332 | 94.8% |
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
 * | 32 | 0.0075 | 1.1991 | 0.0058 | 1.5427 | 77.7% |
 * | 64 | 0.0080 | 4.3139 | 0.0059 | 5.8420 | 73.8% |
 * | 128 | 0.0083 | 16.0921 | 0.0067 | 19.9619 | 80.6% |
 * | 256 | 0.0131 | 40.4786 | 0.0102 | 51.8000 | 78.1% |
 * | 512 | 0.0290 | 72.6792 | 0.0182 | 116.0563 | 62.6% |
 * | 1024 | 0.0797 | 105.5448 | 0.0549 | 153.2568 | 68.9% |
 * | 1280 | 0.1167 | 112.5747 | 0.0877 | 149.8394 | 75.1% |
 * | 2048 | 0.2724 | 123.3684 | 0.2028 | 165.7374 | 74.4% |
 * | 4096 | 1.0164 | 132.1509 | 0.8130 | 165.2185 | 80.0% |
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
 * | 32 | 0.0076 | 1.1814 |
 * | 64 | 0.0075 | 4.5520 |
 * | 128 | 0.0082 | 16.3750 |
 * | 256 | 0.0123 | 43.2229 |
 * | 512 | 0.0271 | 77.9196 |
 * | 1024 | 0.0769 | 109.4099 |
 * | 1280 | 0.1163 | 112.9464 |
 * | 2048 | 0.2676 | 125.5889 |
 * | 4096 | 1.0237 | 131.2029 |
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
 * | 32 | 0.0095 | 0.9459 |
 * | 64 | 0.0079 | 4.3666 |
 * | 128 | 0.0083 | 16.1231 |
 * | 256 | 0.0139 | 38.0620 |
 * | 512 | 0.0292 | 72.3600 |
 * | 1024 | 0.0799 | 105.3333 |
 * | 1280 | 0.1166 | 112.6365 |
 * | 2048 | 0.2729 | 123.1514 |
 * | 4096 | 1.0163 | 132.1675 |
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
