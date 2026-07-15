/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.5469 | 0.0060 | 0.7447 | 73.4% |
 * | 64 | 0.0083 | 2.0615 | 0.0060 | 2.8360 | 72.7% |
 * | 128 | 0.0091 | 7.3933 | 0.0061 | 10.9167 | 67.7% |
 * | 256 | 0.0117 | 22.7068 | 0.0088 | 30.2482 | 75.1% |
 * | 512 | 0.0164 | 64.3750 | 0.0102 | 103.0000 | 62.5% |
 * | 1024 | 0.0360 | 116.9017 | 0.0367 | 114.6085 | 102.0% |
 * | 1280 | 0.0492 | 133.6458 | 0.0451 | 145.5887 | 91.8% |
 * | 2048 | 0.1038 | 161.9294 | 0.1042 | 161.1837 | 100.5% |
 * | 4096 | 0.3735 | 179.8285 | 0.3736 | 179.7745 | 100.0% |
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
 * <polyline class="ln1" points="58.0,219.5 133.1,217.9 208.3,212.6 283.4,197.3 358.6,155.6 433.7,103.1 457.9,86.4 508.9,58.1 584.0,40.2"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,217.2 208.3,209.1 283.4,189.8 358.6,117.0 433.7,105.4 457.9,74.4 508.9,58.8 584.0,40.2"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="212.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="197.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="155.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="103.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="86.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="58.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="40.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="209.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="189.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="117.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="105.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="74.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="58.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.2" r="4"/>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.8 208.3,215.5 283.4,214.2 358.6,211.8 433.7,202.0 457.9,195.4 508.9,168.1 584.0,33.3"/>
 * <polyline class="ln2" points="58.0,217.0 133.1,217.0 208.3,216.9 283.4,215.6 358.6,214.9 433.7,201.7 457.9,197.4 508.9,167.9 584.0,33.2"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="211.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="195.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="168.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="33.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="214.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="201.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="197.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="167.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.2" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/benchmark.sgemv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
