/**
 * Benchmark results for ssymv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.2994 | 0.0041 | 0.6142 | 48.8% |
 * | 64 | 0.0087 | 1.0499 | 0.0045 | 2.0142 | 52.1% |
 * | 128 | 0.0102 | 3.3750 | 0.0055 | 6.2791 | 53.7% |
 * | 256 | 0.0164 | 8.2188 | 0.0063 | 21.3063 | 38.6% |
 * | 512 | 0.0287 | 18.5357 | 0.0108 | 49.3551 | 37.6% |
 * | 1024 | 0.0722 | 29.2417 | 0.0331 | 63.8143 | 45.8% |
 * | 1280 | 0.1147 | 28.7277 | 0.0477 | 69.0080 | 41.6% |
 * | 2048 | 0.2575 | 32.6920 | 0.1097 | 76.7440 | 42.6% |
 * | 4096 | 1.2717 | 26.4300 | 0.4049 | 83.0199 | 31.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssymv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.4 133.1,217.9 208.3,213.2 283.4,203.6 358.6,182.9 433.7,161.5 457.9,162.5 508.9,154.6 584.0,167.1"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,216.0 208.3,207.4 283.4,177.4 358.6,121.3 433.7,92.4 457.9,82.0 508.9,66.5 584.0,54.0"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="182.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="161.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="162.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="154.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="167.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="207.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="177.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="121.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="92.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="82.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="66.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="54.0" r="4"/>
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
 * <svg id="bc-ssymv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.50</text>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.6 283.4,217.8 358.6,216.2 433.7,210.4 457.9,204.7 508.9,185.7 584.0,50.4"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,219.4 208.3,219.3 283.4,219.2 358.6,218.6 433.7,215.6 457.9,213.6 508.9,205.4 584.0,166.0"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="210.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="185.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="50.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="213.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="205.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="166.0" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 * - [ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/ssymv.c) — CUDA / cuBLAS reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific (see TODO.md in the repo for the measured mechanism) — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0078 | 0.3184 | 0.0040 | 0.6190 | 51.4% |
 * | 64 | 0.0068 | 1.3271 | 0.0044 | 2.0882 | 63.6% |
 * | 128 | 0.0081 | 4.2772 | 0.0056 | 6.2069 | 68.9% |
 * | 256 | 0.0122 | 11.0446 | 0.0062 | 21.6907 | 50.9% |
 * | 512 | 0.0245 | 21.6956 | 0.0106 | 50.0996 | 43.3% |
 * | 1024 | 0.0696 | 30.3235 | 0.0328 | 64.4375 | 47.1% |
 * | 1280 | 0.1106 | 29.7917 | 0.0476 | 69.2401 | 43.0% |
 * | 2048 | 0.2477 | 33.9779 | 0.1086 | 77.4786 | 43.9% |
 * | 4096 | 1.1981 | 28.0536 | 0.4029 | 83.4287 | 33.6% |
 *
 * <svg id="bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.4 133.1,217.3 208.3,211.4 283.4,197.9 358.6,176.6 433.7,159.4 457.9,160.4 508.9,152.0 584.0,163.9"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,215.8 208.3,207.6 283.4,176.6 358.6,119.8 433.7,91.1 457.9,81.5 508.9,65.0 584.0,53.1"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="197.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="176.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="159.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="160.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="152.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="163.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="207.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="176.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="119.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="91.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="81.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="65.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="53.1" r="4"/>
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
 * <svg id="bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.7 133.1,218.9 208.3,218.7 283.4,218.0 358.6,215.9 433.7,208.4 457.9,201.6 508.9,178.7 584.0,20.3"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.1 283.4,219.0 358.6,218.2 433.7,214.5 457.9,212.1 508.9,201.9 584.0,152.8"/>
 * <circle class="mk1" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="215.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="178.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="20.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="214.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="212.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="201.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="152.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0040 | 0.6240 | 60.7% |
 * | 64 | 0.0068 | 1.3396 | 0.0044 | 2.0882 | 64.2% |
 * | 128 | 0.0081 | 4.2688 | 0.0054 | 6.4286 | 66.4% |
 * | 256 | 0.0105 | 12.8489 | 0.0063 | 21.3604 | 60.2% |
 * | 512 | 0.0184 | 28.8333 | 0.0113 | 46.9816 | 61.4% |
 * | 1024 | 0.0532 | 39.6538 | 0.0335 | 63.0220 | 62.9% |
 * | 1280 | 0.0920 | 35.8184 | 0.0492 | 66.9223 | 53.5% |
 * | 2048 | 0.1884 | 44.6739 | 0.1114 | 75.5645 | 59.1% |
 * | 4096 | 1.0898 | 30.8428 | 0.3966 | 84.7549 | 36.4% |
 *
 * <svg id="bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.2 133.1,217.3 208.3,211.5 283.4,194.3 358.6,162.3 433.7,140.7 457.9,148.4 508.9,130.7 584.0,158.3"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,215.8 208.3,207.1 283.4,177.3 358.6,126.0 433.7,94.0 457.9,86.2 508.9,68.9 584.0,50.5"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="194.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="162.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="140.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="148.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="130.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="158.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="207.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="177.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="126.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="94.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="86.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="68.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.5" r="4"/>
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
 * <svg id="bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.7 283.4,218.3 358.6,216.9 433.7,211.1 457.9,204.7 508.9,188.6 584.0,38.4"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.1 283.4,219.0 358.6,218.1 433.7,214.4 457.9,211.8 508.9,201.4 584.0,153.9"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="188.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="38.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="214.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="211.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="201.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="153.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0036 | 0.6842 | 55.3% |
 * | 64 | 0.0070 | 1.3057 | 0.0041 | 2.2362 | 58.4% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.2483 | 58.2% |
 * | 256 | 0.0108 | 12.5238 | 0.0058 | 23.2486 | 53.9% |
 * | 512 | 0.0198 | 26.8087 | 0.0096 | 55.4524 | 48.3% |
 * | 1024 | 0.0577 | 36.5866 | 0.0300 | 70.3454 | 52.0% |
 * | 1280 | 0.0933 | 35.3147 | 0.0460 | 71.6493 | 49.3% |
 * | 2048 | 0.2012 | 41.8387 | 0.1061 | 79.3365 | 52.7% |
 * | 4096 | 1.1387 | 29.5180 | 0.3935 | 85.4270 | 34.6% |
 *
 * <svg id="bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.2 133.1,217.4 208.3,211.6 283.4,195.0 358.6,166.4 433.7,146.8 457.9,149.4 508.9,136.3 584.0,161.0"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,215.5 208.3,205.5 283.4,173.5 358.6,109.1 433.7,79.3 457.9,76.7 508.9,61.3 584.0,49.1"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="195.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="166.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="146.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="149.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="136.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="161.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="205.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="173.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="109.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="79.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="76.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="61.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="49.1" r="4"/>
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
 * <svg id="bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.6 283.4,218.2 358.6,216.7 433.7,210.4 457.9,204.5 508.9,186.5 584.0,30.2"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,219.3 208.3,219.2 283.4,219.0 358.6,218.4 433.7,215.0 457.9,212.3 508.9,202.3 584.0,154.4"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="210.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="186.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="212.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="202.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="154.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0037 | 0.6812 | 55.6% |
 * | 64 | 0.0068 | 1.3333 | 0.0040 | 2.2903 | 58.2% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.2241 | 58.4% |
 * | 256 | 0.0121 | 11.1323 | 0.0057 | 23.6404 | 47.1% |
 * | 512 | 0.0240 | 22.1736 | 0.0096 | 55.3600 | 40.1% |
 * | 1024 | 0.0701 | 30.1022 | 0.0298 | 70.8363 | 42.5% |
 * | 1280 | 0.1065 | 30.9421 | 0.0437 | 75.3182 | 41.1% |
 * | 2048 | 0.2583 | 32.5887 | 0.1034 | 81.3861 | 40.0% |
 * | 4096 | 1.1898 | 28.2494 | 0.3903 | 86.1098 | 32.8% |
 *
 * <svg id="bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.2 133.1,217.3 208.3,211.6 283.4,197.7 358.6,175.7 433.7,159.8 457.9,158.1 508.9,154.8 584.0,163.5"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,215.4 208.3,205.6 283.4,172.7 358.6,109.3 433.7,78.3 457.9,69.4 508.9,57.2 584.0,47.8"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="197.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="175.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="159.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="158.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="154.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="163.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="205.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="172.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="109.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="78.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="69.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="57.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="47.8" r="4"/>
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
 * <svg id="bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.6 283.4,218.0 358.6,216.0 433.7,208.3 457.9,202.3 508.9,177.0 584.0,21.7"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,219.3 208.3,219.2 283.4,219.0 358.6,218.4 433.7,215.0 457.9,212.7 508.9,202.8 584.0,155.0"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="21.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="212.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="202.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="155.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3786 | 0.0036 | 0.6903 | 54.9% |
 * | 64 | 0.0068 | 1.3302 | 0.0041 | 2.2362 | 59.5% |
 * | 128 | 0.0082 | 4.2188 | 0.0048 | 7.1523 | 59.0% |
 * | 256 | 0.0122 | 11.0013 | 0.0058 | 23.2486 | 47.3% |
 * | 512 | 0.0240 | 22.1440 | 0.0096 | 55.3600 | 40.0% |
 * | 1024 | 0.0718 | 29.4046 | 0.0301 | 70.1584 | 41.9% |
 * | 1280 | 0.1067 | 30.8772 | 0.0448 | 73.5954 | 42.0% |
 * | 2048 | 0.2561 | 32.8697 | 0.1035 | 81.2981 | 40.4% |
 * | 4096 | 1.1927 | 28.1815 | 0.3928 | 85.5697 | 32.9% |
 *
 * <svg id="bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.2 133.1,217.3 208.3,211.6 283.4,198.0 358.6,175.7 433.7,161.2 457.9,158.2 508.9,154.3 584.0,163.6"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,215.5 208.3,205.7 283.4,173.5 358.6,109.3 433.7,79.7 457.9,72.8 508.9,57.4 584.0,48.9"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="198.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="175.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="161.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="158.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="154.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="163.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="205.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="173.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="109.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="79.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="72.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="57.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.9" r="4"/>
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
 * <svg id="bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.6 283.4,218.0 358.6,216.0 433.7,208.0 457.9,202.2 508.9,177.3 584.0,21.2"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,219.3 208.3,219.2 283.4,219.0 358.6,218.4 433.7,215.0 457.9,212.5 508.9,202.8 584.0,154.5"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="21.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="212.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="202.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="154.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0066 | 0.3805 | 0.0037 | 0.6724 | 56.6% |
 * | 64 | 0.0070 | 1.2909 | 0.0041 | 2.2188 | 58.2% |
 * | 128 | 0.0082 | 4.2188 | 0.0047 | 7.2973 | 57.8% |
 * | 256 | 0.0123 | 10.9583 | 0.0057 | 23.6404 | 46.4% |
 * | 512 | 0.0238 | 22.3677 | 0.0095 | 55.7315 | 40.1% |
 * | 1024 | 0.0714 | 29.5693 | 0.0302 | 69.9724 | 42.3% |
 * | 1280 | 0.1062 | 31.0214 | 0.0449 | 73.3333 | 42.3% |
 * | 2048 | 0.2692 | 31.2659 | 0.1047 | 80.3912 | 38.9% |
 * | 4096 | 1.2349 | 27.2183 | 0.4133 | 81.3325 | 33.5% |
 *
 * <svg id="bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.2 133.1,217.4 208.3,211.6 283.4,198.1 358.6,175.3 433.7,160.9 457.9,158.0 508.9,157.5 584.0,165.6"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.6 208.3,205.4 283.4,172.7 358.6,108.5 433.7,80.1 457.9,73.3 508.9,59.2 584.0,57.3"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="198.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="175.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="160.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="158.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="157.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="165.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="205.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="172.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="108.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="80.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="73.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="59.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="57.3" r="4"/>
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
 * <svg id="bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-pad128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.50</text>
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
 * <polyline class="ln1" points="58.0,219.1 133.1,219.1 208.3,218.9 283.4,218.4 358.6,216.8 433.7,210.5 457.9,205.8 508.9,184.1 584.0,55.3"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,219.5 208.3,219.4 283.4,219.2 358.6,218.7 433.7,216.0 457.9,214.0 508.9,206.0 584.0,164.9"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="210.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="205.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="184.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="216.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="214.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="206.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="164.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/lda.ssymv.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssymv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/lda.ssymv.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssymv
 */
