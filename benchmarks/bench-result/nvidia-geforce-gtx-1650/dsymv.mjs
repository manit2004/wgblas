/**
 * Benchmark results for dsymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.6094 | 0.0039 | 1.2946 | 47.1% |
 * | 64 | 0.0085 | 2.1434 | 0.0042 | 4.2868 | 50.0% |
 * | 128 | 0.0115 | 6.0167 | 0.0054 | 12.7434 | 47.2% |
 * | 256 | 0.0228 | 11.8285 | 0.0073 | 37.0749 | 31.9% |
 * | 512 | 0.0561 | 18.9427 | 0.0161 | 66.1015 | 28.7% |
 * | 1024 | 0.1779 | 23.7353 | 0.0598 | 70.6089 | 33.6% |
 * | 1280 | 0.2823 | 23.3443 | 0.0820 | 80.3277 | 29.1% |
 * | 2048 | 0.6369 | 26.4309 | 0.1963 | 85.7716 | 30.8% |
 * | 4096 | 3.5168 | 19.1150 | 0.7721 | 87.0663 | 22.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dsymv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-default.svg)
 *
 * ![dsymv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-default.svg)
 *
 * ## See also
 *
 * - [dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/dsymv.js) — WebGPU benchmark script
 * - [dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/dsymv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0082 | 0.5748 | 0.0039 | 1.2033 | 47.8% |
 * | 64 | 0.0086 | 2.0520 | 0.0049 | 3.6197 | 56.7% |
 * | 128 | 0.0119 | 5.7358 | 0.0055 | 12.3362 | 46.5% |
 * | 256 | 0.0232 | 11.5359 | 0.0075 | 35.6923 | 32.3% |
 * | 512 | 0.0594 | 17.8276 | 0.0163 | 65.0059 | 27.4% |
 * | 1024 | 0.1946 | 21.6632 | 0.0613 | 68.7791 | 31.5% |
 * | 1280 | 0.3107 | 21.1773 | 0.0841 | 78.2493 | 27.1% |
 * | 2048 | 0.7258 | 23.1722 | 0.2007 | 83.7959 | 27.7% |
 * | 4096 | 3.3814 | 19.8708 | 0.7841 | 85.6955 | 23.2% |
 *
 * ![dsymv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride4.svg)
 *
 * ![dsymv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5670 | 0.0039 | 1.2131 | 46.7% |
 * | 64 | 0.0088 | 2.0073 | 0.0044 | 4.0588 | 49.5% |
 * | 128 | 0.0120 | 5.6671 | 0.0060 | 11.3191 | 50.1% |
 * | 256 | 0.0225 | 11.8636 | 0.0074 | 36.3130 | 32.7% |
 * | 512 | 0.0572 | 18.5263 | 0.0160 | 66.0439 | 28.1% |
 * | 1024 | 0.1925 | 21.8973 | 0.0613 | 68.7791 | 31.8% |
 * | 1280 | 0.3154 | 20.8604 | 0.0840 | 78.3537 | 26.6% |
 * | 2048 | 0.7594 | 22.1455 | 0.2023 | 83.1463 | 26.6% |
 * | 4096 | 3.7059 | 18.1307 | 0.8342 | 80.5429 | 22.5% |
 *
 * ![dsymv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride5.svg)
 *
 * ![dsymv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5649 | 0.0041 | 1.1562 | 48.9% |
 * | 64 | 0.0095 | 1.8617 | 0.0047 | 3.7297 | 49.9% |
 * | 128 | 0.0145 | 4.7028 | 0.0059 | 11.5027 | 40.9% |
 * | 256 | 0.0329 | 8.1285 | 0.0082 | 32.6250 | 24.9% |
 * | 512 | 0.0985 | 10.7481 | 0.0183 | 57.7452 | 18.6% |
 * | 1024 | 0.3482 | 12.1059 | 0.0676 | 62.3636 | 19.4% |
 * | 1280 | 0.5489 | 11.9869 | 0.0920 | 71.5504 | 16.8% |
 * | 2048 | 1.3073 | 12.8652 | 0.2048 | 82.1200 | 15.7% |
 * | 4096 | 8.7356 | 7.6916 | 0.7940 | 84.6214 | 9.1% |
 *
 * ![dsymv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride32.svg)
 *
 * ![dsymv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5692 | 0.0040 | 1.1840 | 48.1% |
 * | 64 | 0.0087 | 2.0220 | 0.0042 | 4.1818 | 48.4% |
 * | 128 | 0.0123 | 5.5417 | 0.0054 | 12.6667 | 43.7% |
 * | 256 | 0.0242 | 11.0257 | 0.0072 | 36.8742 | 29.9% |
 * | 512 | 0.0707 | 14.9719 | 0.0174 | 60.9355 | 24.6% |
 * | 1024 | 0.2642 | 15.9516 | 0.0632 | 66.7234 | 23.9% |
 * | 1280 | 0.4321 | 15.2251 | 0.0866 | 75.9512 | 20.0% |
 * | 2048 | 1.0495 | 16.0244 | 0.2040 | 82.4485 | 19.4% |
 * | 4096 | 7.9527 | 8.4488 | 0.7939 | 84.6368 | 10.0% |
 *
 * ![dsymv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride33.svg)
 *
 * ![dsymv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5670 | 0.0040 | 1.1746 | 48.3% |
 * | 64 | 0.0089 | 1.9856 | 0.0042 | 4.1977 | 47.3% |
 * | 128 | 0.0121 | 5.6148 | 0.0053 | 12.8193 | 43.8% |
 * | 256 | 0.0240 | 11.1360 | 0.0072 | 36.9558 | 30.1% |
 * | 512 | 0.0716 | 14.7979 | 0.0164 | 64.4990 | 22.9% |
 * | 1024 | 0.2683 | 15.7099 | 0.0630 | 66.8928 | 23.5% |
 * | 1280 | 0.4383 | 15.0117 | 0.0861 | 76.4454 | 19.6% |
 * | 2048 | 1.0673 | 15.7580 | 0.2048 | 82.1072 | 19.2% |
 * | 4096 | 16.4628 | 4.0814 | 0.7976 | 84.2361 | 4.8% |
 *
 * ![dsymv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride255.svg)
 *
 * ![dsymv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5714 | 0.0040 | 1.1746 | 48.6% |
 * | 64 | 0.0096 | 1.8492 | 0.0047 | 3.7679 | 49.1% |
 * | 128 | 0.0144 | 4.7289 | 0.0054 | 12.7045 | 37.2% |
 * | 256 | 0.0328 | 8.1563 | 0.0081 | 33.0119 | 24.7% |
 * | 512 | 0.0984 | 10.7656 | 0.0164 | 64.6250 | 16.7% |
 * | 1024 | 0.3502 | 12.0351 | 0.0620 | 67.9278 | 17.7% |
 * | 1280 | 0.5492 | 11.9786 | 0.0864 | 76.1199 | 15.7% |
 * | 2048 | 1.3118 | 12.8211 | 0.2048 | 82.1328 | 15.6% |
 * | 4096 | 12.7392 | 5.2744 | 0.7982 | 84.1804 | 6.3% |
 *
 * ![dsymv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride256.svg)
 *
 * ![dsymv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/stride.dsymv.js) — WebGPU stride-sweep benchmark script
 * - [stride.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/stride.dsymv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0082 | 0.5759 | 0.0038 | 1.2542 | 45.9% |
 * | 64 | 0.0085 | 2.0791 | 0.0044 | 3.9712 | 52.4% |
 * | 128 | 0.0114 | 5.9691 | 0.0058 | 11.6923 | 51.1% |
 * | 256 | 0.0220 | 12.1307 | 0.0072 | 37.2027 | 32.6% |
 * | 512 | 0.0553 | 19.1481 | 0.0156 | 67.8033 | 28.2% |
 * | 1024 | 0.1781 | 23.6615 | 0.0597 | 70.6420 | 33.5% |
 * | 1280 | 0.2849 | 23.0946 | 0.0822 | 80.0467 | 28.9% |
 * | 2048 | 0.6466 | 26.0118 | 0.1964 | 85.6392 | 30.4% |
 * | 4096 | 2.9778 | 22.5642 | 0.7719 | 87.0473 | 25.9% |
 *
 * ![dsymv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-uplolower.svg)
 *
 * ![dsymv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5714 | 0.0039 | 1.2231 | 46.7% |
 * | 64 | 0.0086 | 2.0520 | 0.0043 | 4.1504 | 49.4% |
 * | 128 | 0.0118 | 5.7748 | 0.0053 | 12.8193 | 45.0% |
 * | 256 | 0.0228 | 11.7139 | 0.0078 | 34.3704 | 34.1% |
 * | 512 | 0.0558 | 18.9725 | 0.0162 | 65.1980 | 29.1% |
 * | 1024 | 0.1777 | 23.7127 | 0.0616 | 68.3863 | 34.7% |
 * | 1280 | 0.2820 | 23.3345 | 0.0840 | 78.3537 | 29.8% |
 * | 2048 | 0.6373 | 26.3886 | 0.2022 | 83.1858 | 31.7% |
 * | 4096 | 3.4328 | 19.5732 | 0.7952 | 84.4921 | 23.2% |
 *
 * ![dsymv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-uploupper.svg)
 *
 * ![dsymv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/uplo.dsymv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/uplo.dsymv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0082 | 0.6094 | 0.0039 | 1.2683 | 48.0% |
 * | 64 | 0.0085 | 2.1273 | 0.0043 | 4.2388 | 50.2% |
 * | 128 | 0.0116 | 5.9586 | 0.0053 | 12.9341 | 46.1% |
 * | 256 | 0.0220 | 12.2504 | 0.0077 | 35.1399 | 34.9% |
 * | 512 | 0.0553 | 19.2222 | 0.0161 | 66.1673 | 29.1% |
 * | 1024 | 0.1784 | 23.6778 | 0.0595 | 71.0078 | 33.3% |
 * | 1280 | 0.2849 | 23.1280 | 0.0822 | 80.1869 | 28.8% |
 * | 2048 | 0.6460 | 26.0603 | 0.1964 | 85.7227 | 30.4% |
 * | 4096 | 2.9383 | 22.8786 | 0.7722 | 87.0519 | 26.3% |
 *
 * ![dsymv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad0.svg)
 *
 * ![dsymv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.6000 | 0.0041 | 1.2188 | 49.2% |
 * | 64 | 0.0085 | 2.1353 | 0.0045 | 4.0571 | 52.6% |
 * | 128 | 0.0111 | 6.2248 | 0.0054 | 12.7059 | 49.0% |
 * | 256 | 0.0184 | 14.6111 | 0.0075 | 36.0428 | 40.5% |
 * | 512 | 0.0430 | 24.7143 | 0.0164 | 64.6855 | 38.2% |
 * | 1024 | 0.1346 | 31.3687 | 0.0599 | 70.4957 | 44.5% |
 * | 1280 | 0.2355 | 27.9783 | 0.0839 | 78.5205 | 35.6% |
 * | 2048 | 0.5038 | 33.4146 | 0.1983 | 84.9064 | 39.4% |
 *
 * ![dsymv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad1.svg)
 *
 * ![dsymv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.6070 | 0.0039 | 1.2787 | 47.5% |
 * | 64 | 0.0085 | 2.1353 | 0.0044 | 4.1765 | 51.1% |
 * | 128 | 0.0114 | 6.0589 | 0.0055 | 12.5217 | 48.4% |
 * | 256 | 0.0193 | 13.9685 | 0.0075 | 36.0428 | 38.8% |
 * | 512 | 0.0467 | 22.7819 | 0.0164 | 64.8750 | 35.1% |
 * | 1024 | 0.1454 | 29.0518 | 0.0594 | 71.1034 | 40.9% |
 * | 1280 | 0.2346 | 28.0870 | 0.0831 | 79.2610 | 35.4% |
 * | 2048 | 0.5335 | 31.5547 | 0.1982 | 84.9270 | 37.2% |
 *
 * ![dsymv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad8.svg)
 *
 * ![dsymv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.6047 | 0.0039 | 1.2787 | 47.3% |
 * | 64 | 0.0085 | 2.1273 | 0.0045 | 4.0427 | 52.6% |
 * | 128 | 0.0122 | 5.6842 | 0.0055 | 12.5948 | 45.1% |
 * | 256 | 0.0225 | 11.9545 | 0.0072 | 37.1567 | 32.2% |
 * | 512 | 0.0696 | 15.2647 | 0.0163 | 65.2574 | 23.4% |
 * | 1024 | 0.2205 | 19.1480 | 0.0594 | 71.1034 | 26.9% |
 * | 1280 | 0.3506 | 18.7952 | 0.0822 | 80.1557 | 23.4% |
 * | 2048 | 0.8847 | 19.0278 | 0.1973 | 85.3264 | 22.3% |
 *
 * ![dsymv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad32.svg)
 *
 * ![dsymv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0086 | 0.5821 | 0.0039 | 1.2735 | 45.7% |
 * | 64 | 0.0090 | 2.0214 | 0.0043 | 4.2547 | 47.5% |
 * | 128 | 0.0123 | 5.6250 | 0.0054 | 12.7434 | 44.1% |
 * | 256 | 0.0233 | 11.5684 | 0.0074 | 36.5913 | 31.6% |
 * | 512 | 0.0580 | 18.3210 | 0.0162 | 65.6443 | 27.9% |
 * | 1024 | 0.1925 | 21.9362 | 0.0593 | 71.1802 | 30.8% |
 * | 1280 | 0.2833 | 23.2599 | 0.0822 | 80.1713 | 29.0% |
 * | 2048 | 0.6869 | 24.5076 | 0.1966 | 85.6250 | 28.6% |
 *
 * ![dsymv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad64.svg)
 *
 * ![dsymv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0085 | 0.5843 | 0.0039 | 1.2893 | 45.3% |
 * | 64 | 0.0087 | 2.0882 | 0.0043 | 4.2547 | 49.1% |
 * | 128 | 0.0120 | 5.7677 | 0.0053 | 13.0909 | 44.1% |
 * | 256 | 0.0222 | 12.1443 | 0.0073 | 36.8315 | 33.0% |
 * | 512 | 0.0562 | 18.9265 | 0.0162 | 65.7743 | 28.8% |
 * | 1024 | 0.1823 | 23.1685 | 0.0608 | 69.4934 | 33.3% |
 * | 1280 | 0.2703 | 24.3750 | 0.0827 | 79.6904 | 30.6% |
 * | 2048 | 0.6807 | 24.7299 | 0.1966 | 85.6250 | 28.9% |
 *
 * ![dsymv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad128.svg)
 *
 * ![dsymv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/lda.dsymv.js) — WebGPU lda-sweep benchmark script
 * - [lda.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/lda.dsymv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0083 | 0.5736 | 0.0041 | 1.1562 | 49.6% |
 * | 64 | 0.0085 | 2.0674 | 0.0043 | 4.1194 | 50.2% |
 * | 128 | 0.0114 | 5.9608 | 0.0061 | 11.0833 | 53.8% |
 * | 256 | 0.0220 | 12.1572 | 0.0072 | 37.2857 | 32.6% |
 * | 512 | 0.0553 | 19.1481 | 0.0156 | 67.6646 | 28.3% |
 * | 1024 | 0.1785 | 23.6128 | 0.0595 | 70.8129 | 33.3% |
 * | 1280 | 0.2852 | 23.0648 | 0.0819 | 80.3125 | 28.7% |
 * | 2048 | 0.6452 | 26.0666 | 0.1962 | 85.7091 | 30.4% |
 * | 4096 | 2.9411 | 22.8457 | 0.7721 | 87.0239 | 26.3% |
 *
 * ![dsymv-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alphaneg3p75.svg)
 *
 * ![dsymv-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0102 | 0.4625 | 0.0045 | 1.0571 | 43.8% |
 * | 64 | 0.0107 | 1.6453 | 0.0054 | 3.2471 | 50.7% |
 * | 128 | 0.0150 | 4.5277 | 0.0064 | 10.5608 | 42.9% |
 * | 256 | 0.0274 | 9.7684 | 0.0088 | 30.4818 | 32.0% |
 * | 512 | 0.0704 | 15.0468 | 0.0200 | 52.8140 | 28.5% |
 * | 1024 | 0.2270 | 18.5667 | 0.0722 | 58.3442 | 31.8% |
 * | 1280 | 0.3552 | 18.5242 | 0.0963 | 68.3511 | 27.1% |
 * | 2048 | 0.8190 | 20.5348 | 0.2274 | 73.9664 | 27.8% |
 * | 4096 | 2.9711 | 22.6145 | 0.8744 | 76.8393 | 29.4% |
 *
 * ![dsymv-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha0.svg)
 *
 * ![dsymv-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5725 | 0.0038 | 1.2333 | 46.4% |
 * | 64 | 0.0086 | 2.0597 | 0.0043 | 4.1504 | 49.6% |
 * | 128 | 0.0115 | 5.9276 | 0.0053 | 12.8193 | 46.2% |
 * | 256 | 0.0220 | 12.1219 | 0.0071 | 37.6216 | 32.2% |
 * | 512 | 0.0553 | 19.1481 | 0.0160 | 66.1099 | 29.0% |
 * | 1024 | 0.1782 | 23.6552 | 0.0595 | 70.8510 | 33.4% |
 * | 1280 | 0.2853 | 23.0584 | 0.0823 | 79.9689 | 28.8% |
 * | 2048 | 0.6456 | 26.0492 | 0.1965 | 85.5974 | 30.4% |
 * | 4096 | 2.9972 | 22.4175 | 0.7728 | 86.9464 | 25.8% |
 *
 * ![dsymv-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha1eneg38.svg)
 *
 * ![dsymv-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5759 | 0.0048 | 0.9834 | 58.6% |
 * | 64 | 0.0085 | 2.0674 | 0.0057 | 3.1186 | 66.3% |
 * | 128 | 0.0116 | 5.8866 | 0.0064 | 10.6135 | 55.5% |
 * | 256 | 0.0221 | 12.0868 | 0.0088 | 30.2609 | 39.9% |
 * | 512 | 0.0552 | 19.1926 | 0.0198 | 53.4540 | 35.9% |
 * | 1024 | 0.1782 | 23.6552 | 0.0717 | 58.8000 | 40.2% |
 * | 1280 | 0.2847 | 23.1063 | 0.0959 | 68.6019 | 33.7% |
 * | 2048 | 0.6472 | 25.9873 | 0.1966 | 85.5347 | 30.4% |
 * | 4096 | 2.9861 | 22.5013 | 0.7721 | 87.0239 | 25.9% |
 *
 * ![dsymv-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha1.svg)
 *
 * ![dsymv-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5770 | 0.0038 | 1.2333 | 46.8% |
 * | 64 | 0.0085 | 2.0674 | 0.0043 | 4.1504 | 49.8% |
 * | 128 | 0.0119 | 5.7128 | 0.0054 | 12.6667 | 45.1% |
 * | 256 | 0.0220 | 12.1219 | 0.0072 | 36.8742 | 32.9% |
 * | 512 | 0.0553 | 19.1481 | 0.0156 | 67.8033 | 28.2% |
 * | 1024 | 0.1801 | 23.4030 | 0.0594 | 70.9655 | 33.0% |
 * | 1280 | 0.2853 | 23.0635 | 0.0819 | 80.3125 | 28.7% |
 * | 2048 | 0.6474 | 25.9764 | 0.1959 | 85.8561 | 30.3% |
 * | 4096 | 2.9226 | 22.9898 | 0.7723 | 86.9968 | 26.4% |
 *
 * ![dsymv-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha2p5.svg)
 *
 * ![dsymv-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/alpha.dsymv.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/alpha.dsymv.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0083 | 0.5692 | 0.0040 | 1.1746 | 48.5% |
 * | 64 | 0.0086 | 2.0559 | 0.0044 | 4.0292 | 51.0% |
 * | 128 | 0.0117 | 5.8142 | 0.0055 | 12.3006 | 47.3% |
 * | 256 | 0.0221 | 12.0956 | 0.0072 | 36.9558 | 32.7% |
 * | 512 | 0.0553 | 19.1481 | 0.0161 | 65.7813 | 29.1% |
 * | 1024 | 0.1782 | 23.6552 | 0.0601 | 70.1716 | 33.7% |
 * | 1280 | 0.2850 | 23.0882 | 0.0827 | 79.5666 | 29.0% |
 * | 2048 | 0.6464 | 26.0176 | 0.1971 | 85.3126 | 30.5% |
 * | 4096 | 2.9926 | 22.4525 | 0.7719 | 87.0491 | 25.8% |
 *
 * ![dsymv-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-betaneg3p75.svg)
 *
 * ![dsymv-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5759 | 0.0038 | 1.2437 | 46.3% |
 * | 64 | 0.0086 | 2.0520 | 0.0042 | 4.1818 | 49.1% |
 * | 128 | 0.0115 | 5.9111 | 0.0056 | 12.1254 | 48.7% |
 * | 256 | 0.0220 | 12.1572 | 0.0071 | 37.4529 | 32.5% |
 * | 512 | 0.0553 | 19.1481 | 0.0158 | 67.1156 | 28.5% |
 * | 1024 | 0.1782 | 23.6552 | 0.0594 | 70.9273 | 33.4% |
 * | 1280 | 0.2848 | 23.0985 | 0.0821 | 80.1091 | 28.8% |
 * | 2048 | 0.6453 | 26.0621 | 0.1969 | 85.4235 | 30.5% |
 * | 4096 | 2.9770 | 22.5699 | 0.7729 | 86.9302 | 26.0% |
 *
 * ![dsymv-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-beta0.svg)
 *
 * ![dsymv-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5759 | 0.0040 | 1.1840 | 48.6% |
 * | 64 | 0.0086 | 2.0636 | 0.0044 | 4.0588 | 50.8% |
 * | 128 | 0.0116 | 5.8703 | 0.0057 | 11.9887 | 49.0% |
 * | 256 | 0.0220 | 12.1307 | 0.0080 | 33.6097 | 36.1% |
 * | 512 | 0.0553 | 19.1481 | 0.0163 | 65.1339 | 29.4% |
 * | 1024 | 0.1782 | 23.6552 | 0.0601 | 70.1155 | 33.7% |
 * | 1280 | 0.2852 | 23.0700 | 0.0829 | 79.3210 | 29.1% |
 * | 2048 | 0.6455 | 26.0556 | 0.1967 | 85.4860 | 30.5% |
 * | 4096 | 2.9182 | 23.0245 | 0.7721 | 87.0239 | 26.5% |
 *
 * ![dsymv-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-beta1.svg)
 *
 * ![dsymv-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5759 | 0.0041 | 1.1654 | 49.4% |
 * | 64 | 0.0086 | 2.0597 | 0.0044 | 4.0588 | 50.7% |
 * | 128 | 0.0119 | 5.7281 | 0.0054 | 12.7045 | 45.1% |
 * | 256 | 0.0220 | 12.1395 | 0.0074 | 36.3130 | 33.4% |
 * | 512 | 0.0553 | 19.1481 | 0.0161 | 65.5857 | 29.2% |
 * | 1024 | 0.1782 | 23.6552 | 0.0602 | 69.9665 | 33.8% |
 * | 1280 | 0.2861 | 22.9965 | 0.0831 | 79.1835 | 29.0% |
 * | 2048 | 0.6485 | 25.9335 | 0.1972 | 85.2987 | 30.4% |
 * | 4096 | 2.9718 | 22.6093 | 0.7721 | 87.0239 | 26.0% |
 *
 * ![dsymv-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-beta2p5.svg)
 *
 * ![dsymv-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/beta.dsymv.js) — WebGPU beta-sweep benchmark script
 * - [beta.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/beta.dsymv.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 32 | 0.0082 | 0.5759 |
 * | 64 | 0.0085 | 2.0791 |
 * | 128 | 0.0115 | 5.9276 |
 * | 256 | 0.0229 | 11.6730 |
 * | 512 | 0.0558 | 18.9616 |
 * | 1024 | 0.1781 | 23.6615 |
 * | 1280 | 0.2820 | 23.3278 |
 * | 2048 | 0.6386 | 26.3350 |
 * | 4096 | 3.1335 | 21.4429 |
 *
 * ![dsymv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-layoutcolumnmajor.svg)
 *
 * ![dsymv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0082 | 0.5781 |
 * | 64 | 0.0086 | 2.0636 |
 * | 128 | 0.0114 | 5.9608 |
 * | 256 | 0.0220 | 12.1749 |
 * | 512 | 0.0553 | 19.1481 |
 * | 1024 | 0.1782 | 23.6552 |
 * | 1280 | 0.2849 | 23.0920 |
 * | 2048 | 0.6460 | 26.0363 |
 * | 4096 | 3.0294 | 22.1796 |
 *
 * ![dsymv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-layoutrowmajor.svg)
 *
 * ![dsymv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/layout.dsymv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dsymv
 */
