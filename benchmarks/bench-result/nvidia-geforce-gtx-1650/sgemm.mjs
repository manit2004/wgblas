/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0096 | 1.7152 | 0.0076 | 2.1468 | 79.9% |
 * | 64 | 0.0119 | 5.5277 | 0.0082 | 8.0000 | 69.1% |
 * | 128 | 0.0191 | 13.7565 | 0.0104 | 25.0904 | 54.8% |
 * | 256 | 0.0698 | 15.0312 | 0.0351 | 29.8434 | 50.4% |
 * | 512 | 0.1677 | 25.0114 | 0.1539 | 27.2556 | 91.8% |
 * | 1024 | 1.1095 | 15.1218 | 0.7725 | 21.7186 | 69.6% |
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
 * | 32 | 0.0094 | 1.7504 | 0.0072 | 2.2655 | 77.3% |
 * | 64 | 0.0118 | 5.5351 | 0.0082 | 8.0000 | 69.2% |
 * | 128 | 0.0195 | 13.4185 | 0.0103 | 25.5203 | 52.6% |
 * | 256 | 0.0696 | 15.0588 | 0.0353 | 29.6812 | 50.7% |
 * | 512 | 0.1681 | 24.9566 | 0.1548 | 27.1034 | 92.1% |
 * | 1024 | 1.1075 | 15.1491 | 0.7726 | 21.7150 | 69.8% |
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
 * | 32 | 0.0094 | 1.7415 | 0.0071 | 2.3115 | 75.3% |
 * | 64 | 0.0120 | 5.4468 | 0.0082 | 8.0000 | 68.1% |
 * | 128 | 0.0201 | 13.0654 | 0.0102 | 25.6000 | 51.0% |
 * | 256 | 0.0717 | 14.6286 | 0.0266 | 39.3846 | 37.1% |
 * | 512 | 0.1862 | 22.5268 | 0.1470 | 28.5404 | 78.9% |
 * | 1024 | 1.2677 | 13.2342 | 0.7683 | 21.8381 | 60.6% |
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
 * | 32 | 0.0101 | 1.6228 | 0.0070 | 2.3486 | 69.1% |
 * | 64 | 0.0126 | 5.1848 | 0.0082 | 7.9844 | 64.9% |
 * | 128 | 0.0201 | 13.0550 | 0.0110 | 23.7794 | 54.9% |
 * | 256 | 0.0696 | 15.0588 | 0.0404 | 25.9241 | 58.1% |
 * | 512 | 0.1573 | 26.6650 | 0.1927 | 21.7637 | 122.5% |
 * | 1024 | 0.9926 | 16.9027 | 0.7868 | 21.3225 | 79.3% |
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
 * | 32 | 0.0101 | 1.6254 | 0.0073 | 2.2456 | 72.4% |
 * | 64 | 0.0133 | 4.9349 | 0.0082 | 7.9689 | 61.9% |
 * | 128 | 0.0204 | 12.8401 | 0.0107 | 24.4537 | 52.5% |
 * | 256 | 0.0715 | 14.6646 | 0.0458 | 22.9067 | 64.0% |
 * | 512 | 0.1741 | 24.0941 | 0.1832 | 22.8887 | 105.3% |
 * | 1024 | 1.1496 | 14.5938 | 0.7660 | 21.9033 | 66.6% |
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
 * | 32 | 0.0092 | 1.7840 | 0.0071 | 2.3167 | 77.0% |
 * | 64 | 0.0120 | 5.4613 | 0.0080 | 8.1756 | 66.8% |
 * | 128 | 0.0195 | 13.4295 | 0.0105 | 24.8619 | 54.0% |
 * | 256 | 0.0701 | 14.9489 | 0.0348 | 30.1176 | 49.6% |
 * | 512 | 0.1680 | 24.9732 | 0.1539 | 27.2499 | 91.6% |
 * | 1024 | 1.1096 | 15.1203 | 0.7735 | 21.6890 | 69.7% |
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
 * | 32 | 0.0095 | 1.7181 | 0.0078 | 2.1027 | 81.7% |
 * | 64 | 0.0121 | 5.4324 | 0.0086 | 7.6418 | 71.1% |
 * | 128 | 0.0191 | 13.6990 | 0.0109 | 23.9532 | 57.2% |
 * | 256 | 0.0667 | 15.7161 | 0.0367 | 28.5684 | 55.0% |
 * | 512 | 0.1996 | 21.0119 | 0.1577 | 26.5947 | 79.0% |
 * | 1024 | 1.3758 | 12.1942 | 0.7846 | 21.3838 | 57.0% |
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
 * | 32 | 0.0092 | 1.7778 | 0.0076 | 2.1468 | 82.8% |
 * | 64 | 0.0118 | 5.5577 | 0.0084 | 7.8168 | 71.1% |
 * | 128 | 0.0192 | 13.6761 | 0.0110 | 23.8140 | 57.4% |
 * | 256 | 0.0707 | 14.8271 | 0.0358 | 29.2571 | 50.7% |
 * | 512 | 0.1700 | 24.6793 | 0.1520 | 27.5912 | 89.4% |
 * | 1024 | 1.1214 | 14.9611 | 0.7757 | 21.6286 | 69.2% |
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
 * | 32 | 0.0093 | 1.7534 | 0.0081 | 2.0197 | 86.8% |
 * | 64 | 0.0117 | 5.6110 | 0.0082 | 8.0000 | 70.1% |
 * | 128 | 0.0190 | 13.7681 | 0.0106 | 24.6747 | 55.8% |
 * | 256 | 0.0701 | 14.9523 | 0.0352 | 29.7485 | 50.3% |
 * | 512 | 0.1700 | 24.6747 | 0.1546 | 27.1230 | 91.0% |
 * | 1024 | 1.1197 | 14.9835 | 0.7759 | 21.6219 | 69.3% |
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
 * | 32 | 0.0093 | 1.7595 | 0.0076 | 2.1423 | 82.1% |
 * | 64 | 0.0118 | 5.5577 | 0.0085 | 7.6992 | 72.2% |
 * | 128 | 0.0190 | 13.7681 | 0.0108 | 24.3447 | 56.6% |
 * | 256 | 0.0697 | 15.0346 | 0.0362 | 28.9726 | 51.9% |
 * | 512 | 0.1681 | 24.9471 | 0.1575 | 26.6244 | 93.7% |
 * | 1024 | 1.1092 | 15.1257 | 0.7800 | 21.5093 | 70.3% |
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
 * | 32 | 0.0092 | 1.7871 | 0.0078 | 2.0984 | 85.2% |
 * | 64 | 0.0117 | 5.6033 | 0.0082 | 8.0000 | 70.0% |
 * | 128 | 0.0193 | 13.5854 | 0.0106 | 24.7867 | 54.8% |
 * | 256 | 0.0698 | 15.0277 | 0.0362 | 28.9342 | 51.9% |
 * | 512 | 0.1679 | 24.9756 | 0.1566 | 26.7904 | 93.2% |
 * | 1024 | 1.1088 | 15.1312 | 0.7812 | 21.4758 | 70.5% |
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
 * | 32 | 0.0098 | 1.6787 | 0.0076 | 2.1695 | 77.4% |
 * | 64 | 0.0120 | 5.4686 | 0.0082 | 8.0000 | 68.4% |
 * | 128 | 0.0201 | 13.0342 | 0.0102 | 25.6401 | 50.8% |
 * | 256 | 0.0717 | 14.6286 | 0.0266 | 39.3846 | 37.1% |
 * | 512 | 0.1864 | 22.5036 | 0.1472 | 28.4877 | 79.0% |
 * | 1024 | 1.2684 | 13.2274 | 0.7697 | 21.7967 | 60.7% |
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
 * | 32 | 0.0096 | 1.7067 | 0.0074 | 2.2022 | 77.5% |
 * | 64 | 0.0117 | 5.5956 | 0.0081 | 8.0630 | 69.4% |
 * | 128 | 0.0196 | 13.3747 | 0.0102 | 25.6000 | 52.2% |
 * | 256 | 0.0719 | 14.5765 | 0.0270 | 38.8707 | 37.5% |
 * | 512 | 0.2086 | 20.1062 | 0.1469 | 28.5467 | 70.4% |
 * | 1024 | 1.6086 | 10.4295 | 0.7658 | 21.9079 | 47.6% |
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
 * | 32 | 0.0098 | 1.6650 | 0.0074 | 2.2022 | 75.6% |
 * | 64 | 0.0122 | 5.3753 | 0.0082 | 8.0157 | 67.1% |
 * | 128 | 0.0197 | 13.2879 | 0.0102 | 25.6000 | 51.9% |
 * | 256 | 0.0696 | 15.0588 | 0.0266 | 39.4083 | 38.2% |
 * | 512 | 0.1810 | 23.1781 | 0.1471 | 28.5187 | 81.3% |
 * | 1024 | 1.2224 | 13.7245 | 0.7660 | 21.9028 | 62.7% |
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
 * | 32 | 0.0096 | 1.7124 | 0.0074 | 2.2213 | 77.1% |
 * | 64 | 0.0121 | 5.3966 | 0.0081 | 8.0472 | 67.1% |
 * | 128 | 0.0201 | 13.0238 | 0.0102 | 25.6000 | 50.9% |
 * | 256 | 0.0704 | 14.9013 | 0.0267 | 39.3373 | 37.9% |
 * | 512 | 0.1826 | 22.9709 | 0.1469 | 28.5529 | 80.5% |
 * | 1024 | 1.2492 | 13.4302 | 0.7647 | 21.9404 | 61.2% |
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
 * | 32 | 0.0095 | 1.7181 | 0.0073 | 2.2456 | 76.5% |
 * | 64 | 0.0123 | 5.3403 | 0.0081 | 8.0630 | 66.2% |
 * | 128 | 0.0200 | 13.0967 | 0.0102 | 25.7610 | 50.8% |
 * | 256 | 0.0717 | 14.6286 | 0.0266 | 39.3846 | 37.1% |
 * | 512 | 0.1864 | 22.5055 | 0.1471 | 28.5218 | 78.9% |
 * | 1024 | 1.3000 | 12.9052 | 0.7638 | 21.9643 | 58.8% |
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
 * | 32 | 0.0096 | 1.7038 | 0.0071 | 2.3011 | 74.0% |
 * | 64 | 0.0121 | 5.4324 | 0.0082 | 8.0000 | 67.9% |
 * | 128 | 0.0196 | 13.4075 | 0.0102 | 25.8016 | 52.0% |
 * | 256 | 0.0714 | 14.6810 | 0.0266 | 39.4320 | 37.2% |
 * | 512 | 0.1878 | 22.3329 | 0.1471 | 28.5063 | 78.3% |
 * | 1024 | 1.3529 | 12.4011 | 0.7638 | 21.9648 | 56.5% |
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
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0087 | 7.5712 | 70.4% |
 * | 128 | 0.0195 | 13.4295 | 0.0109 | 23.9883 | 56.0% |
 * | 256 | 0.0711 | 14.7537 | 0.0365 | 28.6935 | 51.4% |
 * | 512 | 0.1680 | 24.9613 | 0.1574 | 26.6542 | 93.6% |
 * | 1024 | 1.1609 | 14.4520 | 0.7814 | 21.4705 | 67.3% |
 * | 2048 | 9.4333 | 7.1140 | 6.7665 | 9.9178 | 71.7% |
 *
 * ![sgemm-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-alphaneg3p75.svg)
 *
 * ![sgemm-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0120 | 5.4541 | 0.0027 | 24.6747 | 22.1% |
 * | 128 | 0.0194 | 13.4959 | 0.0028 | 94.7052 | 14.3% |
 * | 256 | 0.0701 | 14.9660 | 0.0037 | 283.7056 | 5.3% |
 * | 512 | 0.1679 | 24.9875 | 0.0082 | 514.0078 | 4.9% |
 * | 1024 | 1.1571 | 14.4991 | 0.0250 | 670.8739 | 2.2% |
 * | 2048 | 9.4349 | 7.1128 | 0.0923 | 727.1678 | 1.0% |
 *
 * ![sgemm-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-alpha0.svg)
 *
 * ![sgemm-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0088 | 7.4203 | 71.9% |
 * | 128 | 0.0196 | 13.3420 | 0.0113 | 23.2727 | 57.3% |
 * | 256 | 0.0706 | 14.8540 | 0.0362 | 28.9854 | 51.2% |
 * | 512 | 0.1682 | 24.9376 | 0.1584 | 26.4819 | 94.2% |
 * | 1024 | 1.1555 | 14.5192 | 0.8448 | 19.8594 | 73.1% |
 * | 2048 | 9.4298 | 7.1167 | 6.7659 | 9.9186 | 71.8% |
 *
 * ![sgemm-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-alpha1eneg38.svg)
 *
 * ![sgemm-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0081 | 8.0472 | 66.3% |
 * | 128 | 0.0197 | 13.2879 | 0.0103 | 25.4016 | 52.3% |
 * | 256 | 0.0709 | 14.7837 | 0.0348 | 30.1731 | 49.0% |
 * | 512 | 0.1682 | 24.9400 | 0.1536 | 27.2981 | 91.4% |
 * | 1024 | 1.1625 | 14.4323 | 0.8353 | 20.0857 | 71.9% |
 * | 2048 | 9.4832 | 7.0766 | 6.7648 | 9.9203 | 71.3% |
 *
 * ![sgemm-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-alpha1.svg)
 *
 * ![sgemm-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0120 | 5.4468 | 0.0083 | 7.8618 | 69.3% |
 * | 128 | 0.0192 | 13.6647 | 0.0114 | 22.9147 | 59.6% |
 * | 256 | 0.0711 | 14.7504 | 0.0368 | 28.4568 | 51.8% |
 * | 512 | 0.1683 | 24.9234 | 0.1571 | 26.7003 | 93.3% |
 * | 1024 | 1.1565 | 14.5063 | 0.7879 | 21.2948 | 68.1% |
 * | 2048 | 9.4349 | 7.1128 | 6.7661 | 9.9184 | 71.7% |
 *
 * ![sgemm-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-alpha2p5.svg)
 *
 * ![sgemm-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/alpha.sgemm.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/alpha.sgemm.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * ## beta sweep
 *
 * `beta` scales the existing `y`/`C` before accumulation. Reference BLAS is permitted to skip reading that operand entirely when `beta` is 0, so unlike `alpha` this sweep has a mechanism to be non-flat — a step at 0 means the shortcut is taken, and its size is what it saves.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0090 | 7.3012 | 73.0% |
 * | 128 | 0.0196 | 13.4075 | 0.0113 | 23.2727 | 57.6% |
 * | 256 | 0.0710 | 14.7703 | 0.0393 | 26.7058 | 55.3% |
 * | 512 | 0.1685 | 24.8879 | 0.1584 | 26.4792 | 94.0% |
 * | 1024 | 1.1658 | 14.3909 | 0.8314 | 20.1804 | 71.3% |
 * | 2048 | 9.5122 | 7.0551 | 6.7773 | 9.9021 | 71.2% |
 *
 * ![sgemm-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-betaneg3p75.svg)
 *
 * ![sgemm-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0119 | 5.4980 | 0.0081 | 8.0630 | 68.2% |
 * | 128 | 0.0195 | 13.4185 | 0.0102 | 25.6000 | 52.4% |
 * | 256 | 0.0702 | 14.9455 | 0.0351 | 29.8706 | 50.0% |
 * | 512 | 0.1679 | 24.9756 | 0.1536 | 27.3038 | 91.5% |
 * | 1024 | 1.1342 | 14.7920 | 0.7833 | 21.4192 | 69.1% |
 * | 2048 | 9.5210 | 7.0485 | 6.7647 | 9.9204 | 71.1% |
 *
 * ![sgemm-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-beta0.svg)
 *
 * ![sgemm-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0124 | 5.2988 | 0.0086 | 7.6276 | 69.5% |
 * | 128 | 0.0196 | 13.3747 | 0.0112 | 23.4728 | 57.0% |
 * | 256 | 0.0704 | 14.8912 | 0.0398 | 26.3620 | 56.5% |
 * | 512 | 0.1683 | 24.9210 | 0.1578 | 26.5785 | 93.8% |
 * | 1024 | 1.1563 | 14.5099 | 0.7964 | 21.0659 | 68.9% |
 * | 2048 | 9.5215 | 7.0481 | 6.7783 | 9.9006 | 71.2% |
 *
 * ![sgemm-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-beta1.svg)
 *
 * ![sgemm-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0120 | 5.4396 | 0.0088 | 7.4338 | 73.2% |
 * | 128 | 0.0197 | 13.3095 | 0.0113 | 23.1740 | 57.4% |
 * | 256 | 0.0710 | 14.7604 | 0.0391 | 26.8041 | 55.1% |
 * | 512 | 0.1683 | 24.9210 | 0.1597 | 26.2617 | 94.9% |
 * | 1024 | 1.1583 | 14.4843 | 0.7843 | 21.3925 | 67.7% |
 * | 2048 | 9.4986 | 7.0651 | 6.8090 | 9.8559 | 71.7% |
 *
 * ![sgemm-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-beta2p5.svg)
 *
 * ![sgemm-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/beta.sgemm.js) — WebGPU beta-sweep benchmark script
 * - [beta.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/beta.sgemm.c) — CUDA / cuBLAS beta-sweep reference script
 *
 * ## layout sweep
 *
 * Column-major swaps the effective `m`/`n` and flips the transpose flag internally, changing which axis is contiguous and therefore how the matrix reads coalesce. wgblas-only: cuBLAS is column-major and has no layout argument, so there is no reference curve to compare against.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = column-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0196 | 13.3966 |
 * | 256 | 0.0711 | 14.7404 |
 * | 512 | 0.1686 | 24.8808 |
 * | 1024 | 1.1657 | 14.3921 |
 * | 2048 | 9.5214 | 7.0482 |
 *
 * ![sgemm-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-layoutcolumnmajor.svg)
 *
 * ![sgemm-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0119 | 5.5277 |
 * | 128 | 0.0191 | 13.7105 |
 * | 256 | 0.0700 | 14.9797 |
 * | 512 | 0.1679 | 24.9756 |
 * | 1024 | 1.1367 | 14.7599 |
 * | 2048 | 9.5217 | 7.0480 |
 *
 * ![sgemm-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-layoutrowmajor.svg)
 *
 * ![sgemm-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/layout.sgemm.js) — WebGPU layout-sweep benchmark script
 *
 * ## ldc sweep
 *
 * Padding on the output matrix. `C` is written rather than streamed, so this measures write coalescing rather than read bandwidth — the row byte-stride is `ldc*4`, and a pad that moves it off the 128-byte boundary is what would show up here.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0121 | 5.4037 | 0.0081 | 8.0949 | 66.8% |
 * | 128 | 0.0193 | 13.5517 | 0.0103 | 25.3622 | 53.4% |
 * | 256 | 0.0700 | 14.9762 | 0.0348 | 30.1176 | 49.7% |
 * | 512 | 0.1681 | 24.9566 | 0.1538 | 27.2726 | 91.5% |
 * | 1024 | 1.1628 | 14.4277 | 0.7939 | 21.1321 | 68.3% |
 * | 2048 | 9.4471 | 7.1037 | 6.8172 | 9.8440 | 72.2% |
 *
 * ![sgemm-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad0.svg)
 *
 * ![sgemm-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0088 | 7.4881 | 71.2% |
 * | 128 | 0.0198 | 13.2664 | 0.0110 | 23.7449 | 55.9% |
 * | 256 | 0.0712 | 14.7173 | 0.0358 | 29.2964 | 50.2% |
 * | 512 | 0.1708 | 24.5568 | 0.1593 | 26.3223 | 93.3% |
 * | 1024 | 1.1710 | 14.3272 | 0.7839 | 21.4013 | 66.9% |
 * | 2048 | 9.5336 | 7.0392 | 6.8313 | 9.8237 | 71.7% |
 *
 * ![sgemm-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad1.svg)
 *
 * ![sgemm-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0089 | 7.3802 | 72.3% |
 * | 128 | 0.0197 | 13.3312 | 0.0111 | 23.6081 | 56.5% |
 * | 256 | 0.0713 | 14.7008 | 0.0365 | 28.7565 | 51.1% |
 * | 512 | 0.1717 | 24.4241 | 0.1577 | 26.5974 | 91.8% |
 * | 1024 | 1.1596 | 14.4681 | 0.8138 | 20.6149 | 70.2% |
 * | 2048 | 9.5312 | 7.0410 | 6.7648 | 9.9203 | 71.0% |
 *
 * ![sgemm-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad8.svg)
 *
 * ![sgemm-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0086 | 7.5993 | 70.2% |
 * | 128 | 0.0196 | 13.3420 | 0.0108 | 24.2726 | 55.0% |
 * | 256 | 0.0713 | 14.7008 | 0.0369 | 28.4444 | 51.7% |
 * | 512 | 0.1716 | 24.4378 | 0.1576 | 26.6109 | 91.8% |
 * | 1024 | 1.1679 | 14.3650 | 0.7818 | 21.4604 | 66.9% |
 * | 2048 | 9.5294 | 7.0423 | 6.7677 | 9.9161 | 71.0% |
 *
 * ![sgemm-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad16.svg)
 *
 * ![sgemm-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0087 | 7.5018 | 71.1% |
 * | 128 | 0.0199 | 13.1916 | 0.0111 | 23.7106 | 55.6% |
 * | 256 | 0.0712 | 14.7272 | 0.0366 | 28.6810 | 51.3% |
 * | 512 | 0.1690 | 24.8195 | 0.1584 | 26.4872 | 93.7% |
 * | 1024 | 1.1571 | 14.4991 | 0.7812 | 21.4762 | 67.5% |
 * | 2048 | 9.5185 | 7.0503 | 6.8122 | 9.8512 | 71.6% |
 *
 * ![sgemm-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad32.svg)
 *
 * ![sgemm-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0087 | 7.5294 | 70.8% |
 * | 128 | 0.0198 | 13.2557 | 0.0117 | 22.3825 | 59.2% |
 * | 256 | 0.0710 | 14.7604 | 0.0409 | 25.6200 | 57.6% |
 * | 512 | 0.1718 | 24.4105 | 0.1854 | 22.6201 | 107.9% |
 * | 1024 | 1.1588 | 14.4785 | 0.8671 | 19.3489 | 74.8% |
 * | 2048 | 9.5293 | 7.0424 | 6.8311 | 9.8241 | 71.7% |
 *
 * ![sgemm-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad48.svg)
 *
 * ![sgemm-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0088 | 7.4608 | 71.5% |
 * | 128 | 0.0195 | 13.4405 | 0.0115 | 22.8508 | 58.8% |
 * | 256 | 0.0708 | 14.8137 | 0.0366 | 28.6308 | 51.7% |
 * | 512 | 0.1691 | 24.8078 | 0.1576 | 26.6217 | 93.2% |
 * | 1024 | 1.1594 | 14.4707 | 0.8346 | 20.1023 | 72.0% |
 * | 2048 | 9.5219 | 7.0479 | 6.8306 | 9.8247 | 71.7% |
 *
 * ![sgemm-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad64.svg)
 *
 * ![sgemm-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 5.3333 | 0.0087 | 7.5572 | 70.6% |
 * | 128 | 0.0199 | 13.2023 | 0.0116 | 22.5675 | 58.5% |
 * | 256 | 0.0713 | 14.6975 | 0.0370 | 28.3338 | 51.9% |
 * | 512 | 0.1694 | 24.7586 | 0.1574 | 26.6461 | 92.9% |
 * | 1024 | 1.1655 | 14.3948 | 0.7803 | 21.5013 | 66.9% |
 * | 2048 | 9.5198 | 7.0494 | 6.8301 | 9.8255 | 71.7% |
 *
 * ![sgemm-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/gbps-ldcpad128.svg)
 *
 * ![sgemm-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemm/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/ldc.sgemm.js) — WebGPU ldc-sweep benchmark script
 * - [ldc.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/ldc.sgemm.c) — CUDA / cuBLAS ldc-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemm
 */
