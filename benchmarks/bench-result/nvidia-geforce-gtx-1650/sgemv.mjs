/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0077 | 0.5785 | 0.0046 | 0.9790 | 59.1% |
 * | 64 | 0.0085 | 2.0075 | 0.0046 | 3.6966 | 54.3% |
 * | 128 | 0.0113 | 5.9377 | 0.0051 | 13.1000 | 45.3% |
 * | 256 | 0.0164 | 16.1875 | 0.0101 | 26.2694 | 61.6% |
 * | 512 | 0.0299 | 35.2891 | 0.0137 | 77.1897 | 45.7% |
 * | 1024 | 0.0400 | 105.1228 | 0.0325 | 129.5771 | 81.1% |
 * | 1280 | 0.0477 | 137.6794 | 0.0449 | 146.2108 | 94.2% |
 * | 2048 | 0.1150 | 146.0721 | 0.0991 | 169.5917 | 86.1% |
 * | 4096 | 0.3794 | 176.9999 | 0.3783 | 177.5164 | 99.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sgemv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-default.svg)
 *
 * ![sgemv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/sgemv.js) — WebGPU benchmark script
 * - [sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/sgemv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0079 | 0.5680 | 0.0045 | 1.0000 | 56.8% |
 * | 64 | 0.0086 | 1.9963 | 0.0045 | 3.8014 | 52.5% |
 * | 128 | 0.0115 | 5.8384 | 0.0050 | 13.3503 | 43.7% |
 * | 256 | 0.0166 | 15.9846 | 0.0100 | 26.5641 | 60.2% |
 * | 512 | 0.0307 | 34.3333 | 0.0111 | 94.9856 | 36.1% |
 * | 1024 | 0.0404 | 104.1236 | 0.0322 | 130.7370 | 79.6% |
 * | 1280 | 0.0482 | 136.1725 | 0.0447 | 146.8909 | 92.7% |
 * | 2048 | 0.1158 | 145.0832 | 0.0997 | 168.5573 | 86.1% |
 * | 4096 | 0.3799 | 176.7688 | 0.3724 | 180.3539 | 98.0% |
 *
 * ![sgemv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride4.svg)
 *
 * ![sgemv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 0.6048 | 0.0045 | 0.9859 | 61.3% |
 * | 64 | 0.0087 | 1.9706 | 0.0045 | 3.7746 | 52.2% |
 * | 128 | 0.0114 | 5.8711 | 0.0053 | 12.6265 | 46.5% |
 * | 256 | 0.0165 | 16.0620 | 0.0100 | 26.5641 | 60.5% |
 * | 512 | 0.0308 | 34.1909 | 0.0118 | 89.5652 | 38.2% |
 * | 1024 | 0.0402 | 104.5792 | 0.0321 | 130.9975 | 79.8% |
 * | 1280 | 0.0481 | 136.4440 | 0.0450 | 145.8991 | 93.5% |
 * | 2048 | 0.1156 | 145.2839 | 0.1000 | 168.0717 | 86.4% |
 * | 4096 | 0.3804 | 176.5309 | 0.3728 | 180.1294 | 98.0% |
 *
 * ![sgemv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride5.svg)
 *
 * ![sgemv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.6009 | 0.0045 | 0.9859 | 60.9% |
 * | 64 | 0.0088 | 1.9491 | 0.0045 | 3.8286 | 50.9% |
 * | 128 | 0.0117 | 5.7503 | 0.0053 | 12.6265 | 45.5% |
 * | 256 | 0.0167 | 15.8470 | 0.0101 | 26.3111 | 60.2% |
 * | 512 | 0.0325 | 32.4889 | 0.0143 | 73.5714 | 44.2% |
 * | 1024 | 0.0405 | 103.7537 | 0.0328 | 128.3750 | 80.8% |
 * | 1280 | 0.0490 | 133.9948 | 0.0457 | 143.8038 | 93.2% |
 * | 2048 | 0.1191 | 141.0493 | 0.1007 | 166.8433 | 84.5% |
 * | 4096 | 0.3825 | 175.5637 | 0.3802 | 176.6349 | 99.4% |
 *
 * ![sgemv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride32.svg)
 *
 * ![sgemv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0077 | 0.5846 | 0.0045 | 1.0000 | 58.5% |
 * | 64 | 0.0087 | 1.9706 | 0.0046 | 3.7483 | 52.6% |
 * | 128 | 0.0115 | 5.8141 | 0.0052 | 12.9783 | 44.8% |
 * | 256 | 0.0167 | 15.9079 | 0.0100 | 26.3949 | 60.3% |
 * | 512 | 0.0324 | 32.6014 | 0.0135 | 77.9196 | 41.8% |
 * | 1024 | 0.0406 | 103.6311 | 0.0329 | 128.0000 | 81.0% |
 * | 1280 | 0.0491 | 133.8201 | 0.0457 | 143.6027 | 93.2% |
 * | 2048 | 0.1169 | 143.7525 | 0.1008 | 166.6051 | 86.3% |
 * | 4096 | 0.3826 | 175.5123 | 0.3806 | 176.4419 | 99.5% |
 *
 * ![sgemv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride33.svg)
 *
 * ![sgemv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0077 | 0.5833 | 0.0045 | 0.9929 | 58.8% |
 * | 64 | 0.0087 | 1.9670 | 0.0047 | 3.6838 | 53.4% |
 * | 128 | 0.0119 | 5.6572 | 0.0051 | 13.1411 | 43.0% |
 * | 256 | 0.0168 | 15.8168 | 0.0100 | 26.5641 | 59.5% |
 * | 512 | 0.0338 | 31.1973 | 0.0134 | 78.9461 | 39.5% |
 * | 1024 | 0.0410 | 102.7000 | 0.0332 | 126.7657 | 81.0% |
 * | 1280 | 0.0492 | 133.4720 | 0.0464 | 141.5724 | 94.3% |
 * | 2048 | 0.1182 | 142.1568 | 0.1017 | 165.1899 | 86.1% |
 * | 4096 | 0.3849 | 174.4835 | 0.3820 | 175.7990 | 99.3% |
 *
 * ![sgemv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride255.svg)
 *
 * ![sgemv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.5738 | 0.0046 | 0.9756 | 58.8% |
 * | 64 | 0.0088 | 1.9526 | 0.0046 | 3.6966 | 52.8% |
 * | 128 | 0.0118 | 5.6725 | 0.0052 | 12.9383 | 43.8% |
 * | 256 | 0.0168 | 15.7867 | 0.0102 | 25.9000 | 61.0% |
 * | 512 | 0.0328 | 32.1875 | 0.0143 | 73.5714 | 43.8% |
 * | 1024 | 0.0412 | 102.0621 | 0.0331 | 127.1950 | 80.2% |
 * | 1280 | 0.0493 | 133.2122 | 0.0461 | 142.3578 | 93.6% |
 * | 2048 | 0.1208 | 139.0324 | 0.1011 | 166.1307 | 83.7% |
 * | 4096 | 0.3849 | 174.4690 | 0.3813 | 176.1309 | 99.1% |
 *
 * ![sgemv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride256.svg)
 *
 * ![sgemv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/stride.sgemv.js) — WebGPU stride-sweep benchmark script
 * - [stride.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/stride.sgemv.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `trans = "no-transpose"`. `trans = "transpose"`'s parallelism is bounded by `n` (one workgroup per output-column tile) rather than `m`, so it's slower at matched square shapes and substantially slower on tall-narrow shapes — this section sweeps every `(m, n)` pair for both `trans` values to characterize that shape sensitivity, not just a single square-shape A/B. Collapsed by default since it's 18 shape combinations — expand a `trans` value, then a shape, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (9 shapes)</summary>
 *
 * <details>
 * <summary>m = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.6667 | 0.0046 | 0.9655 | 69.0% |
 * | 64 | 0.0067 | 1.2952 | 0.0045 | 1.9155 | 67.6% |
 * | 128 | 0.0069 | 2.4930 | 0.0047 | 3.6463 | 68.4% |
 * | 256 | 0.0071 | 4.8145 | 0.0067 | 5.0667 | 95.0% |
 * | 512 | 0.0075 | 9.0213 | 0.0073 | 9.2576 | 97.4% |
 * | 1024 | 0.0079 | 17.2033 | 0.0078 | 17.3799 | 99.0% |
 * | 1280 | 0.0082 | 20.6563 | 0.0074 | 22.9913 | 89.8% |
 * | 2048 | 0.0085 | 31.6704 | 0.0082 | 33.0312 | 95.9% |
 * | 4096 | 0.0102 | 52.9077 | 0.0089 | 60.6966 | 87.2% |
 *
 * ![sgemv-trans-no-transpose-m32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m32.svg)
 *
 * ![sgemv-trans-no-transpose-m32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 1.2778 | 0.0048 | 1.8400 | 69.4% |
 * | 64 | 0.0070 | 2.4419 | 0.0047 | 3.6463 | 67.0% |
 * | 128 | 0.0071 | 4.7783 | 0.0048 | 7.1111 | 67.2% |
 * | 256 | 0.0071 | 9.4414 | 0.0072 | 9.3363 | 101.1% |
 * | 512 | 0.0078 | 17.0449 | 0.0078 | 17.0798 | 99.8% |
 * | 1024 | 0.0082 | 32.5625 | 0.0079 | 33.8862 | 96.1% |
 * | 1280 | 0.0084 | 39.9080 | 0.0082 | 40.6875 | 98.1% |
 * | 2048 | 0.0092 | 58.2378 | 0.0095 | 55.9866 | 104.0% |
 * | 4096 | 0.0144 | 74.1559 | 0.0113 | 94.0565 | 78.8% |
 *
 * ![sgemv-trans-no-transpose-m64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m64.svg)
 *
 * ![sgemv-trans-no-transpose-m64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 2.4796 | 0.0047 | 3.7279 | 66.5% |
 * | 64 | 0.0073 | 4.6463 | 0.0048 | 7.1409 | 65.1% |
 * | 128 | 0.0076 | 8.8067 | 0.0051 | 13.0592 | 67.4% |
 * | 256 | 0.0076 | 17.6271 | 0.0079 | 16.7742 | 105.1% |
 * | 512 | 0.0082 | 32.5020 | 0.0087 | 30.5830 | 106.3% |
 * | 1024 | 0.0087 | 60.8235 | 0.0097 | 54.4211 | 111.8% |
 * | 1280 | 0.0094 | 70.6735 | 0.0100 | 66.0447 | 107.0% |
 * | 2048 | 0.0118 | 89.3405 | 0.0128 | 82.3313 | 108.5% |
 * | 4096 | 0.0199 | 106.4090 | 0.0200 | 105.6435 | 100.7% |
 *
 * ![sgemv-trans-no-transpose-m128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m128.svg)
 *
 * ![sgemv-trans-no-transpose-m128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m128.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0101 | 3.4448 | 0.0084 | 4.1364 | 83.3% |
 * | 64 | 0.0101 | 6.6877 | 0.0086 | 7.8519 | 85.2% |
 * | 128 | 0.0089 | 14.9677 | 0.0094 | 14.2041 | 105.4% |
 * | 256 | 0.0092 | 28.8780 | 0.0100 | 26.6495 | 108.4% |
 * | 512 | 0.0102 | 51.6000 | 0.0112 | 47.2446 | 109.2% |
 * | 1024 | 0.0142 | 74.0674 | 0.0146 | 72.1225 | 102.7% |
 * | 1280 | 0.0176 | 75.0164 | 0.0176 | 74.7441 | 100.4% |
 * | 2048 | 0.0225 | 93.5455 | 0.0225 | 93.5455 | 100.0% |
 * | 4096 | 0.0349 | 120.7780 | 0.0353 | 119.4628 | 101.1% |
 *
 * ![sgemv-trans-no-transpose-m256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m256.svg)
 *
 * ![sgemv-trans-no-transpose-m256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m256.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 512</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0101 | 6.8878 | 0.0087 | 8.0147 | 85.9% |
 * | 64 | 0.0102 | 13.2250 | 0.0090 | 14.9805 | 88.3% |
 * | 128 | 0.0108 | 24.7359 | 0.0097 | 27.6026 | 89.6% |
 * | 256 | 0.0108 | 48.8744 | 0.0106 | 50.1333 | 97.5% |
 * | 512 | 0.0143 | 73.9013 | 0.0135 | 78.1043 | 94.6% |
 * | 1024 | 0.0224 | 93.9886 | 0.0210 | 100.4458 | 93.6% |
 * | 1280 | 0.0247 | 106.3493 | 0.0242 | 108.5254 | 98.0% |
 * | 2048 | 0.0340 | 123.8398 | 0.0329 | 127.8755 | 96.8% |
 * | 4096 | 0.0570 | 147.5900 | 0.0627 | 134.0735 | 110.1% |
 *
 * ![sgemv-trans-no-transpose-m512 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m512.svg)
 *
 * ![sgemv-trans-no-transpose-m512 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m512.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1024</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0143 | 9.7559 | 0.0086 | 16.2841 | 59.9% |
 * | 64 | 0.0143 | 18.8750 | 0.0094 | 28.6644 | 65.8% |
 * | 128 | 0.0144 | 36.9313 | 0.0102 | 52.0500 | 71.0% |
 * | 256 | 0.0162 | 65.3927 | 0.0131 | 80.6244 | 81.1% |
 * | 512 | 0.0225 | 93.5455 | 0.0206 | 102.3403 | 91.4% |
 * | 1024 | 0.0338 | 124.3083 | 0.0324 | 129.7050 | 95.8% |
 * | 1280 | 0.0389 | 135.0789 | 0.0385 | 136.6523 | 98.8% |
 * | 2048 | 0.0560 | 150.1320 | 0.0554 | 151.7366 | 98.9% |
 * | 4096 | 0.1023 | 164.3111 | 0.1036 | 162.1544 | 101.3% |
 *
 * ![sgemv-trans-no-transpose-m1024 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m1024.svg)
 *
 * ![sgemv-trans-no-transpose-m1024 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m1024.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1280</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0168 | 10.3893 | 0.0087 | 20.1257 | 51.6% |
 * | 64 | 0.0179 | 18.9391 | 0.0095 | 35.7631 | 53.0% |
 * | 128 | 0.0186 | 35.8279 | 0.0104 | 64.2469 | 55.8% |
 * | 256 | 0.0206 | 64.1989 | 0.0163 | 81.3228 | 78.9% |
 * | 512 | 0.0263 | 100.0049 | 0.0232 | 113.6796 | 88.0% |
 * | 1024 | 0.0402 | 130.8546 | 0.0375 | 140.2972 | 93.3% |
 * | 1280 | 0.0469 | 140.1229 | 0.0449 | 146.4194 | 95.7% |
 * | 2048 | 0.0688 | 152.6772 | 0.0660 | 159.2316 | 95.9% |
 * | 4096 | 0.1249 | 168.1466 | 0.1235 | 170.0861 | 98.9% |
 *
 * ![sgemv-trans-no-transpose-m1280 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m1280.svg)
 *
 * ![sgemv-trans-no-transpose-m1280 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m1280.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 2048</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0215 | 12.9487 | 0.0057 | 48.6480 | 26.6% |
 * | 64 | 0.0220 | 24.5876 | 0.0063 | 85.8071 | 28.7% |
 * | 128 | 0.0259 | 41.0808 | 0.0102 | 104.0500 | 39.5% |
 * | 256 | 0.0276 | 76.7034 | 0.0184 | 114.7222 | 66.9% |
 * | 512 | 0.0355 | 118.6018 | 0.0307 | 137.4196 | 86.3% |
 * | 1024 | 0.0570 | 147.4244 | 0.0538 | 156.3260 | 94.3% |
 * | 1280 | 0.0678 | 155.0659 | 0.0655 | 160.4848 | 96.6% |
 * | 2048 | 0.1019 | 164.8527 | 0.0989 | 169.8661 | 97.0% |
 * | 4096 | 0.1925 | 174.4681 | 0.1895 | 177.2374 | 98.4% |
 *
 * ![sgemv-trans-no-transpose-m2048 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m2048.svg)
 *
 * ![sgemv-trans-no-transpose-m2048 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m2048.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 4096</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0351 | 15.8869 | 0.0066 | 84.3196 | 18.8% |
 * | 64 | 0.0385 | 28.0848 | 0.0104 | 104.0000 | 27.0% |
 * | 128 | 0.0459 | 46.4268 | 0.0181 | 117.6255 | 39.5% |
 * | 256 | 0.0477 | 88.7063 | 0.0307 | 137.6333 | 64.5% |
 * | 512 | 0.0619 | 136.1427 | 0.0520 | 161.9391 | 84.1% |
 * | 1024 | 0.1033 | 162.7757 | 0.1093 | 153.8173 | 105.8% |
 * | 1280 | 0.1262 | 166.4665 | 0.1312 | 160.1522 | 103.9% |
 * | 2048 | 0.1927 | 174.3078 | 0.1985 | 169.2497 | 103.0% |
 * | 4096 | 0.3700 | 181.5082 | 0.3781 | 177.6291 | 102.2% |
 *
 * ![sgemv-trans-no-transpose-m4096 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-no-transpose-m4096.svg)
 *
 * ![sgemv-trans-no-transpose-m4096 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-no-transpose-m4096.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (9 shapes)</summary>
 *
 * <details>
 * <summary>m = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0077 | 0.5833 | 0.0048 | 0.9365 | 62.3% |
 * | 64 | 0.0076 | 1.1670 | 0.0047 | 1.8969 | 61.5% |
 * | 128 | 0.0074 | 2.3621 | 0.0048 | 3.6656 | 64.4% |
 * | 256 | 0.0076 | 4.6173 | 0.0049 | 7.1373 | 64.7% |
 * | 512 | 0.0078 | 8.9344 | 0.0052 | 13.5404 | 66.0% |
 * | 1024 | 0.0077 | 18.1879 | 0.0061 | 22.9263 | 79.3% |
 * | 1280 | 0.0078 | 22.4033 | 0.0061 | 28.3542 | 79.0% |
 * | 2048 | 0.0079 | 35.1838 | 0.0074 | 37.4538 | 93.9% |
 * | 4096 | 0.0082 | 68.0156 | 0.0099 | 56.3495 | 120.7% |
 *
 * ![sgemv-trans-transpose-m32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m32.svg)
 *
 * ![sgemv-trans-transpose-m32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0086 | 1.0112 | 0.0049 | 1.7778 | 56.9% |
 * | 64 | 0.0085 | 2.0226 | 0.0049 | 3.4919 | 57.9% |
 * | 128 | 0.0087 | 3.9262 | 0.0048 | 7.0464 | 55.7% |
 * | 256 | 0.0086 | 7.8664 | 0.0047 | 14.3729 | 54.7% |
 * | 512 | 0.0088 | 15.3891 | 0.0054 | 25.1157 | 61.3% |
 * | 1024 | 0.0092 | 29.4634 | 0.0061 | 44.0417 | 66.9% |
 * | 1280 | 0.0089 | 38.0144 | 0.0068 | 50.0853 | 75.9% |
 * | 2048 | 0.0094 | 57.4966 | 0.0078 | 68.9959 | 83.3% |
 * | 4096 | 0.0143 | 75.4464 | 0.0110 | 98.5423 | 76.6% |
 *
 * ![sgemv-trans-transpose-m64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m64.svg)
 *
 * ![sgemv-trans-transpose-m64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0111 | 1.5402 | 0.0048 | 3.5380 | 43.5% |
 * | 64 | 0.0111 | 3.0388 | 0.0048 | 7.0872 | 42.9% |
 * | 128 | 0.0116 | 5.7662 | 0.0052 | 12.8589 | 44.8% |
 * | 256 | 0.0114 | 11.6975 | 0.0054 | 24.6372 | 47.5% |
 * | 512 | 0.0115 | 23.2849 | 0.0059 | 45.0595 | 51.7% |
 * | 1024 | 0.0122 | 43.8316 | 0.0072 | 73.8625 | 59.3% |
 * | 1280 | 0.0121 | 55.2149 | 0.0078 | 85.4867 | 64.6% |
 * | 2048 | 0.0182 | 58.6197 | 0.0097 | 109.8878 | 53.3% |
 * | 4096 | 0.0216 | 98.5581 | 0.0165 | 129.3994 | 76.2% |
 *
 * ![sgemv-trans-transpose-m128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m128.svg)
 *
 * ![sgemv-trans-transpose-m128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m128.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0164 | 2.0781 | 0.0048 | 7.0698 | 29.4% |
 * | 64 | 0.0182 | 3.6901 | 0.0049 | 13.5663 | 27.2% |
 * | 128 | 0.0184 | 7.2222 | 0.0056 | 23.6364 | 30.6% |
 * | 256 | 0.0184 | 14.3889 | 0.0060 | 44.0851 | 32.6% |
 * | 512 | 0.0188 | 28.2321 | 0.0065 | 81.0980 | 34.8% |
 * | 1024 | 0.0287 | 36.8929 | 0.0082 | 128.3728 | 28.7% |
 * | 1280 | 0.0328 | 40.3438 | 0.0124 | 106.4742 | 37.9% |
 * | 2048 | 0.0339 | 62.4575 | 0.0165 | 128.0620 | 48.8% |
 * | 4096 | 0.0383 | 110.3365 | 0.0283 | 149.3816 | 73.9% |
 *
 * ![sgemv-trans-transpose-m256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m256.svg)
 *
 * ![sgemv-trans-transpose-m256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m256.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 512</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0217 | 3.1268 | 0.0056 | 12.1143 | 25.8% |
 * | 64 | 0.0217 | 6.1548 | 0.0055 | 24.2791 | 25.4% |
 * | 128 | 0.0224 | 11.8485 | 0.0061 | 43.6210 | 27.2% |
 * | 256 | 0.0224 | 23.5717 | 0.0068 | 78.2559 | 30.1% |
 * | 512 | 0.0300 | 35.1761 | 0.0082 | 128.7500 | 27.3% |
 * | 1024 | 0.0344 | 61.3184 | 0.0184 | 114.3333 | 53.6% |
 * | 1280 | 0.0355 | 74.1144 | 0.0211 | 124.8923 | 59.3% |
 * | 2048 | 0.0388 | 108.5757 | 0.0298 | 141.4050 | 76.8% |
 * | 4096 | 0.0571 | 147.4276 | 0.0525 | 160.4095 | 91.9% |
 *
 * ![sgemv-trans-transpose-m512 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m512.svg)
 *
 * ![sgemv-trans-transpose-m512 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m512.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1024</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0189 | 7.1486 | 0.0064 | 21.1072 | 33.9% |
 * | 64 | 0.0190 | 14.0337 | 0.0064 | 41.5761 | 33.8% |
 * | 128 | 0.0191 | 27.6656 | 0.0070 | 75.5434 | 36.6% |
 * | 256 | 0.0306 | 34.5131 | 0.0085 | 124.3774 | 27.7% |
 * | 512 | 0.0348 | 60.5541 | 0.0168 | 125.5573 | 48.2% |
 * | 1024 | 0.0405 | 103.8357 | 0.0318 | 132.3827 | 78.4% |
 * | 1280 | 0.0431 | 121.9659 | 0.0359 | 146.4242 | 83.3% |
 * | 2048 | 0.0573 | 146.8067 | 0.0514 | 163.6774 | 89.7% |
 * | 4096 | 0.1150 | 146.1789 | 0.0977 | 172.1625 | 84.9% |
 *
 * ![sgemv-trans-transpose-m1024 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m1024.svg)
 *
 * ![sgemv-trans-transpose-m1024 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m1024.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1280</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0195 | 8.6689 | 0.0071 | 23.9276 | 36.2% |
 * | 64 | 0.0194 | 17.2165 | 0.0075 | 44.6081 | 38.6% |
 * | 128 | 0.0197 | 33.6404 | 0.0093 | 71.2828 | 47.2% |
 * | 256 | 0.0328 | 40.2188 | 0.0133 | 99.0000 | 40.6% |
 * | 512 | 0.0359 | 73.3672 | 0.0205 | 128.4500 | 57.1% |
 * | 1024 | 0.0429 | 122.3964 | 0.0346 | 151.8078 | 80.6% |
 * | 1280 | 0.0483 | 136.1273 | 0.0415 | 158.2729 | 86.0% |
 * | 2048 | 0.0681 | 154.3370 | 0.0635 | 165.5000 | 93.3% |
 * | 4096 | 0.1268 | 165.6475 | 0.1185 | 177.2527 | 93.5% |
 *
 * ![sgemv-trans-transpose-m1280 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m1280.svg)
 *
 * ![sgemv-trans-transpose-m1280 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m1280.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 2048</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0197 | 13.7384 | 0.0082 | 33.0959 | 41.5% |
 * | 64 | 0.0198 | 26.8862 | 0.0087 | 61.4613 | 43.7% |
 * | 128 | 0.0310 | 34.1311 | 0.0108 | 97.7988 | 34.9% |
 * | 256 | 0.0357 | 59.0637 | 0.0181 | 116.1481 | 50.9% |
 * | 512 | 0.0398 | 105.5871 | 0.0291 | 144.7753 | 72.9% |
 * | 1024 | 0.0574 | 146.4897 | 0.0529 | 158.8965 | 92.2% |
 * | 1280 | 0.0690 | 152.1817 | 0.0634 | 165.7859 | 91.8% |
 * | 2048 | 0.1164 | 144.4048 | 0.0983 | 170.9167 | 84.5% |
 * | 4096 | 0.2001 | 167.8964 | 0.1850 | 181.5732 | 92.5% |
 *
 * ![sgemv-trans-transpose-m2048 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m2048.svg)
 *
 * ![sgemv-trans-transpose-m2048 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m2048.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 4096</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0207 | 26.0864 | 0.0087 | 62.4917 | 41.7% |
 * | 64 | 0.0322 | 33.0810 | 0.0105 | 101.8226 | 32.5% |
 * | 128 | 0.0365 | 57.9903 | 0.0191 | 110.9656 | 52.3% |
 * | 256 | 0.0412 | 102.2906 | 0.0307 | 137.4196 | 74.4% |
 * | 512 | 0.0589 | 142.8562 | 0.0514 | 163.6264 | 87.3% |
 * | 1024 | 0.1183 | 142.0222 | 0.1018 | 164.9822 | 86.1% |
 * | 1280 | 0.1311 | 160.2031 | 0.1207 | 173.9178 | 92.1% |
 * | 2048 | 0.2028 | 165.5912 | 0.1916 | 175.3132 | 94.5% |
 * | 4096 | 0.3824 | 175.6445 | 0.3686 | 182.2015 | 96.4% |
 *
 * ![sgemv-trans-transpose-m4096 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-trans-transpose-m4096.svg)
 *
 * ![sgemv-trans-transpose-m4096 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-trans-transpose-m4096.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/trans.sgemv.js) — WebGPU trans-sweep benchmark script
 * - [trans.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/trans.sgemv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0067 | 0.6538 | 0.0047 | 0.9252 | 70.7% |
 * | 64 | 0.0068 | 2.4731 | 0.0047 | 3.5918 | 68.9% |
 * | 128 | 0.0076 | 8.7764 | 0.0052 | 12.8395 | 68.4% |
 * | 256 | 0.0092 | 28.8168 | 0.0102 | 25.9623 | 111.0% |
 * | 512 | 0.0143 | 73.4286 | 0.0136 | 77.5849 | 94.6% |
 * | 1024 | 0.0335 | 125.3130 | 0.0326 | 129.0693 | 97.1% |
 * | 1280 | 0.0462 | 142.1483 | 0.0449 | 146.1489 | 97.3% |
 * | 2048 | 0.1011 | 166.1548 | 0.0991 | 169.5090 | 98.0% |
 * | 4096 | 0.3704 | 181.2836 | 0.3783 | 177.4656 | 102.2% |
 *
 * ![sgemv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad0.svg)
 *
 * ![sgemv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.6196 | 0.0046 | 0.9544 | 64.9% |
 * | 64 | 0.0069 | 2.4332 | 0.0048 | 3.5200 | 69.1% |
 * | 128 | 0.0078 | 8.4898 | 0.0054 | 12.2353 | 69.4% |
 * | 256 | 0.0092 | 28.8671 | 0.0100 | 26.4192 | 109.3% |
 * | 512 | 0.0143 | 73.4286 | 0.0134 | 78.4172 | 93.6% |
 * | 1024 | 0.0340 | 123.7193 | 0.0328 | 128.3127 | 96.4% |
 * | 1280 | 0.0465 | 141.2186 | 0.0450 | 145.8890 | 96.8% |
 * | 2048 | 0.1024 | 163.9744 | 0.1000 | 167.9360 | 97.6% |
 * | 4096 | 0.3735 | 179.7615 | 0.3845 | 174.6224 | 102.9% |
 *
 * ![sgemv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad1.svg)
 *
 * ![sgemv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0080 | 0.5440 | 0.0047 | 0.9220 | 59.0% |
 * | 64 | 0.0082 | 2.0625 | 0.0049 | 3.4510 | 59.8% |
 * | 128 | 0.0086 | 7.7323 | 0.0053 | 12.5680 | 61.5% |
 * | 256 | 0.0105 | 25.2477 | 0.0101 | 26.2095 | 96.3% |
 * | 512 | 0.0157 | 67.1347 | 0.0137 | 76.7701 | 87.4% |
 * | 1024 | 0.0339 | 124.0699 | 0.0327 | 128.5010 | 96.6% |
 * | 1280 | 0.0466 | 140.9275 | 0.0451 | 145.6818 | 96.7% |
 * | 2048 | 0.1023 | 164.2309 | 0.1001 | 167.6945 | 97.9% |
 * | 4096 | 0.3723 | 180.3254 | 0.3811 | 176.1767 | 102.4% |
 *
 * ![sgemv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad8.svg)
 *
 * ![sgemv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6415 | 0.0045 | 0.9577 | 67.0% |
 * | 64 | 0.0068 | 2.4673 | 0.0050 | 3.4065 | 72.4% |
 * | 128 | 0.0076 | 8.7212 | 0.0054 | 12.3810 | 70.4% |
 * | 256 | 0.0092 | 28.8671 | 0.0100 | 26.5040 | 108.9% |
 * | 512 | 0.0144 | 72.9401 | 0.0141 | 74.7636 | 97.6% |
 * | 1024 | 0.0336 | 124.9553 | 0.0326 | 128.8793 | 97.0% |
 * | 1280 | 0.0467 | 140.6859 | 0.0448 | 146.3575 | 96.1% |
 * | 2048 | 0.1009 | 166.4447 | 0.0998 | 168.3130 | 98.9% |
 * | 4096 | 0.3709 | 181.0333 | 0.3809 | 176.2581 | 102.7% |
 *
 * ![sgemv-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad16.svg)
 *
 * ![sgemv-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.6239 | 0.0045 | 0.9680 | 64.4% |
 * | 64 | 0.0071 | 2.3837 | 0.0047 | 3.5918 | 66.4% |
 * | 128 | 0.0077 | 8.6128 | 0.0053 | 12.6444 | 68.1% |
 * | 256 | 0.0094 | 28.1775 | 0.0100 | 26.2930 | 107.2% |
 * | 512 | 0.0143 | 73.4286 | 0.0140 | 75.2769 | 97.5% |
 * | 1024 | 0.0334 | 125.7329 | 0.0326 | 128.7529 | 97.7% |
 * | 1280 | 0.0471 | 139.3478 | 0.0450 | 145.9409 | 95.5% |
 * | 2048 | 0.1014 | 165.5782 | 0.0997 | 168.3940 | 98.3% |
 * | 4096 | 0.3704 | 181.2679 | 0.3807 | 176.3840 | 102.8% |
 *
 * ![sgemv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad32.svg)
 *
 * ![sgemv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6400 | 0.0047 | 0.9315 | 68.7% |
 * | 64 | 0.0073 | 2.3260 | 0.0047 | 3.5918 | 64.8% |
 * | 128 | 0.0078 | 8.5246 | 0.0052 | 12.8793 | 66.2% |
 * | 256 | 0.0095 | 27.8919 | 0.0100 | 26.5040 | 105.2% |
 * | 512 | 0.0144 | 72.8594 | 0.0141 | 74.5941 | 97.7% |
 * | 1024 | 0.0339 | 123.9528 | 0.0326 | 129.0059 | 96.1% |
 * | 1280 | 0.0471 | 139.4900 | 0.0450 | 145.8372 | 95.6% |
 * | 2048 | 0.1016 | 165.3174 | 0.0999 | 168.1782 | 98.3% |
 * | 4096 | 0.3719 | 180.5348 | 0.3825 | 175.5355 | 102.8% |
 *
 * ![sgemv-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad48.svg)
 *
 * ![sgemv-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6370 | 0.0046 | 0.9544 | 66.7% |
 * | 64 | 0.0071 | 2.3837 | 0.0047 | 3.5797 | 66.6% |
 * | 128 | 0.0078 | 8.5421 | 0.0052 | 12.8000 | 66.7% |
 * | 256 | 0.0095 | 27.9391 | 0.0102 | 25.8809 | 108.0% |
 * | 512 | 0.0143 | 73.4286 | 0.0139 | 75.5362 | 97.2% |
 * | 1024 | 0.0340 | 123.7776 | 0.0326 | 128.7529 | 96.1% |
 * | 1280 | 0.0461 | 142.2962 | 0.0450 | 145.8890 | 97.5% |
 * | 2048 | 0.1019 | 164.7465 | 0.0997 | 168.4211 | 97.8% |
 * | 4096 | 0.3701 | 181.3933 | 0.3810 | 176.2433 | 102.9% |
 *
 * ![sgemv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad64.svg)
 *
 * ![sgemv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6385 | 0.0046 | 0.9510 | 67.1% |
 * | 64 | 0.0070 | 2.4110 | 0.0046 | 3.6414 | 66.2% |
 * | 128 | 0.0079 | 8.4553 | 0.0053 | 12.6444 | 66.9% |
 * | 256 | 0.0093 | 28.3225 | 0.0100 | 26.4192 | 107.2% |
 * | 512 | 0.0143 | 73.4286 | 0.0138 | 76.3248 | 96.2% |
 * | 1024 | 0.0340 | 123.5447 | 0.0328 | 128.2500 | 96.3% |
 * | 1280 | 0.0464 | 141.3646 | 0.0451 | 145.6818 | 97.0% |
 * | 2048 | 0.1021 | 164.4110 | 0.0998 | 168.3130 | 97.7% |
 * | 4096 | 0.3707 | 181.1271 | 0.3827 | 175.4474 | 103.2% |
 *
 * ![sgemv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-pad128.svg)
 *
 * ![sgemv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/lda.sgemv.js) — WebGPU lda-sweep benchmark script
 * - [lda.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/lda.sgemv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0068 | 0.6415 | 0.0045 | 0.9645 | 66.5% |
 * | 64 | 0.0070 | 2.4110 | 0.0047 | 3.5918 | 67.1% |
 * | 128 | 0.0077 | 8.5950 | 0.0052 | 12.9193 | 66.5% |
 * | 256 | 0.0093 | 28.4690 | 0.0100 | 26.4615 | 107.6% |
 * | 512 | 0.0143 | 73.4286 | 0.0137 | 76.6807 | 95.8% |
 * | 1024 | 0.0338 | 124.2460 | 0.0325 | 129.2598 | 96.1% |
 * | 1280 | 0.0463 | 141.8044 | 0.0448 | 146.5143 | 96.8% |
 * | 2048 | 0.1009 | 166.3655 | 0.0992 | 169.2357 | 98.3% |
 * | 4096 | 0.3707 | 181.1114 | 0.3777 | 177.7663 | 101.9% |
 *
 * ![sgemv-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-alphaneg3p75.svg)
 *
 * ![sgemv-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6445 | 0.0021 | 2.0299 | 31.8% |
 * | 64 | 0.0069 | 2.4332 | 0.0021 | 7.8806 | 30.9% |
 * | 128 | 0.0075 | 8.9270 | 0.0021 | 31.5152 | 28.3% |
 * | 256 | 0.0091 | 28.9684 | 0.0022 | 121.4118 | 23.9% |
 * | 512 | 0.0143 | 73.6753 | 0.0022 | 476.7536 | 15.5% |
 * | 1024 | 0.0336 | 125.0148 | 0.0025 | 1694.5549 | 7.4% |
 * | 1280 | 0.0464 | 141.5109 | 0.0027 | 2471.3254 | 5.7% |
 * | 2048 | 0.1010 | 166.2074 | 0.0027 | 6322.8916 | 2.6% |
 * | 4096 | 0.3703 | 181.3149 | 0.0027 | 24684.4238 | 0.7% |
 *
 * ![sgemv-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-alpha0.svg)
 *
 * ![sgemv-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5484 | 0.0046 | 0.9379 | 58.5% |
 * | 64 | 0.0080 | 2.1078 | 0.0046 | 3.6794 | 57.3% |
 * | 128 | 0.0085 | 7.8639 | 0.0050 | 13.3762 | 58.8% |
 * | 256 | 0.0106 | 25.0182 | 0.0100 | 26.5466 | 94.2% |
 * | 512 | 0.0156 | 67.6872 | 0.0135 | 78.0451 | 86.7% |
 * | 1024 | 0.0352 | 119.4977 | 0.0325 | 129.3235 | 92.4% |
 * | 1280 | 0.0465 | 141.0729 | 0.0450 | 145.8890 | 96.7% |
 * | 2048 | 0.1014 | 165.6827 | 0.0989 | 169.7283 | 97.6% |
 * | 4096 | 0.3702 | 181.3619 | 0.3781 | 177.5933 | 102.1% |
 *
 * ![sgemv-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-alpha1eneg38.svg)
 *
 * ![sgemv-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.6523 | 0.0047 | 0.9315 | 70.0% |
 * | 64 | 0.0072 | 2.3571 | 0.0046 | 3.6414 | 64.7% |
 * | 128 | 0.0076 | 8.8136 | 0.0051 | 13.1646 | 66.9% |
 * | 256 | 0.0092 | 28.7165 | 0.0100 | 26.4615 | 108.5% |
 * | 512 | 0.0143 | 73.4286 | 0.0136 | 77.5849 | 94.6% |
 * | 1024 | 0.0339 | 123.9528 | 0.0324 | 129.7708 | 95.5% |
 * | 1280 | 0.0462 | 142.0007 | 0.0448 | 146.5143 | 96.9% |
 * | 2048 | 0.1007 | 166.8150 | 0.0992 | 169.3449 | 98.5% |
 * | 4096 | 0.3706 | 181.1896 | 0.3780 | 177.6158 | 102.0% |
 *
 * ![sgemv-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-alpha1.svg)
 *
 * ![sgemv-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6415 | 0.0046 | 0.9510 | 67.5% |
 * | 64 | 0.0068 | 2.4965 | 0.0046 | 3.6667 | 68.1% |
 * | 128 | 0.0075 | 8.8511 | 0.0050 | 13.2484 | 66.8% |
 * | 256 | 0.0092 | 28.8671 | 0.0099 | 26.7184 | 108.0% |
 * | 512 | 0.0143 | 73.4286 | 0.0136 | 77.4935 | 94.8% |
 * | 1024 | 0.0334 | 125.6727 | 0.0326 | 129.0059 | 97.4% |
 * | 1280 | 0.0464 | 141.5109 | 0.0448 | 146.5143 | 96.6% |
 * | 2048 | 0.1011 | 166.1811 | 0.0991 | 169.4269 | 98.1% |
 * | 4096 | 0.3705 | 181.2366 | 0.3783 | 177.4956 | 102.1% |
 *
 * ![sgemv-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-alpha2p5.svg)
 *
 * ![sgemv-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/alpha.sgemv.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/alpha.sgemv.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0068 | 0.6385 | 0.0046 | 0.9477 | 67.4% |
 * | 64 | 0.0069 | 2.4332 | 0.0046 | 3.6923 | 65.9% |
 * | 128 | 0.0076 | 8.7764 | 0.0052 | 12.8793 | 68.1% |
 * | 256 | 0.0092 | 28.7165 | 0.0099 | 26.6323 | 107.8% |
 * | 512 | 0.0143 | 73.4286 | 0.0137 | 76.8598 | 95.5% |
 * | 1024 | 0.0336 | 125.0148 | 0.0328 | 128.2500 | 97.5% |
 * | 1280 | 0.0462 | 142.1483 | 0.0451 | 145.6818 | 97.6% |
 * | 2048 | 0.1013 | 165.7350 | 0.0995 | 168.8274 | 98.2% |
 * | 4096 | 0.3703 | 181.3149 | 0.3806 | 176.3914 | 102.8% |
 *
 * ![sgemv-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-betaneg3p75.svg)
 *
 * ![sgemv-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6445 | 0.0045 | 0.9645 | 66.8% |
 * | 64 | 0.0068 | 2.4789 | 0.0046 | 3.6923 | 67.1% |
 * | 128 | 0.0075 | 8.9270 | 0.0051 | 13.0000 | 68.7% |
 * | 256 | 0.0092 | 28.5675 | 0.0100 | 26.5466 | 107.6% |
 * | 512 | 0.0143 | 73.8406 | 0.0133 | 78.9820 | 93.5% |
 * | 1024 | 0.0336 | 125.0148 | 0.0325 | 129.1328 | 96.8% |
 * | 1280 | 0.0463 | 141.7064 | 0.0450 | 145.8890 | 97.1% |
 * | 2048 | 0.1009 | 166.3919 | 0.0989 | 169.7283 | 98.0% |
 * | 4096 | 0.3703 | 181.3071 | 0.3785 | 177.3906 | 102.2% |
 *
 * ![sgemv-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-beta0.svg)
 *
 * ![sgemv-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6445 | 0.0044 | 0.9784 | 65.9% |
 * | 64 | 0.0072 | 2.3311 | 0.0048 | 3.4967 | 66.7% |
 * | 128 | 0.0076 | 8.7212 | 0.0053 | 12.6444 | 69.0% |
 * | 256 | 0.0092 | 28.6667 | 0.0101 | 26.0853 | 109.9% |
 * | 512 | 0.0143 | 73.4286 | 0.0136 | 77.2207 | 95.1% |
 * | 1024 | 0.0338 | 124.3048 | 0.0327 | 128.5010 | 96.7% |
 * | 1280 | 0.0462 | 142.1483 | 0.0451 | 145.6818 | 97.6% |
 * | 2048 | 0.1014 | 165.5782 | 0.0993 | 169.1539 | 97.9% |
 * | 4096 | 0.3705 | 181.1975 | 0.3805 | 176.4433 | 102.7% |
 *
 * ![sgemv-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-beta1.svg)
 *
 * ![sgemv-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6385 | 0.0045 | 0.9577 | 66.7% |
 * | 64 | 0.0068 | 2.4789 | 0.0046 | 3.7053 | 66.9% |
 * | 128 | 0.0075 | 8.9079 | 0.0053 | 12.5680 | 70.9% |
 * | 256 | 0.0093 | 28.5181 | 0.0100 | 26.3349 | 108.3% |
 * | 512 | 0.0143 | 73.7578 | 0.0136 | 77.2207 | 95.5% |
 * | 1024 | 0.0335 | 125.4926 | 0.0327 | 128.3754 | 97.8% |
 * | 1280 | 0.0460 | 142.5930 | 0.0449 | 146.0969 | 97.6% |
 * | 2048 | 0.1008 | 166.5503 | 0.0995 | 168.7188 | 98.7% |
 * | 4096 | 0.3706 | 181.1662 | 0.3805 | 176.4582 | 102.7% |
 *
 * ![sgemv-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-beta2p5.svg)
 *
 * ![sgemv-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/beta.sgemv.js) — WebGPU beta-sweep benchmark script
 * - [beta.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/beta.sgemv.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 32 | 0.0076 | 0.5763 |
 * | 64 | 0.0086 | 1.9628 |
 * | 128 | 0.0113 | 5.8924 |
 * | 256 | 0.0164 | 16.0623 |
 * | 512 | 0.0306 | 34.3561 |
 * | 1024 | 0.0403 | 104.2286 |
 * | 1280 | 0.0484 | 135.5717 |
 * | 2048 | 0.1159 | 144.9123 |
 * | 4096 | 0.3821 | 175.6972 |
 *
 * ![sgemv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-layoutcolumnmajor.svg)
 *
 * ![sgemv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0072 | 0.6085 |
 * | 64 | 0.0069 | 2.4332 |
 * | 128 | 0.0075 | 8.8323 |
 * | 256 | 0.0093 | 28.5181 |
 * | 512 | 0.0142 | 74.1736 |
 * | 1024 | 0.0336 | 125.2532 |
 * | 1280 | 0.0466 | 140.9759 |
 * | 2048 | 0.1008 | 166.6825 |
 * | 4096 | 0.3704 | 181.2522 |
 *
 * ![sgemv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-layoutrowmajor.svg)
 *
 * ![sgemv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/layout.sgemv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
