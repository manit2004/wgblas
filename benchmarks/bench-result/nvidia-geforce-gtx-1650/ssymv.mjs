/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 0.2977 | 0.0040 | 0.6190 | 48.1% |
 * | 64 | 0.0091 | 0.9947 | 0.0043 | 2.1037 | 47.3% |
 * | 128 | 0.0102 | 3.3750 | 0.0055 | 6.2791 | 53.7% |
 * | 256 | 0.0146 | 9.2079 | 0.0078 | 17.3169 | 53.2% |
 * | 512 | 0.0209 | 25.4139 | 0.0125 | 42.4757 | 59.8% |
 * | 1024 | 0.0717 | 29.4571 | 0.0428 | 49.2970 | 59.8% |
 * | 1280 | 0.1146 | 28.7598 | 0.0668 | 49.2985 | 58.3% |
 * | 2048 | 0.2288 | 36.7940 | 0.1452 | 57.9639 | 63.5% |
 * | 4096 | 0.7899 | 42.5543 | 0.5489 | 61.2388 | 69.5% |
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
 * <polyline class="ln1" points="58.0,219.2 133.1,217.3 208.3,211.0 283.4,195.4 358.6,152.2 433.7,141.4 457.9,143.3 508.9,121.9 584.0,106.5"/>
 * <polyline class="ln2" points="58.0,218.3 133.1,214.4 208.3,203.3 283.4,173.8 358.6,106.7 433.7,88.5 457.9,88.5 508.9,65.4 584.0,56.7"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="195.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="152.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="141.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="143.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="121.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="106.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="203.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="173.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="106.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="88.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="88.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="65.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="56.7" r="4"/>
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
 * <polyline class="ln1" points="58.0,217.9 133.1,217.7 208.3,217.4 283.4,216.3 358.6,214.8 433.7,202.1 457.9,191.4 508.9,162.8 584.0,22.5"/>
 * <polyline class="ln2" points="58.0,219.0 133.1,218.9 208.3,218.6 283.4,218.0 358.6,216.9 433.7,209.3 457.9,203.3 508.9,183.7 584.0,82.8"/>
 * <circle class="mk1" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="214.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="191.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="162.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="22.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="216.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="209.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="203.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="183.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="82.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/benchmark.ssymv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
