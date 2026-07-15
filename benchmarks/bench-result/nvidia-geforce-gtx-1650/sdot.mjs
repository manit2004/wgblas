/**
 * Benchmark results for sdot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0193 | 0.0133 | 0.0190 | 0.0135 | 98.4% |
 * | 64 | 0.0188 | 0.0272 | 0.0186 | 0.0275 | 99.0% |
 * | 128 | 0.0190 | 0.0540 | 0.0187 | 0.0547 | 98.7% |
 * | 512 | 0.0184 | 0.2228 | 0.0188 | 0.2179 | 102.2% |
 * | 1024 | 0.0184 | 0.4444 | 0.0186 | 0.4402 | 101.0% |
 * | 4096 | 0.0185 | 1.7686 | 0.0191 | 1.7196 | 102.8% |
 * | 16384 | 0.0192 | 6.8210 | 0.0195 | 6.7203 | 101.5% |
 * | 65536 | 0.0202 | 25.9446 | 0.0196 | 26.7494 | 97.0% |
 * | 262144 | 0.0323 | 64.9836 | 0.0292 | 71.8596 | 90.4% |
 * | 1048576 | 0.0669 | 125.4278 | 0.0629 | 133.4406 | 94.0% |
 * | 4194304 | 0.2042 | 164.3021 | 0.1987 | 168.9072 | 97.3% |
 * | 16777216 | 0.7507 | 178.7930 | 0.7332 | 183.0694 | 97.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.2 307.2,213.2 362.5,194.1 417.9,155.0 473.3,94.6 528.6,55.7 584.0,41.2"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.3 307.2,213.3 362.5,193.3 417.9,148.1 473.3,86.6 528.6,51.1 584.0,36.9"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="194.1" r="4"/>
 * <circle class="mk1" cx="417.9" cy="155.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="94.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="55.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="41.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.3" r="4"/>
 * <circle class="mk2" cx="307.2" cy="213.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="193.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="148.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="86.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="51.1" r="4"/>
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
 * <polyline class="ln1" points="58.0,215.2 85.7,215.3 113.4,215.3 168.7,215.4 196.4,215.4 251.8,215.4 307.2,215.2 362.5,214.9 417.9,211.9 473.3,203.3 528.6,168.9 584.0,32.3"/>
 * <polyline class="ln2" points="58.0,215.2 85.7,215.3 113.4,215.3 168.7,215.3 196.4,215.3 251.8,215.2 307.2,215.1 362.5,215.1 417.9,212.7 473.3,204.3 528.6,170.3 584.0,36.7"/>
 * <circle class="mk1" cx="58.0" cy="215.2" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="215.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="214.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="203.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="168.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="32.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.2" r="4"/>
 * <circle class="mk2" cx="85.7" cy="215.3" r="4"/>
 * <circle class="mk2" cx="113.4" cy="215.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="215.3" r="4"/>
 * <circle class="mk2" cx="196.4" cy="215.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="215.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="215.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="212.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="170.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/benchmark.sdot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sdot
 */
