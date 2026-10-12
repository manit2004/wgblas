/**
 * Benchmark results for dgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0552 | 0.5938 | 0.0857 | 0.3824 | 155.3% |
 * | 64 | 0.1007 | 1.3022 | 0.0851 | 1.5396 | 84.6% |
 * | 128 | 0.2545 | 2.0600 | 0.0614 | 8.5333 | 24.1% |
 * | 256 | 1.0471 | 2.0028 | 0.6201 | 3.3822 | 59.2% |
 * | 512 | 15.3109 | 0.5479 | 2.9649 | 2.8293 | 19.4% |
 * | 1024 | 113.5994 | 0.2954 | 23.5715 | 1.4235 | 20.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dgemm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-default.svg)
 *
 * ![dgemm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-default.svg)
 *
 * ## See also
 *
 * - [dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/dgemm.js) — WebGPU benchmark script
 * - [dgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/cuda/dgemm.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0546 | 0.6002 | 0.0836 | 0.3921 | 153.1% |
 * | 64 | 0.1010 | 1.2976 | 0.0830 | 1.5793 | 82.2% |
 * | 128 | 0.2560 | 2.0481 | 0.0590 | 8.8850 | 23.1% |
 * | 256 | 1.0507 | 1.9960 | 0.6197 | 3.3842 | 59.0% |
 * | 512 | 15.4019 | 0.5446 | 2.9694 | 2.8250 | 19.3% |
 * | 1024 | 113.9659 | 0.2944 | 23.5698 | 1.4236 | 20.7% |
 *
 * ![dgemm-trans-no-transpose-no-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-trans-no-transpose-no-transpose.svg)
 *
 * ![dgemm-trans-no-transpose-no-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-trans-no-transpose-no-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>transB = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0587 | 0.5579 | 0.0833 | 0.3935 | 141.8% |
 * | 64 | 0.1072 | 1.2231 | 0.0821 | 1.5969 | 76.6% |
 * | 128 | 0.2652 | 1.9772 | 0.0591 | 8.8730 | 22.3% |
 * | 256 | 1.0726 | 1.9552 | 0.6165 | 3.4018 | 57.5% |
 * | 512 | 15.5661 | 0.5389 | 3.5483 | 2.3641 | 22.8% |
 * | 1024 | 115.2181 | 0.2912 | 23.5736 | 1.4234 | 20.5% |
 *
 * ![dgemm-trans-no-transpose-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-trans-no-transpose-transpose.svg)
 *
 * ![dgemm-trans-no-transpose-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-trans-no-transpose-transpose.svg)
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
 * | 32 | 0.0614 | 0.5333 | 0.0831 | 0.3945 | 135.2% |
 * | 64 | 0.1080 | 1.2138 | 0.1565 | 0.8376 | 144.9% |
 * | 128 | 0.2640 | 1.9856 | 0.0588 | 8.9189 | 22.3% |
 * | 256 | 1.0547 | 1.9883 | 0.6170 | 3.3988 | 58.5% |
 * | 512 | 15.4231 | 0.5439 | 2.9614 | 2.8327 | 19.2% |
 * | 1024 | 113.5227 | 0.2956 | 23.5657 | 1.4239 | 20.8% |
 *
 * ![dgemm-trans-transpose-no-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-trans-transpose-no-transpose.svg)
 *
 * ![dgemm-trans-transpose-no-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-trans-transpose-no-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>transB = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0627 | 0.5228 | 0.0832 | 0.3938 | 132.8% |
 * | 64 | 0.1085 | 1.2075 | 0.1565 | 0.8375 | 144.2% |
 * | 128 | 0.2654 | 1.9753 | 0.0586 | 8.9408 | 22.1% |
 * | 256 | 1.0661 | 1.9672 | 0.6169 | 3.3997 | 57.9% |
 * | 512 | 15.5703 | 0.5388 | 2.9596 | 2.8344 | 19.0% |
 * | 1024 | 114.8028 | 0.2923 | 23.5700 | 1.4236 | 20.5% |
 *
 * ![dgemm-trans-transpose-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-trans-transpose-transpose.svg)
 *
 * ![dgemm-trans-transpose-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-trans-transpose-transpose.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/trans.dgemm.js) — WebGPU trans-sweep benchmark script
 * - [trans.dgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/cuda/trans.dgemm.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0549 | 0.5966 | 0.0836 | 0.3919 | 152.2% |
 * | 64 | 0.1013 | 1.2933 | 0.0828 | 1.5821 | 81.7% |
 * | 128 | 0.2557 | 2.0501 | 0.0592 | 8.8634 | 23.1% |
 * | 256 | 1.0476 | 2.0019 | 0.6172 | 3.3980 | 58.9% |
 * | 512 | 15.1490 | 0.5537 | 2.9634 | 2.8307 | 19.6% |
 * | 1024 | 112.7770 | 0.2975 | 23.5686 | 1.4237 | 20.9% |
 *
 * ![dgemm-ldb-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-no-transpose-pad0.svg)
 *
 * ![dgemm-ldb-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0549 | 0.5969 | 0.0832 | 0.3941 | 151.5% |
 * | 64 | 0.1017 | 1.2887 | 0.0824 | 1.5910 | 81.0% |
 * | 128 | 0.2560 | 2.0480 | 0.0594 | 8.8276 | 23.2% |
 * | 256 | 1.0458 | 2.0054 | 0.6171 | 3.3984 | 59.0% |
 * | 512 | 15.1893 | 0.5523 | 2.9634 | 2.8307 | 19.5% |
 * | 1024 | 113.1705 | 0.2965 | 23.5741 | 1.4234 | 20.8% |
 *
 * ![dgemm-ldb-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-no-transpose-pad1.svg)
 *
 * ![dgemm-ldb-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0549 | 0.5973 | 0.0831 | 0.3944 | 151.4% |
 * | 64 | 0.1019 | 1.2858 | 0.0822 | 1.5944 | 80.6% |
 * | 128 | 0.2567 | 2.0423 | 0.0588 | 8.9116 | 22.9% |
 * | 256 | 1.0514 | 1.9946 | 0.6168 | 3.4001 | 58.7% |
 * | 512 | 15.1357 | 0.5542 | 2.9619 | 2.8322 | 19.6% |
 * | 1024 | 112.8347 | 0.2974 | 23.5704 | 1.4236 | 20.9% |
 *
 * ![dgemm-ldb-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-no-transpose-pad8.svg)
 *
 * ![dgemm-ldb-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0553 | 0.5926 | 0.0832 | 0.3940 | 150.4% |
 * | 64 | 0.1020 | 1.2844 | 0.0822 | 1.5950 | 80.5% |
 * | 128 | 0.2558 | 2.0497 | 0.0592 | 8.8514 | 23.2% |
 * | 256 | 1.0527 | 1.9922 | 0.6168 | 3.4001 | 58.6% |
 * | 512 | 15.1341 | 0.5543 | 2.9617 | 2.8324 | 19.6% |
 * | 1024 | 112.8138 | 0.2974 | 23.5706 | 1.4236 | 20.9% |
 *
 * ![dgemm-ldb-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-no-transpose-pad16.svg)
 *
 * ![dgemm-ldb-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0551 | 0.5948 | 0.0832 | 0.3938 | 151.0% |
 * | 64 | 0.1016 | 1.2903 | 0.0822 | 1.5941 | 80.9% |
 * | 128 | 0.2560 | 2.0480 | 0.0583 | 8.9898 | 22.8% |
 * | 256 | 1.0508 | 1.9958 | 0.6168 | 3.3999 | 58.7% |
 * | 512 | 15.1424 | 0.5540 | 2.9614 | 2.8326 | 19.6% |
 * | 1024 | 112.7956 | 0.2975 | 23.5704 | 1.4236 | 20.9% |
 *
 * ![dgemm-ldb-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-no-transpose-pad32.svg)
 *
 * ![dgemm-ldb-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0553 | 0.5926 | 0.0830 | 0.3947 | 150.1% |
 * | 64 | 0.1020 | 1.2850 | 0.0821 | 1.5966 | 80.5% |
 * | 128 | 0.2563 | 2.0457 | 0.0591 | 8.8706 | 23.1% |
 * | 256 | 1.0505 | 1.9963 | 0.6172 | 3.3981 | 58.7% |
 * | 512 | 15.1278 | 0.5545 | 2.9618 | 2.8322 | 19.6% |
 * | 1024 | 112.8040 | 0.2975 | 23.5815 | 1.4229 | 20.9% |
 *
 * ![dgemm-ldb-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-no-transpose-pad64.svg)
 *
 * ![dgemm-ldb-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-no-transpose-pad64.svg)
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
 * | 32 | 0.0553 | 0.5929 | 0.0832 | 0.3938 | 150.6% |
 * | 64 | 0.1023 | 1.2816 | 0.0823 | 1.5935 | 80.4% |
 * | 128 | 0.2567 | 2.0428 | 0.0614 | 8.5356 | 23.9% |
 * | 256 | 1.0629 | 1.9730 | 0.6178 | 3.3943 | 58.1% |
 * | 512 | 15.2915 | 0.5486 | 3.5489 | 2.3637 | 23.2% |
 * | 1024 | 114.1608 | 0.2939 | 23.6056 | 1.4215 | 20.7% |
 *
 * ![dgemm-ldb-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-transpose-pad0.svg)
 *
 * ![dgemm-ldb-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0548 | 0.5981 | 0.0831 | 0.3941 | 151.8% |
 * | 64 | 0.1010 | 1.2974 | 0.0824 | 1.5901 | 81.6% |
 * | 128 | 0.2580 | 2.0317 | 0.0594 | 8.8205 | 23.0% |
 * | 256 | 1.0568 | 1.9845 | 0.6171 | 3.3986 | 58.4% |
 * | 512 | 15.4152 | 0.5442 | 3.5500 | 2.3630 | 23.0% |
 * | 1024 | 115.5599 | 0.2904 | 23.5721 | 1.4235 | 20.4% |
 *
 * ![dgemm-ldb-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-transpose-pad1.svg)
 *
 * ![dgemm-ldb-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0553 | 0.5926 | 0.0836 | 0.3920 | 151.2% |
 * | 64 | 0.1021 | 1.2834 | 0.0823 | 1.5925 | 80.6% |
 * | 128 | 0.2562 | 2.0462 | 0.0591 | 8.8778 | 23.0% |
 * | 256 | 1.0523 | 1.9929 | 0.6169 | 3.3996 | 58.6% |
 * | 512 | 15.3209 | 0.5475 | 3.5474 | 2.3647 | 23.2% |
 * | 1024 | 114.4830 | 0.2931 | 23.5967 | 1.4220 | 20.6% |
 *
 * ![dgemm-ldb-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-transpose-pad8.svg)
 *
 * ![dgemm-ldb-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0553 | 0.5926 | 0.0828 | 0.3957 | 149.8% |
 * | 64 | 0.1022 | 1.2820 | 0.0823 | 1.5932 | 80.5% |
 * | 128 | 0.2573 | 2.0378 | 0.0591 | 8.8778 | 23.0% |
 * | 256 | 1.0553 | 1.9872 | 0.6168 | 3.3998 | 58.5% |
 * | 512 | 15.3651 | 0.5460 | 3.5479 | 2.3644 | 23.1% |
 * | 1024 | 114.6508 | 0.2927 | 23.6020 | 1.4217 | 20.6% |
 *
 * ![dgemm-ldb-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-transpose-pad16.svg)
 *
 * ![dgemm-ldb-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0553 | 0.5926 | 0.0836 | 0.3922 | 151.1% |
 * | 64 | 0.1021 | 1.2838 | 0.0825 | 1.5888 | 80.8% |
 * | 128 | 0.2564 | 2.0447 | 0.0595 | 8.8110 | 23.2% |
 * | 256 | 1.0614 | 1.9758 | 0.6180 | 3.3934 | 58.2% |
 * | 512 | 15.4289 | 0.5437 | 3.5497 | 2.3632 | 23.0% |
 * | 1024 | 115.0810 | 0.2916 | 23.5996 | 1.4218 | 20.5% |
 *
 * ![dgemm-ldb-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-transpose-pad32.svg)
 *
 * ![dgemm-ldb-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0553 | 0.5926 | 0.0834 | 0.3929 | 150.8% |
 * | 64 | 0.1024 | 1.2800 | 0.0822 | 1.5938 | 80.3% |
 * | 128 | 0.2565 | 2.0442 | 0.0592 | 8.8562 | 23.1% |
 * | 256 | 1.0609 | 1.9767 | 0.6176 | 3.3957 | 58.2% |
 * | 512 | 15.3353 | 0.5470 | 3.5472 | 2.3648 | 23.1% |
 * | 1024 | 115.9228 | 0.2895 | 23.5769 | 1.4232 | 20.3% |
 *
 * ![dgemm-ldb-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldb-transpose-pad64.svg)
 *
 * ![dgemm-ldb-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldb-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/ldb.dgemm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.dgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/cuda/ldb.dgemm.c) — CUDA / cuBLAS ldb-sweep reference script
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
 * | 64 | 0.1036 | 1.2646 | 0.0820 | 1.5975 | 79.2% |
 * | 128 | 0.2580 | 2.0320 | 0.0590 | 8.8923 | 22.9% |
 * | 256 | 1.0527 | 1.9922 | 0.6168 | 3.4000 | 58.6% |
 * | 512 | 15.3333 | 0.5471 | 2.9604 | 2.8336 | 19.3% |
 * | 1024 | 113.5819 | 0.2954 | 23.5688 | 1.4237 | 20.8% |
 * | 2048 | 882.8411 | 0.1520 | 174.2774 | 0.7701 | 19.7% |
 *
 * ![dgemm-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-alphaneg3p75.svg)
 *
 * ![dgemm-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1298 | 1.0100 | 0.0032 | 40.7562 | 2.5% |
 * | 128 | 0.3298 | 1.5898 | 0.0037 | 140.0342 | 1.1% |
 * | 256 | 1.3435 | 1.5610 | 0.0049 | 426.9446 | 0.4% |
 * | 512 | 15.1698 | 0.5530 | 0.0142 | 591.7471 | 0.1% |
 * | 1024 | 113.0652 | 0.2968 | 0.0474 | 707.3025 | 0.0% |
 * | 2048 | 881.9988 | 0.1522 | 0.1816 | 738.9542 | 0.0% |
 *
 * ![dgemm-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-alpha0.svg)
 *
 * ![dgemm-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1031 | 1.2715 | 0.0823 | 1.5932 | 79.8% |
 * | 128 | 0.2580 | 2.0317 | 0.0626 | 8.3699 | 24.3% |
 * | 256 | 1.0520 | 1.9935 | 0.6243 | 3.3592 | 59.3% |
 * | 512 | 15.3458 | 0.5466 | 2.9612 | 2.8328 | 19.3% |
 * | 1024 | 113.6555 | 0.2952 | 23.5907 | 1.4224 | 20.8% |
 * | 2048 | 882.9612 | 0.1520 | 174.2588 | 0.7702 | 19.7% |
 *
 * ![dgemm-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-alpha1eneg38.svg)
 *
 * ![dgemm-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1024 | 1.2800 | 0.1047 | 1.2515 | 102.3% |
 * | 128 | 0.2577 | 2.0341 | 0.0738 | 7.1049 | 28.6% |
 * | 256 | 1.0510 | 1.9953 | 0.7905 | 2.6528 | 75.2% |
 * | 512 | 15.2398 | 0.5504 | 3.1283 | 2.6815 | 20.5% |
 * | 1024 | 113.3022 | 0.2961 | 23.5690 | 1.4237 | 20.8% |
 * | 2048 | 882.3008 | 0.1521 | 174.2489 | 0.7703 | 19.7% |
 *
 * ![dgemm-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-alpha1.svg)
 *
 * ![dgemm-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1041 | 1.2586 | 0.0822 | 1.5944 | 78.9% |
 * | 128 | 0.2581 | 2.0314 | 0.0587 | 8.9262 | 22.8% |
 * | 256 | 1.0536 | 1.9905 | 0.6169 | 3.3995 | 58.6% |
 * | 512 | 15.2955 | 0.5484 | 2.9620 | 2.8320 | 19.4% |
 * | 1024 | 113.4253 | 0.2958 | 23.5689 | 1.4237 | 20.8% |
 * | 2048 | 882.6503 | 0.1521 | 174.2494 | 0.7703 | 19.7% |
 *
 * ![dgemm-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-alpha2p5.svg)
 *
 * ![dgemm-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/alpha.dgemm.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/cuda/alpha.dgemm.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 64 | 0.1067 | 1.2286 | 0.0837 | 1.5666 | 78.4% |
 * | 128 | 0.2589 | 2.0251 | 0.0594 | 8.8276 | 22.9% |
 * | 256 | 1.0590 | 1.9803 | 0.6178 | 3.3947 | 58.3% |
 * | 512 | 15.3644 | 0.5460 | 2.9664 | 2.8279 | 19.3% |
 * | 1024 | 113.6978 | 0.2951 | 23.6080 | 1.4213 | 20.8% |
 * | 2048 | 883.0586 | 0.1520 | 174.3598 | 0.7698 | 19.7% |
 *
 * ![dgemm-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-betaneg3p75.svg)
 *
 * ![dgemm-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1015 | 1.2919 | 0.0822 | 1.5938 | 81.1% |
 * | 128 | 0.2560 | 2.0481 | 0.0591 | 8.8754 | 23.1% |
 * | 256 | 1.0481 | 2.0009 | 0.6171 | 3.3984 | 58.9% |
 * | 512 | 15.3390 | 0.5469 | 2.9763 | 2.8184 | 19.4% |
 * | 1024 | 113.7135 | 0.2951 | 23.6045 | 1.4215 | 20.8% |
 * | 2048 | 883.1712 | 0.1520 | 174.2822 | 0.7701 | 19.7% |
 *
 * ![dgemm-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-beta0.svg)
 *
 * ![dgemm-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1048 | 1.2505 | 0.0839 | 1.5628 | 80.0% |
 * | 128 | 0.2581 | 2.0312 | 0.0597 | 8.7873 | 23.1% |
 * | 256 | 1.0587 | 1.9808 | 0.6177 | 3.3951 | 58.3% |
 * | 512 | 15.3612 | 0.5461 | 2.9694 | 2.8250 | 19.3% |
 * | 1024 | 113.7051 | 0.2951 | 23.6258 | 1.4202 | 20.8% |
 * | 2048 | 883.0552 | 0.1520 | 174.3667 | 0.7697 | 19.7% |
 *
 * ![dgemm-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-beta1.svg)
 *
 * ![dgemm-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1055 | 1.2423 | 0.0860 | 1.5238 | 81.5% |
 * | 128 | 0.2580 | 2.0319 | 0.0598 | 8.7685 | 23.2% |
 * | 256 | 1.0527 | 1.9921 | 0.6175 | 3.3961 | 58.7% |
 * | 512 | 15.3493 | 0.5465 | 2.9693 | 2.8251 | 19.3% |
 * | 1024 | 113.7054 | 0.2951 | 23.5971 | 1.4220 | 20.8% |
 * | 2048 | 883.0816 | 0.1520 | 174.3646 | 0.7698 | 19.7% |
 *
 * ![dgemm-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-beta2p5.svg)
 *
 * ![dgemm-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/beta.dgemm.js) — WebGPU beta-sweep benchmark script
 * - [beta.dgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/cuda/beta.dgemm.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 64 | 0.1061 | 1.2349 |
 * | 128 | 0.2581 | 2.0315 |
 * | 256 | 1.0516 | 1.9942 |
 * | 512 | 15.3543 | 0.5463 |
 * | 1024 | 113.6509 | 0.2952 |
 * | 2048 | 883.4548 | 0.1519 |
 *
 * ![dgemm-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-layoutcolumnmajor.svg)
 *
 * ![dgemm-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1008 | 1.2999 |
 * | 128 | 0.2547 | 2.0587 |
 * | 256 | 1.0510 | 1.9954 |
 * | 512 | 15.3654 | 0.5459 |
 * | 1024 | 113.7152 | 0.2951 |
 * | 2048 | 883.1557 | 0.1520 |
 *
 * ![dgemm-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-layoutrowmajor.svg)
 *
 * ![dgemm-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/layout.dgemm.js) — WebGPU layout-sweep benchmark script
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
 * | 64 | 0.1011 | 1.2964 | 0.0840 | 1.5610 | 83.0% |
 * | 128 | 0.2544 | 2.0610 | 0.0594 | 8.8276 | 23.3% |
 * | 256 | 1.0506 | 1.9961 | 0.6184 | 3.3910 | 58.9% |
 * | 512 | 15.3753 | 0.5456 | 2.9633 | 2.8308 | 19.3% |
 * | 1024 | 113.8770 | 0.2947 | 23.5961 | 1.4220 | 20.7% |
 * | 2048 | 883.6862 | 0.1519 | 174.2783 | 0.7701 | 19.7% |
 *
 * ![dgemm-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad0.svg)
 *
 * ![dgemm-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1044 | 1.2553 | 0.0820 | 1.5978 | 78.6% |
 * | 128 | 0.2581 | 2.0316 | 0.0587 | 8.9335 | 22.7% |
 * | 256 | 1.0588 | 1.9807 | 0.6172 | 3.3979 | 58.3% |
 * | 512 | 15.4197 | 0.5440 | 2.9609 | 2.8331 | 19.2% |
 * | 1024 | 113.9275 | 0.2945 | 23.5940 | 1.4222 | 20.7% |
 * | 2048 | 883.7778 | 0.1519 | 174.2862 | 0.7701 | 19.7% |
 *
 * ![dgemm-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad1.svg)
 *
 * ![dgemm-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1049 | 1.2494 | 0.0824 | 1.5916 | 78.5% |
 * | 128 | 0.2580 | 2.0317 | 0.0589 | 8.8947 | 22.8% |
 * | 256 | 1.0530 | 1.9917 | 0.6175 | 3.3960 | 58.6% |
 * | 512 | 15.4245 | 0.5438 | 2.9663 | 2.8280 | 19.2% |
 * | 1024 | 113.8979 | 0.2946 | 23.6021 | 1.4217 | 20.7% |
 * | 2048 | 883.7031 | 0.1519 | 174.2830 | 0.7701 | 19.7% |
 *
 * ![dgemm-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad8.svg)
 *
 * ![dgemm-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1042 | 1.2574 | 0.0821 | 1.5959 | 78.8% |
 * | 128 | 0.2580 | 2.0317 | 0.0590 | 8.8826 | 22.9% |
 * | 256 | 1.0588 | 1.9807 | 0.6167 | 3.4004 | 58.2% |
 * | 512 | 15.4259 | 0.5438 | 2.9631 | 2.8310 | 19.2% |
 * | 1024 | 113.8138 | 0.2948 | 23.5754 | 1.4233 | 20.7% |
 * | 2048 | 883.6158 | 0.1519 | 174.2881 | 0.7701 | 19.7% |
 *
 * ![dgemm-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad16.svg)
 *
 * ![dgemm-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1070 | 1.2249 | 0.0820 | 1.5981 | 76.6% |
 * | 128 | 0.2601 | 2.0159 | 0.0585 | 8.9555 | 22.5% |
 * | 256 | 1.0512 | 1.9949 | 0.6167 | 3.4006 | 58.7% |
 * | 512 | 15.4278 | 0.5437 | 2.9613 | 2.8327 | 19.2% |
 * | 1024 | 113.9324 | 0.2945 | 23.5987 | 1.4219 | 20.7% |
 * | 2048 | 882.8010 | 0.1520 | 174.2872 | 0.7701 | 19.7% |
 *
 * ![dgemm-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad32.svg)
 *
 * ![dgemm-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1045 | 1.2539 | 0.0823 | 1.5935 | 78.7% |
 * | 128 | 0.2581 | 2.0311 | 0.0589 | 8.9043 | 22.8% |
 * | 256 | 1.0523 | 1.9929 | 0.6172 | 3.3978 | 58.7% |
 * | 512 | 15.4094 | 0.5444 | 2.9611 | 2.8329 | 19.2% |
 * | 1024 | 113.8948 | 0.2946 | 23.5723 | 1.4235 | 20.7% |
 * | 2048 | 883.1882 | 0.1520 | 174.2806 | 0.7701 | 19.7% |
 *
 * ![dgemm-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad48.svg)
 *
 * ![dgemm-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1061 | 1.2354 | 0.0821 | 1.5972 | 77.3% |
 * | 128 | 0.2600 | 2.0166 | 0.0586 | 8.9481 | 22.5% |
 * | 256 | 1.0589 | 1.9804 | 0.6167 | 3.4006 | 58.2% |
 * | 512 | 15.4024 | 0.5446 | 2.9625 | 2.8316 | 19.2% |
 * | 1024 | 113.8927 | 0.2946 | 23.5725 | 1.4235 | 20.7% |
 * | 2048 | 883.6305 | 0.1519 | 174.2647 | 0.7702 | 19.7% |
 *
 * ![dgemm-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad64.svg)
 *
 * ![dgemm-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.1065 | 1.2304 | 0.0821 | 1.5972 | 77.0% |
 * | 128 | 0.2601 | 2.0157 | 0.0590 | 8.8899 | 22.7% |
 * | 256 | 1.0513 | 1.9948 | 0.6165 | 3.4015 | 58.6% |
 * | 512 | 15.3956 | 0.5449 | 2.9599 | 2.8341 | 19.2% |
 * | 1024 | 113.8513 | 0.2947 | 23.5684 | 1.4237 | 20.7% |
 * | 2048 | 883.8677 | 0.1519 | 174.2535 | 0.7702 | 19.7% |
 *
 * ![dgemm-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/gbps-ldcpad128.svg)
 *
 * ![dgemm-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemm/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.dgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/wgblas/ldc.dgemm.js) — WebGPU ldc-sweep benchmark script
 * - [ldc.dgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemm/cuda/ldc.dgemm.c) — CUDA / cuBLAS ldc-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dgemm
 */
