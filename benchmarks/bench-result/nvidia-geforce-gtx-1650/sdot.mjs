/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0188 | 0.0136 | 0.0104 | 0.0247 | 55.0% |
 * | 64 | 0.0192 | 0.0266 | 0.0171 | 0.0299 | 89.0% |
 * | 128 | 0.0187 | 0.0547 | 0.0106 | 0.0970 | 56.4% |
 * | 512 | 0.0190 | 0.2157 | 0.0105 | 0.3908 | 55.2% |
 * | 1024 | 0.0189 | 0.4328 | 0.0101 | 0.8127 | 53.3% |
 * | 4096 | 0.0189 | 1.7312 | 0.0179 | 1.8286 | 94.7% |
 * | 16384 | 0.0195 | 6.7258 | 0.0175 | 7.4881 | 89.8% |
 * | 65536 | 0.0204 | 25.7206 | 0.0177 | 29.5740 | 87.0% |
 * | 262144 | 0.0325 | 64.4405 | 0.0268 | 78.2052 | 82.4% |
 * | 1048576 | 0.0668 | 125.6683 | 0.0610 | 137.6084 | 91.3% |
 * | 4194304 | 0.2044 | 164.1735 | 0.1967 | 170.5834 | 96.2% |
 * | 16777216 | 0.7504 | 178.8501 | 0.7329 | 183.1374 | 97.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sdot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-default.svg)
 *
 * ![sdot-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-default.svg)
 *
 * ## See also
 *
 * - [sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/sdot.js) — WebGPU benchmark script
 * - [sdot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/sdot.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0190 | 0.0135 | 0.0102 | 0.0250 | 54.0% |
 * | 64 | 0.0192 | 0.0267 | 0.0106 | 0.0484 | 55.2% |
 * | 128 | 0.0188 | 0.0545 | 0.0172 | 0.0597 | 91.3% |
 * | 512 | 0.0187 | 0.2188 | 0.0175 | 0.2340 | 93.5% |
 * | 1024 | 0.0189 | 0.4339 | 0.0178 | 0.4608 | 94.2% |
 * | 4096 | 0.0192 | 1.7081 | 0.0175 | 1.8686 | 91.4% |
 * | 16384 | 0.0208 | 6.3161 | 0.0181 | 7.2367 | 87.3% |
 * | 65536 | 0.0328 | 16.0078 | 0.0303 | 17.3284 | 92.4% |
 * | 262144 | 0.0676 | 31.0303 | 0.0631 | 33.2501 | 93.3% |
 * | 1048576 | 0.2069 | 40.5513 | 0.1948 | 43.0521 | 94.2% |
 * | 4194304 | 0.7671 | 43.7417 | 0.7293 | 46.0114 | 95.1% |
 *
 * ![sdot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride4.svg)
 *
 * ![sdot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0188 | 0.0137 | 0.0104 | 0.0247 | 55.3% |
 * | 64 | 0.0186 | 0.0275 | 0.0102 | 0.0500 | 55.1% |
 * | 128 | 0.0188 | 0.0545 | 0.0174 | 0.0589 | 92.5% |
 * | 512 | 0.0188 | 0.2175 | 0.0175 | 0.2338 | 93.0% |
 * | 1024 | 0.0190 | 0.4317 | 0.0140 | 0.5831 | 74.0% |
 * | 4096 | 0.0228 | 1.4372 | 0.0181 | 1.8092 | 79.4% |
 * | 16384 | 0.0328 | 4.0000 | 0.0292 | 4.4814 | 89.3% |
 * | 65536 | 0.0661 | 7.9284 | 0.0592 | 8.8538 | 89.5% |
 * | 262144 | 0.2084 | 10.0631 | 0.1947 | 10.7701 | 93.4% |
 * | 1048576 | 0.9317 | 9.0031 | 0.7318 | 11.4631 | 78.5% |
 *
 * ![sdot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride32.svg)
 *
 * ![sdot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0276 | 0.1482 | 0.0178 | 0.2306 | 64.3% |
 * | 1024 | 0.0283 | 0.2891 | 0.0177 | 0.4621 | 62.6% |
 * | 4096 | 0.0323 | 1.0139 | 0.0182 | 1.8028 | 56.2% |
 * | 16384 | 0.0472 | 2.7760 | 0.0313 | 4.1839 | 66.3% |
 * | 65536 | 0.0983 | 5.3316 | 0.0854 | 6.1375 | 86.9% |
 *
 * ![sdot-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride256.svg)
 *
 * ![sdot-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/stride.sdot.js) — WebGPU stride-sweep benchmark script
 * - [stride.sdot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/stride.sdot.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sdot
 */
