/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 1.8720 | 0.0076 | 2.1603 | 86.7% |
 * | 64 | 0.0111 | 5.9020 | 0.0082 | 8.0000 | 73.8% |
 * | 128 | 0.0186 | 14.0635 | 0.0104 | 25.2840 | 55.6% |
 * | 256 | 0.0696 | 15.0588 | 0.0348 | 30.1038 | 50.0% |
 * | 512 | 0.1714 | 24.4674 | 0.1544 | 27.1596 | 90.1% |
 * | 1024 | 1.1325 | 14.8140 | 0.7723 | 21.7245 | 68.2% |
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
 * | 32 | 0.0088 | 1.8652 | 0.0077 | 2.1378 | 87.2% |
 * | 64 | 0.0114 | 5.7690 | 0.0082 | 7.9844 | 72.3% |
 * | 128 | 0.0185 | 14.1608 | 0.0106 | 24.7492 | 57.2% |
 * | 256 | 0.0696 | 15.0588 | 0.0355 | 29.5473 | 51.0% |
 * | 512 | 0.1720 | 24.3810 | 0.1551 | 27.0447 | 90.2% |
 * | 1024 | 1.1313 | 14.8297 | 0.7757 | 21.6295 | 68.6% |
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
 * | 32 | 0.0090 | 1.8221 | 0.0084 | 1.9431 | 93.8% |
 * | 64 | 0.0117 | 5.6110 | 0.0087 | 7.5294 | 74.5% |
 * | 128 | 0.0188 | 13.9676 | 0.0108 | 24.3086 | 57.5% |
 * | 256 | 0.0712 | 14.7272 | 0.0289 | 36.2879 | 40.6% |
 * | 512 | 0.1902 | 22.0567 | 0.1546 | 27.1230 | 81.3% |
 * | 1024 | 1.2870 | 13.0358 | 0.7701 | 21.7850 | 59.8% |
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
 * | 32 | 0.0099 | 1.6490 | 0.0061 | 2.6667 | 61.8% |
 * | 64 | 0.0123 | 5.3333 | 0.0070 | 9.3730 | 56.9% |
 * | 128 | 0.0205 | 12.8000 | 0.0108 | 24.3447 | 52.6% |
 * | 256 | 0.0737 | 14.2222 | 0.0424 | 24.7399 | 57.5% |
 * | 512 | 0.2097 | 20.0034 | 0.1978 | 21.2005 | 94.4% |
 * | 1024 | 1.3873 | 12.0935 | 0.7915 | 21.1958 | 57.1% |
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
 * | 32 | 0.0099 | 1.6623 | 0.0063 | 2.6189 | 63.5% |
 * | 64 | 0.0125 | 5.2379 | 0.0077 | 8.5511 | 61.3% |
 * | 128 | 0.0206 | 12.7008 | 0.0096 | 27.3980 | 46.4% |
 * | 256 | 0.0752 | 13.9527 | 0.0466 | 22.4823 | 62.1% |
 * | 512 | 0.2293 | 18.2921 | 0.1847 | 22.7043 | 80.6% |
 * | 1024 | 1.5372 | 10.9139 | 0.7722 | 21.7276 | 50.2% |
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
 * | 32 | 0.0088 | 1.8686 | 0.0077 | 2.1333 | 87.6% |
 * | 64 | 0.0116 | 5.6497 | 0.0082 | 8.0000 | 70.6% |
 * | 128 | 0.0186 | 14.1120 | 0.0104 | 25.2450 | 55.9% |
 * | 256 | 0.0696 | 15.0588 | 0.0349 | 30.0073 | 50.2% |
 * | 512 | 0.1707 | 24.5660 | 0.1538 | 27.2783 | 90.1% |
 * | 1024 | 1.1319 | 14.8219 | 0.7722 | 21.7276 | 68.2% |
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
 * | 32 | 0.0095 | 1.7239 | 0.0073 | 2.2456 | 76.8% |
 * | 64 | 0.0119 | 5.4906 | 0.0082 | 8.0000 | 68.6% |
 * | 128 | 0.0189 | 13.8847 | 0.0112 | 23.4057 | 59.3% |
 * | 256 | 0.0655 | 16.0000 | 0.0371 | 28.2605 | 56.6% |
 * | 512 | 0.2021 | 20.7540 | 0.1643 | 25.5327 | 81.3% |
 * | 1024 | 1.2963 | 12.9422 | 0.7968 | 21.0545 | 61.5% |
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
 * | 32 | 0.0088 | 1.8652 | 0.0067 | 2.4498 | 76.1% |
 * | 64 | 0.0116 | 5.6264 | 0.0077 | 8.4979 | 66.2% |
 * | 128 | 0.0186 | 14.1120 | 0.0101 | 26.0477 | 54.2% |
 * | 256 | 0.0698 | 15.0209 | 0.0343 | 30.5387 | 49.2% |
 * | 512 | 0.1721 | 24.3742 | 0.1488 | 28.1784 | 86.5% |
 * | 1024 | 1.1434 | 14.6728 | 0.7691 | 21.8149 | 67.3% |
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
 * | 32 | 0.0087 | 1.8789 | 0.0061 | 2.6667 | 70.5% |
 * | 64 | 0.0110 | 5.9622 | 0.0079 | 8.2915 | 71.9% |
 * | 128 | 0.0185 | 14.1608 | 0.0102 | 25.6000 | 55.3% |
 * | 256 | 0.0699 | 14.9968 | 0.0370 | 28.3338 | 52.9% |
 * | 512 | 0.1720 | 24.3810 | 0.1591 | 26.3594 | 92.5% |
 * | 1024 | 1.1376 | 14.7477 | 0.7731 | 21.7011 | 68.0% |
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
 * | 32 | 0.0089 | 1.8417 | 0.0065 | 2.5347 | 72.7% |
 * | 64 | 0.0115 | 5.7047 | 0.0082 | 8.0000 | 71.3% |
 * | 128 | 0.0185 | 14.1485 | 0.0128 | 20.4035 | 69.3% |
 * | 256 | 0.0696 | 15.0588 | 0.0364 | 28.8324 | 52.2% |
 * | 512 | 0.1718 | 24.4082 | 0.1647 | 25.4707 | 95.8% |
 * | 1024 | 1.1273 | 14.8823 | 0.7815 | 21.4683 | 69.3% |
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
 * | 32 | 0.0088 | 1.8517 | 0.0079 | 2.0813 | 89.0% |
 * | 64 | 0.0114 | 5.7367 | 0.0082 | 8.0000 | 71.7% |
 * | 128 | 0.0184 | 14.2222 | 0.0104 | 25.3230 | 56.2% |
 * | 256 | 0.0696 | 15.0588 | 0.0351 | 29.8842 | 50.4% |
 * | 512 | 0.1716 | 24.4355 | 0.1562 | 26.8508 | 91.0% |
 * | 1024 | 1.1278 | 14.8766 | 0.7747 | 21.6558 | 68.7% |
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
 * | 32 | 0.0089 | 1.8484 | 0.0090 | 1.8221 | 101.4% |
 * | 64 | 0.0116 | 5.6575 | 0.0100 | 6.5746 | 86.1% |
 * | 128 | 0.0191 | 13.7334 | 0.0102 | 25.6401 | 53.6% |
 * | 256 | 0.0706 | 14.8574 | 0.0287 | 36.5714 | 40.6% |
 * | 512 | 0.1902 | 22.0567 | 0.1596 | 26.2748 | 83.9% |
 * | 1024 | 1.2882 | 13.0237 | 0.7696 | 21.7995 | 59.7% |
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
 * | 32 | 0.0089 | 1.8384 | 0.0068 | 2.4208 | 75.9% |
 * | 64 | 0.0109 | 6.0147 | 0.0075 | 8.7897 | 68.4% |
 * | 128 | 0.0195 | 13.4185 | 0.0100 | 26.3408 | 50.9% |
 * | 256 | 0.0716 | 14.6351 | 0.0269 | 38.9863 | 37.5% |
 * | 512 | 0.2110 | 19.8790 | 0.1447 | 28.9918 | 68.6% |
 * | 1024 | 1.5299 | 10.9665 | 0.7639 | 21.9625 | 49.9% |
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
 * | 32 | 0.0087 | 1.8824 | 0.0070 | 2.3486 | 80.1% |
 * | 64 | 0.0120 | 5.4613 | 0.0078 | 8.3934 | 65.1% |
 * | 128 | 0.0197 | 13.3203 | 0.0116 | 22.5986 | 58.9% |
 * | 256 | 0.0696 | 15.0692 | 0.0285 | 36.7973 | 41.0% |
 * | 512 | 0.1841 | 22.7793 | 0.1518 | 27.6261 | 82.5% |
 * | 1024 | 1.2446 | 13.4801 | 0.7700 | 21.7872 | 61.9% |
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
 * | 32 | 0.0089 | 1.8484 | 0.0068 | 2.4265 | 76.2% |
 * | 64 | 0.0114 | 5.7367 | 0.0078 | 8.4280 | 68.1% |
 * | 128 | 0.0188 | 13.9201 | 0.0122 | 21.5013 | 64.7% |
 * | 256 | 0.0698 | 15.0277 | 0.0270 | 38.8017 | 38.7% |
 * | 512 | 0.1864 | 22.5055 | 0.1514 | 27.7020 | 81.2% |
 * | 1024 | 1.2702 | 13.2081 | 0.7699 | 21.7913 | 60.6% |
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
 * | 32 | 0.0088 | 1.8517 | 0.0096 | 1.7038 | 108.7% |
 * | 64 | 0.0118 | 5.5652 | 0.0082 | 7.9534 | 70.0% |
 * | 128 | 0.0192 | 13.6420 | 0.0121 | 21.5863 | 63.2% |
 * | 256 | 0.0706 | 14.8439 | 0.0265 | 39.5271 | 37.6% |
 * | 512 | 0.2058 | 20.3844 | 0.1468 | 28.5778 | 71.3% |
 * | 1024 | 1.4122 | 11.8799 | 0.7639 | 21.9625 | 54.1% |
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
 * | 32 | 0.0095 | 1.7181 | 0.0089 | 1.8450 | 93.1% |
 * | 64 | 0.0123 | 5.3195 | 0.0083 | 7.8618 | 67.7% |
 * | 128 | 0.0205 | 12.7601 | 0.0123 | 21.3890 | 59.7% |
 * | 256 | 0.0763 | 13.7421 | 0.0287 | 36.5714 | 37.6% |
 * | 512 | 0.2063 | 20.3275 | 0.1631 | 25.7130 | 79.1% |
 * | 1024 | 1.4701 | 11.4126 | 0.7682 | 21.8390 | 52.3% |
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
 * | 64 | 0.0123 | 5.3473 | 0.0079 | 8.3083 | 64.4% |
 * | 128 | 0.0195 | 13.4516 | 0.0116 | 22.6925 | 59.3% |
 * | 256 | 0.0704 | 14.8878 | 0.0399 | 26.2775 | 56.7% |
 * | 512 | 0.1727 | 24.2906 | 0.1659 | 25.2840 | 96.1% |
 * | 1024 | 1.1614 | 14.4456 | 0.7810 | 21.4811 | 67.2% |
 * | 2048 | 9.7422 | 6.8885 | 7.7346 | 8.6765 | 79.4% |
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
 * | 64 | 0.0113 | 5.7935 | 0.0040 | 16.4498 | 35.2% |
 * | 128 | 0.0185 | 14.1853 | 0.0032 | 81.5124 | 17.4% |
 * | 256 | 0.0696 | 15.0588 | 0.0037 | 284.9391 | 5.3% |
 * | 512 | 0.1717 | 24.4264 | 0.0082 | 512.0000 | 4.8% |
 * | 1024 | 1.1357 | 14.7724 | 0.0249 | 673.8920 | 2.2% |
 * | 2048 | 9.6645 | 6.9439 | 0.0924 | 726.4121 | 1.0% |
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
 * | 64 | 0.0126 | 5.1848 | 0.0076 | 8.5870 | 60.4% |
 * | 128 | 0.0197 | 13.3095 | 0.0103 | 25.5203 | 52.2% |
 * | 256 | 0.0704 | 14.8945 | 0.0363 | 28.9214 | 51.5% |
 * | 512 | 0.1725 | 24.3154 | 0.1585 | 26.4551 | 91.9% |
 * | 1024 | 1.1757 | 14.2694 | 0.8049 | 20.8448 | 68.5% |
 * | 2048 | 9.6668 | 6.9422 | 7.3627 | 9.1147 | 76.2% |
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
 * | 64 | 0.0127 | 5.1457 | 0.0082 | 8.0000 | 64.3% |
 * | 128 | 0.0200 | 13.1177 | 0.0106 | 24.7492 | 53.0% |
 * | 256 | 0.0706 | 14.8540 | 0.0339 | 30.9424 | 48.0% |
 * | 512 | 0.1727 | 24.2928 | 0.1516 | 27.6757 | 87.8% |
 * | 1024 | 1.1674 | 14.3717 | 0.7844 | 21.3882 | 67.2% |
 * | 2048 | 9.7573 | 6.8778 | 7.3914 | 9.0794 | 75.8% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0091 | 7.2240 | 73.8% |
 * | 128 | 0.0198 | 13.2342 | 0.0119 | 22.0809 | 59.9% |
 * | 256 | 0.0704 | 14.9047 | 0.0397 | 26.4365 | 56.4% |
 * | 512 | 0.1723 | 24.3402 | 0.1667 | 25.1626 | 96.7% |
 * | 1024 | 1.1680 | 14.3644 | 0.8499 | 19.7394 | 72.8% |
 * | 2048 | 9.7554 | 6.8791 | 7.4711 | 8.9825 | 76.6% |
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
 * | 64 | 0.0126 | 5.2046 | 0.0082 | 8.0000 | 65.1% |
 * | 128 | 0.0199 | 13.2023 | 0.0120 | 21.8453 | 60.4% |
 * | 256 | 0.0707 | 14.8372 | 0.0418 | 25.0904 | 59.1% |
 * | 512 | 0.1722 | 24.3560 | 0.1676 | 25.0233 | 97.3% |
 * | 1024 | 1.1762 | 14.2640 | 0.7881 | 21.2892 | 67.0% |
 * | 2048 | 9.7557 | 6.8790 | 7.3085 | 9.1823 | 74.9% |
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
 * | 64 | 0.0114 | 5.7609 | 0.0082 | 7.9689 | 72.3% |
 * | 128 | 0.0187 | 14.0394 | 0.0105 | 24.9756 | 56.2% |
 * | 256 | 0.0696 | 15.0588 | 0.0349 | 30.0348 | 50.1% |
 * | 512 | 0.1705 | 24.6006 | 0.1542 | 27.1934 | 90.5% |
 * | 1024 | 1.1315 | 14.8271 | 0.7908 | 21.2151 | 69.9% |
 * | 2048 | 9.6724 | 6.9382 | 7.5027 | 8.9446 | 77.6% |
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
 * | 64 | 0.0128 | 5.1328 | 0.0092 | 7.0988 | 72.3% |
 * | 128 | 0.0212 | 12.3840 | 0.0122 | 21.5296 | 57.5% |
 * | 256 | 0.0700 | 14.9694 | 0.0430 | 24.3810 | 61.4% |
 * | 512 | 0.1722 | 24.3538 | 0.1700 | 24.6747 | 98.7% |
 * | 1024 | 1.1835 | 14.1765 | 0.8043 | 20.8593 | 68.0% |
 * | 2048 | 9.7527 | 6.8811 | 7.5445 | 8.8951 | 77.4% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0094 | 6.9779 | 76.4% |
 * | 128 | 0.0191 | 13.7219 | 0.0123 | 21.3890 | 64.2% |
 * | 256 | 0.0715 | 14.6580 | 0.0436 | 24.0323 | 61.0% |
 * | 512 | 0.1721 | 24.3674 | 0.1693 | 24.7773 | 98.3% |
 * | 1024 | 1.1765 | 14.2601 | 0.8493 | 19.7546 | 72.2% |
 * | 2048 | 9.6698 | 6.9401 | 7.2970 | 9.1968 | 75.5% |
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
 * | 128 | 0.0194 | 13.5070 |
 * | 256 | 0.0716 | 14.6515 |
 * | 512 | 0.1724 | 24.3244 |
 * | 1024 | 1.1837 | 14.1730 |
 * | 2048 | 9.6700 | 6.9399 |
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
 * | 64 | 0.0115 | 5.7207 |
 * | 128 | 0.0188 | 13.9795 |
 * | 256 | 0.0697 | 15.0450 |
 * | 512 | 0.1712 | 24.4994 |
 * | 1024 | 1.1501 | 14.5871 |
 * | 2048 | 9.6660 | 6.9428 |
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
 * | 64 | 0.0136 | 4.8188 | 0.0080 | 8.2084 | 58.7% |
 * | 128 | 0.0243 | 10.8003 | 0.0104 | 25.2062 | 42.8% |
 * | 256 | 0.0889 | 11.7998 | 0.0348 | 30.1176 | 39.2% |
 * | 512 | 0.2172 | 19.3136 | 0.1540 | 27.2273 | 70.9% |
 * | 1024 | 1.4515 | 11.5583 | 0.7756 | 21.6304 | 53.4% |
 * | 2048 | 9.7579 | 6.8774 | 6.8297 | 9.8260 | 70.0% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0089 | 7.3802 | 72.3% |
 * | 128 | 0.0193 | 13.5629 | 0.0105 | 24.8619 | 54.6% |
 * | 256 | 0.0709 | 14.7837 | 0.0377 | 27.7813 | 53.2% |
 * | 512 | 0.1755 | 23.9008 | 0.1644 | 25.5128 | 93.7% |
 * | 1024 | 1.1612 | 14.4480 | 0.7815 | 21.4683 | 67.3% |
 * | 2048 | 9.7606 | 6.8755 | 9.4662 | 7.0893 | 97.0% |
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
 * | 64 | 0.0125 | 5.2379 | 0.0088 | 7.4473 | 70.3% |
 * | 128 | 0.0200 | 13.1282 | 0.0107 | 24.5269 | 53.5% |
 * | 256 | 0.0705 | 14.8709 | 0.0370 | 28.3583 | 52.4% |
 * | 512 | 0.1742 | 24.0808 | 0.1618 | 25.9215 | 92.9% |
 * | 1024 | 1.1768 | 14.2566 | 0.7808 | 21.4877 | 66.3% |
 * | 2048 | 9.7240 | 6.9014 | 9.0129 | 7.4459 | 92.7% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0082 | 8.0000 | 66.7% |
 * | 128 | 0.0192 | 13.6306 | 0.0108 | 24.1652 | 56.4% |
 * | 256 | 0.0708 | 14.8070 | 0.0393 | 26.6623 | 55.5% |
 * | 512 | 0.1745 | 24.0389 | 0.1601 | 26.1961 | 91.8% |
 * | 1024 | 1.1880 | 14.1226 | 0.8498 | 19.7435 | 71.5% |
 * | 2048 | 9.7605 | 6.8755 | 8.9928 | 7.4625 | 92.1% |
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
 * | 64 | 0.0127 | 5.1457 | 0.0078 | 8.4280 | 61.1% |
 * | 128 | 0.0189 | 13.8495 | 0.0105 | 24.9756 | 55.5% |
 * | 256 | 0.0704 | 14.8878 | 0.0387 | 27.0810 | 55.0% |
 * | 512 | 0.1734 | 24.1875 | 0.1639 | 25.5950 | 94.5% |
 * | 1024 | 1.1777 | 14.2458 | 0.8497 | 19.7438 | 72.2% |
 * | 2048 | 9.7561 | 6.8787 | 9.0177 | 7.4419 | 92.4% |
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
 * | 64 | 0.0124 | 5.2716 | 0.0076 | 8.6232 | 61.1% |
 * | 128 | 0.0196 | 13.3638 | 0.0105 | 25.0520 | 53.3% |
 * | 256 | 0.0704 | 14.8844 | 0.0386 | 27.1821 | 54.8% |
 * | 512 | 0.1751 | 23.9576 | 0.1633 | 25.6903 | 93.3% |
 * | 1024 | 1.1719 | 14.3164 | 0.8336 | 20.1258 | 71.1% |
 * | 2048 | 9.7616 | 6.8748 | 9.5036 | 7.0614 | 97.4% |
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
 * | 64 | 0.0124 | 5.2988 | 0.0076 | 8.5870 | 61.7% |
 * | 128 | 0.0190 | 13.7796 | 0.0107 | 24.4173 | 56.4% |
 * | 256 | 0.0703 | 14.9149 | 0.0401 | 26.1308 | 57.1% |
 * | 512 | 0.1733 | 24.1964 | 0.1669 | 25.1264 | 96.3% |
 * | 1024 | 1.1840 | 14.1701 | 0.7840 | 21.3991 | 66.2% |
 * | 2048 | 9.6779 | 6.9342 | 9.0132 | 7.4457 | 93.1% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0073 | 8.9628 | 59.5% |
 * | 128 | 0.0192 | 13.6193 | 0.0109 | 24.0587 | 56.6% |
 * | 256 | 0.0699 | 15.0002 | 0.0402 | 26.0996 | 57.5% |
 * | 512 | 0.1736 | 24.1563 | 0.1668 | 25.1433 | 96.1% |
 * | 1024 | 1.1763 | 14.2625 | 0.7854 | 21.3620 | 66.8% |
 * | 2048 | 9.7572 | 6.8779 | 9.3659 | 7.1652 | 96.0% |
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
