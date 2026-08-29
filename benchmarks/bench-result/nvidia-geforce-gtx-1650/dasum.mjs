/**
 * Benchmark results for dasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0241 | 0.0106 | 0.1174 | 0.0022 | 482.0% |
 * | 64 | 0.0233 | 0.0219 | 0.1179 | 0.0043 | 510.1% |
 * | 128 | 0.0238 | 0.0430 | 0.1191 | 0.0086 | 499.8% |
 * | 512 | 0.0236 | 0.1733 | 0.1174 | 0.0349 | 496.6% |
 * | 1024 | 0.0233 | 0.3516 | 0.1230 | 0.0666 | 528.0% |
 * | 4096 | 0.0240 | 1.3635 | 0.0182 | 1.7965 | 75.9% |
 * | 16384 | 0.0249 | 5.2716 | 0.1247 | 1.0511 | 501.5% |
 * | 65536 | 0.0269 | 19.4584 | 0.0181 | 29.0239 | 67.0% |
 * | 262144 | 0.0407 | 51.4815 | 0.0355 | 59.0414 | 87.2% |
 * | 1048576 | 0.0763 | 109.9828 | 0.0773 | 108.5033 | 101.4% |
 * | 4194304 | 0.2158 | 155.5059 | 0.2405 | 139.5218 | 111.5% |
 * | 16777216 | 0.7908 | 169.7240 | 0.8796 | 152.5923 | 111.2% |
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
 * | 32 | 0.0241 | 0.0106 | 0.0141 | 0.0181 | 58.8% |
 * | 64 | 0.0237 | 0.0216 | 0.0142 | 0.0360 | 60.0% |
 * | 128 | 0.0238 | 0.0430 | 0.0218 | 0.0469 | 91.7% |
 * | 512 | 0.0237 | 0.1727 | 0.0224 | 0.1827 | 94.5% |
 * | 1024 | 0.0241 | 0.3393 | 0.0222 | 0.3689 | 92.0% |
 * | 4096 | 0.0244 | 1.3421 | 0.0218 | 1.5059 | 89.1% |
 * | 16384 | 0.0276 | 4.7407 | 0.0223 | 5.8851 | 80.6% |
 * | 65536 | 0.0392 | 13.3911 | 0.0339 | 15.4639 | 86.6% |
 * | 262144 | 0.0727 | 28.8387 | 0.0669 | 31.3569 | 92.0% |
 * | 1048576 | 0.2071 | 40.5043 | 0.1980 | 42.3770 | 95.6% |
 * | 4194304 | 0.7455 | 45.0110 | 0.7355 | 45.6230 | 98.7% |
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
 * | 32 | 0.0215 | 0.0119 | 0.0182 | 0.0141 | 84.5% |
 * | 64 | 0.0214 | 0.0239 | 0.0181 | 0.0282 | 84.7% |
 * | 128 | 0.0211 | 0.0485 | 0.0181 | 0.0565 | 85.9% |
 * | 512 | 0.0204 | 0.2011 | 0.0182 | 0.2250 | 89.4% |
 * | 1024 | 0.0204 | 0.4016 | 0.0181 | 0.4531 | 88.6% |
 * | 4096 | 0.0253 | 1.2937 | 0.0180 | 1.8172 | 71.2% |
 * | 16384 | 0.0337 | 3.8843 | 0.0212 | 6.1873 | 62.8% |
 * | 65536 | 0.0684 | 7.6686 | 0.0397 | 13.2076 | 58.1% |
 * | 262144 | 0.2046 | 10.2488 | 0.1072 | 19.5601 | 52.4% |
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
 * | 512 | 0.0222 | 0.1848 | 0.0173 | 0.2368 | 78.1% |
 * | 1024 | 0.0239 | 0.3434 | 0.0436 | 0.1880 | 182.7% |
 * | 4096 | 0.0287 | 1.1429 | 0.0473 | 0.6928 | 165.0% |
 * | 16384 | 0.0451 | 2.9091 | 0.0570 | 2.2985 | 126.6% |
 * | 65536 | 0.1004 | 5.2245 | 0.0497 | 10.5533 | 49.5% |
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
