/**
 * Benchmark results for idamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0219 | 0.0117 | 0.0168 | 0.0152 | 77.1% |
 * | 64 | 0.0216 | 0.0237 | 0.0163 | 0.0315 | 75.4% |
 * | 128 | 0.0220 | 0.0466 | 0.0168 | 0.0610 | 76.5% |
 * | 512 | 0.0223 | 0.1840 | 0.0162 | 0.2525 | 72.9% |
 * | 1024 | 0.0222 | 0.3686 | 0.0169 | 0.4858 | 75.9% |
 * | 4096 | 0.0219 | 1.4949 | 0.0182 | 1.8012 | 83.0% |
 * | 16384 | 0.0226 | 5.7935 | 0.0181 | 7.2240 | 80.2% |
 * | 65536 | 0.0243 | 21.5579 | 0.0182 | 28.7691 | 74.9% |
 * | 262144 | 0.0370 | 56.6430 | 0.0386 | 54.3416 | 104.2% |
 * | 1048576 | 0.0710 | 118.0829 | 0.0746 | 112.4358 | 105.0% |
 * | 4194304 | 0.2080 | 161.3566 | 0.2240 | 149.7859 | 107.7% |
 * | 16777216 | 0.7693 | 174.4755 | 0.8238 | 162.9330 | 107.1% |
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
 * | 32 | 0.0225 | 0.0114 | 0.0125 | 0.0204 | 55.8% |
 * | 64 | 0.0220 | 0.0233 | 0.0170 | 0.0302 | 77.1% |
 * | 128 | 0.0219 | 0.0467 | 0.0169 | 0.0604 | 77.4% |
 * | 512 | 0.0224 | 0.1830 | 0.0170 | 0.2411 | 75.9% |
 * | 1024 | 0.0222 | 0.3683 | 0.0169 | 0.4839 | 76.1% |
 * | 4096 | 0.0224 | 1.4629 | 0.0183 | 1.7918 | 81.6% |
 * | 16384 | 0.0243 | 5.3966 | 0.0226 | 5.7976 | 93.1% |
 * | 65536 | 0.0364 | 14.3845 | 0.0311 | 16.8473 | 85.4% |
 * | 262144 | 0.0715 | 29.3423 | 0.0641 | 32.6944 | 89.7% |
 * | 1048576 | 0.2106 | 39.8395 | 0.1984 | 42.2813 | 94.2% |
 * | 4194304 | 0.7808 | 42.9744 | 0.7499 | 44.7450 | 96.0% |
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
 * | 32 | 0.0213 | 0.0120 | 0.0367 | 0.0070 | 171.5% |
 * | 64 | 0.0211 | 0.0243 | 0.0369 | 0.0139 | 174.8% |
 * | 128 | 0.0208 | 0.0492 | 0.0355 | 0.0288 | 170.7% |
 * | 512 | 0.0212 | 0.1935 | 0.0356 | 0.1150 | 168.3% |
 * | 1024 | 0.0209 | 0.3920 | 0.0325 | 0.2520 | 155.6% |
 * | 4096 | 0.0249 | 1.3154 | 0.0258 | 1.2720 | 103.4% |
 * | 16384 | 0.0349 | 3.7509 | 0.0452 | 2.9019 | 129.3% |
 * | 65536 | 0.0690 | 7.5957 | 0.0639 | 8.2064 | 92.6% |
 * | 262144 | 0.2046 | 10.2512 | 0.9072 | 2.3116 | 443.5% |
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
 * | 512 | 0.0217 | 0.1891 | 0.0165 | 0.2483 | 76.1% |
 * | 1024 | 0.0212 | 0.3867 | 0.0163 | 0.5025 | 77.0% |
 * | 4096 | 0.0256 | 1.2776 | 0.1873 | 0.1749 | 730.5% |
 * | 16384 | 0.0450 | 2.9122 | 0.0295 | 4.4498 | 65.4% |
 * | 65536 | 0.1011 | 5.1873 | 0.0508 | 10.3239 | 50.2% |
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
