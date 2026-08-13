/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0188 | 0.0136 | 0.0104 | 0.0247 | 55.0% |
 * | 64 | 0.0192 | 0.0266 | 0.0171 | 0.0299 | 89.0% |
 * | 128 | 0.0187 | 0.0547 | 0.0106 | 0.0970 | 56.4% |
 * | 512 | 0.0190 | 0.2157 | 0.0105 | 0.3908 | 55.2% |
 * | 1024 | 0.0189 | 0.4328 | 0.0101 | 0.8127 | 53.3% |
 * | 4096 | 0.0189 | 1.7312 | 0.0179 | 1.8286 | 94.7% |
 * | 16384 | 0.0195 | 6.7258 | 0.0175 | 7.4881 | 89.8% |
 * | 65536 | 0.0204 | 25.7206 | 0.0177 | 29.5740 | 87.0% |
 * | 262144 | 0.0325 | 64.4405 | 0.0268 | 78.2052 | 82.4% |
 * | 1048576 | 0.0668 | 125.6683 | 0.0610 | 137.6084 | 91.3% |
 * | 4194304 | 0.2044 | 164.1735 | 0.1967 | 170.5834 | 96.2% |
 * | 16777216 | 0.7504 | 178.8501 | 0.7329 | 183.1374 | 97.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sdot-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sdot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sdot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sdot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="85.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="113.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="168.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="196.4" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="251.8" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="307.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="362.5" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="417.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="473.3" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="528.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.3 307.2,213.3 362.5,194.3 417.9,155.6 473.3,94.3 528.6,55.8 584.0,41.1"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.6 196.4,219.2 251.8,218.2 307.2,212.5 362.5,190.4 417.9,141.8 473.3,82.4 528.6,49.4 584.0,36.9"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="194.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="155.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="94.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="55.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="41.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="190.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="141.8" r="4"/>
 * <circle class="mk2" cx="473.3" cy="82.4" r="4"/>
 * <circle class="mk2" cx="528.6" cy="49.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.9" r="4"/>
 * <line class="ln1" x1="58" y1="252" x2="74" y2="252"/>
 * <circle class="mk1" cx="66" cy="252" r="4"/>
 * <text class="lt" x="80" y="256">wgblas</text>
 * <line class="ln2" x1="132" y1="252" x2="148" y2="252"/>
 * <circle class="mk2" cx="140" cy="252" r="4"/>
 * <text class="lt" x="154" y="256">cuBLAS</text>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sdot-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sdot-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sdot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sdot-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sdot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.800</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="85.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="113.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="168.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="196.4" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="251.8" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="307.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="362.5" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="417.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="473.3" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="528.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,215.3 85.7,215.2 113.4,215.3 168.7,215.3 196.4,215.3 251.8,215.3 307.2,215.1 362.5,214.9 417.9,211.9 473.3,203.3 528.6,168.9 584.0,32.4"/>
 * <polyline class="ln2" points="58.0,217.4 85.7,215.7 113.4,217.3 168.7,217.4 196.4,217.5 251.8,215.5 307.2,215.6 362.5,215.6 417.9,213.3 473.3,204.8 528.6,170.8 584.0,36.8"/>
 * <circle class="mk1" cx="58.0" cy="215.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.2" r="4"/>
 * <circle class="mk1" cx="113.4" cy="215.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.1" r="4"/>
 * <circle class="mk1" cx="362.5" cy="214.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="203.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="168.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="32.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="215.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="217.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="217.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="215.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="215.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.3" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="170.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.8" r="4"/>
 * </svg>
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
 * | 32 | 0.0190 | 0.0135 | 0.0102 | 0.0250 | 54.0% |
 * | 64 | 0.0192 | 0.0267 | 0.0106 | 0.0484 | 55.2% |
 * | 128 | 0.0188 | 0.0545 | 0.0172 | 0.0597 | 91.3% |
 * | 512 | 0.0187 | 0.2188 | 0.0175 | 0.2340 | 93.5% |
 * | 1024 | 0.0189 | 0.4339 | 0.0178 | 0.4608 | 94.2% |
 * | 4096 | 0.0192 | 1.7081 | 0.0175 | 1.8686 | 91.4% |
 * | 16384 | 0.0208 | 6.3161 | 0.0181 | 7.2367 | 87.3% |
 * | 65536 | 0.0328 | 16.0078 | 0.0303 | 17.3284 | 92.4% |
 * | 262144 | 0.0676 | 31.0303 | 0.0631 | 33.2501 | 93.3% |
 * | 1048576 | 0.2069 | 40.5513 | 0.1948 | 43.0521 | 94.2% |
 * | 4194304 | 0.7671 | 43.7417 | 0.7293 | 46.0114 | 95.1% |
 *
 * <svg id="bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="180.0" x2="584" y2="180.0"/>
 * <line class="gr" x1="58" y1="140.0" x2="584" y2="140.0"/>
 * <line class="gr" x1="58" y1="100.0" x2="584" y2="100.0"/>
 * <line class="gr" x1="58" y1="60.0" x2="584" y2="60.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="184.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">40</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">50</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="88.9" y="236" text-anchor="middle">64</text>
 * <text class="at" x="119.9" y="236" text-anchor="middle">128</text>
 * <text class="at" x="181.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="212.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="274.6" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="336.5" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="398.4" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="460.2" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="522.1" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.2M</text>
 * <polyline class="ln1" points="58.0,219.9 88.9,219.9 119.9,219.8 181.8,219.1 212.7,218.3 274.6,213.2 336.5,194.7 398.4,156.0 460.2,95.9 522.1,57.8 584.0,45.0"/>
 * <polyline class="ln2" points="58.0,219.9 88.9,219.8 119.9,219.8 181.8,219.1 212.7,218.2 274.6,212.5 336.5,191.1 398.4,150.7 460.2,87.0 522.1,47.8 584.0,36.0"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.8" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="212.7" cy="218.3" r="4"/>
 * <circle class="mk1" cx="274.6" cy="213.2" r="4"/>
 * <circle class="mk1" cx="336.5" cy="194.7" r="4"/>
 * <circle class="mk1" cx="398.4" cy="156.0" r="4"/>
 * <circle class="mk1" cx="460.2" cy="95.9" r="4"/>
 * <circle class="mk1" cx="522.1" cy="57.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.8" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.8" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="212.7" cy="218.2" r="4"/>
 * <circle class="mk2" cx="274.6" cy="212.5" r="4"/>
 * <circle class="mk2" cx="336.5" cy="191.1" r="4"/>
 * <circle class="mk2" cx="398.4" cy="150.7" r="4"/>
 * <circle class="mk2" cx="460.2" cy="87.0" r="4"/>
 * <circle class="mk2" cx="522.1" cy="47.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.0" r="4"/>
 * <line class="ln1" x1="58" y1="252" x2="74" y2="252"/>
 * <circle class="mk1" cx="66" cy="252" r="4"/>
 * <text class="lt" x="80" y="256">wgblas</text>
 * <line class="ln2" x1="132" y1="252" x2="148" y2="252"/>
 * <circle class="mk2" cx="140" cy="252" r="4"/>
 * <text class="lt" x="154" y="256">cuBLAS</text>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sdot-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.800</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="88.9" y="236" text-anchor="middle">64</text>
 * <text class="at" x="119.9" y="236" text-anchor="middle">128</text>
 * <text class="at" x="181.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="212.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="274.6" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="336.5" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="398.4" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="460.2" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="522.1" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.2M</text>
 * <polyline class="ln1" points="58.0,215.3 88.9,215.2 119.9,215.3 181.8,215.3 212.7,215.3 274.6,215.2 336.5,214.8 398.4,211.8 460.2,203.1 522.1,168.3 584.0,28.2"/>
 * <polyline class="ln2" points="58.0,217.4 88.9,217.3 119.9,215.7 181.8,215.6 212.7,215.6 274.6,215.6 336.5,215.5 398.4,212.4 460.2,204.2 522.1,171.3 584.0,37.7"/>
 * <circle class="mk1" cx="58.0" cy="215.3" r="4"/>
 * <circle class="mk1" cx="88.9" cy="215.2" r="4"/>
 * <circle class="mk1" cx="119.9" cy="215.3" r="4"/>
 * <circle class="mk1" cx="181.8" cy="215.3" r="4"/>
 * <circle class="mk1" cx="212.7" cy="215.3" r="4"/>
 * <circle class="mk1" cx="274.6" cy="215.2" r="4"/>
 * <circle class="mk1" cx="336.5" cy="214.8" r="4"/>
 * <circle class="mk1" cx="398.4" cy="211.8" r="4"/>
 * <circle class="mk1" cx="460.2" cy="203.1" r="4"/>
 * <circle class="mk1" cx="522.1" cy="168.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="88.9" cy="217.3" r="4"/>
 * <circle class="mk2" cx="119.9" cy="215.7" r="4"/>
 * <circle class="mk2" cx="181.8" cy="215.6" r="4"/>
 * <circle class="mk2" cx="212.7" cy="215.6" r="4"/>
 * <circle class="mk2" cx="274.6" cy="215.6" r="4"/>
 * <circle class="mk2" cx="336.5" cy="215.5" r="4"/>
 * <circle class="mk2" cx="398.4" cy="212.4" r="4"/>
 * <circle class="mk2" cx="460.2" cy="204.2" r="4"/>
 * <circle class="mk2" cx="522.1" cy="171.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="37.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0188 | 0.0137 | 0.0104 | 0.0247 | 55.3% |
 * | 64 | 0.0186 | 0.0275 | 0.0102 | 0.0500 | 55.1% |
 * | 128 | 0.0188 | 0.0545 | 0.0174 | 0.0589 | 92.5% |
 * | 512 | 0.0188 | 0.2175 | 0.0175 | 0.2338 | 93.0% |
 * | 1024 | 0.0190 | 0.4317 | 0.0140 | 0.5831 | 74.0% |
 * | 4096 | 0.0228 | 1.4372 | 0.0181 | 1.8092 | 79.4% |
 * | 16384 | 0.0328 | 4.0000 | 0.0292 | 4.4814 | 89.3% |
 * | 65536 | 0.0661 | 7.9284 | 0.0592 | 8.8538 | 89.5% |
 * | 262144 | 0.2084 | 10.0631 | 0.1947 | 10.7701 | 93.4% |
 * | 1048576 | 0.9317 | 9.0031 | 0.7318 | 11.4631 | 78.5% |
 *
 * <svg id="bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="186.7" x2="584" y2="186.7"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="53.3" x2="584" y2="53.3"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="190.7" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">6.0</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">8.0</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">10</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">12</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="93.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="128.1" y="236" text-anchor="middle">128</text>
 * <text class="at" x="198.3" y="236" text-anchor="middle">512</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="303.5" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="443.7" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="513.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0M</text>
 * <polyline class="ln1" points="58.0,219.8 93.1,219.5 128.1,219.1 198.3,216.4 233.3,212.8 303.5,196.0 373.6,153.3 443.7,87.9 513.9,52.3 584.0,69.9"/>
 * <polyline class="ln2" points="58.0,219.6 93.1,219.2 128.1,219.0 198.3,216.1 233.3,210.3 303.5,189.8 373.6,145.3 443.7,72.4 513.9,40.5 584.0,28.9"/>
 * <circle class="mk1" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.5" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.1" r="4"/>
 * <circle class="mk1" cx="198.3" cy="216.4" r="4"/>
 * <circle class="mk1" cx="233.3" cy="212.8" r="4"/>
 * <circle class="mk1" cx="303.5" cy="196.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="153.3" r="4"/>
 * <circle class="mk1" cx="443.7" cy="87.9" r="4"/>
 * <circle class="mk1" cx="513.9" cy="52.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="69.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.0" r="4"/>
 * <circle class="mk2" cx="198.3" cy="216.1" r="4"/>
 * <circle class="mk2" cx="233.3" cy="210.3" r="4"/>
 * <circle class="mk2" cx="303.5" cy="189.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="145.3" r="4"/>
 * <circle class="mk2" cx="443.7" cy="72.4" r="4"/>
 * <circle class="mk2" cx="513.9" cy="40.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="28.9" r="4"/>
 * <line class="ln1" x1="58" y1="252" x2="74" y2="252"/>
 * <circle class="mk1" cx="66" cy="252" r="4"/>
 * <text class="lt" x="80" y="256">wgblas</text>
 * <line class="ln2" x1="132" y1="252" x2="148" y2="252"/>
 * <circle class="mk2" cx="140" cy="252" r="4"/>
 * <text class="lt" x="154" y="256">cuBLAS</text>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sdot-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="180.0" x2="584" y2="180.0"/>
 * <line class="gr" x1="58" y1="140.0" x2="584" y2="140.0"/>
 * <line class="gr" x1="58" y1="100.0" x2="584" y2="100.0"/>
 * <line class="gr" x1="58" y1="60.0" x2="584" y2="60.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="93.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="128.1" y="236" text-anchor="middle">128</text>
 * <text class="at" x="198.3" y="236" text-anchor="middle">512</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="303.5" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="443.7" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="513.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0M</text>
 * <polyline class="ln1" points="58.0,216.2 93.1,216.3 128.1,216.2 198.3,216.2 233.3,216.2 303.5,215.4 373.6,213.4 443.7,206.8 513.9,178.3 584.0,33.7"/>
 * <polyline class="ln2" points="58.0,217.9 93.1,218.0 128.1,216.5 198.3,216.5 233.3,217.2 303.5,216.4 373.6,214.2 443.7,208.2 513.9,181.1 584.0,73.6"/>
 * <circle class="mk1" cx="58.0" cy="216.2" r="4"/>
 * <circle class="mk1" cx="93.1" cy="216.3" r="4"/>
 * <circle class="mk1" cx="128.1" cy="216.2" r="4"/>
 * <circle class="mk1" cx="198.3" cy="216.2" r="4"/>
 * <circle class="mk1" cx="233.3" cy="216.2" r="4"/>
 * <circle class="mk1" cx="303.5" cy="215.4" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.4" r="4"/>
 * <circle class="mk1" cx="443.7" cy="206.8" r="4"/>
 * <circle class="mk1" cx="513.9" cy="178.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="33.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk2" cx="93.1" cy="218.0" r="4"/>
 * <circle class="mk2" cx="128.1" cy="216.5" r="4"/>
 * <circle class="mk2" cx="198.3" cy="216.5" r="4"/>
 * <circle class="mk2" cx="233.3" cy="217.2" r="4"/>
 * <circle class="mk2" cx="303.5" cy="216.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="214.2" r="4"/>
 * <circle class="mk2" cx="443.7" cy="208.2" r="4"/>
 * <circle class="mk2" cx="513.9" cy="181.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="73.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0276 | 0.1482 | 0.0178 | 0.2306 | 64.3% |
 * | 1024 | 0.0283 | 0.2891 | 0.0177 | 0.4621 | 62.6% |
 * | 4096 | 0.0323 | 1.0139 | 0.0182 | 1.8028 | 56.2% |
 * | 16384 | 0.0472 | 2.7760 | 0.0313 | 4.1839 | 66.3% |
 * | 65536 | 0.0983 | 5.3316 | 0.0854 | 6.1375 | 86.9% |
 *
 * <svg id="bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">6.0</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">8.0</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,216.3 133.1,212.8 283.4,194.7 433.7,150.6 584.0,86.7"/>
 * <polyline class="ln2" points="58.0,214.2 133.1,208.4 283.4,174.9 433.7,115.4 584.0,66.6"/>
 * <circle class="mk1" cx="58.0" cy="216.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="212.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="194.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="150.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="86.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="214.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="208.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="174.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="115.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="66.6" r="4"/>
 * <line class="ln1" x1="58" y1="252" x2="74" y2="252"/>
 * <circle class="mk1" cx="66" cy="252" r="4"/>
 * <text class="lt" x="80" y="256">wgblas</text>
 * <line class="ln2" x1="132" y1="252" x2="148" y2="252"/>
 * <circle class="mk2" cx="140" cy="252" r="4"/>
 * <text class="lt" x="154" y="256">cuBLAS</text>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sdot-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="180.0" x2="584" y2="180.0"/>
 * <line class="gr" x1="58" y1="140.0" x2="584" y2="140.0"/>
 * <line class="gr" x1="58" y1="100.0" x2="584" y2="100.0"/>
 * <line class="gr" x1="58" y1="60.0" x2="584" y2="60.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="184.0" text-anchor="end">0.0200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.0400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.0600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.0800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.100</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,164.7 133.1,163.3 283.4,155.4 433.7,125.6 584.0,23.3"/>
 * <polyline class="ln2" points="58.0,184.4 133.1,184.6 283.4,183.6 433.7,157.4 584.0,49.2"/>
 * <circle class="mk1" cx="58.0" cy="164.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="163.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="155.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="125.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="184.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="184.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="183.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="157.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="49.2" r="4"/>
 * </svg>
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
