/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0106 | 1.5515 | 0.0090 | 1.8221 | 85.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0101 | 6.4606 | 70.8% |
 * | 128 | 0.0237 | 11.0553 | 0.0134 | 19.5513 | 56.5% |
 * | 256 | 0.0796 | 13.1651 | 0.0438 | 23.9445 | 55.0% |
 * | 512 | 0.2985 | 14.0515 | 0.1998 | 20.9917 | 66.9% |
 * | 1024 | 2.0314 | 8.2588 | 0.9976 | 16.8168 | 49.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sgemm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-default.svg)
 *
 * ![sgemm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/sgemm.js) — WebGPU benchmark script
 * - [sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/sgemm.c) — CUDA / cuBLAS reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `transA = transB = "no-transpose"`. Both shaders load A/B into shared memory with a transpose-dependent index that scatters what would otherwise be a coalesced load — but it's asymmetric: `transB` dominates (measured +22-57% at n=1024) while `transA` is small and can even be *faster* than no-transpose, because B's tile dimension spans a full warp in the coalesced case (so transpose scatters every warp) while A's never gets a full-warp-coalesced load to begin with. All 4 `(transA, transB)` combinations are swept — collapsed below by default, expand a `transA` value, then a `transB`, to see its table and chart (4 combinations total).
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = no-transpose (2 transB values)</summary>
 *
 * <details>
 * <summary>transB = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5657 | 0.0083 | 1.9807 | 79.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0096 | 6.8495 | 66.7% |
 * | 128 | 0.0238 | 11.0256 | 0.0127 | 20.6088 | 53.5% |
 * | 256 | 0.0797 | 13.1625 | 0.0432 | 24.2816 | 54.2% |
 * | 512 | 0.2990 | 14.0274 | 0.1987 | 21.1134 | 66.4% |
 * | 1024 | 2.0347 | 8.2456 | 0.9964 | 16.8386 | 49.0% |
 *
 * ![sgemm-trans-no-transpose-no-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-trans-no-transpose-no-transpose.svg)
 *
 * ![sgemm-trans-no-transpose-no-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-trans-no-transpose-no-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>transB = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0115 | 1.4202 | 0.0086 | 1.8998 | 74.8% |
 * | 64 | 0.0150 | 4.3574 | 0.0096 | 6.8040 | 64.0% |
 * | 128 | 0.0287 | 9.1429 | 0.0122 | 21.4731 | 42.6% |
 * | 256 | 0.1331 | 7.8769 | 0.0330 | 31.7366 | 24.8% |
 * | 512 | 0.4396 | 9.5405 | 0.1868 | 22.4573 | 42.5% |
 * | 1024 | 3.1890 | 5.2609 | 0.9844 | 17.0425 | 30.9% |
 *
 * ![sgemm-trans-no-transpose-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-trans-no-transpose-transpose.svg)
 *
 * ![sgemm-trans-no-transpose-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-trans-no-transpose-transpose.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = transpose (2 transB values)</summary>
 *
 * <details>
 * <summary>transB = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 1.5329 | 0.0084 | 1.9431 | 78.9% |
 * | 64 | 0.0148 | 4.4329 | 0.0098 | 6.7148 | 66.0% |
 * | 128 | 0.0246 | 10.6667 | 0.0136 | 19.2980 | 55.3% |
 * | 256 | 0.0856 | 12.2520 | 0.0492 | 21.3333 | 57.4% |
 * | 512 | 0.3052 | 13.7421 | 0.2439 | 17.1988 | 79.9% |
 * | 1024 | 2.1678 | 7.7392 | 1.0079 | 16.6451 | 46.5% |
 *
 * ![sgemm-trans-transpose-no-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-trans-transpose-no-transpose.svg)
 *
 * ![sgemm-trans-transpose-no-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-trans-transpose-no-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>transB = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0115 | 1.4222 | 0.0084 | 1.9431 | 73.2% |
 * | 64 | 0.0156 | 4.2010 | 0.0099 | 6.5958 | 63.7% |
 * | 128 | 0.0294 | 8.9043 | 0.0125 | 20.8980 | 42.6% |
 * | 256 | 0.1396 | 7.5096 | 0.0562 | 18.6553 | 40.3% |
 * | 512 | 0.4631 | 9.0576 | 0.2336 | 17.9588 | 50.4% |
 * | 1024 | 3.3841 | 4.9576 | 0.9873 | 16.9934 | 29.2% |
 *
 * ![sgemm-trans-transpose-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-trans-transpose-transpose.svg)
 *
 * ![sgemm-trans-transpose-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-trans-transpose-transpose.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/trans.sgemm.js) — WebGPU trans-sweep benchmark script
 * - [trans.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/trans.sgemm.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * ## Ldb sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda`/`ldb`/`ldc` (no padding). `lda` and `ldc` were scoped and found to be non-effects; padding `ldb` only matters for `transB = "transpose"` here (swept at both `transB` values below so that's visible in the data). Collapsed below by default — expand a `transB` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = no-transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0103 | 1.5876 | 0.0086 | 1.9033 | 83.4% |
 * | 64 | 0.0143 | 4.5714 | 0.0097 | 6.7479 | 67.7% |
 * | 128 | 0.0233 | 11.2605 | 0.0134 | 19.5981 | 57.5% |
 * | 256 | 0.0795 | 13.1969 | 0.0436 | 24.0587 | 54.9% |
 * | 512 | 0.2970 | 14.1241 | 0.1986 | 21.1219 | 66.9% |
 * | 1024 | 2.0308 | 8.2613 | 0.9967 | 16.8327 | 49.1% |
 *
 * ![sgemm-ldb-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-no-transpose-pad0.svg)
 *
 * ![sgemm-ldb-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5657 | 0.0083 | 1.9807 | 79.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0097 | 6.7702 | 67.5% |
 * | 128 | 0.0238 | 11.0182 | 0.0136 | 19.2980 | 57.1% |
 * | 256 | 0.0795 | 13.1969 | 0.0444 | 23.6251 | 55.9% |
 * | 512 | 0.2985 | 14.0530 | 0.2009 | 20.8780 | 67.3% |
 * | 1024 | 2.0350 | 8.2445 | 1.0002 | 16.7735 | 49.2% |
 *
 * ![sgemm-ldb-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-no-transpose-pad1.svg)
 *
 * ![sgemm-ldb-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5657 | 0.0085 | 1.9357 | 80.9% |
 * | 64 | 0.0143 | 4.5714 | 0.0100 | 6.5746 | 69.5% |
 * | 128 | 0.0236 | 11.1153 | 0.0130 | 20.2022 | 55.0% |
 * | 256 | 0.0794 | 13.1996 | 0.0431 | 24.3357 | 54.2% |
 * | 512 | 0.2970 | 14.1241 | 0.1923 | 21.8090 | 64.8% |
 * | 1024 | 2.0316 | 8.2581 | 0.9891 | 16.9626 | 48.7% |
 *
 * ![sgemm-ldb-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-no-transpose-pad8.svg)
 *
 * ![sgemm-ldb-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5586 | 0.0087 | 1.8928 | 82.3% |
 * | 64 | 0.0143 | 4.5714 | 0.0100 | 6.5641 | 69.6% |
 * | 128 | 0.0235 | 11.1380 | 0.0126 | 20.8183 | 53.5% |
 * | 256 | 0.0792 | 13.2369 | 0.0430 | 24.3810 | 54.3% |
 * | 512 | 0.2967 | 14.1356 | 0.1950 | 21.5137 | 65.7% |
 * | 1024 | 2.0383 | 8.2309 | 0.9892 | 16.9609 | 48.5% |
 *
 * ![sgemm-ldb-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-no-transpose-pad16.svg)
 *
 * ![sgemm-ldb-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5586 | 0.0083 | 1.9692 | 79.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0096 | 6.8495 | 66.7% |
 * | 128 | 0.0236 | 11.1304 | 0.0125 | 20.9782 | 53.1% |
 * | 256 | 0.0792 | 13.2369 | 0.0432 | 24.2726 | 54.5% |
 * | 512 | 0.2978 | 14.0862 | 0.1987 | 21.1134 | 66.7% |
 * | 1024 | 2.0366 | 8.2378 | 0.9942 | 16.8752 | 48.8% |
 *
 * ![sgemm-ldb-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-no-transpose-pad32.svg)
 *
 * ![sgemm-ldb-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0113 | 1.4484 | 0.0083 | 1.9730 | 73.4% |
 * | 64 | 0.0143 | 4.5714 | 0.0097 | 6.7368 | 67.9% |
 * | 128 | 0.0235 | 11.1532 | 0.0125 | 20.8980 | 53.4% |
 * | 256 | 0.0792 | 13.2316 | 0.0430 | 24.3810 | 54.3% |
 * | 512 | 0.2977 | 14.0900 | 0.1984 | 21.1372 | 66.7% |
 * | 1024 | 2.0375 | 8.2344 | 0.9950 | 16.8622 | 48.8% |
 *
 * ![sgemm-ldb-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-no-transpose-pad64.svg)
 *
 * ![sgemm-ldb-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-no-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0111 | 1.4734 | 0.0082 | 2.0000 | 73.7% |
 * | 64 | 0.0159 | 4.1207 | 0.0098 | 6.6928 | 61.6% |
 * | 128 | 0.0287 | 9.1480 | 0.0124 | 21.1953 | 43.2% |
 * | 256 | 0.1332 | 7.8694 | 0.0329 | 31.8290 | 24.7% |
 * | 512 | 0.4389 | 9.5561 | 0.1864 | 22.5055 | 42.5% |
 * | 1024 | 3.1770 | 5.2808 | 0.9851 | 17.0317 | 31.0% |
 *
 * ![sgemm-ldb-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-transpose-pad0.svg)
 *
 * ![sgemm-ldb-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0100 | 1.6463 | 0.0084 | 1.9542 | 84.2% |
 * | 64 | 0.0123 | 5.3333 | 0.0098 | 6.6819 | 79.8% |
 * | 128 | 0.0208 | 12.6031 | 0.0123 | 21.3333 | 59.1% |
 * | 256 | 0.0771 | 13.5939 | 0.0341 | 30.7536 | 44.2% |
 * | 512 | 0.2668 | 15.7236 | 0.1864 | 22.5055 | 69.9% |
 * | 1024 | 1.9606 | 8.5572 | 0.9851 | 17.0309 | 50.2% |
 *
 * ![sgemm-ldb-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-transpose-pad1.svg)
 *
 * ![sgemm-ldb-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0101 | 1.6254 | 0.0083 | 1.9655 | 82.7% |
 * | 64 | 0.0123 | 5.3333 | 0.0099 | 6.6494 | 80.2% |
 * | 128 | 0.0219 | 11.9766 | 0.0123 | 21.3333 | 56.1% |
 * | 256 | 0.0906 | 11.5768 | 0.0336 | 31.1779 | 37.1% |
 * | 512 | 0.2499 | 16.7869 | 0.1867 | 22.4650 | 74.7% |
 * | 1024 | 1.8726 | 8.9592 | 0.9835 | 17.0583 | 52.5% |
 *
 * ![sgemm-ldb-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-transpose-pad8.svg)
 *
 * ![sgemm-ldb-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0100 | 1.6358 | 0.0084 | 1.9468 | 84.0% |
 * | 64 | 0.0128 | 5.1393 | 0.0096 | 6.8040 | 75.5% |
 * | 128 | 0.0228 | 11.5137 | 0.0122 | 21.4731 | 53.6% |
 * | 256 | 0.1018 | 10.3012 | 0.0331 | 31.6599 | 32.5% |
 * | 512 | 0.2888 | 14.5248 | 0.1864 | 22.5055 | 64.5% |
 * | 1024 | 2.1069 | 7.9629 | 0.9836 | 17.0575 | 46.7% |
 *
 * ![sgemm-ldb-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-transpose-pad16.svg)
 *
 * ![sgemm-ldb-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0102 | 1.6101 | 0.0082 | 1.9961 | 80.7% |
 * | 64 | 0.0136 | 4.8245 | 0.0102 | 6.4000 | 75.4% |
 * | 128 | 0.0246 | 10.6667 | 0.0122 | 21.4731 | 49.7% |
 * | 256 | 0.1132 | 9.2630 | 0.0341 | 30.7392 | 30.1% |
 * | 512 | 0.3740 | 11.2142 | 0.1864 | 22.5036 | 49.8% |
 * | 1024 | 2.7133 | 6.1833 | 0.9851 | 17.0312 | 36.3% |
 *
 * ![sgemm-ldb-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-transpose-pad32.svg)
 *
 * ![sgemm-ldb-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0102 | 1.6000 | 0.0083 | 1.9655 | 81.4% |
 * | 64 | 0.0135 | 4.8473 | 0.0098 | 6.6928 | 72.4% |
 * | 128 | 0.0246 | 10.6667 | 0.0121 | 21.7294 | 49.1% |
 * | 256 | 0.1147 | 9.1429 | 0.0337 | 31.1187 | 29.4% |
 * | 512 | 0.3735 | 11.2301 | 0.1866 | 22.4804 | 50.0% |
 * | 1024 | 2.7383 | 6.1269 | 0.9846 | 17.0403 | 36.0% |
 *
 * ![sgemm-ldb-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldb-transpose-pad64.svg)
 *
 * ![sgemm-ldb-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldb-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/ldb.sgemm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/ldb.sgemm.c) — CUDA / cuBLAS ldb-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemm
 */
