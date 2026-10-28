/**
 * Benchmark results for dtrmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.6029 | 0.0046 | 1.0207 | 59.1% |
 * | 64 | 0.0082 | 2.1562 | 0.0065 | 2.6993 | 79.9% |
 * | 128 | 0.0105 | 6.4779 | 0.0107 | 6.3904 | 101.4% |
 * | 256 | 0.0201 | 13.2677 | 0.0228 | 11.7468 | 112.9% |
 * | 512 | 0.0466 | 22.7097 | 0.0803 | 13.1904 | 172.2% |
 * | 1024 | 0.0617 | 68.2799 | 0.0860 | 48.9818 | 139.4% |
 * | 1280 | 0.0983 | 66.9053 | 0.1083 | 60.7475 | 110.1% |
 * | 2048 | 0.1728 | 97.3004 | 0.1717 | 97.9441 | 99.3% |
 * | 4096 | 0.5780 | 116.2502 | 0.6309 | 106.5033 | 109.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dtrmv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-default.svg)
 *
 * ![dtrmv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-default.svg)
 *
 * ## See also
 *
 * - [dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/dtrmv.js) — WebGPU benchmark script
 * - [dtrmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/cuda/dtrmv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0078 | 0.6091 | 0.0046 | 1.0278 | 59.3% |
 * | 64 | 0.0081 | 2.1905 | 0.0065 | 2.7125 | 80.8% |
 * | 128 | 0.0096 | 7.0698 | 0.0106 | 6.4485 | 109.6% |
 * | 256 | 0.0146 | 18.3560 | 0.0229 | 11.6811 | 157.1% |
 * | 512 | 0.0280 | 37.8365 | 0.0804 | 13.1615 | 287.5% |
 * | 1024 | 0.0664 | 63.4757 | 0.0861 | 48.9727 | 129.6% |
 * | 1280 | 0.0922 | 71.3641 | 0.1076 | 61.1359 | 116.7% |
 * | 2048 | 0.1760 | 95.5752 | 0.1720 | 97.7983 | 97.7% |
 * | 4096 | 0.5755 | 116.7544 | 0.6367 | 105.5238 | 110.6% |
 *
 * ![dtrmv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-stride4.svg)
 *
 * ![dtrmv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.6066 | 0.0046 | 1.0278 | 59.0% |
 * | 64 | 0.0081 | 2.1818 | 0.0065 | 2.7192 | 80.2% |
 * | 128 | 0.0096 | 7.0933 | 0.0105 | 6.4681 | 109.7% |
 * | 256 | 0.0144 | 18.6013 | 0.0230 | 11.6000 | 160.4% |
 * | 512 | 0.0265 | 39.8891 | 0.0805 | 13.1510 | 303.3% |
 * | 1024 | 0.0601 | 70.1342 | 0.0861 | 48.9545 | 143.3% |
 * | 1280 | 0.0819 | 80.3125 | 0.1079 | 60.9818 | 131.7% |
 * | 2048 | 0.1760 | 95.5404 | 0.1742 | 96.5319 | 99.0% |
 * | 4096 | 0.5757 | 116.7123 | 0.6376 | 105.3861 | 110.7% |
 *
 * ![dtrmv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-stride5.svg)
 *
 * ![dtrmv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5968 | 0.0046 | 1.0207 | 58.5% |
 * | 64 | 0.0082 | 2.1562 | 0.0066 | 2.6927 | 80.1% |
 * | 128 | 0.0106 | 6.4193 | 0.0106 | 6.4000 | 100.3% |
 * | 256 | 0.0201 | 13.2994 | 0.0230 | 11.6000 | 114.6% |
 * | 512 | 0.0469 | 22.5857 | 0.0875 | 12.1002 | 186.7% |
 * | 1024 | 0.0670 | 62.8697 | 0.0887 | 47.5409 | 132.2% |
 * | 1280 | 0.0872 | 75.4357 | 0.1137 | 57.8503 | 130.4% |
 * | 2048 | 0.1778 | 94.5947 | 0.1785 | 94.2216 | 100.4% |
 * | 4096 | 0.5796 | 115.9293 | 0.6326 | 106.2177 | 109.1% |
 *
 * ![dtrmv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-stride32.svg)
 *
 * ![dtrmv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5968 | 0.0046 | 1.0350 | 57.7% |
 * | 64 | 0.0080 | 2.1948 | 0.0065 | 2.7059 | 81.1% |
 * | 128 | 0.0097 | 7.0231 | 0.0106 | 6.4290 | 109.2% |
 * | 256 | 0.0146 | 18.2757 | 0.0306 | 8.7455 | 209.0% |
 * | 512 | 0.0302 | 35.0138 | 0.0869 | 12.1826 | 287.4% |
 * | 1024 | 0.0674 | 62.5265 | 0.0898 | 46.9143 | 133.3% |
 * | 1280 | 0.0873 | 75.3528 | 0.1097 | 59.9504 | 125.7% |
 * | 2048 | 0.1782 | 94.3908 | 0.1798 | 93.5507 | 100.9% |
 * | 4096 | 0.5802 | 115.8015 | 0.6350 | 105.8189 | 109.4% |
 *
 * ![dtrmv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-stride33.svg)
 *
 * ![dtrmv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0081 | 0.5873 | 0.0046 | 1.0350 | 56.7% |
 * | 64 | 0.0082 | 2.1562 | 0.0132 | 1.3431 | 160.5% |
 * | 128 | 0.0102 | 6.6918 | 0.0117 | 5.8142 | 115.1% |
 * | 256 | 0.0147 | 18.1763 | 0.0300 | 8.9183 | 203.8% |
 * | 512 | 0.0307 | 34.4667 | 0.0863 | 12.2639 | 281.0% |
 * | 1024 | 0.0671 | 62.7798 | 0.0892 | 47.2425 | 132.9% |
 * | 1280 | 0.0881 | 74.7093 | 0.1133 | 58.0627 | 128.7% |
 * | 2048 | 0.1784 | 94.2892 | 0.1747 | 96.2931 | 97.9% |
 * | 4096 | 0.5822 | 115.4037 | 0.6352 | 105.7789 | 109.1% |
 *
 * ![dtrmv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-stride255.svg)
 *
 * ![dtrmv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5781 | 0.0046 | 1.0350 | 55.9% |
 * | 64 | 0.0084 | 2.1069 | 0.0131 | 1.3513 | 155.9% |
 * | 128 | 0.0108 | 6.3145 | 0.0118 | 5.7514 | 109.8% |
 * | 256 | 0.0202 | 13.2361 | 0.0297 | 9.0097 | 146.9% |
 * | 512 | 0.0471 | 22.4783 | 0.0886 | 11.9559 | 188.0% |
 * | 1024 | 0.0676 | 62.3636 | 0.0888 | 47.4638 | 131.4% |
 * | 1280 | 0.0881 | 74.7093 | 0.1132 | 58.1119 | 128.6% |
 * | 2048 | 0.1792 | 93.8598 | 0.1770 | 94.9965 | 98.8% |
 * | 4096 | 0.5816 | 115.5307 | 0.6369 | 105.4920 | 109.5% |
 *
 * ![dtrmv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-stride256.svg)
 *
 * ![dtrmv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/stride.dtrmv.js) — WebGPU stride-sweep benchmark script
 * - [stride.dtrmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/cuda/stride.dtrmv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0079 | 0.6016 | 0.0046 | 1.0350 | 58.1% |
 * | 64 | 0.0080 | 2.2213 | 0.0065 | 2.7327 | 81.3% |
 * | 128 | 0.0096 | 7.0698 | 0.0102 | 6.6500 | 106.3% |
 * | 256 | 0.0144 | 18.5188 | 0.0228 | 11.7139 | 158.1% |
 * | 512 | 0.0262 | 40.4005 | 0.0802 | 13.1982 | 306.1% |
 * | 1024 | 0.0597 | 70.5474 | 0.0862 | 48.9090 | 144.2% |
 * | 1280 | 0.0815 | 80.7541 | 0.1074 | 61.2543 | 131.8% |
 * | 2048 | 0.1713 | 98.1636 | 0.1715 | 98.0812 | 100.1% |
 * | 4096 | 0.5696 | 117.9680 | 0.6311 | 106.4601 | 110.8% |
 *
 * ![dtrmv-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-transno-transpose.svg)
 *
 * ![dtrmv-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.5944 | 0.0046 | 1.0278 | 57.8% |
 * | 64 | 0.0082 | 2.1562 | 0.0066 | 2.6602 | 81.1% |
 * | 128 | 0.0106 | 6.4096 | 0.0110 | 6.1771 | 103.8% |
 * | 256 | 0.0192 | 13.9084 | 0.0288 | 9.2697 | 150.0% |
 * | 512 | 0.0466 | 22.7409 | 0.1060 | 9.9934 | 227.6% |
 * | 1024 | 0.0623 | 67.6835 | 0.1495 | 28.1978 | 240.0% |
 * | 1280 | 0.0983 | 66.9271 | 0.2232 | 29.4725 | 227.1% |
 * | 2048 | 0.1700 | 98.9398 | 0.3293 | 51.0657 | 193.7% |
 * | 4096 | 0.6181 | 108.7117 | 1.1510 | 58.3764 | 186.2% |
 *
 * ![dtrmv-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-transtranspose.svg)
 *
 * ![dtrmv-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/trans.dtrmv.js) — WebGPU trans-sweep benchmark script
 * - [trans.dtrmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/cuda/trans.dtrmv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0079 | 0.5968 | 0.0046 | 1.0350 | 57.7% |
 * | 64 | 0.0081 | 2.1732 | 0.0064 | 2.7809 | 78.1% |
 * | 128 | 0.0096 | 7.0815 | 0.0104 | 6.5276 | 108.5% |
 * | 256 | 0.0143 | 18.6429 | 0.0227 | 11.7634 | 158.5% |
 * | 512 | 0.0263 | 40.2775 | 0.0802 | 13.2088 | 304.9% |
 * | 1024 | 0.0596 | 70.6609 | 0.0861 | 48.9363 | 144.4% |
 * | 1280 | 0.0814 | 80.8176 | 0.1074 | 61.2452 | 132.0% |
 * | 2048 | 0.1707 | 98.5132 | 0.1716 | 98.0172 | 100.5% |
 * | 4096 | 0.5699 | 117.9017 | 0.6311 | 106.4655 | 110.7% |
 *
 * ![dtrmv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-uplolower.svg)
 *
 * ![dtrmv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.6066 | 0.0046 | 1.0242 | 59.2% |
 * | 64 | 0.0080 | 2.1992 | 0.0064 | 2.7395 | 80.3% |
 * | 128 | 0.0093 | 7.2877 | 0.0102 | 6.6500 | 109.6% |
 * | 256 | 0.0143 | 18.6429 | 0.0227 | 11.7966 | 158.0% |
 * | 512 | 0.0259 | 40.8242 | 0.0819 | 12.9250 | 315.9% |
 * | 1024 | 0.0584 | 72.1512 | 0.0857 | 49.2013 | 146.6% |
 * | 1280 | 0.0802 | 82.0267 | 0.1065 | 61.7788 | 132.8% |
 * | 2048 | 0.1682 | 99.9939 | 0.1682 | 100.0034 | 100.0% |
 * | 4096 | 0.5677 | 118.3470 | 0.6294 | 106.7469 | 110.9% |
 *
 * ![dtrmv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-uploupper.svg)
 *
 * ![dtrmv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/uplo.dtrmv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dtrmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/cuda/uplo.dtrmv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0080 | 0.5908 | 0.0046 | 1.0207 | 57.9% |
 * | 64 | 0.0081 | 2.1775 | 0.0065 | 2.7327 | 79.7% |
 * | 128 | 0.0095 | 7.2014 | 0.0106 | 6.4193 | 112.2% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7139 | 159.2% |
 * | 512 | 0.0264 | 40.1310 | 0.0802 | 13.2061 | 303.9% |
 * | 1024 | 0.0598 | 70.4531 | 0.0860 | 48.9909 | 143.8% |
 * | 1280 | 0.0815 | 80.7541 | 0.1074 | 61.2452 | 131.9% |
 * | 2048 | 0.1711 | 98.2921 | 0.1716 | 97.9806 | 100.3% |
 * | 4096 | 0.5697 | 117.9348 | 0.6311 | 106.4655 | 110.8% |
 *
 * ![dtrmv-lda-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad0.svg)
 *
 * ![dtrmv-lda-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.6066 | 0.0047 | 1.0137 | 59.8% |
 * | 64 | 0.0080 | 2.2124 | 0.0065 | 2.7327 | 81.0% |
 * | 128 | 0.0097 | 7.0000 | 0.0106 | 6.4387 | 108.7% |
 * | 256 | 0.0145 | 18.3762 | 0.0229 | 11.6811 | 157.3% |
 * | 512 | 0.0264 | 40.0339 | 0.0819 | 12.9275 | 309.7% |
 * | 1024 | 0.0610 | 69.1220 | 0.0866 | 48.6561 | 142.1% |
 * | 1280 | 0.0819 | 80.3125 | 0.1082 | 60.7834 | 132.1% |
 * | 2048 | 0.1720 | 97.7619 | 0.1721 | 97.6983 | 100.1% |
 *
 * ![dtrmv-lda-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad1.svg)
 *
 * ![dtrmv-lda-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5992 | 0.0045 | 1.0423 | 57.5% |
 * | 64 | 0.0080 | 2.2213 | 0.0064 | 2.7463 | 80.9% |
 * | 128 | 0.0098 | 6.9542 | 0.0104 | 6.5477 | 106.2% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7303 | 158.9% |
 * | 512 | 0.0263 | 40.2041 | 0.0817 | 12.9655 | 310.1% |
 * | 1024 | 0.0603 | 69.9108 | 0.0865 | 48.7281 | 143.5% |
 * | 1280 | 0.0819 | 80.3125 | 0.1080 | 60.9185 | 131.8% |
 * | 2048 | 0.1717 | 97.9258 | 0.1728 | 97.3184 | 100.6% |
 *
 * ![dtrmv-lda-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad8.svg)
 *
 * ![dtrmv-lda-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.5956 | 0.0046 | 1.0207 | 58.3% |
 * | 64 | 0.0080 | 2.2213 | 0.0064 | 2.7531 | 80.7% |
 * | 128 | 0.0098 | 6.9542 | 0.0106 | 6.4485 | 107.8% |
 * | 256 | 0.0143 | 18.6429 | 0.0229 | 11.6811 | 159.6% |
 * | 512 | 0.0259 | 40.9252 | 0.0819 | 12.9250 | 316.6% |
 * | 1024 | 0.0600 | 70.2090 | 0.0864 | 48.7642 | 144.0% |
 * | 1280 | 0.0913 | 72.0266 | 0.1082 | 60.7834 | 118.5% |
 * | 2048 | 0.1902 | 88.4199 | 0.1728 | 97.3004 | 90.9% |
 *
 * ![dtrmv-lda-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad16.svg)
 *
 * ![dtrmv-lda-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0085 | 0.5543 | 0.0047 | 1.0137 | 54.7% |
 * | 64 | 0.0088 | 2.0183 | 0.0064 | 2.7463 | 73.5% |
 * | 128 | 0.0107 | 6.3904 | 0.0105 | 6.4681 | 98.8% |
 * | 256 | 0.0164 | 16.3125 | 0.0228 | 11.7468 | 138.9% |
 * | 512 | 0.0291 | 36.3405 | 0.0818 | 12.9452 | 280.7% |
 * | 1024 | 0.0704 | 59.8283 | 0.0866 | 48.6921 | 122.9% |
 * | 1280 | 0.0948 | 69.3774 | 0.1079 | 60.9727 | 113.8% |
 * | 2048 | 0.2035 | 82.6430 | 0.1735 | 96.9325 | 85.3% |
 *
 * ![dtrmv-lda-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad32.svg)
 *
 * ![dtrmv-lda-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0085 | 0.5564 | 0.0047 | 1.0137 | 54.9% |
 * | 64 | 0.0082 | 2.1562 | 0.0065 | 2.7059 | 79.7% |
 * | 128 | 0.0097 | 6.9885 | 0.0105 | 6.4681 | 108.0% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7303 | 158.9% |
 * | 512 | 0.0260 | 40.7488 | 0.0815 | 12.9961 | 313.5% |
 * | 1024 | 0.0601 | 70.1529 | 0.0864 | 48.8093 | 143.7% |
 * | 1280 | 0.0819 | 80.3439 | 0.1083 | 60.7565 | 132.2% |
 * | 2048 | 0.1719 | 97.8165 | 0.1747 | 96.2755 | 101.6% |
 *
 * ![dtrmv-lda-no-transpose-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad48.svg)
 *
 * ![dtrmv-lda-no-transpose-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.5944 | 0.0045 | 1.0423 | 57.0% |
 * | 64 | 0.0080 | 2.1992 | 0.0064 | 2.7463 | 80.1% |
 * | 128 | 0.0097 | 6.9885 | 0.0105 | 6.5076 | 107.4% |
 * | 256 | 0.0143 | 18.6429 | 0.0227 | 11.7634 | 158.5% |
 * | 512 | 0.0259 | 40.8494 | 0.0814 | 13.0012 | 314.2% |
 * | 1024 | 0.0597 | 70.5474 | 0.0870 | 48.4592 | 145.6% |
 * | 1280 | 0.0816 | 80.6116 | 0.1079 | 60.9818 | 132.2% |
 * | 2048 | 0.1716 | 98.0172 | 0.1741 | 96.6118 | 101.5% |
 *
 * ![dtrmv-lda-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad64.svg)
 *
 * ![dtrmv-lda-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5781 | 0.0045 | 1.0496 | 55.1% |
 * | 64 | 0.0082 | 2.1562 | 0.0065 | 2.7327 | 78.9% |
 * | 128 | 0.0096 | 7.0698 | 0.0105 | 6.4681 | 109.3% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7139 | 159.2% |
 * | 512 | 0.0259 | 40.8494 | 0.0814 | 13.0140 | 313.9% |
 * | 1024 | 0.0596 | 70.7558 | 0.0867 | 48.6291 | 145.5% |
 * | 1280 | 0.0816 | 80.6433 | 0.1071 | 61.4098 | 131.3% |
 * | 2048 | 0.1966 | 85.5417 | 0.1733 | 97.0309 | 88.2% |
 *
 * ![dtrmv-lda-no-transpose-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-no-transpose-pad128.svg)
 *
 * ![dtrmv-lda-no-transpose-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-no-transpose-pad128.svg)
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
 * | 32 | 0.0089 | 0.5343 | 0.0046 | 1.0350 | 51.6% |
 * | 64 | 0.0095 | 1.8649 | 0.0067 | 2.6538 | 70.3% |
 * | 128 | 0.0123 | 5.5273 | 0.0109 | 6.2222 | 88.8% |
 * | 256 | 0.0226 | 11.8133 | 0.0289 | 9.2389 | 127.9% |
 * | 512 | 0.0532 | 19.8846 | 0.1060 | 9.9918 | 199.0% |
 * | 1024 | 0.0736 | 57.2785 | 0.1495 | 28.1918 | 203.2% |
 * | 1280 | 0.1124 | 58.5171 | 0.2228 | 29.5275 | 198.2% |
 * | 2048 | 0.1706 | 98.5779 | 0.3294 | 51.0607 | 193.1% |
 * | 4096 | 0.5745 | 116.9528 | 1.1509 | 58.3813 | 200.3% |
 *
 * ![dtrmv-lda-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad0.svg)
 *
 * ![dtrmv-lda-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.6004 | 0.0044 | 1.0686 | 56.2% |
 * | 64 | 0.0082 | 2.1562 | 0.0064 | 2.7531 | 78.3% |
 * | 128 | 0.0101 | 6.7129 | 0.0105 | 6.5076 | 103.2% |
 * | 256 | 0.0164 | 16.3125 | 0.0235 | 11.3555 | 143.7% |
 * | 512 | 0.0471 | 22.4783 | 0.0860 | 12.3095 | 182.6% |
 * | 1024 | 0.0635 | 66.3871 | 0.0886 | 47.5495 | 139.6% |
 * | 1280 | 0.0986 | 66.6991 | 0.1744 | 37.7282 | 176.8% |
 * | 2048 | 0.1726 | 97.4628 | 0.1860 | 90.4436 | 107.8% |
 *
 * ![dtrmv-lda-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad1.svg)
 *
 * ![dtrmv-lda-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.5944 | 0.0047 | 1.0137 | 58.6% |
 * | 64 | 0.0082 | 2.1562 | 0.0067 | 2.6411 | 81.6% |
 * | 128 | 0.0102 | 6.6500 | 0.0108 | 6.3333 | 105.0% |
 * | 256 | 0.0166 | 16.0615 | 0.0250 | 10.6803 | 150.4% |
 * | 512 | 0.0472 | 22.4249 | 0.0977 | 10.8343 | 207.0% |
 * | 1024 | 0.0635 | 66.3871 | 0.1158 | 36.4046 | 182.4% |
 * | 1280 | 0.0983 | 66.9053 | 0.1761 | 37.3546 | 179.1% |
 * | 2048 | 0.1741 | 96.6029 | 0.2866 | 58.6768 | 164.6% |
 *
 * ![dtrmv-lda-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad8.svg)
 *
 * ![dtrmv-lda-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.5908 | 0.0047 | 1.0102 | 58.5% |
 * | 64 | 0.0082 | 2.1562 | 0.0063 | 2.8163 | 76.6% |
 * | 128 | 0.0103 | 6.6293 | 0.0109 | 6.2405 | 106.2% |
 * | 256 | 0.0179 | 14.9410 | 0.0288 | 9.2800 | 161.0% |
 * | 512 | 0.0471 | 22.4935 | 0.1085 | 9.7547 | 230.6% |
 * | 1024 | 0.0635 | 66.3871 | 0.1679 | 25.0976 | 264.5% |
 * | 1280 | 0.0986 | 66.7208 | 0.2032 | 32.3830 | 206.0% |
 * | 2048 | 0.1720 | 97.7619 | 0.3441 | 48.8810 | 200.0% |
 *
 * ![dtrmv-lda-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad16.svg)
 *
 * ![dtrmv-lda-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5992 | 0.0046 | 1.0278 | 58.3% |
 * | 64 | 0.0082 | 2.1562 | 0.0067 | 2.6411 | 81.6% |
 * | 128 | 0.0108 | 6.3239 | 0.0109 | 6.2222 | 101.6% |
 * | 256 | 0.0192 | 13.9549 | 0.0288 | 9.2903 | 150.2% |
 * | 512 | 0.0464 | 22.8114 | 0.1147 | 9.2321 | 247.1% |
 * | 1024 | 0.0638 | 66.0211 | 0.1583 | 26.6300 | 247.9% |
 * | 1280 | 0.0994 | 66.2158 | 0.2012 | 32.7076 | 202.4% |
 * | 2048 | 0.1722 | 97.6711 | 0.3717 | 45.2432 | 215.9% |
 *
 * ![dtrmv-lda-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad32.svg)
 *
 * ![dtrmv-lda-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.6016 | 0.0046 | 1.0278 | 58.5% |
 * | 64 | 0.0082 | 2.1562 | 0.0066 | 2.6796 | 80.5% |
 * | 128 | 0.0104 | 6.5477 | 0.0109 | 6.2405 | 104.9% |
 * | 256 | 0.0178 | 15.0216 | 0.0288 | 9.2748 | 162.0% |
 * | 512 | 0.0468 | 22.6320 | 0.1151 | 9.1962 | 246.1% |
 * | 1024 | 0.0635 | 66.3871 | 0.1562 | 26.9902 | 246.0% |
 * | 1280 | 0.0987 | 66.6667 | 0.2080 | 31.6235 | 210.8% |
 * | 2048 | 0.1736 | 96.8878 | 0.3608 | 46.6177 | 207.8% |
 *
 * ![dtrmv-lda-transpose-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad48.svg)
 *
 * ![dtrmv-lda-transpose-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0081 | 0.5850 | 0.0047 | 1.0137 | 57.7% |
 * | 64 | 0.0082 | 2.1562 | 0.0067 | 2.6411 | 81.6% |
 * | 128 | 0.0108 | 6.2959 | 0.0110 | 6.2041 | 101.5% |
 * | 256 | 0.0192 | 13.9200 | 0.0288 | 9.2697 | 150.2% |
 * | 512 | 0.0465 | 22.7800 | 0.1101 | 9.6158 | 236.9% |
 * | 1024 | 0.0635 | 66.3871 | 0.1679 | 25.0976 | 264.5% |
 * | 1280 | 0.0984 | 66.8401 | 0.2112 | 31.1539 | 214.5% |
 * | 2048 | 0.1717 | 97.9623 | 0.3531 | 47.6252 | 205.7% |
 *
 * ![dtrmv-lda-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad64.svg)
 *
 * ![dtrmv-lda-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5992 | 0.0046 | 1.0207 | 58.7% |
 * | 64 | 0.0082 | 2.1562 | 0.0067 | 2.6286 | 82.0% |
 * | 128 | 0.0107 | 6.3713 | 0.0111 | 6.1592 | 103.4% |
 * | 256 | 0.0190 | 14.0370 | 0.0288 | 9.2955 | 151.0% |
 * | 512 | 0.0465 | 22.7879 | 0.1187 | 8.9174 | 255.5% |
 * | 1024 | 0.0686 | 61.4472 | 0.1616 | 26.0790 | 235.6% |
 * | 1280 | 0.1048 | 62.7786 | 0.1948 | 33.7797 | 185.8% |
 * | 2048 | 0.1884 | 89.2609 | 0.3871 | 43.4497 | 205.4% |
 *
 * ![dtrmv-lda-transpose-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-lda-transpose-pad128.svg)
 *
 * ![dtrmv-lda-transpose-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-lda-transpose-pad128.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/lda.dtrmv.js) — WebGPU lda-sweep benchmark script
 * - [lda.dtrmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/cuda/lda.dtrmv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0080 | 0.5920 | 0.0046 | 1.0278 | 57.6% |
 * | 64 | 0.0080 | 2.2080 | 0.0063 | 2.8163 | 78.4% |
 * | 128 | 0.0094 | 7.2381 | 0.0103 | 6.5882 | 109.9% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7386 | 158.8% |
 * | 512 | 0.0264 | 40.1797 | 0.0802 | 13.1982 | 304.4% |
 * | 1024 | 0.0598 | 70.4719 | 0.0861 | 48.9636 | 143.9% |
 * | 1280 | 0.0813 | 80.8812 | 0.1076 | 61.1450 | 132.3% |
 * | 2048 | 0.1711 | 98.2829 | 0.1720 | 97.8074 | 100.5% |
 * | 4096 | 0.5700 | 117.8720 | 0.6311 | 106.4601 | 110.7% |
 *
 * ![dtrmv-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-diagnonunit.svg)
 *
 * ![dtrmv-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5992 | 0.0046 | 1.0278 | 58.3% |
 * | 64 | 0.0079 | 2.2258 | 0.0064 | 2.7395 | 81.2% |
 * | 128 | 0.0097 | 7.0115 | 0.0105 | 6.4583 | 108.6% |
 * | 256 | 0.0144 | 18.6221 | 0.0225 | 11.8552 | 157.1% |
 * | 512 | 0.0263 | 40.2041 | 0.0801 | 13.2193 | 304.1% |
 * | 1024 | 0.0598 | 70.5285 | 0.1155 | 36.5055 | 193.2% |
 * | 1280 | 0.0815 | 80.7224 | 0.1498 | 43.9269 | 183.8% |
 * | 2048 | 0.1716 | 98.0080 | 0.2321 | 72.4522 | 135.3% |
 * | 4096 | 0.5704 | 117.7893 | 0.6725 | 99.9102 | 117.9% |
 *
 * ![dtrmv-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-diagunit.svg)
 *
 * ![dtrmv-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/diag.dtrmv.js) — WebGPU diag-sweep benchmark script
 * - [diag.dtrmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/cuda/diag.dtrmv.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 32 | 0.0079 | 0.6016 |
 * | 64 | 0.0082 | 2.1562 |
 * | 128 | 0.0108 | 6.2773 |
 * | 256 | 0.0201 | 13.3206 |
 * | 512 | 0.0466 | 22.7019 |
 * | 1024 | 0.0614 | 68.6000 |
 * | 1280 | 0.0988 | 66.6235 |
 * | 2048 | 0.1724 | 97.5442 |
 * | 4096 | 0.5781 | 116.2181 |
 *
 * ![dtrmv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-layoutcolumnmajor.svg)
 *
 * ![dtrmv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0077 | 0.6116 |
 * | 64 | 0.0079 | 2.2348 |
 * | 128 | 0.0096 | 7.1171 |
 * | 256 | 0.0143 | 18.6429 |
 * | 512 | 0.0264 | 40.1553 |
 * | 1024 | 0.0598 | 70.4342 |
 * | 1280 | 0.0814 | 80.8335 |
 * | 2048 | 0.1716 | 97.9989 |
 * | 4096 | 0.5696 | 117.9613 |
 *
 * ![dtrmv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/gbps-layoutrowmajor.svg)
 *
 * ![dtrmv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrmv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dtrmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrmv/wgblas/layout.dtrmv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dtrmv
 */
