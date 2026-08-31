/**
 * Benchmark results for sscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0428 | 0.0035 | 0.0741 | 57.7% |
 * | 64 | 0.0060 | 0.0849 | 0.0031 | 0.1675 | 50.7% |
 * | 128 | 0.0060 | 0.1711 | 0.0030 | 0.3441 | 49.7% |
 * | 512 | 0.0058 | 0.7014 | 0.0028 | 1.4713 | 47.7% |
 * | 1024 | 0.0060 | 1.3545 | 0.0031 | 2.6667 | 50.8% |
 * | 4096 | 0.0060 | 5.4180 | 0.0030 | 11.0703 | 48.9% |
 * | 16384 | 0.0063 | 20.8980 | 0.0035 | 37.2364 | 56.1% |
 * | 65536 | 0.0082 | 64.0000 | 0.0046 | 114.5734 | 55.9% |
 * | 262144 | 0.0164 | 128.0000 | 0.0111 | 188.8645 | 67.8% |
 * | 1048576 | 0.0567 | 147.9785 | 0.0525 | 159.6978 | 92.7% |
 * | 4194304 | 0.2108 | 159.1766 | 0.1990 | 168.6084 | 94.4% |
 * | 16777216 | 0.8122 | 165.2537 | 0.7944 | 168.9650 | 97.8% |
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
 * | 32 | 0.0070 | 0.0367 | 0.0035 | 0.0731 | 50.2% |
 * | 64 | 0.0070 | 0.0736 | 0.0036 | 0.1416 | 52.0% |
 * | 128 | 0.0069 | 0.1481 | 0.0035 | 0.2922 | 50.7% |
 * | 512 | 0.0070 | 0.5831 | 0.0033 | 1.2367 | 47.2% |
 * | 1024 | 0.0073 | 1.1278 | 0.0031 | 2.6806 | 42.1% |
 * | 4096 | 0.0078 | 4.2053 | 0.0036 | 8.9825 | 46.8% |
 * | 16384 | 0.0084 | 15.5741 | 0.0043 | 30.5672 | 51.0% |
 * | 65536 | 0.0146 | 35.9298 | 0.0115 | 45.5111 | 78.9% |
 * | 262144 | 0.0532 | 39.3846 | 0.0512 | 40.9600 | 96.2% |
 * | 1048576 | 0.1971 | 42.5628 | 0.1966 | 42.6667 | 99.8% |
 * | 4194304 | 0.7741 | 43.3439 | 0.7777 | 43.1468 | 100.5% |
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
 * | 32 | 0.0071 | 0.0359 | 0.0032 | 0.0812 | 44.2% |
 * | 64 | 0.0074 | 0.0696 | 0.0028 | 0.1798 | 38.7% |
 * | 128 | 0.0073 | 0.1400 | 0.0030 | 0.3441 | 40.7% |
 * | 512 | 0.0074 | 0.5517 | 0.0034 | 1.1963 | 46.1% |
 * | 1024 | 0.0079 | 1.0343 | 0.0035 | 2.3273 | 44.4% |
 * | 4096 | 0.0086 | 3.8067 | 0.0042 | 7.7576 | 49.1% |
 * | 16384 | 0.0205 | 6.4000 | 0.0168 | 7.8168 | 81.9% |
 * | 65536 | 0.0676 | 7.7539 | 0.0634 | 8.2664 | 93.8% |
 * | 262144 | 0.2597 | 8.0764 | 0.2478 | 8.4628 | 95.4% |
 * | 1048576 | 1.0222 | 8.2066 | 0.9844 | 8.5217 | 96.3% |
 *
 * ![sscal-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride32.svg)
 *
 * ![sscal-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0062 | 0.0829 |
 * | 128 | 0.0062 | 0.1658 |
 * | 512 | 0.0065 | 0.6305 |
 * | 1024 | 0.0066 | 1.2367 |
 * | 4096 | 0.0075 | 4.3574 |
 * | 16384 | 0.0205 | 6.4000 |
 * | 65536 | 0.0737 | 7.1111 |
 * | 262144 | 0.2871 | 7.3057 |
 *
 * ![sscal-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride33.svg)
 *
 * ![sscal-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0065 | 0.6275 | 0.0034 | 1.2075 | 52.0% |
 * | 1024 | 0.0067 | 1.2249 | 0.0033 | 2.4734 | 49.5% |
 * | 4096 | 0.0079 | 4.1542 | 0.0041 | 8.0000 | 51.9% |
 * | 16384 | 0.0298 | 4.3948 | 0.0295 | 4.4473 | 98.8% |
 * | 65536 | 0.1384 | 3.7873 | 0.1366 | 3.8379 | 98.7% |
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
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 1.3763 | 0.0028 | 2.8764 | 47.8% |
 * | 65536 | 0.0082 | 64.0000 | 0.0043 | 121.3630 | 52.7% |
 * | 1048576 | 0.0573 | 146.3674 | 0.0520 | 161.4684 | 90.6% |
 * | 16777216 | 0.8069 | 166.3350 | 0.8042 | 166.8943 | 99.7% |
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
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 1.3509 | 0.0029 | 2.8444 | 47.5% |
 * | 65536 | 0.0082 | 64.0000 | 0.0045 | 115.7880 | 55.3% |
 * | 1048576 | 0.0567 | 147.9368 | 0.0532 | 157.5385 | 93.9% |
 * | 16777216 | 0.8069 | 166.3350 | 0.7910 | 169.6828 | 98.0% |
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
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 1.3438 | 0.0028 | 2.8764 | 46.7% |
 * | 65536 | 0.0082 | 64.0000 | 0.0053 | 98.4024 | 65.0% |
 * | 1048576 | 0.0570 | 147.2719 | 0.0520 | 161.4684 | 91.2% |
 * | 16777216 | 0.8069 | 166.3350 | 0.7987 | 168.0410 | 99.0% |
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
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 1.3581 | 0.0026 | 3.1220 | 43.5% |
 * | 65536 | 0.0082 | 64.0000 | 0.0041 | 128.0000 | 50.0% |
 * | 1048576 | 0.0660 | 127.0078 | 0.0520 | 161.4187 | 78.7% |
 * | 16777216 | 0.8264 | 162.4125 | 0.8049 | 166.7583 | 97.4% |
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
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 1.3333 | 0.0030 | 2.7527 | 48.4% |
 * | 65536 | 0.0082 | 64.0000 | 0.0052 | 100.2080 | 63.9% |
 * | 1048576 | 0.0573 | 146.2857 | 0.0522 | 160.8245 | 91.0% |
 * | 16777216 | 0.8069 | 166.3350 | 0.8035 | 167.0372 | 99.6% |
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
 * - [alpha.sscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/alpha.sscal.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sscal
 */
