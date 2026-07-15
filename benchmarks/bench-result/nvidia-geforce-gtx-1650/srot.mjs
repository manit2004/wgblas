/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.0744 | 0.0029 | 0.1758 | 42.3% |
 * | 64 | 0.0069 | 0.1488 | 0.0030 | 0.3441 | 43.3% |
 * | 128 | 0.0073 | 0.2819 | 0.0034 | 0.5981 | 47.1% |
 * | 512 | 0.0069 | 1.1907 | 0.0032 | 2.5600 | 46.5% |
 * | 1024 | 0.0072 | 2.2605 | 0.0031 | 5.2513 | 43.0% |
 * | 4096 | 0.0071 | 9.2045 | 0.0033 | 19.5981 | 47.0% |
 * | 16384 | 0.0082 | 32.0000 | 0.0041 | 64.0000 | 50.0% |
 * | 65536 | 0.0101 | 103.6962 | 0.0077 | 135.4050 | 76.6% |
 * | 262144 | 0.0298 | 140.7863 | 0.0308 | 136.1080 | 103.4% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1112 | 150.9177 | 108.6% |
 * | 4194304 | 0.3912 | 171.5602 | 0.4571 | 146.8285 | 116.8% |
 * | 16777216 | 1.5485 | 173.3524 | 1.7357 | 154.6544 | 112.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-srot-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srot-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.7 168.7,218.8 196.4,217.7 251.8,210.8 307.2,188.0 362.5,116.3 417.9,79.2 473.3,56.2 528.6,48.4 584.0,46.6"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.7 113.4,219.4 168.7,217.4 196.4,214.7 251.8,200.4 307.2,156.0 362.5,84.6 417.9,83.9 473.3,69.1 528.6,73.2 584.0,65.3"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="210.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="188.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="116.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="79.2" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="200.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="156.0" r="4"/>
 * <circle class="mk2" cx="362.5" cy="84.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="83.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="69.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="73.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="65.3" r="4"/>
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
 * <svg id="bc-srot-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srot-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srot-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srot-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 85.7,219.3 113.4,219.3 168.7,219.3 196.4,219.3 251.8,219.3 307.2,219.2 362.5,219.0 417.9,217.0 473.3,209.8 528.6,180.9 584.0,65.2"/>
 * <polyline class="ln2" points="58.0,219.7 85.7,219.7 113.4,219.7 168.7,219.7 196.4,219.7 251.8,219.7 307.2,219.6 362.5,219.2 417.9,216.9 473.3,208.9 528.6,174.3 584.0,46.4"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="219.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="180.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="65.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.2" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="208.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="174.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="46.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/benchmark.srot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
