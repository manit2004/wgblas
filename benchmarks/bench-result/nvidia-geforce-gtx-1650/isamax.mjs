/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0121 | 0.0106 | 0.0164 | 0.0078 | 135.8% |
 * | 64 | 0.0121 | 0.0212 | 0.0167 | 0.0153 | 138.3% |
 * | 128 | 0.0121 | 0.0423 | 0.0166 | 0.0308 | 137.4% |
 * | 512 | 0.0123 | 0.1667 | 0.0164 | 0.1249 | 133.4% |
 * | 1024 | 0.0122 | 0.3360 | 0.0167 | 0.2447 | 137.3% |
 * | 4096 | 0.0121 | 1.3581 | 0.0180 | 0.9110 | 149.1% |
 * | 16384 | 0.0123 | 5.3333 | 0.0181 | 3.6248 | 147.1% |
 * | 65536 | 0.0126 | 20.7392 | 0.0182 | 14.3845 | 144.2% |
 * | 262144 | 0.0171 | 61.3633 | 0.0192 | 54.7045 | 112.2% |
 * | 1048576 | 0.0373 | 112.3153 | 0.0393 | 106.6493 | 105.3% |
 * | 4194304 | 0.1068 | 157.1136 | 0.1061 | 158.0609 | 99.4% |
 * | 16777216 | 0.3833 | 175.0983 | 0.3951 | 169.8718 | 103.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![isamax-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-default.svg)
 *
 * ![isamax-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-default.svg)
 *
 * ## See also
 *
 * - [isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/isamax.js) — WebGPU benchmark script
 * - [isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/isamax.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0120 | 0.0107 | 0.0164 | 0.0078 | 137.1% |
 * | 64 | 0.0122 | 0.0210 | 0.0165 | 0.0155 | 135.3% |
 * | 128 | 0.0122 | 0.0421 | 0.0168 | 0.0305 | 138.1% |
 * | 512 | 0.0122 | 0.1682 | 0.0168 | 0.1217 | 138.2% |
 * | 1024 | 0.0121 | 0.3386 | 0.0169 | 0.2427 | 139.5% |
 * | 4096 | 0.0123 | 1.3333 | 0.0180 | 0.9094 | 146.6% |
 * | 16384 | 0.0129 | 5.0945 | 0.0181 | 3.6280 | 140.4% |
 * | 65536 | 0.0164 | 16.0000 | 0.0192 | 13.6193 | 117.5% |
 * | 262144 | 0.0361 | 29.0754 | 0.0410 | 25.5601 | 113.8% |
 * | 1048576 | 0.1028 | 40.7879 | 0.1050 | 39.9305 | 102.1% |
 * | 4194304 | 0.3707 | 45.2597 | 0.3748 | 44.7689 | 101.1% |
 *
 * ![isamax-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride4.svg)
 *
 * ![isamax-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0121 | 0.0106 | 0.0168 | 0.0076 | 139.1% |
 * | 64 | 0.0122 | 0.0211 | 0.0168 | 0.0153 | 137.6% |
 * | 128 | 0.0123 | 0.0417 | 0.0167 | 0.0307 | 135.7% |
 * | 512 | 0.0122 | 0.1680 | 0.0168 | 0.1218 | 137.9% |
 * | 1024 | 0.0122 | 0.3355 | 0.0167 | 0.2452 | 136.8% |
 * | 4096 | 0.0123 | 1.3333 | 0.0180 | 0.9118 | 146.2% |
 * | 16384 | 0.0131 | 5.0073 | 0.0179 | 3.6539 | 137.0% |
 * | 65536 | 0.0205 | 12.8000 | 0.0221 | 11.8467 | 108.0% |
 * | 262144 | 0.0416 | 25.2353 | 0.0436 | 24.0323 | 105.0% |
 * | 1048576 | 0.1252 | 33.4965 | 0.1281 | 32.7353 | 102.3% |
 * | 4194304 | 0.4600 | 36.4709 | 0.4649 | 36.0906 | 101.1% |
 *
 * ![isamax-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride5.svg)
 *
 * ![isamax-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0121 | 0.0106 | 0.0166 | 0.0077 | 137.8% |
 * | 64 | 0.0121 | 0.0211 | 0.0167 | 0.0153 | 137.8% |
 * | 128 | 0.0121 | 0.0422 | 0.0168 | 0.0304 | 138.7% |
 * | 512 | 0.0123 | 0.1667 | 0.0165 | 0.1242 | 134.2% |
 * | 1024 | 0.0123 | 0.3333 | 0.0168 | 0.2433 | 137.0% |
 * | 4096 | 0.0125 | 1.3061 | 0.0181 | 0.9062 | 144.1% |
 * | 16384 | 0.0193 | 3.4020 | 0.0207 | 3.1703 | 107.3% |
 * | 65536 | 0.0365 | 7.1891 | 0.0397 | 6.6091 | 108.8% |
 * | 262144 | 0.1044 | 10.0392 | 0.1063 | 9.8654 | 101.8% |
 * | 1048576 | 0.3748 | 11.1913 | 0.3761 | 11.1532 | 100.3% |
 *
 * ![isamax-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride32.svg)
 *
 * ![isamax-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0120 | 0.0214 | 0.0167 | 0.0153 | 139.6% |
 * | 128 | 0.0121 | 0.0423 | 0.0167 | 0.0307 | 137.7% |
 * | 512 | 0.0123 | 0.1667 | 0.0167 | 0.1228 | 135.7% |
 * | 1024 | 0.0123 | 0.3333 | 0.0167 | 0.2457 | 135.7% |
 * | 4096 | 0.0125 | 1.3145 | 0.0180 | 0.9127 | 144.0% |
 * | 16384 | 0.0194 | 3.3795 | 0.0207 | 3.1678 | 106.7% |
 * | 65536 | 0.0374 | 7.0047 | 0.0396 | 6.6118 | 105.9% |
 * | 262144 | 0.1061 | 9.8833 | 0.1071 | 9.7917 | 100.9% |
 *
 * ![isamax-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride33.svg)
 *
 * ![isamax-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0141 | 0.1456 | 0.0166 | 0.1234 | 118.0% |
 * | 1024 | 0.0142 | 0.2876 | 0.0168 | 0.2443 | 117.7% |
 * | 4096 | 0.0143 | 1.1429 | 0.0180 | 0.9094 | 125.7% |
 * | 16384 | 0.0279 | 2.3513 | 0.0301 | 2.1741 | 108.2% |
 * | 65536 | 0.0593 | 4.4221 | 0.0680 | 3.8560 | 114.7% |
 *
 * ![isamax-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride255.svg)
 *
 * ![isamax-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0123 | 0.1667 | 0.0164 | 0.1250 | 133.3% |
 * | 1024 | 0.0123 | 0.3333 | 0.0168 | 0.2443 | 136.4% |
 * | 4096 | 0.0126 | 1.3028 | 0.0175 | 0.9343 | 139.4% |
 * | 16384 | 0.0225 | 2.9132 | 0.0291 | 2.2505 | 129.4% |
 * | 65536 | 0.0470 | 5.5823 | 0.0505 | 5.1865 | 107.6% |
 *
 * ![isamax-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/gbps-stride256.svg)
 *
 * ![isamax-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/isamax/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/stride.isamax.js) — WebGPU stride-sweep benchmark script
 * - [stride.isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/stride.isamax.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
