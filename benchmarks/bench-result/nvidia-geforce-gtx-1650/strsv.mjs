/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0433 | 0.0547 | 0.0118 | 0.2011 | 27.2% |
 * | 64 | 0.0801 | 0.1103 | 0.0140 | 0.6330 | 17.4% |
 * | 128 | 0.1645 | 0.2070 | 0.0184 | 1.8472 | 11.2% |
 * | 256 | 0.3688 | 0.3623 | 0.0278 | 4.8083 | 7.5% |
 * | 512 | 0.9260 | 0.5717 | 0.0471 | 11.2391 | 5.1% |
 * | 1024 | 3.3100 | 0.6367 | 0.0939 | 22.4458 | 2.8% |
 * | 2048 | 11.3910 | 0.7382 | 0.1962 | 42.8510 | 1.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-strsv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strsv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">40</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">50</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="145.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="321.0" y="236" text-anchor="middle">256</text>
 * <text class="at" x="408.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="496.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">2.0K</text>
 * <polyline class="ln1" points="58.0,219.8 145.7,219.6 233.3,219.2 321.0,218.6 408.7,217.7 496.3,217.5 584.0,217.0"/>
 * <polyline class="ln2" points="58.0,219.2 145.7,217.5 233.3,212.6 321.0,200.8 408.7,175.0 496.3,130.2 584.0,48.6"/>
 * <circle class="mk1" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk1" cx="145.7" cy="219.6" r="4"/>
 * <circle class="mk1" cx="233.3" cy="219.2" r="4"/>
 * <circle class="mk1" cx="321.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="408.7" cy="217.7" r="4"/>
 * <circle class="mk1" cx="496.3" cy="217.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="217.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="145.7" cy="217.5" r="4"/>
 * <circle class="mk2" cx="233.3" cy="212.6" r="4"/>
 * <circle class="mk2" cx="321.0" cy="200.8" r="4"/>
 * <circle class="mk2" cx="408.7" cy="175.0" r="4"/>
 * <circle class="mk2" cx="496.3" cy="130.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.6" r="4"/>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">4.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">6.00</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">8.00</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">10.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">12.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="145.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="321.0" y="236" text-anchor="middle">256</text>
 * <text class="at" x="408.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="496.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">2.0K</text>
 * <polyline class="ln1" points="58.0,219.3 145.7,218.7 233.3,217.3 321.0,213.9 408.7,204.6 496.3,164.8 584.0,30.2"/>
 * <polyline class="ln2" points="58.0,219.8 145.7,219.8 233.3,219.7 321.0,219.5 408.7,219.2 496.3,218.4 584.0,216.7"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="145.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="233.3" cy="217.3" r="4"/>
 * <circle class="mk1" cx="321.0" cy="213.9" r="4"/>
 * <circle class="mk1" cx="408.7" cy="204.6" r="4"/>
 * <circle class="mk1" cx="496.3" cy="164.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="145.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="233.3" cy="219.7" r="4"/>
 * <circle class="mk2" cx="321.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="408.7" cy="219.2" r="4"/>
 * <circle class="mk2" cx="496.3" cy="218.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="216.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/benchmark.strsv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
