/**
 * Benchmark results for dgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0170 | 0.5273 | 0.0055 | 1.6422 | 32.1% |
 * | 64 | 0.0244 | 1.4031 | 0.0055 | 6.2690 | 22.4% |
 * | 128 | 0.0267 | 5.0294 | 0.0061 | 21.8333 | 23.0% |
 * | 256 | 0.0279 | 18.9874 | 0.0124 | 42.8320 | 44.3% |
 * | 512 | 0.0435 | 48.4706 | 0.0208 | 101.1819 | 47.9% |
 * | 1024 | 0.0935 | 89.9767 | 0.0546 | 154.0651 | 58.4% |
 * | 1280 | 0.1152 | 114.0761 | 0.0796 | 164.9498 | 69.2% |
 * | 2048 | 0.2621 | 128.1875 | 0.1946 | 172.7158 | 74.2% |
 * | 4096 | 0.9933 | 135.2247 | 0.8004 | 167.8044 | 80.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dgemv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-default.svg)
 *
 * ![dgemv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-default.svg)
 *
 * ## See also
 *
 * - [dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/dgemv.js) — WebGPU benchmark script
 * - [dgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/cuda/dgemv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0170 | 0.5258 | 0.0056 | 1.5864 | 33.1% |
 * | 64 | 0.0243 | 1.4115 | 0.0055 | 6.2690 | 22.5% |
 * | 128 | 0.0268 | 5.0084 | 0.0061 | 21.8333 | 22.9% |
 * | 256 | 0.0281 | 18.9008 | 0.0125 | 42.3939 | 44.6% |
 * | 512 | 0.0437 | 48.2930 | 0.0216 | 97.6593 | 49.5% |
 * | 1024 | 0.0942 | 89.3043 | 0.0532 | 158.0000 | 56.5% |
 * | 1280 | 0.1162 | 113.0396 | 0.0801 | 164.0272 | 68.9% |
 * | 2048 | 0.2632 | 127.6732 | 0.1977 | 170.0036 | 75.1% |
 * | 4096 | 0.9922 | 135.3774 | 0.7240 | 185.5071 | 73.0% |
 *
 * ![dgemv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-stride4.svg)
 *
 * ![dgemv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0173 | 0.5166 | 0.0052 | 1.7178 | 30.1% |
 * | 64 | 0.0246 | 1.3958 | 0.0055 | 6.1965 | 22.5% |
 * | 128 | 0.0268 | 4.9964 | 0.0061 | 21.8333 | 22.9% |
 * | 256 | 0.0284 | 18.6983 | 0.0124 | 42.7768 | 43.7% |
 * | 512 | 0.0440 | 47.9070 | 0.0217 | 97.0125 | 49.4% |
 * | 1024 | 0.0942 | 89.3347 | 0.0532 | 158.0000 | 56.5% |
 * | 1280 | 0.1153 | 113.9653 | 0.0799 | 164.3555 | 69.3% |
 * | 2048 | 0.2621 | 128.1875 | 0.1986 | 169.1819 | 75.8% |
 * | 4096 | 0.9953 | 134.9465 | 0.7238 | 185.5604 | 72.7% |
 *
 * ![dgemv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-stride5.svg)
 *
 * ![dgemv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0177 | 0.5063 | 0.0052 | 1.7178 | 29.5% |
 * | 64 | 0.0246 | 1.3958 | 0.0053 | 6.4192 | 21.7% |
 * | 128 | 0.0269 | 4.9875 | 0.0061 | 21.8333 | 22.8% |
 * | 256 | 0.0281 | 18.8578 | 0.0124 | 42.8320 | 44.0% |
 * | 512 | 0.0450 | 46.8848 | 0.0218 | 96.6569 | 48.5% |
 * | 1024 | 0.0977 | 86.1160 | 0.0549 | 153.1229 | 56.2% |
 * | 1280 | 0.1214 | 108.2558 | 0.0811 | 162.0525 | 66.8% |
 * | 2048 | 0.2767 | 121.4634 | 0.2005 | 167.6156 | 72.5% |
 * | 4096 | 1.0444 | 128.6059 | 0.7311 | 183.7087 | 70.0% |
 *
 * ![dgemv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-stride32.svg)
 *
 * ![dgemv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0175 | 0.5133 | 0.0053 | 1.6817 | 30.5% |
 * | 64 | 0.0246 | 1.3958 | 0.0053 | 6.4384 | 21.7% |
 * | 128 | 0.0270 | 4.9727 | 0.0061 | 21.8333 | 22.8% |
 * | 256 | 0.0278 | 19.0638 | 0.0124 | 42.6118 | 44.7% |
 * | 512 | 0.0445 | 47.3563 | 0.0221 | 95.6055 | 49.5% |
 * | 1024 | 0.0963 | 87.3752 | 0.0548 | 153.6599 | 56.9% |
 * | 1280 | 0.1188 | 110.6183 | 0.0815 | 161.2569 | 68.6% |
 * | 2048 | 0.2664 | 126.1472 | 0.2007 | 167.4286 | 75.3% |
 * | 4096 | 0.9959 | 134.8641 | 0.7309 | 183.7569 | 73.4% |
 *
 * ![dgemv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-stride33.svg)
 *
 * ![dgemv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0177 | 0.5054 | 0.0053 | 1.6867 | 30.0% |
 * | 64 | 0.0246 | 1.3958 | 0.0055 | 6.2507 | 22.3% |
 * | 128 | 0.0271 | 4.9492 | 0.0061 | 21.8333 | 22.7% |
 * | 256 | 0.0287 | 18.5000 | 0.0125 | 42.5571 | 43.5% |
 * | 512 | 0.0448 | 47.0521 | 0.0225 | 93.9031 | 50.1% |
 * | 1024 | 0.0979 | 85.9611 | 0.0550 | 152.9447 | 56.2% |
 * | 1280 | 0.1188 | 110.5737 | 0.0812 | 161.7652 | 68.4% |
 * | 2048 | 0.2683 | 125.2370 | 0.2018 | 166.5390 | 75.2% |
 * | 4096 | 1.0076 | 133.3008 | 0.7328 | 183.3035 | 72.7% |
 *
 * ![dgemv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-stride255.svg)
 *
 * ![dgemv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0176 | 0.5100 | 0.0054 | 1.6667 | 30.6% |
 * | 64 | 0.0246 | 1.3958 | 0.0052 | 6.5366 | 21.4% |
 * | 128 | 0.0272 | 4.9289 | 0.0061 | 21.8333 | 22.6% |
 * | 256 | 0.0287 | 18.5000 | 0.0123 | 43.0545 | 43.0% |
 * | 512 | 0.0452 | 46.6195 | 0.0224 | 94.3062 | 49.4% |
 * | 1024 | 0.0991 | 84.9199 | 0.0548 | 153.3909 | 55.4% |
 * | 1280 | 0.1227 | 107.0700 | 0.0816 | 160.9724 | 66.5% |
 * | 2048 | 0.2785 | 120.6471 | 0.2007 | 167.4019 | 72.1% |
 * | 4096 | 1.0506 | 127.8441 | 0.7323 | 183.4197 | 69.7% |
 *
 * ![dgemv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-stride256.svg)
 *
 * ![dgemv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/stride.dgemv.js) — WebGPU stride-sweep benchmark script
 * - [stride.dgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/cuda/stride.dgemv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0082 | 1.0938 | 0.0055 | 1.6422 | 66.6% |
 * | 64 | 0.0083 | 2.1044 | 0.0054 | 3.2381 | 65.0% |
 * | 128 | 0.0086 | 3.9926 | 0.0055 | 6.2690 | 63.7% |
 * | 256 | 0.0096 | 7.1052 | 0.0060 | 11.2593 | 63.1% |
 * | 512 | 0.0108 | 12.6003 | 0.0100 | 13.5463 | 93.0% |
 * | 1024 | 0.0143 | 18.8929 | 0.0102 | 26.4500 | 71.4% |
 * | 1280 | 0.0153 | 22.0793 | 0.0110 | 30.7889 | 71.7% |
 * | 2048 | 0.0195 | 27.8158 | 0.0113 | 47.7740 | 58.2% |
 * | 4096 | 0.0412 | 26.2791 | 0.0141 | 76.6621 | 34.3% |
 *
 * ![dgemv-trans-no-transpose-m32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m32.svg)
 *
 * ![dgemv-trans-no-transpose-m32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 2.1190 | 0.0054 | 3.2663 | 64.9% |
 * | 64 | 0.0084 | 4.1073 | 0.0054 | 6.3059 | 65.1% |
 * | 128 | 0.0088 | 7.7221 | 0.0058 | 11.6685 | 66.2% |
 * | 256 | 0.0100 | 13.4359 | 0.0061 | 21.8333 | 61.5% |
 * | 512 | 0.0109 | 24.4211 | 0.0068 | 39.3962 | 62.0% |
 * | 1024 | 0.0144 | 37.1728 | 0.0085 | 62.6767 | 59.3% |
 * | 1280 | 0.0156 | 42.7762 | 0.0097 | 68.5263 | 62.4% |
 * | 2048 | 0.0260 | 41.0752 | 0.0164 | 65.0625 | 63.1% |
 * | 4096 | 0.0430 | 49.6030 | 0.0293 | 72.6194 | 68.3% |
 *
 * ![dgemv-trans-no-transpose-m64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m64.svg)
 *
 * ![dgemv-trans-no-transpose-m64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0099 | 3.5527 | 0.0057 | 6.1229 | 58.0% |
 * | 64 | 0.0100 | 6.8424 | 0.0060 | 11.3493 | 60.3% |
 * | 128 | 0.0102 | 13.1000 | 0.0061 | 21.8333 | 60.0% |
 * | 256 | 0.0112 | 23.8054 | 0.0069 | 38.6977 | 61.5% |
 * | 512 | 0.0143 | 37.0000 | 0.0082 | 64.7500 | 57.1% |
 * | 1024 | 0.0201 | 52.5624 | 0.0121 | 87.7666 | 59.9% |
 * | 1280 | 0.0240 | 55.1621 | 0.0145 | 91.2671 | 60.4% |
 * | 2048 | 0.0312 | 67.7030 | 0.0203 | 104.4423 | 64.8% |
 * | 4096 | 0.0512 | 82.6775 | 0.0358 | 118.2111 | 69.9% |
 *
 * ![dgemv-trans-no-transpose-m128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m128.svg)
 *
 * ![dgemv-trans-no-transpose-m128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m128.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0143 | 4.8804 | 0.0102 | 6.8250 | 71.5% |
 * | 64 | 0.0143 | 9.4643 | 0.0104 | 13.0462 | 72.5% |
 * | 128 | 0.0146 | 18.2757 | 0.0112 | 23.7610 | 76.9% |
 * | 256 | 0.0165 | 32.0619 | 0.0125 | 42.3939 | 75.6% |
 * | 512 | 0.0242 | 43.6825 | 0.0155 | 68.0907 | 64.2% |
 * | 1024 | 0.0343 | 61.5212 | 0.0218 | 96.5861 | 63.7% |
 * | 1280 | 0.0390 | 67.5701 | 0.0248 | 106.2128 | 63.6% |
 * | 2048 | 0.0540 | 78.1210 | 0.0336 | 125.3803 | 62.3% |
 * | 4096 | 0.0947 | 88.9363 | 0.0573 | 146.9286 | 60.5% |
 *
 * ![dgemv-trans-no-transpose-m256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m256.svg)
 *
 * ![dgemv-trans-no-transpose-m256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m256.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 512</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0200 | 6.9704 | 0.0102 | 13.7323 | 50.8% |
 * | 64 | 0.0199 | 13.6187 | 0.0103 | 26.2857 | 51.8% |
 * | 128 | 0.0221 | 24.0925 | 0.0112 | 47.5663 | 50.7% |
 * | 256 | 0.0268 | 39.5789 | 0.0140 | 75.3713 | 52.5% |
 * | 512 | 0.0354 | 59.5752 | 0.0210 | 100.6412 | 59.2% |
 * | 1024 | 0.0518 | 81.2247 | 0.0323 | 130.4103 | 62.3% |
 * | 1280 | 0.0613 | 85.7673 | 0.0379 | 138.8649 | 61.8% |
 * | 2048 | 0.0860 | 97.8095 | 0.0550 | 152.8558 | 64.0% |
 * | 4096 | 0.1532 | 109.8022 | 0.1272 | 132.2350 | 83.0% |
 *
 * ![dgemv-trans-no-transpose-m512 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m512.svg)
 *
 * ![dgemv-trans-no-transpose-m512 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m512.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1024</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0332 | 8.4012 | 0.0102 | 27.2250 | 30.9% |
 * | 64 | 0.0329 | 16.4594 | 0.0113 | 47.7066 | 34.5% |
 * | 128 | 0.0374 | 28.4718 | 0.0131 | 81.2488 | 35.0% |
 * | 256 | 0.0476 | 44.4301 | 0.0208 | 101.6326 | 43.7% |
 * | 512 | 0.0696 | 60.5294 | 0.0325 | 129.6378 | 46.7% |
 * | 1024 | 0.0982 | 85.6949 | 0.0547 | 153.9297 | 55.7% |
 * | 1280 | 0.1138 | 92.3565 | 0.0655 | 160.4062 | 57.6% |
 * | 2048 | 0.1630 | 103.1338 | 0.0977 | 172.0924 | 59.9% |
 * | 4096 | 0.2949 | 113.9444 | 0.1868 | 179.9061 | 63.3% |
 *
 * ![dgemv-trans-no-transpose-m1024 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m1024.svg)
 *
 * ![dgemv-trans-no-transpose-m1024 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m1024.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1280</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0428 | 8.1375 | 0.0102 | 34.0250 | 23.9% |
 * | 64 | 0.0395 | 17.1419 | 0.0113 | 59.9603 | 28.6% |
 * | 128 | 0.0453 | 29.3804 | 0.0166 | 80.2932 | 36.6% |
 * | 256 | 0.0548 | 48.2758 | 0.0234 | 113.0287 | 42.7% |
 * | 512 | 0.0737 | 71.4444 | 0.0373 | 141.2944 | 50.6% |
 * | 1024 | 0.1116 | 94.1883 | 0.0655 | 160.4375 | 58.7% |
 * | 1280 | 0.1311 | 100.2344 | 0.0796 | 165.0824 | 60.7% |
 * | 2048 | 0.1891 | 111.1225 | 0.1204 | 174.4651 | 63.7% |
 * | 4096 | 0.3424 | 122.6642 | 0.2335 | 179.8772 | 68.2% |
 *
 * ![dgemv-trans-no-transpose-m1280 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m1280.svg)
 *
 * ![dgemv-trans-no-transpose-m1280 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m1280.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 2048</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0594 | 9.3836 | 0.0071 | 78.8054 | 11.9% |
 * | 64 | 0.0610 | 17.7284 | 0.0102 | 106.3145 | 16.7% |
 * | 128 | 0.0677 | 31.4781 | 0.0172 | 124.0075 | 25.4% |
 * | 256 | 0.0821 | 51.5244 | 0.0289 | 146.3566 | 35.2% |
 * | 512 | 0.1126 | 74.8000 | 0.0521 | 161.5809 | 46.3% |
 * | 1024 | 0.1720 | 97.7528 | 0.1054 | 159.5047 | 61.3% |
 * | 1280 | 0.2031 | 103.4668 | 0.1278 | 164.4638 | 62.9% |
 * | 2048 | 0.2942 | 114.2171 | 0.1948 | 172.4888 | 66.2% |
 * | 4096 | 0.5427 | 123.7736 | 0.3736 | 179.8184 | 68.8% |
 *
 * ![dgemv-trans-no-transpose-m2048 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m2048.svg)
 *
 * ![dgemv-trans-no-transpose-m2048 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m2048.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 4096</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.1124 | 9.9101 | 0.0119 | 93.9919 | 10.5% |
 * | 64 | 0.1126 | 19.2045 | 0.0188 | 115.2600 | 16.7% |
 * | 128 | 0.1270 | 33.5565 | 0.0328 | 130.0312 | 25.8% |
 * | 256 | 0.1559 | 54.2342 | 0.0610 | 138.5716 | 39.1% |
 * | 512 | 0.2149 | 78.3895 | 0.1024 | 164.4429 | 47.7% |
 * | 1024 | 0.3335 | 100.8232 | 0.2463 | 136.5222 | 73.9% |
 * | 1280 | 0.3931 | 106.8942 | 0.2864 | 146.7137 | 72.9% |
 * | 2048 | 0.5722 | 117.4204 | 0.4224 | 159.0510 | 73.8% |
 * | 4096 | 1.0922 | 122.9802 | 0.8006 | 167.7776 | 73.3% |
 *
 * ![dgemv-trans-no-transpose-m4096 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-no-transpose-m4096.svg)
 *
 * ![dgemv-trans-no-transpose-m4096 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-no-transpose-m4096.svg)
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
 * | 32 | 0.0171 | 0.5243 | 0.0059 | 1.5301 | 34.3% |
 * | 64 | 0.0170 | 1.0366 | 0.0059 | 2.9919 | 34.6% |
 * | 128 | 0.0171 | 2.0563 | 0.0064 | 5.4527 | 37.7% |
 * | 256 | 0.0171 | 4.0899 | 0.0074 | 9.4545 | 43.3% |
 * | 512 | 0.0174 | 8.0000 | 0.0090 | 15.4336 | 51.8% |
 * | 1024 | 0.0175 | 15.9414 | 0.0136 | 20.4507 | 78.0% |
 * | 1280 | 0.0176 | 19.7784 | 0.0152 | 22.9947 | 86.0% |
 * | 2048 | 0.0179 | 31.1835 | 0.0212 | 26.3280 | 118.4% |
 * | 4096 | 0.0245 | 45.4621 | 0.0375 | 29.7133 | 153.0% |
 *
 * ![dgemv-trans-transpose-m32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m32.svg)
 *
 * ![dgemv-trans-transpose-m32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0245 | 0.7106 | 0.0059 | 2.9727 | 23.9% |
 * | 64 | 0.0244 | 1.4031 | 0.0059 | 5.8261 | 24.1% |
 * | 128 | 0.0245 | 2.7781 | 0.0066 | 10.3301 | 26.9% |
 * | 256 | 0.0245 | 5.5352 | 0.0080 | 17.0281 | 32.5% |
 * | 512 | 0.0246 | 11.0208 | 0.0096 | 28.3077 | 38.9% |
 * | 1024 | 0.0246 | 22.0208 | 0.0143 | 37.7500 | 58.3% |
 * | 1280 | 0.0246 | 27.4494 | 0.0167 | 40.4904 | 67.8% |
 * | 2048 | 0.0360 | 30.0249 | 0.0228 | 47.3833 | 63.4% |
 * | 4096 | 0.0387 | 55.9140 | 0.0410 | 52.8125 | 105.9% |
 *
 * ![dgemv-trans-transpose-m64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m64.svg)
 *
 * ![dgemv-trans-transpose-m64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0267 | 1.2838 | 0.0061 | 5.5833 | 23.0% |
 * | 64 | 0.0267 | 2.5293 | 0.0061 | 11.0000 | 23.0% |
 * | 128 | 0.0268 | 5.0084 | 0.0074 | 18.0301 | 27.8% |
 * | 256 | 0.0267 | 10.0144 | 0.0090 | 29.8286 | 33.6% |
 * | 512 | 0.0275 | 19.4312 | 0.0118 | 45.1204 | 43.1% |
 * | 1024 | 0.0402 | 26.5434 | 0.0180 | 59.0638 | 44.9% |
 * | 1280 | 0.0445 | 29.9403 | 0.0222 | 60.1184 | 49.8% |
 * | 2048 | 0.0461 | 46.2605 | 0.0306 | 69.7298 | 66.3% |
 * | 4096 | 0.0532 | 80.0192 | 0.0537 | 79.3753 | 100.8% |
 *
 * ![dgemv-trans-transpose-m128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m128.svg)
 *
 * ![dgemv-trans-transpose-m128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m128.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0307 | 2.2167 | 0.0119 | 5.7128 | 38.8% |
 * | 64 | 0.0308 | 4.3621 | 0.0065 | 20.7525 | 21.0% |
 * | 128 | 0.0320 | 8.3117 | 0.0083 | 32.1236 | 25.9% |
 * | 256 | 0.0326 | 16.2510 | 0.0105 | 50.6137 | 32.1% |
 * | 512 | 0.0466 | 22.7253 | 0.0142 | 74.7751 | 30.4% |
 * | 1024 | 0.0492 | 43.0417 | 0.0245 | 86.2518 | 49.9% |
 * | 1280 | 0.0511 | 51.7208 | 0.0278 | 94.9701 | 54.5% |
 * | 2048 | 0.0492 | 86.0417 | 0.0389 | 108.6842 | 79.2% |
 * | 4096 | 0.0898 | 94.1418 | 0.0681 | 124.0930 | 75.9% |
 *
 * ![dgemv-trans-transpose-m256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m256.svg)
 *
 * ![dgemv-trans-transpose-m256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m256.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 512</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0284 | 4.7748 | 0.0120 | 11.2916 | 42.3% |
 * | 64 | 0.0285 | 9.3737 | 0.0077 | 34.5839 | 27.1% |
 * | 128 | 0.0287 | 18.4588 | 0.0099 | 53.8182 | 34.3% |
 * | 256 | 0.0413 | 25.5604 | 0.0127 | 83.0792 | 30.8% |
 * | 512 | 0.0444 | 47.5613 | 0.0216 | 97.7317 | 48.7% |
 * | 1024 | 0.0492 | 85.7500 | 0.0328 | 128.6250 | 66.7% |
 * | 1280 | 0.0537 | 98.0685 | 0.0389 | 135.3684 | 72.4% |
 * | 2048 | 0.0905 | 93.0868 | 0.0571 | 147.6702 | 63.0% |
 * | 4096 | 0.1431 | 117.7113 | 0.1021 | 164.9323 | 71.4% |
 *
 * ![dgemv-trans-transpose-m512 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m512.svg)
 *
 * ![dgemv-trans-transpose-m512 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m512.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1024</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0307 | 8.8167 | 0.0124 | 21.9275 | 40.2% |
 * | 64 | 0.0307 | 17.3667 | 0.0102 | 52.1000 | 33.3% |
 * | 128 | 0.0434 | 24.3922 | 0.0143 | 73.8571 | 33.0% |
 * | 256 | 0.0458 | 46.0657 | 0.0221 | 95.3980 | 48.3% |
 * | 512 | 0.0515 | 81.7038 | 0.0337 | 124.9611 | 65.4% |
 * | 1024 | 0.0942 | 89.3043 | 0.0572 | 147.1660 | 60.7% |
 * | 1280 | 0.1004 | 104.7588 | 0.0674 | 156.0931 | 67.1% |
 * | 2048 | 0.1467 | 114.6402 | 0.1023 | 164.4198 | 69.7% |
 * | 4096 | 0.2580 | 130.3175 | 0.1925 | 174.6808 | 74.6% |
 *
 * ![dgemv-trans-transpose-m1024 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m1024.svg)
 *
 * ![dgemv-trans-transpose-m1024 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m1024.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 1280</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0325 | 10.3992 | 0.0126 | 26.9109 | 38.6% |
 * | 64 | 0.0315 | 21.1492 | 0.0119 | 56.0000 | 37.8% |
 * | 128 | 0.0456 | 29.0337 | 0.0181 | 73.2400 | 39.6% |
 * | 256 | 0.0484 | 54.4582 | 0.0248 | 106.1443 | 51.3% |
 * | 512 | 0.0570 | 92.3685 | 0.0394 | 133.6172 | 69.1% |
 * | 1024 | 0.1020 | 103.0788 | 0.0714 | 147.1828 | 70.0% |
 * | 1280 | 0.1160 | 113.2736 | 0.0849 | 154.8115 | 73.2% |
 * | 2048 | 0.1737 | 120.9845 | 0.1286 | 163.3998 | 74.0% |
 * | 4096 | 0.3174 | 132.3677 | 0.2418 | 173.8038 | 76.2% |
 *
 * ![dgemv-trans-transpose-m1280 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m1280.svg)
 *
 * ![dgemv-trans-transpose-m1280 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m1280.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 2048</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0355 | 15.2360 | 0.0137 | 39.5602 | 38.5% |
 * | 64 | 0.0471 | 22.6304 | 0.0163 | 65.4460 | 34.6% |
 * | 128 | 0.0493 | 42.8742 | 0.0223 | 94.9203 | 45.2% |
 * | 256 | 0.0553 | 76.2222 | 0.0335 | 125.8595 | 60.6% |
 * | 512 | 0.1004 | 83.8367 | 0.0569 | 147.7449 | 56.7% |
 * | 1024 | 0.1515 | 110.9541 | 0.1034 | 162.5850 | 68.2% |
 * | 1280 | 0.1781 | 117.9610 | 0.1249 | 168.1639 | 70.1% |
 * | 2048 | 0.2631 | 127.7198 | 0.1943 | 172.9291 | 73.9% |
 * | 4096 | 0.4981 | 134.8996 | 0.3766 | 178.4104 | 75.6% |
 *
 * ![dgemv-trans-transpose-m2048 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m2048.svg)
 *
 * ![dgemv-trans-transpose-m2048 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m2048.svg)
 *
 * </details>
 *
 * <details>
 * <summary>m = 4096</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0561 | 19.2968 | 0.0163 | 66.4857 | 29.0% |
 * | 64 | 0.0569 | 37.4639 | 0.0286 | 74.5294 | 50.3% |
 * | 128 | 0.0630 | 67.1204 | 0.0372 | 113.5883 | 59.1% |
 * | 256 | 0.1099 | 76.6956 | 0.0569 | 148.0022 | 51.8% |
 * | 512 | 0.1638 | 102.6500 | 0.1080 | 155.7008 | 65.9% |
 * | 1024 | 0.2732 | 122.9783 | 0.1969 | 170.6805 | 72.1% |
 * | 1280 | 0.3338 | 125.8037 | 0.2405 | 174.6353 | 72.0% |
 * | 2048 | 0.5099 | 131.7434 | 0.3769 | 178.2230 | 73.9% |
 * | 4096 | 0.9947 | 135.0333 | 0.7375 | 182.1343 | 74.1% |
 *
 * ![dgemv-trans-transpose-m4096 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-trans-transpose-m4096.svg)
 *
 * ![dgemv-trans-transpose-m4096 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-trans-transpose-m4096.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/trans.dgemv.js) — WebGPU trans-sweep benchmark script
 * - [trans.dgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/cuda/trans.dgemv.c) — CUDA / cuBLAS trans-sweep reference script
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
 * | 32 | 0.0082 | 1.0625 | 0.0054 | 1.6000 | 66.4% |
 * | 64 | 0.0083 | 4.0615 | 0.0056 | 6.0343 | 67.3% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0167 | 31.7233 | 0.0125 | 42.1762 | 75.2% |
 * | 512 | 0.0354 | 59.4327 | 0.0208 | 101.4526 | 58.6% |
 * | 1024 | 0.0916 | 91.7255 | 0.0548 | 153.4206 | 59.8% |
 * | 1280 | 0.1311 | 100.1563 | 0.0797 | 164.6228 | 60.8% |
 * | 2048 | 0.2949 | 113.8889 | 0.1947 | 172.4897 | 66.0% |
 * | 4096 | 1.0903 | 123.1667 | 0.8004 | 167.7735 | 73.4% |
 *
 * ![dgemv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad0.svg)
 *
 * ![dgemv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0462 | 0.0053 | 1.6287 | 64.2% |
 * | 64 | 0.0084 | 4.0000 | 0.0056 | 6.0690 | 65.9% |
 * | 128 | 0.0103 | 12.8793 | 0.0063 | 21.0633 | 61.1% |
 * | 256 | 0.0166 | 31.8764 | 0.0125 | 42.3385 | 75.3% |
 * | 512 | 0.0358 | 58.8216 | 0.0209 | 100.9080 | 58.3% |
 * | 1024 | 0.0925 | 90.8530 | 0.0547 | 153.6449 | 59.1% |
 * | 1280 | 0.1324 | 99.1277 | 0.0798 | 164.4249 | 60.3% |
 * | 2048 | 0.3007 | 111.7131 | 0.1988 | 168.9633 | 66.1% |
 *
 * ![dgemv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad1.svg)
 *
 * ![dgemv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0543 | 0.0054 | 1.6190 | 65.1% |
 * | 64 | 0.0084 | 4.0305 | 0.0054 | 6.2485 | 64.5% |
 * | 128 | 0.0104 | 12.8000 | 0.0061 | 21.6667 | 59.1% |
 * | 256 | 0.0166 | 31.8150 | 0.0125 | 42.3385 | 75.1% |
 * | 512 | 0.0357 | 58.9798 | 0.0215 | 97.9048 | 60.2% |
 * | 1024 | 0.0923 | 91.1051 | 0.0547 | 153.5551 | 59.3% |
 * | 1280 | 0.1325 | 99.1038 | 0.0799 | 164.3919 | 60.3% |
 * | 2048 | 0.2969 | 113.1095 | 0.1974 | 170.1686 | 66.5% |
 *
 * ![dgemv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad8.svg)
 *
 * ![dgemv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0462 | 0.0054 | 1.6142 | 64.8% |
 * | 64 | 0.0084 | 4.0382 | 0.0054 | 6.2485 | 64.6% |
 * | 128 | 0.0104 | 12.8594 | 0.0061 | 21.6667 | 59.4% |
 * | 256 | 0.0166 | 31.7538 | 0.0124 | 42.4473 | 74.8% |
 * | 512 | 0.0354 | 59.5403 | 0.0209 | 100.5994 | 59.2% |
 * | 1024 | 0.0922 | 91.2000 | 0.0549 | 152.9738 | 59.6% |
 * | 1280 | 0.1325 | 99.0439 | 0.0798 | 164.4908 | 60.2% |
 * | 2048 | 0.2981 | 112.6664 | 0.1967 | 170.7500 | 66.0% |
 *
 * ![dgemv-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad16.svg)
 *
 * ![dgemv-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0543 | 0.0054 | 1.6239 | 64.9% |
 * | 64 | 0.0084 | 4.0076 | 0.0054 | 6.2118 | 64.5% |
 * | 128 | 0.0102 | 13.0000 | 0.0062 | 21.3333 | 60.9% |
 * | 256 | 0.0166 | 31.7538 | 0.0126 | 42.0688 | 75.5% |
 * | 512 | 0.0354 | 59.5133 | 0.0214 | 98.5648 | 60.4% |
 * | 1024 | 0.0996 | 84.4010 | 0.0548 | 153.2415 | 55.1% |
 * | 1280 | 0.1413 | 92.8986 | 0.0798 | 164.5898 | 56.4% |
 * | 2048 | 0.2949 | 113.8889 | 0.2008 | 167.3069 | 68.1% |
 *
 * ![dgemv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad32.svg)
 *
 * ![dgemv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0502 | 0.0053 | 1.6386 | 64.1% |
 * | 64 | 0.0084 | 4.0000 | 0.0056 | 6.0690 | 65.9% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0165 | 31.9381 | 0.0127 | 41.5396 | 76.9% |
 * | 512 | 0.0354 | 59.4327 | 0.0210 | 100.1400 | 59.3% |
 * | 1024 | 0.0922 | 91.2000 | 0.0548 | 153.3310 | 59.5% |
 * | 1280 | 0.1316 | 99.7302 | 0.0799 | 164.3590 | 60.7% |
 * | 2048 | 0.2972 | 113.0121 | 0.1996 | 168.2725 | 67.2% |
 *
 * ![dgemv-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad48.svg)
 *
 * ![dgemv-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0584 | 0.0053 | 1.6435 | 64.4% |
 * | 64 | 0.0084 | 4.0076 | 0.0053 | 6.3423 | 63.2% |
 * | 128 | 0.0103 | 12.8793 | 0.0061 | 21.6667 | 59.4% |
 * | 256 | 0.0167 | 31.6929 | 0.0126 | 42.0153 | 75.4% |
 * | 512 | 0.0353 | 59.6753 | 0.0211 | 99.9878 | 59.7% |
 * | 1024 | 0.0921 | 91.2792 | 0.0546 | 153.8249 | 59.3% |
 * | 1280 | 0.1311 | 100.1563 | 0.0799 | 164.3590 | 60.9% |
 * | 2048 | 0.2949 | 113.8889 | 0.1977 | 169.9207 | 67.0% |
 *
 * ![dgemv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad64.svg)
 *
 * ![dgemv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0482 | 0.0053 | 1.6386 | 64.0% |
 * | 64 | 0.0086 | 3.9330 | 0.0054 | 6.2301 | 63.1% |
 * | 128 | 0.0103 | 12.8793 | 0.0061 | 21.6667 | 59.4% |
 * | 256 | 0.0166 | 31.8150 | 0.0124 | 42.5019 | 74.9% |
 * | 512 | 0.0354 | 59.5403 | 0.0210 | 100.0639 | 59.5% |
 * | 1024 | 0.0917 | 91.6135 | 0.0553 | 152.0000 | 60.3% |
 * | 1280 | 0.1310 | 100.2052 | 0.0798 | 164.4249 | 60.9% |
 * | 2048 | 0.2956 | 113.6177 | 0.2004 | 167.6409 | 67.8% |
 *
 * ![dgemv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-pad128.svg)
 *
 * ![dgemv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/lda.dgemv.js) — WebGPU lda-sweep benchmark script
 * - [lda.dgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/cuda/lda.dgemv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0083 | 1.0502 | 0.0053 | 1.6386 | 64.1% |
 * | 64 | 0.0084 | 4.0152 | 0.0053 | 6.3423 | 63.3% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0167 | 31.6322 | 0.0124 | 42.5567 | 74.3% |
 * | 512 | 0.0354 | 59.5133 | 0.0207 | 101.7664 | 58.5% |
 * | 1024 | 0.0917 | 91.6135 | 0.0545 | 154.2766 | 59.4% |
 * | 1280 | 0.1308 | 100.3645 | 0.0794 | 165.2861 | 60.7% |
 * | 2048 | 0.2949 | 113.8951 | 0.1946 | 172.6316 | 66.0% |
 * | 4096 | 1.0936 | 122.7865 | 0.8008 | 167.6931 | 73.2% |
 *
 * ![dgemv-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-alphaneg3p75.svg)
 *
 * ![dgemv-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0625 | 0.0022 | 4.0296 | 26.4% |
 * | 64 | 0.0083 | 4.0615 | 0.0021 | 15.7612 | 25.8% |
 * | 128 | 0.0102 | 13.0000 | 0.0022 | 61.1765 | 21.2% |
 * | 256 | 0.0165 | 32.0000 | 0.0022 | 239.3043 | 13.4% |
 * | 512 | 0.0355 | 59.3523 | 0.0028 | 756.2299 | 7.8% |
 * | 1024 | 0.0915 | 91.8860 | 0.0027 | 3108.3547 | 3.0% |
 * | 1280 | 0.1308 | 100.3400 | 0.0027 | 4798.1289 | 2.1% |
 * | 2048 | 0.2949 | 113.8889 | 0.0028 | 12204.6504 | 0.9% |
 * | 4096 | 1.1002 | 122.0579 | 0.0027 | 49956.5703 | 0.2% |
 *
 * ![dgemv-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-alpha0.svg)
 *
 * ![dgemv-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0502 | 0.0052 | 1.6842 | 62.4% |
 * | 64 | 0.0085 | 3.9849 | 0.0052 | 6.4587 | 61.7% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0165 | 31.9381 | 0.0124 | 42.4473 | 75.2% |
 * | 512 | 0.0355 | 59.2721 | 0.0208 | 101.4526 | 58.4% |
 * | 1024 | 0.0919 | 91.4700 | 0.0546 | 153.9150 | 59.4% |
 * | 1280 | 0.1309 | 100.2909 | 0.0796 | 164.8875 | 60.8% |
 * | 2048 | 0.2951 | 113.8210 | 0.1946 | 172.6316 | 65.9% |
 * | 4096 | 1.0940 | 122.7452 | 0.8008 | 167.6964 | 73.2% |
 *
 * ![dgemv-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-alpha1eneg38.svg)
 *
 * ![dgemv-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0604 | 0.0054 | 1.6000 | 66.3% |
 * | 64 | 0.0084 | 4.0076 | 0.0053 | 6.3614 | 63.0% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0166 | 31.8764 | 0.0124 | 42.6667 | 74.7% |
 * | 512 | 0.0356 | 59.2187 | 0.0208 | 100.9854 | 58.6% |
 * | 1024 | 0.0913 | 92.0631 | 0.0544 | 154.5035 | 59.6% |
 * | 1280 | 0.1307 | 100.4505 | 0.0796 | 164.8212 | 60.9% |
 * | 2048 | 0.2949 | 113.8889 | 0.1946 | 172.6316 | 66.0% |
 * | 4096 | 1.0998 | 122.1006 | 0.8007 | 167.7098 | 72.8% |
 *
 * ![dgemv-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-alpha1.svg)
 *
 * ![dgemv-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0462 | 0.0053 | 1.6435 | 63.7% |
 * | 64 | 0.0084 | 4.0076 | 0.0054 | 6.2118 | 64.5% |
 * | 128 | 0.0102 | 13.0000 | 0.0062 | 21.5544 | 60.3% |
 * | 256 | 0.0166 | 31.8150 | 0.0125 | 42.3385 | 75.1% |
 * | 512 | 0.0354 | 59.4327 | 0.0209 | 100.6764 | 59.0% |
 * | 1024 | 0.0914 | 91.9664 | 0.0548 | 153.4206 | 59.9% |
 * | 1280 | 0.1311 | 100.1563 | 0.0796 | 164.8875 | 60.7% |
 * | 2048 | 0.2963 | 113.3600 | 0.1946 | 172.6174 | 65.7% |
 * | 4096 | 1.0953 | 122.5964 | 0.8008 | 167.6931 | 73.1% |
 *
 * ![dgemv-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-alpha2p5.svg)
 *
 * ![dgemv-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/alpha.dgemv.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/cuda/alpha.dgemv.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0084 | 1.0421 | 0.0054 | 1.6047 | 64.9% |
 * | 64 | 0.0084 | 4.0460 | 0.0055 | 6.1395 | 65.9% |
 * | 128 | 0.0103 | 12.9595 | 0.0062 | 21.4433 | 60.4% |
 * | 256 | 0.0167 | 31.6929 | 0.0126 | 41.8025 | 75.8% |
 * | 512 | 0.0354 | 59.5403 | 0.0212 | 99.5340 | 59.8% |
 * | 1024 | 0.0915 | 91.8699 | 0.0550 | 152.7958 | 60.1% |
 * | 1280 | 0.1309 | 100.2664 | 0.0799 | 164.3590 | 61.0% |
 * | 2048 | 0.2949 | 113.8889 | 0.1964 | 170.9725 | 66.6% |
 * | 4096 | 1.0924 | 122.9304 | 0.8005 | 167.7434 | 73.3% |
 *
 * ![dgemv-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-betaneg3p75.svg)
 *
 * ![dgemv-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0625 | 0.0055 | 1.5814 | 67.2% |
 * | 64 | 0.0084 | 4.0460 | 0.0053 | 6.3234 | 64.0% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0166 | 31.9072 | 0.0124 | 42.6116 | 74.9% |
 * | 512 | 0.0356 | 59.1655 | 0.0210 | 100.1400 | 59.1% |
 * | 1024 | 0.0911 | 92.2409 | 0.0545 | 154.0956 | 59.9% |
 * | 1280 | 0.1310 | 100.2297 | 0.0796 | 164.9538 | 60.8% |
 * | 2048 | 0.2951 | 113.8210 | 0.1946 | 172.6316 | 65.9% |
 * | 4096 | 1.0923 | 122.9376 | 0.8005 | 167.7467 | 73.3% |
 *
 * ![dgemv-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-beta0.svg)
 *
 * ![dgemv-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0462 | 0.0056 | 1.5677 | 66.7% |
 * | 64 | 0.0085 | 3.9924 | 0.0055 | 6.1395 | 65.0% |
 * | 128 | 0.0102 | 13.0000 | 0.0062 | 21.5544 | 60.3% |
 * | 256 | 0.0166 | 31.8457 | 0.0126 | 41.9619 | 75.9% |
 * | 512 | 0.0354 | 59.4327 | 0.0214 | 98.3438 | 60.4% |
 * | 1024 | 0.0914 | 91.9503 | 0.0549 | 153.1522 | 60.0% |
 * | 1280 | 0.1310 | 100.2297 | 0.0799 | 164.3590 | 61.0% |
 * | 2048 | 0.2949 | 113.8889 | 0.1965 | 170.9307 | 66.6% |
 * | 4096 | 1.0947 | 122.6681 | 0.8003 | 167.7937 | 73.1% |
 *
 * ![dgemv-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-beta1.svg)
 *
 * ![dgemv-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0584 | 0.0055 | 1.5860 | 66.7% |
 * | 64 | 0.0084 | 4.0460 | 0.0056 | 6.0690 | 66.7% |
 * | 128 | 0.0102 | 13.0000 | 0.0062 | 21.5544 | 60.3% |
 * | 256 | 0.0166 | 31.7538 | 0.0125 | 42.1225 | 75.4% |
 * | 512 | 0.0354 | 59.4327 | 0.0211 | 99.7604 | 59.6% |
 * | 1024 | 0.0914 | 91.9664 | 0.0550 | 152.8847 | 60.2% |
 * | 1280 | 0.1311 | 100.1563 | 0.0799 | 164.3590 | 60.9% |
 * | 2048 | 0.2957 | 113.5685 | 0.1964 | 170.9864 | 66.4% |
 * | 4096 | 1.0915 | 123.0223 | 0.8005 | 167.7534 | 73.3% |
 *
 * ![dgemv-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-beta2p5.svg)
 *
 * ![dgemv-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/beta.dgemv.js) — WebGPU beta-sweep benchmark script
 * - [beta.dgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/cuda/beta.dgemv.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 32 | 0.0174 | 0.5000 |
 * | 64 | 0.0245 | 1.3768 |
 * | 128 | 0.0269 | 4.9406 |
 * | 256 | 0.0283 | 18.6787 |
 * | 512 | 0.0440 | 47.7966 |
 * | 1024 | 0.0941 | 89.2932 |
 * | 1280 | 0.1156 | 113.5298 |
 * | 2048 | 0.2626 | 127.8908 |
 * | 4096 | 0.9932 | 135.2070 |
 *
 * ![dgemv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-layoutcolumnmajor.svg)
 *
 * ![dgemv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0082 | 1.0625 |
 * | 64 | 0.0084 | 4.0460 |
 * | 128 | 0.0102 | 13.0000 |
 * | 256 | 0.0166 | 31.8457 |
 * | 512 | 0.0354 | 59.5403 |
 * | 1024 | 0.0916 | 91.7255 |
 * | 1280 | 0.1308 | 100.3768 |
 * | 2048 | 0.2949 | 113.8889 |
 * | 4096 | 1.0939 | 122.7524 |
 *
 * ![dgemv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/gbps-layoutrowmajor.svg)
 *
 * ![dgemv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dgemv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dgemv/wgblas/layout.dgemv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dgemv
 */
