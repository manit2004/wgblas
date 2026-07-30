/**
 * Benchmark results for sger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 1.1186 | 0.0041 | 2.0625 | 54.2% |
 * | 64 | 0.0077 | 4.2975 | 0.0041 | 8.1250 | 52.9% |
 * | 128 | 0.0082 | 16.1250 | 0.0041 | 32.2500 | 50.0% |
 * | 256 | 0.0100 | 52.6336 | 0.0058 | 90.3736 | 58.2% |
 * | 512 | 0.0184 | 114.0000 | 0.0147 | 142.9032 | 79.8% |
 * | 1024 | 0.0607 | 138.3966 | 0.0626 | 134.0828 | 103.2% |
 * | 1280 | 0.0930 | 141.0356 | 0.0963 | 136.2766 | 103.5% |
 * | 2048 | 0.2234 | 150.2561 | 0.2369 | 141.7016 | 106.0% |
 * | 4096 | 0.8580 | 156.4720 | 0.9359 | 143.4398 | 109.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sger-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.9 133.1,215.7 208.3,203.9 283.4,167.4 358.6,106.0 433.7,81.6 457.9,79.0 508.9,69.7 584.0,63.5"/>
 * <polyline class="ln2" points="58.0,217.9 133.1,211.9 208.3,187.8 283.4,129.6 358.6,77.1 433.7,85.9 457.9,83.7 508.9,78.3 584.0,76.6"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="203.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="167.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="106.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="81.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="79.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="69.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="63.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="211.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="187.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="129.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="77.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="85.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="83.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="78.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="76.6" r="4"/>
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
 * <svg id="bc-sger-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.0 358.6,216.3 433.7,207.9 457.9,201.4 508.9,175.3 584.0,48.4"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,218.8 358.6,217.1 433.7,207.5 457.9,200.7 508.9,172.6 584.0,32.8"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="207.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="207.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="172.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="32.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/benchmark.sger.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sger
 */
