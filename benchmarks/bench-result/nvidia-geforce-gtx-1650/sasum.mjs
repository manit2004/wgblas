/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0192 | 0.0067 | 0.0181 | 0.0071 | 93.9% |
 * | 64 | 0.0193 | 0.0133 | 0.0181 | 0.0141 | 94.1% |
 * | 128 | 0.0189 | 0.0271 | 0.0181 | 0.0283 | 95.8% |
 * | 512 | 0.0192 | 0.1064 | 0.0182 | 0.1127 | 94.4% |
 * | 1024 | 0.0193 | 0.2126 | 0.0182 | 0.2248 | 94.6% |
 * | 4096 | 0.0191 | 0.8598 | 0.0180 | 0.9110 | 94.4% |
 * | 16384 | 0.0198 | 3.3166 | 0.0181 | 3.6248 | 91.5% |
 * | 65536 | 0.0198 | 13.2129 | 0.0181 | 14.4480 | 91.5% |
 * | 262144 | 0.0256 | 40.9344 | 0.0198 | 52.9798 | 77.3% |
 * | 1048576 | 0.0455 | 92.2393 | 0.0438 | 95.8129 | 96.3% |
 * | 4194304 | 0.1160 | 144.5913 | 0.1364 | 123.0145 | 117.5% |
 * | 16777216 | 0.4066 | 165.0521 | 0.5505 | 121.9133 | 135.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.7 362.5,206.8 417.9,179.1 473.3,127.8 528.6,75.4 584.0,54.9"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.4 362.5,205.6 417.9,167.0 473.3,124.2 528.6,97.0 584.0,98.1"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="206.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="179.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="127.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="75.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="54.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="167.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="124.2" r="4"/>
 * <circle class="mk2" cx="528.6" cy="97.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="98.1" r="4"/>
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
 * <polyline class="ln1" points="58.0,213.6 85.7,213.6 113.4,213.7 168.7,213.6 196.4,213.6 251.8,213.6 307.2,213.4 362.5,213.4 417.9,211.5 473.3,204.8 528.6,181.3 584.0,84.5"/>
 * <polyline class="ln2" points="58.0,214.0 85.7,214.0 113.4,214.0 168.7,213.9 196.4,213.9 251.8,214.0 307.2,214.0 362.5,214.0 417.9,213.4 473.3,205.4 528.6,174.5 584.0,36.5"/>
 * <circle class="mk1" cx="58.0" cy="213.6" r="4"/>
 * <circle class="mk1" cx="85.7" cy="213.6" r="4"/>
 * <circle class="mk1" cx="113.4" cy="213.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="213.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="213.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.5" r="4"/>
 * <circle class="mk1" cx="473.3" cy="204.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="181.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="84.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="214.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="214.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="214.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="213.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="213.9" r="4"/>
 * <circle class="mk2" cx="251.8" cy="214.0" r="4"/>
 * <circle class="mk2" cx="307.2" cy="214.0" r="4"/>
 * <circle class="mk2" cx="362.5" cy="214.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.4" r="4"/>
 * <circle class="mk2" cx="473.3" cy="205.4" r="4"/>
 * <circle class="mk2" cx="528.6" cy="174.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/benchmark.sasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
