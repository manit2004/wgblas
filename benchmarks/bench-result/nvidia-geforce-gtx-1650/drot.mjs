/**
 * Benchmark results for drot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.1471 | 0.0029 | 0.3556 | 41.4% |
 * | 64 | 0.0069 | 0.2949 | 0.0029 | 0.6995 | 42.2% |
 * | 128 | 0.0069 | 0.5940 | 0.0031 | 1.3403 | 44.3% |
 * | 512 | 0.0070 | 2.3486 | 0.0036 | 4.5919 | 51.1% |
 * | 1024 | 0.0070 | 4.6545 | 0.0036 | 8.9825 | 51.8% |
 * | 4096 | 0.0072 | 18.0839 | 0.0037 | 35.6174 | 50.8% |
 * | 16384 | 0.0096 | 54.4319 | 0.0054 | 96.6608 | 56.3% |
 * | 65536 | 0.0198 | 105.8740 | 0.0110 | 190.5116 | 55.6% |
 * | 262144 | 0.0574 | 146.0412 | 0.0520 | 161.3690 | 90.5% |
 * | 1048576 | 0.2048 | 163.8400 | 0.1987 | 168.9072 | 97.0% |
 * | 4194304 | 0.8008 | 167.6113 | 0.7844 | 171.1053 | 98.0% |
 * | 16777216 | 3.2111 | 167.1937 | 3.1311 | 171.4638 | 97.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![drot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-default.svg)
 *
 * ![drot-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-default.svg)
 *
 * ## See also
 *
 * - [drot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/wgblas/drot.js) — WebGPU benchmark script
 * - [drot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/cuda/drot.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0073 | 0.1397 | 0.0029 | 0.3536 | 39.5% |
 * | 64 | 0.0068 | 0.3019 | 0.0030 | 0.6882 | 43.9% |
 * | 128 | 0.0070 | 0.5872 | 0.0032 | 1.2800 | 45.9% |
 * | 512 | 0.0071 | 2.3220 | 0.0036 | 4.4912 | 51.7% |
 * | 1024 | 0.0073 | 4.5011 | 0.0038 | 8.5690 | 52.5% |
 * | 4096 | 0.0088 | 14.9489 | 0.0042 | 31.2672 | 47.8% |
 * | 16384 | 0.0150 | 34.9339 | 0.0088 | 59.5782 | 58.6% |
 * | 65536 | 0.0717 | 29.2571 | 0.0553 | 37.9259 | 77.1% |
 * | 262144 | 0.2923 | 28.6998 | 0.2113 | 39.7068 | 72.3% |
 * | 1048576 | 1.1796 | 28.4444 | 0.8327 | 40.2957 | 70.6% |
 * | 4194304 | 4.6961 | 28.5809 | 3.3213 | 40.4114 | 70.7% |
 *
 * ![drot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-stride4.svg)
 *
 * ![drot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.1419 | 0.0030 | 0.3459 | 41.0% |
 * | 64 | 0.0070 | 0.2916 | 0.0030 | 0.6772 | 43.1% |
 * | 128 | 0.0070 | 0.5872 | 0.0032 | 1.2800 | 45.9% |
 * | 512 | 0.0071 | 2.3063 | 0.0037 | 4.4138 | 52.3% |
 * | 1024 | 0.0074 | 4.4233 | 0.0038 | 8.7149 | 50.8% |
 * | 4096 | 0.0091 | 14.4480 | 0.0042 | 31.0303 | 46.6% |
 * | 16384 | 0.0208 | 25.1481 | 0.0180 | 29.0496 | 86.6% |
 * | 65536 | 0.0943 | 22.2307 | 0.0688 | 30.5031 | 72.9% |
 * | 262144 | 0.3902 | 21.4995 | 0.2683 | 31.2672 | 68.8% |
 * | 1048576 | 1.5523 | 21.6159 | 1.0662 | 31.4708 | 68.7% |
 *
 * ![drot-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-stride5.svg)
 *
 * ![drot-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.1356 | 0.0032 | 0.3249 | 41.7% |
 * | 64 | 0.0076 | 0.2706 | 0.0032 | 0.6465 | 41.9% |
 * | 128 | 0.0076 | 0.5424 | 0.0033 | 1.2549 | 43.2% |
 * | 512 | 0.0082 | 2.0078 | 0.0042 | 3.9084 | 51.4% |
 * | 1024 | 0.0082 | 4.0000 | 0.0042 | 7.7576 | 51.6% |
 * | 4096 | 0.0205 | 6.4000 | 0.0063 | 20.6869 | 30.9% |
 * | 16384 | 0.0712 | 7.3603 | 0.0410 | 12.7850 | 57.6% |
 * | 65536 | 0.2756 | 7.6081 | 0.1855 | 11.3061 | 67.3% |
 * | 262144 | 1.0858 | 7.7255 | 0.7486 | 11.2051 | 68.9% |
 *
 * ![drot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-stride32.svg)
 *
 * ![drot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0072 | 0.2844 | 0.0032 | 0.6368 | 44.7% |
 * | 128 | 0.0077 | 0.5344 | 0.0033 | 1.2308 | 43.4% |
 * | 512 | 0.0080 | 2.0398 | 0.0041 | 4.0000 | 51.0% |
 * | 1024 | 0.0082 | 4.0000 | 0.0041 | 8.0000 | 50.0% |
 * | 4096 | 0.0209 | 6.2726 | 0.0098 | 13.3638 | 46.9% |
 * | 16384 | 0.0758 | 6.9175 | 0.0474 | 11.0553 | 62.6% |
 * | 65536 | 0.3067 | 6.8388 | 0.2126 | 9.8647 | 69.3% |
 * | 262144 | 1.2450 | 6.7381 | 0.8826 | 9.5049 | 70.9% |
 *
 * ![drot-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-stride33.svg)
 *
 * ![drot-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0080 | 2.0480 | 0.0041 | 4.0000 | 51.2% |
 * | 1024 | 0.0084 | 3.9159 | 0.0041 | 8.0000 | 48.9% |
 * | 4096 | 0.0304 | 4.3070 | 0.0128 | 10.2400 | 42.1% |
 * | 16384 | 0.1273 | 4.1176 | 0.0717 | 7.3143 | 56.3% |
 * | 65536 | 0.5931 | 3.5360 | 0.3065 | 6.8423 | 51.7% |
 *
 * ![drot-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-stride255.svg)
 *
 * ![drot-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0080 | 2.0358 | 0.0042 | 3.9234 | 51.9% |
 * | 1024 | 0.0083 | 3.9385 | 0.0041 | 7.9380 | 49.6% |
 * | 4096 | 0.0281 | 4.6651 | 0.0093 | 14.0274 | 33.3% |
 * | 16384 | 0.1126 | 4.6545 | 0.0682 | 7.6830 | 60.6% |
 * | 65536 | 0.5591 | 3.7509 | 0.2960 | 7.0857 | 52.9% |
 *
 * ![drot-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-stride256.svg)
 *
 * ![drot-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.drot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/wgblas/stride.drot.js) — WebGPU stride-sweep benchmark script
 * - [stride.drot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/cuda/stride.drot.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 1024 | 0.0071 | 4.6335 | 0.0035 | 9.3091 | 49.8% |
 * | 65536 | 0.0202 | 103.6142 | 0.0110 | 190.2351 | 54.5% |
 * | 1048576 | 0.2048 | 163.8656 | 0.1986 | 168.9344 | 97.0% |
 * | 16777216 | 3.2260 | 166.4208 | 3.1311 | 171.4638 | 97.1% |
 *
 * ![drot-cosineneg0p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-cosineneg0p75.svg)
 *
 * ![drot-cosineneg0p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-cosineneg0p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0070 | 4.6758 | 0.0036 | 9.1429 | 51.1% |
 * | 65536 | 0.0200 | 105.1099 | 0.0112 | 187.5136 | 56.1% |
 * | 1048576 | 0.2048 | 163.8400 | 0.1987 | 168.9072 | 97.0% |
 * | 16777216 | 3.2063 | 167.4415 | 3.1311 | 171.4620 | 97.7% |
 *
 * ![drot-cosine0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-cosine0.svg)
 *
 * ![drot-cosine0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-cosine0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 0.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0075 | 4.3948 | 0.0037 | 8.8276 | 49.8% |
 * | 65536 | 0.0203 | 103.5324 | 0.0111 | 188.3218 | 55.0% |
 * | 1048576 | 0.2048 | 163.8400 | 0.1986 | 168.9616 | 97.0% |
 * | 16777216 | 3.2194 | 166.7591 | 3.1312 | 171.4568 | 97.3% |
 *
 * ![drot-cosine0p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-cosine0p5.svg)
 *
 * ![drot-cosine0p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-cosine0p5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 0.7071067811865476</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0074 | 4.4329 |
 * | 65536 | 0.0201 | 104.1908 |
 * | 1048576 | 0.2048 | 163.8400 |
 * | 16777216 | 3.2208 | 166.6887 |
 *
 * ![drot-cosine0p7071067811865476 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-cosine0p7071067811865476.svg)
 *
 * ![drot-cosine0p7071067811865476 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-cosine0p7071067811865476.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — c = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0073 | 4.4912 | 0.0035 | 9.3945 | 47.8% |
 * | 65536 | 0.0204 | 102.8823 | 0.0112 | 188.0516 | 54.7% |
 * | 1048576 | 0.2048 | 163.8400 | 0.1986 | 168.9616 | 97.0% |
 * | 16777216 | 3.2211 | 166.6721 | 3.1312 | 171.4612 | 97.2% |
 *
 * ![drot-cosine1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-cosine1.svg)
 *
 * ![drot-cosine1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-cosine1.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [cosine.drot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/wgblas/cosine.drot.js) — WebGPU c-sweep benchmark script
 * - [cosine.drot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/cuda/cosine.drot.c) — CUDA / cuBLAS c-sweep reference script
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
 * | 1024 | 0.0074 | 4.4522 | 0.0036 | 9.0220 | 49.3% |
 * | 65536 | 0.0203 | 103.3691 | 0.0111 | 188.3218 | 54.9% |
 * | 1048576 | 0.2047 | 163.9168 | 0.1986 | 168.9480 | 97.0% |
 * | 16777216 | 3.2174 | 166.8644 | 3.1312 | 171.4603 | 97.3% |
 *
 * ![drot-sineneg0p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-sineneg0p75.svg)
 *
 * ![drot-sineneg0p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-sineneg0p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0070 | 4.6972 | 0.0037 | 8.7897 | 53.4% |
 * | 65536 | 0.0202 | 104.0254 | 0.0111 | 188.8645 | 55.1% |
 * | 1048576 | 0.2048 | 163.8400 | 0.1985 | 169.0025 | 96.9% |
 * | 16777216 | 3.2085 | 167.3254 | 3.1312 | 171.4585 | 97.6% |
 *
 * ![drot-sine0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-sine0.svg)
 *
 * ![drot-sine0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-sine0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 0.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0073 | 4.4912 | 0.0036 | 9.2252 | 48.7% |
 * | 65536 | 0.0201 | 104.4398 | 0.0113 | 186.1818 | 56.1% |
 * | 1048576 | 0.2048 | 163.8656 | 0.1987 | 168.9072 | 97.0% |
 * | 16777216 | 3.2186 | 166.8030 | 3.1312 | 171.4612 | 97.3% |
 *
 * ![drot-sine0p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-sine0p5.svg)
 *
 * ![drot-sine0p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-sine0p5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 0.7071067811865475</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 1024 | 0.0073 | 4.4912 |
 * | 65536 | 0.0204 | 102.5603 |
 * | 1048576 | 0.2047 | 163.9168 |
 * | 16777216 | 3.2193 | 166.7649 |
 *
 * ![drot-sine0p7071067811865475 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-sine0p7071067811865475.svg)
 *
 * ![drot-sine0p7071067811865475 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-sine0p7071067811865475.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — s = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 1024 | 0.0074 | 4.4522 | 0.0035 | 9.4378 | 47.2% |
 * | 65536 | 0.0203 | 103.2063 | 0.0111 | 188.8645 | 54.6% |
 * | 1048576 | 0.2048 | 163.8400 | 0.1987 | 168.9072 | 97.0% |
 * | 16777216 | 3.2182 | 166.8254 | 3.1311 | 171.4638 | 97.3% |
 *
 * ![drot-sine1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/gbps-sine1.svg)
 *
 * ![drot-sine1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/drot/ms-sine1.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [sine.drot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/wgblas/sine.drot.js) — WebGPU s-sweep benchmark script
 * - [sine.drot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/drot/cuda/sine.drot.c) — CUDA / cuBLAS s-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/drot
 */
