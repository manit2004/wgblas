/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3805 | 0.0041 | 0.6047 | 62.9% |
 * | 64 | 0.0068 | 1.3460 | 0.0052 | 1.7531 | 76.8% |
 * | 128 | 0.0079 | 4.3548 | 0.0066 | 5.2300 | 83.3% |
 * | 256 | 0.0123 | 10.9157 | 0.0067 | 20.0859 | 54.3% |
 * | 512 | 0.0247 | 21.5130 | 0.0118 | 44.8865 | 47.9% |
 * | 1024 | 0.0725 | 29.1320 | 0.0345 | 61.2096 | 47.6% |
 * | 1280 | 0.1142 | 28.8444 | 0.0492 | 67.0312 | 43.0% |
 * | 2048 | 0.2552 | 32.9851 | 0.1119 | 75.2510 | 43.8% |
 * | 4096 | 1.1471 | 29.3018 | 0.4114 | 81.6962 | 35.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssymv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">100</text>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,217.3 208.3,211.3 283.4,198.2 358.6,177.0 433.7,161.7 457.9,162.3 508.9,154.0 584.0,161.4"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,216.5 208.3,209.5 283.4,179.8 358.6,130.2 433.7,97.6 457.9,85.9 508.9,69.5 584.0,56.6"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="198.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="177.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="161.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="162.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="154.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="161.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="209.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="179.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="130.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="97.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="85.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="69.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="56.6" r="4"/>
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
 * <svg id="bc-ssymv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.20</text>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.7 283.4,217.9 358.6,215.9 433.7,207.9 457.9,201.0 508.9,177.5 584.0,28.8"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.1 208.3,218.9 283.4,218.9 358.6,218.0 433.7,214.2 457.9,211.8 508.9,201.4 584.0,151.4"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="215.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="207.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="214.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="211.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="201.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="151.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/benchmark.ssymv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
