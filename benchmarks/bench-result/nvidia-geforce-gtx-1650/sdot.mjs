/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0195 | 0.0131 | 0.0102 | 0.0250 | 52.5% |
 * | 64 | 0.0202 | 0.0254 | 0.0102 | 0.0500 | 50.8% |
 * | 128 | 0.0193 | 0.0530 | 0.0104 | 0.0988 | 53.6% |
 * | 512 | 0.0199 | 0.2060 | 0.0104 | 0.3926 | 52.5% |
 * | 1024 | 0.0197 | 0.4152 | 0.0103 | 0.7963 | 52.1% |
 * | 4096 | 0.0197 | 1.6650 | 0.0181 | 1.8060 | 92.2% |
 * | 16384 | 0.0204 | 6.4403 | 0.0176 | 7.4473 | 86.5% |
 * | 65536 | 0.0213 | 24.5637 | 0.0178 | 29.4147 | 83.5% |
 * | 262144 | 0.0376 | 55.7991 | 0.0269 | 77.9263 | 71.6% |
 * | 1048576 | 0.0804 | 104.3775 | 0.0610 | 137.5001 | 75.9% |
 * | 4194304 | 0.2824 | 118.8323 | 0.1955 | 171.6164 | 69.2% |
 * | 16777216 | 1.1852 | 113.2448 | 0.7330 | 183.1014 | 61.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sdot-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sdot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sdot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sdot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sdot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.3 307.2,213.6 362.5,195.4 417.9,164.2 473.3,115.6 528.6,101.2 584.0,106.8"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.6 196.4,219.2 251.8,218.2 307.2,212.6 362.5,190.6 417.9,142.1 473.3,82.5 528.6,48.4 584.0,36.9"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="195.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="164.2" r="4"/>
 * <circle class="mk1" cx="473.3" cy="115.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="101.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="106.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="190.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="142.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="82.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="48.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.9" r="4"/>
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
 * <svg id="bc-sdot-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sdot-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sdot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sdot-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sdot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sdot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.20</text>
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
 * <polyline class="ln1" points="58.0,216.8 85.7,216.6 113.4,216.8 168.7,216.7 196.4,216.7 251.8,216.7 307.2,216.6 362.5,216.4 417.9,213.7 473.3,206.6 528.6,172.9 584.0,22.5"/>
 * <polyline class="ln2" points="58.0,218.3 85.7,218.3 113.4,218.3 168.7,218.3 196.4,218.3 251.8,217.0 307.2,217.1 362.5,217.0 417.9,215.5 473.3,209.8 528.6,187.4 584.0,97.8"/>
 * <circle class="mk1" cx="58.0" cy="216.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="216.6" r="4"/>
 * <circle class="mk1" cx="113.4" cy="216.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="216.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="216.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="216.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="216.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="213.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="206.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="172.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="22.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk2" cx="85.7" cy="218.3" r="4"/>
 * <circle class="mk2" cx="113.4" cy="218.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.3" r="4"/>
 * <circle class="mk2" cx="196.4" cy="218.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="217.0" r="4"/>
 * <circle class="mk2" cx="307.2" cy="217.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="217.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="215.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="187.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="97.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/benchmark.sdot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sdot
 */
