/**
 * Benchmark results for ssyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0041 | 1.0938 | 66.7% |
 * | 64 | 0.0061 | 2.7917 | 0.0042 | 4.1231 | 67.7% |
 * | 128 | 0.0063 | 10.5859 | 0.0043 | 15.6418 | 67.7% |
 * | 256 | 0.0069 | 38.1935 | 0.0051 | 51.9624 | 73.5% |
 * | 512 | 0.0098 | 108.0656 | 0.0084 | 125.8015 | 85.9% |
 * | 1024 | 0.0533 | 78.9052 | 0.0366 | 114.9091 | 68.7% |
 * | 1280 | 0.0860 | 76.3690 | 0.0722 | 90.9727 | 83.9% |
 * | 2048 | 0.1990 | 84.4209 | 0.1349 | 124.5832 | 67.8% |
 * | 4096 | 0.7779 | 86.3320 | 0.5201 | 129.1222 | 66.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssyr2-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.0 133.1,216.3 208.3,205.9 283.4,169.1 358.6,75.9 433.7,114.8 457.9,118.2 508.9,107.4 584.0,104.9"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,214.5 208.3,199.1 283.4,150.7 358.6,52.3 433.7,66.8 457.9,98.7 508.9,53.9 584.0,47.8"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="205.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="169.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="75.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="114.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="118.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="107.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="104.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="199.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="150.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="52.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="66.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="98.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="53.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="47.8" r="4"/>
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
 * <svg id="bc-ssyr2-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.3 358.6,217.6 433.7,206.7 457.9,198.5 508.9,170.2 584.0,25.5"/>
 * <polyline class="ln2" points="58.0,219.0 133.1,219.0 208.3,218.9 283.4,218.7 358.6,217.9 433.7,210.9 457.9,202.0 508.9,186.3 584.0,90.0"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="206.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="198.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="170.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="25.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="186.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="90.0" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/benchmark.ssyr2.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2
 */
