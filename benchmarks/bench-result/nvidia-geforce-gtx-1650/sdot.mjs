/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0106 | 0.0242 | 0.0108 | 0.0238 | 101.7% |
 * | 64 | 0.0107 | 0.0480 | 0.0103 | 0.0497 | 96.7% |
 * | 128 | 0.0108 | 0.0952 | 0.0103 | 0.0997 | 95.5% |
 * | 512 | 0.0107 | 0.3832 | 0.0176 | 0.2332 | 164.3% |
 * | 1024 | 0.0107 | 0.7642 | 0.0176 | 0.4663 | 163.9% |
 * | 4096 | 0.0107 | 3.0705 | 0.0179 | 1.8286 | 167.9% |
 * | 16384 | 0.0114 | 11.4573 | 0.0180 | 7.2883 | 157.2% |
 * | 65536 | 0.0123 | 42.6667 | 0.0180 | 29.1012 | 146.6% |
 * | 262144 | 0.0234 | 89.5913 | 0.0276 | 75.9397 | 118.0% |
 * | 1048576 | 0.0577 | 145.3126 | 0.0614 | 136.5333 | 106.4% |
 * | 4194304 | 0.1946 | 172.4632 | 0.1948 | 172.2224 | 100.1% |
 * | 16777216 | 0.7368 | 182.1630 | 0.7310 | 183.5983 | 99.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * ![sdot-default GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-default.svg)
 *
 * ![sdot-default ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-default.svg)
 *
 * ## See also
 *
 * - [sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/sdot.js) — WebGPU benchmark script
 * - [sdot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/sdot.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0106 | 0.0242 | 0.0171 | 0.0150 | 161.1% |
 * | 64 | 0.0107 | 0.0479 | 0.0106 | 0.0484 | 99.0% |
 * | 128 | 0.0107 | 0.0961 | 0.0106 | 0.0965 | 99.6% |
 * | 512 | 0.0106 | 0.3850 | 0.0124 | 0.3299 | 116.7% |
 * | 1024 | 0.0107 | 0.7665 | 0.0178 | 0.4613 | 166.2% |
 * | 4096 | 0.0111 | 2.9553 | 0.0180 | 1.8172 | 162.6% |
 * | 16384 | 0.0124 | 10.6114 | 0.0180 | 7.3012 | 145.3% |
 * | 65536 | 0.0235 | 22.3520 | 0.0300 | 17.4483 | 128.1% |
 * | 262144 | 0.0576 | 36.3988 | 0.0630 | 33.3093 | 109.3% |
 * | 1048576 | 0.1959 | 42.8235 | 0.1949 | 43.0485 | 99.5% |
 * | 4194304 | 0.7368 | 45.5427 | 0.7286 | 46.0518 | 98.9% |
 *
 * ![sdot-stride4 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride4.svg)
 *
 * ![sdot-stride4 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride4.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 5</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 0.0239 | 0.0175 | 0.0146 | 163.8% |
 * | 64 | 0.0107 | 0.0480 | 0.0174 | 0.0294 | 163.4% |
 * | 128 | 0.0107 | 0.0958 | 0.0178 | 0.0577 | 166.0% |
 * | 512 | 0.0106 | 0.3879 | 0.0176 | 0.2327 | 166.7% |
 * | 1024 | 0.0107 | 0.7688 | 0.0177 | 0.4617 | 166.5% |
 * | 4096 | 0.0115 | 2.8603 | 0.0180 | 1.8221 | 157.0% |
 * | 16384 | 0.0126 | 10.4224 | 0.0182 | 7.2176 | 144.4% |
 * | 65536 | 0.0268 | 19.5747 | 0.0308 | 17.0489 | 114.8% |
 * | 262144 | 0.0699 | 29.9936 | 0.0720 | 29.1077 | 103.0% |
 * | 1048576 | 0.2417 | 34.7096 | 0.2389 | 35.1117 | 98.9% |
 * | 4194304 | 0.9159 | 36.6366 | 0.9065 | 37.0168 | 99.0% |
 *
 * ![sdot-stride5 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride5.svg)
 *
 * ![sdot-stride5 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride5.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 0.0240 | 0.0176 | 0.0145 | 165.7% |
 * | 64 | 0.0107 | 0.0478 | 0.0175 | 0.0293 | 163.0% |
 * | 128 | 0.0109 | 0.0940 | 0.0178 | 0.0576 | 163.2% |
 * | 512 | 0.0112 | 0.3657 | 0.0178 | 0.2298 | 159.1% |
 * | 1024 | 0.0113 | 0.7252 | 0.0180 | 0.4539 | 159.8% |
 * | 4096 | 0.0134 | 2.4410 | 0.0184 | 1.7840 | 136.8% |
 * | 16384 | 0.0237 | 5.5202 | 0.0293 | 4.4765 | 123.3% |
 * | 65536 | 0.0573 | 9.1429 | 0.0615 | 8.5311 | 107.2% |
 * | 262144 | 0.1926 | 10.8873 | 0.1941 | 10.8038 | 100.8% |
 * | 1048576 | 0.7334 | 11.4376 | 0.7301 | 11.4900 | 99.5% |
 *
 * ![sdot-stride32 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride32.svg)
 *
 * ![sdot-stride32 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride32.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 33</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 64 | 0.0106 | 0.0482 | 0.0104 | 0.0494 | 97.6% |
 * | 128 | 0.0107 | 0.0958 | 0.0179 | 0.0572 | 167.5% |
 * | 512 | 0.0108 | 0.3781 | 0.0179 | 0.2292 | 165.0% |
 * | 1024 | 0.0109 | 0.7507 | 0.0179 | 0.4571 | 164.2% |
 * | 4096 | 0.0128 | 2.5600 | 0.0185 | 1.7747 | 144.2% |
 * | 16384 | 0.0236 | 5.5652 | 0.0287 | 4.5663 | 121.9% |
 * | 65536 | 0.0573 | 9.1429 | 0.0611 | 8.5780 | 106.6% |
 * | 262144 | 0.1926 | 10.8864 | 0.1945 | 10.7807 | 101.0% |
 *
 * ![sdot-stride33 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride33.svg)
 *
 * ![sdot-stride33 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride33.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 255</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0112 | 0.3673 | 0.0174 | 0.2353 | 156.1% |
 * | 1024 | 0.0111 | 0.7378 | 0.0180 | 0.4555 | 162.0% |
 * | 4096 | 0.0145 | 2.2555 | 0.0191 | 1.7181 | 131.3% |
 * | 16384 | 0.0365 | 3.5930 | 0.0406 | 3.2252 | 111.4% |
 * | 65536 | 0.1082 | 4.8466 | 0.1081 | 4.8516 | 99.9% |
 *
 * ![sdot-stride255 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride255.svg)
 *
 * ![sdot-stride255 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride255.svg)
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0109 | 0.3743 | 0.0178 | 0.2298 | 162.9% |
 * | 1024 | 0.0123 | 0.6667 | 0.0173 | 0.4723 | 141.2% |
 * | 4096 | 0.0154 | 2.1289 | 0.0181 | 1.8060 | 117.9% |
 * | 16384 | 0.0293 | 4.4667 | 0.0321 | 4.0777 | 109.5% |
 * | 65536 | 0.0812 | 6.4555 | 0.0851 | 6.1594 | 104.8% |
 *
 * ![sdot-stride256 GB/s chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/gbps-stride256.svg)
 *
 * ![sdot-stride256 ms chart](../../../assets/benchmarks/nvidia-geforce-gtx-1650/sdot/ms-stride256.svg)
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/stride.sdot.js) — WebGPU stride-sweep benchmark script
 * - [stride.sdot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/stride.sdot.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sdot
 */
