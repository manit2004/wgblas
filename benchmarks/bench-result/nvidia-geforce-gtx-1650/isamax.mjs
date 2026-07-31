/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0163 | 0.0079 | 0.0170 | 0.0075 | 104.9% |
 * | 64 | 0.0162 | 0.0158 | 0.0169 | 0.0152 | 103.8% |
 * | 128 | 0.0162 | 0.0316 | 0.0169 | 0.0303 | 104.4% |
 * | 512 | 0.0164 | 0.1251 | 0.0170 | 0.1208 | 103.6% |
 * | 1024 | 0.0162 | 0.2525 | 0.0170 | 0.2411 | 104.7% |
 * | 4096 | 0.0163 | 1.0059 | 0.0181 | 0.9062 | 111.0% |
 * | 16384 | 0.0164 | 4.0000 | 0.0182 | 3.5930 | 111.3% |
 * | 65536 | 0.0170 | 15.4275 | 0.0181 | 14.4607 | 106.7% |
 * | 262144 | 0.0220 | 47.6972 | 0.0200 | 52.4288 | 91.0% |
 * | 1048576 | 0.0427 | 98.1813 | 0.0408 | 102.7613 | 95.5% |
 * | 4194304 | 0.1117 | 150.1828 | 0.1074 | 156.1543 | 96.2% |
 * | 16777216 | 0.4096 | 163.8464 | 0.3981 | 168.5610 | 97.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.7 251.8,219.0 307.2,216.0 362.5,204.6 417.9,172.3 473.3,121.8 528.6,69.8 584.0,56.2"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.4 362.5,205.5 417.9,167.6 473.3,117.2 528.6,63.8 584.0,51.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.0" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="204.6" r="4"/>
 * <circle class="mk1" cx="417.9" cy="172.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="121.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="69.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="167.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="117.2" r="4"/>
 * <circle class="mk2" cx="528.6" cy="63.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="51.4" r="4"/>
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
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.500</text>
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
 * <polyline class="ln1" points="58.0,213.5 85.7,213.5 113.4,213.5 168.7,213.5 196.4,213.5 251.8,213.5 307.2,213.4 362.5,213.2 417.9,211.2 473.3,202.9 528.6,175.3 584.0,56.2"/>
 * <polyline class="ln2" points="58.0,213.2 85.7,213.2 113.4,213.2 168.7,213.2 196.4,213.2 251.8,212.8 307.2,212.7 362.5,212.8 417.9,212.0 473.3,203.7 528.6,177.0 584.0,60.8"/>
 * <circle class="mk1" cx="58.0" cy="213.5" r="4"/>
 * <circle class="mk1" cx="85.7" cy="213.5" r="4"/>
 * <circle class="mk1" cx="113.4" cy="213.5" r="4"/>
 * <circle class="mk1" cx="168.7" cy="213.5" r="4"/>
 * <circle class="mk1" cx="196.4" cy="213.5" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.5" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.2" r="4"/>
 * <circle class="mk1" cx="473.3" cy="202.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="175.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.2" r="4"/>
 * <circle class="mk2" cx="85.7" cy="213.2" r="4"/>
 * <circle class="mk2" cx="113.4" cy="213.2" r="4"/>
 * <circle class="mk2" cx="168.7" cy="213.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="213.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="212.8" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.7" r="4"/>
 * <circle class="mk2" cx="362.5" cy="212.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="212.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="203.7" r="4"/>
 * <circle class="mk2" cx="528.6" cy="177.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="60.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
