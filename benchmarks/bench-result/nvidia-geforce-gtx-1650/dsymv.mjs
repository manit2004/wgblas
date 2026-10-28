/**
 * Benchmark results for dsymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.6047 | 0.0038 | 1.3000 | 46.5% |
 * | 64 | 0.0084 | 2.1597 | 0.0043 | 4.2388 | 51.0% |
 * | 128 | 0.0116 | 5.9751 | 0.0054 | 12.8571 | 46.5% |
 * | 256 | 0.0185 | 14.5606 | 0.0071 | 37.9955 | 38.3% |
 * | 512 | 0.0418 | 25.4334 | 0.0155 | 68.4866 | 37.1% |
 * | 1024 | 0.1231 | 34.3131 | 0.0594 | 71.1034 | 48.3% |
 * | 1280 | 0.1828 | 36.0504 | 0.0821 | 80.2807 | 44.9% |
 * | 2048 | 0.4280 | 39.3301 | 0.1963 | 85.7436 | 45.9% |
 * | 4096 | 1.6114 | 41.7177 | 0.7721 | 87.0663 | 47.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![dsymv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-default.svg)
 *
 * ![dsymv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-default.svg)
 *
 * ## See also
 *
 * - [dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/dsymv.js) — WebGPU benchmark script
 * - [dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/dsymv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0083 | 0.5736 | 0.0040 | 1.1984 | 47.9% |
 * | 64 | 0.0087 | 2.0407 | 0.0043 | 4.0889 | 49.9% |
 * | 128 | 0.0122 | 5.6000 | 0.0055 | 12.3006 | 45.5% |
 * | 256 | 0.0186 | 14.3629 | 0.0074 | 36.0000 | 39.9% |
 * | 512 | 0.0422 | 25.1047 | 0.0159 | 66.4418 | 37.8% |
 * | 1024 | 0.1235 | 34.1223 | 0.0614 | 68.6000 | 49.7% |
 * | 1280 | 0.1826 | 36.0291 | 0.0840 | 78.3537 | 46.0% |
 * | 2048 | 0.4287 | 39.2288 | 0.2007 | 83.7959 | 46.8% |
 * | 4096 | 1.6179 | 41.5291 | 0.7823 | 85.8848 | 48.4% |
 *
 * ![dsymv-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride4.svg)
 *
 * ![dsymv-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5627 | 0.0039 | 1.2131 | 46.4% |
 * | 64 | 0.0086 | 2.0559 | 0.0043 | 4.0889 | 50.3% |
 * | 128 | 0.0118 | 5.7669 | 0.0055 | 12.4809 | 46.2% |
 * | 256 | 0.0186 | 14.3629 | 0.0072 | 37.2857 | 38.5% |
 * | 512 | 0.0419 | 25.2484 | 0.0161 | 65.7160 | 38.4% |
 * | 1024 | 0.1232 | 34.2198 | 0.0614 | 68.6536 | 49.8% |
 * | 1280 | 0.1826 | 36.0228 | 0.0840 | 78.3387 | 46.0% |
 * | 2048 | 0.4280 | 39.2919 | 0.2009 | 83.7292 | 46.9% |
 * | 4096 | 1.6144 | 41.6188 | 0.7844 | 85.6606 | 48.6% |
 *
 * ![dsymv-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride5.svg)
 *
 * ![dsymv-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5725 | 0.0039 | 1.2131 | 47.2% |
 * | 64 | 0.0094 | 1.8712 | 0.0043 | 4.0889 | 45.8% |
 * | 128 | 0.0145 | 4.7080 | 0.0055 | 12.4444 | 37.8% |
 * | 256 | 0.0190 | 14.0843 | 0.0072 | 36.9558 | 38.1% |
 * | 512 | 0.0432 | 24.5096 | 0.0164 | 64.6250 | 37.9% |
 * | 1024 | 0.1290 | 32.6667 | 0.0620 | 67.9278 | 48.1% |
 * | 1280 | 0.1913 | 34.3841 | 0.0861 | 76.3886 | 45.0% |
 * | 2048 | 0.4504 | 37.3379 | 0.2040 | 82.4291 | 45.3% |
 * | 4096 | 1.6918 | 39.7154 | 0.7927 | 84.7615 | 46.9% |
 *
 * ![dsymv-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride32.svg)
 *
 * ![dsymv-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5736 | 0.0038 | 1.2333 | 46.5% |
 * | 64 | 0.0086 | 2.0559 | 0.0043 | 4.1041 | 50.1% |
 * | 128 | 0.0122 | 5.5634 | 0.0055 | 12.3721 | 45.0% |
 * | 256 | 0.0187 | 14.2647 | 0.0073 | 36.4716 | 39.1% |
 * | 512 | 0.0430 | 24.6374 | 0.0164 | 64.5620 | 38.2% |
 * | 1024 | 0.1254 | 33.6172 | 0.0624 | 67.4927 | 49.8% |
 * | 1280 | 0.1851 | 35.5402 | 0.0861 | 76.4454 | 46.5% |
 * | 2048 | 0.4335 | 38.7930 | 0.2038 | 82.5197 | 47.0% |
 * | 4096 | 1.6337 | 41.1277 | 0.7939 | 84.6334 | 48.6% |
 *
 * ![dsymv-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride33.svg)
 *
 * ![dsymv-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5627 | 0.0039 | 1.2082 | 46.6% |
 * | 64 | 0.0088 | 2.0073 | 0.0043 | 4.1194 | 48.7% |
 * | 128 | 0.0123 | 5.5417 | 0.0054 | 12.7045 | 43.6% |
 * | 256 | 0.0189 | 14.1439 | 0.0073 | 36.6316 | 38.6% |
 * | 512 | 0.0430 | 24.6190 | 0.0166 | 63.8149 | 38.6% |
 * | 1024 | 0.1260 | 33.4422 | 0.0632 | 66.7234 | 50.1% |
 * | 1280 | 0.1864 | 35.3022 | 0.0870 | 75.6299 | 46.7% |
 * | 2048 | 0.4344 | 38.7144 | 0.2050 | 82.0495 | 47.2% |
 * | 4096 | 1.6499 | 40.7237 | 0.7971 | 84.2953 | 48.3% |
 *
 * ![dsymv-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride255.svg)
 *
 * ![dsymv-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0086 | 0.5502 | 0.0039 | 1.2131 | 45.4% |
 * | 64 | 0.0097 | 1.8278 | 0.0043 | 4.1041 | 44.5% |
 * | 128 | 0.0148 | 4.6161 | 0.0054 | 12.6291 | 36.6% |
 * | 256 | 0.0195 | 13.6918 | 0.0073 | 36.7929 | 37.2% |
 * | 512 | 0.0446 | 23.7445 | 0.0164 | 64.6250 | 36.7% |
 * | 1024 | 0.1294 | 32.5697 | 0.0626 | 67.3547 | 48.4% |
 * | 1280 | 0.1925 | 34.1812 | 0.0863 | 76.2328 | 44.8% |
 * | 2048 | 0.4500 | 37.3697 | 0.2048 | 82.1200 | 45.5% |
 * | 4096 | 1.6965 | 39.6064 | 0.7971 | 84.2919 | 47.0% |
 *
 * ![dsymv-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-stride256.svg)
 *
 * ![dsymv-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/stride.dsymv.js) — WebGPU stride-sweep benchmark script
 * - [stride.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/stride.dsymv.c) — CUDA / cuBLAS stride-sweep reference script
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
 * | 32 | 0.0084 | 0.5670 | 0.0038 | 1.2333 | 46.0% |
 * | 64 | 0.0086 | 2.0597 | 0.0043 | 4.0889 | 50.4% |
 * | 128 | 0.0117 | 5.8142 | 0.0053 | 12.8193 | 45.4% |
 * | 256 | 0.0185 | 14.4498 | 0.0072 | 37.0377 | 39.0% |
 * | 512 | 0.0421 | 25.1524 | 0.0156 | 67.8728 | 37.1% |
 * | 1024 | 0.1229 | 34.3000 | 0.0594 | 70.9655 | 48.3% |
 * | 1280 | 0.1823 | 36.0955 | 0.0821 | 80.1403 | 45.0% |
 * | 2048 | 0.4269 | 39.3994 | 0.1963 | 85.6951 | 46.0% |
 * | 4096 | 1.6108 | 41.7131 | 0.7721 | 87.0239 | 47.9% |
 *
 * ![dsymv-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-uplolower.svg)
 *
 * ![dsymv-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5714 | 0.0038 | 1.2437 | 45.9% |
 * | 64 | 0.0086 | 2.0597 | 0.0043 | 4.1194 | 50.0% |
 * | 128 | 0.0118 | 5.7826 | 0.0054 | 12.6291 | 45.8% |
 * | 256 | 0.0186 | 14.3752 | 0.0078 | 34.2998 | 41.9% |
 * | 512 | 0.0418 | 25.3257 | 0.0160 | 66.3751 | 38.2% |
 * | 1024 | 0.1230 | 34.2554 | 0.0617 | 68.3154 | 50.1% |
 * | 1280 | 0.1838 | 35.7939 | 0.0840 | 78.3537 | 45.7% |
 * | 2048 | 0.4280 | 39.2977 | 0.2021 | 83.1990 | 47.2% |
 * | 4096 | 1.6107 | 41.7148 | 0.7956 | 84.4513 | 49.4% |
 *
 * ![dsymv-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-uploupper.svg)
 *
 * ![dsymv-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/uplo.dsymv.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/uplo.dsymv.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0083 | 0.6047 | 0.0039 | 1.2735 | 47.5% |
 * | 64 | 0.0086 | 2.1115 | 0.0043 | 4.2707 | 49.4% |
 * | 128 | 0.0119 | 5.8143 | 0.0054 | 12.7434 | 45.6% |
 * | 256 | 0.0184 | 14.6111 | 0.0072 | 37.2389 | 39.2% |
 * | 512 | 0.0419 | 25.3751 | 0.0155 | 68.5573 | 37.0% |
 * | 1024 | 0.1229 | 34.3667 | 0.0594 | 71.1034 | 48.3% |
 * | 1280 | 0.1820 | 36.1962 | 0.0821 | 80.2807 | 45.1% |
 * | 2048 | 0.4275 | 39.3831 | 0.1962 | 85.7926 | 45.9% |
 * | 4096 | 1.6104 | 41.7426 | 0.7721 | 87.0645 | 47.9% |
 *
 * ![dsymv-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad0.svg)
 *
 * ![dsymv-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5977 | 0.0039 | 1.2787 | 46.7% |
 * | 64 | 0.0085 | 2.1273 | 0.0043 | 4.2547 | 50.0% |
 * | 128 | 0.0109 | 6.3343 | 0.0053 | 12.9341 | 49.0% |
 * | 256 | 0.0185 | 14.5606 | 0.0074 | 36.4329 | 40.0% |
 * | 512 | 0.0424 | 25.0971 | 0.0164 | 64.7485 | 38.8% |
 * | 1024 | 0.1234 | 34.2108 | 0.0595 | 70.9315 | 48.2% |
 * | 1280 | 0.1828 | 36.0410 | 0.0832 | 79.2457 | 45.5% |
 * | 2048 | 0.4285 | 39.2876 | 0.1982 | 84.9338 | 46.3% |
 *
 * ![dsymv-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad1.svg)
 *
 * ![dsymv-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.6035 | 0.0039 | 1.2787 | 47.2% |
 * | 64 | 0.0084 | 2.1515 | 0.0043 | 4.2388 | 50.8% |
 * | 128 | 0.0114 | 6.0674 | 0.0054 | 12.7811 | 47.5% |
 * | 256 | 0.0185 | 14.5732 | 0.0078 | 34.7052 | 42.0% |
 * | 512 | 0.0422 | 25.1827 | 0.0163 | 65.2574 | 38.6% |
 * | 1024 | 0.1236 | 34.1709 | 0.0594 | 71.1034 | 48.1% |
 * | 1280 | 0.1838 | 35.8527 | 0.0826 | 79.7676 | 44.9% |
 * | 2048 | 0.4280 | 39.3287 | 0.1983 | 84.8927 | 46.3% |
 *
 * ![dsymv-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad8.svg)
 *
 * ![dsymv-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.6047 | 0.0039 | 1.2787 | 47.3% |
 * | 64 | 0.0084 | 2.1515 | 0.0043 | 4.2707 | 50.4% |
 * | 128 | 0.0136 | 5.0943 | 0.0053 | 12.9341 | 39.4% |
 * | 256 | 0.0204 | 13.2016 | 0.0073 | 36.8315 | 35.8% |
 * | 512 | 0.0465 | 22.8760 | 0.0162 | 65.6443 | 34.8% |
 * | 1024 | 0.1382 | 30.5552 | 0.0595 | 70.9887 | 43.0% |
 * | 1280 | 0.2111 | 31.2189 | 0.0821 | 80.2182 | 38.9% |
 * | 2048 | 0.5010 | 33.6025 | 0.1974 | 85.2780 | 39.4% |
 *
 * ![dsymv-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad32.svg)
 *
 * ![dsymv-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0096 | 0.5191 | 0.0038 | 1.3000 | 39.9% |
 * | 64 | 0.0094 | 1.9320 | 0.0043 | 4.2707 | 45.2% |
 * | 128 | 0.0134 | 5.1429 | 0.0053 | 12.9730 | 39.6% |
 * | 256 | 0.0205 | 13.1500 | 0.0072 | 37.6555 | 34.9% |
 * | 512 | 0.0452 | 23.4991 | 0.0162 | 65.4502 | 35.9% |
 * | 1024 | 0.1336 | 31.6129 | 0.0594 | 71.1034 | 44.5% |
 * | 1280 | 0.1983 | 33.2343 | 0.0825 | 79.9069 | 41.6% |
 * | 2048 | 0.4641 | 36.2751 | 0.1966 | 85.6250 | 42.4% |
 *
 * ![dsymv-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad64.svg)
 *
 * ![dsymv-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0088 | 0.5704 | 0.0037 | 1.3448 | 42.4% |
 * | 64 | 0.0088 | 2.0655 | 0.0043 | 4.2707 | 48.4% |
 * | 128 | 0.0118 | 5.8378 | 0.0053 | 12.9341 | 45.1% |
 * | 256 | 0.0185 | 14.5354 | 0.0074 | 36.5119 | 39.8% |
 * | 512 | 0.0418 | 25.4529 | 0.0162 | 65.7092 | 38.7% |
 * | 1024 | 0.1231 | 34.3041 | 0.0607 | 69.5484 | 49.3% |
 * | 1280 | 0.1823 | 36.1517 | 0.0822 | 80.1245 | 45.1% |
 * | 2048 | 0.4280 | 39.3301 | 0.1973 | 85.3195 | 46.1% |
 *
 * ![dsymv-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-pad128.svg)
 *
 * ![dsymv-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/lda.dsymv.js) — WebGPU lda-sweep benchmark script
 * - [lda.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/lda.dsymv.c) — CUDA / cuBLAS lda-sweep reference script
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
 * | 32 | 0.0083 | 0.5736 | 0.0038 | 1.2333 | 46.5% |
 * | 64 | 0.0085 | 2.0752 | 0.0043 | 4.1504 | 50.0% |
 * | 128 | 0.0118 | 5.7826 | 0.0052 | 13.0153 | 44.4% |
 * | 256 | 0.0184 | 14.5000 | 0.0071 | 37.4529 | 38.7% |
 * | 512 | 0.0416 | 25.4327 | 0.0156 | 67.8728 | 37.5% |
 * | 1024 | 0.1229 | 34.3000 | 0.0594 | 70.9655 | 48.3% |
 * | 1280 | 0.1823 | 36.0955 | 0.0820 | 80.1872 | 45.0% |
 * | 2048 | 0.4269 | 39.3964 | 0.1960 | 85.8140 | 45.9% |
 * | 4096 | 1.6108 | 41.7119 | 0.7721 | 87.0275 | 47.9% |
 *
 * ![dsymv-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alphaneg3p75.svg)
 *
 * ![dsymv-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5748 | 0.0039 | 1.2282 | 46.8% |
 * | 64 | 0.0087 | 2.0369 | 0.0043 | 4.1194 | 49.4% |
 * | 128 | 0.0118 | 5.7669 | 0.0055 | 12.4444 | 46.3% |
 * | 256 | 0.0185 | 14.4249 | 0.0072 | 37.2857 | 38.7% |
 * | 512 | 0.0421 | 25.1333 | 0.0157 | 67.5265 | 37.2% |
 * | 1024 | 0.1229 | 34.3000 | 0.0594 | 70.9655 | 48.3% |
 * | 1280 | 0.1821 | 36.1304 | 0.0822 | 80.0779 | 45.1% |
 * | 2048 | 0.4272 | 39.3654 | 0.1962 | 85.7230 | 45.9% |
 * | 4096 | 1.6105 | 41.7210 | 0.7721 | 87.0239 | 47.9% |
 *
 * ![dsymv-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha0.svg)
 *
 * ![dsymv-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5649 | 0.0038 | 1.2333 | 45.8% |
 * | 64 | 0.0086 | 2.0597 | 0.0043 | 4.1504 | 49.6% |
 * | 128 | 0.0121 | 5.6296 | 0.0052 | 12.9756 | 43.4% |
 * | 256 | 0.0185 | 14.4124 | 0.0071 | 37.6216 | 38.3% |
 * | 512 | 0.0421 | 25.1524 | 0.0156 | 67.9425 | 37.0% |
 * | 1024 | 0.1229 | 34.2821 | 0.0594 | 71.0038 | 48.3% |
 * | 1280 | 0.1823 | 36.0955 | 0.0820 | 80.1872 | 45.0% |
 * | 2048 | 0.4275 | 39.3419 | 0.1959 | 85.8350 | 45.8% |
 * | 4096 | 1.6106 | 41.7185 | 0.7721 | 87.0239 | 47.9% |
 *
 * ![dsymv-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha1eneg38.svg)
 *
 * ![dsymv-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5736 | 0.0038 | 1.2333 | 46.5% |
 * | 64 | 0.0085 | 2.0830 | 0.0043 | 4.1194 | 50.6% |
 * | 128 | 0.0118 | 5.7669 | 0.0054 | 12.5917 | 45.8% |
 * | 256 | 0.0185 | 14.4249 | 0.0072 | 36.9558 | 39.0% |
 * | 512 | 0.0417 | 25.3645 | 0.0156 | 67.9425 | 37.3% |
 * | 1024 | 0.1229 | 34.3000 | 0.0594 | 70.9655 | 48.3% |
 * | 1280 | 0.1823 | 36.0955 | 0.0820 | 80.1872 | 45.0% |
 * | 2048 | 0.4269 | 39.3979 | 0.1960 | 85.8000 | 45.9% |
 * | 4096 | 1.6114 | 41.6969 | 0.7721 | 87.0239 | 47.9% |
 *
 * ![dsymv-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha1.svg)
 *
 * ![dsymv-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.5670 | 0.0038 | 1.2437 | 45.6% |
 * | 64 | 0.0087 | 2.0369 | 0.0043 | 4.1194 | 49.4% |
 * | 128 | 0.0117 | 5.7984 | 0.0054 | 12.5546 | 46.2% |
 * | 256 | 0.0186 | 14.3752 | 0.0072 | 37.0377 | 38.8% |
 * | 512 | 0.0421 | 25.1238 | 0.0156 | 67.8728 | 37.0% |
 * | 1024 | 0.1232 | 34.1976 | 0.0594 | 70.9655 | 48.2% |
 * | 1280 | 0.1823 | 36.0955 | 0.0821 | 80.1247 | 45.0% |
 * | 2048 | 0.4276 | 39.3316 | 0.1961 | 85.7440 | 45.9% |
 * | 4096 | 1.6113 | 41.6986 | 0.7718 | 87.0581 | 47.9% |
 *
 * ![dsymv-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-alpha2p5.svg)
 *
 * ![dsymv-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/alpha.dsymv.js) — WebGPU alpha-sweep benchmark script
 * - [alpha.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/alpha.dsymv.c) — CUDA / cuBLAS alpha-sweep reference script
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
 * | 32 | 0.0082 | 0.5759 | 0.0039 | 1.2033 | 47.9% |
 * | 64 | 0.0086 | 2.0444 | 0.0044 | 4.0000 | 51.1% |
 * | 128 | 0.0120 | 5.6975 | 0.0054 | 12.5546 | 45.4% |
 * | 256 | 0.0185 | 14.4373 | 0.0074 | 36.1558 | 39.9% |
 * | 512 | 0.0420 | 25.1907 | 0.0161 | 65.9124 | 38.2% |
 * | 1024 | 0.1229 | 34.3000 | 0.0602 | 70.0596 | 49.0% |
 * | 1280 | 0.1823 | 36.0955 | 0.0829 | 79.3516 | 45.5% |
 * | 2048 | 0.4274 | 39.3478 | 0.1968 | 85.4791 | 46.0% |
 * | 4096 | 1.6111 | 41.7048 | 0.7719 | 87.0473 | 47.9% |
 *
 * ![dsymv-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-betaneg3p75.svg)
 *
 * ![dsymv-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5736 | 0.0038 | 1.2437 | 46.1% |
 * | 64 | 0.0085 | 2.0752 | 0.0043 | 4.1194 | 50.4% |
 * | 128 | 0.0119 | 5.7281 | 0.0055 | 12.4444 | 46.0% |
 * | 256 | 0.0186 | 14.4000 | 0.0072 | 36.9558 | 39.0% |
 * | 512 | 0.0422 | 25.0857 | 0.0156 | 68.0823 | 36.8% |
 * | 1024 | 0.1229 | 34.3000 | 0.0594 | 70.9655 | 48.3% |
 * | 1280 | 0.1823 | 36.0955 | 0.0822 | 80.0467 | 45.1% |
 * | 2048 | 0.4275 | 39.3448 | 0.1960 | 85.7860 | 45.9% |
 * | 4096 | 1.6103 | 41.7255 | 0.7721 | 87.0239 | 47.9% |
 *
 * ![dsymv-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-beta0.svg)
 *
 * ![dsymv-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5714 | 0.0040 | 1.1746 | 48.6% |
 * | 64 | 0.0084 | 2.0909 | 0.0044 | 3.9712 | 52.7% |
 * | 128 | 0.0118 | 5.7514 | 0.0055 | 12.4082 | 46.4% |
 * | 256 | 0.0186 | 14.4000 | 0.0074 | 36.2343 | 39.7% |
 * | 512 | 0.0419 | 25.2773 | 0.0161 | 65.6508 | 38.5% |
 * | 1024 | 0.1229 | 34.2911 | 0.0600 | 70.1903 | 48.9% |
 * | 1280 | 0.1823 | 36.0955 | 0.0830 | 79.2904 | 45.5% |
 * | 2048 | 0.4269 | 39.3964 | 0.1969 | 85.4304 | 46.1% |
 * | 4096 | 1.6116 | 41.6924 | 0.7723 | 86.9968 | 47.9% |
 *
 * ![dsymv-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-beta1.svg)
 *
 * ![dsymv-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5736 | 0.0041 | 1.1562 | 49.6% |
 * | 64 | 0.0086 | 2.0597 | 0.0044 | 4.0000 | 51.5% |
 * | 128 | 0.0118 | 5.7591 | 0.0057 | 11.9551 | 48.2% |
 * | 256 | 0.0186 | 14.3752 | 0.0074 | 36.2343 | 39.7% |
 * | 512 | 0.0420 | 25.2195 | 0.0159 | 66.7770 | 37.8% |
 * | 1024 | 0.1229 | 34.3000 | 0.0601 | 70.1716 | 48.9% |
 * | 1280 | 0.1823 | 36.0955 | 0.0829 | 79.3976 | 45.5% |
 * | 2048 | 0.4271 | 39.3802 | 0.1969 | 85.3957 | 46.1% |
 * | 4096 | 1.6109 | 41.7098 | 0.7721 | 87.0239 | 47.9% |
 *
 * ![dsymv-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-beta2p5.svg)
 *
 * ![dsymv-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/beta.dsymv.js) — WebGPU beta-sweep benchmark script
 * - [beta.dsymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/cuda/beta.dsymv.c) — CUDA / cuBLAS beta-sweep reference script
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
 * | 32 | 0.0083 | 0.5714 |
 * | 64 | 0.0085 | 2.0830 |
 * | 128 | 0.0116 | 5.8462 |
 * | 256 | 0.0185 | 14.4124 |
 * | 512 | 0.0415 | 25.5309 |
 * | 1024 | 0.1229 | 34.3000 |
 * | 1280 | 0.1831 | 35.9315 |
 * | 2048 | 0.4280 | 39.2919 |
 * | 4096 | 1.6115 | 41.6936 |
 *
 * ![dsymv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-layoutcolumnmajor.svg)
 *
 * ![dsymv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0082 | 0.5748 |
 * | 64 | 0.0086 | 2.0597 |
 * | 128 | 0.0117 | 5.8142 |
 * | 256 | 0.0185 | 14.4249 |
 * | 512 | 0.0419 | 25.2484 |
 * | 1024 | 0.1229 | 34.2821 |
 * | 1280 | 0.1818 | 36.1844 |
 * | 2048 | 0.4275 | 39.3404 |
 * | 4096 | 1.6111 | 41.7056 |
 *
 * ![dsymv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/gbps-layoutrowmajor.svg)
 *
 * ![dsymv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/dsymv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.dsymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dsymv/wgblas/layout.dsymv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dsymv
 */
