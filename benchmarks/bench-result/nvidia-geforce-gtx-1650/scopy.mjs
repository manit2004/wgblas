/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0417 | 0.0027 | 0.0964 | 43.2% |
 * | 64 | 0.0060 | 0.0847 | 0.0026 | 0.1939 | 43.7% |
 * | 128 | 0.0061 | 0.1671 | 0.0027 | 0.3855 | 43.3% |
 * | 512 | 0.0061 | 0.6667 | 0.0028 | 1.4629 | 45.6% |
 * | 1024 | 0.0061 | 1.3368 | 0.0028 | 2.9767 | 44.9% |
 * | 4096 | 0.0061 | 5.3333 | 0.0028 | 11.7701 | 45.3% |
 * | 16384 | 0.0064 | 20.3781 | 0.0033 | 39.9610 | 51.0% |
 * | 65536 | 0.0082 | 64.0000 | 0.0044 | 119.5912 | 53.5% |
 * | 262144 | 0.0184 | 113.7778 | 0.0161 | 130.1609 | 87.4% |
 * | 1048576 | 0.0594 | 141.2414 | 0.0532 | 157.5385 | 89.7% |
 * | 4194304 | 0.2171 | 154.5888 | 0.2027 | 165.5733 | 93.4% |
 * | 16777216 | 0.8053 | 166.6721 | 0.8025 | 167.2470 | 99.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![scopy-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-default.svg)
 *
 * ![scopy-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-default.svg)
 *
 * ## See also
 *
 * - [scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/scopy.js) — WebGPU benchmark script
 * - [scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/scopy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0061 | 0.0417 | 0.0028 | 0.0904 | 46.1% |
 * | 64 | 0.0061 | 0.0838 | 0.0028 | 0.1798 | 46.6% |
 * | 128 | 0.0061 | 0.1680 | 0.0029 | 0.3575 | 47.0% |
 * | 512 | 0.0061 | 0.6684 | 0.0031 | 1.3333 | 50.1% |
 * | 1024 | 0.0061 | 1.3333 | 0.0031 | 2.6667 | 50.0% |
 * | 4096 | 0.0063 | 5.2245 | 0.0033 | 10.0392 | 52.0% |
 * | 16384 | 0.0068 | 19.3208 | 0.0041 | 32.0000 | 60.4% |
 * | 65536 | 0.0202 | 25.9241 | 0.0224 | 23.4392 | 110.6% |
 * | 262144 | 0.0780 | 26.9031 | 0.0792 | 26.4899 | 101.6% |
 * | 1048576 | 0.3068 | 27.3423 | 0.3069 | 27.3323 | 100.0% |
 * | 4194304 | 1.2268 | 27.3523 | 1.2180 | 27.5499 | 99.3% |
 *
 * ![scopy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride4.svg)
 *
 * ![scopy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0426 | 0.0028 | 0.0904 | 47.1% |
 * | 64 | 0.0061 | 0.0833 | 0.0031 | 0.1641 | 50.8% |
 * | 128 | 0.0061 | 0.1667 | 0.0029 | 0.3556 | 46.9% |
 * | 512 | 0.0061 | 0.6667 | 0.0031 | 1.3061 | 51.0% |
 * | 1024 | 0.0061 | 1.3368 | 0.0031 | 2.6256 | 50.9% |
 * | 4096 | 0.0063 | 5.2245 | 0.0034 | 9.5701 | 54.6% |
 * | 16384 | 0.0074 | 17.8087 | 0.0042 | 31.0303 | 57.4% |
 * | 65536 | 0.0248 | 21.0998 | 0.0266 | 19.6923 | 107.1% |
 * | 262144 | 0.0976 | 21.4978 | 0.0983 | 21.3333 | 100.8% |
 * | 1048576 | 0.3842 | 21.8317 | 0.3841 | 21.8381 | 100.0% |
 * | 4194304 | 1.5307 | 21.9211 | 1.5279 | 21.9611 | 99.8% |
 *
 * ![scopy-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride5.svg)
 *
 * ![scopy-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0420 | 0.0029 | 0.0879 | 47.8% |
 * | 64 | 0.0061 | 0.0833 | 0.0029 | 0.1749 | 47.6% |
 * | 128 | 0.0061 | 0.1689 | 0.0031 | 0.3282 | 51.5% |
 * | 512 | 0.0061 | 0.6667 | 0.0035 | 1.1852 | 56.2% |
 * | 1024 | 0.0063 | 1.3061 | 0.0034 | 2.3814 | 54.8% |
 * | 4096 | 0.0082 | 4.0000 | 0.0044 | 7.4203 | 53.9% |
 * | 16384 | 0.0191 | 6.8725 | 0.0182 | 7.2113 | 95.3% |
 * | 65536 | 0.0676 | 7.7576 | 0.0652 | 8.0472 | 96.4% |
 * | 262144 | 0.2601 | 8.0630 | 0.2508 | 8.3629 | 96.4% |
 * | 1048576 | 1.0312 | 8.1348 | 0.9914 | 8.4610 | 96.1% |
 *
 * ![scopy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride32.svg)
 *
 * ![scopy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.0836 | 0.0029 | 0.1778 | 47.0% |
 * | 128 | 0.0061 | 0.1667 | 0.0029 | 0.3556 | 46.9% |
 * | 512 | 0.0061 | 0.6667 | 0.0033 | 1.2308 | 54.2% |
 * | 1024 | 0.0062 | 1.3162 | 0.0032 | 2.5347 | 51.9% |
 * | 4096 | 0.0080 | 4.1207 | 0.0041 | 8.0000 | 51.5% |
 * | 16384 | 0.0201 | 6.5327 | 0.0191 | 6.8725 | 95.1% |
 * | 65536 | 0.0739 | 7.0911 | 0.0710 | 7.3835 | 96.0% |
 * | 262144 | 0.2931 | 7.1550 | 0.2761 | 7.5966 | 94.2% |
 *
 * ![scopy-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride33.svg)
 *
 * ![scopy-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0065 | 0.6337 | 0.0032 | 1.2995 | 48.8% |
 * | 1024 | 0.0064 | 1.2800 | 0.0032 | 2.5473 | 50.2% |
 * | 4096 | 0.0082 | 4.0000 | 0.0044 | 7.4203 | 53.9% |
 * | 16384 | 0.0314 | 4.1732 | 0.0348 | 3.7647 | 110.9% |
 * | 65536 | 0.1475 | 3.5556 | 0.1468 | 3.5718 | 99.5% |
 *
 * ![scopy-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride255.svg)
 *
 * ![scopy-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0061 | 0.6667 | 0.0035 | 1.1852 | 56.2% |
 * | 1024 | 0.0064 | 1.2897 | 0.0035 | 2.3273 | 55.4% |
 * | 4096 | 0.0082 | 3.9844 | 0.0044 | 7.5294 | 52.9% |
 * | 16384 | 0.0284 | 4.6230 | 0.0312 | 4.2053 | 109.9% |
 * | 65536 | 0.1375 | 3.8120 | 0.1407 | 3.7270 | 102.3% |
 *
 * ![scopy-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/gbps-stride256.svg)
 *
 * ![scopy-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/scopy/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/stride.scopy.js) — WebGPU stride-sweep benchmark script
 * - [stride.scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/stride.scopy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/scopy
 */
