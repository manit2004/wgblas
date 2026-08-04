/**
 * Benchmark results for idamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0205 | 0.0125 | 0.0169 | 0.0152 | 82.2% |
 * | 64 | 0.0205 | 0.0250 | 0.0170 | 0.0301 | 83.0% |
 * | 128 | 0.0205 | 0.0500 | 0.0174 | 0.0588 | 85.0% |
 * | 512 | 0.0206 | 0.1988 | 0.0205 | 0.1998 | 99.5% |
 * | 1024 | 0.0206 | 0.3975 | 0.0205 | 0.3997 | 99.5% |
 * | 4096 | 0.0206 | 1.5925 | 0.0190 | 1.7239 | 92.4% |
 * | 16384 | 0.0211 | 6.2108 | 0.0189 | 6.9424 | 89.5% |
 * | 65536 | 0.0227 | 23.1086 | 0.0270 | 19.4353 | 118.9% |
 * | 262144 | 0.0359 | 58.4621 | 0.0413 | 50.7637 | 115.2% |
 * | 1048576 | 0.0699 | 120.0293 | 0.0913 | 91.8514 | 130.7% |
 * | 4194304 | 0.2068 | 162.2178 | 0.2867 | 117.0416 | 138.6% |
 * | 16777216 | 0.7645 | 175.5710 | 1.0617 | 126.4201 | 138.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-idamax-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-idamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-idamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-idamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-idamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-idamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-idamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-idamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-idamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-idamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-idamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-idamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-idamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-idamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-idamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-idamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-idamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-idamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-idamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.6 251.8,218.4 307.2,213.8 362.5,196.9 417.9,161.5 473.3,100.0 528.6,57.8 584.0,44.4"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.6 251.8,218.3 307.2,213.1 362.5,200.6 417.9,169.2 473.3,128.1 528.6,103.0 584.0,93.6"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="196.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="161.5" r="4"/>
 * <circle class="mk1" cx="473.3" cy="100.0" r="4"/>
 * <circle class="mk1" cx="528.6" cy="57.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="44.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.3" r="4"/>
 * <circle class="mk2" cx="307.2" cy="213.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="200.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="169.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="128.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="103.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="93.6" r="4"/>
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
 * <svg id="bc-idamax-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-idamax-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-idamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-idamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-idamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-idamax-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-idamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-idamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-idamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-idamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-idamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-idamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-idamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-idamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-idamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-idamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-idamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-idamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-idamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-idamax-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,216.6 85.7,216.6 113.4,216.6 168.7,216.6 196.4,216.6 251.8,216.6 307.2,216.5 362.5,216.2 417.9,214.0 473.3,208.4 528.6,185.5 584.0,92.6"/>
 * <polyline class="ln2" points="58.0,217.2 85.7,217.2 113.4,217.1 168.7,216.6 196.4,216.6 251.8,216.8 307.2,216.8 362.5,215.5 417.9,213.1 473.3,204.8 528.6,172.2 584.0,43.1"/>
 * <circle class="mk1" cx="58.0" cy="216.6" r="4"/>
 * <circle class="mk1" cx="85.7" cy="216.6" r="4"/>
 * <circle class="mk1" cx="113.4" cy="216.6" r="4"/>
 * <circle class="mk1" cx="168.7" cy="216.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="216.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="216.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="216.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="214.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="208.4" r="4"/>
 * <circle class="mk1" cx="528.6" cy="185.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="92.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk2" cx="85.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="113.4" cy="217.1" r="4"/>
 * <circle class="mk2" cx="168.7" cy="216.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="216.8" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="172.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="43.1" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.idamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/benchmark.idamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/idamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/idamax
 */
