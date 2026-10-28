/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0028 | 0.1818 | 45.8% |
 * | 64 | 0.0061 | 0.1667 | 0.0028 | 0.3596 | 46.3% |
 * | 128 | 0.0061 | 0.3333 | 0.0031 | 0.6598 | 50.5% |
 * | 512 | 0.0061 | 1.3333 | 0.0033 | 2.5098 | 53.1% |
 * | 1024 | 0.0061 | 2.6667 | 0.0032 | 5.0693 | 52.6% |
 * | 4096 | 0.0062 | 10.5567 | 0.0032 | 20.2772 | 52.1% |
 * | 16384 | 0.0068 | 38.4601 | 0.0039 | 67.1475 | 57.3% |
 * | 65536 | 0.0086 | 122.2687 | 0.0067 | 156.0381 | 78.4% |
 * | 262144 | 0.0290 | 144.8309 | 0.0276 | 151.7915 | 95.4% |
 * | 1048576 | 0.1026 | 163.5334 | 0.1010 | 166.0716 | 98.5% |
 * | 4194304 | 0.3964 | 169.2890 | 0.3962 | 169.3984 | 99.9% |
 * | 16777216 | 1.5732 | 170.6250 | 1.5606 | 172.0087 | 99.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![srotm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-default.svg)
 *
 * ![srotm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-default.svg)
 *
 * ## See also
 *
 * - [srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/srotm.js) — WebGPU benchmark script
 * - [srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/srotm.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0061 | 0.0833 | 0.0029 | 0.1778 | 46.9% |
 * | 64 | 0.0061 | 0.1667 | 0.0032 | 0.3249 | 51.3% |
 * | 128 | 0.0061 | 0.3333 | 0.0029 | 0.7033 | 47.4% |
 * | 512 | 0.0061 | 1.3333 | 0.0033 | 2.4498 | 54.4% |
 * | 1024 | 0.0062 | 2.6392 | 0.0032 | 5.1200 | 51.5% |
 * | 4096 | 0.0072 | 9.0619 | 0.0038 | 17.2101 | 52.7% |
 * | 16384 | 0.0087 | 30.0073 | 0.0053 | 49.2012 | 61.0% |
 * | 65536 | 0.0285 | 36.8180 | 0.0270 | 38.8017 | 94.9% |
 * | 262144 | 0.1024 | 40.9600 | 0.1005 | 41.7294 | 98.2% |
 * | 1048576 | 0.3971 | 42.2523 | 0.3947 | 42.5075 | 99.4% |
 * | 4194304 | 1.5715 | 42.7036 | 1.5708 | 42.7236 | 100.0% |
 *
 * ![srotm-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride4.svg)
 *
 * ![srotm-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0028 | 0.1798 | 46.3% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3497 | 47.7% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6737 | 49.5% |
 * | 512 | 0.0062 | 1.3264 | 0.0032 | 2.5600 | 51.8% |
 * | 1024 | 0.0061 | 2.6667 | 0.0033 | 4.9469 | 53.9% |
 * | 4096 | 0.0070 | 9.3945 | 0.0039 | 16.7869 | 56.0% |
 * | 16384 | 0.0099 | 26.4685 | 0.0061 | 42.6667 | 62.0% |
 * | 65536 | 0.0348 | 30.1176 | 0.0336 | 31.2523 | 96.4% |
 * | 262144 | 0.1271 | 33.0073 | 0.1270 | 33.0323 | 99.9% |
 * | 1048576 | 0.4977 | 33.7065 | 0.5002 | 33.5437 | 100.5% |
 * | 4194304 | 1.9736 | 34.0038 | 1.9927 | 33.6773 | 101.0% |
 *
 * ![srotm-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride5.svg)
 *
 * ![srotm-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0030 | 0.1711 | 48.7% |
 * | 64 | 0.0063 | 0.1633 | 0.0032 | 0.3200 | 51.0% |
 * | 128 | 0.0062 | 0.3307 | 0.0033 | 0.6214 | 53.2% |
 * | 512 | 0.0066 | 1.2367 | 0.0040 | 2.0398 | 60.6% |
 * | 1024 | 0.0067 | 2.4498 | 0.0039 | 4.1626 | 58.9% |
 * | 4096 | 0.0100 | 6.5852 | 0.0059 | 11.0703 | 59.5% |
 * | 16384 | 0.0361 | 7.2560 | 0.0347 | 7.5572 | 96.0% |
 * | 65536 | 0.1320 | 7.9438 | 0.1348 | 7.7788 | 102.1% |
 * | 262144 | 0.5148 | 8.1477 | 0.5336 | 7.8599 | 103.7% |
 * | 1048576 | 2.0951 | 8.0078 | 2.1481 | 7.8104 | 102.5% |
 *
 * ![srotm-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride32.svg)
 *
 * ![srotm-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1667 | 0.0030 | 0.3368 | 49.5% |
 * | 128 | 0.0062 | 0.3282 | 0.0032 | 0.6305 | 52.1% |
 * | 512 | 0.0066 | 1.2367 | 0.0037 | 2.1880 | 56.5% |
 * | 1024 | 0.0068 | 2.4265 | 0.0037 | 4.3761 | 55.4% |
 * | 4096 | 0.0097 | 6.7815 | 0.0060 | 11.0108 | 61.6% |
 * | 16384 | 0.0389 | 6.7368 | 0.0384 | 6.8324 | 98.6% |
 * | 65536 | 0.1516 | 6.9189 | 0.1561 | 6.7189 | 103.0% |
 * | 262144 | 0.6102 | 6.8732 | 0.6281 | 6.6781 | 102.9% |
 *
 * ![srotm-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride33.svg)
 *
 * ![srotm-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0068 | 1.2047 | 0.0037 | 2.1880 | 55.1% |
 * | 1024 | 0.0071 | 2.2960 | 0.0037 | 4.4329 | 51.8% |
 * | 4096 | 0.0143 | 4.5714 | 0.0131 | 4.9951 | 91.5% |
 * | 16384 | 0.0708 | 3.7026 | 0.0757 | 3.4617 | 107.0% |
 * | 65536 | 0.3098 | 3.3848 | 0.3133 | 3.3466 | 101.1% |
 *
 * ![srotm-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride255.svg)
 *
 * ![srotm-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0069 | 1.1907 | 0.0040 | 2.0398 | 58.4% |
 * | 1024 | 0.0069 | 2.3594 | 0.0039 | 4.1967 | 56.2% |
 * | 4096 | 0.0116 | 5.6731 | 0.0084 | 7.7576 | 73.1% |
 * | 16384 | 0.0644 | 4.0675 | 0.0663 | 3.9518 | 102.9% |
 * | 65536 | 0.2904 | 3.6108 | 0.2997 | 3.4984 | 103.2% |
 *
 * ![srotm-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/gbps-stride256.svg)
 *
 * ![srotm-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srotm/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/stride.srotm.js) — WebGPU stride-sweep benchmark script
 * - [stride.srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/stride.srotm.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srotm
 */
