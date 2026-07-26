/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0073 | 0.6167 | 0.0049 | 0.9061 | 68.1% |
 * | 64 | 0.0074 | 2.3103 | 0.0050 | 3.4359 | 67.2% |
 * | 128 | 0.0082 | 8.2035 | 0.0055 | 12.2216 | 67.1% |
 * | 256 | 0.0100 | 26.6495 | 0.0061 | 43.3927 | 61.4% |
 * | 512 | 0.0145 | 72.8398 | 0.0091 | 115.4466 | 63.1% |
 * | 1024 | 0.0341 | 123.2015 | 0.0324 | 129.7050 | 95.0% |
 * | 1280 | 0.0469 | 139.9795 | 0.0424 | 154.8115 | 90.4% |
 * | 2048 | 0.1010 | 166.4203 | 0.0984 | 170.6667 | 97.5% |
 * | 4096 | 0.3707 | 181.1478 | 0.3687 | 182.1382 | 99.5% |
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
 * <polyline class="ln1" points="58.0,219.4 133.1,217.7 208.3,211.8 283.4,193.4 358.6,147.2 433.7,96.8 457.9,80.0 508.9,53.6 584.0,38.9"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,216.6 208.3,207.8 283.4,176.6 358.6,104.6 433.7,90.3 457.9,65.2 508.9,49.3 584.0,37.9"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="193.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="147.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="96.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="80.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="53.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="38.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="207.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="176.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="104.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="90.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="65.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="49.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="37.9" r="4"/>
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
 * <polyline class="ln1" points="58.0,216.4 133.1,216.3 208.3,215.9 283.4,215.0 358.6,212.8 433.7,202.9 457.9,196.5 508.9,169.5 584.0,34.6"/>
 * <polyline class="ln2" points="58.0,217.6 133.1,217.5 208.3,217.2 283.4,216.9 358.6,215.4 433.7,203.8 457.9,198.8 508.9,170.8 584.0,35.6"/>
 * <circle class="mk1" cx="58.0" cy="216.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="215.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="196.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="169.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="34.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="198.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="170.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="35.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/benchmark.sgemv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
