/**
 * Benchmark results for sger on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 1.1210 | 0.0041 | 2.0625 | 54.4% |
 * | 64 | 0.0075 | 4.4255 | 0.0041 | 8.1250 | 54.5% |
 * | 128 | 0.0082 | 16.1250 | 0.0041 | 31.8764 | 50.6% |
 * | 256 | 0.0101 | 52.0506 | 0.0059 | 89.1490 | 58.4% |
 * | 512 | 0.0184 | 114.0000 | 0.0152 | 138.6779 | 82.2% |
 * | 1024 | 0.0607 | 138.3601 | 0.0621 | 135.1532 | 102.4% |
 * | 1280 | 0.0935 | 140.3595 | 0.0962 | 136.3900 | 102.9% |
 * | 2048 | 0.2232 | 150.3853 | 0.2356 | 142.4810 | 105.5% |
 * | 4096 | 0.8588 | 156.3146 | 0.9321 | 144.0258 | 108.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sger-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,215.6 208.3,203.9 283.4,167.9 358.6,106.0 433.7,81.6 457.9,79.6 508.9,69.6 584.0,63.7"/>
 * <polyline class="ln2" points="58.0,217.9 133.1,211.9 208.3,188.1 283.4,130.9 358.6,81.3 433.7,84.8 457.9,83.6 508.9,77.5 584.0,76.0"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="203.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="167.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="106.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="81.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="79.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="69.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="63.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="211.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="188.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="130.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="81.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="84.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="83.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="77.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="76.0" r="4"/>
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
 * <svg id="bc-sger-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.0 358.6,216.3 433.7,207.9 457.9,201.3 508.9,175.4 584.0,48.2"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,218.8 358.6,217.0 433.7,207.6 457.9,200.8 508.9,172.9 584.0,33.6"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="207.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="207.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="172.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/sger.js) — WebGPU benchmark script
 * - [sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/sger.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0071 | 1.1839 | 0.0034 | 2.4789 | 47.8% |
 * | 64 | 0.0072 | 4.6222 | 0.0036 | 9.2035 | 50.2% |
 * | 128 | 0.0077 | 17.2000 | 0.0036 | 36.2105 | 47.5% |
 * | 256 | 0.0095 | 55.4739 | 0.0045 | 117.4857 | 47.2% |
 * | 512 | 0.0176 | 119.6066 | 0.0128 | 164.1600 | 72.9% |
 * | 1024 | 0.0589 | 142.5700 | 0.0557 | 150.7180 | 94.6% |
 * | 1280 | 0.0922 | 142.3333 | 0.0876 | 149.6878 | 95.1% |
 * | 2048 | 0.2211 | 151.8107 | 0.2131 | 157.5089 | 96.4% |
 * | 4096 | 0.8489 | 158.1531 | 0.8476 | 158.3800 | 99.9% |
 *
 * <svg id="bc-sger-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,215.4 208.3,202.8 283.4,164.5 358.6,100.4 433.7,77.4 457.9,77.7 508.9,68.2 584.0,61.8"/>
 * <polyline class="ln2" points="58.0,217.5 133.1,210.8 208.3,183.8 283.4,102.5 358.6,55.8 433.7,69.3 457.9,70.3 508.9,62.5 584.0,61.6"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="202.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="164.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="100.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="77.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="77.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="68.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="61.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="210.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="183.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="102.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="55.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="69.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="70.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="62.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="61.6" r="4"/>
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
 * <svg id="bc-sger-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,218.6 208.3,218.5 283.4,218.1 358.6,216.5 433.7,208.2 457.9,201.6 508.9,175.8 584.0,50.2"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.3 283.4,219.1 358.6,217.4 433.7,208.9 457.9,202.5 508.9,177.4 584.0,50.5"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="50.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="177.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0063 | 1.3401 | 0.0035 | 2.4332 | 55.1% |
 * | 64 | 0.0064 | 5.2000 | 0.0033 | 9.9522 | 52.2% |
 * | 128 | 0.0068 | 19.2897 | 0.0036 | 36.3700 | 53.0% |
 * | 256 | 0.0083 | 63.5058 | 0.0050 | 104.7643 | 60.6% |
 * | 512 | 0.0188 | 111.6735 | 0.0147 | 142.9032 | 78.1% |
 * | 1024 | 0.1063 | 78.9648 | 0.0741 | 113.3233 | 69.7% |
 * | 1280 | 0.1676 | 78.2663 | 0.1167 | 112.3684 | 69.7% |
 * | 2048 | 0.4064 | 82.6021 | 0.2945 | 114.0065 | 72.5% |
 * | 4096 | 1.5194 | 88.3599 | 1.1817 | 113.6083 | 77.8% |
 *
 * <svg id="bc-sger-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,218.2 133.1,213.1 208.3,194.3 283.4,135.3 358.6,71.1 433.7,114.7 457.9,115.6 508.9,109.9 584.0,102.2"/>
 * <polyline class="ln2" points="58.0,216.8 133.1,206.7 208.3,171.5 283.4,80.3 358.6,29.5 433.7,68.9 457.9,70.2 508.9,68.0 584.0,68.5"/>
 * <circle class="mk1" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="194.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="135.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="71.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="114.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="115.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="109.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="102.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="206.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="171.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="80.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="29.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="68.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="70.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="68.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="68.5" r="4"/>
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
 * <svg id="bc-sger-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">2.00</text>
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
 * <polyline class="ln1" points="58.0,219.4 133.1,219.4 208.3,219.3 283.4,219.2 358.6,218.1 433.7,209.4 457.9,203.2 508.9,179.4 584.0,68.1"/>
 * <polyline class="ln2" points="58.0,219.7 133.1,219.7 208.3,219.6 283.4,219.5 358.6,218.5 433.7,212.6 457.9,208.3 508.9,190.6 584.0,101.8"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="219.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="218.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="203.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="179.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="212.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="208.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="190.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="101.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.6296 | 56.3% |
 * | 128 | 0.0067 | 19.8462 | 0.0036 | 36.8571 | 53.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0045 | 115.8310 | 55.5% |
 * | 512 | 0.0201 | 104.5605 | 0.0166 | 126.7645 | 82.5% |
 * | 1024 | 0.1044 | 80.3922 | 0.0735 | 114.2360 | 70.4% |
 * | 1280 | 0.1707 | 76.8648 | 0.1154 | 113.6772 | 67.6% |
 * | 2048 | 0.3840 | 87.4204 | 0.2973 | 112.9084 | 77.4% |
 * | 4096 | 1.4808 | 90.6588 | 1.1733 | 114.4186 | 79.2% |
 *
 * <svg id="bc-sger-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,218.2 133.1,212.8 208.3,193.5 283.4,134.3 358.6,80.6 433.7,112.8 457.9,117.5 508.9,103.4 584.0,99.1"/>
 * <polyline class="ln2" points="58.0,216.8 133.1,207.2 208.3,170.9 283.4,65.6 358.6,51.0 433.7,67.7 457.9,68.4 508.9,69.5 584.0,67.4"/>
 * <circle class="mk1" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="212.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="193.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="134.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="80.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="112.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="117.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="103.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="99.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="207.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="170.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="65.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="51.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="67.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="68.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="69.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="67.4" r="4"/>
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
 * <svg id="bc-sger-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,219.2 208.3,219.1 283.4,218.9 358.6,217.3 433.7,206.1 457.9,197.2 508.9,168.8 584.0,22.6"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,219.5 208.3,219.5 283.4,219.4 358.6,217.8 433.7,210.2 457.9,204.6 508.9,180.4 584.0,63.6"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="206.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="168.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="22.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="180.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="63.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.5853 | 56.5% |
 * | 128 | 0.0066 | 19.9420 | 0.0036 | 36.6933 | 54.3% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 114.6202 | 56.1% |
 * | 512 | 0.0207 | 101.4900 | 0.0182 | 115.6056 | 87.8% |
 * | 1024 | 0.1024 | 82.0385 | 0.0735 | 114.2360 | 71.8% |
 * | 1280 | 0.1622 | 80.8920 | 0.1165 | 112.5999 | 71.8% |
 * | 2048 | 0.3942 | 85.1567 | 0.2934 | 114.4293 | 74.4% |
 * | 4096 | 1.4631 | 91.7573 | 1.1854 | 113.2541 | 81.0% |
 *
 * <svg id="bc-sger-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">125</text>
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
 * <polyline class="ln1" points="58.0,217.8 133.1,211.3 208.3,188.1 283.4,117.2 358.6,57.6 433.7,88.7 457.9,90.6 508.9,83.7 584.0,73.2"/>
 * <polyline class="ln2" points="58.0,216.1 133.1,204.7 208.3,161.3 283.4,36.6 358.6,35.0 433.7,37.2 457.9,39.8 508.9,36.9 584.0,38.8"/>
 * <circle class="mk1" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="211.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="188.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="117.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="57.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="88.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="90.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="83.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="73.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="204.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="161.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="36.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="35.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="37.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="39.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="36.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="38.8" r="4"/>
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
 * <svg id="bc-sger-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,219.2 208.3,219.1 283.4,218.9 358.6,217.2 433.7,206.4 457.9,198.4 508.9,167.4 584.0,24.9"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,219.5 208.3,219.5 283.4,219.4 358.6,217.6 433.7,210.2 457.9,204.5 508.9,180.9 584.0,61.9"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="206.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="198.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="167.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="24.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="180.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="61.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0034 | 2.4906 | 55.2% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.6296 | 56.3% |
 * | 128 | 0.0067 | 19.8462 | 0.0037 | 35.2821 | 56.2% |
 * | 256 | 0.0082 | 64.3757 | 0.0045 | 115.8310 | 55.6% |
 * | 512 | 0.0165 | 127.2558 | 0.0150 | 139.8594 | 91.0% |
 * | 1024 | 0.0574 | 146.1838 | 0.0561 | 149.7290 | 97.6% |
 * | 1280 | 0.0881 | 148.9535 | 0.0880 | 149.1160 | 99.9% |
 * | 2048 | 0.2171 | 154.6301 | 0.2191 | 153.1963 | 100.9% |
 * | 4096 | 0.8783 | 152.8603 | 0.8622 | 155.7055 | 98.2% |
 *
 * <svg id="bc-sger-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,214.6 208.3,200.2 283.4,155.6 358.6,92.7 433.7,73.8 457.9,71.0 508.9,65.4 584.0,67.1"/>
 * <polyline class="ln2" points="58.0,217.5 133.1,210.4 208.3,184.7 283.4,104.2 358.6,80.1 433.7,70.3 457.9,70.9 508.9,66.8 584.0,64.3"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="200.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="155.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="92.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="73.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="71.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="65.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="67.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="210.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="184.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="104.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="80.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="70.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="70.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="66.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="64.3" r="4"/>
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
 * <svg id="bc-sger-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.8 208.3,218.7 283.4,218.4 358.6,216.7 433.7,208.5 457.9,202.4 508.9,176.6 584.0,44.3"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.3 283.4,219.1 358.6,217.0 433.7,208.8 457.9,202.4 508.9,176.2 584.0,47.6"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="176.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="44.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="176.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="47.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4110 | 57.0% |
 * | 64 | 0.0061 | 5.4167 | 0.0034 | 9.8113 | 55.2% |
 * | 128 | 0.0066 | 19.9420 | 0.0036 | 36.8571 | 54.1% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 115.0210 | 55.9% |
 * | 512 | 0.0225 | 93.2727 | 0.0187 | 112.1503 | 83.2% |
 * | 1024 | 0.1063 | 78.9767 | 0.0746 | 112.5938 | 70.1% |
 * | 1280 | 0.1659 | 79.0741 | 0.1176 | 111.4973 | 70.9% |
 * | 2048 | 0.3963 | 84.7166 | 0.2949 | 113.8333 | 74.4% |
 * | 4096 | 1.4950 | 89.7973 | 1.1869 | 113.1121 | 79.4% |
 *
 * <svg id="bc-sger-pad48-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">125</text>
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
 * <polyline class="ln1" points="58.0,217.8 133.1,211.3 208.3,188.1 283.4,117.2 358.6,70.8 433.7,93.6 457.9,93.5 508.9,84.5 584.0,76.3"/>
 * <polyline class="ln2" points="58.0,216.1 133.1,204.3 208.3,161.0 283.4,36.0 358.6,40.6 433.7,39.8 457.9,41.6 508.9,37.9 584.0,39.0"/>
 * <circle class="mk1" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="211.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="188.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="117.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="70.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="93.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="93.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="84.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="76.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="204.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="161.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="36.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="40.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="39.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="41.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="37.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="39.0" r="4"/>
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
 * <svg id="bc-sger-pad48-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad48-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,219.2 208.3,219.1 283.4,218.9 358.6,217.0 433.7,205.8 457.9,197.9 508.9,167.2 584.0,20.7"/>
 * <polyline class="ln2" points="58.0,219.5 133.1,219.5 208.3,219.5 283.4,219.4 358.6,217.5 433.7,210.1 457.9,204.3 508.9,180.7 584.0,61.7"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="205.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="167.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="20.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="180.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="61.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4220 | 56.8% |
 * | 64 | 0.0061 | 5.4167 | 0.0035 | 9.6296 | 56.3% |
 * | 128 | 0.0066 | 20.0388 | 0.0035 | 37.3575 | 53.6% |
 * | 256 | 0.0081 | 64.7559 | 0.0046 | 113.4345 | 57.1% |
 * | 512 | 0.0164 | 128.2500 | 0.0150 | 140.0085 | 91.6% |
 * | 1024 | 0.0591 | 142.0682 | 0.0567 | 147.9977 | 96.0% |
 * | 1280 | 0.0889 | 147.5328 | 0.0886 | 148.0123 | 99.7% |
 * | 2048 | 0.2252 | 149.0605 | 0.2229 | 150.5796 | 99.0% |
 * | 4096 | 0.8747 | 153.4867 | 0.8801 | 152.5435 | 100.6% |
 *
 * <svg id="bc-sger-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,214.6 208.3,200.0 283.4,155.2 358.6,91.7 433.7,77.9 457.9,72.5 508.9,70.9 584.0,66.5"/>
 * <polyline class="ln2" points="58.0,217.6 133.1,210.4 208.3,182.6 283.4,106.6 358.6,80.0 433.7,72.0 457.9,72.0 508.9,69.4 584.0,67.5"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="200.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="155.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="91.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="77.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="72.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="70.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="66.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="210.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="182.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="106.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="80.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="72.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="72.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="69.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="67.5" r="4"/>
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
 * <svg id="bc-sger-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.8 208.3,218.7 283.4,218.4 358.6,216.7 433.7,208.2 457.9,202.2 508.9,175.0 584.0,45.1"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.3 283.4,219.1 358.6,217.0 433.7,208.7 457.9,202.3 508.9,175.4 584.0,44.0"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="175.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="44.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 1.3750 | 0.0035 | 2.4332 | 56.5% |
 * | 64 | 0.0062 | 5.3333 | 0.0038 | 8.8511 | 60.3% |
 * | 128 | 0.0067 | 19.8462 | 0.0037 | 35.5862 | 55.8% |
 * | 256 | 0.0082 | 64.2500 | 0.0046 | 113.8270 | 56.4% |
 * | 512 | 0.0166 | 126.5202 | 0.0151 | 138.8245 | 91.1% |
 * | 1024 | 0.0580 | 144.6527 | 0.0570 | 147.2090 | 98.3% |
 * | 1280 | 0.0891 | 147.2943 | 0.0879 | 149.1703 | 98.7% |
 * | 2048 | 0.2281 | 147.1888 | 0.2275 | 147.5926 | 99.7% |
 * | 4096 | 0.9418 | 142.5503 | 0.9053 | 148.2972 | 96.1% |
 *
 * <svg id="bc-sger-pad128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,218.2 133.1,212.9 208.3,193.5 283.4,134.3 358.6,51.3 433.7,27.1 457.9,23.6 508.9,23.7 584.0,29.9"/>
 * <polyline class="ln2" points="58.0,216.8 133.1,208.2 208.3,172.6 283.4,68.2 358.6,34.9 433.7,23.7 457.9,21.1 508.9,23.2 584.0,22.3"/>
 * <circle class="mk1" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="212.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="193.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="134.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="51.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="27.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="23.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="23.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="29.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="208.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="172.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="68.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="34.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="23.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="21.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="23.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="22.3" r="4"/>
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
 * <svg id="bc-sger-pad128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sger-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sger-pad128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.8 208.3,218.7 283.4,218.4 358.6,216.7 433.7,208.4 457.9,202.2 508.9,174.4 584.0,31.6"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.2 208.3,219.3 283.4,219.1 358.6,217.0 433.7,208.6 457.9,202.4 508.9,174.5 584.0,38.9"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="174.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="31.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="174.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="38.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.sger.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/wgblas/lda.sger.js) — WebGPU lda-sweep benchmark script
 * - [lda.sger.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sger/cuda/lda.sger.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sger
 */
