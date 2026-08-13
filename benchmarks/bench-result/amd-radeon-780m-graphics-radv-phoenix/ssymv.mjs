/**
 * Benchmark results for ssymv on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0381 |
 * | 64 | 0.0655 | 0.1387 |
 * | 128 | 0.0655 | 0.5273 |
 * | 256 | 0.0655 | 2.0547 |
 * | 512 | 0.0655 | 8.1094 |
 * | 1024 | 0.1311 | 16.1094 |
 * | 1280 | 0.1966 | 16.7578 |
 * | 2048 | 0.7209 | 11.6761 |
 * | 4096 | 3.8011 | 8.8427 |
 *
 * <svg id="bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#fcfcfb}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.6 133.1,218.6 208.3,214.7 283.4,199.5 358.6,138.9 433.7,58.9 457.9,52.4 508.9,103.2 584.0,131.6"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="199.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="138.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="58.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="52.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="103.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="131.6" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#fcfcfb}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300}#bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">4.00</text>
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
 * <polyline class="ln1" points="58.0,216.7 133.1,216.7 208.3,216.7 283.4,216.7 358.6,216.7 433.7,213.4 457.9,210.2 508.9,184.0 584.0,29.9"/>
 * <circle class="mk1" cx="58.0" cy="216.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="213.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="210.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="184.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="29.9" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/wgblas/ssymv.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/ssymv
 */
