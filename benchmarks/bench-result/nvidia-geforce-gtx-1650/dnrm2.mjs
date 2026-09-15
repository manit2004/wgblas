/**
 * Benchmark results for dnrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0410 | 0.0063 | 0.1733 | 0.0015 | 416.7% |
 * | 64 | 0.0406 | 0.0126 | 0.1788 | 0.0029 | 435.3% |
 * | 128 | 0.0412 | 0.0249 | 0.1839 | 0.0056 | 444.3% |
 * | 512 | 0.0411 | 0.0998 | 0.1905 | 0.0215 | 464.0% |
 * | 1024 | 0.0411 | 0.1995 | 0.1935 | 0.0423 | 471.5% |
 * | 4096 | 0.0417 | 0.7865 | 0.2137 | 0.1534 | 512.7% |
 * | 16384 | 0.0442 | 2.9660 | 0.2340 | 0.5601 | 529.5% |
 * | 65536 | 0.0548 | 9.5757 | 0.0794 | 6.6025 | 145.0% |
 * | 262144 | 0.1032 | 20.3244 | 0.0929 | 22.5675 | 90.1% |
 * | 1048576 | 0.2501 | 33.5458 | 0.1521 | 55.1534 | 60.8% |
 * | 4194304 | 0.9116 | 36.8102 | 0.7697 | 43.5935 | 84.4% |
 * | 16777216 | 2.7197 | 49.3500 | 1.3886 | 96.6563 | 51.1% |
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
 * | 32 | 0.0319 | 0.0080 | 0.0428 | 0.0060 | 133.6% |
 * | 64 | 0.0317 | 0.0161 | 0.0428 | 0.0119 | 135.7% |
 * | 128 | 0.0319 | 0.0321 | 0.0510 | 0.0201 | 159.8% |
 * | 512 | 0.0319 | 0.1284 | 0.0509 | 0.0805 | 159.5% |
 * | 1024 | 0.0319 | 0.2572 | 0.0510 | 0.1607 | 160.0% |
 * | 4096 | 0.0325 | 1.0079 | 0.0591 | 0.5544 | 181.8% |
 * | 16384 | 0.0364 | 3.6009 | 0.0754 | 1.7389 | 207.1% |
 * | 65536 | 0.0566 | 9.2617 | 0.0756 | 6.9350 | 133.6% |
 * | 262144 | 0.1051 | 19.9562 | 0.1141 | 18.3780 | 108.6% |
 * | 1048576 | 0.2910 | 28.8229 | 0.2450 | 34.2448 | 84.2% |
 * | 4194304 | 0.9891 | 33.9257 | 0.7815 | 42.9357 | 79.0% |
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
 * | 32 | 0.0410 | 0.0063 | 0.0427 | 0.0060 | 104.2% |
 * | 64 | 0.0410 | 0.0125 | 0.0426 | 0.0120 | 104.1% |
 * | 128 | 0.0403 | 0.0254 | 0.0507 | 0.0202 | 125.9% |
 * | 512 | 0.0409 | 0.1001 | 0.0507 | 0.0808 | 123.9% |
 * | 1024 | 0.0416 | 0.1967 | 0.0508 | 0.1614 | 121.9% |
 * | 4096 | 0.0418 | 0.7838 | 0.0592 | 0.5537 | 141.6% |
 * | 16384 | 0.0449 | 2.9205 | 0.0755 | 1.7367 | 168.2% |
 * | 65536 | 0.0691 | 7.5905 | 0.0760 | 6.8985 | 110.0% |
 * | 262144 | 0.1101 | 19.0429 | 0.1194 | 17.5676 | 108.4% |
 * | 1048576 | 0.3015 | 27.8270 | 0.2895 | 28.9758 | 96.0% |
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
 * | 32 | 0.0466 | 0.0055 | 0.0426 | 0.0060 | 91.5% |
 * | 64 | 0.0466 | 0.0110 | 0.0426 | 0.0120 | 91.5% |
 * | 128 | 0.0467 | 0.0219 | 0.0510 | 0.0201 | 109.1% |
 * | 512 | 0.0466 | 0.0879 | 0.0518 | 0.0790 | 111.2% |
 * | 1024 | 0.0480 | 0.1707 | 0.0509 | 0.1611 | 106.0% |
 * | 4096 | 0.0552 | 0.5938 | 0.0590 | 0.5552 | 107.0% |
 * | 16384 | 0.0660 | 1.9874 | 0.0875 | 1.4979 | 132.7% |
 * | 65536 | 0.1056 | 4.9656 | 0.1058 | 4.9566 | 100.2% |
 * | 262144 | 0.2508 | 8.3608 | 0.2163 | 9.6961 | 86.2% |
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
 * | 64 | 0.0490 | 0.0104 | 0.0425 | 0.0120 | 87.0% |
 * | 128 | 0.0488 | 0.0210 | 0.0507 | 0.0202 | 103.8% |
 * | 512 | 0.0492 | 0.0833 | 0.0504 | 0.0812 | 102.6% |
 * | 1024 | 0.0492 | 0.1667 | 0.0508 | 0.1614 | 103.3% |
 * | 4096 | 0.0573 | 0.5714 | 0.0589 | 0.5564 | 102.7% |
 * | 16384 | 0.0704 | 1.8605 | 0.0868 | 1.5098 | 123.2% |
 * | 65536 | 0.1087 | 4.8238 | 0.1051 | 4.9898 | 96.7% |
 * | 262144 | 0.2499 | 8.3908 | 0.1719 | 12.2018 | 68.8% |
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
 * | 512 | 0.0493 | 0.0830 | 0.0508 | 0.0806 | 103.0% |
 * | 1024 | 0.0508 | 0.1613 | 0.0509 | 0.1610 | 100.2% |
 * | 4096 | 0.0569 | 0.5761 | 0.0591 | 0.5541 | 104.0% |
 * | 16384 | 0.0798 | 1.6423 | 0.1051 | 1.2467 | 131.7% |
 * | 65536 | 0.1432 | 3.6612 | 0.1451 | 3.6144 | 101.3% |
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
 * | 512 | 0.0498 | 0.0823 | 0.0507 | 0.0808 | 101.9% |
 * | 1024 | 0.0511 | 0.1604 | 0.0506 | 0.1619 | 99.0% |
 * | 4096 | 0.0582 | 0.5634 | 0.0589 | 0.5559 | 101.4% |
 * | 16384 | 0.0740 | 1.7709 | 0.0959 | 1.3662 | 129.6% |
 * | 65536 | 0.1279 | 4.0980 | 0.1222 | 4.2896 | 95.5% |
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
