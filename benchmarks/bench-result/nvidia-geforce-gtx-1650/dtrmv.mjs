/**
 * Benchmark results for dtrmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0081 | 0.5873 | 0.0046 | 1.0350 | 56.7% |
 * | 64 | 0.0082 | 2.1562 | 0.0066 | 2.6667 | 80.9% |
 * | 128 | 0.0104 | 6.5276 | 0.0106 | 6.4485 | 101.2% |
 * | 256 | 0.0205 | 13.0500 | 0.0229 | 11.6811 | 111.7% |
 * | 512 | 0.0471 | 22.4783 | 0.0800 | 13.2352 | 169.8% |
 * | 1024 | 0.1436 | 29.3443 | 0.0860 | 49.0000 | 59.9% |
 * | 1280 | 0.2272 | 28.9537 | 0.1085 | 60.6132 | 47.8% |
 * | 2048 | 0.5041 | 33.3609 | 0.1733 | 97.0668 | 34.4% |
 * | 4096 | 3.0326 | 22.1562 | 0.6333 | 106.0889 | 20.9% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0059 | 0.7978 | 72.5% |
 * | 64 | 0.0080 | 2.1992 | 0.0066 | 2.6927 | 81.7% |
 * | 128 | 0.0096 | 7.1290 | 0.0104 | 6.5276 | 109.2% |
 * | 256 | 0.0145 | 18.4575 | 0.0231 | 11.5839 | 159.3% |
 * | 512 | 0.0279 | 37.9450 | 0.0810 | 13.0757 | 290.2% |
 * | 1024 | 0.0655 | 64.3125 | 0.0867 | 48.5933 | 132.3% |
 * | 1280 | 0.0918 | 71.6501 | 0.1085 | 60.6132 | 118.2% |
 * | 2048 | 0.1978 | 85.0227 | 0.1739 | 96.7095 | 87.9% |
 * | 4096 | 0.7374 | 91.1195 | 0.7279 | 92.3133 | 98.7% |
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
 * | 32 | 0.0080 | 0.5956 | 0.0047 | 1.0137 | 58.8% |
 * | 64 | 0.0116 | 1.5228 | 0.0063 | 2.7879 | 54.6% |
 * | 128 | 0.0101 | 6.7663 | 0.0106 | 6.4290 | 105.2% |
 * | 256 | 0.0146 | 18.2557 | 0.0231 | 11.5519 | 158.0% |
 * | 512 | 0.0262 | 40.3512 | 0.0814 | 13.0140 | 310.1% |
 * | 1024 | 0.0594 | 70.9655 | 0.0868 | 48.5485 | 146.2% |
 * | 1280 | 0.0815 | 80.7066 | 0.1085 | 60.6132 | 133.2% |
 * | 2048 | 0.1765 | 95.2634 | 0.1775 | 94.7311 | 100.6% |
 * | 4096 | 0.7947 | 84.5499 | 0.7212 | 93.1653 | 90.8% |
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
 * | 32 | 0.0079 | 0.5968 | 0.0047 | 1.0034 | 59.5% |
 * | 64 | 0.0082 | 2.1562 | 0.0065 | 2.7259 | 79.1% |
 * | 128 | 0.0105 | 6.4878 | 0.0105 | 6.5076 | 99.7% |
 * | 256 | 0.0200 | 13.3739 | 0.0231 | 11.5519 | 115.8% |
 * | 512 | 0.0471 | 22.4859 | 0.0867 | 12.2141 | 184.1% |
 * | 1024 | 0.1445 | 29.1592 | 0.0939 | 44.8916 | 65.0% |
 * | 1280 | 0.2171 | 30.3066 | 0.1152 | 57.0873 | 53.1% |
 * | 2048 | 0.5099 | 32.9841 | 0.2208 | 76.1748 | 43.3% |
 * | 4096 | 1.9132 | 35.1196 | 0.7480 | 89.8234 | 39.1% |
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
 * | 32 | 0.0078 | 0.6041 | 0.0045 | 1.0496 | 57.6% |
 * | 64 | 0.0081 | 2.1775 | 0.0064 | 2.7600 | 78.9% |
 * | 128 | 0.0097 | 7.0000 | 0.0106 | 6.4096 | 109.2% |
 * | 256 | 0.0145 | 18.3965 | 0.0280 | 9.5397 | 192.8% |
 * | 512 | 0.0302 | 35.0694 | 0.0872 | 12.1379 | 288.9% |
 * | 1024 | 0.0968 | 43.5484 | 0.0947 | 44.5048 | 97.9% |
 * | 1280 | 0.1458 | 45.1323 | 0.1720 | 38.2583 | 118.0% |
 * | 2048 | 0.3685 | 45.6341 | 0.2303 | 73.0209 | 62.5% |
 * | 4096 | 1.4685 | 45.7548 | 0.6430 | 104.4919 | 43.8% |
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
 * | 32 | 0.0079 | 0.6016 | 0.0045 | 1.0496 | 57.3% |
 * | 64 | 0.0081 | 2.1905 | 0.0133 | 1.3301 | 164.7% |
 * | 128 | 0.0098 | 6.9316 | 0.0154 | 4.4104 | 157.2% |
 * | 256 | 0.0146 | 18.2957 | 0.0302 | 8.8615 | 206.5% |
 * | 512 | 0.0306 | 34.5747 | 0.0889 | 11.9064 | 290.4% |
 * | 1024 | 0.0974 | 43.2552 | 0.1477 | 28.5400 | 151.6% |
 * | 1280 | 0.1479 | 44.4925 | 0.1155 | 56.9845 | 78.1% |
 * | 2048 | 0.3781 | 44.4775 | 0.2339 | 71.9020 | 61.9% |
 * | 4096 | 1.5327 | 43.8381 | 0.6375 | 105.3993 | 41.6% |
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
 * | 32 | 0.0081 | 0.5850 | 0.0046 | 1.0314 | 56.7% |
 * | 64 | 0.0082 | 2.1562 | 0.0132 | 1.3398 | 160.9% |
 * | 128 | 0.0107 | 6.3904 | 0.0163 | 4.1807 | 152.9% |
 * | 256 | 0.0200 | 13.3632 | 0.0315 | 8.4964 | 157.3% |
 * | 512 | 0.0471 | 22.4935 | 0.0891 | 11.8808 | 189.3% |
 * | 1024 | 0.1454 | 28.9859 | 0.1475 | 28.5678 | 101.5% |
 * | 1280 | 0.2171 | 30.3066 | 0.1239 | 53.0923 | 57.1% |
 * | 2048 | 0.5123 | 32.8275 | 0.6412 | 26.2305 | 125.2% |
 * | 4096 | 1.9359 | 34.7083 | 0.6820 | 98.5133 | 35.2% |
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
 * | 32 | 0.0077 | 0.6141 | 0.0047 | 1.0000 | 61.4% |
 * | 64 | 0.0080 | 2.2169 | 0.0064 | 2.7463 | 80.7% |
 * | 128 | 0.0092 | 7.3633 | 0.0107 | 6.3428 | 116.1% |
 * | 256 | 0.0143 | 18.6429 | 0.0230 | 11.6161 | 160.5% |
 * | 512 | 0.0260 | 40.7237 | 0.0810 | 13.0783 | 311.4% |
 * | 1024 | 0.0591 | 71.3113 | 0.0873 | 48.2992 | 147.6% |
 * | 1280 | 0.0810 | 81.2648 | 0.1085 | 60.6132 | 134.1% |
 * | 2048 | 0.1700 | 98.9398 | 0.1730 | 97.2014 | 101.8% |
 * | 4096 | 0.5689 | 118.1040 | 0.6311 | 106.4628 | 110.9% |
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
 * | 32 | 0.0081 | 0.5838 | 0.0048 | 0.9966 | 58.6% |
 * | 64 | 0.0082 | 2.1562 | 0.0070 | 2.5321 | 85.2% |
 * | 128 | 0.0105 | 6.5076 | 0.0110 | 6.2041 | 104.9% |
 * | 256 | 0.0189 | 14.1679 | 0.0295 | 9.0635 | 156.3% |
 * | 512 | 0.0458 | 23.1061 | 0.1060 | 9.9858 | 231.4% |
 * | 1024 | 0.1434 | 29.3934 | 0.1494 | 28.2190 | 104.2% |
 * | 1280 | 0.2300 | 28.6112 | 0.2248 | 29.2607 | 97.8% |
 * | 2048 | 0.5154 | 32.6318 | 0.3295 | 51.0409 | 63.9% |
 * | 4096 | 2.4910 | 26.9739 | 1.1510 | 58.3772 | 46.2% |
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
 * | 32 | 0.0079 | 0.6029 | 0.0046 | 1.0278 | 58.7% |
 * | 64 | 0.0080 | 2.2124 | 0.0067 | 2.6223 | 84.4% |
 * | 128 | 0.0091 | 7.4930 | 0.0106 | 6.4485 | 116.2% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7139 | 159.2% |
 * | 512 | 0.0261 | 40.5988 | 0.0801 | 13.2193 | 307.1% |
 * | 1024 | 0.0591 | 71.3113 | 0.0862 | 48.8909 | 145.9% |
 * | 1280 | 0.0807 | 81.5549 | 0.1080 | 60.9366 | 133.8% |
 * | 2048 | 0.1698 | 99.0516 | 0.1719 | 97.8347 | 101.2% |
 * | 4096 | 0.5692 | 118.0343 | 0.6349 | 105.8323 | 111.5% |
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
 * | 32 | 0.0080 | 0.5956 | 0.0046 | 1.0314 | 57.7% |
 * | 64 | 0.0081 | 2.1861 | 0.0064 | 2.7531 | 79.4% |
 * | 128 | 0.0093 | 7.2877 | 0.0104 | 6.5477 | 111.3% |
 * | 256 | 0.0143 | 18.6429 | 0.0227 | 11.7634 | 158.5% |
 * | 512 | 0.0257 | 41.2055 | 0.0819 | 12.9250 | 318.8% |
 * | 1024 | 0.0575 | 73.3159 | 0.0860 | 49.0000 | 149.6% |
 * | 1280 | 0.0929 | 70.8477 | 0.1066 | 61.7047 | 114.8% |
 * | 2048 | 0.1954 | 86.0811 | 0.1687 | 99.7188 | 86.3% |
 * | 4096 | 0.7147 | 94.0078 | 0.6302 | 106.6250 | 88.2% |
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
 * | 32 | 0.0079 | 0.6016 | 0.0046 | 1.0207 | 58.9% |
 * | 64 | 0.0079 | 2.2258 | 0.0065 | 2.6993 | 82.5% |
 * | 128 | 0.0093 | 7.3253 | 0.0106 | 6.4000 | 114.5% |
 * | 256 | 0.0164 | 16.3125 | 0.0228 | 11.6975 | 139.5% |
 * | 512 | 0.0263 | 40.2530 | 0.0810 | 13.0783 | 307.8% |
 * | 1024 | 0.0593 | 71.1188 | 0.0868 | 48.5574 | 146.5% |
 * | 1280 | 0.0809 | 81.3130 | 0.1086 | 60.5596 | 134.3% |
 * | 2048 | 0.1704 | 98.7260 | 0.1735 | 96.9146 | 101.9% |
 * | 4096 | 0.5693 | 118.0177 | 0.6331 | 106.1345 | 111.2% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0055 | 0.8605 | 67.2% |
 * | 64 | 0.0081 | 2.1775 | 0.0065 | 2.7125 | 80.3% |
 * | 128 | 0.0102 | 6.7024 | 0.0105 | 6.4878 | 103.3% |
 * | 256 | 0.0143 | 18.6429 | 0.0227 | 11.7634 | 158.5% |
 * | 512 | 0.0261 | 40.5490 | 0.0819 | 12.9250 | 313.7% |
 * | 1024 | 0.0596 | 70.7749 | 0.0868 | 48.5574 | 145.8% |
 * | 1280 | 0.0815 | 80.6907 | 0.1083 | 60.7655 | 132.8% |
 * | 2048 | 0.1720 | 97.7619 | 0.1725 | 97.5080 | 100.3% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0046 | 1.0278 | 56.2% |
 * | 64 | 0.0082 | 2.1562 | 0.0065 | 2.7327 | 78.9% |
 * | 128 | 0.0098 | 6.9656 | 0.0105 | 6.4681 | 107.7% |
 * | 256 | 0.0144 | 18.5600 | 0.0229 | 11.6893 | 158.8% |
 * | 512 | 0.0258 | 41.1031 | 0.0819 | 12.9250 | 318.0% |
 * | 1024 | 0.0594 | 70.9655 | 0.0875 | 48.1844 | 147.3% |
 * | 1280 | 0.0814 | 80.8494 | 0.1086 | 60.5864 | 133.4% |
 * | 2048 | 0.1711 | 98.3105 | 0.1757 | 95.7057 | 102.7% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0058 | 0.8222 | 70.3% |
 * | 64 | 0.0082 | 2.1562 | 0.0066 | 2.6796 | 80.5% |
 * | 128 | 0.0096 | 7.0698 | 0.0106 | 6.4096 | 110.3% |
 * | 256 | 0.0146 | 18.2757 | 0.0228 | 11.7221 | 155.9% |
 * | 512 | 0.0261 | 40.5739 | 0.0819 | 12.9250 | 313.9% |
 * | 1024 | 0.0594 | 70.9655 | 0.0870 | 48.4503 | 146.5% |
 * | 1280 | 0.0814 | 80.8017 | 0.1085 | 60.6400 | 133.2% |
 * | 2048 | 0.1715 | 98.0537 | 0.1743 | 96.5053 | 101.6% |
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
 * | 32 | 0.0090 | 0.5248 | 0.0048 | 0.9801 | 53.5% |
 * | 64 | 0.0082 | 2.1562 | 0.0064 | 2.7463 | 78.5% |
 * | 128 | 0.0097 | 7.0347 | 0.0105 | 6.4878 | 108.4% |
 * | 256 | 0.0145 | 18.4371 | 0.0228 | 11.7139 | 157.4% |
 * | 512 | 0.0257 | 41.2055 | 0.0819 | 12.9250 | 318.8% |
 * | 1024 | 0.0587 | 71.8168 | 0.0866 | 48.6921 | 147.5% |
 * | 1280 | 0.0806 | 81.5873 | 0.1080 | 60.9005 | 134.0% |
 * | 2048 | 0.1697 | 99.1264 | 0.1733 | 97.0399 | 102.2% |
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
 * | 32 | 0.0117 | 0.4049 | 0.0048 | 0.9900 | 40.9% |
 * | 64 | 0.0085 | 2.0870 | 0.0064 | 2.7395 | 76.2% |
 * | 128 | 0.0102 | 6.6604 | 0.0111 | 6.1503 | 108.3% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.7221 | 159.0% |
 * | 512 | 0.0261 | 40.5988 | 0.0819 | 12.9250 | 314.1% |
 * | 1024 | 0.0589 | 71.5049 | 0.0874 | 48.2373 | 148.2% |
 * | 1280 | 0.0808 | 81.4419 | 0.1085 | 60.6132 | 134.4% |
 * | 2048 | 0.1707 | 98.5317 | 0.1761 | 95.4884 | 103.2% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0045 | 1.0423 | 55.5% |
 * | 64 | 0.0100 | 1.7721 | 0.0074 | 2.3793 | 74.5% |
 * | 128 | 0.0102 | 6.6500 | 0.0104 | 6.5376 | 101.7% |
 * | 256 | 0.0143 | 18.6429 | 0.0228 | 11.6975 | 159.4% |
 * | 512 | 0.0261 | 40.5242 | 0.0817 | 12.9604 | 312.7% |
 * | 1024 | 0.0592 | 71.2534 | 0.0865 | 48.7191 | 146.3% |
 * | 1280 | 0.0805 | 81.7170 | 0.1080 | 60.9275 | 134.1% |
 * | 2048 | 0.1700 | 98.9398 | 0.1737 | 96.7986 | 102.2% |
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
 * | 32 | 0.0080 | 0.5908 | 0.0050 | 0.9427 | 62.7% |
 * | 64 | 0.0116 | 1.5270 | 0.0065 | 2.7192 | 56.2% |
 * | 128 | 0.0104 | 6.5276 | 0.0108 | 6.3333 | 103.1% |
 * | 256 | 0.0148 | 18.0779 | 0.0232 | 11.4962 | 157.3% |
 * | 512 | 0.0260 | 40.7237 | 0.0819 | 12.9250 | 315.1% |
 * | 1024 | 0.0588 | 71.6215 | 0.0868 | 48.5574 | 147.5% |
 * | 1280 | 0.0808 | 81.4419 | 0.1076 | 61.1450 | 133.2% |
 * | 2048 | 0.1695 | 99.2012 | 0.1732 | 97.0757 | 102.2% |
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
 * | 32 | 0.0080 | 0.5932 | 0.0055 | 0.8580 | 69.1% |
 * | 64 | 0.0082 | 2.1562 | 0.0074 | 2.3896 | 90.2% |
 * | 128 | 0.0123 | 5.5417 | 0.0114 | 5.9775 | 92.7% |
 * | 256 | 0.0195 | 13.7030 | 0.0288 | 9.2697 | 147.8% |
 * | 512 | 0.0456 | 23.2196 | 0.1065 | 9.9423 | 233.5% |
 * | 1024 | 0.1438 | 29.3149 | 0.1495 | 28.1918 | 104.0% |
 * | 1280 | 0.2304 | 28.5595 | 0.2241 | 29.3567 | 97.3% |
 * | 2048 | 0.5161 | 32.5873 | 0.3296 | 51.0235 | 63.9% |
 * | 4096 | 2.6125 | 25.7185 | 1.1530 | 58.2735 | 44.1% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0045 | 1.0459 | 55.3% |
 * | 64 | 0.0082 | 2.1562 | 0.0065 | 2.7259 | 79.1% |
 * | 128 | 0.0102 | 6.6500 | 0.0104 | 6.5376 | 101.7% |
 * | 256 | 0.0163 | 16.4086 | 0.0236 | 11.3018 | 145.2% |
 * | 512 | 0.0342 | 30.9523 | 0.0861 | 12.2935 | 251.8% |
 * | 1024 | 0.0996 | 42.3103 | 0.0891 | 47.3188 | 89.4% |
 * | 1280 | 0.1830 | 35.9535 | 0.1741 | 37.7802 | 95.2% |
 * | 2048 | 0.3786 | 44.4248 | 0.1862 | 90.3038 | 49.2% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0048 | 0.9933 | 58.2% |
 * | 64 | 0.0082 | 2.1562 | 0.0066 | 2.6731 | 80.7% |
 * | 128 | 0.0102 | 6.6500 | 0.0108 | 6.3333 | 105.0% |
 * | 256 | 0.0168 | 15.9542 | 0.0251 | 10.6531 | 149.8% |
 * | 512 | 0.0369 | 28.7222 | 0.0976 | 10.8450 | 264.8% |
 * | 1024 | 0.1105 | 38.1442 | 0.1161 | 36.2943 | 105.1% |
 * | 1280 | 0.1823 | 36.0955 | 0.1745 | 37.7075 | 95.7% |
 * | 2048 | 0.4076 | 41.2663 | 0.2867 | 58.6571 | 70.4% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0048 | 0.9801 | 59.0% |
 * | 64 | 0.0082 | 2.1562 | 0.0069 | 2.5615 | 84.2% |
 * | 128 | 0.0102 | 6.6500 | 0.0120 | 5.6975 | 116.7% |
 * | 256 | 0.0182 | 14.6913 | 0.0288 | 9.2697 | 158.5% |
 * | 512 | 0.0408 | 25.9616 | 0.1075 | 9.8506 | 263.6% |
 * | 1024 | 0.1250 | 33.7075 | 0.1681 | 25.0737 | 134.4% |
 * | 1280 | 0.1905 | 34.5430 | 0.2028 | 32.4495 | 106.5% |
 * | 2048 | 0.4404 | 38.1856 | 0.3439 | 48.9060 | 78.1% |
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
 * | 32 | 0.0100 | 0.4728 | 0.0055 | 0.8555 | 55.3% |
 * | 64 | 0.0101 | 1.7496 | 0.0077 | 2.3000 | 76.1% |
 * | 128 | 0.0123 | 5.5417 | 0.0120 | 5.6747 | 97.7% |
 * | 256 | 0.0196 | 13.6026 | 0.0303 | 8.8334 | 154.0% |
 * | 512 | 0.0687 | 15.4113 | 0.1153 | 9.1860 | 167.8% |
 * | 1024 | 0.1469 | 28.6829 | 0.1595 | 26.4243 | 108.5% |
 * | 1280 | 0.2191 | 30.0234 | 0.2024 | 32.5008 | 92.4% |
 * | 2048 | 0.5357 | 31.3941 | 0.3711 | 45.3154 | 69.3% |
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
 * | 32 | 0.0082 | 0.5781 | 0.0052 | 0.9193 | 62.9% |
 * | 64 | 0.0231 | 0.7645 | 0.0068 | 2.5855 | 29.6% |
 * | 128 | 0.0369 | 1.8432 | 0.0114 | 5.9859 | 30.8% |
 * | 256 | 0.0393 | 6.7985 | 0.0290 | 9.2287 | 73.7% |
 * | 512 | 0.0430 | 24.6190 | 0.1147 | 9.2321 | 266.7% |
 * | 1024 | 0.1279 | 32.9651 | 0.1563 | 26.9625 | 122.3% |
 * | 1280 | 0.1895 | 34.7268 | 0.2076 | 31.6966 | 109.6% |
 * | 2048 | 0.4645 | 36.2099 | 0.3604 | 46.6591 | 77.6% |
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
 * | 32 | 0.0081 | 0.5827 | 0.0051 | 0.9367 | 62.2% |
 * | 64 | 0.0082 | 2.1562 | 0.0068 | 2.6099 | 82.6% |
 * | 128 | 0.0108 | 6.2773 | 0.0111 | 6.1414 | 102.2% |
 * | 256 | 0.0189 | 14.1081 | 0.0288 | 9.2697 | 152.2% |
 * | 512 | 0.0465 | 22.7487 | 0.1099 | 9.6326 | 236.2% |
 * | 1024 | 0.1516 | 27.8108 | 0.1691 | 24.9289 | 111.6% |
 * | 1280 | 0.2413 | 27.2607 | 0.2118 | 31.0691 | 87.7% |
 * | 2048 | 0.5322 | 31.6008 | 0.3535 | 47.5821 | 66.4% |
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
 * | 32 | 0.0079 | 0.6029 | 0.0045 | 1.0534 | 57.2% |
 * | 64 | 0.0082 | 2.1562 | 0.0067 | 2.6411 | 81.6% |
 * | 128 | 0.0115 | 5.9276 | 0.0112 | 6.0541 | 97.9% |
 * | 256 | 0.0195 | 13.6918 | 0.0288 | 9.2800 | 147.5% |
 * | 512 | 0.0471 | 22.4783 | 0.1188 | 8.9138 | 252.2% |
 * | 1024 | 0.1475 | 28.5833 | 0.1616 | 26.0738 | 109.6% |
 * | 1280 | 0.2171 | 30.2999 | 0.1950 | 33.7436 | 89.8% |
 * | 2048 | 0.5497 | 30.5954 | 0.3914 | 42.9684 | 71.2% |
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
 * | 32 | 0.0094 | 0.5025 | 0.0061 | 0.7708 | 65.2% |
 * | 64 | 0.0100 | 1.7636 | 0.0083 | 2.1395 | 82.4% |
 * | 128 | 0.0123 | 5.5417 | 0.0141 | 4.8364 | 114.6% |
 * | 256 | 0.0181 | 14.7954 | 0.0304 | 8.8055 | 168.0% |
 * | 512 | 0.0328 | 32.3125 | 0.1035 | 10.2313 | 315.8% |
 * | 1024 | 0.0734 | 57.4534 | 0.1125 | 37.4714 | 153.3% |
 * | 1280 | 0.1006 | 65.4256 | 0.1391 | 47.2970 | 138.3% |
 * | 2048 | 0.2125 | 79.1399 | 0.2171 | 77.4717 | 102.2% |
 * | 4096 | 0.5687 | 118.1505 | 0.7987 | 84.1231 | 140.4% |
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
 * | 32 | 0.0078 | 0.6041 | 0.0059 | 0.8087 | 74.7% |
 * | 64 | 0.0082 | 2.1562 | 0.0082 | 2.1563 | 100.0% |
 * | 128 | 0.0110 | 6.1951 | 0.0131 | 5.2157 | 118.8% |
 * | 256 | 0.0143 | 18.6429 | 0.0287 | 9.3214 | 200.0% |
 * | 512 | 0.0260 | 40.7990 | 0.1007 | 10.5192 | 387.9% |
 * | 1024 | 0.0592 | 71.1764 | 0.1155 | 36.4954 | 195.0% |
 * | 1280 | 0.0804 | 81.8146 | 0.1505 | 43.7028 | 187.2% |
 * | 2048 | 0.1706 | 98.5964 | 0.2322 | 72.4172 | 136.2% |
 * | 4096 | 0.5691 | 118.0675 | 0.6742 | 99.6541 | 118.5% |
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
 * | 32 | 0.0082 | 0.5781 |
 * | 64 | 0.0098 | 1.8098 |
 * | 128 | 0.0105 | 6.4977 |
 * | 256 | 0.0200 | 13.3312 |
 * | 512 | 0.0471 | 22.4783 |
 * | 1024 | 0.1434 | 29.3967 |
 * | 1280 | 0.2276 | 28.9008 |
 * | 2048 | 0.5032 | 33.4246 |
 * | 4096 | 3.0454 | 22.0632 |
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
 * | 32 | 0.0087 | 0.5451 |
 * | 64 | 0.0082 | 2.1520 |
 * | 128 | 0.0091 | 7.4667 |
 * | 256 | 0.0145 | 18.4371 |
 * | 512 | 0.0261 | 40.6237 |
 * | 1024 | 0.0592 | 71.1380 |
 * | 1280 | 0.0808 | 81.4580 |
 * | 2048 | 0.1696 | 99.1731 |
 * | 4096 | 0.5682 | 118.2470 |
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
