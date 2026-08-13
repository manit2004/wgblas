/**
 * Benchmark results for srot on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0078 |
 * | 64 | 0.0655 | 0.0156 |
 * | 128 | 0.0655 | 0.0313 |
 * | 512 | 0.0655 | 0.1250 |
 * | 1024 | 0.0655 | 0.2500 |
 * | 4096 | 0.0655 | 1.0000 |
 * | 16384 | 0.0655 | 4.0000 |
 * | 65536 | 0.0655 | 16.0000 |
 * | 262144 | 0.0655 | 64.0000 |
 * | 1048576 | 0.5243 | 32.0000 |
 * | 4194304 | 1.3107 | 51.2000 |
 * | 16777216 | 5.1118 | 52.5128 |
 *
 * <svg id="bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#fcfcfb}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.7 196.4,219.3 251.8,217.3 307.2,209.3 362.5,177.3 417.9,49.3 473.3,134.7 528.6,83.5 584.0,80.0"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="217.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="209.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="177.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="49.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="134.7" r="4"/>
 * <circle class="mk1" cx="528.6" cy="83.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="80.0" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#fcfcfb}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300}#bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">4.00</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">5.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">6.00</text>
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
 * <polyline class="ln1" points="58.0,217.8 85.7,217.8 113.4,217.8 168.7,217.8 196.4,217.8 251.8,217.8 307.2,217.8 362.5,217.8 417.9,217.8 473.3,202.5 528.6,176.3 584.0,49.6"/>
 * <circle class="mk1" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="217.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="217.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="217.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="217.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="217.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="217.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="202.5" r="4"/>
 * <circle class="mk1" cx="528.6" cy="176.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/srot.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/srot
 */
