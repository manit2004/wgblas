/**
 * Benchmark results for all routines on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * Run `make bench` to generate wgblas results.
 *
 * ## Roofline
 *
 * Every routine placed at its arithmetic intensity (FLOPs per byte of compulsory traffic) against what it achieved, under two ceilings: a sloped memory roof of **20.8 GB/s** and a flat compute roof of **1,147 GFLOP/s** (measured (fma.js + bandwidth.js)).
 *
 * They meet at the **ridge point, 55.26 FLOP/byte**. A routine to the left of it cannot be compute-bound at any size — no kernel tuning beats the bandwidth line there, so the only lever is bandwidth efficiency. Level 1 and Level 2 are left of the ridge by construction; Level 3 is the only level with enough data reuse to cross it.
 *
 * ![Roofline for Intel R Iris R Xe Graphics Tgl Gt2](../../../assets/benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/roofline/roofline.svg)
 *
 * > The axes span four decades each to fit Level 1 and Level 3 on one plot, which leaves the memory-bound routines close together. The chart zooms: **ctrl/⌘ + scroll** or the **+ / −** buttons, drag to pan, double-click to zoom in or reset.
 *
 * | routine | level | size | intensity | GFLOP/s | GB/s | % of roof | bound |
 * |---------|-------|------|-----------|---------|------|-----------|-------|
 * | dasum \* | 1 | 16,777,216 | 0.125 | 1.7 | 13.5 | 65% | memory |
 * | idamax \* | 1 | 16,777,216 | 0.000 | 0.0 | 10.0 | 48% | memory |
 * | isamax \* | 1 | 16,777,216 | 0.000 | 0.0 | 10.9 | 52% | memory |
 * | sasum \* | 1 | 16,777,216 | 0.250 | 2.8 | 11.1 | 54% | memory |
 * | saxpy \* | 1 | 16,777,216 | 0.167 | 3.2 | 19.4 | 94% | memory |
 * | scopy \* | 1 | 16,777,216 | 0.000 | 0.0 | 19.5 | 94% | memory |
 * | sdot \* | 1 | 16,777,216 | 0.250 | 2.7 | 10.7 | 51% | memory |
 * | snrm2 \* | 1 | 16,777,216 | 0.500 | 8.7 | 17.4 | 84% | memory |
 * | srot \* | 1 | 16,777,216 | 0.375 | 6.9 | 18.3 | 88% | memory |
 * | srotm \* | 1 | 16,777,216 | 0.375 | 6.8 | 18.2 | 88% | memory |
 * | sscal \* | 1 | 16,777,216 | 0.125 | 2.4 | 19.1 | 92% | memory |
 * | sswap \* | 1 | 16,777,216 | 0.000 | 0.0 | 18.4 | 88% | memory |
 * | sgemv | 2 | 4,096 | 0.500 | 6.0 | 12.1 | 58% | memory |
 * | sger \* | 2 | 4,096 | 0.250 | 3.4 | 13.5 | 65% | memory |
 * | ssymv \* | 2 | 4,096 | 0.998 | 5.8 | 5.8 | 28% | memory |
 * | ssyr \* | 2 | 4,096 | 0.250 | 3.7 | 14.6 | 70% | memory |
 * | ssyr2 \* | 2 | 4,096 | 0.500 | 7.5 | 15.1 | 73% | memory |
 * | strmv \* | 2 | 4,096 | 0.499 | 5.2 | 10.5 | 50% | memory |
 * | strsv \* | 2 | 2,048 | 0.499 | 0.3 | 0.5 | 2% | memory |
 * | sgemmtr | 3 | 1,024 | 170.750 | 11.5 | 0.1 | 1% | compute |
 * | ssyr2k | 3 | 1,024 | 341.417 | 12.7 | 0.0 | 1% | compute |
 * | strmm | 3 | 1,024 | 64.031 | 9.7 | 0.2 | 1% | compute |
 *
 * > Each row is that routine's largest configuration in its main benchmark, where a kernel is closest to its asymptotic behaviour. Intensity is FLOPs over *compulsory* traffic, so it assumes perfect caching: exact for the streaming Level 1 and 2 kernels, an upper bound for tiled Level 3 ones, whose real DRAM traffic is higher.
 * >
 * > \* FLOP count supplied by `scripts/roofline.py` — these benchmarks record bytes only, so the standard BLAS count is used.
 *
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2
 */
