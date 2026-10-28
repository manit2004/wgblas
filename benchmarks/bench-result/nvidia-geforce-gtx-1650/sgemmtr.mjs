/**
 * Benchmark results for sgemmtr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0092 | 1.3357 |
 * | 64 | 0.0118 | 4.1626 |
 * | 128 | 0.0184 | 10.7132 |
 * | 256 | 0.0472 | 16.6504 |
 * | 512 | 0.1311 | 24.0000 |
 * | 1024 | 0.6048 | 20.8040 |
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
 * | 64 | 0.0118 | 5.5501 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0514 | 20.4035 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6060 | 27.6830 |
 * | 2048 | 4.8469 | 13.8456 |
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
 * | 64 | 0.0126 | 5.1914 |
 * | 128 | 0.0184 | 14.2099 |
 * | 256 | 0.0489 | 21.4240 |
 * | 512 | 0.1317 | 31.8406 |
 * | 1024 | 0.6062 | 27.6757 |
 * | 2048 | 4.8514 | 13.8329 |
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
 * | 64 | 0.0120 | 5.4468 |
 * | 128 | 0.0183 | 14.3217 |
 * | 256 | 0.0518 | 20.2334 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6060 | 27.6859 |
 * | 2048 | 4.8193 | 13.9251 |
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
 * | 64 | 0.0136 | 4.8359 |
 * | 128 | 0.0192 | 13.6533 |
 * | 256 | 0.0523 | 20.0661 |
 * | 512 | 0.1659 | 25.2840 |
 * | 1024 | 0.7231 | 23.2006 |
 * | 2048 | 5.5129 | 12.1731 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0513 | 20.4289 |
 * | 512 | 0.1325 | 31.6523 |
 * | 1024 | 0.5784 | 29.0054 |
 * | 2048 | 4.6604 | 14.3998 |
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
 * | 64 | 0.0124 | 5.2920 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0516 | 20.3024 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.5868 | 28.5887 |
 * | 2048 | 4.7049 | 14.2635 |
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
 * | 64 | 0.0128 | 5.1072 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0521 | 20.1092 |
 * | 512 | 0.1319 | 31.8097 |
 * | 1024 | 0.6062 | 27.6757 |
 * | 2048 | 4.8422 | 13.8592 |
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
 * | 64 | 0.0125 | 5.2446 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0516 | 20.3402 |
 * | 512 | 0.1312 | 31.9688 |
 * | 1024 | 0.5937 | 28.2582 |
 * | 2048 | 4.7800 | 14.0394 |
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
 * | 64 | 0.0125 | 5.2513 |
 * | 128 | 0.0185 | 14.1976 |
 * | 256 | 0.0523 | 20.0355 |
 * | 512 | 0.1323 | 31.6982 |
 * | 1024 | 0.6137 | 27.3387 |
 * | 2048 | 4.8740 | 13.7688 |
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
 * | 64 | 0.0124 | 5.2716 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0520 | 20.1773 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6067 | 27.6523 |
 * | 2048 | 4.8924 | 13.7170 |
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
 * | 64 | 0.0118 | 5.5652 |
 * | 128 | 0.0182 | 14.4099 |
 * | 256 | 0.0515 | 20.3781 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6061 | 27.6793 |
 * | 2048 | 4.8088 | 13.9553 |
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
 * | 64 | 0.0127 | 5.1457 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0512 | 20.4864 |
 * | 512 | 0.1710 | 24.5315 |
 * | 1024 | 0.7414 | 22.6298 |
 * | 2048 | 5.6615 | 11.8535 |
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
 * | 64 | 0.0123 | 5.3195 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0523 | 20.0600 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6118 | 27.4245 |
 * | 2048 | 4.9074 | 13.6749 |
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
 * | 64 | 0.0123 | 5.3126 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0524 | 20.0171 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6103 | 27.4899 |
 * | 2048 | 4.9011 | 13.6926 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2470 |
 * | 256 | 0.0523 | 20.0539 |
 * | 512 | 0.1311 | 32.0039 |
 * | 1024 | 0.6055 | 27.7064 |
 * | 2048 | 4.8517 | 13.8320 |
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
 * | 64 | 0.0123 | 5.3195 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0525 | 19.9805 |
 * | 512 | 0.1317 | 31.8522 |
 * | 1024 | 0.6124 | 27.3980 |
 * | 2048 | 4.9096 | 13.6690 |
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
 * | 64 | 0.0124 | 5.2784 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0520 | 20.1649 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6059 | 27.6910 |
 * | 2048 | 4.8363 | 13.8762 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0521 | 20.1401 |
 * | 512 | 0.1310 | 32.0235 |
 * | 1024 | 0.6058 | 27.6954 |
 * | 2048 | 4.8107 | 13.9498 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0518 | 20.2272 |
 * | 512 | 0.1292 | 32.4556 |
 * | 1024 | 0.6062 | 27.6779 |
 * | 2048 | 4.8062 | 13.9629 |
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
 * | 64 | 0.0119 | 5.5277 |
 * | 128 | 0.0182 | 14.3719 |
 * | 256 | 0.0514 | 20.4035 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6057 | 27.6976 |
 * | 2048 | 4.8026 | 13.9736 |
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
 * | 64 | 0.0124 | 5.2988 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0520 | 20.1587 |
 * | 512 | 0.1298 | 32.3156 |
 * | 1024 | 0.6075 | 27.6166 |
 * | 2048 | 4.8053 | 13.9655 |
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
 * | 64 | 0.0123 | 5.3195 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0523 | 20.0355 |
 * | 512 | 0.1294 | 32.4115 |
 * | 1024 | 0.6058 | 27.6954 |
 * | 2048 | 4.8195 | 13.9244 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0526 | 19.9379 |
 * | 512 | 0.1301 | 32.2401 |
 * | 1024 | 0.6052 | 27.7203 |
 * | 2048 | 4.8246 | 13.9097 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0516 | 20.3402 |
 * | 512 | 0.1293 | 32.4476 |
 * | 1024 | 0.6057 | 27.6998 |
 * | 2048 | 4.8063 | 13.9628 |
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
 * | 64 | 0.0119 | 5.4980 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0514 | 20.3844 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6062 | 27.6779 |
 * | 2048 | 4.8309 | 13.8916 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0523 | 20.0600 |
 * | 512 | 0.1299 | 32.2877 |
 * | 1024 | 0.6060 | 27.6866 |
 * | 2048 | 4.8092 | 13.9541 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0520 | 20.1836 |
 * | 512 | 0.1292 | 32.4637 |
 * | 1024 | 0.6059 | 27.6918 |
 * | 2048 | 4.8075 | 13.9593 |
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
 * | 64 | 0.0119 | 5.5128 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0516 | 20.3086 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6056 | 27.7020 |
 * | 2048 | 4.8060 | 13.9634 |
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
 * | 64 | 0.0136 | 4.8132 |
 * | 128 | 0.0189 | 13.8495 |
 * | 256 | 0.0520 | 20.1525 |
 * | 512 | 0.1292 | 32.4596 |
 * | 1024 | 0.5454 | 30.7609 |
 * | 2048 | 4.3561 | 15.4058 |
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
 * | 64 | 0.0119 | 5.5128 |
 * | 128 | 0.0183 | 14.3092 |
 * | 256 | 0.0516 | 20.3402 |
 * | 512 | 0.1292 | 32.4717 |
 * | 1024 | 0.6060 | 27.6866 |
 * | 2048 | 4.8480 | 13.8425 |
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
 * | 64 | 0.0134 | 4.8995 |
 * | 128 | 0.0186 | 14.0635 |
 * | 256 | 0.0532 | 19.6923 |
 * | 512 | 0.1384 | 30.3057 |
 * | 1024 | 0.6848 | 24.5012 |
 * | 2048 | 5.5027 | 12.1956 |
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
 * | 64 | 0.0125 | 5.2379 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0512 | 20.4864 |
 * | 512 | 0.1314 | 31.9182 |
 * | 1024 | 0.6050 | 27.7320 |
 * | 2048 | 4.7895 | 14.0118 |
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
 * | 64 | 0.0120 | 5.4541 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0515 | 20.3654 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6058 | 27.6925 |
 * | 2048 | 4.8493 | 13.8390 |
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
 * | 64 | 0.0118 | 5.5652 |
 * | 128 | 0.0183 | 14.3342 |
 * | 256 | 0.0513 | 20.4417 |
 * | 512 | 0.1290 | 32.5079 |
 * | 1024 | 0.6059 | 27.6888 |
 * | 2048 | 4.8106 | 13.9501 |
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
 * | 64 | 0.0124 | 5.2784 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0525 | 19.9562 |
 * | 512 | 0.1306 | 32.1137 |
 * | 1024 | 0.6156 | 27.2549 |
 * | 2048 | 4.8573 | 13.8161 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0519 | 20.2084 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6082 | 27.5847 |
 * | 2048 | 4.8536 | 13.8266 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0519 | 20.2084 |
 * | 512 | 0.1310 | 32.0156 |
 * | 1024 | 0.6073 | 27.6239 |
 * | 2048 | 4.8164 | 13.9334 |
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
 * | 64 | 0.0126 | 5.1914 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0524 | 20.0232 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6062 | 27.6757 |
 * | 2048 | 4.8047 | 13.9672 |
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
 * | 64 | 0.0124 | 5.2852 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0520 | 20.1836 |
 * | 512 | 0.1311 | 31.9922 |
 * | 1024 | 0.6076 | 27.6123 |
 * | 2048 | 4.8087 | 13.9558 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0522 | 20.0907 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6063 | 27.6728 |
 * | 2048 | 4.8500 | 13.8368 |
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
 * | 64 | 0.0123 | 5.3333 |
 * | 128 | 0.0184 | 14.2222 |
 * | 256 | 0.0521 | 20.1154 |
 * | 512 | 0.1311 | 32.0000 |
 * | 1024 | 0.6062 | 27.6757 |
 * | 2048 | 4.8027 | 13.9733 |
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
