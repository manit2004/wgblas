/**
 * Benchmark results for strsv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0470 | 0.0504 | 0.0100 | 0.2357 | 21.4% |
 * | 64 | 0.0869 | 0.1016 | 0.0123 | 0.7188 | 14.1% |
 * | 128 | 0.1065 | 0.3197 | 0.0172 | 1.9795 | 16.2% |
 * | 256 | 0.1700 | 0.7861 | 0.0265 | 5.0496 | 15.6% |
 * | 512 | 0.3482 | 1.5206 | 0.0449 | 11.7877 | 12.9% |
 * | 1024 | 0.7417 | 2.8413 | 0.0983 | 21.4375 | 13.3% |
 * | 2048 | 1.6872 | 4.9840 | 0.1948 | 43.1749 | 11.5% |
 * | 4096 | 3.6253 | 9.2669 | 0.4223 | 79.5556 | 11.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-strsv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strsv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">100</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.9 133.1,219.8 208.3,219.4 283.4,218.4 358.6,217.0 433.7,214.3 508.9,210.0 584.0,201.5"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,218.6 208.3,216.0 283.4,209.9 358.6,196.4 433.7,177.1 508.9,133.7 584.0,60.9"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="214.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="210.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="201.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="196.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="177.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="133.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="60.9" r="4"/>
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
 * <svg id="bc-strsv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strsv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strsv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strsv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strsv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strsv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strsv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strsv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strsv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strsv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strsv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">4.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.6 133.1,215.7 208.3,214.7 283.4,211.5 358.6,202.6 433.7,182.9 508.9,135.6 584.0,38.7"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,219.4 208.3,219.1 283.4,218.7 358.6,217.8 433.7,215.1 508.9,210.3 584.0,198.9"/>
 * <circle class="mk1" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="202.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="182.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="135.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="38.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="210.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="198.9" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [strsv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/wgblas/strsv.js) — WebGPU benchmark script
 * - [strsv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strsv/cuda/strsv.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strsv
 */
