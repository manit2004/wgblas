/**
 * Benchmark results for sgemv on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0684 |
 * | 64 | 0.0655 | 0.2617 |
 * | 128 | 0.0655 | 1.0234 |
 * | 256 | 0.0655 | 4.0469 |
 * | 512 | 0.0655 | 16.0938 |
 * | 1024 | 0.0655 | 64.1875 |
 * | 1280 | 0.0655 | 100.2344 |
 * | 2048 | 0.2621 | 64.0938 |
 * | 4096 | 0.9830 | 68.3167 |
 *
 * <svg id="bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#fcfcfb}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 133.1,219.6 208.3,218.4 283.4,213.5 358.6,194.2 433.7,117.3 457.9,59.6 508.9,117.4 584.0,110.7"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="213.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="194.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="117.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="59.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="117.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="110.7" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#fcfcfb}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300}#bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,206.9 133.1,206.9 208.3,206.9 283.4,206.9 358.6,206.9 433.7,206.9 457.9,206.9 508.9,167.6 584.0,23.4"/>
 * <circle class="mk1" cx="58.0" cy="206.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="206.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="206.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="206.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="206.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="206.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="206.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="167.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/benchmark.sgemv.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/sgemv
 */
