/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5469 | 0.0052 | 0.8615 | 63.5% |
 * | 64 | 0.0083 | 2.0695 | 0.0059 | 2.8973 | 71.4% |
 * | 128 | 0.0089 | 7.4991 | 0.0056 | 12.0460 | 62.3% |
 * | 256 | 0.0113 | 23.3794 | 0.0061 | 43.1667 | 54.2% |
 * | 512 | 0.0164 | 64.3750 | 0.0086 | 123.2150 | 52.2% |
 * | 1024 | 0.0362 | 116.0759 | 0.0324 | 129.8331 | 89.4% |
 * | 1280 | 0.0492 | 133.6458 | 0.0420 | 156.3443 | 85.5% |
 * | 2048 | 0.1044 | 160.8627 | 0.0985 | 170.5558 | 94.3% |
 * | 4096 | 0.3748 | 179.2066 | 0.3686 | 182.1778 | 98.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
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
 * <polyline class="ln1" points="58.0,219.5 133.1,217.9 208.3,212.5 283.4,196.6 358.6,155.6 433.7,103.9 457.9,86.4 508.9,59.1 584.0,40.8"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,217.1 208.3,208.0 283.4,176.8 358.6,96.8 433.7,90.2 457.9,63.7 508.9,49.4 584.0,37.8"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="212.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="196.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="155.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="103.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="86.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="59.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="40.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="208.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="176.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="96.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="90.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="63.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="49.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="37.8" r="4"/>
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
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.400</text>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.9 208.3,215.5 283.4,214.3 358.6,211.8 433.7,201.9 457.9,195.4 508.9,167.8 584.0,32.6"/>
 * <polyline class="ln2" points="58.0,217.4 133.1,217.0 208.3,217.2 283.4,216.9 358.6,215.7 433.7,203.8 457.9,199.0 508.9,170.8 584.0,35.7"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="211.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="201.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="195.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="167.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="32.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="199.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="170.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="35.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/benchmark.sgemv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
