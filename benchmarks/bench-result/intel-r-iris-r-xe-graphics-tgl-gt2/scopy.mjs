/**
 * Benchmark results for scopy on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0039 |
 * | 64 | 0.0655 | 0.0078 |
 * | 128 | 0.0655 | 0.0156 |
 * | 512 | 0.0655 | 0.0625 |
 * | 1024 | 0.0655 | 0.1250 |
 * | 4096 | 0.0655 | 0.5000 |
 * | 16384 | 0.0655 | 2.0000 |
 * | 65536 | 0.1311 | 4.0000 |
 * | 262144 | 0.3277 | 6.4000 |
 * | 1048576 | 1.2452 | 6.7368 |
 * | 4194304 | 2.4904 | 13.4737 |
 * | 16777216 | 7.0779 | 18.9630 |
 *
 * <svg id="bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#fcfcfb}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#1a1a19}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#2c2c2a}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#383835}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .at{fill:#898781}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#c3c2b7}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#3987e5}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln2{stroke:#008300}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">20</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="85.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="113.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="168.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="196.4" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="251.8" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="307.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="362.5" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="417.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="473.3" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="528.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.8 168.7,219.4 196.4,218.8 251.8,215.0 307.2,200.0 362.5,180.0 417.9,156.0 473.3,152.6 528.6,85.3 584.0,30.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.0" r="4"/>
 * <circle class="mk1" cx="307.2" cy="200.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="180.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="156.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="152.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="85.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.4" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#fcfcfb}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#1a1a19}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#2c2c2a}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#383835}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .at{fill:#898781}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#c3c2b7}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#3987e5}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln2{stroke:#008300}#bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">4.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">6.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">8.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="85.7" y="236" text-anchor="middle">64</text>
 * <text class="at" x="113.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="168.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="196.4" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="251.8" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="307.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="362.5" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="417.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="473.3" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="528.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,218.4 85.7,218.4 113.4,218.4 168.7,218.4 196.4,218.4 251.8,218.4 307.2,218.4 362.5,216.7 417.9,211.8 473.3,188.9 528.6,157.7 584.0,43.1"/>
 * <circle class="mk1" cx="58.0" cy="218.4" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.4" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="216.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="188.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="157.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="43.1" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/benchmark.scopy.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/scopy
 */
