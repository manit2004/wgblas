/**
 * Benchmark results for dcopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.0739 | 0.0034 | 0.1502 | 49.2% |
 * | 64 | 0.0070 | 0.1468 | 0.0033 | 0.3092 | 47.5% |
 * | 128 | 0.0072 | 0.2838 | 0.0033 | 0.6275 | 45.2% |
 * | 512 | 0.0073 | 1.1155 | 0.0034 | 2.3925 | 46.6% |
 * | 1024 | 0.0072 | 2.2806 | 0.0033 | 5.0196 | 45.4% |
 * | 4096 | 0.0076 | 8.6780 | 0.0034 | 19.3208 | 44.9% |
 * | 16384 | 0.0081 | 32.1886 | 0.0040 | 65.5360 | 49.1% |
 * | 65536 | 0.0119 | 87.9678 | 0.0075 | 140.6352 | 62.6% |
 * | 262144 | 0.0304 | 138.1159 | 0.0276 | 152.0557 | 90.8% |
 * | 1048576 | 0.1039 | 161.4187 | 0.0996 | 168.3918 | 95.9% |
 * | 4194304 | 0.3965 | 169.2480 | 0.3872 | 173.3327 | 97.6% |
 * | 16777216 | 1.5647 | 171.5585 | 1.5631 | 171.7323 | 99.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dcopy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-default.svg)
 *
 * ![dcopy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-default.svg)
 *
 * ## See also
 *
 * - [dcopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/wgblas/dcopy.js) — WebGPU benchmark script
 * - [dcopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/cuda/dcopy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0060 | 0.0860 | 0.0034 | 0.1509 | 57.0% |
 * | 64 | 0.0061 | 0.1684 | 0.0035 | 0.2963 | 56.8% |
 * | 128 | 0.0061 | 0.3377 | 0.0036 | 0.5766 | 58.6% |
 * | 512 | 0.0060 | 1.3690 | 0.0037 | 2.1880 | 62.6% |
 * | 1024 | 0.0061 | 2.6806 | 0.0040 | 4.1290 | 64.9% |
 * | 4096 | 0.0063 | 10.4224 | 0.0041 | 16.0000 | 65.1% |
 * | 16384 | 0.0095 | 27.6757 | 0.0064 | 40.6551 | 68.1% |
 * | 65536 | 0.0396 | 26.5006 | 0.0410 | 25.6000 | 103.5% |
 * | 262144 | 0.1551 | 27.0503 | 0.1548 | 27.1034 | 99.8% |
 * | 1048576 | 0.6157 | 27.2506 | 0.6083 | 27.5825 | 98.8% |
 * | 4194304 | 2.4394 | 27.5103 | 2.4390 | 27.5146 | 100.0% |
 *
 * ![dcopy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride4.svg)
 *
 * ![dcopy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0849 | 0.0028 | 0.1860 | 45.6% |
 * | 64 | 0.0060 | 0.1711 | 0.0028 | 0.3699 | 46.3% |
 * | 128 | 0.0060 | 0.3432 | 0.0028 | 0.7191 | 47.7% |
 * | 512 | 0.0060 | 1.3690 | 0.0032 | 2.5347 | 54.0% |
 * | 1024 | 0.0061 | 2.6667 | 0.0034 | 4.8302 | 55.2% |
 * | 4096 | 0.0065 | 10.0392 | 0.0035 | 18.5339 | 54.2% |
 * | 16384 | 0.0117 | 22.3215 | 0.0092 | 28.4939 | 78.3% |
 * | 65536 | 0.0492 | 21.3333 | 0.0439 | 23.9008 | 89.3% |
 * | 262144 | 0.1965 | 21.3420 | 0.1685 | 24.8950 | 85.7% |
 * | 1048576 | 0.7803 | 21.5013 | 0.6676 | 25.1288 | 85.6% |
 *
 * ![dcopy-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride5.svg)
 *
 * ![dcopy-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0851 | 0.0028 | 0.1839 | 46.3% |
 * | 64 | 0.0061 | 0.1675 | 0.0028 | 0.3596 | 46.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6809 | 49.0% |
 * | 512 | 0.0063 | 1.3028 | 0.0037 | 2.2358 | 58.3% |
 * | 1024 | 0.0065 | 2.5347 | 0.0036 | 4.5714 | 55.4% |
 * | 4096 | 0.0105 | 6.2534 | 0.0046 | 14.3217 | 43.7% |
 * | 16384 | 0.0368 | 7.1173 | 0.0217 | 12.0826 | 58.9% |
 * | 65536 | 0.1398 | 7.5010 | 0.0817 | 12.8301 | 58.5% |
 * | 262144 | 0.5712 | 7.3424 | 0.3276 | 12.8038 | 57.3% |
 *
 * ![dcopy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride32.svg)
 *
 * ![dcopy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0092 | 0.1113 | 0.0029 | 0.3497 | 31.8% |
 * | 128 | 0.0094 | 0.2188 | 0.0029 | 0.7111 | 30.8% |
 * | 512 | 0.0098 | 0.8380 | 0.0035 | 2.3704 | 35.4% |
 * | 1024 | 0.0102 | 1.6000 | 0.0035 | 4.7407 | 33.8% |
 * | 4096 | 0.0164 | 4.0000 | 0.0041 | 16.0000 | 25.0% |
 * | 16384 | 0.0445 | 5.8851 | 0.0240 | 10.9009 | 54.0% |
 * | 65536 | 0.1777 | 5.9020 | 0.0910 | 11.5238 | 51.2% |
 * | 262144 | 0.8093 | 5.1825 | 0.3737 | 11.2243 | 46.2% |
 *
 * ![dcopy-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride33.svg)
 *
 * ![dcopy-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0104 | 0.7901 | 0.0036 | 2.3063 | 34.3% |
 * | 1024 | 0.0111 | 1.4776 | 0.0036 | 4.5511 | 32.5% |
 * | 4096 | 0.0205 | 3.2000 | 0.0042 | 15.6935 | 20.4% |
 * | 16384 | 0.0796 | 3.2919 | 0.0355 | 7.3868 | 44.6% |
 * | 65536 | 0.3502 | 2.9942 | 0.1405 | 7.4608 | 40.1% |
 *
 * ![dcopy-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride255.svg)
 *
 * ![dcopy-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0103 | 0.7975 | 0.0035 | 2.3273 | 34.3% |
 * | 1024 | 0.0115 | 1.4242 | 0.0036 | 4.5919 | 31.0% |
 * | 4096 | 0.0184 | 3.5556 | 0.0043 | 15.1704 | 23.4% |
 * | 16384 | 0.0737 | 3.5556 | 0.0341 | 7.6812 | 46.3% |
 * | 65536 | 0.3745 | 2.8002 | 0.1372 | 7.6418 | 36.6% |
 *
 * ![dcopy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/gbps-stride256.svg)
 *
 * ![dcopy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dcopy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dcopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/wgblas/stride.dcopy.js) — WebGPU stride-sweep benchmark script
 * - [stride.dcopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dcopy/cuda/stride.dcopy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dcopy
 */
