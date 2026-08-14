/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0186 | 0.0069 | 0.0176 | 0.0073 | 94.1% |
 * | 64 | 0.0189 | 0.0135 | 0.0186 | 0.0138 | 97.9% |
 * | 128 | 0.0186 | 0.0275 | 0.0182 | 0.0281 | 97.8% |
 * | 512 | 0.0191 | 0.1074 | 0.0182 | 0.1126 | 95.4% |
 * | 1024 | 0.0190 | 0.2157 | 0.0176 | 0.2327 | 92.7% |
 * | 4096 | 0.0192 | 0.8533 | 0.0179 | 0.9159 | 93.2% |
 * | 16384 | 0.0197 | 3.3328 | 0.0179 | 3.6571 | 91.1% |
 * | 65536 | 0.0198 | 13.2557 | 0.0185 | 14.1608 | 93.6% |
 * | 262144 | 0.0257 | 40.8324 | 0.0191 | 54.9799 | 74.3% |
 * | 1048576 | 0.0453 | 92.6631 | 0.0432 | 97.0185 | 95.5% |
 * | 4194304 | 0.1161 | 144.5514 | 0.1312 | 127.9063 | 113.0% |
 * | 16777216 | 0.4064 | 165.1171 | 0.5340 | 125.6796 | 131.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sasum-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-default.svg)
 *
 * ![sasum-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-default.svg)
 *
 * ## See also
 *
 * - [sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/sasum.js) — WebGPU benchmark script
 * - [sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/sasum.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0189 | 0.0068 | 0.0181 | 0.0071 | 95.4% |
 * | 64 | 0.0193 | 0.0132 | 0.0177 | 0.0145 | 91.3% |
 * | 128 | 0.0189 | 0.0271 | 0.0179 | 0.0286 | 94.7% |
 * | 512 | 0.0193 | 0.1059 | 0.0179 | 0.1143 | 92.6% |
 * | 1024 | 0.0192 | 0.2130 | 0.0179 | 0.2286 | 93.2% |
 * | 4096 | 0.0193 | 0.8484 | 0.0182 | 0.9014 | 94.1% |
 * | 16384 | 0.0201 | 3.2534 | 0.0180 | 3.6312 | 89.6% |
 * | 65536 | 0.0248 | 10.5635 | 0.0182 | 14.4225 | 73.2% |
 * | 262144 | 0.0430 | 24.3810 | 0.0358 | 29.3226 | 83.1% |
 * | 1048576 | 0.1104 | 37.9864 | 0.1050 | 39.9366 | 95.1% |
 * | 4194304 | 0.3788 | 44.2942 | 0.3729 | 44.9936 | 98.4% |
 *
 * ![sasum-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride4.svg)
 *
 * ![sasum-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0190 | 0.0068 | 0.0180 | 0.0071 | 95.1% |
 * | 64 | 0.0193 | 0.0133 | 0.0182 | 0.0141 | 94.0% |
 * | 128 | 0.0192 | 0.0266 | 0.0181 | 0.0282 | 94.4% |
 * | 512 | 0.0189 | 0.1082 | 0.0181 | 0.1131 | 95.7% |
 * | 1024 | 0.0189 | 0.2164 | 0.0181 | 0.2265 | 95.5% |
 * | 4096 | 0.0196 | 0.8366 | 0.0180 | 0.9110 | 91.8% |
 * | 16384 | 0.0273 | 2.3981 | 0.0210 | 3.1148 | 77.0% |
 * | 65536 | 0.0432 | 6.0681 | 0.0394 | 6.6602 | 91.1% |
 * | 262144 | 0.1155 | 9.0758 | 0.1069 | 9.8064 | 92.5% |
 * | 1048576 | 0.4003 | 10.4778 | 0.3748 | 11.1917 | 93.6% |
 *
 * ![sasum-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride32.svg)
 *
 * ![sasum-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0270 | 0.0758 | 0.0180 | 0.1135 | 66.8% |
 * | 1024 | 0.0276 | 0.1485 | 0.0174 | 0.2357 | 63.0% |
 * | 4096 | 0.0286 | 0.5730 | 0.0177 | 0.9250 | 61.9% |
 * | 16384 | 0.0384 | 1.7067 | 0.0215 | 3.0544 | 55.9% |
 * | 65536 | 0.0652 | 4.0196 | 0.0500 | 5.2429 | 76.7% |
 *
 * ![sasum-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride256.svg)
 *
 * ![sasum-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/stride.sasum.js) — WebGPU stride-sweep benchmark script
 * - [stride.sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/stride.sasum.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
