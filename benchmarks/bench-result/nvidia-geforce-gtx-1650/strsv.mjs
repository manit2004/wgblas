/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0430 | 0.0551 | 0.0116 | 0.2047 | 26.9% |
 * | 64 | 0.0778 | 0.1135 | 0.0139 | 0.6338 | 17.9% |
 * | 128 | 0.1517 | 0.2244 | 0.0184 | 1.8472 | 12.2% |
 * | 256 | 0.3011 | 0.4438 | 0.0275 | 4.8530 | 9.1% |
 * | 512 | 0.6083 | 0.8703 | 0.0464 | 11.4175 | 7.6% |
 * | 1024 | 1.4338 | 1.4698 | 0.0940 | 22.4305 | 6.6% |
 * | 2048 | 2.4176 | 3.4782 | 0.1973 | 42.6217 | 8.2% |
 * | 4096 | 5.2674 | 6.3780 | 0.4717 | 71.2153 | 9.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-strsv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strsv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.9 133.1,219.7 208.3,219.4 283.4,218.8 358.6,217.7 433.7,216.1 508.9,210.7 584.0,203.0"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,218.3 208.3,215.1 283.4,207.1 358.6,189.6 433.7,160.2 508.9,106.3 584.0,30.1"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="216.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="210.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="203.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="207.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="189.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="160.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="106.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="30.1" r="4"/>
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
 * <svg id="bc-strsv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strsv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strsv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strsv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strsv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strsv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strsv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">4.00</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">5.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">6.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.6 133.1,217.4 208.3,214.9 283.4,210.0 358.6,199.7 433.7,172.2 508.9,139.4 584.0,44.4"/>
 * <polyline class="ln2" points="58.0,219.6 133.1,219.5 208.3,219.4 283.4,219.1 358.6,218.5 433.7,216.9 508.9,213.4 584.0,204.3"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="199.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="172.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="139.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="44.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="216.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="213.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="204.3" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/benchmark.strsv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
