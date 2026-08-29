/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 1.3333 | 0.0087 | 1.8789 | 71.0% |
 * | 64 | 0.0165 | 3.9806 | 0.0099 | 6.6386 | 60.0% |
 * | 128 | 0.0304 | 8.6368 | 0.0142 | 18.4090 | 46.9% |
 * | 256 | 0.1083 | 9.6804 | 0.0441 | 23.7621 | 40.7% |
 * | 512 | 0.4526 | 9.2670 | 0.1994 | 21.0338 | 44.1% |
 * | 1024 | 3.2092 | 5.2278 | 0.9948 | 16.8646 | 31.0% |
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
 * ## beta sweep
 *
 * `beta` scales the existing `y`/`C` before accumulation. Reference BLAS is permitted to skip reading that operand entirely when `beta` is 0, so unlike `alpha` this sweep has a mechanism to be non-flat — a step at 0 means the shortcut is taken, and its size is what it saves.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0124 | 5.2716 | 0.0089 | 7.3274 | 71.9% |
 * | 128 | 0.0194 | 13.4848 | 0.0120 | 21.8453 | 61.7% |
 * | 256 | 0.0705 | 14.8776 | 0.0430 | 24.3991 | 61.0% |
 * | 512 | 0.1725 | 24.3109 | 0.1679 | 24.9851 | 97.3% |
 * | 1024 | 1.1489 | 14.6025 | 0.7947 | 21.1113 | 69.2% |
 * | 2048 | 9.4864 | 7.0743 | 6.6468 | 10.0964 | 70.1% |
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
 * | 64 | 0.0151 | 4.3528 | 0.0081 | 8.1109 | 53.7% |
 * | 128 | 0.0246 | 10.6736 | 0.0106 | 24.8242 | 43.0% |
 * | 256 | 0.0900 | 11.6571 | 0.0351 | 29.8569 | 39.0% |
 * | 512 | 0.2191 | 19.1402 | 0.1550 | 27.0642 | 70.7% |
 * | 1024 | 1.4542 | 11.5371 | 0.7798 | 21.5141 | 53.6% |
 * | 2048 | 9.4904 | 7.0712 | 6.6350 | 10.1143 | 69.9% |
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
 * | 64 | 0.0125 | 5.2245 | 0.0094 | 6.9898 | 74.7% |
 * | 128 | 0.0192 | 13.6420 | 0.0119 | 21.9625 | 62.1% |
 * | 256 | 0.0708 | 14.8171 | 0.0429 | 24.4355 | 60.6% |
 * | 512 | 0.1720 | 24.3810 | 0.1721 | 24.3719 | 100.0% |
 * | 1024 | 1.1489 | 14.6025 | 0.7845 | 21.3864 | 68.3% |
 * | 2048 | 9.4871 | 7.0737 | 6.6505 | 10.0907 | 70.1% |
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
 * | 64 | 0.0125 | 5.2245 | 0.0089 | 7.3274 | 71.3% |
 * | 128 | 0.0196 | 13.4075 | 0.0120 | 21.7872 | 61.5% |
 * | 256 | 0.0712 | 14.7305 | 0.0430 | 24.4082 | 60.4% |
 * | 512 | 0.1722 | 24.3538 | 0.1679 | 24.9804 | 97.5% |
 * | 1024 | 1.1489 | 14.6025 | 0.7936 | 21.1402 | 69.1% |
 * | 2048 | 9.4924 | 7.0698 | 6.6477 | 10.0951 | 70.0% |
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
 * ## ldc sweep
 *
 * Padding on the output matrix. `C` is written rather than streamed, so this measures write coalescing rather than read bandwidth — the row byte-stride is `ldc*4`, and a pad that moves it off the 128-byte boundary is what would show up here.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0148 | 4.4281 | 0.0104 | 6.2726 | 70.6% |
 * | 128 | 0.0245 | 10.6875 | 0.0133 | 19.6687 | 54.3% |
 * | 256 | 0.0894 | 11.7259 | 0.0433 | 24.1920 | 48.5% |
 * | 512 | 0.2191 | 19.1402 | 0.1966 | 21.3333 | 89.7% |
 * | 1024 | 1.4380 | 11.6674 | 0.9854 | 17.0259 | 68.5% |
 * | 2048 | 9.4847 | 7.0755 | 6.6386 | 10.1089 | 70.0% |
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
 * | 64 | 0.0124 | 5.2784 | 0.0088 | 7.4745 | 70.6% |
 * | 128 | 0.0197 | 13.2771 | 0.0119 | 21.9919 | 60.4% |
 * | 256 | 0.0712 | 14.7338 | 0.0400 | 26.2354 | 56.2% |
 * | 512 | 0.1757 | 23.8660 | 0.1675 | 25.0400 | 95.3% |
 * | 1024 | 1.1525 | 14.5571 | 0.7837 | 21.4087 | 68.0% |
 * | 2048 | 9.4958 | 7.0672 | 6.6376 | 10.1104 | 69.9% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0096 | 6.8040 | 78.4% |
 * | 128 | 0.0193 | 13.6080 | 0.0120 | 21.7583 | 62.5% |
 * | 256 | 0.0709 | 14.7903 | 0.0389 | 26.9252 | 54.9% |
 * | 512 | 0.1742 | 24.0742 | 0.1652 | 25.3843 | 94.8% |
 * | 1024 | 1.1491 | 14.6009 | 0.7864 | 21.3355 | 68.4% |
 * | 2048 | 9.5027 | 7.0621 | 6.6406 | 10.1059 | 69.9% |
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
 * | 64 | 0.0124 | 5.2920 | 0.0091 | 7.2240 | 73.3% |
 * | 128 | 0.0197 | 13.2879 | 0.0120 | 21.8453 | 60.8% |
 * | 256 | 0.0701 | 14.9660 | 0.0401 | 26.1204 | 57.3% |
 * | 512 | 0.1745 | 24.0301 | 0.1672 | 25.0807 | 95.8% |
 * | 1024 | 1.1510 | 14.5765 | 0.7940 | 21.1287 | 69.0% |
 * | 2048 | 9.4859 | 7.0746 | 6.6353 | 10.1139 | 69.9% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0090 | 7.2753 | 73.3% |
 * | 128 | 0.0195 | 13.4295 | 0.0119 | 22.0809 | 60.8% |
 * | 256 | 0.0706 | 14.8608 | 0.0398 | 26.3514 | 56.4% |
 * | 512 | 0.1729 | 24.2524 | 0.1744 | 24.0433 | 100.9% |
 * | 1024 | 1.1501 | 14.5877 | 0.7852 | 21.3681 | 68.3% |
 * | 2048 | 9.4886 | 7.0726 | 6.6356 | 10.1135 | 69.9% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0093 | 7.0499 | 75.7% |
 * | 128 | 0.0196 | 13.3966 | 0.0118 | 22.2609 | 60.2% |
 * | 256 | 0.0706 | 14.8608 | 0.0399 | 26.2775 | 56.6% |
 * | 512 | 0.1749 | 23.9839 | 0.1731 | 24.2300 | 99.0% |
 * | 1024 | 1.1510 | 14.5759 | 0.7851 | 21.3699 | 68.2% |
 * | 2048 | 9.4925 | 7.0697 | 6.6336 | 10.1165 | 69.9% |
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
 * | 64 | 0.0120 | 5.4686 | 0.0091 | 7.1986 | 76.0% |
 * | 128 | 0.0188 | 13.9557 | 0.0117 | 22.3520 | 62.4% |
 * | 256 | 0.0701 | 14.9626 | 0.0398 | 26.3408 | 56.8% |
 * | 512 | 0.1721 | 24.3742 | 0.1685 | 24.8879 | 97.9% |
 * | 1024 | 1.1580 | 14.4881 | 0.7865 | 21.3316 | 67.9% |
 * | 2048 | 9.5745 | 7.0091 | 6.6352 | 10.1141 | 69.3% |
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
 * | 64 | 0.0123 | 5.3333 | 0.0089 | 7.3537 | 72.5% |
 * | 128 | 0.0198 | 13.2236 | 0.0119 | 22.0809 | 59.9% |
 * | 256 | 0.0705 | 14.8709 | 0.0398 | 26.3620 | 56.4% |
 * | 512 | 0.1734 | 24.1920 | 0.1680 | 24.9613 | 96.9% |
 * | 1024 | 1.1491 | 14.6001 | 0.7826 | 21.4371 | 68.1% |
 * | 2048 | 9.5673 | 7.0144 | 6.6373 | 10.1108 | 69.4% |
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
