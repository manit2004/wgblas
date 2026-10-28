/**
 * Benchmark results for sscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0059 | 0.0432 | 0.0026 | 0.0982 | 44.0% |
 * | 64 | 0.0061 | 0.0836 | 0.0026 | 0.1951 | 42.8% |
 * | 128 | 0.0060 | 0.1720 | 0.0026 | 0.4000 | 43.0% |
 * | 512 | 0.0061 | 0.6755 | 0.0026 | 1.5610 | 43.3% |
 * | 1024 | 0.0061 | 1.3403 | 0.0026 | 3.1220 | 42.9% |
 * | 4096 | 0.0061 | 5.3333 | 0.0026 | 12.4121 | 43.0% |
 * | 16384 | 0.0064 | 20.3781 | 0.0032 | 41.3737 | 49.3% |
 * | 65536 | 0.0082 | 64.0000 | 0.0042 | 126.0308 | 50.8% |
 * | 262144 | 0.0164 | 128.0000 | 0.0104 | 202.2716 | 63.3% |
 * | 1048576 | 0.0572 | 146.7772 | 0.0520 | 161.2202 | 91.0% |
 * | 4194304 | 0.2104 | 159.4671 | 0.1990 | 168.6491 | 94.6% |
 * | 16777216 | 0.8192 | 163.8400 | 0.7869 | 170.5556 | 96.1% |
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
 * | 32 | 0.0060 | 0.0423 | 0.0027 | 0.0941 | 45.0% |
 * | 64 | 0.0061 | 0.0833 | 0.0028 | 0.1860 | 44.8% |
 * | 128 | 0.0061 | 0.1680 | 0.0028 | 0.3636 | 46.2% |
 * | 512 | 0.0061 | 0.6737 | 0.0029 | 1.4302 | 47.1% |
 * | 1024 | 0.0061 | 1.3333 | 0.0029 | 2.8444 | 46.9% |
 * | 4096 | 0.0062 | 5.3057 | 0.0032 | 10.3434 | 51.3% |
 * | 16384 | 0.0073 | 18.0441 | 0.0040 | 32.5079 | 55.5% |
 * | 65536 | 0.0118 | 44.4613 | 0.0088 | 59.3623 | 74.9% |
 * | 262144 | 0.0530 | 39.5391 | 0.0514 | 40.8070 | 96.9% |
 * | 1048576 | 0.1990 | 42.1453 | 0.1983 | 42.3018 | 99.6% |
 * | 4194304 | 0.7862 | 42.6806 | 0.7837 | 42.8130 | 99.7% |
 *
 * ![sscal-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride4.svg)
 *
 * ![sscal-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0421 | 0.0028 | 0.0920 | 45.8% |
 * | 64 | 0.0059 | 0.0867 | 0.0028 | 0.1839 | 47.2% |
 * | 128 | 0.0060 | 0.1693 | 0.0028 | 0.3678 | 46.0% |
 * | 512 | 0.0060 | 0.6809 | 0.0029 | 1.4222 | 47.9% |
 * | 1024 | 0.0061 | 1.3368 | 0.0029 | 2.8132 | 47.5% |
 * | 4096 | 0.0062 | 5.3057 | 0.0033 | 10.0392 | 52.8% |
 * | 16384 | 0.0074 | 17.7316 | 0.0042 | 31.5077 | 56.3% |
 * | 65536 | 0.0173 | 30.2567 | 0.0179 | 29.2833 | 103.3% |
 * | 262144 | 0.0646 | 32.4677 | 0.0635 | 33.0323 | 98.3% |
 * | 1048576 | 0.2478 | 33.8469 | 0.2468 | 33.9851 | 99.6% |
 * | 4194304 | 0.9812 | 34.1968 | 0.9792 | 34.2666 | 99.8% |
 *
 * ![sscal-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride5.svg)
 *
 * ![sscal-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0419 | 0.0028 | 0.0920 | 45.5% |
 * | 64 | 0.0061 | 0.0833 | 0.0028 | 0.1798 | 46.3% |
 * | 128 | 0.0061 | 0.1667 | 0.0029 | 0.3478 | 47.9% |
 * | 512 | 0.0061 | 0.6667 | 0.0033 | 1.2488 | 53.4% |
 * | 1024 | 0.0062 | 1.3230 | 0.0033 | 2.4498 | 54.0% |
 * | 4096 | 0.0075 | 4.3761 | 0.0041 | 7.9073 | 55.3% |
 * | 16384 | 0.0194 | 6.7591 | 0.0168 | 7.8019 | 86.6% |
 * | 65536 | 0.0669 | 7.8392 | 0.0635 | 8.2581 | 94.9% |
 * | 262144 | 0.2540 | 8.2570 | 0.2474 | 8.4754 | 97.4% |
 * | 1048576 | 1.0056 | 8.3422 | 0.9821 | 8.5415 | 97.7% |
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
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0060 | 0.0851 | 0.0029 | 0.1778 | 47.9% |
 * | 128 | 0.0061 | 0.1667 | 0.0029 | 0.3516 | 47.4% |
 * | 512 | 0.0061 | 0.6667 | 0.0032 | 1.2929 | 51.6% |
 * | 1024 | 0.0062 | 1.3162 | 0.0029 | 2.7826 | 47.3% |
 * | 4096 | 0.0073 | 4.4912 | 0.0039 | 8.3934 | 53.5% |
 * | 16384 | 0.0203 | 6.4606 | 0.0181 | 7.2367 | 89.3% |
 * | 65536 | 0.0730 | 7.1844 | 0.0683 | 7.6722 | 93.6% |
 * | 262144 | 0.2864 | 7.3216 | 0.2727 | 7.6893 | 95.2% |
 *
 * ![sscal-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride33.svg)
 *
 * ![sscal-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0062 | 0.6632 | 0.0032 | 1.2800 | 51.8% |
 * | 1024 | 0.0061 | 1.3333 | 0.0032 | 2.5859 | 51.6% |
 * | 4096 | 0.0073 | 4.4814 | 0.0040 | 8.1920 | 54.7% |
 * | 16384 | 0.0332 | 3.9518 | 0.0339 | 3.8623 | 102.3% |
 * | 65536 | 0.1516 | 3.4595 | 0.1461 | 3.5879 | 96.4% |
 *
 * ![sscal-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/gbps-stride255.svg)
 *
 * ![sscal-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sscal/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0062 | 0.6564 | 0.0033 | 1.2367 | 53.1% |
 * | 1024 | 0.0062 | 1.3128 | 0.0034 | 2.4265 | 54.1% |
 * | 4096 | 0.0076 | 4.3207 | 0.0041 | 8.0000 | 54.0% |
 * | 16384 | 0.0292 | 4.4863 | 0.0313 | 4.1839 | 107.2% |
 * | 65536 | 0.1392 | 3.7656 | 0.1395 | 3.7587 | 100.2% |
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
 * | 1024 | 0.0061 | 1.3509 | 0.0027 | 3.0843 | 43.8% |
 * | 65536 | 0.0082 | 64.0000 | 0.0041 | 128.0000 | 50.0% |
 * | 1048576 | 0.0572 | 146.6130 | 0.0521 | 161.0221 | 91.1% |
 * | 16777216 | 0.8184 | 164.0066 | 0.7869 | 170.5625 | 96.2% |
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
 * | 1024 | 0.0061 | 1.3474 | 0.0027 | 3.0843 | 43.7% |
 * | 65536 | 0.0082 | 64.0000 | 0.0042 | 126.0308 | 50.8% |
 * | 1048576 | 0.0572 | 146.6130 | 0.0521 | 161.0221 | 91.1% |
 * | 16777216 | 0.8192 | 163.8400 | 0.7869 | 170.5730 | 96.1% |
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
 * | 1024 | 0.0060 | 1.3617 | 0.0026 | 3.1411 | 43.4% |
 * | 65536 | 0.0082 | 64.0000 | 0.0041 | 127.0078 | 50.4% |
 * | 1048576 | 0.0572 | 146.7772 | 0.0520 | 161.2202 | 91.0% |
 * | 16777216 | 0.8192 | 163.8400 | 0.7869 | 170.5625 | 96.1% |
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
 * | 1024 | 0.0060 | 1.3545 | 0.0027 | 3.0843 | 43.9% |
 * | 65536 | 0.0082 | 64.0000 | 0.0042 | 126.0308 | 50.8% |
 * | 1048576 | 0.0572 | 146.5310 | 0.0520 | 161.2202 | 90.9% |
 * | 16777216 | 0.8191 | 163.8560 | 0.7869 | 170.5695 | 96.1% |
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
 * | 1024 | 0.0060 | 1.3581 | 0.0026 | 3.1411 | 43.2% |
 * | 65536 | 0.0082 | 64.0000 | 0.0042 | 126.0308 | 50.8% |
 * | 1048576 | 0.0573 | 146.2857 | 0.0520 | 161.2697 | 90.7% |
 * | 16777216 | 0.8192 | 163.8400 | 0.7870 | 170.5348 | 96.1% |
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
