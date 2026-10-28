/**
 * Benchmark results for ssyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7254 | 0.0036 | 1.2389 | 58.6% |
 * | 64 | 0.0062 | 2.7772 | 0.0037 | 4.6609 | 59.6% |
 * | 128 | 0.0065 | 10.3251 | 0.0037 | 18.0690 | 57.1% |
 * | 256 | 0.0076 | 35.1186 | 0.0041 | 64.2481 | 54.7% |
 * | 512 | 0.0097 | 109.1391 | 0.0067 | 156.9524 | 69.5% |
 * | 1024 | 0.0328 | 128.3750 | 0.0327 | 128.7522 | 99.7% |
 * | 1280 | 0.0516 | 127.2660 | 0.0663 | 99.0973 | 128.4% |
 * | 2048 | 0.1106 | 151.9259 | 0.1188 | 141.4483 | 107.4% |
 * | 4096 | 0.4178 | 160.7574 | 0.4629 | 145.0773 | 110.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssyr2-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-default.svg)
 *
 * ![ssyr2-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-default.svg)
 *
 * ## See also
 *
 * - [ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/ssyr2.js) — WebGPU benchmark script
 * - [ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/ssyr2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0107 | 0.4185 | 0.0035 | 1.2727 | 32.9% |
 * | 64 | 0.0109 | 1.5788 | 0.0036 | 4.7018 | 33.6% |
 * | 128 | 0.0111 | 6.0317 | 0.0038 | 17.7627 | 34.0% |
 * | 256 | 0.0123 | 21.5833 | 0.0042 | 62.7879 | 34.4% |
 * | 512 | 0.0146 | 72.4396 | 0.0067 | 156.5796 | 46.3% |
 * | 1024 | 0.0410 | 102.7000 | 0.0329 | 127.7512 | 80.4% |
 * | 1280 | 0.0572 | 114.8741 | 0.0665 | 98.7160 | 116.4% |
 * | 2048 | 0.1230 | 136.5555 | 0.1211 | 138.7569 | 98.4% |
 * | 4096 | 0.4464 | 150.4328 | 0.4714 | 142.4626 | 105.6% |
 *
 * ![ssyr2-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride4.svg)
 *
 * ![ssyr2-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0106 | 0.4230 | 0.0035 | 1.2670 | 33.4% |
 * | 64 | 0.0109 | 1.5788 | 0.0037 | 4.6609 | 33.9% |
 * | 128 | 0.0109 | 6.1287 | 0.0037 | 18.0690 | 33.9% |
 * | 256 | 0.0123 | 21.6115 | 0.0042 | 62.7879 | 34.4% |
 * | 512 | 0.0146 | 72.4396 | 0.0068 | 154.0187 | 47.0% |
 * | 1024 | 0.0410 | 102.7000 | 0.0330 | 127.4416 | 80.6% |
 * | 1280 | 0.0570 | 115.2935 | 0.0667 | 98.4556 | 117.1% |
 * | 2048 | 0.1234 | 136.1483 | 0.1216 | 138.1908 | 98.5% |
 * | 4096 | 0.4465 | 150.4220 | 0.4733 | 141.8991 | 106.0% |
 *
 * ![ssyr2-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride5.svg)
 *
 * ![ssyr2-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0108 | 0.4154 | 0.0036 | 1.2556 | 33.1% |
 * | 64 | 0.0108 | 1.5811 | 0.0037 | 4.5812 | 34.5% |
 * | 128 | 0.0113 | 5.9461 | 0.0038 | 17.7627 | 33.5% |
 * | 256 | 0.0123 | 21.6397 | 0.0045 | 58.7801 | 36.8% |
 * | 512 | 0.0151 | 70.0531 | 0.0079 | 132.9032 | 52.7% |
 * | 1024 | 0.0416 | 101.0035 | 0.0348 | 120.8235 | 83.6% |
 * | 1280 | 0.0575 | 114.2348 | 0.0691 | 95.0811 | 120.1% |
 * | 2048 | 0.1252 | 134.2339 | 0.1317 | 127.5956 | 105.2% |
 * | 4096 | 0.4485 | 149.7352 | 0.6040 | 111.1829 | 134.7% |
 *
 * ![ssyr2-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride32.svg)
 *
 * ![ssyr2-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0108 | 0.4154 | 0.0035 | 1.2785 | 32.5% |
 * | 64 | 0.0109 | 1.5765 | 0.0037 | 4.6609 | 33.8% |
 * | 128 | 0.0111 | 6.0317 | 0.0038 | 17.7627 | 34.0% |
 * | 256 | 0.0123 | 21.5833 | 0.0043 | 62.3158 | 34.6% |
 * | 512 | 0.0146 | 72.3600 | 0.0073 | 144.5614 | 50.1% |
 * | 1024 | 0.0416 | 101.1978 | 0.0341 | 123.2015 | 82.1% |
 * | 1280 | 0.0578 | 113.5712 | 0.0685 | 95.8804 | 118.5% |
 * | 2048 | 0.1250 | 134.3885 | 0.1300 | 129.2923 | 103.9% |
 * | 4096 | 0.4485 | 149.7352 | 0.6015 | 111.6591 | 134.1% |
 *
 * ![ssyr2-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride33.svg)
 *
 * ![ssyr2-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0109 | 0.4124 | 0.0037 | 1.1966 | 34.5% |
 * | 64 | 0.0116 | 1.4848 | 0.0038 | 4.5617 | 32.5% |
 * | 128 | 0.0110 | 6.0754 | 0.0039 | 17.1803 | 35.4% |
 * | 256 | 0.0123 | 21.5833 | 0.0043 | 62.3158 | 34.6% |
 * | 512 | 0.0155 | 68.0992 | 0.0073 | 144.8791 | 47.0% |
 * | 1024 | 0.0428 | 98.2481 | 0.0347 | 121.3813 | 80.9% |
 * | 1280 | 0.0588 | 111.6866 | 0.0699 | 94.0357 | 118.8% |
 * | 2048 | 0.1255 | 133.8575 | 0.1355 | 124.0387 | 107.9% |
 * | 4096 | 0.4526 | 148.3801 | 0.6697 | 100.2766 | 148.0% |
 *
 * ![ssyr2-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride255.svg)
 *
 * ![ssyr2-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0110 | 0.4076 | 0.0037 | 1.2121 | 33.6% |
 * | 64 | 0.0110 | 1.5604 | 0.0037 | 4.6812 | 33.3% |
 * | 128 | 0.0110 | 6.1019 | 0.0037 | 18.0690 | 33.8% |
 * | 256 | 0.0125 | 21.1429 | 0.0045 | 59.2000 | 35.7% |
 * | 512 | 0.0153 | 68.8100 | 0.0079 | 132.9032 | 51.8% |
 * | 1024 | 0.0430 | 97.8095 | 0.0348 | 120.8235 | 81.0% |
 * | 1280 | 0.0583 | 112.6674 | 0.0696 | 94.3382 | 119.4% |
 * | 2048 | 0.1264 | 132.9592 | 0.1356 | 123.9070 | 107.3% |
 * | 4096 | 0.4519 | 148.6218 | 0.6369 | 105.4432 | 140.9% |
 *
 * ![ssyr2-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-stride256.svg)
 *
 * ![ssyr2-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/stride.ssyr2.js) — WebGPU stride-sweep benchmark script
 * - [stride.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/stride.ssyr2.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2670 | 57.6% |
 * | 64 | 0.0062 | 2.7629 | 0.0037 | 4.6609 | 59.3% |
 * | 128 | 0.0064 | 10.4800 | 0.0037 | 17.9914 | 58.3% |
 * | 256 | 0.0078 | 33.9672 | 0.0042 | 63.7538 | 53.3% |
 * | 512 | 0.0102 | 103.0000 | 0.0067 | 156.9524 | 65.6% |
 * | 1024 | 0.0348 | 120.8235 | 0.0325 | 129.2586 | 93.5% |
 * | 1280 | 0.0519 | 126.6770 | 0.0664 | 98.9301 | 128.0% |
 * | 2048 | 0.1188 | 141.4292 | 0.1188 | 141.4483 | 100.0% |
 * | 4096 | 0.4407 | 152.3880 | 0.4629 | 145.0823 | 105.0% |
 *
 * ![ssyr2-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-uplolower.svg)
 *
 * ![ssyr2-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0037 | 1.2069 | 60.4% |
 * | 64 | 0.0063 | 2.7347 | 0.0037 | 4.6609 | 58.7% |
 * | 128 | 0.0066 | 10.2244 | 0.0037 | 18.1472 | 56.3% |
 * | 256 | 0.0073 | 36.3509 | 0.0041 | 64.2481 | 56.6% |
 * | 512 | 0.0097 | 109.1391 | 0.0069 | 152.5926 | 71.5% |
 * | 1024 | 0.0328 | 128.3750 | 0.0331 | 127.0106 | 101.1% |
 * | 1280 | 0.0512 | 128.2199 | 0.0676 | 97.1050 | 132.0% |
 * | 2048 | 0.1106 | 151.9259 | 0.1187 | 141.6008 | 107.3% |
 * | 4096 | 0.4175 | 160.8437 | 0.4585 | 146.4593 | 109.8% |
 *
 * ![ssyr2-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-uploupper.svg)
 *
 * ![ssyr2-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/uplo.ssyr2.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/uplo.ssyr2.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0062 | 0.7179 | 0.0035 | 1.2727 | 56.4% |
 * | 64 | 0.0062 | 2.7772 | 0.0036 | 4.7644 | 58.3% |
 * | 128 | 0.0065 | 10.3762 | 0.0037 | 18.1472 | 57.2% |
 * | 256 | 0.0079 | 33.6227 | 0.0042 | 63.7538 | 52.7% |
 * | 512 | 0.0102 | 103.3229 | 0.0068 | 156.2085 | 66.1% |
 * | 1024 | 0.0348 | 120.8235 | 0.0326 | 129.1317 | 93.6% |
 * | 1280 | 0.0519 | 126.5988 | 0.0666 | 98.6449 | 128.3% |
 * | 2048 | 0.1188 | 141.4292 | 0.1188 | 141.4483 | 100.0% |
 * | 4096 | 0.4410 | 152.2996 | 0.4630 | 145.0472 | 105.0% |
 *
 * ![ssyr2-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad0.svg)
 *
 * ![ssyr2-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7254 | 0.0035 | 1.2963 | 56.0% |
 * | 64 | 0.0064 | 2.7003 | 0.0036 | 4.7434 | 56.9% |
 * | 128 | 0.0068 | 9.8635 | 0.0037 | 18.0690 | 54.6% |
 * | 256 | 0.0082 | 32.5020 | 0.0042 | 63.7538 | 51.0% |
 * | 512 | 0.0102 | 103.0000 | 0.0070 | 149.8182 | 68.7% |
 * | 1024 | 0.0358 | 117.4238 | 0.0413 | 101.9434 | 115.2% |
 * | 1280 | 0.0538 | 122.0452 | 0.0794 | 82.7575 | 147.5% |
 * | 2048 | 0.1208 | 139.0508 | 0.1499 | 112.0837 | 124.1% |
 * | 4096 | 0.4452 | 150.8437 | 0.7630 | 88.0174 | 171.4% |
 *
 * ![ssyr2-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad1.svg)
 *
 * ![ssyr2-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.7143 | 0.0035 | 1.2727 | 56.1% |
 * | 64 | 0.0063 | 2.7071 | 0.0037 | 4.6609 | 58.1% |
 * | 128 | 0.0069 | 9.7488 | 0.0036 | 18.3860 | 53.0% |
 * | 256 | 0.0081 | 32.7589 | 0.0041 | 64.2481 | 51.0% |
 * | 512 | 0.0102 | 103.0000 | 0.0067 | 158.4615 | 65.0% |
 * | 1024 | 0.0363 | 115.8203 | 0.0436 | 96.4107 | 120.1% |
 * | 1280 | 0.0552 | 119.0029 | 0.0751 | 87.4276 | 136.1% |
 * | 2048 | 0.1170 | 143.5756 | 0.1777 | 94.5621 | 151.8% |
 * | 4096 | 0.4328 | 155.1595 | 0.7584 | 88.5578 | 175.2% |
 *
 * ![ssyr2-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad8.svg)
 *
 * ![ssyr2-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7179 | 0.0037 | 1.2069 | 59.5% |
 * | 64 | 0.0062 | 2.7487 | 0.0037 | 4.6609 | 59.0% |
 * | 128 | 0.0068 | 9.8404 | 0.0036 | 18.3860 | 53.5% |
 * | 256 | 0.0081 | 32.6299 | 0.0041 | 64.2481 | 50.8% |
 * | 512 | 0.0102 | 103.0000 | 0.0067 | 157.7034 | 65.3% |
 * | 1024 | 0.0356 | 118.1627 | 0.0450 | 93.4300 | 126.5% |
 * | 1280 | 0.0533 | 123.2173 | 0.0696 | 94.3382 | 130.6% |
 * | 2048 | 0.1208 | 139.0508 | 0.1475 | 113.9444 | 122.0% |
 * | 4096 | 0.4341 | 154.6906 | 0.7694 | 87.2817 | 177.2% |
 *
 * ![ssyr2-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad16.svg)
 *
 * ![ssyr2-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.7143 | 0.0036 | 1.2335 | 57.9% |
 * | 64 | 0.0063 | 2.7347 | 0.0036 | 4.7434 | 57.7% |
 * | 128 | 0.0067 | 10.0287 | 0.0036 | 18.5487 | 54.1% |
 * | 256 | 0.0079 | 33.6227 | 0.0041 | 64.2481 | 52.3% |
 * | 512 | 0.0102 | 103.0000 | 0.0067 | 156.5796 | 65.8% |
 * | 1024 | 0.0355 | 118.6426 | 0.0396 | 106.3130 | 111.6% |
 * | 1280 | 0.0518 | 126.8335 | 0.0602 | 109.1334 | 116.2% |
 * | 2048 | 0.1181 | 142.3109 | 0.1395 | 120.4809 | 118.1% |
 * | 4096 | 0.4588 | 146.3929 | 0.6074 | 110.5737 | 132.4% |
 *
 * ![ssyr2-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad32.svg)
 *
 * ![ssyr2-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7216 | 0.0035 | 1.2903 | 55.9% |
 * | 64 | 0.0064 | 2.6800 | 0.0037 | 4.6407 | 57.7% |
 * | 128 | 0.0068 | 9.8404 | 0.0037 | 18.2261 | 54.0% |
 * | 256 | 0.0081 | 32.5658 | 0.0041 | 64.0000 | 50.9% |
 * | 512 | 0.0102 | 103.0000 | 0.0068 | 156.2085 | 65.9% |
 * | 1024 | 0.0369 | 114.1111 | 0.0460 | 91.3523 | 124.9% |
 * | 1280 | 0.0532 | 123.3654 | 0.0686 | 95.7016 | 128.9% |
 * | 2048 | 0.1229 | 136.7333 | 0.1680 | 100.0011 | 136.7% |
 * | 4096 | 0.4460 | 150.5947 | 0.8034 | 83.5964 | 180.1% |
 *
 * ![ssyr2-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad48.svg)
 *
 * ![ssyr2-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7198 | 0.0037 | 1.2121 | 59.4% |
 * | 64 | 0.0063 | 2.7347 | 0.0036 | 4.7434 | 57.7% |
 * | 128 | 0.0067 | 10.0287 | 0.0036 | 18.7143 | 53.6% |
 * | 256 | 0.0081 | 32.8889 | 0.0041 | 64.2481 | 51.2% |
 * | 512 | 0.0102 | 103.0000 | 0.0067 | 158.4615 | 65.0% |
 * | 1024 | 0.0366 | 114.8589 | 0.0430 | 97.8095 | 117.4% |
 * | 1280 | 0.0517 | 126.9904 | 0.0572 | 114.9062 | 110.5% |
 * | 2048 | 0.1222 | 137.4672 | 0.1480 | 113.4888 | 121.1% |
 * | 4096 | 0.4548 | 147.6494 | 0.6021 | 111.5374 | 132.4% |
 *
 * ![ssyr2-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad64.svg)
 *
 * ![ssyr2-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.7143 | 0.0036 | 1.2500 | 57.1% |
 * | 64 | 0.0063 | 2.7347 | 0.0037 | 4.5812 | 59.7% |
 * | 128 | 0.0067 | 9.9810 | 0.0036 | 18.3860 | 54.3% |
 * | 256 | 0.0080 | 33.1520 | 0.0042 | 63.7538 | 52.0% |
 * | 512 | 0.0102 | 103.0000 | 0.0068 | 156.2085 | 65.9% |
 * | 1024 | 0.0355 | 118.3755 | 0.0421 | 99.8147 | 118.6% |
 * | 1280 | 0.0526 | 124.7903 | 0.0628 | 104.6546 | 119.2% |
 * | 2048 | 0.1229 | 136.7333 | 0.1943 | 86.4930 | 158.1% |
 * | 4096 | 0.4977 | 134.9378 | 0.6348 | 105.7860 | 127.6% |
 *
 * ![ssyr2-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-pad128.svg)
 *
 * ![ssyr2-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/lda.ssyr2.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/lda.ssyr2.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0063 | 0.7161 | 0.0035 | 1.2844 | 55.8% |
 * | 64 | 0.0062 | 2.7700 | 0.0038 | 4.5424 | 61.0% |
 * | 128 | 0.0064 | 10.5327 | 0.0037 | 18.2261 | 57.8% |
 * | 256 | 0.0080 | 32.9543 | 0.0042 | 63.7538 | 51.7% |
 * | 512 | 0.0102 | 103.0000 | 0.0066 | 159.2271 | 64.7% |
 * | 1024 | 0.0348 | 120.8235 | 0.0326 | 129.1317 | 93.6% |
 * | 1280 | 0.0516 | 127.1871 | 0.0664 | 99.0017 | 128.5% |
 * | 2048 | 0.1188 | 141.4483 | 0.1188 | 141.3911 | 100.0% |
 * | 4096 | 0.4404 | 152.4877 | 0.4632 | 144.9771 | 105.2% |
 *
 * ![ssyr2-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alphaneg3p75.svg)
 *
 * ![ssyr2-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0015 | 2.9787 | 24.5% |
 * | 64 | 0.0062 | 2.7772 | 0.0015 | 11.6522 | 23.8% |
 * | 128 | 0.0065 | 10.3251 | 0.0015 | 45.5652 | 22.7% |
 * | 256 | 0.0080 | 33.2184 | 0.0015 | 180.1739 | 18.4% |
 * | 512 | 0.0102 | 103.0000 | 0.0015 | 724.3956 | 14.2% |
 * | 1024 | 0.0348 | 120.8235 | 0.0015 | 2796.9363 | 4.3% |
 * | 1280 | 0.0520 | 126.4039 | 0.0013 | 4887.6191 | 2.6% |
 * | 2048 | 0.1188 | 141.4483 | 0.0015 | 11171.4033 | 1.3% |
 * | 4096 | 0.4411 | 152.2664 | 0.0016 | 43271.9180 | 0.4% |
 *
 * ![ssyr2-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha0.svg)
 *
 * ![ssyr2-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 0.7143 | 0.0036 | 1.2613 | 56.6% |
 * | 64 | 0.0063 | 2.7071 | 0.0036 | 4.7857 | 56.6% |
 * | 128 | 0.0066 | 10.1501 | 0.0037 | 18.2261 | 55.7% |
 * | 256 | 0.0080 | 33.1520 | 0.0042 | 63.7538 | 52.0% |
 * | 512 | 0.0102 | 103.6478 | 0.0066 | 159.2271 | 65.1% |
 * | 1024 | 0.0348 | 120.8235 | 0.0327 | 128.7522 | 93.8% |
 * | 1280 | 0.0518 | 126.7160 | 0.0663 | 99.0494 | 127.9% |
 * | 2048 | 0.1188 | 141.4292 | 0.1189 | 141.3531 | 100.1% |
 * | 4096 | 0.4443 | 151.1424 | 0.4631 | 145.0322 | 104.2% |
 *
 * ![ssyr2-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha1eneg38.svg)
 *
 * ![ssyr2-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2727 | 57.3% |
 * | 64 | 0.0062 | 2.7629 | 0.0038 | 4.5424 | 60.8% |
 * | 128 | 0.0065 | 10.2745 | 0.0037 | 18.3057 | 56.1% |
 * | 256 | 0.0079 | 33.6911 | 0.0041 | 64.2481 | 52.4% |
 * | 512 | 0.0101 | 103.9748 | 0.0066 | 160.0000 | 65.0% |
 * | 1024 | 0.0348 | 120.8235 | 0.0326 | 129.1317 | 93.6% |
 * | 1280 | 0.0519 | 126.6770 | 0.0663 | 99.1212 | 127.8% |
 * | 2048 | 0.1188 | 141.4483 | 0.1188 | 141.3721 | 100.1% |
 * | 4096 | 0.4414 | 152.1395 | 0.4631 | 145.0171 | 104.9% |
 *
 * ![ssyr2-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha1.svg)
 *
 * ![ssyr2-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.6195 | 0.0037 | 1.2069 | 51.3% |
 * | 64 | 0.0070 | 2.4644 | 0.0037 | 4.6009 | 53.6% |
 * | 128 | 0.0074 | 9.0933 | 0.0037 | 18.0690 | 50.3% |
 * | 256 | 0.0084 | 31.4535 | 0.0041 | 64.7500 | 48.6% |
 * | 512 | 0.0115 | 91.6829 | 0.0066 | 160.7805 | 57.0% |
 * | 1024 | 0.0369 | 114.1111 | 0.0326 | 128.8784 | 88.5% |
 * | 1280 | 0.0538 | 122.0452 | 0.0664 | 98.9063 | 123.4% |
 * | 2048 | 0.1241 | 135.3412 | 0.1188 | 141.4483 | 95.7% |
 * | 4096 | 0.4406 | 152.4102 | 0.4629 | 145.0923 | 105.0% |
 *
 * ![ssyr2-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-alpha2p5.svg)
 *
 * ![ssyr2-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/alpha.ssyr2.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/alpha.ssyr2.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0061 | 0.7292 |
 * | 64 | 0.0063 | 2.7347 |
 * | 128 | 0.0065 | 10.3251 |
 * | 256 | 0.0072 | 36.7539 |
 * | 512 | 0.0097 | 108.2430 |
 * | 1024 | 0.0328 | 128.3750 |
 * | 1280 | 0.0514 | 127.8207 |
 * | 2048 | 0.1106 | 151.9259 |
 * | 4096 | 0.4177 | 160.7944 |
 *
 * ![ssyr2-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-layoutcolumnmajor.svg)
 *
 * ![ssyr2-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0061 | 0.7292 |
 * | 64 | 0.0061 | 2.7917 |
 * | 128 | 0.0065 | 10.2745 |
 * | 256 | 0.0079 | 33.6227 |
 * | 512 | 0.0102 | 103.6478 |
 * | 1024 | 0.0348 | 120.8235 |
 * | 1280 | 0.0521 | 126.1321 |
 * | 2048 | 0.1188 | 141.4483 |
 * | 4096 | 0.4404 | 152.4877 |
 *
 * ![ssyr2-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/gbps-layoutrowmajor.svg)
 *
 * ![ssyr2-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssyr2/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/layout.ssyr2.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2
 */
