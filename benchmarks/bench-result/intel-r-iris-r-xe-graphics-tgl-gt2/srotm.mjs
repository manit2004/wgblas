/**
 * Benchmark results for srotm on Intel R Iris R Xe Graphics Tgl Gt2.
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
 * | 65536 | 0.1966 | 5.3333 |
 * | 262144 | 0.5898 | 7.1111 |
 * | 1048576 | 2.4248 | 6.9189 |
 * | 4194304 | 3.4079 | 19.6923 |
 * | 16777216 | 14.7456 | 18.2044 |
 *
 * <svg id="bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#fcfcfb}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#1a1a19}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#2c2c2a}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#383835}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .at{fill:#898781}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#c3c2b7}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#3987e5}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln2{stroke:#008300}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.8 87.2,219.7 145.7,218.8 174.9,217.5 233.3,210.0 291.8,180.0 350.2,166.7 408.7,148.9 467.1,150.8 525.6,23.1 584.0,38.0"/>
 * <circle class="mk1" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk1" cx="87.2" cy="219.7" r="4"/>
 * <circle class="mk1" cx="145.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="174.9" cy="217.5" r="4"/>
 * <circle class="mk1" cx="233.3" cy="210.0" r="4"/>
 * <circle class="mk1" cx="291.8" cy="180.0" r="4"/>
 * <circle class="mk1" cx="350.2" cy="166.7" r="4"/>
 * <circle class="mk1" cx="408.7" cy="148.9" r="4"/>
 * <circle class="mk1" cx="467.1" cy="150.8" r="4"/>
 * <circle class="mk1" cx="525.6" cy="23.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="38.0" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#fcfcfb}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#1a1a19}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#2c2c2a}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#383835}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .at{fill:#898781}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#c3c2b7}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#3987e5}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln2{stroke:#008300}#bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-intel_r_iris_r_xe_graphics_tgl_gt2-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">5.00</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">10.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">15.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
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
 * <polyline class="ln1" points="58.0,219.1 87.2,219.1 145.7,219.1 174.9,219.1 233.3,219.1 291.8,219.1 350.2,217.4 408.7,212.1 467.1,187.7 525.6,174.6 584.0,23.4"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="87.2" cy="219.1" r="4"/>
 * <circle class="mk1" cx="145.7" cy="219.1" r="4"/>
 * <circle class="mk1" cx="174.9" cy="219.1" r="4"/>
 * <circle class="mk1" cx="233.3" cy="219.1" r="4"/>
 * <circle class="mk1" cx="291.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="350.2" cy="217.4" r="4"/>
 * <circle class="mk1" cx="408.7" cy="212.1" r="4"/>
 * <circle class="mk1" cx="467.1" cy="187.7" r="4"/>
 * <circle class="mk1" cx="525.6" cy="174.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/srotm.js) — WebGPU benchmark script
 *
 * @module benchmarks/intel-r-iris-r-xe-graphics-tgl-gt2/srotm
 */
