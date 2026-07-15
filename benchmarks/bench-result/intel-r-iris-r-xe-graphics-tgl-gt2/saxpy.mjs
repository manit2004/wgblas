/**
 * Benchmark results for saxpy on Intel R Iris R Xe Graphics Tgl Gt2.
 *
 * ## Intel R Iris R Xe Graphics Tgl Gt2
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0059 |
 * | 64 | 0.0655 | 0.0117 |
 * | 128 | 0.0655 | 0.0234 |
 * | 512 | 0.0655 | 0.0938 |
 * | 1024 | 0.0655 | 0.1875 |
 * | 4096 | 0.0655 | 0.7500 |
 * | 16384 | 0.0655 | 3.0000 |
 * | 65536 | 0.1311 | 6.0000 |
 * | 262144 | 0.3932 | 8.0000 |
 * | 1048576 | 1.3763 | 9.1429 |
 * | 4194304 | 2.4576 | 20.4800 |
 * | 16777216 | 10.4202 | 19.3208 |
 *
 * <svg id="bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for saxpy">
 * <style>#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#fcfcfb}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#1a1a19}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#2c2c2a}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#383835}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .at{fill:#898781}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#c3c2b7}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#3987e5}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ln2{stroke:#008300}#bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-intel_r_iris_r_xe_graphics_tgl_gt2 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.8 168.7,219.2 196.4,218.5 251.8,214.0 307.2,196.0 362.5,172.0 417.9,156.0 473.3,146.9 528.6,56.2 584.0,65.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.2" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.5" r="4"/>
 * <circle class="mk1" cx="251.8" cy="214.0" r="4"/>
 * <circle class="mk1" cx="307.2" cy="196.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="172.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="156.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="146.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="56.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="65.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/benchmark.saxpy.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/saxpy
 */
