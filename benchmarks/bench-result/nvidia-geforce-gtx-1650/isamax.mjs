/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0205 | 0.0063 | 0.0169 | 0.0076 | 82.3% |
 * | 64 | 0.0209 | 0.0122 | 0.0166 | 0.0154 | 79.4% |
 * | 128 | 0.0203 | 0.0252 | 0.0168 | 0.0304 | 82.9% |
 * | 512 | 0.0209 | 0.0980 | 0.0171 | 0.1200 | 81.7% |
 * | 1024 | 0.0207 | 0.1978 | 0.0170 | 0.2406 | 82.2% |
 * | 4096 | 0.0206 | 0.7950 | 0.0182 | 0.9014 | 88.2% |
 * | 16384 | 0.0210 | 3.1267 | 0.0181 | 3.6152 | 86.5% |
 * | 65536 | 0.0215 | 12.1724 | 0.0181 | 14.4991 | 84.0% |
 * | 262144 | 0.0284 | 36.9425 | 0.0209 | 50.1423 | 73.7% |
 * | 1048576 | 0.0473 | 88.6520 | 0.0403 | 104.0667 | 85.2% |
 * | 4194304 | 0.1181 | 142.0450 | 0.1094 | 153.3006 | 92.7% |
 * | 16777216 | 0.4094 | 163.9040 | 0.4007 | 167.4640 | 97.9% |
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
 * | 32 | 0.0210 | 0.0061 | 0.0138 | 0.0093 | 65.6% |
 * | 64 | 0.0205 | 0.0125 | 0.0165 | 0.0155 | 80.5% |
 * | 128 | 0.0206 | 0.0248 | 0.0162 | 0.0317 | 78.3% |
 * | 512 | 0.0216 | 0.0948 | 0.0166 | 0.1234 | 76.8% |
 * | 1024 | 0.0211 | 0.1942 | 0.0164 | 0.2505 | 77.5% |
 * | 4096 | 0.0208 | 0.7877 | 0.0175 | 0.9343 | 84.3% |
 * | 16384 | 0.0215 | 3.0476 | 0.0179 | 3.6637 | 83.2% |
 * | 65536 | 0.0273 | 9.5925 | 0.0193 | 13.5629 | 70.7% |
 * | 262144 | 0.0452 | 23.1986 | 0.0408 | 25.7105 | 90.2% |
 * | 1048576 | 0.1126 | 37.2364 | 0.1103 | 38.0305 | 97.9% |
 * | 4194304 | 0.3804 | 44.1004 | 0.3764 | 44.5747 | 98.9% |
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
 * | 32 | 0.0207 | 0.0062 | 0.0169 | 0.0076 | 81.2% |
 * | 64 | 0.0209 | 0.0123 | 0.0162 | 0.0158 | 77.7% |
 * | 128 | 0.0211 | 0.0243 | 0.0166 | 0.0308 | 78.9% |
 * | 512 | 0.0205 | 0.1000 | 0.0164 | 0.1252 | 79.9% |
 * | 1024 | 0.0209 | 0.1957 | 0.0172 | 0.2381 | 82.2% |
 * | 4096 | 0.0213 | 0.7682 | 0.0179 | 0.9176 | 83.7% |
 * | 16384 | 0.0293 | 2.2334 | 0.0223 | 2.9404 | 76.0% |
 * | 65536 | 0.0458 | 5.7287 | 0.0400 | 6.5510 | 87.4% |
 * | 262144 | 0.1145 | 9.1582 | 0.1074 | 9.7655 | 93.8% |
 * | 1048576 | 0.3861 | 10.8643 | 0.3768 | 11.1323 | 97.6% |
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
 * | 512 | 0.0213 | 0.0960 | 0.0164 | 0.1252 | 76.6% |
 * | 1024 | 0.0227 | 0.1803 | 0.0164 | 0.2490 | 72.4% |
 * | 4096 | 0.0258 | 0.6356 | 0.0181 | 0.9046 | 70.3% |
 * | 16384 | 0.0363 | 1.8076 | 0.0288 | 2.2756 | 79.4% |
 * | 65536 | 0.0645 | 4.0635 | 0.0508 | 5.1554 | 78.8% |
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
