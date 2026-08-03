/**
 * Benchmark results for dasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0223 | 0.0115 | 0.0188 | 0.0137 | 83.9% |
 * | 64 | 0.0219 | 0.0234 | 0.0219 | 0.0234 | 99.9% |
 * | 128 | 0.0221 | 0.0463 | 0.0224 | 0.0457 | 101.3% |
 * | 512 | 0.0223 | 0.1840 | 0.0198 | 0.2065 | 89.1% |
 * | 1024 | 0.0221 | 0.3713 | 0.0191 | 0.4295 | 86.4% |
 * | 4096 | 0.0223 | 1.4692 | 0.0217 | 1.5114 | 97.2% |
 * | 16384 | 0.0228 | 5.7367 | 0.0192 | 6.8210 | 84.1% |
 * | 65536 | 0.0254 | 20.6348 | 0.0261 | 20.0784 | 102.8% |
 * | 262144 | 0.0389 | 53.8947 | 0.0368 | 56.9631 | 94.6% |
 * | 1048576 | 0.0754 | 111.2666 | 0.0948 | 88.4426 | 125.8% |
 * | 4194304 | 0.2176 | 154.1910 | 0.3192 | 105.1309 | 146.7% |
 * | 16777216 | 0.7870 | 170.5348 | 1.1817 | 113.5821 | 150.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-dasum-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-dasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.6 251.8,218.5 307.2,214.3 362.5,199.4 417.9,166.1 473.3,108.7 528.6,65.8 584.0,49.5"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.6 251.8,218.5 307.2,213.2 362.5,199.9 417.9,163.0 473.3,131.6 528.6,114.9 584.0,106.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.5" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="199.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="166.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="108.7" r="4"/>
 * <circle class="mk1" cx="528.6" cy="65.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="213.2" r="4"/>
 * <circle class="mk2" cx="362.5" cy="199.9" r="4"/>
 * <circle class="mk2" cx="417.9" cy="163.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="131.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="114.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="106.4" r="4"/>
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
 * <svg id="bc-dasum-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-dasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,216.3 85.7,216.3 113.4,216.3 168.7,216.3 196.4,216.3 251.8,216.3 307.2,216.2 362.5,215.8 417.9,213.5 473.3,207.4 528.6,183.7 584.0,88.8"/>
 * <polyline class="ln2" points="58.0,216.9 85.7,216.3 113.4,216.3 168.7,216.7 196.4,216.8 251.8,216.4 307.2,216.8 362.5,215.6 417.9,213.9 473.3,204.2 528.6,166.8 584.0,23.1"/>
 * <circle class="mk1" cx="58.0" cy="216.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="216.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="216.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="216.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="216.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="216.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="215.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="213.5" r="4"/>
 * <circle class="mk1" cx="473.3" cy="207.4" r="4"/>
 * <circle class="mk1" cx="528.6" cy="183.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="88.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="216.3" r="4"/>
 * <circle class="mk2" cx="113.4" cy="216.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="216.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="216.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.2" r="4"/>
 * <circle class="mk2" cx="528.6" cy="166.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="23.1" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/benchmark.dasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dasum
 */
