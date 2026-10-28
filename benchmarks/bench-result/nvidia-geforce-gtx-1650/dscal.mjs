/**
 * Benchmark results for dscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.0808 | 0.0026 | 0.1951 | 41.4% |
 * | 64 | 0.0061 | 0.1667 | 0.0027 | 0.3855 | 43.2% |
 * | 128 | 0.0062 | 0.3307 | 0.0026 | 0.7805 | 42.4% |
 * | 512 | 0.0062 | 1.3196 | 0.0028 | 2.9425 | 44.8% |
 * | 1024 | 0.0062 | 2.6392 | 0.0028 | 5.8851 | 44.8% |
 * | 4096 | 0.0063 | 10.3434 | 0.0028 | 23.1412 | 44.7% |
 * | 16384 | 0.0072 | 36.3282 | 0.0036 | 71.8596 | 50.6% |
 * | 65536 | 0.0102 | 102.4000 | 0.0057 | 184.0899 | 55.6% |
 * | 262144 | 0.0307 | 136.5333 | 0.0270 | 155.1148 | 88.0% |
 * | 1048576 | 0.1044 | 160.6275 | 0.1004 | 167.0239 | 96.2% |
 * | 4194304 | 0.3994 | 168.0410 | 0.3934 | 170.5834 | 98.5% |
 * | 16777216 | 1.5751 | 170.4240 | 1.5655 | 171.4708 | 99.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dscal-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-default.svg)
 *
 * ![dscal-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-default.svg)
 *
 * ## See also
 *
 * - [dscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/wgblas/dscal.js) — WebGPU benchmark script
 * - [dscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/cuda/dscal.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0064 | 0.0800 | 0.0029 | 0.1778 | 45.0% |
 * | 64 | 0.0062 | 0.1658 | 0.0029 | 0.3575 | 46.4% |
 * | 128 | 0.0062 | 0.3307 | 0.0029 | 0.7151 | 46.3% |
 * | 512 | 0.0062 | 1.3196 | 0.0032 | 2.5729 | 51.3% |
 * | 1024 | 0.0061 | 2.6667 | 0.0033 | 5.0196 | 53.1% |
 * | 4096 | 0.0072 | 9.1225 | 0.0035 | 18.6182 | 49.0% |
 * | 16384 | 0.0094 | 27.9590 | 0.0051 | 51.8481 | 53.9% |
 * | 65536 | 0.0287 | 36.5714 | 0.0268 | 39.1493 | 93.4% |
 * | 262144 | 0.1024 | 40.9600 | 0.1003 | 41.8092 | 98.0% |
 * | 1048576 | 0.3964 | 42.3205 | 0.3933 | 42.6597 | 99.2% |
 * | 4194304 | 1.5770 | 42.5558 | 1.5661 | 42.8506 | 99.3% |
 *
 * ![dscal-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride4.svg)
 *
 * ![dscal-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.0812 | 0.0028 | 0.1798 | 45.2% |
 * | 64 | 0.0061 | 0.1667 | 0.0028 | 0.3657 | 45.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0029 | 0.7111 | 46.9% |
 * | 512 | 0.0061 | 1.3333 | 0.0032 | 2.5859 | 51.6% |
 * | 1024 | 0.0062 | 2.6528 | 0.0032 | 5.1457 | 51.6% |
 * | 4096 | 0.0074 | 8.8086 | 0.0037 | 17.6552 | 49.9% |
 * | 16384 | 0.0098 | 26.7712 | 0.0054 | 48.3304 | 55.4% |
 * | 65536 | 0.0351 | 29.8706 | 0.0313 | 33.4709 | 89.2% |
 * | 262144 | 0.1311 | 32.0000 | 0.1183 | 35.4536 | 90.3% |
 * | 1048576 | 0.5131 | 32.7006 | 0.4649 | 36.0881 | 90.6% |
 *
 * ![dscal-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride5.svg)
 *
 * ![dscal-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0064 | 0.0804 | 0.0028 | 0.1818 | 44.2% |
 * | 64 | 0.0062 | 0.1662 | 0.0029 | 0.3516 | 47.3% |
 * | 128 | 0.0063 | 0.3232 | 0.0030 | 0.6845 | 47.2% |
 * | 512 | 0.0067 | 1.2308 | 0.0036 | 2.2756 | 54.1% |
 * | 1024 | 0.0068 | 2.3925 | 0.0036 | 4.5511 | 52.6% |
 * | 4096 | 0.0100 | 6.5431 | 0.0041 | 16.0000 | 40.9% |
 * | 16384 | 0.0369 | 7.1111 | 0.0201 | 13.0135 | 54.6% |
 * | 65536 | 0.1373 | 7.6356 | 0.0782 | 13.4103 | 56.9% |
 * | 262144 | 0.5338 | 7.8580 | 0.3163 | 13.2624 | 59.3% |
 *
 * ![dscal-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride32.svg)
 *
 * ![dscal-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3516 | 47.4% |
 * | 128 | 0.0061 | 0.3333 | 0.0029 | 0.6957 | 47.9% |
 * | 512 | 0.0064 | 1.2800 | 0.0034 | 2.3814 | 53.7% |
 * | 1024 | 0.0067 | 2.4498 | 0.0035 | 4.7407 | 51.7% |
 * | 4096 | 0.0094 | 7.0017 | 0.0040 | 16.2540 | 43.1% |
 * | 16384 | 0.0390 | 6.7258 | 0.0226 | 11.6199 | 57.9% |
 * | 65536 | 0.1536 | 6.8274 | 0.0900 | 11.6508 | 58.6% |
 * | 262144 | 0.6103 | 6.8728 | 0.3850 | 10.8945 | 63.1% |
 *
 * ![dscal-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride33.svg)
 *
 * ![dscal-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0067 | 1.2308 | 0.0036 | 2.2857 | 53.8% |
 * | 1024 | 0.0073 | 2.2407 | 0.0035 | 4.7407 | 47.3% |
 * | 4096 | 0.0143 | 4.5714 | 0.0040 | 16.2540 | 28.1% |
 * | 16384 | 0.0678 | 3.8687 | 0.0352 | 7.4439 | 52.0% |
 * | 65536 | 0.3040 | 3.4498 | 0.1418 | 7.3935 | 46.7% |
 *
 * ![dscal-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride255.svg)
 *
 * ![dscal-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0065 | 1.2673 | 0.0035 | 2.3486 | 54.0% |
 * | 1024 | 0.0068 | 2.3981 | 0.0036 | 4.5511 | 52.7% |
 * | 4096 | 0.0110 | 5.9796 | 0.0041 | 16.0000 | 37.4% |
 * | 16384 | 0.0594 | 4.4138 | 0.0331 | 7.9112 | 55.8% |
 * | 65536 | 0.2832 | 3.7024 | 0.1360 | 7.7092 | 48.0% |
 *
 * ![dscal-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-stride256.svg)
 *
 * ![dscal-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/wgblas/stride.dscal.js) — WebGPU stride-sweep benchmark script
 * - [stride.dscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/cuda/stride.dscal.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 1024 | 0.0061 | 2.6667 | 0.0028 | 5.8182 | 45.8% |
 * | 65536 | 0.0102 | 102.4000 | 0.0057 | 183.0614 | 55.9% |
 * | 1048576 | 0.1045 | 160.5291 | 0.1004 | 167.0239 | 96.1% |
 * | 16777216 | 1.5797 | 169.9234 | 1.5654 | 171.4778 | 99.1% |
 *
 * ![dscal-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alphaneg3p75.svg)
 *
 * ![dscal-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0028 | 5.8851 | 45.3% |
 * | 65536 | 0.0102 | 102.4000 | 0.0057 | 184.6084 | 55.5% |
 * | 1048576 | 0.1045 | 160.6028 | 0.1004 | 167.0239 | 96.2% |
 * | 16777216 | 1.5803 | 169.8615 | 1.5655 | 171.4708 | 99.1% |
 *
 * ![dscal-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha0.svg)
 *
 * ![dscal-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0028 | 5.8182 | 45.8% |
 * | 65536 | 0.0102 | 102.4000 | 0.0057 | 183.0614 | 55.9% |
 * | 1048576 | 0.1044 | 160.6275 | 0.1004 | 167.0239 | 96.2% |
 * | 16777216 | 1.5799 | 169.9096 | 1.5653 | 171.4901 | 99.1% |
 *
 * ![dscal-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha1eneg38.svg)
 *
 * ![dscal-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0028 | 5.8851 | 45.3% |
 * | 65536 | 0.0103 | 102.0810 | 0.0057 | 183.0614 | 55.8% |
 * | 1048576 | 0.1044 | 160.6275 | 0.1004 | 167.0239 | 96.2% |
 * | 16777216 | 1.5803 | 169.8597 | 1.5654 | 171.4778 | 99.1% |
 *
 * ![dscal-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha1.svg)
 *
 * ![dscal-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0062 | 2.6256 | 0.0029 | 5.5956 | 46.9% |
 * | 65536 | 0.0102 | 102.4000 | 0.0058 | 180.0439 | 56.9% |
 * | 1048576 | 0.1044 | 160.6275 | 0.1004 | 167.0771 | 96.1% |
 * | 16777216 | 1.5802 | 169.8752 | 1.5654 | 171.4778 | 99.1% |
 *
 * ![dscal-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/gbps-alpha2p5.svg)
 *
 * ![dscal-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dscal/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/wgblas/alpha.dscal.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dscal/cuda/alpha.dscal.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dscal
 */
