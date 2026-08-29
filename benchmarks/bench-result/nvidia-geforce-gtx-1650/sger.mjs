/**
 * Benchmark results for sger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.3891 | 57.6% |
 * | 64 | 0.0061 | 5.4167 | 0.0038 | 8.6667 | 62.5% |
 * | 128 | 0.0065 | 20.4356 | 0.0038 | 34.8354 | 58.7% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 117.0676 | 54.9% |
 * | 512 | 0.0157 | 133.7352 | 0.0125 | 167.9386 | 79.6% |
 * | 1024 | 0.0563 | 149.2605 | 0.0557 | 150.6315 | 99.1% |
 * | 1280 | 0.0898 | 146.1130 | 0.0874 | 150.0165 | 97.4% |
 * | 2048 | 0.2165 | 155.0415 | 0.2137 | 157.1197 | 98.7% |
 * | 4096 | 0.8478 | 158.3591 | 0.8479 | 158.3382 | 100.0% |
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
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4000 | 57.3% |
 * | 64 | 0.0063 | 5.3197 | 0.0039 | 8.5246 | 62.4% |
 * | 128 | 0.0066 | 19.9420 | 0.0038 | 34.8354 | 57.2% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 113.8270 | 56.4% |
 * | 512 | 0.0164 | 128.2500 | 0.0142 | 148.2257 | 86.5% |
 * | 1024 | 0.0570 | 147.2503 | 0.0562 | 149.3030 | 98.6% |
 * | 1280 | 0.0901 | 145.5682 | 0.0877 | 149.5513 | 97.3% |
 * | 2048 | 0.2180 | 154.0285 | 0.2137 | 157.1197 | 98.0% |
 * | 4096 | 0.8485 | 158.2247 | 0.8482 | 158.2784 | 100.0% |
 *
 * ![sger-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride4.svg)
 *
 * ![sger-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0044 | 1.9412 | 70.8% |
 * | 64 | 0.0064 | 5.2261 | 0.0039 | 8.5950 | 60.8% |
 * | 128 | 0.0080 | 16.4790 | 0.0039 | 34.1157 | 48.3% |
 * | 256 | 0.0131 | 40.0682 | 0.0048 | 110.3893 | 36.3% |
 * | 512 | 0.0358 | 58.6810 | 0.0172 | 122.3933 | 47.9% |
 * | 1024 | 0.1434 | 58.5714 | 0.0566 | 148.3324 | 39.5% |
 * | 1280 | 0.2238 | 58.6228 | 0.0879 | 149.1703 | 39.3% |
 * | 2048 | 0.5704 | 58.8549 | 0.2146 | 156.4169 | 37.6% |
 * | 4096 | 2.2586 | 59.4395 | 0.9700 | 138.4071 | 42.9% |
 *
 * ![sger-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride32.svg)
 *
 * ![sger-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4220 | 56.8% |
 * | 64 | 0.0065 | 5.0980 | 0.0034 | 9.8113 | 52.0% |
 * | 128 | 0.0080 | 16.4135 | 0.0036 | 36.3700 | 45.1% |
 * | 256 | 0.0136 | 38.7012 | 0.0047 | 111.1351 | 34.8% |
 * | 512 | 0.0362 | 58.0327 | 0.0173 | 121.6000 | 47.7% |
 * | 1024 | 0.1434 | 58.5584 | 0.0567 | 148.1649 | 39.5% |
 * | 1280 | 0.2248 | 58.3433 | 0.0881 | 148.9535 | 39.2% |
 * | 2048 | 0.5704 | 58.8582 | 0.2149 | 156.1840 | 37.7% |
 * | 4096 | 2.2733 | 59.0559 | 1.0057 | 133.4944 | 44.2% |
 *
 * ![sger-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-stride256.svg)
 *
 * ![sger-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/stride.sger.js) — WebGPU stride-sweep benchmark script
 * - [stride.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/stride.sger.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0061 | 1.3750 | 0.0042 | 2.0000 | 68.8% |
 * | 64 | 0.0061 | 5.4167 | 0.0039 | 8.5950 | 63.0% |
 * | 128 | 0.0065 | 20.2850 | 0.0038 | 34.6891 | 58.5% |
 * | 256 | 0.0081 | 64.7559 | 0.0047 | 112.2730 | 57.7% |
 * | 512 | 0.0158 | 132.9231 | 0.0171 | 122.8513 | 108.2% |
 * | 1024 | 0.0563 | 149.2605 | 0.0558 | 150.3725 | 99.3% |
 * | 1280 | 0.0898 | 146.0349 | 0.0875 | 149.9616 | 97.4% |
 * | 2048 | 0.2162 | 155.2709 | 0.2133 | 157.3789 | 98.7% |
 * | 4096 | 0.8457 | 158.7396 | 0.8480 | 158.3083 | 100.3% |
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
 * | 32 | 0.0061 | 1.3750 | 0.0038 | 2.2373 | 61.5% |
 * | 64 | 0.0061 | 5.4167 | 0.0036 | 9.2444 | 58.6% |
 * | 128 | 0.0067 | 19.8462 | 0.0037 | 35.7403 | 55.5% |
 * | 256 | 0.0082 | 64.2500 | 0.0050 | 105.7749 | 60.7% |
 * | 512 | 0.0187 | 112.4384 | 0.0147 | 143.0588 | 78.6% |
 * | 1024 | 0.1008 | 83.2752 | 0.0744 | 112.8845 | 73.8% |
 * | 1280 | 0.1652 | 79.4265 | 0.1167 | 112.4146 | 70.7% |
 * | 2048 | 0.3994 | 84.0615 | 0.2931 | 114.5355 | 73.4% |
 * | 4096 | 1.5094 | 88.9434 | 1.1857 | 113.2220 | 78.6% |
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
 * | 32 | 0.0061 | 1.3750 | 0.0037 | 2.2957 | 59.9% |
 * | 64 | 0.0061 | 5.4167 | 0.0039 | 8.6307 | 62.8% |
 * | 128 | 0.0068 | 19.5640 | 0.0036 | 36.5310 | 53.6% |
 * | 256 | 0.0082 | 64.2500 | 0.0053 | 99.3837 | 64.6% |
 * | 512 | 0.0198 | 106.2524 | 0.0165 | 127.0097 | 83.7% |
 * | 1024 | 0.1044 | 80.3922 | 0.0735 | 114.2857 | 70.3% |
 * | 1280 | 0.1679 | 78.1098 | 0.1152 | 113.8192 | 68.6% |
 * | 2048 | 0.3901 | 86.0543 | 0.2970 | 113.0422 | 76.1% |
 * | 4096 | 1.4906 | 90.0652 | 1.1752 | 114.2394 | 78.8% |
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
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.4558 | 56.0% |
 * | 64 | 0.0061 | 5.4167 | 0.0033 | 10.0000 | 54.2% |
 * | 128 | 0.0066 | 19.9420 | 0.0036 | 37.0224 | 53.9% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 116.6525 | 55.1% |
 * | 512 | 0.0207 | 101.4900 | 0.0181 | 115.8095 | 87.6% |
 * | 1024 | 0.1024 | 82.0000 | 0.0734 | 114.3604 | 71.7% |
 * | 1280 | 0.1624 | 80.7485 | 0.1161 | 112.9879 | 71.5% |
 * | 2048 | 0.4002 | 83.8901 | 0.2931 | 114.5417 | 73.2% |
 * | 4096 | 1.4832 | 90.5131 | 1.1884 | 112.9644 | 80.1% |
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
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.4673 | 55.7% |
 * | 64 | 0.0061 | 5.4167 | 0.0034 | 9.8113 | 55.2% |
 * | 128 | 0.0067 | 19.7512 | 0.0036 | 37.1892 | 53.1% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 116.2403 | 55.3% |
 * | 512 | 0.0167 | 126.0345 | 0.0150 | 139.7106 | 90.2% |
 * | 1024 | 0.0578 | 145.2935 | 0.0573 | 146.5922 | 99.1% |
 * | 1280 | 0.0885 | 148.1460 | 0.0881 | 148.9535 | 99.5% |
 * | 2048 | 0.2171 | 154.6529 | 0.2191 | 153.1963 | 101.0% |
 * | 4096 | 0.8724 | 153.8779 | 0.8621 | 155.7315 | 98.8% |
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
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.5143 | 54.7% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.4545 | 57.3% |
 * | 128 | 0.0066 | 20.1366 | 0.0036 | 36.6933 | 54.9% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 116.6525 | 55.1% |
 * | 512 | 0.0225 | 93.2727 | 0.0188 | 111.4839 | 83.7% |
 * | 1024 | 0.1040 | 80.7260 | 0.0749 | 112.1607 | 72.0% |
 * | 1280 | 0.1614 | 81.2608 | 0.1187 | 110.4906 | 73.5% |
 * | 2048 | 0.3961 | 84.7542 | 0.2949 | 113.8333 | 74.5% |
 * | 4096 | 1.5014 | 89.4164 | 1.1886 | 112.9461 | 79.2% |
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
 * | 32 | 0.0062 | 1.3608 | 0.0035 | 2.4332 | 55.9% |
 * | 64 | 0.0061 | 5.4167 | 0.0034 | 9.9048 | 54.7% |
 * | 128 | 0.0068 | 19.5177 | 0.0036 | 36.8571 | 53.0% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 115.8310 | 55.5% |
 * | 512 | 0.0164 | 128.2500 | 0.0150 | 139.8594 | 91.7% |
 * | 1024 | 0.0594 | 141.3793 | 0.0568 | 147.8726 | 95.6% |
 * | 1280 | 0.0887 | 147.9055 | 0.0885 | 148.1996 | 99.8% |
 * | 2048 | 0.2258 | 148.6697 | 0.2229 | 150.5904 | 98.7% |
 * | 4096 | 0.8724 | 153.8779 | 0.8831 | 152.0184 | 101.2% |
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
 * | 32 | 0.0061 | 1.3750 | 0.0039 | 2.1909 | 62.8% |
 * | 64 | 0.0063 | 5.3061 | 0.0036 | 9.2857 | 57.1% |
 * | 128 | 0.0068 | 19.4717 | 0.0036 | 36.2105 | 53.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 114.2222 | 56.3% |
 * | 512 | 0.0164 | 127.8754 | 0.0150 | 139.7106 | 91.5% |
 * | 1024 | 0.0581 | 144.5730 | 0.0572 | 146.8383 | 98.5% |
 * | 1280 | 0.0912 | 143.8821 | 0.0880 | 148.9806 | 96.6% |
 * | 2048 | 0.2273 | 147.6757 | 0.2280 | 147.2404 | 100.3% |
 * | 4096 | 0.9423 | 142.4729 | 0.9073 | 147.9729 | 96.3% |
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
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.3891 | 57.6% |
 * | 64 | 0.0062 | 5.3886 | 0.0035 | 9.4977 | 56.7% |
 * | 128 | 0.0065 | 20.3350 | 0.0037 | 35.8956 | 56.7% |
 * | 256 | 0.0081 | 64.7559 | 0.0045 | 117.4857 | 55.1% |
 * | 512 | 0.0159 | 131.9879 | 0.0127 | 165.8182 | 79.6% |
 * | 1024 | 0.0563 | 149.0486 | 0.0556 | 151.0650 | 98.7% |
 * | 1280 | 0.0898 | 146.0870 | 0.0997 | 131.5322 | 111.1% |
 * | 2048 | 0.2159 | 155.5126 | 0.2142 | 156.6972 | 99.2% |
 * | 4096 | 0.8458 | 158.7215 | 0.8479 | 158.3382 | 100.2% |
 *
 * ![sger-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alphaneg3p75.svg)
 *
 * ![sger-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 1.1234 | 0.0014 | 6.0000 | 18.7% |
 * | 64 | 0.0077 | 4.2975 | 0.0014 | 23.6364 | 18.2% |
 * | 128 | 0.0082 | 16.1250 | 0.0014 | 91.7333 | 17.6% |
 * | 256 | 0.0100 | 52.8875 | 0.0014 | 378.1149 | 14.0% |
 * | 512 | 0.0184 | 114.0000 | 0.0015 | 1367.9999 | 8.3% |
 * | 1024 | 0.0604 | 138.9463 | 0.0015 | 5704.3477 | 2.4% |
 * | 1280 | 0.0930 | 140.9871 | 0.0017 | 7883.0767 | 1.8% |
 * | 2048 | 0.2213 | 151.6681 | 0.0014 | 24397.3945 | 0.6% |
 * | 4096 | 0.8561 | 156.8142 | 0.0016 | 85618.9453 | 0.2% |
 *
 * ![sger-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha0.svg)
 *
 * ![sger-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0061 | 5.4167 | 0.0036 | 9.1228 | 59.4% |
 * | 128 | 0.0065 | 20.4356 | 0.0035 | 37.8716 | 54.0% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 115.0210 | 55.9% |
 * | 512 | 0.0158 | 133.3279 | 0.0126 | 167.0840 | 79.8% |
 * | 1024 | 0.0565 | 148.7107 | 0.0557 | 150.6315 | 98.7% |
 * | 1280 | 0.0895 | 146.5046 | 0.0875 | 149.9890 | 97.7% |
 * | 2048 | 0.2161 | 155.3514 | 0.2131 | 157.5325 | 98.6% |
 * | 4096 | 0.8458 | 158.7276 | 0.8479 | 158.3382 | 100.2% |
 *
 * ![sger-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha1eneg38.svg)
 *
 * ![sger-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.2662 | 0.0040 | 2.1036 | 60.2% |
 * | 64 | 0.0068 | 4.9289 | 0.0040 | 8.2540 | 59.7% |
 * | 128 | 0.0071 | 18.6366 | 0.0041 | 32.2500 | 57.8% |
 * | 256 | 0.0087 | 60.2491 | 0.0054 | 96.7530 | 62.3% |
 * | 512 | 0.0165 | 127.5029 | 0.0134 | 156.3428 | 81.6% |
 * | 1024 | 0.0573 | 146.4286 | 0.0563 | 149.0486 | 98.2% |
 * | 1280 | 0.0901 | 145.5165 | 0.0879 | 149.2789 | 97.5% |
 * | 2048 | 0.2173 | 154.4594 | 0.2138 | 157.0374 | 98.4% |
 * | 4096 | 0.8455 | 158.7906 | 0.8490 | 158.1353 | 100.4% |
 *
 * ![sger-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha1.svg)
 *
 * ![sger-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 1.2692 | 0.0034 | 2.4673 | 51.4% |
 * | 64 | 0.0069 | 4.8485 | 0.0037 | 9.0435 | 53.6% |
 * | 128 | 0.0077 | 17.1642 | 0.0036 | 36.6933 | 46.8% |
 * | 256 | 0.0087 | 60.2491 | 0.0046 | 115.0210 | 52.4% |
 * | 512 | 0.0165 | 127.1326 | 0.0128 | 164.3654 | 77.3% |
 * | 1024 | 0.0573 | 146.4286 | 0.0565 | 148.5003 | 98.6% |
 * | 1280 | 0.0903 | 145.2587 | 0.0877 | 149.6332 | 97.1% |
 * | 2048 | 0.2176 | 154.2890 | 0.2134 | 157.3317 | 98.1% |
 * | 4096 | 0.8438 | 159.1068 | 0.8476 | 158.3860 | 100.5% |
 *
 * ![sger-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-alpha2p5.svg)
 *
 * ![sger-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/alpha.sger.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/alpha.sger.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0072 | 1.1707 |
 * | 64 | 0.0066 | 5.0363 |
 * | 128 | 0.0068 | 19.3803 |
 * | 256 | 0.0084 | 62.5399 |
 * | 512 | 0.0164 | 128.2500 |
 * | 1024 | 0.0572 | 146.8794 |
 * | 1280 | 0.0901 | 145.5682 |
 * | 2048 | 0.2170 | 154.6871 |
 * | 4096 | 0.8454 | 158.7936 |
 *
 * ![sger-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-layoutcolumnmajor.svg)
 *
 * ![sger-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0072 | 1.1681 |
 * | 64 | 0.0073 | 4.5815 |
 * | 128 | 0.0078 | 16.8834 |
 * | 256 | 0.0100 | 52.8026 |
 * | 512 | 0.0184 | 114.0000 |
 * | 1024 | 0.0606 | 138.5794 |
 * | 1280 | 0.0925 | 141.7427 |
 * | 2048 | 0.2216 | 151.5147 |
 * | 4096 | 0.8581 | 156.4516 |
 *
 * ![sger-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/gbps-layoutrowmajor.svg)
 *
 * ![sger-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sger/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/layout.sger.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sger
 */
