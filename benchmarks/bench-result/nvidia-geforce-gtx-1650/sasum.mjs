/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0188 | 0.0068 | 0.0185 | 0.0069 | 98.4% |
 * | 64 | 0.0191 | 0.0134 | 0.0182 | 0.0140 | 95.6% |
 * | 128 | 0.0188 | 0.0272 | 0.0189 | 0.0270 | 100.8% |
 * | 512 | 0.0193 | 0.1063 | 0.0191 | 0.1073 | 99.1% |
 * | 1024 | 0.0190 | 0.2153 | 0.0188 | 0.2173 | 99.1% |
 * | 4096 | 0.0185 | 0.8873 | 0.0180 | 0.9094 | 97.6% |
 * | 16384 | 0.0196 | 3.3409 | 0.0183 | 3.5836 | 93.2% |
 * | 65536 | 0.0196 | 13.4075 | 0.0188 | 13.9201 | 96.3% |
 * | 262144 | 0.0261 | 40.1077 | 0.0207 | 50.7245 | 79.1% |
 * | 1048576 | 0.0455 | 92.2717 | 0.0453 | 92.6631 | 99.6% |
 * | 4194304 | 0.1157 | 144.9711 | 0.1402 | 119.6868 | 121.1% |
 * | 16777216 | 0.4039 | 166.1439 | 0.5671 | 118.3361 | 140.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.7 362.5,206.6 417.9,179.9 473.3,127.7 528.6,75.0 584.0,53.9"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.4 362.5,206.1 417.9,169.3 473.3,127.3 528.6,100.3 584.0,101.7"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="206.6" r="4"/>
 * <circle class="mk1" cx="417.9" cy="179.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="127.7" r="4"/>
 * <circle class="mk1" cx="528.6" cy="75.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="53.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="206.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="169.3" r="4"/>
 * <circle class="mk2" cx="473.3" cy="127.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="100.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="101.7" r="4"/>
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
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.600</text>
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
 * <polyline class="ln1" points="58.0,213.7 85.7,213.6 113.4,213.7 168.7,213.6 196.4,213.7 251.8,213.8 307.2,213.5 362.5,213.5 417.9,211.3 473.3,204.8 528.6,181.4 584.0,85.4"/>
 * <polyline class="ln2" points="58.0,213.8 85.7,213.9 113.4,213.7 168.7,213.6 196.4,213.7 251.8,214.0 307.2,213.9 362.5,213.7 417.9,213.1 473.3,204.9 528.6,173.3 584.0,31.0"/>
 * <circle class="mk1" cx="58.0" cy="213.7" r="4"/>
 * <circle class="mk1" cx="85.7" cy="213.6" r="4"/>
 * <circle class="mk1" cx="113.4" cy="213.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="213.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="213.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.5" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="204.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="181.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="85.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="213.9" r="4"/>
 * <circle class="mk2" cx="113.4" cy="213.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="213.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="213.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="214.0" r="4"/>
 * <circle class="mk2" cx="307.2" cy="213.9" r="4"/>
 * <circle class="mk2" cx="362.5" cy="213.7" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="173.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="31.0" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/benchmark.sasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
