/**
 * Benchmark results for ssyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5726 | 0.0040 | 1.0924 | 52.4% |
 * | 64 | 0.0079 | 2.1507 | 0.0038 | 4.4746 | 48.1% |
 * | 128 | 0.0079 | 8.3871 | 0.0041 | 16.3780 | 51.2% |
 * | 256 | 0.0086 | 30.6914 | 0.0038 | 69.3782 | 44.2% |
 * | 512 | 0.0118 | 89.1491 | 0.0061 | 172.2304 | 51.8% |
 * | 1024 | 0.0553 | 76.0000 | 0.0312 | 134.8337 | 56.4% |
 * | 1280 | 0.0942 | 69.6739 | 0.0686 | 95.6270 | 72.9% |
 * | 2048 | 0.2191 | 76.6355 | 0.1188 | 141.3793 | 54.2% |
 * | 4096 | 0.8264 | 81.2459 | 0.4532 | 148.1344 | 54.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyr-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-default.svg)
 *
 * ![ssyr-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/ssyr.js) — WebGPU benchmark script
 * - [ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/ssyr.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0077 | 0.5667 | 0.0041 | 1.0502 | 54.0% |
 * | 64 | 0.0079 | 2.1420 | 0.0040 | 4.1905 | 51.1% |
 * | 128 | 0.0082 | 8.1250 | 0.0040 | 16.7742 | 48.4% |
 * | 256 | 0.0092 | 28.6667 | 0.0044 | 60.4835 | 47.4% |
 * | 512 | 0.0122 | 86.1152 | 0.0067 | 157.0215 | 54.8% |
 * | 1024 | 0.0369 | 114.0000 | 0.0314 | 133.6672 | 85.3% |
 * | 1280 | 0.0544 | 120.6588 | 0.0676 | 97.1672 | 124.2% |
 * | 2048 | 0.1218 | 137.8694 | 0.1187 | 141.4555 | 97.5% |
 * | 4096 | 0.4608 | 145.7067 | 0.4648 | 144.4428 | 100.9% |
 *
 * ![ssyr-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride4.svg)
 *
 * ![ssyr-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0079 | 0.5528 | 0.0040 | 1.0880 | 50.8% |
 * | 64 | 0.0078 | 2.1639 | 0.0041 | 4.1575 | 52.0% |
 * | 128 | 0.0083 | 8.0464 | 0.0041 | 16.2500 | 49.5% |
 * | 256 | 0.0122 | 21.6693 | 0.0041 | 64.0000 | 33.9% |
 * | 512 | 0.0247 | 42.6944 | 0.0074 | 141.7931 | 30.1% |
 * | 1024 | 0.0891 | 47.1470 | 0.0322 | 130.3504 | 36.2% |
 * | 1280 | 0.1372 | 47.8358 | 0.0676 | 97.1212 | 49.3% |
 * | 2048 | 0.3450 | 48.6827 | 0.1207 | 139.0936 | 35.0% |
 * | 4096 | 1.3312 | 50.4369 | 0.4854 | 138.3291 | 36.5% |
 *
 * ![ssyr-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride32.svg)
 *
 * ![ssyr-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.6939 | 0.0041 | 1.0625 | 65.3% |
 * | 64 | 0.0062 | 2.7287 | 0.0041 | 4.1250 | 66.1% |
 * | 128 | 0.0070 | 9.4977 | 0.0043 | 15.5224 | 61.2% |
 * | 256 | 0.0098 | 26.8925 | 0.0042 | 63.5077 | 42.3% |
 * | 512 | 0.0192 | 54.7354 | 0.0070 | 149.8679 | 36.5% |
 * | 1024 | 0.0739 | 56.8643 | 0.0325 | 129.2598 | 44.0% |
 * | 1280 | 0.1160 | 56.5926 | 0.0665 | 98.7578 | 57.3% |
 * | 2048 | 0.2911 | 57.6925 | 0.1172 | 143.2510 | 40.3% |
 * | 4096 | 1.1339 | 59.2145 | 0.4772 | 140.7086 | 42.1% |
 *
 * ![ssyr-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-stride256.svg)
 *
 * ![ssyr-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/stride.ssyr.js) — WebGPU stride-sweep benchmark script
 * - [stride.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/stride.ssyr.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## Uplo sweep
 *
 * Unless noted otherwise, every result above uses `uplo = "lower"`. Real workgroups dispatch in increasing index order, so `uplo = "upper"` front-loads the heaviest rows first (worse — long-running heavy workgroups have nothing to overlap with) while `lower` back-loads them (better — light rows clear fast, the heavy tail gets full GPU to itself) — collapsed below by default, expand a `uplo` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = lower</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0041 | 1.0584 | 66.9% |
 * | 64 | 0.0061 | 2.7500 | 0.0039 | 4.3636 | 63.0% |
 * | 128 | 0.0063 | 10.5051 | 0.0040 | 16.5079 | 63.6% |
 * | 256 | 0.0076 | 34.7621 | 0.0041 | 64.5000 | 53.9% |
 * | 512 | 0.0096 | 109.2890 | 0.0102 | 102.8000 | 106.3% |
 * | 1024 | 0.0331 | 127.0097 | 0.0313 | 134.3509 | 94.5% |
 * | 1280 | 0.0512 | 128.2802 | 0.0687 | 95.5157 | 134.3% |
 * | 2048 | 0.1147 | 146.4286 | 0.1165 | 144.0966 | 101.6% |
 * | 4096 | 0.4340 | 154.7099 | 0.4641 | 144.6818 | 106.9% |
 *
 * ![ssyr-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-uplolower.svg)
 *
 * ![ssyr-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0073 | 0.5939 | 0.0041 | 1.0625 | 55.9% |
 * | 64 | 0.0074 | 2.2957 | 0.0040 | 4.1905 | 54.8% |
 * | 128 | 0.0076 | 8.7579 | 0.0040 | 16.5737 | 52.8% |
 * | 256 | 0.0085 | 31.0376 | 0.0041 | 63.7529 | 48.7% |
 * | 512 | 0.0119 | 88.7881 | 0.0068 | 154.4413 | 57.5% |
 * | 1024 | 0.0570 | 73.7591 | 0.0326 | 128.7529 | 57.3% |
 * | 1280 | 0.0913 | 71.8585 | 0.0673 | 97.5368 | 73.7% |
 * | 2048 | 0.2122 | 79.1315 | 0.1171 | 143.4468 | 55.2% |
 * | 4096 | 0.8044 | 83.4680 | 0.4570 | 146.9157 | 56.8% |
 *
 * ![ssyr-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-uploupper.svg)
 *
 * ![ssyr-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/uplo.ssyr.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/uplo.ssyr.c) — CUDA / cuBLAS uplo-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.6507 | 0.0043 | 1.0226 | 63.6% |
 * | 64 | 0.0068 | 2.4965 | 0.0041 | 4.0772 | 61.2% |
 * | 128 | 0.0071 | 9.3483 | 0.0040 | 16.6400 | 56.2% |
 * | 256 | 0.0082 | 32.2500 | 0.0041 | 64.0000 | 50.4% |
 * | 512 | 0.0104 | 101.2185 | 0.0067 | 156.6476 | 64.6% |
 * | 1024 | 0.0348 | 120.7059 | 0.0314 | 133.8716 | 90.2% |
 * | 1280 | 0.0522 | 125.6863 | 0.0683 | 96.1650 | 130.7% |
 * | 2048 | 0.1167 | 143.8596 | 0.1188 | 141.3793 | 101.8% |
 * | 4096 | 0.4360 | 154.0059 | 0.4644 | 144.5772 | 106.5% |
 *
 * ![ssyr-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad0.svg)
 *
 * ![ssyr-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6415 | 0.0040 | 1.0837 | 59.2% |
 * | 64 | 0.0069 | 2.4615 | 0.0040 | 4.2581 | 57.8% |
 * | 128 | 0.0075 | 8.8511 | 0.0040 | 16.7742 | 52.8% |
 * | 256 | 0.0083 | 32.0000 | 0.0050 | 52.4190 | 61.0% |
 * | 512 | 0.0112 | 93.9886 | 0.0136 | 77.4024 | 121.4% |
 * | 1024 | 0.0573 | 73.2857 | 0.0409 | 102.7606 | 71.3% |
 * | 1280 | 0.0902 | 72.7763 | 0.0770 | 85.2890 | 85.3% |
 * | 2048 | 0.2151 | 78.0836 | 0.1438 | 116.7649 | 66.9% |
 * | 4096 | 0.8132 | 82.5680 | 0.7674 | 87.4933 | 94.4% |
 *
 * ![ssyr-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad1.svg)
 *
 * ![ssyr-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0040 | 1.0794 | 65.6% |
 * | 64 | 0.0062 | 2.7358 | 0.0039 | 4.2927 | 63.7% |
 * | 128 | 0.0065 | 10.2463 | 0.0038 | 17.3333 | 59.1% |
 * | 256 | 0.0076 | 34.9091 | 0.0041 | 64.5000 | 54.1% |
 * | 512 | 0.0096 | 109.2890 | 0.0067 | 156.2755 | 69.9% |
 * | 1024 | 0.0549 | 76.4869 | 0.0435 | 96.5292 | 79.2% |
 * | 1280 | 0.0900 | 72.9705 | 0.0756 | 86.8049 | 84.1% |
 * | 2048 | 0.2015 | 83.3413 | 0.1809 | 92.8274 | 89.8% |
 * | 4096 | 0.7525 | 89.2290 | 0.7659 | 87.6596 | 101.8% |
 *
 * ![ssyr-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad8.svg)
 *
 * ![ssyr-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2308 | 57.6% |
 * | 64 | 0.0061 | 2.7500 | 0.0036 | 4.7143 | 58.3% |
 * | 128 | 0.0065 | 10.1961 | 0.0036 | 18.5714 | 54.9% |
 * | 256 | 0.0075 | 35.1319 | 0.0038 | 69.3782 | 50.6% |
 * | 512 | 0.0096 | 110.2044 | 0.0061 | 171.3333 | 64.3% |
 * | 1024 | 0.0549 | 76.4869 | 0.0443 | 94.9588 | 80.5% |
 * | 1280 | 0.0860 | 76.3095 | 0.0702 | 93.5127 | 81.6% |
 * | 2048 | 0.2064 | 81.3454 | 0.1446 | 116.1319 | 70.0% |
 * | 4096 | 0.7559 | 88.8267 | 0.7598 | 88.3666 | 100.5% |
 *
 * ![ssyr-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad16.svg)
 *
 * ![ssyr-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0047 | 0.9189 | 77.1% |
 * | 64 | 0.0061 | 2.7500 | 0.0041 | 4.1250 | 66.7% |
 * | 128 | 0.0065 | 10.2211 | 0.0040 | 16.6400 | 61.4% |
 * | 256 | 0.0076 | 34.8354 | 0.0041 | 64.5000 | 54.0% |
 * | 512 | 0.0096 | 109.2890 | 0.0067 | 157.3971 | 69.4% |
 * | 1024 | 0.0341 | 123.1392 | 0.0389 | 108.0000 | 114.0% |
 * | 1280 | 0.0512 | 128.2000 | 0.0595 | 110.3983 | 116.1% |
 * | 2048 | 0.1147 | 146.3673 | 0.1364 | 123.0769 | 118.9% |
 * | 4096 | 0.4468 | 150.2561 | 0.6035 | 111.2501 | 135.1% |
 *
 * ![ssyr-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad32.svg)
 *
 * ![ssyr-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0034 | 1.2651 | 56.0% |
 * | 64 | 0.0061 | 2.7500 | 0.0034 | 4.9577 | 55.5% |
 * | 128 | 0.0065 | 10.2716 | 0.0146 | 4.5564 | 225.4% |
 * | 256 | 0.0076 | 34.5439 | 0.0038 | 69.3782 | 49.8% |
 * | 512 | 0.0098 | 107.8557 | 0.0061 | 171.3333 | 63.0% |
 * | 1024 | 0.0567 | 74.0711 | 0.0451 | 93.2727 | 79.4% |
 * | 1280 | 0.0844 | 77.7411 | 0.0696 | 94.3731 | 82.4% |
 * | 2048 | 0.2172 | 77.3129 | 0.1700 | 98.7952 | 78.3% |
 * | 4096 | 0.8037 | 83.5378 | 0.7930 | 84.6653 | 98.7% |
 *
 * ![ssyr-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad48.svg)
 *
 * ![ssyr-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.6618 | 0.0034 | 1.2710 | 52.1% |
 * | 64 | 0.0066 | 2.5507 | 0.0036 | 4.7568 | 53.6% |
 * | 128 | 0.0072 | 9.2650 | 0.0035 | 19.2593 | 48.1% |
 * | 256 | 0.0082 | 32.2500 | 0.0037 | 71.1724 | 45.3% |
 * | 512 | 0.0104 | 101.6878 | 0.0061 | 173.1368 | 58.7% |
 * | 1024 | 0.0362 | 115.9629 | 0.0413 | 101.8441 | 113.9% |
 * | 1280 | 0.0523 | 125.4173 | 0.0568 | 115.5280 | 108.6% |
 * | 2048 | 0.1226 | 136.9699 | 0.1468 | 114.4228 | 119.7% |
 * | 4096 | 0.4506 | 149.0182 | 0.6023 | 111.4806 | 133.7% |
 *
 * ![ssyr-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad64.svg)
 *
 * ![ssyr-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.6018 | 0.0041 | 1.0625 | 56.6% |
 * | 64 | 0.0075 | 2.2612 | 0.0041 | 4.1250 | 54.8% |
 * | 128 | 0.0082 | 8.1250 | 0.0043 | 15.5224 | 52.3% |
 * | 256 | 0.0091 | 29.0193 | 0.0040 | 66.3132 | 43.8% |
 * | 512 | 0.0120 | 87.4894 | 0.0065 | 162.4494 | 53.9% |
 * | 1024 | 0.0385 | 109.2579 | 0.0414 | 101.4900 | 107.7% |
 * | 1280 | 0.0557 | 117.8512 | 0.0614 | 106.8612 | 110.3% |
 * | 2048 | 0.1276 | 131.6278 | 0.1902 | 88.3056 | 149.1% |
 * | 4096 | 0.5204 | 129.0113 | 0.6364 | 105.4969 | 122.3% |
 *
 * ![ssyr-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-pad128.svg)
 *
 * ![ssyr-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/lda.ssyr.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/lda.ssyr.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0075 | 0.5775 | 0.0036 | 1.2197 | 47.3% |
 * | 64 | 0.0077 | 2.1863 | 0.0035 | 4.8889 | 44.7% |
 * | 128 | 0.0080 | 8.3534 | 0.0036 | 18.7387 | 44.6% |
 * | 256 | 0.0090 | 29.2766 | 0.0038 | 69.9661 | 41.8% |
 * | 512 | 0.0120 | 87.9572 | 0.0061 | 172.6824 | 50.9% |
 * | 1024 | 0.0367 | 114.4969 | 0.0310 | 135.5294 | 84.5% |
 * | 1280 | 0.0537 | 122.1316 | 0.0700 | 93.7477 | 130.3% |
 * | 2048 | 0.1201 | 139.8162 | 0.1187 | 141.4555 | 98.8% |
 * | 4096 | 0.4444 | 151.0783 | 0.4462 | 150.4716 | 100.4% |
 *
 * ![ssyr-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alphaneg3p75.svg)
 *
 * ![ssyr-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0017 | 2.5660 | 27.6% |
 * | 64 | 0.0061 | 2.7500 | 0.0015 | 11.1158 | 24.7% |
 * | 128 | 0.0063 | 10.5316 | 0.0015 | 43.3333 | 24.3% |
 * | 256 | 0.0075 | 35.2068 | 0.0015 | 172.0000 | 20.5% |
 * | 512 | 0.0096 | 109.6533 | 0.0016 | 657.9200 | 16.7% |
 * | 1024 | 0.0334 | 125.7931 | 0.0014 | 3019.0342 | 4.2% |
 * | 1280 | 0.0511 | 128.4408 | 0.0014 | 4715.4019 | 2.7% |
 * | 2048 | 0.1147 | 146.4286 | 0.0015 | 11165.9570 | 1.3% |
 * | 4096 | 0.4328 | 155.1332 | 0.0014 | 47685.8164 | 0.3% |
 *
 * ![ssyr-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha0.svg)
 *
 * ![ssyr-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0074 | 0.5849 | 0.0035 | 1.2420 | 47.1% |
 * | 64 | 0.0076 | 2.2232 | 0.0034 | 4.9346 | 45.1% |
 * | 128 | 0.0080 | 8.3034 | 0.0035 | 18.9954 | 43.7% |
 * | 256 | 0.0092 | 28.8671 | 0.0038 | 69.3782 | 41.6% |
 * | 512 | 0.0119 | 88.6685 | 0.0061 | 171.3333 | 51.8% |
 * | 1024 | 0.0412 | 101.8836 | 0.0310 | 135.5294 | 75.2% |
 * | 1280 | 0.0600 | 109.3099 | 0.0699 | 93.9624 | 116.3% |
 * | 2048 | 0.1388 | 120.9635 | 0.1192 | 140.8670 | 85.9% |
 * | 4096 | 0.5202 | 129.0629 | 0.4463 | 150.4446 | 85.8% |
 *
 * ![ssyr-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha1eneg38.svg)
 *
 * ![ssyr-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0041 | 1.0625 | 66.7% |
 * | 64 | 0.0061 | 2.7500 | 0.0041 | 4.1250 | 66.7% |
 * | 128 | 0.0063 | 10.5051 | 0.0041 | 16.2500 | 64.6% |
 * | 256 | 0.0076 | 34.5439 | 0.0044 | 60.2628 | 57.3% |
 * | 512 | 0.0098 | 107.6792 | 0.0068 | 155.9052 | 69.1% |
 * | 1024 | 0.0334 | 125.6727 | 0.0414 | 101.5684 | 123.7% |
 * | 1280 | 0.0512 | 128.2802 | 0.0711 | 92.2717 | 139.0% |
 * | 2048 | 0.1147 | 146.4286 | 0.1154 | 145.4747 | 100.7% |
 * | 4096 | 0.4440 | 151.2308 | 0.4560 | 147.2404 | 102.7% |
 *
 * ![ssyr-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha1.svg)
 *
 * ![ssyr-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5751 | 0.0036 | 1.1982 | 48.0% |
 * | 64 | 0.0076 | 2.2185 | 0.0035 | 4.8000 | 46.2% |
 * | 128 | 0.0081 | 8.2376 | 0.0037 | 17.7778 | 46.3% |
 * | 256 | 0.0094 | 28.0816 | 0.0039 | 67.9506 | 41.3% |
 * | 512 | 0.0120 | 87.7227 | 0.0062 | 169.5670 | 51.7% |
 * | 1024 | 0.0366 | 114.7471 | 0.0310 | 135.5294 | 84.7% |
 * | 1280 | 0.0543 | 120.9434 | 0.0655 | 100.1562 | 120.8% |
 * | 2048 | 0.1203 | 139.5745 | 0.1133 | 148.1858 | 94.2% |
 * | 4096 | 0.4444 | 151.0783 | 0.4452 | 150.8177 | 100.2% |
 *
 * ![ssyr-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-alpha2p5.svg)
 *
 * ![ssyr-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/alpha.ssyr.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/alpha.ssyr.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * ## layout sweep
 *
 * Column-major swaps the effective `m`/`n` and flips the transpose flag internally, changing which axis is contiguous and therefore how the matrix reads coalesce. wgblas-only: cuBLAS is column-major and has no layout argument, so there is no reference curve to compare against.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = column-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0076 | 0.5714 |
 * | 64 | 0.0078 | 2.1639 |
 * | 128 | 0.0080 | 8.3534 |
 * | 256 | 0.0086 | 30.5778 |
 * | 512 | 0.0119 | 88.7881 |
 * | 1024 | 0.0575 | 73.0818 |
 * | 1280 | 0.0963 | 68.1802 |
 * | 2048 | 0.2163 | 77.6274 |
 * | 4096 | 0.8280 | 81.0921 |
 *
 * ![ssyr-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-layoutcolumnmajor.svg)
 *
 * ![ssyr-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0076 | 0.5702 |
 * | 64 | 0.0077 | 2.1818 |
 * | 128 | 0.0080 | 8.3200 |
 * | 256 | 0.0090 | 29.2248 |
 * | 512 | 0.0119 | 88.6685 |
 * | 1024 | 0.0368 | 114.3474 |
 * | 1280 | 0.0540 | 121.6247 |
 * | 2048 | 0.1199 | 140.0213 |
 * | 4096 | 0.4444 | 151.0783 |
 *
 * ![ssyr-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/gbps-layoutrowmajor.svg)
 *
 * ![ssyr-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/layout.ssyr.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr
 */
