/**
 * Benchmark results for dasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0226 | 0.0113 | 0.0181 | 0.0141 | 80.4% |
 * | 64 | 0.0226 | 0.0226 | 0.0180 | 0.0285 | 79.4% |
 * | 128 | 0.0225 | 0.0456 | 0.0180 | 0.0567 | 80.4% |
 * | 512 | 0.0229 | 0.1791 | 0.0180 | 0.2272 | 78.8% |
 * | 1024 | 0.0226 | 0.3631 | 0.0180 | 0.4563 | 79.6% |
 * | 4096 | 0.0228 | 1.4402 | 0.0181 | 1.8076 | 79.7% |
 * | 16384 | 0.0237 | 5.5277 | 0.0182 | 7.2049 | 76.7% |
 * | 65536 | 0.0265 | 19.7755 | 0.0182 | 28.8705 | 68.5% |
 * | 262144 | 0.0398 | 52.7029 | 0.0347 | 60.4297 | 87.2% |
 * | 1048576 | 0.0755 | 111.1251 | 0.0772 | 108.6833 | 102.2% |
 * | 4194304 | 0.2153 | 155.8757 | 0.2365 | 141.8816 | 109.9% |
 * | 16777216 | 0.7864 | 170.6736 | 0.8782 | 152.8314 | 111.7% |
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
 * | 32 | 0.0225 | 0.0114 | 0.0184 | 0.0139 | 81.8% |
 * | 64 | 0.0225 | 0.0228 | 0.0187 | 0.0274 | 83.2% |
 * | 128 | 0.0221 | 0.0464 | 0.0190 | 0.0538 | 86.2% |
 * | 512 | 0.0222 | 0.1843 | 0.0189 | 0.2166 | 85.1% |
 * | 1024 | 0.0220 | 0.3724 | 0.0180 | 0.4539 | 82.0% |
 * | 4096 | 0.0226 | 1.4484 | 0.0181 | 1.8140 | 79.8% |
 * | 16384 | 0.0254 | 5.1652 | 0.0187 | 7.0197 | 73.6% |
 * | 65536 | 0.0379 | 13.8262 | 0.0314 | 16.6843 | 82.9% |
 * | 262144 | 0.0716 | 29.2702 | 0.0642 | 32.6700 | 89.6% |
 * | 1048576 | 0.2061 | 40.6961 | 0.1993 | 42.0811 | 96.7% |
 * | 4194304 | 0.7434 | 45.1389 | 0.7347 | 45.6697 | 98.8% |
 *
 * ![dasum-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride4.svg)
 *
 * ![dasum-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0228 | 0.0112 | 0.0182 | 0.0141 | 79.5% |
 * | 64 | 0.0228 | 0.0224 | 0.0181 | 0.0282 | 79.5% |
 * | 128 | 0.0225 | 0.0455 | 0.0180 | 0.0569 | 79.9% |
 * | 512 | 0.0228 | 0.1799 | 0.0173 | 0.2370 | 75.9% |
 * | 1024 | 0.0225 | 0.3642 | 0.0179 | 0.4580 | 79.5% |
 * | 4096 | 0.0279 | 1.1757 | 0.0179 | 1.8286 | 64.3% |
 * | 16384 | 0.0408 | 3.2151 | 0.0211 | 6.2249 | 51.6% |
 * | 65536 | 0.0743 | 7.0590 | 0.0393 | 13.3420 | 52.9% |
 * | 262144 | 0.2141 | 9.7939 | 0.1064 | 19.7071 | 49.7% |
 *
 * ![dasum-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/gbps-stride32.svg)
 *
 * ![dasum-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dasum/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0299 | 0.1371 | 0.0181 | 0.2261 | 60.6% |
 * | 1024 | 0.0303 | 0.2705 | 0.0175 | 0.4693 | 57.6% |
 * | 4096 | 0.0336 | 0.9743 | 0.0180 | 1.8253 | 53.4% |
 * | 16384 | 0.0508 | 2.5810 | 0.0221 | 5.9362 | 43.5% |
 * | 65536 | 0.1176 | 4.4594 | 0.0503 | 10.4257 | 42.8% |
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
