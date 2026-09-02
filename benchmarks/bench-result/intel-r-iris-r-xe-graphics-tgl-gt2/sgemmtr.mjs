/**
 * Benchmark results for sgemmtr on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.1875 |
 * | 64 | 0.0655 | 0.7500 |
 * | 128 | 0.3932 | 0.5000 |
 * | 256 | 1.6712 | 0.4706 |
 * | 512 | 21.1026 | 0.1491 |
 * | 1024 | 186.4172 | 0.0675 |
 *
 * ![sgemmtr-default GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-default.svg)
 *
 * ![sgemmtr-default ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-default.svg)
 *
 * ## See also
 *
 * - [sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/sgemmtr.js) — WebGPU benchmark script
 *
 * ## alpha sweep
 *
 * `alpha` is a plain multiplier here: the kernel applies it unconditionally, with no branch for any particular value. A flat sweep is therefore the expected result and is recorded as a measured null. Levels include `0`, `1` and a denormal-producing `1e-38` because those are the values a shader *could* special-case if it ever grew a branch — and `strsm` is the routine where one does.
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.3333 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 1.6384 | 0.6400 |
 * | 512 | 12.7795 | 0.3282 |
 * | 1024 | 119.6360 | 0.1402 |
 * | 2048 | 1026.0972 | 0.0654 |
 *
 * ![sgemmtr-alphaneg3p75 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-alphaneg3p75.svg)
 *
 * ![sgemmtr-alphaneg3p75 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-alphaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.3333 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 1.6384 | 0.6400 |
 * | 512 | 13.2055 | 0.3176 |
 * | 1024 | 121.5365 | 0.1380 |
 * | 2048 | 1027.0802 | 0.0653 |
 *
 * ![sgemmtr-alpha0 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-alpha0.svg)
 *
 * ![sgemmtr-alpha0 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-alpha0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 1e-38</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0655 | 1.0000 |
 * | 128 | 0.3277 | 0.8000 |
 * | 256 | 1.1141 | 0.9412 |
 * | 512 | 12.9106 | 0.3249 |
 * | 1024 | 119.7343 | 0.1401 |
 * | 2048 | 1021.3458 | 0.0657 |
 *
 * ![sgemmtr-alpha1eneg38 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-alpha1eneg38.svg)
 *
 * ![sgemmtr-alpha1eneg38 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-alpha1eneg38.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.3333 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 1.7039 | 0.6154 |
 * | 512 | 12.8123 | 0.3274 |
 * | 1024 | 121.3727 | 0.1382 |
 * | 2048 | 1026.7525 | 0.0654 |
 *
 * ![sgemmtr-alpha1 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-alpha1.svg)
 *
 * ![sgemmtr-alpha1 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-alpha1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — alpha = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.3333 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 1.1141 | 0.9412 |
 * | 512 | 12.8451 | 0.3265 |
 * | 1024 | 121.3727 | 0.1382 |
 * | 2048 | 1025.5073 | 0.0654 |
 *
 * ![sgemmtr-alpha2p5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-alpha2p5.svg)
 *
 * ![sgemmtr-alpha2p5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-alpha2p5.svg)
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
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — beta = -3.75</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.3333 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 1.1141 | 0.9412 |
 * | 512 | 15.9252 | 0.2634 |
 * | 1024 | 166.7236 | 0.1006 |
 * | 2048 | 1391.0999 | 0.0482 |
 *
 * ![sgemmtr-betaneg3p75 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-betaneg3p75.svg)
 *
 * ![sgemmtr-betaneg3p75 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-betaneg3p75.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — beta = 0</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.1966 | 0.3333 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 1.1141 | 0.9412 |
 * | 512 | 18.0552 | 0.2323 |
 * | 1024 | 165.4456 | 0.1014 |
 * | 2048 | 1391.4276 | 0.0482 |
 *
 * ![sgemmtr-beta0 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-beta0.svg)
 *
 * ![sgemmtr-beta0 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-beta0.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — beta = 1</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0655 | 1.0000 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 0.8520 | 1.2308 |
 * | 512 | 15.9908 | 0.2623 |
 * | 1024 | 169.5744 | 0.0989 |
 * | 2048 | 1398.9970 | 0.0480 |
 *
 * ![sgemmtr-beta1 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-beta1.svg)
 *
 * ![sgemmtr-beta1 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-beta1.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Intel R Iris R Xe Graphics Tgl Gt2 — beta = 2.5</summary>
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 64 | 0.0655 | 1.0000 |
 * | 128 | 0.3932 | 0.6667 |
 * | 256 | 0.5243 | 2.0000 |
 * | 512 | 16.0563 | 0.2612 |
 * | 1024 | 165.5112 | 0.1014 |
 * | 2048 | 1385.4638 | 0.0484 |
 *
 * ![sgemmtr-beta2p5 GB/s chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/gbps-beta2p5.svg)
 *
 * ![sgemmtr-beta2p5 ms chart](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr/ms-beta2p5.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [beta.sgemmtr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemmtr/wgblas/beta.sgemmtr.js) — WebGPU beta-sweep benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/sgemmtr
 */
