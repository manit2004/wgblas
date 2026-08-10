/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 1.5375 | 0.0102 | 1.6000 | 96.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0108 | 6.0413 | 75.7% |
 * | 128 | 0.0237 | 11.0479 | 0.0133 | 19.6923 | 56.1% |
 * | 256 | 0.0795 | 13.1837 | 0.0436 | 24.0764 | 54.8% |
 * | 512 | 0.2988 | 14.0364 | 0.1986 | 21.1168 | 66.5% |
 * | 1024 | 2.0296 | 8.2663 | 0.9955 | 16.8530 | 49.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sgemm-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.7 163.2,183.4 268.4,131.6 373.6,114.5 478.8,107.7 584.0,153.9"/>
 * <polyline class="ln2" points="58.0,207.2 163.2,171.7 268.4,62.5 373.6,27.4 478.8,51.1 584.0,85.2"/>
 * <circle class="mk1" cx="58.0" cy="207.7" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="131.6" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.5" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="153.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="207.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="171.7" r="4"/>
 * <circle class="mk2" cx="268.4" cy="62.5" r="4"/>
 * <circle class="mk2" cx="373.6" cy="27.4" r="4"/>
 * <circle class="mk2" cx="478.8" cy="51.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.2" r="4"/>
 * <line class="ln1" x1="58" y1="252" x2="74" y2="252"/>
 * <circle class="mk1" cx="66" cy="252" r="4"/>
 * <text class="lt" x="80" y="256">wgblas</text>
 * <line class="ln2" x1="132" y1="252" x2="148" y2="252"/>
 * <circle class="mk2" cx="140" cy="252" r="4"/>
 * <text class="lt" x="154" y="256">cuBLAS</text>
 * </svg>
 *
 * <br>
 *
 * <svg id="bc-sgemm-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">2.50</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.1 163.2,218.9 268.4,218.1 373.6,213.6 478.8,196.1 584.0,57.6"/>
 * <polyline class="ln2" points="58.0,219.2 163.2,219.1 268.4,218.9 373.6,216.5 478.8,204.1 584.0,140.4"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.1" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.5" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/benchmark.sgemm.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemm
 */
