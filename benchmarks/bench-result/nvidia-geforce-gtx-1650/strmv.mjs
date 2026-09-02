/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3558 | 0.0160 | 0.1480 | 240.4% |
 * | 64 | 0.0068 | 1.2988 | 0.0182 | 0.4842 | 268.2% |
 * | 128 | 0.0077 | 4.4333 | 0.0204 | 1.6677 | 265.8% |
 * | 256 | 0.0107 | 12.4657 | 0.0266 | 5.0192 | 248.4% |
 * | 512 | 0.0211 | 25.0477 | 0.0416 | 12.7213 | 196.9% |
 * | 1024 | 0.0609 | 34.6246 | 0.1649 | 12.7764 | 271.0% |
 * | 1280 | 0.0963 | 34.1755 | 0.0662 | 49.6618 | 68.8% |
 * | 2048 | 0.2331 | 36.0818 | 0.0963 | 87.3617 | 41.3% |
 * | 4096 | 3.6448 | 9.2174 | 0.2301 | 146.0161 | 6.3% |
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
 * | 32 | 0.0067 | 0.3524 | 0.0042 | 0.5649 | 62.4% |
 * | 64 | 0.0068 | 1.3081 | 0.0060 | 1.4681 | 89.1% |
 * | 128 | 0.0072 | 4.7500 | 0.0081 | 4.1972 | 113.2% |
 * | 256 | 0.0087 | 15.3529 | 0.0133 | 10.0385 | 152.9% |
 * | 512 | 0.0120 | 44.0000 | 0.0439 | 12.0539 | 365.0% |
 * | 1024 | 0.0287 | 73.4181 | 0.1616 | 13.0434 | 562.9% |
 * | 1280 | 0.0398 | 82.6699 | 0.0552 | 59.5769 | 138.8% |
 * | 2048 | 0.0833 | 100.8961 | 0.0834 | 100.7994 | 100.1% |
 * | 4096 | 0.2811 | 119.4987 | 0.2555 | 131.5032 | 90.9% |
 *
 * ![strmv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride4.svg)
 *
 * ![strmv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3507 | 0.0150 | 0.1580 | 222.0% |
 * | 64 | 0.0069 | 1.2778 | 0.0179 | 0.4933 | 259.0% |
 * | 128 | 0.0080 | 4.2475 | 0.0200 | 1.6983 | 250.1% |
 * | 256 | 0.0116 | 11.4725 | 0.0259 | 5.1556 | 222.5% |
 * | 512 | 0.0217 | 24.4372 | 0.0597 | 8.8660 | 275.6% |
 * | 1024 | 0.0613 | 34.3537 | 0.7764 | 2.7143 | 1265.7% |
 * | 1280 | 0.0902 | 36.4798 | 0.0621 | 53.0033 | 68.8% |
 * | 2048 | 0.2191 | 38.3766 | 0.0910 | 92.4157 | 41.5% |
 * | 4096 | 1.0508 | 31.9722 | 0.2384 | 140.9392 | 22.7% |
 *
 * ![strmv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-stride32.svg)
 *
 * ![strmv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.3426 | 0.0041 | 0.5781 | 59.3% |
 * | 64 | 0.0072 | 1.2212 | 0.0053 | 1.6527 | 73.9% |
 * | 128 | 0.0079 | 4.3252 | 0.0149 | 2.2833 | 189.4% |
 * | 256 | 0.0117 | 11.3943 | 0.0147 | 9.1179 | 125.0% |
 * | 512 | 0.0216 | 24.4734 | 0.0470 | 11.2659 | 217.2% |
 * | 1024 | 0.0614 | 34.3000 | 0.1476 | 14.2762 | 240.3% |
 * | 1280 | 0.0901 | 36.5057 | 0.0615 | 53.5277 | 68.2% |
 * | 2048 | 0.2188 | 38.4243 | 0.0915 | 91.8825 | 41.8% |
 * | 4096 | 0.8294 | 40.5037 | 1.0918 | 30.7700 | 131.6% |
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
 * | 32 | 0.0067 | 0.3524 | 0.0147 | 0.1610 | 218.9% |
 * | 64 | 0.0069 | 1.2837 | 0.0164 | 0.5391 | 238.1% |
 * | 128 | 0.0070 | 4.8364 | 0.0208 | 1.6394 | 295.0% |
 * | 256 | 0.0086 | 15.5531 | 0.0266 | 5.0192 | 309.9% |
 * | 512 | 0.0115 | 46.2123 | 0.0411 | 12.8847 | 358.7% |
 * | 1024 | 0.0287 | 73.5000 | 0.1658 | 12.7086 | 578.3% |
 * | 1280 | 0.0389 | 84.4700 | 0.0674 | 48.7782 | 173.2% |
 * | 2048 | 0.0819 | 102.6500 | 0.0964 | 87.2312 | 117.7% |
 * | 4096 | 0.2778 | 120.9163 | 0.2291 | 146.6177 | 82.5% |
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
 * | 32 | 0.0069 | 0.3410 | 0.0042 | 0.5606 | 60.8% |
 * | 64 | 0.0073 | 1.2105 | 0.0056 | 1.5637 | 77.4% |
 * | 128 | 0.0079 | 4.2903 | 0.0100 | 3.4103 | 125.8% |
 * | 256 | 0.0115 | 11.6323 | 0.0251 | 5.3197 | 218.7% |
 * | 512 | 0.0208 | 25.4523 | 0.0892 | 5.9361 | 428.8% |
 * | 1024 | 0.0611 | 34.4976 | 0.3497 | 6.0255 | 572.5% |
 * | 1280 | 0.0980 | 33.5728 | 0.2154 | 15.2703 | 219.9% |
 * | 2048 | 0.2148 | 39.1543 | 0.3310 | 25.4057 | 154.1% |
 * | 4096 | 1.1428 | 29.3978 | 1.0343 | 32.4822 | 90.5% |
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
 * | 32 | 0.0068 | 0.3458 | 0.0160 | 0.1481 | 233.5% |
 * | 64 | 0.0068 | 1.3081 | 0.0180 | 0.4894 | 267.3% |
 * | 128 | 0.0070 | 4.8474 | 0.0203 | 1.6796 | 288.6% |
 * | 256 | 0.0086 | 15.5242 | 0.0266 | 5.0222 | 309.1% |
 * | 512 | 0.0116 | 45.5758 | 0.0420 | 12.5906 | 362.0% |
 * | 1024 | 0.0287 | 73.5000 | 0.1639 | 12.8612 | 571.5% |
 * | 1280 | 0.0391 | 84.0900 | 0.0664 | 49.5661 | 169.7% |
 * | 2048 | 0.0819 | 102.6500 | 0.0865 | 97.1655 | 105.6% |
 * | 4096 | 0.2770 | 121.3005 | 0.2284 | 147.1108 | 82.5% |
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
 * | 32 | 0.0069 | 0.3434 | 0.0041 | 0.5781 | 59.4% |
 * | 64 | 0.0069 | 1.2719 | 0.0054 | 1.6331 | 77.9% |
 * | 128 | 0.0073 | 4.6872 | 0.0080 | 4.2560 | 110.1% |
 * | 256 | 0.0090 | 14.8877 | 0.0131 | 10.2103 | 145.8% |
 * | 512 | 0.0123 | 43.0833 | 0.0266 | 19.8846 | 216.7% |
 * | 1024 | 0.0302 | 69.6889 | 0.1469 | 14.3446 | 485.8% |
 * | 1280 | 0.0429 | 76.7451 | 0.0718 | 45.8417 | 167.4% |
 * | 2048 | 0.0842 | 99.8799 | 0.1029 | 81.7369 | 122.2% |
 * | 4096 | 0.3256 | 103.1850 | 0.2608 | 128.8088 | 80.1% |
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
 * | 32 | 0.0067 | 0.3558 | 0.0159 | 0.1492 | 238.5% |
 * | 64 | 0.0068 | 1.2958 | 0.0164 | 0.5391 | 240.4% |
 * | 128 | 0.0073 | 4.6769 | 0.0194 | 1.7558 | 266.4% |
 * | 256 | 0.0086 | 15.5242 | 0.0260 | 5.1302 | 302.6% |
 * | 512 | 0.0112 | 47.4040 | 0.0426 | 12.4158 | 381.8% |
 * | 1024 | 0.0287 | 73.5000 | 0.1643 | 12.8237 | 573.2% |
 * | 1280 | 0.0390 | 84.4353 | 0.0671 | 49.0458 | 172.2% |
 * | 2048 | 0.0819 | 102.6500 | 0.0965 | 87.1300 | 117.8% |
 * | 4096 | 0.2767 | 121.4338 | 0.2293 | 146.4847 | 82.9% |
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
 * | 32 | 0.0069 | 0.3442 | 0.0042 | 0.5606 | 61.4% |
 * | 64 | 0.0068 | 1.3019 | 0.0054 | 1.6283 | 80.0% |
 * | 128 | 0.0074 | 4.6061 | 0.0081 | 4.2139 | 109.3% |
 * | 256 | 0.0086 | 15.4667 | 0.0134 | 9.9904 | 154.8% |
 * | 512 | 0.0115 | 46.0195 | 0.0511 | 10.3529 | 444.5% |
 * | 1024 | 0.0288 | 73.0921 | 0.1605 | 13.1318 | 556.6% |
 * | 1280 | 0.0401 | 81.9777 | 0.0560 | 58.7764 | 139.5% |
 * | 2048 | 0.0842 | 99.8989 | 0.0839 | 100.1845 | 99.7% |
 * | 4096 | 0.2847 | 118.0144 | 0.2580 | 130.1905 | 90.6% |
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
 * | 32 | 0.0067 | 0.3532 | 0.0147 | 0.1609 | 219.5% |
 * | 64 | 0.0070 | 1.2603 | 0.0177 | 0.4986 | 252.8% |
 * | 128 | 0.0072 | 4.7080 | 0.0200 | 1.6997 | 277.0% |
 * | 256 | 0.0086 | 15.4667 | 0.0248 | 5.3780 | 287.6% |
 * | 512 | 0.0116 | 45.8283 | 0.0510 | 10.3887 | 441.1% |
 * | 1024 | 0.0343 | 61.5189 | 0.1656 | 12.7246 | 483.5% |
 * | 1280 | 0.0471 | 69.8844 | 0.0668 | 49.2337 | 141.9% |
 * | 2048 | 0.0930 | 90.3814 | 0.0976 | 86.1587 | 104.9% |
 * | 4096 | 0.3043 | 110.4182 | 0.2330 | 144.2011 | 76.6% |
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
 * | 32 | 0.0082 | 0.2879 | 0.0042 | 0.5649 | 51.0% |
 * | 64 | 0.0083 | 1.0698 | 0.0055 | 1.6000 | 66.9% |
 * | 128 | 0.0088 | 3.8903 | 0.0082 | 4.1481 | 93.8% |
 * | 256 | 0.0107 | 12.4657 | 0.0133 | 10.0627 | 123.9% |
 * | 512 | 0.0149 | 35.5403 | 0.0266 | 19.8846 | 178.7% |
 * | 1024 | 0.0346 | 60.9778 | 0.1434 | 14.7000 | 414.8% |
 * | 1280 | 0.0466 | 70.5559 | 0.0662 | 49.7099 | 141.9% |
 * | 2048 | 0.0947 | 88.8084 | 0.0922 | 91.2444 | 97.3% |
 * | 4096 | 0.3029 | 110.8964 | 0.2563 | 131.0682 | 84.6% |
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
 * | 32 | 0.0082 | 0.2891 | 0.0149 | 0.1585 | 182.4% |
 * | 64 | 0.0083 | 1.0656 | 0.0164 | 0.5370 | 198.4% |
 * | 128 | 0.0089 | 3.8136 | 0.0197 | 1.7245 | 221.1% |
 * | 256 | 0.0108 | 12.3368 | 0.0246 | 5.4375 | 226.9% |
 * | 512 | 0.0150 | 35.3127 | 0.0536 | 9.8859 | 357.2% |
 * | 1024 | 0.0343 | 61.3756 | 0.1641 | 12.8437 | 477.9% |
 * | 1280 | 0.0455 | 72.3689 | 0.0674 | 48.8013 | 148.3% |
 * | 2048 | 0.0932 | 90.2573 | 0.0984 | 85.4304 | 105.7% |
 * | 4096 | 0.3208 | 104.7342 | 0.2560 | 131.2320 | 79.8% |
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
 * | 32 | 0.0082 | 0.2891 | 0.0042 | 0.5692 | 50.8% |
 * | 64 | 0.0084 | 1.0575 | 0.0054 | 1.6283 | 64.9% |
 * | 128 | 0.0088 | 3.8551 | 0.0081 | 4.2222 | 91.3% |
 * | 256 | 0.0107 | 12.4471 | 0.0132 | 10.0870 | 123.4% |
 * | 512 | 0.0148 | 35.6936 | 0.0268 | 19.7895 | 180.4% |
 * | 1024 | 0.0348 | 60.5294 | 0.1445 | 14.5828 | 415.1% |
 * | 1280 | 0.0463 | 71.0927 | 0.0555 | 59.2336 | 120.0% |
 * | 2048 | 0.0957 | 87.8876 | 0.1023 | 82.1714 | 107.0% |
 * | 4096 | 0.3604 | 93.2045 | 0.2596 | 129.4281 | 72.0% |
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
 * | 32 | 0.0107 | 0.2206 | 0.0152 | 0.1563 | 141.1% |
 * | 64 | 0.0104 | 0.8479 | 0.0164 | 0.5391 | 157.3% |
 * | 128 | 0.0116 | 2.9352 | 0.0206 | 1.6560 | 177.2% |
 * | 256 | 0.0143 | 9.3214 | 0.0250 | 5.3367 | 174.7% |
 * | 512 | 0.0187 | 28.3530 | 0.0553 | 9.5741 | 296.1% |
 * | 1024 | 0.0430 | 49.0547 | 0.1647 | 12.7975 | 383.3% |
 * | 1280 | 0.0571 | 57.6556 | 0.0679 | 48.4791 | 118.9% |
 * | 2048 | 0.1157 | 72.6525 | 0.0851 | 98.7724 | 73.6% |
 * | 4096 | 0.3871 | 86.7865 | 0.2334 | 143.9539 | 60.3% |
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
 * | 32 | 0.0114 | 0.2073 | 0.0147 | 0.1607 | 129.0% |
 * | 64 | 0.0119 | 0.7449 | 0.0175 | 0.5036 | 147.9% |
 * | 128 | 0.0125 | 2.7282 | 0.0205 | 1.6625 | 164.1% |
 * | 256 | 0.0160 | 8.3353 | 0.0256 | 5.2135 | 159.9% |
 * | 512 | 0.0205 | 25.8097 | 0.0547 | 9.6720 | 266.8% |
 * | 1024 | 0.0448 | 46.9897 | 0.1638 | 12.8625 | 365.3% |
 * | 1280 | 0.0594 | 55.3879 | 0.0676 | 48.6742 | 113.8% |
 * | 2048 | 0.1221 | 68.8457 | 0.0976 | 86.2011 | 79.9% |
 * | 4096 | 0.4137 | 81.2079 | 0.2388 | 140.6936 | 57.7% |
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
 * | 32 | 0.0124 | 0.1912 | 0.0044 | 0.5441 | 35.1% |
 * | 64 | 0.0125 | 0.7050 | 0.0057 | 1.5419 | 45.7% |
 * | 128 | 0.0143 | 2.3803 | 0.0099 | 3.4267 | 69.5% |
 * | 256 | 0.0208 | 6.4098 | 0.0251 | 5.3333 | 120.2% |
 * | 512 | 0.0409 | 12.9351 | 0.0884 | 5.9899 | 215.9% |
 * | 1024 | 0.1208 | 17.4384 | 0.3544 | 5.9469 | 293.2% |
 * | 1280 | 0.1880 | 17.5009 | 0.2150 | 15.2976 | 114.4% |
 * | 2048 | 0.4444 | 18.9230 | 0.3296 | 25.5155 | 74.2% |
 * | 4096 | 1.9273 | 17.4312 | 1.0478 | 32.0621 | 54.4% |
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
 * | 32 | 0.0072 | 0.3304 | 0.0157 | 0.1512 | 218.5% |
 * | 64 | 0.0069 | 1.2719 | 0.0164 | 0.5391 | 235.9% |
 * | 128 | 0.0078 | 4.3876 | 0.0201 | 1.6956 | 258.8% |
 * | 256 | 0.0099 | 13.5146 | 0.0272 | 4.9187 | 274.8% |
 * | 512 | 0.0161 | 32.8580 | 0.0674 | 7.8501 | 418.6% |
 * | 1024 | 0.0399 | 52.7692 | 0.2168 | 9.7183 | 543.0% |
 * | 1280 | 0.0673 | 48.9058 | 0.1537 | 21.4055 | 228.5% |
 * | 2048 | 0.1204 | 69.8522 | 0.1786 | 47.0939 | 148.3% |
 * | 4096 | 0.8860 | 37.9174 | 0.5628 | 59.6882 | 63.5% |
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
 * | 32 | 0.0068 | 0.3491 | 0.0148 | 0.1605 | 217.5% |
 * | 64 | 0.0072 | 1.2294 | 0.0174 | 0.5064 | 242.8% |
 * | 128 | 0.0079 | 4.2990 | 0.0187 | 1.8188 | 236.4% |
 * | 256 | 0.0102 | 13.0500 | 0.0299 | 4.4735 | 291.7% |
 * | 512 | 0.0176 | 30.0800 | 0.0756 | 6.9983 | 429.8% |
 * | 1024 | 0.0451 | 46.7727 | 0.2491 | 8.4593 | 552.9% |
 * | 1280 | 0.0716 | 45.9134 | 0.1604 | 20.5108 | 223.8% |
 * | 2048 | 0.1495 | 56.2466 | 0.2347 | 35.8260 | 157.0% |
 * | 4096 | 1.0672 | 31.4799 | 0.6579 | 51.0618 | 61.7% |
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
 * | 32 | 0.0072 | 0.3304 | 0.0041 | 0.5781 | 57.1% |
 * | 64 | 0.0070 | 1.2545 | 0.0054 | 1.6331 | 76.8% |
 * | 128 | 0.0078 | 4.3429 | 0.0083 | 4.0923 | 106.1% |
 * | 256 | 0.0105 | 12.7317 | 0.0208 | 6.4098 | 198.6% |
 * | 512 | 0.0184 | 28.7222 | 0.0676 | 7.8333 | 366.7% |
 * | 1024 | 0.0512 | 41.1600 | 0.2839 | 7.4229 | 554.5% |
 * | 1280 | 0.0758 | 43.4122 | 0.1708 | 19.2636 | 225.4% |
 * | 2048 | 0.1782 | 47.1954 | 0.2644 | 31.8044 | 148.4% |
 * | 4096 | 1.1598 | 28.9655 | 0.7729 | 43.4669 | 66.6% |
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
 * | 32 | 0.0069 | 0.3442 | 0.0154 | 0.1538 | 223.8% |
 * | 64 | 0.0071 | 1.2489 | 0.0164 | 0.5370 | 232.6% |
 * | 128 | 0.0081 | 4.2055 | 0.0110 | 3.1020 | 135.6% |
 * | 256 | 0.0115 | 11.5839 | 0.0266 | 5.0162 | 230.9% |
 * | 512 | 0.0213 | 24.8969 | 0.0941 | 5.6234 | 442.7% |
 * | 1024 | 0.0617 | 34.1311 | 0.3638 | 5.7931 | 589.2% |
 * | 1280 | 0.0922 | 35.6944 | 0.2060 | 15.9652 | 223.6% |
 * | 2048 | 0.2253 | 37.3273 | 0.3588 | 23.4336 | 159.3% |
 * | 4096 | 1.1205 | 29.9826 | 1.0649 | 31.5485 | 95.0% |
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
 * | 32 | 0.0071 | 0.3348 | 0.0150 | 0.1578 | 212.2% |
 * | 64 | 0.0069 | 1.2748 | 0.0164 | 0.5391 | 236.5% |
 * | 128 | 0.0081 | 4.2222 | 0.0202 | 1.6822 | 251.0% |
 * | 256 | 0.0108 | 12.3733 | 0.0312 | 4.2875 | 288.6% |
 * | 512 | 0.0195 | 27.1213 | 0.0909 | 5.8213 | 465.9% |
 * | 1024 | 0.0516 | 40.8283 | 0.2996 | 7.0333 | 580.5% |
 * | 1280 | 0.0758 | 43.4122 | 0.1698 | 19.3725 | 224.1% |
 * | 2048 | 0.1901 | 44.2323 | 0.2820 | 29.8178 | 148.3% |
 * | 4096 | 1.1080 | 30.3216 | 0.8147 | 41.2347 | 73.5% |
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
 * | 32 | 0.0069 | 0.3442 | 0.0155 | 0.1524 | 225.8% |
 * | 64 | 0.0071 | 1.2432 | 0.0166 | 0.5308 | 234.2% |
 * | 128 | 0.0082 | 4.1563 | 0.0234 | 1.4575 | 285.2% |
 * | 256 | 0.0116 | 11.5519 | 0.0386 | 3.4656 | 333.3% |
 * | 512 | 0.0219 | 24.1871 | 0.1090 | 4.8566 | 498.0% |
 * | 1024 | 0.0635 | 33.1935 | 0.3923 | 5.3725 | 617.8% |
 * | 1280 | 0.0928 | 35.4544 | 0.2155 | 15.2681 | 232.2% |
 * | 2048 | 0.2226 | 37.7753 | 0.3586 | 23.4492 | 161.1% |
 * | 4096 | 1.1075 | 30.3348 | 1.0901 | 30.8178 | 98.4% |
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
 * | 32 | 0.0072 | 0.3304 | 0.0047 | 0.5051 | 65.4% |
 * | 64 | 0.0072 | 1.2239 | 0.0060 | 1.4839 | 82.5% |
 * | 128 | 0.0081 | 4.2139 | 0.0098 | 3.4602 | 121.8% |
 * | 256 | 0.0115 | 11.6000 | 0.0260 | 5.1429 | 225.6% |
 * | 512 | 0.0218 | 24.2403 | 0.1043 | 5.0756 | 477.6% |
 * | 1024 | 0.0629 | 33.5060 | 0.3672 | 5.7386 | 583.9% |
 * | 1280 | 0.0911 | 36.1209 | 0.1971 | 16.6910 | 216.4% |
 * | 2048 | 0.2356 | 35.6971 | 0.3631 | 23.1599 | 154.1% |
 * | 4096 | 1.1448 | 29.3453 | 1.0668 | 31.4922 | 93.2% |
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
 * | 32 | 0.0067 | 0.3532 | 0.0156 | 0.1521 | 232.2% |
 * | 64 | 0.0068 | 1.2958 | 0.0165 | 0.5364 | 241.6% |
 * | 128 | 0.0073 | 4.6769 | 0.0199 | 1.7106 | 273.4% |
 * | 256 | 0.0086 | 15.4667 | 0.0259 | 5.1619 | 299.6% |
 * | 512 | 0.0115 | 46.2123 | 0.0420 | 12.5906 | 367.0% |
 * | 1024 | 0.0287 | 73.5000 | 0.1665 | 12.6585 | 580.6% |
 * | 1280 | 0.0389 | 84.5395 | 0.0635 | 51.8145 | 163.2% |
 * | 2048 | 0.0819 | 102.6500 | 0.0840 | 100.1463 | 102.5% |
 * | 4096 | 0.2768 | 121.3847 | 0.2545 | 131.9992 | 92.0% |
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
 * | 32 | 0.0067 | 0.3524 | 0.0150 | 0.1583 | 222.6% |
 * | 64 | 0.0069 | 1.2778 | 0.0164 | 0.5385 | 237.3% |
 * | 128 | 0.0072 | 4.7394 | 0.0213 | 1.5952 | 297.1% |
 * | 256 | 0.0087 | 15.3248 | 0.0251 | 5.3333 | 287.3% |
 * | 512 | 0.0115 | 45.8918 | 0.0416 | 12.7164 | 360.9% |
 * | 1024 | 0.0287 | 73.5000 | 0.1656 | 12.7246 | 577.6% |
 * | 1280 | 0.0391 | 84.1588 | 0.1310 | 25.1068 | 335.2% |
 * | 2048 | 0.0819 | 102.6500 | 0.2007 | 41.8980 | 245.0% |
 * | 4096 | 0.3128 | 107.4131 | 0.4055 | 82.8485 | 129.7% |
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
 * | 32 | 0.0082 | 0.2891 |
 * | 64 | 0.0082 | 1.0739 |
 * | 128 | 0.0094 | 3.6314 |
 * | 256 | 0.0148 | 9.0194 |
 * | 512 | 0.0279 | 19.0052 |
 * | 1024 | 0.0778 | 27.0789 |
 * | 1280 | 0.1213 | 27.1240 |
 * | 2048 | 0.2646 | 31.7813 |
 * | 4096 | 1.5052 | 22.3196 |
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
 * | 32 | 0.0082 | 0.2891 |
 * | 64 | 0.0084 | 1.0575 |
 * | 128 | 0.0086 | 3.9554 |
 * | 256 | 0.0106 | 12.5783 |
 * | 512 | 0.0149 | 35.5403 |
 * | 1024 | 0.0342 | 61.6341 |
 * | 1280 | 0.0453 | 72.5476 |
 * | 2048 | 0.0939 | 89.5346 |
 * | 4096 | 0.3113 | 107.9211 |
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
