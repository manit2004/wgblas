/**
 * Benchmark results for ssyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0036 | 1.2197 | 58.1% |
 * | 64 | 0.0062 | 2.7358 | 0.0035 | 4.8440 | 56.5% |
 * | 128 | 0.0065 | 10.2970 | 0.0035 | 18.8235 | 54.7% |
 * | 256 | 0.0073 | 36.1313 | 0.0039 | 67.6721 | 53.4% |
 * | 512 | 0.0094 | 111.5119 | 0.0061 | 173.1368 | 64.4% |
 * | 1024 | 0.0323 | 129.9634 | 0.0311 | 135.3199 | 96.0% |
 * | 1280 | 0.0512 | 128.2000 | 0.0655 | 100.1562 | 128.0% |
 * | 2048 | 0.1096 | 153.1816 | 0.1133 | 148.2067 | 103.4% |
 * | 4096 | 0.4166 | 161.1564 | 0.4465 | 150.3853 | 107.2% |
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
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5241 | 0.0035 | 1.2308 | 42.6% |
 * | 64 | 0.0084 | 2.0076 | 0.0034 | 4.9346 | 40.7% |
 * | 128 | 0.0085 | 7.7903 | 0.0035 | 19.0826 | 40.8% |
 * | 256 | 0.0099 | 26.5894 | 0.0038 | 69.3782 | 38.3% |
 * | 512 | 0.0120 | 87.4894 | 0.0061 | 173.1368 | 50.5% |
 * | 1024 | 0.0372 | 113.0189 | 0.0311 | 135.1111 | 83.6% |
 * | 1280 | 0.0550 | 119.3946 | 0.0655 | 100.2297 | 119.1% |
 * | 2048 | 0.1208 | 138.9831 | 0.1142 | 147.0234 | 94.5% |
 * | 4096 | 0.4432 | 151.5093 | 0.4487 | 149.6452 | 101.2% |
 *
 * ![ssyr-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride4.svg)
 *
 * ![ssyr-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5261 | 0.0034 | 1.2830 | 41.0% |
 * | 64 | 0.0084 | 2.0076 | 0.0034 | 4.9811 | 40.3% |
 * | 128 | 0.0085 | 7.8049 | 0.0036 | 18.5714 | 42.0% |
 * | 256 | 0.0102 | 26.0031 | 0.0038 | 68.8000 | 37.8% |
 * | 512 | 0.0122 | 86.5684 | 0.0061 | 171.3333 | 50.5% |
 * | 1024 | 0.0372 | 112.9703 | 0.0312 | 134.8337 | 83.8% |
 * | 1280 | 0.0549 | 119.4642 | 0.0655 | 100.1807 | 119.2% |
 * | 2048 | 0.1208 | 138.9831 | 0.1145 | 146.7151 | 94.7% |
 * | 4096 | 0.4444 | 151.0947 | 0.4490 | 149.5386 | 101.0% |
 *
 * ![ssyr-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride5.svg)
 *
 * ![ssyr-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5171 | 0.0035 | 1.2477 | 41.4% |
 * | 64 | 0.0084 | 2.0038 | 0.0035 | 4.8440 | 41.4% |
 * | 128 | 0.0087 | 7.6895 | 0.0036 | 18.5714 | 41.4% |
 * | 256 | 0.0099 | 26.8052 | 0.0040 | 66.8502 | 40.1% |
 * | 512 | 0.0123 | 85.6667 | 0.0064 | 165.3065 | 51.8% |
 * | 1024 | 0.0380 | 110.7319 | 0.0319 | 131.7232 | 84.1% |
 * | 1280 | 0.0553 | 118.7037 | 0.0655 | 100.1562 | 118.5% |
 * | 2048 | 0.1215 | 138.1780 | 0.1167 | 143.8596 | 96.1% |
 * | 4096 | 0.4444 | 151.0783 | 0.4719 | 142.2782 | 106.2% |
 *
 * ![ssyr-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride32.svg)
 *
 * ![ssyr-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5241 | 0.0035 | 1.2477 | 42.0% |
 * | 64 | 0.0084 | 2.0230 | 0.0034 | 4.9116 | 41.2% |
 * | 128 | 0.0086 | 7.7467 | 0.0035 | 19.0826 | 40.6% |
 * | 256 | 0.0100 | 26.4615 | 0.0039 | 68.2314 | 38.8% |
 * | 512 | 0.0123 | 85.6667 | 0.0061 | 171.3333 | 50.0% |
 * | 1024 | 0.0374 | 112.3902 | 0.0314 | 133.8716 | 84.0% |
 * | 1280 | 0.0553 | 118.7037 | 0.0655 | 100.1562 | 118.5% |
 * | 2048 | 0.1218 | 137.8875 | 0.1160 | 144.8323 | 95.2% |
 * | 4096 | 0.4444 | 151.0783 | 0.4710 | 142.5391 | 106.0% |
 *
 * ![ssyr-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride33.svg)
 *
 * ![ssyr-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5251 | 0.0034 | 1.2830 | 40.9% |
 * | 64 | 0.0085 | 1.9887 | 0.0035 | 4.8889 | 40.7% |
 * | 128 | 0.0086 | 7.7612 | 0.0037 | 17.9310 | 43.3% |
 * | 256 | 0.0102 | 25.9623 | 0.0039 | 67.6721 | 38.4% |
 * | 512 | 0.0123 | 85.6667 | 0.0061 | 171.3333 | 50.0% |
 * | 1024 | 0.0380 | 110.6386 | 0.0315 | 133.3956 | 82.9% |
 * | 1280 | 0.0553 | 118.6694 | 0.0665 | 98.6628 | 120.3% |
 * | 2048 | 0.1222 | 137.4362 | 0.1169 | 143.7021 | 95.6% |
 * | 4096 | 0.4461 | 150.5148 | 0.4919 | 136.4845 | 110.3% |
 *
 * ![ssyr-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride255.svg)
 *
 * ![ssyr-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5171 | 0.0036 | 1.2035 | 43.0% |
 * | 64 | 0.0087 | 1.9376 | 0.0034 | 4.9346 | 39.3% |
 * | 128 | 0.0087 | 7.6471 | 0.0035 | 18.9091 | 40.4% |
 * | 256 | 0.0100 | 26.2930 | 0.0040 | 65.5238 | 40.1% |
 * | 512 | 0.0123 | 85.6667 | 0.0064 | 165.3065 | 51.8% |
 * | 1024 | 0.0379 | 110.9658 | 0.0319 | 131.5912 | 84.3% |
 * | 1280 | 0.0553 | 118.6350 | 0.0666 | 98.6154 | 120.3% |
 * | 2048 | 0.1221 | 137.4902 | 0.1170 | 143.4860 | 95.8% |
 * | 4096 | 0.4449 | 150.9262 | 0.4781 | 140.4261 | 107.5% |
 *
 * ![ssyr-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride256.svg)
 *
 * ![ssyr-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/stride.ssyr.js) — WebGPU stride-sweep benchmark script
 * - [stride.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/stride.ssyr.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2477 | 56.8% |
 * | 64 | 0.0062 | 2.7429 | 0.0034 | 4.9346 | 55.6% |
 * | 128 | 0.0065 | 10.2970 | 0.0036 | 18.7387 | 55.0% |
 * | 256 | 0.0078 | 33.6980 | 0.0038 | 69.9661 | 48.2% |
 * | 512 | 0.0100 | 104.9314 | 0.0061 | 173.1368 | 60.6% |
 * | 1024 | 0.0346 | 121.4875 | 0.0310 | 135.5294 | 89.6% |
 * | 1280 | 0.0517 | 126.8914 | 0.0655 | 100.1562 | 126.7% |
 * | 2048 | 0.1184 | 141.7804 | 0.1134 | 148.1440 | 95.7% |
 * | 4096 | 0.4403 | 152.4837 | 0.4465 | 150.3853 | 101.4% |
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
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2477 | 56.8% |
 * | 64 | 0.0062 | 2.7077 | 0.0035 | 4.8889 | 55.4% |
 * | 128 | 0.0064 | 10.3483 | 0.0035 | 19.1705 | 54.0% |
 * | 256 | 0.0071 | 37.1892 | 0.0039 | 67.6721 | 55.0% |
 * | 512 | 0.0096 | 109.6533 | 0.0062 | 170.4456 | 64.3% |
 * | 1024 | 0.0324 | 129.7708 | 0.0321 | 130.8699 | 99.2% |
 * | 1280 | 0.0512 | 128.2000 | 0.0670 | 97.9561 | 130.9% |
 * | 2048 | 0.1100 | 152.7357 | 0.1135 | 148.0186 | 103.2% |
 * | 4096 | 0.4170 | 161.0080 | 0.4437 | 151.3071 | 106.4% |
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
 * | 32 | 0.0061 | 0.7083 | 0.0036 | 1.2252 | 57.8% |
 * | 64 | 0.0062 | 2.7216 | 0.0037 | 4.6114 | 59.0% |
 * | 128 | 0.0064 | 10.4000 | 0.0035 | 18.9091 | 55.0% |
 * | 256 | 0.0077 | 34.4000 | 0.0039 | 68.2314 | 50.4% |
 * | 512 | 0.0101 | 103.7729 | 0.0061 | 171.3333 | 60.6% |
 * | 1024 | 0.0345 | 121.7127 | 0.0310 | 135.3897 | 89.9% |
 * | 1280 | 0.0517 | 127.0093 | 0.0655 | 100.1562 | 126.8% |
 * | 2048 | 0.1187 | 141.5318 | 0.1134 | 148.0604 | 95.6% |
 * | 4096 | 0.4403 | 152.4837 | 0.4465 | 150.3853 | 101.4% |
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
 * | 32 | 0.0061 | 0.7083 | 0.0034 | 1.2651 | 56.0% |
 * | 64 | 0.0063 | 2.6734 | 0.0035 | 4.8000 | 55.7% |
 * | 128 | 0.0068 | 9.8578 | 0.0036 | 18.2456 | 54.0% |
 * | 256 | 0.0079 | 33.4929 | 0.0040 | 65.5238 | 51.1% |
 * | 512 | 0.0102 | 102.8000 | 0.0065 | 162.8515 | 63.1% |
 * | 1024 | 0.0355 | 118.2602 | 0.0410 | 102.6000 | 115.3% |
 * | 1280 | 0.0533 | 123.2322 | 0.0783 | 83.8765 | 146.9% |
 * | 2048 | 0.1206 | 139.2412 | 0.1479 | 113.5316 | 122.6% |
 * | 4096 | 0.4440 | 151.2253 | 0.7625 | 88.0495 | 171.8% |
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
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2477 | 56.8% |
 * | 64 | 0.0063 | 2.6939 | 0.0034 | 4.9346 | 54.6% |
 * | 128 | 0.0067 | 9.9284 | 0.0035 | 19.2593 | 51.6% |
 * | 256 | 0.0079 | 33.2903 | 0.0038 | 69.3782 | 48.0% |
 * | 512 | 0.0101 | 104.4317 | 0.0061 | 171.3333 | 61.0% |
 * | 1024 | 0.0356 | 117.9946 | 0.0431 | 97.5691 | 120.9% |
 * | 1280 | 0.0549 | 119.5686 | 0.0741 | 88.6048 | 134.9% |
 * | 2048 | 0.1167 | 143.9188 | 0.1778 | 94.4479 | 152.4% |
 * | 4096 | 0.4321 | 155.3744 | 0.7588 | 88.4784 | 175.6% |
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
 * | 32 | 0.0062 | 0.7047 | 0.0034 | 1.2830 | 54.9% |
 * | 64 | 0.0062 | 2.7147 | 0.0034 | 4.9346 | 55.0% |
 * | 128 | 0.0066 | 10.0483 | 0.0037 | 17.9310 | 56.0% |
 * | 256 | 0.0080 | 32.8924 | 0.0038 | 69.9661 | 47.0% |
 * | 512 | 0.0102 | 103.4465 | 0.0061 | 171.3333 | 60.4% |
 * | 1024 | 0.0352 | 119.4977 | 0.0445 | 94.3448 | 126.7% |
 * | 1280 | 0.0532 | 123.2692 | 0.0685 | 95.7610 | 128.7% |
 * | 2048 | 0.1203 | 139.5745 | 0.1437 | 116.8820 | 119.4% |
 * | 4096 | 0.4333 | 154.9384 | 0.7699 | 87.2060 | 177.7% |
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
 * | 32 | 0.0062 | 0.7065 | 0.0035 | 1.2535 | 56.4% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8664 | 56.5% |
 * | 128 | 0.0066 | 10.1217 | 0.0036 | 18.5714 | 54.5% |
 * | 256 | 0.0077 | 34.4000 | 0.0039 | 68.2314 | 50.4% |
 * | 512 | 0.0102 | 103.6094 | 0.0061 | 172.2304 | 60.2% |
 * | 1024 | 0.0351 | 119.7702 | 0.0387 | 108.7152 | 110.2% |
 * | 1280 | 0.0516 | 127.3246 | 0.0585 | 112.1487 | 113.5% |
 * | 2048 | 0.1169 | 143.6234 | 0.1358 | 123.7006 | 116.1% |
 * | 4096 | 0.4573 | 146.8077 | 0.6017 | 111.5903 | 131.6% |
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
 * | 32 | 0.0061 | 0.7083 | 0.0034 | 1.2770 | 55.5% |
 * | 64 | 0.0064 | 2.6533 | 0.0035 | 4.8889 | 54.3% |
 * | 128 | 0.0068 | 9.8345 | 0.0035 | 19.1705 | 51.3% |
 * | 256 | 0.0080 | 32.8270 | 0.0038 | 69.9661 | 46.9% |
 * | 512 | 0.0102 | 103.2841 | 0.0061 | 172.2304 | 60.0% |
 * | 1024 | 0.0366 | 114.6969 | 0.0454 | 92.6149 | 123.8% |
 * | 1280 | 0.0532 | 123.2692 | 0.0675 | 97.2133 | 126.8% |
 * | 2048 | 0.1224 | 137.2026 | 0.1662 | 101.0397 | 135.8% |
 * | 4096 | 0.4446 | 151.0131 | 0.8011 | 83.8097 | 180.2% |
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
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2477 | 56.8% |
 * | 64 | 0.0062 | 2.7216 | 0.0037 | 4.5913 | 59.3% |
 * | 128 | 0.0067 | 9.9522 | 0.0037 | 18.0870 | 55.0% |
 * | 256 | 0.0079 | 33.4929 | 0.0038 | 69.9661 | 47.9% |
 * | 512 | 0.0102 | 103.2841 | 0.0061 | 172.2304 | 60.0% |
 * | 1024 | 0.0359 | 116.9960 | 0.0423 | 99.3780 | 117.7% |
 * | 1280 | 0.0514 | 127.6019 | 0.0551 | 119.0827 | 107.2% |
 * | 2048 | 0.1212 | 138.5062 | 0.1453 | 115.5438 | 119.9% |
 * | 4096 | 0.4547 | 147.6757 | 0.5960 | 112.6598 | 131.1% |
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
 * | 32 | 0.0062 | 0.7047 | 0.0034 | 1.2710 | 55.4% |
 * | 64 | 0.0062 | 2.7077 | 0.0034 | 4.9577 | 54.6% |
 * | 128 | 0.0067 | 9.9284 | 0.0036 | 18.7387 | 53.0% |
 * | 256 | 0.0079 | 33.4929 | 0.0039 | 68.5145 | 48.9% |
 * | 512 | 0.0101 | 104.1013 | 0.0061 | 171.3333 | 60.8% |
 * | 1024 | 0.0352 | 119.3891 | 0.0411 | 102.3601 | 116.6% |
 * | 1280 | 0.0524 | 125.3790 | 0.0614 | 106.8333 | 117.4% |
 * | 2048 | 0.1226 | 136.9341 | 0.1926 | 87.2123 | 157.0% |
 * | 4096 | 0.4978 | 134.8789 | 0.6288 | 106.7720 | 126.3% |
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
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6445 | 0.0035 | 1.2535 | 51.4% |
 * | 64 | 0.0068 | 2.4673 | 0.0034 | 4.9811 | 49.5% |
 * | 128 | 0.0071 | 9.3694 | 0.0036 | 18.4071 | 50.9% |
 * | 256 | 0.0084 | 31.6322 | 0.0037 | 70.5641 | 44.8% |
 * | 512 | 0.0112 | 94.2579 | 0.0060 | 174.9787 | 53.9% |
 * | 1024 | 0.0368 | 114.0990 | 0.0309 | 135.8097 | 84.0% |
 * | 1280 | 0.0537 | 122.2043 | 0.0655 | 100.1807 | 122.0% |
 * | 2048 | 0.1229 | 136.5955 | 0.1134 | 148.0604 | 92.3% |
 * | 4096 | 0.4403 | 152.4837 | 0.4465 | 150.3853 | 101.4% |
 *
 * ![ssyr-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alphaneg3p75.svg)
 *
 * ![ssyr-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0015 | 2.8936 | 24.5% |
 * | 64 | 0.0062 | 2.7077 | 0.0015 | 11.4783 | 23.6% |
 * | 128 | 0.0065 | 10.2716 | 0.0015 | 43.7895 | 23.5% |
 * | 256 | 0.0078 | 33.6980 | 0.0016 | 168.4898 | 20.0% |
 * | 512 | 0.0101 | 103.7729 | 0.0015 | 722.9890 | 14.4% |
 * | 1024 | 0.0347 | 121.0396 | 0.0015 | 2854.9563 | 4.2% |
 * | 1280 | 0.0518 | 126.7738 | 0.0015 | 4411.1826 | 2.9% |
 * | 2048 | 0.1185 | 141.7421 | 0.0015 | 11408.6953 | 1.2% |
 * | 4096 | 0.4403 | 152.4837 | 0.0015 | 45122.0625 | 0.3% |
 *
 * ![ssyr-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha0.svg)
 *
 * ![ssyr-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2535 | 56.5% |
 * | 64 | 0.0062 | 2.7358 | 0.0036 | 4.6316 | 59.1% |
 * | 128 | 0.0065 | 10.2463 | 0.0037 | 18.0087 | 56.9% |
 * | 256 | 0.0078 | 33.6980 | 0.0038 | 69.9661 | 48.2% |
 * | 512 | 0.0100 | 105.7749 | 0.0061 | 172.2304 | 61.4% |
 * | 1024 | 0.0348 | 120.8725 | 0.0309 | 135.9503 | 88.9% |
 * | 1280 | 0.0518 | 126.7738 | 0.0655 | 100.2542 | 126.5% |
 * | 2048 | 0.1184 | 141.7995 | 0.1134 | 148.1440 | 95.7% |
 * | 4096 | 0.4400 | 152.5835 | 0.4465 | 150.3853 | 101.5% |
 *
 * ![ssyr-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha1eneg38.svg)
 *
 * ![ssyr-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7065 | 0.0034 | 1.2710 | 55.6% |
 * | 64 | 0.0062 | 2.7216 | 0.0036 | 4.7354 | 57.5% |
 * | 128 | 0.0065 | 10.2463 | 0.0035 | 19.0826 | 53.7% |
 * | 256 | 0.0077 | 34.4000 | 0.0038 | 69.3782 | 49.6% |
 * | 512 | 0.0100 | 105.6051 | 0.0060 | 174.0529 | 60.7% |
 * | 1024 | 0.0347 | 121.2632 | 0.0310 | 135.6694 | 89.4% |
 * | 1280 | 0.0517 | 127.0093 | 0.0655 | 100.2542 | 126.7% |
 * | 2048 | 0.1183 | 141.9913 | 0.1133 | 148.1858 | 95.8% |
 * | 4096 | 0.4403 | 152.4893 | 0.4464 | 150.3961 | 101.4% |
 *
 * ![ssyr-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha1.svg)
 *
 * ![ssyr-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7047 | 0.0034 | 1.2830 | 54.9% |
 * | 64 | 0.0062 | 2.7358 | 0.0034 | 4.9577 | 55.2% |
 * | 128 | 0.0064 | 10.4261 | 0.0036 | 18.3260 | 56.9% |
 * | 256 | 0.0078 | 33.9753 | 0.0038 | 69.3782 | 49.0% |
 * | 512 | 0.0100 | 105.0990 | 0.0060 | 174.0529 | 60.4% |
 * | 1024 | 0.0348 | 120.9282 | 0.0309 | 135.8097 | 89.0% |
 * | 1280 | 0.0516 | 127.1274 | 0.0655 | 100.1562 | 126.9% |
 * | 2048 | 0.1186 | 141.6082 | 0.1136 | 147.8310 | 95.8% |
 * | 4096 | 0.4412 | 152.1741 | 0.4465 | 150.3853 | 101.2% |
 *
 * ![ssyr-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha2p5.svg)
 *
 * ![ssyr-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/alpha.ssyr.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/alpha.ssyr.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0061 | 0.7083 |
 * | 64 | 0.0061 | 2.7500 |
 * | 128 | 0.0064 | 10.3483 |
 * | 256 | 0.0070 | 37.6128 |
 * | 512 | 0.0092 | 114.6202 |
 * | 1024 | 0.0326 | 128.7529 |
 * | 1280 | 0.0513 | 128.0400 |
 * | 2048 | 0.1099 | 152.8024 |
 * | 4096 | 0.4168 | 161.0946 |
 *
 * ![ssyr-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-layoutcolumnmajor.svg)
 *
 * ![ssyr-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0062 | 0.7047 |
 * | 64 | 0.0061 | 2.7500 |
 * | 128 | 0.0064 | 10.4786 |
 * | 256 | 0.0078 | 33.6980 |
 * | 512 | 0.0100 | 105.7749 |
 * | 1024 | 0.0346 | 121.4875 |
 * | 1280 | 0.0518 | 126.7346 |
 * | 2048 | 0.1185 | 141.6655 |
 * | 4096 | 0.4403 | 152.4837 |
 *
 * ![ssyr-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-layoutrowmajor.svg)
 *
 * ![ssyr-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/layout.ssyr.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr
 */
