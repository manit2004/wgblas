/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0194 | 0.0132 | 0.0104 | 0.0247 | 53.4% |
 * | 64 | 0.0199 | 0.0257 | 0.0102 | 0.0501 | 51.3% |
 * | 128 | 0.0199 | 0.0514 | 0.0103 | 0.0995 | 51.6% |
 * | 512 | 0.0197 | 0.2075 | 0.0102 | 0.4013 | 51.7% |
 * | 1024 | 0.0196 | 0.4190 | 0.0102 | 0.8025 | 52.2% |
 * | 4096 | 0.0198 | 1.6556 | 0.0180 | 1.8204 | 90.9% |
 * | 16384 | 0.0204 | 6.4201 | 0.0181 | 7.2240 | 88.9% |
 * | 65536 | 0.0216 | 24.2726 | 0.0183 | 28.7187 | 84.5% |
 * | 262144 | 0.0332 | 63.1672 | 0.0278 | 75.3720 | 83.8% |
 * | 1048576 | 0.0672 | 124.7711 | 0.0611 | 137.2122 | 90.9% |
 * | 4194304 | 0.2041 | 164.4180 | 0.1944 | 172.6193 | 95.2% |
 * | 16777216 | 0.7531 | 178.2270 | 0.7304 | 183.7552 | 97.0% |
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.3 307.2,213.6 362.5,195.7 417.9,156.8 473.3,95.2 528.6,55.6 584.0,41.8"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,219.9 113.4,219.9 168.7,219.6 196.4,219.2 251.8,218.2 307.2,212.8 362.5,191.3 417.9,144.6 473.3,82.8 528.6,47.4 584.0,36.2"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="195.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="156.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="95.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="55.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="41.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="191.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="144.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="82.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="47.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.2" r="4"/>
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
 * <polyline class="ln1" points="58.0,215.1 85.7,215.0 113.4,215.0 168.7,215.1 196.4,215.1 251.8,215.1 307.2,214.9 362.5,214.6 417.9,211.7 473.3,203.2 528.6,169.0 584.0,31.7"/>
 * <polyline class="ln2" points="58.0,217.4 85.7,217.4 113.4,217.4 168.7,217.4 196.4,217.4 251.8,215.5 307.2,215.5 362.5,215.4 417.9,213.1 473.3,204.7 528.6,171.4 584.0,37.4"/>
 * <circle class="mk1" cx="58.0" cy="215.1" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="215.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.1" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.1" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="214.6" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="203.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="169.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="31.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="217.4" r="4"/>
 * <circle class="mk2" cx="113.4" cy="217.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="217.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="215.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="215.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.7" r="4"/>
 * <circle class="mk2" cx="528.6" cy="171.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="37.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/benchmark.sdot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sdot
 */
