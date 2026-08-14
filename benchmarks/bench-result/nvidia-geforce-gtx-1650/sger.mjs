/**
 * Benchmark results for sger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 1.1210 | 0.0041 | 2.0625 | 54.4% |
 * | 64 | 0.0075 | 4.4255 | 0.0041 | 8.1250 | 54.5% |
 * | 128 | 0.0082 | 16.1250 | 0.0041 | 31.8764 | 50.6% |
 * | 256 | 0.0101 | 52.0506 | 0.0059 | 89.1490 | 58.4% |
 * | 512 | 0.0184 | 114.0000 | 0.0152 | 138.6779 | 82.2% |
 * | 1024 | 0.0607 | 138.3601 | 0.0621 | 135.1532 | 102.4% |
 * | 1280 | 0.0935 | 140.3595 | 0.0962 | 136.3900 | 102.9% |
 * | 2048 | 0.2232 | 150.3853 | 0.2356 | 142.4810 | 105.5% |
 * | 4096 | 0.8588 | 156.3146 | 0.9321 | 144.0258 | 108.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sger-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-default.svg)
 *
 * ![sger-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-default.svg)
 *
 * ## See also
 *
 * - [sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/sger.js) — WebGPU benchmark script
 * - [sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/sger.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0071 | 1.1839 | 0.0034 | 2.4789 | 47.8% |
 * | 64 | 0.0072 | 4.6222 | 0.0036 | 9.2035 | 50.2% |
 * | 128 | 0.0077 | 17.2000 | 0.0036 | 36.2105 | 47.5% |
 * | 256 | 0.0095 | 55.4739 | 0.0045 | 117.4857 | 47.2% |
 * | 512 | 0.0176 | 119.6066 | 0.0128 | 164.1600 | 72.9% |
 * | 1024 | 0.0589 | 142.5700 | 0.0557 | 150.7180 | 94.6% |
 * | 1280 | 0.0922 | 142.3333 | 0.0876 | 149.6878 | 95.1% |
 * | 2048 | 0.2211 | 151.8107 | 0.2131 | 157.5089 | 96.4% |
 * | 4096 | 0.8489 | 158.1531 | 0.8476 | 158.3800 | 99.9% |
 *
 * ![sger-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad0.svg)
 *
 * ![sger-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 1.3401 | 0.0035 | 2.4332 | 55.1% |
 * | 64 | 0.0064 | 5.2000 | 0.0033 | 9.9522 | 52.2% |
 * | 128 | 0.0068 | 19.2897 | 0.0036 | 36.3700 | 53.0% |
 * | 256 | 0.0083 | 63.5058 | 0.0050 | 104.7643 | 60.6% |
 * | 512 | 0.0188 | 111.6735 | 0.0147 | 142.9032 | 78.1% |
 * | 1024 | 0.1063 | 78.9648 | 0.0741 | 113.3233 | 69.7% |
 * | 1280 | 0.1676 | 78.2663 | 0.1167 | 112.3684 | 69.7% |
 * | 2048 | 0.4064 | 82.6021 | 0.2945 | 114.0065 | 72.5% |
 * | 4096 | 1.5194 | 88.3599 | 1.1817 | 113.6083 | 77.8% |
 *
 * ![sger-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad1.svg)
 *
 * ![sger-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.6296 | 56.3% |
 * | 128 | 0.0067 | 19.8462 | 0.0036 | 36.8571 | 53.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 115.8310 | 55.5% |
 * | 512 | 0.0201 | 104.5605 | 0.0166 | 126.7645 | 82.5% |
 * | 1024 | 0.1044 | 80.3922 | 0.0735 | 114.2360 | 70.4% |
 * | 1280 | 0.1707 | 76.8648 | 0.1154 | 113.6772 | 67.6% |
 * | 2048 | 0.3840 | 87.4204 | 0.2973 | 112.9084 | 77.4% |
 * | 4096 | 1.4808 | 90.6588 | 1.1733 | 114.4186 | 79.2% |
 *
 * ![sger-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad8.svg)
 *
 * ![sger-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.5853 | 56.5% |
 * | 128 | 0.0066 | 19.9420 | 0.0036 | 36.6933 | 54.3% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 114.6202 | 56.1% |
 * | 512 | 0.0207 | 101.4900 | 0.0182 | 115.6056 | 87.8% |
 * | 1024 | 0.1024 | 82.0385 | 0.0735 | 114.2360 | 71.8% |
 * | 1280 | 0.1622 | 80.8920 | 0.1165 | 112.5999 | 71.8% |
 * | 2048 | 0.3942 | 85.1567 | 0.2934 | 114.4293 | 74.4% |
 * | 4096 | 1.4631 | 91.7573 | 1.1854 | 113.2541 | 81.0% |
 *
 * ![sger-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad16.svg)
 *
 * ![sger-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.4906 | 55.2% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.6296 | 56.3% |
 * | 128 | 0.0067 | 19.8462 | 0.0037 | 35.2821 | 56.2% |
 * | 256 | 0.0082 | 64.3757 | 0.0045 | 115.8310 | 55.6% |
 * | 512 | 0.0165 | 127.2558 | 0.0150 | 139.8594 | 91.0% |
 * | 1024 | 0.0574 | 146.1838 | 0.0561 | 149.7290 | 97.6% |
 * | 1280 | 0.0881 | 148.9535 | 0.0880 | 149.1160 | 99.9% |
 * | 2048 | 0.2171 | 154.6301 | 0.2191 | 153.1963 | 100.9% |
 * | 4096 | 0.8783 | 152.8603 | 0.8622 | 155.7055 | 98.2% |
 *
 * ![sger-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad32.svg)
 *
 * ![sger-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4110 | 57.0% |
 * | 64 | 0.0061 | 5.4167 | 0.0034 | 9.8113 | 55.2% |
 * | 128 | 0.0066 | 19.9420 | 0.0036 | 36.8571 | 54.1% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 115.0210 | 55.9% |
 * | 512 | 0.0225 | 93.2727 | 0.0187 | 112.1503 | 83.2% |
 * | 1024 | 0.1063 | 78.9767 | 0.0746 | 112.5938 | 70.1% |
 * | 1280 | 0.1659 | 79.0741 | 0.1176 | 111.4973 | 70.9% |
 * | 2048 | 0.3963 | 84.7166 | 0.2949 | 113.8333 | 74.4% |
 * | 4096 | 1.4950 | 89.7973 | 1.1869 | 113.1121 | 79.4% |
 *
 * ![sger-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad48.svg)
 *
 * ![sger-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4220 | 56.8% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.6296 | 56.3% |
 * | 128 | 0.0066 | 20.0388 | 0.0035 | 37.3575 | 53.6% |
 * | 256 | 0.0081 | 64.7559 | 0.0046 | 113.4345 | 57.1% |
 * | 512 | 0.0164 | 128.2500 | 0.0150 | 140.0085 | 91.6% |
 * | 1024 | 0.0591 | 142.0682 | 0.0567 | 147.9977 | 96.0% |
 * | 1280 | 0.0889 | 147.5328 | 0.0886 | 148.0123 | 99.7% |
 * | 2048 | 0.2252 | 149.0605 | 0.2229 | 150.5796 | 99.0% |
 * | 4096 | 0.8747 | 153.4867 | 0.8801 | 152.5435 | 100.6% |
 *
 * ![sger-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad64.svg)
 *
 * ![sger-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0062 | 5.3333 | 0.0038 | 8.8511 | 60.3% |
 * | 128 | 0.0067 | 19.8462 | 0.0037 | 35.5862 | 55.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 113.8270 | 56.4% |
 * | 512 | 0.0166 | 126.5202 | 0.0151 | 138.8245 | 91.1% |
 * | 1024 | 0.0580 | 144.6527 | 0.0570 | 147.2090 | 98.3% |
 * | 1280 | 0.0891 | 147.2943 | 0.0879 | 149.1703 | 98.7% |
 * | 2048 | 0.2281 | 147.1888 | 0.2275 | 147.5926 | 99.7% |
 * | 4096 | 0.9418 | 142.5503 | 0.9053 | 148.2972 | 96.1% |
 *
 * ![sger-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-pad128.svg)
 *
 * ![sger-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/lda.sger.js) — WebGPU lda-sweep benchmark script
 * - [lda.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/lda.sger.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sger
 */
