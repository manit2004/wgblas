/**
 * Benchmark results for cscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0059 | 0.0872 | 0.0027 | 0.1928 | 45.2% |
 * | 64 | 0.0059 | 0.1730 | 0.0026 | 0.3902 | 44.3% |
 * | 128 | 0.0060 | 0.3386 | 0.0026 | 0.7758 | 43.6% |
 * | 512 | 0.0060 | 1.3727 | 0.0027 | 3.0118 | 45.6% |
 * | 1024 | 0.0061 | 2.6736 | 0.0028 | 5.9535 | 44.9% |
 * | 4096 | 0.0061 | 10.6667 | 0.0029 | 22.5055 | 47.4% |
 * | 16384 | 0.0065 | 40.5545 | 0.0034 | 78.0191 | 52.0% |
 * | 65536 | 0.0082 | 128.0000 | 0.0053 | 198.5939 | 64.5% |
 * | 262144 | 0.0281 | 149.0301 | 0.0269 | 155.6674 | 95.7% |
 * | 1048576 | 0.1014 | 165.4166 | 0.1004 | 167.1837 | 98.9% |
 * | 4194304 | 0.3938 | 170.4309 | 0.3932 | 170.6597 | 99.9% |
 * | 16777216 | 1.5692 | 171.0652 | 1.5649 | 171.5304 | 99.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![cscal-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-default.svg)
 *
 * ![cscal-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-default.svg)
 *
 * ## See also
 *
 * - [cscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/wgblas/cscal.js) — WebGPU benchmark script
 * - [cscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/cuda/cscal.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0061 | 0.0842 | 0.0026 | 0.1963 | 42.9% |
 * | 64 | 0.0060 | 0.1693 | 0.0027 | 0.3832 | 44.2% |
 * | 128 | 0.0061 | 0.3368 | 0.0027 | 0.7485 | 45.0% |
 * | 512 | 0.0061 | 1.3333 | 0.0029 | 2.7826 | 47.9% |
 * | 1024 | 0.0061 | 2.6806 | 0.0029 | 5.6264 | 47.6% |
 * | 4096 | 0.0065 | 10.0887 | 0.0032 | 20.2772 | 49.8% |
 * | 16384 | 0.0092 | 28.3460 | 0.0047 | 55.7279 | 50.9% |
 * | 65536 | 0.0275 | 38.1689 | 0.0266 | 39.3846 | 96.9% |
 * | 262144 | 0.1012 | 41.4260 | 0.1001 | 41.8827 | 98.9% |
 * | 1048576 | 0.3952 | 42.4473 | 0.3932 | 42.6736 | 99.5% |
 * | 4194304 | 1.5700 | 42.7458 | 1.5656 | 42.8642 | 99.7% |
 *
 * ![cscal-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride4.svg)
 *
 * ![cscal-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0059 | 0.0872 | 0.0027 | 0.1928 | 45.2% |
 * | 64 | 0.0060 | 0.1693 | 0.0027 | 0.3855 | 43.9% |
 * | 128 | 0.0061 | 0.3360 | 0.0027 | 0.7711 | 43.6% |
 * | 512 | 0.0060 | 1.3581 | 0.0029 | 2.8287 | 48.0% |
 * | 1024 | 0.0061 | 2.6667 | 0.0029 | 5.5652 | 47.9% |
 * | 4096 | 0.0065 | 10.0392 | 0.0034 | 19.5048 | 51.5% |
 * | 16384 | 0.0101 | 25.8423 | 0.0050 | 52.3450 | 49.4% |
 * | 65536 | 0.0335 | 31.2821 | 0.0310 | 33.8163 | 92.5% |
 * | 262144 | 0.1208 | 34.7119 | 0.1178 | 35.5932 | 97.5% |
 * | 1048576 | 0.4706 | 35.6525 | 0.4651 | 36.0757 | 98.8% |
 *
 * ![cscal-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride5.svg)
 *
 * ![cscal-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0838 | 0.0027 | 0.1905 | 44.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0027 | 0.3832 | 43.5% |
 * | 128 | 0.0061 | 0.3342 | 0.0028 | 0.7442 | 44.9% |
 * | 512 | 0.0063 | 1.2995 | 0.0034 | 2.4151 | 53.8% |
 * | 1024 | 0.0064 | 2.5473 | 0.0035 | 4.7407 | 53.7% |
 * | 4096 | 0.0082 | 8.0000 | 0.0039 | 16.6504 | 48.0% |
 * | 16384 | 0.0206 | 12.7403 | 0.0196 | 13.3856 | 95.2% |
 * | 65536 | 0.0799 | 13.1282 | 0.0777 | 13.5014 | 97.2% |
 * | 262144 | 0.3076 | 13.6356 | 0.3174 | 13.2136 | 103.2% |
 *
 * ![cscal-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride32.svg)
 *
 * ![cscal-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1667 | 0.0027 | 0.3765 | 44.3% |
 * | 128 | 0.0060 | 0.3404 | 0.0028 | 0.7191 | 47.3% |
 * | 512 | 0.0062 | 1.3264 | 0.0033 | 2.4615 | 53.9% |
 * | 1024 | 0.0064 | 2.5729 | 0.0033 | 4.9709 | 51.8% |
 * | 4096 | 0.0079 | 8.2747 | 0.0038 | 17.2101 | 48.1% |
 * | 16384 | 0.0237 | 11.0479 | 0.0225 | 11.6364 | 94.9% |
 * | 65536 | 0.1021 | 10.2737 | 0.0903 | 11.6178 | 88.4% |
 * | 262144 | 0.4142 | 10.1269 | 0.3869 | 10.8396 | 93.4% |
 *
 * ![cscal-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride33.svg)
 *
 * ![cscal-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0062 | 1.3264 | 0.0032 | 2.5600 | 51.8% |
 * | 1024 | 0.0064 | 2.5729 | 0.0033 | 5.0196 | 51.3% |
 * | 4096 | 0.0082 | 8.0157 | 0.0039 | 16.8560 | 47.6% |
 * | 16384 | 0.0348 | 7.5294 | 0.0348 | 7.5294 | 100.0% |
 * | 65536 | 0.1570 | 6.6805 | 0.1411 | 7.4321 | 89.9% |
 *
 * ![cscal-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride255.svg)
 *
 * ![cscal-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.3061 | 0.0033 | 2.4854 | 52.6% |
 * | 1024 | 0.0065 | 2.5098 | 0.0035 | 4.7407 | 52.9% |
 * | 4096 | 0.0082 | 8.0000 | 0.0040 | 16.4498 | 48.6% |
 * | 16384 | 0.0300 | 8.7475 | 0.0324 | 8.0789 | 108.3% |
 * | 65536 | 0.1311 | 8.0000 | 0.1331 | 7.8779 | 101.5% |
 *
 * ![cscal-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-stride256.svg)
 *
 * ![cscal-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.cscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/wgblas/stride.cscal.js) — WebGPU stride-sweep benchmark script
 * - [stride.cscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/cuda/stride.cscal.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0+0i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0059 | 2.7826 | 0.0028 | 5.9535 | 46.7% |
 * | 65536 | 0.0082 | 128.0000 | 0.0051 | 204.1620 | 62.7% |
 * | 1048576 | 0.1017 | 164.9742 | 0.1004 | 167.1837 | 98.7% |
 * | 16777216 | 1.5691 | 171.0756 | 1.5650 | 171.5199 | 99.7% |
 *
 * ![cscal-alpha0plus0i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha0plus0i.svg)
 *
 * ![cscal-alpha0plus0i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha0plus0i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1+0i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6736 | 0.0028 | 5.9535 | 44.9% |
 * | 65536 | 0.0082 | 128.0000 | 0.0053 | 197.3976 | 64.8% |
 * | 1048576 | 0.1013 | 165.6257 | 0.1004 | 167.1837 | 99.1% |
 * | 16777216 | 1.5691 | 171.0739 | 1.5649 | 171.5356 | 99.7% |
 *
 * ![cscal-alpha1plus0i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha1plus0i.svg)
 *
 * ![cscal-alpha1plus0i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha1plus0i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5-3.75i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6947 | 0.0028 | 5.9535 | 45.3% |
 * | 65536 | 0.0082 | 128.0000 | 0.0054 | 195.6299 | 65.4% |
 * | 1048576 | 0.1016 | 165.1821 | 0.1004 | 167.1837 | 98.8% |
 * | 16777216 | 1.5689 | 171.0948 | 1.5649 | 171.5356 | 99.7% |
 *
 * ![cscal-alpha2p5neg3p75i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha2p5neg3p75i.svg)
 *
 * ![cscal-alpha2p5neg3p75i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha2p5neg3p75i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0+1i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 2.7090 | 0.0027 | 5.9883 | 45.2% |
 * | 65536 | 0.0082 | 128.0000 | 0.0053 | 196.2155 | 65.2% |
 * | 1048576 | 0.1015 | 165.3384 | 0.1004 | 167.1837 | 98.9% |
 * | 16777216 | 1.5691 | 171.0774 | 1.5648 | 171.5409 | 99.7% |
 *
 * ![cscal-alpha0plus1i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha0plus1i.svg)
 *
 * ![cscal-alpha0plus1i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha0plus1i.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38+0i</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6947 | 0.0028 | 5.9535 | 45.3% |
 * | 65536 | 0.0082 | 128.0000 | 0.0053 | 198.5939 | 64.5% |
 * | 1048576 | 0.1016 | 165.1301 | 0.1004 | 167.1837 | 98.8% |
 * | 16777216 | 1.5692 | 171.0652 | 1.5650 | 171.5251 | 99.7% |
 *
 * ![cscal-alpha1eneg38plus0i GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/gbps-alpha1eneg38plus0i.svg)
 *
 * ![cscal-alpha1eneg38plus0i ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/cscal/ms-alpha1eneg38plus0i.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.cscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/wgblas/alpha.cscal.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.cscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/cscal/cuda/alpha.cscal.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/cscal
 */
