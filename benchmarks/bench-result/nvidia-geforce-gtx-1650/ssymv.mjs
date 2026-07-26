/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0040 | 0.6215 | 60.9% |
 * | 64 | 0.0068 | 1.3333 | 0.0042 | 2.1679 | 61.5% |
 * | 128 | 0.0082 | 4.2188 | 0.0044 | 7.8545 | 53.7% |
 * | 256 | 0.0119 | 11.2815 | 0.0064 | 21.0400 | 53.6% |
 * | 512 | 0.0235 | 22.6421 | 0.0102 | 52.1444 | 43.4% |
 * | 1024 | 0.0692 | 30.5199 | 0.0348 | 60.7029 | 50.3% |
 * | 1280 | 0.1105 | 29.8262 | 0.0602 | 54.7514 | 54.5% |
 * | 2048 | 0.2458 | 34.2433 | 0.1249 | 67.3771 | 50.8% |
 * | 4096 | 1.1896 | 28.2543 | 0.4813 | 69.8383 | 40.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssymv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">25</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">75</text>
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
 * <polyline class="ln1" points="58.0,219.0 133.1,216.4 208.3,208.8 283.4,189.9 358.6,159.6 433.7,138.6 457.9,140.5 508.9,128.7 584.0,144.7"/>
 * <polyline class="ln2" points="58.0,218.3 133.1,214.2 208.3,199.1 283.4,163.9 358.6,80.9 433.7,58.1 457.9,74.0 508.9,40.3 584.0,33.8"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="189.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="159.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="138.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="140.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="128.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="144.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="199.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="163.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="80.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="58.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="74.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="40.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.8" r="4"/>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.6 283.4,218.0 358.6,216.1 433.7,208.5 457.9,201.6 508.9,179.0 584.0,21.7"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.3 283.4,218.9 358.6,218.3 433.7,214.2 457.9,210.0 508.9,199.2 584.0,139.8"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="179.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="21.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="214.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="210.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="199.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="139.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/benchmark.ssymv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
