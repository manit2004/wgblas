/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0215 | 0.0060 | 0.0175 | 0.0073 | 81.6% |
 * | 64 | 0.0207 | 0.0123 | 0.0170 | 0.0151 | 81.8% |
 * | 128 | 0.0206 | 0.0249 | 0.0170 | 0.0301 | 82.7% |
 * | 512 | 0.0218 | 0.0940 | 0.0183 | 0.1118 | 84.1% |
 * | 1024 | 0.0219 | 0.1867 | 0.0169 | 0.2420 | 77.2% |
 * | 4096 | 0.0216 | 0.7602 | 0.0185 | 0.8835 | 86.0% |
 * | 16384 | 0.0214 | 3.0567 | 0.0187 | 3.5129 | 87.0% |
 * | 65536 | 0.0226 | 11.6034 | 0.0188 | 13.9795 | 83.0% |
 * | 262144 | 0.0289 | 36.2478 | 0.0216 | 48.4375 | 74.8% |
 * | 1048576 | 0.0484 | 86.6592 | 0.0447 | 93.8575 | 92.3% |
 * | 4194304 | 0.1184 | 141.7569 | 0.1092 | 153.7051 | 92.2% |
 * | 16777216 | 0.4087 | 164.1928 | 0.4030 | 166.5332 | 98.6% |
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,216.9 362.5,208.4 417.9,183.8 473.3,133.3 528.6,78.2 584.0,55.8"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.5 362.5,206.0 417.9,171.6 473.3,126.1 528.6,66.3 584.0,53.5"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="208.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="183.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="133.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="78.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="206.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="171.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="126.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="66.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="53.5" r="4"/>
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
 * <polyline class="ln1" points="58.0,211.4 85.7,211.7 113.4,211.8 168.7,211.3 196.4,211.2 251.8,211.4 307.2,211.4 362.5,211.0 417.9,208.4 473.3,200.6 528.6,172.7 584.0,56.5"/>
 * <polyline class="ln2" points="58.0,213.0 85.7,213.2 113.4,213.2 168.7,212.7 196.4,213.2 251.8,212.6 307.2,212.5 362.5,212.5 417.9,211.4 473.3,202.1 528.6,176.3 584.0,58.8"/>
 * <circle class="mk1" cx="58.0" cy="211.4" r="4"/>
 * <circle class="mk1" cx="85.7" cy="211.7" r="4"/>
 * <circle class="mk1" cx="113.4" cy="211.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="211.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="211.2" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="211.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="211.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="208.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="200.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="172.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="213.2" r="4"/>
 * <circle class="mk2" cx="113.4" cy="213.2" r="4"/>
 * <circle class="mk2" cx="168.7" cy="212.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="213.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="212.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="212.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="211.4" r="4"/>
 * <circle class="mk2" cx="473.3" cy="202.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="176.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="58.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
