/**
 * Benchmark results for dcopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0059 | 0.0867 | 0.0027 | 0.1905 | 45.5% |
 * | 64 | 0.0061 | 0.1667 | 0.0027 | 0.3832 | 43.5% |
 * | 128 | 0.0060 | 0.3386 | 0.0027 | 0.7619 | 44.4% |
 * | 512 | 0.0061 | 1.3368 | 0.0028 | 2.9425 | 45.4% |
 * | 1024 | 0.0061 | 2.7018 | 0.0028 | 5.9535 | 45.4% |
 * | 4096 | 0.0061 | 10.6667 | 0.0028 | 23.4057 | 45.6% |
 * | 16384 | 0.0065 | 40.5545 | 0.0034 | 76.9202 | 52.7% |
 * | 65536 | 0.0098 | 107.0850 | 0.0059 | 177.1243 | 60.5% |
 * | 262144 | 0.0287 | 146.2857 | 0.0271 | 154.9314 | 94.4% |
 * | 1048576 | 0.1029 | 163.1009 | 0.1004 | 167.1837 | 97.6% |
 * | 4194304 | 0.3985 | 168.4054 | 0.3932 | 170.6667 | 98.7% |
 * | 16777216 | 1.5800 | 169.8907 | 1.5647 | 171.5602 | 99.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dcopy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-default.svg)
 *
 * ![dcopy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-default.svg)
 *
 * ## See also
 *
 * - [dcopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/wgblas/dcopy.js) — WebGPU benchmark script
 * - [dcopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/cuda/dcopy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0060 | 0.0856 | 0.0029 | 0.1778 | 48.1% |
 * | 64 | 0.0060 | 0.1716 | 0.0029 | 0.3556 | 48.3% |
 * | 128 | 0.0060 | 0.3432 | 0.0028 | 0.7191 | 47.7% |
 * | 512 | 0.0060 | 1.3617 | 0.0032 | 2.5859 | 52.7% |
 * | 1024 | 0.0061 | 2.7018 | 0.0033 | 4.9709 | 54.4% |
 * | 4096 | 0.0064 | 10.2915 | 0.0036 | 18.4505 | 55.8% |
 * | 16384 | 0.0095 | 27.4899 | 0.0056 | 46.5455 | 59.1% |
 * | 65536 | 0.0395 | 26.5758 | 0.0410 | 25.5800 | 103.9% |
 * | 262144 | 0.1556 | 26.9557 | 0.1554 | 26.9973 | 99.8% |
 * | 1048576 | 0.6158 | 27.2442 | 0.6124 | 27.3980 | 99.4% |
 * | 4194304 | 2.4596 | 27.2839 | 2.4392 | 27.5121 | 99.2% |
 *
 * ![dcopy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride4.svg)
 *
 * ![dcopy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0860 | 0.0028 | 0.1798 | 47.8% |
 * | 64 | 0.0061 | 0.1680 | 0.0029 | 0.3478 | 48.3% |
 * | 128 | 0.0060 | 0.3422 | 0.0029 | 0.7072 | 48.4% |
 * | 512 | 0.0060 | 1.3617 | 0.0032 | 2.5859 | 52.7% |
 * | 1024 | 0.0061 | 2.6667 | 0.0032 | 5.0693 | 52.6% |
 * | 4096 | 0.0066 | 9.9659 | 0.0038 | 17.2101 | 57.9% |
 * | 16384 | 0.0120 | 21.8162 | 0.0091 | 28.6935 | 76.0% |
 * | 65536 | 0.0492 | 21.3333 | 0.0440 | 23.8486 | 89.5% |
 * | 262144 | 0.1966 | 21.3351 | 0.1686 | 24.8713 | 85.8% |
 * | 1048576 | 0.7811 | 21.4793 | 0.6677 | 25.1252 | 85.5% |
 *
 * ![dcopy-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride5.svg)
 *
 * ![dcopy-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0029 | 0.1768 | 47.1% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3556 | 46.9% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6882 | 48.4% |
 * | 512 | 0.0065 | 1.2549 | 0.0036 | 2.2456 | 55.9% |
 * | 1024 | 0.0064 | 2.5473 | 0.0037 | 4.4522 | 57.2% |
 * | 4096 | 0.0110 | 5.9622 | 0.0043 | 15.3985 | 38.7% |
 * | 16384 | 0.0369 | 7.1111 | 0.0213 | 12.2911 | 57.9% |
 * | 65536 | 0.1414 | 7.4136 | 0.0818 | 12.8200 | 57.8% |
 * | 262144 | 0.5583 | 7.5126 | 0.3282 | 12.7800 | 58.8% |
 *
 * ![dcopy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride32.svg)
 *
 * ![dcopy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1671 | 0.0029 | 0.3556 | 47.0% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6809 | 49.0% |
 * | 512 | 0.0061 | 1.3333 | 0.0034 | 2.3925 | 55.7% |
 * | 1024 | 0.0063 | 2.5990 | 0.0036 | 4.5919 | 56.6% |
 * | 4096 | 0.0108 | 6.0772 | 0.0042 | 15.6336 | 38.9% |
 * | 16384 | 0.0389 | 6.7368 | 0.0243 | 10.7931 | 62.4% |
 * | 65536 | 0.1618 | 6.4810 | 0.0917 | 11.4393 | 56.7% |
 * | 262144 | 0.6582 | 6.3723 | 0.3730 | 11.2460 | 56.7% |
 *
 * ![dcopy-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride33.svg)
 *
 * ![dcopy-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2995 | 0.0034 | 2.3814 | 54.6% |
 * | 1024 | 0.0066 | 2.4854 | 0.0035 | 4.7407 | 52.4% |
 * | 4096 | 0.0155 | 4.2227 | 0.0041 | 16.0000 | 26.4% |
 * | 16384 | 0.0695 | 3.7742 | 0.0360 | 7.2850 | 51.8% |
 * | 65536 | 0.3122 | 3.3586 | 0.1402 | 7.4770 | 44.9% |
 *
 * ![dcopy-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride255.svg)
 *
 * ![dcopy-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2995 | 0.0036 | 2.2655 | 57.4% |
 * | 1024 | 0.0068 | 2.4265 | 0.0037 | 4.4138 | 55.0% |
 * | 4096 | 0.0140 | 4.6865 | 0.0043 | 15.1704 | 30.9% |
 * | 16384 | 0.0636 | 4.1187 | 0.0349 | 7.5087 | 54.9% |
 * | 65536 | 0.2907 | 3.6068 | 0.1368 | 7.6641 | 47.1% |
 *
 * ![dcopy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride256.svg)
 *
 * ![dcopy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dcopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/wgblas/stride.dcopy.js) — WebGPU stride-sweep benchmark script
 * - [stride.dcopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/cuda/stride.dcopy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dcopy
 */
