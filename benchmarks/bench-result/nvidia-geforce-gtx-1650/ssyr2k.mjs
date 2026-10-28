/**
 * Benchmark results for ssyr2k on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0143 | 0.8571 | 0.0143 | 0.8591 | 99.8% |
 * | 64 | 0.0196 | 2.5078 | 0.0194 | 2.5367 | 98.9% |
 * | 128 | 0.0321 | 6.1226 | 0.0290 | 6.7777 | 90.3% |
 * | 256 | 0.0945 | 8.3224 | 0.0491 | 16.0104 | 52.0% |
 * | 512 | 0.2526 | 12.4530 | 0.1659 | 18.9630 | 65.7% |
 * | 1024 | 1.0895 | 11.5489 | 0.9216 | 13.6533 | 84.6% |
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
 * | 256 | 0.1003 | 7.8392 | 0.0489 | 16.0785 | 48.8% |
 * | 512 | 0.2685 | 11.7161 | 0.1659 | 18.9630 | 61.8% |
 * | 1024 | 1.3624 | 9.2358 | 0.9368 | 13.4325 | 68.8% |
 * | 2048 | 9.9909 | 5.0377 | 6.7482 | 7.4585 | 67.5% |
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
 * | 256 | 0.0986 | 7.9740 | 0.0591 | 13.2987 | 60.0% |
 * | 512 | 0.2500 | 12.5845 | 0.1842 | 17.0770 | 73.7% |
 * | 1024 | 1.0833 | 11.6149 | 1.0240 | 12.2878 | 94.5% |
 * | 2048 | 7.6860 | 6.5485 | 7.3134 | 6.8821 | 95.2% |
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
 * | 64 | 0.0189 | 3.4595 | 0.0193 | 3.3964 | 101.9% |
 * | 128 | 0.0323 | 8.1189 | 0.0289 | 9.0720 | 89.5% |
 * | 256 | 0.1003 | 10.4540 | 0.0489 | 21.4450 | 48.7% |
 * | 512 | 0.2685 | 15.6196 | 0.1659 | 25.2840 | 61.8% |
 * | 1024 | 1.4003 | 11.9809 | 1.0215 | 16.4235 | 72.9% |
 * | 2048 | 11.2882 | 5.9451 | 6.7441 | 9.9507 | 59.7% |
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
 * | 64 | 0.0203 | 3.2252 | 0.0216 | 3.0363 | 106.2% |
 * | 128 | 0.0324 | 8.0909 | 0.0308 | 8.4979 | 95.2% |
 * | 256 | 0.0978 | 10.7260 | 0.0509 | 20.5894 | 52.1% |
 * | 512 | 0.2906 | 14.4344 | 0.1699 | 24.6863 | 58.5% |
 * | 1024 | 1.4117 | 11.8840 | 1.0321 | 16.2555 | 73.1% |
 * | 2048 | 11.3047 | 5.9364 | 6.7461 | 9.9478 | 59.7% |
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
 * | 512 | 0.2683 | 11.7245 | 0.1653 | 19.0309 | 61.6% |
 * | 1024 | 1.3630 | 9.2315 | 0.9528 | 13.2065 | 69.9% |
 * | 2048 | 10.0190 | 5.0236 | 6.7480 | 7.4588 | 67.4% |
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
 * | 512 | 0.4421 | 7.1150 | 0.1771 | 17.7652 | 40.1% |
 * | 1024 | 1.9711 | 6.3836 | 0.9359 | 13.4442 | 47.5% |
 * | 2048 | 16.7677 | 3.0017 | 6.8128 | 7.3878 | 40.6% |
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
 * | 512 | 0.2660 | 11.8253 | 0.1763 | 17.8410 | 66.3% |
 * | 1024 | 1.2570 | 10.0103 | 0.9482 | 13.2704 | 75.4% |
 * | 2048 | 9.5852 | 5.2510 | 6.8118 | 7.3889 | 71.1% |
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
 * | 512 | 0.2636 | 11.9352 | 0.1765 | 17.8200 | 67.0% |
 * | 1024 | 1.3087 | 9.6150 | 0.9324 | 13.4954 | 71.2% |
 * | 2048 | 9.9827 | 5.0419 | 6.8123 | 7.3884 | 68.2% |
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
 * | 512 | 0.2703 | 11.6371 | 0.1763 | 17.8410 | 65.2% |
 * | 1024 | 1.3881 | 9.0648 | 0.9523 | 13.2136 | 68.6% |
 * | 2048 | 10.4324 | 4.8246 | 6.8132 | 7.3873 | 65.3% |
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
 * | 512 | 0.2703 | 11.6364 | 0.1766 | 17.8103 | 65.3% |
 * | 1024 | 1.4192 | 8.8660 | 0.9328 | 13.4896 | 65.7% |
 * | 2048 | 11.6813 | 4.3087 | 6.8124 | 7.3882 | 58.3% |
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
 * | 512 | 0.2498 | 12.5934 | 0.1867 | 16.8516 | 74.7% |
 * | 1024 | 1.0823 | 11.6259 | 1.0623 | 11.8446 | 98.2% |
 * | 2048 | 7.6888 | 6.5461 | 7.2422 | 6.9498 | 94.2% |
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
 * | 512 | 0.4218 | 7.4572 | 0.1964 | 16.0156 | 46.6% |
 * | 1024 | 1.8224 | 6.9045 | 1.0753 | 11.7020 | 59.0% |
 * | 2048 | 12.5576 | 4.0081 | 7.5707 | 6.6483 | 60.3% |
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
 * | 512 | 0.2517 | 12.4957 | 0.1924 | 16.3486 | 76.4% |
 * | 1024 | 1.1069 | 11.3679 | 1.0006 | 12.5751 | 90.4% |
 * | 2048 | 7.8878 | 6.3810 | 7.3425 | 6.8548 | 93.1% |
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
 * | 512 | 0.2501 | 12.5773 | 0.1891 | 16.6377 | 75.6% |
 * | 1024 | 1.1024 | 11.4138 | 1.0212 | 12.3211 | 92.6% |
 * | 2048 | 7.8552 | 6.4075 | 7.3527 | 6.8453 | 93.6% |
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
 * | 512 | 0.2518 | 12.4926 | 0.1929 | 16.3038 | 76.6% |
 * | 1024 | 1.0852 | 11.5954 | 1.0826 | 11.6231 | 99.8% |
 * | 2048 | 7.7046 | 6.5326 | 7.4586 | 6.7482 | 96.8% |
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
 * | 512 | 0.2519 | 12.4878 | 0.1917 | 16.4072 | 76.1% |
 * | 1024 | 1.0840 | 11.6079 | 1.0839 | 11.6089 | 100.0% |
 * | 2048 | 7.7026 | 6.5343 | 7.4432 | 6.7621 | 96.6% |
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
 * | 64 | 0.0191 | 3.4362 | 0.0193 | 3.3964 | 101.2% |
 * | 128 | 0.0324 | 8.0989 | 0.0290 | 9.0419 | 89.6% |
 * | 256 | 0.1004 | 10.4490 | 0.0488 | 21.4872 | 48.6% |
 * | 512 | 0.2683 | 15.6336 | 0.1659 | 25.2864 | 61.8% |
 * | 1024 | 1.3896 | 12.0737 | 0.9636 | 17.4101 | 69.3% |
 * | 2048 | 11.3049 | 5.9362 | 6.7463 | 9.9475 | 59.7% |
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
 * | 64 | 0.0203 | 3.2252 | 0.0209 | 3.1315 | 103.0% |
 * | 128 | 0.0328 | 8.0000 | 0.0306 | 8.5646 | 93.4% |
 * | 256 | 0.1024 | 10.2400 | 0.0510 | 20.5635 | 49.8% |
 * | 512 | 0.3382 | 12.4010 | 0.1699 | 24.6817 | 50.2% |
 * | 1024 | 1.6438 | 10.2062 | 0.9360 | 17.9235 | 56.9% |
 * | 2048 | 13.9687 | 4.8042 | 6.7480 | 9.9450 | 48.3% |
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
 * | 64 | 0.0197 | 3.3301 | 0.0208 | 3.1508 | 105.7% |
 * | 128 | 0.0328 | 8.0000 | 0.0315 | 8.3168 | 96.2% |
 * | 256 | 0.0989 | 10.5977 | 0.0511 | 20.5185 | 51.6% |
 * | 512 | 0.2662 | 15.7538 | 0.1697 | 24.7142 | 63.7% |
 * | 1024 | 1.3763 | 12.1903 | 0.9339 | 17.9640 | 67.9% |
 * | 2048 | 10.8943 | 6.1600 | 6.7496 | 9.9426 | 62.0% |
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
 * | 64 | 0.0204 | 3.2125 | 0.0210 | 3.1267 | 102.7% |
 * | 128 | 0.0328 | 8.0000 | 0.0317 | 8.2789 | 96.6% |
 * | 256 | 0.1004 | 10.4490 | 0.0512 | 20.4928 | 51.0% |
 * | 512 | 0.2673 | 15.6916 | 0.1697 | 24.7096 | 63.5% |
 * | 1024 | 1.3824 | 12.1363 | 0.9481 | 17.6957 | 68.6% |
 * | 2048 | 11.1210 | 6.0344 | 6.7482 | 9.9447 | 60.7% |
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
 * | 64 | 0.0205 | 3.2000 | 0.0220 | 2.9789 | 107.4% |
 * | 128 | 0.0328 | 8.0000 | 0.0308 | 8.5112 | 94.0% |
 * | 256 | 0.1013 | 10.3467 | 0.0508 | 20.6348 | 50.1% |
 * | 512 | 0.2715 | 15.4502 | 0.1695 | 24.7516 | 62.4% |
 * | 1024 | 1.4279 | 11.7497 | 0.9871 | 16.9958 | 69.1% |
 * | 2048 | 11.3741 | 5.9001 | 6.7482 | 9.9447 | 59.3% |
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
 * | 64 | 0.0205 | 3.2000 | 0.0220 | 2.9746 | 107.6% |
 * | 128 | 0.0324 | 8.0869 | 0.0328 | 8.0000 | 101.1% |
 * | 256 | 0.1004 | 10.4490 | 0.0553 | 18.9630 | 55.1% |
 * | 512 | 0.2703 | 15.5197 | 0.1784 | 23.5128 | 66.0% |
 * | 1024 | 1.4008 | 11.9766 | 1.0409 | 16.1176 | 74.3% |
 * | 2048 | 11.3321 | 5.9220 | 6.7498 | 9.9424 | 59.6% |
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
 * | 64 | 0.0203 | 3.2328 | 0.0211 | 3.1007 | 104.3% |
 * | 128 | 0.0329 | 7.9766 | 0.0322 | 8.1351 | 98.1% |
 * | 256 | 0.1016 | 10.3206 | 0.0515 | 20.3654 | 50.7% |
 * | 512 | 0.2710 | 15.4758 | 0.1696 | 24.7236 | 62.6% |
 * | 1024 | 1.4335 | 11.7035 | 0.9328 | 17.9859 | 65.1% |
 * | 2048 | 11.5069 | 5.8321 | 6.7468 | 9.9468 | 58.6% |
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
 * | 64 | 0.0203 | 3.2303 | 0.0220 | 2.9746 | 108.6% |
 * | 128 | 0.0324 | 8.0829 | 0.0311 | 8.4367 | 95.8% |
 * | 256 | 0.1004 | 10.4390 | 0.0506 | 20.7065 | 50.4% |
 * | 512 | 0.2706 | 15.5005 | 0.1679 | 24.9756 | 62.1% |
 * | 1024 | 1.4345 | 11.6952 | 0.9462 | 17.7316 | 66.0% |
 * | 2048 | 12.3466 | 5.4354 | 6.7461 | 9.9478 | 54.6% |
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
 * | 64 | 0.0201 | 3.2534 | 0.0210 | 3.1196 | 104.3% |
 * | 128 | 0.0327 | 8.0274 | 0.0306 | 8.5735 | 93.6% |
 * | 256 | 0.1015 | 10.3271 | 0.0511 | 20.5313 | 50.3% |
 * | 512 | 0.2690 | 15.5936 | 0.1696 | 24.7329 | 63.0% |
 * | 1024 | 1.4122 | 11.8805 | 0.9336 | 17.9711 | 66.1% |
 * | 2048 | 11.2046 | 5.9894 | 6.7461 | 9.9478 | 60.2% |
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
 * | 64 | 0.0189 | 3.4712 | 0.0194 | 3.3740 | 102.9% |
 * | 128 | 0.0320 | 8.1920 | 0.0290 | 9.0320 | 90.7% |
 * | 256 | 0.1004 | 10.4490 | 0.0490 | 21.3890 | 48.9% |
 * | 512 | 0.2688 | 15.6010 | 0.1664 | 25.2037 | 61.9% |
 * | 1024 | 1.3675 | 12.2685 | 0.9544 | 17.5794 | 69.8% |
 * | 2048 | 11.2694 | 5.9550 | 6.6839 | 10.0403 | 59.3% |
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
 * | 64 | 0.0204 | 3.2075 | 0.0219 | 2.9942 | 107.1% |
 * | 128 | 0.0328 | 8.0000 | 0.0309 | 8.4935 | 94.2% |
 * | 256 | 0.1010 | 10.3795 | 0.0506 | 20.7196 | 50.1% |
 * | 512 | 0.2703 | 15.5179 | 0.1679 | 24.9756 | 62.1% |
 * | 1024 | 1.4008 | 11.9766 | 0.9470 | 17.7166 | 67.6% |
 * | 2048 | 11.1743 | 6.0057 | 6.7462 | 9.9476 | 60.4% |
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
 * | 64 | 0.0201 | 3.2586 | 0.0217 | 3.0206 | 107.9% |
 * | 128 | 0.0328 | 8.0000 | 0.0308 | 8.5156 | 93.9% |
 * | 256 | 0.1012 | 10.3663 | 0.0508 | 20.6348 | 50.2% |
 * | 512 | 0.2699 | 15.5381 | 0.1684 | 24.9068 | 62.4% |
 * | 1024 | 1.4131 | 11.8727 | 0.9709 | 17.2793 | 68.7% |
 * | 2048 | 11.2216 | 5.9803 | 6.7482 | 9.9448 | 60.1% |
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
 * | 64 | 0.0203 | 3.2277 | 0.0218 | 3.0118 | 107.2% |
 * | 128 | 0.0327 | 8.0078 | 0.0308 | 8.5156 | 94.0% |
 * | 256 | 0.1019 | 10.2866 | 0.0507 | 20.6999 | 49.7% |
 * | 512 | 0.2703 | 15.5188 | 0.1695 | 24.7422 | 62.7% |
 * | 1024 | 1.3909 | 12.0624 | 1.0131 | 16.5605 | 72.8% |
 * | 2048 | 11.2031 | 5.9902 | 6.7461 | 9.9478 | 60.2% |
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
 * | 64 | 0.0202 | 3.2379 | 0.0221 | 2.9595 | 109.4% |
 * | 128 | 0.0326 | 8.0393 | 0.0314 | 8.3592 | 96.2% |
 * | 256 | 0.1015 | 10.3304 | 0.0512 | 20.4800 | 50.4% |
 * | 512 | 0.2698 | 15.5455 | 0.1704 | 24.6098 | 63.2% |
 * | 1024 | 1.4006 | 11.9787 | 1.0158 | 16.5169 | 72.5% |
 * | 2048 | 11.3001 | 5.9388 | 6.7543 | 9.9357 | 59.8% |
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
 * | 64 | 0.0190 | 3.4565 | 0.0191 | 3.4247 | 100.9% |
 * | 128 | 0.0320 | 8.2002 | 0.0290 | 9.0519 | 90.6% |
 * | 256 | 0.1004 | 10.4490 | 0.0489 | 21.4591 | 48.7% |
 * | 512 | 0.2694 | 15.5704 | 0.1658 | 25.2986 | 61.5% |
 * | 1024 | 1.4010 | 11.9754 | 0.9625 | 17.4301 | 68.7% |
 * | 2048 | 11.2006 | 5.9915 | 6.7461 | 9.9478 | 60.2% |
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
 * | 64 | 0.0204 | 3.2100 | 0.0224 | 2.9299 | 109.6% |
 * | 128 | 0.0328 | 8.0000 | 0.0313 | 8.3635 | 95.7% |
 * | 256 | 0.1017 | 10.3076 | 0.0512 | 20.4800 | 50.3% |
 * | 512 | 0.2696 | 15.5557 | 0.1700 | 24.6747 | 63.0% |
 * | 1024 | 1.4030 | 11.9584 | 0.9809 | 17.1037 | 69.9% |
 * | 2048 | 11.2796 | 5.9496 | 6.7544 | 9.9355 | 59.9% |
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
 * | 64 | 0.0204 | 3.2176 | 0.0225 | 2.9091 | 110.6% |
 * | 128 | 0.0328 | 8.0039 | 0.0313 | 8.3720 | 95.6% |
 * | 256 | 0.1009 | 10.3877 | 0.0512 | 20.4800 | 50.7% |
 * | 512 | 0.2697 | 15.5510 | 0.1704 | 24.6191 | 63.2% |
 * | 1024 | 1.4118 | 11.8832 | 1.0156 | 16.5198 | 71.9% |
 * | 2048 | 11.2063 | 5.9885 | 6.7543 | 9.9357 | 60.3% |
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
 * | 64 | 0.0205 | 3.2000 |
 * | 128 | 0.0329 | 7.9727 |
 * | 256 | 0.0963 | 10.8900 |
 * | 512 | 0.2537 | 16.5307 |
 * | 1024 | 1.1323 | 14.8171 |
 * | 2048 | 8.8831 | 7.5547 |
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
 * | 64 | 0.0188 | 3.4830 |
 * | 128 | 0.0320 | 8.1920 |
 * | 256 | 0.1004 | 10.4490 |
 * | 512 | 0.2683 | 15.6336 |
 * | 1024 | 1.4110 | 11.8901 |
 * | 2048 | 11.2689 | 5.9552 |
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
 * | 64 | 0.0189 | 3.4624 | 0.0192 | 3.4133 | 101.4% |
 * | 128 | 0.0318 | 8.2497 | 0.0291 | 9.0220 | 91.4% |
 * | 256 | 0.1004 | 10.4490 | 0.0489 | 21.4591 | 48.7% |
 * | 512 | 0.2684 | 15.6280 | 0.1659 | 25.2840 | 61.8% |
 * | 1024 | 1.4130 | 11.8737 | 0.9235 | 18.1666 | 65.4% |
 * | 2048 | 11.2891 | 5.9446 | 6.7471 | 9.9463 | 59.8% |
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
 * | 64 | 0.0204 | 3.2176 | 0.0210 | 3.1243 | 103.0% |
 * | 128 | 0.0328 | 8.0000 | 0.0305 | 8.5960 | 93.1% |
 * | 256 | 0.1022 | 10.2641 | 0.0510 | 20.5442 | 50.0% |
 * | 512 | 0.2706 | 15.5005 | 0.1687 | 24.8643 | 62.3% |
 * | 1024 | 1.4069 | 11.9247 | 0.9343 | 17.9578 | 66.4% |
 * | 2048 | 11.2597 | 5.9601 | 6.7522 | 9.9388 | 60.0% |
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
 * | 64 | 0.0202 | 3.2456 | 0.0208 | 3.1532 | 102.9% |
 * | 128 | 0.0328 | 7.9961 | 0.0313 | 8.3763 | 95.5% |
 * | 256 | 0.1012 | 10.3647 | 0.0511 | 20.5185 | 50.5% |
 * | 512 | 0.2711 | 15.4712 | 0.1697 | 24.7142 | 62.6% |
 * | 1024 | 1.4005 | 11.9795 | 0.9319 | 18.0032 | 66.5% |
 * | 2048 | 11.2444 | 5.9682 | 6.7520 | 9.9390 | 60.0% |
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
 * | 64 | 0.0200 | 3.2794 | 0.0206 | 3.1801 | 103.1% |
 * | 128 | 0.0328 | 8.0000 | 0.0311 | 8.4367 | 94.8% |
 * | 256 | 0.1010 | 10.3795 | 0.0508 | 20.6413 | 50.3% |
 * | 512 | 0.2708 | 15.4858 | 0.1679 | 24.9756 | 62.0% |
 * | 1024 | 1.4187 | 11.8261 | 0.9297 | 18.0453 | 65.5% |
 * | 2048 | 11.2620 | 5.9589 | 6.7517 | 9.9396 | 60.0% |
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
 * | 64 | 0.0205 | 3.2000 | 0.0218 | 3.0051 | 106.5% |
 * | 128 | 0.0328 | 8.0000 | 0.0310 | 8.4497 | 94.7% |
 * | 256 | 0.1020 | 10.2785 | 0.0506 | 20.7130 | 49.6% |
 * | 512 | 0.2704 | 15.5087 | 0.1683 | 24.9163 | 62.2% |
 * | 1024 | 1.4051 | 11.9402 | 0.9775 | 17.1636 | 69.6% |
 * | 2048 | 11.2700 | 5.9546 | 6.7467 | 9.9469 | 59.9% |
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
 * | 64 | 0.0202 | 3.2508 | 0.0214 | 3.0613 | 106.2% |
 * | 128 | 0.0328 | 8.0000 | 0.0307 | 8.5333 | 93.8% |
 * | 256 | 0.1007 | 10.4158 | 0.0504 | 20.7853 | 50.1% |
 * | 512 | 0.2723 | 15.4039 | 0.1696 | 24.7352 | 62.3% |
 * | 1024 | 1.4211 | 11.8056 | 0.9473 | 17.7103 | 66.7% |
 * | 2048 | 11.2233 | 5.9794 | 6.7502 | 9.9418 | 60.1% |
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
 * | 64 | 0.0204 | 3.2050 | 0.0220 | 2.9832 | 107.4% |
 * | 128 | 0.0328 | 8.0000 | 0.0331 | 7.9150 | 101.1% |
 * | 256 | 0.1016 | 10.3223 | 0.0556 | 18.8756 | 54.7% |
 * | 512 | 0.2709 | 15.4849 | 0.1868 | 22.4534 | 69.0% |
 * | 1024 | 1.4029 | 11.9591 | 0.9543 | 17.5809 | 68.0% |
 * | 2048 | 11.1939 | 5.9951 | 6.7476 | 9.9456 | 60.3% |
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
 * | 64 | 0.0205 | 3.2000 | 0.0219 | 2.9898 | 107.0% |
 * | 128 | 0.0328 | 8.0000 | 0.0309 | 8.4803 | 94.3% |
 * | 256 | 0.1008 | 10.3992 | 0.0508 | 20.6608 | 50.3% |
 * | 512 | 0.2702 | 15.5207 | 0.1696 | 24.7352 | 62.7% |
 * | 1024 | 1.4254 | 11.7701 | 1.0038 | 16.7130 | 70.4% |
 * | 2048 | 11.3050 | 5.9362 | 6.7467 | 9.9469 | 59.7% |
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
