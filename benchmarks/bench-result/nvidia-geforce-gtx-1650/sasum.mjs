/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0202 | 0.0063 | 0.0166 | 0.0077 | 82.1% |
 * | 64 | 0.0196 | 0.0131 | 0.0181 | 0.0141 | 92.6% |
 * | 128 | 0.0190 | 0.0269 | 0.0180 | 0.0284 | 94.7% |
 * | 512 | 0.0196 | 0.1046 | 0.0175 | 0.1173 | 89.2% |
 * | 1024 | 0.0197 | 0.2081 | 0.0179 | 0.2294 | 90.7% |
 * | 4096 | 0.0196 | 0.8339 | 0.0179 | 0.9143 | 91.2% |
 * | 16384 | 0.0197 | 3.3247 | 0.0175 | 3.7441 | 88.8% |
 * | 65536 | 0.0205 | 12.8000 | 0.0181 | 14.4863 | 88.4% |
 * | 262144 | 0.0272 | 38.5960 | 0.0183 | 57.3368 | 67.3% |
 * | 1048576 | 0.0461 | 91.0538 | 0.0438 | 95.7778 | 95.1% |
 * | 4194304 | 0.1166 | 143.8968 | 0.1736 | 96.6251 | 148.9% |
 * | 16777216 | 0.4083 | 164.3600 | 2.7608 | 24.3075 | 676.2% |
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
 * | 32 | 0.0198 | 0.0065 | 0.0181 | 0.0071 | 91.2% |
 * | 64 | 0.0198 | 0.0129 | 0.0181 | 0.0141 | 91.7% |
 * | 128 | 0.0198 | 0.0259 | 0.0181 | 0.0283 | 91.5% |
 * | 512 | 0.0199 | 0.1031 | 0.0180 | 0.1135 | 90.9% |
 * | 1024 | 0.0200 | 0.2051 | 0.0180 | 0.2270 | 90.4% |
 * | 4096 | 0.0203 | 0.8076 | 0.0181 | 0.9062 | 89.1% |
 * | 16384 | 0.0208 | 3.1556 | 0.0181 | 3.6248 | 87.1% |
 * | 65536 | 0.0263 | 9.9538 | 0.0190 | 13.8145 | 72.1% |
 * | 262144 | 0.0444 | 23.6081 | 0.0363 | 28.8705 | 81.8% |
 * | 1048576 | 0.1118 | 37.5188 | 0.1041 | 40.2988 | 93.1% |
 * | 4194304 | 0.3795 | 44.2064 | 0.3733 | 44.9435 | 98.4% |
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
 * | 32 | 0.0202 | 0.0063 | 0.0179 | 0.0071 | 89.1% |
 * | 64 | 0.0202 | 0.0127 | 0.0172 | 0.0148 | 85.6% |
 * | 128 | 0.0205 | 0.0250 | 0.0170 | 0.0301 | 83.1% |
 * | 512 | 0.0201 | 0.1021 | 0.0174 | 0.1179 | 86.6% |
 * | 1024 | 0.0201 | 0.2035 | 0.0172 | 0.2375 | 85.7% |
 * | 4096 | 0.0205 | 0.7988 | 0.0181 | 0.9030 | 88.5% |
 * | 16384 | 0.0285 | 2.3011 | 0.0239 | 2.7453 | 83.8% |
 * | 65536 | 0.0445 | 5.8851 | 0.0394 | 6.6494 | 88.5% |
 * | 262144 | 0.1131 | 9.2696 | 0.1067 | 9.8284 | 94.3% |
 * | 1048576 | 0.3848 | 10.9013 | 0.3732 | 11.2392 | 97.0% |
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
 * | 512 | 0.0209 | 0.0980 | 0.0181 | 0.1133 | 86.5% |
 * | 1024 | 0.0232 | 0.1769 | 0.0181 | 0.2265 | 78.1% |
 * | 4096 | 0.0241 | 0.6795 | 0.0176 | 0.9318 | 72.9% |
 * | 16384 | 0.0338 | 1.9376 | 0.0212 | 3.0867 | 62.8% |
 * | 65536 | 0.0600 | 4.3714 | 0.0500 | 5.2479 | 83.3% |
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
