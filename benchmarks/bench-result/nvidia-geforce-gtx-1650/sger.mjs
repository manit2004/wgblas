/**
 * Benchmark results for sger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3714 | 0.0034 | 2.4673 | 55.6% |
 * | 64 | 0.0062 | 5.3333 | 0.0035 | 9.4545 | 56.4% |
 * | 128 | 0.0067 | 19.6571 | 0.0036 | 36.5310 | 53.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 114.2222 | 56.3% |
 * | 512 | 0.0164 | 128.2500 | 0.0124 | 169.4555 | 75.7% |
 * | 1024 | 0.0573 | 146.4286 | 0.0558 | 150.5019 | 97.3% |
 * | 1280 | 0.0919 | 142.6801 | 0.0874 | 150.0714 | 95.1% |
 * | 2048 | 0.2195 | 152.9283 | 0.2132 | 157.4262 | 97.1% |
 * | 4096 | 0.8568 | 156.6795 | 0.8472 | 158.4608 | 98.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sger-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-default.svg)
 *
 * ![sger-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-default.svg)
 *
 * ## See also
 *
 * - [sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/sger.js) — WebGPU benchmark script
 * - [sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/sger.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0083 | 1.0193 | 0.0036 | 2.3784 | 42.9% |
 * | 64 | 0.0084 | 3.9544 | 0.0036 | 9.2857 | 42.6% |
 * | 128 | 0.0087 | 15.1209 | 0.0036 | 36.2105 | 41.8% |
 * | 256 | 0.0102 | 51.4000 | 0.0046 | 113.4345 | 45.3% |
 * | 512 | 0.0199 | 105.6541 | 0.0139 | 151.2995 | 69.8% |
 * | 1024 | 0.0602 | 139.4632 | 0.0559 | 150.2864 | 92.8% |
 * | 1280 | 0.0942 | 139.2391 | 0.0876 | 149.7972 | 93.0% |
 * | 2048 | 0.2232 | 150.4284 | 0.2136 | 157.1785 | 95.7% |
 * | 4096 | 0.8622 | 155.7055 | 0.8479 | 158.3382 | 98.3% |
 *
 * ![sger-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride4.svg)
 *
 * ![sger-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 1.0115 | 0.0035 | 2.4110 | 42.0% |
 * | 64 | 0.0085 | 3.9245 | 0.0034 | 9.7196 | 40.4% |
 * | 128 | 0.0088 | 15.0932 | 0.0036 | 36.3700 | 41.5% |
 * | 256 | 0.0102 | 51.4000 | 0.0046 | 113.4345 | 45.3% |
 * | 512 | 0.0201 | 104.5605 | 0.0143 | 146.5714 | 71.3% |
 * | 1024 | 0.0602 | 139.5003 | 0.0561 | 149.5583 | 93.3% |
 * | 1280 | 0.0944 | 138.9795 | 0.0877 | 149.6332 | 92.9% |
 * | 2048 | 0.2232 | 150.4284 | 0.2135 | 157.2492 | 95.7% |
 * | 4096 | 0.8626 | 155.6304 | 0.8479 | 158.3411 | 98.3% |
 *
 * ![sger-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride5.svg)
 *
 * ![sger-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 1.0134 | 0.0035 | 2.4332 | 41.7% |
 * | 64 | 0.0086 | 3.8662 | 0.0035 | 9.5413 | 40.5% |
 * | 128 | 0.0089 | 14.8489 | 0.0037 | 35.8956 | 41.4% |
 * | 256 | 0.0103 | 51.0807 | 0.0048 | 110.7610 | 46.1% |
 * | 512 | 0.0218 | 96.2815 | 0.0173 | 121.1513 | 79.5% |
 * | 1024 | 0.0610 | 137.6344 | 0.0567 | 148.1649 | 92.9% |
 * | 1280 | 0.0950 | 138.1132 | 0.0880 | 149.0618 | 92.7% |
 * | 2048 | 0.2235 | 150.1916 | 0.2147 | 156.3819 | 96.0% |
 * | 4096 | 0.8639 | 155.4027 | 0.9693 | 138.5031 | 112.2% |
 *
 * ![sger-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride32.svg)
 *
 * ![sger-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 1.0076 | 0.0034 | 2.4906 | 40.5% |
 * | 64 | 0.0084 | 3.9394 | 0.0035 | 9.4118 | 41.9% |
 * | 128 | 0.0089 | 14.8223 | 0.0038 | 35.1319 | 42.2% |
 * | 256 | 0.0102 | 51.4000 | 0.0047 | 112.2730 | 45.8% |
 * | 512 | 0.0211 | 99.4909 | 0.0170 | 123.4286 | 80.6% |
 * | 1024 | 0.0610 | 137.5623 | 0.0559 | 150.3294 | 91.5% |
 * | 1280 | 0.0955 | 137.3266 | 0.0872 | 150.4018 | 91.3% |
 * | 2048 | 0.2237 | 150.0841 | 0.2130 | 157.6154 | 95.2% |
 * | 4096 | 0.8643 | 155.3365 | 0.9642 | 139.2363 | 111.6% |
 *
 * ![sger-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride33.svg)
 *
 * ![sger-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 1.0019 | 0.0037 | 2.2857 | 43.8% |
 * | 64 | 0.0087 | 3.8235 | 0.0035 | 9.5853 | 39.9% |
 * | 128 | 0.0093 | 14.2591 | 0.0037 | 35.2821 | 40.4% |
 * | 256 | 0.0102 | 51.4000 | 0.0047 | 111.1351 | 46.3% |
 * | 512 | 0.0220 | 95.3033 | 0.0163 | 128.7529 | 74.0% |
 * | 1024 | 0.0614 | 136.6667 | 0.0561 | 149.6009 | 91.4% |
 * | 1280 | 0.0962 | 136.4126 | 0.0877 | 149.6332 | 91.2% |
 * | 2048 | 0.2255 | 148.8807 | 0.2136 | 157.1667 | 94.7% |
 * | 4096 | 0.8663 | 154.9693 | 0.9934 | 135.1479 | 114.7% |
 *
 * ![sger-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride255.svg)
 *
 * ![sger-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0085 | 0.9888 | 0.0036 | 2.3363 | 42.3% |
 * | 64 | 0.0087 | 3.8376 | 0.0037 | 8.9655 | 42.8% |
 * | 128 | 0.0090 | 14.6904 | 0.0036 | 36.2105 | 40.6% |
 * | 256 | 0.0103 | 50.9226 | 0.0047 | 111.1351 | 45.8% |
 * | 512 | 0.0220 | 95.5808 | 0.0175 | 120.2637 | 79.5% |
 * | 1024 | 0.0615 | 136.6311 | 0.0568 | 147.8726 | 92.4% |
 * | 1280 | 0.0961 | 136.5262 | 0.0881 | 148.9535 | 91.7% |
 * | 2048 | 0.2254 | 148.9336 | 0.2149 | 156.1956 | 95.4% |
 * | 4096 | 0.8641 | 155.3566 | 1.0056 | 133.5071 | 116.4% |
 *
 * ![sger-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride256.svg)
 *
 * ![sger-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/stride.sger.js) — WebGPU stride-sweep benchmark script
 * - [stride.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/stride.sger.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0063 | 1.3504 | 0.0036 | 2.3571 | 57.3% |
 * | 64 | 0.0063 | 5.3061 | 0.0036 | 9.2857 | 57.1% |
 * | 128 | 0.0067 | 19.6571 | 0.0036 | 36.8571 | 53.3% |
 * | 256 | 0.0082 | 64.0000 | 0.0046 | 114.2222 | 56.0% |
 * | 512 | 0.0164 | 128.2500 | 0.0124 | 169.6744 | 75.6% |
 * | 1024 | 0.0573 | 146.4286 | 0.0557 | 150.8479 | 97.1% |
 * | 1280 | 0.0920 | 142.6553 | 0.0875 | 149.8793 | 95.2% |
 * | 2048 | 0.2196 | 152.8392 | 0.2132 | 157.4852 | 97.0% |
 * | 4096 | 0.8576 | 156.5392 | 0.8477 | 158.3710 | 98.8% |
 *
 * ![sger-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad0.svg)
 *
 * ![sger-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.4673 | 55.7% |
 * | 64 | 0.0064 | 5.2000 | 0.0037 | 9.0435 | 57.5% |
 * | 128 | 0.0073 | 18.1053 | 0.0037 | 36.0524 | 50.2% |
 * | 256 | 0.0086 | 61.0315 | 0.0050 | 104.7643 | 58.3% |
 * | 512 | 0.0175 | 119.9342 | 0.0149 | 141.2129 | 84.9% |
 * | 1024 | 0.0596 | 140.9995 | 0.0739 | 113.6915 | 124.0% |
 * | 1280 | 0.0959 | 136.8224 | 0.1166 | 112.5226 | 121.6% |
 * | 2048 | 0.2232 | 150.3853 | 0.2933 | 114.4480 | 131.4% |
 * | 4096 | 0.8655 | 155.1068 | 1.1804 | 113.7300 | 136.4% |
 *
 * ![sger-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad1.svg)
 *
 * ![sger-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0036 | 2.3784 | 57.8% |
 * | 64 | 0.0064 | 5.1741 | 0.0036 | 9.3694 | 55.2% |
 * | 128 | 0.0070 | 18.8924 | 0.0036 | 37.1892 | 50.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 115.0210 | 55.9% |
 * | 512 | 0.0180 | 116.6323 | 0.0165 | 127.3792 | 91.6% |
 * | 1024 | 0.0609 | 137.8513 | 0.0733 | 114.5351 | 120.4% |
 * | 1280 | 0.0964 | 136.0504 | 0.1158 | 113.2532 | 120.1% |
 * | 2048 | 0.2216 | 151.4600 | 0.2970 | 113.0422 | 134.0% |
 * | 4096 | 0.8535 | 157.2933 | 1.1748 | 114.2768 | 137.6% |
 *
 * ![sger-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad8.svg)
 *
 * ![sger-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.4673 | 55.7% |
 * | 64 | 0.0064 | 5.2130 | 0.0036 | 9.3274 | 55.9% |
 * | 128 | 0.0068 | 19.2897 | 0.0036 | 36.5310 | 52.8% |
 * | 256 | 0.0085 | 61.9510 | 0.0046 | 115.0210 | 53.9% |
 * | 512 | 0.0184 | 114.1983 | 0.0182 | 115.3011 | 99.0% |
 * | 1024 | 0.0604 | 138.9463 | 0.0733 | 114.4852 | 121.4% |
 * | 1280 | 0.0925 | 141.7672 | 0.1166 | 112.4918 | 126.0% |
 * | 2048 | 0.2246 | 149.4853 | 0.2938 | 114.2548 | 130.8% |
 * | 4096 | 0.8576 | 156.5362 | 1.1855 | 113.2403 | 138.2% |
 *
 * ![sger-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad16.svg)
 *
 * ![sger-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3608 | 0.0036 | 2.3158 | 58.8% |
 * | 64 | 0.0062 | 5.4026 | 0.0033 | 10.0000 | 54.0% |
 * | 128 | 0.0069 | 19.2000 | 0.0036 | 37.1892 | 51.6% |
 * | 256 | 0.0082 | 64.0000 | 0.0046 | 115.0210 | 55.6% |
 * | 512 | 0.0171 | 123.0815 | 0.0150 | 140.1579 | 87.8% |
 * | 1024 | 0.0594 | 141.3793 | 0.0562 | 149.3455 | 94.7% |
 * | 1280 | 0.0901 | 145.5940 | 0.0880 | 149.0076 | 97.7% |
 * | 2048 | 0.2197 | 152.7724 | 0.2190 | 153.2634 | 99.7% |
 * | 4096 | 0.8917 | 150.5591 | 0.8622 | 155.7055 | 96.7% |
 *
 * ![sger-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad32.svg)
 *
 * ![sger-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3538 | 0.0035 | 2.4332 | 55.6% |
 * | 64 | 0.0064 | 5.1741 | 0.0035 | 9.5413 | 54.2% |
 * | 128 | 0.0071 | 18.7211 | 0.0036 | 37.1892 | 50.3% |
 * | 256 | 0.0084 | 62.4213 | 0.0047 | 113.0447 | 55.2% |
 * | 512 | 0.0184 | 114.0000 | 0.0188 | 111.8637 | 101.9% |
 * | 1024 | 0.0613 | 136.8805 | 0.0747 | 112.4491 | 121.7% |
 * | 1280 | 0.0932 | 140.7692 | 0.1184 | 110.7742 | 127.1% |
 * | 2048 | 0.2287 | 146.8180 | 0.2945 | 113.9817 | 128.8% |
 * | 4096 | 0.8724 | 153.8779 | 1.1878 | 113.0207 | 136.2% |
 *
 * ![sger-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad48.svg)
 *
 * ![sger-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3538 | 0.0036 | 2.3158 | 58.5% |
 * | 64 | 0.0063 | 5.2792 | 0.0036 | 9.2857 | 56.9% |
 * | 128 | 0.0069 | 19.2000 | 0.0036 | 37.1892 | 51.6% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 114.2222 | 56.3% |
 * | 512 | 0.0174 | 120.4844 | 0.0150 | 140.0085 | 86.1% |
 * | 1024 | 0.0610 | 137.5623 | 0.0570 | 147.2916 | 93.4% |
 * | 1280 | 0.0902 | 145.3617 | 0.0886 | 148.0925 | 98.2% |
 * | 2048 | 0.2285 | 146.9414 | 0.2230 | 150.5364 | 97.6% |
 * | 4096 | 0.8840 | 151.8643 | 0.8805 | 152.4770 | 99.6% |
 *
 * ![sger-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad64.svg)
 *
 * ![sger-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3643 | 0.0035 | 2.4220 | 56.3% |
 * | 64 | 0.0065 | 5.1485 | 0.0035 | 9.5413 | 54.0% |
 * | 128 | 0.0069 | 19.1555 | 0.0037 | 36.0524 | 53.1% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 115.0210 | 55.9% |
 * | 512 | 0.0181 | 116.0141 | 0.0155 | 135.6694 | 85.5% |
 * | 1024 | 0.0594 | 141.3793 | 0.0570 | 147.2090 | 96.0% |
 * | 1280 | 0.0920 | 142.5809 | 0.0880 | 149.0347 | 95.7% |
 * | 2048 | 0.2327 | 144.2839 | 0.2274 | 147.6341 | 97.7% |
 * | 4096 | 0.9667 | 138.8814 | 0.9056 | 148.2422 | 93.7% |
 *
 * ![sger-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad128.svg)
 *
 * ![sger-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/lda.sger.js) — WebGPU lda-sweep benchmark script
 * - [lda.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/lda.sger.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0062 | 1.3608 | 0.0035 | 2.4444 | 55.7% |
 * | 64 | 0.0062 | 5.3333 | 0.0035 | 9.5413 | 55.9% |
 * | 128 | 0.0067 | 19.7512 | 0.0036 | 36.8571 | 53.6% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 115.0210 | 55.9% |
 * | 512 | 0.0164 | 128.2500 | 0.0128 | 164.1600 | 78.1% |
 * | 1024 | 0.0573 | 146.4286 | 0.0558 | 150.4587 | 97.3% |
 * | 1280 | 0.0921 | 142.4075 | 0.0875 | 149.9890 | 94.9% |
 * | 2048 | 0.2199 | 152.6723 | 0.2133 | 157.4144 | 97.0% |
 * | 4096 | 0.8580 | 156.4604 | 0.8476 | 158.3800 | 98.8% |
 *
 * ![sger-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alphaneg3p75.svg)
 *
 * ![sger-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0017 | 5.0769 | 27.1% |
 * | 64 | 0.0062 | 5.3470 | 0.0015 | 22.6087 | 23.7% |
 * | 128 | 0.0067 | 19.7512 | 0.0016 | 83.3939 | 23.7% |
 * | 256 | 0.0082 | 64.1248 | 0.0015 | 353.7204 | 18.1% |
 * | 512 | 0.0164 | 128.2500 | 0.0015 | 1397.1063 | 9.2% |
 * | 1024 | 0.0573 | 146.4286 | 0.0015 | 5704.3477 | 2.6% |
 * | 1280 | 0.0921 | 142.4322 | 0.0015 | 8721.7021 | 1.6% |
 * | 2048 | 0.2198 | 152.7390 | 0.0016 | 21193.6973 | 0.7% |
 * | 4096 | 0.8581 | 156.4487 | 0.0015 | 91202.7812 | 0.2% |
 *
 * ![sger-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha0.svg)
 *
 * ![sger-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3679 | 0.0035 | 2.4444 | 56.0% |
 * | 64 | 0.0062 | 5.3886 | 0.0036 | 9.1630 | 58.8% |
 * | 128 | 0.0067 | 19.7512 | 0.0036 | 36.8571 | 53.6% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 113.4345 | 56.6% |
 * | 512 | 0.0164 | 128.2500 | 0.0128 | 164.1600 | 78.1% |
 * | 1024 | 0.0573 | 146.4286 | 0.0556 | 151.0650 | 96.9% |
 * | 1280 | 0.0921 | 142.4570 | 0.0873 | 150.2915 | 94.8% |
 * | 2048 | 0.2199 | 152.6835 | 0.2132 | 157.4498 | 97.0% |
 * | 4096 | 0.8566 | 156.7234 | 0.8475 | 158.4009 | 98.9% |
 *
 * ![sger-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha1eneg38.svg)
 *
 * ![sger-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0039 | 2.1818 | 63.0% |
 * | 64 | 0.0063 | 5.2525 | 0.0036 | 9.1228 | 57.6% |
 * | 128 | 0.0066 | 20.0388 | 0.0036 | 36.5310 | 54.9% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 114.2222 | 56.3% |
 * | 512 | 0.0164 | 128.2500 | 0.0128 | 164.7779 | 77.8% |
 * | 1024 | 0.0573 | 146.4286 | 0.0557 | 150.7180 | 97.2% |
 * | 1280 | 0.0922 | 142.3333 | 0.0875 | 149.9342 | 94.9% |
 * | 2048 | 0.2195 | 152.9283 | 0.2132 | 157.4616 | 97.1% |
 * | 4096 | 0.8569 | 156.6678 | 0.8476 | 158.3920 | 98.9% |
 *
 * ![sger-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha1.svg)
 *
 * ![sger-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 1.3608 | 0.0035 | 2.3891 | 57.0% |
 * | 64 | 0.0063 | 5.2525 | 0.0036 | 9.2857 | 56.6% |
 * | 128 | 0.0066 | 19.9420 | 0.0036 | 37.1892 | 53.6% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 113.8270 | 56.4% |
 * | 512 | 0.0164 | 128.2500 | 0.0129 | 162.5347 | 78.9% |
 * | 1024 | 0.0573 | 146.4286 | 0.0558 | 150.4587 | 97.3% |
 * | 1280 | 0.0922 | 142.3333 | 0.0875 | 149.9890 | 94.9% |
 * | 2048 | 0.2194 | 152.9952 | 0.2132 | 157.4971 | 97.1% |
 * | 4096 | 0.8577 | 156.5275 | 0.8477 | 158.3651 | 98.8% |
 *
 * ![sger-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha2p5.svg)
 *
 * ![sger-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/alpha.sger.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/alpha.sger.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0061 | 1.3750 |
 * | 64 | 0.0062 | 5.3470 |
 * | 128 | 0.0067 | 19.6571 |
 * | 256 | 0.0082 | 64.2500 |
 * | 512 | 0.0164 | 128.2500 |
 * | 1024 | 0.0573 | 146.4286 |
 * | 1280 | 0.0920 | 142.6305 |
 * | 2048 | 0.2194 | 152.9952 |
 * | 4096 | 0.8565 | 156.7439 |
 *
 * ![sger-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-layoutcolumnmajor.svg)
 *
 * ![sger-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0062 | 1.3643 |
 * | 64 | 0.0063 | 5.3197 |
 * | 128 | 0.0067 | 19.7041 |
 * | 256 | 0.0082 | 64.2500 |
 * | 512 | 0.0164 | 128.2500 |
 * | 1024 | 0.0573 | 146.4286 |
 * | 1280 | 0.0921 | 142.4818 |
 * | 2048 | 0.2195 | 152.9394 |
 * | 4096 | 0.8578 | 156.5012 |
 *
 * ![sger-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-layoutrowmajor.svg)
 *
 * ![sger-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/layout.sger.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sger
 */
