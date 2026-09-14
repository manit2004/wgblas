/**
 * Benchmark results for drot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.1475 | 0.0035 | 0.2963 | 49.8% |
 * | 64 | 0.0068 | 0.3019 | 0.0040 | 0.5161 | 58.5% |
 * | 128 | 0.0067 | 0.6139 | 0.0037 | 1.1179 | 54.9% |
 * | 512 | 0.0068 | 2.4151 | 0.0041 | 4.0315 | 59.9% |
 * | 1024 | 0.0068 | 4.8075 | 0.0041 | 8.0000 | 60.1% |
 * | 4096 | 0.0298 | 4.4019 | 0.0041 | 31.7519 | 13.9% |
 * | 16384 | 0.0119 | 44.2213 | 0.0062 | 84.4536 | 52.4% |
 * | 65536 | 0.0181 | 115.6858 | 0.0141 | 148.9454 | 77.7% |
 * | 262144 | 0.0567 | 148.0203 | 0.0524 | 159.9414 | 92.5% |
 * | 1048576 | 0.2031 | 165.1951 | 0.1965 | 170.7222 | 96.8% |
 * | 4194304 | 0.7900 | 169.9027 | 0.7741 | 173.3757 | 98.0% |
 * | 16777216 | 3.1922 | 168.1800 | 3.1308 | 171.4778 | 98.1% |
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
 * | 32 | 0.0087 | 0.1172 | 0.0031 | 0.3333 | 35.2% |
 * | 64 | 0.0074 | 0.2753 | 0.0031 | 0.6667 | 41.3% |
 * | 128 | 0.0072 | 0.5651 | 0.0032 | 1.2736 | 44.4% |
 * | 512 | 0.0069 | 2.3594 | 0.0036 | 4.4912 | 52.5% |
 * | 1024 | 0.0072 | 4.5714 | 0.0038 | 8.6050 | 53.1% |
 * | 4096 | 0.0087 | 15.0312 | 0.0042 | 31.5077 | 47.7% |
 * | 16384 | 0.0192 | 27.3294 | 0.0086 | 61.2486 | 44.6% |
 * | 65536 | 0.0700 | 29.9799 | 0.0553 | 37.9479 | 79.0% |
 * | 262144 | 0.2874 | 29.1855 | 0.2110 | 39.7489 | 73.4% |
 * | 1048576 | 1.1606 | 28.9107 | 0.8362 | 40.1254 | 72.1% |
 * | 4194304 | 4.6374 | 28.9425 | 3.4979 | 38.3711 | 75.4% |
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
 * | 32 | 0.0071 | 0.1445 | 0.0034 | 0.3019 | 47.9% |
 * | 64 | 0.0068 | 0.3033 | 0.0032 | 0.6432 | 47.2% |
 * | 128 | 0.0069 | 0.5926 | 0.0033 | 1.2427 | 47.7% |
 * | 512 | 0.0071 | 2.3063 | 0.0038 | 4.3390 | 53.2% |
 * | 1024 | 0.0075 | 4.3854 | 0.0038 | 8.6050 | 51.0% |
 * | 4096 | 0.0092 | 14.1730 | 0.0041 | 31.7519 | 44.6% |
 * | 16384 | 0.0215 | 24.3628 | 0.0182 | 28.8705 | 84.4% |
 * | 65536 | 0.0937 | 22.3749 | 0.0683 | 30.7032 | 72.9% |
 * | 262144 | 0.3859 | 21.7394 | 0.2683 | 31.2672 | 69.5% |
 * | 1048576 | 1.5442 | 21.7294 | 1.0658 | 31.4831 | 69.0% |
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
 * | 32 | 0.0075 | 0.1359 | 0.0031 | 0.3299 | 41.2% |
 * | 64 | 0.0072 | 0.2838 | 0.0034 | 0.5953 | 47.7% |
 * | 128 | 0.0076 | 0.5367 | 0.0038 | 1.0802 | 49.7% |
 * | 512 | 0.0321 | 0.5102 | 0.0044 | 3.7372 | 13.7% |
 * | 1024 | 0.0112 | 2.9174 | 0.0042 | 7.7576 | 37.6% |
 * | 4096 | 0.0201 | 6.5068 | 0.0063 | 20.6869 | 31.5% |
 * | 16384 | 0.0710 | 7.3835 | 0.0411 | 12.7552 | 57.9% |
 * | 65536 | 0.2774 | 7.5607 | 0.1826 | 11.4834 | 65.8% |
 * | 262144 | 1.0891 | 7.7026 | 0.7503 | 11.1810 | 68.9% |
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
 * | 64 | 0.0073 | 0.2813 | 0.0032 | 0.6497 | 43.3% |
 * | 128 | 0.0075 | 0.5482 | 0.0034 | 1.2133 | 45.2% |
 * | 512 | 0.0080 | 2.0562 | 0.0041 | 4.0000 | 51.4% |
 * | 1024 | 0.0082 | 4.0000 | 0.0041 | 8.0000 | 50.0% |
 * | 4096 | 0.0205 | 6.4000 | 0.0098 | 13.3420 | 48.0% |
 * | 16384 | 0.0756 | 6.9394 | 0.0475 | 11.0404 | 62.9% |
 * | 65536 | 0.3072 | 6.8267 | 0.2132 | 9.8343 | 69.4% |
 * | 262144 | 1.2512 | 6.7047 | 0.8825 | 9.5052 | 70.5% |
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
 * | 512 | 0.0349 | 0.4699 | 0.0041 | 4.0000 | 11.7% |
 * | 1024 | 0.0122 | 2.6771 | 0.0045 | 7.2367 | 37.0% |
 * | 4096 | 0.0307 | 4.2667 | 0.0124 | 10.6114 | 40.2% |
 * | 16384 | 0.1276 | 4.1083 | 0.0718 | 7.3029 | 56.3% |
 * | 65536 | 0.5898 | 3.5556 | 0.3020 | 6.9453 | 51.2% |
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
 * | 512 | 0.0080 | 2.0398 | 0.0042 | 3.9385 | 51.8% |
 * | 1024 | 0.0082 | 4.0000 | 0.0042 | 7.8769 | 50.8% |
 * | 4096 | 0.0278 | 4.7135 | 0.0099 | 13.2557 | 35.6% |
 * | 16384 | 0.1124 | 4.6651 | 0.0696 | 7.5294 | 62.0% |
 * | 65536 | 0.5636 | 3.7209 | 0.2930 | 7.1585 | 52.0% |
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
 * | 1024 | 0.0069 | 4.7739 | 0.0036 | 9.2252 | 51.7% |
 * | 65536 | 0.0177 | 118.7246 | 0.0110 | 189.9594 | 62.5% |
 * | 1048576 | 0.2030 | 165.2602 | 0.1987 | 168.9072 | 97.8% |
 * | 16777216 | 3.1680 | 169.4685 | 3.1366 | 171.1638 | 99.0% |
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
 * | 1024 | 0.0070 | 4.6865 | 0.0035 | 9.3091 | 50.3% |
 * | 65536 | 0.0176 | 118.9401 | 0.0111 | 189.6845 | 62.7% |
 * | 1048576 | 0.2030 | 165.2732 | 0.1986 | 168.9344 | 97.8% |
 * | 16777216 | 3.1802 | 168.8154 | 3.1314 | 171.4480 | 98.5% |
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
 * | 1024 | 0.0069 | 4.7628 | 0.0036 | 9.2252 | 51.6% |
 * | 65536 | 0.0178 | 117.8705 | 0.0112 | 188.0516 | 62.7% |
 * | 1048576 | 0.2029 | 165.3384 | 0.1986 | 168.9889 | 97.8% |
 * | 16777216 | 3.1479 | 170.5470 | 3.1334 | 171.3360 | 99.5% |
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
 * | 1024 | 0.0074 | 4.4043 |
 * | 65536 | 0.0177 | 118.6172 |
 * | 1048576 | 0.2036 | 164.7798 |
 * | 16777216 | 3.1840 | 168.6169 |
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
 * | 1024 | 0.0082 | 4.0000 | 0.0036 | 9.2252 | 43.4% |
 * | 65536 | 0.0174 | 120.3600 | 0.0110 | 189.9594 | 63.4% |
 * | 1048576 | 0.2031 | 165.2211 | 0.1987 | 168.9072 | 97.8% |
 * | 16777216 | 3.1705 | 169.3343 | 3.1331 | 171.3552 | 98.8% |
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
 * | 1024 | 0.0069 | 4.7739 | 0.0037 | 8.8276 | 54.1% |
 * | 65536 | 0.0177 | 118.5099 | 0.0114 | 184.6084 | 64.2% |
 * | 1048576 | 0.2030 | 165.2732 | 0.1987 | 168.9072 | 97.8% |
 * | 16777216 | 3.1501 | 170.4283 | 3.1394 | 171.0102 | 99.7% |
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
 * | 1024 | 0.0067 | 4.8646 | 0.0041 | 8.0000 | 60.8% |
 * | 65536 | 0.0175 | 119.9195 | 0.0113 | 185.9177 | 64.5% |
 * | 1048576 | 0.2030 | 165.2993 | 0.1987 | 168.9072 | 97.9% |
 * | 16777216 | 3.1520 | 170.3262 | 4.3451 | 123.5590 | 137.9% |
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
 * | 1024 | 0.0069 | 4.7189 | 0.0039 | 8.4628 | 55.8% |
 * | 65536 | 0.0174 | 120.2495 | 0.0115 | 183.0614 | 65.7% |
 * | 1048576 | 0.2031 | 165.2472 | 0.1986 | 168.9344 | 97.8% |
 * | 16777216 | 3.1522 | 170.3167 | 3.3054 | 162.4204 | 104.9% |
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
 * | 1024 | 0.0068 | 4.8075 |
 * | 65536 | 0.0178 | 118.0829 |
 * | 1048576 | 0.2031 | 165.2342 |
 * | 16777216 | 3.1529 | 170.2778 |
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
 * | 1024 | 0.0069 | 4.7407 | 0.0036 | 9.0220 | 52.5% |
 * | 65536 | 0.0175 | 119.9195 | 0.0115 | 182.8061 | 65.6% |
 * | 1048576 | 0.2032 | 165.1561 | 0.1985 | 169.0025 | 97.7% |
 * | 16777216 | 3.1516 | 170.3478 | 3.3219 | 161.6178 | 105.4% |
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
