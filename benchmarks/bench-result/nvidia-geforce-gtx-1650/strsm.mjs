/**
 * Benchmark results for strsm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | order | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0164 | 2.4981 | 0.0101 | 4.0505 | 61.7% |
 * | 128 | 0.0362 | 2.7245 | 0.0208 | 4.7276 | 57.6% |
 * | 256 | 0.0747 | 3.5167 | 0.0629 | 4.1782 | 84.2% |
 * | 512 | 0.1741 | 4.5235 | 0.1542 | 5.1070 | 88.6% |
 * | 1024 | 0.3877 | 6.7660 | 0.3567 | 7.3545 | 92.0% |
 * | 2048 | 0.9658 | 9.7754 | 0.7949 | 11.8776 | 82.3% |
 * | 4096 | 2.2848 | 15.6074 | 1.8677 | 19.0928 | 81.7% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8200 | 55.5% |
 * | 128 | 0.0518 | 10.1136 | 0.0262 | 20.0293 | 50.5% |
 * | 256 | 0.1766 | 11.8735 | 0.1005 | 20.8747 | 56.9% |
 * | 512 | 0.6739 | 12.4481 | 0.3764 | 22.2874 | 55.9% |
 * | 1024 | 1.3212 | 25.3963 | 1.5662 | 21.4236 | 118.5% |
 * | 2048 | 7.4464 | 18.0245 | 7.8070 | 17.1920 | 104.8% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0517 | 10.1418 | 0.0265 | 19.7755 | 51.3% |
 * | 256 | 0.1761 | 11.9070 | 0.1013 | 20.7032 | 57.5% |
 * | 512 | 0.6738 | 12.4498 | 0.3762 | 22.2997 | 55.8% |
 * | 1024 | 1.3138 | 25.5392 | 1.5651 | 21.4395 | 119.1% |
 * | 2048 | 7.4169 | 18.0963 | 7.8044 | 17.1977 | 105.2% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0101 | 12.9620 | 54.9% |
 * | 128 | 0.0517 | 10.1323 | 0.0261 | 20.0539 | 50.5% |
 * | 256 | 0.1765 | 11.8832 | 0.1003 | 20.9113 | 56.8% |
 * | 512 | 0.6754 | 12.4195 | 0.3765 | 22.2788 | 55.7% |
 * | 1024 | 1.3213 | 25.3948 | 1.5636 | 21.4595 | 118.3% |
 * | 2048 | 7.4436 | 18.0313 | 7.7791 | 17.2537 | 104.5% |
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
 * | 64 | 0.0173 | 7.5922 | 0.0102 | 12.8000 | 59.3% |
 * | 128 | 0.0451 | 11.6364 | 0.0265 | 19.7994 | 58.8% |
 * | 256 | 0.1501 | 13.9721 | 0.1014 | 20.6869 | 67.5% |
 * | 512 | 0.5901 | 14.2145 | 0.3793 | 22.1153 | 64.3% |
 * | 1024 | 1.4872 | 22.5617 | 1.5737 | 21.3223 | 105.8% |
 * | 2048 | 8.5604 | 15.6790 | 7.8543 | 17.0885 | 91.8% |
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
 * | 64 | 0.0168 | 7.7797 | 0.0102 | 12.8000 | 60.8% |
 * | 128 | 0.0446 | 11.7574 | 0.0266 | 19.6923 | 59.7% |
 * | 256 | 0.1495 | 14.0274 | 0.1015 | 20.6706 | 67.9% |
 * | 512 | 0.5755 | 14.5769 | 0.3793 | 22.1181 | 65.9% |
 * | 1024 | 1.3048 | 25.7171 | 1.5704 | 21.3666 | 120.4% |
 * | 2048 | 7.2755 | 18.4479 | 7.8117 | 17.1816 | 107.4% |
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
 * | 64 | 0.0175 | 7.5018 | 0.0102 | 12.8000 | 58.6% |
 * | 128 | 0.0463 | 11.3306 | 0.0266 | 19.7398 | 57.4% |
 * | 256 | 0.1575 | 13.3136 | 0.1018 | 20.5991 | 64.6% |
 * | 512 | 0.6018 | 13.9383 | 0.3801 | 22.0697 | 63.2% |
 * | 1024 | 1.3075 | 25.6627 | 1.5710 | 21.3583 | 120.2% |
 * | 2048 | 7.3048 | 18.3739 | 7.8272 | 17.1477 | 107.2% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0519 | 10.1011 | 0.0266 | 19.6923 | 51.3% |
 * | 256 | 0.1762 | 11.9037 | 0.1013 | 20.7065 | 57.5% |
 * | 512 | 0.6779 | 12.3746 | 0.3788 | 22.1452 | 55.9% |
 * | 1024 | 1.3311 | 25.2080 | 1.5674 | 21.4080 | 117.8% |
 * | 2048 | 7.4895 | 17.9207 | 7.8062 | 17.1938 | 104.2% |
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
 * | 64 | 0.0170 | 7.7137 | 0.0102 | 12.8000 | 60.3% |
 * | 128 | 0.0467 | 11.2181 | 0.0263 | 19.9440 | 56.2% |
 * | 256 | 0.1577 | 13.2987 | 0.1006 | 20.8481 | 63.8% |
 * | 512 | 0.6042 | 13.8847 | 0.3781 | 22.1874 | 62.6% |
 * | 1024 | 1.3127 | 25.5613 | 1.5702 | 21.3694 | 119.6% |
 * | 2048 | 7.3325 | 18.3044 | 7.8276 | 17.1468 | 106.8% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0517 | 10.1386 | 0.0265 | 19.7874 | 51.2% |
 * | 256 | 0.1761 | 11.9070 | 0.1012 | 20.7163 | 57.5% |
 * | 512 | 0.6765 | 12.4004 | 0.3783 | 22.1752 | 55.9% |
 * | 1024 | 1.3319 | 25.1931 | 1.5654 | 21.4356 | 117.5% |
 * | 2048 | 7.4795 | 17.9448 | 7.7509 | 17.3164 | 103.6% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0518 | 10.1136 | 0.0264 | 19.8594 | 50.9% |
 * | 256 | 0.1761 | 11.9070 | 0.1020 | 20.5571 | 57.9% |
 * | 512 | 0.6783 | 12.3676 | 0.3786 | 22.1593 | 55.8% |
 * | 1024 | 1.3292 | 25.2450 | 1.5682 | 21.3969 | 118.0% |
 * | 2048 | 7.4949 | 17.9078 | 7.7982 | 17.2115 | 104.0% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.9008 | 55.1% |
 * | 128 | 0.0516 | 10.1638 | 0.0262 | 19.9805 | 50.9% |
 * | 256 | 0.1762 | 11.9037 | 0.1002 | 20.9213 | 56.9% |
 * | 512 | 0.6741 | 12.4445 | 0.3771 | 22.2448 | 55.9% |
 * | 1024 | 1.3207 | 25.4065 | 1.5644 | 21.4483 | 118.5% |
 * | 2048 | 7.4478 | 18.0210 | 7.8080 | 17.1898 | 104.8% |
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
 * | 64 | 0.0183 | 7.1797 | 0.0102 | 12.8000 | 56.1% |
 * | 128 | 0.0512 | 10.2400 | 0.0274 | 19.1290 | 53.5% |
 * | 256 | 0.1713 | 12.2451 | 0.1062 | 19.7487 | 62.0% |
 * | 512 | 0.6678 | 12.5608 | 0.3806 | 22.0382 | 57.0% |
 * | 1024 | 1.5781 | 21.2628 | 1.5742 | 21.3156 | 99.8% |
 * | 2048 | 9.3372 | 14.3745 | 7.8552 | 17.0865 | 84.1% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0512 | 10.2400 | 0.0342 | 15.3121 | 66.9% |
 * | 256 | 0.1720 | 12.1905 | 0.1070 | 19.5952 | 62.2% |
 * | 512 | 0.6744 | 12.4392 | 0.3726 | 22.5142 | 55.3% |
 * | 1024 | 1.5570 | 21.5508 | 1.5635 | 21.4615 | 100.4% |
 * | 2048 | 9.1636 | 14.6468 | 7.7089 | 17.4108 | 84.1% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0103 | 12.7800 | 55.6% |
 * | 128 | 0.0513 | 10.2176 | 0.0342 | 15.3336 | 66.6% |
 * | 256 | 0.1741 | 12.0471 | 0.1066 | 19.6687 | 61.2% |
 * | 512 | 0.6784 | 12.3659 | 0.3799 | 22.0827 | 56.0% |
 * | 1024 | 1.5336 | 21.8797 | 1.5652 | 21.4378 | 102.1% |
 * | 2048 | 9.1693 | 14.6378 | 7.7303 | 17.3625 | 84.3% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0518 | 10.1136 | 0.0327 | 16.0313 | 63.1% |
 * | 256 | 0.1762 | 11.9005 | 0.1028 | 20.4067 | 58.3% |
 * | 512 | 0.6813 | 12.3119 | 0.3781 | 22.1883 | 55.5% |
 * | 1024 | 1.3324 | 25.1835 | 1.5628 | 21.4714 | 117.3% |
 * | 2048 | 7.5396 | 17.8017 | 7.8081 | 17.1896 | 103.6% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0513 | 10.2240 | 0.0317 | 16.5245 | 61.9% |
 * | 256 | 0.1734 | 12.0960 | 0.1032 | 20.3181 | 59.5% |
 * | 512 | 0.6799 | 12.3373 | 0.3786 | 22.1574 | 55.7% |
 * | 1024 | 1.5370 | 21.8310 | 1.5614 | 21.4905 | 101.6% |
 * | 2048 | 9.1631 | 14.6476 | 7.7646 | 17.2858 | 84.7% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0519 | 10.1042 | 0.0301 | 17.3928 | 58.1% |
 * | 256 | 0.1766 | 11.8768 | 0.1056 | 19.8534 | 59.8% |
 * | 512 | 0.6788 | 12.3574 | 0.3804 | 22.0511 | 56.0% |
 * | 1024 | 1.3359 | 25.1180 | 1.5664 | 21.4220 | 117.3% |
 * | 2048 | 7.5167 | 17.8559 | 7.8095 | 17.1865 | 103.9% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0516 | 10.1512 | 0.0326 | 16.0864 | 63.1% |
 * | 256 | 0.1763 | 11.8951 | 0.1028 | 20.3908 | 58.3% |
 * | 512 | 0.6861 | 12.2269 | 0.3784 | 22.1658 | 55.2% |
 * | 1024 | 1.3319 | 25.1922 | 1.5642 | 21.4520 | 117.4% |
 * | 2048 | 7.5645 | 17.7431 | 7.8222 | 17.1587 | 103.4% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0538 | 9.7524 | 0.0266 | 19.6923 | 49.5% |
 * | 256 | 0.1802 | 11.6364 | 0.1013 | 20.6967 | 56.2% |
 * | 512 | 0.6929 | 12.1071 | 0.3785 | 22.1602 | 54.6% |
 * | 1024 | 1.3886 | 24.1649 | 1.5655 | 21.4336 | 112.7% |
 * | 2048 | 7.7016 | 17.4271 | 7.7424 | 17.3354 | 100.5% |
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
 * | 64 | 0.0076 | 17.3559 | 0.0177 | 7.3868 | 235.0% |
 * | 128 | 0.0079 | 66.4665 | 0.0425 | 12.3420 | 538.5% |
 * | 256 | 0.0093 | 224.4384 | 0.1351 | 15.5280 | 1445.4% |
 * | 512 | 0.0261 | 321.8465 | 0.4952 | 16.9409 | 1899.8% |
 * | 1024 | 0.0723 | 464.2798 | 1.9480 | 17.2255 | 2695.3% |
 * | 2048 | 0.2524 | 531.8671 | 9.1036 | 14.7433 | 3607.5% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0281 | 4.6651 | 152.4% |
 * | 128 | 0.0537 | 9.7640 | 0.0679 | 7.7210 | 126.5% |
 * | 256 | 0.1802 | 11.6364 | 0.1984 | 10.5703 | 110.1% |
 * | 512 | 0.6930 | 12.1041 | 0.7029 | 11.9335 | 101.4% |
 * | 1024 | 1.3844 | 24.2367 | 2.6800 | 12.5202 | 193.6% |
 * | 2048 | 7.6822 | 17.4713 | 11.6945 | 11.4770 | 152.2% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0515 | 10.1827 | 0.0261 | 20.0907 | 50.7% |
 * | 256 | 0.1763 | 11.8972 | 0.1003 | 20.9013 | 56.9% |
 * | 512 | 0.6753 | 12.4221 | 0.3772 | 22.2391 | 55.9% |
 * | 1024 | 1.3210 | 25.4016 | 1.5649 | 21.4413 | 118.5% |
 * | 2048 | 7.4481 | 18.0205 | 7.7821 | 17.2470 | 104.5% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.8000 | 55.6% |
 * | 128 | 0.0542 | 9.6775 | 0.0263 | 19.9562 | 48.5% |
 * | 256 | 0.1802 | 11.6364 | 0.1007 | 20.8348 | 55.9% |
 * | 512 | 0.6926 | 12.1116 | 0.3772 | 22.2363 | 54.5% |
 * | 1024 | 1.3849 | 24.2280 | 1.5648 | 21.4426 | 113.0% |
 * | 2048 | 7.6896 | 17.4544 | 7.7837 | 17.2433 | 101.2% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0102 | 12.9008 | 55.1% |
 * | 128 | 0.0516 | 10.1575 | 0.0262 | 20.0293 | 50.7% |
 * | 256 | 0.1761 | 11.9070 | 0.1004 | 20.8980 | 57.0% |
 * | 512 | 0.6746 | 12.4342 | 0.3749 | 22.3730 | 55.6% |
 * | 1024 | 1.3210 | 25.4016 | 1.5646 | 21.4461 | 118.4% |
 * | 2048 | 7.4462 | 18.0250 | 7.7398 | 17.3412 | 103.9% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0061 | 21.3333 | 33.3% |
 * | 128 | 0.0518 | 10.1167 | 0.0181 | 28.8959 | 35.0% |
 * | 256 | 0.1761 | 11.9070 | 0.0854 | 24.5453 | 48.5% |
 * | 512 | 0.6749 | 12.4289 | 0.3287 | 25.5203 | 48.7% |
 * | 1024 | 1.3225 | 25.3727 | 1.4168 | 23.6841 | 107.1% |
 * | 2048 | 7.4437 | 18.0311 | 7.2065 | 18.6246 | 96.8% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0101 | 12.9211 | 55.0% |
 * | 128 | 0.0517 | 10.1323 | 0.0262 | 20.0049 | 50.6% |
 * | 256 | 0.1762 | 11.8994 | 0.1025 | 20.4576 | 58.2% |
 * | 512 | 0.6743 | 12.4401 | 0.3761 | 22.3035 | 55.8% |
 * | 1024 | 1.3210 | 25.4016 | 1.5641 | 21.4534 | 118.4% |
 * | 2048 | 7.4447 | 18.0287 | 7.8084 | 17.1888 | 104.9% |
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
 * | 64 | 0.0164 | 7.9922 | 0.0144 | 9.1225 | 87.6% |
 * | 128 | 0.0426 | 12.3188 | 0.0327 | 16.0313 | 76.8% |
 * | 256 | 0.1347 | 15.5741 | 0.0976 | 21.4837 | 72.5% |
 * | 512 | 0.5179 | 16.1967 | 0.3191 | 26.2867 | 61.6% |
 * | 1024 | 1.2645 | 26.5351 | 1.2268 | 27.3508 | 97.0% |
 * | 2048 | 6.9889 | 19.2045 | 6.6326 | 20.2362 | 94.9% |
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
 * | 64 | 0.0184 | 7.1111 | 0.0101 | 12.9211 | 55.0% |
 * | 128 | 0.0516 | 10.1512 | 0.0262 | 20.0416 | 50.7% |
 * | 256 | 0.1761 | 11.9070 | 0.1004 | 20.8980 | 57.0% |
 * | 512 | 0.6749 | 12.4292 | 0.3763 | 22.2949 | 55.7% |
 * | 1024 | 1.3210 | 25.4016 | 1.5646 | 21.4459 | 118.4% |
 * | 2048 | 7.4464 | 18.0245 | 7.8038 | 17.1990 | 104.8% |
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
 * | 64 | 0.0170 | 7.7137 | 0.0102 | 12.8000 | 60.3% |
 * | 128 | 0.0444 | 11.8168 | 0.0264 | 19.8474 | 59.5% |
 * | 256 | 0.1494 | 14.0334 | 0.1016 | 20.6510 | 68.0% |
 * | 512 | 0.5614 | 14.9421 | 0.3808 | 22.0289 | 67.8% |
 * | 1024 | 1.2368 | 27.1307 | 1.3237 | 25.3487 | 107.0% |
 * | 2048 | 6.9302 | 19.3671 | 7.8336 | 17.1337 | 113.0% |
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
 * | 64 | 0.0166 | 7.9073 |
 * | 128 | 0.0427 | 12.2911 |
 * | 256 | 0.1348 | 15.5612 |
 * | 512 | 0.5169 | 16.2288 |
 * | 1024 | 1.2659 | 26.5070 |
 * | 2048 | 6.9901 | 19.2010 |
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
 * | 64 | 0.0184 | 7.1111 |
 * | 128 | 0.0516 | 10.1701 |
 * | 256 | 0.1763 | 11.8983 |
 * | 512 | 0.6744 | 12.4386 |
 * | 1024 | 1.3219 | 25.3828 |
 * | 2048 | 7.4446 | 18.0288 |
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
