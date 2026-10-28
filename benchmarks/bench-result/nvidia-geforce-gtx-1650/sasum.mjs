/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 0.0122 | 0.0176 | 0.0073 | 166.5% |
 * | 64 | 0.0106 | 0.0242 | 0.0180 | 0.0142 | 170.2% |
 * | 128 | 0.0107 | 0.0480 | 0.0180 | 0.0285 | 168.6% |
 * | 512 | 0.0109 | 0.1885 | 0.0180 | 0.1140 | 165.4% |
 * | 1024 | 0.0107 | 0.3832 | 0.0179 | 0.2286 | 167.6% |
 * | 4096 | 0.0106 | 1.5422 | 0.0180 | 0.9127 | 169.0% |
 * | 16384 | 0.0114 | 5.7528 | 0.0180 | 3.6312 | 158.4% |
 * | 65536 | 0.0115 | 22.7872 | 0.0181 | 14.4607 | 157.6% |
 * | 262144 | 0.0155 | 67.6326 | 0.0191 | 54.7960 | 123.4% |
 * | 1048576 | 0.0360 | 116.3533 | 0.0444 | 94.5344 | 123.1% |
 * | 4194304 | 0.1057 | 158.7789 | 0.1291 | 129.9351 | 122.2% |
 * | 16777216 | 0.3826 | 175.4058 | 0.5331 | 125.8757 | 139.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sasum-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-default.svg)
 *
 * ![sasum-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-default.svg)
 *
 * ## See also
 *
 * - [sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/sasum.js) — WebGPU benchmark script
 * - [sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/sasum.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0105 | 0.0122 | 0.0180 | 0.0071 | 171.8% |
 * | 64 | 0.0107 | 0.0240 | 0.0179 | 0.0143 | 168.0% |
 * | 128 | 0.0106 | 0.0482 | 0.0179 | 0.0285 | 169.1% |
 * | 512 | 0.0106 | 0.1928 | 0.0180 | 0.1140 | 169.1% |
 * | 1024 | 0.0106 | 0.3867 | 0.0179 | 0.2292 | 168.7% |
 * | 4096 | 0.0108 | 1.5238 | 0.0179 | 0.9159 | 166.4% |
 * | 16384 | 0.0116 | 5.6341 | 0.0179 | 3.6571 | 154.1% |
 * | 65536 | 0.0145 | 18.0441 | 0.0191 | 13.7450 | 131.3% |
 * | 262144 | 0.0348 | 30.1731 | 0.0368 | 28.5063 | 105.8% |
 * | 1048576 | 0.1015 | 41.3346 | 0.1056 | 39.7188 | 104.1% |
 * | 4194304 | 0.3687 | 45.4993 | 0.3730 | 44.9820 | 101.1% |
 *
 * ![sasum-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride4.svg)
 *
 * ![sasum-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0106 | 0.0120 | 0.0174 | 0.0074 | 162.8% |
 * | 64 | 0.0106 | 0.0241 | 0.0179 | 0.0143 | 168.5% |
 * | 128 | 0.0106 | 0.0482 | 0.0180 | 0.0285 | 169.1% |
 * | 512 | 0.0105 | 0.1945 | 0.0180 | 0.1139 | 170.8% |
 * | 1024 | 0.0106 | 0.3873 | 0.0179 | 0.2284 | 169.6% |
 * | 4096 | 0.0109 | 1.4993 | 0.0180 | 0.9127 | 164.3% |
 * | 16384 | 0.0120 | 5.4833 | 0.0179 | 3.6637 | 149.7% |
 * | 65536 | 0.0187 | 14.0515 | 0.0201 | 13.0654 | 107.5% |
 * | 262144 | 0.0403 | 26.0167 | 0.0455 | 23.0355 | 112.9% |
 * | 1048576 | 0.1241 | 33.7945 | 0.1288 | 32.5766 | 103.7% |
 * | 4194304 | 0.4581 | 36.6264 | 0.4615 | 36.3521 | 100.8% |
 *
 * ![sasum-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride5.svg)
 *
 * ![sasum-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0106 | 0.0120 | 0.0175 | 0.0073 | 165.0% |
 * | 64 | 0.0106 | 0.0241 | 0.0181 | 0.0141 | 170.9% |
 * | 128 | 0.0107 | 0.0480 | 0.0179 | 0.0286 | 168.0% |
 * | 512 | 0.0106 | 0.1925 | 0.0179 | 0.1146 | 168.0% |
 * | 1024 | 0.0110 | 0.3710 | 0.0179 | 0.2290 | 162.0% |
 * | 4096 | 0.0114 | 1.4402 | 0.0180 | 0.9078 | 158.7% |
 * | 16384 | 0.0181 | 3.6152 | 0.0215 | 3.0476 | 118.6% |
 * | 65536 | 0.0348 | 7.5294 | 0.0396 | 6.6171 | 113.8% |
 * | 262144 | 0.1024 | 10.2400 | 0.1043 | 10.0515 | 101.9% |
 * | 1048576 | 0.3727 | 11.2547 | 0.3737 | 11.2243 | 100.3% |
 *
 * ![sasum-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride32.svg)
 *
 * ![sasum-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0106 | 0.0242 | 0.0179 | 0.0143 | 169.5% |
 * | 128 | 0.0106 | 0.0484 | 0.0180 | 0.0285 | 169.9% |
 * | 512 | 0.0107 | 0.1922 | 0.0179 | 0.1146 | 167.7% |
 * | 1024 | 0.0107 | 0.3821 | 0.0179 | 0.2290 | 166.9% |
 * | 4096 | 0.0112 | 1.4587 | 0.0179 | 0.9167 | 159.1% |
 * | 16384 | 0.0179 | 3.6604 | 0.0214 | 3.0613 | 119.6% |
 * | 65536 | 0.0358 | 7.3274 | 0.0396 | 6.6225 | 110.6% |
 * | 262144 | 0.1043 | 10.0515 | 0.1059 | 9.9027 | 101.5% |
 *
 * ![sasum-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride33.svg)
 *
 * ![sasum-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0124 | 0.1649 | 0.0180 | 0.1139 | 144.8% |
 * | 1024 | 0.0108 | 0.3787 | 0.0179 | 0.2286 | 165.7% |
 * | 4096 | 0.0111 | 1.4734 | 0.0178 | 0.9192 | 160.3% |
 * | 16384 | 0.0238 | 2.7582 | 0.0302 | 2.1718 | 127.0% |
 * | 65536 | 0.0612 | 4.2868 | 0.0622 | 4.2162 | 101.7% |
 *
 * ![sasum-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride255.svg)
 *
 * ![sasum-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0108 | 0.1893 | 0.0178 | 0.1150 | 164.7% |
 * | 1024 | 0.0108 | 0.3804 | 0.0179 | 0.2286 | 166.4% |
 * | 4096 | 0.0116 | 1.4105 | 0.0174 | 0.9403 | 150.0% |
 * | 16384 | 0.0205 | 3.2000 | 0.0217 | 3.0251 | 105.8% |
 * | 65536 | 0.0451 | 5.8182 | 0.0500 | 5.2395 | 111.0% |
 *
 * ![sasum-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/gbps-stride256.svg)
 *
 * ![sasum-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sasum/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/stride.sasum.js) — WebGPU stride-sweep benchmark script
 * - [stride.sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/stride.sasum.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
