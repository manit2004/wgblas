/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0038 | 0.1339 | 62.2% |
 * | 64 | 0.0061 | 0.1667 | 0.0038 | 0.2667 | 62.5% |
 * | 128 | 0.0061 | 0.3333 | 0.0040 | 0.5100 | 65.4% |
 * | 512 | 0.0061 | 1.3333 | 0.0036 | 2.2456 | 59.4% |
 * | 1024 | 0.0061 | 2.6667 | 0.0032 | 5.0443 | 52.9% |
 * | 4096 | 0.0061 | 10.6667 | 0.0036 | 18.3677 | 58.1% |
 * | 16384 | 0.0068 | 38.6415 | 0.0038 | 68.2667 | 56.6% |
 * | 65536 | 0.0085 | 123.6528 | 0.0067 | 156.0381 | 79.2% |
 * | 262144 | 0.0290 | 144.6711 | 0.0277 | 151.5283 | 95.5% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1007 | 166.6787 | 98.3% |
 * | 4194304 | 0.3957 | 169.5833 | 0.3949 | 169.9475 | 99.8% |
 * | 16777216 | 1.5515 | 173.0216 | 1.5648 | 171.5427 | 100.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="85.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="113.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="168.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="196.4" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="251.8" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="307.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="362.5" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="417.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="473.3" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="528.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,219.9 85.7,219.8 113.4,219.7 168.7,218.7 196.4,217.3 251.8,209.3 307.2,181.4 362.5,96.3 417.9,75.3 473.3,56.2 528.6,50.4 584.0,47.0"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.7 113.4,219.5 168.7,217.8 196.4,215.0 251.8,201.6 307.2,151.7 362.5,64.0 417.9,68.5 473.3,53.3 528.6,50.1 584.0,48.5"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="209.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="181.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="96.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="75.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="50.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="47.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="215.0" r="4"/>
 * <circle class="mk2" cx="251.8" cy="201.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="151.7" r="4"/>
 * <circle class="mk2" cx="362.5" cy="64.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="68.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="53.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="50.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.5" r="4"/>
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
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">2.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="85.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="113.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="168.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="196.4" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="251.8" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="307.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="362.5" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="417.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="473.3" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="528.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,219.4 85.7,219.4 113.4,219.4 168.7,219.4 196.4,219.4 251.8,219.4 307.2,219.3 362.5,219.2 417.9,217.1 473.3,209.8 528.6,180.4 584.0,64.9"/>
 * <polyline class="ln2" points="58.0,219.6 85.7,219.6 113.4,219.6 168.7,219.6 196.4,219.7 251.8,219.6 307.2,219.6 362.5,219.3 417.9,217.2 473.3,209.9 528.6,180.5 584.0,63.5"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="219.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="180.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="64.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="217.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="180.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="63.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/benchmark.srotm.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srotm
 */
