/**
 * Benchmark results for dtrsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0265 | 0.1785 | 0.0116 | 0.4077 | 43.8% |
 * | 64 | 0.0536 | 0.3297 | 0.0154 | 1.1440 | 28.8% |
 * | 128 | 0.1110 | 0.6133 | 0.0229 | 2.9762 | 20.6% |
 * | 256 | 0.2274 | 1.1755 | 0.0382 | 6.9979 | 16.8% |
 * | 512 | 0.4262 | 2.4844 | 0.0704 | 15.0434 | 16.5% |
 * | 1024 | 0.8297 | 5.0801 | 0.1354 | 31.1302 | 16.3% |
 * | 2048 | 1.7354 | 9.6913 | 0.2800 | 60.0580 | 16.1% |
 * | 4096 | 4.0353 | 16.6509 | 0.6659 | 100.9016 | 16.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dtrsv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-default.svg)
 *
 * ![dtrsv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-default.svg)
 *
 * ## See also
 *
 * - [dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/dtrsv.js) — WebGPU benchmark script
 * - [dtrsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/cuda/dtrsv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0266 | 0.1779 | 0.0116 | 0.4077 | 43.6% |
 * | 64 | 0.0536 | 0.3294 | 0.0153 | 1.1572 | 28.5% |
 * | 128 | 0.1115 | 0.6108 | 0.0227 | 3.0014 | 20.4% |
 * | 256 | 0.2276 | 1.1742 | 0.0379 | 7.0570 | 16.6% |
 * | 512 | 0.4286 | 2.4703 | 0.0707 | 14.9855 | 16.5% |
 * | 1024 | 0.8310 | 5.0717 | 0.1396 | 30.1815 | 16.8% |
 * | 1280 | 1.1327 | 5.8083 | 0.1763 | 37.3275 | 15.6% |
 * | 2048 | 1.7399 | 9.6662 | 0.2949 | 57.0278 | 16.9% |
 * | 4096 | 4.0469 | 16.6032 | 0.6960 | 96.5318 | 17.2% |
 *
 * ![dtrsv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-stride4.svg)
 *
 * ![dtrsv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0264 | 0.1796 | 0.0115 | 0.4117 | 43.6% |
 * | 64 | 0.0538 | 0.3285 | 0.0150 | 1.1745 | 28.0% |
 * | 128 | 0.1113 | 0.6120 | 0.0225 | 3.0227 | 20.2% |
 * | 256 | 0.2272 | 1.1766 | 0.0380 | 7.0303 | 16.7% |
 * | 512 | 0.4280 | 2.4737 | 0.0708 | 14.9618 | 16.5% |
 * | 1024 | 0.8341 | 5.0531 | 0.1393 | 30.2647 | 16.7% |
 * | 1280 | 1.1324 | 5.8102 | 0.1757 | 37.4397 | 15.5% |
 * | 2048 | 1.7408 | 9.6612 | 0.2952 | 56.9783 | 17.0% |
 * | 4096 | 4.0450 | 16.6109 | 0.6965 | 96.4719 | 17.2% |
 *
 * ![dtrsv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-stride5.svg)
 *
 * ![dtrsv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0266 | 0.1781 | 0.0109 | 0.4327 | 41.2% |
 * | 64 | 0.0539 | 0.3276 | 0.0148 | 1.1909 | 27.5% |
 * | 128 | 0.1121 | 0.6073 | 0.0226 | 3.0120 | 20.2% |
 * | 256 | 0.2279 | 1.1725 | 0.0382 | 7.0038 | 16.7% |
 * | 512 | 0.4298 | 2.4634 | 0.0736 | 14.3861 | 17.1% |
 * | 1024 | 0.8406 | 5.0141 | 0.1471 | 28.6611 | 17.5% |
 * | 1280 | 1.1437 | 5.7524 | 0.1810 | 36.3508 | 15.8% |
 * | 2048 | 1.7659 | 9.5237 | 0.2923 | 57.5429 | 16.6% |
 * | 4096 | 4.1534 | 16.1771 | 0.6848 | 98.1197 | 16.5% |
 *
 * ![dtrsv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-stride32.svg)
 *
 * ![dtrsv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0266 | 0.1782 | 0.0109 | 0.4353 | 40.9% |
 * | 64 | 0.0537 | 0.3288 | 0.0148 | 1.1922 | 27.6% |
 * | 128 | 0.1118 | 0.6090 | 0.0226 | 3.0099 | 20.2% |
 * | 256 | 0.2274 | 1.1755 | 0.0392 | 6.8235 | 17.2% |
 * | 512 | 0.4299 | 2.4627 | 0.0733 | 14.4489 | 17.0% |
 * | 1024 | 0.8376 | 5.0318 | 0.1467 | 28.7267 | 17.5% |
 * | 1280 | 1.1387 | 5.7779 | 0.1828 | 35.9944 | 16.1% |
 * | 2048 | 1.7552 | 9.5822 | 0.2952 | 56.9660 | 16.8% |
 * | 4096 | 4.0895 | 16.4301 | 0.6843 | 98.1908 | 16.7% |
 *
 * ![dtrsv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-stride33.svg)
 *
 * ![dtrsv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0266 | 0.1780 | 0.0108 | 0.4392 | 40.5% |
 * | 64 | 0.0539 | 0.3278 | 0.0215 | 0.8202 | 40.0% |
 * | 128 | 0.1120 | 0.6083 | 0.0239 | 2.8449 | 21.4% |
 * | 256 | 0.2284 | 1.1704 | 0.0447 | 5.9850 | 19.6% |
 * | 512 | 0.4307 | 2.4585 | 0.0753 | 14.0620 | 17.5% |
 * | 1024 | 0.8356 | 5.0443 | 0.1437 | 29.3345 | 17.2% |
 * | 1280 | 1.1472 | 5.7350 | 0.1795 | 36.6521 | 15.6% |
 * | 2048 | 1.7612 | 9.5494 | 0.2930 | 57.4078 | 16.6% |
 * | 4096 | 4.1064 | 16.3625 | 0.6835 | 98.3011 | 16.6% |
 *
 * ![dtrsv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-stride255.svg)
 *
 * ![dtrsv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0266 | 0.1779 | 0.0110 | 0.4309 | 41.3% |
 * | 64 | 0.0543 | 0.3255 | 0.0214 | 0.8245 | 39.5% |
 * | 128 | 0.1123 | 0.6062 | 0.0238 | 2.8583 | 21.2% |
 * | 256 | 0.2289 | 1.1675 | 0.0443 | 6.0390 | 19.3% |
 * | 512 | 0.4321 | 2.4502 | 0.0784 | 13.5108 | 18.1% |
 * | 1024 | 0.8400 | 5.0179 | 0.1434 | 29.3934 | 17.1% |
 * | 1280 | 1.1530 | 5.7061 | 0.1794 | 36.6815 | 15.6% |
 * | 2048 | 1.7713 | 9.4949 | 0.2927 | 57.4580 | 16.5% |
 * | 4096 | 4.1595 | 16.1535 | 0.6829 | 98.3863 | 16.4% |
 *
 * ![dtrsv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-stride256.svg)
 *
 * ![dtrsv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/stride.dtrsv.js) — WebGPU stride-sweep benchmark script
 * - [stride.dtrsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/cuda/stride.dtrsv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0265 | 0.1786 | 0.0117 | 0.4044 | 44.2% |
 * | 64 | 0.0536 | 0.3298 | 0.0157 | 1.1265 | 29.3% |
 * | 128 | 0.1111 | 0.6130 | 0.0231 | 2.9474 | 20.8% |
 * | 256 | 0.2273 | 1.1757 | 0.0382 | 6.9891 | 16.8% |
 * | 512 | 0.4259 | 2.4859 | 0.0706 | 15.0059 | 16.6% |
 * | 1024 | 0.8300 | 5.0783 | 0.1353 | 31.1523 | 16.3% |
 * | 1280 | 1.1289 | 5.8278 | 0.1700 | 38.7048 | 15.1% |
 * | 2048 | 1.7326 | 9.7069 | 0.2801 | 60.0375 | 16.2% |
 * | 4096 | 4.0345 | 16.6540 | 0.6675 | 100.6670 | 16.5% |
 *
 * ![dtrsv-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-transno-transpose.svg)
 *
 * ![dtrsv-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0244 | 0.1937 | 0.0189 | 0.2508 | 77.2% |
 * | 64 | 0.0398 | 0.4441 | 0.0225 | 0.7841 | 56.6% |
 * | 128 | 0.0829 | 0.8210 | 0.0348 | 1.9541 | 42.0% |
 * | 256 | 0.1205 | 2.2186 | 0.0593 | 4.5049 | 49.2% |
 * | 512 | 0.2278 | 4.6472 | 0.1122 | 9.4402 | 49.2% |
 * | 1024 | 0.4511 | 9.3433 | 0.2244 | 18.7811 | 49.7% |
 * | 1280 | 0.5816 | 11.3116 | 0.2849 | 23.0894 | 49.0% |
 * | 2048 | 0.9750 | 17.2496 | 0.4643 | 36.2211 | 47.6% |
 * | 4096 | 2.3756 | 28.2831 | 1.0240 | 65.6160 | 43.1% |
 *
 * ![dtrsv-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-transtranspose.svg)
 *
 * ![dtrsv-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/trans.dtrsv.js) — WebGPU trans-sweep benchmark script
 * - [trans.dtrsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/cuda/trans.dtrsv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0264 | 0.1793 | 0.0116 | 0.4072 | 44.0% |
 * | 64 | 0.0535 | 0.3303 | 0.0154 | 1.1440 | 28.9% |
 * | 128 | 0.1110 | 0.6133 | 0.0229 | 2.9721 | 20.6% |
 * | 256 | 0.2273 | 1.1757 | 0.0383 | 6.9716 | 16.9% |
 * | 512 | 0.4266 | 2.4821 | 0.0705 | 15.0263 | 16.5% |
 * | 1024 | 0.8315 | 5.0690 | 0.1354 | 31.1302 | 16.3% |
 * | 1280 | 1.1281 | 5.8321 | 0.1700 | 38.7048 | 15.1% |
 * | 2048 | 1.7347 | 9.6954 | 0.2806 | 59.9416 | 16.2% |
 * | 4096 | 4.0345 | 16.6539 | 0.6651 | 101.0278 | 16.5% |
 *
 * ![dtrsv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-uplolower.svg)
 *
 * ![dtrsv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0264 | 0.1793 | 0.0116 | 0.4077 | 44.0% |
 * | 64 | 0.0535 | 0.3299 | 0.0153 | 1.1548 | 28.6% |
 * | 128 | 0.1119 | 0.6083 | 0.0226 | 3.0120 | 20.2% |
 * | 256 | 0.2276 | 1.1743 | 0.0381 | 7.0214 | 16.7% |
 * | 512 | 0.4277 | 2.4754 | 0.0705 | 15.0093 | 16.5% |
 * | 1024 | 0.8299 | 5.0786 | 0.1355 | 31.1008 | 16.3% |
 * | 1280 | 1.1301 | 5.8217 | 0.1700 | 38.7048 | 15.0% |
 * | 2048 | 1.7318 | 9.7115 | 0.2793 | 60.2094 | 16.1% |
 * | 4096 | 4.0347 | 16.6533 | 0.6595 | 101.8882 | 16.3% |
 *
 * ![dtrsv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-uploupper.svg)
 *
 * ![dtrsv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/uplo.dtrsv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dtrsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/cuda/uplo.dtrsv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0266 | 0.1783 | 0.0116 | 0.4066 | 43.9% |
 * | 64 | 0.0535 | 0.3303 | 0.0153 | 1.1548 | 28.6% |
 * | 128 | 0.1111 | 0.6130 | 0.0230 | 2.9638 | 20.7% |
 * | 256 | 0.2273 | 1.1757 | 0.0382 | 6.9891 | 16.8% |
 * | 512 | 0.4255 | 2.4882 | 0.0706 | 14.9889 | 16.6% |
 * | 1024 | 0.8294 | 5.0819 | 0.1355 | 31.1045 | 16.3% |
 * | 1280 | 1.1283 | 5.8311 | 0.1700 | 38.7048 | 15.1% |
 * | 2048 | 1.7357 | 9.6895 | 0.2806 | 59.9416 | 16.2% |
 * | 4096 | 4.0343 | 16.6549 | 0.6660 | 100.8822 | 16.5% |
 *
 * ![dtrsv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad0.svg)
 *
 * ![dtrsv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0246 | 0.1927 | 0.0109 | 0.4347 | 44.3% |
 * | 64 | 0.0434 | 0.4068 | 0.0148 | 1.1922 | 34.1% |
 * | 128 | 0.0921 | 0.7397 | 0.0225 | 3.0227 | 24.5% |
 * | 256 | 0.1413 | 1.8913 | 0.0375 | 7.1263 | 26.5% |
 * | 512 | 0.2670 | 3.9657 | 0.0681 | 15.5416 | 25.5% |
 * | 1024 | 0.5449 | 7.7348 | 0.1352 | 31.1818 | 24.8% |
 * | 1280 | 0.8084 | 8.1389 | 0.1700 | 38.7048 | 21.0% |
 * | 2048 | 1.1766 | 14.2942 | 0.2882 | 58.3608 | 24.5% |
 *
 * ![dtrsv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad1.svg)
 *
 * ![dtrsv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0244 | 0.1942 | 0.0115 | 0.4134 | 47.0% |
 * | 64 | 0.0446 | 0.3957 | 0.0153 | 1.1548 | 34.3% |
 * | 128 | 0.0956 | 0.7127 | 0.0226 | 3.0184 | 23.6% |
 * | 256 | 0.1536 | 1.7400 | 0.0379 | 7.0481 | 24.7% |
 * | 512 | 0.3004 | 3.5247 | 0.0694 | 15.2620 | 23.1% |
 * | 1024 | 0.6015 | 7.0067 | 0.1355 | 31.1155 | 22.5% |
 * | 1280 | 0.8356 | 7.8738 | 0.1700 | 38.7048 | 20.3% |
 * | 2048 | 1.2718 | 13.2238 | 0.2856 | 58.8839 | 22.5% |
 *
 * ![dtrsv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad8.svg)
 *
 * ![dtrsv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0246 | 0.1927 | 0.0116 | 0.4088 | 47.1% |
 * | 64 | 0.0494 | 0.3574 | 0.0152 | 1.1584 | 30.9% |
 * | 128 | 0.0963 | 0.7070 | 0.0229 | 2.9783 | 23.7% |
 * | 256 | 0.1808 | 1.4786 | 0.0382 | 6.9979 | 21.1% |
 * | 512 | 0.3380 | 3.1323 | 0.0700 | 15.1363 | 20.7% |
 * | 1024 | 0.6777 | 6.2193 | 0.1357 | 31.0605 | 20.0% |
 * | 1280 | 0.8928 | 7.3696 | 0.1700 | 38.7048 | 19.0% |
 * | 2048 | 1.4366 | 11.7070 | 0.2811 | 59.8358 | 19.6% |
 *
 * ![dtrsv-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad16.svg)
 *
 * ![dtrsv-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0264 | 0.1794 | 0.0115 | 0.4111 | 43.6% |
 * | 64 | 0.0553 | 0.3194 | 0.0154 | 1.1452 | 27.9% |
 * | 128 | 0.1191 | 0.5719 | 0.0228 | 2.9846 | 19.2% |
 * | 256 | 0.2281 | 1.1719 | 0.0380 | 7.0244 | 16.7% |
 * | 512 | 0.4364 | 2.4263 | 0.0698 | 15.1641 | 16.0% |
 * | 1024 | 0.8561 | 4.9234 | 0.1354 | 31.1376 | 15.8% |
 * | 1280 | 1.0825 | 6.0777 | 0.1700 | 38.7048 | 15.7% |
 * | 2048 | 1.7940 | 9.3744 | 0.2820 | 59.6321 | 15.7% |
 *
 * ![dtrsv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad32.svg)
 *
 * ![dtrsv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0247 | 0.1917 | 0.0115 | 0.4105 | 46.7% |
 * | 64 | 0.0461 | 0.3833 | 0.0153 | 1.1548 | 33.2% |
 * | 128 | 0.0975 | 0.6984 | 0.0226 | 3.0099 | 23.2% |
 * | 256 | 0.1762 | 1.5169 | 0.0382 | 6.9891 | 21.7% |
 * | 512 | 0.3441 | 3.0774 | 0.0696 | 15.2129 | 20.2% |
 * | 1024 | 0.6845 | 6.1571 | 0.1355 | 31.1008 | 19.8% |
 * | 1280 | 0.8704 | 7.5588 | 0.1700 | 38.7048 | 19.5% |
 * | 2048 | 1.4875 | 11.3063 | 0.2811 | 59.8222 | 18.9% |
 *
 * ![dtrsv-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad48.svg)
 *
 * ![dtrsv-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0273 | 0.1735 | 0.0116 | 0.4088 | 42.4% |
 * | 64 | 0.0535 | 0.3301 | 0.0156 | 1.1358 | 29.1% |
 * | 128 | 0.1155 | 0.5896 | 0.0230 | 2.9617 | 19.9% |
 * | 256 | 0.2310 | 1.1570 | 0.0383 | 6.9862 | 16.6% |
 * | 512 | 0.4269 | 2.4803 | 0.0696 | 15.2059 | 16.3% |
 * | 1024 | 0.8729 | 4.8287 | 0.1355 | 31.0972 | 15.5% |
 * | 1280 | 1.0713 | 6.1414 | 0.1700 | 38.7048 | 15.9% |
 * | 2048 | 1.8028 | 9.3291 | 0.2806 | 59.9416 | 15.6% |
 *
 * ![dtrsv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad64.svg)
 *
 * ![dtrsv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0286 | 0.1654 | 0.0115 | 0.4105 | 40.3% |
 * | 64 | 0.0556 | 0.3179 | 0.0153 | 1.1536 | 27.6% |
 * | 128 | 0.1113 | 0.6116 | 0.0228 | 2.9888 | 20.5% |
 * | 256 | 0.2291 | 1.1666 | 0.0382 | 7.0008 | 16.7% |
 * | 512 | 0.4325 | 2.4481 | 0.0700 | 15.1190 | 16.2% |
 * | 1024 | 0.8643 | 4.8768 | 0.1354 | 31.1339 | 15.7% |
 * | 1280 | 1.0795 | 6.0949 | 0.1700 | 38.7048 | 15.7% |
 * | 2048 | 1.8969 | 8.8659 | 0.2817 | 59.7033 | 14.8% |
 *
 * ![dtrsv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-pad128.svg)
 *
 * ![dtrsv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/lda.dtrsv.js) — WebGPU lda-sweep benchmark script
 * - [lda.dtrsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/cuda/lda.dtrsv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0263 | 0.1799 | 0.0116 | 0.4088 | 44.0% |
 * | 64 | 0.0535 | 0.3299 | 0.0156 | 1.1335 | 29.1% |
 * | 128 | 0.1112 | 0.6122 | 0.0230 | 2.9659 | 20.6% |
 * | 256 | 0.2275 | 1.1748 | 0.0382 | 6.9920 | 16.8% |
 * | 512 | 0.4269 | 2.4804 | 0.0707 | 14.9821 | 16.6% |
 * | 1024 | 0.8294 | 5.0815 | 0.1354 | 31.1302 | 16.3% |
 * | 1280 | 1.1277 | 5.8341 | 0.1700 | 38.7048 | 15.1% |
 * | 2048 | 1.7347 | 9.6954 | 0.2804 | 59.9861 | 16.2% |
 * | 4096 | 4.0365 | 16.6460 | 0.6656 | 100.9525 | 16.5% |
 *
 * ![dtrsv-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-diagnonunit.svg)
 *
 * ![dtrsv-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0266 | 0.1782 | 0.0074 | 0.6379 | 27.9% |
 * | 64 | 0.0536 | 0.3297 | 0.0102 | 1.7250 | 19.1% |
 * | 128 | 0.1111 | 0.6130 | 0.0163 | 4.1807 | 14.7% |
 * | 256 | 0.2273 | 1.1757 | 0.0276 | 9.6723 | 12.2% |
 * | 512 | 0.4278 | 2.4749 | 0.0512 | 20.6606 | 12.0% |
 * | 1024 | 0.8311 | 5.0712 | 0.1019 | 41.3733 | 12.3% |
 * | 1280 | 1.1291 | 5.8268 | 0.1279 | 51.4321 | 11.3% |
 * | 2048 | 1.7347 | 9.6954 | 0.2123 | 79.2174 | 12.2% |
 * | 4096 | 4.0386 | 16.6370 | 0.5001 | 134.3515 | 12.4% |
 *
 * ![dtrsv-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-diagunit.svg)
 *
 * ![dtrsv-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/diag.dtrsv.js) — WebGPU diag-sweep benchmark script
 * - [diag.dtrsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/cuda/diag.dtrsv.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 32 | 0.0244 | 0.1940 |
 * | 64 | 0.0397 | 0.4452 |
 * | 128 | 0.0827 | 0.8232 |
 * | 256 | 0.1207 | 2.2151 |
 * | 512 | 0.2280 | 4.6449 |
 * | 1024 | 0.4507 | 9.3509 |
 * | 1280 | 0.5812 | 11.3200 |
 * | 2048 | 0.9724 | 17.2947 |
 * | 4096 | 2.3757 | 28.2828 |
 *
 * ![dtrsv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-layoutcolumnmajor.svg)
 *
 * ![dtrsv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0265 | 0.1789 |
 * | 64 | 0.0536 | 0.3298 |
 * | 128 | 0.1111 | 0.6129 |
 * | 256 | 0.2273 | 1.1757 |
 * | 512 | 0.4260 | 2.4856 |
 * | 1024 | 0.8312 | 5.0707 |
 * | 1280 | 1.1285 | 5.8301 |
 * | 2048 | 1.7335 | 9.7019 |
 * | 4096 | 4.0360 | 16.6481 |
 *
 * ![dtrsv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/gbps-layoutrowmajor.svg)
 *
 * ![dtrsv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dtrsv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dtrsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dtrsv/wgblas/layout.dtrsv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dtrsv
 */
