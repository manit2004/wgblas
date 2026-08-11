/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0047 | 0.5000 | 57.8% |
 * | 64 | 0.0082 | 1.0781 | 0.0066 | 1.3463 | 80.1% |
 * | 128 | 0.0085 | 4.0151 | 0.0123 | 2.7708 | 144.9% |
 * | 256 | 0.0107 | 12.5405 | 0.0320 | 4.1781 | 300.1% |
 * | 512 | 0.0148 | 35.8872 | 0.1096 | 4.8282 | 743.3% |
 * | 1024 | 0.0336 | 62.7200 | 0.4445 | 4.7406 | 1323.0% |
 * | 1280 | 0.0448 | 73.4811 | 0.2630 | 12.5099 | 587.4% |
 * | 2048 | 0.0922 | 91.2444 | 0.3397 | 24.7571 | 368.6% |
 * | 4096 | 0.3072 | 109.3600 | 0.9779 | 34.3562 | 318.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-strmv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.5 133.1,218.3 208.3,213.6 283.4,199.9 358.6,162.6 433.7,119.6 457.9,102.4 508.9,74.0 584.0,45.0"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,217.8 208.3,215.6 283.4,213.3 358.6,212.3 433.7,212.4 457.9,200.0 508.9,180.4 584.0,165.0"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="199.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="162.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="119.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="102.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="74.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="213.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="212.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="212.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="180.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="165.0" r="4"/>
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
 * <svg id="bc-strmv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,218.4 133.1,218.4 208.3,218.3 283.4,217.9 358.6,217.0 433.7,213.3 457.9,211.0 508.9,201.6 584.0,158.6"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,218.7 208.3,217.5 283.4,213.6 358.6,198.1 433.7,131.1 457.9,167.4 508.9,152.1 584.0,24.4"/>
 * <circle class="mk1" cx="58.0" cy="218.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="213.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="211.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="158.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="213.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="198.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="131.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="167.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="152.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="24.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/benchmark.strmv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmv
 */
