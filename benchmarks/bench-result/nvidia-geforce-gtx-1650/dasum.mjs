/**
 * Benchmark results for dasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0136 | 0.0188 | 0.0173 | 0.0148 | 127.2% |
 * | 64 | 0.0138 | 0.0370 | 0.0180 | 0.0285 | 130.0% |
 * | 128 | 0.0139 | 0.0739 | 0.0179 | 0.0572 | 129.2% |
 * | 512 | 0.0137 | 0.2994 | 0.0180 | 0.2282 | 131.2% |
 * | 1024 | 0.0140 | 0.5872 | 0.0179 | 0.4576 | 128.3% |
 * | 4096 | 0.0139 | 2.3594 | 0.0180 | 1.8237 | 129.4% |
 * | 16384 | 0.0144 | 9.0820 | 0.0181 | 7.2496 | 125.3% |
 * | 65536 | 0.0160 | 32.6700 | 0.0180 | 29.0754 | 112.4% |
 * | 262144 | 0.0285 | 73.5533 | 0.0347 | 60.4297 | 121.7% |
 * | 1048576 | 0.0638 | 131.4994 | 0.0747 | 112.2432 | 117.2% |
 * | 4194304 | 0.2020 | 166.1110 | 0.2372 | 141.4891 | 117.4% |
 * | 16777216 | 0.7496 | 179.0563 | 0.8772 | 153.0154 | 117.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dasum-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-default.svg)
 *
 * ![dasum-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-default.svg)
 *
 * ## See also
 *
 * - [dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/dasum.js) — WebGPU benchmark script
 * - [dasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/cuda/dasum.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0138 | 0.0185 | 0.0180 | 0.0143 | 129.5% |
 * | 64 | 0.0140 | 0.0367 | 0.0179 | 0.0286 | 128.3% |
 * | 128 | 0.0136 | 0.0753 | 0.0179 | 0.0571 | 131.9% |
 * | 512 | 0.0139 | 0.2946 | 0.0180 | 0.2282 | 129.1% |
 * | 1024 | 0.0139 | 0.5912 | 0.0181 | 0.4515 | 130.9% |
 * | 4096 | 0.0142 | 2.3011 | 0.0181 | 1.8060 | 127.4% |
 * | 16384 | 0.0159 | 8.2581 | 0.0175 | 7.4813 | 110.4% |
 * | 65536 | 0.0276 | 19.0180 | 0.0312 | 16.7955 | 113.2% |
 * | 262144 | 0.0613 | 34.1957 | 0.0648 | 32.3714 | 105.6% |
 * | 1048576 | 0.1947 | 43.0910 | 0.1967 | 42.6389 | 101.1% |
 * | 4194304 | 0.7297 | 45.9821 | 0.7305 | 45.9318 | 100.1% |
 *
 * ![dasum-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride4.svg)
 *
 * ![dasum-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0139 | 0.0185 | 0.0179 | 0.0143 | 129.2% |
 * | 64 | 0.0137 | 0.0373 | 0.0180 | 0.0285 | 130.7% |
 * | 128 | 0.0139 | 0.0739 | 0.0180 | 0.0569 | 129.9% |
 * | 512 | 0.0136 | 0.3012 | 0.0180 | 0.2280 | 132.1% |
 * | 1024 | 0.0140 | 0.5831 | 0.0179 | 0.4571 | 127.6% |
 * | 4096 | 0.0143 | 2.2857 | 0.0180 | 1.8253 | 125.2% |
 * | 16384 | 0.0163 | 8.0393 | 0.0180 | 7.2753 | 110.5% |
 * | 65536 | 0.0304 | 17.2645 | 0.0312 | 16.7783 | 102.9% |
 * | 262144 | 0.0720 | 29.1271 | 0.0757 | 27.7108 | 105.1% |
 * | 1048576 | 0.2393 | 35.0601 | 0.2394 | 35.0343 | 100.1% |
 *
 * ![dasum-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride5.svg)
 *
 * ![dasum-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0138 | 0.0186 | 0.0179 | 0.0143 | 129.8% |
 * | 64 | 0.0138 | 0.0370 | 0.0180 | 0.0285 | 130.0% |
 * | 128 | 0.0142 | 0.0719 | 0.0180 | 0.0568 | 126.6% |
 * | 512 | 0.0141 | 0.2909 | 0.0180 | 0.2282 | 127.5% |
 * | 1024 | 0.0142 | 0.5759 | 0.0176 | 0.4642 | 124.1% |
 * | 4096 | 0.0167 | 1.9655 | 0.0180 | 1.8237 | 107.8% |
 * | 16384 | 0.0268 | 4.8820 | 0.0214 | 6.1134 | 79.9% |
 * | 65536 | 0.0606 | 8.6528 | 0.0397 | 13.2129 | 65.5% |
 * | 262144 | 0.1961 | 10.6928 | 0.1080 | 19.4181 | 55.1% |
 *
 * ![dasum-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride32.svg)
 *
 * ![dasum-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0136 | 0.0375 | 0.0180 | 0.0284 | 132.1% |
 * | 128 | 0.0138 | 0.0743 | 0.0180 | 0.0568 | 130.9% |
 * | 512 | 0.0139 | 0.2949 | 0.0180 | 0.2282 | 129.2% |
 * | 1024 | 0.0140 | 0.5845 | 0.0180 | 0.4559 | 128.2% |
 * | 4096 | 0.0164 | 2.0000 | 0.0179 | 1.8318 | 109.2% |
 * | 16384 | 0.0270 | 4.8560 | 0.0209 | 6.2630 | 77.5% |
 * | 65536 | 0.0604 | 8.6803 | 0.0396 | 13.2557 | 65.5% |
 * | 262144 | 0.1948 | 10.7674 | 0.1080 | 19.4209 | 55.4% |
 *
 * ![dasum-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride33.svg)
 *
 * ![dasum-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0141 | 0.2902 | 0.0174 | 0.2351 | 123.5% |
 * | 1024 | 0.0143 | 0.5714 | 0.0173 | 0.4736 | 120.7% |
 * | 4096 | 0.0179 | 1.8286 | 0.0173 | 1.8910 | 96.7% |
 * | 16384 | 0.0377 | 3.4771 | 0.0298 | 4.3996 | 79.0% |
 * | 65536 | 0.1092 | 4.8012 | 0.0604 | 8.6872 | 55.3% |
 *
 * ![dasum-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride255.svg)
 *
 * ![dasum-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0140 | 0.2929 | 0.0180 | 0.2278 | 128.6% |
 * | 1024 | 0.0141 | 0.5805 | 0.0180 | 0.4559 | 127.3% |
 * | 4096 | 0.0173 | 1.8910 | 0.0180 | 1.8188 | 104.0% |
 * | 16384 | 0.0326 | 4.0196 | 0.0219 | 5.9971 | 67.0% |
 * | 65536 | 0.0840 | 6.2403 | 0.0506 | 10.3696 | 60.2% |
 *
 * ![dasum-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride256.svg)
 *
 * ![dasum-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/stride.dasum.js) — WebGPU stride-sweep benchmark script
 * - [stride.dasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/cuda/stride.dasum.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dasum
 */
