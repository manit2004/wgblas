/**
 * Benchmark results for sdot on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
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
 * | 65536 | 0.0655 | 8.0000 |
 * | 262144 | 0.0655 | 32.0000 |
 * | 1048576 | 0.1311 | 64.0000 |
 * | 4194304 | 0.4588 | 73.1429 |
 * | 16777216 | 1.9661 | 68.2667 |
 *
 * <svg id="bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#fcfcfb}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.7 251.8,218.7 307.2,214.7 362.5,198.7 417.9,134.7 473.3,49.3 528.6,25.0 584.0,38.0"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="198.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="134.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="49.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="25.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="38.0" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#fcfcfb}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300}#bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,213.4 85.7,213.4 113.4,213.4 168.7,213.4 196.4,213.4 251.8,213.4 307.2,213.4 362.5,213.4 417.9,213.4 473.3,206.9 528.6,174.1 584.0,23.4"/>
 * <circle class="mk1" cx="58.0" cy="213.4" r="4"/>
 * <circle class="mk1" cx="85.7" cy="213.4" r="4"/>
 * <circle class="mk1" cx="113.4" cy="213.4" r="4"/>
 * <circle class="mk1" cx="168.7" cy="213.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="213.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="213.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="206.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="174.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/benchmark.sdot.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/sdot
 */
