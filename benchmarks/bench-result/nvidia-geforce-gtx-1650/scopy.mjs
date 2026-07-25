/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.0388 | 0.0026 | 0.0976 | 39.8% |
 * | 64 | 0.0064 | 0.0800 | 0.0026 | 0.1951 | 41.0% |
 * | 128 | 0.0064 | 0.1600 | 0.0027 | 0.3855 | 41.5% |
 * | 512 | 0.0065 | 0.6275 | 0.0028 | 1.4798 | 42.4% |
 * | 1024 | 0.0065 | 1.2549 | 0.0027 | 3.0118 | 41.7% |
 * | 4096 | 0.0066 | 4.9709 | 0.0027 | 12.1905 | 40.8% |
 * | 16384 | 0.0074 | 17.6933 | 0.0032 | 40.5545 | 43.6% |
 * | 65536 | 0.0096 | 54.7045 | 0.0044 | 119.5912 | 45.7% |
 * | 262144 | 0.0205 | 102.2402 | 0.0161 | 130.5498 | 78.3% |
 * | 1048576 | 0.0640 | 131.1704 | 0.0531 | 157.9181 | 83.1% |
 * | 4194304 | 0.2353 | 142.5761 | 0.2026 | 165.6387 | 86.1% |
 * | 16777216 | 0.8216 | 163.3550 | 0.8017 | 167.4106 | 97.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-scopy-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-scopy-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-scopy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-scopy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-scopy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.8 168.7,219.4 196.4,218.7 251.8,215.0 307.2,202.3 362.5,165.3 417.9,117.8 473.3,88.8 528.6,77.4 584.0,56.6"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.6 168.7,218.5 196.4,217.0 251.8,207.8 307.2,179.4 362.5,100.4 417.9,89.5 473.3,62.1 528.6,54.4 584.0,52.6"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.0" r="4"/>
 * <circle class="mk1" cx="307.2" cy="202.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="165.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="117.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="88.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="77.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.5" r="4"/>
 * <circle class="mk2" cx="196.4" cy="217.0" r="4"/>
 * <circle class="mk2" cx="251.8" cy="207.8" r="4"/>
 * <circle class="mk2" cx="307.2" cy="179.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="100.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="89.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="62.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="54.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="52.6" r="4"/>
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
 * <svg id="bc-scopy-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-scopy-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-scopy-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-scopy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-scopy-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-scopy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.7 85.7,218.7 113.4,218.7 168.7,218.7 196.4,218.7 251.8,218.7 307.2,218.5 362.5,218.1 417.9,215.9 473.3,207.2 528.6,172.9 584.0,55.7"/>
 * <polyline class="ln2" points="58.0,219.5 85.7,219.5 113.4,219.5 168.7,219.4 196.4,219.5 251.8,219.5 307.2,219.4 362.5,219.1 417.9,216.8 473.3,209.4 528.6,179.5 584.0,59.7"/>
 * <circle class="mk1" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.1" r="4"/>
 * <circle class="mk1" cx="417.9" cy="215.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="207.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="172.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.5" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.8" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.4" r="4"/>
 * <circle class="mk2" cx="528.6" cy="179.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="59.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/benchmark.scopy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/scopy
 */
