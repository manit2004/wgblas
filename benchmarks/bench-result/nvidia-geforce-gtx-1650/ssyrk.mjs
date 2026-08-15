/**
 * Benchmark results for ssyrk on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0108 | 0.7619 | 0.0096 | 0.8533 | 89.3% |
 * | 64 | 0.0147 | 2.2309 | 0.0126 | 2.5990 | 85.8% |
 * | 128 | 0.0244 | 5.3789 | 0.0188 | 6.9660 | 77.2% |
 * | 256 | 0.0840 | 6.2439 | 0.0318 | 16.4829 | 37.9% |
 * | 512 | 0.2969 | 7.0644 | 0.1052 | 19.9319 | 35.4% |
 * | 1024 | 2.1174 | 3.9618 | 0.5915 | 14.1830 | 27.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyrk-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-default.svg)
 *
 * ![ssyrk-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/ssyrk.js) — WebGPU benchmark script
 * - [ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/ssyrk.c) — CUDA / cuBLAS reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `trans = "no-transpose"`. `trans = "transpose"` reads A with a cross-thread `lda`-strided mirror pattern instead of a coalesced one, and the gap grows with `n` — collapsed below by default, expand a `trans` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 256 | 0.1314 | 3.9903 | 0.0319 | 16.4498 | 24.3% |
 * | 512 | 0.4362 | 4.8079 | 0.1056 | 19.8504 | 24.2% |
 * | 1024 | 3.1405 | 2.6711 | 0.5904 | 14.2083 | 18.8% |
 * | 2048 | 18.6120 | 1.8028 | 3.8093 | 8.8086 | 20.5% |
 *
 * ![ssyrk-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-transno-transpose.svg)
 *
 * ![ssyrk-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 256 | 0.0655 | 8.0000 | 0.0352 | 14.8945 | 53.7% |
 * | 512 | 0.2376 | 8.8270 | 0.1088 | 19.2668 | 45.8% |
 * | 1024 | 1.7384 | 4.8254 | 0.6328 | 13.2557 | 36.4% |
 * | 2048 | 12.2284 | 2.7440 | 3.5128 | 9.5521 | 28.7% |
 *
 * ![ssyrk-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-transtranspose.svg)
 *
 * ![ssyrk-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/trans.ssyrk.js) — WebGPU trans-sweep benchmark script
 * - [trans.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/trans.ssyrk.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride only matters for `trans = "transpose"` here (swept at both `trans` values below so that's visible in the data, not just claimed). Collapsed below by default — expand a `trans` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4310 | 4.8661 | 0.1043 | 20.1000 | 24.2% |
 * | 1024 | 2.6357 | 3.1827 | 0.5851 | 14.3377 | 22.2% |
 * | 2048 | 18.6121 | 1.8028 | 3.8093 | 8.8086 | 20.5% |
 *
 * ![ssyrk-lda-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad0.svg)
 *
 * ![ssyrk-lda-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2886 | 7.2668 | 0.0962 | 21.7945 | 33.3% |
 * | 1024 | 1.9596 | 4.2808 | 0.5386 | 15.5741 | 27.5% |
 * | 2048 | 17.7926 | 1.8859 | 3.4740 | 9.6586 | 19.5% |
 *
 * ![ssyrk-lda-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad1.svg)
 *
 * ![ssyrk-lda-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2782 | 7.5394 | 0.0956 | 21.9294 | 34.4% |
 * | 1024 | 1.7039 | 4.9231 | 0.4667 | 17.9748 | 27.4% |
 * | 2048 | 14.0073 | 2.3955 | 3.2842 | 10.2170 | 23.4% |
 *
 * ![ssyrk-lda-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad8.svg)
 *
 * ![ssyrk-lda-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.3257 | 6.4396 | 0.0900 | 23.2893 | 27.7% |
 * | 1024 | 1.8938 | 4.4296 | 0.4670 | 17.9618 | 24.7% |
 * | 2048 | 15.3650 | 2.1838 | 3.2810 | 10.2270 | 21.4% |
 *
 * ![ssyrk-lda-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad16.svg)
 *
 * ![ssyrk-lda-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4342 | 4.8302 | 0.0898 | 23.3557 | 20.7% |
 * | 1024 | 2.4775 | 3.3860 | 0.4678 | 17.9323 | 18.9% |
 * | 2048 | 19.1753 | 1.7499 | 3.2792 | 10.2324 | 17.1% |
 *
 * ![ssyrk-lda-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad32.svg)
 *
 * ![ssyrk-lda-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.4301 | 4.8762 | 0.0900 | 23.3058 | 20.9% |
 * | 1024 | 2.5067 | 3.3464 | 0.4688 | 17.8932 | 18.7% |
 * | 2048 | 19.4791 | 1.7226 | 3.2814 | 10.2258 | 16.8% |
 *
 * ![ssyrk-lda-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-no-transpose-pad64.svg)
 *
 * ![ssyrk-lda-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-no-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2387 | 8.7868 | 0.0938 | 22.3558 | 39.3% |
 * | 1024 | 1.7433 | 4.8120 | 0.5100 | 16.4498 | 29.3% |
 * | 2048 | 12.2074 | 2.7487 | 3.5106 | 9.5580 | 28.8% |
 *
 * ![ssyrk-lda-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad0.svg)
 *
 * ![ssyrk-lda-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2361 | 8.8814 | 0.0983 | 21.3333 | 41.6% |
 * | 1024 | 1.7316 | 4.8444 | 0.5200 | 16.1329 | 30.0% |
 * | 2048 | 12.3521 | 2.7165 | 3.6293 | 9.2454 | 29.4% |
 *
 * ![ssyrk-lda-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad1.svg)
 *
 * ![ssyrk-lda-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2356 | 8.9025 | 0.0972 | 21.5792 | 41.3% |
 * | 1024 | 1.6900 | 4.9635 | 0.4908 | 17.0906 | 29.0% |
 * | 2048 | 12.0177 | 2.7921 | 3.5547 | 9.4394 | 29.6% |
 *
 * ![ssyrk-lda-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad8.svg)
 *
 * ![ssyrk-lda-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2365 | 8.8688 | 0.0963 | 21.7872 | 40.7% |
 * | 1024 | 1.7144 | 4.8932 | 0.4950 | 16.9470 | 28.9% |
 * | 2048 | 12.1617 | 2.7590 | 3.5237 | 9.5224 | 29.0% |
 *
 * ![ssyrk-lda-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad16.svg)
 *
 * ![ssyrk-lda-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2396 | 8.7521 | 0.0986 | 21.2607 | 41.2% |
 * | 1024 | 1.7491 | 4.7961 | 0.5070 | 16.5464 | 29.0% |
 * | 2048 | 12.3984 | 2.7063 | 3.5989 | 9.3236 | 29.0% |
 *
 * ![ssyrk-lda-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad32.svg)
 *
 * ![ssyrk-lda-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.2396 | 8.7521 | 0.0966 | 21.7007 | 40.3% |
 * | 1024 | 1.7531 | 4.7850 | 0.5157 | 16.2661 | 29.4% |
 * | 2048 | 12.3957 | 2.7069 | 3.5958 | 9.3316 | 29.0% |
 *
 * ![ssyrk-lda-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/gbps-lda-transpose-pad64.svg)
 *
 * ![ssyrk-lda-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyrk/ms-lda-transpose-pad64.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyrk.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/wgblas/lda.ssyrk.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyrk.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyrk/cuda/lda.ssyrk.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyrk
 */
