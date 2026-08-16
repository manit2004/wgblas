/**
 * Benchmark results for ssyr2k on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0164 | 0.7500 | 0.0161 | 0.7649 | 98.1% |
 * | 64 | 0.0226 | 2.1772 | 0.0225 | 2.1818 | 99.8% |
 * | 128 | 0.0424 | 4.6387 | 0.0326 | 6.0235 | 77.0% |
 * | 256 | 0.1636 | 4.8080 | 0.0549 | 14.3259 | 33.6% |
 * | 512 | 0.5920 | 5.3140 | 0.1823 | 17.2569 | 30.8% |
 * | 1024 | 4.2568 | 2.9560 | 1.0230 | 12.3005 | 24.0% |
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
 * | 256 | 0.2584 | 3.0437 | 0.0631 | 12.4688 | 24.4% |
 * | 512 | 0.8652 | 3.6360 | 0.2111 | 14.9036 | 24.4% |
 * | 1024 | 4.9046 | 2.5655 | 1.1854 | 10.6145 | 24.2% |
 * | 2048 | 37.0668 | 1.3579 | 7.6984 | 6.5379 | 20.8% |
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
 * | 256 | 0.1264 | 6.2233 | 0.0600 | 13.1037 | 47.5% |
 * | 512 | 0.4708 | 6.6812 | 0.1867 | 16.8531 | 39.6% |
 * | 1024 | 3.4580 | 3.6387 | 1.0238 | 12.2905 | 29.6% |
 * | 2048 | 24.3519 | 2.0669 | 7.0502 | 7.1390 | 29.0% |
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
 * | 512 | 0.8646 | 3.6385 | 0.2096 | 15.0094 | 24.2% |
 * | 1024 | 4.9411 | 2.5466 | 1.1857 | 10.6121 | 24.0% |
 * | 2048 | 37.0573 | 1.3582 | 6.5787 | 7.6507 | 17.8% |
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
 * | 512 | 0.5864 | 5.3646 | 0.1825 | 17.2388 | 31.1% |
 * | 1024 | 3.7044 | 3.3967 | 0.9371 | 13.4279 | 25.3% |
 * | 2048 | 35.1422 | 1.4322 | 6.6347 | 7.5862 | 18.9% |
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
 * | 512 | 0.5527 | 5.6919 | 0.1813 | 17.3483 | 32.8% |
 * | 1024 | 3.3584 | 3.7467 | 0.9333 | 13.4827 | 27.8% |
 * | 2048 | 27.9512 | 1.8007 | 6.6158 | 7.6078 | 23.7% |
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
 * | 512 | 0.6431 | 4.8917 | 0.1761 | 17.8605 | 27.4% |
 * | 1024 | 3.7754 | 3.3329 | 0.9320 | 13.5010 | 24.7% |
 * | 2048 | 30.7421 | 1.6372 | 6.6254 | 7.5968 | 21.6% |
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
 * | 512 | 0.8645 | 3.6389 | 0.1823 | 17.2524 | 21.1% |
 * | 1024 | 4.9235 | 2.5557 | 0.9318 | 13.5033 | 18.9% |
 * | 2048 | 38.3435 | 1.3127 | 6.5718 | 7.6587 | 17.1% |
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
 * | 512 | 0.8648 | 3.6375 | 0.1760 | 17.8718 | 20.4% |
 * | 1024 | 4.9849 | 2.5242 | 0.9393 | 13.3959 | 18.8% |
 * | 2048 | 38.8478 | 1.2956 | 6.5805 | 7.6486 | 16.9% |
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
 * | 512 | 0.4688 | 6.7095 | 0.1941 | 16.2084 | 41.4% |
 * | 1024 | 3.4693 | 3.6269 | 1.0325 | 12.1873 | 29.8% |
 * | 2048 | 24.4449 | 2.0590 | 7.0898 | 7.0991 | 29.0% |
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
 * | 512 | 0.4643 | 6.7747 | 0.1960 | 16.0496 | 42.2% |
 * | 1024 | 3.4437 | 3.6539 | 1.0780 | 11.6721 | 31.3% |
 * | 2048 | 24.6881 | 2.0387 | 7.3393 | 6.8579 | 29.7% |
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
 * | 512 | 0.4628 | 6.7965 | 0.1916 | 16.4196 | 41.4% |
 * | 1024 | 3.3726 | 3.7309 | 1.0240 | 12.2886 | 30.4% |
 * | 2048 | 24.0245 | 2.0950 | 7.1687 | 7.0211 | 29.8% |
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
 * | 512 | 0.4688 | 6.7104 | 0.1907 | 16.4967 | 40.7% |
 * | 1024 | 3.4218 | 3.6773 | 1.0206 | 12.3286 | 29.8% |
 * | 2048 | 24.3062 | 2.0707 | 7.0943 | 7.0947 | 29.2% |
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
 * | 512 | 0.4731 | 6.6494 | 0.1959 | 16.0614 | 41.4% |
 * | 1024 | 3.4943 | 3.6010 | 1.0459 | 12.0303 | 29.9% |
 * | 2048 | 24.7647 | 2.0324 | 7.2645 | 6.9284 | 29.3% |
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
 * | 512 | 0.4733 | 6.6467 | 0.2018 | 15.5865 | 42.6% |
 * | 1024 | 3.5001 | 3.5951 | 1.0926 | 11.5169 | 31.2% |
 * | 2048 | 24.7978 | 2.0297 | 7.2059 | 6.9848 | 29.1% |
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
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2k
 */
