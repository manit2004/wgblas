/**
 * Benchmark results for dger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0065 | 2.5819 | 0.0038 | 4.4746 | 57.7% |
 * | 64 | 0.0067 | 10.0000 | 0.0037 | 17.7778 | 56.2% |
 * | 128 | 0.0078 | 33.8361 | 0.0039 | 67.6721 | 50.0% |
 * | 256 | 0.0118 | 89.2700 | 0.0058 | 181.2452 | 49.3% |
 * | 512 | 0.0348 | 120.7059 | 0.0283 | 148.7293 | 81.2% |
 * | 1024 | 0.1132 | 148.3743 | 0.1014 | 165.5520 | 89.6% |
 * | 1280 | 0.1759 | 149.1432 | 0.1564 | 167.7594 | 88.9% |
 * | 2048 | 0.4340 | 154.6928 | 0.3949 | 170.0029 | 91.0% |
 * | 4096 | 1.7271 | 155.4646 | 1.5932 | 168.5294 | 92.2% |
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
 * | 32 | 0.0082 | 2.0625 | 0.0038 | 4.4370 | 46.5% |
 * | 64 | 0.0082 | 8.1092 | 0.0038 | 17.4790 | 46.4% |
 * | 128 | 0.0097 | 27.2026 | 0.0040 | 66.8502 | 40.7% |
 * | 256 | 0.0158 | 66.7939 | 0.0060 | 175.9144 | 38.0% |
 * | 512 | 0.0404 | 103.9810 | 0.0285 | 147.3939 | 70.5% |
 * | 1024 | 0.1311 | 128.1250 | 0.1016 | 165.3174 | 77.5% |
 * | 1280 | 0.1979 | 132.5851 | 0.1568 | 167.3143 | 79.2% |
 * | 2048 | 0.4892 | 137.2568 | 0.3951 | 169.9478 | 80.8% |
 * | 4096 | 1.8132 | 148.0813 | 1.6602 | 161.7304 | 91.6% |
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
 * | 32 | 0.0068 | 2.5024 | 0.0037 | 4.5913 | 54.5% |
 * | 64 | 0.0068 | 9.7196 | 0.0037 | 17.7778 | 54.7% |
 * | 128 | 0.0080 | 33.0240 | 0.0040 | 66.5807 | 49.6% |
 * | 256 | 0.0118 | 89.3913 | 0.0058 | 182.2493 | 49.0% |
 * | 512 | 0.0354 | 118.6341 | 0.0284 | 148.2257 | 80.0% |
 * | 1024 | 0.1174 | 143.0362 | 0.1019 | 164.7982 | 86.8% |
 * | 1280 | 0.1843 | 142.3333 | 0.1568 | 167.3314 | 85.1% |
 * | 2048 | 0.4484 | 149.7414 | 0.3951 | 169.9478 | 88.1% |
 * | 4096 | 1.7035 | 157.6169 | 1.6828 | 159.5606 | 98.8% |
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
 * | 32 | 0.0067 | 2.5143 | 0.0037 | 4.5322 | 55.5% |
 * | 64 | 0.0075 | 8.8511 | 0.0039 | 16.9106 | 52.3% |
 * | 128 | 0.0102 | 25.8000 | 0.0041 | 64.5000 | 40.0% |
 * | 256 | 0.0230 | 45.7206 | 0.0059 | 177.8162 | 25.7% |
 * | 512 | 0.0717 | 58.6286 | 0.0287 | 146.5714 | 40.0% |
 * | 1024 | 0.2696 | 62.2982 | 0.1018 | 164.9018 | 37.8% |
 * | 1280 | 0.4173 | 62.8736 | 0.1572 | 166.9055 | 37.7% |
 * | 2048 | 1.0518 | 63.8345 | 0.3973 | 168.9897 | 37.8% |
 * | 4096 | 4.1800 | 64.2352 | 1.7498 | 153.4460 | 41.9% |
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
 * | 32 | 0.0067 | 2.5385 | 0.0036 | 4.6316 | 54.8% |
 * | 64 | 0.0069 | 9.6520 | 0.0038 | 17.7021 | 54.5% |
 * | 128 | 0.0082 | 32.2500 | 0.0041 | 65.0079 | 49.6% |
 * | 256 | 0.0141 | 74.4253 | 0.0058 | 181.7459 | 41.0% |
 * | 512 | 0.0376 | 111.8161 | 0.0283 | 148.3932 | 75.4% |
 * | 1024 | 0.1616 | 103.9311 | 0.1017 | 165.0834 | 63.0% |
 * | 1280 | 0.2537 | 103.4172 | 0.1573 | 166.7358 | 62.0% |
 * | 2048 | 0.7482 | 89.7327 | 0.4035 | 166.4162 | 53.9% |
 * | 4096 | 3.6365 | 73.8354 | 1.7513 | 153.3142 | 48.2% |
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
 * | 32 | 0.0068 | 2.4906 | 0.0038 | 4.4000 | 56.6% |
 * | 64 | 0.0069 | 9.5853 | 0.0038 | 17.6271 | 54.4% |
 * | 128 | 0.0082 | 32.2500 | 0.0041 | 64.5000 | 50.0% |
 * | 256 | 0.0137 | 76.5914 | 0.0058 | 181.7459 | 42.1% |
 * | 512 | 0.0382 | 110.0821 | 0.0284 | 147.8087 | 74.5% |
 * | 1024 | 0.1434 | 117.1429 | 0.1019 | 164.8500 | 71.1% |
 * | 1280 | 0.2171 | 120.8491 | 0.1574 | 166.6680 | 72.5% |
 * | 2048 | 0.7429 | 90.3724 | 0.4015 | 167.2253 | 54.0% |
 * | 4096 | 5.1912 | 51.7223 | 1.7627 | 152.3261 | 34.0% |
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
 * | 32 | 0.0069 | 2.4558 | 0.0038 | 4.4746 | 54.9% |
 * | 64 | 0.0077 | 8.6307 | 0.0037 | 17.7778 | 48.5% |
 * | 128 | 0.0103 | 25.6000 | 0.0039 | 67.6721 | 37.8% |
 * | 256 | 0.0231 | 45.5939 | 0.0058 | 180.7473 | 25.2% |
 * | 512 | 0.0717 | 58.6286 | 0.0283 | 148.3932 | 39.5% |
 * | 1024 | 0.2698 | 62.2354 | 0.1017 | 165.0834 | 37.7% |
 * | 1280 | 0.4174 | 62.8591 | 0.1574 | 166.6680 | 37.7% |
 * | 2048 | 1.0558 | 63.5936 | 0.3974 | 168.9489 | 37.6% |
 * | 4096 | 4.9544 | 54.1941 | 1.7582 | 152.7142 | 35.5% |
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
 * | 32 | 0.0066 | 2.5631 | 0.0038 | 4.4746 | 57.3% |
 * | 64 | 0.0067 | 9.9522 | 0.0038 | 17.6271 | 56.5% |
 * | 128 | 0.0077 | 34.4000 | 0.0040 | 66.5807 | 51.7% |
 * | 256 | 0.0115 | 91.8883 | 0.0057 | 183.2646 | 50.1% |
 * | 512 | 0.0347 | 121.0954 | 0.0283 | 148.7293 | 81.4% |
 * | 1024 | 0.1130 | 148.6265 | 0.1014 | 165.6043 | 89.7% |
 * | 1280 | 0.1755 | 149.4831 | 0.1568 | 167.3655 | 89.3% |
 * | 2048 | 0.4327 | 155.1618 | 0.3949 | 170.0374 | 91.3% |
 * | 4096 | 1.6589 | 161.8568 | 1.5932 | 168.5277 | 96.0% |
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
 * | 32 | 0.0066 | 2.5507 | 0.0037 | 4.5128 | 56.5% |
 * | 64 | 0.0069 | 9.6296 | 0.0039 | 17.0492 | 56.5% |
 * | 128 | 0.0080 | 32.8270 | 0.0039 | 67.6721 | 48.5% |
 * | 256 | 0.0118 | 89.3913 | 0.0060 | 174.0529 | 51.4% |
 * | 512 | 0.0348 | 120.7059 | 0.0307 | 136.8000 | 88.2% |
 * | 1024 | 0.1156 | 145.2533 | 0.1102 | 152.3588 | 95.3% |
 * | 1280 | 0.1961 | 133.7532 | 0.1720 | 152.5709 | 87.7% |
 * | 2048 | 0.4523 | 148.4488 | 0.4387 | 153.0566 | 97.0% |
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
 * | 32 | 0.0066 | 2.5631 | 0.0038 | 4.4370 | 57.8% |
 * | 64 | 0.0067 | 10.0000 | 0.0038 | 17.3333 | 57.7% |
 * | 128 | 0.0077 | 34.1863 | 0.0039 | 67.6721 | 50.5% |
 * | 256 | 0.0116 | 90.8729 | 0.0058 | 182.7556 | 49.7% |
 * | 512 | 0.0358 | 117.2571 | 0.0301 | 139.4881 | 84.1% |
 * | 1024 | 0.1171 | 143.3684 | 0.1085 | 154.7170 | 92.7% |
 * | 1280 | 0.1957 | 134.0374 | 0.1696 | 154.6868 | 86.7% |
 * | 2048 | 0.5006 | 134.1330 | 0.4328 | 155.1331 | 86.5% |
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
 * | 32 | 0.0066 | 2.5631 | 0.0040 | 4.2581 | 60.2% |
 * | 64 | 0.0067 | 10.0000 | 0.0037 | 17.7778 | 56.2% |
 * | 128 | 0.0077 | 34.1157 | 0.0039 | 67.6721 | 50.4% |
 * | 256 | 0.0116 | 90.6226 | 0.0057 | 185.8531 | 48.8% |
 * | 512 | 0.0348 | 120.7059 | 0.0284 | 148.2257 | 81.4% |
 * | 1024 | 0.1204 | 139.4447 | 0.1019 | 164.7724 | 84.6% |
 * | 1280 | 0.1880 | 139.5829 | 0.1569 | 167.1778 | 83.5% |
 * | 2048 | 0.4728 | 142.0037 | 0.3966 | 169.3033 | 83.9% |
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
 * | 32 | 0.0082 | 2.0625 | 0.0038 | 4.4000 | 46.9% |
 * | 64 | 0.0082 | 8.1250 | 0.0037 | 17.7778 | 45.7% |
 * | 128 | 0.0097 | 27.3377 | 0.0039 | 67.1219 | 40.7% |
 * | 256 | 0.0149 | 70.8202 | 0.0058 | 181.7459 | 39.0% |
 * | 512 | 0.0395 | 106.3815 | 0.0282 | 148.8979 | 71.4% |
 * | 1024 | 0.1290 | 130.1587 | 0.1019 | 164.8759 | 78.9% |
 * | 1280 | 0.1924 | 136.3559 | 0.1567 | 167.4339 | 81.4% |
 * | 2048 | 0.5325 | 126.0961 | 0.3956 | 169.7210 | 74.3% |
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
 * | 32 | 0.0102 | 1.6500 | 0.0037 | 4.5322 | 36.4% |
 * | 64 | 0.0102 | 6.5000 | 0.0037 | 17.8541 | 36.4% |
 * | 128 | 0.0116 | 22.8698 | 0.0039 | 67.6721 | 33.8% |
 * | 256 | 0.0184 | 57.0616 | 0.0057 | 185.8531 | 30.7% |
 * | 512 | 0.0494 | 85.0570 | 0.0286 | 146.8993 | 57.9% |
 * | 1024 | 0.1556 | 107.8947 | 0.1023 | 164.2053 | 65.7% |
 * | 1280 | 0.2388 | 109.8687 | 0.1569 | 167.1949 | 65.7% |
 * | 2048 | 0.6028 | 111.3888 | 0.3990 | 168.2714 | 66.2% |
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
 * | 32 | 0.0116 | 1.4505 | 0.0041 | 4.1089 | 35.3% |
 * | 64 | 0.0123 | 5.4167 | 0.0041 | 16.2500 | 33.3% |
 * | 128 | 0.0142 | 18.5946 | 0.0041 | 64.5000 | 28.8% |
 * | 256 | 0.0208 | 50.6092 | 0.0058 | 181.2452 | 27.9% |
 * | 512 | 0.0536 | 78.4516 | 0.0287 | 146.5714 | 53.5% |
 * | 1024 | 0.1645 | 102.1012 | 0.1023 | 164.1282 | 62.2% |
 * | 1280 | 0.2623 | 100.0354 | 0.1572 | 166.9225 | 59.9% |
 * | 2048 | 0.6587 | 101.9324 | 0.3964 | 169.3648 | 60.2% |
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
 * | 32 | 0.0123 | 1.3750 | 0.0037 | 4.5517 | 30.2% |
 * | 64 | 0.0128 | 5.2000 | 0.0038 | 17.3333 | 30.0% |
 * | 128 | 0.0145 | 18.2453 | 0.0038 | 68.8000 | 26.5% |
 * | 256 | 0.0227 | 46.4633 | 0.0058 | 181.7459 | 25.6% |
 * | 512 | 0.0573 | 73.2857 | 0.0285 | 147.3939 | 49.7% |
 * | 1024 | 0.1797 | 93.4307 | 0.1069 | 157.1022 | 59.5% |
 * | 1280 | 0.2683 | 97.7863 | 0.1575 | 166.5664 | 58.7% |
 * | 2048 | 0.6842 | 98.1373 | 0.3971 | 169.0986 | 58.0% |
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
 * | 32 | 0.0066 | 2.5507 | 0.0038 | 4.4184 | 57.7% |
 * | 64 | 0.0068 | 9.8578 | 0.0037 | 17.7778 | 55.5% |
 * | 128 | 0.0078 | 33.9753 | 0.0039 | 67.1219 | 50.6% |
 * | 256 | 0.0118 | 89.3913 | 0.0058 | 180.7473 | 49.5% |
 * | 512 | 0.0348 | 120.7059 | 0.0282 | 149.2364 | 80.9% |
 * | 1024 | 0.1131 | 148.5213 | 0.1013 | 165.7350 | 89.6% |
 * | 1280 | 0.1752 | 149.7288 | 0.1566 | 167.4852 | 89.4% |
 * | 2048 | 0.4334 | 154.9098 | 0.3949 | 170.0167 | 91.1% |
 * | 4096 | 1.6592 | 161.8225 | 1.5931 | 168.5395 | 96.0% |
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
 * | 32 | 0.0082 | 2.0625 | 0.0016 | 10.5600 | 19.5% |
 * | 64 | 0.0082 | 8.1250 | 0.0016 | 42.0202 | 19.3% |
 * | 128 | 0.0096 | 27.6583 | 0.0016 | 165.1200 | 16.8% |
 * | 256 | 0.0150 | 70.3658 | 0.0016 | 671.3470 | 10.5% |
 * | 512 | 0.0383 | 109.7143 | 0.0016 | 2680.1633 | 4.1% |
 * | 1024 | 0.1228 | 136.8092 | 0.0016 | 10820.6182 | 1.3% |
 * | 1280 | 0.1823 | 143.9326 | 0.0016 | 16731.4297 | 0.9% |
 * | 2048 | 0.4529 | 148.2443 | 0.0016 | 40741.2812 | 0.4% |
 * | 4096 | 1.7308 | 155.1355 | 0.0015 | 174805.3281 | 0.1% |
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
 * | 32 | 0.0066 | 2.5507 | 0.0037 | 4.5128 | 56.5% |
 * | 64 | 0.0067 | 9.9522 | 0.0037 | 17.7778 | 56.0% |
 * | 128 | 0.0079 | 33.6293 | 0.0039 | 67.6721 | 49.7% |
 * | 256 | 0.0116 | 90.4979 | 0.0057 | 184.2913 | 49.1% |
 * | 512 | 0.0348 | 120.9282 | 0.0282 | 149.2364 | 81.0% |
 * | 1024 | 0.1132 | 148.3953 | 0.1013 | 165.8398 | 89.5% |
 * | 1280 | 0.1753 | 149.6605 | 0.1565 | 167.5879 | 89.3% |
 * | 2048 | 0.4327 | 155.1733 | 0.3950 | 169.9754 | 91.3% |
 * | 4096 | 1.6609 | 161.6572 | 1.5932 | 168.5294 | 95.9% |
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
 * | 32 | 0.0066 | 2.5631 | 0.0042 | 4.0000 | 64.1% |
 * | 64 | 0.0067 | 9.9522 | 0.0043 | 15.6391 | 63.6% |
 * | 128 | 0.0079 | 33.6293 | 0.0045 | 58.3463 | 57.6% |
 * | 256 | 0.0115 | 91.5049 | 0.0069 | 151.9446 | 60.2% |
 * | 512 | 0.0348 | 120.7059 | 0.0287 | 146.5714 | 82.4% |
 * | 1024 | 0.1130 | 148.6686 | 0.1004 | 167.2136 | 88.9% |
 * | 1280 | 0.1752 | 149.7288 | 0.1549 | 169.3185 | 88.4% |
 * | 2048 | 0.4331 | 155.0185 | 0.3892 | 172.5332 | 89.8% |
 * | 4096 | 1.6589 | 161.8552 | 1.5683 | 171.2082 | 94.5% |
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
 * | 32 | 0.0066 | 2.5507 | 0.0040 | 4.1905 | 60.9% |
 * | 64 | 0.0067 | 9.9048 | 0.0038 | 17.3333 | 57.1% |
 * | 128 | 0.0078 | 33.9753 | 0.0039 | 67.1219 | 50.6% |
 * | 256 | 0.0116 | 90.6226 | 0.0058 | 181.7459 | 49.9% |
 * | 512 | 0.0348 | 120.7059 | 0.0283 | 148.5611 | 81.2% |
 * | 1024 | 0.1130 | 148.5844 | 0.1014 | 165.5520 | 89.8% |
 * | 1280 | 0.1755 | 149.4967 | 0.1564 | 167.7250 | 89.1% |
 * | 2048 | 0.4331 | 155.0185 | 0.3949 | 170.0305 | 91.2% |
 * | 4096 | 1.6593 | 161.8131 | 1.5933 | 168.5141 | 96.0% |
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
 * | 32 | 0.0066 | 2.5507 |
 * | 64 | 0.0068 | 9.8578 |
 * | 128 | 0.0078 | 34.0454 |
 * | 256 | 0.0116 | 90.9986 |
 * | 512 | 0.0348 | 120.7059 |
 * | 1024 | 0.1128 | 148.8583 |
 * | 1280 | 0.1748 | 150.0439 |
 * | 2048 | 0.4339 | 154.7327 |
 * | 4096 | 1.6555 | 162.1853 |
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
 * | 32 | 0.0066 | 2.5507 |
 * | 64 | 0.0067 | 9.9522 |
 * | 128 | 0.0076 | 34.5439 |
 * | 256 | 0.0115 | 91.6323 |
 * | 512 | 0.0348 | 120.7059 |
 * | 1024 | 0.1128 | 148.8372 |
 * | 1280 | 0.1756 | 149.3878 |
 * | 2048 | 0.4326 | 155.2135 |
 * | 4096 | 1.6609 | 161.6603 |
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
