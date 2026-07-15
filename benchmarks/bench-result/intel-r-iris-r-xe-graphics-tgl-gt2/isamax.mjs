/**
 * Benchmark results for isamax on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.1966 | 0.0007 |
 * | 64 | 0.1966 | 0.0013 |
 * | 128 | 0.1966 | 0.0026 |
 * | 512 | 0.1966 | 0.0104 |
 * | 1024 | 0.1966 | 0.0208 |
 * | 4096 | 0.1966 | 0.0833 |
 * | 16384 | 0.2621 | 0.2500 |
 * | 65536 | 0.2621 | 1.0000 |
 * | 262144 | 0.4588 | 2.2857 |
 * | 1048576 | 1.2452 | 3.3684 |
 * | 4194304 | 1.4418 | 11.6364 |
 * | 16777216 | 4.2598 | 15.7538 |
 *
 * <svg id="bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for isamax">
 * <style>#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#fcfcfb}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#1a1a19}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#2c2c2a}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#383835}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .at{fill:#898781}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#c3c2b7}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#3987e5}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ln2{stroke:#008300}#bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,217.5 362.5,210.0 417.9,197.1 473.3,186.3 528.6,103.6 584.0,62.5"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="217.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="210.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="197.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="186.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="103.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="62.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/isamax
 */
