/**
 * Benchmark results for idamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 0.0208 | 0.0162 | 0.0158 | 131.9% |
 * | 64 | 0.0123 | 0.0417 | 0.0167 | 0.0307 | 135.7% |
 * | 128 | 0.0123 | 0.0833 | 0.0167 | 0.0615 | 135.5% |
 * | 512 | 0.0123 | 0.3325 | 0.0167 | 0.2452 | 135.6% |
 * | 1024 | 0.0123 | 0.6649 | 0.0167 | 0.4914 | 135.3% |
 * | 4096 | 0.0123 | 2.6667 | 0.0180 | 1.8156 | 146.9% |
 * | 16384 | 0.0128 | 10.2528 | 0.0181 | 7.2496 | 141.4% |
 * | 65536 | 0.0143 | 36.6123 | 0.0180 | 29.1012 | 125.8% |
 * | 262144 | 0.0258 | 81.1591 | 0.0378 | 55.4920 | 146.3% |
 * | 1048576 | 0.0604 | 138.7740 | 0.0741 | 113.2127 | 122.6% |
 * | 4194304 | 0.1966 | 170.6667 | 0.2248 | 149.2847 | 114.3% |
 * | 16777216 | 0.7416 | 180.9840 | 0.8223 | 163.2152 | 110.9% |
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
 * | 32 | 0.0123 | 0.0208 | 0.0164 | 0.0156 | 133.5% |
 * | 64 | 0.0123 | 0.0417 | 0.0168 | 0.0305 | 136.6% |
 * | 128 | 0.0123 | 0.0833 | 0.0167 | 0.0614 | 135.7% |
 * | 512 | 0.0123 | 0.3333 | 0.0165 | 0.2481 | 134.4% |
 * | 1024 | 0.0123 | 0.6667 | 0.0167 | 0.4895 | 136.2% |
 * | 4096 | 0.0128 | 2.5600 | 0.0179 | 1.8286 | 140.0% |
 * | 16384 | 0.0143 | 9.1429 | 0.0179 | 7.3339 | 124.7% |
 * | 65536 | 0.0256 | 20.4800 | 0.0301 | 17.3928 | 117.7% |
 * | 262144 | 0.0597 | 35.1211 | 0.0633 | 33.1241 | 106.0% |
 * | 1048576 | 0.1985 | 42.2677 | 0.1974 | 42.4972 | 99.5% |
 * | 4194304 | 0.7475 | 44.8877 | 0.7347 | 45.6727 | 98.3% |
 *
 * ![idamax-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride4.svg)
 *
 * ![idamax-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 0.0208 | 0.0167 | 0.0153 | 136.2% |
 * | 64 | 0.0123 | 0.0417 | 0.0167 | 0.0307 | 135.7% |
 * | 128 | 0.0123 | 0.0833 | 0.0167 | 0.0614 | 135.7% |
 * | 512 | 0.0123 | 0.3333 | 0.0167 | 0.2457 | 135.7% |
 * | 1024 | 0.0124 | 0.6615 | 0.0168 | 0.4885 | 135.4% |
 * | 4096 | 0.0128 | 2.5568 | 0.0180 | 1.8253 | 140.1% |
 * | 16384 | 0.0143 | 9.1429 | 0.0180 | 7.2947 | 125.3% |
 * | 65536 | 0.0283 | 18.5025 | 0.0312 | 16.8214 | 110.0% |
 * | 262144 | 0.0717 | 29.2441 | 0.0747 | 28.0668 | 104.2% |
 * | 1048576 | 0.2436 | 34.4383 | 0.2440 | 34.3750 | 100.2% |
 *
 * ![idamax-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride5.svg)
 *
 * ![idamax-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 0.0208 | 0.0165 | 0.0155 | 134.4% |
 * | 64 | 0.0123 | 0.0417 | 0.0167 | 0.0307 | 135.7% |
 * | 128 | 0.0123 | 0.0833 | 0.0163 | 0.0628 | 132.7% |
 * | 512 | 0.0126 | 0.3241 | 0.0167 | 0.2457 | 131.9% |
 * | 1024 | 0.0126 | 0.6514 | 0.0168 | 0.4890 | 133.2% |
 * | 4096 | 0.0154 | 2.1245 | 0.0180 | 1.8253 | 116.4% |
 * | 16384 | 0.0255 | 5.1328 | 0.0213 | 6.1548 | 83.4% |
 * | 65536 | 0.0592 | 8.8514 | 0.0395 | 13.2825 | 66.6% |
 * | 262144 | 0.1946 | 10.7789 | 0.1074 | 19.5193 | 55.2% |
 *
 * ![idamax-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride32.svg)
 *
 * ![idamax-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 0.0417 | 0.0167 | 0.0306 | 136.2% |
 * | 128 | 0.0123 | 0.0833 | 0.0167 | 0.0612 | 136.2% |
 * | 512 | 0.0124 | 0.3290 | 0.0167 | 0.2457 | 133.9% |
 * | 1024 | 0.0124 | 0.6581 | 0.0168 | 0.4867 | 135.2% |
 * | 4096 | 0.0146 | 2.2432 | 0.0180 | 1.8221 | 123.1% |
 * | 16384 | 0.0259 | 5.0630 | 0.0217 | 6.0324 | 83.9% |
 * | 65536 | 0.0592 | 8.8514 | 0.0389 | 13.4681 | 65.7% |
 * | 262144 | 0.1957 | 10.7155 | 0.1078 | 19.4498 | 55.1% |
 *
 * ![idamax-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride33.svg)
 *
 * ![idamax-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0126 | 0.3249 | 0.0166 | 0.2469 | 131.6% |
 * | 1024 | 0.0127 | 0.6432 | 0.0164 | 0.4990 | 128.9% |
 * | 4096 | 0.0164 | 1.9980 | 0.0180 | 1.8156 | 110.0% |
 * | 16384 | 0.0380 | 3.4493 | 0.0301 | 4.3528 | 79.2% |
 * | 65536 | 0.1090 | 4.8117 | 0.0619 | 8.4716 | 56.8% |
 *
 * ![idamax-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/gbps-stride255.svg)
 *
 * ![idamax-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/idamax/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0126 | 0.3245 | 0.0167 | 0.2447 | 132.6% |
 * | 1024 | 0.0127 | 0.6432 | 0.0167 | 0.4900 | 131.3% |
 * | 4096 | 0.0156 | 2.0941 | 0.0179 | 1.8269 | 114.6% |
 * | 16384 | 0.0309 | 4.2424 | 0.0294 | 4.4546 | 95.2% |
 * | 65536 | 0.0819 | 6.4000 | 0.0504 | 10.3992 | 61.5% |
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
