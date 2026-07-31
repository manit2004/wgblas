/**
 * Benchmark results for ssyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0041 | 1.0625 | 66.7% |
 * | 64 | 0.0061 | 2.7500 | 0.0041 | 4.1250 | 66.7% |
 * | 128 | 0.0063 | 10.5051 | 0.0041 | 16.2500 | 64.6% |
 * | 256 | 0.0069 | 38.4000 | 0.0044 | 59.3957 | 64.7% |
 * | 512 | 0.0092 | 114.0243 | 0.0077 | 136.2153 | 83.7% |
 * | 1024 | 0.0512 | 82.0800 | 0.0345 | 121.7691 | 67.4% |
 * | 1280 | 0.0840 | 78.1707 | 0.0714 | 91.9821 | 85.0% |
 * | 2048 | 0.1919 | 87.5323 | 0.1251 | 134.2199 | 65.2% |
 * | 4096 | 0.7440 | 90.2480 | 0.4911 | 136.7068 | 66.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssyr-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.1 133.1,216.3 208.3,206.0 283.4,168.8 358.6,68.0 433.7,110.6 457.9,115.8 508.9,103.3 584.0,99.7"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,214.5 208.3,198.3 283.4,140.8 358.6,38.4 433.7,57.6 457.9,97.4 508.9,41.0 584.0,37.7"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="206.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="168.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="68.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="110.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="115.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="103.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="99.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="140.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="38.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="57.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="97.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="41.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="37.7" r="4"/>
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
 * <svg id="bc-ssyr-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.3 358.6,217.7 433.7,207.2 457.9,199.0 508.9,172.0 584.0,34.0"/>
 * <polyline class="ln2" points="58.0,219.0 133.1,219.0 208.3,219.0 283.4,218.9 358.6,218.1 433.7,211.4 457.9,202.1 508.9,188.7 584.0,97.2"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="207.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="199.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="172.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="34.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="188.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="97.2" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/benchmark.ssyr.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr
 */
