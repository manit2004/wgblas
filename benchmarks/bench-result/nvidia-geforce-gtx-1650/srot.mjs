/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0860 | 0.0035 | 0.1475 | 58.3% |
 * | 64 | 0.0059 | 0.1739 | 0.0029 | 0.3575 | 48.6% |
 * | 128 | 0.0059 | 0.3459 | 0.0036 | 0.5766 | 60.0% |
 * | 512 | 0.0059 | 1.3875 | 0.0029 | 2.7826 | 49.9% |
 * | 1024 | 0.0060 | 2.7527 | 0.0029 | 5.5652 | 49.5% |
 * | 4096 | 0.0061 | 10.7507 | 0.0029 | 22.7556 | 47.2% |
 * | 16384 | 0.0064 | 40.7562 | 0.0038 | 68.8403 | 59.2% |
 * | 65536 | 0.0082 | 128.0000 | 0.0068 | 153.1215 | 83.6% |
 * | 262144 | 0.0285 | 147.1066 | 0.0281 | 149.3698 | 98.5% |
 * | 1048576 | 0.1019 | 164.6633 | 0.1015 | 165.2342 | 99.7% |
 * | 4194304 | 0.3953 | 169.7824 | 0.4151 | 161.6613 | 105.0% |
 * | 16777216 | 1.5773 | 170.1888 | 1.5853 | 169.3232 | 100.5% |
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
 * | 32 | 0.0061 | 0.0833 | 0.0029 | 0.1788 | 46.6% |
 * | 64 | 0.0061 | 0.1667 | 0.0037 | 0.2735 | 60.9% |
 * | 128 | 0.0060 | 0.3422 | 0.0030 | 0.6772 | 50.5% |
 * | 512 | 0.0060 | 1.3617 | 0.0032 | 2.5600 | 53.2% |
 * | 1024 | 0.0061 | 2.6667 | 0.0032 | 5.0443 | 52.9% |
 * | 4096 | 0.0066 | 9.8937 | 0.0036 | 17.9649 | 55.1% |
 * | 16384 | 0.0083 | 31.7519 | 0.0053 | 49.4985 | 64.1% |
 * | 65536 | 0.0274 | 38.2580 | 0.0269 | 39.0095 | 98.1% |
 * | 262144 | 0.1009 | 41.5706 | 0.1004 | 41.7959 | 99.5% |
 * | 1048576 | 0.3953 | 42.4456 | 0.3937 | 42.6146 | 99.6% |
 * | 4194304 | 1.5708 | 42.7232 | 1.5667 | 42.8357 | 99.7% |
 *
 * ![srot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride4.svg)
 *
 * ![srot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0844 | 0.0029 | 0.1739 | 48.6% |
 * | 64 | 0.0061 | 0.1684 | 0.0029 | 0.3478 | 48.4% |
 * | 128 | 0.0061 | 0.3333 | 0.0034 | 0.6066 | 55.0% |
 * | 512 | 0.0063 | 1.2995 | 0.0042 | 1.9692 | 66.0% |
 * | 1024 | 0.0065 | 2.5347 | 0.0041 | 3.9537 | 64.1% |
 * | 4096 | 0.0094 | 6.9660 | 0.0059 | 11.1304 | 62.6% |
 * | 16384 | 0.0349 | 7.5122 | 0.0339 | 7.7429 | 97.0% |
 * | 65536 | 0.1392 | 7.5320 | 0.1330 | 7.8836 | 95.5% |
 * | 262144 | 0.5549 | 7.5581 | 0.5288 | 7.9315 | 95.3% |
 * | 1048576 | 2.2118 | 7.5852 | 2.1962 | 7.6392 | 99.3% |
 *
 * ![srot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/gbps-stride32.svg)
 *
 * ![srot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/srot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2929 | 0.0049 | 1.6732 | 77.3% |
 * | 1024 | 0.0066 | 2.4675 | 0.0056 | 2.9257 | 84.3% |
 * | 4096 | 0.0107 | 6.1502 | 0.0087 | 7.5018 | 82.0% |
 * | 16384 | 0.0614 | 4.2667 | 0.0692 | 3.7856 | 112.7% |
 * | 65536 | 0.2917 | 3.5948 | 0.2923 | 3.5869 | 100.2% |
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
 * | 1024 | 0.0060 | 2.7380 | 0.0032 | 5.1457 | 53.2% |
 * | 65536 | 0.0082 | 128.0000 | 0.0082 | 128.0000 | 100.0% |
 * | 1048576 | 0.1018 | 164.7668 | 0.1018 | 164.8445 | 100.0% |
 * | 16777216 | 1.5786 | 170.0422 | 1.5838 | 169.4908 | 100.3% |
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
 * | 1024 | 0.0060 | 2.7453 | 0.0146 | 1.1204 | 245.0% |
 * | 65536 | 0.0082 | 128.0000 | 0.0186 | 56.3993 | 227.0% |
 * | 1048576 | 0.1020 | 164.5083 | 0.1013 | 165.6257 | 99.3% |
 * | 16777216 | 1.5583 | 172.2613 | 1.5877 | 169.0672 | 101.9% |
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
 * | 1024 | 0.0070 | 2.3379 | 0.0035 | 4.6335 | 50.5% |
 * | 65536 | 0.0082 | 128.0000 | 0.0070 | 150.3119 | 85.2% |
 * | 1048576 | 0.1019 | 164.6375 | 0.1016 | 165.1561 | 99.7% |
 * | 16777216 | 1.5786 | 170.0474 | 1.5874 | 169.0996 | 100.6% |
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
 * | 1024 | 0.0060 | 2.7234 |
 * | 65536 | 0.0082 | 128.2505 |
 * | 1048576 | 0.1021 | 164.3794 |
 * | 16777216 | 1.5785 | 170.0595 |
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
 * | 1024 | 0.0060 | 2.7162 | 0.0029 | 5.6264 | 48.3% |
 * | 65536 | 0.0082 | 128.0000 | 0.0071 | 148.2715 | 86.3% |
 * | 1048576 | 0.1019 | 164.6375 | 0.1017 | 164.8964 | 99.8% |
 * | 16777216 | 1.5788 | 170.0284 | 1.5854 | 169.3197 | 100.4% |
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
 * | 1024 | 0.0060 | 2.7090 | 0.0030 | 5.5351 | 48.9% |
 * | 65536 | 0.0082 | 128.2505 | 0.0076 | 137.1046 | 93.5% |
 * | 1048576 | 0.1020 | 164.5599 | 0.1016 | 165.1821 | 99.6% |
 * | 16777216 | 1.5786 | 170.0422 | 1.5825 | 169.6227 | 100.2% |
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
 * | 1024 | 0.0060 | 2.7380 | 0.0028 | 5.7853 | 47.3% |
 * | 65536 | 0.0082 | 128.0000 | 0.0069 | 152.4093 | 84.0% |
 * | 1048576 | 0.1018 | 164.8186 | 0.1016 | 165.0781 | 99.8% |
 * | 16777216 | 1.5783 | 170.0750 | 1.5889 | 168.9480 | 100.7% |
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
 * | 1024 | 0.0061 | 2.6806 | 0.0029 | 5.6575 | 47.4% |
 * | 65536 | 0.0082 | 128.5020 | 0.0070 | 149.9680 | 85.7% |
 * | 1048576 | 0.1020 | 164.4051 | 0.1049 | 159.9902 | 102.8% |
 * | 16777216 | 1.5787 | 170.0371 | 1.5884 | 168.9957 | 100.6% |
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
 * | 1024 | 0.0060 | 2.7234 |
 * | 65536 | 0.0081 | 129.0079 |
 * | 1048576 | 0.1019 | 164.5858 |
 * | 16777216 | 1.5789 | 170.0095 |
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
 * | 1024 | 0.0061 | 2.6667 | 0.0029 | 5.5652 | 47.9% |
 * | 65536 | 0.0082 | 128.0000 | 0.0072 | 146.2857 | 87.5% |
 * | 1048576 | 0.1022 | 164.2249 | 0.1016 | 165.0521 | 99.5% |
 * | 16777216 | 1.5783 | 170.0784 | 1.6077 | 166.9707 | 101.9% |
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
