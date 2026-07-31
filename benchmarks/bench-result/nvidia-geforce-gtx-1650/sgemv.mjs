/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0137 | 0.3275 | 0.0143 | 0.3128 | 104.7% |
 * | 64 | 0.0107 | 1.6048 | 0.0083 | 2.0615 | 77.8% |
 * | 128 | 0.0149 | 4.5075 | 0.0089 | 7.5668 | 59.6% |
 * | 256 | 0.0220 | 12.0640 | 0.0164 | 16.1875 | 74.5% |
 * | 512 | 0.0524 | 20.1221 | 0.0246 | 42.9167 | 46.9% |
 * | 1024 | 0.1106 | 38.0370 | 0.0382 | 110.0050 | 34.6% |
 * | 1280 | 0.1372 | 47.8731 | 0.0517 | 127.1084 | 37.7% |
 * | 2048 | 0.2182 | 76.9990 | 0.1056 | 159.1320 | 48.4% |
 * | 4096 | 0.4736 | 141.8080 | 0.3933 | 170.7361 | 83.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sgemv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.7 133.1,218.4 208.3,215.5 283.4,207.9 358.6,199.9 433.7,182.0 457.9,172.1 508.9,143.0 584.0,78.2"/>
 * <polyline class="ln2" points="58.0,219.7 133.1,217.9 208.3,212.4 283.4,203.8 358.6,177.1 433.7,110.0 457.9,92.9 508.9,60.9 584.0,49.3"/>
 * <circle class="mk1" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="207.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="199.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="182.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="172.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="143.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="78.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="212.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="203.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="177.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="110.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="92.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="60.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="49.3" r="4"/>
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
 * <svg id="bc-sgemv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.500</text>
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
 * <polyline class="ln1" points="58.0,214.5 133.1,215.7 208.3,214.0 283.4,211.2 358.6,199.0 433.7,175.8 457.9,165.1 508.9,132.7 584.0,30.6"/>
 * <polyline class="ln2" points="58.0,214.3 133.1,216.7 208.3,216.4 283.4,213.4 358.6,210.2 433.7,204.7 457.9,199.3 508.9,177.8 584.0,62.7"/>
 * <circle class="mk1" cx="58.0" cy="214.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="199.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="175.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="165.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="132.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="214.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="213.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="210.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="204.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="199.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="177.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="62.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/benchmark.sgemv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
