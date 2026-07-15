/**
 * Benchmark results for srot on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0000 | — |
 * | 64 | 0.0655 | 0.0156 |
 * | 128 | 0.0655 | 0.0313 |
 * | 512 | 0.0655 | 0.1250 |
 * | 1024 | 0.0655 | 0.2500 |
 * | 4096 | 0.0655 | 1.0000 |
 * | 16384 | 0.0655 | 4.0000 |
 * | 65536 | 0.1311 | 8.0000 |
 * | 262144 | 0.3277 | 12.8000 |
 * | 1048576 | 1.7039 | 9.8462 |
 * | 4194304 | 3.3423 | 20.0784 |
 * | 16777216 | 14.6801 | 18.2857 |
 *
 * <svg id="bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for srot">
 * <style>#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#fcfcfb}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#1a1a19}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#2c2c2a}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#383835}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .at{fill:#898781}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#c3c2b7}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#3987e5}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ln2{stroke:#008300}#bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">64</text>
 * <text class="at" x="87.2" y="236" text-anchor="middle">128</text>
 * <text class="at" x="145.7" y="236" text-anchor="middle">512</text>
 * <text class="at" x="174.9" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="291.8" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="350.2" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="408.7" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="467.1" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="525.6" y="236" text-anchor="middle">4.2M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">17M</text>
 * <polyline class="ln1" points="58.0,219.9 87.2,219.8 145.7,219.0 174.9,218.0 233.3,212.0 291.8,188.0 350.2,156.0 408.7,117.6 467.1,141.2 525.6,59.4 584.0,73.7"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="87.2" cy="219.8" r="4"/>
 * <circle class="mk1" cx="145.7" cy="219.0" r="4"/>
 * <circle class="mk1" cx="174.9" cy="218.0" r="4"/>
 * <circle class="mk1" cx="233.3" cy="212.0" r="4"/>
 * <circle class="mk1" cx="291.8" cy="188.0" r="4"/>
 * <circle class="mk1" cx="350.2" cy="156.0" r="4"/>
 * <circle class="mk1" cx="408.7" cy="117.6" r="4"/>
 * <circle class="mk1" cx="467.1" cy="141.2" r="4"/>
 * <circle class="mk1" cx="525.6" cy="59.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="73.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/benchmark.srot.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/srot
 */
