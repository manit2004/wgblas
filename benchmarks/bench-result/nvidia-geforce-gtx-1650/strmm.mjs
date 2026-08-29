/**
 * Benchmark results for strmm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0122 | 2.6947 | 0.0058 | 5.6110 | 48.0% |
 * | 64 | 0.0153 | 8.5690 | 0.0099 | 13.2129 | 64.9% |
 * | 128 | 0.0266 | 19.6923 | 0.0246 | 21.3333 | 92.3% |
 * | 256 | 0.1131 | 18.5470 | 0.0596 | 35.1777 | 52.7% |
 * | 512 | 0.3709 | 22.6152 | 0.2621 | 32.0078 | 70.7% |
 * | 1024 | 2.5675 | 13.0688 | 0.9635 | 34.8260 | 37.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strmm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-default.svg)
 *
 * ![strmm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-default.svg)
 *
 * ## See also
 *
 * - [strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/strmm.js) — WebGPU benchmark script
 * - [strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/strmm.c) — CUDA / cuBLAS reference script
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
 * | 64 | 0.0143 | 9.1429 | 0.0225 | 5.8141 | 157.3% |
 * | 128 | 0.0225 | 23.2727 | 0.0301 | 17.3928 | 133.8% |
 * | 256 | 0.0737 | 28.4444 | 0.0416 | 50.3736 | 56.5% |
 * | 512 | 0.2745 | 30.5600 | 0.1367 | 61.3705 | 49.8% |
 * | 1024 | 1.6397 | 20.4636 | 0.8469 | 39.6190 | 51.7% |
 * | 2048 | 12.0822 | 11.1088 | 9.7294 | 13.7951 | 80.5% |
 *
 * ![strmm-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-uplolower.svg)
 *
 * ![strmm-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0145 | 9.0121 | 0.0352 | 3.7253 | 241.9% |
 * | 128 | 0.0227 | 23.1249 | 0.0435 | 12.0515 | 191.9% |
 * | 256 | 0.0748 | 28.0188 | 0.0576 | 36.3887 | 77.0% |
 * | 512 | 0.2754 | 30.4553 | 0.1623 | 51.6744 | 58.9% |
 * | 1024 | 1.6424 | 20.4303 | 0.8069 | 41.5862 | 49.1% |
 * | 2048 | 12.0975 | 11.0947 | 8.7029 | 15.4222 | 71.9% |
 *
 * ![strmm-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-uploupper.svg)
 *
 * ![strmm-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/uplo.strmm.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/uplo.strmm.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 64 | 0.0143 | 9.1429 | 0.0225 | 5.8182 | 157.1% |
 * | 128 | 0.0225 | 23.2727 | 0.0303 | 17.3010 | 134.5% |
 * | 256 | 0.0737 | 28.4444 | 0.0420 | 49.9512 | 56.9% |
 * | 512 | 0.2742 | 30.5903 | 0.1380 | 60.7800 | 50.3% |
 * | 1024 | 1.6398 | 20.4620 | 0.7980 | 42.0456 | 48.7% |
 * | 2048 | 12.0717 | 11.1184 | 6.7062 | 20.0140 | 55.6% |
 *
 * ![strmm-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad0.svg)
 *
 * ![strmm-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0146 | 8.9726 | 0.0342 | 3.8316 | 234.2% |
 * | 128 | 0.0228 | 22.9629 | 0.0336 | 15.6112 | 147.1% |
 * | 256 | 0.0751 | 27.9412 | 0.0466 | 45.0110 | 62.1% |
 * | 512 | 0.2751 | 30.4925 | 0.1454 | 57.6901 | 52.9% |
 * | 1024 | 1.6450 | 20.3975 | 0.7961 | 42.1479 | 48.4% |
 * | 2048 | 12.1126 | 11.0808 | 6.5471 | 20.5004 | 54.1% |
 *
 * ![strmm-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad1.svg)
 *
 * ![strmm-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0147 | 8.9237 | 0.0264 | 4.9709 | 179.5% |
 * | 128 | 0.0228 | 22.9468 | 0.0348 | 15.0588 | 152.4% |
 * | 256 | 0.0751 | 27.9233 | 0.0488 | 43.0167 | 64.9% |
 * | 512 | 0.2749 | 30.5102 | 0.1460 | 57.4436 | 53.1% |
 * | 1024 | 1.6428 | 20.4253 | 0.8045 | 41.7062 | 49.0% |
 * | 2048 | 12.0734 | 11.1168 | 6.7253 | 19.9570 | 55.7% |
 *
 * ![strmm-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad8.svg)
 *
 * ![strmm-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0146 | 8.9530 | 0.0289 | 4.5360 | 197.4% |
 * | 128 | 0.0226 | 23.2397 | 0.0357 | 14.6810 | 158.3% |
 * | 256 | 0.0750 | 27.9710 | 0.0431 | 48.6172 | 57.5% |
 * | 512 | 0.2752 | 30.4836 | 0.1383 | 60.6604 | 50.3% |
 * | 1024 | 1.6397 | 20.4632 | 0.7971 | 42.0946 | 48.6% |
 * | 2048 | 12.0765 | 11.1139 | 6.1004 | 22.0015 | 50.5% |
 *
 * ![strmm-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad16.svg)
 *
 * ![strmm-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0151 | 8.6964 | 0.0264 | 4.9618 | 175.3% |
 * | 128 | 0.0229 | 22.8827 | 0.0348 | 15.0866 | 151.7% |
 * | 256 | 0.0754 | 27.8225 | 0.0494 | 42.4869 | 65.5% |
 * | 512 | 0.2761 | 30.3812 | 0.1473 | 56.9321 | 53.4% |
 * | 1024 | 1.6404 | 20.4544 | 0.7952 | 42.1988 | 48.5% |
 * | 2048 | 12.0770 | 11.1135 | 6.2433 | 21.4979 | 51.7% |
 *
 * ![strmm-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad32.svg)
 *
 * ![strmm-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0148 | 8.8754 | 0.0299 | 4.3831 | 202.5% |
 * | 128 | 0.0229 | 22.8508 | 0.0333 | 15.7236 | 145.3% |
 * | 256 | 0.0758 | 27.6757 | 0.0509 | 41.2176 | 67.1% |
 * | 512 | 0.2756 | 30.4323 | 0.1414 | 59.3153 | 51.3% |
 * | 1024 | 1.6444 | 20.4059 | 0.8091 | 41.4736 | 49.2% |
 * | 2048 | 12.0934 | 11.0984 | 6.7715 | 19.8209 | 56.0% |
 *
 * ![strmm-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad48.svg)
 *
 * ![strmm-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0150 | 8.7335 | 0.0253 | 5.1717 | 168.9% |
 * | 128 | 0.0228 | 22.9629 | 0.0336 | 15.6187 | 147.0% |
 * | 256 | 0.0758 | 27.6757 | 0.0471 | 44.5217 | 62.2% |
 * | 512 | 0.2749 | 30.5138 | 0.1452 | 57.7728 | 52.8% |
 * | 1024 | 1.6406 | 20.4526 | 0.7884 | 42.5576 | 48.1% |
 * | 2048 | 12.0863 | 11.1050 | 8.1465 | 16.4755 | 67.4% |
 *
 * ![strmm-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad64.svg)
 *
 * ![strmm-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0156 | 8.3934 | 0.0264 | 4.9648 | 169.1% |
 * | 128 | 0.0229 | 22.8667 | 0.0348 | 15.0588 | 151.8% |
 * | 256 | 0.0758 | 27.6757 | 0.0492 | 42.5835 | 65.0% |
 * | 512 | 0.2745 | 30.5618 | 0.1486 | 56.4418 | 54.1% |
 * | 1024 | 1.6425 | 20.4291 | 0.8168 | 41.0804 | 49.7% |
 * | 2048 | 12.0958 | 11.0962 | 9.1959 | 14.5953 | 76.0% |
 *
 * ![strmm-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-pad128.svg)
 *
 * ![strmm-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/lda.strmm.js) — WebGPU lda-sweep benchmark script
 * - [lda.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/lda.strmm.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * ## ldb sweep
 *
 * Padding on `B`, the operand the gemm kernels stream along their inner loop, so its stride is the one with most room to matter. Only for routines whose ldb sweep is a plain {pad, n} one — `sgemm`'s is a combined transB x pad grid and has its own section.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 9.1429 | 0.0226 | 5.7976 | 157.7% |
 * | 128 | 0.0225 | 23.2727 | 0.0304 | 17.2372 | 135.0% |
 * | 256 | 0.0737 | 28.4444 | 0.0418 | 50.1615 | 56.7% |
 * | 512 | 0.2745 | 30.5583 | 0.1370 | 61.2128 | 49.9% |
 * | 1024 | 1.6386 | 20.4772 | 0.7853 | 42.7275 | 47.9% |
 * | 2048 | 12.0627 | 11.1267 | 9.6465 | 13.9137 | 80.0% |
 *
 * ![strmm-ldbpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad0.svg)
 *
 * ![strmm-ldbpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0150 | 8.7242 | 0.0350 | 3.7475 | 232.8% |
 * | 128 | 0.0229 | 22.8827 | 0.0429 | 12.2269 | 187.2% |
 * | 256 | 0.0758 | 27.6757 | 0.0584 | 35.9200 | 77.0% |
 * | 512 | 0.2806 | 29.8978 | 0.1536 | 54.6020 | 54.8% |
 * | 1024 | 1.6630 | 20.1766 | 0.8121 | 41.3199 | 48.8% |
 * | 2048 | 12.2436 | 10.9623 | 8.6688 | 15.4829 | 70.8% |
 *
 * ![strmm-ldbpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad1.svg)
 *
 * ![strmm-ldbpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0148 | 8.8562 | 0.0355 | 3.6918 | 239.9% |
 * | 128 | 0.0229 | 22.8987 | 0.0429 | 12.2223 | 187.4% |
 * | 256 | 0.0760 | 27.5941 | 0.0595 | 35.2534 | 78.3% |
 * | 512 | 0.2806 | 29.8978 | 0.1516 | 55.3513 | 54.0% |
 * | 1024 | 1.6629 | 20.1787 | 0.8471 | 39.6100 | 50.9% |
 * | 2048 | 12.2044 | 10.9975 | 6.4637 | 20.7649 | 53.0% |
 *
 * ![strmm-ldbpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad8.svg)
 *
 * ![strmm-ldbpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0151 | 8.6872 | 0.0303 | 4.3321 | 200.5% |
 * | 128 | 0.0228 | 23.0436 | 0.0414 | 12.6762 | 181.8% |
 * | 256 | 0.0764 | 27.4554 | 0.0436 | 48.0645 | 57.1% |
 * | 512 | 0.2824 | 29.7098 | 0.1387 | 60.4645 | 49.1% |
 * | 1024 | 1.6732 | 20.0546 | 0.8018 | 41.8501 | 47.9% |
 * | 2048 | 12.2080 | 10.9942 | 9.1968 | 14.5939 | 75.3% |
 *
 * ![strmm-ldbpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad16.svg)
 *
 * ![strmm-ldbpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0147 | 8.9335 | 0.0362 | 3.6200 | 246.8% |
 * | 128 | 0.0227 | 23.1412 | 0.0450 | 11.6446 | 198.7% |
 * | 256 | 0.0758 | 27.6757 | 0.0595 | 35.2628 | 78.5% |
 * | 512 | 0.2771 | 30.2742 | 0.1556 | 53.8947 | 56.2% |
 * | 1024 | 1.6433 | 20.4184 | 0.8476 | 39.5868 | 51.6% |
 * | 2048 | 12.1244 | 11.0701 | 8.8505 | 15.1650 | 73.0% |
 *
 * ![strmm-ldbpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad32.svg)
 *
 * ![strmm-ldbpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0148 | 8.8754 | 0.0307 | 4.2689 | 207.9% |
 * | 128 | 0.0229 | 22.9307 | 0.0424 | 12.3793 | 185.2% |
 * | 256 | 0.0774 | 27.0866 | 0.0579 | 36.2478 | 74.7% |
 * | 512 | 0.2813 | 29.8179 | 0.1495 | 56.1096 | 53.1% |
 * | 1024 | 1.6666 | 20.1334 | 0.7984 | 42.0246 | 47.9% |
 * | 2048 | 12.2696 | 10.9391 | 10.1979 | 13.1613 | 83.1% |
 *
 * ![strmm-ldbpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad48.svg)
 *
 * ![strmm-ldbpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0149 | 8.8181 | 0.0348 | 3.7716 | 233.8% |
 * | 128 | 0.0225 | 23.2727 | 0.0430 | 12.1905 | 190.9% |
 * | 256 | 0.0761 | 27.5477 | 0.0594 | 35.3103 | 78.0% |
 * | 512 | 0.2770 | 30.2812 | 0.1516 | 55.3513 | 54.7% |
 * | 1024 | 1.6483 | 20.3565 | 0.8049 | 41.6863 | 48.8% |
 * | 2048 | 12.1160 | 11.0777 | 6.4452 | 20.8245 | 53.2% |
 *
 * ![strmm-ldbpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad64.svg)
 *
 * ![strmm-ldbpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0147 | 8.9237 | 0.0257 | 5.0977 | 175.1% |
 * | 128 | 0.0227 | 23.0761 | 0.0336 | 15.6187 | 147.7% |
 * | 256 | 0.0764 | 27.4554 | 0.0478 | 43.9102 | 62.5% |
 * | 512 | 0.2766 | 30.3232 | 0.1519 | 55.2405 | 54.9% |
 * | 1024 | 1.6505 | 20.3299 | 0.8200 | 40.9192 | 49.7% |
 * | 2048 | 12.1002 | 11.0922 | 9.7326 | 13.7905 | 80.4% |
 *
 * ![strmm-ldbpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-ldbpad128.svg)
 *
 * ![strmm-ldbpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-ldbpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/ldb.strmm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/ldb.strmm.c) — CUDA / cuBLAS ldb-sweep reference script
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
 * | 64 | 0.0154 | 8.5067 | 0.0244 | 5.3718 | 158.4% |
 * | 128 | 0.0229 | 22.8987 | 0.0363 | 14.4480 | 158.5% |
 * | 256 | 0.0750 | 27.9710 | 0.0484 | 43.3296 | 64.6% |
 * | 512 | 0.2744 | 30.5672 | 0.1404 | 59.7615 | 51.1% |
 * | 1024 | 1.6390 | 20.4722 | 0.7898 | 42.4860 | 48.2% |
 * | 2048 | 12.0609 | 11.1283 | 8.1471 | 16.4744 | 67.5% |
 *
 * ![strmm-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-alphaneg3p75.svg)
 *
 * ![strmm-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0185 | 7.0865 | 0.0227 | 5.7731 | 122.8% |
 * | 128 | 0.0288 | 18.2146 | 0.0303 | 17.3192 | 105.2% |
 * | 256 | 0.0942 | 22.2609 | 0.0419 | 50.0275 | 44.5% |
 * | 512 | 0.3400 | 24.6747 | 0.1372 | 61.1486 | 40.4% |
 * | 1024 | 2.0282 | 16.5436 | 0.7991 | 41.9909 | 39.4% |
 * | 2048 | 11.6809 | 11.4903 | 6.7401 | 19.9132 | 57.7% |
 *
 * ![strmm-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-alpha0.svg)
 *
 * ![strmm-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0146 | 8.9628 | 0.0296 | 4.4281 | 202.4% |
 * | 128 | 0.0227 | 23.0923 | 0.0321 | 16.3269 | 141.4% |
 * | 256 | 0.0747 | 28.0608 | 0.0432 | 48.5093 | 57.8% |
 * | 512 | 0.2748 | 30.5262 | 0.1388 | 60.4506 | 50.5% |
 * | 1024 | 1.6391 | 20.4708 | 0.7843 | 42.7833 | 47.8% |
 * | 2048 | 11.7153 | 11.4566 | 6.0629 | 22.1376 | 51.8% |
 *
 * ![strmm-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-alpha1eneg38.svg)
 *
 * ![strmm-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 9.1429 | 0.0293 | 4.4716 | 204.5% |
 * | 128 | 0.0225 | 23.2727 | 0.0320 | 16.3595 | 142.3% |
 * | 256 | 0.0737 | 28.4444 | 0.0448 | 46.8114 | 60.8% |
 * | 512 | 0.2744 | 30.5672 | 0.1407 | 59.6120 | 51.3% |
 * | 1024 | 1.6387 | 20.4764 | 0.7772 | 43.1735 | 47.4% |
 * | 2048 | 12.0531 | 11.1355 | 6.3479 | 21.1437 | 52.7% |
 *
 * ![strmm-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-alpha1.svg)
 *
 * ![strmm-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0152 | 8.6505 | 0.0258 | 5.0724 | 170.5% |
 * | 128 | 0.0229 | 22.8827 | 0.0383 | 13.6876 | 167.2% |
 * | 256 | 0.0751 | 27.9293 | 0.0503 | 41.7294 | 66.9% |
 * | 512 | 0.2765 | 30.3407 | 0.1409 | 59.5443 | 51.0% |
 * | 1024 | 1.6424 | 20.4301 | 0.8005 | 41.9179 | 48.7% |
 * | 2048 | 12.0530 | 11.1357 | 8.1660 | 16.4361 | 67.8% |
 *
 * ![strmm-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-alpha2p5.svg)
 *
 * ![strmm-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/alpha.strmm.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/alpha.strmm.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * ## diag sweep
 *
 * A unit diagonal lets the kernel skip the diagonal load — and for the triangular solve, the reciprocal as well — so any difference here is exactly that skipped work.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = non-unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 9.1429 | 0.0228 | 5.7609 | 158.7% |
 * | 128 | 0.0225 | 23.2727 | 0.0304 | 17.2645 | 134.8% |
 * | 256 | 0.0737 | 28.4444 | 0.0420 | 49.9703 | 56.9% |
 * | 512 | 0.2746 | 30.5529 | 0.1370 | 61.2200 | 49.9% |
 * | 1024 | 1.6399 | 20.4618 | 0.7780 | 43.1300 | 47.4% |
 * | 2048 | 12.0746 | 11.1157 | 6.5354 | 20.5370 | 54.1% |
 *
 * ![strmm-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-diagnonunit.svg)
 *
 * ![strmm-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0145 | 9.0519 | 0.0340 | 3.8532 | 234.9% |
 * | 128 | 0.0227 | 23.0598 | 0.0321 | 16.3431 | 141.1% |
 * | 256 | 0.0749 | 27.9949 | 0.0448 | 46.7613 | 59.9% |
 * | 512 | 0.2749 | 30.5191 | 0.1432 | 58.5797 | 52.1% |
 * | 1024 | 1.6432 | 20.4200 | 0.8127 | 41.2866 | 49.5% |
 * | 2048 | 12.2861 | 10.9244 | 6.7532 | 19.8748 | 55.0% |
 *
 * ![strmm-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-diagunit.svg)
 *
 * ![strmm-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/diag.strmm.js) — WebGPU diag-sweep benchmark script
 * - [diag.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/diag.strmm.c) — CUDA / cuBLAS diag-sweep reference script
 *
 * ## side sweep
 *
 * Whether `A` pre- or post-multiplies `B`. The two settings traverse the same data in different orders, so this is a scheduling and coalescing question rather than an arithmetic one — both do identical flops.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = left</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 9.1429 | 0.0312 | 4.2032 | 217.5% |
 * | 128 | 0.0225 | 23.2727 | 0.0351 | 14.9285 | 155.9% |
 * | 256 | 0.0737 | 28.4444 | 0.0424 | 49.4611 | 57.5% |
 * | 512 | 0.2744 | 30.5672 | 0.1372 | 61.1343 | 50.0% |
 * | 1024 | 1.6425 | 20.4293 | 0.8190 | 40.9696 | 49.9% |
 * | 2048 | 12.0917 | 11.0999 | 10.2391 | 13.1083 | 84.7% |
 *
 * ![strmm-sideleft GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-sideleft.svg)
 *
 * ![strmm-sideleft ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-sideleft.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = right</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0152 | 8.5960 | 0.0259 | 5.0630 | 169.8% |
 * | 128 | 0.0229 | 22.8508 | 0.0345 | 15.1915 | 150.4% |
 * | 256 | 0.0749 | 27.9949 | 0.0477 | 43.9987 | 63.6% |
 * | 512 | 0.2764 | 30.3513 | 0.1481 | 56.6430 | 53.6% |
 * | 1024 | 1.6418 | 20.4377 | 0.7811 | 42.9568 | 47.6% |
 * | 2048 | 12.0634 | 11.1261 | 6.2374 | 21.5182 | 51.7% |
 *
 * ![strmm-sideright GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-sideright.svg)
 *
 * ![strmm-sideright ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-sideright.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [side.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/side.strmm.js) — WebGPU side-sweep benchmark script
 * - [side.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/side.strmm.c) — CUDA / cuBLAS side-sweep reference script
 *
 * ## transA sweep
 *
 * `op(A)` decides whether the kernel walks `A` along rows or columns, which changes how its tile loads coalesce. Swept on its own here; `sgemm`'s combined transA x transB grid lives in its trans sweep.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 9.1429 | 0.0340 | 3.8514 | 237.4% |
 * | 128 | 0.0225 | 23.2727 | 0.0410 | 12.7750 | 182.2% |
 * | 256 | 0.0737 | 28.4444 | 0.0560 | 37.4706 | 75.9% |
 * | 512 | 0.2744 | 30.5672 | 0.1520 | 55.1940 | 55.4% |
 * | 1024 | 1.6459 | 20.3864 | 0.8416 | 39.8683 | 51.1% |
 * | 2048 | 12.0750 | 11.1154 | 7.1021 | 18.8984 | 58.8% |
 *
 * ![strmm-transAnotranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-transAnotranspose.svg)
 *
 * ![strmm-transAnotranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-transAnotranspose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0148 | 8.8467 | 0.0266 | 4.9231 | 179.7% |
 * | 128 | 0.0229 | 22.9147 | 0.0354 | 14.8070 | 154.8% |
 * | 256 | 0.0753 | 27.8403 | 0.0476 | 44.0578 | 63.2% |
 * | 512 | 0.2765 | 30.3407 | 0.1679 | 49.9607 | 60.7% |
 * | 1024 | 1.6479 | 20.3619 | 0.8972 | 37.3971 | 54.4% |
 * | 2048 | 12.1550 | 11.0422 | 10.8363 | 12.3860 | 89.2% |
 *
 * ![strmm-transAtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-transAtranspose.svg)
 *
 * ![strmm-transAtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-transAtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [transA.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/transA.strmm.js) — WebGPU transA-sweep benchmark script
 * - [transA.strmm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/cuda/transA.strmm.c) — CUDA / cuBLAS transA-sweep reference script
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
 * | 64 | 0.0164 | 8.0000 |
 * | 128 | 0.0267 | 19.6333 |
 * | 256 | 0.1147 | 18.2832 |
 * | 512 | 0.3714 | 22.5879 |
 * | 1024 | 2.5686 | 13.0634 |
 * | 2048 | 19.2702 | 6.9650 |
 *
 * ![strmm-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-layoutcolumnmajor.svg)
 *
 * ![strmm-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0143 | 9.1429 |
 * | 128 | 0.0225 | 23.2727 |
 * | 256 | 0.0737 | 28.4444 |
 * | 512 | 0.2744 | 30.5672 |
 * | 1024 | 1.6422 | 20.4323 |
 * | 2048 | 12.0583 | 11.1308 |
 *
 * ![strmm-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/gbps-layoutrowmajor.svg)
 *
 * ![strmm-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmm/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.strmm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmm/wgblas/layout.strmm.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmm
 */
