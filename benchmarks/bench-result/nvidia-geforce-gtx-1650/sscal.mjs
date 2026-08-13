/**
 * Benchmark results for sscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0364 | 0.0030 | 0.0860 | 42.4% |
 * | 64 | 0.0068 | 0.0751 | 0.0031 | 0.1649 | 45.6% |
 * | 128 | 0.0070 | 0.1471 | 0.0031 | 0.3351 | 43.9% |
 * | 512 | 0.0072 | 0.5689 | 0.0032 | 1.2995 | 43.8% |
 * | 1024 | 0.0069 | 1.1852 | 0.0031 | 2.6667 | 44.4% |
 * | 4096 | 0.0072 | 4.5714 | 0.0034 | 9.5701 | 47.8% |
 * | 16384 | 0.0080 | 16.3840 | 0.0037 | 35.6174 | 46.0% |
 * | 65536 | 0.0102 | 51.5220 | 0.0051 | 102.4000 | 50.3% |
 * | 262144 | 0.0203 | 103.3691 | 0.0126 | 166.3350 | 62.1% |
 * | 1048576 | 0.0661 | 126.8234 | 0.0589 | 142.3922 | 89.1% |
 * | 4194304 | 0.2449 | 137.0061 | 0.2235 | 150.1505 | 91.2% |
 * | 16777216 | 0.8372 | 160.3174 | 0.8833 | 151.9455 | 105.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sscal-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-default.svg)
 *
 * ![sscal-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-default.svg)
 *
 * ## See also
 *
 * - [sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/wgblas/sscal.js) — WebGPU benchmark script
 * - [sscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/sscal.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0070 | 0.0367 | 0.0034 | 0.0755 | 48.6% |
 * | 64 | 0.0071 | 0.0719 | 0.0033 | 0.1538 | 46.8% |
 * | 128 | 0.0070 | 0.1468 | 0.0034 | 0.2991 | 49.1% |
 * | 512 | 0.0072 | 0.5714 | 0.0035 | 1.1636 | 49.1% |
 * | 1024 | 0.0072 | 1.1353 | 0.0038 | 2.1333 | 53.2% |
 * | 4096 | 0.0076 | 4.3207 | 0.0038 | 8.5690 | 50.4% |
 * | 16384 | 0.0084 | 15.6935 | 0.0048 | 27.3067 | 57.5% |
 * | 65536 | 0.0144 | 36.2879 | 0.0095 | 55.0723 | 65.9% |
 * | 262144 | 0.0532 | 39.3846 | 0.0512 | 40.9600 | 96.2% |
 * | 1048576 | 0.1971 | 42.5628 | 0.1950 | 43.0273 | 98.9% |
 * | 4194304 | 0.7743 | 43.3350 | 0.7705 | 43.5509 | 99.5% |
 *
 * ![sscal-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride4.svg)
 *
 * ![sscal-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0364 | 0.0028 | 0.0909 | 40.0% |
 * | 64 | 0.0072 | 0.0713 | 0.0028 | 0.1860 | 38.3% |
 * | 128 | 0.0074 | 0.1388 | 0.0030 | 0.3459 | 40.1% |
 * | 512 | 0.0074 | 0.5553 | 0.0035 | 1.1797 | 47.1% |
 * | 1024 | 0.0077 | 1.0579 | 0.0034 | 2.4381 | 43.4% |
 * | 4096 | 0.0085 | 3.8496 | 0.0041 | 7.9073 | 48.7% |
 * | 16384 | 0.0205 | 6.4000 | 0.0167 | 7.8618 | 81.4% |
 * | 65536 | 0.0677 | 7.7393 | 0.0635 | 8.2581 | 93.7% |
 * | 262144 | 0.2601 | 8.0630 | 0.2476 | 8.4710 | 95.2% |
 * | 1048576 | 1.0230 | 8.2003 | 0.9807 | 8.5539 | 95.9% |
 *
 * ![sscal-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride32.svg)
 *
 * ![sscal-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0076 | 0.5412 | 0.0033 | 1.2549 | 43.1% |
 * | 1024 | 0.0078 | 1.0535 | 0.0033 | 2.4615 | 42.8% |
 * | 4096 | 0.0085 | 3.8352 | 0.0041 | 8.0000 | 47.9% |
 * | 16384 | 0.0307 | 4.2667 | 0.0306 | 4.2823 | 99.6% |
 * | 65536 | 0.1428 | 3.6711 | 0.1390 | 3.7708 | 97.4% |
 *
 * ![sscal-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride256.svg)
 *
 * ![sscal-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/wgblas/stride.sscal.js) — WebGPU stride-sweep benchmark script
 * - [stride.sscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/stride.sscal.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sscal
 */
