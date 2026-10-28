/**
 * Benchmark results for drotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.1370 | 0.0036 | 0.2857 | 48.0% |
 * | 64 | 0.0072 | 0.2832 | 0.0037 | 0.5517 | 51.3% |
 * | 128 | 0.0071 | 0.5740 | 0.0036 | 1.1429 | 50.2% |
 * | 512 | 0.0074 | 2.2261 | 0.0038 | 4.3025 | 51.7% |
 * | 1024 | 0.0075 | 4.3854 | 0.0039 | 8.3252 | 52.7% |
 * | 4096 | 0.0077 | 16.9959 | 0.0038 | 34.1333 | 49.8% |
 * | 16384 | 0.0101 | 51.8481 | 0.0068 | 76.5607 | 67.7% |
 * | 65536 | 0.0217 | 96.7321 | 0.0165 | 127.2544 | 76.0% |
 * | 262144 | 0.0621 | 135.0562 | 0.0575 | 145.9193 | 92.6% |
 * | 1048576 | 0.2224 | 150.8960 | 0.2178 | 154.0664 | 97.9% |
 * | 4194304 | 0.8888 | 151.0046 | 0.8626 | 155.5982 | 97.0% |
 * | 16777216 | 3.2727 | 164.0451 | 3.4591 | 155.2059 | 105.7% |
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
 * | 32 | 0.0075 | 0.1373 | 0.0034 | 0.2977 | 46.1% |
 * | 64 | 0.0073 | 0.2795 | 0.0035 | 0.5872 | 47.6% |
 * | 128 | 0.0074 | 0.5553 | 0.0036 | 1.1378 | 48.8% |
 * | 512 | 0.0074 | 2.2069 | 0.0039 | 4.2314 | 52.2% |
 * | 1024 | 0.0076 | 4.2845 | 0.0039 | 8.3252 | 51.5% |
 * | 4096 | 0.0090 | 14.5506 | 0.0044 | 30.0073 | 48.5% |
 * | 16384 | 0.0160 | 32.8666 | 0.0094 | 55.7279 | 59.0% |
 * | 65536 | 0.0687 | 30.5102 | 0.0557 | 37.6211 | 81.1% |
 * | 262144 | 0.2785 | 30.1176 | 0.2109 | 39.7670 | 75.7% |
 * | 1048576 | 1.1284 | 29.7350 | 0.8294 | 40.4559 | 73.5% |
 * | 4194304 | 4.4723 | 30.0108 | 3.3095 | 40.5554 | 74.0% |
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
 * | 32 | 0.0076 | 0.1350 | 0.0036 | 0.2857 | 47.3% |
 * | 64 | 0.0073 | 0.2801 | 0.0035 | 0.5872 | 47.7% |
 * | 128 | 0.0074 | 0.5517 | 0.0037 | 1.0940 | 50.4% |
 * | 512 | 0.0074 | 2.2022 | 0.0039 | 4.2314 | 52.0% |
 * | 1024 | 0.0080 | 4.1124 | 0.0041 | 8.0630 | 51.0% |
 * | 4096 | 0.0095 | 13.8613 | 0.0044 | 29.4676 | 47.0% |
 * | 16384 | 0.0244 | 21.4731 | 0.0186 | 28.1512 | 76.3% |
 * | 65536 | 0.0940 | 22.3215 | 0.0695 | 30.1662 | 74.0% |
 * | 262144 | 0.3836 | 21.8708 | 0.2684 | 31.2541 | 70.0% |
 * | 1048576 | 1.5239 | 22.0194 | 1.0655 | 31.4925 | 69.9% |
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
 * | 32 | 0.0079 | 0.1301 | 0.0035 | 0.2922 | 44.5% |
 * | 64 | 0.0076 | 0.2678 | 0.0037 | 0.5565 | 48.1% |
 * | 128 | 0.0078 | 0.5224 | 0.0038 | 1.0756 | 48.6% |
 * | 512 | 0.0083 | 1.9845 | 0.0045 | 3.6571 | 54.3% |
 * | 1024 | 0.0083 | 3.9690 | 0.0045 | 7.2883 | 54.5% |
 * | 4096 | 0.0211 | 6.2014 | 0.0067 | 19.6451 | 31.6% |
 * | 16384 | 0.0706 | 7.4237 | 0.0429 | 12.2314 | 60.7% |
 * | 65536 | 0.2785 | 7.5294 | 0.1865 | 11.2431 | 67.0% |
 * | 262144 | 1.0986 | 7.6354 | 0.7479 | 11.2159 | 68.1% |
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
 * | 64 | 0.0075 | 0.2735 | 0.0037 | 0.5541 | 49.4% |
 * | 128 | 0.0078 | 0.5278 | 0.0038 | 1.0894 | 48.5% |
 * | 512 | 0.0082 | 2.0039 | 0.0042 | 3.8788 | 51.7% |
 * | 1024 | 0.0083 | 3.9690 | 0.0044 | 7.5294 | 52.7% |
 * | 4096 | 0.0221 | 5.9362 | 0.0101 | 13.0032 | 45.7% |
 * | 16384 | 0.0758 | 6.9189 | 0.0491 | 10.6875 | 64.7% |
 * | 65536 | 0.3092 | 6.7815 | 0.2112 | 9.9320 | 68.3% |
 * | 262144 | 1.2656 | 6.6281 | 0.8806 | 9.5256 | 69.6% |
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
 * | 512 | 0.0082 | 2.0000 | 0.0043 | 3.7926 | 52.7% |
 * | 1024 | 0.0087 | 3.7786 | 0.0043 | 7.6992 | 49.1% |
 * | 4096 | 0.0315 | 4.1668 | 0.0132 | 9.9659 | 41.8% |
 * | 16384 | 0.1249 | 4.1967 | 0.0740 | 7.0834 | 59.2% |
 * | 65536 | 0.5924 | 3.5399 | 0.3076 | 6.8181 | 51.9% |
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
 * | 512 | 0.0082 | 2.0000 | 0.0045 | 3.6571 | 54.7% |
 * | 1024 | 0.0085 | 3.8642 | 0.0045 | 7.2883 | 53.0% |
 * | 4096 | 0.0287 | 4.5714 | 0.0099 | 13.2129 | 34.6% |
 * | 16384 | 0.1112 | 4.7169 | 0.0692 | 7.5817 | 62.2% |
 * | 65536 | 0.5576 | 3.7612 | 0.3010 | 6.9671 | 54.0% |
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
