/**
 * Benchmark results for ssymm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 2.0052 | 0.0061 | 4.0315 | 49.7% |
 * | 64 | 0.0161 | 6.1013 | 0.0088 | 11.1709 | 54.6% |
 * | 128 | 0.0267 | 14.7427 | 0.0247 | 15.9171 | 92.6% |
 * | 256 | 0.1143 | 13.7604 | 0.1098 | 14.3238 | 96.1% |
 * | 512 | 0.3688 | 17.0615 | 0.2560 | 24.5775 | 69.4% |
 * | 1024 | 2.5631 | 9.8186 | 1.4685 | 17.1366 | 57.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![ssymm-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-default.svg)
 *
 * ![ssymm-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-default.svg)
 *
 * ## See also
 *
 * - [ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ssymm.js) — WebGPU benchmark script
 * - [ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ssymm.c) — CUDA / cuBLAS reference script
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
 * | 64 | 0.0143 | 6.8571 | 0.0084 | 11.6806 | 58.7% |
 * | 128 | 0.0226 | 17.4298 | 0.0244 | 16.0838 | 108.4% |
 * | 256 | 0.0751 | 20.9514 | 0.1100 | 14.2988 | 146.5% |
 * | 512 | 0.2717 | 23.1521 | 0.2562 | 24.5545 | 94.3% |
 * | 1024 | 1.6425 | 15.3220 | 1.5785 | 15.9429 | 96.1% |
 * | 2048 | 12.5519 | 8.0198 | 11.9725 | 8.4079 | 95.4% |
 *
 * ![ssymm-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-uplolower.svg)
 *
 * ![ssymm-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0157 | 6.2758 | 0.0096 | 10.2400 | 61.3% |
 * | 128 | 0.0238 | 16.5161 | 0.0272 | 14.4480 | 114.3% |
 * | 256 | 0.0758 | 20.7480 | 0.1311 | 12.0000 | 172.9% |
 * | 512 | 0.2744 | 22.9254 | 0.2679 | 23.4882 | 97.6% |
 * | 1024 | 1.6434 | 15.3136 | 1.6016 | 15.7125 | 97.5% |
 * | 2048 | 12.5348 | 8.0307 | 12.7796 | 7.8769 | 102.0% |
 *
 * ![ssymm-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-uploupper.svg)
 *
 * ![ssymm-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/uplo.ssymm.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/uplo.ssymm.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 64 | 0.0143 | 6.8571 | 0.0084 | 11.7701 | 58.3% |
 * | 128 | 0.0225 | 17.4545 | 0.0246 | 16.0000 | 109.1% |
 * | 256 | 0.0754 | 20.8713 | 0.1103 | 14.2635 | 146.3% |
 * | 512 | 0.2725 | 23.0910 | 0.2556 | 24.6129 | 93.8% |
 * | 1024 | 1.6439 | 15.3086 | 1.6394 | 15.3507 | 99.7% |
 * | 2048 | 12.5082 | 8.0478 | 12.7171 | 7.9156 | 101.7% |
 *
 * ![ssymm-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad0.svg)
 *
 * ![ssymm-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0154 | 6.3933 | 0.0090 | 10.8936 | 58.7% |
 * | 128 | 0.0230 | 17.1023 | 0.0246 | 16.0000 | 106.9% |
 * | 256 | 0.0763 | 20.6174 | 0.1086 | 14.4820 | 142.4% |
 * | 512 | 0.2764 | 22.7648 | 0.2696 | 23.3349 | 97.6% |
 * | 1024 | 1.6485 | 15.2655 | 1.6374 | 15.3698 | 99.3% |
 * | 2048 | 12.5227 | 8.0385 | 13.0636 | 7.7056 | 104.3% |
 *
 * ![ssymm-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad1.svg)
 *
 * ![ssymm-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0153 | 6.4335 | 0.0096 | 10.2915 | 62.5% |
 * | 128 | 0.0230 | 17.0667 | 0.0257 | 15.2931 | 111.6% |
 * | 256 | 0.0766 | 20.5356 | 0.1132 | 13.8906 | 147.8% |
 * | 512 | 0.2750 | 22.8787 | 0.2638 | 23.8486 | 95.9% |
 * | 1024 | 1.6470 | 15.2799 | 1.6088 | 15.6421 | 97.7% |
 * | 2048 | 12.5376 | 8.0289 | 12.9805 | 7.7550 | 103.5% |
 *
 * ![ssymm-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad8.svg)
 *
 * ![ssymm-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0153 | 6.4335 | 0.0102 | 9.6000 | 67.0% |
 * | 128 | 0.0231 | 16.9959 | 0.0266 | 14.7692 | 115.1% |
 * | 256 | 0.0760 | 20.7087 | 0.1126 | 13.9636 | 148.3% |
 * | 512 | 0.2763 | 22.7740 | 0.2621 | 24.0000 | 94.9% |
 * | 1024 | 1.6486 | 15.2646 | 1.6334 | 15.4069 | 99.1% |
 * | 2048 | 12.5176 | 8.0417 | 12.7692 | 7.8833 | 102.0% |
 *
 * ![ssymm-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad16.svg)
 *
 * ![ssymm-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0154 | 6.3801 | 0.0108 | 9.0753 | 70.3% |
 * | 128 | 0.0236 | 16.6279 | 0.0272 | 14.4650 | 115.0% |
 * | 256 | 0.0763 | 20.6045 | 0.1245 | 12.6306 | 163.1% |
 * | 512 | 0.2769 | 22.7227 | 0.2664 | 23.6194 | 96.2% |
 * | 1024 | 1.6536 | 15.2188 | 1.6036 | 15.6930 | 97.0% |
 * | 2048 | 12.5392 | 8.0279 | 12.2500 | 8.2174 | 97.7% |
 *
 * ![ssymm-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad32.svg)
 *
 * ![ssymm-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0156 | 6.3015 | 0.0098 | 10.0392 | 62.8% |
 * | 128 | 0.0229 | 17.1381 | 0.0269 | 14.6373 | 117.1% |
 * | 256 | 0.0766 | 20.5442 | 0.1165 | 13.4977 | 152.2% |
 * | 512 | 0.2776 | 22.6637 | 0.2621 | 24.0015 | 94.4% |
 * | 1024 | 1.6586 | 15.1726 | 1.6202 | 15.5328 | 97.7% |
 * | 2048 | 12.5384 | 8.0284 | 12.9824 | 7.7538 | 103.5% |
 *
 * ![ssymm-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad48.svg)
 *
 * ![ssymm-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0163 | 6.0176 | 0.0112 | 8.7771 | 68.6% |
 * | 128 | 0.0235 | 16.7526 | 0.0279 | 14.0756 | 119.0% |
 * | 256 | 0.0763 | 20.6131 | 0.1261 | 12.4704 | 165.3% |
 * | 512 | 0.2766 | 22.7463 | 0.2662 | 23.6308 | 96.3% |
 * | 1024 | 1.6631 | 15.1321 | 1.6296 | 15.4428 | 98.0% |
 * | 2048 | 12.5675 | 8.0098 | 13.0351 | 7.7225 | 103.7% |
 *
 * ![ssymm-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad64.svg)
 *
 * ![ssymm-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0157 | 6.2566 | 0.0098 | 10.0556 | 62.2% |
 * | 128 | 0.0234 | 16.8098 | 0.0276 | 14.2718 | 117.8% |
 * | 256 | 0.0760 | 20.6912 | 0.1184 | 13.2825 | 155.8% |
 * | 512 | 0.2819 | 22.3177 | 0.2646 | 23.7765 | 93.9% |
 * | 1024 | 1.7155 | 14.6695 | 1.6550 | 15.2060 | 96.5% |
 * | 2048 | 12.6136 | 7.9805 | 14.1691 | 7.1044 | 112.3% |
 *
 * ![ssymm-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-pad128.svg)
 *
 * ![ssymm-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/lda.ssymm.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/lda.ssymm.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 64 | 0.0143 | 6.8725 | 0.0092 | 10.6852 | 64.3% |
 * | 128 | 0.0226 | 17.4051 | 0.0249 | 15.8147 | 110.1% |
 * | 256 | 0.0754 | 20.8625 | 0.1100 | 14.2988 | 145.9% |
 * | 512 | 0.2718 | 23.1453 | 0.2560 | 24.5806 | 94.2% |
 * | 1024 | 1.6391 | 15.3531 | 1.6274 | 15.4642 | 99.3% |
 * | 2048 | 12.5088 | 8.0474 | 12.7018 | 7.9251 | 101.5% |
 *
 * ![ssymm-ldbpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad0.svg)
 *
 * ![ssymm-ldbpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0154 | 6.3801 | 0.0092 | 10.6298 | 60.0% |
 * | 128 | 0.0236 | 16.6391 | 0.0274 | 14.3468 | 116.0% |
 * | 256 | 0.0765 | 20.5571 | 0.1186 | 13.2646 | 155.0% |
 * | 512 | 0.2744 | 22.9254 | 0.2683 | 23.4476 | 97.8% |
 * | 1024 | 1.6466 | 15.2837 | 1.6555 | 15.2013 | 100.5% |
 * | 2048 | 12.6176 | 7.9780 | 12.4603 | 8.0787 | 98.8% |
 *
 * ![ssymm-ldbpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad1.svg)
 *
 * ![ssymm-ldbpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0159 | 6.1749 | 0.0095 | 10.3260 | 59.8% |
 * | 128 | 0.0236 | 16.6843 | 0.0279 | 14.1079 | 118.3% |
 * | 256 | 0.0760 | 20.6956 | 0.1261 | 12.4688 | 166.0% |
 * | 512 | 0.2746 | 22.9093 | 0.2670 | 23.5670 | 97.2% |
 * | 1024 | 1.6456 | 15.2932 | 1.6363 | 15.3801 | 99.4% |
 * | 2048 | 12.5878 | 7.9969 | 12.5526 | 8.0193 | 99.7% |
 *
 * ![ssymm-ldbpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad8.svg)
 *
 * ![ssymm-ldbpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0158 | 6.2186 | 0.0101 | 9.7215 | 64.0% |
 * | 128 | 0.0239 | 16.4718 | 0.0281 | 14.0114 | 117.6% |
 * | 256 | 0.0768 | 20.4672 | 0.1188 | 13.2414 | 154.6% |
 * | 512 | 0.2749 | 22.8893 | 0.2612 | 24.0823 | 95.0% |
 * | 1024 | 1.6489 | 15.2622 | 1.6049 | 15.6807 | 97.3% |
 * | 2048 | 12.5975 | 7.9907 | 12.6106 | 7.9824 | 100.1% |
 *
 * ![ssymm-ldbpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad16.svg)
 *
 * ![ssymm-ldbpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0158 | 6.2123 | 0.0104 | 9.4233 | 65.9% |
 * | 128 | 0.0237 | 16.5942 | 0.0273 | 14.3803 | 115.4% |
 * | 256 | 0.0763 | 20.6088 | 0.1188 | 13.2396 | 155.7% |
 * | 512 | 0.2759 | 22.8004 | 0.2653 | 23.7134 | 96.1% |
 * | 1024 | 1.6442 | 15.3059 | 1.6241 | 15.4954 | 98.8% |
 * | 2048 | 12.5746 | 8.0053 | 12.8757 | 7.8181 | 102.4% |
 *
 * ![ssymm-ldbpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad32.svg)
 *
 * ![ssymm-ldbpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0155 | 6.3537 | 0.0102 | 9.6000 | 66.2% |
 * | 128 | 0.0233 | 16.8444 | 0.0273 | 14.4225 | 116.8% |
 * | 256 | 0.0767 | 20.4971 | 0.1249 | 12.5902 | 162.8% |
 * | 512 | 0.2762 | 22.7819 | 0.2664 | 23.6152 | 96.5% |
 * | 1024 | 1.6470 | 15.2794 | 1.6268 | 15.4691 | 98.8% |
 * | 2048 | 12.5943 | 7.9928 | 11.9851 | 8.3991 | 95.2% |
 *
 * ![ssymm-ldbpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad48.svg)
 *
 * ![ssymm-ldbpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0159 | 6.1935 | 0.0100 | 9.8147 | 63.1% |
 * | 128 | 0.0235 | 16.7411 | 0.0273 | 14.4056 | 116.2% |
 * | 256 | 0.0776 | 20.2730 | 0.1213 | 12.9706 | 156.3% |
 * | 512 | 0.2754 | 22.8441 | 0.2707 | 23.2452 | 98.3% |
 * | 1024 | 1.6481 | 15.2699 | 1.6357 | 15.3852 | 99.3% |
 * | 2048 | 12.5635 | 8.0124 | 12.9581 | 7.7684 | 103.1% |
 *
 * ![ssymm-ldbpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad64.svg)
 *
 * ![ssymm-ldbpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0155 | 6.3340 | 0.0100 | 9.8462 | 64.3% |
 * | 128 | 0.0231 | 17.0194 | 0.0276 | 14.2470 | 119.5% |
 * | 256 | 0.0767 | 20.5056 | 0.1234 | 12.7436 | 160.9% |
 * | 512 | 0.2751 | 22.8707 | 0.2661 | 23.6450 | 96.7% |
 * | 1024 | 1.6469 | 15.2803 | 1.6281 | 15.4571 | 98.9% |
 * | 2048 | 12.5525 | 8.0194 | 12.5440 | 8.0248 | 99.9% |
 *
 * ![ssymm-ldbpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldbpad128.svg)
 *
 * ![ssymm-ldbpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldbpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ldb.ssymm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ldb.ssymm.c) — CUDA / cuBLAS ldb-sweep reference script
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
 * | 64 | 0.0160 | 6.1563 | 0.0103 | 9.5850 | 64.2% |
 * | 128 | 0.0234 | 16.7754 | 0.0268 | 14.6898 | 114.2% |
 * | 256 | 0.0761 | 20.6564 | 0.1222 | 12.8687 | 160.5% |
 * | 512 | 0.2744 | 22.9254 | 0.2643 | 23.8039 | 96.3% |
 * | 1024 | 1.6401 | 15.3443 | 1.6207 | 15.5274 | 98.8% |
 * | 2048 | 12.4716 | 8.0714 | 22.9183 | 4.3923 | 183.8% |
 *
 * ![ssymm-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alphaneg3p75.svg)
 *
 * ![ssymm-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0095 | 10.3087 | 66.5% |
 * | 128 | 0.0225 | 17.4545 | 0.0244 | 16.1048 | 108.4% |
 * | 256 | 0.0752 | 20.9024 | 0.1102 | 14.2718 | 146.5% |
 * | 512 | 0.2729 | 23.0558 | 0.2560 | 24.5760 | 93.8% |
 * | 1024 | 1.6421 | 15.3257 | 1.6208 | 15.5266 | 98.7% |
 * | 2048 | 12.4222 | 8.1035 | 22.8070 | 4.4137 | 183.6% |
 *
 * ![ssymm-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha0.svg)
 *
 * ![ssymm-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0154 | 6.3801 | 0.0097 | 10.1722 | 62.7% |
 * | 128 | 0.0236 | 16.6279 | 0.0278 | 14.1567 | 117.5% |
 * | 256 | 0.0758 | 20.7436 | 0.1169 | 13.4589 | 154.1% |
 * | 512 | 0.2744 | 22.9254 | 0.2651 | 23.7306 | 96.6% |
 * | 1024 | 1.6463 | 15.2860 | 1.6316 | 15.4245 | 99.1% |
 * | 2048 | 12.4856 | 8.0624 | 22.8555 | 4.4043 | 183.1% |
 *
 * ![ssymm-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha1eneg38.svg)
 *
 * ![ssymm-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0157 | 6.2694 | 0.0097 | 10.1219 | 61.9% |
 * | 128 | 0.0237 | 16.5830 | 0.0276 | 14.2718 | 116.2% |
 * | 256 | 0.0758 | 20.7568 | 0.1249 | 12.5902 | 164.9% |
 * | 512 | 0.2736 | 22.9911 | 0.2662 | 23.6379 | 97.3% |
 * | 1024 | 1.6414 | 15.3323 | 1.6440 | 15.3080 | 100.2% |
 * | 2048 | 12.4682 | 8.0736 | 21.7537 | 4.6274 | 174.5% |
 *
 * ![ssymm-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha1.svg)
 *
 * ![ssymm-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0159 | 6.1998 | 0.0099 | 9.9740 | 62.2% |
 * | 128 | 0.0232 | 16.9490 | 0.0275 | 14.3050 | 118.5% |
 * | 256 | 0.0760 | 20.6999 | 0.1256 | 12.5196 | 165.3% |
 * | 512 | 0.2748 | 22.8987 | 0.2655 | 23.7006 | 96.6% |
 * | 1024 | 1.6442 | 15.3056 | 1.6377 | 15.3665 | 99.6% |
 * | 2048 | 12.5040 | 8.0505 | 12.7273 | 7.9092 | 101.8% |
 *
 * ![ssymm-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-alpha2p5.svg)
 *
 * ![ssymm-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/alpha.ssymm.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/alpha.ssymm.c) — CUDA / cuBLAS alpha-sweep reference script
 *
 * ## beta sweep
 *
 * `beta` scales the existing `y`/`C` before accumulation. Reference BLAS is permitted to skip reading that operand entirely when `beta` is 0, so unlike `alpha` this sweep has a mechanism to be non-flat — a step at 0 means the shortcut is taken, and its size is what it saves.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0154 | 6.3933 | 0.0113 | 8.7025 | 73.5% |
 * | 128 | 0.0232 | 16.9841 | 0.0279 | 14.1079 | 120.4% |
 * | 256 | 0.0758 | 20.7568 | 0.1186 | 13.2610 | 156.5% |
 * | 512 | 0.2744 | 22.9307 | 0.2818 | 22.3241 | 102.7% |
 * | 1024 | 1.6446 | 15.3019 | 1.6769 | 15.0075 | 102.0% |
 * | 2048 | 12.5194 | 8.0406 | 12.8917 | 7.8084 | 103.0% |
 *
 * ![ssymm-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-betaneg3p75.svg)
 *
 * ![ssymm-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0087 | 11.2734 | 60.8% |
 * | 128 | 0.0225 | 17.4545 | 0.0259 | 15.1985 | 114.8% |
 * | 256 | 0.0753 | 20.8846 | 0.1160 | 13.5573 | 154.0% |
 * | 512 | 0.2724 | 23.0977 | 0.2706 | 23.2535 | 99.3% |
 * | 1024 | 1.6429 | 15.3180 | 1.6058 | 15.6721 | 97.7% |
 * | 2048 | 12.4859 | 8.0622 | 12.7371 | 7.9031 | 102.0% |
 *
 * ![ssymm-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-beta0.svg)
 *
 * ![ssymm-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0147 | 6.6710 | 0.0099 | 9.8937 | 67.4% |
 * | 128 | 0.0231 | 17.0194 | 0.0277 | 14.1976 | 119.9% |
 * | 256 | 0.0758 | 20.7568 | 0.1252 | 12.5644 | 165.2% |
 * | 512 | 0.2744 | 22.9254 | 0.2819 | 22.3152 | 102.7% |
 * | 1024 | 1.6420 | 15.3259 | 1.6823 | 14.9589 | 102.5% |
 * | 2048 | 12.4797 | 8.0662 | 12.9311 | 7.7846 | 103.6% |
 *
 * ![ssymm-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-beta1.svg)
 *
 * ![ssymm-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0159 | 6.1749 | 0.0110 | 8.9563 | 68.9% |
 * | 128 | 0.0232 | 16.9724 | 0.0277 | 14.1894 | 119.6% |
 * | 256 | 0.0759 | 20.7130 | 0.1261 | 12.4720 | 166.1% |
 * | 512 | 0.2744 | 22.9307 | 0.2827 | 22.2558 | 103.0% |
 * | 1024 | 1.6463 | 15.2864 | 1.6704 | 15.0657 | 101.5% |
 * | 2048 | 12.5206 | 8.0398 | 12.8932 | 7.8075 | 103.0% |
 *
 * ![ssymm-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-beta2p5.svg)
 *
 * ![ssymm-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/beta.ssymm.js) — WebGPU beta-sweep benchmark script
 * - [beta.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/beta.ssymm.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 64 | 0.0143 | 6.8571 | 0.0083 | 11.8382 | 57.9% |
 * | 128 | 0.0225 | 17.4545 | 0.0244 | 16.0838 | 108.5% |
 * | 256 | 0.0756 | 20.7919 | 0.1098 | 14.3196 | 145.2% |
 * | 512 | 0.2724 | 23.0977 | 0.2560 | 24.5775 | 94.0% |
 * | 1024 | 1.6423 | 15.3235 | 1.6360 | 15.3827 | 99.6% |
 * | 2048 | 12.5493 | 8.0214 | 13.4472 | 7.4858 | 107.2% |
 *
 * ![ssymm-sideleft GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-sideleft.svg)
 *
 * ![ssymm-sideleft ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-sideleft.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — side = right</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0152 | 6.4879 | 0.0101 | 9.7215 | 66.7% |
 * | 128 | 0.0232 | 16.9724 | 0.0261 | 15.0681 | 112.6% |
 * | 256 | 0.0758 | 20.7568 | 0.1188 | 13.2414 | 156.8% |
 * | 512 | 0.2749 | 22.8840 | 0.2236 | 28.1411 | 81.3% |
 * | 1024 | 1.6435 | 15.3127 | 1.4471 | 17.3907 | 88.1% |
 * | 2048 | 12.5436 | 8.0251 | 11.6010 | 8.6771 | 92.5% |
 *
 * ![ssymm-sideright GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-sideright.svg)
 *
 * ![ssymm-sideright ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-sideright.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [side.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/side.ssymm.js) — WebGPU side-sweep benchmark script
 * - [side.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/side.ssymm.c) — CUDA / cuBLAS side-sweep reference script
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
 * | 64 | 0.0167 | 5.9020 |
 * | 128 | 0.0271 | 14.5334 |
 * | 256 | 0.1149 | 13.6856 |
 * | 512 | 0.3686 | 17.0667 |
 * | 1024 | 2.5354 | 9.9257 |
 * | 2048 | 19.6242 | 5.1296 |
 *
 * ![ssymm-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-layoutcolumnmajor.svg)
 *
 * ![ssymm-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0143 | 6.8571 |
 * | 128 | 0.0226 | 17.4298 |
 * | 256 | 0.0754 | 20.8492 |
 * | 512 | 0.2719 | 23.1399 |
 * | 1024 | 1.6369 | 15.3743 |
 * | 2048 | 12.4883 | 8.0606 |
 *
 * ![ssymm-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-layoutrowmajor.svg)
 *
 * ![ssymm-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/layout.ssymm.js) — WebGPU layout-sweep benchmark script
 *
 * ## ldc sweep
 *
 * Padding on the output matrix. `C` is written rather than streamed, so this measures write coalescing rather than read bandwidth — the row byte-stride is `ldc*4`, and a pad that moves it off the 128-byte boundary is what would show up here.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0143 | 6.8571 | 0.0083 | 11.8382 | 57.9% |
 * | 128 | 0.0225 | 17.4545 | 0.0244 | 16.1154 | 108.3% |
 * | 256 | 0.0751 | 20.9425 | 0.1099 | 14.3175 | 146.3% |
 * | 512 | 0.2726 | 23.0828 | 0.2560 | 24.5745 | 93.9% |
 * | 1024 | 1.6409 | 15.3366 | 1.6377 | 15.3662 | 99.8% |
 * | 2048 | 12.5490 | 8.0216 | 12.7191 | 7.9144 | 101.4% |
 *
 * ![ssymm-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad0.svg)
 *
 * ![ssymm-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0156 | 6.2886 | 0.0099 | 9.9417 | 63.3% |
 * | 128 | 0.0229 | 17.1620 | 0.0273 | 14.3803 | 119.3% |
 * | 256 | 0.0762 | 20.6304 | 0.1175 | 13.3838 | 154.1% |
 * | 512 | 0.2806 | 22.4234 | 0.2765 | 22.7569 | 98.5% |
 * | 1024 | 1.6655 | 15.1105 | 1.6519 | 15.2347 | 99.2% |
 * | 2048 | 12.6152 | 7.9795 | 12.9211 | 7.7906 | 102.4% |
 *
 * ![ssymm-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad1.svg)
 *
 * ![ssymm-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0156 | 6.3145 | 0.0100 | 9.8147 | 64.3% |
 * | 128 | 0.0234 | 16.7984 | 0.0273 | 14.4056 | 116.6% |
 * | 256 | 0.0763 | 20.6088 | 0.1245 | 12.6322 | 163.1% |
 * | 512 | 0.2804 | 22.4413 | 0.2705 | 23.2590 | 96.5% |
 * | 1024 | 1.6576 | 15.1824 | 1.6350 | 15.3920 | 98.6% |
 * | 2048 | 12.6061 | 7.9853 | 12.8668 | 7.8235 | 102.1% |
 *
 * ![ssymm-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad8.svg)
 *
 * ![ssymm-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0162 | 6.0652 | 0.0100 | 9.8462 | 61.6% |
 * | 128 | 0.0231 | 17.0076 | 0.0266 | 14.7692 | 115.2% |
 * | 256 | 0.0763 | 20.6045 | 0.1214 | 12.9586 | 159.0% |
 * | 512 | 0.2806 | 22.4234 | 0.2718 | 23.1440 | 96.9% |
 * | 1024 | 1.6608 | 15.1533 | 1.6387 | 15.3576 | 98.7% |
 * | 2048 | 12.5848 | 7.9988 | 12.4178 | 8.1064 | 98.7% |
 *
 * ![ssymm-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad16.svg)
 *
 * ![ssymm-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0163 | 6.0472 | 0.0101 | 9.7524 | 62.0% |
 * | 128 | 0.0236 | 16.6391 | 0.0276 | 14.2635 | 116.7% |
 * | 256 | 0.0763 | 20.6218 | 0.1246 | 12.6241 | 163.4% |
 * | 512 | 0.2765 | 22.7556 | 0.2662 | 23.6308 | 96.3% |
 * | 1024 | 1.6470 | 15.2802 | 1.6149 | 15.5831 | 98.1% |
 * | 2048 | 12.5501 | 8.0209 | 12.7619 | 7.8878 | 101.7% |
 *
 * ![ssymm-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad32.svg)
 *
 * ![ssymm-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0160 | 6.1502 | 0.0100 | 9.7990 | 62.8% |
 * | 128 | 0.0235 | 16.7640 | 0.0266 | 14.7692 | 113.5% |
 * | 256 | 0.0766 | 20.5356 | 0.1221 | 12.8856 | 159.4% |
 * | 512 | 0.2806 | 22.4234 | 0.2662 | 23.6308 | 94.9% |
 * | 1024 | 1.6575 | 15.1834 | 1.6228 | 15.5075 | 97.9% |
 * | 2048 | 12.6084 | 7.9838 | 12.8311 | 7.8452 | 101.8% |
 *
 * ![ssymm-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad48.svg)
 *
 * ![ssymm-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0155 | 6.3340 | 0.0095 | 10.3959 | 60.9% |
 * | 128 | 0.0231 | 17.0548 | 0.0273 | 14.4141 | 118.3% |
 * | 256 | 0.0759 | 20.7174 | 0.1178 | 13.3565 | 155.1% |
 * | 512 | 0.2757 | 22.8176 | 0.2647 | 23.7650 | 96.0% |
 * | 1024 | 1.6468 | 15.2821 | 1.6326 | 15.4148 | 99.1% |
 * | 2048 | 12.5687 | 8.0090 | 12.7942 | 7.8679 | 101.8% |
 *
 * ![ssymm-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad64.svg)
 *
 * ![ssymm-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0157 | 6.2566 | 0.0101 | 9.7524 | 64.2% |
 * | 128 | 0.0233 | 16.8675 | 0.0274 | 14.3384 | 117.6% |
 * | 256 | 0.0764 | 20.5872 | 0.1184 | 13.2897 | 154.9% |
 * | 512 | 0.2758 | 22.8097 | 0.2661 | 23.6436 | 96.5% |
 * | 1024 | 1.6466 | 15.2836 | 1.6294 | 15.4448 | 99.0% |
 * | 2048 | 12.5526 | 8.0193 | 12.8576 | 7.8291 | 102.4% |
 *
 * ![ssymm-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/gbps-ldcpad128.svg)
 *
 * ![ssymm-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/ssymm/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.ssymm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/wgblas/ldc.ssymm.js) — WebGPU ldc-sweep benchmark script
 * - [ldc.ssymm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymm/cuda/ldc.ssymm.c) — CUDA / cuBLAS ldc-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymm
 */
