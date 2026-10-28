/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0642 | 0.0027 | 0.1429 | 44.9% |
 * | 64 | 0.0060 | 0.1270 | 0.0027 | 0.2892 | 43.9% |
 * | 128 | 0.0061 | 0.2507 | 0.0028 | 0.5581 | 44.9% |
 * | 512 | 0.0061 | 1.0105 | 0.0028 | 2.2326 | 45.3% |
 * | 1024 | 0.0061 | 2.0000 | 0.0028 | 4.4138 | 45.3% |
 * | 4096 | 0.0061 | 8.0000 | 0.0028 | 17.8605 | 44.8% |
 * | 16384 | 0.0065 | 30.1176 | 0.0033 | 59.3623 | 50.7% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 166.0540 | 57.8% |
 * | 262144 | 0.0225 | 139.6364 | 0.0207 | 152.0557 | 91.8% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0742 | 169.6359 | 97.9% |
 * | 4194304 | 0.2911 | 172.8992 | 0.2884 | 174.5106 | 99.1% |
 * | 16777216 | 1.1541 | 174.4380 | 1.1428 | 176.1720 | 99.0% |
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
 * | 32 | 0.0061 | 0.0625 | 0.0027 | 0.1437 | 43.5% |
 * | 64 | 0.0060 | 0.1270 | 0.0027 | 0.2840 | 44.7% |
 * | 128 | 0.0061 | 0.2533 | 0.0028 | 0.5549 | 45.6% |
 * | 512 | 0.0061 | 1.0000 | 0.0031 | 2.0000 | 50.0% |
 * | 1024 | 0.0061 | 2.0000 | 0.0029 | 4.2198 | 47.4% |
 * | 4096 | 0.0064 | 7.6800 | 0.0032 | 15.3600 | 50.0% |
 * | 16384 | 0.0078 | 25.2320 | 0.0043 | 46.1955 | 54.6% |
 * | 65536 | 0.0220 | 35.7990 | 0.0208 | 37.8967 | 94.5% |
 * | 262144 | 0.0758 | 41.5135 | 0.0752 | 41.8404 | 99.2% |
 * | 1048576 | 0.2908 | 43.2676 | 0.2919 | 43.1134 | 100.4% |
 * | 4194304 | 1.1530 | 43.6519 | 1.1588 | 43.4355 | 100.5% |
 *
 * ![saxpy-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride4.svg)
 *
 * ![saxpy-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0633 | 0.0028 | 0.1387 | 45.7% |
 * | 64 | 0.0060 | 0.1270 | 0.0027 | 0.2824 | 45.0% |
 * | 128 | 0.0061 | 0.2513 | 0.0028 | 0.5549 | 45.3% |
 * | 512 | 0.0061 | 1.0000 | 0.0030 | 2.0645 | 48.4% |
 * | 1024 | 0.0061 | 2.0000 | 0.0031 | 4.0209 | 49.7% |
 * | 4096 | 0.0065 | 7.5852 | 0.0034 | 14.4906 | 52.3% |
 * | 16384 | 0.0082 | 24.0000 | 0.0047 | 42.0822 | 57.0% |
 * | 65536 | 0.0262 | 30.0440 | 0.0256 | 30.7200 | 97.8% |
 * | 262144 | 0.0943 | 33.3686 | 0.0955 | 32.9547 | 101.3% |
 * | 1048576 | 0.3654 | 34.4322 | 0.3731 | 33.7249 | 102.1% |
 * | 4194304 | 1.4540 | 34.6152 | 1.4853 | 33.8870 | 102.1% |
 *
 * ![saxpy-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride5.svg)
 *
 * ![saxpy-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0635 | 0.0028 | 0.1395 | 45.5% |
 * | 64 | 0.0061 | 0.1250 | 0.0028 | 0.2791 | 44.8% |
 * | 128 | 0.0061 | 0.2500 | 0.0029 | 0.5217 | 47.9% |
 * | 512 | 0.0061 | 1.0000 | 0.0036 | 1.7143 | 58.3% |
 * | 1024 | 0.0064 | 1.9152 | 0.0034 | 3.5888 | 53.4% |
 * | 4096 | 0.0083 | 5.9077 | 0.0047 | 10.4490 | 56.5% |
 * | 16384 | 0.0248 | 7.9124 | 0.0231 | 8.4979 | 93.1% |
 * | 65536 | 0.0881 | 8.9302 | 0.0858 | 9.1633 | 97.5% |
 * | 262144 | 0.3390 | 9.2792 | 0.3366 | 9.3454 | 99.3% |
 * | 1048576 | 1.3443 | 9.3601 | 1.3436 | 9.3653 | 99.9% |
 *
 * ![saxpy-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride32.svg)
 *
 * ![saxpy-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1250 | 0.0028 | 0.2759 | 45.3% |
 * | 128 | 0.0061 | 0.2500 | 0.0029 | 0.5275 | 47.4% |
 * | 512 | 0.0061 | 1.0000 | 0.0033 | 1.8824 | 53.1% |
 * | 1024 | 0.0063 | 1.9592 | 0.0033 | 3.7647 | 52.0% |
 * | 4096 | 0.0082 | 6.0000 | 0.0044 | 11.2941 | 53.1% |
 * | 16384 | 0.0260 | 7.5758 | 0.0246 | 8.0000 | 94.7% |
 * | 65536 | 0.0942 | 8.3507 | 0.0918 | 8.5661 | 97.5% |
 * | 262144 | 0.3645 | 8.6292 | 0.3591 | 8.7603 | 98.5% |
 *
 * ![saxpy-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride33.svg)
 *
 * ![saxpy-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0064 | 0.9600 | 0.0032 | 1.9394 | 49.5% |
 * | 1024 | 0.0067 | 1.8462 | 0.0031 | 4.0209 | 45.9% |
 * | 4096 | 0.0102 | 4.8226 | 0.0060 | 8.1270 | 59.3% |
 * | 16384 | 0.0484 | 4.0595 | 0.0551 | 3.5711 | 113.7% |
 * | 65536 | 0.1925 | 4.0851 | 0.2009 | 3.9143 | 104.4% |
 *
 * ![saxpy-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/gbps-stride255.svg)
 *
 * ![saxpy-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/saxpy/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 0.9821 | 0.0035 | 1.7376 | 56.5% |
 * | 1024 | 0.0064 | 1.9057 | 0.0034 | 3.5888 | 53.1% |
 * | 4096 | 0.0089 | 5.5252 | 0.0047 | 10.4846 | 52.7% |
 * | 16384 | 0.0415 | 4.7353 | 0.0471 | 4.1753 | 113.4% |
 * | 65536 | 0.1785 | 4.4055 | 0.1984 | 3.9639 | 111.1% |
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
 * | 1024 | 0.0061 | 2.0105 | 0.0028 | 4.3390 | 46.3% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 167.1837 | 57.4% |
 * | 1048576 | 0.0759 | 165.8439 | 0.0740 | 169.9291 | 97.6% |
 * | 16777216 | 1.1548 | 174.3365 | 1.1428 | 176.1720 | 99.0% |
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
 * | 1024 | 0.0061 | 2.0000 | 0.0024 | 5.1200 | 39.1% |
 * | 65536 | 0.0082 | 96.0000 | 0.0030 | 262.8449 | 36.5% |
 * | 1048576 | 0.0759 | 165.8789 | 0.0116 | 1087.7344 | 15.2% |
 * | 16777216 | 1.1546 | 174.3752 | 0.1462 | 1376.9875 | 12.7% |
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
 * | 1024 | 0.0060 | 2.0426 | 0.0028 | 4.4651 | 45.7% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 167.1837 | 57.4% |
 * | 1048576 | 0.0760 | 165.5995 | 0.0741 | 169.8557 | 97.5% |
 * | 16777216 | 1.1547 | 174.3607 | 1.1428 | 176.1720 | 99.0% |
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
 * | 1024 | 0.0061 | 2.0105 | 0.0028 | 4.4651 | 45.0% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 167.1837 | 57.4% |
 * | 1048576 | 0.0759 | 165.8439 | 0.0740 | 169.9291 | 97.6% |
 * | 16777216 | 1.1546 | 174.3655 | 1.1428 | 176.1720 | 99.0% |
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
 * | 1024 | 0.0060 | 2.0426 | 0.0028 | 4.4651 | 45.7% |
 * | 65536 | 0.0082 | 96.0000 | 0.0047 | 167.1837 | 57.4% |
 * | 1048576 | 0.0758 | 166.0541 | 0.0741 | 169.7457 | 97.8% |
 * | 16777216 | 1.1543 | 174.4114 | 1.1428 | 176.1720 | 99.0% |
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
