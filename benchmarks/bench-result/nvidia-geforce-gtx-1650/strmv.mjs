/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0048 | 0.4933 | 58.6% |
 * | 64 | 0.0083 | 1.0698 | 0.0064 | 1.3731 | 77.9% |
 * | 128 | 0.0092 | 3.7138 | 0.0099 | 3.4323 | 108.2% |
 * | 256 | 0.0146 | 9.1679 | 0.0170 | 7.8570 | 116.7% |
 * | 512 | 0.0270 | 19.6251 | 0.0348 | 15.1989 | 129.1% |
 * | 1024 | 0.0772 | 27.3035 | 0.1718 | 12.2671 | 222.6% |
 * | 1280 | 0.1206 | 27.2715 | 0.0662 | 49.6738 | 54.9% |
 * | 2048 | 0.2635 | 31.9145 | 0.0996 | 84.4286 | 37.8% |
 * | 4096 | 1.4785 | 22.7227 | 0.2533 | 132.6497 | 17.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strmv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-default.svg)
 *
 * ![strmv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-default.svg)
 *
 * ## See also
 *
 * - [strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/strmv.js) — WebGPU benchmark script
 * - [strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/strmv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0068 | 0.3507 | 0.0049 | 0.4805 | 73.0% |
 * | 64 | 0.0068 | 1.2927 | 0.0066 | 1.3463 | 96.0% |
 * | 128 | 0.0070 | 4.8364 | 0.0099 | 3.4323 | 140.9% |
 * | 256 | 0.0086 | 15.5242 | 0.0169 | 7.8867 | 196.8% |
 * | 512 | 0.0114 | 46.4067 | 0.0343 | 15.4545 | 300.3% |
 * | 1024 | 0.0287 | 73.5000 | 0.1717 | 12.2763 | 598.7% |
 * | 1280 | 0.0389 | 84.4700 | 0.0672 | 48.9757 | 172.5% |
 * | 2048 | 0.0825 | 101.8938 | 0.1003 | 83.8226 | 121.6% |
 * | 4096 | 0.2771 | 121.2235 | 0.2540 | 132.2903 | 91.6% |
 *
 * ![strmv-transno-transpose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-transno-transpose.svg)
 *
 * ![strmv-transno-transpose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-transno-transpose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3458 | 0.0051 | 0.4625 | 74.8% |
 * | 64 | 0.0070 | 1.2632 | 0.0067 | 1.3206 | 95.7% |
 * | 128 | 0.0080 | 4.2560 | 0.0123 | 2.7708 | 153.6% |
 * | 256 | 0.0116 | 11.5359 | 0.0321 | 4.1614 | 277.2% |
 * | 512 | 0.0208 | 25.4523 | 0.1142 | 4.6342 | 549.2% |
 * | 1024 | 0.0608 | 34.6884 | 0.4506 | 4.6773 | 741.6% |
 * | 1280 | 0.0977 | 33.6608 | 0.2152 | 15.2828 | 220.3% |
 * | 2048 | 0.2134 | 39.4097 | 0.3280 | 25.6400 | 153.7% |
 * | 4096 | 1.1402 | 29.4634 | 1.0297 | 32.6270 | 90.3% |
 *
 * ![strmv-transtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-transtranspose.svg)
 *
 * ![strmv-transtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-transtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/trans.strmv.js) — WebGPU trans-sweep benchmark script
 * - [trans.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/trans.strmv.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride only matters for `trans = "transpose"` here (swept at both `trans` values below so that's visible in the data, not just claimed). Collapsed below by default — expand a `trans` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (8 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2879 | 0.0049 | 0.4868 | 59.1% |
 * | 64 | 0.0083 | 1.0615 | 0.0062 | 1.4154 | 75.0% |
 * | 128 | 0.0085 | 3.9925 | 0.0098 | 3.4658 | 115.2% |
 * | 256 | 0.0106 | 12.5783 | 0.0168 | 7.9695 | 157.8% |
 * | 512 | 0.0149 | 35.4641 | 0.0339 | 15.6002 | 227.3% |
 * | 1024 | 0.0338 | 62.3636 | 0.1707 | 12.3488 | 505.0% |
 * | 1280 | 0.0451 | 72.9337 | 0.0673 | 48.8709 | 149.2% |
 * | 2048 | 0.0942 | 89.2609 | 0.0988 | 85.0984 | 104.9% |
 * | 4096 | 0.3119 | 107.7107 | 0.2532 | 132.6916 | 81.2% |
 *
 * ![strmv-lda-no-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad0.svg)
 *
 * ![strmv-lda-no-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0049 | 0.4868 | 59.4% |
 * | 64 | 0.0082 | 1.0739 | 0.0064 | 1.3869 | 77.4% |
 * | 128 | 0.0087 | 3.9190 | 0.0100 | 3.4157 | 114.7% |
 * | 256 | 0.0107 | 12.4843 | 0.0167 | 7.9847 | 156.4% |
 * | 512 | 0.0147 | 35.9652 | 0.0339 | 15.6223 | 230.2% |
 * | 1024 | 0.0344 | 61.3184 | 0.1696 | 12.4233 | 493.6% |
 * | 1280 | 0.0455 | 72.2417 | 0.0676 | 48.6742 | 148.4% |
 * | 2048 | 0.0951 | 88.4348 | 0.1008 | 83.4235 | 106.0% |
 * | 4096 | 0.3174 | 105.8323 | 0.2598 | 129.3245 | 81.8% |
 *
 * ![strmv-lda-no-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad1.svg)
 *
 * ![strmv-lda-no-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0049 | 0.4868 | 59.4% |
 * | 64 | 0.0082 | 1.0760 | 0.0064 | 1.3766 | 78.2% |
 * | 128 | 0.0086 | 3.9407 | 0.0099 | 3.4323 | 114.8% |
 * | 256 | 0.0107 | 12.5405 | 0.0166 | 8.0462 | 155.9% |
 * | 512 | 0.0149 | 35.5403 | 0.0339 | 15.6223 | 227.5% |
 * | 1024 | 0.0345 | 61.1476 | 0.1700 | 12.3999 | 493.1% |
 * | 1280 | 0.0464 | 70.9455 | 0.0667 | 49.3046 | 143.9% |
 * | 2048 | 0.0922 | 91.1811 | 0.0961 | 87.4926 | 104.2% |
 * | 4096 | 0.3033 | 110.7794 | 0.2492 | 134.8303 | 82.2% |
 *
 * ![strmv-lda-no-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad8.svg)
 *
 * ![strmv-lda-no-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0045 | 0.5230 | 55.3% |
 * | 64 | 0.0082 | 1.0739 | 0.0061 | 1.4375 | 74.7% |
 * | 128 | 0.0087 | 3.9190 | 0.0094 | 3.6376 | 107.7% |
 * | 256 | 0.0107 | 12.5030 | 0.0158 | 8.4620 | 147.8% |
 * | 512 | 0.0149 | 35.6168 | 0.0314 | 16.8644 | 211.2% |
 * | 1024 | 0.0344 | 61.2614 | 0.1616 | 13.0369 | 469.9% |
 * | 1280 | 0.0460 | 71.5130 | 0.0632 | 52.0111 | 137.5% |
 * | 2048 | 0.0957 | 87.8289 | 0.0954 | 88.1677 | 99.6% |
 * | 4096 | 0.3023 | 111.1194 | 0.2489 | 134.9776 | 82.3% |
 *
 * ![strmv-lda-no-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad16.svg)
 *
 * ![strmv-lda-no-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0047 | 0.5034 | 57.4% |
 * | 64 | 0.0082 | 1.0781 | 0.0061 | 1.4375 | 75.0% |
 * | 128 | 0.0086 | 3.9407 | 0.0091 | 3.7268 | 105.7% |
 * | 256 | 0.0106 | 12.6163 | 0.0159 | 8.4194 | 149.8% |
 * | 512 | 0.0148 | 35.7322 | 0.0316 | 16.7619 | 213.2% |
 * | 1024 | 0.0344 | 61.2045 | 0.1618 | 13.0253 | 469.9% |
 * | 1280 | 0.0452 | 72.7016 | 0.0635 | 51.8145 | 140.3% |
 * | 2048 | 0.1162 | 72.3723 | 0.0953 | 88.1973 | 82.1% |
 * | 4096 | 0.3829 | 87.7293 | 0.2494 | 134.6833 | 65.1% |
 *
 * ![strmv-lda-no-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad32.svg)
 *
 * ![strmv-lda-no-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0118 | 0.2008 | 0.0046 | 0.5139 | 39.1% |
 * | 64 | 0.0118 | 0.7500 | 0.0061 | 1.4375 | 52.2% |
 * | 128 | 0.0123 | 2.7781 | 0.0092 | 3.6944 | 75.2% |
 * | 256 | 0.0162 | 8.2693 | 0.0160 | 8.3687 | 98.8% |
 * | 512 | 0.0205 | 25.8500 | 0.0315 | 16.8301 | 153.6% |
 * | 1024 | 0.0453 | 46.5249 | 0.1618 | 13.0253 | 357.2% |
 * | 1280 | 0.0601 | 54.7537 | 0.0635 | 51.8145 | 105.7% |
 * | 2048 | 0.1208 | 69.5932 | 0.0961 | 87.5363 | 79.5% |
 * | 4096 | 0.4020 | 83.5773 | 0.2505 | 134.1069 | 62.3% |
 *
 * ![strmv-lda-no-transpose-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad48.svg)
 *
 * ![strmv-lda-no-transpose-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 0.1932 | 0.0045 | 0.5230 | 36.9% |
 * | 64 | 0.0123 | 0.7188 | 0.0061 | 1.4450 | 49.7% |
 * | 128 | 0.0129 | 2.6402 | 0.0094 | 3.6068 | 73.2% |
 * | 256 | 0.0168 | 7.9392 | 0.0158 | 8.4792 | 93.6% |
 * | 512 | 0.0220 | 24.1166 | 0.0315 | 16.8045 | 143.5% |
 * | 1024 | 0.0493 | 42.7636 | 0.1618 | 13.0253 | 328.3% |
 * | 1280 | 0.0655 | 50.2198 | 0.0635 | 51.8145 | 96.9% |
 * | 2048 | 0.1340 | 62.7694 | 0.0956 | 87.9906 | 71.3% |
 * | 4096 | 0.3167 | 106.0782 | 0.2585 | 129.9648 | 81.6% |
 *
 * ![strmv-lda-no-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad64.svg)
 *
 * ![strmv-lda-no-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0048 | 0.4966 | 58.2% |
 * | 64 | 0.0082 | 1.0781 | 0.0063 | 1.3939 | 77.3% |
 * | 128 | 0.0085 | 4.0151 | 0.0099 | 3.4323 | 117.0% |
 * | 256 | 0.0103 | 12.9689 | 0.0166 | 8.0308 | 161.5% |
 * | 512 | 0.0144 | 36.8053 | 0.0335 | 15.8240 | 232.6% |
 * | 1024 | 0.0331 | 63.6290 | 0.1685 | 12.5035 | 508.9% |
 * | 1280 | 0.0448 | 73.5073 | 0.0660 | 49.8424 | 147.5% |
 * | 2048 | 0.0928 | 90.6308 | 0.1008 | 83.3970 | 108.7% |
 * | 4096 | 0.3296 | 101.9228 | 0.2601 | 129.1653 | 78.9% |
 *
 * ![strmv-lda-no-transpose-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-no-transpose-pad128.svg)
 *
 * ![strmv-lda-no-transpose-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-no-transpose-pad128.svg)
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (8 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0052 | 0.4512 | 64.1% |
 * | 64 | 0.0083 | 1.0698 | 0.0068 | 1.2897 | 82.9% |
 * | 128 | 0.0092 | 3.7073 | 0.0123 | 2.7708 | 133.8% |
 * | 256 | 0.0143 | 9.3214 | 0.0316 | 4.2224 | 220.8% |
 * | 512 | 0.0259 | 20.4121 | 0.1127 | 4.6980 | 434.5% |
 * | 1024 | 0.0742 | 28.3862 | 0.4464 | 4.7204 | 601.4% |
 * | 1280 | 0.1175 | 27.9918 | 0.2744 | 11.9897 | 233.5% |
 * | 2048 | 0.2632 | 31.9494 | 0.3338 | 25.1890 | 126.8% |
 * | 4096 | 1.4029 | 23.9474 | 1.0420 | 32.2403 | 74.3% |
 *
 * ![strmv-lda-transpose-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad0.svg)
 *
 * ![strmv-lda-transpose-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.3434 | 0.0041 | 0.5781 | 59.4% |
 * | 64 | 0.0069 | 1.2748 | 0.0055 | 1.6047 | 79.4% |
 * | 128 | 0.0079 | 4.3077 | 0.0082 | 4.1562 | 103.6% |
 * | 256 | 0.0098 | 13.6918 | 0.0162 | 8.2448 | 166.1% |
 * | 512 | 0.0159 | 33.3548 | 0.0492 | 10.7708 | 309.7% |
 * | 1024 | 0.0393 | 53.6505 | 0.1981 | 10.6391 | 504.3% |
 * | 1280 | 0.0659 | 49.9393 | 0.1518 | 21.6740 | 230.4% |
 * | 2048 | 0.1188 | 70.7931 | 0.1779 | 47.2803 | 149.7% |
 * | 4096 | 0.8644 | 38.8648 | 0.5319 | 63.1663 | 61.5% |
 *
 * ![strmv-lda-transpose-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad1.svg)
 *
 * ![strmv-lda-transpose-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3491 | 0.0041 | 0.5781 | 60.4% |
 * | 64 | 0.0070 | 1.2632 | 0.0051 | 1.7358 | 72.8% |
 * | 128 | 0.0078 | 4.3429 | 0.0078 | 4.3607 | 99.6% |
 * | 256 | 0.0102 | 13.1321 | 0.0166 | 8.0385 | 163.4% |
 * | 512 | 0.0175 | 30.2450 | 0.0567 | 9.3337 | 324.0% |
 * | 1024 | 0.0451 | 46.7727 | 0.2314 | 9.1062 | 513.6% |
 * | 1280 | 0.0700 | 46.9728 | 0.1467 | 22.4258 | 209.5% |
 * | 2048 | 0.1475 | 57.0278 | 0.2191 | 38.3738 | 148.6% |
 * | 4096 | 1.0693 | 31.4178 | 0.6512 | 51.5862 | 60.9% |
 *
 * ![strmv-lda-transpose-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad8.svg)
 *
 * ![strmv-lda-transpose-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3491 | 0.0041 | 0.5781 | 60.4% |
 * | 64 | 0.0069 | 1.2837 | 0.0054 | 1.6235 | 79.1% |
 * | 128 | 0.0079 | 4.3340 | 0.0084 | 4.0533 | 106.9% |
 * | 256 | 0.0105 | 12.7317 | 0.0208 | 6.4395 | 197.7% |
 * | 512 | 0.0184 | 28.7222 | 0.0675 | 7.8408 | 366.3% |
 * | 1024 | 0.0512 | 41.1600 | 0.2827 | 7.4557 | 552.1% |
 * | 1280 | 0.0758 | 43.4122 | 0.1558 | 21.1088 | 205.7% |
 * | 2048 | 0.1768 | 47.5541 | 0.2498 | 33.6579 | 141.3% |
 * | 4096 | 1.1587 | 28.9939 | 0.7482 | 44.9031 | 64.6% |
 *
 * ![strmv-lda-transpose-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad16.svg)
 *
 * ![strmv-lda-transpose-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3474 | 0.0042 | 0.5606 | 62.0% |
 * | 64 | 0.0068 | 1.2897 | 0.0056 | 1.5771 | 81.8% |
 * | 128 | 0.0081 | 4.1890 | 0.0101 | 3.3778 | 124.0% |
 * | 256 | 0.0114 | 11.6975 | 0.0257 | 5.2005 | 224.9% |
 * | 512 | 0.0216 | 24.5278 | 0.0921 | 5.7464 | 426.8% |
 * | 1024 | 0.0616 | 34.2287 | 0.3579 | 5.8879 | 581.3% |
 * | 1280 | 0.0917 | 35.8751 | 0.1985 | 16.5753 | 216.4% |
 * | 2048 | 0.2253 | 37.3273 | 0.3581 | 23.4849 | 158.9% |
 * | 4096 | 1.1121 | 30.2099 | 1.0467 | 32.0978 | 94.1% |
 *
 * ![strmv-lda-transpose-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad32.svg)
 *
 * ![strmv-lda-transpose-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3507 | 0.0041 | 0.5781 | 60.7% |
 * | 64 | 0.0070 | 1.2661 | 0.0053 | 1.6527 | 76.6% |
 * | 128 | 0.0079 | 4.3252 | 0.0085 | 3.9850 | 108.5% |
 * | 256 | 0.0106 | 12.6545 | 0.0205 | 6.5250 | 193.9% |
 * | 512 | 0.0193 | 27.4362 | 0.0720 | 7.3529 | 373.1% |
 * | 1024 | 0.0516 | 40.8156 | 0.2832 | 7.4405 | 548.6% |
 * | 1280 | 0.0756 | 43.5224 | 0.1567 | 20.9967 | 207.3% |
 * | 2048 | 0.1886 | 44.5812 | 0.2784 | 30.2016 | 147.6% |
 * | 4096 | 1.1215 | 29.9569 | 0.7864 | 42.7187 | 70.1% |
 *
 * ![strmv-lda-transpose-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad48.svg)
 *
 * ![strmv-lda-transpose-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.3442 | 0.0042 | 0.5692 | 60.5% |
 * | 64 | 0.0072 | 1.2321 | 0.0056 | 1.5862 | 77.7% |
 * | 128 | 0.0080 | 4.2560 | 0.0098 | 3.4602 | 123.0% |
 * | 256 | 0.0116 | 11.5679 | 0.0268 | 4.9833 | 232.1% |
 * | 512 | 0.0212 | 24.9157 | 0.0901 | 5.8750 | 424.1% |
 * | 1024 | 0.0635 | 33.1935 | 0.3758 | 5.6079 | 591.9% |
 * | 1280 | 0.0924 | 35.5832 | 0.2036 | 16.1534 | 220.3% |
 * | 2048 | 0.2216 | 37.9554 | 0.3441 | 24.4371 | 155.3% |
 * | 4096 | 1.1059 | 30.3778 | 1.0835 | 31.0053 | 98.0% |
 *
 * ![strmv-lda-transpose-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad64.svg)
 *
 * ![strmv-lda-transpose-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3466 | 0.0042 | 0.5649 | 61.4% |
 * | 64 | 0.0071 | 1.2377 | 0.0057 | 1.5376 | 80.5% |
 * | 128 | 0.0079 | 4.2903 | 0.0099 | 3.4267 | 125.2% |
 * | 256 | 0.0114 | 11.7303 | 0.0256 | 5.2265 | 224.4% |
 * | 512 | 0.0216 | 24.4915 | 0.0956 | 5.5387 | 442.2% |
 * | 1024 | 0.0624 | 33.7723 | 0.3606 | 5.8435 | 577.9% |
 * | 1280 | 0.0908 | 36.2355 | 0.1949 | 16.8774 | 214.7% |
 * | 2048 | 0.2335 | 36.0200 | 0.3618 | 23.2429 | 155.0% |
 * | 4096 | 1.1469 | 29.2929 | 1.0461 | 32.1160 | 91.2% |
 *
 * ![strmv-lda-transpose-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/gbps-lda-transpose-pad128.svg)
 *
 * ![strmv-lda-transpose-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strmv/ms-lda-transpose-pad128.svg)
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/lda.strmv.js) — WebGPU lda-sweep benchmark script
 * - [lda.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/lda.strmv.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmv
 */
