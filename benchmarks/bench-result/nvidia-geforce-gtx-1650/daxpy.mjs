/**
 * Benchmark results for daxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 0.1182 | 0.0028 | 0.2759 | 42.9% |
 * | 64 | 0.0063 | 0.2430 | 0.0027 | 0.5647 | 43.0% |
 * | 128 | 0.0064 | 0.4776 | 0.0028 | 1.1163 | 42.8% |
 * | 512 | 0.0064 | 1.9345 | 0.0029 | 4.1967 | 46.1% |
 * | 1024 | 0.0064 | 3.8209 | 0.0029 | 8.4396 | 45.3% |
 * | 4096 | 0.0065 | 15.2079 | 0.0029 | 34.1333 | 44.6% |
 * | 16384 | 0.0082 | 48.1882 | 0.0040 | 99.0968 | 48.6% |
 * | 65536 | 0.0144 | 108.9845 | 0.0073 | 214.6376 | 50.8% |
 * | 262144 | 0.0443 | 142.0578 | 0.0387 | 162.6876 | 87.3% |
 * | 1048576 | 0.1554 | 161.9506 | 0.1456 | 172.8042 | 93.7% |
 * | 4194304 | 0.6115 | 164.6116 | 0.5740 | 175.3667 | 93.9% |
 * | 16777216 | 2.3267 | 173.0585 | 2.2889 | 175.9147 | 98.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![daxpy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-default.svg)
 *
 * ![daxpy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/daxpy.js) — WebGPU benchmark script
 * - [daxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/cuda/daxpy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0065 | 0.1182 | 0.0028 | 0.2727 | 43.4% |
 * | 64 | 0.0063 | 0.2424 | 0.0028 | 0.5393 | 45.0% |
 * | 128 | 0.0064 | 0.4824 | 0.0030 | 1.0378 | 46.5% |
 * | 512 | 0.0064 | 1.9057 | 0.0037 | 3.3391 | 57.1% |
 * | 1024 | 0.0066 | 3.7463 | 0.0034 | 7.3143 | 51.2% |
 * | 4096 | 0.0075 | 13.0723 | 0.0036 | 27.1858 | 48.1% |
 * | 16384 | 0.0117 | 33.4823 | 0.0062 | 63.0154 | 53.1% |
 * | 65536 | 0.0407 | 38.6871 | 0.0407 | 38.6112 | 100.2% |
 * | 262144 | 0.1495 | 42.0822 | 0.1548 | 40.6341 | 103.6% |
 * | 1048576 | 0.5794 | 43.4349 | 0.6141 | 40.9803 | 106.0% |
 * | 4194304 | 2.2999 | 43.7685 | 2.4446 | 41.1771 | 106.3% |
 *
 * ![daxpy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride4.svg)
 *
 * ![daxpy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.1171 | 0.0029 | 0.2637 | 44.4% |
 * | 64 | 0.0063 | 0.2424 | 0.0029 | 0.5275 | 46.0% |
 * | 128 | 0.0064 | 0.4824 | 0.0029 | 1.0435 | 46.2% |
 * | 512 | 0.0064 | 1.9345 | 0.0033 | 3.7282 | 51.9% |
 * | 1024 | 0.0067 | 3.6923 | 0.0033 | 7.4927 | 49.3% |
 * | 4096 | 0.0080 | 12.3373 | 0.0037 | 26.5974 | 46.4% |
 * | 16384 | 0.0149 | 26.3126 | 0.0099 | 39.8314 | 66.1% |
 * | 65536 | 0.0506 | 31.0794 | 0.0497 | 31.6701 | 98.1% |
 * | 262144 | 0.1876 | 33.5308 | 0.1929 | 32.6158 | 102.8% |
 * | 1048576 | 0.7347 | 34.2530 | 0.7640 | 32.9389 | 104.0% |
 *
 * ![daxpy-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride5.svg)
 *
 * ![daxpy-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.1137 | 0.0028 | 0.2759 | 41.2% |
 * | 64 | 0.0067 | 0.2286 | 0.0028 | 0.5486 | 41.7% |
 * | 128 | 0.0066 | 0.4638 | 0.0032 | 0.9697 | 47.8% |
 * | 512 | 0.0073 | 1.6842 | 0.0037 | 3.2821 | 51.3% |
 * | 1024 | 0.0070 | 3.4909 | 0.0038 | 6.5085 | 53.6% |
 * | 4096 | 0.0143 | 6.8571 | 0.0047 | 20.8271 | 32.9% |
 * | 16384 | 0.0481 | 8.1702 | 0.0266 | 14.7692 | 55.3% |
 * | 65536 | 0.1761 | 8.9302 | 0.1048 | 15.0082 | 59.5% |
 * | 262144 | 0.6907 | 9.1088 | 0.4103 | 15.3336 | 59.4% |
 *
 * ![daxpy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride32.svg)
 *
 * ![daxpy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0064 | 0.2400 | 0.0029 | 0.5304 | 45.2% |
 * | 128 | 0.0067 | 0.4571 | 0.0029 | 1.0549 | 43.3% |
 * | 512 | 0.0069 | 1.7902 | 0.0036 | 3.3982 | 52.7% |
 * | 1024 | 0.0070 | 3.4989 | 0.0036 | 6.7665 | 51.7% |
 * | 4096 | 0.0143 | 6.8571 | 0.0047 | 20.8980 | 32.8% |
 * | 16384 | 0.0509 | 7.7186 | 0.0305 | 12.8940 | 59.9% |
 * | 65536 | 0.1878 | 8.3749 | 0.1194 | 13.1739 | 63.6% |
 * | 262144 | 0.7372 | 8.5337 | 0.4851 | 12.9697 | 65.8% |
 *
 * ![daxpy-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride33.svg)
 *
 * ![daxpy-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0072 | 1.6954 | 0.0036 | 3.4286 | 49.4% |
 * | 1024 | 0.0075 | 3.2751 | 0.0036 | 6.7665 | 48.4% |
 * | 4096 | 0.0207 | 4.7591 | 0.0061 | 16.0000 | 29.7% |
 * | 16384 | 0.0955 | 4.1159 | 0.0524 | 7.4973 | 54.9% |
 * | 65536 | 0.3931 | 4.0013 | 0.2010 | 7.8268 | 51.1% |
 *
 * ![daxpy-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride255.svg)
 *
 * ![daxpy-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0069 | 1.7737 | 0.0037 | 3.3103 | 53.6% |
 * | 1024 | 0.0075 | 3.2961 | 0.0038 | 6.5085 | 50.6% |
 * | 4096 | 0.0178 | 5.5302 | 0.0046 | 21.5579 | 25.7% |
 * | 16384 | 0.0824 | 4.7702 | 0.0492 | 8.0000 | 59.6% |
 * | 65536 | 0.3792 | 4.1478 | 0.1932 | 8.1425 | 50.9% |
 *
 * ![daxpy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-stride256.svg)
 *
 * ![daxpy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/stride.daxpy.js) — WebGPU stride-sweep benchmark script
 * - [stride.daxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/cuda/stride.daxpy.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 1024 | 0.0064 | 3.8400 | 0.0029 | 8.5333 | 45.0% |
 * | 65536 | 0.0144 | 109.4699 | 0.0071 | 220.9079 | 49.6% |
 * | 1048576 | 0.1554 | 161.9006 | 0.1456 | 172.8422 | 93.7% |
 * | 16777216 | 2.3286 | 172.9170 | 2.2888 | 175.9220 | 98.3% |
 *
 * ![daxpy-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alphaneg3p75.svg)
 *
 * ![daxpy-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0064 | 3.8593 | 0.0025 | 9.8462 | 39.2% |
 * | 65536 | 0.0144 | 108.9845 | 0.0041 | 384.0000 | 28.4% |
 * | 1048576 | 0.1554 | 161.9172 | 0.0277 | 909.1699 | 17.8% |
 * | 16777216 | 2.3245 | 173.2229 | 0.4012 | 1003.6622 | 17.3% |
 *
 * ![daxpy-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha0.svg)
 *
 * ![daxpy-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0064 | 3.8593 | 0.0029 | 8.4396 | 45.7% |
 * | 65536 | 0.0144 | 108.9845 | 0.0073 | 216.0527 | 50.4% |
 * | 1048576 | 0.1554 | 161.9839 | 0.1456 | 172.7852 | 93.7% |
 * | 16777216 | 2.3291 | 172.8766 | 2.2888 | 175.9233 | 98.3% |
 *
 * ![daxpy-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha1eneg38.svg)
 *
 * ![daxpy-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0063 | 3.9184 | 0.0029 | 8.3934 | 46.7% |
 * | 65536 | 0.0144 | 108.9845 | 0.0073 | 215.1072 | 50.7% |
 * | 1048576 | 0.1556 | 161.7341 | 0.1456 | 172.8612 | 93.6% |
 * | 16777216 | 2.3292 | 172.8719 | 2.2884 | 175.9503 | 98.3% |
 *
 * ![daxpy-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha1.svg)
 *
 * ![daxpy-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0063 | 3.8788 | 0.0029 | 8.5333 | 45.5% |
 * | 65536 | 0.0144 | 108.9845 | 0.0070 | 223.4182 | 48.8% |
 * | 1048576 | 0.1553 | 162.0006 | 0.1456 | 172.8422 | 93.7% |
 * | 16777216 | 2.3287 | 172.9087 | 2.2889 | 175.9171 | 98.3% |
 *
 * ![daxpy-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/gbps-alpha2p5.svg)
 *
 * ![daxpy-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/daxpy/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.daxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/wgblas/alpha.daxpy.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.daxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/daxpy/cuda/alpha.daxpy.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/daxpy
 */
