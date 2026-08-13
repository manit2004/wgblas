/**
 * Benchmark results for snrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0189 | 0.0068 | 0.0181 | 0.0071 | 95.6% |
 * | 64 | 0.0193 | 0.0133 | 0.0178 | 0.0143 | 92.8% |
 * | 128 | 0.0189 | 0.0271 | 0.0178 | 0.0287 | 94.6% |
 * | 512 | 0.0192 | 0.1066 | 0.0179 | 0.1144 | 93.2% |
 * | 1024 | 0.0192 | 0.2128 | 0.0181 | 0.2267 | 93.9% |
 * | 4096 | 0.0190 | 0.8605 | 0.0182 | 0.8982 | 95.8% |
 * | 16384 | 0.0196 | 3.3437 | 0.0182 | 3.5930 | 93.1% |
 * | 65536 | 0.0198 | 13.2664 | 0.0179 | 14.6810 | 90.4% |
 * | 262144 | 0.0256 | 40.9089 | 0.0185 | 56.6430 | 72.2% |
 * | 1048576 | 0.0454 | 92.3042 | 0.0448 | 93.5560 | 98.7% |
 * | 4194304 | 0.1160 | 144.6711 | 0.1433 | 117.1070 | 123.5% |
 * | 16777216 | 0.4066 | 165.0456 | 0.6264 | 107.1342 | 154.1% |
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
 * | 32 | 0.0190 | 0.0067 | 0.0188 | 0.0068 | 98.9% |
 * | 64 | 0.0192 | 0.0133 | 0.0188 | 0.0136 | 98.0% |
 * | 128 | 0.0190 | 0.0269 | 0.0188 | 0.0273 | 98.6% |
 * | 512 | 0.0192 | 0.1067 | 0.0187 | 0.1096 | 97.3% |
 * | 1024 | 0.0190 | 0.2153 | 0.0188 | 0.2184 | 98.6% |
 * | 4096 | 0.0189 | 0.8649 | 0.0187 | 0.8752 | 98.8% |
 * | 16384 | 0.0194 | 3.3795 | 0.0181 | 3.6248 | 93.2% |
 * | 65536 | 0.0246 | 10.6667 | 0.0190 | 13.8145 | 77.2% |
 * | 262144 | 0.0426 | 24.6283 | 0.0442 | 23.7277 | 103.8% |
 * | 1048576 | 0.1104 | 37.9919 | 0.1074 | 39.0677 | 97.2% |
 * | 4194304 | 0.3783 | 44.3523 | 0.3766 | 44.5501 | 99.6% |
 *
 * ![snrm2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride4.svg)
 *
 * ![snrm2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0192 | 0.0067 | 0.0184 | 0.0070 | 95.1% |
 * | 64 | 0.0188 | 0.0136 | 0.0182 | 0.0141 | 96.4% |
 * | 128 | 0.0189 | 0.0271 | 0.0180 | 0.0284 | 95.5% |
 * | 512 | 0.0186 | 0.1101 | 0.0180 | 0.1137 | 96.8% |
 * | 1024 | 0.0191 | 0.2142 | 0.0184 | 0.2220 | 96.5% |
 * | 4096 | 0.0196 | 0.8373 | 0.0180 | 0.9078 | 92.2% |
 * | 16384 | 0.0276 | 2.3786 | 0.0388 | 1.6898 | 140.8% |
 * | 65536 | 0.0433 | 6.0480 | 0.0572 | 4.5868 | 131.9% |
 * | 262144 | 0.1120 | 9.3609 | 0.1213 | 8.6448 | 108.3% |
 * | 1048576 | 0.3836 | 10.9336 | 0.3888 | 10.7865 | 101.4% |
 *
 * ![snrm2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride32.svg)
 *
 * ![snrm2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0193 | 0.1063 | 0.0174 | 0.1179 | 90.2% |
 * | 1024 | 0.0205 | 0.2000 | 0.0181 | 0.2261 | 88.5% |
 * | 4096 | 0.0225 | 0.7273 | 0.0181 | 0.9046 | 80.4% |
 * | 16384 | 0.0329 | 1.9932 | 0.0497 | 1.3187 | 151.1% |
 * | 65536 | 0.0599 | 4.3796 | 0.0738 | 3.5525 | 123.3% |
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
