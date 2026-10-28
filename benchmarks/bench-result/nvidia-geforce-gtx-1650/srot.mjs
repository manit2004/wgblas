/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0840 | 0.0028 | 0.1839 | 45.7% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3575 | 46.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0029 | 0.7151 | 46.6% |
 * | 512 | 0.0061 | 1.3333 | 0.0029 | 2.7826 | 47.9% |
 * | 1024 | 0.0061 | 2.6667 | 0.0030 | 5.5351 | 48.2% |
 * | 4096 | 0.0061 | 10.6667 | 0.0031 | 21.3333 | 50.0% |
 * | 16384 | 0.0066 | 39.6707 | 0.0038 | 68.2667 | 58.1% |
 * | 65536 | 0.0082 | 128.0000 | 0.0069 | 152.4093 | 84.0% |
 * | 262144 | 0.0286 | 146.7772 | 0.0280 | 149.6256 | 98.1% |
 * | 1048576 | 0.1020 | 164.5083 | 0.1021 | 164.3021 | 100.1% |
 * | 4194304 | 0.3953 | 169.7824 | 0.4157 | 161.4187 | 105.2% |
 * | 16777216 | 1.5729 | 170.6667 | 1.5827 | 169.6022 | 100.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![srot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-default.svg)
 *
 * ![srot-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-default.svg)
 *
 * ## See also
 *
 * - [srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/srot.js) — WebGPU benchmark script
 * - [srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/srot.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0060 | 0.0851 | 0.0029 | 0.1768 | 48.1% |
 * | 64 | 0.0060 | 0.1693 | 0.0029 | 0.3497 | 48.4% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6919 | 48.2% |
 * | 512 | 0.0061 | 1.3333 | 0.0033 | 2.4854 | 53.6% |
 * | 1024 | 0.0061 | 2.6667 | 0.0033 | 5.0196 | 53.1% |
 * | 4096 | 0.0067 | 9.7990 | 0.0036 | 18.1239 | 54.1% |
 * | 16384 | 0.0083 | 31.4472 | 0.0053 | 49.0539 | 64.1% |
 * | 65536 | 0.0273 | 38.3925 | 0.0270 | 38.8938 | 98.7% |
 * | 262144 | 0.1016 | 41.2955 | 0.1004 | 41.7959 | 98.8% |
 * | 1048576 | 0.3950 | 42.4783 | 0.3936 | 42.6285 | 99.6% |
 * | 4194304 | 1.5714 | 42.7053 | 1.5667 | 42.8340 | 99.7% |
 *
 * ![srot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride4.svg)
 *
 * ![srot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0849 | 0.0028 | 0.1829 | 46.4% |
 * | 64 | 0.0060 | 0.1693 | 0.0029 | 0.3516 | 48.2% |
 * | 128 | 0.0061 | 0.3333 | 0.0030 | 0.6882 | 48.4% |
 * | 512 | 0.0061 | 1.3333 | 0.0032 | 2.5859 | 51.6% |
 * | 1024 | 0.0061 | 2.6667 | 0.0034 | 4.8075 | 55.5% |
 * | 4096 | 0.0067 | 9.7990 | 0.0037 | 17.6552 | 55.5% |
 * | 16384 | 0.0092 | 28.3951 | 0.0061 | 42.6667 | 66.6% |
 * | 65536 | 0.0343 | 30.5672 | 0.0332 | 31.5380 | 96.9% |
 * | 262144 | 0.1270 | 33.0323 | 0.1253 | 33.4837 | 98.7% |
 * | 1048576 | 0.4996 | 33.5834 | 0.4928 | 34.0447 | 98.6% |
 * | 4194304 | 1.9825 | 33.8507 | 1.9639 | 34.1717 | 99.1% |
 *
 * ![srot-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride5.svg)
 *
 * ![srot-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0844 | 0.0028 | 0.1818 | 46.4% |
 * | 64 | 0.0061 | 0.1667 | 0.0032 | 0.3200 | 52.1% |
 * | 128 | 0.0061 | 0.3333 | 0.0033 | 0.6214 | 53.6% |
 * | 512 | 0.0063 | 1.2995 | 0.0042 | 1.9542 | 66.5% |
 * | 1024 | 0.0066 | 2.4854 | 0.0043 | 3.8496 | 64.6% |
 * | 4096 | 0.0095 | 6.9189 | 0.0059 | 11.0703 | 62.5% |
 * | 16384 | 0.0348 | 7.5294 | 0.0342 | 7.6597 | 98.3% |
 * | 65536 | 0.1391 | 7.5398 | 0.1350 | 7.7658 | 97.1% |
 * | 262144 | 0.5529 | 7.5854 | 0.5290 | 7.9289 | 95.7% |
 * | 1048576 | 2.2196 | 7.5587 | 2.1324 | 7.8676 | 96.1% |
 *
 * ![srot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride32.svg)
 *
 * ![srot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0061 | 0.1667 | 0.0032 | 0.3216 | 51.8% |
 * | 128 | 0.0061 | 0.3333 | 0.0032 | 0.6432 | 51.8% |
 * | 512 | 0.0064 | 1.2832 | 0.0041 | 2.0000 | 64.2% |
 * | 1024 | 0.0066 | 2.4854 | 0.0041 | 4.0000 | 62.1% |
 * | 4096 | 0.0090 | 7.3012 | 0.0060 | 10.8360 | 67.4% |
 * | 16384 | 0.0384 | 6.8181 | 0.0373 | 7.0257 | 97.0% |
 * | 65536 | 0.1608 | 6.5210 | 0.1501 | 6.9860 | 93.3% |
 * | 262144 | 0.6535 | 6.4185 | 0.6033 | 6.9519 | 92.3% |
 *
 * ![srot-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride33.svg)
 *
 * ![srot-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0066 | 1.2427 | 0.0041 | 2.0000 | 62.1% |
 * | 1024 | 0.0069 | 2.3869 | 0.0041 | 4.0157 | 59.4% |
 * | 4096 | 0.0138 | 4.7407 | 0.0126 | 5.1914 | 91.3% |
 * | 16384 | 0.0696 | 3.7647 | 0.0717 | 3.6539 | 103.0% |
 * | 65536 | 0.3108 | 3.3738 | 0.3027 | 3.4644 | 97.4% |
 *
 * ![srot-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride255.svg)
 *
 * ![srot-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0064 | 1.2736 | 0.0042 | 1.9468 | 65.4% |
 * | 1024 | 0.0067 | 2.4381 | 0.0042 | 3.8788 | 62.9% |
 * | 4096 | 0.0107 | 6.1502 | 0.0093 | 7.0257 | 87.5% |
 * | 16384 | 0.0614 | 4.2667 | 0.0693 | 3.7838 | 112.8% |
 * | 65536 | 0.2917 | 3.5952 | 0.2916 | 3.5961 | 100.0% |
 *
 * ![srot-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride256.svg)
 *
 * ![srot-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/stride.srot.js) — WebGPU stride-sweep benchmark script
 * - [stride.srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/stride.srot.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## c sweep
 *
 * The cosine half of the plane rotation, swept with `s` held fixed so the two halves are attributed separately. `srot`'s kernel computes both outputs unconditionally, so a flat sweep is expected; a step at `c = 0` or `c = 1` would mean an identity case is being short-circuited, which BLAS does not promise.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = -0.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6947 | 0.0030 | 5.3895 | 50.0% |
 * | 65536 | 0.0082 | 128.0000 | 0.0070 | 150.6575 | 85.0% |
 * | 1048576 | 0.1021 | 164.3536 | 0.1014 | 165.4949 | 99.3% |
 * | 16777216 | 1.5746 | 170.4794 | 1.5846 | 169.3984 | 100.6% |
 *
 * ![srot-cosineneg0p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-cosineneg0p75.svg)
 *
 * ![srot-cosineneg0p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-cosineneg0p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6947 | 0.0030 | 5.3895 | 50.0% |
 * | 65536 | 0.0082 | 128.0000 | 0.0069 | 152.0557 | 84.2% |
 * | 1048576 | 0.1021 | 164.3536 | 0.1021 | 164.2764 | 100.0% |
 * | 16777216 | 1.5746 | 170.4759 | 1.5847 | 169.3932 | 100.6% |
 *
 * ![srot-cosine0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-cosine0.svg)
 *
 * ![srot-cosine0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-cosine0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 0.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6806 | 0.0031 | 5.2513 | 51.0% |
 * | 65536 | 0.0082 | 128.0000 | 0.0070 | 150.3119 | 85.2% |
 * | 1048576 | 0.1020 | 164.5599 | 0.1021 | 164.2506 | 100.2% |
 * | 16777216 | 1.5745 | 170.4932 | 1.5846 | 169.4018 | 100.6% |
 *
 * ![srot-cosine0p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-cosine0p5.svg)
 *
 * ![srot-cosine0p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-cosine0p5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 0.7071067690849304</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.6947 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1021 | 164.3536 |
 * | 16777216 | 1.5745 | 170.4915 |
 *
 * ![srot-cosine0p7071067690849304 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-cosine0p7071067690849304.svg)
 *
 * ![srot-cosine0p7071067690849304 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-cosine0p7071067690849304.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6947 | 0.0030 | 5.4468 | 49.5% |
 * | 65536 | 0.0082 | 128.0000 | 0.0070 | 150.3119 | 85.2% |
 * | 1048576 | 0.1020 | 164.4051 | 0.1022 | 164.2249 | 100.1% |
 * | 16777216 | 1.5742 | 170.5210 | 1.5843 | 169.4326 | 100.6% |
 *
 * ![srot-cosine1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-cosine1.svg)
 *
 * ![srot-cosine1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-cosine1.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [cosine.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/cosine.srot.js) — WebGPU c-sweep benchmark script
 * - [cosine.srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/cosine.srot.c) — CUDA / cuBLAS c-sweep reference script
 *
 * ## s sweep
 *
 * The sine half of the plane rotation, swept with `c` held fixed — the counterpart to the cosine sweep. `s = 0` makes the rotation an identity in exact arithmetic but is still fully computed and written, so a step there would indicate a short-circuit rather than a property of the maths.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = -0.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6806 | 0.0030 | 5.5351 | 48.4% |
 * | 65536 | 0.0082 | 128.0000 | 0.0070 | 150.3119 | 85.2% |
 * | 1048576 | 0.1021 | 164.3021 | 0.1020 | 164.4825 | 99.9% |
 * | 16777216 | 1.5747 | 170.4672 | 1.5848 | 169.3762 | 100.6% |
 *
 * ![srot-sineneg0p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-sineneg0p75.svg)
 *
 * ![srot-sineneg0p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-sineneg0p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 2.7090 | 0.0031 | 5.3613 | 50.5% |
 * | 65536 | 0.0082 | 128.0000 | 0.0069 | 151.0046 | 84.8% |
 * | 1048576 | 0.1021 | 164.2506 | 0.1021 | 164.3021 | 100.0% |
 * | 16777216 | 1.5745 | 170.4846 | 1.5848 | 169.3847 | 100.6% |
 *
 * ![srot-sine0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-sine0.svg)
 *
 * ![srot-sine0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-sine0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 0.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0061 | 2.6667 | 0.0030 | 5.4180 | 49.2% |
 * | 65536 | 0.0082 | 128.0000 | 0.0070 | 149.6256 | 85.5% |
 * | 1048576 | 0.1021 | 164.2506 | 0.1020 | 164.4051 | 99.9% |
 * | 16777216 | 1.5747 | 170.4707 | 1.5849 | 169.3744 | 100.6% |
 *
 * ![srot-sine0p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-sine0p5.svg)
 *
 * ![srot-sine0p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-sine0p5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 0.7071067690849304</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.6947 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1019 | 164.6375 |
 * | 16777216 | 1.5747 | 170.4638 |
 *
 * ![srot-sine0p7071067690849304 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-sine0p7071067690849304.svg)
 *
 * ![srot-sine0p7071067690849304 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-sine0p7071067690849304.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0060 | 2.7234 | 0.0030 | 5.4180 | 50.3% |
 * | 65536 | 0.0082 | 128.0000 | 0.0071 | 148.6077 | 86.1% |
 * | 1048576 | 0.1020 | 164.4051 | 0.1021 | 164.3794 | 100.0% |
 * | 16777216 | 1.5744 | 170.5036 | 1.5846 | 169.4001 | 100.7% |
 *
 * ![srot-sine1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-sine1.svg)
 *
 * ![srot-sine1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-sine1.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [sine.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/sine.srot.js) — WebGPU s-sweep benchmark script
 * - [sine.srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/sine.srot.c) — CUDA / cuBLAS s-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
