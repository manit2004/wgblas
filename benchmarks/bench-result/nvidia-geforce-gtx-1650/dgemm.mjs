/**
 * Benchmark results for dgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0547 | 0.5992 | 0.0831 | 0.3945 | 151.9% |
 * | 64 | 0.1008 | 1.2997 | 0.0820 | 1.5975 | 81.4% |
 * | 128 | 0.2540 | 2.0640 | 0.0589 | 8.9068 | 23.2% |
 * | 256 | 1.0465 | 2.0039 | 0.6170 | 3.3987 | 59.0% |
 * | 512 | 15.2669 | 0.5495 | 2.9619 | 2.8322 | 19.4% |
 * | 1024 | 113.3273 | 0.2961 | 23.5666 | 1.4238 | 20.8% |
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
 * | 32 | 0.0541 | 0.6061 | 0.0827 | 0.3962 | 153.0% |
 * | 64 | 0.1005 | 1.3040 | 0.0820 | 1.5984 | 81.6% |
 * | 128 | 0.2549 | 2.0570 | 0.0591 | 8.8730 | 23.2% |
 * | 256 | 1.0481 | 2.0009 | 0.6170 | 3.3987 | 58.9% |
 * | 512 | 15.3014 | 0.5482 | 2.9601 | 2.8339 | 19.3% |
 * | 1024 | 113.4239 | 0.2958 | 23.5663 | 1.4238 | 20.8% |
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
 * | 32 | 0.0566 | 0.5793 | 0.0829 | 0.3954 | 146.5% |
 * | 64 | 0.1028 | 1.2750 | 0.0819 | 1.5997 | 79.7% |
 * | 128 | 0.2588 | 2.0262 | 0.0591 | 8.8778 | 22.8% |
 * | 256 | 1.0650 | 1.9692 | 0.6166 | 3.4014 | 57.9% |
 * | 512 | 15.4367 | 0.5434 | 3.5464 | 2.3654 | 23.0% |
 * | 1024 | 114.7351 | 0.2925 | 23.5684 | 1.4237 | 20.5% |
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
 * | 32 | 0.0575 | 0.5697 | 0.0832 | 0.3938 | 144.7% |
 * | 64 | 0.1031 | 1.2717 | 0.1563 | 0.8384 | 151.7% |
 * | 128 | 0.2577 | 2.0345 | 0.0588 | 8.9213 | 22.8% |
 * | 256 | 1.0531 | 1.9913 | 0.6175 | 3.3963 | 58.6% |
 * | 512 | 15.2917 | 0.5486 | 2.9630 | 2.8311 | 19.4% |
 * | 1024 | 113.0232 | 0.2969 | 23.5607 | 1.4242 | 20.8% |
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
 * | 32 | 0.0570 | 0.5753 | 0.0830 | 0.3947 | 145.8% |
 * | 64 | 0.1028 | 1.2744 | 0.1562 | 0.8389 | 151.9% |
 * | 128 | 0.2588 | 2.0262 | 0.0579 | 9.0569 | 22.4% |
 * | 256 | 1.0568 | 1.9844 | 0.6170 | 3.3989 | 58.4% |
 * | 512 | 15.4479 | 0.5430 | 2.9599 | 2.8341 | 19.2% |
 * | 1024 | 114.3994 | 0.2933 | 23.5639 | 1.4240 | 20.6% |
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
 * | 32 | 0.0545 | 0.6009 | 0.0829 | 0.3953 | 152.0% |
 * | 64 | 0.1007 | 1.3020 | 0.0822 | 1.5944 | 81.7% |
 * | 128 | 0.2547 | 2.0584 | 0.0589 | 8.9068 | 23.1% |
 * | 256 | 1.0474 | 2.0023 | 0.6168 | 3.4001 | 58.9% |
 * | 512 | 15.1160 | 0.5549 | 2.9614 | 2.8326 | 19.6% |
 * | 1024 | 112.6143 | 0.2980 | 23.5664 | 1.4238 | 20.9% |
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
 * | 32 | 0.0546 | 0.5999 | 0.0829 | 0.3954 | 151.7% |
 * | 64 | 0.1006 | 1.3030 | 0.0820 | 1.5984 | 81.5% |
 * | 128 | 0.2540 | 2.0645 | 0.0591 | 8.8778 | 23.3% |
 * | 256 | 1.0417 | 2.0133 | 0.6169 | 3.3993 | 59.2% |
 * | 512 | 15.1644 | 0.5532 | 2.9603 | 2.8337 | 19.5% |
 * | 1024 | 113.0836 | 0.2967 | 23.5681 | 1.4237 | 20.8% |
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
 * | 32 | 0.0553 | 0.5926 | 0.0831 | 0.3943 | 150.3% |
 * | 64 | 0.1009 | 1.2987 | 0.0822 | 1.5950 | 81.4% |
 * | 128 | 0.2548 | 2.0579 | 0.0587 | 8.9384 | 23.0% |
 * | 256 | 1.0486 | 1.9999 | 0.6166 | 3.4011 | 58.8% |
 * | 512 | 15.1027 | 0.5554 | 2.9614 | 2.8326 | 19.6% |
 * | 1024 | 112.7420 | 0.2976 | 23.5680 | 1.4237 | 20.9% |
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
 * | 32 | 0.0543 | 0.6040 | 0.0826 | 0.3967 | 152.2% |
 * | 64 | 0.1007 | 1.3018 | 0.0821 | 1.5963 | 81.5% |
 * | 128 | 0.2541 | 2.0635 | 0.0588 | 8.9237 | 23.1% |
 * | 256 | 1.0473 | 2.0025 | 0.6167 | 3.4008 | 58.9% |
 * | 512 | 15.1259 | 0.5546 | 2.9614 | 2.8326 | 19.6% |
 * | 1024 | 112.7166 | 0.2977 | 23.5683 | 1.4237 | 20.9% |
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
 * | 32 | 0.0546 | 0.5999 | 0.0829 | 0.3954 | 151.7% |
 * | 64 | 0.1011 | 1.2966 | 0.0821 | 1.5963 | 81.2% |
 * | 128 | 0.2544 | 2.0611 | 0.0584 | 8.9751 | 23.0% |
 * | 256 | 1.0472 | 2.0027 | 0.6167 | 3.4005 | 58.9% |
 * | 512 | 15.0917 | 0.5558 | 2.9594 | 2.8346 | 19.6% |
 * | 1024 | 112.6941 | 0.2977 | 23.5681 | 1.4237 | 20.9% |
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
 * | 32 | 0.0550 | 0.5959 | 0.0829 | 0.3954 | 150.7% |
 * | 64 | 0.1007 | 1.3018 | 0.0819 | 1.5997 | 81.4% |
 * | 128 | 0.2544 | 2.0608 | 0.0586 | 8.9457 | 23.0% |
 * | 256 | 1.0467 | 2.0037 | 0.6169 | 3.3994 | 58.9% |
 * | 512 | 15.1059 | 0.5553 | 2.9594 | 2.8346 | 19.6% |
 * | 1024 | 112.7148 | 0.2977 | 23.5683 | 1.4237 | 20.9% |
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
 * | 32 | 0.0549 | 0.5969 | 0.0827 | 0.3962 | 150.7% |
 * | 64 | 0.1010 | 1.2978 | 0.0819 | 1.5997 | 81.1% |
 * | 128 | 0.2560 | 2.0480 | 0.0588 | 8.9116 | 23.0% |
 * | 256 | 1.0595 | 1.9794 | 0.6165 | 3.4016 | 58.2% |
 * | 512 | 15.2923 | 0.5486 | 3.5461 | 2.3656 | 23.2% |
 * | 1024 | 113.9287 | 0.2945 | 23.5684 | 1.4237 | 20.7% |
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
 * | 32 | 0.0547 | 0.5995 | 0.0824 | 0.3978 | 150.7% |
 * | 64 | 0.1004 | 1.3051 | 0.0819 | 1.5997 | 81.6% |
 * | 128 | 0.2560 | 2.0484 | 0.0589 | 8.8947 | 23.0% |
 * | 256 | 1.0534 | 1.9908 | 0.6167 | 3.4007 | 58.5% |
 * | 512 | 15.3985 | 0.5448 | 3.5463 | 2.3654 | 23.0% |
 * | 1024 | 115.3524 | 0.2909 | 23.5684 | 1.4237 | 20.4% |
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
 * | 32 | 0.0550 | 0.5953 | 0.0825 | 0.3971 | 149.9% |
 * | 64 | 0.1012 | 1.2948 | 0.0819 | 1.6000 | 80.9% |
 * | 128 | 0.2541 | 2.0631 | 0.0591 | 8.8730 | 23.3% |
 * | 256 | 1.0486 | 2.0000 | 0.6165 | 3.4018 | 58.8% |
 * | 512 | 15.3015 | 0.5482 | 3.5469 | 2.3651 | 23.2% |
 * | 1024 | 114.2855 | 0.2936 | 23.5685 | 1.4237 | 20.6% |
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
 * | 32 | 0.0547 | 0.5990 | 0.0825 | 0.3970 | 150.9% |
 * | 64 | 0.1019 | 1.2860 | 0.0819 | 1.6000 | 80.4% |
 * | 128 | 0.2556 | 2.0512 | 0.0591 | 8.8730 | 23.1% |
 * | 256 | 1.0516 | 1.9943 | 0.6168 | 3.4002 | 58.7% |
 * | 512 | 15.3333 | 0.5471 | 3.5465 | 2.3653 | 23.1% |
 * | 1024 | 114.5853 | 0.2928 | 23.5683 | 1.4237 | 20.6% |
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
 * | 32 | 0.0547 | 0.5987 | 0.0823 | 0.3984 | 150.3% |
 * | 64 | 0.1012 | 1.2954 | 0.0820 | 1.5994 | 81.0% |
 * | 128 | 0.2556 | 2.0512 | 0.0588 | 8.9092 | 23.0% |
 * | 256 | 1.0581 | 1.9820 | 0.6164 | 3.4020 | 58.3% |
 * | 512 | 15.4236 | 0.5439 | 3.5458 | 2.3658 | 23.0% |
 * | 1024 | 115.0092 | 0.2918 | 23.5680 | 1.4237 | 20.5% |
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
 * | 32 | 0.0549 | 0.5969 | 0.0825 | 0.3971 | 150.3% |
 * | 64 | 0.1017 | 1.2887 | 0.0820 | 1.5984 | 80.6% |
 * | 128 | 0.2560 | 2.0484 | 0.0591 | 8.8706 | 23.1% |
 * | 256 | 1.0568 | 1.9845 | 0.6166 | 3.4014 | 58.3% |
 * | 512 | 15.3030 | 0.5482 | 3.5465 | 2.3653 | 23.2% |
 * | 1024 | 115.8187 | 0.2897 | 23.5674 | 1.4238 | 20.3% |
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
 * | 64 | 0.1023 | 1.2818 | 0.0822 | 1.5950 | 80.4% |
 * | 128 | 0.2556 | 2.0512 | 0.0587 | 8.9384 | 22.9% |
 * | 256 | 1.0488 | 1.9996 | 0.6167 | 3.4004 | 58.8% |
 * | 512 | 15.2377 | 0.5505 | 2.9617 | 2.8324 | 19.4% |
 * | 1024 | 113.1430 | 0.2966 | 23.5665 | 1.4238 | 20.8% |
 * | 2048 | 882.3424 | 0.1521 | 174.2313 | 0.7703 | 19.7% |
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
 * | 64 | 0.1014 | 1.2925 | 0.0027 | 48.4734 | 2.7% |
 * | 128 | 0.2548 | 2.0576 | 0.0030 | 172.4632 | 1.2% |
 * | 256 | 1.0477 | 2.0017 | 0.0041 | 512.0000 | 0.4% |
 * | 512 | 15.1446 | 0.5539 | 0.0138 | 606.1133 | 0.1% |
 * | 1024 | 112.9131 | 0.2972 | 0.0476 | 705.6366 | 0.0% |
 * | 2048 | 881.9048 | 0.1522 | 0.1808 | 742.3546 | 0.0% |
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
 * | 64 | 0.1030 | 1.2726 | 0.0821 | 1.5959 | 79.7% |
 * | 128 | 0.2580 | 2.0323 | 0.0589 | 8.8971 | 22.8% |
 * | 256 | 1.0506 | 1.9961 | 0.6169 | 3.3996 | 58.7% |
 * | 512 | 15.2571 | 0.5498 | 2.9650 | 2.8292 | 19.4% |
 * | 1024 | 113.2287 | 0.2963 | 23.5667 | 1.4238 | 20.8% |
 * | 2048 | 882.4964 | 0.1521 | 174.2352 | 0.7703 | 19.7% |
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
 * | 64 | 0.1024 | 1.2804 | 0.0820 | 1.5975 | 80.2% |
 * | 128 | 0.2578 | 2.0339 | 0.0587 | 8.9384 | 22.8% |
 * | 256 | 1.0479 | 2.0013 | 0.6166 | 3.4012 | 58.8% |
 * | 512 | 15.1935 | 0.5521 | 2.9622 | 2.8319 | 19.5% |
 * | 1024 | 113.0168 | 0.2969 | 23.5664 | 1.4238 | 20.9% |
 * | 2048 | 882.0056 | 0.1522 | 174.2311 | 0.7703 | 19.8% |
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
 * | 64 | 0.1024 | 1.2800 | 0.0822 | 1.5953 | 80.2% |
 * | 128 | 0.2578 | 2.0334 | 0.0588 | 8.9092 | 22.8% |
 * | 256 | 1.0486 | 2.0000 | 0.6167 | 3.4004 | 58.8% |
 * | 512 | 15.2156 | 0.5513 | 2.9608 | 2.8333 | 19.5% |
 * | 1024 | 113.1023 | 0.2967 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 882.1404 | 0.1522 | 174.2310 | 0.7703 | 19.8% |
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
 * | 64 | 0.1024 | 1.2800 | 0.0837 | 1.5654 | 81.8% |
 * | 128 | 0.2580 | 2.0324 | 0.0594 | 8.8252 | 23.0% |
 * | 256 | 1.0506 | 1.9961 | 0.6176 | 3.3955 | 58.8% |
 * | 512 | 15.2524 | 0.5500 | 2.9665 | 2.8278 | 19.4% |
 * | 1024 | 113.3194 | 0.2961 | 23.5909 | 1.4223 | 20.8% |
 * | 2048 | 882.6655 | 0.1521 | 174.3165 | 0.7700 | 19.7% |
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
 * | 64 | 0.1006 | 1.3030 | 0.0827 | 1.5851 | 82.2% |
 * | 128 | 0.2545 | 2.0601 | 0.0592 | 8.8562 | 23.3% |
 * | 256 | 1.0467 | 2.0037 | 0.6191 | 3.3874 | 59.2% |
 * | 512 | 15.2555 | 0.5499 | 2.9623 | 2.8318 | 19.4% |
 * | 1024 | 113.2570 | 0.2963 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 882.5924 | 0.1521 | 174.2316 | 0.7703 | 19.7% |
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
 * | 64 | 0.1029 | 1.2740 | 0.0839 | 1.5625 | 81.5% |
 * | 128 | 0.2578 | 2.0338 | 0.0595 | 8.8157 | 23.1% |
 * | 256 | 1.0507 | 1.9960 | 0.6173 | 3.3973 | 58.8% |
 * | 512 | 15.2533 | 0.5500 | 2.9657 | 2.8285 | 19.4% |
 * | 1024 | 113.3034 | 0.2961 | 23.5906 | 1.4224 | 20.8% |
 * | 2048 | 882.6360 | 0.1521 | 174.3131 | 0.7700 | 19.7% |
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
 * | 64 | 0.1032 | 1.2705 | 0.0837 | 1.5652 | 81.2% |
 * | 128 | 0.2578 | 2.0339 | 0.0594 | 8.8276 | 23.0% |
 * | 256 | 1.0506 | 1.9962 | 0.6176 | 3.3956 | 58.8% |
 * | 512 | 15.2685 | 0.5494 | 2.9662 | 2.8281 | 19.4% |
 * | 1024 | 113.3260 | 0.2961 | 23.5896 | 1.4224 | 20.8% |
 * | 2048 | 882.6703 | 0.1521 | 174.3141 | 0.7700 | 19.7% |
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
 * | 64 | 0.1035 | 1.2662 |
 * | 128 | 0.2580 | 2.0317 |
 * | 256 | 1.0497 | 1.9979 |
 * | 512 | 15.2578 | 0.5498 |
 * | 1024 | 113.3115 | 0.2961 |
 * | 2048 | 882.6987 | 0.1521 |
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
 * | 64 | 0.1006 | 1.3030 |
 * | 128 | 0.2545 | 2.0601 |
 * | 256 | 1.0466 | 2.0038 |
 * | 512 | 15.2702 | 0.5493 |
 * | 1024 | 113.3315 | 0.2961 |
 * | 2048 | 882.6544 | 0.1521 |
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
 * | 64 | 0.1007 | 1.3020 | 0.0822 | 1.5950 | 81.6% |
 * | 128 | 0.2546 | 2.0591 | 0.0589 | 8.9068 | 23.1% |
 * | 256 | 1.0476 | 2.0019 | 0.6166 | 3.4011 | 58.9% |
 * | 512 | 15.2845 | 0.5488 | 2.9594 | 2.8346 | 19.4% |
 * | 1024 | 113.3935 | 0.2959 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 882.8262 | 0.1520 | 174.2333 | 0.7703 | 19.7% |
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
 * | 64 | 0.1036 | 1.2654 | 0.0821 | 1.5969 | 79.2% |
 * | 128 | 0.2579 | 2.0330 | 0.0590 | 8.8850 | 22.9% |
 * | 256 | 1.0506 | 1.9961 | 0.6167 | 3.4006 | 58.7% |
 * | 512 | 15.2994 | 0.5483 | 2.9627 | 2.8314 | 19.4% |
 * | 1024 | 113.4805 | 0.2957 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 882.8436 | 0.1520 | 174.2326 | 0.7703 | 19.7% |
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
 * | 64 | 0.1036 | 1.2654 | 0.0824 | 1.5910 | 79.5% |
 * | 128 | 0.2580 | 2.0323 | 0.0585 | 8.9604 | 22.7% |
 * | 256 | 1.0521 | 1.9932 | 0.6165 | 3.4015 | 58.6% |
 * | 512 | 15.2577 | 0.5498 | 2.9625 | 2.8316 | 19.4% |
 * | 1024 | 113.4505 | 0.2958 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 882.7999 | 0.1520 | 174.2316 | 0.7703 | 19.7% |
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
 * | 64 | 0.1030 | 1.2720 | 0.0821 | 1.5966 | 79.7% |
 * | 128 | 0.2578 | 2.0334 | 0.0588 | 8.9116 | 22.8% |
 * | 256 | 1.0506 | 1.9961 | 0.6167 | 3.4008 | 58.7% |
 * | 512 | 15.3040 | 0.5481 | 2.9616 | 2.8325 | 19.4% |
 * | 1024 | 113.4095 | 0.2959 | 23.5662 | 1.4238 | 20.8% |
 * | 2048 | 882.8005 | 0.1520 | 174.2356 | 0.7703 | 19.7% |
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
 * | 64 | 0.1035 | 1.2667 | 0.0821 | 1.5966 | 79.3% |
 * | 128 | 0.2579 | 2.0331 | 0.0591 | 8.8706 | 22.9% |
 * | 256 | 1.0516 | 1.9943 | 0.6167 | 3.4004 | 58.7% |
 * | 512 | 15.2822 | 0.5489 | 2.9599 | 2.8341 | 19.4% |
 * | 1024 | 113.4783 | 0.2957 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 881.9980 | 0.1522 | 174.2322 | 0.7703 | 19.8% |
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
 * | 64 | 0.1039 | 1.2621 | 0.0820 | 1.5988 | 78.9% |
 * | 128 | 0.2577 | 2.0341 | 0.0580 | 9.0370 | 22.5% |
 * | 256 | 1.0506 | 1.9961 | 0.6168 | 3.4001 | 58.7% |
 * | 512 | 15.3068 | 0.5480 | 2.9598 | 2.8342 | 19.3% |
 * | 1024 | 113.4827 | 0.2957 | 23.5662 | 1.4238 | 20.8% |
 * | 2048 | 881.9834 | 0.1522 | 174.2334 | 0.7703 | 19.8% |
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
 * | 64 | 0.1024 | 1.2800 | 0.0821 | 1.5956 | 80.2% |
 * | 128 | 0.2578 | 2.0338 | 0.0585 | 8.9579 | 22.7% |
 * | 256 | 1.0510 | 1.9954 | 0.6167 | 3.4008 | 58.7% |
 * | 512 | 15.2742 | 0.5492 | 2.9595 | 2.8345 | 19.4% |
 * | 1024 | 113.4313 | 0.2958 | 23.5662 | 1.4238 | 20.8% |
 * | 2048 | 882.6475 | 0.1521 | 174.2335 | 0.7703 | 19.7% |
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
 * | 64 | 0.1041 | 1.2591 | 0.0820 | 1.5978 | 78.8% |
 * | 128 | 0.2578 | 2.0336 | 0.0592 | 8.8562 | 23.0% |
 * | 256 | 1.0509 | 1.9955 | 0.6165 | 3.4017 | 58.7% |
 * | 512 | 15.2974 | 0.5484 | 2.9602 | 2.8338 | 19.4% |
 * | 1024 | 113.4356 | 0.2958 | 23.5663 | 1.4238 | 20.8% |
 * | 2048 | 882.5438 | 0.1521 | 174.2343 | 0.7703 | 19.7% |
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
