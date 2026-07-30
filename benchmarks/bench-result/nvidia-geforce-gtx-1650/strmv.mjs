/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.2868 | 0.1069 | 0.0222 | 1292.0% |
 * | 64 | 0.0083 | 1.0677 | 0.1048 | 0.0843 | 1266.5% |
 * | 128 | 0.0086 | 3.9554 | 0.0922 | 0.3693 | 1071.1% |
 * | 256 | 0.0108 | 12.4286 | 0.1364 | 0.9795 | 1268.9% |
 * | 512 | 0.0150 | 35.2000 | 0.1832 | 2.8900 | 1218.0% |
 * | 1024 | 0.0339 | 62.1283 | 0.4703 | 4.4809 | 1386.5% |
 * | 1280 | 0.0453 | 72.6759 | 0.3061 | 10.7458 | 676.3% |
 * | 2048 | 0.0944 | 89.1095 | 0.3929 | 21.4037 | 416.3% |
 * | 4096 | 0.3133 | 107.2157 | 0.9768 | 34.3922 | 311.7% |
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
 * <polyline class="ln1" points="58.0,219.5 133.1,218.3 208.3,213.7 283.4,200.1 358.6,163.7 433.7,120.6 457.9,103.7 508.9,77.4 584.0,48.5"/>
 * <polyline class="ln2" points="58.0,220.0 133.1,219.9 208.3,219.4 283.4,218.4 358.6,215.4 433.7,212.8 457.9,202.8 508.9,185.8 584.0,165.0"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="200.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="163.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="120.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="103.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="77.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="212.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="185.8" r="4"/>
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
 * <polyline class="ln1" points="58.0,218.3 133.1,218.3 208.3,218.3 283.4,217.8 358.6,217.0 433.7,213.2 457.9,210.9 508.9,201.1 584.0,157.3"/>
 * <polyline class="ln2" points="58.0,198.6 133.1,199.0 208.3,201.6 283.4,192.7 358.6,183.4 433.7,125.9 457.9,158.8 508.9,141.4 584.0,24.6"/>
 * <circle class="mk1" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="213.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="210.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="201.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="157.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="198.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="199.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="201.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="192.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="183.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="125.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="158.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="141.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="24.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/benchmark.strmv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmv
 */
