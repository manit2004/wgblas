/**
 * Benchmark results for idamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0212 | 0.0120 | 0.0168 | 0.0152 | 79.3% |
 * | 64 | 0.0214 | 0.0239 | 0.0176 | 0.0291 | 82.1% |
 * | 128 | 0.0208 | 0.0493 | 0.0197 | 0.0519 | 95.0% |
 * | 512 | 0.0211 | 0.1944 | 0.0170 | 0.2408 | 80.7% |
 * | 1024 | 0.0214 | 0.3832 | 0.0169 | 0.4848 | 79.0% |
 * | 4096 | 0.0216 | 1.5204 | 0.0181 | 1.8060 | 84.2% |
 * | 16384 | 0.0219 | 5.9796 | 0.0179 | 7.3143 | 81.8% |
 * | 65536 | 0.0235 | 22.3520 | 0.0263 | 19.9562 | 112.0% |
 * | 262144 | 0.0363 | 57.7410 | 0.0386 | 54.2741 | 106.4% |
 * | 1048576 | 0.0700 | 119.8099 | 0.0839 | 99.9977 | 119.8% |
 * | 4194304 | 0.2078 | 161.4436 | 0.2666 | 125.8568 | 128.3% |
 * | 16777216 | 0.7641 | 175.6482 | 1.0618 | 126.4068 | 139.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![idamax-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-default.svg)
 *
 * ![idamax-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-default.svg)
 *
 * ## See also
 *
 * - [idamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/wgblas/idamax.js) — WebGPU benchmark script
 * - [idamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/cuda/idamax.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0212 | 0.0121 | 0.0163 | 0.0157 | 76.9% |
 * | 64 | 0.0208 | 0.0246 | 0.0169 | 0.0302 | 81.4% |
 * | 128 | 0.0206 | 0.0497 | 0.0171 | 0.0599 | 83.0% |
 * | 512 | 0.0208 | 0.1968 | 0.0167 | 0.2457 | 80.1% |
 * | 1024 | 0.0210 | 0.3908 | 0.0168 | 0.4876 | 80.2% |
 * | 4096 | 0.0216 | 1.5170 | 0.0181 | 1.8124 | 83.7% |
 * | 16384 | 0.0225 | 5.8182 | 0.0180 | 7.2753 | 80.0% |
 * | 65536 | 0.0349 | 15.0105 | 0.0306 | 17.1381 | 87.6% |
 * | 262144 | 0.0696 | 30.1176 | 0.0640 | 32.7762 | 91.9% |
 * | 1048576 | 0.2096 | 40.0281 | 0.1999 | 41.9699 | 95.4% |
 * | 4194304 | 0.7802 | 43.0053 | 0.7362 | 45.5764 | 94.4% |
 *
 * ![idamax-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride4.svg)
 *
 * ![idamax-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0192 | 0.0134 | 0.0167 | 0.0153 | 87.3% |
 * | 64 | 0.0191 | 0.0268 | 0.0139 | 0.0368 | 72.9% |
 * | 128 | 0.0188 | 0.0546 | 0.0172 | 0.0595 | 91.7% |
 * | 512 | 0.0195 | 0.2104 | 0.0170 | 0.2411 | 87.2% |
 * | 1024 | 0.0197 | 0.4156 | 0.0164 | 0.4995 | 83.2% |
 * | 4096 | 0.0228 | 1.4402 | 0.0174 | 1.8806 | 76.6% |
 * | 16384 | 0.0331 | 3.9632 | 0.0216 | 6.0592 | 65.4% |
 * | 65536 | 0.0661 | 7.9341 | 0.0395 | 13.2664 | 59.8% |
 * | 262144 | 0.2023 | 10.3672 | 0.1078 | 19.4584 | 53.3% |
 *
 * ![idamax-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride32.svg)
 *
 * ![idamax-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0196 | 0.2088 | 0.0162 | 0.2522 | 82.8% |
 * | 1024 | 0.0197 | 0.4166 | 0.0164 | 0.5010 | 83.2% |
 * | 4096 | 0.0290 | 1.1284 | 0.0180 | 1.8204 | 62.0% |
 * | 16384 | 0.0449 | 2.9205 | 0.0294 | 4.4619 | 65.5% |
 * | 65536 | 0.1021 | 5.1328 | 0.0501 | 10.4556 | 49.1% |
 *
 * ![idamax-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride256.svg)
 *
 * ![idamax-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.idamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/wgblas/stride.idamax.js) — WebGPU stride-sweep benchmark script
 * - [stride.idamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/cuda/stride.idamax.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/idamax
 */
