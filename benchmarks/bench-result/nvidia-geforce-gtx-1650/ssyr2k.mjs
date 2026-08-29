/**
 * Benchmark results for ssyr2k on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0129 | 0.9517 | 0.0174 | 0.7078 | 134.5% |
 * | 64 | 0.0179 | 2.7527 | 0.0225 | 2.1818 | 126.2% |
 * | 128 | 0.0326 | 6.0235 | 0.0343 | 5.7287 | 105.1% |
 * | 256 | 0.1262 | 6.2328 | 0.0647 | 12.1633 | 51.2% |
 * | 512 | 0.4749 | 6.6240 | 0.1802 | 17.4545 | 38.0% |
 * | 1024 | 3.4965 | 3.5987 | 1.0240 | 12.2878 | 29.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyr2k-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-default.svg)
 *
 * ![ssyr2k-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/ssyr2k.js) — WebGPU benchmark script
 * - [ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/ssyr2k.c) — CUDA / cuBLAS reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `trans = "no-transpose"`. `trans = "transpose"` reads A with a cross-thread `lda`-strided mirror pattern instead of a coalesced one, and the gap grows with `n` — collapsed below by default, expand a `trans` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 256 | 0.2006 | 3.9206 | 0.0585 | 13.4369 | 29.2% |
 * | 512 | 0.6698 | 4.6964 | 0.1736 | 18.1206 | 25.9% |
 * | 1024 | 4.9020 | 2.5669 | 0.9633 | 13.0626 | 19.7% |
 * | 2048 | 37.2470 | 1.3513 | 7.3351 | 6.8617 | 19.7% |
 *
 * ![ssyr2k-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-transno-transpose.svg)
 *
 * ![ssyr2k-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 256 | 0.1269 | 6.1975 | 0.0608 | 12.9381 | 47.9% |
 * | 512 | 0.4706 | 6.6844 | 0.1855 | 16.9563 | 39.4% |
 * | 1024 | 3.4704 | 3.6258 | 1.1122 | 11.3131 | 32.0% |
 * | 2048 | 24.5107 | 2.0535 | 7.7981 | 6.4544 | 31.8% |
 *
 * ![ssyr2k-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-transtranspose.svg)
 *
 * ![ssyr2k-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/trans.ssyr2k.js) — WebGPU trans-sweep benchmark script
 * - [trans.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/trans.ssyr2k.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * ## Uplo sweep
 *
 * Unless noted otherwise, every result above uses `uplo = "lower"`. Real workgroups dispatch in increasing index order, so `uplo = "upper"` front-loads the heaviest rows first (worse — long-running heavy workgroups have nothing to overlap with) while `lower` back-loads them (better — light rows clear fast, the heavy tail gets full GPU to itself) — collapsed below by default, expand a `uplo` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = lower</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0190 | 3.4536 | 0.0225 | 2.9091 | 118.7% |
 * | 128 | 0.0410 | 6.4000 | 0.0343 | 7.6418 | 83.7% |
 * | 256 | 0.2007 | 5.2253 | 0.0573 | 18.2857 | 28.6% |
 * | 512 | 0.6711 | 6.2499 | 0.1744 | 24.0521 | 26.0% |
 * | 1024 | 4.8939 | 3.4282 | 1.0601 | 15.8254 | 21.7% |
 * | 2048 | 38.3192 | 1.7513 | 7.3260 | 9.1603 | 19.1% |
 *
 * ![ssyr2k-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-uplolower.svg)
 *
 * ![ssyr2k-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0199 | 3.2953 | 0.0217 | 3.0162 | 109.3% |
 * | 128 | 0.0414 | 6.3357 | 0.0328 | 8.0039 | 79.2% |
 * | 256 | 0.2017 | 5.1984 | 0.0548 | 19.1402 | 27.2% |
 * | 512 | 0.6697 | 6.2630 | 0.1774 | 23.6400 | 26.5% |
 * | 1024 | 4.8891 | 3.4316 | 0.9723 | 17.2554 | 19.9% |
 * | 2048 | 38.3288 | 1.7509 | 6.8123 | 9.8511 | 17.8% |
 *
 * ![ssyr2k-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-uploupper.svg)
 *
 * ![ssyr2k-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/uplo.ssyr2k.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/uplo.ssyr2k.c) — CUDA / cuBLAS uplo-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride only matters for `trans = "transpose"` here (swept at both `trans` values below so that's visible in the data, not just claimed). Collapsed below by default — expand a `trans` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.6717 | 4.6831 | 0.1658 | 18.9776 | 24.7% |
 * | 1024 | 4.8908 | 2.5728 | 0.9213 | 13.6578 | 18.8% |
 * | 2048 | 37.2446 | 1.3514 | 7.4445 | 6.7609 | 20.0% |
 *
 * ![ssyr2k-lda-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-no-transpose-pad0.svg)
 *
 * ![ssyr2k-lda-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4759 | 6.6107 | 0.1824 | 17.2509 | 38.3% |
 * | 1024 | 3.7158 | 3.3863 | 0.9347 | 13.4619 | 25.2% |
 * | 2048 | 35.4714 | 1.4189 | 9.3793 | 5.3663 | 26.4% |
 *
 * ![ssyr2k-lda-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-no-transpose-pad1.svg)
 *
 * ![ssyr2k-lda-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4363 | 7.2094 | 0.1860 | 16.9082 | 42.6% |
 * | 1024 | 3.3624 | 3.7423 | 0.9337 | 13.4762 | 27.8% |
 * | 2048 | 28.1557 | 1.7876 | 8.8720 | 5.6731 | 31.5% |
 *
 * ![ssyr2k-lda-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-no-transpose-pad8.svg)
 *
 * ![ssyr2k-lda-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4992 | 6.3009 | 0.1823 | 17.2584 | 36.5% |
 * | 1024 | 3.7856 | 3.3239 | 0.9334 | 13.4813 | 24.7% |
 * | 2048 | 30.8905 | 1.6294 | 7.0129 | 7.1770 | 22.7% |
 *
 * ![ssyr2k-lda-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-no-transpose-pad16.svg)
 *
 * ![ssyr2k-lda-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.6684 | 4.7062 | 0.1766 | 17.8168 | 26.4% |
 * | 1024 | 4.9462 | 2.5440 | 0.9318 | 13.5042 | 18.8% |
 * | 2048 | 38.3662 | 1.3119 | 7.4874 | 6.7221 | 19.5% |
 *
 * ![ssyr2k-lda-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-no-transpose-pad32.svg)
 *
 * ![ssyr2k-lda-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.6694 | 4.6990 | 0.1842 | 17.0741 | 27.5% |
 * | 1024 | 5.0097 | 2.5117 | 0.9317 | 13.5056 | 18.6% |
 * | 2048 | 38.8810 | 1.2945 | 8.5564 | 5.8823 | 22.0% |
 *
 * ![ssyr2k-lda-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-no-transpose-pad64.svg)
 *
 * ![ssyr2k-lda-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-no-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4708 | 6.6819 | 0.1929 | 16.3038 | 41.0% |
 * | 1024 | 3.4735 | 3.6225 | 1.0241 | 12.2872 | 29.5% |
 * | 2048 | 24.4871 | 2.0554 | 7.9578 | 6.3248 | 32.5% |
 *
 * ![ssyr2k-lda-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-transpose-pad0.svg)
 *
 * ![ssyr2k-lda-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4655 | 6.7572 | 0.2113 | 14.8844 | 45.4% |
 * | 1024 | 3.4530 | 3.6440 | 1.0913 | 11.5299 | 31.6% |
 * | 2048 | 24.8015 | 2.0294 | 9.2959 | 5.4144 | 37.5% |
 *
 * ![ssyr2k-lda-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-transpose-pad1.svg)
 *
 * ![ssyr2k-lda-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4629 | 6.7953 | 0.1924 | 16.3459 | 41.6% |
 * | 1024 | 3.3874 | 3.7146 | 1.0326 | 12.1861 | 30.5% |
 * | 2048 | 24.1151 | 2.0871 | 7.4332 | 6.7712 | 30.8% |
 *
 * ![ssyr2k-lda-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-transpose-pad8.svg)
 *
 * ![ssyr2k-lda-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4704 | 6.6880 | 0.1987 | 15.8312 | 42.2% |
 * | 1024 | 3.4269 | 3.6718 | 1.0653 | 11.8115 | 31.1% |
 * | 2048 | 24.3482 | 2.0672 | 7.3529 | 6.8452 | 30.2% |
 *
 * ![ssyr2k-lda-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-transpose-pad16.svg)
 *
 * ![ssyr2k-lda-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4732 | 6.6473 | 0.2255 | 13.9508 | 47.6% |
 * | 1024 | 3.4984 | 3.5967 | 1.1139 | 11.2961 | 31.8% |
 * | 2048 | 24.8631 | 2.0244 | 7.9883 | 6.3007 | 32.1% |
 *
 * ![ssyr2k-lda-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-transpose-pad32.svg)
 *
 * ![ssyr2k-lda-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4749 | 6.6238 | 0.2051 | 15.3384 | 43.2% |
 * | 1024 | 3.5055 | 3.5895 | 1.0866 | 11.5805 | 31.0% |
 * | 2048 | 24.8644 | 2.0242 | 9.1679 | 5.4900 | 36.9% |
 *
 * ![ssyr2k-lda-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-lda-transpose-pad64.svg)
 *
 * ![ssyr2k-lda-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-lda-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/lda.ssyr2k.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/lda.ssyr2k.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * ## ldb sweep
 *
 * Padding on `B`, the operand the gemm kernels stream along their inner loop, so its stride is the one with most room to matter. Only for routines whose ldb sweep is a plain {pad, n} one — `sgemm`'s is a combined transB x pad grid and has its own section.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0189 | 3.4595 | 0.0194 | 3.3740 | 102.5% |
 * | 128 | 0.0405 | 6.4708 | 0.0291 | 9.0071 | 71.8% |
 * | 256 | 0.2007 | 5.2245 | 0.0491 | 21.3611 | 24.5% |
 * | 512 | 0.6712 | 6.2493 | 0.1659 | 25.2840 | 24.7% |
 * | 1024 | 4.8925 | 3.4292 | 0.9297 | 18.0450 | 19.0% |
 * | 2048 | 38.3161 | 1.7515 | 7.2664 | 9.2354 | 19.0% |
 *
 * ![ssyr2k-ldbpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad0.svg)
 *
 * ![ssyr2k-ldbpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0185 | 3.5494 | 0.0225 | 2.9132 | 121.8% |
 * | 128 | 0.0387 | 6.7702 | 0.0325 | 8.0670 | 83.9% |
 * | 256 | 0.1700 | 6.1687 | 0.0594 | 17.6504 | 34.9% |
 * | 512 | 0.5666 | 7.4025 | 0.1752 | 23.9467 | 30.9% |
 * | 1024 | 4.3363 | 3.8691 | 1.0273 | 16.3312 | 23.7% |
 * | 2048 | 36.8625 | 1.8205 | 7.3295 | 9.1560 | 19.9% |
 *
 * ![ssyr2k-ldbpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad1.svg)
 *
 * ![ssyr2k-ldbpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0193 | 3.3935 | 0.0219 | 2.9942 | 113.3% |
 * | 128 | 0.0387 | 6.7675 | 0.0327 | 8.0078 | 84.5% |
 * | 256 | 0.1781 | 5.8866 | 0.0550 | 19.0789 | 30.9% |
 * | 512 | 0.5455 | 7.6891 | 0.1764 | 23.7708 | 32.3% |
 * | 1024 | 4.1652 | 4.0279 | 0.9640 | 17.4038 | 23.1% |
 * | 2048 | 33.7659 | 1.9875 | 7.3265 | 9.1597 | 21.7% |
 *
 * ![ssyr2k-ldbpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad8.svg)
 *
 * ![ssyr2k-ldbpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0198 | 3.3112 | 0.0218 | 3.0073 | 110.1% |
 * | 128 | 0.0399 | 6.5746 | 0.0325 | 8.0551 | 81.6% |
 * | 256 | 0.1891 | 5.5454 | 0.0549 | 19.0900 | 29.0% |
 * | 512 | 0.5887 | 7.1243 | 0.1758 | 23.8638 | 29.9% |
 * | 1024 | 4.3556 | 3.8518 | 0.9789 | 17.1389 | 22.5% |
 * | 2048 | 35.4580 | 1.8926 | 7.3296 | 9.1558 | 20.7% |
 *
 * ![ssyr2k-ldbpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad16.svg)
 *
 * ![ssyr2k-ldbpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0198 | 3.3032 | 0.0215 | 3.0476 | 108.4% |
 * | 128 | 0.0415 | 6.3112 | 0.0326 | 8.0353 | 78.5% |
 * | 256 | 0.2031 | 5.1640 | 0.0550 | 19.0789 | 27.1% |
 * | 512 | 0.6881 | 6.0958 | 0.1764 | 23.7772 | 25.6% |
 * | 1024 | 4.9404 | 3.3959 | 0.9641 | 17.4012 | 19.5% |
 * | 2048 | 39.2811 | 1.7084 | 7.3305 | 9.1547 | 18.7% |
 *
 * ![ssyr2k-ldbpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad32.svg)
 *
 * ![ssyr2k-ldbpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0193 | 3.3907 | 0.0215 | 3.0522 | 111.1% |
 * | 128 | 0.0394 | 6.6494 | 0.0324 | 8.0949 | 82.1% |
 * | 256 | 0.1883 | 5.5681 | 0.0536 | 19.5688 | 28.5% |
 * | 512 | 0.5919 | 7.0865 | 0.1761 | 23.8140 | 29.8% |
 * | 1024 | 4.4142 | 3.8007 | 1.0052 | 16.6896 | 22.8% |
 * | 2048 | 36.1552 | 1.8561 | 6.8130 | 9.8501 | 18.8% |
 *
 * ![ssyr2k-ldbpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad48.svg)
 *
 * ![ssyr2k-ldbpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0199 | 3.2953 | 0.0224 | 2.9299 | 112.5% |
 * | 128 | 0.0410 | 6.3975 | 0.0328 | 8.0000 | 80.0% |
 * | 256 | 0.2041 | 5.1385 | 0.0519 | 20.1898 | 25.5% |
 * | 512 | 0.6719 | 6.2427 | 0.1725 | 24.3154 | 25.7% |
 * | 1024 | 4.9493 | 3.3898 | 1.0231 | 16.3978 | 20.7% |
 * | 2048 | 39.5440 | 1.6971 | 7.3339 | 9.1505 | 18.5% |
 *
 * ![ssyr2k-ldbpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad64.svg)
 *
 * ![ssyr2k-ldbpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0200 | 3.2690 | 0.0220 | 2.9724 | 110.0% |
 * | 128 | 0.0416 | 6.2967 | 0.0327 | 8.0078 | 78.6% |
 * | 256 | 0.2032 | 5.1615 | 0.0551 | 19.0290 | 27.1% |
 * | 512 | 0.6738 | 6.2249 | 0.1760 | 23.8356 | 26.1% |
 * | 1024 | 4.9316 | 3.4020 | 1.0287 | 16.3091 | 20.9% |
 * | 2048 | 40.2467 | 1.6674 | 7.3335 | 9.1511 | 18.2% |
 *
 * ![ssyr2k-ldbpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldbpad128.svg)
 *
 * ![ssyr2k-ldbpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldbpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/ldb.ssyr2k.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/ldb.ssyr2k.c) — CUDA / cuBLAS ldb-sweep reference script
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
 * | 64 | 0.0193 | 3.3992 | 0.0220 | 2.9724 | 114.4% |
 * | 128 | 0.0410 | 6.3925 | 0.0324 | 8.0829 | 79.1% |
 * | 256 | 0.2026 | 5.1750 | 0.0574 | 18.2704 | 28.3% |
 * | 512 | 0.6712 | 6.2490 | 0.1718 | 24.4082 | 25.6% |
 * | 1024 | 4.8863 | 3.4336 | 0.9555 | 17.5579 | 19.6% |
 * | 2048 | 38.1156 | 1.7607 | 8.4547 | 7.9375 | 22.2% |
 *
 * ![ssyr2k-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-alphaneg3p75.svg)
 *
 * ![ssyr2k-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0189 | 3.4595 | 0.0216 | 3.0273 | 114.3% |
 * | 128 | 0.0410 | 6.4000 | 0.0328 | 8.0000 | 80.0% |
 * | 256 | 0.2002 | 5.2374 | 0.0550 | 19.0678 | 27.5% |
 * | 512 | 0.6693 | 6.2667 | 0.1726 | 24.3018 | 25.8% |
 * | 1024 | 4.8845 | 3.4348 | 0.9326 | 17.9905 | 19.1% |
 * | 2048 | 37.9658 | 1.7676 | 6.7494 | 9.9429 | 17.8% |
 *
 * ![ssyr2k-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-alpha0.svg)
 *
 * ![ssyr2k-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0192 | 3.4077 | 0.0225 | 2.9091 | 117.1% |
 * | 128 | 0.0410 | 6.4000 | 0.0325 | 8.0670 | 79.3% |
 * | 256 | 0.2024 | 5.1819 | 0.0544 | 19.2866 | 26.9% |
 * | 512 | 0.6708 | 6.2530 | 0.1719 | 24.3946 | 25.6% |
 * | 1024 | 4.8880 | 3.4323 | 1.0321 | 16.2550 | 21.1% |
 * | 2048 | 38.1034 | 1.7612 | 8.4561 | 7.9361 | 22.2% |
 *
 * ![ssyr2k-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-alpha1eneg38.svg)
 *
 * ![ssyr2k-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0192 | 3.4190 | 0.0224 | 2.9236 | 116.9% |
 * | 128 | 0.0410 | 6.4000 | 0.0336 | 7.8131 | 81.9% |
 * | 256 | 0.2007 | 5.2245 | 0.0558 | 18.7944 | 27.8% |
 * | 512 | 0.6713 | 6.2476 | 0.1761 | 23.8140 | 26.2% |
 * | 1024 | 4.8897 | 3.4312 | 0.9543 | 17.5806 | 19.5% |
 * | 2048 | 37.9896 | 1.7665 | 6.7505 | 9.9413 | 17.8% |
 *
 * ![ssyr2k-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-alpha1.svg)
 *
 * ![ssyr2k-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0194 | 3.3712 | 0.0219 | 2.9985 | 112.4% |
 * | 128 | 0.0410 | 6.3950 | 0.0329 | 7.9689 | 80.2% |
 * | 256 | 0.2009 | 5.2187 | 0.0545 | 19.2526 | 27.1% |
 * | 512 | 0.6713 | 6.2482 | 0.1744 | 24.0455 | 26.0% |
 * | 1024 | 4.8876 | 3.4326 | 0.9922 | 16.9087 | 20.3% |
 * | 2048 | 38.0694 | 1.7628 | 7.0676 | 9.4953 | 18.6% |
 *
 * ![ssyr2k-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-alpha2p5.svg)
 *
 * ![ssyr2k-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/alpha.ssyr2k.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/alpha.ssyr2k.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 64 | 0.0196 | 3.3491 | 0.0225 | 2.9091 | 115.1% |
 * | 128 | 0.0410 | 6.4000 | 0.0328 | 7.9961 | 80.0% |
 * | 256 | 0.2018 | 5.1959 | 0.0612 | 17.1470 | 30.3% |
 * | 512 | 0.6714 | 6.2467 | 0.1759 | 23.8486 | 26.2% |
 * | 1024 | 4.8977 | 3.4255 | 0.9970 | 16.8270 | 20.4% |
 * | 2048 | 38.3052 | 1.7519 | 9.2207 | 7.2781 | 24.1% |
 *
 * ![ssyr2k-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-betaneg3p75.svg)
 *
 * ![ssyr2k-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0190 | 3.4478 | 0.0193 | 3.3907 | 101.7% |
 * | 128 | 0.0405 | 6.4759 | 0.0290 | 9.0370 | 71.7% |
 * | 256 | 0.2004 | 5.2316 | 0.0488 | 21.4943 | 24.3% |
 * | 512 | 0.6716 | 6.2454 | 0.1661 | 25.2499 | 24.7% |
 * | 1024 | 4.8847 | 3.4347 | 0.9580 | 17.5128 | 19.6% |
 * | 2048 | 38.2271 | 1.7555 | 8.1515 | 8.2327 | 21.3% |
 *
 * ![ssyr2k-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-beta0.svg)
 *
 * ![ssyr2k-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0193 | 3.3992 | 0.0225 | 2.9091 | 116.8% |
 * | 128 | 0.0412 | 6.3701 | 0.0328 | 8.0000 | 79.6% |
 * | 256 | 0.2017 | 5.1980 | 0.0614 | 17.0667 | 30.5% |
 * | 512 | 0.6716 | 6.2451 | 0.1761 | 23.8140 | 26.2% |
 * | 1024 | 4.8992 | 3.4245 | 1.0297 | 16.2926 | 21.0% |
 * | 2048 | 38.2974 | 1.7523 | 9.2461 | 7.2580 | 24.1% |
 *
 * ![ssyr2k-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-beta1.svg)
 *
 * ![ssyr2k-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0196 | 3.3437 | 0.0226 | 2.9008 | 115.3% |
 * | 128 | 0.0410 | 6.3900 | 0.0328 | 7.9883 | 80.0% |
 * | 256 | 0.2028 | 5.1717 | 0.0581 | 18.0490 | 28.7% |
 * | 512 | 0.6714 | 6.2469 | 0.1721 | 24.3696 | 25.6% |
 * | 1024 | 4.8907 | 3.4304 | 0.9340 | 17.9628 | 19.1% |
 * | 2048 | 38.2638 | 1.7538 | 9.2378 | 7.2646 | 24.1% |
 *
 * ![ssyr2k-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-beta2p5.svg)
 *
 * ![ssyr2k-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/beta.ssyr2k.js) — WebGPU beta-sweep benchmark script
 * - [beta.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/beta.ssyr2k.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 64 | 0.0184 | 3.5586 |
 * | 128 | 0.0326 | 8.0393 |
 * | 256 | 0.1270 | 8.2581 |
 * | 512 | 0.4753 | 8.8249 |
 * | 1024 | 3.5254 | 4.7589 |
 * | 2048 | 26.3010 | 2.5516 |
 *
 * ![ssyr2k-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-layoutcolumnmajor.svg)
 *
 * ![ssyr2k-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0187 | 3.5099 |
 * | 128 | 0.0407 | 6.4479 |
 * | 256 | 0.2011 | 5.2153 |
 * | 512 | 0.6713 | 6.2478 |
 * | 1024 | 4.8923 | 3.4293 |
 * | 2048 | 38.2762 | 1.7533 |
 *
 * ![ssyr2k-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-layoutrowmajor.svg)
 *
 * ![ssyr2k-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/layout.ssyr2k.js) — WebGPU layout-sweep benchmark script
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
 * | 64 | 0.0193 | 3.3935 | 0.0228 | 2.8805 | 117.8% |
 * | 128 | 0.0414 | 6.3332 | 0.0348 | 7.5294 | 84.1% |
 * | 256 | 0.2038 | 5.1461 | 0.0597 | 17.5606 | 29.3% |
 * | 512 | 0.6799 | 6.1688 | 0.1724 | 24.3221 | 25.4% |
 * | 1024 | 4.9359 | 3.3990 | 1.0506 | 15.9695 | 21.3% |
 * | 2048 | 38.3172 | 1.7514 | 6.8127 | 9.8505 | 17.8% |
 *
 * ![ssyr2k-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad0.svg)
 *
 * ![ssyr2k-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0199 | 3.2900 | 0.0216 | 3.0408 | 108.2% |
 * | 128 | 0.0413 | 6.3479 | 0.0324 | 8.0909 | 78.5% |
 * | 256 | 0.2033 | 5.1583 | 0.0537 | 19.5338 | 26.4% |
 * | 512 | 0.6719 | 6.2426 | 0.1748 | 23.9927 | 26.0% |
 * | 1024 | 4.9070 | 3.4190 | 0.9628 | 17.4257 | 19.6% |
 * | 2048 | 38.3276 | 1.7509 | 7.3695 | 9.1063 | 19.2% |
 *
 * ![ssyr2k-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad1.svg)
 *
 * ![ssyr2k-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0192 | 3.4105 | 0.0225 | 2.9112 | 117.2% |
 * | 128 | 0.0410 | 6.4000 | 0.0335 | 7.8243 | 81.8% |
 * | 256 | 0.2024 | 5.1815 | 0.0581 | 18.0441 | 28.7% |
 * | 512 | 0.6718 | 6.2435 | 0.1737 | 24.1429 | 25.9% |
 * | 1024 | 4.8979 | 3.4254 | 1.0206 | 16.4382 | 20.8% |
 * | 2048 | 38.2671 | 1.7537 | 7.6809 | 8.7371 | 20.1% |
 *
 * ![ssyr2k-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad8.svg)
 *
 * ![ssyr2k-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0193 | 3.3935 | 0.0212 | 3.0890 | 109.9% |
 * | 128 | 0.0412 | 6.3602 | 0.0324 | 8.0909 | 78.6% |
 * | 256 | 0.2024 | 5.1811 | 0.0543 | 19.3208 | 26.8% |
 * | 512 | 0.6722 | 6.2399 | 0.1740 | 24.1030 | 25.9% |
 * | 1024 | 4.8959 | 3.4268 | 0.9347 | 17.9492 | 19.1% |
 * | 2048 | 38.3297 | 1.7508 | 7.6582 | 8.7631 | 20.0% |
 *
 * ![ssyr2k-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad16.svg)
 *
 * ![ssyr2k-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0195 | 3.3546 | 0.0214 | 3.0590 | 109.7% |
 * | 128 | 0.0410 | 6.4000 | 0.0327 | 8.0157 | 79.8% |
 * | 256 | 0.2027 | 5.1742 | 0.0549 | 19.0900 | 27.1% |
 * | 512 | 0.6717 | 6.2439 | 0.1765 | 23.7686 | 26.3% |
 * | 1024 | 4.8931 | 3.4287 | 1.0287 | 16.3096 | 21.0% |
 * | 2048 | 38.3675 | 1.7491 | 7.7291 | 8.6826 | 20.1% |
 *
 * ![ssyr2k-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad32.svg)
 *
 * ![ssyr2k-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0196 | 3.3409 | 0.0220 | 2.9746 | 112.3% |
 * | 128 | 0.0412 | 6.3652 | 0.0328 | 7.9883 | 79.7% |
 * | 256 | 0.2028 | 5.1717 | 0.0554 | 18.9246 | 27.3% |
 * | 512 | 0.6717 | 6.2439 | 0.1776 | 23.6144 | 26.4% |
 * | 1024 | 4.8988 | 3.4247 | 0.9444 | 17.7652 | 19.3% |
 * | 2048 | 38.3524 | 1.7498 | 7.7302 | 8.6814 | 20.2% |
 *
 * ![ssyr2k-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad48.svg)
 *
 * ![ssyr2k-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0195 | 3.3601 | 0.0219 | 2.9898 | 112.4% |
 * | 128 | 0.0411 | 6.3825 | 0.0328 | 8.0000 | 79.8% |
 * | 256 | 0.2028 | 5.1717 | 0.0593 | 17.6742 | 29.3% |
 * | 512 | 0.6716 | 6.2449 | 0.1796 | 23.3536 | 26.7% |
 * | 1024 | 4.8929 | 3.4289 | 0.9771 | 17.1701 | 20.0% |
 * | 2048 | 38.4956 | 1.7433 | 6.8783 | 9.7566 | 17.9% |
 *
 * ![ssyr2k-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad64.svg)
 *
 * ![ssyr2k-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0198 | 3.3086 | 0.0221 | 2.9617 | 111.7% |
 * | 128 | 0.0410 | 6.4000 | 0.0312 | 8.4021 | 76.2% |
 * | 256 | 0.2028 | 5.1717 | 0.0526 | 19.9319 | 25.9% |
 * | 512 | 0.6716 | 6.2452 | 0.1721 | 24.3651 | 25.6% |
 * | 1024 | 4.8951 | 3.4273 | 1.0402 | 16.1285 | 21.3% |
 * | 2048 | 38.3853 | 1.7483 | 12.0008 | 5.5920 | 31.3% |
 *
 * ![ssyr2k-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/gbps-ldcpad128.svg)
 *
 * ![ssyr2k-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2k/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.ssyr2k.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/wgblas/ldc.ssyr2k.js) — WebGPU ldc-sweep benchmark script
 * - [ldc.ssyr2k.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2k/cuda/ldc.ssyr2k.c) — CUDA / cuBLAS ldc-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2k
 */
