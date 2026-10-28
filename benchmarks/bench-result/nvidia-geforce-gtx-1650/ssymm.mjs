/**
 * Benchmark results for ssymm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0118 | 2.0898 | 0.0058 | 4.2667 | 49.0% |
 * | 64 | 0.0142 | 6.9189 | 0.0083 | 11.8610 | 58.3% |
 * | 128 | 0.0224 | 17.5292 | 0.0243 | 16.2111 | 108.1% |
 * | 256 | 0.0798 | 19.7160 | 0.1098 | 14.3217 | 137.7% |
 * | 512 | 0.2064 | 30.4866 | 0.2556 | 24.6160 | 123.8% |
 * | 1024 | 1.3479 | 18.6708 | 1.4520 | 17.3324 | 107.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-default.svg)
 *
 * ![ssymm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ssymm.js) — WebGPU benchmark script
 * - [ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ssymm.c) — CUDA / cuBLAS reference script
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
 * | 64 | 0.0140 | 7.0217 | 0.0084 | 11.7701 | 59.7% |
 * | 128 | 0.0220 | 17.8995 | 0.0243 | 16.2111 | 110.4% |
 * | 256 | 0.0779 | 20.1898 | 0.1097 | 14.3321 | 140.9% |
 * | 512 | 0.1884 | 33.3970 | 0.2552 | 24.6484 | 135.5% |
 * | 1024 | 1.2021 | 20.9344 | 1.6284 | 15.4539 | 135.5% |
 * | 2048 | 9.6978 | 10.3800 | 11.7186 | 8.5901 | 120.8% |
 *
 * ![ssymm-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-uplolower.svg)
 *
 * ![ssymm-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0146 | 6.7368 | 0.0090 | 10.8743 | 62.0% |
 * | 128 | 0.0225 | 17.4545 | 0.0259 | 15.1610 | 115.1% |
 * | 256 | 0.0793 | 19.8234 | 0.1187 | 13.2467 | 149.6% |
 * | 512 | 0.1883 | 33.4197 | 0.2601 | 24.1890 | 138.2% |
 * | 1024 | 1.2022 | 20.9336 | 1.6235 | 15.5014 | 135.0% |
 * | 2048 | 9.6974 | 10.3805 | 11.6991 | 8.6043 | 120.6% |
 *
 * ![ssymm-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-uploupper.svg)
 *
 * ![ssymm-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/uplo.ssymm.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/uplo.ssymm.c) — CUDA / cuBLAS uplo-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0139 | 7.0621 | 0.0084 | 11.7476 | 60.1% |
 * | 128 | 0.0222 | 17.7444 | 0.0243 | 16.1897 | 109.6% |
 * | 256 | 0.0778 | 20.2105 | 0.1100 | 14.3050 | 141.3% |
 * | 512 | 0.1884 | 33.3913 | 0.2557 | 24.6052 | 135.7% |
 * | 1024 | 1.2003 | 20.9668 | 1.6238 | 15.4980 | 135.3% |
 * | 2048 | 9.6112 | 10.4735 | 11.7088 | 8.5973 | 121.8% |
 *
 * ![ssymm-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad0.svg)
 *
 * ![ssymm-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0088 | 11.2117 | 61.2% |
 * | 128 | 0.0222 | 17.7061 | 0.0236 | 16.6279 | 106.5% |
 * | 256 | 0.0790 | 19.9198 | 0.1004 | 15.6735 | 127.1% |
 * | 512 | 0.1904 | 33.0406 | 0.2614 | 24.0676 | 137.3% |
 * | 1024 | 1.2043 | 20.8963 | 1.6406 | 15.3398 | 136.2% |
 * | 2048 | 9.6494 | 10.4321 | 12.0259 | 8.3706 | 124.6% |
 *
 * ![ssymm-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad1.svg)
 *
 * ![ssymm-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0093 | 10.5931 | 64.7% |
 * | 128 | 0.0223 | 17.6172 | 0.0242 | 16.2325 | 108.5% |
 * | 256 | 0.0794 | 19.8154 | 0.1026 | 15.3265 | 129.3% |
 * | 512 | 0.1901 | 33.0962 | 0.2574 | 24.4461 | 135.4% |
 * | 1024 | 1.2042 | 20.8980 | 1.6255 | 15.4817 | 135.0% |
 * | 2048 | 9.6932 | 10.3849 | 11.8825 | 8.4716 | 122.6% |
 *
 * ![ssymm-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad8.svg)
 *
 * ![ssymm-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0091 | 10.8551 | 63.2% |
 * | 128 | 0.0225 | 17.4918 | 0.0259 | 15.1704 | 115.3% |
 * | 256 | 0.0793 | 19.8234 | 0.1101 | 14.2801 | 138.8% |
 * | 512 | 0.1901 | 33.0906 | 0.2574 | 24.4446 | 135.4% |
 * | 1024 | 1.2063 | 20.8619 | 1.6077 | 15.6535 | 133.3% |
 * | 2048 | 9.6930 | 10.3851 | 11.6725 | 8.6240 | 120.4% |
 *
 * ![ssymm-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad16.svg)
 *
 * ![ssymm-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0093 | 10.5749 | 64.8% |
 * | 128 | 0.0223 | 17.6172 | 0.0266 | 14.7870 | 119.1% |
 * | 256 | 0.0792 | 19.8514 | 0.1147 | 13.7143 | 144.7% |
 * | 512 | 0.1906 | 33.0073 | 0.2614 | 24.0661 | 137.2% |
 * | 1024 | 1.2025 | 20.9285 | 1.6354 | 15.3880 | 136.0% |
 * | 2048 | 9.7020 | 10.3756 | 11.8463 | 8.4974 | 122.1% |
 *
 * ![ssymm-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad32.svg)
 *
 * ![ssymm-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0141 | 6.9502 | 0.0093 | 10.5205 | 66.1% |
 * | 128 | 0.0222 | 17.6806 | 0.0251 | 15.6735 | 112.8% |
 * | 256 | 0.0792 | 19.8474 | 0.1088 | 14.4607 | 137.3% |
 * | 512 | 0.1905 | 33.0323 | 0.2560 | 24.5775 | 134.4% |
 * | 1024 | 1.2079 | 20.8340 | 1.6258 | 15.4794 | 134.6% |
 * | 2048 | 9.7290 | 10.3467 | 11.8448 | 8.4986 | 121.7% |
 *
 * ![ssymm-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad48.svg)
 *
 * ![ssymm-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0095 | 10.3434 | 66.3% |
 * | 128 | 0.0225 | 17.4670 | 0.0263 | 14.9580 | 116.8% |
 * | 256 | 0.0790 | 19.9077 | 0.1144 | 13.7527 | 144.8% |
 * | 512 | 0.1899 | 33.1352 | 0.2600 | 24.1994 | 136.9% |
 * | 1024 | 1.2111 | 20.7790 | 1.6279 | 15.4587 | 134.4% |
 * | 2048 | 9.7281 | 10.3477 | 11.9928 | 8.3936 | 123.3% |
 *
 * ![ssymm-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad64.svg)
 *
 * ![ssymm-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0142 | 6.9189 | 0.0097 | 10.1386 | 68.2% |
 * | 128 | 0.0224 | 17.5920 | 0.0261 | 15.0866 | 116.6% |
 * | 256 | 0.0789 | 19.9278 | 0.1138 | 13.8164 | 144.2% |
 * | 512 | 0.1905 | 33.0239 | 0.2579 | 24.3946 | 135.4% |
 * | 1024 | 1.2089 | 20.8175 | 1.6474 | 15.2757 | 136.3% |
 * | 2048 | 9.7179 | 10.3585 | 13.2061 | 7.6225 | 135.9% |
 *
 * ![ssymm-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad128.svg)
 *
 * ![ssymm-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/lda.ssymm.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/lda.ssymm.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 64 | 0.0140 | 6.9977 | 0.0083 | 11.8610 | 59.0% |
 * | 128 | 0.0224 | 17.5794 | 0.0243 | 16.2111 | 108.4% |
 * | 256 | 0.0781 | 20.1443 | 0.1097 | 14.3321 | 140.6% |
 * | 512 | 0.1884 | 33.3913 | 0.2564 | 24.5392 | 136.1% |
 * | 1024 | 1.1999 | 20.9729 | 1.6198 | 15.5360 | 135.0% |
 * | 2048 | 9.6936 | 10.3845 | 11.7120 | 8.5949 | 120.8% |
 *
 * ![ssymm-ldbpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad0.svg)
 *
 * ![ssymm-ldbpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0092 | 10.7413 | 63.8% |
 * | 128 | 0.0225 | 17.4545 | 0.0266 | 14.7692 | 118.2% |
 * | 256 | 0.0765 | 20.5657 | 0.1152 | 13.6552 | 150.6% |
 * | 512 | 0.2224 | 28.2889 | 0.2630 | 23.9197 | 118.3% |
 * | 1024 | 1.4566 | 17.2768 | 1.6305 | 15.4342 | 111.9% |
 * | 2048 | 11.2369 | 8.9583 | 11.9394 | 8.4312 | 106.3% |
 *
 * ![ssymm-ldbpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad1.svg)
 *
 * ![ssymm-ldbpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0093 | 10.5567 | 65.0% |
 * | 128 | 0.0225 | 17.4545 | 0.0256 | 15.3696 | 113.6% |
 * | 256 | 0.0799 | 19.6923 | 0.1139 | 13.8067 | 142.6% |
 * | 512 | 0.1910 | 32.9437 | 0.2608 | 24.1192 | 136.6% |
 * | 1024 | 1.2040 | 20.9010 | 1.6197 | 15.5375 | 134.5% |
 * | 2048 | 9.7127 | 10.3641 | 11.8389 | 8.5028 | 121.9% |
 *
 * ![ssymm-ldbpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad8.svg)
 *
 * ![ssymm-ldbpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0092 | 10.6852 | 64.2% |
 * | 128 | 0.0224 | 17.5668 | 0.0266 | 14.7692 | 118.9% |
 * | 256 | 0.0799 | 19.6923 | 0.1163 | 13.5293 | 145.6% |
 * | 512 | 0.1905 | 33.0323 | 0.2572 | 24.4644 | 135.0% |
 * | 1024 | 1.2166 | 20.6850 | 1.6052 | 15.6777 | 131.9% |
 * | 2048 | 9.7896 | 10.2827 | 11.5663 | 8.7032 | 118.1% |
 *
 * ![ssymm-ldbpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad16.svg)
 *
 * ![ssymm-ldbpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0099 | 9.9579 | 68.9% |
 * | 128 | 0.0223 | 17.6552 | 0.0263 | 14.9671 | 118.0% |
 * | 256 | 0.0794 | 19.7994 | 0.1147 | 13.7085 | 144.4% |
 * | 512 | 0.1897 | 33.1576 | 0.2601 | 24.1890 | 137.1% |
 * | 1024 | 1.2124 | 20.7568 | 1.6220 | 15.5152 | 133.8% |
 * | 2048 | 9.6999 | 10.3778 | 11.7641 | 8.5568 | 121.3% |
 *
 * ![ssymm-ldbpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad32.svg)
 *
 * ![ssymm-ldbpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0095 | 10.3260 | 66.4% |
 * | 128 | 0.0225 | 17.4545 | 0.0269 | 14.6373 | 119.2% |
 * | 256 | 0.0799 | 19.6963 | 0.1160 | 13.5573 | 145.3% |
 * | 512 | 0.1911 | 32.9189 | 0.2570 | 24.4827 | 134.5% |
 * | 1024 | 1.2236 | 20.5678 | 1.6107 | 15.6238 | 131.6% |
 * | 2048 | 9.8203 | 10.2505 | 11.6390 | 8.6488 | 118.5% |
 *
 * ![ssymm-ldbpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad48.svg)
 *
 * ![ssymm-ldbpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0093 | 10.5749 | 64.8% |
 * | 128 | 0.0225 | 17.4670 | 0.0271 | 14.5248 | 120.3% |
 * | 256 | 0.0798 | 19.7200 | 0.1166 | 13.4903 | 146.2% |
 * | 512 | 0.1898 | 33.1436 | 0.2608 | 24.1207 | 137.4% |
 * | 1024 | 1.2098 | 20.8012 | 1.6324 | 15.4166 | 134.9% |
 * | 2048 | 9.7001 | 10.3776 | 11.8222 | 8.5148 | 121.9% |
 *
 * ![ssymm-ldbpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad64.svg)
 *
 * ![ssymm-ldbpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0096 | 10.2400 | 67.0% |
 * | 128 | 0.0224 | 17.5794 | 0.0260 | 15.0958 | 116.5% |
 * | 256 | 0.0797 | 19.7279 | 0.1140 | 13.7971 | 143.0% |
 * | 512 | 0.1900 | 33.1213 | 0.2598 | 24.2203 | 136.8% |
 * | 1024 | 1.2087 | 20.8202 | 1.6302 | 15.4373 | 134.9% |
 * | 2048 | 9.7051 | 10.3722 | 11.9338 | 8.4351 | 123.0% |
 *
 * ![ssymm-ldbpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad128.svg)
 *
 * ![ssymm-ldbpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ldb.ssymm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ldb.ssymm.c) — CUDA / cuBLAS ldb-sweep reference script
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
 * | 64 | 0.0143 | 6.8571 | 0.0097 | 10.1219 | 67.7% |
 * | 128 | 0.0224 | 17.5418 | 0.0261 | 15.0588 | 116.5% |
 * | 256 | 0.0798 | 19.7160 | 0.1140 | 13.8029 | 142.8% |
 * | 512 | 0.1884 | 33.3913 | 0.2581 | 24.3749 | 137.0% |
 * | 1024 | 1.1990 | 20.9883 | 1.6020 | 15.7087 | 133.6% |
 * | 2048 | 9.6185 | 10.4656 | 11.7078 | 8.5980 | 121.7% |
 *
 * ![ssymm-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alphaneg3p75.svg)
 *
 * ![ssymm-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0138 | 7.1029 | 0.0084 | 11.7701 | 60.3% |
 * | 128 | 0.0218 | 18.0176 | 0.0243 | 16.2111 | 111.1% |
 * | 256 | 0.0786 | 20.0212 | 0.1098 | 14.3217 | 139.8% |
 * | 512 | 0.1885 | 33.3828 | 0.2557 | 24.6052 | 135.7% |
 * | 1024 | 1.1899 | 21.1497 | 1.5828 | 15.8991 | 133.0% |
 * | 2048 | 9.6083 | 10.4767 | 11.6104 | 8.6701 | 120.8% |
 *
 * ![ssymm-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha0.svg)
 *
 * ![ssymm-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0097 | 10.1554 | 67.5% |
 * | 128 | 0.0225 | 17.4670 | 0.0263 | 14.9489 | 116.8% |
 * | 256 | 0.0798 | 19.7160 | 0.1140 | 13.7971 | 142.9% |
 * | 512 | 0.1884 | 33.3913 | 0.2580 | 24.3885 | 136.9% |
 * | 1024 | 1.1901 | 21.1463 | 1.6263 | 15.4741 | 136.7% |
 * | 2048 | 9.6055 | 10.4798 | 11.6996 | 8.6040 | 121.8% |
 *
 * ![ssymm-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha1eneg38.svg)
 *
 * ![ssymm-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0096 | 10.2742 | 66.7% |
 * | 128 | 0.0225 | 17.4545 | 0.0260 | 15.1330 | 115.3% |
 * | 256 | 0.0799 | 19.6963 | 0.1140 | 13.7951 | 142.8% |
 * | 512 | 0.1889 | 33.3008 | 0.2601 | 24.1890 | 137.7% |
 * | 1024 | 1.2104 | 20.7919 | 1.5993 | 15.7359 | 132.1% |
 * | 2048 | 9.6109 | 10.4739 | 11.6457 | 8.6438 | 121.2% |
 *
 * ![ssymm-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha1.svg)
 *
 * ![ssymm-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0096 | 10.1891 | 67.3% |
 * | 128 | 0.0225 | 17.4545 | 0.0261 | 15.0404 | 116.1% |
 * | 256 | 0.0797 | 19.7358 | 0.1140 | 13.7932 | 143.1% |
 * | 512 | 0.1885 | 33.3800 | 0.2595 | 24.2442 | 137.7% |
 * | 1024 | 1.2001 | 20.9693 | 1.6118 | 15.6133 | 134.3% |
 * | 2048 | 9.6926 | 10.3855 | 11.6624 | 8.6314 | 120.3% |
 *
 * ![ssymm-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha2p5.svg)
 *
 * ![ssymm-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/alpha.ssymm.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/alpha.ssymm.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 64 | 0.0143 | 6.8571 | 0.0099 | 9.9740 | 68.8% |
 * | 128 | 0.0225 | 17.4545 | 0.0262 | 15.0220 | 116.2% |
 * | 256 | 0.0796 | 19.7636 | 0.1147 | 13.7143 | 144.1% |
 * | 512 | 0.1884 | 33.3885 | 0.2754 | 22.8481 | 146.1% |
 * | 1024 | 1.2002 | 20.9687 | 1.6752 | 15.0224 | 139.6% |
 * | 2048 | 9.6044 | 10.4810 | 11.8580 | 8.4890 | 123.5% |
 *
 * ![ssymm-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-betaneg3p75.svg)
 *
 * ![ssymm-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0138 | 7.1442 | 0.0083 | 11.8154 | 60.5% |
 * | 128 | 0.0221 | 17.7701 | 0.0243 | 16.2111 | 109.6% |
 * | 256 | 0.0783 | 20.0907 | 0.1099 | 14.3092 | 140.4% |
 * | 512 | 0.1884 | 33.3913 | 0.2562 | 24.5560 | 136.0% |
 * | 1024 | 1.1898 | 21.1506 | 1.6076 | 15.6541 | 135.1% |
 * | 2048 | 9.6307 | 10.4523 | 11.6775 | 8.6203 | 121.3% |
 *
 * ![ssymm-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-beta0.svg)
 *
 * ![ssymm-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0100 | 9.7834 | 70.1% |
 * | 128 | 0.0224 | 17.5167 | 0.0266 | 14.7870 | 118.5% |
 * | 256 | 0.0795 | 19.7954 | 0.1147 | 13.7143 | 144.3% |
 * | 512 | 0.1884 | 33.3885 | 0.2743 | 22.9347 | 145.6% |
 * | 1024 | 1.1972 | 21.0203 | 1.6714 | 15.0564 | 139.6% |
 * | 2048 | 9.6076 | 10.4775 | 11.8334 | 8.5067 | 123.2% |
 *
 * ![ssymm-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-beta1.svg)
 *
 * ![ssymm-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0098 | 10.0392 | 68.3% |
 * | 128 | 0.0225 | 17.4545 | 0.0263 | 14.9489 | 116.8% |
 * | 256 | 0.0796 | 19.7477 | 0.1147 | 13.7143 | 144.0% |
 * | 512 | 0.1884 | 33.3913 | 0.2747 | 22.9053 | 145.8% |
 * | 1024 | 1.2009 | 20.9564 | 1.6626 | 15.1362 | 138.5% |
 * | 2048 | 9.6461 | 10.4357 | 11.8518 | 8.4935 | 122.9% |
 *
 * ![ssymm-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-beta2p5.svg)
 *
 * ![ssymm-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/beta.ssymm.js) — WebGPU beta-sweep benchmark script
 * - [beta.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/beta.ssymm.c) — CUDA / cuBLAS beta-sweep reference script
 *
 * ## side sweep
 *
 * Whether `A` pre- or post-multiplies `B`. The two settings traverse the same data in different orders, so this is a scheduling and coalescing question rather than an arithmetic one — both do identical flops.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = left</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0140 | 6.9977 | 0.0084 | 11.6806 | 59.9% |
 * | 128 | 0.0220 | 17.9125 | 0.0243 | 16.2111 | 110.5% |
 * | 256 | 0.0783 | 20.0866 | 0.1100 | 14.3050 | 140.4% |
 * | 512 | 0.1884 | 33.3941 | 0.2559 | 24.5837 | 135.8% |
 * | 1024 | 1.2062 | 20.8630 | 1.6184 | 15.5494 | 134.2% |
 * | 2048 | 9.6932 | 10.3850 | 11.7155 | 8.5923 | 120.9% |
 *
 * ![ssymm-sideleft GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-sideleft.svg)
 *
 * ![ssymm-sideleft ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-sideleft.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = right</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0095 | 10.3260 | 66.4% |
 * | 128 | 0.0225 | 17.4794 | 0.0261 | 15.0404 | 116.2% |
 * | 256 | 0.0784 | 20.0498 | 0.1177 | 13.3620 | 150.1% |
 * | 512 | 0.1884 | 33.3913 | 0.2212 | 28.4444 | 117.4% |
 * | 1024 | 1.2086 | 20.8222 | 1.4390 | 17.4887 | 119.1% |
 * | 2048 | 9.7393 | 10.3358 | 10.6372 | 9.4633 | 109.2% |
 *
 * ![ssymm-sideright GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-sideright.svg)
 *
 * ![ssymm-sideright ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-sideright.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [side.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/side.ssymm.js) — WebGPU side-sweep benchmark script
 * - [side.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/side.ssymm.c) — CUDA / cuBLAS side-sweep reference script
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
 * | 64 | 0.0144 | 6.8191 |
 * | 128 | 0.0227 | 17.3315 |
 * | 256 | 0.0802 | 19.6020 |
 * | 512 | 0.2071 | 30.3806 |
 * | 1024 | 1.3560 | 18.5584 |
 * | 2048 | 11.0641 | 9.0982 |
 *
 * ![ssymm-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-layoutcolumnmajor.svg)
 *
 * ![ssymm-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0139 | 7.0783 |
 * | 128 | 0.0220 | 17.8865 |
 * | 256 | 0.0785 | 20.0293 |
 * | 512 | 0.1884 | 33.3913 |
 * | 1024 | 1.1893 | 21.1603 |
 * | 2048 | 9.6027 | 10.4828 |
 *
 * ![ssymm-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-layoutrowmajor.svg)
 *
 * ![ssymm-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/layout.ssymm.js) — WebGPU layout-sweep benchmark script
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
 * | 64 | 0.0141 | 6.9898 | 0.0084 | 11.7252 | 59.6% |
 * | 128 | 0.0220 | 17.8475 | 0.0243 | 16.1897 | 110.2% |
 * | 256 | 0.0781 | 20.1484 | 0.1097 | 14.3342 | 140.6% |
 * | 512 | 0.1880 | 33.4595 | 0.2560 | 24.5760 | 136.1% |
 * | 1024 | 1.2002 | 20.9673 | 1.6229 | 15.5067 | 135.2% |
 * | 2048 | 9.6991 | 10.3787 | 11.7347 | 8.5782 | 121.0% |
 *
 * ![ssymm-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad0.svg)
 *
 * ![ssymm-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0096 | 10.2571 | 66.9% |
 * | 128 | 0.0225 | 17.4545 | 0.0260 | 15.0958 | 115.6% |
 * | 256 | 0.0793 | 19.8313 | 0.1139 | 13.8048 | 143.7% |
 * | 512 | 0.1916 | 32.8309 | 0.2683 | 23.4504 | 140.0% |
 * | 1024 | 1.2145 | 20.7218 | 1.6620 | 15.1417 | 136.9% |
 * | 2048 | 9.7013 | 10.3763 | 11.8564 | 8.4902 | 122.2% |
 *
 * ![ssymm-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad1.svg)
 *
 * ![ssymm-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0147 | 6.7001 | 0.0096 | 10.2400 | 65.4% |
 * | 128 | 0.0223 | 17.6425 | 0.0261 | 15.0773 | 117.0% |
 * | 256 | 0.0795 | 19.7755 | 0.1140 | 13.8029 | 143.3% |
 * | 512 | 0.1910 | 32.9327 | 0.2632 | 23.9081 | 137.7% |
 * | 1024 | 1.2045 | 20.8935 | 1.6380 | 15.3633 | 136.0% |
 * | 2048 | 9.6645 | 10.4158 | 11.8115 | 8.5225 | 122.2% |
 *
 * ![ssymm-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad8.svg)
 *
 * ![ssymm-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0097 | 10.1386 | 67.6% |
 * | 128 | 0.0225 | 17.4545 | 0.0260 | 15.0958 | 115.6% |
 * | 256 | 0.0798 | 19.7002 | 0.1140 | 13.7932 | 142.8% |
 * | 512 | 0.1913 | 32.8831 | 0.2615 | 24.0573 | 136.7% |
 * | 1024 | 1.2074 | 20.8429 | 1.6245 | 15.4918 | 134.5% |
 * | 2048 | 9.6987 | 10.3790 | 11.7530 | 8.5649 | 121.2% |
 *
 * ![ssymm-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad16.svg)
 *
 * ![ssymm-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0092 | 10.7413 | 63.8% |
 * | 128 | 0.0225 | 17.4670 | 0.0266 | 14.7692 | 118.3% |
 * | 256 | 0.0794 | 19.7994 | 0.1160 | 13.5592 | 146.0% |
 * | 512 | 0.1888 | 33.3206 | 0.2601 | 24.1875 | 137.8% |
 * | 1024 | 1.2101 | 20.7971 | 1.6191 | 15.5435 | 133.8% |
 * | 2048 | 9.6850 | 10.3937 | 11.7325 | 8.5799 | 121.1% |
 *
 * ![ssymm-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad32.svg)
 *
 * ![ssymm-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0094 | 10.4668 | 65.5% |
 * | 128 | 0.0225 | 17.4918 | 0.0270 | 14.5765 | 120.0% |
 * | 256 | 0.0799 | 19.6923 | 0.1155 | 13.6174 | 144.6% |
 * | 512 | 0.1922 | 32.7298 | 0.2638 | 23.8457 | 137.3% |
 * | 1024 | 1.2102 | 20.7944 | 1.6241 | 15.4948 | 134.2% |
 * | 2048 | 9.6681 | 10.4119 | 11.7770 | 8.5475 | 121.8% |
 *
 * ![ssymm-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad48.svg)
 *
 * ![ssymm-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0096 | 10.2571 | 66.9% |
 * | 128 | 0.0225 | 17.4545 | 0.0264 | 14.8855 | 117.3% |
 * | 256 | 0.0790 | 19.8996 | 0.1147 | 13.7143 | 145.1% |
 * | 512 | 0.1889 | 33.3121 | 0.2600 | 24.1979 | 137.7% |
 * | 1024 | 1.2110 | 20.7817 | 1.6110 | 15.6209 | 133.0% |
 * | 2048 | 9.7269 | 10.3489 | 11.7044 | 8.6005 | 120.3% |
 *
 * ![ssymm-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad64.svg)
 *
 * ![ssymm-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0144 | 6.8419 | 0.0096 | 10.2571 | 66.7% |
 * | 128 | 0.0224 | 17.5292 | 0.0263 | 14.9580 | 117.2% |
 * | 256 | 0.0795 | 19.7755 | 0.1140 | 13.7912 | 143.4% |
 * | 512 | 0.1889 | 33.3093 | 0.2599 | 24.2083 | 137.6% |
 * | 1024 | 1.2060 | 20.8672 | 1.6213 | 15.5216 | 134.4% |
 * | 2048 | 9.6912 | 10.3870 | 11.7186 | 8.5900 | 120.9% |
 *
 * ![ssymm-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad128.svg)
 *
 * ![ssymm-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ldc.ssymm.js) — WebGPU ldc-sweep benchmark script
 * - [ldc.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ldc.ssymm.c) — CUDA / cuBLAS ldc-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymm
 */
