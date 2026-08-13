/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0138 | 0.3256 | 0.0066 | 0.6813 | 47.8% |
 * | 64 | 0.0106 | 1.6145 | 0.0067 | 2.5769 | 62.7% |
 * | 128 | 0.0149 | 4.4930 | 0.0076 | 8.8626 | 50.7% |
 * | 256 | 0.0219 | 12.1258 | 0.0144 | 18.4178 | 65.8% |
 * | 512 | 0.0512 | 20.6000 | 0.0204 | 51.6614 | 39.9% |
 * | 1024 | 0.1109 | 37.9382 | 0.2082 | 20.2038 | 187.8% |
 * | 1280 | 0.1372 | 47.8731 | 0.2274 | 28.8923 | 165.7% |
 * | 2048 | 0.2172 | 77.3734 | 0.4363 | 38.5122 | 200.9% |
 * | 4096 | 0.4731 | 141.9567 | 0.4774 | 140.6816 | 100.9% |
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
 * | 32 | 0.0137 | 0.3263 | 0.0082 | 0.5479 | 59.6% |
 * | 64 | 0.0108 | 1.5952 | 0.0076 | 2.2521 | 70.8% |
 * | 128 | 0.0150 | 4.4596 | 0.0082 | 8.1875 | 54.5% |
 * | 256 | 0.0221 | 11.9855 | 0.0141 | 18.7511 | 63.9% |
 * | 512 | 0.0540 | 19.5203 | 0.0151 | 69.9788 | 27.9% |
 * | 1024 | 0.1180 | 35.6491 | 0.0417 | 100.9647 | 35.3% |
 * | 1280 | 0.1475 | 44.5486 | 0.0569 | 115.4231 | 38.6% |
 * | 2048 | 0.2337 | 71.8959 | 0.3777 | 44.4831 | 161.6% |
 * | 4096 | 0.5230 | 128.4112 | 0.4793 | 140.1274 | 91.6% |
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
 * | 32 | 0.0138 | 0.3244 | 0.0078 | 0.5738 | 56.5% |
 * | 64 | 0.0108 | 1.5881 | 0.0078 | 2.2058 | 72.0% |
 * | 128 | 0.0155 | 4.3216 | 0.0082 | 8.1398 | 53.1% |
 * | 256 | 0.0223 | 11.9080 | 0.0149 | 17.7473 | 67.1% |
 * | 512 | 0.0619 | 17.0512 | 0.0192 | 55.0250 | 31.0% |
 * | 1024 | 0.1183 | 35.5623 | 0.0451 | 93.2643 | 38.1% |
 * | 1280 | 0.1472 | 44.6261 | 0.0593 | 110.8423 | 40.3% |
 * | 2048 | 0.2314 | 72.6018 | 0.3795 | 44.2712 | 164.0% |
 * | 4096 | 0.5258 | 127.7235 | 1.1871 | 56.5730 | 225.8% |
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
 * | 32 | 0.0137 | 0.3271 | 0.0079 | 0.5645 | 57.9% |
 * | 64 | 0.0113 | 1.5227 | 0.0077 | 2.2195 | 68.6% |
 * | 128 | 0.0152 | 4.4034 | 0.0080 | 8.4008 | 52.4% |
 * | 256 | 0.0314 | 8.4571 | 0.0149 | 17.7854 | 47.6% |
 * | 512 | 0.0799 | 13.2051 | 0.0184 | 57.2222 | 23.1% |
 * | 1024 | 0.1604 | 26.2335 | 0.0430 | 97.8095 | 26.8% |
 * | 1280 | 0.1986 | 33.0830 | 0.0586 | 112.0830 | 29.5% |
 * | 2048 | 0.3277 | 51.2675 | 0.1249 | 134.4918 | 38.1% |
 * | 4096 | 0.5359 | 125.3247 | 0.4679 | 143.5295 | 87.3% |
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
 * | 32 | 0.0083 | 0.5426 | 0.0132 | 0.3402 | 159.5% |
 * | 64 | 0.0083 | 1.0502 | 0.0132 | 0.6570 | 159.8% |
 * | 128 | 0.0084 | 2.0303 | 0.0128 | 1.3350 | 152.1% |
 * | 256 | 0.0085 | 4.0000 | 0.0143 | 2.3750 | 168.4% |
 * | 512 | 0.0089 | 7.5986 | 0.0141 | 4.8073 | 158.1% |
 * | 1024 | 0.0097 | 13.8982 | 0.0141 | 9.6182 | 144.5% |
 * | 1280 | 0.0101 | 16.8140 | 0.0135 | 12.5308 | 134.2% |
 * | 2048 | 0.0105 | 25.7021 | 0.0142 | 19.0665 | 134.8% |
 * | 4096 | 0.0125 | 43.2327 | 0.0143 | 37.7321 | 114.6% |
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
 * | 32 | 0.0084 | 1.0534 | 0.0090 | 0.9822 | 107.3% |
 * | 64 | 0.0084 | 2.0458 | 0.0093 | 1.8451 | 110.9% |
 * | 128 | 0.0086 | 3.9111 | 0.0091 | 3.7249 | 105.0% |
 * | 256 | 0.0087 | 7.6777 | 0.0141 | 4.7636 | 161.2% |
 * | 512 | 0.0094 | 14.1800 | 0.0137 | 9.7229 | 145.8% |
 * | 1024 | 0.0102 | 26.0500 | 0.0138 | 19.3635 | 134.5% |
 * | 1280 | 0.0103 | 32.3478 | 0.0143 | 23.2500 | 139.1% |
 * | 2048 | 0.0112 | 47.5886 | 0.0145 | 36.6469 | 129.9% |
 * | 4096 | 0.0169 | 63.1803 | 0.1817 | 5.8646 | 1077.3% |
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
 * | 32 | 0.0087 | 2.0073 | 0.0102 | 1.7125 | 117.2% |
 * | 64 | 0.0088 | 3.8691 | 0.0098 | 3.4771 | 111.3% |
 * | 128 | 0.0094 | 7.1658 | 0.0101 | 6.6540 | 107.7% |
 * | 256 | 0.0093 | 14.2955 | 0.0137 | 9.7196 | 147.1% |
 * | 512 | 0.0102 | 26.0629 | 0.0147 | 18.0961 | 144.0% |
 * | 1024 | 0.0110 | 48.2332 | 0.0161 | 32.9234 | 146.5% |
 * | 1280 | 0.0118 | 55.8703 | 0.0161 | 41.1793 | 135.7% |
 * | 2048 | 0.0154 | 68.8667 | 0.0214 | 49.5221 | 139.1% |
 * | 4096 | 0.0246 | 86.0417 | 0.1952 | 10.8346 | 794.1% |
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
 * | 32 | 0.0103 | 3.3860 | 0.0175 | 1.9945 | 169.8% |
 * | 64 | 0.0104 | 6.5432 | 0.0165 | 4.1205 | 158.8% |
 * | 128 | 0.0112 | 11.9485 | 0.0167 | 8.0000 | 149.4% |
 * | 256 | 0.0115 | 23.1508 | 0.0174 | 15.2073 | 152.2% |
 * | 512 | 0.0124 | 42.5567 | 0.0197 | 26.8488 | 158.5% |
 * | 1024 | 0.0164 | 64.3750 | 0.2212 | 4.7689 | 1349.9% |
 * | 1280 | 0.0218 | 60.4758 | 0.0267 | 49.2926 | 122.7% |
 * | 2048 | 0.0267 | 78.8695 | 0.2417 | 8.7192 | 904.5% |
 * | 4096 | 0.0430 | 97.9524 | 0.2886 | 14.5984 | 671.0% |
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
 * | 32 | 0.0124 | 5.6041 | 0.0161 | 4.3254 | 129.6% |
 * | 64 | 0.0127 | 10.6332 | 0.0157 | 8.6456 | 123.0% |
 * | 128 | 0.0139 | 19.1412 | 0.0165 | 16.1550 | 118.5% |
 * | 256 | 0.0143 | 36.9286 | 0.0155 | 34.1818 | 108.0% |
 * | 512 | 0.0168 | 62.7810 | 0.0225 | 46.8182 | 134.1% |
 * | 1024 | 0.0267 | 78.9820 | 0.2417 | 8.7119 | 906.6% |
 * | 1280 | 0.0307 | 85.6333 | 0.2630 | 10.0028 | 856.1% |
 * | 2048 | 0.0484 | 86.9418 | 0.2868 | 14.6665 | 592.8% |
 * | 4096 | 0.0776 | 108.3869 | 0.2539 | 33.1233 | 327.2% |
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
 * | 32 | 0.0250 | 5.5846 | 0.0136 | 10.2615 | 54.4% |
 * | 64 | 0.0267 | 10.1513 | 0.0173 | 15.6303 | 64.9% |
 * | 128 | 0.0284 | 18.7885 | 0.0199 | 26.8213 | 70.1% |
 * | 256 | 0.0304 | 34.7958 | 0.0186 | 56.9931 | 61.1% |
 * | 512 | 0.0372 | 56.6503 | 0.2319 | 9.0880 | 623.4% |
 * | 1024 | 0.2241 | 18.7741 | 0.2681 | 15.6887 | 119.7% |
 * | 1280 | 0.2737 | 19.2022 | 0.2852 | 18.4309 | 104.2% |
 * | 2048 | 0.4239 | 19.8268 | 0.3474 | 24.1923 | 82.0% |
 * | 4096 | 0.8212 | 20.4589 | 0.4739 | 35.4552 | 57.7% |
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
 * | 32 | 0.0350 | 4.9808 | 0.0127 | 13.7649 | 36.2% |
 * | 64 | 0.0354 | 9.5465 | 0.0142 | 23.7750 | 40.2% |
 * | 128 | 0.0389 | 17.1184 | 0.0161 | 41.4661 | 41.3% |
 * | 256 | 0.0886 | 14.9222 | 0.1614 | 8.1895 | 182.2% |
 * | 512 | 0.1525 | 17.2744 | 0.2130 | 12.3654 | 139.7% |
 * | 1024 | 0.2782 | 18.9000 | 0.2736 | 19.2116 | 98.4% |
 * | 1280 | 0.3379 | 19.4412 | 0.2905 | 22.6142 | 86.0% |
 * | 2048 | 1.1589 | 9.0641 | 0.3503 | 29.9859 | 30.2% |
 * | 4096 | 1.0199 | 20.5884 | 0.4989 | 42.0865 | 48.9% |
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
 * | 32 | 0.0433 | 6.4289 | 0.0103 | 27.0015 | 23.8% |
 * | 64 | 0.0401 | 13.5016 | 0.0098 | 55.1517 | 24.5% |
 * | 128 | 0.0471 | 22.6349 | 0.0153 | 69.5841 | 32.5% |
 * | 256 | 0.0485 | 43.5597 | 0.1359 | 15.5592 | 280.0% |
 * | 512 | 0.0576 | 73.1175 | 0.1677 | 25.1213 | 291.1% |
 * | 1024 | 0.0802 | 104.8829 | 0.3050 | 27.5715 | 380.4% |
 * | 1280 | 0.0933 | 112.5843 | 0.2908 | 36.1263 | 311.6% |
 * | 2048 | 0.1331 | 126.2457 | 0.4367 | 38.4727 | 328.1% |
 * | 4096 | 0.2437 | 137.8332 | 0.6313 | 53.2022 | 259.1% |
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
 * | 32 | 0.0671 | 8.3033 | 0.0103 | 54.0745 | 15.4% |
 * | 64 | 0.0711 | 15.2115 | 0.0145 | 74.6137 | 20.4% |
 * | 128 | 0.0815 | 26.1339 | 0.0252 | 84.6484 | 30.9% |
 * | 256 | 0.0814 | 51.9575 | 0.0392 | 107.7716 | 48.2% |
 * | 512 | 0.0998 | 84.4369 | 0.1815 | 46.4213 | 181.9% |
 * | 1024 | 0.1413 | 119.0125 | 0.3220 | 52.2202 | 227.9% |
 * | 1280 | 1.0260 | 20.4760 | 0.1649 | 127.3853 | 16.1% |
 * | 2048 | 1.6223 | 20.7091 | 0.4833 | 69.5085 | 29.8% |
 * | 4096 | 0.4559 | 147.3177 | 1.0926 | 61.4658 | 239.7% |
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
 * | 32 | 0.0184 | 0.2433 | 0.0120 | 0.3738 | 65.1% |
 * | 64 | 0.0184 | 0.4800 | 0.0121 | 0.7292 | 65.8% |
 * | 128 | 0.0184 | 0.9514 | 0.0116 | 1.5076 | 63.1% |
 * | 256 | 0.0184 | 1.8958 | 0.0123 | 2.8438 | 66.7% |
 * | 512 | 0.0187 | 3.7297 | 0.0122 | 5.6993 | 65.4% |
 * | 1024 | 0.0187 | 7.4462 | 0.0126 | 11.0840 | 67.2% |
 * | 1280 | 0.0187 | 9.3139 | 0.0131 | 13.3431 | 69.8% |
 * | 2048 | 0.0188 | 14.7844 | 0.0145 | 19.1806 | 77.1% |
 * | 4096 | 0.0192 | 29.0200 | 0.0154 | 36.1620 | 80.2% |
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
 * | 32 | 0.0146 | 0.5965 | 0.0084 | 1.0303 | 57.9% |
 * | 64 | 0.0150 | 1.1453 | 0.0087 | 1.9779 | 57.9% |
 * | 128 | 0.0158 | 2.1560 | 0.0087 | 3.9262 | 54.9% |
 * | 256 | 0.0158 | 4.2915 | 0.0125 | 5.4082 | 79.4% |
 * | 512 | 0.0160 | 8.4555 | 0.0127 | 10.6734 | 79.2% |
 * | 1024 | 0.0164 | 16.5318 | 0.0142 | 19.0236 | 86.9% |
 * | 1280 | 0.0165 | 20.5204 | 0.0145 | 23.3289 | 88.0% |
 * | 2048 | 0.0168 | 32.2595 | 0.0163 | 33.2429 | 97.0% |
 * | 4096 | 0.0212 | 51.0574 | 0.0207 | 52.2411 | 97.7% |
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
 * | 32 | 0.0249 | 0.6894 | 0.0133 | 1.2854 | 53.6% |
 * | 64 | 0.0267 | 1.2677 | 0.0131 | 2.5725 | 49.3% |
 * | 128 | 0.0278 | 2.4092 | 0.0137 | 4.9029 | 49.1% |
 * | 256 | 0.0277 | 4.8194 | 0.0101 | 13.2782 | 36.3% |
 * | 512 | 0.0276 | 9.6593 | 0.0122 | 21.8793 | 44.1% |
 * | 1024 | 0.0287 | 18.5686 | 0.0142 | 37.4713 | 49.6% |
 * | 1280 | 0.0299 | 22.2512 | 0.0143 | 46.4643 | 47.9% |
 * | 2048 | 0.0640 | 16.6522 | 0.0152 | 70.2447 | 23.7% |
 * | 4096 | 0.1237 | 17.2254 | 0.1161 | 18.3557 | 93.8% |
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
 * | 32 | 0.0415 | 0.8204 | 0.0093 | 3.6627 | 22.4% |
 * | 64 | 0.0425 | 1.5777 | 0.0089 | 7.5396 | 20.9% |
 * | 128 | 0.0430 | 3.0975 | 0.0098 | 13.5505 | 22.9% |
 * | 256 | 0.0430 | 6.1667 | 0.0127 | 20.9293 | 29.5% |
 * | 512 | 0.0448 | 11.8171 | 0.0116 | 45.6386 | 25.9% |
 * | 1024 | 0.0946 | 11.1808 | 0.0137 | 76.9639 | 14.5% |
 * | 1280 | 0.1147 | 11.5252 | 0.0184 | 71.8470 | 16.0% |
 * | 2048 | 0.2600 | 8.1344 | 0.0233 | 90.5826 | 9.0% |
 * | 4096 | 0.4848 | 8.7205 | 0.0369 | 114.6944 | 7.6% |
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
 * | 32 | 0.0751 | 0.9037 | 0.0096 | 7.0903 | 12.7% |
 * | 64 | 0.0781 | 1.7104 | 0.0097 | 13.8278 | 12.4% |
 * | 128 | 0.0791 | 3.3514 | 0.0101 | 26.1451 | 12.8% |
 * | 256 | 0.0788 | 6.7040 | 0.0115 | 45.9944 | 14.6% |
 * | 512 | 0.2280 | 4.6266 | 0.0135 | 78.3829 | 5.9% |
 * | 1024 | 0.3215 | 6.5541 | 0.0257 | 81.9614 | 8.0% |
 * | 1280 | 0.3499 | 7.5263 | 0.0287 | 91.8571 | 8.2% |
 * | 2048 | 0.4895 | 8.6056 | 0.0390 | 108.0854 | 8.0% |
 * | 4096 | 0.9585 | 8.7885 | 0.0680 | 123.7865 | 7.1% |
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
 * | 32 | 0.1669 | 0.8113 | 0.0107 | 12.6517 | 6.4% |
 * | 64 | 0.1713 | 1.5573 | 0.0130 | 20.4816 | 7.6% |
 * | 128 | 0.1761 | 3.0058 | 0.0143 | 36.9286 | 8.1% |
 * | 256 | 0.4523 | 2.3320 | 0.0141 | 74.9091 | 3.1% |
 * | 512 | 0.6145 | 3.4261 | 0.0236 | 89.2095 | 3.8% |
 * | 1024 | 0.6578 | 6.3952 | 0.0415 | 101.3539 | 6.3% |
 * | 1280 | 0.7037 | 7.4707 | 0.0467 | 112.5646 | 6.6% |
 * | 2048 | 0.9659 | 8.7056 | 0.0655 | 128.3125 | 6.8% |
 * | 4096 | 1.8526 | 9.0759 | 0.1209 | 139.0237 | 6.5% |
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
 * | 32 | 0.1052 | 1.6093 | 0.0121 | 14.0265 | 11.5% |
 * | 64 | 0.1084 | 3.0753 | 0.0123 | 27.1250 | 11.3% |
 * | 128 | 0.1102 | 6.0006 | 0.0125 | 53.0051 | 11.3% |
 * | 256 | 0.1753 | 7.5181 | 0.0189 | 69.5676 | 10.8% |
 * | 512 | 0.1738 | 15.1354 | 0.0280 | 94.1133 | 16.1% |
 * | 1024 | 0.1827 | 28.7714 | 0.0450 | 116.7420 | 24.6% |
 * | 1280 | 0.1841 | 35.6792 | 0.0538 | 122.0089 | 29.2% |
 * | 2048 | 0.1864 | 56.3694 | 0.0800 | 131.3671 | 42.9% |
 * | 4096 | 0.2025 | 103.7604 | 0.1455 | 144.4065 | 71.9% |
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
 * | 32 | 0.1620 | 1.6698 | 0.0130 | 20.7764 | 8.0% |
 * | 64 | 0.1666 | 3.1994 | 0.0143 | 37.3453 | 8.6% |
 * | 128 | 0.2346 | 4.5081 | 0.0143 | 73.7857 | 6.1% |
 * | 256 | 0.2723 | 7.7382 | 0.0244 | 86.3685 | 9.0% |
 * | 512 | 0.2704 | 15.5560 | 0.0375 | 112.1160 | 13.9% |
 * | 1024 | 0.2864 | 29.3421 | 0.0674 | 124.7179 | 23.5% |
 * | 1280 | 0.2877 | 36.5135 | 0.0797 | 131.8033 | 27.7% |
 * | 2048 | 0.8387 | 20.0334 | 0.1222 | 137.4492 | 14.6% |
 * | 4096 | 1.6117 | 20.8445 | 0.2265 | 148.3162 | 14.1% |
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
 * | 32 | 0.2257 | 2.3971 | 0.0184 | 29.3472 | 8.2% |
 * | 64 | 0.3548 | 3.0034 | 0.0162 | 65.8024 | 4.6% |
 * | 128 | 0.4232 | 4.9962 | 0.0265 | 79.9033 | 6.3% |
 * | 256 | 0.4249 | 9.9136 | 0.0397 | 106.2106 | 9.3% |
 * | 512 | 0.4260 | 19.7404 | 0.0655 | 128.3125 | 15.4% |
 * | 1024 | 0.4457 | 37.7006 | 0.1254 | 133.9770 | 28.1% |
 * | 1280 | 0.4559 | 46.0631 | 0.1510 | 139.0237 | 33.1% |
 * | 2048 | 0.4582 | 73.2986 | 0.2357 | 142.5215 | 51.4% |
 * | 4096 | 0.5281 | 127.1701 | 1.1035 | 60.8580 | 209.0% |
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
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
