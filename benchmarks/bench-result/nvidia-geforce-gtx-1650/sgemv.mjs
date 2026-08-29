/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0136 | 0.3294 | 0.0053 | 0.8383 | 39.3% |
 * | 64 | 0.0107 | 1.6000 | 0.0055 | 3.1345 | 51.0% |
 * | 128 | 0.0148 | 4.5368 | 0.0058 | 11.4849 | 39.5% |
 * | 256 | 0.0215 | 12.3333 | 0.0104 | 25.5802 | 48.2% |
 * | 512 | 0.0502 | 21.0271 | 0.0142 | 74.0674 | 28.4% |
 * | 1024 | 0.1085 | 38.7547 | 0.0328 | 128.3750 | 30.2% |
 * | 1280 | 0.1372 | 47.8731 | 0.0451 | 145.7955 | 32.8% |
 * | 2048 | 0.2148 | 78.2090 | 0.0992 | 169.4276 | 46.2% |
 * | 4096 | 0.4705 | 142.7339 | 0.3785 | 177.4489 | 80.4% |
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
 * | 32 | 0.0136 | 0.3302 | 0.0051 | 0.8833 | 37.4% |
 * | 64 | 0.0107 | 1.6048 | 0.0051 | 3.3605 | 47.8% |
 * | 128 | 0.0150 | 4.4834 | 0.0055 | 12.2216 | 36.7% |
 * | 256 | 0.0219 | 12.1081 | 0.0103 | 25.6992 | 47.1% |
 * | 512 | 0.0505 | 20.9004 | 0.0115 | 91.5556 | 22.8% |
 * | 1024 | 0.1106 | 38.0370 | 0.0327 | 128.8153 | 29.5% |
 * | 1280 | 0.1363 | 48.2048 | 0.0451 | 145.7955 | 33.1% |
 * | 2048 | 0.2187 | 76.8243 | 0.0999 | 168.1255 | 45.7% |
 * | 4096 | 0.4732 | 141.9231 | 0.3725 | 180.2687 | 78.7% |
 *
 * ![sgemv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride4.svg)
 *
 * ![sgemv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0137 | 0.3275 | 0.0051 | 0.8777 | 37.3% |
 * | 64 | 0.0108 | 1.5811 | 0.0052 | 3.3189 | 47.6% |
 * | 128 | 0.0149 | 4.4979 | 0.0058 | 11.6444 | 38.6% |
 * | 256 | 0.0223 | 11.9166 | 0.0106 | 25.1152 | 47.4% |
 * | 512 | 0.0576 | 18.3111 | 0.0148 | 71.3420 | 25.7% |
 * | 1024 | 0.1096 | 38.3813 | 0.0334 | 125.7952 | 30.5% |
 * | 1280 | 0.1364 | 48.1539 | 0.0468 | 140.5065 | 34.3% |
 * | 2048 | 0.2148 | 78.2265 | 0.1020 | 164.7234 | 47.5% |
 * | 4096 | 0.4778 | 140.5450 | 0.3826 | 175.5490 | 80.1% |
 *
 * ![sgemv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/gbps-stride32.svg)
 *
 * ![sgemv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0137 | 0.3260 | 0.0054 | 0.8284 | 39.3% |
 * | 64 | 0.0113 | 1.5184 | 0.0053 | 3.2096 | 47.3% |
 * | 128 | 0.0155 | 4.3216 | 0.0060 | 11.2688 | 38.4% |
 * | 256 | 0.0221 | 11.9942 | 0.0104 | 25.5015 | 47.0% |
 * | 512 | 0.0584 | 18.0652 | 0.0156 | 67.7492 | 26.7% |
 * | 1024 | 0.1105 | 38.0811 | 0.0344 | 122.3985 | 31.1% |
 * | 1280 | 0.1374 | 47.8062 | 0.0471 | 139.4565 | 34.3% |
 * | 2048 | 0.2166 | 77.5849 | 0.1027 | 163.6708 | 47.4% |
 * | 4096 | 0.4799 | 139.9452 | 0.3861 | 173.9556 | 80.4% |
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
 * | 32 | 0.0082 | 0.5469 | 0.0055 | 0.8092 | 67.6% |
 * | 64 | 0.0082 | 1.0625 | 0.0054 | 1.6000 | 66.4% |
 * | 128 | 0.0084 | 2.0458 | 0.0056 | 3.0455 | 67.2% |
 * | 256 | 0.0084 | 4.0611 | 0.0080 | 4.2390 | 95.8% |
 * | 512 | 0.0089 | 7.6534 | 0.0084 | 8.0303 | 95.3% |
 * | 1024 | 0.0095 | 14.2973 | 0.0085 | 15.9397 | 89.7% |
 * | 1280 | 0.0100 | 16.8408 | 0.0087 | 19.4412 | 86.6% |
 * | 2048 | 0.0103 | 26.2202 | 0.0101 | 26.7595 | 98.0% |
 * | 4096 | 0.0123 | 44.0208 | 0.0105 | 51.6153 | 85.3% |
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
 * | 32 | 0.0082 | 1.0781 | 0.0053 | 1.6727 | 64.5% |
 * | 64 | 0.0083 | 2.0695 | 0.0052 | 3.3189 | 62.4% |
 * | 128 | 0.0084 | 4.0152 | 0.0059 | 5.7705 | 69.6% |
 * | 256 | 0.0085 | 7.8797 | 0.0082 | 8.1875 | 96.2% |
 * | 512 | 0.0092 | 14.5000 | 0.0087 | 15.3529 | 94.4% |
 * | 1024 | 0.0101 | 26.4216 | 0.0093 | 28.5969 | 92.4% |
 * | 1280 | 0.0102 | 32.5500 | 0.0098 | 34.1508 | 95.3% |
 * | 2048 | 0.0110 | 48.2783 | 0.0112 | 47.5886 | 101.4% |
 * | 4096 | 0.0164 | 65.0313 | 0.0139 | 76.7189 | 84.8% |
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
 * | 32 | 0.0086 | 2.0410 | 0.0053 | 3.2913 | 62.0% |
 * | 64 | 0.0087 | 3.9262 | 0.0056 | 6.0455 | 64.9% |
 * | 128 | 0.0092 | 7.3159 | 0.0059 | 11.4536 | 63.9% |
 * | 256 | 0.0092 | 14.4194 | 0.0097 | 13.7068 | 105.2% |
 * | 512 | 0.0101 | 26.3111 | 0.0107 | 24.7773 | 106.2% |
 * | 1024 | 0.0107 | 49.3851 | 0.0119 | 44.3539 | 111.3% |
 * | 1280 | 0.0116 | 57.1840 | 0.0123 | 53.9739 | 105.9% |
 * | 2048 | 0.0148 | 71.6273 | 0.0162 | 65.1992 | 109.9% |
 * | 4096 | 0.0215 | 98.1872 | 0.0222 | 95.2161 | 103.1% |
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
 * | 32 | 0.0102 | 3.4125 | 0.0099 | 3.5397 | 96.4% |
 * | 64 | 0.0102 | 6.6250 | 0.0101 | 6.6877 | 99.1% |
 * | 128 | 0.0107 | 12.4471 | 0.0106 | 12.6545 | 98.4% |
 * | 256 | 0.0116 | 22.9584 | 0.0113 | 23.4124 | 98.1% |
 * | 512 | 0.0123 | 43.0000 | 0.0129 | 40.8713 | 105.2% |
 * | 1024 | 0.0164 | 64.5010 | 0.0173 | 61.0936 | 105.6% |
 * | 1280 | 0.0192 | 68.4688 | 0.0199 | 66.2122 | 103.4% |
 * | 2048 | 0.0246 | 85.7500 | 0.0254 | 82.9421 | 103.4% |
 * | 4096 | 0.0373 | 113.0511 | 0.0406 | 103.8233 | 108.9% |
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
 * | 32 | 0.0123 | 5.6771 | 0.0100 | 6.9872 | 81.2% |
 * | 64 | 0.0124 | 10.9072 | 0.0103 | 13.2044 | 82.6% |
 * | 128 | 0.0138 | 19.3635 | 0.0104 | 25.6888 | 75.4% |
 * | 256 | 0.0143 | 36.9286 | 0.0123 | 43.0833 | 85.7% |
 * | 512 | 0.0164 | 64.3750 | 0.0159 | 66.2513 | 97.2% |
 * | 1024 | 0.0246 | 85.6667 | 0.0228 | 92.1457 | 93.0% |
 * | 1280 | 0.0269 | 97.9250 | 0.0261 | 100.6834 | 97.3% |
 * | 2048 | 0.0360 | 116.8498 | 0.0367 | 114.7586 | 101.8% |
 * | 4096 | 0.0598 | 140.5262 | 0.0676 | 124.4832 | 112.9% |
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
 * | 32 | 0.0165 | 8.4419 | 0.0100 | 13.9839 | 60.4% |
 * | 64 | 0.0167 | 16.1992 | 0.0104 | 26.0988 | 62.1% |
 * | 128 | 0.0180 | 29.6898 | 0.0122 | 43.6592 | 68.0% |
 * | 256 | 0.0197 | 53.6623 | 0.0148 | 71.3952 | 75.2% |
 * | 512 | 0.0251 | 83.9465 | 0.0225 | 93.5455 | 89.7% |
 * | 1024 | 0.0358 | 117.3714 | 0.0347 | 121.1576 | 96.9% |
 * | 1280 | 0.0422 | 124.4364 | 0.0409 | 128.5258 | 96.8% |
 * | 2048 | 0.0639 | 131.5253 | 0.0594 | 141.5172 | 92.9% |
 * | 4096 | 0.1100 | 152.8102 | 0.1127 | 149.1425 | 102.5% |
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
 * | 32 | 0.0246 | 7.0793 | 0.0100 | 17.3930 | 40.7% |
 * | 64 | 0.0263 | 12.8564 | 0.0107 | 31.6407 | 40.6% |
 * | 128 | 0.0282 | 23.6545 | 0.0118 | 56.6422 | 41.8% |
 * | 256 | 0.0307 | 43.0782 | 0.0175 | 75.4557 | 57.1% |
 * | 512 | 0.0368 | 71.5065 | 0.0246 | 107.1667 | 66.7% |
 * | 1024 | 0.0492 | 106.9235 | 0.0398 | 132.2237 | 80.9% |
 * | 1280 | 0.0573 | 114.5536 | 0.0464 | 141.6212 | 80.9% |
 * | 2048 | 0.0794 | 132.2546 | 0.0676 | 155.4242 | 85.1% |
 * | 4096 | 0.1413 | 148.6279 | 0.1272 | 165.0797 | 90.0% |
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
 * | 32 | 0.0369 | 7.5557 | 0.0065 | 42.6863 | 17.7% |
 * | 64 | 0.0370 | 14.6165 | 0.0078 | 69.5638 | 21.0% |
 * | 128 | 0.0435 | 24.5004 | 0.0119 | 89.7466 | 27.3% |
 * | 256 | 0.0451 | 46.9318 | 0.0206 | 102.4496 | 45.8% |
 * | 512 | 0.0538 | 78.3386 | 0.0346 | 121.7272 | 64.4% |
 * | 1024 | 0.0750 | 112.1092 | 0.0550 | 152.7814 | 73.4% |
 * | 1280 | 0.0873 | 120.3195 | 0.0684 | 153.5791 | 78.3% |
 * | 2048 | 0.1211 | 138.7202 | 0.1004 | 167.4019 | 82.9% |
 * | 4096 | 0.2432 | 138.1143 | 0.2166 | 155.0713 | 89.1% |
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
 * | 32 | 0.0696 | 8.0055 | 0.0185 | 30.1507 | 26.6% |
 * | 64 | 0.0737 | 14.6765 | 0.0246 | 44.0104 | 33.3% |
 * | 128 | 0.0839 | 25.4010 | 0.0328 | 65.0156 | 39.1% |
 * | 256 | 0.0842 | 50.2006 | 0.0483 | 87.4730 | 57.4% |
 * | 512 | 0.1017 | 82.7904 | 0.0676 | 124.6364 | 66.4% |
 * | 1024 | 0.1469 | 114.4500 | 0.1283 | 131.0488 | 87.3% |
 * | 1280 | 0.1731 | 121.3463 | 0.1436 | 146.2725 | 83.0% |
 * | 2048 | 0.2526 | 133.0026 | 0.1985 | 169.2361 | 78.6% |
 * | 4096 | 0.4726 | 142.1057 | 0.3776 | 177.8775 | 79.9% |
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
 * | 32 | 0.0226 | 0.1984 | 0.0058 | 0.7735 | 25.7% |
 * | 64 | 0.0225 | 0.3920 | 0.0100 | 0.8818 | 44.5% |
 * | 128 | 0.0226 | 0.7773 | 0.0045 | 3.9004 | 19.9% |
 * | 256 | 0.0236 | 1.4837 | 0.0052 | 6.6994 | 22.1% |
 * | 512 | 0.0239 | 2.9144 | 0.0052 | 13.2927 | 21.9% |
 * | 1024 | 0.0236 | 5.9145 | 0.0061 | 22.8661 | 25.9% |
 * | 1280 | 0.0241 | 7.2297 | 0.0062 | 28.1344 | 25.7% |
 * | 2048 | 0.0240 | 11.6107 | 0.0078 | 35.9093 | 32.3% |
 * | 4096 | 0.0242 | 23.0623 | 0.0101 | 55.1013 | 41.9% |
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
 * | 32 | 0.0184 | 0.4722 | 0.0047 | 1.8630 | 25.3% |
 * | 64 | 0.0187 | 0.9194 | 0.0051 | 3.3817 | 27.2% |
 * | 128 | 0.0186 | 1.8313 | 0.0047 | 7.2381 | 25.3% |
 * | 256 | 0.0186 | 3.6520 | 0.0050 | 13.5463 | 27.0% |
 * | 512 | 0.0188 | 7.1973 | 0.0056 | 24.3218 | 29.6% |
 * | 1024 | 0.0196 | 13.8170 | 0.0061 | 44.0417 | 31.4% |
 * | 1280 | 0.0199 | 16.9631 | 0.0064 | 52.5771 | 32.3% |
 * | 2048 | 0.0200 | 27.0897 | 0.0081 | 67.0794 | 40.4% |
 * | 4096 | 0.0261 | 41.4979 | 0.0110 | 98.2558 | 42.2% |
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
 * | 32 | 0.0246 | 0.6970 | 0.0049 | 3.5033 | 19.9% |
 * | 64 | 0.0249 | 1.3573 | 0.0050 | 6.7910 | 20.0% |
 * | 128 | 0.0264 | 2.5421 | 0.0052 | 12.9383 | 19.6% |
 * | 256 | 0.0265 | 5.0435 | 0.0057 | 23.4607 | 21.5% |
 * | 512 | 0.0264 | 10.1042 | 0.0061 | 43.9894 | 23.0% |
 * | 1024 | 0.0280 | 19.0572 | 0.0076 | 70.1305 | 27.2% |
 * | 1280 | 0.0328 | 20.3281 | 0.0079 | 84.2753 | 24.1% |
 * | 2048 | 0.0636 | 16.7569 | 0.0098 | 108.2797 | 15.5% |
 * | 4096 | 0.1230 | 17.3195 | 0.0167 | 127.9078 | 13.5% |
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
 * | 32 | 0.0425 | 0.8018 | 0.0053 | 6.4485 | 12.4% |
 * | 64 | 0.0407 | 1.6491 | 0.0054 | 12.3658 | 13.3% |
 * | 128 | 0.0410 | 3.2475 | 0.0056 | 23.7714 | 13.7% |
 * | 256 | 0.0410 | 6.4750 | 0.0060 | 44.5591 | 14.5% |
 * | 512 | 0.0411 | 12.8948 | 0.0066 | 80.7024 | 16.0% |
 * | 1024 | 0.0860 | 12.2976 | 0.0083 | 127.6293 | 9.6% |
 * | 1280 | 0.1109 | 11.9244 | 0.0125 | 105.9282 | 11.3% |
 * | 2048 | 0.1249 | 16.9241 | 0.0168 | 125.7469 | 13.5% |
 * | 4096 | 0.2214 | 19.0950 | 0.0285 | 148.1256 | 12.9% |
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
 * | 32 | 0.0639 | 1.0621 | 0.0054 | 12.5444 | 8.5% |
 * | 64 | 0.0660 | 2.0233 | 0.0055 | 24.1387 | 8.4% |
 * | 128 | 0.0670 | 3.9570 | 0.0059 | 44.8000 | 8.8% |
 * | 256 | 0.0673 | 7.8516 | 0.0064 | 81.9454 | 9.6% |
 * | 512 | 0.1444 | 7.3017 | 0.0082 | 128.7500 | 5.7% |
 * | 1024 | 0.1987 | 10.6082 | 0.0184 | 114.2342 | 9.3% |
 * | 1280 | 0.2003 | 13.1518 | 0.0211 | 125.0821 | 10.5% |
 * | 2048 | 0.2273 | 18.5341 | 0.0299 | 140.7247 | 13.2% |
 * | 4096 | 0.4219 | 19.9660 | 0.0525 | 160.4584 | 12.4% |
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
 * | 32 | 0.1230 | 1.1008 | 0.0062 | 21.7026 | 5.1% |
 * | 64 | 0.1264 | 2.1101 | 0.0067 | 39.7900 | 5.3% |
 * | 128 | 0.1283 | 4.1277 | 0.0070 | 75.3713 | 5.5% |
 * | 256 | 0.2703 | 3.9015 | 0.0084 | 125.8015 | 3.1% |
 * | 512 | 0.3686 | 5.7111 | 0.0171 | 123.4372 | 4.6% |
 * | 1024 | 0.3819 | 11.0139 | 0.0320 | 131.3247 | 8.4% |
 * | 1280 | 0.3912 | 13.4398 | 0.0361 | 145.7746 | 9.2% |
 * | 2048 | 0.4379 | 19.2051 | 0.0515 | 163.2706 | 11.8% |
 * | 4096 | 0.8195 | 20.5170 | 0.0976 | 172.2189 | 11.9% |
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
 * | 32 | 0.1522 | 1.1117 | 0.0076 | 22.4068 | 5.0% |
 * | 64 | 0.1430 | 2.3302 | 0.0076 | 44.1356 | 5.3% |
 * | 128 | 0.1446 | 4.5760 | 0.0080 | 82.3586 | 5.6% |
 * | 256 | 0.4303 | 3.0630 | 0.0135 | 97.5924 | 3.1% |
 * | 512 | 0.4404 | 5.9740 | 0.0205 | 128.4500 | 4.7% |
 * | 1024 | 0.4632 | 11.3468 | 0.0347 | 151.3880 | 7.5% |
 * | 1280 | 0.4689 | 14.0085 | 0.0424 | 155.1039 | 9.0% |
 * | 2048 | 0.5310 | 19.7868 | 0.0819 | 128.2625 | 15.4% |
 * | 4096 | 0.2291 | 91.7217 | 0.1200 | 175.0084 | 52.4% |
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
 * | 32 | 0.1929 | 1.4028 | 0.0083 | 32.6486 | 4.3% |
 * | 64 | 0.1966 | 2.7105 | 0.0104 | 51.3282 | 5.3% |
 * | 128 | 0.2554 | 4.1421 | 0.0110 | 95.8145 | 4.3% |
 * | 256 | 0.3047 | 6.9166 | 0.0204 | 103.0610 | 6.7% |
 * | 512 | 0.3032 | 13.8754 | 0.0287 | 146.5507 | 9.5% |
 * | 1024 | 0.3123 | 26.9170 | 0.0530 | 158.6566 | 17.0% |
 * | 1280 | 0.3236 | 32.4620 | 0.0635 | 165.4516 | 19.6% |
 * | 2048 | 0.3279 | 51.2425 | 0.1006 | 167.0025 | 30.7% |
 * | 4096 | 0.3484 | 96.4409 | 0.1856 | 180.9940 | 53.3% |
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
 * | 32 | 0.3707 | 1.4594 | 0.0089 | 60.6966 | 2.4% |
 * | 64 | 0.5186 | 2.0544 | 0.0104 | 102.1350 | 2.0% |
 * | 128 | 0.5489 | 3.8526 | 0.0190 | 111.0588 | 3.5% |
 * | 256 | 0.5492 | 7.6705 | 0.0307 | 137.1333 | 5.6% |
 * | 512 | 0.5340 | 15.7469 | 0.0516 | 162.9163 | 9.7% |
 * | 1024 | 0.5591 | 30.0513 | 0.1017 | 165.2679 | 18.2% |
 * | 1280 | 0.5646 | 37.1886 | 0.1210 | 173.4810 | 21.4% |
 * | 2048 | 0.5732 | 58.5927 | 0.1949 | 172.3198 | 34.0% |
 * | 4096 | 0.6058 | 110.8569 | 0.3691 | 181.9488 | 60.9% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0048 | 0.9067 | 58.6% |
 * | 64 | 0.0083 | 2.0426 | 0.0049 | 3.4286 | 59.6% |
 * | 128 | 0.0088 | 7.5636 | 0.0053 | 12.5680 | 60.2% |
 * | 256 | 0.0116 | 22.7438 | 0.0100 | 26.5466 | 85.7% |
 * | 512 | 0.0164 | 64.2500 | 0.0135 | 77.9526 | 82.4% |
 * | 1024 | 0.0356 | 117.8887 | 0.0328 | 128.3127 | 91.9% |
 * | 1280 | 0.0492 | 133.5417 | 0.0451 | 145.6818 | 91.7% |
 * | 2048 | 0.1030 | 163.0067 | 0.0995 | 168.7188 | 96.6% |
 * | 4096 | 0.3742 | 179.4310 | 0.3780 | 177.6083 | 101.0% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0047 | 0.9220 | 57.6% |
 * | 64 | 0.0084 | 2.0230 | 0.0048 | 3.5200 | 57.5% |
 * | 128 | 0.0091 | 7.2982 | 0.0053 | 12.4551 | 58.6% |
 * | 256 | 0.0114 | 23.1261 | 0.0102 | 25.9623 | 89.1% |
 * | 512 | 0.0164 | 64.2500 | 0.0143 | 73.5106 | 87.4% |
 * | 1024 | 0.0358 | 117.2571 | 0.0328 | 128.3127 | 91.4% |
 * | 1280 | 0.0492 | 133.5417 | 0.0452 | 145.1150 | 92.0% |
 * | 2048 | 0.1050 | 159.9512 | 0.1000 | 167.9898 | 95.2% |
 * | 4096 | 0.3766 | 178.2950 | 0.3831 | 175.2496 | 101.7% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0047 | 0.9347 | 56.8% |
 * | 64 | 0.0082 | 2.0625 | 0.0049 | 3.4623 | 59.6% |
 * | 128 | 0.0091 | 7.2982 | 0.0055 | 12.0930 | 60.4% |
 * | 256 | 0.0116 | 22.7125 | 0.0101 | 26.0442 | 87.2% |
 * | 512 | 0.0164 | 64.2500 | 0.0137 | 77.0398 | 83.4% |
 * | 1024 | 0.0359 | 117.1525 | 0.0328 | 128.2500 | 91.3% |
 * | 1280 | 0.0492 | 133.3680 | 0.0451 | 145.6818 | 91.5% |
 * | 2048 | 0.1049 | 160.0488 | 0.1003 | 167.4003 | 95.6% |
 * | 4096 | 0.3754 | 178.8345 | 0.3809 | 176.2506 | 101.5% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0049 | 0.8947 | 59.4% |
 * | 64 | 0.0082 | 2.0625 | 0.0049 | 3.4286 | 60.2% |
 * | 128 | 0.0090 | 7.3628 | 0.0055 | 12.1637 | 60.5% |
 * | 256 | 0.0113 | 23.3881 | 0.0102 | 25.8000 | 90.7% |
 * | 512 | 0.0165 | 63.8757 | 0.0141 | 74.5941 | 85.6% |
 * | 1024 | 0.0356 | 117.9946 | 0.0329 | 127.8754 | 92.3% |
 * | 1280 | 0.0492 | 133.5417 | 0.0451 | 145.6818 | 91.7% |
 * | 2048 | 0.1044 | 160.7843 | 0.1000 | 167.9629 | 95.7% |
 * | 4096 | 0.3748 | 179.1552 | 0.4318 | 155.5011 | 115.2% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0156 | 0.2784 | 190.8% |
 * | 64 | 0.0083 | 2.0426 | 0.0157 | 1.0776 | 189.5% |
 * | 128 | 0.0094 | 7.0508 | 0.0167 | 3.9923 | 176.6% |
 * | 256 | 0.0114 | 23.0937 | 0.0183 | 14.4588 | 159.7% |
 * | 512 | 0.0164 | 64.2500 | 0.0246 | 42.8333 | 150.0% |
 * | 1024 | 0.0360 | 116.8919 | 0.0452 | 92.9756 | 125.7% |
 * | 1280 | 0.0502 | 130.8163 | 0.0432 | 151.8845 | 86.1% |
 * | 2048 | 0.1041 | 161.3776 | 0.1000 | 167.8823 | 96.1% |
 * | 4096 | 0.3871 | 173.4531 | 0.3820 | 175.7487 | 98.7% |
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
 * | 32 | 0.0117 | 0.3721 | 0.0041 | 1.0625 | 35.0% |
 * | 64 | 0.0117 | 1.4387 | 0.0048 | 3.4967 | 41.1% |
 * | 128 | 0.0126 | 5.2926 | 0.0055 | 12.1637 | 43.5% |
 * | 256 | 0.0164 | 16.1250 | 0.0102 | 25.8000 | 62.5% |
 * | 512 | 0.0225 | 46.6941 | 0.0143 | 73.4286 | 63.6% |
 * | 1024 | 0.0451 | 93.2727 | 0.0328 | 128.2500 | 72.7% |
 * | 1280 | 0.0602 | 109.0774 | 0.0451 | 145.6301 | 74.9% |
 * | 2048 | 0.1227 | 136.8984 | 0.1000 | 167.9898 | 81.5% |
 * | 4096 | 0.4616 | 145.4441 | 0.3824 | 175.5796 | 82.8% |
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
 * | 32 | 0.0123 | 0.3542 | 0.0049 | 0.8918 | 39.7% |
 * | 64 | 0.0127 | 1.3266 | 0.0049 | 3.4623 | 38.3% |
 * | 128 | 0.0142 | 4.6847 | 0.0054 | 12.3077 | 38.1% |
 * | 256 | 0.0180 | 14.6383 | 0.0102 | 25.8000 | 56.7% |
 * | 512 | 0.0262 | 40.2152 | 0.0142 | 74.2573 | 54.2% |
 * | 1024 | 0.0497 | 84.4825 | 0.0328 | 128.2500 | 65.9% |
 * | 1280 | 0.0675 | 97.1902 | 0.0451 | 145.6818 | 66.7% |
 * | 2048 | 0.1344 | 124.9673 | 0.0996 | 168.6646 | 74.1% |
 * | 4096 | 0.4628 | 145.0619 | 0.3809 | 176.2581 | 82.3% |
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
 * | 32 | 0.0126 | 0.3443 | 0.0048 | 0.9067 | 38.0% |
 * | 64 | 0.0140 | 1.2096 | 0.0047 | 3.6289 | 33.3% |
 * | 128 | 0.0147 | 4.5316 | 0.0054 | 12.3810 | 36.6% |
 * | 256 | 0.0186 | 14.1978 | 0.0098 | 26.8488 | 52.9% |
 * | 512 | 0.0280 | 37.5954 | 0.0136 | 77.2207 | 48.7% |
 * | 1024 | 0.0533 | 78.8757 | 0.0328 | 128.2500 | 61.5% |
 * | 1280 | 0.0715 | 91.7558 | 0.0451 | 145.4752 | 63.1% |
 * | 2048 | 0.1415 | 118.6659 | 0.0982 | 171.0560 | 69.4% |
 * | 4096 | 0.5120 | 131.1401 | 0.3827 | 175.4548 | 74.7% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0036 | 1.2035 | 44.1% |
 * | 64 | 0.0083 | 2.0386 | 0.0038 | 4.4936 | 45.4% |
 * | 128 | 0.0091 | 7.2982 | 0.0041 | 16.2500 | 44.9% |
 * | 256 | 0.0113 | 23.3881 | 0.0062 | 42.5567 | 55.0% |
 * | 512 | 0.0164 | 64.2500 | 0.0123 | 85.6667 | 75.0% |
 * | 1024 | 0.0360 | 116.6841 | 0.0307 | 136.8000 | 85.3% |
 * | 1280 | 0.0491 | 133.6287 | 0.0451 | 145.6818 | 91.7% |
 * | 2048 | 0.1035 | 162.3009 | 0.0994 | 168.9361 | 96.1% |
 * | 4096 | 0.3742 | 179.4463 | 0.3800 | 176.6959 | 101.6% |
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
 * | 32 | 0.0067 | 0.6538 | 0.0021 | 2.1085 | 31.0% |
 * | 64 | 0.0069 | 2.4444 | 0.0020 | 8.2500 | 29.6% |
 * | 128 | 0.0085 | 7.8049 | 0.0020 | 32.5000 | 24.0% |
 * | 256 | 0.0109 | 24.1757 | 0.0021 | 128.0000 | 18.9% |
 * | 512 | 0.0159 | 66.2558 | 0.0020 | 514.0001 | 12.9% |
 * | 1024 | 0.0354 | 118.5806 | 0.0026 | 1631.4036 | 7.3% |
 * | 1280 | 0.0488 | 134.6373 | 0.0027 | 2441.9048 | 5.5% |
 * | 2048 | 0.1026 | 163.6165 | 0.0027 | 6322.8916 | 2.6% |
 * | 4096 | 0.3741 | 179.4847 | 0.0041 | 16456.2793 | 1.1% |
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
 * | 32 | 0.0107 | 0.4054 | 0.0050 | 0.8774 | 46.2% |
 * | 64 | 0.0113 | 1.5000 | 0.0048 | 3.5556 | 42.2% |
 * | 128 | 0.0123 | 5.4167 | 0.0056 | 11.8857 | 45.6% |
 * | 256 | 0.0166 | 15.9382 | 0.0102 | 25.8000 | 61.8% |
 * | 512 | 0.0226 | 46.6279 | 0.0141 | 74.6788 | 62.4% |
 * | 1024 | 0.0451 | 93.2727 | 0.0328 | 128.2500 | 72.7% |
 * | 1280 | 0.0583 | 112.6105 | 0.0451 | 145.4752 | 77.4% |
 * | 2048 | 0.1167 | 143.8596 | 0.1000 | 167.9360 | 85.7% |
 * | 4096 | 0.4588 | 146.3469 | 0.3781 | 177.5708 | 82.4% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0064 | 0.6834 | 77.7% |
 * | 64 | 0.0083 | 2.0269 | 0.0064 | 2.6400 | 76.8% |
 * | 128 | 0.0090 | 7.4021 | 0.0068 | 9.8345 | 75.3% |
 * | 256 | 0.0114 | 23.1261 | 0.0127 | 20.8222 | 111.1% |
 * | 512 | 0.0164 | 64.2500 | 0.0164 | 64.2500 | 100.0% |
 * | 1024 | 0.0360 | 116.7360 | 0.0409 | 102.6401 | 113.7% |
 * | 1280 | 0.0490 | 133.8903 | 0.0430 | 152.6190 | 87.7% |
 * | 2048 | 0.1037 | 161.8754 | 0.0999 | 168.1782 | 96.3% |
 * | 4096 | 0.3744 | 179.3466 | 0.3782 | 177.5482 | 101.0% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0052 | 0.8421 | 63.1% |
 * | 64 | 0.0083 | 2.0308 | 0.0047 | 3.5676 | 56.9% |
 * | 128 | 0.0090 | 7.3890 | 0.0055 | 12.0580 | 61.3% |
 * | 256 | 0.0113 | 23.2891 | 0.0100 | 26.3770 | 88.3% |
 * | 512 | 0.0164 | 64.2500 | 0.0140 | 74.9339 | 85.7% |
 * | 1024 | 0.0360 | 116.8919 | 0.0331 | 127.0097 | 92.0% |
 * | 1280 | 0.0492 | 133.5417 | 0.0576 | 113.9556 | 117.2% |
 * | 2048 | 0.1027 | 163.5655 | 0.0976 | 172.0092 | 95.1% |
 * | 4096 | 0.3746 | 179.2547 | 0.3793 | 177.0164 | 101.3% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0055 | 0.7953 | 66.8% |
 * | 64 | 0.0083 | 2.0426 | 0.0050 | 3.3738 | 60.5% |
 * | 128 | 0.0089 | 7.4552 | 0.0057 | 11.7183 | 63.6% |
 * | 256 | 0.0114 | 23.1261 | 0.0104 | 25.3641 | 91.2% |
 * | 512 | 0.0164 | 64.2500 | 0.0142 | 74.2573 | 86.5% |
 * | 1024 | 0.0362 | 116.1167 | 0.0328 | 128.2500 | 90.5% |
 * | 1280 | 0.0490 | 133.9341 | 0.0451 | 145.6818 | 91.9% |
 * | 2048 | 0.1029 | 163.2602 | 0.0998 | 168.2860 | 97.0% |
 * | 4096 | 0.3741 | 179.4770 | 0.4267 | 157.3553 | 114.1% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0048 | 0.9097 | 58.4% |
 * | 64 | 0.0083 | 2.0386 | 0.0047 | 3.5676 | 57.1% |
 * | 128 | 0.0090 | 7.4286 | 0.0056 | 11.8857 | 62.5% |
 * | 256 | 0.0114 | 23.0937 | 0.0100 | 26.3770 | 87.6% |
 * | 512 | 0.0164 | 64.2500 | 0.0136 | 77.4024 | 83.0% |
 * | 1024 | 0.0360 | 116.6841 | 0.0328 | 128.2500 | 91.0% |
 * | 1280 | 0.0491 | 133.6287 | 0.0448 | 146.4620 | 91.2% |
 * | 2048 | 0.1032 | 162.7035 | 0.0991 | 169.3996 | 96.0% |
 * | 4096 | 0.3742 | 179.4233 | 0.3785 | 177.3681 | 101.2% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0052 | 0.8293 | 64.1% |
 * | 64 | 0.0083 | 2.0465 | 0.0052 | 3.2294 | 63.4% |
 * | 128 | 0.0090 | 7.3628 | 0.0057 | 11.6201 | 63.4% |
 * | 256 | 0.0115 | 22.9333 | 0.0102 | 25.8809 | 88.6% |
 * | 512 | 0.0164 | 64.2500 | 0.0141 | 74.5096 | 86.2% |
 * | 1024 | 0.0361 | 116.3739 | 0.0328 | 128.2500 | 90.7% |
 * | 1280 | 0.0491 | 133.7594 | 0.0453 | 144.8076 | 92.4% |
 * | 2048 | 0.1033 | 162.5019 | 0.0997 | 168.3670 | 96.5% |
 * | 4096 | 0.3741 | 179.4770 | 0.3806 | 176.4137 | 101.7% |
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
 * | 32 | 0.0082 | 0.5313 | 0.0053 | 0.8168 | 65.0% |
 * | 64 | 0.0083 | 2.0386 | 0.0049 | 3.4286 | 59.5% |
 * | 128 | 0.0089 | 7.4419 | 0.0056 | 11.8182 | 63.0% |
 * | 256 | 0.0112 | 23.5886 | 0.0101 | 26.2095 | 90.0% |
 * | 512 | 0.0164 | 64.2500 | 0.0237 | 44.3641 | 144.8% |
 * | 1024 | 0.0362 | 116.2195 | 0.0442 | 95.0963 | 122.2% |
 * | 1280 | 0.0490 | 134.0216 | 0.0572 | 114.7524 | 116.8% |
 * | 2048 | 0.1036 | 162.1505 | 0.1001 | 167.6945 | 96.7% |
 * | 4096 | 0.3744 | 179.3543 | 0.3805 | 176.4433 | 101.6% |
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
 * | 32 | 0.0136 | 0.3200 |
 * | 64 | 0.0105 | 1.6024 |
 * | 128 | 0.0150 | 4.4492 |
 * | 256 | 0.0216 | 12.2584 |
 * | 512 | 0.0503 | 20.9462 |
 * | 1024 | 0.1086 | 38.6942 |
 * | 1280 | 0.1372 | 47.8358 |
 * | 2048 | 0.2150 | 78.0952 |
 * | 4096 | 0.4722 | 142.2010 |
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
 * | 32 | 0.0082 | 0.5313 |
 * | 64 | 0.0084 | 2.0153 |
 * | 128 | 0.0089 | 7.5090 |
 * | 256 | 0.0114 | 23.2563 |
 * | 512 | 0.0164 | 64.3128 |
 * | 1024 | 0.0360 | 116.5806 |
 * | 1280 | 0.0488 | 134.5049 |
 * | 2048 | 0.1036 | 162.1755 |
 * | 4096 | 0.3738 | 179.6307 |
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
