/**
 * Benchmark results for dgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0171 | 0.5243 | 0.0058 | 1.5512 | 33.8% |
 * | 64 | 0.0243 | 1.4124 | 0.0059 | 5.7946 | 24.4% |
 * | 128 | 0.0424 | 3.1638 | 0.0064 | 20.8557 | 15.2% |
 * | 256 | 0.0771 | 6.8766 | 0.0133 | 39.7983 | 17.3% |
 * | 512 | 0.2248 | 9.3843 | 0.0217 | 97.0125 | 9.7% |
 * | 1024 | 0.4528 | 18.5790 | 0.0551 | 152.7670 | 12.2% |
 * | 1280 | 0.5616 | 23.3944 | 0.0800 | 164.1583 | 14.3% |
 * | 2048 | 0.9110 | 36.8881 | 0.1949 | 172.3897 | 21.4% |
 * | 4096 | 1.9003 | 70.6825 | 0.7994 | 168.0261 | 42.1% |
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
 * | 32 | 0.0217 | 0.4121 | 0.0054 | 1.6568 | 24.9% |
 * | 64 | 0.0307 | 1.1190 | 0.0057 | 5.9888 | 18.7% |
 * | 128 | 0.0536 | 2.5012 | 0.0081 | 16.5039 | 15.2% |
 * | 256 | 0.0992 | 5.3471 | 0.0135 | 39.1868 | 13.6% |
 * | 512 | 0.2720 | 7.7562 | 0.0220 | 95.9534 | 8.1% |
 * | 1024 | 0.5466 | 15.3930 | 0.0538 | 156.4953 | 9.8% |
 * | 1280 | 0.6799 | 19.3223 | 0.0803 | 163.6349 | 11.8% |
 * | 2048 | 1.0916 | 30.7842 | 0.1975 | 170.1688 | 18.1% |
 * | 4096 | 1.9107 | 70.2978 | 0.7237 | 185.5973 | 37.9% |
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
 * | 32 | 0.0171 | 0.5248 | 0.0057 | 1.5730 | 33.4% |
 * | 64 | 0.0244 | 1.4031 | 0.0057 | 6.0565 | 23.2% |
 * | 128 | 0.0426 | 3.1495 | 0.0063 | 21.4425 | 14.7% |
 * | 256 | 0.0774 | 6.8524 | 0.0133 | 39.9903 | 17.1% |
 * | 512 | 0.2253 | 9.3636 | 0.0221 | 95.3980 | 9.8% |
 * | 1024 | 0.4466 | 18.8393 | 0.0545 | 154.3364 | 12.2% |
 * | 1280 | 0.5693 | 23.0755 | 0.0800 | 164.1583 | 14.1% |
 * | 2048 | 0.9099 | 36.9303 | 0.1981 | 169.5917 | 21.8% |
 * | 4096 | 1.9054 | 70.4938 | 0.7286 | 184.3461 | 38.2% |
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
 * | 32 | 0.0176 | 0.5100 | 0.0060 | 1.4815 | 34.4% |
 * | 64 | 0.0244 | 1.4031 | 0.0060 | 5.7480 | 24.4% |
 * | 128 | 0.0427 | 3.1401 | 0.0062 | 21.5527 | 14.6% |
 * | 256 | 0.0776 | 6.8341 | 0.0130 | 40.8779 | 16.7% |
 * | 512 | 0.2257 | 9.3451 | 0.0225 | 93.8363 | 10.0% |
 * | 1024 | 0.4512 | 18.6476 | 0.0562 | 149.7221 | 12.5% |
 * | 1280 | 0.5630 | 23.3366 | 0.0843 | 155.8694 | 15.0% |
 * | 2048 | 0.9134 | 36.7892 | 0.2008 | 167.3885 | 22.0% |
 * | 4096 | 1.9211 | 69.9161 | 0.7316 | 183.6002 | 38.1% |
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
 * | 32 | 0.0171 | 0.5253 | 0.0061 | 1.4660 | 35.8% |
 * | 64 | 0.0245 | 1.4004 | 0.0060 | 5.7634 | 24.3% |
 * | 128 | 0.0427 | 3.1448 | 0.0063 | 21.2792 | 14.8% |
 * | 256 | 0.0776 | 6.8383 | 0.0143 | 37.0000 | 18.5% |
 * | 512 | 0.2266 | 9.3107 | 0.0224 | 94.3062 | 9.9% |
 * | 1024 | 0.4547 | 18.5045 | 0.0550 | 152.9447 | 12.1% |
 * | 1280 | 0.5651 | 23.2487 | 0.0816 | 160.9408 | 14.4% |
 * | 2048 | 0.9177 | 36.6154 | 0.2008 | 167.3752 | 21.9% |
 * | 4096 | 1.9188 | 70.0012 | 0.7323 | 183.4077 | 38.2% |
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
 * | 32 | 0.0174 | 0.5157 | 0.0056 | 1.5954 | 32.3% |
 * | 64 | 0.0244 | 1.4059 | 0.0056 | 6.0909 | 23.1% |
 * | 128 | 0.0425 | 3.1554 | 0.0061 | 21.8333 | 14.5% |
 * | 256 | 0.0778 | 6.8158 | 0.0124 | 42.7216 | 16.0% |
 * | 512 | 0.2261 | 9.3279 | 0.0224 | 94.3062 | 9.9% |
 * | 1024 | 0.4526 | 18.5882 | 0.0557 | 151.0989 | 12.3% |
 * | 1280 | 0.5650 | 23.2533 | 0.0820 | 160.1873 | 14.5% |
 * | 2048 | 0.9196 | 36.5434 | 0.2021 | 166.2622 | 22.0% |
 * | 4096 | 1.9358 | 69.3850 | 0.7337 | 183.0677 | 37.9% |
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
 * | 32 | 0.0172 | 0.5200 | 0.0056 | 1.6092 | 32.3% |
 * | 64 | 0.0245 | 1.3995 | 0.0056 | 6.1609 | 22.7% |
 * | 128 | 0.0427 | 3.1424 | 0.0062 | 21.4974 | 14.6% |
 * | 256 | 0.0778 | 6.8158 | 0.0124 | 42.6667 | 16.0% |
 * | 512 | 0.2260 | 9.3318 | 0.0224 | 94.3737 | 9.9% |
 * | 1024 | 0.4525 | 18.5915 | 0.0553 | 152.1481 | 12.2% |
 * | 1280 | 0.5612 | 23.4124 | 0.0817 | 160.7518 | 14.6% |
 * | 2048 | 0.9141 | 36.7628 | 0.2007 | 167.4286 | 22.0% |
 * | 4096 | 1.9377 | 69.3168 | 0.7353 | 182.6614 | 37.9% |
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
 * | 32 | 0.0082 | 1.0938 | 0.0056 | 1.6000 | 68.4% |
 * | 64 | 0.0082 | 2.1250 | 0.0056 | 3.1264 | 68.0% |
 * | 128 | 0.0084 | 4.0606 | 0.0060 | 5.7173 | 71.0% |
 * | 256 | 0.0091 | 7.4667 | 0.0062 | 10.9691 | 68.1% |
 * | 512 | 0.0107 | 12.7327 | 0.0105 | 12.8875 | 98.8% |
 * | 1024 | 0.0143 | 18.8929 | 0.0105 | 25.8838 | 73.0% |
 * | 1280 | 0.0150 | 22.5501 | 0.0115 | 29.5419 | 76.3% |
 * | 2048 | 0.0195 | 27.7701 | 0.0116 | 46.8476 | 59.3% |
 * | 4096 | 0.0411 | 26.3405 | 0.0143 | 75.4643 | 34.9% |
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
 * | 32 | 0.0083 | 2.1313 | 0.0058 | 3.0330 | 70.3% |
 * | 64 | 0.0083 | 4.1550 | 0.0067 | 5.1292 | 81.0% |
 * | 128 | 0.0086 | 7.8806 | 0.0059 | 11.5095 | 68.5% |
 * | 256 | 0.0098 | 13.6993 | 0.0061 | 21.8333 | 62.7% |
 * | 512 | 0.0110 | 24.3499 | 0.0074 | 36.2343 | 67.2% |
 * | 1024 | 0.0143 | 37.2143 | 0.0088 | 60.6255 | 61.4% |
 * | 1280 | 0.0156 | 42.8201 | 0.0108 | 61.6331 | 69.5% |
 * | 2048 | 0.0259 | 41.1259 | 0.0164 | 65.0625 | 63.2% |
 * | 4096 | 0.0430 | 49.5661 | 0.0298 | 71.5274 | 69.3% |
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
 * | 32 | 0.0098 | 3.5934 | 0.0060 | 5.8610 | 61.3% |
 * | 64 | 0.0098 | 6.9316 | 0.0060 | 11.3493 | 61.1% |
 * | 128 | 0.0102 | 13.1000 | 0.0063 | 21.1717 | 61.9% |
 * | 256 | 0.0114 | 23.3708 | 0.0073 | 36.3319 | 64.3% |
 * | 512 | 0.0143 | 37.0828 | 0.0092 | 57.4558 | 64.5% |
 * | 1024 | 0.0199 | 53.1961 | 0.0122 | 87.0737 | 61.1% |
 * | 1280 | 0.0232 | 57.1444 | 0.0148 | 89.5861 | 63.8% |
 * | 2048 | 0.0369 | 57.3391 | 0.0207 | 102.1035 | 56.2% |
 * | 4096 | 0.0616 | 68.6367 | 0.0365 | 115.7268 | 59.3% |
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
 * | 32 | 0.0167 | 4.1879 | 0.0107 | 6.5487 | 64.0% |
 * | 64 | 0.0170 | 8.0000 | 0.0106 | 12.7711 | 62.6% |
 * | 128 | 0.0184 | 14.5000 | 0.0118 | 22.6035 | 64.1% |
 * | 256 | 0.0210 | 25.2106 | 0.0127 | 41.7531 | 60.4% |
 * | 512 | 0.0288 | 36.7546 | 0.0161 | 65.7194 | 55.9% |
 * | 1024 | 0.0428 | 49.3044 | 0.0225 | 93.6364 | 52.7% |
 * | 1280 | 0.0483 | 54.6207 | 0.0257 | 102.4478 | 53.3% |
 * | 2048 | 0.0673 | 62.6454 | 0.0345 | 122.2385 | 51.2% |
 * | 4096 | 0.1181 | 71.3153 | 0.0608 | 138.4675 | 51.5% |
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
 * | 32 | 0.0249 | 5.6005 | 0.0103 | 13.4985 | 41.5% |
 * | 64 | 0.0250 | 10.8235 | 0.0107 | 25.2280 | 42.9% |
 * | 128 | 0.0274 | 19.4653 | 0.0119 | 44.9380 | 43.3% |
 * | 256 | 0.0343 | 30.8801 | 0.0144 | 73.5289 | 42.0% |
 * | 512 | 0.0441 | 47.8722 | 0.0220 | 95.8140 | 50.0% |
 * | 1024 | 0.0652 | 64.5336 | 0.0328 | 128.5000 | 50.2% |
 * | 1280 | 0.0758 | 69.4324 | 0.0387 | 135.9934 | 51.1% |
 * | 2048 | 0.1080 | 77.9229 | 0.0553 | 152.1481 | 51.2% |
 * | 4096 | 0.1918 | 87.6970 | 0.1271 | 132.3016 | 66.3% |
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
 * | 32 | 0.0424 | 6.5751 | 0.0104 | 26.8062 | 24.5% |
 * | 64 | 0.0422 | 12.8316 | 0.0117 | 46.2709 | 27.7% |
 * | 128 | 0.0471 | 22.6151 | 0.0140 | 75.8816 | 29.8% |
 * | 256 | 0.0573 | 36.9135 | 0.0218 | 97.1521 | 38.0% |
 * | 512 | 0.0995 | 42.3443 | 0.0326 | 129.3831 | 32.7% |
 * | 1024 | 0.1507 | 55.8140 | 0.0553 | 152.1481 | 36.7% |
 * | 1280 | 0.1813 | 57.9693 | 0.0657 | 159.9377 | 36.2% |
 * | 2048 | 0.2749 | 61.1468 | 0.0997 | 168.5313 | 36.3% |
 * | 4096 | 0.5098 | 65.9142 | 0.1867 | 180.0141 | 36.6% |
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
 * | 32 | 0.0739 | 4.7134 | 0.0102 | 34.0250 | 13.9% |
 * | 64 | 0.0739 | 9.1498 | 0.0119 | 56.6649 | 16.1% |
 * | 128 | 0.0862 | 15.4479 | 0.0172 | 77.4549 | 19.9% |
 * | 256 | 0.1041 | 25.4071 | 0.0244 | 108.2883 | 23.5% |
 * | 512 | 0.1473 | 35.7533 | 0.0380 | 138.7341 | 25.8% |
 * | 1024 | 0.2232 | 47.1009 | 0.0655 | 160.4375 | 29.4% |
 * | 1280 | 0.2684 | 48.9432 | 0.0799 | 164.4872 | 29.8% |
 * | 2048 | 0.4063 | 51.7081 | 0.1207 | 174.0026 | 29.7% |
 * | 4096 | 0.7568 | 55.4908 | 0.2335 | 179.8772 | 30.8% |
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
 * | 32 | 0.1248 | 4.4668 | 0.0071 | 78.4504 | 5.7% |
 * | 64 | 0.1240 | 8.7269 | 0.0102 | 105.6500 | 8.3% |
 * | 128 | 0.1396 | 15.2664 | 0.0176 | 120.9664 | 12.6% |
 * | 256 | 0.1713 | 24.6913 | 0.0292 | 144.6743 | 17.1% |
 * | 512 | 0.2351 | 35.8372 | 0.0518 | 162.6790 | 22.0% |
 * | 1024 | 0.3625 | 46.3996 | 0.1060 | 158.6860 | 29.2% |
 * | 1280 | 0.4258 | 49.3521 | 0.1286 | 163.3795 | 30.2% |
 * | 2048 | 0.6169 | 54.4735 | 0.1952 | 172.1918 | 31.6% |
 * | 4096 | 1.1282 | 59.5408 | 0.3746 | 179.3421 | 33.2% |
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
 * | 32 | 0.1611 | 6.9171 | 0.0120 | 92.8640 | 7.4% |
 * | 64 | 0.1589 | 13.6139 | 0.0198 | 109.4737 | 12.4% |
 * | 128 | 0.1802 | 23.6420 | 0.0334 | 127.7237 | 18.5% |
 * | 256 | 0.2222 | 38.0635 | 0.0616 | 137.3115 | 27.7% |
 * | 512 | 0.3071 | 54.8629 | 0.1033 | 163.1182 | 33.6% |
 * | 1024 | 0.4756 | 70.6997 | 0.2467 | 136.2921 | 51.9% |
 * | 1280 | 0.5609 | 74.9159 | 0.2866 | 146.6073 | 51.1% |
 * | 2048 | 0.8152 | 82.4192 | 0.4223 | 159.1173 | 51.8% |
 * | 4096 | 1.4975 | 89.6952 | 0.8016 | 167.5599 | 53.5% |
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
 * | 32 | 0.0172 | 0.5214 | 0.0061 | 1.4660 | 35.6% |
 * | 64 | 0.0170 | 1.0376 | 0.0062 | 2.8527 | 36.4% |
 * | 128 | 0.0172 | 2.0334 | 0.0066 | 5.3204 | 38.2% |
 * | 256 | 0.0174 | 4.0258 | 0.0078 | 8.9143 | 45.2% |
 * | 512 | 0.0171 | 8.1419 | 0.0096 | 14.6064 | 55.7% |
 * | 1024 | 0.0177 | 15.7826 | 0.0154 | 18.1311 | 87.0% |
 * | 1280 | 0.0175 | 19.8686 | 0.0160 | 21.7542 | 91.3% |
 * | 2048 | 0.0180 | 30.9893 | 0.0217 | 25.7063 | 120.6% |
 * | 4096 | 0.0246 | 45.3438 | 0.0377 | 29.5620 | 153.4% |
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
 * | 32 | 0.0243 | 0.7163 | 0.0061 | 2.8333 | 25.3% |
 * | 64 | 0.0244 | 1.4087 | 0.0062 | 5.5544 | 25.4% |
 * | 128 | 0.0243 | 2.7982 | 0.0068 | 9.9672 | 28.1% |
 * | 256 | 0.0245 | 5.5352 | 0.0088 | 15.4463 | 35.8% |
 * | 512 | 0.0245 | 11.0568 | 0.0102 | 26.4500 | 41.8% |
 * | 1024 | 0.0251 | 21.5990 | 0.0145 | 37.4159 | 57.7% |
 * | 1280 | 0.0249 | 27.2021 | 0.0165 | 40.8820 | 66.5% |
 * | 2048 | 0.0359 | 30.1185 | 0.0231 | 46.8904 | 64.2% |
 * | 4096 | 0.0385 | 56.1462 | 0.0430 | 50.2976 | 111.6% |
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
 * | 32 | 0.0418 | 0.8208 | 0.0071 | 4.8180 | 17.0% |
 * | 64 | 0.0422 | 1.6006 | 0.0066 | 10.2524 | 15.6% |
 * | 128 | 0.0424 | 3.1626 | 0.0079 | 16.9717 | 18.6% |
 * | 256 | 0.0423 | 6.3201 | 0.0100 | 26.5987 | 23.8% |
 * | 512 | 0.0424 | 12.5826 | 0.0121 | 44.0476 | 28.6% |
 * | 1024 | 0.0571 | 18.6674 | 0.0198 | 53.9029 | 34.6% |
 * | 1280 | 0.0646 | 20.6354 | 0.0228 | 58.5130 | 35.3% |
 * | 2048 | 0.0655 | 32.5156 | 0.0327 | 65.1904 | 49.9% |
 * | 4096 | 0.0676 | 63.0305 | 0.0553 | 77.0556 | 81.8% |
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
 * | 32 | 0.0762 | 0.8934 | 0.0120 | 5.6596 | 15.8% |
 * | 64 | 0.0759 | 1.7673 | 0.0068 | 19.7736 | 8.9% |
 * | 128 | 0.0796 | 3.3454 | 0.0090 | 29.4513 | 11.4% |
 * | 256 | 0.1182 | 4.4879 | 0.0109 | 48.8247 | 9.2% |
 * | 512 | 0.1452 | 7.2929 | 0.0152 | 69.4397 | 10.5% |
 * | 1024 | 0.1678 | 12.6072 | 0.0246 | 85.9714 | 14.7% |
 * | 1280 | 0.1663 | 15.8953 | 0.0297 | 88.9386 | 17.9% |
 * | 2048 | 0.1764 | 23.9724 | 0.0390 | 108.3279 | 22.1% |
 * | 4096 | 0.1843 | 45.8818 | 0.0683 | 123.8603 | 37.0% |
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
 * | 32 | 0.2483 | 0.5464 | 0.0122 | 11.1286 | 4.9% |
 * | 64 | 0.2476 | 1.0793 | 0.0081 | 33.0772 | 3.3% |
 * | 128 | 0.2560 | 2.0720 | 0.0100 | 52.9585 | 3.9% |
 * | 256 | 0.3109 | 3.3995 | 0.0129 | 82.0472 | 4.1% |
 * | 512 | 0.3610 | 5.8435 | 0.0222 | 95.1913 | 6.1% |
 * | 1024 | 0.3727 | 11.3087 | 0.0331 | 127.2580 | 8.9% |
 * | 1280 | 0.3768 | 13.9783 | 0.0392 | 134.3739 | 10.4% |
 * | 2048 | 0.3973 | 21.2079 | 0.0571 | 147.4635 | 14.4% |
 * | 4096 | 0.4096 | 41.1268 | 0.1024 | 164.5200 | 25.0% |
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
 * | 32 | 0.5820 | 0.4653 | 0.0131 | 20.7451 | 2.2% |
 * | 64 | 0.4905 | 1.0876 | 0.0104 | 51.1411 | 2.1% |
 * | 128 | 0.5987 | 1.7685 | 0.0144 | 73.6107 | 2.4% |
 * | 256 | 0.6025 | 3.5014 | 0.0224 | 94.1714 | 3.7% |
 * | 512 | 0.5707 | 7.3776 | 0.0340 | 123.7855 | 6.0% |
 * | 1024 | 0.5775 | 14.5674 | 0.0595 | 141.3126 | 10.3% |
 * | 1280 | 0.5161 | 20.3730 | 0.0677 | 155.3551 | 13.1% |
 * | 2048 | 0.5108 | 32.9272 | 0.1024 | 164.2400 | 20.0% |
 * | 4096 | 0.5325 | 63.1538 | 0.1924 | 174.7825 | 36.1% |
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
 * | 32 | 0.4095 | 0.8264 | 0.0129 | 26.2758 | 3.1% |
 * | 64 | 0.3619 | 1.8422 | 0.0121 | 55.2573 | 3.3% |
 * | 128 | 0.5538 | 2.3891 | 0.0181 | 72.9171 | 3.3% |
 * | 256 | 0.5496 | 4.7955 | 0.0245 | 107.5300 | 4.5% |
 * | 512 | 0.5489 | 9.5858 | 0.0407 | 129.4105 | 7.4% |
 * | 1024 | 0.5530 | 19.0111 | 0.0737 | 142.6452 | 13.3% |
 * | 1280 | 0.5652 | 23.2447 | 0.0856 | 153.5665 | 15.1% |
 * | 2048 | 0.5737 | 36.6321 | 0.1298 | 161.8494 | 22.6% |
 * | 4096 | 0.5996 | 70.0818 | 0.2423 | 173.4251 | 40.4% |
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
 * | 32 | 0.5655 | 0.9570 | 0.0138 | 39.1029 | 2.4% |
 * | 64 | 0.7970 | 1.3375 | 0.0164 | 65.0625 | 2.1% |
 * | 128 | 0.8762 | 2.4145 | 0.0225 | 94.1766 | 2.6% |
 * | 256 | 0.8745 | 4.8195 | 0.0334 | 126.3425 | 3.8% |
 * | 512 | 0.8730 | 9.6375 | 0.0572 | 147.1660 | 6.5% |
 * | 1024 | 0.8970 | 18.7397 | 0.1035 | 162.4844 | 11.5% |
 * | 1280 | 0.9145 | 22.9722 | 0.1255 | 167.3922 | 13.7% |
 * | 2048 | 0.9088 | 36.9771 | 0.1939 | 173.3001 | 21.3% |
 * | 4096 | 0.9570 | 70.2127 | 0.3746 | 179.3629 | 39.1% |
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
 * | 32 | 1.6980 | 0.6371 | 0.0166 | 65.0154 | 1.0% |
 * | 64 | 1.7388 | 1.2256 | 0.0287 | 74.3214 | 1.6% |
 * | 128 | 1.7455 | 2.4228 | 0.0386 | 109.4493 | 2.2% |
 * | 256 | 1.7452 | 4.8279 | 0.0570 | 147.8360 | 3.3% |
 * | 512 | 1.7347 | 9.6954 | 0.1085 | 154.9891 | 6.3% |
 * | 1024 | 1.7572 | 19.1235 | 0.1966 | 170.8888 | 11.2% |
 * | 1280 | 1.7818 | 23.5701 | 0.2407 | 174.4727 | 13.5% |
 * | 2048 | 1.8183 | 36.9428 | 0.3871 | 173.5450 | 21.3% |
 * | 4096 | 1.9114 | 70.2696 | 0.7645 | 175.6959 | 40.0% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0061 | 1.4167 | 75.0% |
 * | 64 | 0.0083 | 4.0537 | 0.0061 | 5.5000 | 73.7% |
 * | 128 | 0.0102 | 13.0203 | 0.0071 | 18.8235 | 69.2% |
 * | 256 | 0.0165 | 32.0621 | 0.0144 | 36.7341 | 87.3% |
 * | 512 | 0.0352 | 59.7295 | 0.0224 | 93.9886 | 63.5% |
 * | 1024 | 0.0907 | 92.6967 | 0.0564 | 148.9824 | 62.2% |
 * | 1280 | 0.1301 | 100.9076 | 0.0801 | 163.8011 | 61.6% |
 * | 2048 | 0.2932 | 114.5539 | 0.2023 | 166.0497 | 69.0% |
 * | 4096 | 1.0564 | 127.1179 | 0.8489 | 158.1857 | 80.4% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0061 | 1.4167 | 75.0% |
 * | 64 | 0.0083 | 4.0772 | 0.0076 | 4.4557 | 91.5% |
 * | 128 | 0.0102 | 13.0000 | 0.0075 | 17.6645 | 73.6% |
 * | 256 | 0.0165 | 32.0000 | 0.0168 | 31.5115 | 101.6% |
 * | 512 | 0.0354 | 59.4059 | 0.0249 | 84.4570 | 70.3% |
 * | 1024 | 0.0917 | 91.6935 | 0.0566 | 148.5191 | 61.7% |
 * | 1280 | 0.1312 | 100.0463 | 0.0814 | 161.3213 | 62.0% |
 * | 2048 | 0.2978 | 112.7753 | 0.1987 | 169.0177 | 66.7% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0058 | 1.5111 | 70.3% |
 * | 64 | 0.0083 | 4.0772 | 0.0057 | 5.8994 | 69.1% |
 * | 128 | 0.0102 | 13.0000 | 0.0062 | 21.5544 | 60.3% |
 * | 256 | 0.0166 | 31.9072 | 0.0143 | 36.9396 | 86.4% |
 * | 512 | 0.0351 | 59.9745 | 0.0240 | 87.8398 | 68.3% |
 * | 1024 | 0.0914 | 91.9181 | 0.0553 | 152.0000 | 60.5% |
 * | 1280 | 0.1313 | 99.9976 | 0.0798 | 164.4578 | 60.8% |
 * | 2048 | 0.2967 | 113.1888 | 0.1981 | 169.5227 | 66.8% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0057 | 1.5196 | 69.9% |
 * | 64 | 0.0083 | 4.0772 | 0.0056 | 6.0690 | 67.2% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0165 | 32.0000 | 0.0134 | 39.4081 | 81.2% |
 * | 512 | 0.0352 | 59.7295 | 0.0217 | 96.8241 | 61.7% |
 * | 1024 | 0.0915 | 91.8538 | 0.0553 | 152.0000 | 60.4% |
 * | 1280 | 0.1661 | 79.0139 | 0.0799 | 164.2274 | 48.1% |
 * | 2048 | 0.3755 | 89.4533 | 0.1975 | 170.0997 | 52.6% |
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
 * | 32 | 0.0102 | 0.8500 | 0.0057 | 1.5238 | 55.8% |
 * | 64 | 0.0103 | 3.2897 | 0.0054 | 6.2118 | 53.0% |
 * | 128 | 0.0129 | 10.3098 | 0.0063 | 21.0101 | 49.1% |
 * | 256 | 0.0210 | 25.1707 | 0.0131 | 40.2732 | 62.5% |
 * | 512 | 0.0441 | 47.7099 | 0.0217 | 97.0384 | 49.2% |
 * | 1024 | 0.1161 | 72.3869 | 0.0551 | 152.5296 | 47.5% |
 * | 1280 | 0.2109 | 62.2330 | 0.0825 | 159.1929 | 39.1% |
 * | 2048 | 0.4870 | 68.9664 | 0.2008 | 167.2403 | 41.2% |
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
 * | 32 | 0.0138 | 0.6326 | 0.0060 | 1.4545 | 43.5% |
 * | 64 | 0.0144 | 2.3519 | 0.0058 | 5.8182 | 40.4% |
 * | 128 | 0.0180 | 7.3824 | 0.0063 | 21.2788 | 34.7% |
 * | 256 | 0.0295 | 17.9283 | 0.0137 | 38.6698 | 46.4% |
 * | 512 | 0.0617 | 34.1333 | 0.0242 | 87.0265 | 39.2% |
 * | 1024 | 0.1692 | 49.6608 | 0.0548 | 153.2415 | 32.4% |
 * | 1280 | 0.2433 | 53.9470 | 0.0799 | 164.3590 | 32.8% |
 * | 2048 | 0.5590 | 60.0870 | 0.1997 | 168.1782 | 35.7% |
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
 * | 32 | 0.0158 | 0.5506 | 0.0060 | 1.4624 | 37.7% |
 * | 64 | 0.0163 | 2.0747 | 0.0057 | 5.8994 | 35.2% |
 * | 128 | 0.0197 | 6.7587 | 0.0061 | 21.6667 | 31.2% |
 * | 256 | 0.0330 | 16.0311 | 0.0132 | 40.0777 | 40.0% |
 * | 512 | 0.0696 | 30.2422 | 0.0219 | 96.1871 | 31.4% |
 * | 1024 | 0.1886 | 44.5708 | 0.0550 | 152.7070 | 29.2% |
 * | 1280 | 0.2826 | 46.4598 | 0.0800 | 164.0960 | 28.3% |
 * | 2048 | 0.6628 | 50.6735 | 0.1984 | 169.2630 | 29.9% |
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
 * | 32 | 0.0165 | 0.5266 | 0.0056 | 1.5677 | 33.6% |
 * | 64 | 0.0178 | 1.8959 | 0.0055 | 6.1574 | 30.8% |
 * | 128 | 0.0217 | 6.1402 | 0.0061 | 21.6667 | 28.3% |
 * | 256 | 0.0369 | 14.3333 | 0.0128 | 41.4354 | 34.6% |
 * | 512 | 0.0778 | 27.0526 | 0.0211 | 99.6094 | 27.2% |
 * | 1024 | 0.2150 | 39.0857 | 0.0552 | 152.2643 | 25.7% |
 * | 1280 | 0.3047 | 43.0879 | 0.0800 | 164.0960 | 26.3% |
 * | 2048 | 0.7290 | 46.0704 | 0.1998 | 168.1108 | 27.4% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0059 | 1.4863 | 71.5% |
 * | 64 | 0.0083 | 4.0694 | 0.0057 | 5.9661 | 68.2% |
 * | 128 | 0.0102 | 13.0000 | 0.0061 | 21.6667 | 60.0% |
 * | 256 | 0.0165 | 31.9690 | 0.0128 | 41.1771 | 77.6% |
 * | 512 | 0.0351 | 59.9745 | 0.0217 | 96.8241 | 61.9% |
 * | 1024 | 0.0905 | 92.8769 | 0.0551 | 152.4411 | 60.9% |
 * | 1280 | 0.1299 | 101.0568 | 0.0799 | 164.3590 | 61.5% |
 * | 2048 | 0.2929 | 114.6853 | 0.1946 | 172.6032 | 66.4% |
 * | 4096 | 1.0660 | 125.9750 | 0.8004 | 167.7601 | 75.1% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0022 | 3.8857 | 27.3% |
 * | 64 | 0.0083 | 4.0615 | 0.0023 | 14.8732 | 27.3% |
 * | 128 | 0.0101 | 13.1230 | 0.0023 | 58.5915 | 22.4% |
 * | 256 | 0.0165 | 32.0000 | 0.0023 | 226.1918 | 14.1% |
 * | 512 | 0.0351 | 60.0292 | 0.0031 | 685.3334 | 8.8% |
 * | 1024 | 0.0906 | 92.7621 | 0.0035 | 2431.9998 | 3.8% |
 * | 1280 | 0.1300 | 100.9449 | 0.0033 | 3925.7417 | 2.6% |
 * | 2048 | 0.2930 | 114.6352 | 0.0034 | 9948.8145 | 1.2% |
 * | 4096 | 1.3392 | 100.2737 | 0.0034 | 39965.2578 | 0.3% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0058 | 1.4904 | 71.3% |
 * | 64 | 0.0083 | 4.0615 | 0.0057 | 5.8994 | 68.8% |
 * | 128 | 0.0102 | 13.0000 | 0.0063 | 21.0633 | 61.7% |
 * | 256 | 0.0165 | 32.0000 | 0.0132 | 40.0291 | 79.9% |
 * | 512 | 0.0352 | 59.8926 | 0.0216 | 97.2535 | 61.6% |
 * | 1024 | 0.0904 | 92.9591 | 0.0551 | 152.4411 | 61.0% |
 * | 1280 | 0.1297 | 101.2313 | 0.0797 | 164.6228 | 61.5% |
 * | 2048 | 0.2929 | 114.6540 | 0.1948 | 172.4047 | 66.5% |
 * | 4096 | 1.0678 | 125.7541 | 0.7991 | 168.0457 | 74.8% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0062 | 1.4130 | 75.2% |
 * | 64 | 0.0083 | 4.0615 | 0.0061 | 5.5000 | 73.8% |
 * | 128 | 0.0102 | 13.0000 | 0.0075 | 17.7778 | 73.1% |
 * | 256 | 0.0165 | 32.0621 | 0.0147 | 36.0524 | 88.9% |
 * | 512 | 0.0352 | 59.8653 | 0.0224 | 93.8545 | 63.8% |
 * | 1024 | 0.0905 | 92.8605 | 0.0561 | 149.7469 | 62.0% |
 * | 1280 | 0.1298 | 101.1191 | 0.0805 | 163.0849 | 62.0% |
 * | 2048 | 0.2929 | 114.6853 | 0.2028 | 165.6566 | 69.2% |
 * | 4096 | 1.0670 | 125.8503 | 0.8494 | 158.0964 | 79.6% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0063 | 1.3807 | 77.0% |
 * | 64 | 0.0083 | 4.0772 | 0.0061 | 5.5000 | 74.1% |
 * | 128 | 0.0102 | 13.0818 | 0.0075 | 17.7778 | 73.6% |
 * | 256 | 0.0165 | 32.0933 | 0.0149 | 35.4335 | 90.6% |
 * | 512 | 0.0353 | 59.6753 | 0.0225 | 93.4546 | 63.9% |
 * | 1024 | 0.0906 | 92.7458 | 0.0561 | 149.7469 | 61.9% |
 * | 1280 | 0.1298 | 101.1315 | 0.0809 | 162.1823 | 62.4% |
 * | 2048 | 0.2929 | 114.6853 | 0.1986 | 169.1130 | 67.8% |
 * | 4096 | 1.0568 | 127.0698 | 0.7989 | 168.0928 | 75.6% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0061 | 1.4204 | 74.8% |
 * | 64 | 0.0083 | 4.0772 | 0.0059 | 5.7081 | 71.4% |
 * | 128 | 0.0102 | 13.0000 | 0.0066 | 20.2927 | 64.1% |
 * | 256 | 0.0164 | 32.1245 | 0.0135 | 39.1280 | 82.1% |
 * | 512 | 0.0351 | 60.0566 | 0.0246 | 85.6667 | 70.1% |
 * | 1024 | 0.0906 | 92.7294 | 0.0553 | 152.0000 | 61.0% |
 * | 1280 | 0.1299 | 101.0692 | 0.0805 | 163.1497 | 61.9% |
 * | 2048 | 0.2929 | 114.6853 | 0.1964 | 171.0560 | 67.0% |
 * | 4096 | 1.0656 | 126.0223 | 0.8004 | 167.7702 | 75.1% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0058 | 1.5028 | 70.7% |
 * | 64 | 0.0083 | 4.0772 | 0.0058 | 5.8022 | 70.3% |
 * | 128 | 0.0101 | 13.2063 | 0.0070 | 18.9091 | 69.8% |
 * | 256 | 0.0166 | 31.8764 | 0.0131 | 40.3716 | 79.0% |
 * | 512 | 0.0351 | 59.9199 | 0.0209 | 100.5994 | 59.6% |
 * | 1024 | 0.0904 | 92.9427 | 0.0550 | 152.8847 | 60.8% |
 * | 1280 | 0.1302 | 100.8456 | 0.0796 | 164.8875 | 61.2% |
 * | 2048 | 0.2930 | 114.6227 | 0.1946 | 172.6032 | 66.4% |
 * | 4096 | 1.0575 | 126.9871 | 0.7989 | 168.0793 | 75.6% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0058 | 1.5111 | 70.3% |
 * | 64 | 0.0083 | 4.0772 | 0.0057 | 5.9160 | 68.9% |
 * | 128 | 0.0102 | 13.0000 | 0.0063 | 21.2245 | 61.2% |
 * | 256 | 0.0165 | 31.9381 | 0.0127 | 41.5396 | 76.9% |
 * | 512 | 0.0352 | 59.8653 | 0.0212 | 99.5340 | 60.1% |
 * | 1024 | 0.0909 | 92.4194 | 0.0552 | 152.2202 | 60.7% |
 * | 1280 | 0.1302 | 100.7961 | 0.0800 | 164.0304 | 61.4% |
 * | 2048 | 0.2929 | 114.6853 | 0.1964 | 170.9725 | 67.1% |
 * | 4096 | 1.0578 | 126.9448 | 0.8005 | 167.7568 | 75.7% |
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
 * | 32 | 0.0082 | 1.0625 | 0.0066 | 1.3204 | 80.5% |
 * | 64 | 0.0084 | 4.0382 | 0.0059 | 5.7391 | 70.4% |
 * | 128 | 0.0102 | 13.0203 | 0.0065 | 20.4423 | 63.7% |
 * | 256 | 0.0165 | 32.0000 | 0.0137 | 38.5794 | 82.9% |
 * | 512 | 0.0351 | 60.0566 | 0.0220 | 95.9067 | 62.6% |
 * | 1024 | 0.0906 | 92.7621 | 0.0553 | 152.0000 | 61.0% |
 * | 1280 | 0.1300 | 100.9449 | 0.0799 | 164.2603 | 61.5% |
 * | 2048 | 0.2929 | 114.6853 | 0.1965 | 170.8889 | 67.1% |
 * | 4096 | 1.0568 | 127.0698 | 0.8010 | 167.6462 | 75.8% |
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
 * | 32 | 0.0170 | 0.5118 |
 * | 64 | 0.0244 | 1.3840 |
 * | 128 | 0.0426 | 3.1278 |
 * | 256 | 0.0771 | 6.8500 |
 * | 512 | 0.2248 | 9.3667 |
 * | 1024 | 0.4503 | 18.6652 |
 * | 1280 | 0.5650 | 23.2352 |
 * | 2048 | 0.9114 | 36.8539 |
 * | 4096 | 1.9006 | 70.6516 |
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
 * | 64 | 0.0083 | 4.0615 |
 * | 128 | 0.0101 | 13.1230 |
 * | 256 | 0.0165 | 32.0621 |
 * | 512 | 0.0352 | 59.8653 |
 * | 1024 | 0.0906 | 92.7458 |
 * | 1280 | 0.1302 | 100.7961 |
 * | 2048 | 0.2937 | 114.3729 |
 * | 4096 | 1.0568 | 127.0698 |
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
