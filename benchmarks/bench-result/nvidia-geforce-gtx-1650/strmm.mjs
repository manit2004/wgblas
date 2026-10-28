/**
 * Benchmark results for strmm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0116 | 2.8326 | 0.0048 | 6.7591 | 41.9% |
 * | 64 | 0.0143 | 9.1429 | 0.0093 | 14.0515 | 65.1% |
 * | 128 | 0.0206 | 25.4608 | 0.0243 | 21.5721 | 118.0% |
 * | 256 | 0.0561 | 37.3957 | 0.0592 | 35.4249 | 105.6% |
 * | 512 | 0.1517 | 55.3046 | 0.2621 | 32.0000 | 172.8% |
 * | 1024 | 0.8272 | 40.5647 | 0.9642 | 34.7988 | 116.6% |
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
 * | 64 | 0.0139 | 9.4161 | 0.0225 | 5.8182 | 161.8% |
 * | 128 | 0.0202 | 25.9241 | 0.0300 | 17.4670 | 148.4% |
 * | 256 | 0.0531 | 39.5152 | 0.0417 | 50.2384 | 78.7% |
 * | 512 | 0.1391 | 60.3046 | 0.1362 | 61.6012 | 97.9% |
 * | 1024 | 0.7045 | 47.6257 | 0.7891 | 42.5213 | 112.0% |
 * | 2048 | 4.8662 | 27.5815 | 5.9397 | 22.5968 | 122.1% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0260 | 5.0319 | 181.7% |
 * | 128 | 0.0205 | 25.6000 | 0.0322 | 16.3025 | 157.0% |
 * | 256 | 0.0492 | 42.6667 | 0.0424 | 49.4798 | 86.2% |
 * | 512 | 0.1314 | 63.8364 | 0.1532 | 54.7502 | 116.6% |
 * | 1024 | 0.6554 | 51.2000 | 0.8091 | 41.4719 | 123.5% |
 * | 2048 | 4.7913 | 28.0125 | 5.9531 | 22.5457 | 124.2% |
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
 * | 64 | 0.0138 | 9.5035 | 0.0225 | 5.8182 | 163.3% |
 * | 128 | 0.0203 | 25.8423 | 0.0298 | 17.5700 | 147.1% |
 * | 256 | 0.0531 | 39.5152 | 0.0418 | 50.1999 | 78.7% |
 * | 512 | 0.1381 | 60.7237 | 0.1357 | 61.8191 | 98.2% |
 * | 1024 | 0.7051 | 47.5879 | 0.7797 | 43.0344 | 110.6% |
 * | 2048 | 4.8621 | 27.6046 | 5.9439 | 22.5808 | 122.2% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0257 | 5.1040 | 179.1% |
 * | 128 | 0.0205 | 25.6000 | 0.0321 | 16.3350 | 156.7% |
 * | 256 | 0.0534 | 39.2784 | 0.0433 | 48.4018 | 81.2% |
 * | 512 | 0.1393 | 60.2353 | 0.1406 | 59.6799 | 100.9% |
 * | 1024 | 0.7047 | 47.6149 | 0.8032 | 41.7776 | 114.0% |
 * | 2048 | 4.8403 | 27.7292 | 6.0310 | 22.2547 | 124.6% |
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
 * | 64 | 0.0141 | 9.2670 | 0.0262 | 5.0043 | 185.2% |
 * | 128 | 0.0204 | 25.6401 | 0.0323 | 16.2298 | 158.0% |
 * | 256 | 0.0532 | 39.3846 | 0.0438 | 47.8889 | 82.2% |
 * | 512 | 0.1393 | 60.2353 | 0.1404 | 59.7479 | 100.8% |
 * | 1024 | 0.7045 | 47.6279 | 0.8084 | 41.5048 | 114.8% |
 * | 2048 | 4.8626 | 27.6022 | 6.0048 | 22.3518 | 123.5% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0263 | 4.9830 | 183.5% |
 * | 128 | 0.0205 | 25.6000 | 0.0322 | 16.2620 | 157.4% |
 * | 256 | 0.0529 | 39.6108 | 0.0441 | 47.5243 | 83.3% |
 * | 512 | 0.1390 | 60.3671 | 0.1389 | 60.4088 | 99.9% |
 * | 1024 | 0.7046 | 47.6193 | 0.8105 | 41.4015 | 115.0% |
 * | 2048 | 4.8812 | 27.4966 | 5.9472 | 22.5681 | 121.8% |
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
 * | 64 | 0.0143 | 9.1839 | 0.0261 | 5.0196 | 183.0% |
 * | 128 | 0.0204 | 25.7004 | 0.0318 | 16.4912 | 155.8% |
 * | 256 | 0.0532 | 39.3846 | 0.0434 | 48.2948 | 81.6% |
 * | 512 | 0.1393 | 60.2353 | 0.1387 | 60.4924 | 99.6% |
 * | 1024 | 0.7049 | 47.6009 | 0.8112 | 41.3656 | 115.1% |
 * | 2048 | 4.8639 | 27.5946 | 5.9411 | 22.5913 | 122.1% |
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
 * | 64 | 0.0143 | 9.1736 | 0.0260 | 5.0474 | 181.7% |
 * | 128 | 0.0205 | 25.6000 | 0.0319 | 16.4251 | 155.9% |
 * | 256 | 0.0533 | 39.3728 | 0.0437 | 48.0117 | 82.0% |
 * | 512 | 0.1392 | 60.2768 | 0.1384 | 60.5973 | 99.5% |
 * | 1024 | 0.7046 | 47.6236 | 0.8024 | 41.8201 | 113.9% |
 * | 2048 | 4.8620 | 27.6052 | 5.9555 | 22.5368 | 122.5% |
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
 * | 64 | 0.0143 | 9.1633 | 0.0255 | 5.1393 | 178.3% |
 * | 128 | 0.0205 | 25.6200 | 0.0320 | 16.4086 | 156.1% |
 * | 256 | 0.0532 | 39.3846 | 0.0432 | 48.5272 | 81.2% |
 * | 512 | 0.1391 | 60.2907 | 0.1392 | 60.2838 | 100.0% |
 * | 1024 | 0.7068 | 47.4748 | 0.7992 | 41.9842 | 113.1% |
 * | 2048 | 4.8694 | 27.5634 | 5.9443 | 22.5792 | 122.1% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0262 | 4.9951 | 183.0% |
 * | 128 | 0.0205 | 25.6000 | 0.0319 | 16.4415 | 155.7% |
 * | 256 | 0.0532 | 39.3846 | 0.0432 | 48.5272 | 81.2% |
 * | 512 | 0.1391 | 60.2976 | 0.1389 | 60.3810 | 99.9% |
 * | 1024 | 0.7050 | 47.5955 | 0.8019 | 41.8451 | 113.7% |
 * | 2048 | 4.8677 | 27.5730 | 5.9498 | 22.5585 | 122.2% |
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
 * | 64 | 0.0139 | 9.4161 | 0.0225 | 5.8182 | 161.8% |
 * | 128 | 0.0201 | 26.0477 | 0.0300 | 17.5043 | 148.8% |
 * | 256 | 0.0530 | 39.5988 | 0.0417 | 50.2577 | 78.8% |
 * | 512 | 0.1390 | 60.3671 | 0.1369 | 61.2629 | 98.5% |
 * | 1024 | 0.7048 | 47.6084 | 0.7869 | 42.6432 | 111.6% |
 * | 2048 | 4.8620 | 27.6057 | 5.9259 | 22.6492 | 121.9% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0258 | 5.0724 | 180.2% |
 * | 128 | 0.0205 | 25.6000 | 0.0318 | 16.4746 | 155.4% |
 * | 256 | 0.0526 | 39.9002 | 0.0435 | 48.2592 | 82.7% |
 * | 512 | 0.1884 | 44.5217 | 0.1411 | 59.4701 | 74.9% |
 * | 1024 | 0.8952 | 37.4826 | 0.7996 | 41.9632 | 89.3% |
 * | 2048 | 5.8636 | 22.8899 | 6.0162 | 22.3094 | 102.6% |
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
 * | 64 | 0.0142 | 9.2460 | 0.0262 | 5.0043 | 184.8% |
 * | 128 | 0.0204 | 25.7408 | 0.0324 | 16.1737 | 159.2% |
 * | 256 | 0.0538 | 38.9631 | 0.0436 | 48.1175 | 81.0% |
 * | 512 | 0.1414 | 59.3422 | 0.1387 | 60.4785 | 98.1% |
 * | 1024 | 0.7178 | 46.7488 | 0.8112 | 41.3639 | 113.0% |
 * | 2048 | 4.9057 | 27.3594 | 5.9726 | 22.4723 | 121.7% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0259 | 5.0537 | 180.9% |
 * | 128 | 0.0203 | 25.8831 | 0.0324 | 16.1578 | 160.2% |
 * | 256 | 0.0547 | 38.3139 | 0.0438 | 47.8714 | 80.0% |
 * | 512 | 0.1422 | 59.0016 | 0.1375 | 61.0205 | 96.7% |
 * | 1024 | 0.7156 | 46.8910 | 0.7846 | 42.7685 | 109.6% |
 * | 2048 | 4.9194 | 27.2832 | 5.8399 | 22.9830 | 118.7% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0249 | 5.2682 | 173.5% |
 * | 128 | 0.0205 | 25.6000 | 0.0314 | 16.7098 | 153.2% |
 * | 256 | 0.0534 | 39.2902 | 0.0443 | 47.3697 | 82.9% |
 * | 512 | 0.1392 | 60.2630 | 0.1396 | 60.0765 | 100.3% |
 * | 1024 | 0.7066 | 47.4899 | 0.7941 | 42.2566 | 112.4% |
 * | 2048 | 4.8589 | 27.6232 | 5.9408 | 22.5926 | 122.3% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0253 | 5.1717 | 176.8% |
 * | 128 | 0.0205 | 25.6000 | 0.0315 | 16.6251 | 154.0% |
 * | 256 | 0.0550 | 38.1467 | 0.0436 | 48.0822 | 79.3% |
 * | 512 | 0.1429 | 58.6911 | 0.1379 | 60.8152 | 96.5% |
 * | 1024 | 0.7172 | 46.7864 | 0.7807 | 42.9788 | 108.9% |
 * | 2048 | 4.9254 | 27.2499 | 5.8505 | 22.9411 | 118.8% |
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
 * | 64 | 0.0142 | 9.2252 | 0.0264 | 4.9679 | 185.7% |
 * | 128 | 0.0203 | 25.8627 | 0.0323 | 16.2138 | 159.5% |
 * | 256 | 0.0535 | 39.2079 | 0.0440 | 47.6452 | 82.3% |
 * | 512 | 0.1392 | 60.2838 | 0.1393 | 60.2353 | 100.1% |
 * | 1024 | 0.7072 | 47.4447 | 0.8119 | 41.3289 | 114.8% |
 * | 2048 | 4.8334 | 27.7687 | 5.9560 | 22.5347 | 123.2% |
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
 * | 64 | 0.0141 | 9.2670 | 0.0259 | 5.0568 | 183.3% |
 * | 128 | 0.0204 | 25.7004 | 0.0320 | 16.3922 | 156.8% |
 * | 256 | 0.0535 | 39.2196 | 0.0433 | 48.4734 | 80.9% |
 * | 512 | 0.1392 | 60.2491 | 0.1401 | 59.8571 | 100.7% |
 * | 1024 | 0.7067 | 47.4791 | 0.8131 | 41.2695 | 115.0% |
 * | 2048 | 4.8732 | 27.5419 | 5.9500 | 22.5578 | 122.1% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0262 | 5.0012 | 182.8% |
 * | 128 | 0.0204 | 25.6601 | 0.0321 | 16.3269 | 157.2% |
 * | 256 | 0.0531 | 39.4795 | 0.0433 | 48.4555 | 81.5% |
 * | 512 | 0.1392 | 60.2838 | 0.1389 | 60.4088 | 99.8% |
 * | 1024 | 0.7066 | 47.4899 | 0.8037 | 41.7502 | 113.7% |
 * | 2048 | 4.8532 | 27.6556 | 5.9554 | 22.5372 | 122.7% |
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
 * | 64 | 0.0140 | 9.3730 | 0.0225 | 5.8223 | 161.0% |
 * | 128 | 0.0201 | 26.0892 | 0.0298 | 17.5700 | 148.5% |
 * | 256 | 0.0525 | 39.9123 | 0.0418 | 50.1231 | 79.6% |
 * | 512 | 0.1390 | 60.3601 | 0.1366 | 61.4280 | 98.3% |
 * | 1024 | 0.7052 | 47.5825 | 0.7805 | 42.9903 | 110.7% |
 * | 2048 | 4.6797 | 28.6810 | 5.9475 | 22.5669 | 127.1% |
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
 * | 64 | 0.0141 | 9.2670 | 0.0262 | 5.0073 | 185.1% |
 * | 128 | 0.0205 | 25.6000 | 0.0320 | 16.3676 | 156.4% |
 * | 256 | 0.0532 | 39.3846 | 0.0433 | 48.4375 | 81.3% |
 * | 512 | 0.1390 | 60.3462 | 0.1386 | 60.5343 | 99.7% |
 * | 1024 | 0.7057 | 47.5448 | 0.8096 | 41.4481 | 114.7% |
 * | 2048 | 4.7067 | 28.5163 | 5.9268 | 22.6460 | 125.9% |
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
 * | 64 | 0.0139 | 9.4053 | 0.0246 | 5.3333 | 176.4% |
 * | 128 | 0.0201 | 26.0477 | 0.0327 | 16.0549 | 162.2% |
 * | 256 | 0.0530 | 39.5391 | 0.0438 | 47.8889 | 82.6% |
 * | 512 | 0.1389 | 60.4018 | 0.1392 | 60.2561 | 100.2% |
 * | 1024 | 0.7064 | 47.4985 | 0.7848 | 42.7571 | 111.1% |
 * | 2048 | 4.8483 | 27.6837 | 5.9237 | 22.6576 | 122.2% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0259 | 5.0662 | 180.5% |
 * | 128 | 0.0205 | 25.6000 | 0.0322 | 16.3025 | 157.0% |
 * | 256 | 0.0532 | 39.3846 | 0.0433 | 48.4018 | 81.4% |
 * | 512 | 0.1393 | 60.2353 | 0.1381 | 60.7448 | 99.2% |
 * | 1024 | 0.7053 | 47.5760 | 0.7938 | 42.2694 | 112.6% |
 * | 2048 | 4.8624 | 27.6032 | 5.9257 | 22.6502 | 121.9% |
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
 * | 64 | 0.0139 | 9.4053 | 0.0225 | 5.8182 | 161.7% |
 * | 128 | 0.0200 | 26.1725 | 0.0300 | 17.4670 | 149.8% |
 * | 256 | 0.0529 | 39.6347 | 0.0417 | 50.2384 | 78.9% |
 * | 512 | 0.1388 | 60.4297 | 0.1367 | 61.3848 | 98.4% |
 * | 1024 | 0.7058 | 47.5383 | 0.7963 | 42.1369 | 112.8% |
 * | 2048 | 4.8459 | 27.6971 | 5.9240 | 22.6565 | 122.2% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0260 | 5.0474 | 181.1% |
 * | 128 | 0.0205 | 25.6000 | 0.0322 | 16.2701 | 157.3% |
 * | 256 | 0.0535 | 39.2314 | 0.0433 | 48.4734 | 80.9% |
 * | 512 | 0.1391 | 60.2907 | 0.1389 | 60.3879 | 99.8% |
 * | 1024 | 0.7047 | 47.6171 | 0.8009 | 41.8969 | 113.7% |
 * | 2048 | 5.0101 | 26.7892 | 5.9231 | 22.6602 | 118.2% |
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
 * | 64 | 0.0139 | 9.4269 | 0.0225 | 5.8182 | 162.0% |
 * | 128 | 0.0201 | 26.0892 | 0.0300 | 17.4949 | 149.1% |
 * | 256 | 0.0532 | 39.4083 | 0.0417 | 50.3349 | 78.3% |
 * | 512 | 0.1392 | 60.2699 | 0.1359 | 61.7172 | 97.7% |
 * | 1024 | 0.7065 | 47.4942 | 0.7846 | 42.7667 | 111.1% |
 * | 2048 | 4.8630 | 27.5997 | 5.9401 | 22.5953 | 122.1% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0150 | 8.7521 | 104.5% |
 * | 128 | 0.0205 | 25.6000 | 0.0234 | 22.4438 | 114.1% |
 * | 256 | 0.0512 | 40.9600 | 0.0354 | 59.3086 | 69.1% |
 * | 512 | 0.1598 | 52.4918 | 0.1344 | 62.3930 | 84.1% |
 * | 1024 | 0.7344 | 45.6906 | 0.7204 | 46.5754 | 98.1% |
 * | 2048 | 4.8809 | 27.4984 | 5.7203 | 23.4634 | 117.2% |
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
 * | 64 | 0.0138 | 9.4815 | 0.0225 | 5.8265 | 162.7% |
 * | 128 | 0.0202 | 26.0063 | 0.0299 | 17.5230 | 148.4% |
 * | 256 | 0.0529 | 39.6108 | 0.0418 | 50.1999 | 78.9% |
 * | 512 | 0.1389 | 60.4018 | 0.1367 | 61.3633 | 98.4% |
 * | 1024 | 0.7057 | 47.5448 | 0.8012 | 41.8777 | 113.5% |
 * | 2048 | 4.8637 | 27.5956 | 5.9214 | 22.6666 | 121.7% |
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
 * | 64 | 0.0143 | 9.1429 | 0.0247 | 5.3160 | 172.0% |
 * | 128 | 0.0205 | 25.6000 | 0.0328 | 16.0000 | 160.0% |
 * | 256 | 0.0492 | 42.6667 | 0.0436 | 48.1351 | 88.6% |
 * | 512 | 0.1328 | 63.1825 | 0.1601 | 52.3869 | 120.6% |
 * | 1024 | 0.6615 | 50.7220 | 0.8324 | 40.3097 | 125.8% |
 * | 2048 | 4.7953 | 27.9896 | 6.3169 | 21.2474 | 131.7% |
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
 * | 64 | 0.0143 | 9.1429 |
 * | 128 | 0.0209 | 25.0328 |
 * | 256 | 0.0572 | 36.6943 |
 * | 512 | 0.1517 | 55.3105 |
 * | 1024 | 0.8299 | 40.4340 |
 * | 2048 | 5.8188 | 23.0663 |
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
 * | 64 | 0.0142 | 9.2356 |
 * | 128 | 0.0200 | 26.1725 |
 * | 256 | 0.0531 | 39.5271 |
 * | 512 | 0.1389 | 60.4088 |
 * | 1024 | 0.7044 | 47.6344 |
 * | 2048 | 4.8620 | 27.6057 |
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
