/**
 * Benchmark results for ssyrk on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0097 | 0.8435 | 0.0079 | 1.0364 | 81.4% |
 * | 64 | 0.0123 | 2.6667 | 0.0102 | 3.2151 | 82.9% |
 * | 128 | 0.0184 | 7.1049 | 0.0152 | 8.6232 | 82.4% |
 * | 256 | 0.0486 | 10.7896 | 0.0247 | 21.2366 | 50.8% |
 * | 512 | 0.1294 | 16.2037 | 0.0816 | 25.6903 | 63.1% |
 * | 1024 | 0.5475 | 15.3207 | 0.4555 | 18.4167 | 83.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyrk-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-default.svg)
 *
 * ![ssyrk-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/ssyrk.js) — WebGPU benchmark script
 * - [ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/ssyrk.c) — CUDA / cuBLAS reference script
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
 * | 256 | 0.0518 | 10.1167 | 0.0247 | 21.2228 | 47.7% |
 * | 512 | 0.1375 | 15.2516 | 0.0817 | 25.6803 | 59.4% |
 * | 1024 | 0.6841 | 12.2620 | 0.4555 | 18.4167 | 66.6% |
 * | 2048 | 4.9579 | 6.7679 | 3.3708 | 9.9545 | 68.0% |
 *
 * ![ssyrk-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-transno-transpose.svg)
 *
 * ![ssyrk-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 256 | 0.0512 | 10.2400 | 0.0309 | 16.9694 | 60.3% |
 * | 512 | 0.1277 | 16.4209 | 0.0904 | 23.2109 | 70.7% |
 * | 1024 | 0.5448 | 15.3985 | 0.5015 | 16.7269 | 92.1% |
 * | 2048 | 3.7749 | 8.8888 | 3.6450 | 9.2056 | 96.6% |
 *
 * ![ssyrk-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-transtranspose.svg)
 *
 * ![ssyrk-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/trans.ssyrk.js) — WebGPU trans-sweep benchmark script
 * - [trans.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/trans.ssyrk.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 64 | 0.0121 | 4.0474 | 0.0102 | 4.8000 | 84.3% |
 * | 128 | 0.0184 | 10.6667 | 0.0149 | 13.1563 | 81.1% |
 * | 256 | 0.0525 | 14.9671 | 0.0247 | 31.7930 | 47.1% |
 * | 512 | 0.1372 | 22.9254 | 0.0815 | 38.5960 | 59.4% |
 * | 1024 | 0.6840 | 18.3948 | 0.4563 | 27.5738 | 66.7% |
 * | 2048 | 5.4347 | 9.2612 | 3.3392 | 15.0727 | 61.4% |
 *
 * ![ssyrk-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-uplolower.svg)
 *
 * ![ssyrk-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0130 | 3.7786 | 0.0113 | 4.3636 | 86.6% |
 * | 128 | 0.0184 | 10.6667 | 0.0163 | 12.0353 | 88.6% |
 * | 256 | 0.0508 | 15.4712 | 0.0259 | 30.3595 | 51.0% |
 * | 512 | 0.1484 | 21.1908 | 0.0829 | 37.9625 | 55.8% |
 * | 1024 | 0.6840 | 18.3952 | 0.4634 | 27.1521 | 67.7% |
 * | 2048 | 5.4412 | 9.2502 | 3.3700 | 14.9350 | 61.9% |
 *
 * ![ssyrk-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-uploupper.svg)
 *
 * ![ssyrk-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/uplo.ssyrk.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/uplo.ssyrk.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 512 | 0.1372 | 15.2836 | 0.0812 | 25.8219 | 59.2% |
 * | 1024 | 0.6841 | 12.2620 | 0.4562 | 18.3864 | 66.7% |
 * | 2048 | 4.9591 | 6.7663 | 3.3715 | 9.9525 | 68.0% |
 *
 * ![ssyrk-lda-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad0.svg)
 *
 * ![ssyrk-lda-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2150 | 9.7524 | 0.0892 | 23.5065 | 41.5% |
 * | 1024 | 0.9854 | 8.5131 | 0.4651 | 18.0378 | 47.2% |
 * | 2048 | 8.4026 | 3.9933 | 3.4028 | 9.8607 | 40.5% |
 *
 * ![ssyrk-lda-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad1.svg)
 *
 * ![ssyrk-lda-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1352 | 15.5152 | 0.0867 | 24.1875 | 64.1% |
 * | 1024 | 0.6310 | 13.2950 | 0.4619 | 18.1628 | 73.2% |
 * | 2048 | 4.7264 | 7.0993 | 3.4037 | 9.8582 | 72.0% |
 *
 * ![ssyrk-lda-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad8.svg)
 *
 * ![ssyrk-lda-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1352 | 15.5152 | 0.0904 | 23.1986 | 66.9% |
 * | 1024 | 0.6569 | 12.7701 | 0.4656 | 18.0149 | 70.9% |
 * | 2048 | 4.9466 | 6.7833 | 3.4032 | 9.8596 | 68.8% |
 *
 * ![ssyrk-lda-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad16.svg)
 *
 * ![ssyrk-lda-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1372 | 15.2836 | 0.0891 | 23.5276 | 65.0% |
 * | 1024 | 0.6963 | 12.0471 | 0.4648 | 18.0459 | 66.8% |
 * | 2048 | 5.1602 | 6.5026 | 3.3708 | 9.9543 | 65.3% |
 *
 * ![ssyrk-lda-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad32.svg)
 *
 * ![ssyrk-lda-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1385 | 15.1388 | 0.0865 | 24.2367 | 62.5% |
 * | 1024 | 0.7105 | 11.8064 | 0.4648 | 18.0465 | 65.4% |
 * | 2048 | 5.7989 | 5.7863 | 3.3701 | 9.9564 | 58.1% |
 *
 * ![ssyrk-lda-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad64.svg)
 *
 * ![ssyrk-lda-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad64.svg)
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
 * | 512 | 0.1271 | 16.4953 | 0.0928 | 22.5986 | 73.0% |
 * | 1024 | 0.5443 | 15.4130 | 0.5058 | 16.5846 | 92.9% |
 * | 2048 | 3.7755 | 8.8874 | 3.6102 | 9.2943 | 95.6% |
 *
 * ![ssyrk-lda-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad0.svg)
 *
 * ![ssyrk-lda-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2169 | 9.6704 | 0.0938 | 22.3520 | 43.3% |
 * | 1024 | 0.9428 | 8.8974 | 0.5170 | 16.2253 | 54.8% |
 * | 2048 | 6.2706 | 5.3511 | 3.7528 | 8.9412 | 59.8% |
 *
 * ![ssyrk-lda-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad1.svg)
 *
 * ![ssyrk-lda-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1305 | 16.0726 | 0.0924 | 22.6847 | 70.9% |
 * | 1024 | 0.5572 | 15.0558 | 0.4866 | 17.2406 | 87.3% |
 * | 2048 | 3.8713 | 8.6675 | 3.6492 | 9.1951 | 94.3% |
 *
 * ![ssyrk-lda-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad8.svg)
 *
 * ![ssyrk-lda-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1307 | 16.0490 | 0.0914 | 22.9548 | 69.9% |
 * | 1024 | 0.5550 | 15.1144 | 0.4968 | 16.8853 | 89.5% |
 * | 2048 | 3.8585 | 8.6961 | 3.6548 | 9.1809 | 94.7% |
 *
 * ![ssyrk-lda-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad16.svg)
 *
 * ![ssyrk-lda-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1297 | 16.1638 | 0.1016 | 20.6380 | 78.3% |
 * | 1024 | 0.5454 | 15.3818 | 0.5082 | 16.5078 | 93.2% |
 * | 2048 | 3.7843 | 8.8668 | 3.7274 | 9.0020 | 98.5% |
 *
 * ![ssyrk-lda-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad32.svg)
 *
 * ![ssyrk-lda-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.1290 | 16.2540 | 0.0990 | 21.1851 | 76.7% |
 * | 1024 | 0.5455 | 15.3768 | 0.5117 | 16.3922 | 93.8% |
 * | 2048 | 3.7827 | 8.8706 | 3.6927 | 9.0868 | 97.6% |
 *
 * ![ssyrk-lda-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad64.svg)
 *
 * ![ssyrk-lda-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/lda.ssyrk.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/lda.ssyrk.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 64 | 0.0123 | 4.0000 | 0.0114 | 4.3268 | 92.4% |
 * | 128 | 0.0185 | 10.6022 | 0.0162 | 12.1663 | 87.1% |
 * | 256 | 0.0529 | 14.8630 | 0.0258 | 30.4913 | 48.7% |
 * | 512 | 0.1383 | 22.7450 | 0.0829 | 37.9479 | 59.9% |
 * | 1024 | 0.6840 | 18.3952 | 0.4609 | 27.3010 | 67.4% |
 * | 2048 | 5.4092 | 9.3049 | 3.3400 | 15.0692 | 61.7% |
 *
 * ![ssyrk-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-alphaneg3p75.svg)
 *
 * ![ssyrk-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 4.0052 | 0.0102 | 4.8150 | 83.2% |
 * | 128 | 0.0184 | 10.6667 | 0.0149 | 13.1845 | 80.9% |
 * | 256 | 0.0523 | 15.0450 | 0.0247 | 31.8136 | 47.3% |
 * | 512 | 0.1377 | 22.8401 | 0.0814 | 38.6415 | 59.1% |
 * | 1024 | 0.6840 | 18.3952 | 0.4556 | 27.6203 | 66.6% |
 * | 2048 | 5.4044 | 9.3132 | 3.3384 | 15.0767 | 61.8% |
 *
 * ![ssyrk-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-alpha0.svg)
 *
 * ![ssyrk-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0126 | 3.9134 | 0.0110 | 4.4651 | 87.6% |
 * | 128 | 0.0185 | 10.6022 | 0.0164 | 12.0000 | 88.4% |
 * | 256 | 0.0532 | 14.7870 | 0.0262 | 30.0440 | 49.2% |
 * | 512 | 0.1382 | 22.7661 | 0.0837 | 37.5780 | 60.6% |
 * | 1024 | 0.6864 | 18.3322 | 0.4613 | 27.2792 | 67.2% |
 * | 2048 | 5.4335 | 9.2632 | 3.3402 | 15.0686 | 61.5% |
 *
 * ![ssyrk-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-alpha1eneg38.svg)
 *
 * ![ssyrk-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 4.0000 | 0.0110 | 4.4522 | 89.8% |
 * | 128 | 0.0185 | 10.6114 | 0.0159 | 12.3622 | 85.8% |
 * | 256 | 0.0530 | 14.8406 | 0.0261 | 30.1361 | 49.2% |
 * | 512 | 0.1382 | 22.7608 | 0.0836 | 37.6355 | 60.5% |
 * | 1024 | 0.6842 | 18.3905 | 0.4619 | 27.2405 | 67.5% |
 * | 2048 | 5.4363 | 9.2584 | 3.3707 | 14.9322 | 62.0% |
 *
 * ![ssyrk-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-alpha1.svg)
 *
 * ![ssyrk-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 4.0000 | 0.0113 | 4.3329 | 92.3% |
 * | 128 | 0.0185 | 10.6022 | 0.0162 | 12.1423 | 87.3% |
 * | 256 | 0.0527 | 14.9171 | 0.0258 | 30.4913 | 48.9% |
 * | 512 | 0.1384 | 22.7345 | 0.0830 | 37.9186 | 60.0% |
 * | 1024 | 0.6838 | 18.4017 | 0.4608 | 27.3048 | 67.4% |
 * | 2048 | 5.4043 | 9.3133 | 3.3397 | 15.0709 | 61.8% |
 *
 * ![ssyrk-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-alpha2p5.svg)
 *
 * ![ssyrk-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/alpha.ssyrk.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/alpha.ssyrk.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 64 | 0.0123 | 4.0000 | 0.0117 | 4.1967 | 95.3% |
 * | 128 | 0.0186 | 10.5840 | 0.0169 | 11.6584 | 90.8% |
 * | 256 | 0.0529 | 14.8540 | 0.0269 | 29.1876 | 50.9% |
 * | 512 | 0.1382 | 22.7556 | 0.0855 | 36.8111 | 61.8% |
 * | 1024 | 0.6848 | 18.3737 | 0.4631 | 27.1736 | 67.6% |
 * | 2048 | 5.4551 | 9.2265 | 3.3465 | 15.0400 | 61.3% |
 *
 * ![ssyrk-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-betaneg3p75.svg)
 *
 * ![ssyrk-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0120 | 4.1070 | 0.0102 | 4.8000 | 85.6% |
 * | 128 | 0.0184 | 10.6667 | 0.0151 | 13.0584 | 81.7% |
 * | 256 | 0.0524 | 15.0174 | 0.0248 | 31.7519 | 47.3% |
 * | 512 | 0.1375 | 22.8774 | 0.0814 | 38.6415 | 59.2% |
 * | 1024 | 0.6840 | 18.3952 | 0.4563 | 27.5786 | 66.7% |
 * | 2048 | 5.4067 | 9.3091 | 3.3394 | 15.0721 | 61.8% |
 *
 * ![ssyrk-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-beta0.svg)
 *
 * ![ssyrk-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0131 | 3.7418 | 0.0120 | 4.1015 | 91.2% |
 * | 128 | 0.0185 | 10.6482 | 0.0165 | 11.9417 | 89.2% |
 * | 256 | 0.0532 | 14.7692 | 0.0266 | 29.5207 | 50.0% |
 * | 512 | 0.1383 | 22.7424 | 0.0847 | 37.1519 | 61.2% |
 * | 1024 | 0.6845 | 18.3819 | 0.4628 | 27.1896 | 67.6% |
 * | 2048 | 5.4044 | 9.3130 | 3.3774 | 14.9024 | 62.5% |
 *
 * ![ssyrk-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-beta1.svg)
 *
 * ![ssyrk-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 4.0000 | 0.0120 | 4.1124 | 97.3% |
 * | 128 | 0.0186 | 10.5840 | 0.0164 | 11.9533 | 88.5% |
 * | 256 | 0.0531 | 14.8182 | 0.0267 | 29.4853 | 50.3% |
 * | 512 | 0.1387 | 22.6847 | 0.0847 | 37.1519 | 61.1% |
 * | 1024 | 0.6840 | 18.3952 | 0.4628 | 27.1858 | 67.7% |
 * | 2048 | 5.4382 | 9.2552 | 3.3772 | 14.9036 | 62.1% |
 *
 * ![ssyrk-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-beta2p5.svg)
 *
 * ![ssyrk-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/beta.ssyrk.js) — WebGPU beta-sweep benchmark script
 * - [beta.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/beta.ssyrk.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 64 | 0.0126 | 3.9084 |
 * | 128 | 0.0188 | 10.4757 |
 * | 256 | 0.0492 | 16.0000 |
 * | 512 | 0.1309 | 24.0381 |
 * | 1024 | 0.5475 | 22.9843 |
 * | 2048 | 4.2407 | 11.8687 |
 *
 * ![ssyrk-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-layoutcolumnmajor.svg)
 *
 * ![ssyrk-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0123 | 4.0104 |
 * | 128 | 0.0184 | 10.6667 |
 * | 256 | 0.0522 | 15.0773 |
 * | 512 | 0.1376 | 22.8641 |
 * | 1024 | 0.6840 | 18.3952 |
 * | 2048 | 5.4381 | 9.2554 |
 *
 * ![ssyrk-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-layoutrowmajor.svg)
 *
 * ![ssyrk-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/layout.ssyrk.js) — WebGPU layout-sweep benchmark script
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
 * | 64 | 0.0122 | 4.0421 | 0.0102 | 4.8000 | 84.2% |
 * | 128 | 0.0184 | 10.6667 | 0.0150 | 13.1002 | 81.4% |
 * | 256 | 0.0525 | 14.9717 | 0.0247 | 31.7930 | 47.1% |
 * | 512 | 0.1376 | 22.8614 | 0.0812 | 38.7329 | 59.0% |
 * | 1024 | 0.6841 | 18.3922 | 0.4556 | 27.6164 | 66.6% |
 * | 2048 | 5.4321 | 9.2656 | 3.3389 | 15.0741 | 61.5% |
 *
 * ![ssyrk-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad0.svg)
 *
 * ![ssyrk-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0129 | 3.8114 | 0.0111 | 4.4393 | 85.9% |
 * | 128 | 0.0186 | 10.5476 | 0.0160 | 12.3126 | 85.7% |
 * | 256 | 0.0532 | 14.7692 | 0.0264 | 29.7530 | 49.6% |
 * | 512 | 0.1393 | 22.5882 | 0.0833 | 37.7512 | 59.8% |
 * | 1024 | 0.6882 | 18.2836 | 0.4609 | 27.3029 | 67.0% |
 * | 2048 | 5.4312 | 9.2672 | 3.3419 | 15.0608 | 61.5% |
 *
 * ![ssyrk-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad1.svg)
 *
 * ![ssyrk-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0125 | 3.9184 | 0.0114 | 4.3025 | 91.1% |
 * | 128 | 0.0185 | 10.6114 | 0.0164 | 12.0235 | 88.3% |
 * | 256 | 0.0532 | 14.7692 | 0.0259 | 30.3407 | 48.7% |
 * | 512 | 0.1393 | 22.5882 | 0.0831 | 37.8675 | 59.7% |
 * | 1024 | 0.6885 | 18.2768 | 0.4608 | 27.3038 | 66.9% |
 * | 2048 | 5.4298 | 9.2696 | 3.3409 | 15.0651 | 61.5% |
 *
 * ![ssyrk-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad8.svg)
 *
 * ![ssyrk-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0123 | 3.9948 | 0.0113 | 4.3636 | 91.5% |
 * | 128 | 0.0185 | 10.6206 | 0.0162 | 12.1303 | 87.6% |
 * | 256 | 0.0532 | 14.7692 | 0.0264 | 29.7891 | 49.6% |
 * | 512 | 0.1392 | 22.5908 | 0.0829 | 37.9479 | 59.5% |
 * | 1024 | 0.6880 | 18.2891 | 0.4608 | 27.3048 | 67.0% |
 * | 2048 | 5.4256 | 9.2766 | 3.3401 | 15.0691 | 61.6% |
 *
 * ![ssyrk-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad16.svg)
 *
 * ![ssyrk-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0126 | 3.9034 | 0.0114 | 4.3025 | 90.7% |
 * | 128 | 0.0184 | 10.6667 | 0.0163 | 12.0945 | 88.2% |
 * | 256 | 0.0532 | 14.7692 | 0.0258 | 30.4724 | 48.5% |
 * | 512 | 0.1393 | 22.5882 | 0.0828 | 37.9699 | 59.5% |
 * | 1024 | 0.6855 | 18.3549 | 0.4609 | 27.2991 | 67.2% |
 * | 2048 | 5.4491 | 9.2366 | 3.3383 | 15.0770 | 61.3% |
 *
 * ![ssyrk-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad32.svg)
 *
 * ![ssyrk-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0125 | 3.9385 | 0.0113 | 4.3636 | 90.3% |
 * | 128 | 0.0185 | 10.6390 | 0.0160 | 12.2512 | 86.8% |
 * | 256 | 0.0532 | 14.7692 | 0.0258 | 30.4913 | 48.4% |
 * | 512 | 0.1397 | 22.5235 | 0.0829 | 37.9259 | 59.4% |
 * | 1024 | 0.6881 | 18.2861 | 0.4608 | 27.3038 | 67.0% |
 * | 2048 | 5.4622 | 9.2145 | 3.3397 | 15.0709 | 61.1% |
 *
 * ![ssyrk-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad48.svg)
 *
 * ![ssyrk-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0125 | 3.9234 | 0.0111 | 4.4457 | 88.3% |
 * | 128 | 0.0184 | 10.6574 | 0.0164 | 12.0000 | 88.8% |
 * | 256 | 0.0530 | 14.8361 | 0.0261 | 30.0992 | 49.3% |
 * | 512 | 0.1393 | 22.5882 | 0.0840 | 37.4634 | 60.3% |
 * | 1024 | 0.6848 | 18.3746 | 0.4610 | 27.2962 | 67.3% |
 * | 2048 | 5.4118 | 9.3003 | 3.3386 | 15.0757 | 61.7% |
 *
 * ![ssyrk-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad64.svg)
 *
 * ![ssyrk-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0124 | 3.9690 | 0.0114 | 4.3207 | 91.9% |
 * | 128 | 0.0185 | 10.6298 | 0.0161 | 12.1784 | 87.3% |
 * | 256 | 0.0530 | 14.8495 | 0.0259 | 30.4158 | 48.8% |
 * | 512 | 0.1392 | 22.6038 | 0.0829 | 37.9332 | 59.6% |
 * | 1024 | 0.6846 | 18.3793 | 0.4608 | 27.3067 | 67.3% |
 * | 2048 | 5.4530 | 9.2300 | 3.3384 | 15.0765 | 61.2% |
 *
 * ![ssyrk-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-ldcpad128.svg)
 *
 * ![ssyrk-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/ldc.ssyrk.js) — WebGPU ldc-sweep benchmark script
 * - [ldc.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/ldc.ssyrk.c) — CUDA / cuBLAS ldc-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyrk
 */
