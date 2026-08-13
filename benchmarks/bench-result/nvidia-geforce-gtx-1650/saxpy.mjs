/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 0.0539 | 0.0031 | 0.1224 | 44.1% |
 * | 64 | 0.0069 | 0.1119 | 0.0032 | 0.2388 | 46.9% |
 * | 128 | 0.0071 | 0.2167 | 0.0032 | 0.4752 | 45.6% |
 * | 512 | 0.0073 | 0.8384 | 0.0034 | 1.7860 | 46.9% |
 * | 1024 | 0.0073 | 1.6805 | 0.0034 | 3.6398 | 46.2% |
 * | 4096 | 0.0073 | 6.7221 | 0.0035 | 14.1567 | 47.5% |
 * | 16384 | 0.0081 | 24.1890 | 0.0040 | 49.1520 | 49.2% |
 * | 65536 | 0.0102 | 76.9202 | 0.0059 | 132.8432 | 57.9% |
 * | 262144 | 0.0246 | 128.0000 | 0.0212 | 148.0482 | 86.5% |
 * | 1048576 | 0.0778 | 161.6842 | 0.0741 | 169.8557 | 95.2% |
 * | 4194304 | 0.2922 | 172.2743 | 0.2863 | 175.8274 | 98.0% |
 * | 16777216 | 1.1489 | 175.2299 | 1.1323 | 177.8051 | 98.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![saxpy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-default.svg)
 *
 * ![saxpy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-default.svg)
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
 * - [saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/saxpy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0069 | 0.0554 | 0.0033 | 0.1171 | 47.3% |
 * | 64 | 0.0071 | 0.1084 | 0.0034 | 0.2233 | 48.5% |
 * | 128 | 0.0073 | 0.2115 | 0.0038 | 0.4034 | 52.4% |
 * | 512 | 0.0072 | 0.8571 | 0.0034 | 1.7944 | 47.8% |
 * | 1024 | 0.0072 | 1.6954 | 0.0035 | 3.5556 | 47.7% |
 * | 4096 | 0.0079 | 6.2061 | 0.0039 | 12.5902 | 49.3% |
 * | 16384 | 0.0094 | 21.0051 | 0.0054 | 36.1412 | 58.1% |
 * | 65536 | 0.0227 | 34.6141 | 0.0211 | 37.3495 | 92.7% |
 * | 262144 | 0.0759 | 41.4435 | 0.0741 | 42.4273 | 97.7% |
 * | 1048576 | 0.2886 | 43.5986 | 0.2883 | 43.6422 | 99.9% |
 * | 4194304 | 1.1384 | 44.2114 | 1.1425 | 44.0541 | 100.4% |
 *
 * ![saxpy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride4.svg)
 *
 * ![saxpy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0625 | 0.0027 | 0.1429 | 43.7% |
 * | 64 | 0.0061 | 0.1250 | 0.0028 | 0.2791 | 44.8% |
 * | 128 | 0.0061 | 0.2500 | 0.0030 | 0.5134 | 48.7% |
 * | 512 | 0.0061 | 1.0000 | 0.0034 | 1.8199 | 54.9% |
 * | 1024 | 0.0062 | 1.9692 | 0.0036 | 3.4286 | 57.4% |
 * | 4096 | 0.0082 | 5.9767 | 0.0047 | 10.4490 | 57.2% |
 * | 16384 | 0.0247 | 7.9483 | 0.0229 | 8.5810 | 92.6% |
 * | 65536 | 0.0881 | 8.9302 | 0.0858 | 9.1633 | 97.5% |
 * | 262144 | 0.3394 | 9.2683 | 0.3356 | 9.3730 | 98.9% |
 * | 1048576 | 1.3435 | 9.3659 | 1.3505 | 9.3171 | 100.5% |
 *
 * ![saxpy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride32.svg)
 *
 * ![saxpy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0061 | 1.0000 | 0.0036 | 1.7067 | 58.6% |
 * | 1024 | 0.0063 | 1.9394 | 0.0035 | 3.5229 | 55.1% |
 * | 4096 | 0.0086 | 5.7100 | 0.0046 | 10.5931 | 53.9% |
 * | 16384 | 0.0416 | 4.7262 | 0.0452 | 4.3497 | 108.7% |
 * | 65536 | 0.1768 | 4.4477 | 0.1921 | 4.0929 | 108.7% |
 *
 * ![saxpy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride256.svg)
 *
 * ![saxpy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/stride.saxpy.js) — WebGPU stride-sweep benchmark script
 * - [stride.saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/stride.saxpy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
