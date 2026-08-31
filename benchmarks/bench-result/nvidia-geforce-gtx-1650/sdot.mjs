/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0152 | 0.0168 | 0.2054 | 0.0012 | 1399.1% |
 * | 64 | 0.0149 | 0.0344 | 0.0168 | 0.0306 | 112.4% |
 * | 128 | 0.0147 | 0.0696 | 0.0103 | 0.0994 | 70.1% |
 * | 512 | 0.0149 | 0.2750 | 0.0104 | 0.3938 | 69.8% |
 * | 1024 | 0.0149 | 0.5505 | 0.0103 | 0.7926 | 69.5% |
 * | 4096 | 0.0149 | 2.1974 | 0.0180 | 1.8172 | 120.9% |
 * | 16384 | 0.0200 | 6.5694 | 0.0181 | 7.2560 | 90.5% |
 * | 65536 | 0.0212 | 24.6747 | 0.0182 | 28.7944 | 85.7% |
 * | 262144 | 0.0334 | 62.7439 | 0.0269 | 78.0655 | 80.4% |
 * | 1048576 | 0.0684 | 122.6118 | 0.0609 | 137.6445 | 89.1% |
 * | 4194304 | 0.2051 | 163.6227 | 0.1955 | 171.6726 | 95.3% |
 * | 16777216 | 0.7516 | 178.5722 | 0.7337 | 182.9217 | 97.6% |
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
 * | 32 | 0.0197 | 0.0130 | 0.0187 | 0.0137 | 95.0% |
 * | 64 | 0.0197 | 0.0260 | 0.0188 | 0.0273 | 95.4% |
 * | 128 | 0.0198 | 0.0518 | 0.0187 | 0.0547 | 94.7% |
 * | 512 | 0.0200 | 0.2053 | 0.0188 | 0.2182 | 94.1% |
 * | 1024 | 0.0197 | 0.4159 | 0.0187 | 0.4384 | 94.9% |
 * | 4096 | 0.0205 | 1.6013 | 0.0186 | 1.7595 | 91.0% |
 * | 16384 | 0.0222 | 5.9020 | 0.0191 | 6.8610 | 86.0% |
 * | 65536 | 0.0346 | 15.1634 | 0.0303 | 17.2827 | 87.7% |
 * | 262144 | 0.0684 | 30.6673 | 0.0636 | 32.9492 | 93.1% |
 * | 1048576 | 0.2081 | 40.3112 | 0.1972 | 42.5351 | 94.8% |
 * | 4194304 | 0.7779 | 43.1344 | 0.7319 | 45.8434 | 94.1% |
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
 * | 32 | 0.0186 | 0.0137 | 0.0102 | 0.0251 | 54.8% |
 * | 64 | 0.0178 | 0.0287 | 0.0172 | 0.0297 | 96.7% |
 * | 128 | 0.0183 | 0.0558 | 0.0173 | 0.0591 | 94.5% |
 * | 512 | 0.0176 | 0.2332 | 0.0180 | 0.2274 | 102.5% |
 * | 1024 | 0.0175 | 0.4693 | 0.0179 | 0.4567 | 102.8% |
 * | 4096 | 0.0214 | 1.5295 | 0.0180 | 1.8156 | 84.2% |
 * | 16384 | 0.0318 | 4.1270 | 0.0287 | 4.5740 | 90.2% |
 * | 65536 | 0.0652 | 8.0452 | 0.0593 | 8.8467 | 90.9% |
 * | 262144 | 0.2012 | 10.4249 | 0.1949 | 10.7604 | 96.9% |
 * | 1048576 | 0.9130 | 9.1880 | 0.7303 | 11.4862 | 80.0% |
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
 * | 512 | 0.0286 | 0.1434 | 0.0174 | 0.2357 | 60.8% |
 * | 1024 | 0.0272 | 0.3014 | 0.0180 | 0.4563 | 66.0% |
 * | 4096 | 0.0306 | 1.0723 | 0.0182 | 1.8028 | 59.5% |
 * | 16384 | 0.0449 | 2.9195 | 0.0313 | 4.1860 | 69.7% |
 * | 65536 | 0.0974 | 5.3842 | 0.0842 | 6.2261 | 86.5% |
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
