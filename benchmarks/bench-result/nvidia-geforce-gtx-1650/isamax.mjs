/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0204 | 0.0063 | 0.0174 | 0.0074 | 84.6% |
 * | 64 | 0.0206 | 0.0124 | 0.0140 | 0.0183 | 68.0% |
 * | 128 | 0.0202 | 0.0253 | 0.0133 | 0.0385 | 65.7% |
 * | 512 | 0.0205 | 0.1000 | 0.0192 | 0.1069 | 93.5% |
 * | 1024 | 0.0203 | 0.2014 | 0.0185 | 0.2216 | 90.9% |
 * | 4096 | 0.0203 | 0.8088 | 0.0195 | 0.8387 | 96.4% |
 * | 16384 | 0.0205 | 3.1900 | 0.0196 | 3.3382 | 95.6% |
 * | 65536 | 0.0214 | 12.2269 | 0.0195 | 13.4185 | 91.1% |
 * | 262144 | 0.0336 | 31.2523 | 0.0248 | 42.3086 | 73.9% |
 * | 1048576 | 0.0709 | 59.1881 | 0.0422 | 99.3722 | 59.6% |
 * | 4194304 | 0.2254 | 74.4357 | 0.1103 | 152.0777 | 48.9% |
 * | 16777216 | 0.8809 | 76.1839 | 0.4069 | 164.9223 | 46.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,216.8 362.5,207.8 417.9,188.7 473.3,160.8 528.6,145.6 584.0,143.8"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,216.7 362.5,206.6 417.9,177.7 473.3,120.6 528.6,67.9 584.0,55.1"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="207.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="188.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="160.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="145.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="143.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk2" cx="362.5" cy="206.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="177.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="120.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="67.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="55.1" r="4"/>
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
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 85.7,215.9 113.4,216.0 168.7,215.9 196.4,215.9 251.8,215.9 307.2,215.9 362.5,215.7 417.9,213.3 473.3,205.8 528.6,174.9 584.0,43.8"/>
 * <polyline class="ln2" points="58.0,216.5 85.7,217.2 113.4,217.3 168.7,216.2 196.4,216.3 251.8,216.1 307.2,216.1 362.5,216.1 417.9,215.0 473.3,211.6 528.6,197.9 584.0,138.6"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="216.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.9" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.9" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="215.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="213.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="205.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="174.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="43.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.5" r="4"/>
 * <circle class="mk2" cx="85.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="113.4" cy="217.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="216.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="216.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="216.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="215.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="211.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="197.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="138.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
