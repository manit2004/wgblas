/**
 * Benchmark results for dtrsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0840 | 0.0564 | 0.0125 | 0.3785 | 14.9% |
 * | 64 | 0.1668 | 0.1059 | 0.0170 | 1.0395 | 10.2% |
 * | 128 | 0.2171 | 0.3137 | 0.0257 | 2.6534 | 11.8% |
 * | 256 | 0.3803 | 0.7028 | 0.0420 | 6.3610 | 11.0% |
 * | 512 | 0.7778 | 1.3614 | 0.0783 | 13.5302 | 10.1% |
 * | 1024 | 1.5734 | 2.6788 | 0.1512 | 27.8844 | 9.6% |
 * | 2048 | 3.4299 | 4.9034 | 0.3105 | 54.1655 | 9.1% |
 * | 4096 | 8.1634 | 8.2307 | 0.8373 | 80.2473 | 10.3% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0118 | 0.4000 | 14.1% |
 * | 64 | 0.1667 | 0.1060 | 0.0156 | 1.1358 | 9.3% |
 * | 128 | 0.2171 | 0.3137 | 0.0228 | 2.9846 | 10.5% |
 * | 256 | 0.3813 | 0.7010 | 0.0380 | 7.0244 | 10.0% |
 * | 512 | 0.7823 | 1.3534 | 0.0714 | 14.8377 | 9.1% |
 * | 1024 | 1.5772 | 2.6723 | 0.1400 | 30.0953 | 8.9% |
 * | 1280 | 2.0089 | 3.2750 | 0.1765 | 37.2835 | 8.8% |
 * | 2048 | 3.4419 | 4.8863 | 0.2949 | 57.0216 | 8.6% |
 * | 4096 | 8.2883 | 8.1067 | 0.6959 | 96.5496 | 8.4% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0122 | 0.3895 | 14.5% |
 * | 64 | 0.1666 | 0.1060 | 0.0151 | 1.1732 | 9.0% |
 * | 128 | 0.2176 | 0.3130 | 0.0226 | 3.0184 | 10.4% |
 * | 256 | 0.3831 | 0.6977 | 0.0380 | 7.0422 | 9.9% |
 * | 512 | 0.7820 | 1.3540 | 0.0710 | 14.9045 | 9.1% |
 * | 1024 | 1.5705 | 2.6838 | 0.1393 | 30.2647 | 8.9% |
 * | 1280 | 2.0007 | 3.2884 | 0.1758 | 37.4329 | 8.8% |
 * | 2048 | 3.4160 | 4.9234 | 0.2953 | 56.9474 | 8.6% |
 * | 4096 | 8.1674 | 8.2267 | 0.6944 | 96.7587 | 8.5% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0109 | 0.4327 | 13.0% |
 * | 64 | 0.1669 | 0.1058 | 0.0147 | 1.2052 | 8.8% |
 * | 128 | 0.2187 | 0.3113 | 0.0225 | 3.0227 | 10.3% |
 * | 256 | 0.3856 | 0.6931 | 0.0378 | 7.0660 | 9.8% |
 * | 512 | 0.7971 | 1.3284 | 0.0747 | 14.1796 | 9.4% |
 * | 1024 | 1.6468 | 2.5593 | 0.1412 | 29.8396 | 8.6% |
 * | 1280 | 2.1240 | 3.0975 | 0.1777 | 37.0184 | 8.4% |
 * | 2048 | 3.7376 | 4.4997 | 0.2961 | 56.7967 | 7.9% |
 * | 4096 | 9.4964 | 7.0754 | 0.6834 | 98.3149 | 7.2% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0110 | 0.4296 | 13.1% |
 * | 64 | 0.1667 | 0.1059 | 0.0148 | 1.1948 | 8.9% |
 * | 128 | 0.2176 | 0.3130 | 0.0225 | 3.0227 | 10.4% |
 * | 256 | 0.3819 | 0.6998 | 0.0393 | 6.8013 | 10.3% |
 * | 512 | 0.7844 | 1.3498 | 0.0738 | 14.3518 | 9.4% |
 * | 1024 | 1.5790 | 2.6692 | 0.1452 | 29.0242 | 9.2% |
 * | 1280 | 2.0084 | 3.2758 | 0.1771 | 37.1454 | 8.8% |
 * | 2048 | 3.4354 | 4.8955 | 0.2948 | 57.0494 | 8.6% |
 * | 4096 | 8.2270 | 8.1671 | 0.6837 | 98.2689 | 8.3% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0110 | 0.4302 | 13.1% |
 * | 64 | 0.1674 | 0.1055 | 0.0219 | 0.8070 | 13.1% |
 * | 128 | 0.2175 | 0.3130 | 0.0245 | 2.7817 | 11.3% |
 * | 256 | 0.3826 | 0.6986 | 0.0444 | 6.0238 | 11.6% |
 * | 512 | 0.7851 | 1.3487 | 0.0781 | 13.5551 | 9.9% |
 * | 1024 | 1.5809 | 2.6661 | 0.1447 | 29.1302 | 9.2% |
 * | 1280 | 2.0078 | 3.2768 | 0.1807 | 36.4055 | 9.0% |
 * | 2048 | 3.4363 | 4.8942 | 0.2931 | 57.3733 | 8.5% |
 * | 4096 | 8.2337 | 8.1605 | 0.6831 | 98.3656 | 8.3% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0108 | 0.4366 | 12.9% |
 * | 64 | 0.1675 | 0.1055 | 0.0215 | 0.8202 | 12.9% |
 * | 128 | 0.2190 | 0.3110 | 0.0240 | 2.8336 | 11.0% |
 * | 256 | 0.3844 | 0.6953 | 0.0442 | 6.0434 | 11.5% |
 * | 512 | 0.7987 | 1.3256 | 0.0783 | 13.5163 | 9.8% |
 * | 1024 | 1.6500 | 2.5543 | 0.1438 | 29.3117 | 8.7% |
 * | 1280 | 2.1215 | 3.1011 | 0.1796 | 36.6292 | 8.5% |
 * | 2048 | 3.7438 | 4.4923 | 0.2951 | 56.9845 | 7.9% |
 * | 4096 | 9.4956 | 7.0760 | 0.6829 | 98.3932 | 7.2% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0119 | 0.3995 | 14.1% |
 * | 64 | 0.1666 | 0.1060 | 0.0157 | 1.1242 | 9.4% |
 * | 128 | 0.2171 | 0.3137 | 0.0231 | 2.9453 | 10.7% |
 * | 256 | 0.3807 | 0.7021 | 0.0389 | 6.8684 | 10.2% |
 * | 512 | 0.7828 | 1.3525 | 0.0713 | 14.8410 | 9.1% |
 * | 1024 | 1.5712 | 2.6825 | 0.1356 | 31.0935 | 8.6% |
 * | 1280 | 1.9987 | 3.2918 | 0.1700 | 38.7121 | 8.5% |
 * | 2048 | 3.4119 | 4.9292 | 0.2804 | 59.9895 | 8.2% |
 * | 4096 | 8.1541 | 8.2401 | 0.6648 | 101.0765 | 8.2% |
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
 * | 32 | 0.0858 | 0.0552 | 0.0191 | 0.2479 | 22.3% |
 * | 64 | 0.1720 | 0.1027 | 0.0228 | 0.7753 | 13.2% |
 * | 128 | 0.2394 | 0.2845 | 0.0350 | 1.9452 | 14.6% |
 * | 256 | 0.4244 | 0.6297 | 0.0593 | 4.5036 | 14.0% |
 * | 512 | 0.8481 | 1.2484 | 0.1126 | 9.4000 | 13.3% |
 * | 1024 | 1.7649 | 2.3881 | 0.2249 | 18.7397 | 12.7% |
 * | 1280 | 2.2839 | 2.8807 | 0.2848 | 23.0985 | 12.5% |
 * | 2048 | 3.9621 | 4.2447 | 0.4649 | 36.1762 | 11.7% |
 * | 4096 | 9.9004 | 6.7867 | 1.0240 | 65.6160 | 10.3% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0120 | 0.3957 | 14.3% |
 * | 64 | 0.1674 | 0.1055 | 0.0155 | 1.1405 | 9.3% |
 * | 128 | 0.2172 | 0.3135 | 0.0235 | 2.9031 | 10.8% |
 * | 256 | 0.3802 | 0.7029 | 0.0384 | 6.9542 | 10.1% |
 * | 512 | 0.7787 | 1.3598 | 0.0715 | 14.8144 | 9.2% |
 * | 1024 | 1.5711 | 2.6826 | 0.1358 | 31.0422 | 8.6% |
 * | 1280 | 1.9968 | 3.2949 | 0.1702 | 38.6575 | 8.5% |
 * | 2048 | 3.4117 | 4.9296 | 0.2803 | 60.0100 | 8.2% |
 * | 4096 | 8.1575 | 8.2367 | 0.6642 | 101.1641 | 8.1% |
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
 * | 32 | 0.0847 | 0.0559 | 0.0118 | 0.4005 | 14.0% |
 * | 64 | 0.1679 | 0.1052 | 0.0155 | 1.1405 | 9.2% |
 * | 128 | 0.2218 | 0.3070 | 0.0227 | 3.0056 | 10.2% |
 * | 256 | 0.3994 | 0.6691 | 0.0382 | 6.9979 | 9.6% |
 * | 512 | 0.7782 | 1.3607 | 0.0701 | 15.0983 | 9.0% |
 * | 1024 | 1.5753 | 2.6756 | 0.1356 | 31.0935 | 8.6% |
 * | 1280 | 2.0038 | 3.2833 | 0.1700 | 38.7048 | 8.5% |
 * | 2048 | 3.4120 | 4.9292 | 0.2792 | 60.2439 | 8.2% |
 * | 4096 | 8.1572 | 8.2370 | 0.6595 | 101.8882 | 8.1% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0117 | 0.4055 | 13.9% |
 * | 64 | 0.1666 | 0.1060 | 0.0156 | 1.1358 | 9.3% |
 * | 128 | 0.2171 | 0.3137 | 0.0246 | 2.7708 | 11.3% |
 * | 256 | 0.3808 | 0.7018 | 0.0384 | 6.9629 | 10.1% |
 * | 512 | 0.7773 | 1.3622 | 0.0710 | 14.9045 | 9.1% |
 * | 1024 | 1.5684 | 2.6872 | 0.1353 | 31.1597 | 8.6% |
 * | 1280 | 2.0009 | 3.2882 | 0.1706 | 38.5669 | 8.5% |
 * | 2048 | 3.4138 | 4.9265 | 0.2803 | 59.9929 | 8.2% |
 * | 4096 | 8.1559 | 8.2383 | 0.6640 | 101.1958 | 8.1% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0111 | 0.4265 | 13.2% |
 * | 64 | 0.1679 | 0.1052 | 0.0148 | 1.1897 | 8.8% |
 * | 128 | 0.2175 | 0.3131 | 0.0225 | 3.0227 | 10.4% |
 * | 256 | 0.3816 | 0.7003 | 0.0376 | 7.1020 | 9.9% |
 * | 512 | 0.7823 | 1.3534 | 0.0681 | 15.5379 | 8.7% |
 * | 1024 | 1.5688 | 2.6867 | 0.1352 | 31.1818 | 8.6% |
 * | 1280 | 1.9981 | 3.2927 | 0.1700 | 38.6939 | 8.5% |
 * | 2048 | 3.4130 | 4.9277 | 0.2888 | 58.2379 | 8.5% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0118 | 0.4011 | 14.1% |
 * | 64 | 0.1667 | 0.1060 | 0.0155 | 1.1417 | 9.3% |
 * | 128 | 0.2170 | 0.3139 | 0.0230 | 2.9556 | 10.6% |
 * | 256 | 0.3812 | 0.7011 | 0.0382 | 7.0038 | 10.0% |
 * | 512 | 0.7805 | 1.3565 | 0.0695 | 15.2339 | 8.9% |
 * | 1024 | 1.5708 | 2.6832 | 0.1353 | 31.1450 | 8.6% |
 * | 1280 | 2.0012 | 3.2876 | 0.1700 | 38.7048 | 8.5% |
 * | 2048 | 3.4099 | 4.9322 | 0.2853 | 58.9400 | 8.4% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0117 | 0.4044 | 13.9% |
 * | 64 | 0.1666 | 0.1060 | 0.0156 | 1.1358 | 9.3% |
 * | 128 | 0.2171 | 0.3137 | 0.0228 | 2.9846 | 10.5% |
 * | 256 | 0.3809 | 0.7016 | 0.0395 | 6.7600 | 10.4% |
 * | 512 | 0.7837 | 1.3510 | 0.0708 | 14.9483 | 9.0% |
 * | 1024 | 1.5690 | 2.6864 | 0.1372 | 30.7164 | 8.7% |
 * | 1280 | 1.9948 | 3.2982 | 0.1717 | 38.3225 | 8.6% |
 * | 2048 | 3.4126 | 4.9282 | 0.2817 | 59.7067 | 8.3% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0117 | 0.4033 | 14.0% |
 * | 64 | 0.1668 | 0.1059 | 0.0156 | 1.1323 | 9.4% |
 * | 128 | 0.2172 | 0.3135 | 0.0229 | 2.9762 | 10.5% |
 * | 256 | 0.3814 | 0.7007 | 0.0384 | 6.9658 | 10.1% |
 * | 512 | 0.7823 | 1.3534 | 0.0701 | 15.0949 | 9.0% |
 * | 1024 | 1.5730 | 2.6795 | 0.1366 | 30.8567 | 8.7% |
 * | 1280 | 1.9996 | 3.2903 | 0.1700 | 38.7048 | 8.5% |
 * | 2048 | 3.4121 | 4.9289 | 0.2821 | 59.6254 | 8.3% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0118 | 0.4022 | 14.0% |
 * | 64 | 0.1674 | 0.1055 | 0.0154 | 1.1488 | 9.2% |
 * | 128 | 0.2171 | 0.3137 | 0.0229 | 2.9762 | 10.5% |
 * | 256 | 0.3802 | 0.7030 | 0.0387 | 6.9025 | 10.2% |
 * | 512 | 0.7824 | 1.3534 | 0.0696 | 15.2059 | 8.9% |
 * | 1024 | 1.5681 | 2.6878 | 0.1358 | 31.0312 | 8.7% |
 * | 1280 | 1.9977 | 3.2934 | 0.1700 | 38.7048 | 8.5% |
 * | 2048 | 3.4121 | 4.9290 | 0.2814 | 59.7712 | 8.2% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0118 | 0.4000 | 14.1% |
 * | 64 | 0.1675 | 0.1054 | 0.0155 | 1.1417 | 9.2% |
 * | 128 | 0.2171 | 0.3137 | 0.0230 | 2.9556 | 10.6% |
 * | 256 | 0.3808 | 0.7018 | 0.0385 | 6.9398 | 10.1% |
 * | 512 | 0.7802 | 1.3572 | 0.0699 | 15.1571 | 9.0% |
 * | 1024 | 1.5697 | 2.6851 | 0.1372 | 30.7164 | 8.7% |
 * | 1280 | 1.9988 | 3.2915 | 0.1703 | 38.6248 | 8.5% |
 * | 2048 | 3.4125 | 4.9284 | 0.2806 | 59.9416 | 8.2% |
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
 * | 32 | 0.0840 | 0.0564 | 0.0116 | 0.4088 | 13.8% |
 * | 64 | 0.1674 | 0.1055 | 0.0155 | 1.1417 | 9.2% |
 * | 128 | 0.2174 | 0.3133 | 0.0231 | 2.9474 | 10.6% |
 * | 256 | 0.3809 | 0.7017 | 0.0383 | 6.9774 | 10.1% |
 * | 512 | 0.7810 | 1.3557 | 0.0704 | 15.0332 | 9.0% |
 * | 1024 | 1.5697 | 2.6851 | 0.1352 | 31.1818 | 8.6% |
 * | 1280 | 1.9968 | 3.2949 | 0.1700 | 38.7048 | 8.5% |
 * | 2048 | 3.4099 | 4.9322 | 0.2824 | 59.5646 | 8.3% |
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
 * | 32 | 0.1073 | 0.0441 | 0.0163 | 0.2913 | 15.2% |
 * | 64 | 0.2139 | 0.0826 | 0.0208 | 0.8486 | 9.7% |
 * | 128 | 0.2787 | 0.2443 | 0.0299 | 2.2784 | 10.7% |
 * | 256 | 0.4882 | 0.5474 | 0.0509 | 5.2462 | 10.4% |
 * | 512 | 0.9949 | 1.0642 | 0.0903 | 11.7313 | 9.1% |
 * | 1024 | 1.8841 | 2.2370 | 0.1732 | 24.3325 | 9.2% |
 * | 1280 | 1.9973 | 3.2941 | 0.2172 | 30.2932 | 10.9% |
 * | 2048 | 3.4119 | 4.9293 | 0.3597 | 46.7566 | 10.5% |
 * | 4096 | 8.1596 | 8.2346 | 0.8315 | 80.8048 | 10.2% |
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
 * | 32 | 0.0734 | 0.0645 | 0.0081 | 0.5827 | 11.1% |
 * | 64 | 0.1451 | 0.1217 | 0.0111 | 1.5977 | 7.6% |
 * | 128 | 0.1910 | 0.3565 | 0.0177 | 3.8446 | 9.3% |
 * | 256 | 0.3372 | 0.7927 | 0.0307 | 8.7000 | 9.1% |
 * | 512 | 0.6940 | 1.5256 | 0.0576 | 18.3976 | 8.3% |
 * | 1024 | 1.4174 | 2.9737 | 0.1132 | 37.2383 | 8.0% |
 * | 1280 | 1.8103 | 3.6344 | 0.1413 | 46.5474 | 7.8% |
 * | 2048 | 3.1153 | 5.3985 | 0.2336 | 72.0104 | 7.5% |
 * | 4096 | 7.5748 | 8.8703 | 0.5390 | 124.6527 | 7.1% |
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
 * | 32 | 0.0853 | 0.0555 |
 * | 64 | 0.1741 | 0.1015 |
 * | 128 | 0.2331 | 0.2921 |
 * | 256 | 0.4137 | 0.6460 |
 * | 512 | 0.8628 | 1.2271 |
 * | 1024 | 1.7654 | 2.3874 |
 * | 1280 | 2.2853 | 2.8789 |
 * | 2048 | 3.9579 | 4.2492 |
 * | 4096 | 9.9104 | 6.7798 |
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
 * | 32 | 0.0840 | 0.0564 |
 * | 64 | 0.1665 | 0.1061 |
 * | 128 | 0.2173 | 0.3133 |
 * | 256 | 0.3805 | 0.7024 |
 * | 512 | 0.7800 | 1.3575 |
 * | 1024 | 1.5684 | 2.6874 |
 * | 1280 | 1.9990 | 3.2912 |
 * | 2048 | 3.4120 | 4.9291 |
 * | 4096 | 8.1567 | 8.2375 |
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
