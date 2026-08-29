/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0369 | 0.0642 | 0.0205 | 0.1157 | 55.5% |
 * | 64 | 0.0676 | 0.1307 | 0.0245 | 0.3598 | 36.3% |
 * | 128 | 0.0835 | 0.4076 | 0.0287 | 1.1875 | 34.3% |
 * | 256 | 0.1327 | 1.0074 | 0.0382 | 3.4960 | 28.8% |
 * | 512 | 0.2747 | 1.9274 | 0.0567 | 9.3311 | 20.7% |
 * | 1024 | 0.5819 | 3.6213 | 0.1147 | 18.3776 | 19.7% |
 * | 2048 | 1.3236 | 6.3531 | 0.2225 | 37.7943 | 16.8% |
 * | 4096 | 3.7584 | 8.9389 | 0.4791 | 70.1260 | 12.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![strsv-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-default.svg)
 *
 * ![strsv-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-default.svg)
 *
 * ## See also
 *
 * - [strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/strsv.js) — WebGPU benchmark script
 * - [strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/strsv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0453 | 0.0523 | 0.0092 | 0.2578 | 20.3% |
 * | 64 | 0.0836 | 0.1057 | 0.0117 | 0.7551 | 14.0% |
 * | 128 | 0.0983 | 0.3464 | 0.0152 | 2.2329 | 15.5% |
 * | 256 | 0.1486 | 0.8993 | 0.0233 | 5.7323 | 15.7% |
 * | 512 | 0.2964 | 1.7862 | 0.0399 | 13.2564 | 13.5% |
 * | 1024 | 0.6186 | 3.4065 | 0.0897 | 23.4865 | 14.5% |
 * | 1280 | 0.7893 | 4.1677 | 0.1108 | 29.6767 | 14.0% |
 * | 2048 | 1.3523 | 6.2182 | 0.1802 | 46.6591 | 13.3% |
 * | 4096 | 3.0329 | 11.0771 | 0.3955 | 84.9467 | 13.0% |
 *
 * ![strsv-diagnonunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-diagnonunit.svg)
 *
 * ![strsv-diagnonunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-diagnonunit.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — diag = unit</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0402 | 0.0590 | 0.0069 | 0.3450 | 17.1% |
 * | 64 | 0.0736 | 0.1200 | 0.0087 | 1.0147 | 11.8% |
 * | 128 | 0.0871 | 0.3910 | 0.0124 | 2.7494 | 14.2% |
 * | 256 | 0.1330 | 1.0046 | 0.0201 | 6.6391 | 15.1% |
 * | 512 | 0.2662 | 1.9885 | 0.0359 | 14.7320 | 13.5% |
 * | 1024 | 0.5576 | 3.7793 | 0.0778 | 27.0901 | 14.0% |
 * | 1280 | 0.7091 | 4.6391 | 0.0983 | 33.4635 | 13.9% |
 * | 2048 | 1.2148 | 6.9221 | 0.1503 | 55.9353 | 12.4% |
 * | 4096 | 3.0367 | 11.0631 | 0.3385 | 99.2349 | 11.1% |
 *
 * ![strsv-diagunit GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-diagunit.svg)
 *
 * ![strsv-diagunit ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-diagunit.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [diag.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/diag.strsv.js) — WebGPU diag-sweep benchmark script
 * - [diag.strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/diag.strsv.c) — CUDA / cuBLAS diag-sweep reference script
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
 * | 32 | 0.0435 | 0.0544 |
 * | 64 | 0.0804 | 0.1099 |
 * | 128 | 0.0992 | 0.3433 |
 * | 256 | 0.1595 | 0.8377 |
 * | 512 | 0.3256 | 1.6257 |
 * | 1024 | 0.6922 | 3.0444 |
 * | 1280 | 0.9080 | 3.6229 |
 * | 2048 | 1.8002 | 4.6712 |
 * | 4096 | 3.3792 | 9.9419 |
 *
 * ![strsv-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-layoutcolumnmajor.svg)
 *
 * ![strsv-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0355 | 0.0666 |
 * | 64 | 0.0651 | 0.1357 |
 * | 128 | 0.0772 | 0.4411 |
 * | 256 | 0.1154 | 1.1577 |
 * | 512 | 0.2325 | 2.2769 |
 * | 1024 | 0.6248 | 3.3730 |
 * | 1280 | 0.7922 | 4.1523 |
 * | 2048 | 1.3536 | 6.2124 |
 * | 4096 | 3.0401 | 11.0507 |
 *
 * ![strsv-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/gbps-layoutrowmajor.svg)
 *
 * ![strsv-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/strsv/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/layout.strsv.js) — WebGPU layout-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
