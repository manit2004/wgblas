/**
 * Benchmark results for ssyrk on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 0.9309 | 0.0080 | 1.0261 | 90.7% |
 * | 64 | 0.0115 | 2.8484 | 0.0102 | 3.2100 | 88.7% |
 * | 128 | 0.0184 | 7.1111 | 0.0149 | 8.7803 | 81.0% |
 * | 256 | 0.0655 | 8.0000 | 0.0249 | 21.0862 | 37.9% |
 * | 512 | 0.2414 | 8.6872 | 0.0808 | 25.9600 | 33.5% |
 * | 1024 | 1.7471 | 4.8015 | 0.4557 | 18.4090 | 26.1% |
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
 * | 256 | 0.1027 | 5.1048 | 0.0249 | 21.0456 | 24.3% |
 * | 512 | 0.3377 | 6.2105 | 0.0820 | 25.5850 | 24.3% |
 * | 1024 | 2.4513 | 3.4220 | 0.4562 | 18.3883 | 18.6% |
 * | 2048 | 18.6242 | 1.8017 | 3.4020 | 9.8631 | 18.3% |
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
 * | 256 | 0.0655 | 8.0000 | 0.0313 | 16.7440 | 47.8% |
 * | 512 | 0.2395 | 8.7551 | 0.0962 | 21.7981 | 40.2% |
 * | 1024 | 1.7401 | 4.8208 | 0.5066 | 16.5579 | 29.1% |
 * | 2048 | 12.2204 | 2.7458 | 4.0042 | 8.3798 | 32.8% |
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
 * | 64 | 0.0120 | 4.0905 | 0.0102 | 4.8000 | 85.2% |
 * | 128 | 0.0230 | 8.5452 | 0.0151 | 13.0032 | 65.7% |
 * | 256 | 0.1024 | 7.6800 | 0.0250 | 31.4674 | 24.4% |
 * | 512 | 0.3376 | 9.3188 | 0.0817 | 38.4902 | 24.2% |
 * | 1024 | 2.4428 | 5.1511 | 0.4563 | 27.5738 | 18.7% |
 * | 2048 | 18.9732 | 2.6528 | 3.5554 | 14.1564 | 18.7% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0117 | 4.1853 | 95.6% |
 * | 128 | 0.0240 | 8.2029 | 0.0164 | 12.0000 | 68.4% |
 * | 256 | 0.1024 | 7.6800 | 0.0296 | 26.6118 | 28.9% |
 * | 512 | 0.3377 | 9.3157 | 0.0851 | 36.9703 | 25.2% |
 * | 1024 | 2.4451 | 5.1463 | 0.4636 | 27.1389 | 19.0% |
 * | 2048 | 18.9908 | 2.6503 | 3.4033 | 14.7891 | 17.9% |
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
 * | 512 | 0.3386 | 6.1943 | 0.0837 | 25.0664 | 24.7% |
 * | 1024 | 2.4465 | 3.4288 | 0.4911 | 17.0806 | 20.1% |
 * | 2048 | 18.6276 | 1.8013 | 3.4610 | 9.6951 | 18.6% |
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
 * | 512 | 0.2355 | 8.9043 | 0.0939 | 22.3367 | 39.9% |
 * | 1024 | 1.8598 | 4.5104 | 0.5308 | 15.8047 | 28.5% |
 * | 2048 | 17.8306 | 1.8818 | 3.4049 | 9.8547 | 19.1% |
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
 * | 512 | 0.2191 | 9.5722 | 0.0875 | 23.9576 | 40.0% |
 * | 1024 | 1.6937 | 4.9528 | 0.4650 | 18.0403 | 27.5% |
 * | 2048 | 13.9674 | 2.4023 | 4.4458 | 7.5474 | 31.8% |
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
 * | 512 | 0.2485 | 8.4399 | 0.0916 | 22.8827 | 36.9% |
 * | 1024 | 1.8924 | 4.4329 | 0.4812 | 17.4333 | 25.4% |
 * | 2048 | 15.4007 | 2.1788 | 5.7608 | 5.8246 | 37.4% |
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
 * | 512 | 0.3362 | 6.2386 | 0.0936 | 22.4093 | 27.8% |
 * | 1024 | 2.4763 | 3.3876 | 0.5241 | 16.0044 | 21.2% |
 * | 2048 | 19.1765 | 1.7498 | 4.4195 | 7.5924 | 23.0% |
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
 * | 512 | 0.3369 | 6.2255 | 0.0924 | 22.7082 | 27.4% |
 * | 1024 | 2.5065 | 3.3467 | 0.4731 | 17.7316 | 18.9% |
 * | 2048 | 19.4433 | 1.7258 | 5.7613 | 5.8241 | 29.6% |
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
 * | 512 | 0.2387 | 8.7856 | 0.0974 | 21.5402 | 40.8% |
 * | 1024 | 1.7452 | 4.8068 | 0.5727 | 14.6478 | 32.8% |
 * | 2048 | 12.2212 | 2.7456 | 3.7564 | 8.9326 | 30.7% |
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
 * | 512 | 0.2367 | 8.8586 | 0.1022 | 20.5281 | 43.2% |
 * | 1024 | 1.7312 | 4.8456 | 0.5260 | 15.9465 | 30.4% |
 * | 2048 | 12.3796 | 2.7105 | 3.9793 | 8.4322 | 32.1% |
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
 * | 512 | 0.2356 | 8.8995 | 0.0995 | 21.0761 | 42.2% |
 * | 1024 | 1.6976 | 4.9413 | 0.4958 | 16.9207 | 29.2% |
 * | 2048 | 12.0254 | 2.7903 | 3.9154 | 8.5699 | 32.6% |
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
 * | 512 | 0.2376 | 8.8276 | 0.0963 | 21.7764 | 40.5% |
 * | 1024 | 1.7157 | 4.8894 | 0.4967 | 16.8875 | 29.0% |
 * | 2048 | 12.1462 | 2.7626 | 3.9173 | 8.5657 | 32.3% |
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
 * | 512 | 0.2403 | 8.7288 | 0.0973 | 21.5614 | 40.5% |
 * | 1024 | 1.7530 | 4.7853 | 0.5114 | 16.4035 | 29.2% |
 * | 2048 | 12.4054 | 2.7048 | 4.0868 | 8.2103 | 32.9% |
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
 * | 512 | 0.2408 | 8.7091 | 0.0942 | 22.2609 | 39.1% |
 * | 1024 | 1.7593 | 4.7682 | 0.5142 | 16.3152 | 29.2% |
 * | 2048 | 12.4080 | 2.7043 | 3.8143 | 8.7969 | 30.7% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0120 | 4.1070 | 97.4% |
 * | 128 | 0.0232 | 8.4745 | 0.0183 | 10.7601 | 78.8% |
 * | 256 | 0.1035 | 7.5957 | 0.0311 | 25.2840 | 30.0% |
 * | 512 | 0.3380 | 9.3082 | 0.0922 | 34.1333 | 27.3% |
 * | 1024 | 2.4528 | 5.1300 | 0.4651 | 27.0558 | 19.0% |
 * | 2048 | 18.9757 | 2.6524 | 3.5451 | 14.1976 | 18.7% |
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
 * | 64 | 0.0122 | 4.0315 | 0.0122 | 4.0368 | 99.9% |
 * | 128 | 0.0228 | 8.6292 | 0.0181 | 10.8455 | 79.6% |
 * | 256 | 0.1026 | 7.6656 | 0.0296 | 26.5974 | 28.8% |
 * | 512 | 0.3379 | 9.3091 | 0.0871 | 36.1279 | 25.8% |
 * | 1024 | 2.4433 | 5.1500 | 0.4650 | 27.0614 | 19.0% |
 * | 2048 | 18.9661 | 2.6538 | 3.4384 | 14.6380 | 18.1% |
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
 * | 64 | 0.0122 | 4.0315 | 0.0113 | 4.3451 | 92.8% |
 * | 128 | 0.0236 | 8.3478 | 0.0166 | 11.8725 | 70.3% |
 * | 256 | 0.1032 | 7.6228 | 0.0276 | 28.4609 | 26.8% |
 * | 512 | 0.3382 | 9.3016 | 0.0860 | 36.5987 | 25.4% |
 * | 1024 | 2.4431 | 5.1505 | 0.4615 | 27.2678 | 18.9% |
 * | 2048 | 18.9860 | 2.6510 | 3.5051 | 14.3597 | 18.5% |
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
 * | 64 | 0.0122 | 4.0315 | 0.0119 | 4.1402 | 97.4% |
 * | 128 | 0.0232 | 8.4570 | 0.0181 | 10.8360 | 78.0% |
 * | 256 | 0.1036 | 7.5887 | 0.0320 | 24.6006 | 30.8% |
 * | 512 | 0.3379 | 9.3100 | 0.0924 | 34.0270 | 27.4% |
 * | 1024 | 2.4465 | 5.1432 | 0.4655 | 27.0335 | 19.0% |
 * | 2048 | 18.9733 | 2.6528 | 3.3736 | 14.9193 | 17.8% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0118 | 4.1570 | 96.2% |
 * | 128 | 0.0230 | 8.5393 | 0.0182 | 10.8074 | 79.0% |
 * | 256 | 0.1036 | 7.5946 | 0.0317 | 24.7992 | 30.6% |
 * | 512 | 0.3379 | 9.3091 | 0.0924 | 34.0565 | 27.3% |
 * | 1024 | 2.4492 | 5.1375 | 0.4649 | 27.0651 | 19.0% |
 * | 2048 | 18.9653 | 2.6539 | 3.4359 | 14.6488 | 18.1% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0123 | 4.0000 | 100.0% |
 * | 128 | 0.0235 | 8.3763 | 0.0183 | 10.7225 | 78.1% |
 * | 256 | 0.1031 | 7.6264 | 0.0306 | 25.6803 | 29.7% |
 * | 512 | 0.3379 | 9.3095 | 0.0881 | 35.6950 | 26.1% |
 * | 1024 | 2.4500 | 5.1358 | 0.4632 | 27.1624 | 18.9% |
 * | 2048 | 18.9893 | 2.6505 | 3.5787 | 14.0642 | 18.8% |
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
 * | 64 | 0.0122 | 4.0315 | 0.0104 | 4.7262 | 85.3% |
 * | 128 | 0.0233 | 8.4338 | 0.0156 | 12.6420 | 66.7% |
 * | 256 | 0.1024 | 7.6800 | 0.0258 | 30.4724 | 25.2% |
 * | 512 | 0.3376 | 9.3184 | 0.0836 | 37.6427 | 24.8% |
 * | 1024 | 2.4430 | 5.1505 | 0.5122 | 24.5683 | 21.0% |
 * | 2048 | 18.9627 | 2.6543 | 5.7283 | 8.7866 | 30.2% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0124 | 3.9537 | 101.2% |
 * | 128 | 0.0233 | 8.4222 | 0.0190 | 10.3434 | 81.4% |
 * | 256 | 0.1034 | 7.6051 | 0.0294 | 26.7130 | 28.5% |
 * | 512 | 0.3380 | 9.3060 | 0.0919 | 34.2463 | 27.2% |
 * | 1024 | 2.4431 | 5.1504 | 0.4700 | 26.7740 | 19.2% |
 * | 2048 | 18.9535 | 2.6555 | 3.5522 | 14.1692 | 18.7% |
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
 * | 64 | 0.0122 | 4.0421 | 0.0122 | 4.0421 | 100.0% |
 * | 128 | 0.0232 | 8.4862 | 0.0182 | 10.8074 | 78.5% |
 * | 256 | 0.1032 | 7.6169 | 0.0286 | 27.5207 | 27.7% |
 * | 512 | 0.3378 | 9.3122 | 0.0920 | 34.2046 | 27.2% |
 * | 1024 | 2.4433 | 5.1500 | 0.4760 | 26.4338 | 19.5% |
 * | 2048 | 18.9930 | 2.6500 | 3.5505 | 14.1759 | 18.7% |
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
 * | 64 | 0.0116 | 4.2256 |
 * | 128 | 0.0184 | 10.6667 |
 * | 256 | 0.0657 | 11.9766 |
 * | 512 | 0.2417 | 13.0169 |
 * | 1024 | 1.7445 | 7.2131 |
 * | 2048 | 12.9914 | 3.8742 |
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
 * | 64 | 0.0121 | 4.0528 |
 * | 128 | 0.0229 | 8.5930 |
 * | 256 | 0.1024 | 7.6788 |
 * | 512 | 0.3379 | 9.3091 |
 * | 1024 | 2.4471 | 5.1419 |
 * | 2048 | 18.9958 | 2.6496 |
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
 * | 64 | 0.0121 | 4.0743 | 0.0102 | 4.8000 | 84.9% |
 * | 128 | 0.0229 | 8.5690 | 0.0158 | 12.4372 | 68.9% |
 * | 256 | 0.1024 | 7.6800 | 0.0254 | 31.0107 | 24.8% |
 * | 512 | 0.3380 | 9.3082 | 0.0819 | 38.4150 | 24.2% |
 * | 1024 | 2.4491 | 5.1378 | 0.4557 | 27.6145 | 18.6% |
 * | 2048 | 18.9717 | 2.6530 | 3.7276 | 13.5025 | 19.6% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0116 | 4.2372 | 94.4% |
 * | 128 | 0.0235 | 8.3535 | 0.0170 | 11.5925 | 72.1% |
 * | 256 | 0.1032 | 7.6205 | 0.0294 | 26.7858 | 28.4% |
 * | 512 | 0.3380 | 9.3069 | 0.0844 | 37.2717 | 25.0% |
 * | 1024 | 2.4454 | 5.1455 | 0.4620 | 27.2348 | 18.9% |
 * | 2048 | 19.0048 | 2.6484 | 3.4053 | 14.7805 | 17.9% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0114 | 4.2965 | 93.1% |
 * | 128 | 0.0231 | 8.5156 | 0.0169 | 11.6364 | 73.2% |
 * | 256 | 0.1033 | 7.6110 | 0.0283 | 27.8009 | 27.4% |
 * | 512 | 0.3385 | 9.2941 | 0.1077 | 29.2180 | 31.8% |
 * | 1024 | 2.4497 | 5.1365 | 0.4708 | 26.7285 | 19.2% |
 * | 2048 | 19.0006 | 2.6489 | 3.6125 | 13.9325 | 19.0% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0118 | 4.1514 | 96.4% |
 * | 128 | 0.0231 | 8.4979 | 0.0165 | 11.9070 | 71.4% |
 * | 256 | 0.1039 | 7.5665 | 0.0273 | 28.8113 | 26.3% |
 * | 512 | 0.3379 | 9.3091 | 0.0898 | 35.0335 | 26.6% |
 * | 1024 | 2.4453 | 5.1458 | 0.4649 | 27.0661 | 19.0% |
 * | 2048 | 19.0052 | 2.6483 | 3.7396 | 13.4589 | 19.7% |
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
 * | 64 | 0.0122 | 4.0368 | 0.0117 | 4.1910 | 96.3% |
 * | 128 | 0.0230 | 8.5333 | 0.0168 | 11.7140 | 72.8% |
 * | 256 | 0.1039 | 7.5688 | 0.0306 | 25.6803 | 29.5% |
 * | 512 | 0.3379 | 9.3091 | 0.0860 | 36.5714 | 25.5% |
 * | 1024 | 2.4514 | 5.1329 | 0.4616 | 27.2603 | 18.8% |
 * | 2048 | 18.9950 | 2.6497 | 3.4028 | 14.7912 | 17.9% |
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
 * | 64 | 0.0123 | 4.0000 | 0.0122 | 4.0315 | 99.2% |
 * | 128 | 0.0236 | 8.3478 | 0.0169 | 11.6144 | 71.9% |
 * | 256 | 0.1036 | 7.5887 | 0.0282 | 27.8482 | 27.3% |
 * | 512 | 0.3380 | 9.3064 | 0.0879 | 35.7990 | 26.0% |
 * | 1024 | 2.4528 | 5.1300 | 0.4729 | 26.6100 | 19.3% |
 * | 2048 | 19.0057 | 2.6482 | 3.6127 | 13.9320 | 19.0% |
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
 * | 64 | 0.0122 | 4.0209 | 0.0117 | 4.2025 | 95.7% |
 * | 128 | 0.0232 | 8.4745 | 0.0165 | 11.8955 | 71.2% |
 * | 256 | 0.1041 | 7.5572 | 0.0273 | 28.8113 | 26.2% |
 * | 512 | 0.3379 | 9.3091 | 0.0898 | 35.0273 | 26.6% |
 * | 1024 | 2.4517 | 5.1322 | 0.4653 | 27.0428 | 19.0% |
 * | 2048 | 18.9974 | 2.6494 | 3.7637 | 13.3730 | 19.8% |
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
 * | 64 | 0.0123 | 4.0104 | 0.0118 | 4.1739 | 96.1% |
 * | 128 | 0.0231 | 8.5156 | 0.0164 | 11.9766 | 71.1% |
 * | 256 | 0.1036 | 7.5910 | 0.0302 | 26.0753 | 29.1% |
 * | 512 | 0.3377 | 9.3161 | 0.0854 | 36.8180 | 25.3% |
 * | 1024 | 2.4506 | 5.1345 | 0.4617 | 27.2556 | 18.8% |
 * | 2048 | 18.9924 | 2.6501 | 3.4029 | 14.7909 | 17.9% |
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
