/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0638 | 0.0027 | 0.1437 | 44.4% |
 * | 64 | 0.0059 | 0.1294 | 0.0028 | 0.2712 | 47.7% |
 * | 128 | 0.0059 | 0.2595 | 0.0037 | 0.4192 | 61.9% |
 * | 512 | 0.0061 | 1.0105 | 0.0031 | 2.0000 | 50.5% |
 * | 1024 | 0.0061 | 2.0264 | 0.0032 | 3.8593 | 52.5% |
 * | 4096 | 0.0061 | 8.0000 | 0.0030 | 16.4278 | 48.7% |
 * | 16384 | 0.0063 | 31.0303 | 0.0034 | 57.4206 | 54.0% |
 * | 65536 | 0.0082 | 96.0000 | 0.0046 | 170.6667 | 56.2% |
 * | 262144 | 0.0224 | 140.7359 | 0.0206 | 152.6460 | 92.2% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0740 | 170.0026 | 97.7% |
 * | 4194304 | 0.2909 | 173.0323 | 0.2883 | 174.5687 | 99.1% |
 * | 16777216 | 1.1591 | 173.6964 | 1.1428 | 176.1720 | 98.6% |
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
 * | 32 | 0.0060 | 0.0640 | 0.0028 | 0.1395 | 45.9% |
 * | 64 | 0.0060 | 0.1283 | 0.0032 | 0.2376 | 54.0% |
 * | 128 | 0.0060 | 0.2546 | 0.0029 | 0.5217 | 48.8% |
 * | 512 | 0.0060 | 1.0186 | 0.0032 | 1.9492 | 52.3% |
 * | 1024 | 0.0061 | 2.0105 | 0.0029 | 4.2667 | 47.1% |
 * | 4096 | 0.0063 | 7.8367 | 0.0034 | 14.5592 | 53.8% |
 * | 16384 | 0.0076 | 25.8151 | 0.0042 | 47.2615 | 54.6% |
 * | 65536 | 0.0221 | 35.6174 | 0.0207 | 38.0433 | 93.6% |
 * | 262144 | 0.0758 | 41.5135 | 0.0749 | 41.9923 | 98.9% |
 * | 1048576 | 0.2908 | 43.2628 | 0.2919 | 43.1016 | 100.4% |
 * | 4194304 | 1.1528 | 43.6616 | 1.1586 | 43.4421 | 100.5% |
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
 * | 32 | 0.0061 | 0.0625 | 0.0028 | 0.1379 | 45.3% |
 * | 64 | 0.0060 | 0.1270 | 0.0027 | 0.2824 | 45.0% |
 * | 128 | 0.0061 | 0.2533 | 0.0031 | 0.5026 | 50.4% |
 * | 512 | 0.0061 | 1.0000 | 0.0034 | 1.8199 | 54.9% |
 * | 1024 | 0.0064 | 1.9345 | 0.0035 | 3.5229 | 54.9% |
 * | 4096 | 0.0084 | 5.8851 | 0.0048 | 10.2742 | 57.3% |
 * | 16384 | 0.0257 | 7.6418 | 0.0234 | 8.3934 | 91.0% |
 * | 65536 | 0.0882 | 8.9124 | 0.0862 | 9.1259 | 97.7% |
 * | 262144 | 0.3439 | 9.1480 | 0.3379 | 9.3091 | 98.3% |
 * | 1048576 | 1.3639 | 9.2254 | 1.3448 | 9.3564 | 98.6% |
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
 * | 512 | 0.0062 | 0.9897 | 0.0034 | 1.7944 | 55.2% |
 * | 1024 | 0.0064 | 1.9296 | 0.0039 | 3.1220 | 61.8% |
 * | 4096 | 0.0088 | 5.5855 | 0.0047 | 10.3784 | 53.8% |
 * | 16384 | 0.0411 | 4.7813 | 0.0471 | 4.1739 | 114.6% |
 * | 65536 | 0.1808 | 4.3497 | 0.1907 | 4.1238 | 105.5% |
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
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 2.0590 | 0.0027 | 4.6265 | 44.5% |
 * | 65536 | 0.0081 | 96.7559 | 0.0047 | 168.3288 | 57.5% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0740 | 169.9291 | 97.7% |
 * | 16777216 | 1.1612 | 173.3757 | 1.1428 | 176.1720 | 98.4% |
 *
 * ![saxpy-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alphaneg3p75.svg)
 *
 * ![saxpy-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0073 | 1.6842 | 0.0023 | 5.3333 | 31.6% |
 * | 65536 | 0.0102 | 76.8000 | 0.0028 | 276.1348 | 27.8% |
 * | 1048576 | 0.0779 | 161.5845 | 0.0114 | 1101.4453 | 14.7% |
 * | 16777216 | 1.1571 | 173.9870 | 0.1468 | 1370.9863 | 12.7% |
 *
 * ![saxpy-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha0.svg)
 *
 * ![saxpy-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0059 | 2.0701 | 0.0026 | 4.6545 | 44.5% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 167.7543 | 57.2% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0741 | 169.8191 | 97.8% |
 * | 16777216 | 1.1609 | 173.4187 | 1.1418 | 176.3177 | 98.4% |
 *
 * ![saxpy-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha1eneg38.svg)
 *
 * ![saxpy-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.0000 | 0.0027 | 4.5714 | 43.8% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 168.9072 | 56.8% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0740 | 170.0026 | 97.7% |
 * | 16777216 | 1.1606 | 173.4665 | 1.1318 | 177.8780 | 97.5% |
 *
 * ![saxpy-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha1.svg)
 *
 * ![saxpy-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 2.0317 | 0.0033 | 3.6923 | 55.0% |
 * | 65536 | 0.0082 | 96.0000 | 0.0060 | 132.1290 | 72.7% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0739 | 170.2971 | 97.5% |
 * | 16777216 | 1.1612 | 173.3852 | 1.1428 | 176.1720 | 98.4% |
 *
 * ![saxpy-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-alpha2p5.svg)
 *
 * ![saxpy-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/alpha.saxpy.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/alpha.saxpy.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
