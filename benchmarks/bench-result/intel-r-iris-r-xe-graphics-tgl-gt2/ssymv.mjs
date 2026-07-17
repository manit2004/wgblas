/**
 * Benchmark results for ssymv on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0381 |
 * | 64 | 0.1311 | 0.0693 |
 * | 128 | 0.0655 | 0.5273 |
 * | 256 | 0.1311 | 1.0273 |
 * | 512 | 0.1311 | 4.0547 |
 * | 1024 | 0.2621 | 8.0547 |
 * | 1280 | 0.5243 | 6.2842 |
 * | 2048 | 1.2452 | 6.7599 |
 * | 4096 | 22.1839 | 1.5151 |
 *
 * <svg id="bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#fcfcfb}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#1a1a19}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#2c2c2a}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#383835}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .at{fill:#898781}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#c3c2b7}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#3987e5}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln2{stroke:#008300}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">6.0</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">8.0</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">10</text>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,218.6 208.3,209.5 283.4,199.5 358.6,138.9 433.7,58.9 457.9,94.3 508.9,84.8 584.0,189.7"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="199.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="138.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="58.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="94.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="84.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="189.7" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#fcfcfb}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#1a1a19}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#2c2c2a}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#383835}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .at{fill:#898781}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#c3c2b7}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#3987e5}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln2{stroke:#008300}#bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.00</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10.00</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15.00</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25.00</text>
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
 * <polyline class="ln1" points="58.0,219.5 133.1,219.0 208.3,219.5 283.4,219.0 358.6,219.0 433.7,217.9 457.9,215.8 508.9,210.0 584.0,42.5"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="219.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="219.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="217.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="215.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="210.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="42.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/benchmark.ssymv.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/ssymv
 */
