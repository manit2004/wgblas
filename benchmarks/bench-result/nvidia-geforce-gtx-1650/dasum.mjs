/**
 * Benchmark results for dasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0290 | 0.0088 | 0.0188 | 0.0136 | 64.9% |
 * | 64 | 0.0291 | 0.0176 | 0.0189 | 0.0271 | 64.9% |
 * | 128 | 0.0308 | 0.0333 | 0.0194 | 0.0527 | 63.1% |
 * | 512 | 0.0327 | 0.1254 | 0.0225 | 0.1818 | 69.0% |
 * | 1024 | 0.0329 | 0.2490 | 0.0186 | 0.4414 | 56.4% |
 * | 4096 | 0.0345 | 0.9499 | 0.0187 | 1.7519 | 54.2% |
 * | 16384 | 0.0391 | 3.3546 | 0.0182 | 7.1986 | 46.6% |
 * | 65536 | 0.0522 | 10.0392 | 0.0226 | 23.2397 | 43.2% |
 * | 262144 | 0.1174 | 17.8597 | 0.0357 | 58.8030 | 30.4% |
 * | 1048576 | 0.3219 | 26.0593 | 0.0939 | 89.3774 | 29.2% |
 * | 4194304 | 0.9901 | 33.8890 | 0.3165 | 106.0078 | 32.0% |
 * | 16777216 | 3.2912 | 40.7814 | 1.1816 | 113.5852 | 35.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-dasum-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-dasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">125</text>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.5 307.2,214.6 362.5,203.9 417.9,191.4 473.3,178.3 528.6,165.8 584.0,154.7"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.7 196.4,219.3 251.8,217.2 307.2,208.5 362.5,182.8 417.9,125.9 473.3,77.0 528.6,50.4 584.0,38.3"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.5" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="203.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="191.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="178.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="165.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="154.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="217.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="208.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="182.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="125.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="77.0" r="4"/>
 * <circle class="mk2" cx="528.6" cy="50.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="38.3" r="4"/>
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
 * <svg id="bc-dasum-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-dasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">4.00</text>
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
 * <polyline class="ln1" points="58.0,218.5 85.7,218.5 113.4,218.5 168.7,218.4 196.4,218.4 251.8,218.3 307.2,218.0 362.5,217.4 417.9,214.1 473.3,203.9 528.6,170.5 584.0,55.4"/>
 * <polyline class="ln2" points="58.0,219.1 85.7,219.1 113.4,219.0 168.7,218.9 196.4,219.1 251.8,219.1 307.2,219.1 362.5,218.9 417.9,218.2 473.3,215.3 528.6,204.2 584.0,160.9"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.5" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.5" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="217.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="214.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="203.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="170.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.1" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="218.9" r="4"/>
 * <circle class="mk2" cx="417.9" cy="218.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="215.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="204.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="160.9" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/benchmark.dasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dasum
 */
