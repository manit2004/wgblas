/**
 * Benchmark results for dsyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 1.1429 | 0.0041 | 2.1250 | 53.8% |
 * | 64 | 0.0082 | 4.1250 | 0.0039 | 8.6914 | 47.5% |
 * | 128 | 0.0083 | 16.0000 | 0.0041 | 32.5000 | 49.2% |
 * | 256 | 0.0102 | 51.6000 | 0.0058 | 91.7333 | 56.3% |
 * | 512 | 0.0200 | 105.4359 | 0.0134 | 156.6476 | 67.3% |
 * | 1024 | 0.0631 | 133.2941 | 0.0530 | 158.7045 | 84.0% |
 * | 1280 | 0.1024 | 128.2000 | 0.0882 | 148.7994 | 86.2% |
 * | 2048 | 0.2188 | 153.5289 | 0.2010 | 167.0805 | 91.9% |
 * | 4096 | 0.8848 | 151.7586 | 0.8187 | 164.0289 | 92.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dsyr-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-default.svg)
 *
 * ![dsyr-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-default.svg)
 *
 * ## See also
 *
 * - [dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/dsyr.js) — WebGPU benchmark script
 * - [dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/dsyr.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0082 | 1.0625 | 0.0037 | 2.3652 | 44.9% |
 * | 64 | 0.0083 | 4.0772 | 0.0039 | 8.7273 | 46.7% |
 * | 128 | 0.0095 | 13.9597 | 0.0042 | 31.7557 | 44.0% |
 * | 256 | 0.0139 | 38.0900 | 0.0060 | 88.2995 | 43.1% |
 * | 512 | 0.0281 | 74.8061 | 0.0133 | 158.1539 | 47.3% |
 * | 1024 | 0.0737 | 114.0000 | 0.0531 | 158.2265 | 72.0% |
 * | 1280 | 0.1085 | 121.0147 | 0.0867 | 151.4360 | 79.9% |
 * | 2048 | 0.2519 | 133.3333 | 0.2011 | 167.0008 | 79.8% |
 * | 4096 | 0.9359 | 143.4748 | 0.8266 | 162.4572 | 88.3% |
 *
 * ![dsyr-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride4.svg)
 *
 * ![dsyr-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 1.2891 | 0.0037 | 2.3550 | 54.7% |
 * | 64 | 0.0071 | 4.7568 | 0.0038 | 8.8000 | 54.1% |
 * | 128 | 0.0081 | 16.5079 | 0.0041 | 32.5000 | 50.8% |
 * | 256 | 0.0102 | 51.6000 | 0.0058 | 90.7253 | 56.9% |
 * | 512 | 0.0220 | 95.4891 | 0.0135 | 155.7207 | 61.3% |
 * | 1024 | 0.0635 | 132.3871 | 0.0530 | 158.5130 | 83.5% |
 * | 1280 | 0.0953 | 137.7338 | 0.0874 | 150.2711 | 91.7% |
 * | 2048 | 0.2213 | 151.7969 | 0.2010 | 167.1071 | 90.8% |
 * | 4096 | 0.8479 | 158.3768 | 0.8296 | 161.8744 | 97.8% |
 *
 * ![dsyr-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride5.svg)
 *
 * ![dsyr-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 1.2830 | 0.0037 | 2.3248 | 55.2% |
 * | 64 | 0.0073 | 4.6316 | 0.0038 | 8.9872 | 51.5% |
 * | 128 | 0.0092 | 14.4194 | 0.0041 | 32.2481 | 44.7% |
 * | 256 | 0.0175 | 30.2141 | 0.0061 | 86.4503 | 34.9% |
 * | 512 | 0.0436 | 48.3232 | 0.0140 | 150.2101 | 32.2% |
 * | 1024 | 0.1495 | 56.2192 | 0.0532 | 157.9411 | 35.6% |
 * | 1280 | 0.2670 | 49.1718 | 0.0915 | 143.4657 | 34.3% |
 * | 2048 | 0.6805 | 49.3581 | 0.2042 | 164.4754 | 30.0% |
 * | 4096 | 2.5703 | 52.2451 | 0.9254 | 145.1046 | 36.0% |
 *
 * ![dsyr-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride32.svg)
 *
 * ![dsyr-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.2952 | 0.0037 | 2.3248 | 55.7% |
 * | 64 | 0.0068 | 5.0047 | 0.0036 | 9.3451 | 53.6% |
 * | 128 | 0.0080 | 16.5737 | 0.0042 | 32.0000 | 51.8% |
 * | 256 | 0.0110 | 48.1399 | 0.0061 | 86.0000 | 56.0% |
 * | 512 | 0.0268 | 78.4639 | 0.0140 | 150.2101 | 52.2% |
 * | 1024 | 0.1004 | 83.7551 | 0.0532 | 157.8461 | 53.1% |
 * | 1280 | 0.1556 | 84.3421 | 0.0922 | 142.4444 | 59.2% |
 * | 2048 | 0.3975 | 84.4953 | 0.2053 | 163.5655 | 51.7% |
 * | 4096 | 1.6056 | 83.6327 | 0.9400 | 142.8497 | 58.5% |
 *
 * ![dsyr-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride33.svg)
 *
 * ![dsyr-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.3014 | 0.0037 | 2.3550 | 55.3% |
 * | 64 | 0.0071 | 4.7568 | 0.0038 | 8.8739 | 53.6% |
 * | 128 | 0.0080 | 16.5737 | 0.0041 | 32.5000 | 51.0% |
 * | 256 | 0.0109 | 48.3514 | 0.0061 | 86.0000 | 56.2% |
 * | 512 | 0.0267 | 78.7928 | 0.0137 | 153.3613 | 51.4% |
 * | 1024 | 0.1024 | 82.0800 | 0.0532 | 157.9411 | 52.0% |
 * | 1280 | 0.1587 | 82.7013 | 0.0921 | 142.5434 | 58.0% |
 * | 2048 | 0.4018 | 83.5968 | 0.2048 | 164.0256 | 51.0% |
 * | 4096 | 1.9178 | 70.0203 | 0.9522 | 141.0207 | 49.7% |
 *
 * ![dsyr-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride255.svg)
 *
 * ![dsyr-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.2952 | 0.0039 | 2.2295 | 58.1% |
 * | 64 | 0.0072 | 4.7143 | 0.0040 | 8.4143 | 56.0% |
 * | 128 | 0.0093 | 14.2466 | 0.0042 | 31.7557 | 44.9% |
 * | 256 | 0.0172 | 30.6914 | 0.0059 | 89.7391 | 34.2% |
 * | 512 | 0.0432 | 48.6807 | 0.0141 | 149.5273 | 32.6% |
 * | 1024 | 0.1475 | 56.9876 | 0.0532 | 158.0837 | 36.0% |
 * | 1280 | 0.2238 | 58.6602 | 0.0922 | 142.4444 | 41.2% |
 * | 2048 | 0.5475 | 61.3425 | 0.2045 | 164.2053 | 37.4% |
 * | 4096 | 2.1299 | 63.0480 | 0.9555 | 140.5319 | 44.9% |
 *
 * ![dsyr-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-stride256.svg)
 *
 * ![dsyr-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/stride.dsyr.js) — WebGPU stride-sweep benchmark script
 * - [stride.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/stride.dsyr.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0066 | 1.3204 | 0.0036 | 2.3860 | 55.3% |
 * | 64 | 0.0069 | 4.9231 | 0.0037 | 9.1034 | 54.1% |
 * | 128 | 0.0076 | 17.4423 | 0.0041 | 32.5000 | 53.7% |
 * | 256 | 0.0101 | 52.1706 | 0.0058 | 91.7333 | 56.9% |
 * | 512 | 0.0210 | 100.1400 | 0.0130 | 162.2491 | 61.7% |
 * | 1024 | 0.0614 | 136.8000 | 0.0531 | 158.4174 | 86.4% |
 * | 1280 | 0.0928 | 141.4621 | 0.0870 | 150.8790 | 93.8% |
 * | 2048 | 0.2172 | 154.6144 | 0.2006 | 167.4003 | 92.4% |
 * | 4096 | 0.8274 | 162.2908 | 0.8187 | 164.0193 | 98.9% |
 *
 * ![dsyr-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-uplolower.svg)
 *
 * ![dsyr-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3236 | 0.0040 | 2.1587 | 61.3% |
 * | 64 | 0.0067 | 5.0286 | 0.0040 | 8.5161 | 59.0% |
 * | 128 | 0.0076 | 17.4790 | 0.0041 | 32.2481 | 54.2% |
 * | 256 | 0.0097 | 54.6755 | 0.0058 | 91.7333 | 59.6% |
 * | 512 | 0.0190 | 110.5748 | 0.0135 | 156.4614 | 70.7% |
 * | 1024 | 0.0631 | 133.1927 | 0.0532 | 157.8461 | 84.4% |
 * | 1280 | 0.1004 | 130.8163 | 0.0871 | 150.6574 | 86.8% |
 * | 2048 | 0.2239 | 150.0286 | 0.2007 | 167.3469 | 89.7% |
 * | 4096 | 0.8519 | 157.6213 | 0.8172 | 164.3308 | 95.9% |
 *
 * ![dsyr-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-uploupper.svg)
 *
 * ![dsyr-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/uplo.dsyr.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/uplo.dsyr.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0066 | 1.3204 | 0.0037 | 2.3550 | 56.1% |
 * | 64 | 0.0068 | 4.9577 | 0.0037 | 9.0644 | 54.7% |
 * | 128 | 0.0077 | 17.2614 | 0.0041 | 32.5000 | 53.1% |
 * | 256 | 0.0101 | 52.2532 | 0.0058 | 91.7333 | 57.0% |
 * | 512 | 0.0211 | 99.7604 | 0.0129 | 162.8515 | 61.3% |
 * | 1024 | 0.0614 | 136.8000 | 0.0529 | 158.8005 | 86.1% |
 * | 1280 | 0.0932 | 140.8308 | 0.0867 | 151.4360 | 93.0% |
 * | 2048 | 0.2173 | 154.5347 | 0.2011 | 167.0008 | 92.5% |
 * | 4096 | 0.8311 | 161.5722 | 0.8211 | 163.5367 | 98.8% |
 *
 * ![dsyr-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad0.svg)
 *
 * ![dsyr-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3204 | 0.0038 | 2.2857 | 57.8% |
 * | 64 | 0.0067 | 5.0526 | 0.0041 | 8.2500 | 61.2% |
 * | 128 | 0.0078 | 17.0143 | 0.0044 | 29.9281 | 56.9% |
 * | 256 | 0.0102 | 51.6000 | 0.0063 | 83.3939 | 61.9% |
 * | 512 | 0.0220 | 95.9067 | 0.0184 | 114.3215 | 83.9% |
 * | 1024 | 0.0655 | 128.2500 | 0.0672 | 125.0148 | 102.6% |
 * | 1280 | 0.1066 | 123.1582 | 0.1262 | 104.0030 | 118.4% |
 * | 2048 | 0.2334 | 143.9287 | 0.2601 | 129.1339 | 111.5% |
 *
 * ![dsyr-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad1.svg)
 *
 * ![dsyr-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 1.2800 | 0.0037 | 2.3652 | 54.1% |
 * | 64 | 0.0068 | 5.0047 | 0.0041 | 8.2500 | 60.7% |
 * | 128 | 0.0076 | 17.4790 | 0.0041 | 32.3735 | 54.0% |
 * | 256 | 0.0102 | 51.6000 | 0.0057 | 93.0254 | 55.5% |
 * | 512 | 0.0216 | 97.6142 | 0.0184 | 114.2222 | 85.5% |
 * | 1024 | 0.0655 | 128.2500 | 0.0595 | 141.3269 | 90.7% |
 * | 1280 | 0.1088 | 120.6056 | 0.1176 | 111.5996 | 108.1% |
 * | 2048 | 0.2377 | 141.2746 | 0.3012 | 111.4994 | 126.7% |
 *
 * ![dsyr-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad8.svg)
 *
 * ![dsyr-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 1.3268 | 0.0038 | 2.2954 | 57.8% |
 * | 64 | 0.0067 | 5.0526 | 0.0037 | 9.1034 | 55.5% |
 * | 128 | 0.0078 | 17.0842 | 0.0041 | 32.3735 | 52.8% |
 * | 256 | 0.0102 | 51.6000 | 0.0059 | 90.2295 | 57.2% |
 * | 512 | 0.0216 | 97.6142 | 0.0143 | 146.8571 | 66.5% |
 * | 1024 | 0.0636 | 132.1540 | 0.0574 | 146.4897 | 90.2% |
 * | 1280 | 0.1020 | 128.7027 | 0.1102 | 119.0827 | 108.1% |
 * | 2048 | 0.2458 | 136.6400 | 0.2540 | 132.2581 | 103.3% |
 *
 * ![dsyr-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad16.svg)
 *
 * ![dsyr-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0625 | 0.0037 | 2.3248 | 45.7% |
 * | 64 | 0.0082 | 4.1089 | 0.0037 | 9.1429 | 44.9% |
 * | 128 | 0.0095 | 13.9832 | 0.0041 | 32.5000 | 43.0% |
 * | 256 | 0.0125 | 42.2302 | 0.0057 | 92.7640 | 45.5% |
 * | 512 | 0.0259 | 81.2749 | 0.0143 | 146.8571 | 55.3% |
 * | 1024 | 0.0835 | 100.6538 | 0.0541 | 155.2799 | 64.8% |
 * | 1280 | 0.1226 | 107.0843 | 0.0842 | 155.9255 | 68.7% |
 * | 2048 | 0.2805 | 119.7353 | 0.2149 | 156.2719 | 76.6% |
 *
 * ![dsyr-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad32.svg)
 *
 * ![dsyr-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 0.8144 | 0.0041 | 2.1333 | 38.2% |
 * | 64 | 0.0111 | 3.0476 | 0.0038 | 8.8739 | 34.3% |
 * | 128 | 0.0124 | 10.7216 | 0.0041 | 32.5000 | 33.0% |
 * | 256 | 0.0174 | 30.4369 | 0.0057 | 93.0254 | 32.7% |
 * | 512 | 0.0350 | 60.0840 | 0.0163 | 129.5118 | 46.4% |
 * | 1024 | 0.0932 | 90.1668 | 0.0655 | 128.2500 | 70.3% |
 * | 1280 | 0.1326 | 98.9723 | 0.1082 | 121.3010 | 81.6% |
 * | 2048 | 0.3181 | 105.5829 | 0.2681 | 125.2655 | 84.3% |
 *
 * ![dsyr-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad48.svg)
 *
 * ![dsyr-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0121 | 0.7167 | 0.0037 | 2.3248 | 30.8% |
 * | 64 | 0.0123 | 2.7500 | 0.0037 | 9.1826 | 29.9% |
 * | 128 | 0.0137 | 9.7196 | 0.0042 | 31.7557 | 30.6% |
 * | 256 | 0.0185 | 28.6170 | 0.0056 | 93.8182 | 30.5% |
 * | 512 | 0.0383 | 55.0100 | 0.0142 | 148.5147 | 37.0% |
 * | 1024 | 0.1021 | 82.3373 | 0.0573 | 146.5714 | 56.2% |
 * | 1280 | 0.1450 | 90.5607 | 0.0847 | 155.0123 | 58.4% |
 * | 2048 | 0.3354 | 100.1288 | 0.2086 | 161.0310 | 62.2% |
 *
 * ![dsyr-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad64.svg)
 *
 * ![dsyr-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0125 | 0.6983 | 0.0037 | 2.3652 | 29.5% |
 * | 64 | 0.0133 | 2.5415 | 0.0037 | 9.1429 | 27.8% |
 * | 128 | 0.0143 | 9.2857 | 0.0041 | 32.5000 | 28.6% |
 * | 256 | 0.0202 | 26.1473 | 0.0057 | 93.2881 | 28.0% |
 * | 512 | 0.0408 | 51.5409 | 0.0143 | 146.8571 | 35.1% |
 * | 1024 | 0.1095 | 76.7776 | 0.0573 | 146.6533 | 52.4% |
 * | 1280 | 0.1591 | 82.5184 | 0.0878 | 149.5589 | 55.2% |
 * | 2048 | 0.3707 | 90.6077 | 0.2331 | 144.0966 | 62.9% |
 *
 * ![dsyr-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-pad128.svg)
 *
 * ![dsyr-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/lda.dsyr.js) — WebGPU lda-sweep benchmark script
 * - [lda.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/lda.dsyr.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0081 | 1.0794 | 0.0040 | 2.1847 | 49.4% |
 * | 64 | 0.0082 | 4.1250 | 0.0038 | 8.9872 | 45.9% |
 * | 128 | 0.0089 | 14.8837 | 0.0041 | 32.2481 | 46.2% |
 * | 256 | 0.0124 | 42.4473 | 0.0061 | 86.4503 | 49.1% |
 * | 512 | 0.0226 | 93.2558 | 0.0154 | 136.6397 | 68.2% |
 * | 1024 | 0.0614 | 136.8356 | 0.0530 | 158.6566 | 86.2% |
 * | 1280 | 0.0939 | 139.8704 | 0.0876 | 149.8320 | 93.4% |
 * | 2048 | 0.2175 | 154.4324 | 0.2020 | 166.2733 | 92.9% |
 * | 4096 | 0.8294 | 161.8963 | 0.8181 | 164.1444 | 98.6% |
 *
 * ![dsyr-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alphaneg3p75.svg)
 *
 * ![dsyr-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0096 | 0.9097 | 0.0016 | 5.3861 | 16.9% |
 * | 64 | 0.0097 | 3.4909 | 0.0013 | 25.1429 | 13.9% |
 * | 128 | 0.0106 | 12.5680 | 0.0014 | 94.5455 | 13.3% |
 * | 256 | 0.0140 | 37.8716 | 0.0013 | 393.1429 | 9.6% |
 * | 512 | 0.0265 | 79.4589 | 0.0014 | 1495.2728 | 5.3% |
 * | 1024 | 0.0657 | 127.9377 | 0.0014 | 5902.3813 | 2.2% |
 * | 1280 | 0.1004 | 130.8163 | 0.0016 | 8372.2451 | 1.6% |
 * | 2048 | 0.2281 | 147.2606 | 0.0014 | 23324.4434 | 0.6% |
 * | 4096 | 0.8476 | 158.4187 | 0.0015 | 89284.0781 | 0.2% |
 *
 * ![dsyr-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha0.svg)
 *
 * ![dsyr-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0625 | 0.0038 | 2.2667 | 46.9% |
 * | 64 | 0.0080 | 4.1988 | 0.0039 | 8.6914 | 48.3% |
 * | 128 | 0.0090 | 14.8571 | 0.0042 | 31.6350 | 47.0% |
 * | 256 | 0.0126 | 42.0688 | 0.0061 | 86.6772 | 48.5% |
 * | 512 | 0.0226 | 92.9922 | 0.0140 | 149.8679 | 62.0% |
 * | 1024 | 0.0614 | 136.8000 | 0.0529 | 158.8965 | 86.1% |
 * | 1280 | 0.0940 | 139.6324 | 0.0871 | 150.6850 | 92.7% |
 * | 2048 | 0.2175 | 154.4097 | 0.2013 | 166.8150 | 92.6% |
 * | 4096 | 0.8294 | 161.8963 | 0.8183 | 164.1091 | 98.7% |
 *
 * ![dsyr-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha1eneg38.svg)
 *
 * ![dsyr-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0625 | 0.0038 | 2.2667 | 46.9% |
 * | 64 | 0.0084 | 4.0152 | 0.0038 | 8.9872 | 44.7% |
 * | 128 | 0.0102 | 13.0000 | 0.0042 | 31.5152 | 41.2% |
 * | 256 | 0.0143 | 36.8571 | 0.0060 | 88.7742 | 41.5% |
 * | 512 | 0.0249 | 84.6744 | 0.0158 | 132.9131 | 63.7% |
 * | 1024 | 0.0637 | 131.9879 | 0.0531 | 158.3219 | 83.4% |
 * | 1280 | 0.0981 | 133.8030 | 0.0866 | 151.5758 | 88.3% |
 * | 2048 | 0.2223 | 151.0868 | 0.2018 | 166.4446 | 90.8% |
 * | 4096 | 0.8330 | 161.2090 | 0.8204 | 163.6706 | 98.5% |
 *
 * ![dsyr-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha1.svg)
 *
 * ![dsyr-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 1.0625 | 0.0143 | 0.6071 | 175.0% |
 * | 64 | 0.0082 | 4.1250 | 0.0048 | 7.1111 | 58.0% |
 * | 128 | 0.0090 | 14.7257 | 0.0054 | 24.6884 | 59.6% |
 * | 256 | 0.0126 | 41.9619 | 0.0057 | 92.2458 | 45.5% |
 * | 512 | 0.0227 | 92.6648 | 0.0129 | 163.2556 | 56.8% |
 * | 1024 | 0.0612 | 137.3365 | 0.0532 | 157.8461 | 87.0% |
 * | 1280 | 0.0939 | 139.8466 | 0.0872 | 150.5744 | 92.9% |
 * | 2048 | 0.2176 | 154.3756 | 0.2018 | 166.4183 | 92.8% |
 * | 4096 | 0.8297 | 161.8401 | 0.8185 | 164.0546 | 98.7% |
 *
 * ![dsyr-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-alpha2p5.svg)
 *
 * ![dsyr-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/alpha.dsyr.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dsyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/cuda/alpha.dsyr.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0082 | 1.0625 |
 * | 64 | 0.0071 | 4.7568 |
 * | 128 | 0.0077 | 17.2973 |
 * | 256 | 0.0110 | 48.1399 |
 * | 512 | 0.0211 | 99.9878 |
 * | 1024 | 0.0635 | 132.3871 |
 * | 1280 | 0.1018 | 128.9252 |
 * | 2048 | 0.2239 | 150.0286 |
 * | 4096 | 0.8516 | 157.6924 |
 *
 * ![dsyr-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-layoutcolumnmajor.svg)
 *
 * ![dsyr-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0066 | 1.3204 |
 * | 64 | 0.0072 | 4.6726 |
 * | 128 | 0.0091 | 14.5965 |
 * | 256 | 0.0126 | 42.0153 |
 * | 512 | 0.0211 | 99.6848 |
 * | 1024 | 0.0614 | 136.8000 |
 * | 1280 | 0.0940 | 139.7275 |
 * | 2048 | 0.2190 | 153.3382 |
 * | 4096 | 0.8315 | 161.4975 |
 *
 * ![dsyr-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/gbps-layoutrowmajor.svg)
 *
 * ![dsyr-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsyr/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dsyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsyr/wgblas/layout.dsyr.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dsyr
 */
