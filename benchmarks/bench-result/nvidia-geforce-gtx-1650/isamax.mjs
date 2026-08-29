/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0221 | 0.0058 | 0.0169 | 0.0076 | 76.2% |
 * | 64 | 0.0216 | 0.0118 | 0.0165 | 0.0155 | 76.3% |
 * | 128 | 0.0219 | 0.0234 | 0.0165 | 0.0310 | 75.5% |
 * | 512 | 0.0220 | 0.0932 | 0.0162 | 0.1266 | 73.6% |
 * | 1024 | 0.0218 | 0.1880 | 0.0168 | 0.2438 | 77.1% |
 * | 4096 | 0.0219 | 0.7496 | 0.0179 | 0.9176 | 81.7% |
 * | 16384 | 0.0222 | 2.9489 | 0.0181 | 3.6184 | 81.5% |
 * | 65536 | 0.0228 | 11.5218 | 0.0181 | 14.5120 | 79.4% |
 * | 262144 | 0.0290 | 36.2077 | 0.0195 | 53.8947 | 67.2% |
 * | 1048576 | 0.0478 | 87.7910 | 0.0400 | 104.8996 | 83.7% |
 * | 4194304 | 0.1180 | 142.1798 | 0.1094 | 153.3230 | 92.7% |
 * | 16777216 | 0.4116 | 163.0249 | 0.4021 | 166.8910 | 97.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![isamax-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-default.svg)
 *
 * ![isamax-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-default.svg)
 *
 * ## See also
 *
 * - [isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/isamax.js) — WebGPU benchmark script
 * - [isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/isamax.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0222 | 0.0058 | 0.0168 | 0.0076 | 75.7% |
 * | 64 | 0.0217 | 0.0118 | 0.0123 | 0.0208 | 56.6% |
 * | 128 | 0.0215 | 0.0238 | 0.0169 | 0.0302 | 78.8% |
 * | 512 | 0.0218 | 0.0940 | 0.0169 | 0.1213 | 77.5% |
 * | 1024 | 0.0217 | 0.1884 | 0.0171 | 0.2399 | 78.5% |
 * | 4096 | 0.0214 | 0.7670 | 0.0181 | 0.9030 | 84.9% |
 * | 16384 | 0.0228 | 2.8704 | 0.0182 | 3.6025 | 79.7% |
 * | 65536 | 0.0284 | 9.2148 | 0.0191 | 13.6990 | 67.3% |
 * | 262144 | 0.0462 | 22.7161 | 0.0421 | 24.9281 | 91.1% |
 * | 1048576 | 0.1131 | 37.0784 | 0.1061 | 39.5212 | 93.8% |
 * | 4194304 | 0.3812 | 44.0116 | 0.3755 | 44.6849 | 98.5% |
 *
 * ![isamax-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride4.svg)
 *
 * ![isamax-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0223 | 0.0057 | 0.0169 | 0.0076 | 75.5% |
 * | 64 | 0.0214 | 0.0120 | 0.0164 | 0.0156 | 76.7% |
 * | 128 | 0.0216 | 0.0237 | 0.0169 | 0.0304 | 78.1% |
 * | 512 | 0.0215 | 0.0955 | 0.0168 | 0.1217 | 78.4% |
 * | 1024 | 0.0224 | 0.1829 | 0.0169 | 0.2429 | 75.3% |
 * | 4096 | 0.0216 | 0.7602 | 0.0185 | 0.8866 | 85.7% |
 * | 16384 | 0.0291 | 2.2543 | 0.0210 | 3.1267 | 72.1% |
 * | 65536 | 0.0460 | 5.7047 | 0.0395 | 6.6332 | 86.0% |
 * | 262144 | 0.1147 | 9.1429 | 2.3382 | 0.4485 | 2038.5% |
 * | 1048576 | 0.3869 | 10.8409 | 0.3756 | 11.1669 | 97.1% |
 *
 * ![isamax-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride32.svg)
 *
 * ![isamax-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0224 | 0.0916 | 0.0169 | 0.1214 | 75.4% |
 * | 1024 | 0.0224 | 0.1826 | 0.0169 | 0.2417 | 75.5% |
 * | 4096 | 0.0228 | 0.7176 | 0.0182 | 0.9014 | 79.6% |
 * | 16384 | 0.0345 | 1.8989 | 0.0292 | 2.2456 | 84.6% |
 * | 65536 | 0.0613 | 4.2789 | 0.0509 | 5.1506 | 83.1% |
 *
 * ![isamax-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride256.svg)
 *
 * ![isamax-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/stride.isamax.js) — WebGPU stride-sweep benchmark script
 * - [stride.isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/stride.isamax.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
