/**
 * Benchmark results for dnrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0230 | 0.0111 | 0.0420 | 0.0061 | 182.1% |
 * | 64 | 0.0230 | 0.0223 | 0.0427 | 0.0120 | 185.4% |
 * | 128 | 0.0227 | 0.0451 | 0.0508 | 0.0202 | 223.4% |
 * | 512 | 0.0228 | 0.1798 | 0.0508 | 0.0806 | 223.0% |
 * | 1024 | 0.0231 | 0.3551 | 0.0508 | 0.1614 | 220.0% |
 * | 4096 | 0.0232 | 1.4153 | 0.0590 | 0.5555 | 254.8% |
 * | 16384 | 0.0246 | 5.3333 | 0.0754 | 1.7385 | 306.8% |
 * | 65536 | 0.0276 | 18.9959 | 0.0753 | 6.9630 | 272.8% |
 * | 262144 | 0.0472 | 44.3860 | 0.0928 | 22.6025 | 196.4% |
 * | 1048576 | 0.1003 | 83.6585 | 0.1514 | 55.3923 | 151.0% |
 * | 4194304 | 0.3092 | 108.5033 | 0.3937 | 85.2293 | 127.3% |
 * | 16777216 | 1.1571 | 115.9929 | 1.3573 | 98.8861 | 117.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dnrm2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-default.svg)
 *
 * ![dnrm2-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-default.svg)
 *
 * ## See also
 *
 * - [dnrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dnrm2/wgblas/dnrm2.js) — WebGPU benchmark script
 * - [dnrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dnrm2/cuda/dnrm2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0228 | 0.0112 | 0.0422 | 0.0061 | 183.7% |
 * | 64 | 0.0231 | 0.0222 | 0.0426 | 0.0120 | 184.9% |
 * | 128 | 0.0228 | 0.0450 | 0.0508 | 0.0202 | 222.8% |
 * | 512 | 0.0230 | 0.1780 | 0.0509 | 0.0805 | 221.1% |
 * | 1024 | 0.0232 | 0.3526 | 0.0508 | 0.1612 | 218.7% |
 * | 4096 | 0.0231 | 1.4163 | 0.0590 | 0.5553 | 255.1% |
 * | 16384 | 0.0256 | 5.1200 | 0.0753 | 1.7400 | 294.3% |
 * | 65536 | 0.0430 | 12.2041 | 0.0762 | 6.8840 | 177.3% |
 * | 262144 | 0.0760 | 27.5825 | 0.1119 | 18.7406 | 147.2% |
 * | 1048576 | 0.2103 | 39.8910 | 0.2446 | 34.2986 | 116.3% |
 * | 4194304 | 0.7454 | 45.0149 | 0.7805 | 42.9885 | 104.7% |
 *
 * ![dnrm2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-stride4.svg)
 *
 * ![dnrm2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0230 | 0.0111 | 0.0425 | 0.0060 | 185.2% |
 * | 64 | 0.0229 | 0.0224 | 0.0426 | 0.0120 | 186.5% |
 * | 128 | 0.0229 | 0.0447 | 0.0508 | 0.0202 | 221.3% |
 * | 512 | 0.0231 | 0.1777 | 0.0507 | 0.0809 | 219.6% |
 * | 1024 | 0.0231 | 0.3546 | 0.0508 | 0.1614 | 219.7% |
 * | 4096 | 0.0237 | 1.3819 | 0.0589 | 0.5559 | 248.6% |
 * | 16384 | 0.0260 | 5.0412 | 0.0754 | 1.7393 | 289.8% |
 * | 65536 | 0.0451 | 11.6364 | 0.0764 | 6.8595 | 169.6% |
 * | 262144 | 0.0876 | 23.9270 | 0.1201 | 17.4670 | 137.0% |
 * | 1048576 | 0.2545 | 32.9658 | 0.2885 | 29.0770 | 113.4% |
 *
 * ![dnrm2-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-stride5.svg)
 *
 * ![dnrm2-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0230 | 0.0111 | 0.0426 | 0.0060 | 185.8% |
 * | 64 | 0.0229 | 0.0224 | 0.0426 | 0.0120 | 186.5% |
 * | 128 | 0.0234 | 0.0438 | 0.0508 | 0.0202 | 216.9% |
 * | 512 | 0.0230 | 0.1783 | 0.0508 | 0.0807 | 220.9% |
 * | 1024 | 0.0237 | 0.3459 | 0.0507 | 0.1616 | 214.1% |
 * | 4096 | 0.0304 | 1.0796 | 0.0590 | 0.5558 | 194.2% |
 * | 16384 | 0.0404 | 3.2418 | 0.0874 | 1.4998 | 216.1% |
 * | 65536 | 0.0742 | 7.0682 | 0.1056 | 4.9664 | 142.3% |
 * | 262144 | 0.2102 | 9.9750 | 0.1713 | 12.2406 | 81.5% |
 *
 * ![dnrm2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-stride32.svg)
 *
 * ![dnrm2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0259 | 0.0197 | 0.0426 | 0.0120 | 164.5% |
 * | 128 | 0.0259 | 0.0395 | 0.0508 | 0.0202 | 195.7% |
 * | 512 | 0.0261 | 0.1572 | 0.0508 | 0.0807 | 194.7% |
 * | 1024 | 0.0269 | 0.3048 | 0.0507 | 0.1615 | 188.7% |
 * | 4096 | 0.0331 | 0.9903 | 0.0588 | 0.5573 | 177.7% |
 * | 16384 | 0.0451 | 2.9091 | 0.0872 | 1.5034 | 193.5% |
 * | 65536 | 0.0781 | 6.7120 | 0.1052 | 4.9837 | 134.7% |
 * | 262144 | 0.2151 | 9.7509 | 0.1712 | 12.2520 | 79.6% |
 *
 * ![dnrm2-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-stride33.svg)
 *
 * ![dnrm2-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0233 | 0.1757 | 0.0507 | 0.0807 | 217.7% |
 * | 1024 | 0.0233 | 0.3519 | 0.0506 | 0.1620 | 217.2% |
 * | 4096 | 0.0324 | 1.0129 | 0.0588 | 0.5576 | 181.6% |
 * | 16384 | 0.0494 | 2.6554 | 0.1051 | 1.2474 | 212.9% |
 * | 65536 | 0.1147 | 4.5714 | 0.1408 | 3.7232 | 122.8% |
 *
 * ![dnrm2-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-stride255.svg)
 *
 * ![dnrm2-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0231 | 0.1774 | 0.0508 | 0.0806 | 220.1% |
 * | 1024 | 0.0237 | 0.3450 | 0.0506 | 0.1618 | 213.2% |
 * | 4096 | 0.0313 | 1.0460 | 0.0589 | 0.5559 | 188.2% |
 * | 16384 | 0.0461 | 2.8435 | 0.0963 | 1.3610 | 208.9% |
 * | 65536 | 0.0979 | 5.3542 | 0.1229 | 4.2661 | 125.5% |
 *
 * ![dnrm2-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/gbps-stride256.svg)
 *
 * ![dnrm2-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dnrm2/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dnrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dnrm2/wgblas/stride.dnrm2.js) — WebGPU stride-sweep benchmark script
 * - [stride.dnrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dnrm2/cuda/stride.dnrm2.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dnrm2
 */
