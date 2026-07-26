/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0067 | 0.3524 | 0.0040 | 0.5873 | 60.0% |
 * | 64 | 0.0068 | 1.3019 | 0.0056 | 1.5908 | 81.8% |
 * | 128 | 0.0071 | 4.8036 | 0.0099 | 3.4545 | 139.1% |
 * | 256 | 0.0101 | 13.1735 | 0.0250 | 5.3402 | 246.7% |
 * | 512 | 0.0142 | 37.1775 | 0.0854 | 6.1986 | 599.8% |
 * | 1024 | 0.0327 | 64.4384 | 0.3420 | 6.1617 | 1045.8% |
 * | 1280 | 0.0453 | 72.6759 | 0.2046 | 16.0801 | 452.0% |
 * | 2048 | 0.0942 | 89.2609 | 0.2682 | 31.3491 | 284.7% |
 * | 4096 | 0.3133 | 107.2157 | 0.9830 | 34.1750 | 313.7% |
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
 * <polyline class="ln1" points="58.0,219.4 133.1,217.9 208.3,212.3 283.4,198.9 358.6,160.5 433.7,116.9 457.9,103.7 508.9,77.2 584.0,48.5"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,217.5 208.3,214.5 283.4,211.5 358.6,210.1 433.7,210.1 457.9,194.3 508.9,169.8 584.0,165.3"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="212.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="198.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="160.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="116.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="103.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="77.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="214.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="211.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="210.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="194.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="169.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="165.3" r="4"/>
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
 * <polyline class="ln1" points="58.0,218.7 133.1,218.6 208.3,218.6 283.4,218.0 358.6,217.2 433.7,213.5 457.9,210.9 508.9,201.2 584.0,157.3"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,218.9 208.3,218.0 283.4,215.0 358.6,202.9 433.7,151.6 457.9,179.1 508.9,166.4 584.0,23.4"/>
 * <circle class="mk1" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="213.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="210.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="201.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="157.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="202.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="151.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="179.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="166.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="23.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/benchmark.strmv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmv
 */
