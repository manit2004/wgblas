/**
 * Benchmark results for ddot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0224 | 0.0229 | 0.0182 | 0.0281 | 81.5% |
 * | 64 | 0.0226 | 0.0454 | 0.0181 | 0.0564 | 80.5% |
 * | 128 | 0.0232 | 0.0882 | 0.0182 | 0.1127 | 78.2% |
 * | 512 | 0.0236 | 0.3476 | 0.0179 | 0.4580 | 75.9% |
 * | 1024 | 0.0233 | 0.7019 | 0.0181 | 0.9062 | 77.4% |
 * | 4096 | 0.0225 | 2.9091 | 0.0181 | 3.6120 | 80.5% |
 * | 16384 | 0.0241 | 10.8647 | 0.0181 | 14.4991 | 74.9% |
 * | 65536 | 0.0318 | 32.9327 | 0.0183 | 57.3870 | 57.4% |
 * | 262144 | 0.0512 | 81.8944 | 0.0432 | 97.0904 | 84.3% |
 * | 1048576 | 0.1200 | 139.8101 | 0.1113 | 150.7441 | 92.7% |
 * | 4194304 | 0.3970 | 169.0434 | 0.3792 | 176.9524 | 95.5% |
 * | 16777216 | 1.4836 | 180.9391 | 1.4542 | 184.5881 | 98.0% |
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
 * | 32 | 0.0201 | 0.0255 | 0.0188 | 0.0273 | 93.4% |
 * | 64 | 0.0199 | 0.0515 | 0.0188 | 0.0544 | 94.7% |
 * | 128 | 0.0201 | 0.1017 | 0.0188 | 0.1090 | 93.3% |
 * | 512 | 0.0199 | 0.4116 | 0.0188 | 0.4369 | 94.2% |
 * | 1024 | 0.0199 | 0.8232 | 0.0188 | 0.8730 | 94.3% |
 * | 4096 | 0.0207 | 3.1727 | 0.0187 | 3.5038 | 90.6% |
 * | 16384 | 0.0271 | 9.6775 | 0.0206 | 12.7403 | 76.0% |
 * | 65536 | 0.0518 | 20.2397 | 0.0423 | 24.7680 | 81.7% |
 * | 262144 | 0.1188 | 35.3103 | 0.1080 | 38.8189 | 91.0% |
 * | 1048576 | 0.3997 | 41.9766 | 0.3885 | 43.1797 | 97.2% |
 * | 4194304 | 1.5181 | 44.2069 | 1.4773 | 45.4273 | 97.3% |
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
 * | 32 | 0.0183 | 0.0280 | 0.0149 | 0.0344 | 81.5% |
 * | 64 | 0.0182 | 0.0563 | 0.0150 | 0.0681 | 82.7% |
 * | 128 | 0.0182 | 0.1127 | 0.0157 | 0.1303 | 86.5% |
 * | 512 | 0.0183 | 0.4487 | 0.0150 | 0.5476 | 81.9% |
 * | 1024 | 0.0183 | 0.8935 | 0.0146 | 1.1228 | 79.6% |
 * | 4096 | 0.0191 | 3.4391 | 0.0154 | 4.2534 | 80.9% |
 * | 16384 | 0.0283 | 9.2775 | 0.0257 | 10.1827 | 91.1% |
 * | 65536 | 0.0505 | 20.7458 | 0.0459 | 22.8508 | 90.8% |
 * | 262144 | 0.1358 | 30.8841 | 0.1270 | 33.0198 | 93.5% |
 * | 1048576 | 0.4937 | 33.9829 | 0.4640 | 36.1590 | 94.0% |
 * | 4194304 | 1.9176 | 34.9960 | 1.8006 | 37.2694 | 93.9% |
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
 * | 32 | 0.0181 | 0.0283 | 0.0180 | 0.0284 | 99.7% |
 * | 64 | 0.0181 | 0.0565 | 0.0176 | 0.0582 | 97.1% |
 * | 128 | 0.0183 | 0.1119 | 0.0180 | 0.1141 | 98.1% |
 * | 512 | 0.0184 | 0.4456 | 0.0177 | 0.4638 | 96.1% |
 * | 1024 | 0.0184 | 0.8889 | 0.0174 | 0.9412 | 94.4% |
 * | 4096 | 0.0266 | 2.4675 | 0.0176 | 3.7338 | 66.1% |
 * | 16384 | 0.0432 | 6.0637 | 0.0288 | 9.0871 | 66.7% |
 * | 65536 | 0.1117 | 9.3905 | 0.0593 | 17.6838 | 53.1% |
 * | 262144 | 0.3953 | 10.6114 | 0.1964 | 21.3559 | 49.7% |
 * | 1048576 | 1.8346 | 9.1449 | — | — | — |
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
 * | 64 | 0.0305 | 0.0336 | 0.0182 | 0.0563 | 59.6% |
 * | 128 | 0.0309 | 0.0663 | 0.0179 | 0.1143 | 58.0% |
 * | 512 | 0.0306 | 0.2681 | 0.0181 | 0.4515 | 59.4% |
 * | 1024 | 0.0312 | 0.5257 | 0.0147 | 1.1167 | 47.1% |
 * | 4096 | 0.0379 | 1.7283 | 0.0194 | 3.3851 | 51.1% |
 * | 16384 | 0.0556 | 4.7189 | 0.0295 | 8.8947 | 53.1% |
 * | 65536 | 0.1242 | 8.4443 | 0.0596 | 17.5936 | 48.0% |
 * | 262144 | 0.4298 | 9.7578 | 0.1952 | 21.4855 | 45.4% |
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
 * | 512 | 0.0345 | 0.2374 | 0.0180 | 0.4551 | 52.2% |
 * | 1024 | 0.0336 | 0.4876 | 0.0181 | 0.9030 | 54.0% |
 * | 4096 | 0.0471 | 1.3918 | 0.0191 | 3.4362 | 40.5% |
 * | 16384 | 0.0786 | 3.3341 | 0.0399 | 6.5746 | 50.7% |
 * | 65536 | 0.2560 | 4.0960 | 0.1089 | 9.6263 | 42.6% |
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
 * | 512 | 0.0315 | 0.2600 | 0.0182 | 0.4507 | 57.7% |
 * | 1024 | 0.0321 | 0.5107 | 0.0181 | 0.9030 | 56.6% |
 * | 4096 | 0.0432 | 1.5170 | 0.0187 | 3.5068 | 43.3% |
 * | 16384 | 0.0703 | 3.7279 | 0.0394 | 6.6494 | 56.1% |
 * | 65536 | 0.1878 | 5.5832 | 0.0902 | 11.6199 | 48.0% |
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
