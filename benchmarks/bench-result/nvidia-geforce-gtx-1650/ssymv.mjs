/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0087 | 0.2868 | 0.0034 | 0.7358 | 39.0% |
 * | 64 | 0.0096 | 0.9514 | 0.0039 | 2.3374 | 40.7% |
 * | 128 | 0.0097 | 3.5526 | 0.0044 | 7.7978 | 45.6% |
 * | 256 | 0.0102 | 13.1500 | 0.0052 | 25.8160 | 50.9% |
 * | 512 | 0.0143 | 37.0714 | 0.0084 | 62.9091 | 58.9% |
 * | 1024 | 0.0360 | 58.6264 | 0.0274 | 77.0391 | 76.1% |
 * | 1280 | 0.0560 | 58.8511 | 0.0423 | 77.8231 | 75.6% |
 * | 2048 | 0.0942 | 89.3782 | 0.0988 | 85.1676 | 104.9% |
 * | 4096 | 0.3028 | 110.9856 | 0.3753 | 89.5531 | 123.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-default.svg)
 *
 * ![ssymv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 * - [ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/ssymv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0113 | 0.2099 | 0.0034 | 0.6916 | 30.4% |
 * | 64 | 0.0118 | 0.7459 | 0.0039 | 2.2810 | 32.7% |
 * | 128 | 0.0119 | 2.8525 | 0.0044 | 7.6547 | 37.3% |
 * | 256 | 0.0120 | 11.1064 | 0.0052 | 25.4634 | 43.6% |
 * | 512 | 0.0161 | 32.8580 | 0.0087 | 61.0480 | 53.8% |
 * | 1024 | 0.0379 | 55.6686 | 0.0280 | 75.1781 | 74.0% |
 * | 1280 | 0.0498 | 66.0881 | 0.0438 | 75.0639 | 88.0% |
 * | 2048 | 0.0958 | 87.7556 | 0.1005 | 83.6625 | 104.9% |
 * | 4096 | 0.3105 | 108.1880 | 0.3816 | 88.0493 | 122.9% |
 *
 * ![ssymv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride4.svg)
 *
 * ![ssymv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0112 | 0.2105 | 0.0035 | 0.6727 | 31.3% |
 * | 64 | 0.0117 | 0.7520 | 0.0038 | 2.3193 | 32.4% |
 * | 128 | 0.0120 | 2.8298 | 0.0045 | 7.6000 | 37.2% |
 * | 256 | 0.0119 | 11.2561 | 0.0054 | 24.7101 | 45.6% |
 * | 512 | 0.0160 | 33.0220 | 0.0088 | 60.0508 | 55.0% |
 * | 1024 | 0.0374 | 56.3836 | 0.0285 | 73.9125 | 76.3% |
 * | 1280 | 0.0503 | 65.4569 | 0.0434 | 75.7553 | 86.4% |
 * | 2048 | 0.0960 | 87.5509 | 0.1011 | 83.1595 | 105.3% |
 * | 4096 | 0.3113 | 107.9211 | 0.3830 | 87.7219 | 123.0% |
 *
 * ![ssymv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride5.svg)
 *
 * ![ssymv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0114 | 0.2082 | 0.0038 | 0.6298 | 33.1% |
 * | 64 | 0.0120 | 0.7360 | 0.0038 | 2.3000 | 32.0% |
 * | 128 | 0.0123 | 2.7744 | 0.0045 | 7.6272 | 36.4% |
 * | 256 | 0.0120 | 11.1212 | 0.0056 | 24.0000 | 46.3% |
 * | 512 | 0.0164 | 32.3757 | 0.0094 | 56.1766 | 57.6% |
 * | 1024 | 0.0387 | 54.5166 | 0.0304 | 69.2492 | 78.7% |
 * | 1280 | 0.0510 | 64.4716 | 0.0464 | 70.9210 | 90.9% |
 * | 2048 | 0.0964 | 87.2602 | 0.1045 | 80.4359 | 108.5% |
 * | 4096 | 0.3116 | 107.8047 | 0.3968 | 84.6692 | 127.3% |
 *
 * ![ssymv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride32.svg)
 *
 * ![ssymv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0114 | 0.2085 | 0.0036 | 0.6549 | 31.8% |
 * | 64 | 0.0118 | 0.7470 | 0.0039 | 2.2810 | 32.7% |
 * | 128 | 0.0122 | 2.7853 | 0.0046 | 7.4406 | 37.4% |
 * | 256 | 0.0122 | 10.9750 | 0.0056 | 23.7949 | 46.1% |
 * | 512 | 0.0163 | 32.5349 | 0.0093 | 57.1468 | 56.9% |
 * | 1024 | 0.0386 | 54.5617 | 0.0305 | 69.1039 | 79.0% |
 * | 1280 | 0.0498 | 66.0032 | 0.0465 | 70.7745 | 93.3% |
 * | 2048 | 0.0963 | 87.3617 | 0.1045 | 80.4359 | 108.6% |
 * | 4096 | 0.3123 | 107.5727 | 0.3968 | 84.6590 | 127.1% |
 *
 * ![ssymv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride33.svg)
 *
 * ![ssymv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0113 | 0.2093 | 0.0036 | 0.6491 | 32.3% |
 * | 64 | 0.0123 | 0.7206 | 0.0041 | 2.1563 | 33.4% |
 * | 128 | 0.0123 | 2.7708 | 0.0045 | 7.5194 | 36.8% |
 * | 256 | 0.0120 | 11.1064 | 0.0054 | 24.5647 | 45.2% |
 * | 512 | 0.0164 | 32.3125 | 0.0091 | 58.4594 | 55.3% |
 * | 1024 | 0.0389 | 54.1579 | 0.0307 | 68.5643 | 79.0% |
 * | 1280 | 0.0512 | 64.2500 | 0.0473 | 69.5299 | 92.4% |
 * | 2048 | 0.0979 | 85.8631 | 0.1065 | 78.9615 | 108.7% |
 * | 4096 | 0.3551 | 94.6072 | 0.4020 | 83.5640 | 113.2% |
 *
 * ![ssymv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride255.svg)
 *
 * ![ssymv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0117 | 0.2030 | 0.0037 | 0.6379 | 31.8% |
 * | 64 | 0.0123 | 0.7169 | 0.0039 | 2.2810 | 31.4% |
 * | 128 | 0.0125 | 2.7247 | 0.0045 | 7.5461 | 36.1% |
 * | 256 | 0.0122 | 10.9606 | 0.0055 | 24.1387 | 45.4% |
 * | 512 | 0.0164 | 32.3125 | 0.0094 | 56.2721 | 57.4% |
 * | 1024 | 0.0389 | 54.1579 | 0.0307 | 68.6000 | 78.9% |
 * | 1280 | 0.0512 | 64.2500 | 0.0473 | 69.6005 | 92.3% |
 * | 2048 | 0.0979 | 85.9192 | 0.1064 | 79.0566 | 108.7% |
 * | 4096 | 0.3140 | 106.9862 | 0.4013 | 83.7072 | 127.8% |
 *
 * ![ssymv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-stride256.svg)
 *
 * ![ssymv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/stride.ssymv.js) — WebGPU stride-sweep benchmark script
 * - [stride.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/stride.ssymv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0088 | 0.2691 | 0.0035 | 0.6727 | 40.0% |
 * | 64 | 0.0094 | 0.9372 | 0.0038 | 2.3000 | 40.7% |
 * | 128 | 0.0097 | 3.5116 | 0.0044 | 7.7382 | 45.4% |
 * | 256 | 0.0102 | 13.0500 | 0.0053 | 25.0060 | 52.2% |
 * | 512 | 0.0143 | 36.9286 | 0.0085 | 62.5482 | 59.0% |
 * | 1024 | 0.0364 | 57.8445 | 0.0274 | 76.8000 | 75.3% |
 * | 1280 | 0.0484 | 67.9894 | 0.0425 | 77.4680 | 87.8% |
 * | 2048 | 0.0942 | 89.2609 | 0.0988 | 85.0847 | 104.9% |
 * | 4096 | 0.3091 | 108.6751 | 0.3756 | 89.4370 | 121.5% |
 *
 * ![ssymv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-uplolower.svg)
 *
 * ![ssymv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0090 | 0.2638 | 0.0036 | 0.6637 | 39.7% |
 * | 64 | 0.0093 | 0.9452 | 0.0038 | 2.3291 | 40.6% |
 * | 128 | 0.0096 | 3.5585 | 0.0044 | 7.7101 | 46.2% |
 * | 256 | 0.0102 | 13.0500 | 0.0061 | 21.7500 | 60.0% |
 * | 512 | 0.0143 | 36.9286 | 0.0102 | 51.9435 | 71.1% |
 * | 1024 | 0.0364 | 57.9208 | 0.0350 | 60.1974 | 96.2% |
 * | 1280 | 0.0558 | 58.9619 | 0.0608 | 54.0910 | 109.0% |
 * | 2048 | 0.0941 | 89.3519 | 0.1253 | 67.1223 | 133.1% |
 * | 4096 | 0.3031 | 110.8378 | 0.4813 | 69.7950 | 158.8% |
 *
 * ![ssymv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-uploupper.svg)
 *
 * ![ssymv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/uplo.ssymv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/uplo.ssymv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0089 | 0.2816 | 0.0033 | 0.7536 | 37.4% |
 * | 64 | 0.0092 | 0.9827 | 0.0039 | 2.3471 | 41.9% |
 * | 128 | 0.0096 | 3.5940 | 0.0044 | 7.7698 | 46.3% |
 * | 256 | 0.0102 | 13.1500 | 0.0052 | 25.7370 | 51.1% |
 * | 512 | 0.0143 | 37.0714 | 0.0085 | 62.4361 | 59.4% |
 * | 1024 | 0.0357 | 59.1519 | 0.0275 | 76.7702 | 77.1% |
 * | 1280 | 0.0484 | 68.1178 | 0.0426 | 77.3844 | 88.0% |
 * | 2048 | 0.0946 | 89.0152 | 0.0988 | 85.1951 | 104.5% |
 * | 4096 | 0.3092 | 108.6887 | 0.3757 | 89.4730 | 121.5% |
 *
 * ![ssymv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad0.svg)
 *
 * ![ssymv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 0.2826 | 0.0036 | 0.6872 | 41.1% |
 * | 64 | 0.0092 | 0.9895 | 0.0039 | 2.3471 | 42.2% |
 * | 128 | 0.0099 | 3.5065 | 0.0045 | 7.7143 | 45.5% |
 * | 256 | 0.0103 | 13.1295 | 0.0054 | 24.8260 | 52.9% |
 * | 512 | 0.0144 | 36.9067 | 0.0094 | 56.4898 | 65.3% |
 * | 1024 | 0.0363 | 58.1357 | 0.0287 | 73.6429 | 78.9% |
 * | 1280 | 0.0490 | 67.2941 | 0.0444 | 74.1253 | 90.8% |
 * | 2048 | 0.0962 | 87.4759 | 0.1018 | 82.6910 | 105.8% |
 * | 4096 | 0.3132 | 107.3228 | 0.3875 | 86.7499 | 123.7% |
 *
 * ![ssymv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad1.svg)
 *
 * ![ssymv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0093 | 0.2694 | 0.0036 | 0.6964 | 38.7% |
 * | 64 | 0.0094 | 0.9676 | 0.0041 | 2.2362 | 43.3% |
 * | 128 | 0.0096 | 3.5821 | 0.0045 | 7.6596 | 46.8% |
 * | 256 | 0.0103 | 13.0683 | 0.0054 | 25.1224 | 52.0% |
 * | 512 | 0.0143 | 37.0714 | 0.0088 | 60.6131 | 61.2% |
 * | 1024 | 0.0364 | 57.9315 | 0.0283 | 74.6003 | 77.7% |
 * | 1280 | 0.0488 | 67.5591 | 0.0444 | 74.1253 | 91.1% |
 * | 2048 | 0.0964 | 87.3597 | 0.1024 | 82.2000 | 106.3% |
 * | 4096 | 0.3640 | 92.3522 | 0.3850 | 87.3015 | 105.8% |
 *
 * ![ssymv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad8.svg)
 *
 * ![ssymv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0089 | 0.2796 | 0.0035 | 0.7091 | 39.4% |
 * | 64 | 0.0093 | 0.9810 | 0.0039 | 2.3184 | 42.3% |
 * | 128 | 0.0099 | 3.5065 | 0.0045 | 7.7143 | 45.5% |
 * | 256 | 0.0103 | 13.1090 | 0.0053 | 25.3494 | 51.7% |
 * | 512 | 0.0143 | 37.0714 | 0.0086 | 61.5111 | 60.3% |
 * | 1024 | 0.0363 | 58.1613 | 0.0279 | 75.6697 | 76.9% |
 * | 1280 | 0.0485 | 67.8932 | 0.0415 | 79.3220 | 85.6% |
 * | 2048 | 0.0963 | 87.4468 | 0.0995 | 84.5788 | 103.4% |
 * | 4096 | 0.3143 | 106.9458 | 0.3801 | 88.4371 | 120.9% |
 *
 * ![ssymv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad32.svg)
 *
 * ![ssymv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0092 | 0.2704 | 0.0034 | 0.7290 | 37.1% |
 * | 64 | 0.0092 | 0.9861 | 0.0038 | 2.3766 | 41.5% |
 * | 128 | 0.0096 | 3.5880 | 0.0044 | 7.7698 | 46.2% |
 * | 256 | 0.0102 | 13.1500 | 0.0053 | 25.5030 | 51.6% |
 * | 512 | 0.0143 | 37.0714 | 0.0088 | 60.3927 | 61.4% |
 * | 1024 | 0.0365 | 57.8807 | 0.0283 | 74.6425 | 77.5% |
 * | 1280 | 0.0480 | 68.7087 | 0.0430 | 76.6071 | 89.7% |
 * | 2048 | 0.0963 | 87.4468 | 0.1001 | 84.0652 | 104.0% |
 * | 4096 | 0.3168 | 106.1031 | 0.3881 | 86.6033 | 122.5% |
 *
 * ![ssymv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad64.svg)
 *
 * ![ssymv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0089 | 0.2816 | 0.0034 | 0.7429 | 37.9% |
 * | 64 | 0.0096 | 0.9498 | 0.0038 | 2.3866 | 39.8% |
 * | 128 | 0.0100 | 3.4727 | 0.0044 | 7.7698 | 44.7% |
 * | 256 | 0.0102 | 13.1500 | 0.0053 | 25.5030 | 51.6% |
 * | 512 | 0.0143 | 37.0714 | 0.0086 | 61.6252 | 60.2% |
 * | 1024 | 0.0365 | 57.8807 | 0.0284 | 74.4740 | 77.7% |
 * | 1280 | 0.0481 | 68.4347 | 0.0425 | 77.4718 | 88.3% |
 * | 2048 | 0.0963 | 87.4468 | 0.1012 | 83.2142 | 105.1% |
 * | 4096 | 0.3222 | 104.3170 | 0.3806 | 88.3033 | 118.1% |
 *
 * ![ssymv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-pad128.svg)
 *
 * ![ssymv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/lda.ssymv.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/lda.ssymv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0090 | 0.2643 | 0.0038 | 0.6298 | 42.0% |
 * | 64 | 0.0093 | 0.9485 | 0.0039 | 2.2810 | 41.6% |
 * | 128 | 0.0097 | 3.5174 | 0.0045 | 7.6272 | 46.1% |
 * | 256 | 0.0102 | 13.0500 | 0.0053 | 25.3091 | 51.6% |
 * | 512 | 0.0143 | 36.9286 | 0.0086 | 61.5019 | 60.0% |
 * | 1024 | 0.0359 | 58.6952 | 0.0279 | 75.6096 | 77.6% |
 * | 1280 | 0.0485 | 67.7653 | 0.0426 | 77.2352 | 87.7% |
 * | 2048 | 0.0945 | 89.0190 | 0.0988 | 85.0847 | 104.6% |
 * | 4096 | 0.3092 | 108.6358 | 0.3763 | 89.2773 | 121.7% |
 *
 * ![ssymv-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alphaneg3p75.svg)
 *
 * ![ssymv-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 0.2701 | 0.0035 | 0.6789 | 39.8% |
 * | 64 | 0.0095 | 0.9340 | 0.0039 | 2.2810 | 40.9% |
 * | 128 | 0.0097 | 3.5116 | 0.0044 | 7.7664 | 45.2% |
 * | 256 | 0.0102 | 13.0500 | 0.0052 | 25.6985 | 50.8% |
 * | 512 | 0.0143 | 36.9286 | 0.0084 | 62.6667 | 58.9% |
 * | 1024 | 0.0358 | 58.9315 | 0.0275 | 76.5768 | 77.0% |
 * | 1280 | 0.0481 | 68.4421 | 0.0426 | 77.2352 | 88.6% |
 * | 2048 | 0.0943 | 89.1549 | 0.0987 | 85.1674 | 104.7% |
 * | 4096 | 0.3092 | 108.6582 | 0.3764 | 89.2469 | 121.8% |
 *
 * ![ssymv-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha0.svg)
 *
 * ![ssymv-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 0.2681 | 0.0035 | 0.6727 | 39.9% |
 * | 64 | 0.0093 | 0.9485 | 0.0039 | 2.2905 | 41.4% |
 * | 128 | 0.0096 | 3.5585 | 0.0045 | 7.6272 | 46.7% |
 * | 256 | 0.0102 | 13.0500 | 0.0053 | 25.3860 | 51.4% |
 * | 512 | 0.0143 | 36.9286 | 0.0086 | 61.5019 | 60.0% |
 * | 1024 | 0.0364 | 57.8699 | 0.0277 | 75.9585 | 76.2% |
 * | 1280 | 0.0481 | 68.3511 | 0.0427 | 77.0904 | 88.7% |
 * | 2048 | 0.0943 | 89.2003 | 0.0989 | 85.0296 | 104.9% |
 * | 4096 | 0.3092 | 108.6695 | 0.3765 | 89.2355 | 121.8% |
 *
 * ![ssymv-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha1eneg38.svg)
 *
 * ![ssymv-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0093 | 0.2534 | 0.0034 | 0.6884 | 36.8% |
 * | 64 | 0.0095 | 0.9277 | 0.0038 | 2.3096 | 40.2% |
 * | 128 | 0.0099 | 3.4323 | 0.0045 | 7.6000 | 45.2% |
 * | 256 | 0.0102 | 13.0500 | 0.0052 | 25.6196 | 50.9% |
 * | 512 | 0.0143 | 36.9286 | 0.0086 | 61.5019 | 60.0% |
 * | 1024 | 0.0358 | 58.9315 | 0.0277 | 75.9585 | 77.6% |
 * | 1280 | 0.0485 | 67.8324 | 0.0427 | 76.9749 | 88.1% |
 * | 2048 | 0.0944 | 89.0944 | 0.0989 | 85.0296 | 104.8% |
 * | 4096 | 0.3105 | 108.1991 | 0.3754 | 89.4941 | 120.9% |
 *
 * ![ssymv-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha1.svg)
 *
 * ![ssymv-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0090 | 0.2633 | 0.0035 | 0.6758 | 39.0% |
 * | 64 | 0.0094 | 0.9388 | 0.0039 | 2.2810 | 41.2% |
 * | 128 | 0.0098 | 3.4771 | 0.0044 | 7.6547 | 45.4% |
 * | 256 | 0.0102 | 13.0500 | 0.0053 | 25.3091 | 51.6% |
 * | 512 | 0.0143 | 36.9286 | 0.0086 | 61.8467 | 59.7% |
 * | 1024 | 0.0361 | 58.4348 | 0.0278 | 75.7837 | 77.1% |
 * | 1280 | 0.0484 | 67.8996 | 0.0426 | 77.2352 | 87.9% |
 * | 2048 | 0.0943 | 89.1851 | 0.0989 | 85.0296 | 104.9% |
 * | 4096 | 0.3091 | 108.6807 | 0.3756 | 89.4370 | 121.5% |
 *
 * ![ssymv-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-alpha2p5.svg)
 *
 * ![ssymv-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/alpha.ssymv.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/alpha.ssymv.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0091 | 0.2615 | 0.0036 | 0.6491 | 40.3% |
 * | 64 | 0.0094 | 0.9372 | 0.0039 | 2.2439 | 41.8% |
 * | 128 | 0.0094 | 3.6314 | 0.0045 | 7.4930 | 48.5% |
 * | 256 | 0.0102 | 13.0500 | 0.0054 | 24.6372 | 53.0% |
 * | 512 | 0.0143 | 36.9286 | 0.0088 | 60.3796 | 61.2% |
 * | 1024 | 0.0359 | 58.7475 | 0.0286 | 73.6644 | 79.8% |
 * | 1280 | 0.0483 | 68.1020 | 0.0431 | 76.4028 | 89.1% |
 * | 2048 | 0.0943 | 89.1700 | 0.1004 | 83.7959 | 106.4% |
 * | 4096 | 0.3587 | 93.6619 | 0.3780 | 88.8767 | 105.4% |
 *
 * ![ssymv-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-betaneg3p75.svg)
 *
 * ![ssymv-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 0.2701 | 0.0034 | 0.6916 | 39.1% |
 * | 64 | 0.0093 | 0.9485 | 0.0039 | 2.2810 | 41.6% |
 * | 128 | 0.0099 | 3.4545 | 0.0044 | 7.7664 | 44.5% |
 * | 256 | 0.0102 | 13.0500 | 0.0052 | 25.6196 | 50.9% |
 * | 512 | 0.0143 | 36.9286 | 0.0085 | 62.1955 | 59.4% |
 * | 1024 | 0.0363 | 58.0997 | 0.0274 | 76.9346 | 75.5% |
 * | 1280 | 0.0483 | 68.0569 | 0.0425 | 77.3223 | 88.0% |
 * | 2048 | 0.0943 | 89.1851 | 0.0988 | 85.0709 | 104.8% |
 * | 4096 | 0.3092 | 108.6358 | 0.3754 | 89.4903 | 121.4% |
 *
 * ![ssymv-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-beta0.svg)
 *
 * ![ssymv-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0093 | 0.2543 | 0.0036 | 0.6578 | 38.7% |
 * | 64 | 0.0093 | 0.9468 | 0.0039 | 2.2623 | 41.9% |
 * | 128 | 0.0097 | 3.5116 | 0.0045 | 7.4930 | 46.9% |
 * | 256 | 0.0102 | 13.0500 | 0.0054 | 24.5647 | 53.1% |
 * | 512 | 0.0143 | 36.9286 | 0.0087 | 60.8235 | 60.7% |
 * | 1024 | 0.0364 | 57.8445 | 0.0286 | 73.6233 | 78.6% |
 * | 1280 | 0.0485 | 67.8548 | 0.0431 | 76.3744 | 88.8% |
 * | 2048 | 0.0944 | 89.1095 | 0.1003 | 83.8762 | 106.2% |
 * | 4096 | 0.3092 | 108.6639 | 0.3786 | 88.7415 | 122.4% |
 *
 * ![ssymv-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-beta1.svg)
 *
 * ![ssymv-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0090 | 0.2643 | 0.0035 | 0.6727 | 39.3% |
 * | 64 | 0.0091 | 0.9667 | 0.0040 | 2.2080 | 43.8% |
 * | 128 | 0.0096 | 3.5349 | 0.0045 | 7.5461 | 46.8% |
 * | 256 | 0.0102 | 13.0500 | 0.0055 | 24.2087 | 53.9% |
 * | 512 | 0.0143 | 36.9286 | 0.0087 | 60.6007 | 60.9% |
 * | 1024 | 0.0363 | 58.0741 | 0.0286 | 73.6644 | 78.8% |
 * | 1280 | 0.0485 | 67.8548 | 0.0431 | 76.3744 | 88.8% |
 * | 2048 | 0.0945 | 89.0039 | 0.1003 | 83.8226 | 106.2% |
 * | 4096 | 0.3092 | 108.6358 | 0.3786 | 88.7377 | 122.4% |
 *
 * ![ssymv-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-beta2p5.svg)
 *
 * ![ssymv-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/beta.ssymv.js) — WebGPU beta-sweep benchmark script
 * - [beta.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/beta.ssymv.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 32 | 0.0088 | 0.2681 |
 * | 64 | 0.0092 | 0.9600 |
 * | 128 | 0.0096 | 3.5526 |
 * | 256 | 0.0102 | 13.0500 |
 * | 512 | 0.0143 | 36.9286 |
 * | 1024 | 0.0356 | 59.1167 |
 * | 1280 | 0.0557 | 59.0465 |
 * | 2048 | 0.0942 | 89.2609 |
 * | 4096 | 0.3650 | 92.0402 |
 *
 * ![ssymv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-layoutcolumnmajor.svg)
 *
 * ![ssymv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0089 | 0.2652 |
 * | 64 | 0.0092 | 0.9550 |
 * | 128 | 0.0096 | 3.5645 |
 * | 256 | 0.0102 | 13.0500 |
 * | 512 | 0.0143 | 36.9286 |
 * | 1024 | 0.0358 | 58.8789 |
 * | 1280 | 0.0485 | 67.7877 |
 * | 2048 | 0.0946 | 88.9136 |
 * | 4096 | 0.3092 | 108.6358 |
 *
 * ![ssymv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/gbps-layoutrowmajor.svg)
 *
 * ![ssymv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/layout.ssymv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
