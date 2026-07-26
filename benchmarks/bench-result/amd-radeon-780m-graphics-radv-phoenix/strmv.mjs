/**
 * Benchmark results for strmv on Amd Radeon 780M Graphics Radv Phoenix.
 *
 * ## Amd Radeon 780M Graphics Radv Phoenix
 *
 * | n | compute ms | GB/s |
 * |---|------------|------|
 * | 32 | 0.0655 | 0.0361 |
 * | 64 | 0.0655 | 0.1348 |
 * | 128 | 0.0655 | 0.5195 |
 * | 256 | 0.0655 | 2.0391 |
 * | 512 | 0.0655 | 8.0781 |
 * | 1024 | 0.0655 | 32.1563 |
 * | 1280 | 0.0655 | 50.1953 |
 * | 2048 | 0.1311 | 64.1563 |
 * | 4096 | 0.5898 | 56.9583 |
 *
 * <svg id="bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#fcfcfb}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .at{fill:#898781}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln2{stroke:#008300}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.9 133.1,219.6 208.3,218.6 283.4,214.6 358.6,198.5 433.7,134.2 457.9,86.1 508.9,48.9 584.0,68.1"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="198.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="134.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="86.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="48.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.1" r="4"/>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#fcfcfb}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .at{fill:#898781}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ln2{stroke:#008300}#bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-amd_radeon_780m_graphics_radv_phoenix-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.600</text>
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
 * <polyline class="ln1" points="58.0,198.2 133.1,198.2 208.3,198.2 283.4,198.2 358.6,198.2 433.7,198.2 457.9,198.2 508.9,176.3 584.0,23.4"/>
 * <circle class="mk1" cx="58.0" cy="198.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="198.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="198.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="198.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="198.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="198.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="198.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="176.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/benchmark.strmv.js) — WebGPU benchmark script
 *
 * @module benchmarks/amd-radeon-780m-graphics-radv-phoenix/strmv
 */
