/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.2984 | 0.0041 | 0.5781 | 51.6% |
 * | 64 | 0.0092 | 0.9550 | 0.0055 | 1.6188 | 59.0% |
 * | 128 | 0.0123 | 2.7636 | 0.0079 | 4.2903 | 64.4% |
 * | 256 | 0.0184 | 7.2500 | 0.0136 | 9.8375 | 73.7% |
 * | 512 | 0.0213 | 24.8222 | 0.0266 | 19.8846 | 124.8% |
 * | 1024 | 0.0384 | 54.8571 | 0.1434 | 14.7000 | 373.2% |
 * | 1280 | 0.0432 | 76.1200 | 0.0553 | 59.4907 | 128.0% |
 * | 2048 | 0.0626 | 134.3133 | 0.0827 | 101.6769 | 132.1% |
 * | 4096 | 0.2089 | 160.7866 | 0.2272 | 147.8358 | 108.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strmv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-default.svg)
 *
 * ![strmv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-default.svg)
 *
 * ## See also
 *
 * - [strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/strmv.js) — WebGPU benchmark script
 * - [strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/strmv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0088 | 0.2701 | 0.0041 | 0.5781 | 46.7% |
 * | 64 | 0.0089 | 0.9910 | 0.0054 | 1.6331 | 60.7% |
 * | 128 | 0.0093 | 3.6501 | 0.0080 | 4.2560 | 85.8% |
 * | 256 | 0.0107 | 12.5405 | 0.0133 | 10.0144 | 125.2% |
 * | 512 | 0.0136 | 39.0649 | 0.0267 | 19.8369 | 196.9% |
 * | 1024 | 0.0316 | 66.7572 | 0.1435 | 14.6885 | 454.5% |
 * | 1280 | 0.0417 | 78.8646 | 0.0553 | 59.4907 | 132.6% |
 * | 2048 | 0.0860 | 97.7619 | 0.0828 | 101.5002 | 96.3% |
 * | 4096 | 0.2806 | 119.7372 | 0.2293 | 146.5256 | 81.7% |
 *
 * ![strmv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride4.svg)
 *
 * ![strmv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0087 | 0.2716 | 0.0041 | 0.5781 | 47.0% |
 * | 64 | 0.0090 | 0.9857 | 0.0054 | 1.6429 | 60.0% |
 * | 128 | 0.0090 | 3.7664 | 0.0080 | 4.2731 | 88.1% |
 * | 256 | 0.0105 | 12.7706 | 0.0133 | 10.0144 | 127.5% |
 * | 512 | 0.0137 | 38.7447 | 0.0267 | 19.8369 | 195.3% |
 * | 1024 | 0.0316 | 66.6896 | 0.1434 | 14.6951 | 453.8% |
 * | 1280 | 0.0417 | 78.8646 | 0.0553 | 59.4907 | 132.6% |
 * | 2048 | 0.0860 | 97.7619 | 0.0827 | 101.6966 | 96.1% |
 * | 4096 | 0.2826 | 118.8696 | 0.2312 | 145.2987 | 81.8% |
 *
 * ![strmv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride5.svg)
 *
 * ![strmv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0089 | 0.2667 | 0.0041 | 0.5781 | 46.1% |
 * | 64 | 0.0089 | 0.9928 | 0.0054 | 1.6235 | 61.2% |
 * | 128 | 0.0094 | 3.6376 | 0.0081 | 4.2222 | 86.2% |
 * | 256 | 0.0107 | 12.5217 | 0.0136 | 9.7913 | 127.9% |
 * | 512 | 0.0140 | 37.8149 | 0.0269 | 19.6485 | 192.5% |
 * | 1024 | 0.0328 | 64.3125 | 0.1470 | 14.3352 | 448.6% |
 * | 1280 | 0.0430 | 76.4881 | 0.0616 | 53.4304 | 143.2% |
 * | 2048 | 0.0879 | 95.6274 | 0.0870 | 96.6829 | 98.9% |
 * | 4096 | 0.2852 | 117.7761 | 0.2380 | 141.1286 | 83.5% |
 *
 * ![strmv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride32.svg)
 *
 * ![strmv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0087 | 0.2711 | 0.0041 | 0.5781 | 46.9% |
 * | 64 | 0.0089 | 0.9910 | 0.0053 | 1.6627 | 59.6% |
 * | 128 | 0.0095 | 3.5885 | 0.0081 | 4.1890 | 85.7% |
 * | 256 | 0.0108 | 12.4101 | 0.0133 | 10.0748 | 123.2% |
 * | 512 | 0.0140 | 37.9450 | 0.0284 | 18.6411 | 203.6% |
 * | 1024 | 0.0328 | 64.3125 | 0.1472 | 14.3165 | 449.2% |
 * | 1280 | 0.0429 | 76.6592 | 0.0603 | 54.5213 | 140.6% |
 * | 2048 | 0.0881 | 95.4884 | 0.0906 | 92.7746 | 102.9% |
 * | 4096 | 0.3074 | 109.2917 | 0.2354 | 142.7016 | 76.6% |
 *
 * ![strmv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride33.svg)
 *
 * ![strmv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0102 | 0.2313 | 0.0041 | 0.5736 | 40.3% |
 * | 64 | 0.0094 | 0.9372 | 0.0053 | 1.6677 | 56.2% |
 * | 128 | 0.0097 | 3.5116 | 0.0149 | 2.2784 | 154.1% |
 * | 256 | 0.0110 | 12.1043 | 0.0147 | 9.1179 | 132.8% |
 * | 512 | 0.0140 | 37.6856 | 0.0470 | 11.2621 | 334.6% |
 * | 1024 | 0.0331 | 63.7522 | 0.1490 | 14.1428 | 450.8% |
 * | 1280 | 0.0441 | 74.5738 | 0.0590 | 55.7333 | 133.8% |
 * | 2048 | 0.0882 | 95.3498 | 0.0880 | 95.6100 | 99.7% |
 * | 4096 | 0.2905 | 115.6484 | 0.2373 | 141.5568 | 81.7% |
 *
 * ![strmv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride255.svg)
 *
 * ![strmv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0089 | 0.2671 | 0.0041 | 0.5781 | 46.2% |
 * | 64 | 0.0094 | 0.9420 | 0.0054 | 1.6235 | 58.0% |
 * | 128 | 0.0094 | 3.6376 | 0.0144 | 2.3697 | 153.5% |
 * | 256 | 0.0112 | 11.9314 | 0.0151 | 8.8381 | 135.0% |
 * | 512 | 0.0143 | 37.0942 | 0.0466 | 11.3626 | 326.5% |
 * | 1024 | 0.0331 | 63.7522 | 0.1490 | 14.1458 | 450.7% |
 * | 1280 | 0.0437 | 75.2012 | 0.0584 | 56.2825 | 133.6% |
 * | 2048 | 0.0885 | 94.9707 | 0.0872 | 96.4876 | 98.4% |
 * | 4096 | 0.2888 | 116.3404 | 0.2357 | 142.5273 | 81.6% |
 *
 * ![strmv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride256.svg)
 *
 * ![strmv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/stride.strmv.js) — WebGPU stride-sweep benchmark script
 * - [stride.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/stride.strmv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0064 | 0.3672 | 0.0041 | 0.5781 | 63.5% |
 * | 64 | 0.0065 | 1.3630 | 0.0054 | 1.6331 | 83.5% |
 * | 128 | 0.0070 | 4.8807 | 0.0080 | 4.2817 | 114.0% |
 * | 256 | 0.0086 | 15.5821 | 0.0137 | 9.7799 | 159.3% |
 * | 512 | 0.0116 | 45.8283 | 0.0266 | 19.8846 | 230.5% |
 * | 1024 | 0.0287 | 73.5000 | 0.1434 | 14.7000 | 500.0% |
 * | 1280 | 0.0389 | 84.5395 | 0.0553 | 59.4907 | 142.1% |
 * | 2048 | 0.0823 | 102.1512 | 0.0826 | 101.7951 | 100.3% |
 * | 4096 | 0.2763 | 121.6096 | 0.2280 | 147.3689 | 82.5% |
 *
 * ![strmv-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-transno-transpose.svg)
 *
 * ![strmv-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.3033 | 0.0042 | 0.5649 | 53.7% |
 * | 64 | 0.0092 | 0.9583 | 0.0056 | 1.5682 | 61.1% |
 * | 128 | 0.0123 | 2.7781 | 0.0098 | 3.4715 | 80.0% |
 * | 256 | 0.0184 | 7.2500 | 0.0250 | 5.3367 | 135.9% |
 * | 512 | 0.0212 | 25.0287 | 0.0881 | 6.0116 | 416.3% |
 * | 1024 | 0.0385 | 54.7887 | 0.3482 | 6.0529 | 905.2% |
 * | 1280 | 0.0430 | 76.4881 | 0.2150 | 15.2976 | 500.0% |
 * | 2048 | 0.0622 | 135.1075 | 0.3297 | 25.5056 | 529.7% |
 * | 4096 | 0.2084 | 161.1939 | 1.0330 | 32.5224 | 495.6% |
 *
 * ![strmv-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-transtranspose.svg)
 *
 * ![strmv-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/trans.strmv.js) — WebGPU trans-sweep benchmark script
 * - [trans.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/trans.strmv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0065 | 0.3636 | 0.0041 | 0.5781 | 62.9% |
 * | 64 | 0.0066 | 1.3398 | 0.0054 | 1.6235 | 82.5% |
 * | 128 | 0.0069 | 4.9259 | 0.0080 | 4.2731 | 115.3% |
 * | 256 | 0.0086 | 15.4667 | 0.0136 | 9.8028 | 157.8% |
 * | 512 | 0.0113 | 47.0000 | 0.0266 | 19.8846 | 236.4% |
 * | 1024 | 0.0287 | 73.5000 | 0.1434 | 14.7000 | 500.0% |
 * | 1280 | 0.0389 | 84.5742 | 0.0553 | 59.4907 | 142.2% |
 * | 2048 | 0.0822 | 102.3103 | 0.0828 | 101.5787 | 100.7% |
 * | 4096 | 0.2764 | 121.5533 | 0.2274 | 147.7214 | 82.3% |
 *
 * ![strmv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-uplolower.svg)
 *
 * ![strmv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 0.3645 | 0.0041 | 0.5781 | 63.1% |
 * | 64 | 0.0066 | 1.3333 | 0.0054 | 1.6380 | 81.4% |
 * | 128 | 0.0072 | 4.7184 | 0.0080 | 4.2306 | 111.5% |
 * | 256 | 0.0085 | 15.6404 | 0.0132 | 10.1236 | 154.5% |
 * | 512 | 0.0119 | 44.6532 | 0.0266 | 19.8727 | 224.7% |
 * | 1024 | 0.0281 | 75.0496 | 0.1469 | 14.3415 | 523.3% |
 * | 1280 | 0.0400 | 82.3058 | 0.0555 | 59.3020 | 138.8% |
 * | 2048 | 0.0795 | 105.8333 | 0.0896 | 93.8179 | 112.8% |
 * | 4096 | 0.2569 | 130.7906 | 0.2314 | 145.1681 | 90.1% |
 *
 * ![strmv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-uploupper.svg)
 *
 * ![strmv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/uplo.strmv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/uplo.strmv.c) — CUDA / cuBLAS uplo-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride only matters for `trans = "transpose"` here (swept at both `trans` values below so that's visible in the data, not just claimed). Collapsed below by default — expand a `trans` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (8 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3610 | 0.0041 | 0.5781 | 62.4% |
 * | 64 | 0.0066 | 1.3366 | 0.0054 | 1.6331 | 81.8% |
 * | 128 | 0.0069 | 4.9259 | 0.0080 | 4.2645 | 115.5% |
 * | 256 | 0.0085 | 15.6404 | 0.0135 | 9.8957 | 158.1% |
 * | 512 | 0.0115 | 46.2123 | 0.0266 | 19.8846 | 232.4% |
 * | 1024 | 0.0287 | 73.5410 | 0.1434 | 14.7000 | 500.3% |
 * | 1280 | 0.0389 | 84.5395 | 0.0553 | 59.4907 | 142.1% |
 * | 2048 | 0.0820 | 102.4899 | 0.0827 | 101.7360 | 100.7% |
 * | 4096 | 0.2766 | 121.4760 | 0.2273 | 147.7838 | 82.2% |
 *
 * ![strmv-lda-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad0.svg)
 *
 * ![strmv-lda-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0041 | 0.5781 | 62.1% |
 * | 64 | 0.0067 | 1.3143 | 0.0054 | 1.6331 | 80.5% |
 * | 128 | 0.0073 | 4.6362 | 0.0080 | 4.2645 | 108.7% |
 * | 256 | 0.0087 | 15.3812 | 0.0135 | 9.9192 | 155.1% |
 * | 512 | 0.0115 | 46.0195 | 0.0266 | 19.8846 | 231.4% |
 * | 1024 | 0.0290 | 72.5686 | 0.1427 | 14.7676 | 491.4% |
 * | 1280 | 0.0404 | 81.3291 | 0.0561 | 58.6089 | 138.8% |
 * | 2048 | 0.0840 | 100.1463 | 0.0840 | 100.1463 | 100.0% |
 * | 4096 | 0.2806 | 119.7372 | 0.2332 | 144.0626 | 83.1% |
 *
 * ![strmv-lda-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad1.svg)
 *
 * ![strmv-lda-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 0.3645 | 0.0041 | 0.5781 | 63.1% |
 * | 64 | 0.0067 | 1.3143 | 0.0054 | 1.6429 | 80.0% |
 * | 128 | 0.0073 | 4.6565 | 0.0080 | 4.2560 | 109.4% |
 * | 256 | 0.0087 | 15.2967 | 0.0134 | 10.0024 | 152.9% |
 * | 512 | 0.0116 | 45.8283 | 0.0266 | 19.8846 | 230.5% |
 * | 1024 | 0.0299 | 70.5852 | 0.1433 | 14.7099 | 479.8% |
 * | 1280 | 0.0410 | 80.1872 | 0.0554 | 59.3705 | 135.1% |
 * | 2048 | 0.0805 | 104.4867 | 0.0840 | 100.1463 | 104.3% |
 * | 4096 | 0.2680 | 125.3335 | 0.2322 | 144.6979 | 86.6% |
 *
 * ![strmv-lda-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad8.svg)
 *
 * ![strmv-lda-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0064 | 0.3672 | 0.0041 | 0.5781 | 63.5% |
 * | 64 | 0.0067 | 1.3206 | 0.0054 | 1.6331 | 80.9% |
 * | 128 | 0.0072 | 4.7080 | 0.0080 | 4.2645 | 110.4% |
 * | 256 | 0.0087 | 15.3248 | 0.0132 | 10.1114 | 151.6% |
 * | 512 | 0.0116 | 45.7649 | 0.0266 | 19.8846 | 230.2% |
 * | 1024 | 0.0292 | 72.2898 | 0.1434 | 14.7000 | 491.8% |
 * | 1280 | 0.0405 | 81.2006 | 0.0553 | 59.4907 | 136.5% |
 * | 2048 | 0.0840 | 100.1463 | 0.0842 | 99.9179 | 100.2% |
 * | 4096 | 0.2662 | 126.1846 | 0.2318 | 144.9176 | 87.1% |
 *
 * ![strmv-lda-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad16.svg)
 *
 * ![strmv-lda-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0041 | 0.5781 | 62.1% |
 * | 64 | 0.0066 | 1.3301 | 0.0054 | 1.6331 | 81.4% |
 * | 128 | 0.0070 | 4.8696 | 0.0080 | 4.2817 | 113.7% |
 * | 256 | 0.0086 | 15.5242 | 0.0133 | 10.0385 | 154.6% |
 * | 512 | 0.0114 | 46.4719 | 0.0266 | 19.8846 | 233.7% |
 * | 1024 | 0.0287 | 73.5000 | 0.1434 | 14.7000 | 500.0% |
 * | 1280 | 0.0406 | 81.0087 | 0.0556 | 59.1995 | 136.8% |
 * | 2048 | 0.0829 | 101.4218 | 0.0840 | 100.1463 | 101.3% |
 * | 4096 | 0.2969 | 113.1371 | 0.2314 | 145.1681 | 77.9% |
 *
 * ![strmv-lda-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad32.svg)
 *
 * ![strmv-lda-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.3289 | 0.0041 | 0.5781 | 56.9% |
 * | 64 | 0.0068 | 1.3081 | 0.0054 | 1.6380 | 79.9% |
 * | 128 | 0.0072 | 4.6976 | 0.0080 | 4.2560 | 110.4% |
 * | 256 | 0.0087 | 15.2967 | 0.0133 | 10.0385 | 152.4% |
 * | 512 | 0.0114 | 46.4067 | 0.0266 | 19.8846 | 233.4% |
 * | 1024 | 0.0299 | 70.5852 | 0.1434 | 14.7000 | 480.2% |
 * | 1280 | 0.0403 | 81.7170 | 0.0554 | 59.4220 | 137.5% |
 * | 2048 | 0.0828 | 101.5198 | 0.0845 | 99.4829 | 102.0% |
 * | 4096 | 0.2801 | 119.9287 | 0.2335 | 143.8947 | 83.3% |
 *
 * ![strmv-lda-no-transpose-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad48.svg)
 *
 * ![strmv-lda-no-transpose-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 0.3619 | 0.0041 | 0.5781 | 62.6% |
 * | 64 | 0.0067 | 1.3269 | 0.0054 | 1.6478 | 80.5% |
 * | 128 | 0.0073 | 4.6362 | 0.0080 | 4.2731 | 108.5% |
 * | 256 | 0.0084 | 15.8182 | 0.0132 | 10.1606 | 155.7% |
 * | 512 | 0.0113 | 47.0000 | 0.0266 | 19.8846 | 236.4% |
 * | 1024 | 0.0291 | 72.3692 | 0.1436 | 14.6771 | 493.1% |
 * | 1280 | 0.0388 | 84.8535 | 0.0554 | 59.4048 | 142.8% |
 * | 2048 | 0.0828 | 101.6179 | 0.0840 | 100.1463 | 101.5% |
 * | 4096 | 0.2829 | 118.7687 | 0.2314 | 145.1681 | 81.8% |
 *
 * ![strmv-lda-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad64.svg)
 *
 * ![strmv-lda-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 0.3627 | 0.0041 | 0.5781 | 62.7% |
 * | 64 | 0.0068 | 1.2958 | 0.0054 | 1.6283 | 79.6% |
 * | 128 | 0.0071 | 4.8145 | 0.0080 | 4.2731 | 112.7% |
 * | 256 | 0.0086 | 15.5531 | 0.0132 | 10.0870 | 154.2% |
 * | 512 | 0.0117 | 45.3882 | 0.0266 | 19.8846 | 228.3% |
 * | 1024 | 0.0287 | 73.5000 | 0.1434 | 14.7000 | 500.0% |
 * | 1280 | 0.0389 | 84.5395 | 0.0551 | 59.6634 | 141.7% |
 * | 2048 | 0.0827 | 101.6573 | 0.0837 | 100.4334 | 101.2% |
 * | 4096 | 0.3025 | 111.0724 | 0.2320 | 144.8277 | 76.7% |
 *
 * ![strmv-lda-no-transpose-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad128.svg)
 *
 * ![strmv-lda-no-transpose-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad128.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (8 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.3052 | 0.0042 | 0.5649 | 54.0% |
 * | 64 | 0.0091 | 0.9684 | 0.0056 | 1.5682 | 61.8% |
 * | 128 | 0.0123 | 2.7708 | 0.0098 | 3.4771 | 79.7% |
 * | 256 | 0.0184 | 7.2500 | 0.0249 | 5.3711 | 135.0% |
 * | 512 | 0.0212 | 24.9344 | 0.0881 | 6.0116 | 414.8% |
 * | 1024 | 0.0383 | 55.0175 | 0.3482 | 6.0521 | 909.1% |
 * | 1280 | 0.0432 | 76.1764 | 0.2150 | 15.2976 | 498.0% |
 * | 2048 | 0.0624 | 134.8302 | 0.3294 | 25.5254 | 528.2% |
 * | 4096 | 0.2080 | 161.5039 | 1.0332 | 32.5149 | 496.7% |
 *
 * ![strmv-lda-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad0.svg)
 *
 * ![strmv-lda-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.2990 | 0.0041 | 0.5781 | 51.7% |
 * | 64 | 0.0094 | 0.9420 | 0.0056 | 1.5771 | 59.7% |
 * | 128 | 0.0123 | 2.7708 | 0.0082 | 4.1562 | 66.7% |
 * | 256 | 0.0184 | 7.2500 | 0.0160 | 8.3270 | 87.1% |
 * | 512 | 0.0210 | 25.2580 | 0.0490 | 10.8060 | 233.7% |
 * | 1024 | 0.0410 | 51.4500 | 0.1970 | 10.6953 | 481.1% |
 * | 1280 | 0.0454 | 72.4709 | 0.1516 | 21.7061 | 333.9% |
 * | 2048 | 0.0681 | 123.4307 | 0.1785 | 47.1108 | 262.0% |
 * | 4096 | 0.2278 | 147.4620 | 0.5339 | 62.9259 | 234.3% |
 *
 * ![strmv-lda-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad1.svg)
 *
 * ![strmv-lda-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0041 | 0.5781 | 50.0% |
 * | 64 | 0.0102 | 0.8625 | 0.0053 | 1.6727 | 51.6% |
 * | 128 | 0.0141 | 2.4072 | 0.0079 | 4.2990 | 56.0% |
 * | 256 | 0.0204 | 6.5557 | 0.0166 | 8.0540 | 81.4% |
 * | 512 | 0.0229 | 23.1385 | 0.0569 | 9.3022 | 248.7% |
 * | 1024 | 0.0424 | 49.6464 | 0.2320 | 9.0855 | 546.4% |
 * | 1280 | 0.0461 | 71.3393 | 0.1475 | 22.3066 | 319.8% |
 * | 2048 | 0.0696 | 120.8202 | 0.2197 | 38.2760 | 315.7% |
 * | 4096 | 0.2193 | 153.2077 | 0.6572 | 51.1177 | 299.7% |
 *
 * ![strmv-lda-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad8.svg)
 *
 * ![strmv-lda-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2885 | 0.0041 | 0.5781 | 49.9% |
 * | 64 | 0.0102 | 0.8625 | 0.0054 | 1.6429 | 52.5% |
 * | 128 | 0.0144 | 2.3566 | 0.0084 | 4.0688 | 57.9% |
 * | 256 | 0.0211 | 6.3369 | 0.0208 | 6.4147 | 98.8% |
 * | 512 | 0.0241 | 21.9708 | 0.0676 | 7.8333 | 280.5% |
 * | 1024 | 0.0431 | 48.9090 | 0.2845 | 7.4075 | 660.3% |
 * | 1280 | 0.0471 | 69.8370 | 0.1564 | 21.0268 | 332.1% |
 * | 2048 | 0.0678 | 123.9547 | 0.2505 | 33.5676 | 369.3% |
 * | 4096 | 0.2146 | 156.5314 | 0.7520 | 44.6728 | 350.4% |
 *
 * ![strmv-lda-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad16.svg)
 *
 * ![strmv-lda-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0087 | 0.2731 | 0.0042 | 0.5649 | 48.3% |
 * | 64 | 0.0104 | 0.8466 | 0.0057 | 1.5593 | 54.3% |
 * | 128 | 0.0148 | 2.2981 | 0.0101 | 3.3671 | 68.3% |
 * | 256 | 0.0215 | 6.2097 | 0.0256 | 5.2298 | 118.7% |
 * | 512 | 0.0246 | 21.5417 | 0.0922 | 5.7405 | 375.3% |
 * | 1024 | 0.0393 | 53.5850 | 0.3592 | 5.8669 | 913.3% |
 * | 1280 | 0.0432 | 76.1764 | 0.1988 | 16.5513 | 460.2% |
 * | 2048 | 0.0635 | 132.4516 | 0.3590 | 23.4231 | 565.5% |
 * | 4096 | 0.2093 | 160.5407 | 1.0506 | 31.9766 | 502.1% |
 *
 * ![strmv-lda-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad32.svg)
 *
 * ![strmv-lda-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.2990 | 0.0041 | 0.5781 | 51.7% |
 * | 64 | 0.0093 | 0.9485 | 0.0053 | 1.6627 | 57.0% |
 * | 128 | 0.0124 | 2.7494 | 0.0083 | 4.1240 | 66.7% |
 * | 256 | 0.0184 | 7.2500 | 0.0205 | 6.5250 | 111.1% |
 * | 512 | 0.0210 | 25.2387 | 0.0724 | 7.3155 | 345.0% |
 * | 1024 | 0.0391 | 53.9361 | 0.2847 | 7.4029 | 728.6% |
 * | 1280 | 0.0442 | 74.3580 | 0.1575 | 20.8858 | 356.0% |
 * | 2048 | 0.0666 | 126.3081 | 0.2785 | 30.1912 | 418.4% |
 * | 4096 | 0.2123 | 158.2300 | 0.7886 | 42.6009 | 371.4% |
 *
 * ![strmv-lda-transpose-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad48.svg)
 *
 * ![strmv-lda-transpose-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.3020 | 0.0041 | 0.5759 | 52.4% |
 * | 64 | 0.0091 | 0.9667 | 0.0057 | 1.5506 | 62.3% |
 * | 128 | 0.0124 | 2.7565 | 0.0098 | 3.4771 | 79.3% |
 * | 256 | 0.0184 | 7.2500 | 0.0269 | 4.9596 | 146.2% |
 * | 512 | 0.0215 | 24.5825 | 0.0901 | 5.8750 | 418.4% |
 * | 1024 | 0.0389 | 54.1579 | 0.3769 | 5.5917 | 968.5% |
 * | 1280 | 0.0430 | 76.5450 | 0.2045 | 16.0864 | 475.8% |
 * | 2048 | 0.0645 | 130.3169 | 0.3459 | 24.3138 | 536.0% |
 * | 4096 | 0.2116 | 158.7444 | 1.0895 | 30.8346 | 514.8% |
 *
 * ![strmv-lda-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad64.svg)
 *
 * ![strmv-lda-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0042 | 0.5670 | 51.0% |
 * | 64 | 0.0102 | 0.8625 | 0.0058 | 1.5333 | 56.3% |
 * | 128 | 0.0139 | 2.4544 | 0.0098 | 3.4715 | 70.7% |
 * | 256 | 0.0198 | 6.7628 | 0.0256 | 5.2135 | 129.7% |
 * | 512 | 0.0231 | 22.8824 | 0.0961 | 5.5073 | 415.5% |
 * | 1024 | 0.0410 | 51.4500 | 0.3625 | 5.8136 | 885.0% |
 * | 1280 | 0.0445 | 73.9834 | 0.1961 | 16.7727 | 441.1% |
 * | 2048 | 0.0653 | 128.8157 | 0.3641 | 23.0928 | 557.8% |
 * | 4096 | 0.2130 | 157.7308 | 1.0503 | 31.9859 | 493.1% |
 *
 * ![strmv-lda-transpose-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad128.svg)
 *
 * ![strmv-lda-transpose-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad128.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/lda.strmv.js) — WebGPU lda-sweep benchmark script
 * - [lda.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/lda.strmv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0065 | 0.3663 | 0.0041 | 0.5781 | 63.4% |
 * | 64 | 0.0065 | 1.3529 | 0.0054 | 1.6331 | 82.8% |
 * | 128 | 0.0068 | 5.0071 | 0.0080 | 4.2560 | 117.6% |
 * | 256 | 0.0086 | 15.5242 | 0.0137 | 9.7684 | 158.9% |
 * | 512 | 0.0116 | 45.7649 | 0.0266 | 19.8846 | 230.2% |
 * | 1024 | 0.0287 | 73.5000 | 0.1434 | 14.7000 | 500.0% |
 * | 1280 | 0.0389 | 84.5395 | 0.0553 | 59.4907 | 142.1% |
 * | 2048 | 0.0823 | 102.1314 | 0.0826 | 101.8345 | 100.3% |
 * | 4096 | 0.2765 | 121.5111 | 0.2273 | 147.7838 | 82.2% |
 *
 * ![strmv-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-diagnonunit.svg)
 *
 * ![strmv-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3592 | 0.0041 | 0.5781 | 62.1% |
 * | 64 | 0.0067 | 1.3269 | 0.0055 | 1.6188 | 82.0% |
 * | 128 | 0.0072 | 4.7289 | 0.0079 | 4.2903 | 110.2% |
 * | 256 | 0.0085 | 15.7585 | 0.0135 | 9.9075 | 159.1% |
 * | 512 | 0.0115 | 45.9556 | 0.0266 | 19.8846 | 231.1% |
 * | 1024 | 0.0287 | 73.5000 | 0.1434 | 14.7000 | 500.0% |
 * | 1280 | 0.0389 | 84.5395 | 0.1132 | 29.0560 | 291.0% |
 * | 2048 | 0.0825 | 101.9728 | 0.1838 | 45.7533 | 222.9% |
 * | 4096 | 0.2765 | 121.5111 | 0.3768 | 89.1560 | 136.3% |
 *
 * ![strmv-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-diagunit.svg)
 *
 * ![strmv-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/diag.strmv.js) — WebGPU diag-sweep benchmark script
 * - [diag.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/diag.strmv.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 32 | 0.0077 | 0.3083 |
 * | 64 | 0.0092 | 0.9567 |
 * | 128 | 0.0123 | 2.7708 |
 * | 256 | 0.0184 | 7.2500 |
 * | 512 | 0.0214 | 24.6925 |
 * | 1024 | 0.0388 | 54.3366 |
 * | 1280 | 0.0431 | 76.2611 |
 * | 2048 | 0.0627 | 134.2104 |
 * | 4096 | 0.2092 | 160.5530 |
 *
 * ![strmv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-layoutcolumnmajor.svg)
 *
 * ![strmv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0066 | 0.3592 |
 * | 64 | 0.0066 | 1.3366 |
 * | 128 | 0.0069 | 4.9032 |
 * | 256 | 0.0086 | 15.5531 |
 * | 512 | 0.0114 | 46.4067 |
 * | 1024 | 0.0286 | 73.7882 |
 * | 1280 | 0.0389 | 84.5395 |
 * | 2048 | 0.0822 | 102.2506 |
 * | 4096 | 0.2761 | 121.6872 |
 *
 * ![strmv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-layoutrowmajor.svg)
 *
 * ![strmv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/layout.strmv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmv
 */
