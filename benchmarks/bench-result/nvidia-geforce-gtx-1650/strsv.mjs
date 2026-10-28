/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0111 | 0.2126 | 0.0082 | 0.2891 | 73.6% |
 * | 64 | 0.0149 | 0.5929 | 0.0102 | 0.8625 | 68.7% |
 * | 128 | 0.0267 | 1.2743 | 0.0138 | 2.4658 | 51.7% |
 * | 256 | 0.0414 | 3.2272 | 0.0207 | 6.4494 | 50.0% |
 * | 512 | 0.0594 | 8.9138 | 0.0356 | 14.8844 | 59.9% |
 * | 1024 | 0.1209 | 17.4268 | 0.0840 | 25.0976 | 69.4% |
 * | 2048 | 0.2315 | 36.3212 | 0.1700 | 49.4699 | 73.4% |
 * | 4096 | 0.5388 | 62.3485 | 0.3768 | 89.1522 | 69.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strsv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-default.svg)
 *
 * ![strsv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-default.svg)
 *
 * ## See also
 *
 * - [strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/strsv.js) — WebGPU benchmark script
 * - [strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/strsv.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.2173 | 0.0082 | 0.2879 | 75.5% |
 * | 64 | 0.0147 | 0.6020 | 0.0102 | 0.8625 | 69.8% |
 * | 128 | 0.0265 | 1.2835 | 0.0137 | 2.4773 | 51.8% |
 * | 256 | 0.0423 | 3.1589 | 0.0205 | 6.5250 | 48.4% |
 * | 512 | 0.0616 | 8.5921 | 0.0351 | 15.0674 | 57.0% |
 * | 1024 | 0.1275 | 16.5343 | 0.0832 | 25.3244 | 65.3% |
 * | 1280 | 0.1903 | 17.2860 | 0.1044 | 31.4951 | 54.9% |
 * | 2048 | 0.2560 | 32.8459 | 0.1696 | 49.5866 | 66.2% |
 * | 4096 | 0.6472 | 51.9114 | 0.3800 | 88.3978 | 58.7% |
 *
 * ![strsv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride4.svg)
 *
 * ![strsv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0110 | 0.2157 | 0.0082 | 0.2891 | 74.6% |
 * | 64 | 0.0147 | 0.6013 | 0.0102 | 0.8625 | 69.7% |
 * | 128 | 0.0263 | 1.2960 | 0.0135 | 2.5303 | 51.2% |
 * | 256 | 0.0420 | 3.1854 | 0.0205 | 6.5250 | 48.8% |
 * | 512 | 0.0596 | 8.8851 | 0.0351 | 15.0880 | 58.9% |
 * | 1024 | 0.1270 | 16.5968 | 0.0833 | 25.3049 | 65.6% |
 * | 1280 | 0.1901 | 17.3049 | 0.1048 | 31.3941 | 55.1% |
 * | 2048 | 0.2561 | 32.8398 | 0.1700 | 49.4699 | 66.4% |
 * | 4096 | 0.6500 | 51.6852 | 0.3831 | 87.6963 | 58.9% |
 *
 * ![strsv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride5.svg)
 *
 * ![strsv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0110 | 0.2145 | 0.0080 | 0.2948 | 72.8% |
 * | 64 | 0.0148 | 0.5948 | 0.0099 | 0.8961 | 66.4% |
 * | 128 | 0.0266 | 1.2788 | 0.0133 | 2.5669 | 49.8% |
 * | 256 | 0.0426 | 3.1351 | 0.0206 | 6.4744 | 48.4% |
 * | 512 | 0.0643 | 8.2329 | 0.0357 | 14.8111 | 55.6% |
 * | 1024 | 0.1307 | 16.1234 | 0.0857 | 24.5961 | 65.6% |
 * | 1280 | 0.1947 | 16.8940 | 0.1104 | 29.7841 | 56.7% |
 * | 2048 | 0.2980 | 28.2214 | 0.1759 | 47.8050 | 59.0% |
 * | 4096 | 0.7106 | 47.2748 | 0.3918 | 85.7515 | 55.1% |
 *
 * ![strsv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride32.svg)
 *
 * ![strsv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0111 | 0.2142 | 0.0081 | 0.2919 | 73.4% |
 * | 64 | 0.0147 | 0.6013 | 0.0099 | 0.8961 | 67.1% |
 * | 128 | 0.0266 | 1.2788 | 0.0135 | 2.5273 | 50.6% |
 * | 256 | 0.0422 | 3.1660 | 0.0205 | 6.5250 | 48.5% |
 * | 512 | 0.0634 | 8.3471 | 0.0370 | 14.3052 | 58.4% |
 * | 1024 | 0.1293 | 16.3010 | 0.0852 | 24.7486 | 65.9% |
 * | 1280 | 0.1928 | 17.0665 | 0.1090 | 30.1820 | 56.5% |
 * | 2048 | 0.2619 | 32.1036 | 0.1783 | 47.1658 | 68.1% |
 * | 4096 | 0.7085 | 47.4190 | 0.3929 | 85.5140 | 55.5% |
 *
 * ![strsv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride33.svg)
 *
 * ![strsv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0121 | 0.1963 | 0.0079 | 0.2996 | 65.5% |
 * | 64 | 0.0164 | 0.5401 | 0.0098 | 0.9034 | 59.8% |
 * | 128 | 0.0297 | 1.1472 | 0.0197 | 1.7301 | 66.3% |
 * | 256 | 0.0493 | 2.7082 | 0.0218 | 6.1232 | 44.2% |
 * | 512 | 0.0757 | 6.9953 | 0.0468 | 11.3083 | 61.9% |
 * | 1024 | 0.1331 | 15.8365 | 0.0908 | 23.2173 | 68.2% |
 * | 1280 | 0.1945 | 16.9107 | 0.1093 | 30.1069 | 56.2% |
 * | 2048 | 0.2626 | 32.0273 | 0.1745 | 48.1951 | 66.5% |
 * | 4096 | 0.7418 | 45.2905 | 0.3921 | 85.6850 | 52.9% |
 *
 * ![strsv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride255.svg)
 *
 * ![strsv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0113 | 0.2093 | 0.0079 | 0.2990 | 70.0% |
 * | 64 | 0.0148 | 0.5974 | 0.0098 | 0.9049 | 66.0% |
 * | 128 | 0.0266 | 1.2788 | 0.0198 | 1.7231 | 74.2% |
 * | 256 | 0.0429 | 3.1164 | 0.0220 | 6.0875 | 51.2% |
 * | 512 | 0.0653 | 8.1078 | 0.0468 | 11.3121 | 71.7% |
 * | 1024 | 0.1305 | 16.1451 | 0.0905 | 23.2748 | 69.4% |
 * | 1280 | 0.1946 | 16.9079 | 0.1091 | 30.1599 | 56.1% |
 * | 2048 | 0.2929 | 28.7133 | 0.1709 | 49.2105 | 58.3% |
 * | 4096 | 0.7821 | 42.9565 | 0.3897 | 86.2163 | 49.8% |
 *
 * ![strsv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-stride256.svg)
 *
 * ![strsv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/stride.strsv.js) — WebGPU stride-sweep benchmark script
 * - [stride.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/stride.strsv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0110 | 0.2157 | 0.0082 | 0.2891 | 74.6% |
 * | 64 | 0.0145 | 0.6073 | 0.0102 | 0.8625 | 70.4% |
 * | 128 | 0.0264 | 1.2881 | 0.0140 | 2.4404 | 52.8% |
 * | 256 | 0.0421 | 3.1720 | 0.0207 | 6.4594 | 49.1% |
 * | 512 | 0.0599 | 8.8447 | 0.0354 | 14.9381 | 59.2% |
 * | 1024 | 0.1267 | 16.6387 | 0.0835 | 25.2370 | 65.9% |
 * | 1280 | 0.1884 | 17.4592 | 0.1048 | 31.3845 | 55.6% |
 * | 2048 | 0.2540 | 33.1129 | 0.1700 | 49.4699 | 66.9% |
 * | 4096 | 0.6376 | 52.6877 | 0.3771 | 89.0879 | 59.1% |
 *
 * ![strsv-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-transno-transpose.svg)
 *
 * ![strsv-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0114 | 0.2079 | 0.0100 | 0.2357 | 88.2% |
 * | 64 | 0.0150 | 0.5897 | 0.0119 | 0.7449 | 79.2% |
 * | 128 | 0.0267 | 1.2773 | 0.0155 | 2.2029 | 58.0% |
 * | 256 | 0.0413 | 3.2360 | 0.0226 | 5.9066 | 54.8% |
 * | 512 | 0.0589 | 8.9913 | 0.0379 | 13.9789 | 64.3% |
 * | 1024 | 0.1208 | 17.4407 | 0.0799 | 26.3846 | 66.1% |
 * | 1280 | 0.1432 | 22.9669 | 0.1050 | 31.3224 | 73.3% |
 * | 2048 | 0.2314 | 36.3363 | 0.1638 | 51.3250 | 70.8% |
 * | 4096 | 0.5381 | 62.4283 | 0.3880 | 86.5789 | 72.1% |
 *
 * ![strsv-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-transtranspose.svg)
 *
 * ![strsv-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/trans.strsv.js) — WebGPU trans-sweep benchmark script
 * - [trans.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/trans.strsv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0113 | 0.2099 | 0.0082 | 0.2891 | 72.6% |
 * | 64 | 0.0147 | 0.6013 | 0.0102 | 0.8625 | 69.7% |
 * | 128 | 0.0266 | 1.2788 | 0.0140 | 2.4348 | 52.5% |
 * | 256 | 0.0420 | 3.1817 | 0.0207 | 6.4494 | 49.3% |
 * | 512 | 0.0594 | 8.9138 | 0.0355 | 14.8978 | 59.8% |
 * | 1024 | 0.1267 | 16.6366 | 0.0839 | 25.1263 | 66.2% |
 * | 1280 | 0.1888 | 17.4237 | 0.1049 | 31.3558 | 55.6% |
 * | 2048 | 0.2540 | 33.1129 | 0.1700 | 49.4699 | 66.9% |
 * | 4096 | 0.6380 | 52.6547 | 0.3772 | 89.0576 | 59.1% |
 *
 * ![strsv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-uplolower.svg)
 *
 * ![strsv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.2170 | 0.0083 | 0.2868 | 75.7% |
 * | 64 | 0.0148 | 0.5987 | 0.0102 | 0.8638 | 69.3% |
 * | 128 | 0.0266 | 1.2788 | 0.0138 | 2.4687 | 51.8% |
 * | 256 | 0.0422 | 3.1696 | 0.0206 | 6.4946 | 48.8% |
 * | 512 | 0.0614 | 8.6167 | 0.0349 | 15.1710 | 56.8% |
 * | 1024 | 0.1264 | 16.6724 | 0.0673 | 31.3302 | 53.2% |
 * | 1280 | 0.1843 | 17.8472 | 0.0836 | 39.3342 | 45.4% |
 * | 2048 | 0.2575 | 32.6521 | 0.1304 | 64.4948 | 50.6% |
 * | 4096 | 0.6363 | 52.8017 | 0.2890 | 116.2374 | 45.4% |
 *
 * ![strsv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-uploupper.svg)
 *
 * ![strsv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/uplo.strsv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/uplo.strsv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0109 | 0.2176 | 0.0082 | 0.2891 | 75.3% |
 * | 64 | 0.0146 | 0.6039 | 0.0102 | 0.8625 | 70.0% |
 * | 128 | 0.0264 | 1.2905 | 0.0140 | 2.4348 | 53.0% |
 * | 256 | 0.0419 | 3.1902 | 0.0208 | 6.4395 | 49.5% |
 * | 512 | 0.0594 | 8.9138 | 0.0356 | 14.8911 | 59.9% |
 * | 1024 | 0.1265 | 16.6555 | 0.0835 | 25.2370 | 66.0% |
 * | 1280 | 0.1890 | 17.4031 | 0.1048 | 31.3941 | 55.4% |
 * | 2048 | 0.2540 | 33.1129 | 0.1700 | 49.4699 | 66.9% |
 * | 4096 | 0.6372 | 52.7248 | 0.3775 | 88.9859 | 59.3% |
 *
 * ![strsv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad0.svg)
 *
 * ![strsv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0111 | 0.2139 | 0.0082 | 0.2891 | 74.0% |
 * | 64 | 0.0150 | 0.5904 | 0.0100 | 0.8832 | 66.8% |
 * | 128 | 0.0273 | 1.2459 | 0.0134 | 2.5364 | 49.1% |
 * | 256 | 0.0421 | 3.1720 | 0.0206 | 6.4946 | 48.8% |
 * | 512 | 0.0646 | 8.1982 | 0.0352 | 15.0263 | 54.6% |
 * | 1024 | 0.1311 | 16.0781 | 0.0820 | 25.6849 | 62.6% |
 * | 1280 | 0.1938 | 16.9763 | 0.1040 | 31.6405 | 53.7% |
 * | 2048 | 0.2680 | 31.3809 | 0.1703 | 49.3909 | 63.5% |
 * | 4096 | 0.6716 | 50.0217 | 0.3889 | 86.3759 | 57.9% |
 *
 * ![strsv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad1.svg)
 *
 * ![strsv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.2170 | 0.0082 | 0.2891 | 75.1% |
 * | 64 | 0.0145 | 0.6106 | 0.0102 | 0.8625 | 70.8% |
 * | 128 | 0.0261 | 1.3039 | 0.0140 | 2.4348 | 53.6% |
 * | 256 | 0.0417 | 3.2012 | 0.0209 | 6.4049 | 50.0% |
 * | 512 | 0.0615 | 8.6055 | 0.0353 | 14.9923 | 57.4% |
 * | 1024 | 0.1315 | 16.0234 | 0.0835 | 25.2467 | 63.5% |
 * | 1280 | 0.1864 | 17.6511 | 0.1050 | 31.3224 | 56.4% |
 * | 2048 | 0.3194 | 26.3284 | 0.1728 | 48.6502 | 54.1% |
 * | 4096 | 0.6677 | 50.3154 | 0.3910 | 85.9129 | 58.6% |
 *
 * ![strsv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad8.svg)
 *
 * ![strsv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.2170 | 0.0082 | 0.2879 | 75.4% |
 * | 64 | 0.0145 | 0.6099 | 0.0102 | 0.8625 | 70.7% |
 * | 128 | 0.0262 | 1.2991 | 0.0138 | 2.4601 | 52.8% |
 * | 256 | 0.0420 | 3.1817 | 0.0208 | 6.4296 | 49.5% |
 * | 512 | 0.0649 | 8.1578 | 0.0354 | 14.9719 | 54.5% |
 * | 1024 | 0.1339 | 15.7362 | 0.0840 | 25.0976 | 62.7% |
 * | 1280 | 0.1783 | 18.4494 | 0.1051 | 31.3128 | 58.9% |
 * | 2048 | 0.2679 | 31.3941 | 0.1722 | 48.8355 | 64.3% |
 * | 4096 | 0.7088 | 47.3986 | 0.3934 | 85.3958 | 55.5% |
 *
 * ![strsv-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad16.svg)
 *
 * ![strsv-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0117 | 0.2025 | 0.0083 | 0.2868 | 70.6% |
 * | 64 | 0.0160 | 0.5503 | 0.0102 | 0.8625 | 63.8% |
 * | 128 | 0.0286 | 1.1922 | 0.0137 | 2.4773 | 48.1% |
 * | 256 | 0.0454 | 2.9429 | 0.0207 | 6.4544 | 45.6% |
 * | 512 | 0.0685 | 7.7272 | 0.0352 | 15.0468 | 51.4% |
 * | 1024 | 0.1479 | 14.2453 | 0.0840 | 25.0976 | 56.8% |
 * | 1280 | 0.1884 | 17.4592 | 0.1050 | 31.3224 | 55.7% |
 * | 2048 | 0.3092 | 27.1921 | 0.1738 | 48.3770 | 56.2% |
 * | 4096 | 0.7414 | 45.3149 | 0.3932 | 85.4375 | 53.0% |
 *
 * ![strsv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad32.svg)
 *
 * ![strsv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.2167 | 0.0083 | 0.2868 | 75.6% |
 * | 64 | 0.0145 | 0.6106 | 0.0102 | 0.8625 | 70.8% |
 * | 128 | 0.0261 | 1.3031 | 0.0139 | 2.4544 | 53.1% |
 * | 256 | 0.0417 | 3.2025 | 0.0207 | 6.4644 | 49.5% |
 * | 512 | 0.0635 | 8.3387 | 0.0353 | 14.9923 | 55.6% |
 * | 1024 | 0.1405 | 15.0014 | 0.0840 | 25.0976 | 59.8% |
 * | 1280 | 0.1739 | 18.9197 | 0.1051 | 31.2985 | 60.4% |
 * | 2048 | 0.2962 | 28.3937 | 0.1741 | 48.3059 | 58.8% |
 * | 4096 | 0.8087 | 41.5447 | 0.3979 | 84.4275 | 49.2% |
 *
 * ![strsv-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad48.svg)
 *
 * ![strsv-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0119 | 0.1987 | 0.0082 | 0.2885 | 68.9% |
 * | 64 | 0.0161 | 0.5498 | 0.0102 | 0.8625 | 63.7% |
 * | 128 | 0.0287 | 1.1875 | 0.0137 | 2.4773 | 47.9% |
 * | 256 | 0.0468 | 2.8525 | 0.0210 | 6.3756 | 44.7% |
 * | 512 | 0.0700 | 7.5578 | 0.0354 | 14.9449 | 50.6% |
 * | 1024 | 0.1568 | 13.4359 | 0.0840 | 25.0976 | 53.5% |
 * | 1280 | 0.1843 | 17.8472 | 0.1047 | 31.4277 | 56.8% |
 * | 2048 | 0.3332 | 25.2410 | 0.1741 | 48.3059 | 52.3% |
 * | 4096 | 0.7590 | 44.2641 | 0.3956 | 84.9192 | 52.1% |
 *
 * ![strsv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad64.svg)
 *
 * ![strsv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0110 | 0.2154 | 0.0083 | 0.2868 | 75.1% |
 * | 64 | 0.0149 | 0.5935 | 0.0102 | 0.8625 | 68.8% |
 * | 128 | 0.0266 | 1.2812 | 0.0138 | 2.4601 | 52.1% |
 * | 256 | 0.0424 | 3.1553 | 0.0208 | 6.4296 | 49.1% |
 * | 512 | 0.0635 | 8.3387 | 0.0353 | 15.0127 | 55.5% |
 * | 1024 | 0.1434 | 14.7000 | 0.0840 | 25.0976 | 58.6% |
 * | 1280 | 0.1743 | 18.8693 | 0.1052 | 31.2795 | 60.3% |
 * | 2048 | 0.3523 | 23.8721 | 0.1761 | 47.7442 | 50.0% |
 * | 4096 | 0.8188 | 41.0292 | 0.4053 | 82.8812 | 49.5% |
 *
 * ![strsv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-pad128.svg)
 *
 * ![strsv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/lda.strsv.js) — WebGPU lda-sweep benchmark script
 * - [lda.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/lda.strsv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0109 | 0.2164 | 0.0082 | 0.2879 | 75.2% |
 * | 64 | 0.0146 | 0.6039 | 0.0102 | 0.8625 | 70.0% |
 * | 128 | 0.0264 | 1.2881 | 0.0138 | 2.4630 | 52.3% |
 * | 256 | 0.0420 | 3.1793 | 0.0207 | 6.4444 | 49.3% |
 * | 512 | 0.0594 | 8.9138 | 0.0354 | 14.9652 | 59.6% |
 * | 1024 | 0.1269 | 16.6072 | 0.0838 | 25.1599 | 66.0% |
 * | 1280 | 0.1886 | 17.4429 | 0.1048 | 31.3749 | 55.6% |
 * | 2048 | 0.2540 | 33.1129 | 0.1700 | 49.4699 | 66.9% |
 * | 4096 | 0.6369 | 52.7460 | 0.3769 | 89.1408 | 59.2% |
 *
 * ![strsv-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-diagnonunit.svg)
 *
 * ![strsv-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.2173 | 0.0061 | 0.3854 | 56.4% |
 * | 64 | 0.0146 | 0.6039 | 0.0081 | 1.0931 | 55.3% |
 * | 128 | 0.0265 | 1.2850 | 0.0115 | 2.9721 | 43.2% |
 * | 256 | 0.0421 | 3.1745 | 0.0184 | 7.2626 | 43.7% |
 * | 512 | 0.0594 | 8.9138 | 0.0312 | 16.9421 | 52.6% |
 * | 1024 | 0.1268 | 16.6135 | 0.0734 | 28.7142 | 57.9% |
 * | 1280 | 0.1888 | 17.4282 | 0.0935 | 35.1693 | 49.6% |
 * | 2048 | 0.2540 | 33.1129 | 0.1508 | 55.7750 | 59.4% |
 * | 4096 | 0.6369 | 52.7460 | 0.3412 | 98.4763 | 53.6% |
 *
 * ![strsv-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-diagunit.svg)
 *
 * ![strsv-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/diag.strsv.js) — WebGPU diag-sweep benchmark script
 * - [diag.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/diag.strsv.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 32 | 0.0111 | 0.2133 |
 * | 64 | 0.0150 | 0.5891 |
 * | 128 | 0.0267 | 1.2758 |
 * | 256 | 0.0413 | 3.2372 |
 * | 512 | 0.0592 | 8.9451 |
 * | 1024 | 0.1209 | 17.4314 |
 * | 1280 | 0.1433 | 22.9618 |
 * | 2048 | 0.2314 | 36.3363 |
 * | 4096 | 0.5394 | 62.2875 |
 *
 * ![strsv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-layoutcolumnmajor.svg)
 *
 * ![strsv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0109 | 0.2164 |
 * | 64 | 0.0147 | 0.6007 |
 * | 128 | 0.0265 | 1.2835 |
 * | 256 | 0.0421 | 3.1708 |
 * | 512 | 0.0594 | 8.9138 |
 * | 1024 | 0.1269 | 16.6051 |
 * | 1280 | 0.1886 | 17.4385 |
 * | 2048 | 0.2540 | 33.1129 |
 * | 4096 | 0.6372 | 52.7274 |
 *
 * ![strsv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-layoutrowmajor.svg)
 *
 * ![strsv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/layout.strsv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
