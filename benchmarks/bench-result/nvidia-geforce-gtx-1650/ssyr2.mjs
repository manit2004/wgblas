/**
 * Benchmark results for ssyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.5773 | 0.0041 | 1.0938 | 52.8% |
 * | 64 | 0.0078 | 2.2103 | 0.0042 | 4.0916 | 54.0% |
 * | 128 | 0.0081 | 8.2520 | 0.0042 | 15.8788 | 52.0% |
 * | 256 | 0.0092 | 28.7778 | 0.0053 | 49.9277 | 57.6% |
 * | 512 | 0.0120 | 88.1283 | 0.0092 | 114.0485 | 77.3% |
 * | 1024 | 0.0369 | 114.1111 | 0.0374 | 112.5480 | 101.4% |
 * | 1280 | 0.0544 | 120.7529 | 0.0721 | 91.0736 | 132.6% |
 * | 2048 | 0.1208 | 139.0508 | 0.1331 | 126.2154 | 110.2% |
 * | 4096 | 0.4456 | 150.7029 | 0.5104 | 131.5916 | 114.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssyr2-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.4 133.1,217.8 208.3,211.7 283.4,191.2 358.6,131.9 433.7,105.9 457.9,99.2 508.9,80.9 584.0,69.3"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,215.9 208.3,204.1 283.4,170.1 358.6,106.0 433.7,107.5 457.9,128.9 508.9,93.8 584.0,88.4"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="191.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="131.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="105.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="99.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="80.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="69.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="204.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="170.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="106.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="107.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="128.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="93.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="88.4" r="4"/>
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
 * <svg id="bc-ssyr2-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.600</text>
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
 * <polyline class="ln1" points="58.0,217.4 133.1,217.4 208.3,217.3 283.4,216.9 358.6,216.0 433.7,207.7 457.9,201.9 508.9,179.7 584.0,71.5"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,218.6 208.3,218.6 283.4,218.2 358.6,216.9 433.7,207.5 457.9,196.0 508.9,175.6 584.0,49.9"/>
 * <circle class="mk1" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="207.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="179.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="71.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="216.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="207.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="196.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="175.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="49.9" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/benchmark.ssyr2.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2
 */
