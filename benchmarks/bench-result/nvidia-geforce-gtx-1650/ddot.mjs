/**
 * Benchmark results for ddot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0138 | 0.0370 | 0.0177 | 0.0289 | 128.2% |
 * | 64 | 0.0138 | 0.0744 | 0.0180 | 0.0569 | 130.8% |
 * | 128 | 0.0140 | 0.1460 | 0.0180 | 0.1137 | 128.4% |
 * | 512 | 0.0141 | 0.5792 | 0.0180 | 0.4555 | 127.2% |
 * | 1024 | 0.0139 | 1.1757 | 0.0180 | 0.9118 | 128.9% |
 * | 4096 | 0.0141 | 4.6440 | 0.0180 | 3.6506 | 127.2% |
 * | 16384 | 0.0154 | 17.0667 | 0.0179 | 14.6286 | 116.7% |
 * | 65536 | 0.0213 | 49.2752 | 0.0190 | 55.0723 | 89.5% |
 * | 262144 | 0.0440 | 95.4292 | 0.0430 | 97.5601 | 97.8% |
 * | 1048576 | 0.1147 | 146.2857 | 0.1068 | 157.0665 | 93.1% |
 * | 4194304 | 0.3884 | 172.7900 | 0.3752 | 178.8616 | 96.6% |
 * | 16777216 | 1.4788 | 181.5205 | 1.4448 | 185.8004 | 97.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ddot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-default.svg)
 *
 * ![ddot-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-default.svg)
 *
 * ## See also
 *
 * - [ddot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ddot/wgblas/ddot.js) — WebGPU benchmark script
 * - [ddot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ddot/cuda/ddot.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0140 | 0.0367 | 0.0177 | 0.0290 | 126.5% |
 * | 64 | 0.0139 | 0.0739 | 0.0180 | 0.0569 | 129.9% |
 * | 128 | 0.0138 | 0.1480 | 0.0180 | 0.1141 | 129.7% |
 * | 512 | 0.0138 | 0.5947 | 0.0180 | 0.4539 | 131.0% |
 * | 1024 | 0.0140 | 1.1743 | 0.0180 | 0.9102 | 129.0% |
 * | 4096 | 0.0144 | 4.5612 | 0.0181 | 3.6248 | 125.8% |
 * | 16384 | 0.0192 | 13.6876 | 0.0191 | 13.6990 | 99.9% |
 * | 65536 | 0.0404 | 25.9549 | 0.0424 | 24.7212 | 105.0% |
 * | 262144 | 0.1088 | 38.5563 | 0.1073 | 39.0968 | 98.6% |
 * | 1048576 | 0.3809 | 44.0430 | 0.3745 | 44.8033 | 98.3% |
 * | 4194304 | 1.4634 | 45.8579 | 1.4434 | 46.4928 | 98.6% |
 *
 * ![ddot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-stride4.svg)
 *
 * ![ddot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0138 | 0.0372 | 0.0180 | 0.0284 | 130.9% |
 * | 64 | 0.0138 | 0.0742 | 0.0179 | 0.0573 | 129.4% |
 * | 128 | 0.0139 | 0.1475 | 0.0181 | 0.1133 | 130.2% |
 * | 512 | 0.0138 | 0.5940 | 0.0180 | 0.4559 | 130.3% |
 * | 1024 | 0.0140 | 1.1689 | 0.0180 | 0.9127 | 128.1% |
 * | 4096 | 0.0145 | 4.5260 | 0.0179 | 3.6571 | 123.8% |
 * | 16384 | 0.0231 | 11.3541 | 0.0230 | 11.4095 | 99.5% |
 * | 65536 | 0.0462 | 22.7004 | 0.0443 | 23.6849 | 95.8% |
 * | 262144 | 0.1307 | 32.1019 | 0.1292 | 32.4677 | 98.9% |
 * | 1048576 | 0.4742 | 35.3771 | 0.4621 | 36.3080 | 97.4% |
 * | 4194304 | 1.8471 | 36.3313 | 1.8013 | 37.2562 | 97.5% |
 *
 * ![ddot-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-stride5.svg)
 *
 * ![ddot-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0142 | 0.0361 | 0.0181 | 0.0283 | 127.6% |
 * | 64 | 0.0140 | 0.0732 | 0.0179 | 0.0573 | 127.8% |
 * | 128 | 0.0143 | 0.1430 | 0.0181 | 0.1131 | 126.5% |
 * | 512 | 0.0143 | 0.5714 | 0.0180 | 0.4555 | 125.5% |
 * | 1024 | 0.0143 | 1.1429 | 0.0180 | 0.9110 | 125.5% |
 * | 4096 | 0.0222 | 2.9531 | 0.0182 | 3.6088 | 81.8% |
 * | 16384 | 0.0389 | 6.7368 | 0.0292 | 8.9923 | 74.9% |
 * | 65536 | 0.1065 | 9.8462 | 0.0611 | 17.1695 | 57.3% |
 * | 262144 | 0.3768 | 11.1304 | 0.1944 | 21.5739 | 51.6% |
 * | 1048576 | 1.4615 | 11.4795 | 0.7313 | 22.9408 | 50.0% |
 *
 * ![ddot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-stride32.svg)
 *
 * ![ddot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0138 | 0.0743 | 0.0180 | 0.0568 | 130.9% |
 * | 128 | 0.0140 | 0.1466 | 0.0180 | 0.1141 | 128.5% |
 * | 512 | 0.0142 | 0.5779 | 0.0180 | 0.4555 | 126.9% |
 * | 1024 | 0.0142 | 1.1532 | 0.0180 | 0.9127 | 126.3% |
 * | 4096 | 0.0214 | 3.0613 | 0.0181 | 3.6152 | 84.7% |
 * | 16384 | 0.0389 | 6.7368 | 0.0292 | 8.9628 | 75.2% |
 * | 65536 | 0.1071 | 9.7932 | 0.0609 | 17.2237 | 56.9% |
 * | 262144 | 0.3802 | 11.0321 | 0.1956 | 21.4468 | 51.4% |
 *
 * ![ddot-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-stride33.svg)
 *
 * ![ddot-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0143 | 0.5714 | 0.0180 | 0.4563 | 125.2% |
 * | 1024 | 0.0143 | 1.1429 | 0.0176 | 0.9335 | 122.4% |
 * | 4096 | 0.0265 | 2.4704 | 0.0192 | 3.4190 | 72.3% |
 * | 16384 | 0.0594 | 4.4138 | 0.0404 | 6.4939 | 68.0% |
 * | 65536 | 0.2444 | 4.2904 | 0.1034 | 10.1370 | 42.3% |
 *
 * ![ddot-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-stride255.svg)
 *
 * ![ddot-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0142 | 0.5753 | 0.0176 | 0.4646 | 123.8% |
 * | 1024 | 0.0143 | 1.1429 | 0.0179 | 0.9143 | 125.0% |
 * | 4096 | 0.0245 | 2.6719 | 0.0183 | 3.5867 | 74.5% |
 * | 16384 | 0.0493 | 5.3195 | 0.0321 | 8.1756 | 65.1% |
 * | 65536 | 0.1556 | 6.7368 | 0.0895 | 11.7112 | 57.5% |
 *
 * ![ddot-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/gbps-stride256.svg)
 *
 * ![ddot-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ddot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ddot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ddot/wgblas/stride.ddot.js) — WebGPU stride-sweep benchmark script
 * - [stride.ddot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ddot/cuda/stride.ddot.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ddot
 */
