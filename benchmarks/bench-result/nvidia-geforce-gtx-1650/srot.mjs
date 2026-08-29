/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0849 | 0.0035 | 0.1455 | 58.3% |
 * | 64 | 0.0061 | 0.1667 | 0.0035 | 0.2963 | 56.2% |
 * | 128 | 0.0061 | 0.3333 | 0.0034 | 0.6009 | 55.5% |
 * | 512 | 0.0061 | 1.3333 | 0.0034 | 2.4151 | 55.2% |
 * | 1024 | 0.0078 | 2.0898 | 0.0032 | 5.0443 | 41.4% |
 * | 4096 | 0.0073 | 8.9432 | 0.0033 | 19.5981 | 45.6% |
 * | 16384 | 0.0082 | 32.0000 | 0.0041 | 64.0000 | 50.0% |
 * | 65536 | 0.0102 | 102.4000 | 0.0399 | 26.2775 | 389.7% |
 * | 262144 | 0.0300 | 139.6612 | 0.0898 | 46.7280 | 298.9% |
 * | 1048576 | 0.1024 | 163.8400 | 0.2878 | 58.2931 | 281.1% |
 * | 4194304 | 0.3906 | 171.7991 | 0.5754 | 116.6316 | 147.3% |
 * | 16777216 | 1.5497 | 173.2199 | 2.2281 | 120.4775 | 143.8% |
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
 * | 32 | 0.0061 | 0.0844 | 0.0041 | 0.1250 | 67.5% |
 * | 64 | 0.0059 | 0.1730 | 0.0041 | 0.2500 | 69.2% |
 * | 128 | 0.0060 | 0.3422 | 0.0041 | 0.5000 | 68.4% |
 * | 512 | 0.0061 | 1.3333 | 0.0041 | 2.0000 | 66.7% |
 * | 1024 | 0.0061 | 2.6667 | 0.0041 | 4.0000 | 66.7% |
 * | 4096 | 0.0064 | 10.2915 | 0.0042 | 15.5152 | 66.3% |
 * | 16384 | 0.0083 | 31.7519 | 0.0061 | 42.6667 | 74.4% |
 * | 65536 | 0.0276 | 37.9479 | 0.0615 | 17.0578 | 222.5% |
 * | 262144 | 0.1008 | 41.6168 | 0.1573 | 26.6678 | 156.1% |
 * | 1048576 | 0.3953 | 42.4404 | 0.4731 | 35.4632 | 119.7% |
 * | 4194304 | 1.5708 | 42.7223 | 1.8844 | 35.6122 | 120.0% |
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
 * | 32 | 0.0061 | 0.0838 | 0.0039 | 0.1301 | 64.4% |
 * | 64 | 0.0061 | 0.1667 | 0.0039 | 0.2602 | 64.1% |
 * | 128 | 0.0061 | 0.3333 | 0.0041 | 0.5020 | 66.4% |
 * | 512 | 0.0063 | 1.3061 | 0.0047 | 1.7297 | 75.5% |
 * | 1024 | 0.0065 | 2.5098 | 0.0053 | 3.0659 | 81.9% |
 * | 4096 | 0.0094 | 6.9898 | 0.0063 | 10.4490 | 66.9% |
 * | 16384 | 0.0348 | 7.5294 | 0.0427 | 6.1455 | 122.5% |
 * | 65536 | 0.1393 | 7.5294 | 0.1839 | 5.7008 | 132.1% |
 * | 262144 | 0.5530 | 7.5850 | 0.6433 | 6.5203 | 116.3% |
 * | 1048576 | 2.2077 | 7.5993 | 2.5517 | 6.5748 | 115.6% |
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
 * | 512 | 0.0064 | 1.2736 | 0.0048 | 1.7181 | 74.1% |
 * | 1024 | 0.0067 | 2.4556 | 0.0048 | 3.3907 | 72.4% |
 * | 4096 | 0.0103 | 6.3801 | 0.0105 | 6.2630 | 101.9% |
 * | 16384 | 0.0616 | 4.2578 | 0.0999 | 2.6235 | 162.3% |
 * | 65536 | 0.2899 | 3.6170 | 0.3421 | 3.0654 | 118.0% |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.6806 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1020 | 164.5083 |
 * | 16777216 | 1.5732 | 170.6285 |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.7307 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1021 | 164.3794 |
 * | 16777216 | 1.5732 | 170.6337 |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.7018 |
 * | 65536 | 0.0082 | 128.2505 |
 * | 1048576 | 0.1020 | 164.5341 |
 * | 16777216 | 1.5730 | 170.6528 |
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
 * | 1048576 | 0.1021 | 164.2764 |
 * | 16777216 | 1.5731 | 170.6424 |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.7380 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1019 | 164.6633 |
 * | 16777216 | 1.5732 | 170.6320 |
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
 *
 * ## s sweep
 *
 * The sine half of the plane rotation, swept with `c` held fixed — the counterpart to the cosine sweep. `s = 0` makes the rotation an identity in exact arithmetic but is still fully computed and written, so a step there would indicate a short-circuit rather than a property of the maths.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = -0.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0061 | 2.6667 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1021 | 164.3021 |
 * | 16777216 | 1.5733 | 170.6181 |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.7380 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1020 | 164.5599 |
 * | 16777216 | 1.5731 | 170.6406 |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.7234 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1020 | 164.5341 |
 * | 16777216 | 1.5732 | 170.6320 |
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
 * | 1024 | 0.0061 | 2.6667 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1020 | 164.5341 |
 * | 16777216 | 1.5731 | 170.6406 |
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
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0060 | 2.7453 |
 * | 65536 | 0.0082 | 128.0000 |
 * | 1048576 | 0.1019 | 164.7150 |
 * | 16777216 | 1.5730 | 170.6493 |
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
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
