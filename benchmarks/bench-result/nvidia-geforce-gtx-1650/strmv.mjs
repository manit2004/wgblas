/**
 * Benchmark results for strmv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0048 | 0.4933 | 58.6% |
 * | 64 | 0.0083 | 1.0698 | 0.0064 | 1.3731 | 77.9% |
 * | 128 | 0.0092 | 3.7138 | 0.0099 | 3.4323 | 108.2% |
 * | 256 | 0.0146 | 9.1679 | 0.0170 | 7.8570 | 116.7% |
 * | 512 | 0.0270 | 19.6251 | 0.0348 | 15.1989 | 129.1% |
 * | 1024 | 0.0772 | 27.3035 | 0.1718 | 12.2671 | 222.6% |
 * | 1280 | 0.1206 | 27.2715 | 0.0662 | 49.6738 | 54.9% |
 * | 2048 | 0.2635 | 31.9145 | 0.0996 | 84.4286 | 37.8% |
 * | 4096 | 1.4785 | 22.7227 | 0.2533 | 132.6497 | 17.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-strmv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,215.0 283.4,207.8 358.6,193.8 433.7,183.6 457.9,183.6 508.9,177.4 584.0,189.7"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,218.2 208.3,215.4 283.4,209.5 358.6,199.7 433.7,203.6 457.9,153.8 508.9,107.4 584.0,43.1"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="207.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="193.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="183.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="183.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="189.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="199.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="153.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="107.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="43.1" r="4"/>
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
 * <svg id="bc-strmv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.8 283.4,218.1 358.6,216.4 433.7,209.7 457.9,203.9 508.9,184.9 584.0,22.9"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,219.1 208.3,218.7 283.4,217.7 358.6,215.4 433.7,197.1 457.9,211.2 508.9,206.7 584.0,186.2"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="203.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="184.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="22.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="197.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="211.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="206.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="186.2" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/strmv.js) — WebGPU benchmark script
 * - [strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/strmv.c) — CUDA / cuBLAS reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `trans = "no-transpose"`. `trans = "transpose"` reads A with a cross-thread `lda`-strided mirror pattern instead of a coalesced one, and the gap grows with `n` — collapsed below by default, expand a `trans` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3507 | 0.0049 | 0.4805 | 73.0% |
 * | 64 | 0.0068 | 1.2927 | 0.0066 | 1.3463 | 96.0% |
 * | 128 | 0.0070 | 4.8364 | 0.0099 | 3.4323 | 140.9% |
 * | 256 | 0.0086 | 15.5242 | 0.0169 | 7.8867 | 196.8% |
 * | 512 | 0.0114 | 46.4067 | 0.0343 | 15.4545 | 300.3% |
 * | 1024 | 0.0287 | 73.5000 | 0.1717 | 12.2763 | 598.7% |
 * | 1280 | 0.0389 | 84.4700 | 0.0672 | 48.9757 | 172.5% |
 * | 2048 | 0.0825 | 101.8938 | 0.1003 | 83.8226 | 121.6% |
 * | 4096 | 0.2771 | 121.2235 | 0.2540 | 132.2903 | 91.6% |
 *
 * <svg id="bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.5 133.1,218.3 208.3,213.6 283.4,199.3 358.6,158.1 433.7,122.0 457.9,107.4 508.9,84.1 584.0,58.4"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,218.2 208.3,215.4 283.4,209.5 358.6,199.4 433.7,203.6 457.9,154.7 508.9,108.2 584.0,43.6"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="199.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="158.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="122.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="107.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="84.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="199.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="154.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="108.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="43.6" r="4"/>
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
 * <svg id="bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-transno-transpose-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.0500</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.150</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.250</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.300</text>
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
 * <polyline class="ln1" points="58.0,215.5 133.1,215.4 208.3,215.3 283.4,214.3 358.6,212.4 433.7,200.9 457.9,194.0 508.9,165.0 584.0,35.2"/>
 * <polyline class="ln2" points="58.0,216.7 133.1,215.6 208.3,213.4 283.4,208.7 358.6,197.1 433.7,105.5 457.9,175.2 508.9,153.1 584.0,50.7"/>
 * <circle class="mk1" cx="58.0" cy="215.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="200.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="194.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="165.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="35.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="213.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="208.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="197.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="105.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="175.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="153.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3458 | 0.0051 | 0.4625 | 74.8% |
 * | 64 | 0.0070 | 1.2632 | 0.0067 | 1.3206 | 95.7% |
 * | 128 | 0.0080 | 4.2560 | 0.0123 | 2.7708 | 153.6% |
 * | 256 | 0.0116 | 11.5359 | 0.0321 | 4.1614 | 277.2% |
 * | 512 | 0.0208 | 25.4523 | 0.1142 | 4.6342 | 549.2% |
 * | 1024 | 0.0608 | 34.6884 | 0.4506 | 4.6773 | 741.6% |
 * | 1280 | 0.0977 | 33.6608 | 0.2152 | 15.2828 | 220.3% |
 * | 2048 | 0.2134 | 39.4097 | 0.3280 | 25.6400 | 153.7% |
 * | 4096 | 1.1402 | 29.4634 | 1.0297 | 32.6270 | 90.3% |
 *
 * <svg id="bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">40</text>
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
 * <polyline class="ln1" points="58.0,218.3 133.1,213.7 208.3,198.7 283.4,162.3 358.6,92.7 433.7,46.6 457.9,51.7 508.9,23.0 584.0,72.7"/>
 * <polyline class="ln2" points="58.0,217.7 133.1,213.4 208.3,206.1 283.4,199.2 358.6,196.8 433.7,196.6 457.9,143.6 508.9,91.8 584.0,56.9"/>
 * <circle class="mk1" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="198.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="162.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="92.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="46.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="51.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="23.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="72.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="206.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="199.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="196.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="196.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="143.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="91.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="56.9" r="4"/>
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
 * <svg id="bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-transtranspose-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.7 283.4,218.1 358.6,216.5 433.7,209.9 457.9,203.7 508.9,184.4 584.0,30.0"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,218.9 208.3,218.0 283.4,214.7 358.6,201.0 433.7,144.9 457.9,184.1 508.9,165.3 584.0,48.4"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="203.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="184.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="214.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="201.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="144.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="184.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="165.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/trans.strmv.js) — WebGPU trans-sweep benchmark script
 * - [trans.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/trans.strmv.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride only matters for `trans = "transpose"` here (swept at both `trans` values below so that's visible in the data, not just claimed) — see TODO.md in the repo for the measured mechanism. Collapsed below by default — expand a `trans` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (8 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2879 | 0.0049 | 0.4868 | 59.1% |
 * | 64 | 0.0083 | 1.0615 | 0.0062 | 1.4154 | 75.0% |
 * | 128 | 0.0085 | 3.9925 | 0.0098 | 3.4658 | 115.2% |
 * | 256 | 0.0106 | 12.5783 | 0.0168 | 7.9695 | 157.8% |
 * | 512 | 0.0149 | 35.4641 | 0.0339 | 15.6002 | 227.3% |
 * | 1024 | 0.0338 | 62.3636 | 0.1707 | 12.3488 | 505.0% |
 * | 1280 | 0.0451 | 72.9337 | 0.0673 | 48.8709 | 149.2% |
 * | 2048 | 0.0942 | 89.2609 | 0.0988 | 85.0984 | 104.9% |
 * | 4096 | 0.3119 | 107.7107 | 0.2532 | 132.6916 | 81.2% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.7 283.4,203.2 358.6,172.7 433.7,136.8 457.9,122.8 508.9,101.0 584.0,76.4"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,218.1 208.3,215.4 283.4,209.4 358.6,199.2 433.7,203.5 457.9,154.8 508.9,106.5 584.0,43.1"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="172.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="136.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="122.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="101.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="76.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="199.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="154.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="106.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="43.1" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.8 208.3,215.7 283.4,214.7 358.6,212.5 433.7,203.1 457.9,197.4 508.9,172.9 584.0,64.0"/>
 * <polyline class="ln2" points="58.0,217.6 133.1,216.9 208.3,215.1 283.4,211.6 358.6,203.1 433.7,134.7 457.9,186.3 508.9,170.6 584.0,93.4"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="203.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="172.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="64.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="211.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="203.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="134.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="186.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="170.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="93.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0049 | 0.4868 | 59.4% |
 * | 64 | 0.0082 | 1.0739 | 0.0064 | 1.3869 | 77.4% |
 * | 128 | 0.0087 | 3.9190 | 0.0100 | 3.4157 | 114.7% |
 * | 256 | 0.0107 | 12.4843 | 0.0167 | 7.9847 | 156.4% |
 * | 512 | 0.0147 | 35.9652 | 0.0339 | 15.6223 | 230.2% |
 * | 1024 | 0.0344 | 61.3184 | 0.1696 | 12.4233 | 493.6% |
 * | 1280 | 0.0455 | 72.2417 | 0.0676 | 48.6742 | 148.4% |
 * | 2048 | 0.0951 | 88.4348 | 0.1008 | 83.4235 | 106.0% |
 * | 4096 | 0.3174 | 105.8323 | 0.2598 | 129.3245 | 81.8% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.8 283.4,203.4 358.6,172.0 433.7,138.2 457.9,123.7 508.9,102.1 584.0,78.9"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,218.2 208.3,215.4 283.4,209.4 358.6,199.2 433.7,203.4 457.9,155.1 508.9,108.8 584.0,47.6"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="172.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="138.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="123.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="102.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="78.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="199.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="155.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="108.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="47.6" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.9 208.3,215.7 283.4,214.6 358.6,212.6 433.7,202.8 457.9,197.2 508.9,172.5 584.0,61.3"/>
 * <polyline class="ln2" points="58.0,217.6 133.1,216.8 208.3,215.0 283.4,211.7 358.6,203.1 433.7,135.2 457.9,186.2 508.9,169.6 584.0,90.1"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="172.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="61.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="211.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="203.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="135.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="186.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="169.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="90.1" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0049 | 0.4868 | 59.4% |
 * | 64 | 0.0082 | 1.0760 | 0.0064 | 1.3766 | 78.2% |
 * | 128 | 0.0086 | 3.9407 | 0.0099 | 3.4323 | 114.8% |
 * | 256 | 0.0107 | 12.5405 | 0.0166 | 8.0462 | 155.9% |
 * | 512 | 0.0149 | 35.5403 | 0.0339 | 15.6223 | 227.5% |
 * | 1024 | 0.0345 | 61.1476 | 0.1700 | 12.3999 | 493.1% |
 * | 1280 | 0.0464 | 70.9455 | 0.0667 | 49.3046 | 143.9% |
 * | 2048 | 0.0922 | 91.1811 | 0.0961 | 87.4926 | 104.2% |
 * | 4096 | 0.3033 | 110.7794 | 0.2492 | 134.8303 | 82.2% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.7 283.4,203.3 358.6,172.6 433.7,138.5 457.9,125.4 508.9,98.4 584.0,72.3"/>
 * <polyline class="ln2" points="58.0,219.4 133.1,218.2 208.3,215.4 283.4,209.3 358.6,199.2 433.7,203.5 457.9,154.3 508.9,103.3 584.0,40.2"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="172.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="138.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="125.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="98.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="72.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="199.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="154.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="103.3" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.9 208.3,215.7 283.4,214.7 358.6,212.6 433.7,202.8 457.9,196.8 508.9,173.9 584.0,68.4"/>
 * <polyline class="ln2" points="58.0,217.6 133.1,216.8 208.3,215.0 283.4,211.7 358.6,203.1 433.7,135.0 457.9,186.7 508.9,172.0 584.0,95.4"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="196.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="173.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="211.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="203.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="135.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="186.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="172.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="95.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0045 | 0.5230 | 55.3% |
 * | 64 | 0.0082 | 1.0739 | 0.0061 | 1.4375 | 74.7% |
 * | 128 | 0.0087 | 3.9190 | 0.0094 | 3.6376 | 107.7% |
 * | 256 | 0.0107 | 12.5030 | 0.0158 | 8.4620 | 147.8% |
 * | 512 | 0.0149 | 35.6168 | 0.0314 | 16.8644 | 211.2% |
 * | 1024 | 0.0344 | 61.2614 | 0.1616 | 13.0369 | 469.9% |
 * | 1280 | 0.0460 | 71.5130 | 0.0632 | 52.0111 | 137.5% |
 * | 2048 | 0.0957 | 87.8289 | 0.0954 | 88.1677 | 99.6% |
 * | 4096 | 0.3023 | 111.1194 | 0.2489 | 134.9776 | 82.3% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.8 283.4,203.3 358.6,172.5 433.7,138.3 457.9,124.6 508.9,102.9 584.0,71.8"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,218.1 208.3,215.1 283.4,208.7 358.6,197.5 433.7,202.6 457.9,150.7 508.9,102.4 584.0,40.0"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="172.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="138.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="124.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="102.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="71.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="208.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="197.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="202.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="150.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="102.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.0" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.9 208.3,215.7 283.4,214.7 358.6,212.6 433.7,202.8 457.9,197.0 508.9,172.1 584.0,68.8"/>
 * <polyline class="ln2" points="58.0,217.8 133.1,216.9 208.3,215.3 283.4,212.1 358.6,204.3 433.7,139.2 457.9,188.4 508.9,172.3 584.0,95.6"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="172.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="212.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="204.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="139.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="188.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="172.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="95.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0047 | 0.5034 | 57.4% |
 * | 64 | 0.0082 | 1.0781 | 0.0061 | 1.4375 | 75.0% |
 * | 128 | 0.0086 | 3.9407 | 0.0091 | 3.7268 | 105.7% |
 * | 256 | 0.0106 | 12.6163 | 0.0159 | 8.4194 | 149.8% |
 * | 512 | 0.0148 | 35.7322 | 0.0316 | 16.7619 | 213.2% |
 * | 1024 | 0.0344 | 61.2045 | 0.1618 | 13.0253 | 469.9% |
 * | 1280 | 0.0452 | 72.7016 | 0.0635 | 51.8145 | 140.3% |
 * | 2048 | 0.1162 | 72.3723 | 0.0953 | 88.1973 | 82.1% |
 * | 4096 | 0.3829 | 87.7293 | 0.2494 | 134.6833 | 65.1% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.7 283.4,203.2 358.6,172.4 433.7,138.4 457.9,123.1 508.9,123.5 584.0,103.0"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,218.1 208.3,215.0 283.4,208.8 358.6,197.7 433.7,202.6 457.9,150.9 508.9,102.4 584.0,40.4"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="172.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="138.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="123.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="123.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="103.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="208.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="197.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="202.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="150.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="102.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.4" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.9 208.3,215.7 283.4,214.7 358.6,212.6 433.7,202.8 457.9,197.4 508.9,161.9 584.0,28.5"/>
 * <polyline class="ln2" points="58.0,217.7 133.1,216.9 208.3,215.4 283.4,212.1 358.6,204.2 433.7,139.1 457.9,188.2 508.9,172.3 584.0,95.3"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="161.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="212.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="204.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="139.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="188.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="172.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="95.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0118 | 0.2008 | 0.0046 | 0.5139 | 39.1% |
 * | 64 | 0.0118 | 0.7500 | 0.0061 | 1.4375 | 52.2% |
 * | 128 | 0.0123 | 2.7781 | 0.0092 | 3.6944 | 75.2% |
 * | 256 | 0.0162 | 8.2693 | 0.0160 | 8.3687 | 98.8% |
 * | 512 | 0.0205 | 25.8500 | 0.0315 | 16.8301 | 153.6% |
 * | 1024 | 0.0453 | 46.5249 | 0.1618 | 13.0253 | 357.2% |
 * | 1280 | 0.0601 | 54.7537 | 0.0635 | 51.8145 | 105.7% |
 * | 2048 | 0.1208 | 69.5932 | 0.0961 | 87.5363 | 79.5% |
 * | 4096 | 0.4020 | 83.5773 | 0.2505 | 134.1069 | 62.3% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.7 133.1,219.0 208.3,216.3 283.4,209.0 358.6,185.5 433.7,158.0 457.9,147.0 508.9,127.2 584.0,108.6"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,218.1 208.3,215.1 283.4,208.8 358.6,197.6 433.7,202.6 457.9,150.9 508.9,103.3 584.0,41.2"/>
 * <circle class="mk1" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="185.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="158.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="147.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="127.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="108.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="208.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="197.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="202.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="150.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="103.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="41.2" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.3 133.1,215.3 208.3,215.1 283.4,213.5 358.6,211.8 433.7,201.9 457.9,196.0 508.9,171.7 584.0,59.2"/>
 * <polyline class="ln2" points="58.0,218.2 133.1,217.6 208.3,216.3 283.4,213.6 358.6,207.4 433.7,155.3 457.9,194.6 508.9,181.6 584.0,119.8"/>
 * <circle class="mk1" cx="58.0" cy="215.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="213.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="211.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="201.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="196.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="171.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="59.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="213.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="207.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="155.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="194.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="181.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="119.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0123 | 0.1932 | 0.0045 | 0.5230 | 36.9% |
 * | 64 | 0.0123 | 0.7188 | 0.0061 | 1.4450 | 49.7% |
 * | 128 | 0.0129 | 2.6402 | 0.0094 | 3.6068 | 73.2% |
 * | 256 | 0.0168 | 7.9392 | 0.0158 | 8.4792 | 93.6% |
 * | 512 | 0.0220 | 24.1166 | 0.0315 | 16.8045 | 143.5% |
 * | 1024 | 0.0493 | 42.7636 | 0.1618 | 13.0253 | 328.3% |
 * | 1280 | 0.0655 | 50.2198 | 0.0635 | 51.8145 | 96.9% |
 * | 2048 | 0.1340 | 62.7694 | 0.0956 | 87.9906 | 71.3% |
 * | 4096 | 0.3167 | 106.0782 | 0.2585 | 129.9648 | 81.6% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.7 133.1,219.0 208.3,216.5 283.4,209.4 358.6,187.8 433.7,163.0 457.9,153.0 508.9,136.3 584.0,78.6"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,218.1 208.3,215.2 283.4,208.7 358.6,197.6 433.7,202.6 457.9,150.9 508.9,102.7 584.0,46.7"/>
 * <circle class="mk1" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="187.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="163.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="153.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="136.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="78.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="208.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="197.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="202.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="150.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="102.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="46.7" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,213.9 133.1,213.9 208.3,213.6 283.4,211.6 358.6,209.0 433.7,195.4 457.9,187.2 508.9,153.0 584.0,61.6"/>
 * <polyline class="ln2" points="58.0,217.8 133.1,216.9 208.3,215.3 283.4,212.1 358.6,204.2 433.7,139.1 457.9,188.2 508.9,172.2 584.0,90.8"/>
 * <circle class="mk1" cx="58.0" cy="213.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="209.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="195.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="187.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="153.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="61.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="212.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="204.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="139.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="188.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="172.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="90.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0048 | 0.4966 | 58.2% |
 * | 64 | 0.0082 | 1.0781 | 0.0063 | 1.3939 | 77.3% |
 * | 128 | 0.0085 | 4.0151 | 0.0099 | 3.4323 | 117.0% |
 * | 256 | 0.0103 | 12.9689 | 0.0166 | 8.0308 | 161.5% |
 * | 512 | 0.0144 | 36.8053 | 0.0335 | 15.8240 | 232.6% |
 * | 1024 | 0.0331 | 63.6290 | 0.1685 | 12.5035 | 508.9% |
 * | 1280 | 0.0448 | 73.5073 | 0.0660 | 49.8424 | 147.5% |
 * | 2048 | 0.0928 | 90.6308 | 0.1008 | 83.3970 | 108.7% |
 * | 4096 | 0.3296 | 101.9228 | 0.2601 | 129.1653 | 78.9% |
 *
 * <svg id="bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.6 283.4,202.7 358.6,170.9 433.7,135.2 457.9,122.0 508.9,99.2 584.0,84.1"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,218.1 208.3,215.4 283.4,209.3 358.6,198.9 433.7,203.3 457.9,153.5 508.9,108.8 584.0,47.8"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="202.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="170.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="135.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="122.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="99.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="84.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="198.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="153.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="108.8" r="4"/>
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
 * <svg id="bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-no-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.9 133.1,215.9 208.3,215.8 283.4,214.8 358.6,212.8 433.7,203.4 457.9,197.6 508.9,173.6 584.0,55.2"/>
 * <polyline class="ln2" points="58.0,217.6 133.1,216.8 208.3,215.0 283.4,211.7 358.6,203.2 433.7,135.8 457.9,187.0 508.9,169.6 584.0,90.0"/>
 * <circle class="mk1" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="203.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="173.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="211.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="203.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="135.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="187.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="169.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="90.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (8 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0082 | 0.2891 | 0.0052 | 0.4512 | 64.1% |
 * | 64 | 0.0083 | 1.0698 | 0.0068 | 1.2897 | 82.9% |
 * | 128 | 0.0092 | 3.7073 | 0.0123 | 2.7708 | 133.8% |
 * | 256 | 0.0143 | 9.3214 | 0.0316 | 4.2224 | 220.8% |
 * | 512 | 0.0259 | 20.4121 | 0.1127 | 4.6980 | 434.5% |
 * | 1024 | 0.0742 | 28.3862 | 0.4464 | 4.7204 | 601.4% |
 * | 1280 | 0.1175 | 27.9918 | 0.2744 | 11.9897 | 233.5% |
 * | 2048 | 0.2632 | 31.9494 | 0.3338 | 25.1890 | 126.8% |
 * | 4096 | 1.4029 | 23.9474 | 1.0420 | 32.2403 | 74.3% |
 *
 * <svg id="bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">40</text>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,214.7 208.3,201.5 283.4,173.4 358.6,117.9 433.7,78.1 457.9,80.0 508.9,60.3 584.0,100.3"/>
 * <polyline class="ln2" points="58.0,217.7 133.1,213.6 208.3,206.1 283.4,198.9 358.6,196.5 433.7,196.4 457.9,160.1 508.9,94.1 584.0,58.8"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="201.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="173.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="117.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="78.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="80.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="60.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="100.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="206.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="198.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="196.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="196.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="160.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="94.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="58.8" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.8 283.4,218.1 358.6,216.5 433.7,210.1 457.9,204.3 508.9,184.9 584.0,32.9"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.1 208.3,218.4 283.4,215.8 358.6,205.0 433.7,160.5 457.9,183.4 508.9,175.5 584.0,81.1"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="210.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="184.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="32.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="205.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="160.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="183.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="175.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="81.1" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.3434 | 0.0041 | 0.5781 | 59.4% |
 * | 64 | 0.0069 | 1.2748 | 0.0055 | 1.6047 | 79.4% |
 * | 128 | 0.0079 | 4.3077 | 0.0082 | 4.1562 | 103.6% |
 * | 256 | 0.0098 | 13.6918 | 0.0162 | 8.2448 | 166.1% |
 * | 512 | 0.0159 | 33.3548 | 0.0492 | 10.7708 | 309.7% |
 * | 1024 | 0.0393 | 53.6505 | 0.1981 | 10.6391 | 504.3% |
 * | 1280 | 0.0659 | 49.9393 | 0.1518 | 21.6740 | 230.4% |
 * | 2048 | 0.1188 | 70.7931 | 0.1779 | 47.2803 | 149.7% |
 * | 4096 | 0.8644 | 38.8648 | 0.5319 | 63.1663 | 61.5% |
 *
 * <svg id="bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">25</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">75</text>
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
 * <polyline class="ln1" points="58.0,219.1 133.1,216.6 208.3,208.5 283.4,183.5 358.6,131.1 433.7,76.9 457.9,86.8 508.9,31.2 584.0,116.4"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,215.7 208.3,208.9 283.4,198.0 358.6,191.3 433.7,191.6 457.9,162.2 508.9,93.9 584.0,51.6"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="183.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="131.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="76.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="86.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="31.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="116.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="208.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="198.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="191.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="191.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="162.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="93.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="51.6" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,218.6 208.3,218.4 283.4,218.0 358.6,216.8 433.7,212.1 457.9,206.8 508.9,196.2 584.0,47.1"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,218.9 208.3,218.4 283.4,216.8 358.6,210.2 433.7,180.4 457.9,189.6 508.9,184.4 584.0,113.6"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="212.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="206.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="196.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="47.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="210.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="180.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="189.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="184.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="113.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3491 | 0.0041 | 0.5781 | 60.4% |
 * | 64 | 0.0070 | 1.2632 | 0.0051 | 1.7358 | 72.8% |
 * | 128 | 0.0078 | 4.3429 | 0.0078 | 4.3607 | 99.6% |
 * | 256 | 0.0102 | 13.1321 | 0.0166 | 8.0385 | 163.4% |
 * | 512 | 0.0175 | 30.2450 | 0.0567 | 9.3337 | 324.0% |
 * | 1024 | 0.0451 | 46.7727 | 0.2314 | 9.1062 | 513.6% |
 * | 1280 | 0.0700 | 46.9728 | 0.1467 | 22.4258 | 209.5% |
 * | 2048 | 0.1475 | 57.0278 | 0.2191 | 38.3738 | 148.6% |
 * | 4096 | 1.0693 | 31.4178 | 0.6512 | 51.5862 | 60.9% |
 *
 * <svg id="bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">10</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">20</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">40</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">60</text>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,215.8 208.3,205.5 283.4,176.2 358.6,119.2 433.7,64.1 457.9,63.4 508.9,29.9 584.0,115.3"/>
 * <polyline class="ln2" points="58.0,218.1 133.1,214.2 208.3,205.5 283.4,193.2 358.6,188.9 433.7,189.6 457.9,145.2 508.9,92.1 584.0,48.0"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="205.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="176.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="119.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="64.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="63.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="29.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="115.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="205.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="193.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="188.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="189.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="145.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="92.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.0" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.7 283.4,218.3 358.6,217.1 433.7,212.5 457.9,208.3 508.9,195.4 584.0,41.8"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.2 208.3,218.7 283.4,217.2 358.6,210.6 433.7,181.4 457.9,195.6 508.9,183.5 584.0,111.5"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="212.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="208.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="195.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="41.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="210.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="181.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="195.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="183.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="111.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3491 | 0.0041 | 0.5781 | 60.4% |
 * | 64 | 0.0069 | 1.2837 | 0.0054 | 1.6235 | 79.1% |
 * | 128 | 0.0079 | 4.3340 | 0.0084 | 4.0533 | 106.9% |
 * | 256 | 0.0105 | 12.7317 | 0.0208 | 6.4395 | 197.7% |
 * | 512 | 0.0184 | 28.7222 | 0.0675 | 7.8408 | 366.3% |
 * | 1024 | 0.0512 | 41.1600 | 0.2827 | 7.4557 | 552.1% |
 * | 1280 | 0.0758 | 43.4122 | 0.1558 | 21.1088 | 205.7% |
 * | 2048 | 0.1768 | 47.5541 | 0.2498 | 33.6579 | 141.3% |
 * | 4096 | 1.1587 | 28.9939 | 0.7482 | 44.9031 | 64.6% |
 *
 * <svg id="bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">40</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">50</text>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,214.9 208.3,202.7 283.4,169.1 358.6,105.1 433.7,55.4 457.9,46.4 508.9,29.8 584.0,104.0"/>
 * <polyline class="ln2" points="58.0,217.7 133.1,213.5 208.3,203.8 283.4,194.2 358.6,188.6 433.7,190.2 457.9,135.6 508.9,85.4 584.0,40.4"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="202.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="169.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="105.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="55.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="46.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="29.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="104.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="203.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="194.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="188.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="190.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="135.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="85.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.4" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.7 283.4,218.3 358.6,216.9 433.7,211.5 457.9,207.4 508.9,190.5 584.0,26.9"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.1 208.3,218.6 283.4,216.5 358.6,208.8 433.7,172.9 457.9,194.0 508.9,178.4 584.0,95.3"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="190.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="26.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="208.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="172.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="194.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="178.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="95.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3474 | 0.0042 | 0.5606 | 62.0% |
 * | 64 | 0.0068 | 1.2897 | 0.0056 | 1.5771 | 81.8% |
 * | 128 | 0.0081 | 4.1890 | 0.0101 | 3.3778 | 124.0% |
 * | 256 | 0.0114 | 11.6975 | 0.0257 | 5.2005 | 224.9% |
 * | 512 | 0.0216 | 24.5278 | 0.0921 | 5.7464 | 426.8% |
 * | 1024 | 0.0616 | 34.2287 | 0.3579 | 5.8879 | 581.3% |
 * | 1280 | 0.0917 | 35.8751 | 0.1985 | 16.5753 | 216.4% |
 * | 2048 | 0.2253 | 37.3273 | 0.3581 | 23.4849 | 158.9% |
 * | 4096 | 1.1121 | 30.2099 | 1.0467 | 32.0978 | 94.1% |
 *
 * <svg id="bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">40</text>
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
 * <polyline class="ln1" points="58.0,218.3 133.1,213.6 208.3,199.1 283.4,161.5 358.6,97.4 433.7,48.9 457.9,40.6 508.9,33.4 584.0,69.0"/>
 * <polyline class="ln2" points="58.0,217.2 133.1,212.1 208.3,203.1 283.4,194.0 358.6,191.3 433.7,190.6 457.9,137.1 508.9,102.6 584.0,59.5"/>
 * <circle class="mk1" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="199.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="161.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="97.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="48.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="40.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="33.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="69.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="212.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="203.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="194.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="191.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="190.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="137.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="102.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="59.5" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.9 208.3,218.6 283.4,218.1 358.6,216.4 433.7,209.7 457.9,204.7 508.9,182.5 584.0,34.7"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.1 208.3,218.3 283.4,215.7 358.6,204.7 433.7,160.4 457.9,186.9 508.9,160.3 584.0,45.6"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="182.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="34.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="204.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="160.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="186.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="160.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="45.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3507 | 0.0041 | 0.5781 | 60.7% |
 * | 64 | 0.0070 | 1.2661 | 0.0053 | 1.6527 | 76.6% |
 * | 128 | 0.0079 | 4.3252 | 0.0085 | 3.9850 | 108.5% |
 * | 256 | 0.0106 | 12.6545 | 0.0205 | 6.5250 | 193.9% |
 * | 512 | 0.0193 | 27.4362 | 0.0720 | 7.3529 | 373.1% |
 * | 1024 | 0.0516 | 40.8156 | 0.2832 | 7.4405 | 548.6% |
 * | 1280 | 0.0756 | 43.5224 | 0.1567 | 20.9967 | 207.3% |
 * | 2048 | 0.1886 | 44.5812 | 0.2784 | 30.2016 | 147.6% |
 * | 4096 | 1.1215 | 29.9569 | 0.7864 | 42.7187 | 70.1% |
 *
 * <svg id="bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">40</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">50</text>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,214.9 208.3,202.7 283.4,169.4 358.6,110.3 433.7,56.7 457.9,45.9 508.9,41.7 584.0,100.2"/>
 * <polyline class="ln2" points="58.0,217.7 133.1,213.4 208.3,204.1 283.4,193.9 358.6,190.6 433.7,190.2 457.9,136.0 508.9,99.2 584.0,49.1"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="202.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="169.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="110.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="56.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="45.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="41.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="100.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="204.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="193.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="190.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="190.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="136.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="99.2" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad48-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.7 283.4,218.2 358.6,216.8 433.7,211.4 457.9,207.4 508.9,188.6 584.0,33.1"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.1 208.3,218.6 283.4,216.6 358.6,208.0 433.7,172.8 457.9,193.9 508.9,173.6 584.0,88.9"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="188.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="33.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="208.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="172.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="193.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="173.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="88.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.3442 | 0.0042 | 0.5692 | 60.5% |
 * | 64 | 0.0072 | 1.2321 | 0.0056 | 1.5862 | 77.7% |
 * | 128 | 0.0080 | 4.2560 | 0.0098 | 3.4602 | 123.0% |
 * | 256 | 0.0116 | 11.5679 | 0.0268 | 4.9833 | 232.1% |
 * | 512 | 0.0212 | 24.9157 | 0.0901 | 5.8750 | 424.1% |
 * | 1024 | 0.0635 | 33.1935 | 0.3758 | 5.6079 | 591.9% |
 * | 1280 | 0.0924 | 35.5832 | 0.2036 | 16.1534 | 220.3% |
 * | 2048 | 0.2216 | 37.9554 | 0.3441 | 24.4371 | 155.3% |
 * | 4096 | 1.1059 | 30.3778 | 1.0835 | 31.0053 | 98.0% |
 *
 * <svg id="bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">40</text>
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
 * <polyline class="ln1" points="58.0,218.3 133.1,213.8 208.3,198.7 283.4,162.2 358.6,95.4 433.7,54.0 457.9,42.1 508.9,30.2 584.0,68.1"/>
 * <polyline class="ln2" points="58.0,217.2 133.1,212.1 208.3,202.7 283.4,195.1 358.6,190.6 433.7,192.0 457.9,139.2 508.9,97.8 584.0,65.0"/>
 * <circle class="mk1" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="198.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="162.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="95.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="54.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="42.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="30.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="212.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="202.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="195.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="190.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="192.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="139.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="97.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="65.0" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.7 283.4,218.1 358.6,216.5 433.7,209.4 457.9,204.6 508.9,183.1 584.0,35.7"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.1 208.3,218.4 283.4,215.5 358.6,205.0 433.7,157.4 457.9,186.1 508.9,162.7 584.0,39.4"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="183.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="35.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="205.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="157.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="186.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="162.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="39.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.3466 | 0.0042 | 0.5649 | 61.4% |
 * | 64 | 0.0071 | 1.2377 | 0.0057 | 1.5376 | 80.5% |
 * | 128 | 0.0079 | 4.2903 | 0.0099 | 3.4267 | 125.2% |
 * | 256 | 0.0114 | 11.7303 | 0.0256 | 5.2265 | 224.4% |
 * | 512 | 0.0216 | 24.4915 | 0.0956 | 5.5387 | 442.2% |
 * | 1024 | 0.0624 | 33.7723 | 0.3606 | 5.8435 | 577.9% |
 * | 1280 | 0.0908 | 36.2355 | 0.1949 | 16.8774 | 214.7% |
 * | 2048 | 0.2335 | 36.0200 | 0.3618 | 23.2429 | 155.0% |
 * | 4096 | 1.1469 | 29.2929 | 1.0461 | 32.1160 | 91.2% |
 *
 * <svg id="bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">40</text>
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
 * <polyline class="ln1" points="58.0,218.3 133.1,213.8 208.3,198.5 283.4,161.3 358.6,97.5 433.7,51.1 457.9,38.8 508.9,39.9 584.0,73.5"/>
 * <polyline class="ln2" points="58.0,217.2 133.1,212.3 208.3,202.9 283.4,193.9 358.6,192.3 433.7,190.8 457.9,135.6 508.9,103.8 584.0,59.4"/>
 * <circle class="mk1" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="198.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="161.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="97.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="51.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="38.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="39.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="73.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="212.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="202.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="193.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="192.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="190.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="135.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="103.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="59.4" r="4"/>
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
 * <svg id="bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-lda-transpose-pad128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.9 133.1,218.8 208.3,218.7 283.4,218.1 358.6,216.4 433.7,209.6 457.9,204.9 508.9,181.1 584.0,28.9"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.0 208.3,218.3 283.4,215.7 358.6,204.1 433.7,159.9 457.9,187.5 508.9,159.7 584.0,45.7"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="204.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="181.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="204.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="159.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="187.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="159.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="45.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/wgblas/lda.strmv.js) — WebGPU lda-sweep benchmark script
 * - [lda.strmv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/lda.strmv.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/strmv
 */
