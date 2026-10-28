/**
 * Benchmark results for dger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 2.5143 | 0.0037 | 4.5714 | 55.0% |
 * | 64 | 0.0068 | 9.7653 | 0.0038 | 17.4790 | 55.9% |
 * | 128 | 0.0080 | 33.2233 | 0.0040 | 66.0480 | 50.3% |
 * | 256 | 0.0117 | 90.2497 | 0.0057 | 183.7766 | 49.1% |
 * | 512 | 0.0348 | 120.7059 | 0.0283 | 148.3094 | 81.4% |
 * | 1024 | 0.1131 | 148.5423 | 0.1014 | 165.5520 | 89.7% |
 * | 1280 | 0.1736 | 151.1226 | 0.1565 | 167.5879 | 90.2% |
 * | 2048 | 0.4324 | 155.2939 | 0.3950 | 169.9960 | 91.4% |
 * | 4096 | 1.6560 | 162.1414 | 1.5931 | 168.5395 | 96.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dger-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-default.svg)
 *
 * ![dger-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-default.svg)
 *
 * ## See also
 *
 * - [dger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/wgblas/dger.js) — WebGPU benchmark script
 * - [dger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/cuda/dger.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0067 | 2.5203 | 0.0037 | 4.5913 | 54.9% |
 * | 64 | 0.0068 | 9.7196 | 0.0037 | 17.7778 | 54.7% |
 * | 128 | 0.0080 | 32.8270 | 0.0039 | 67.1219 | 48.9% |
 * | 256 | 0.0125 | 84.1330 | 0.0059 | 178.7826 | 47.1% |
 * | 512 | 0.0360 | 116.8399 | 0.0283 | 148.5611 | 78.6% |
 * | 1024 | 0.1195 | 140.5275 | 0.1016 | 165.3434 | 85.0% |
 * | 1280 | 0.1802 | 145.5682 | 0.1567 | 167.3826 | 87.0% |
 * | 2048 | 0.4388 | 153.0175 | 0.3952 | 169.9065 | 90.1% |
 * | 4096 | 1.6611 | 161.6448 | 1.6598 | 161.7632 | 99.9% |
 *
 * ![dger-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-stride4.svg)
 *
 * ![dger-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 2.4965 | 0.0037 | 4.5714 | 54.6% |
 * | 64 | 0.0068 | 9.7196 | 0.0038 | 17.6271 | 55.1% |
 * | 128 | 0.0080 | 33.0240 | 0.0039 | 67.6721 | 48.8% |
 * | 256 | 0.0118 | 89.1491 | 0.0058 | 180.7473 | 49.3% |
 * | 512 | 0.0354 | 118.8489 | 0.0284 | 147.7255 | 80.5% |
 * | 1024 | 0.1176 | 142.7639 | 0.1016 | 165.3174 | 86.4% |
 * | 1280 | 0.1818 | 144.2999 | 0.1568 | 167.3484 | 86.2% |
 * | 2048 | 0.4382 | 153.2186 | 0.3951 | 169.9272 | 90.2% |
 * | 4096 | 1.6589 | 161.8552 | 1.6829 | 159.5455 | 101.4% |
 *
 * ![dger-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-stride5.svg)
 *
 * ![dger-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 2.4673 | 0.0037 | 4.5714 | 54.0% |
 * | 64 | 0.0074 | 8.9655 | 0.0038 | 17.6271 | 50.9% |
 * | 128 | 0.0102 | 25.8000 | 0.0040 | 66.3132 | 38.9% |
 * | 256 | 0.0234 | 45.0322 | 0.0059 | 179.7596 | 25.1% |
 * | 512 | 0.0717 | 58.6286 | 0.0283 | 148.6452 | 39.4% |
 * | 1024 | 0.1203 | 139.6487 | 0.1018 | 165.0314 | 84.6% |
 * | 1280 | 0.1797 | 145.9569 | 0.1571 | 166.9735 | 87.4% |
 * | 2048 | 0.4383 | 153.1739 | 0.3973 | 168.9897 | 90.6% |
 * | 4096 | 1.6630 | 161.4581 | 1.7500 | 153.4305 | 105.2% |
 *
 * ![dger-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-stride32.svg)
 *
 * ![dger-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 2.5083 | 0.0037 | 4.5913 | 54.6% |
 * | 64 | 0.0069 | 9.6074 | 0.0038 | 17.4790 | 55.0% |
 * | 128 | 0.0081 | 32.6970 | 0.0040 | 66.5807 | 49.1% |
 * | 256 | 0.0141 | 74.6788 | 0.0058 | 181.7459 | 41.1% |
 * | 512 | 0.0381 | 110.2207 | 0.0284 | 148.2257 | 74.4% |
 * | 1024 | 0.1202 | 139.7045 | 0.1018 | 164.9796 | 84.7% |
 * | 1280 | 0.1804 | 145.4520 | 0.1576 | 166.4988 | 87.4% |
 * | 2048 | 0.4388 | 153.0231 | 0.4035 | 166.4162 | 92.0% |
 * | 4096 | 1.6649 | 161.2673 | 1.7511 | 153.3324 | 105.2% |
 *
 * ![dger-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-stride33.svg)
 *
 * ![dger-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 2.4501 | 0.0037 | 4.5913 | 53.4% |
 * | 64 | 0.0072 | 9.2239 | 0.0037 | 17.9310 | 51.4% |
 * | 128 | 0.0082 | 32.2500 | 0.0040 | 66.0480 | 48.8% |
 * | 256 | 0.0142 | 73.9236 | 0.0058 | 182.2493 | 40.6% |
 * | 512 | 0.0389 | 108.0000 | 0.0284 | 147.9752 | 73.0% |
 * | 1024 | 0.1210 | 138.8360 | 0.1017 | 165.1613 | 84.1% |
 * | 1280 | 0.1817 | 144.3507 | 0.1575 | 166.5834 | 86.7% |
 * | 2048 | 0.4383 | 153.1963 | 0.4055 | 165.5758 | 92.5% |
 * | 4096 | 1.6567 | 162.0663 | 1.7627 | 152.3206 | 106.4% |
 *
 * ![dger-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-stride255.svg)
 *
 * ![dger-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 2.3519 | 0.0037 | 4.5517 | 51.7% |
 * | 64 | 0.0077 | 8.6848 | 0.0037 | 17.9310 | 48.4% |
 * | 128 | 0.0103 | 25.6398 | 0.0040 | 66.5807 | 38.5% |
 * | 256 | 0.0234 | 44.9399 | 0.0059 | 178.7826 | 25.1% |
 * | 512 | 0.0721 | 58.2515 | 0.0283 | 148.3094 | 39.3% |
 * | 1024 | 0.1202 | 139.7045 | 0.1017 | 165.1093 | 84.6% |
 * | 1280 | 0.1816 | 144.4652 | 0.1574 | 166.6850 | 86.7% |
 * | 2048 | 0.4423 | 151.8107 | 0.3974 | 168.9421 | 89.9% |
 * | 4096 | 1.6507 | 162.6632 | 1.7582 | 152.7170 | 106.5% |
 *
 * ![dger-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-stride256.svg)
 *
 * ![dger-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/wgblas/stride.dger.js) — WebGPU stride-sweep benchmark script
 * - [stride.dger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/cuda/stride.dger.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0066 | 2.5446 | 0.0037 | 4.5913 | 55.4% |
 * | 64 | 0.0069 | 9.5853 | 0.0038 | 17.6271 | 54.4% |
 * | 128 | 0.0078 | 33.9753 | 0.0038 | 68.8000 | 49.4% |
 * | 256 | 0.0118 | 88.9081 | 0.0057 | 183.2646 | 48.5% |
 * | 512 | 0.0348 | 120.7059 | 0.0281 | 149.3212 | 80.8% |
 * | 1024 | 0.1134 | 148.0813 | 0.1014 | 165.5782 | 89.4% |
 * | 1280 | 0.1735 | 151.2341 | 0.1566 | 167.5365 | 90.3% |
 * | 2048 | 0.4335 | 154.8698 | 0.3950 | 169.9754 | 91.1% |
 * | 4096 | 1.6567 | 162.0678 | 1.5931 | 168.5446 | 96.2% |
 *
 * ![dger-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad0.svg)
 *
 * ![dger-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 2.4906 | 0.0037 | 4.5714 | 54.5% |
 * | 64 | 0.0069 | 9.6970 | 0.0038 | 17.6271 | 55.0% |
 * | 128 | 0.0080 | 33.1566 | 0.0040 | 65.7849 | 50.4% |
 * | 256 | 0.0118 | 89.0284 | 0.0061 | 172.2304 | 51.7% |
 * | 512 | 0.0361 | 116.4772 | 0.0307 | 136.8000 | 85.1% |
 * | 1024 | 0.1164 | 144.3344 | 0.1102 | 152.4474 | 94.7% |
 * | 1280 | 0.1986 | 132.0938 | 0.1720 | 152.5000 | 86.6% |
 * | 2048 | 0.4522 | 148.4804 | 0.4384 | 153.1683 | 96.9% |
 *
 * ![dger-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad1.svg)
 *
 * ![dger-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 2.5507 | 0.0037 | 4.5913 | 55.6% |
 * | 64 | 0.0068 | 9.7424 | 0.0037 | 17.7778 | 54.8% |
 * | 128 | 0.0079 | 33.3576 | 0.0039 | 67.6721 | 49.3% |
 * | 256 | 0.0119 | 88.6685 | 0.0057 | 183.2646 | 48.4% |
 * | 512 | 0.0355 | 118.3668 | 0.0303 | 138.5316 | 85.4% |
 * | 1024 | 0.1182 | 142.0682 | 0.1087 | 154.4438 | 92.0% |
 * | 1280 | 0.1943 | 135.0309 | 0.1697 | 154.5847 | 87.4% |
 * | 2048 | 0.4810 | 139.5760 | 0.4325 | 155.2365 | 89.9% |
 *
 * ![dger-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad8.svg)
 *
 * ![dger-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 2.5083 | 0.0037 | 4.5517 | 55.1% |
 * | 64 | 0.0067 | 9.8812 | 0.0037 | 17.7778 | 55.6% |
 * | 128 | 0.0080 | 33.0240 | 0.0039 | 68.2314 | 48.4% |
 * | 256 | 0.0118 | 88.9081 | 0.0058 | 182.7556 | 48.6% |
 * | 512 | 0.0358 | 117.3095 | 0.0282 | 148.8979 | 78.8% |
 * | 1024 | 0.1181 | 142.1644 | 0.1019 | 164.7724 | 86.3% |
 * | 1280 | 0.1870 | 140.2875 | 0.1569 | 167.1949 | 83.9% |
 * | 2048 | 0.4509 | 148.8913 | 0.3967 | 169.2487 | 88.0% |
 *
 * ![dger-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad16.svg)
 *
 * ![dger-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 2.5024 | 0.0036 | 4.7568 | 52.6% |
 * | 64 | 0.0068 | 9.8578 | 0.0037 | 17.8541 | 55.2% |
 * | 128 | 0.0079 | 33.6293 | 0.0039 | 68.2314 | 49.3% |
 * | 256 | 0.0117 | 90.1260 | 0.0057 | 184.8090 | 48.8% |
 * | 512 | 0.0359 | 117.1525 | 0.0283 | 148.7293 | 78.8% |
 * | 1024 | 0.1244 | 134.9968 | 0.1018 | 164.9277 | 81.9% |
 * | 1280 | 0.1826 | 143.6803 | 0.1568 | 167.2631 | 85.9% |
 * | 2048 | 0.4549 | 147.5822 | 0.3960 | 169.5701 | 87.0% |
 *
 * ![dger-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad32.svg)
 *
 * ![dger-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 2.4789 | 0.0036 | 4.6726 | 53.1% |
 * | 64 | 0.0072 | 9.2035 | 0.0037 | 17.9310 | 51.3% |
 * | 128 | 0.0079 | 33.5610 | 0.0039 | 68.2314 | 49.2% |
 * | 256 | 0.0116 | 90.3736 | 0.0057 | 185.8531 | 48.6% |
 * | 512 | 0.0369 | 114.0000 | 0.0287 | 146.5714 | 77.8% |
 * | 1024 | 0.1215 | 138.2508 | 0.1023 | 164.1539 | 84.2% |
 * | 1280 | 0.1825 | 143.7685 | 0.1571 | 166.9735 | 86.1% |
 * | 2048 | 0.4734 | 141.8166 | 0.3989 | 168.3254 | 84.3% |
 *
 * ![dger-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad48.svg)
 *
 * ![dger-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 2.5385 | 0.0036 | 4.6316 | 54.8% |
 * | 64 | 0.0068 | 9.7653 | 0.0037 | 17.9310 | 54.5% |
 * | 128 | 0.0080 | 33.2233 | 0.0039 | 67.6721 | 49.1% |
 * | 256 | 0.0119 | 88.6685 | 0.0057 | 183.2646 | 48.4% |
 * | 512 | 0.0351 | 119.6066 | 0.0286 | 147.0638 | 81.3% |
 * | 1024 | 0.1157 | 145.1729 | 0.1021 | 164.4625 | 88.3% |
 * | 1280 | 0.1741 | 150.7059 | 0.1575 | 166.5664 | 90.5% |
 * | 2048 | 0.4426 | 151.6955 | 0.3963 | 169.4400 | 89.5% |
 *
 * ![dger-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad64.svg)
 *
 * ![dger-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 2.3571 | 0.0036 | 4.6316 | 50.9% |
 * | 64 | 0.0070 | 9.5632 | 0.0038 | 17.6271 | 54.3% |
 * | 128 | 0.0080 | 32.8924 | 0.0039 | 67.1219 | 49.0% |
 * | 256 | 0.0117 | 89.7572 | 0.0058 | 181.7459 | 49.4% |
 * | 512 | 0.0348 | 120.7059 | 0.0286 | 146.8993 | 82.2% |
 * | 1024 | 0.1166 | 144.0176 | 0.1068 | 157.2670 | 91.6% |
 * | 1280 | 0.1741 | 150.7059 | 0.1575 | 166.5326 | 90.5% |
 * | 2048 | 0.4497 | 149.2886 | 0.3967 | 169.2350 | 88.2% |
 *
 * ![dger-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-pad128.svg)
 *
 * ![dger-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/wgblas/lda.dger.js) — WebGPU lda-sweep benchmark script
 * - [lda.dger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/cuda/lda.dger.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0068 | 2.4965 | 0.0037 | 4.5128 | 55.3% |
 * | 64 | 0.0067 | 9.8812 | 0.0037 | 18.1659 | 54.4% |
 * | 128 | 0.0077 | 34.1157 | 0.0039 | 67.1219 | 50.8% |
 * | 256 | 0.0119 | 88.1930 | 0.0057 | 184.2913 | 47.9% |
 * | 512 | 0.0348 | 120.7059 | 0.0282 | 148.8136 | 81.1% |
 * | 1024 | 0.1139 | 147.4572 | 0.1014 | 165.6827 | 89.0% |
 * | 1280 | 0.1741 | 150.7059 | 0.1565 | 167.6564 | 89.9% |
 * | 2048 | 0.4329 | 155.0988 | 0.3948 | 170.0580 | 91.2% |
 * | 4096 | 1.6564 | 162.0944 | 1.5931 | 168.5378 | 96.2% |
 *
 * ![dger-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-alphaneg3p75.svg)
 *
 * ![dger-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 2.5324 | 0.0015 | 11.3548 | 22.3% |
 * | 64 | 0.0068 | 9.7196 | 0.0016 | 42.8866 | 22.7% |
 * | 128 | 0.0079 | 33.4251 | 0.0015 | 172.0000 | 19.4% |
 * | 256 | 0.0118 | 89.1491 | 0.0016 | 671.3470 | 13.3% |
 * | 512 | 0.0348 | 120.7059 | 0.0014 | 2918.3999 | 4.1% |
 * | 1024 | 0.1131 | 148.5003 | 0.0015 | 11408.6953 | 1.3% |
 * | 1280 | 0.1731 | 151.5556 | 0.0016 | 16562.4238 | 0.9% |
 * | 2048 | 0.4333 | 154.9613 | 0.0016 | 42819.9180 | 0.4% |
 * | 4096 | 1.6561 | 162.1273 | 0.0015 | 182405.5625 | 0.1% |
 *
 * ![dger-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-alpha0.svg)
 *
 * ![dger-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 2.4444 | 0.0037 | 4.5913 | 53.2% |
 * | 64 | 0.0069 | 9.6970 | 0.0038 | 17.7021 | 54.8% |
 * | 128 | 0.0080 | 33.0240 | 0.0039 | 67.1219 | 49.2% |
 * | 256 | 0.0116 | 90.3736 | 0.0058 | 181.7459 | 49.7% |
 * | 512 | 0.0349 | 120.4844 | 0.0284 | 148.2257 | 81.3% |
 * | 1024 | 0.1133 | 148.1858 | 0.1015 | 165.4998 | 89.5% |
 * | 1280 | 0.1735 | 151.2341 | 0.1565 | 167.5879 | 90.2% |
 * | 2048 | 0.4329 | 155.1102 | 0.3950 | 169.9823 | 91.3% |
 * | 4096 | 1.6555 | 162.1916 | 1.5931 | 168.5395 | 96.2% |
 *
 * ![dger-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-alpha1eneg38.svg)
 *
 * ![dger-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 2.5263 | 0.0037 | 4.5913 | 55.0% |
 * | 64 | 0.0067 | 9.9284 | 0.0037 | 17.7778 | 55.8% |
 * | 128 | 0.0078 | 33.8361 | 0.0039 | 67.3959 | 50.2% |
 * | 256 | 0.0116 | 90.4979 | 0.0057 | 184.8090 | 49.0% |
 * | 512 | 0.0348 | 120.7059 | 0.0283 | 148.5611 | 81.2% |
 * | 1024 | 0.1137 | 147.7062 | 0.1015 | 165.4738 | 89.3% |
 * | 1280 | 0.1741 | 150.7059 | 0.1565 | 167.5879 | 89.9% |
 * | 2048 | 0.4336 | 154.8527 | 0.3949 | 170.0029 | 91.1% |
 * | 4096 | 1.6557 | 162.1681 | 1.5930 | 168.5480 | 96.2% |
 *
 * ![dger-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-alpha1.svg)
 *
 * ![dger-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 2.4906 | 0.0037 | 4.5128 | 55.2% |
 * | 64 | 0.0068 | 9.7882 | 0.0037 | 17.7778 | 55.1% |
 * | 128 | 0.0079 | 33.4251 | 0.0039 | 67.6721 | 49.4% |
 * | 256 | 0.0117 | 89.6349 | 0.0057 | 184.8090 | 48.5% |
 * | 512 | 0.0348 | 120.7059 | 0.0283 | 148.3932 | 81.3% |
 * | 1024 | 0.1136 | 147.7685 | 0.1015 | 165.4477 | 89.3% |
 * | 1280 | 0.1735 | 151.2062 | 0.1567 | 167.3997 | 90.3% |
 * | 2048 | 0.4336 | 154.8641 | 0.3949 | 170.0167 | 91.1% |
 * | 4096 | 1.6568 | 162.0569 | 1.5931 | 168.5378 | 96.2% |
 *
 * ![dger-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-alpha2p5.svg)
 *
 * ![dger-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/wgblas/alpha.dger.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/cuda/alpha.dger.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0068 | 2.4906 |
 * | 64 | 0.0068 | 9.7424 |
 * | 128 | 0.0078 | 33.9753 |
 * | 256 | 0.0116 | 90.6226 |
 * | 512 | 0.0348 | 120.8169 |
 * | 1024 | 0.1136 | 147.8935 |
 * | 1280 | 0.1738 | 150.9139 |
 * | 2048 | 0.4326 | 155.1963 |
 * | 4096 | 1.6565 | 162.0866 |
 *
 * ![dger-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-layoutcolumnmajor.svg)
 *
 * ![dger-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0067 | 2.5324 |
 * | 64 | 0.0068 | 9.7653 |
 * | 128 | 0.0078 | 33.8361 |
 * | 256 | 0.0118 | 89.2700 |
 * | 512 | 0.0348 | 120.7059 |
 * | 1024 | 0.1130 | 148.5844 |
 * | 1280 | 0.1736 | 151.1644 |
 * | 2048 | 0.4335 | 154.8869 |
 * | 4096 | 1.6566 | 162.0756 |
 *
 * ![dger-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/gbps-layoutrowmajor.svg)
 *
 * ![dger-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dger/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dger/wgblas/layout.dger.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dger
 */
