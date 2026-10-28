/**
 * Benchmark results for snrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0115 | 0.0112 | 0.0173 | 0.0074 | 151.0% |
 * | 64 | 0.0117 | 0.0219 | 0.0180 | 0.0143 | 152.9% |
 * | 128 | 0.0115 | 0.0444 | 0.0180 | 0.0285 | 155.7% |
 * | 512 | 0.0116 | 0.1758 | 0.0179 | 0.1142 | 154.0% |
 * | 1024 | 0.0116 | 0.3521 | 0.0180 | 0.2276 | 154.7% |
 * | 4096 | 0.0114 | 1.4382 | 0.0180 | 0.9110 | 157.9% |
 * | 16384 | 0.0120 | 5.4613 | 0.0179 | 3.6539 | 149.5% |
 * | 65536 | 0.0124 | 21.1134 | 0.0179 | 14.6286 | 144.3% |
 * | 262144 | 0.0172 | 61.1343 | 0.0191 | 54.7960 | 111.6% |
 * | 1048576 | 0.0372 | 112.6532 | 0.0445 | 94.2964 | 119.5% |
 * | 4194304 | 0.1082 | 155.1148 | 0.1413 | 118.7381 | 130.6% |
 * | 16777216 | 0.4275 | 156.9666 | 0.5882 | 114.0997 | 137.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![snrm2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-default.svg)
 *
 * ![snrm2-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-default.svg)
 *
 * ## See also
 *
 * - [snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/snrm2.js) — WebGPU benchmark script
 * - [snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/snrm2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0113 | 0.0113 | 0.0175 | 0.0073 | 154.8% |
 * | 64 | 0.0117 | 0.0219 | 0.0180 | 0.0142 | 154.4% |
 * | 128 | 0.0116 | 0.0440 | 0.0180 | 0.0284 | 155.0% |
 * | 512 | 0.0115 | 0.1783 | 0.0180 | 0.1138 | 156.7% |
 * | 1024 | 0.0116 | 0.3531 | 0.0180 | 0.2276 | 155.1% |
 * | 4096 | 0.0115 | 1.4262 | 0.0180 | 0.9110 | 156.6% |
 * | 16384 | 0.0123 | 5.3333 | 0.0180 | 3.6441 | 146.4% |
 * | 65536 | 0.0159 | 16.4829 | 0.0188 | 13.9083 | 118.5% |
 * | 262144 | 0.0360 | 29.1530 | 0.0368 | 28.4939 | 102.3% |
 * | 1048576 | 0.1025 | 40.9344 | 0.1058 | 39.6347 | 103.3% |
 * | 4194304 | 0.3704 | 45.2968 | 0.3735 | 44.9146 | 100.9% |
 *
 * ![snrm2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride4.svg)
 *
 * ![snrm2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0116 | 0.0110 | 0.0180 | 0.0071 | 155.0% |
 * | 64 | 0.0117 | 0.0218 | 0.0180 | 0.0143 | 152.4% |
 * | 128 | 0.0118 | 0.0435 | 0.0180 | 0.0284 | 153.1% |
 * | 512 | 0.0117 | 0.1746 | 0.0179 | 0.1143 | 152.8% |
 * | 1024 | 0.0118 | 0.3474 | 0.0180 | 0.2278 | 152.5% |
 * | 4096 | 0.0119 | 1.3782 | 0.0179 | 0.9151 | 150.6% |
 * | 16384 | 0.0123 | 5.3333 | 0.0180 | 3.6506 | 146.1% |
 * | 65536 | 0.0201 | 13.0446 | 0.0271 | 9.6718 | 134.9% |
 * | 262144 | 0.0410 | 25.5800 | 0.0452 | 23.2232 | 110.1% |
 * | 1048576 | 0.1249 | 33.5910 | 0.1284 | 32.6618 | 102.8% |
 * | 4194304 | 0.4589 | 36.5587 | 0.4636 | 36.1927 | 101.0% |
 *
 * ![snrm2-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride5.svg)
 *
 * ![snrm2-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0118 | 0.0109 | 0.0180 | 0.0071 | 152.9% |
 * | 64 | 0.0116 | 0.0221 | 0.0179 | 0.0143 | 154.5% |
 * | 128 | 0.0119 | 0.0430 | 0.0180 | 0.0285 | 150.9% |
 * | 512 | 0.0118 | 0.1739 | 0.0180 | 0.1135 | 153.2% |
 * | 1024 | 0.0118 | 0.3474 | 0.0185 | 0.2216 | 156.7% |
 * | 4096 | 0.0122 | 1.3438 | 0.0184 | 0.8928 | 150.5% |
 * | 16384 | 0.0185 | 3.5433 | 0.0396 | 1.6543 | 214.2% |
 * | 65536 | 0.0352 | 7.4473 | 0.0523 | 5.0150 | 148.5% |
 * | 262144 | 0.1038 | 10.1042 | 0.1210 | 8.6631 | 116.6% |
 * | 1048576 | 0.3737 | 11.2234 | 0.3879 | 10.8136 | 103.8% |
 *
 * ![snrm2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride32.svg)
 *
 * ![snrm2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0117 | 0.0219 | 0.0175 | 0.0147 | 149.1% |
 * | 128 | 0.0118 | 0.0435 | 0.0178 | 0.0288 | 151.2% |
 * | 512 | 0.0116 | 0.1766 | 0.0181 | 0.1134 | 155.7% |
 * | 1024 | 0.0117 | 0.3507 | 0.0180 | 0.2282 | 153.7% |
 * | 4096 | 0.0118 | 1.3913 | 0.0181 | 0.9030 | 154.1% |
 * | 16384 | 0.0184 | 3.5556 | 0.0395 | 1.6596 | 214.2% |
 * | 65536 | 0.0359 | 7.3045 | 0.0524 | 5.0073 | 145.9% |
 * | 262144 | 0.1050 | 9.9857 | 0.1210 | 8.6653 | 115.2% |
 *
 * ![snrm2-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride33.svg)
 *
 * ![snrm2-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0126 | 0.1620 | 0.0179 | 0.1147 | 141.3% |
 * | 1024 | 0.0127 | 0.3216 | 0.0175 | 0.2340 | 137.4% |
 * | 4096 | 0.0136 | 1.2033 | 0.0180 | 0.9127 | 131.8% |
 * | 16384 | 0.0263 | 2.4930 | 0.0585 | 1.1194 | 222.7% |
 * | 65536 | 0.0591 | 4.4365 | 0.0933 | 2.8103 | 157.9% |
 *
 * ![snrm2-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride255.svg)
 *
 * ![snrm2-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0128 | 0.1600 | 0.0180 | 0.1136 | 140.8% |
 * | 1024 | 0.0123 | 0.3333 | 0.0180 | 0.2270 | 146.8% |
 * | 4096 | 0.0125 | 1.3095 | 0.0180 | 0.9110 | 143.7% |
 * | 16384 | 0.0219 | 2.9898 | 0.0487 | 1.3469 | 222.0% |
 * | 65536 | 0.0461 | 5.6889 | 0.0730 | 3.5890 | 158.5% |
 *
 * ![snrm2-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride256.svg)
 *
 * ![snrm2-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/stride.snrm2.js) — WebGPU stride-sweep benchmark script
 * - [stride.snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/stride.snrm2.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/snrm2
 */
