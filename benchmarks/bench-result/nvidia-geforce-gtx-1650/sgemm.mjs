/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 1.5375 | 0.0087 | 1.8789 | 81.8% |
 * | 64 | 0.0147 | 4.4716 | 0.0099 | 6.6386 | 67.4% |
 * | 128 | 0.0246 | 10.6667 | 0.0142 | 18.4090 | 57.9% |
 * | 256 | 0.0900 | 11.6467 | 0.0441 | 23.7621 | 49.0% |
 * | 512 | 0.2191 | 19.1402 | 0.1994 | 21.0338 | 91.0% |
 * | 1024 | 1.4541 | 11.5380 | 0.9948 | 16.8646 | 68.4% |
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
 * | 32 | 0.0112 | 1.4692 | 0.0430 | 0.3811 | 385.5% |
 * | 64 | 0.0149 | 4.3901 | 0.0435 | 1.5059 | 291.5% |
 * | 128 | 0.0244 | 10.7225 | 0.0440 | 5.9600 | 179.9% |
 * | 256 | 0.0901 | 11.6364 | 0.0749 | 13.9915 | 83.2% |
 * | 512 | 0.2191 | 19.1402 | 0.2434 | 17.2304 | 111.1% |
 * | 1024 | 1.4528 | 11.5478 | 2.9148 | 5.7558 | 200.6% |
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
 * | 32 | 0.0113 | 1.4525 | 0.0434 | 0.3773 | 385.0% |
 * | 64 | 0.0155 | 4.2314 | 0.0614 | 1.0672 | 396.5% |
 * | 128 | 0.0246 | 10.6667 | 0.0430 | 6.0952 | 175.0% |
 * | 256 | 0.0921 | 11.3896 | 0.0607 | 17.2645 | 66.0% |
 * | 512 | 0.2444 | 17.1650 | 0.7676 | 5.4644 | 314.1% |
 * | 1024 | 1.6707 | 10.0420 | 1.2782 | 13.1252 | 76.5% |
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
 * | 32 | 0.0117 | 1.3989 | 0.0430 | 0.3810 | 367.2% |
 * | 64 | 0.0152 | 4.3025 | 0.0427 | 1.5347 | 280.3% |
 * | 128 | 0.0259 | 10.1136 | 0.0431 | 6.0839 | 166.2% |
 * | 256 | 0.0935 | 11.2104 | 0.0791 | 13.2637 | 84.5% |
 * | 512 | 0.2647 | 15.8443 | 0.2886 | 14.5353 | 109.0% |
 * | 1024 | 1.7613 | 9.5252 | 1.3008 | 12.8975 | 73.9% |
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
 * | 32 | 0.0122 | 1.3421 | 0.0430 | 0.3810 | 352.2% |
 * | 64 | 0.0162 | 4.0434 | 0.0429 | 1.5266 | 264.9% |
 * | 128 | 0.0266 | 9.8462 | 0.0443 | 5.9212 | 166.3% |
 * | 256 | 0.0957 | 10.9592 | 0.0867 | 12.0960 | 90.6% |
 * | 512 | 0.2888 | 14.5248 | 0.2772 | 15.1310 | 96.0% |
 * | 1024 | 1.9464 | 8.6194 | 1.2144 | 13.8149 | 62.4% |
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
 * | 32 | 0.0108 | 1.5148 | 0.0119 | 1.3745 | 110.2% |
 * | 64 | 0.0147 | 4.4667 | 0.0101 | 6.4810 | 68.9% |
 * | 128 | 0.0246 | 10.6667 | 0.0125 | 21.0051 | 50.8% |
 * | 256 | 0.0897 | 11.6862 | 0.1761 | 5.9557 | 196.2% |
 * | 512 | 0.2191 | 19.1402 | 0.6885 | 6.0916 | 314.2% |
 * | 1024 | 1.4543 | 11.5361 | 3.1264 | 5.3663 | 215.0% |
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
 * | 32 | 0.0113 | 1.4443 | 0.0144 | 1.1403 | 126.7% |
 * | 64 | 0.0151 | 4.3482 | 0.0160 | 4.0837 | 106.5% |
 * | 128 | 0.0246 | 10.6667 | 0.0187 | 13.9915 | 76.2% |
 * | 256 | 0.0846 | 12.3980 | 0.0647 | 16.2178 | 76.4% |
 * | 512 | 0.2560 | 16.3840 | 0.8839 | 4.7452 | 345.3% |
 * | 1024 | 1.6324 | 10.2773 | 3.7113 | 4.5206 | 227.3% |
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
 * | 32 | 0.0109 | 1.5037 | 0.0133 | 1.2308 | 122.2% |
 * | 64 | 0.0147 | 4.4570 | 0.0127 | 5.1457 | 86.6% |
 * | 128 | 0.0246 | 10.6667 | 0.0190 | 13.7912 | 77.3% |
 * | 256 | 0.0901 | 11.6364 | 0.0543 | 19.3265 | 60.2% |
 * | 512 | 0.2212 | 18.9630 | 0.8376 | 5.0072 | 378.7% |
 * | 1024 | 1.4699 | 11.4137 | 3.7025 | 4.5313 | 251.9% |
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
 * | 32 | 0.0108 | 1.5193 | 0.0143 | 1.1429 | 132.9% |
 * | 64 | 0.0147 | 4.4716 | 0.0141 | 4.6598 | 96.0% |
 * | 128 | 0.0246 | 10.6736 | 0.0205 | 12.8000 | 83.4% |
 * | 256 | 0.0901 | 11.6364 | 0.0696 | 15.0554 | 77.3% |
 * | 512 | 0.2207 | 19.0014 | 0.8478 | 4.9471 | 384.1% |
 * | 1024 | 1.4650 | 11.4523 | 2.2724 | 7.3829 | 155.1% |
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
 * | 32 | 0.0112 | 1.4608 | 0.0147 | 1.1179 | 130.7% |
 * | 64 | 0.0151 | 4.3436 | 0.0159 | 4.1290 | 105.2% |
 * | 128 | 0.0244 | 10.7507 | 0.0240 | 10.9154 | 98.5% |
 * | 256 | 0.0901 | 11.6364 | 0.0594 | 17.6457 | 65.9% |
 * | 512 | 0.2195 | 19.1067 | 0.8878 | 4.7242 | 404.4% |
 * | 1024 | 1.4523 | 11.5525 | 3.3915 | 4.9468 | 233.5% |
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
 * | 32 | 0.0106 | 1.5492 | 0.0163 | 1.0049 | 154.2% |
 * | 64 | 0.0148 | 4.4377 | 0.0176 | 3.7135 | 119.5% |
 * | 128 | 0.0246 | 10.6667 | 0.0252 | 10.4158 | 102.4% |
 * | 256 | 0.0898 | 11.6820 | 0.0594 | 17.6647 | 66.1% |
 * | 512 | 0.2202 | 19.0512 | 0.8682 | 4.8313 | 394.3% |
 * | 1024 | 1.4524 | 11.5514 | 1.3128 | 12.7800 | 90.4% |
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
 * | 32 | 0.0108 | 1.5170 | 0.0244 | 0.6715 | 225.9% |
 * | 64 | 0.0150 | 4.3667 | 0.0250 | 2.6206 | 166.6% |
 * | 128 | 0.0246 | 10.6667 | 0.0276 | 9.5090 | 112.2% |
 * | 256 | 0.0916 | 11.4513 | 0.0454 | 23.0842 | 49.6% |
 * | 512 | 0.2442 | 17.1740 | 0.8212 | 5.1077 | 336.2% |
 * | 1024 | 1.6617 | 10.0962 | 1.2173 | 13.7827 | 73.3% |
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
 * | 32 | 0.0108 | 1.5193 | 0.0211 | 0.7781 | 195.3% |
 * | 64 | 0.0144 | 4.5511 | 0.0225 | 2.9153 | 156.1% |
 * | 128 | 0.0246 | 10.6667 | 0.0257 | 10.2081 | 104.5% |
 * | 256 | 0.0919 | 11.4115 | 0.0511 | 20.5185 | 55.6% |
 * | 512 | 0.2702 | 15.5234 | 0.8513 | 4.9267 | 315.1% |
 * | 1024 | 1.9209 | 8.7339 | 1.2324 | 13.6133 | 64.2% |
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
 * | 32 | 0.0110 | 1.4884 | 0.0431 | 0.3804 | 391.3% |
 * | 64 | 0.0154 | 4.2578 | 0.0430 | 1.5238 | 279.4% |
 * | 128 | 0.0251 | 10.4623 | 0.0428 | 6.1180 | 171.0% |
 * | 256 | 0.0889 | 11.7955 | 0.0512 | 20.4736 | 57.6% |
 * | 512 | 0.2357 | 17.7954 | 0.8131 | 5.1584 | 345.0% |
 * | 1024 | 1.5892 | 10.5567 | 1.2449 | 13.4763 | 78.3% |
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
 * | 32 | 0.0112 | 1.4608 | 0.0443 | 0.3699 | 394.9% |
 * | 64 | 0.0149 | 4.4090 | 0.0485 | 1.3509 | 326.4% |
 * | 128 | 0.0248 | 10.5840 | 0.0620 | 4.2281 | 250.3% |
 * | 256 | 0.0902 | 11.6281 | 0.0612 | 17.1381 | 67.8% |
 * | 512 | 0.2396 | 17.5043 | 0.8124 | 5.1628 | 339.0% |
 * | 1024 | 1.6158 | 10.3832 | 1.2273 | 13.6699 | 76.0% |
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
 * | 32 | 0.0113 | 1.4504 | 0.0437 | 0.3747 | 387.1% |
 * | 64 | 0.0148 | 4.4186 | 0.0426 | 1.5398 | 287.0% |
 * | 128 | 0.0248 | 10.5840 | 0.0434 | 6.0413 | 175.2% |
 * | 256 | 0.0913 | 11.4814 | 0.0611 | 17.1605 | 66.9% |
 * | 512 | 0.2445 | 17.1527 | 0.2306 | 18.1868 | 94.3% |
 * | 1024 | 1.6675 | 10.0616 | 1.2520 | 13.4007 | 75.1% |
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
 * | 32 | 0.0108 | 1.5148 | 0.0618 | 0.2651 | 571.4% |
 * | 64 | 0.0153 | 4.2845 | 0.0799 | 0.8200 | 522.5% |
 * | 128 | 0.0246 | 10.6390 | 0.0430 | 6.0952 | 174.5% |
 * | 256 | 0.0914 | 11.4774 | 0.0610 | 17.1965 | 66.7% |
 * | 512 | 0.2457 | 17.0678 | 0.7678 | 5.4629 | 312.4% |
 * | 1024 | 1.6812 | 9.9791 | 1.2484 | 13.4393 | 74.3% |
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
