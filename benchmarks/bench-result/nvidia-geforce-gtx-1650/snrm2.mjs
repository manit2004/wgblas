/**
 * Benchmark results for snrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0164 | 0.0078 | 0.0182 | 0.0070 | 111.6% |
 * | 64 | 0.0164 | 0.0156 | 0.0180 | 0.0142 | 110.0% |
 * | 128 | 0.0162 | 0.0316 | 0.0180 | 0.0284 | 111.1% |
 * | 512 | 0.0164 | 0.1250 | 0.0180 | 0.1139 | 109.7% |
 * | 1024 | 0.0161 | 0.2545 | 0.0180 | 0.2270 | 112.1% |
 * | 4096 | 0.0164 | 1.0000 | 0.0180 | 0.9094 | 110.0% |
 * | 16384 | 0.0166 | 3.9537 | 0.0184 | 3.5586 | 111.1% |
 * | 65536 | 0.0180 | 14.6025 | 0.0181 | 14.4480 | 101.1% |
 * | 262144 | 0.0288 | 36.4697 | 0.0190 | 55.0723 | 66.2% |
 * | 1048576 | 0.0636 | 65.8984 | 0.0442 | 94.9797 | 69.4% |
 * | 4194304 | 0.2105 | 79.6851 | 0.1436 | 116.8590 | 68.2% |
 * | 16777216 | 0.9362 | 71.6816 | 2.7987 | 23.9783 | 298.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![snrm2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-default.svg)
 *
 * ![snrm2-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-default.svg)
 *
 * ## See also
 *
 * - [snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/snrm2.js) — WebGPU benchmark script
 * - [snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/snrm2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0217 | 0.0059 | 0.0181 | 0.0071 | 83.2% |
 * | 64 | 0.0213 | 0.0120 | 0.0180 | 0.0142 | 84.6% |
 * | 128 | 0.0212 | 0.0242 | 0.1469 | 0.0035 | 690.5% |
 * | 512 | 0.0210 | 0.0974 | 0.0180 | 0.1139 | 85.5% |
 * | 1024 | 0.0210 | 0.1950 | 0.0191 | 0.2140 | 91.1% |
 * | 4096 | 0.0212 | 0.7711 | 0.0180 | 0.9127 | 84.5% |
 * | 16384 | 0.0222 | 2.9553 | 0.0180 | 3.6441 | 81.1% |
 * | 65536 | 0.0287 | 9.1429 | 0.0188 | 13.9557 | 65.5% |
 * | 262144 | 0.0477 | 21.9772 | 0.0372 | 28.1875 | 78.0% |
 * | 1048576 | 0.1153 | 36.3685 | 0.1052 | 39.8819 | 91.2% |
 * | 4194304 | 0.3909 | 42.9181 | 0.3767 | 44.5369 | 96.4% |
 *
 * ![snrm2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride4.svg)
 *
 * ![snrm2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0220 | 0.0058 | 0.1618 | 0.0008 | 725.7% |
 * | 64 | 0.0214 | 0.0120 | 0.0194 | 0.0132 | 90.8% |
 * | 128 | 0.0215 | 0.0238 | 0.0182 | 0.0281 | 84.7% |
 * | 512 | 0.0210 | 0.0974 | 0.0175 | 0.1173 | 83.0% |
 * | 1024 | 0.0212 | 0.1936 | 0.0173 | 0.2370 | 81.7% |
 * | 4096 | 0.0219 | 0.7491 | 0.0177 | 0.9259 | 80.9% |
 * | 16384 | 0.0299 | 2.1927 | 0.0396 | 1.6529 | 132.7% |
 * | 65536 | 0.0463 | 5.6575 | 0.1685 | 1.5555 | 363.7% |
 * | 262144 | 0.1145 | 9.1556 | 0.2785 | 3.7647 | 243.2% |
 * | 1048576 | 0.3914 | 10.7173 | 0.7664 | 5.4724 | 195.8% |
 *
 * ![snrm2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride32.svg)
 *
 * ![snrm2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0274 | 0.0748 | 0.0176 | 0.1162 | 64.3% |
 * | 1024 | 0.0279 | 0.1469 | 0.0181 | 0.2265 | 64.8% |
 * | 4096 | 0.0284 | 0.5763 | 0.0181 | 0.9030 | 63.8% |
 * | 16384 | 0.0385 | 1.7003 | 0.0490 | 1.3381 | 127.1% |
 * | 65536 | 0.0650 | 4.0305 | 0.0719 | 3.6474 | 110.5% |
 *
 * ![snrm2-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/gbps-stride256.svg)
 *
 * ![snrm2-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/snrm2/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/stride.snrm2.js) — WebGPU stride-sweep benchmark script
 * - [stride.snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/stride.snrm2.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/snrm2
 */
