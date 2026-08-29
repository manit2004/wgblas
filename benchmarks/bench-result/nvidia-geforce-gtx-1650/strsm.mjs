/**
 * Benchmark results for strsm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | order | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0737 | 0.5573 | 0.0102 | 4.0377 | 13.8% |
 * | 128 | 0.1008 | 0.9779 | 0.0210 | 4.6844 | 20.9% |
 * | 256 | 0.1780 | 1.4756 | 0.0623 | 4.2168 | 35.0% |
 * | 512 | 0.3847 | 2.0468 | 0.1506 | 5.2296 | 39.1% |
 * | 1024 | 0.8185 | 3.2053 | 0.3555 | 7.3790 | 43.4% |
 * | 2048 | 1.9802 | 4.7679 | 0.7934 | 11.9001 | 40.1% |
 * | 4096 | 6.5064 | 5.4807 | 1.8680 | 19.0898 | 28.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strsm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-default.svg)
 *
 * ![strsm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-default.svg)
 *
 * ## See also
 *
 * - [strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/strsm.js) — WebGPU benchmark script
 * - [strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/strsm.c) — CUDA / cuBLAS reference script
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
 * | 64 | 0.0700 | 1.8725 | 0.0102 | 12.8200 | 14.6% |
 * | 128 | 0.0979 | 5.3551 | 0.0262 | 20.0293 | 26.7% |
 * | 256 | 0.1941 | 10.8056 | 0.1008 | 20.8150 | 51.9% |
 * | 512 | 0.5938 | 14.1260 | 0.3764 | 22.2855 | 63.4% |
 * | 1024 | 2.4371 | 13.7681 | 1.5639 | 21.4562 | 64.2% |
 * | 2048 | 14.4784 | 9.2702 | 7.8146 | 17.1752 | 54.0% |
 *
 * ![strsm-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-uplolower.svg)
 *
 * ![strsm-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0717 | 1.8286 | 0.0102 | 12.8000 | 14.3% |
 * | 128 | 0.0988 | 5.3048 | 0.0263 | 19.9683 | 26.6% |
 * | 256 | 0.2024 | 10.3639 | 0.1019 | 20.5732 | 50.4% |
 * | 512 | 0.5960 | 14.0756 | 0.3786 | 22.1583 | 63.5% |
 * | 1024 | 2.4262 | 13.8303 | 1.5673 | 21.4085 | 64.6% |
 * | 2048 | 14.4099 | 9.3142 | 7.8114 | 17.1823 | 54.2% |
 *
 * ![strsm-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-uploupper.svg)
 *
 * ![strsm-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/uplo.strsm.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/uplo.strsm.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 64 | 0.0702 | 1.8665 | 0.0213 | 6.1548 | 30.3% |
 * | 128 | 0.0978 | 5.3595 | 0.0376 | 13.9557 | 38.4% |
 * | 256 | 0.1933 | 10.8503 | 0.3526 | 5.9470 | 182.5% |
 * | 512 | 0.5930 | 14.1455 | 0.3777 | 22.2081 | 63.7% |
 * | 1024 | 2.4371 | 13.7681 | 1.5625 | 21.4742 | 64.1% |
 * | 2048 | 14.4877 | 9.2643 | 7.8985 | 16.9929 | 54.5% |
 *
 * ![strsm-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad0.svg)
 *
 * ![strsm-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0706 | 1.8568 | 0.0110 | 11.9243 | 15.6% |
 * | 128 | 0.0972 | 5.3948 | 0.0266 | 19.6923 | 27.4% |
 * | 256 | 0.1940 | 10.8074 | 0.1030 | 20.3654 | 53.1% |
 * | 512 | 0.5939 | 14.1238 | 0.3811 | 22.0095 | 64.2% |
 * | 1024 | 2.4434 | 13.7329 | 1.5785 | 21.2570 | 64.6% |
 * | 2048 | 14.5331 | 9.2353 | 8.4545 | 15.8753 | 58.2% |
 *
 * ![strsm-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad1.svg)
 *
 * ![strsm-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0707 | 1.8538 | 0.0102 | 12.8000 | 14.5% |
 * | 128 | 0.0977 | 5.3683 | 0.0266 | 19.6923 | 27.3% |
 * | 256 | 0.1934 | 10.8440 | 0.1029 | 20.3844 | 53.2% |
 * | 512 | 0.5951 | 14.0972 | 0.3807 | 22.0345 | 64.0% |
 * | 1024 | 2.4421 | 13.7400 | 1.5750 | 21.3043 | 64.5% |
 * | 2048 | 14.5086 | 9.2509 | 7.9422 | 16.8993 | 54.7% |
 *
 * ![strsm-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad8.svg)
 *
 * ![strsm-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0700 | 1.8716 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0974 | 5.3824 | 0.0266 | 19.6923 | 27.3% |
 * | 256 | 0.1935 | 10.8396 | 0.1059 | 19.7994 | 54.7% |
 * | 512 | 0.5939 | 14.1241 | 0.3830 | 21.9001 | 64.5% |
 * | 1024 | 2.4405 | 13.7492 | 1.5790 | 21.2505 | 64.7% |
 * | 2048 | 14.4762 | 9.2716 | 8.2400 | 16.2886 | 56.9% |
 *
 * ![strsm-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad16.svg)
 *
 * ![strsm-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0703 | 1.8656 | 0.0111 | 11.7871 | 15.8% |
 * | 128 | 0.0970 | 5.4055 | 0.0267 | 19.6451 | 27.5% |
 * | 256 | 0.1939 | 10.8136 | 0.1017 | 20.6218 | 52.4% |
 * | 512 | 0.5939 | 14.1241 | 0.3795 | 22.1041 | 63.9% |
 * | 1024 | 2.4394 | 13.7553 | 1.5683 | 21.3960 | 64.3% |
 * | 2048 | 14.4956 | 9.2592 | 7.8131 | 17.1786 | 53.9% |
 *
 * ![strsm-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad32.svg)
 *
 * ![strsm-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0704 | 1.8618 | 0.0102 | 12.8000 | 14.5% |
 * | 128 | 0.0977 | 5.3648 | 0.0266 | 19.6923 | 27.2% |
 * | 256 | 0.1931 | 10.8593 | 0.1028 | 20.3908 | 53.3% |
 * | 512 | 0.5937 | 14.1291 | 0.3827 | 21.9193 | 64.5% |
 * | 1024 | 2.4434 | 13.7328 | 1.5732 | 21.3281 | 64.4% |
 * | 2048 | 14.4884 | 9.2638 | 7.8756 | 17.0423 | 54.4% |
 *
 * ![strsm-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad48.svg)
 *
 * ![strsm-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0705 | 1.8601 | 0.0102 | 12.8000 | 14.5% |
 * | 128 | 0.0978 | 5.3613 | 0.0265 | 19.7517 | 27.1% |
 * | 256 | 0.1928 | 10.8764 | 0.1018 | 20.6023 | 52.8% |
 * | 512 | 0.5939 | 14.1241 | 0.3820 | 21.9625 | 64.3% |
 * | 1024 | 2.4401 | 13.7514 | 1.5685 | 21.3930 | 64.3% |
 * | 2048 | 14.4985 | 9.2573 | 7.8144 | 17.1758 | 53.9% |
 *
 * ![strsm-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad64.svg)
 *
 * ![strsm-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0708 | 1.8500 | 0.0102 | 12.8000 | 14.5% |
 * | 128 | 0.0971 | 5.3975 | 0.0263 | 19.9683 | 27.0% |
 * | 256 | 0.1929 | 10.8728 | 0.1018 | 20.5926 | 52.8% |
 * | 512 | 0.5947 | 14.1063 | 0.3820 | 21.9588 | 64.2% |
 * | 1024 | 2.4398 | 13.7529 | 1.5693 | 21.3814 | 64.3% |
 * | 2048 | 14.4934 | 9.2606 | 7.8155 | 17.1733 | 53.9% |
 *
 * ![strsm-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-pad128.svg)
 *
 * ![strsm-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/lda.strsm.js) — WebGPU lda-sweep benchmark script
 * - [lda.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/lda.strsm.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 64 | 0.0702 | 1.8669 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0975 | 5.3797 | 0.0262 | 20.0049 | 26.9% |
 * | 256 | 0.1941 | 10.8029 | 0.1008 | 20.8084 | 51.9% |
 * | 512 | 0.5939 | 14.1241 | 0.3751 | 22.3644 | 63.2% |
 * | 1024 | 2.4369 | 13.7693 | 1.5701 | 21.3709 | 64.4% |
 * | 2048 | 14.4794 | 9.2695 | 7.8140 | 17.1766 | 54.0% |
 *
 * ![strsm-ldbpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad0.svg)
 *
 * ![strsm-ldbpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0702 | 1.8678 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0976 | 5.3692 | 0.0279 | 18.7675 | 28.6% |
 * | 256 | 0.1946 | 10.7789 | 0.1095 | 19.1486 | 56.3% |
 * | 512 | 0.6035 | 13.9009 | 0.3850 | 21.7872 | 63.8% |
 * | 1024 | 2.4719 | 13.5742 | 1.5796 | 21.2428 | 63.9% |
 * | 2048 | 14.6515 | 9.1607 | 7.9143 | 16.9590 | 54.0% |
 *
 * ![strsm-ldbpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad1.svg)
 *
 * ![strsm-ldbpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0704 | 1.8610 | 0.0102 | 12.8200 | 14.5% |
 * | 128 | 0.0970 | 5.4037 | 0.0332 | 15.7690 | 34.3% |
 * | 256 | 0.1944 | 10.7869 | 0.1080 | 19.4209 | 55.5% |
 * | 512 | 0.5960 | 14.0756 | 0.3790 | 22.1312 | 63.6% |
 * | 1024 | 2.4598 | 13.6413 | 1.5664 | 21.4212 | 63.7% |
 * | 2048 | 14.6555 | 9.1582 | 7.7577 | 17.3011 | 52.9% |
 *
 * ![strsm-ldbpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad8.svg)
 *
 * ![strsm-ldbpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0704 | 1.8631 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0970 | 5.4028 | 0.0326 | 16.0706 | 33.6% |
 * | 256 | 0.1945 | 10.7825 | 0.1075 | 19.5106 | 55.3% |
 * | 512 | 0.5955 | 14.0877 | 0.3812 | 22.0030 | 64.0% |
 * | 1024 | 2.4430 | 13.7352 | 1.5670 | 21.4135 | 64.1% |
 * | 2048 | 14.5969 | 9.1950 | 7.8078 | 17.1902 | 53.5% |
 *
 * ![strsm-ldbpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad16.svg)
 *
 * ![strsm-ldbpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0700 | 1.8720 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0980 | 5.3525 | 0.0329 | 15.9300 | 33.6% |
 * | 256 | 0.1946 | 10.7789 | 0.1046 | 20.0569 | 53.7% |
 * | 512 | 0.5960 | 14.0756 | 0.3820 | 21.9606 | 64.1% |
 * | 1024 | 2.4457 | 13.7199 | 1.5700 | 21.3727 | 64.2% |
 * | 2048 | 14.6414 | 9.1670 | 7.8131 | 17.1786 | 53.4% |
 *
 * ![strsm-ldbpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad32.svg)
 *
 * ![strsm-ldbpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0699 | 1.8746 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0975 | 5.3753 | 0.0316 | 16.5662 | 32.4% |
 * | 256 | 0.1946 | 10.7789 | 0.1018 | 20.5991 | 52.3% |
 * | 512 | 0.5953 | 14.0915 | 0.3820 | 21.9625 | 64.2% |
 * | 1024 | 2.4433 | 13.7331 | 1.5689 | 21.3866 | 64.2% |
 * | 2048 | 14.6151 | 9.1835 | 7.7645 | 17.2860 | 53.1% |
 *
 * ![strsm-ldbpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad48.svg)
 *
 * ![strsm-ldbpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0701 | 1.8703 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0971 | 5.4019 | 0.0303 | 17.2827 | 31.3% |
 * | 256 | 0.1945 | 10.7816 | 0.1067 | 19.6598 | 54.8% |
 * | 512 | 0.5956 | 14.0851 | 0.3801 | 22.0697 | 63.8% |
 * | 1024 | 2.4508 | 13.6911 | 1.5687 | 21.3899 | 64.0% |
 * | 2048 | 14.6292 | 9.1746 | 7.8175 | 17.1688 | 53.4% |
 *
 * ![strsm-ldbpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad64.svg)
 *
 * ![strsm-ldbpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0704 | 1.8631 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0973 | 5.3895 | 0.0330 | 15.8760 | 33.9% |
 * | 256 | 0.1939 | 10.8145 | 0.1040 | 20.1618 | 53.6% |
 * | 512 | 0.5980 | 14.0266 | 0.3797 | 22.0902 | 63.5% |
 * | 1024 | 2.4498 | 13.6967 | 1.5683 | 21.3949 | 64.0% |
 * | 2048 | 14.6787 | 9.1437 | 7.8242 | 17.1542 | 53.3% |
 *
 * ![strsm-ldbpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-ldbpad128.svg)
 *
 * ![strsm-ldbpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-ldbpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/ldb.strsm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/ldb.strsm.c) — CUDA / cuBLAS ldb-sweep reference script
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
 * | 64 | 0.0700 | 1.8733 | 0.0115 | 11.4095 | 16.4% |
 * | 128 | 0.0973 | 5.3868 | 0.0266 | 19.6923 | 27.4% |
 * | 256 | 0.1925 | 10.8936 | 0.1027 | 20.4226 | 53.3% |
 * | 512 | 0.5925 | 14.1581 | 0.3792 | 22.1228 | 64.0% |
 * | 1024 | 2.4368 | 13.7700 | 1.5724 | 21.3401 | 64.5% |
 * | 2048 | 14.4810 | 9.2685 | 7.9341 | 16.9166 | 54.8% |
 *
 * ![strsm-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-alphaneg3p75.svg)
 *
 * ![strsm-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0071 | 18.4921 | 0.0324 | 4.0414 | 457.6% |
 * | 128 | 0.0081 | 64.8871 | 0.0431 | 12.1633 | 533.5% |
 * | 256 | 0.0101 | 207.0648 | 0.5396 | 3.8864 | 5327.9% |
 * | 512 | 0.0201 | 417.0947 | 0.4953 | 16.9355 | 2462.8% |
 * | 1024 | 0.0666 | 503.7598 | 1.9541 | 17.1715 | 2933.7% |
 * | 2048 | 0.2437 | 550.7227 | 9.1224 | 14.7130 | 3743.1% |
 *
 * ![strsm-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-alpha0.svg)
 *
 * ![strsm-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0696 | 1.8824 | 0.0291 | 4.4986 | 41.8% |
 * | 128 | 0.0973 | 5.3877 | 0.0694 | 7.5520 | 71.3% |
 * | 256 | 0.1925 | 10.8936 | 0.2818 | 7.4418 | 146.4% |
 * | 512 | 0.5931 | 14.1440 | 0.7413 | 11.3156 | 125.0% |
 * | 1024 | 2.4376 | 13.7652 | 3.0324 | 11.0652 | 124.4% |
 * | 2048 | 14.4875 | 9.2644 | 12.8440 | 10.4498 | 88.7% |
 *
 * ![strsm-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-alpha1eneg38.svg)
 *
 * ![strsm-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0908 | 1.4433 | 0.0102 | 12.8000 | 11.3% |
 * | 128 | 0.1253 | 4.1828 | 0.0261 | 20.0907 | 20.8% |
 * | 256 | 0.2484 | 8.4421 | 0.1006 | 20.8448 | 40.5% |
 * | 512 | 0.7488 | 11.2023 | 0.4228 | 19.8421 | 56.5% |
 * | 1024 | 2.9729 | 11.2867 | 1.5654 | 21.4354 | 52.7% |
 * | 2048 | 14.4949 | 9.2597 | 7.9409 | 16.9021 | 54.8% |
 *
 * ![strsm-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-alpha1.svg)
 *
 * ![strsm-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0699 | 1.8763 | 0.0102 | 12.8000 | 14.7% |
 * | 128 | 0.0975 | 5.3771 | 0.0264 | 19.8354 | 27.1% |
 * | 256 | 0.1924 | 10.8991 | 0.5421 | 3.8683 | 281.8% |
 * | 512 | 0.5922 | 14.1657 | 0.6472 | 12.9614 | 109.3% |
 * | 1024 | 2.4392 | 13.7565 | 1.6474 | 20.3680 | 67.5% |
 * | 2048 | 14.4882 | 9.2639 | 8.5628 | 15.6746 | 59.1% |
 *
 * ![strsm-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-alpha2p5.svg)
 *
 * ![strsm-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/alpha.strsm.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/alpha.strsm.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * ## diag sweep
 *
 * A unit diagonal lets the kernel skip the diagonal load — and for the triangular solve, the reciprocal as well — so any difference here is exactly that skipped work.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = non-unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0701 | 1.8695 | 0.0102 | 12.8000 | 14.6% |
 * | 128 | 0.0979 | 5.3569 | 0.0262 | 20.0416 | 26.7% |
 * | 256 | 0.1937 | 10.8288 | 0.1047 | 20.0324 | 54.1% |
 * | 512 | 0.5932 | 14.1420 | 0.3781 | 22.1855 | 63.7% |
 * | 1024 | 2.4366 | 13.7711 | 1.6240 | 20.6612 | 66.7% |
 * | 2048 | 14.4835 | 9.2669 | 8.5293 | 15.7361 | 58.9% |
 *
 * ![strsm-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-diagnonunit.svg)
 *
 * ![strsm-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0697 | 1.8811 | 0.0069 | 18.9630 | 9.9% |
 * | 128 | 0.0967 | 5.4243 | 0.0183 | 28.7187 | 18.9% |
 * | 256 | 0.1934 | 10.8458 | 0.0873 | 24.0103 | 45.2% |
 * | 512 | 0.5939 | 14.1241 | 0.4119 | 20.3654 | 69.4% |
 * | 1024 | 2.4382 | 13.7620 | 1.4267 | 23.5183 | 58.5% |
 * | 2048 | 14.4988 | 9.2572 | 7.9621 | 16.8570 | 54.9% |
 *
 * ![strsm-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-diagunit.svg)
 *
 * ![strsm-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/diag.strsm.js) — WebGPU diag-sweep benchmark script
 * - [diag.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/diag.strsm.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 64 | 0.0702 | 1.8673 | 0.0102 | 12.8401 | 14.5% |
 * | 128 | 0.0980 | 5.3525 | 0.0263 | 19.9077 | 26.9% |
 * | 256 | 0.1929 | 10.8710 | 0.1003 | 20.9146 | 52.0% |
 * | 512 | 0.5923 | 14.1627 | 0.3753 | 22.3510 | 63.4% |
 * | 1024 | 2.4383 | 13.7617 | 1.5673 | 21.4089 | 64.3% |
 * | 2048 | 14.4898 | 9.2629 | 7.8108 | 17.1836 | 53.9% |
 *
 * ![strsm-sideleft GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-sideleft.svg)
 *
 * ![strsm-sideleft ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-sideleft.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = right</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0704 | 1.8605 | 0.0143 | 9.1429 | 20.3% |
 * | 128 | 0.0986 | 5.3178 | 0.0328 | 16.0078 | 33.2% |
 * | 256 | 0.1982 | 10.5806 | 0.0982 | 21.3646 | 49.5% |
 * | 512 | 0.6287 | 13.3420 | 0.3188 | 26.3157 | 50.7% |
 * | 1024 | 3.0425 | 11.0286 | 1.2305 | 27.2694 | 40.4% |
 * | 2048 | 15.9070 | 8.4376 | 6.7018 | 20.0270 | 42.1% |
 *
 * ![strsm-sideright GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-sideright.svg)
 *
 * ![strsm-sideright ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-sideright.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [side.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/side.strsm.js) — WebGPU side-sweep benchmark script
 * - [side.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/side.strsm.c) — CUDA / cuBLAS side-sweep reference script
 *
 * ## transA sweep
 *
 * `op(A)` decides whether the kernel walks `A` along rows or columns, which changes how its tile loads coalesce. Swept on its own here; `sgemm`'s combined transA x transB grid lives in its trans sweep.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0903 | 1.4509 | 0.0102 | 12.8401 | 11.3% |
 * | 128 | 0.1263 | 4.1505 | 0.0261 | 20.0661 | 20.7% |
 * | 256 | 0.2469 | 8.4930 | 0.1004 | 20.8846 | 40.7% |
 * | 512 | 0.7413 | 11.3159 | 0.3764 | 22.2874 | 50.8% |
 * | 1024 | 2.8784 | 11.6572 | 1.5658 | 21.4301 | 54.4% |
 * | 2048 | 14.4994 | 9.2568 | 7.8108 | 17.1837 | 53.9% |
 *
 * ![strsm-transAnotranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-transAnotranspose.svg)
 *
 * ![strsm-transAnotranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-transAnotranspose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0730 | 1.7965 | 0.0102 | 12.8000 | 14.0% |
 * | 128 | 0.1051 | 4.9883 | 0.0266 | 19.7160 | 25.3% |
 * | 256 | 0.2168 | 9.6754 | 0.1034 | 20.2804 | 47.7% |
 * | 512 | 0.6285 | 13.3461 | 0.3839 | 21.8499 | 61.1% |
 * | 1024 | 2.4844 | 13.5060 | 1.3292 | 25.2447 | 53.5% |
 * | 2048 | 14.5358 | 9.2336 | 7.8723 | 17.0494 | 54.2% |
 *
 * ![strsm-transAtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-transAtranspose.svg)
 *
 * ![strsm-transAtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-transAtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [transA.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/transA.strsm.js) — WebGPU transA-sweep benchmark script
 * - [transA.strsm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/cuda/transA.strsm.c) — CUDA / cuBLAS transA-sweep reference script
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
 * | 64 | 0.0734 | 1.7855 |
 * | 128 | 0.1044 | 5.0196 |
 * | 256 | 0.2111 | 9.9342 |
 * | 512 | 0.6611 | 12.6885 |
 * | 1024 | 3.1005 | 10.8221 |
 * | 2048 | 16.0369 | 8.3693 |
 *
 * ![strsm-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-layoutcolumnmajor.svg)
 *
 * ![strsm-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0708 | 1.8500 |
 * | 128 | 0.0981 | 5.3464 |
 * | 256 | 0.1933 | 10.8476 |
 * | 512 | 0.5941 | 14.1207 |
 * | 1024 | 2.4371 | 13.7681 |
 * | 2048 | 14.4706 | 9.2752 |
 *
 * ![strsm-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/gbps-layoutrowmajor.svg)
 *
 * ![strsm-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsm/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.strsm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsm/wgblas/layout.strsm.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsm
 */
