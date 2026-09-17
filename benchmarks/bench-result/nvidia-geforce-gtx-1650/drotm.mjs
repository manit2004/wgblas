/**
 * Benchmark results for drotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0089 | 0.1155 | 0.0041 | 0.2500 | 46.2% |
 * | 64 | 0.0086 | 0.2379 | 0.0041 | 0.5020 | 47.4% |
 * | 128 | 0.0088 | 0.4672 | 0.0041 | 0.9961 | 46.9% |
 * | 512 | 0.0087 | 1.8755 | 0.0044 | 3.6835 | 50.9% |
 * | 1024 | 0.0087 | 3.7509 | 0.0046 | 7.1111 | 52.7% |
 * | 4096 | 0.0091 | 14.3719 | 0.0045 | 28.9470 | 49.6% |
 * | 16384 | 0.0122 | 42.9463 | 0.0082 | 64.0000 | 67.1% |
 * | 65536 | 0.0246 | 85.3333 | 0.0213 | 98.5504 | 86.6% |
 * | 262144 | 0.0659 | 127.2853 | 0.0731 | 114.8244 | 110.9% |
 * | 1048576 | 0.2328 | 144.1540 | 0.2744 | 122.2686 | 117.9% |
 * | 4194304 | 0.8984 | 149.3884 | 1.0840 | 123.8207 | 120.6% |
 * | 16777216 | 3.1595 | 169.9251 | 3.4607 | 155.1349 | 109.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![drotm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-default.svg)
 *
 * ![drotm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-default.svg)
 *
 * ## See also
 *
 * - [drotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/drotm/wgblas/drotm.js) — WebGPU benchmark script
 * - [drotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/drotm/cuda/drotm.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0075 | 0.1362 | 0.0035 | 0.2949 | 46.2% |
 * | 64 | 0.0071 | 0.2870 | 0.0035 | 0.5792 | 49.6% |
 * | 128 | 0.0072 | 0.5727 | 0.0037 | 1.1082 | 51.7% |
 * | 512 | 0.0074 | 2.2213 | 0.0039 | 4.1967 | 52.9% |
 * | 1024 | 0.0075 | 4.3667 | 0.0039 | 8.3934 | 52.0% |
 * | 4096 | 0.0089 | 14.6547 | 0.0044 | 30.0073 | 48.8% |
 * | 16384 | 0.0161 | 32.6375 | 0.0097 | 54.2517 | 60.2% |
 * | 65536 | 0.0671 | 31.2597 | 0.0555 | 37.7729 | 82.8% |
 * | 262144 | 0.2740 | 30.6100 | 0.2109 | 39.7670 | 77.0% |
 * | 1048576 | 1.0916 | 30.7379 | 0.8298 | 40.4379 | 76.0% |
 * | 4194304 | 4.3705 | 30.7102 | 3.3073 | 40.5821 | 75.7% |
 *
 * ![drotm-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-stride4.svg)
 *
 * ![drotm-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 0.1385 | 0.0036 | 0.2883 | 48.0% |
 * | 64 | 0.0072 | 0.2857 | 0.0035 | 0.5818 | 49.1% |
 * | 128 | 0.0072 | 0.5651 | 0.0036 | 1.1429 | 49.4% |
 * | 512 | 0.0074 | 2.2165 | 0.0039 | 4.2490 | 52.2% |
 * | 1024 | 0.0076 | 4.3025 | 0.0040 | 8.1920 | 52.5% |
 * | 4096 | 0.0096 | 13.6990 | 0.0044 | 29.8978 | 45.8% |
 * | 16384 | 0.0245 | 21.4170 | 0.0186 | 28.1512 | 76.1% |
 * | 65536 | 0.0921 | 22.7714 | 0.0696 | 30.1176 | 75.6% |
 * | 262144 | 0.3763 | 22.2931 | 0.2694 | 31.1353 | 71.6% |
 * | 1048576 | 1.5050 | 22.2959 | 1.0660 | 31.4755 | 70.8% |
 *
 * ![drotm-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-stride5.svg)
 *
 * ![drotm-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.1350 | 0.0036 | 0.2844 | 47.5% |
 * | 64 | 0.0076 | 0.2689 | 0.0037 | 0.5541 | 48.5% |
 * | 128 | 0.0076 | 0.5378 | 0.0038 | 1.0847 | 49.6% |
 * | 512 | 0.0081 | 2.0237 | 0.0045 | 3.6312 | 55.7% |
 * | 1024 | 0.0083 | 3.9385 | 0.0045 | 7.3143 | 53.8% |
 * | 4096 | 0.0205 | 6.3801 | 0.0067 | 19.6923 | 32.4% |
 * | 16384 | 0.0715 | 7.3290 | 0.0433 | 12.1183 | 60.5% |
 * | 65536 | 0.2785 | 7.5307 | 0.1826 | 11.4844 | 65.6% |
 * | 262144 | 1.1304 | 7.4207 | 0.7412 | 11.3169 | 65.6% |
 *
 * ![drotm-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-stride32.svg)
 *
 * ![drotm-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 0.1667 | 0.0036 | 0.5740 | 29.0% |
 * | 128 | 0.0125 | 0.3274 | 0.0037 | 1.1034 | 29.7% |
 * | 512 | 0.0139 | 1.1784 | 0.0043 | 3.8496 | 30.6% |
 * | 1024 | 0.0148 | 2.2117 | 0.0044 | 7.5294 | 29.4% |
 * | 4096 | 0.0284 | 4.6178 | 0.0100 | 13.0446 | 35.4% |
 * | 16384 | 0.0842 | 6.2273 | 0.0491 | 10.6736 | 58.3% |
 * | 65536 | 0.3412 | 6.1467 | 0.2122 | 9.8825 | 62.2% |
 * | 262144 | 1.5528 | 5.4023 | 0.8791 | 9.5421 | 56.6% |
 *
 * ![drotm-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-stride33.svg)
 *
 * ![drotm-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0160 | 1.0230 | 0.0043 | 3.8209 | 26.8% |
 * | 1024 | 0.0170 | 1.9321 | 0.0043 | 7.6992 | 25.1% |
 * | 4096 | 0.0450 | 2.9112 | 0.0127 | 10.3565 | 28.1% |
 * | 16384 | 0.1659 | 3.1596 | 0.0726 | 7.2176 | 43.8% |
 * | 65536 | 2.8159 | 0.7448 | 0.3072 | 6.8267 | 10.9% |
 *
 * ![drotm-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-stride255.svg)
 *
 * ![drotm-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0145 | 1.1302 | 0.0044 | 3.6835 | 30.7% |
 * | 1024 | 0.0164 | 2.0000 | 0.0044 | 7.4203 | 27.0% |
 * | 4096 | 0.0389 | 3.3684 | 0.0101 | 12.9211 | 26.1% |
 * | 16384 | 0.1355 | 3.8696 | 0.0714 | 7.3438 | 52.7% |
 * | 65536 | 2.7089 | 0.7742 | 0.2980 | 7.0382 | 11.0% |
 *
 * ![drotm-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/gbps-stride256.svg)
 *
 * ![drotm-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drotm/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.drotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/drotm/wgblas/stride.drotm.js) — WebGPU stride-sweep benchmark script
 * - [stride.drotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/drotm/cuda/stride.drotm.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/drotm
 */
