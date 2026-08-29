/**
 * Benchmark results for sgemmtr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0093 | 1.3173 |
 * | 64 | 0.0106 | 4.6195 |
 * | 128 | 0.0180 | 10.9227 |
 * | 256 | 0.0609 | 12.9177 |
 * | 512 | 0.2304 | 13.6562 |
 * | 1024 | 1.6308 | 7.7159 |
 *
 * ![sgemmtr-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-default.svg)
 *
 * ![sgemmtr-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/sgemmtr.js) — WebGPU benchmark script
 *
 * ## Uplo sweep
 *
 * Unless noted otherwise, every result above uses `uplo = "lower"`. Real workgroups dispatch in increasing index order, so `uplo = "upper"` front-loads the heaviest rows first (worse — long-running heavy workgroups have nothing to overlap with) while `lower` back-loads them (better — light rows clear fast, the heavy tail gets full GPU to itself) — collapsed below by default, expand a `uplo` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = lower</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0112 | 5.8348 |
 * | 128 | 0.0180 | 14.5377 |
 * | 256 | 0.0609 | 17.2237 |
 * | 512 | 0.2294 | 18.2857 |
 * | 1024 | 1.6375 | 10.2456 |
 * | 2048 | 12.4529 | 5.3890 |
 *
 * ![sgemmtr-uplolower GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-uplolower.svg)
 *
 * ![sgemmtr-uplolower ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-uplolower.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6497 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0613 | 17.0934 |
 * | 512 | 0.2331 | 17.9933 |
 * | 1024 | 1.6339 | 10.2684 |
 * | 2048 | 12.4542 | 5.3885 |
 *
 * ![sgemmtr-uploupper GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-uploupper.svg)
 *
 * ![sgemmtr-uploupper ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-uploupper.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/uplo.sgemmtr.js) — WebGPU uplo-sweep benchmark script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0108 | 6.0413 |
 * | 128 | 0.0181 | 14.4735 |
 * | 256 | 0.0611 | 17.1560 |
 * | 512 | 0.2296 | 18.2704 |
 * | 1024 | 1.6364 | 10.2524 |
 * | 2048 | 12.4092 | 5.4080 |
 *
 * ![sgemmtr-pad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad0.svg)
 *
 * ![sgemmtr-pad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.5956 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0627 | 16.7354 |
 * | 512 | 0.2380 | 17.6255 |
 * | 1024 | 1.7041 | 9.8450 |
 * | 2048 | 12.6717 | 5.2960 |
 *
 * ![sgemmtr-pad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad1.svg)
 *
 * ![sgemmtr-pad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6497 |
 * | 128 | 0.0184 | 14.2594 |
 * | 256 | 0.0596 | 17.5936 |
 * | 512 | 0.2379 | 17.6291 |
 * | 1024 | 1.6909 | 9.9223 |
 * | 2048 | 12.4788 | 5.3778 |
 *
 * ![sgemmtr-pad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad8.svg)
 *
 * ![sgemmtr-pad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.6187 |
 * | 128 | 0.0184 | 14.2099 |
 * | 256 | 0.0609 | 17.2282 |
 * | 512 | 0.2318 | 18.0914 |
 * | 1024 | 1.6290 | 10.2988 |
 * | 2048 | 12.4808 | 5.3770 |
 *
 * ![sgemmtr-pad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad16.svg)
 *
 * ![sgemmtr-pad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6575 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0615 | 17.0578 |
 * | 512 | 0.2328 | 18.0180 |
 * | 1024 | 1.6411 | 10.2230 |
 * | 2048 | 12.5992 | 5.3265 |
 *
 * ![sgemmtr-pad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad32.svg)
 *
 * ![sgemmtr-pad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0120 | 5.4833 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0612 | 17.1426 |
 * | 512 | 0.2333 | 17.9785 |
 * | 1024 | 1.6322 | 10.2787 |
 * | 2048 | 12.4945 | 5.3711 |
 *
 * ![sgemmtr-pad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad48.svg)
 *
 * ![sgemmtr-pad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.6187 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0615 | 17.0578 |
 * | 512 | 0.2335 | 17.9649 |
 * | 1024 | 1.6466 | 10.1893 |
 * | 2048 | 12.6167 | 5.3190 |
 *
 * ![sgemmtr-pad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad64.svg)
 *
 * ![sgemmtr-pad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.5880 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2335 | 17.9649 |
 * | 1024 | 1.6466 | 10.1890 |
 * | 2048 | 12.6836 | 5.2910 |
 *
 * ![sgemmtr-pad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-pad128.svg)
 *
 * ![sgemmtr-pad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-pad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/lda.sgemmtr.js) — WebGPU lda-sweep benchmark script
 *
 * ## ldb sweep
 *
 * Padding on `B`, the operand the gemm kernels stream along their inner loop, so its stride is the one with most room to matter. Only for routines whose ldb sweep is a plain {pad, n} one — `sgemm`'s is a combined transB x pad grid and has its own section.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0108 | 6.0413 |
 * | 128 | 0.0180 | 14.5506 |
 * | 256 | 0.0611 | 17.1605 |
 * | 512 | 0.2293 | 18.2921 |
 * | 1024 | 1.6357 | 10.2568 |
 * | 2048 | 12.4393 | 5.3949 |
 *
 * ![sgemmtr-ldbpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad0.svg)
 *
 * ![sgemmtr-ldbpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.5880 |
 * | 128 | 0.0185 | 14.1608 |
 * | 256 | 0.0617 | 17.0003 |
 * | 512 | 0.2314 | 18.1239 |
 * | 1024 | 1.6425 | 10.2145 |
 * | 2048 | 12.5301 | 5.3558 |
 *
 * ![sgemmtr-ldbpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad1.svg)
 *
 * ![sgemmtr-ldbpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 8</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0120 | 5.4541 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2312 | 18.1389 |
 * | 1024 | 1.6397 | 10.2321 |
 * | 2048 | 12.5269 | 5.3572 |
 *
 * ![sgemmtr-ldbpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad8.svg)
 *
 * ![sgemmtr-ldbpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 16</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0112 | 5.8265 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2313 | 18.1314 |
 * | 1024 | 1.6404 | 10.2273 |
 * | 2048 | 12.5480 | 5.3482 |
 *
 * ![sgemmtr-ldbpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad16.svg)
 *
 * ![sgemmtr-ldbpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6419 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2308 | 18.1716 |
 * | 1024 | 1.6407 | 10.2257 |
 * | 2048 | 12.4908 | 5.3727 |
 *
 * ![sgemmtr-ldbpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad32.svg)
 *
 * ![sgemmtr-ldbpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 48</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6264 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2318 | 18.0914 |
 * | 1024 | 1.6436 | 10.2077 |
 * | 2048 | 12.5531 | 5.3460 |
 *
 * ![sgemmtr-ldbpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad48.svg)
 *
 * ![sgemmtr-ldbpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 64</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.5956 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2314 | 18.1239 |
 * | 1024 | 1.6416 | 10.2200 |
 * | 2048 | 12.4992 | 5.3691 |
 *
 * ![sgemmtr-ldbpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad64.svg)
 *
 * ![sgemmtr-ldbpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldb = n + 128</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0119 | 5.5277 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0616 | 17.0356 |
 * | 512 | 0.2314 | 18.1239 |
 * | 1024 | 1.6427 | 10.2133 |
 * | 2048 | 12.4981 | 5.3695 |
 *
 * ![sgemmtr-ldbpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldbpad128.svg)
 *
 * ![sgemmtr-ldbpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldbpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/ldb.sgemmtr.js) — WebGPU ldb-sweep benchmark script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0118 | 5.5501 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0618 | 16.9738 |
 * | 512 | 0.2314 | 18.1239 |
 * | 1024 | 1.6388 | 10.2372 |
 * | 2048 | 12.4090 | 5.4081 |
 *
 * ![sgemmtr-alphaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-alphaneg3p75.svg)
 *
 * ![sgemmtr-alphaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0143 | 4.5714 |
 * | 128 | 0.0235 | 11.1684 |
 * | 256 | 0.0788 | 13.3095 |
 * | 512 | 0.2852 | 14.7041 |
 * | 1024 | 2.0010 | 8.3842 |
 * | 2048 | 12.3393 | 5.4386 |
 *
 * ![sgemmtr-alpha0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-alpha0.svg)
 *
 * ![sgemmtr-alpha0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1e-38</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.5804 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2330 | 18.0007 |
 * | 1024 | 1.6609 | 10.1011 |
 * | 2048 | 12.3734 | 5.4236 |
 *
 * ![sgemmtr-alpha1eneg38 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-alpha1eneg38.svg)
 *
 * ![sgemmtr-alpha1eneg38 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0112 | 5.8348 |
 * | 128 | 0.0183 | 14.2967 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2308 | 18.1704 |
 * | 1024 | 1.6375 | 10.2456 |
 * | 2048 | 12.3520 | 5.4331 |
 *
 * ![sgemmtr-alpha1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-alpha1.svg)
 *
 * ![sgemmtr-alpha1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — alpha = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6341 |
 * | 128 | 0.0185 | 14.1976 |
 * | 256 | 0.0617 | 17.0003 |
 * | 512 | 0.2314 | 18.1239 |
 * | 1024 | 1.6404 | 10.2274 |
 * | 2048 | 12.3889 | 5.4168 |
 *
 * ![sgemmtr-alpha2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-alpha2p5.svg)
 *
 * ![sgemmtr-alpha2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-alpha2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [alpha.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/alpha.sgemmtr.js) — WebGPU alpha-sweep benchmark script
 *
 * ## beta sweep
 *
 * `beta` scales the existing `y`/`C` before accumulation. Reference BLAS is permitted to skip reading that operand entirely when `beta` is 0, so unlike `alpha` this sweep has a mechanism to be non-flat — a step at 0 means the shortcut is taken, and its size is what it saves.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0118 | 5.5426 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2317 | 18.0989 |
 * | 1024 | 1.6394 | 10.2338 |
 * | 2048 | 12.4190 | 5.4037 |
 *
 * ![sgemmtr-betaneg3p75 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-betaneg3p75.svg)
 *
 * ![sgemmtr-betaneg3p75 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0107 | 6.1317 |
 * | 128 | 0.0178 | 14.6942 |
 * | 256 | 0.0611 | 17.1515 |
 * | 512 | 0.2294 | 18.2857 |
 * | 1024 | 1.6348 | 10.2622 |
 * | 2048 | 12.3300 | 5.4427 |
 *
 * ![sgemmtr-beta0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-beta0.svg)
 *
 * ![sgemmtr-beta0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6341 |
 * | 128 | 0.0184 | 14.2346 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2314 | 18.1239 |
 * | 1024 | 1.6372 | 10.2475 |
 * | 2048 | 12.4094 | 5.4079 |
 *
 * ![sgemmtr-beta1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-beta1.svg)
 *
 * ![sgemmtr-beta1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — beta = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0120 | 5.4686 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2314 | 18.1277 |
 * | 1024 | 1.6372 | 10.2476 |
 * | 2048 | 12.4083 | 5.4084 |
 *
 * ![sgemmtr-beta2p5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-beta2p5.svg)
 *
 * ![sgemmtr-beta2p5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/beta.sgemmtr.js) — WebGPU beta-sweep benchmark script
 *
 * ## transA sweep
 *
 * `op(A)` decides whether the kernel walks `A` along rows or columns, which changes how its tile loads coalesce. Swept on its own here; `sgemm`'s combined transA x transB grid lives in its trans sweep.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = no-transpose</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0109 | 5.9971 |
 * | 128 | 0.0180 | 14.5248 |
 * | 256 | 0.0612 | 17.1381 |
 * | 512 | 0.2303 | 18.2133 |
 * | 1024 | 1.6379 | 10.2430 |
 * | 2048 | 12.4772 | 5.3785 |
 *
 * ![sgemmtr-transAnotranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-transAnotranspose.svg)
 *
 * ![sgemmtr-transAnotranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-transAnotranspose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = transpose</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6653 |
 * | 128 | 0.0187 | 14.0274 |
 * | 256 | 0.0669 | 15.6822 |
 * | 512 | 0.2402 | 17.4646 |
 * | 1024 | 1.7395 | 9.6451 |
 * | 2048 | 12.9628 | 5.1770 |
 *
 * ![sgemmtr-transAtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-transAtranspose.svg)
 *
 * ![sgemmtr-transAtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-transAtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [transA.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/transA.sgemmtr.js) — WebGPU transA-sweep benchmark script
 *
 * ## transB sweep
 *
 * `op(B)` — the counterpart to the transA sweep, on the operand streamed along the kernel's inner loop, where a stride change has the most room to matter.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = no-transpose</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0109 | 6.0324 |
 * | 128 | 0.0181 | 14.4735 |
 * | 256 | 0.0609 | 17.2146 |
 * | 512 | 0.2294 | 18.2857 |
 * | 1024 | 1.6343 | 10.2659 |
 * | 2048 | 12.4653 | 5.3836 |
 *
 * ![sgemmtr-transBnotranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-transBnotranspose.svg)
 *
 * ![sgemmtr-transBnotranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-transBnotranspose.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = transpose</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0127 | 5.1717 |
 * | 128 | 0.0240 | 10.9227 |
 * | 256 | 0.1044 | 10.0469 |
 * | 512 | 0.3408 | 12.3067 |
 * | 1024 | 2.4492 | 6.8502 |
 * | 2048 | 18.7637 | 3.5765 |
 *
 * ![sgemmtr-transBtranspose GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-transBtranspose.svg)
 *
 * ![sgemmtr-transBtranspose ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-transBtranspose.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [transB.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/transB.sgemmtr.js) — WebGPU transB-sweep benchmark script
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
 * | 64 | 0.0117 | 5.5804 |
 * | 128 | 0.0184 | 14.2842 |
 * | 256 | 0.0612 | 17.1291 |
 * | 512 | 0.2328 | 18.0143 |
 * | 1024 | 1.6317 | 10.2820 |
 * | 2048 | 12.3860 | 5.4181 |
 *
 * ![sgemmtr-layoutcolumnmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-layoutcolumnmajor.svg)
 *
 * ![sgemmtr-layoutcolumnmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-layoutcolumnmajor.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — layout = row-major</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0109 | 6.0235 |
 * | 128 | 0.0181 | 14.5120 |
 * | 256 | 0.0612 | 17.1470 |
 * | 512 | 0.2294 | 18.2857 |
 * | 1024 | 1.6358 | 10.2564 |
 * | 2048 | 12.3619 | 5.4287 |
 *
 * ![sgemmtr-layoutrowmajor GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-layoutrowmajor.svg)
 *
 * ![sgemmtr-layoutrowmajor ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-layoutrowmajor.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [layout.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/layout.sgemmtr.js) — WebGPU layout-sweep benchmark script
 *
 * ## ldc sweep
 *
 * Padding on the output matrix. `C` is written rather than streamed, so this measures write coalescing rather than read bandwidth — the row byte-stride is `ldc*4`, and a pad that moves it off the 128-byte boundary is what would show up here.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0108 | 6.0413 |
 * | 128 | 0.0180 | 14.5765 |
 * | 256 | 0.0609 | 17.2056 |
 * | 512 | 0.2297 | 18.2628 |
 * | 1024 | 1.6353 | 10.2591 |
 * | 2048 | 12.4507 | 5.3900 |
 *
 * ![sgemmtr-ldcpad0 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad0.svg)
 *
 * ![sgemmtr-ldcpad0 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0117 | 5.6033 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2330 | 17.9982 |
 * | 1024 | 1.6465 | 10.1894 |
 * | 2048 | 12.4892 | 5.3734 |
 *
 * ![sgemmtr-ldcpad1 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad1.svg)
 *
 * ![sgemmtr-ldcpad1 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 8</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0118 | 5.5501 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2335 | 17.9661 |
 * | 1024 | 1.6451 | 10.1984 |
 * | 2048 | 12.5146 | 5.3624 |
 *
 * ![sgemmtr-ldcpad8 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad8.svg)
 *
 * ![sgemmtr-ldcpad8 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad8.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 16</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6575 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0614 | 17.0667 |
 * | 512 | 0.2330 | 17.9982 |
 * | 1024 | 1.6421 | 10.2171 |
 * | 2048 | 12.5099 | 5.3645 |
 *
 * ![sgemmtr-ldcpad16 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad16.svg)
 *
 * ![sgemmtr-ldcpad16 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad16.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 32</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0121 | 5.4108 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0616 | 17.0135 |
 * | 512 | 0.2321 | 18.0702 |
 * | 1024 | 1.6415 | 10.2209 |
 * | 2048 | 12.4730 | 5.3803 |
 *
 * ![sgemmtr-ldcpad32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad32.svg)
 *
 * ![sgemmtr-ldcpad32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 48</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6264 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0615 | 17.0622 |
 * | 512 | 0.2340 | 17.9268 |
 * | 1024 | 1.6452 | 10.1975 |
 * | 2048 | 12.4940 | 5.3713 |
 *
 * ![sgemmtr-ldcpad48 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad48.svg)
 *
 * ![sgemmtr-ldcpad48 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad48.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 64</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0116 | 5.6419 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0617 | 17.0003 |
 * | 512 | 0.2325 | 18.0428 |
 * | 1024 | 1.6388 | 10.2377 |
 * | 2048 | 12.4982 | 5.3695 |
 *
 * ![sgemmtr-ldcpad64 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad64.svg)
 *
 * ![sgemmtr-ldcpad64 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad64.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — ldc = n + 128</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0119 | 5.5202 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0615 | 17.0489 |
 * | 512 | 0.2330 | 18.0032 |
 * | 1024 | 1.6388 | 10.2378 |
 * | 2048 | 12.5021 | 5.3678 |
 *
 * ![sgemmtr-ldcpad128 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/gbps-ldcpad128.svg)
 *
 * ![sgemmtr-ldcpad128 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sgemmtr/ms-ldcpad128.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldc.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/ldc.sgemmtr.js) — WebGPU ldc-sweep benchmark script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemmtr
 */
