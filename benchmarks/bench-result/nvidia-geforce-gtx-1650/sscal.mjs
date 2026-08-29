/**
 * Benchmark results for sscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0059 | 0.0434 | 0.0035 | 0.0734 | 59.1% |
 * | 64 | 0.0059 | 0.0874 | 0.0580 | 0.0088 | 993.5% |
 * | 128 | 0.0060 | 0.1720 | 0.0051 | 0.2013 | 85.5% |
 * | 512 | 0.0060 | 0.6790 | 0.0040 | 1.0323 | 65.8% |
 * | 1024 | 0.0061 | 1.3438 | 0.0035 | 2.3486 | 57.2% |
 * | 4096 | 0.0061 | 5.3753 | 0.0045 | 7.3143 | 73.5% |
 * | 16384 | 0.0063 | 20.9514 | 0.0038 | 34.5654 | 60.6% |
 * | 65536 | 0.0082 | 64.0000 | 0.0043 | 120.9151 | 52.9% |
 * | 262144 | 0.0164 | 128.0000 | 0.0458 | 45.8134 | 279.4% |
 * | 1048576 | 0.0571 | 146.9417 | 0.1250 | 67.1303 | 218.9% |
 * | 4194304 | 0.2437 | 137.6807 | 0.4321 | 77.6579 | 177.3% |
 * | 16777216 | 0.8417 | 159.4550 | 1.6230 | 82.6961 | 192.8% |
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
 * | 32 | 0.0064 | 0.0400 | 0.0062 | 0.0412 | 97.1% |
 * | 64 | 0.0064 | 0.0794 | 0.0042 | 0.1226 | 64.8% |
 * | 128 | 0.0064 | 0.1592 | 0.0041 | 0.2481 | 64.2% |
 * | 512 | 0.0065 | 0.6305 | 0.0042 | 0.9846 | 64.0% |
 * | 1024 | 0.0066 | 1.2488 | 0.0042 | 1.9692 | 63.4% |
 * | 4096 | 0.0068 | 4.8075 | 0.0045 | 7.2367 | 66.4% |
 * | 16384 | 0.0079 | 16.5161 | 0.0066 | 19.8354 | 83.3% |
 * | 65536 | 0.0135 | 38.9169 | 0.0109 | 47.9766 | 81.1% |
 * | 262144 | 0.0531 | 39.4795 | 0.0617 | 33.9829 | 116.2% |
 * | 1048576 | 0.1975 | 42.4662 | 0.2373 | 35.3437 | 120.2% |
 * | 4194304 | 0.7775 | 43.1557 | 0.9362 | 35.8402 | 120.4% |
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
 * | 32 | 0.0065 | 0.0394 | 0.0041 | 0.0627 | 62.9% |
 * | 64 | 0.0063 | 0.0808 | 0.0041 | 0.1250 | 64.6% |
 * | 128 | 0.0063 | 0.1616 | 0.0040 | 0.2560 | 63.1% |
 * | 512 | 0.0064 | 0.6400 | 0.0042 | 0.9846 | 65.0% |
 * | 1024 | 0.0067 | 1.2249 | 0.0041 | 1.9845 | 61.7% |
 * | 4096 | 0.0080 | 4.0716 | 0.0056 | 5.8017 | 70.2% |
 * | 16384 | 0.0199 | 6.5746 | 0.0212 | 6.1873 | 106.3% |
 * | 65536 | 0.0673 | 7.7871 | 0.0984 | 5.3290 | 146.1% |
 * | 262144 | 0.2580 | 8.1270 | 0.2990 | 7.0137 | 115.9% |
 * | 1048576 | 1.0138 | 8.2747 | 1.1850 | 7.0788 | 116.9% |
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
 * | 512 | 0.0061 | 0.6667 | 0.0040 | 1.0323 | 64.6% |
 * | 1024 | 0.0062 | 1.3264 | 0.0041 | 2.0157 | 65.8% |
 * | 4096 | 0.0073 | 4.4814 | 0.0047 | 6.9189 | 64.8% |
 * | 16384 | 0.0290 | 4.5260 | 0.0348 | 3.7630 | 120.3% |
 * | 65536 | 0.1367 | 3.8352 | 0.1704 | 3.0762 | 124.7% |
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
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0062 | 1.3128 |
 * | 65536 | 0.0083 | 63.1368 |
 * | 1048576 | 0.0577 | 145.3932 |
 * | 16777216 | 0.8096 | 165.7762 |
 *
 * ![sscal-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-alphaneg3p75.svg)
 *
 * ![sscal-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0070 | 1.1663 |
 * | 65536 | 0.0102 | 51.2000 |
 * | 1048576 | 0.0657 | 127.6261 |
 * | 16777216 | 0.8304 | 161.6364 |
 *
 * ![sscal-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-alpha0.svg)
 *
 * ![sscal-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 1.3333 |
 * | 65536 | 0.0082 | 64.0000 |
 * | 1048576 | 0.0574 | 146.2449 |
 * | 16777216 | 0.8101 | 165.6845 |
 *
 * ![sscal-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-alpha1eneg38.svg)
 *
 * ![sscal-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0069 | 1.1907 |
 * | 65536 | 0.0101 | 51.9303 |
 * | 1048576 | 0.0659 | 127.2544 |
 * | 16777216 | 0.8310 | 161.5213 |
 *
 * ![sscal-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-alpha1.svg)
 *
 * ![sscal-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0064 | 1.2800 |
 * | 65536 | 0.0090 | 58.2025 |
 * | 1048576 | 0.0611 | 137.3201 |
 * | 16777216 | 0.8133 | 165.0294 |
 *
 * ![sscal-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-alpha2p5.svg)
 *
 * ![sscal-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/wgblas/alpha.sscal.js) — WebGPU alpha-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sscal
 */
