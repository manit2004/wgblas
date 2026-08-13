/**
 * Benchmark results for ssyr2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.6236 | 0.0041 | 1.0938 | 57.0% |
 * | 64 | 0.0072 | 2.3664 | 0.0041 | 4.1550 | 57.0% |
 * | 128 | 0.0075 | 8.9957 | 0.0042 | 15.8788 | 56.7% |
 * | 256 | 0.0082 | 32.3750 | 0.0051 | 52.4557 | 61.7% |
 * | 512 | 0.0109 | 96.7988 | 0.0084 | 126.0421 | 76.8% |
 * | 1024 | 0.0568 | 74.1015 | 0.0365 | 115.1608 | 64.3% |
 * | 1280 | 0.0922 | 71.2778 | 0.0730 | 89.9759 | 79.2% |
 * | 2048 | 0.2153 | 78.0288 | 0.1341 | 125.2818 | 62.3% |
 * | 4096 | 0.8073 | 83.1855 | 0.5161 | 130.1270 | 63.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssyr2-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,216.8 208.3,208.0 283.4,176.8 358.6,90.9 433.7,121.2 457.9,125.0 508.9,116.0 584.0,109.1"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,214.5 208.3,198.8 283.4,150.1 358.6,51.9 433.7,66.5 457.9,100.0 508.9,53.0 584.0,46.5"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="176.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="90.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="121.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="125.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="116.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="109.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="150.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="51.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="66.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="100.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="53.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="46.5" r="4"/>
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
 * <svg id="bc-ssyr2-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 133.1,218.6 208.3,218.5 283.4,218.4 358.6,217.8 433.7,208.6 457.9,201.6 508.9,176.9 584.0,58.5"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.0 358.6,218.3 433.7,212.7 457.9,205.4 508.9,193.2 584.0,116.8"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="176.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="212.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="193.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="116.8" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/ssyr2.js) — WebGPU benchmark script
 * - [ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/ssyr2.c) — CUDA / cuBLAS reference script
 *
 * ## Uplo sweep
 *
 * Unless noted otherwise, every result above uses `uplo = "lower"`. Real workgroups dispatch in increasing index order, so `uplo = "upper"` front-loads the heaviest rows first (worse — long-running heavy workgroups have nothing to overlap with) while `lower` back-loads them (better — light rows clear fast, the heavy tail gets full GPU to itself) — collapsed below by default, expand a `uplo` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = lower</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.6542 | 0.0041 | 1.0938 | 59.8% |
 * | 64 | 0.0069 | 2.4758 | 0.0042 | 4.1231 | 60.0% |
 * | 128 | 0.0073 | 9.1930 | 0.0042 | 15.8788 | 57.9% |
 * | 256 | 0.0084 | 31.5133 | 0.0050 | 52.6222 | 59.9% |
 * | 512 | 0.0121 | 87.0806 | 0.0084 | 125.8015 | 69.2% |
 * | 1024 | 0.0369 | 114.1111 | 0.0366 | 114.8589 | 99.3% |
 * | 1280 | 0.0543 | 121.0021 | 0.0731 | 89.8971 | 134.6% |
 * | 2048 | 0.1210 | 138.8302 | 0.1341 | 125.3267 | 110.8% |
 * | 4096 | 0.4444 | 151.1206 | 0.5161 | 130.1270 | 116.1% |
 *
 * <svg id="bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.5 208.3,210.8 283.4,188.5 358.6,132.9 433.7,105.9 457.9,99.0 508.9,81.2 584.0,68.9"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,215.9 208.3,204.1 283.4,167.4 358.6,94.2 433.7,105.1 457.9,130.1 508.9,94.7 584.0,89.9"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="210.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="188.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="132.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="105.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="99.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="81.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="204.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="167.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="94.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="105.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="130.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="94.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="89.9" r="4"/>
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
 * <svg id="bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uplolower-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,217.7 133.1,217.7 208.3,217.6 283.4,217.2 358.6,216.0 433.7,207.7 457.9,201.9 508.9,179.7 584.0,71.9"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,218.6 208.3,218.6 283.4,218.3 358.6,217.2 433.7,207.8 457.9,195.6 508.9,175.3 584.0,48.0"/>
 * <circle class="mk1" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="207.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="179.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="71.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="207.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="195.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="175.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5996 | 0.0041 | 1.0980 | 54.6% |
 * | 64 | 0.0076 | 2.2521 | 0.0041 | 4.1390 | 54.4% |
 * | 128 | 0.0081 | 8.2846 | 0.0042 | 16.0000 | 51.8% |
 * | 256 | 0.0085 | 31.0994 | 0.0049 | 53.8182 | 57.8% |
 * | 512 | 0.0123 | 85.8333 | 0.0087 | 121.6236 | 70.6% |
 * | 1024 | 0.0590 | 71.3078 | 0.0370 | 113.7163 | 62.7% |
 * | 1280 | 0.0958 | 68.5752 | 0.0712 | 92.2192 | 74.4% |
 * | 2048 | 0.2253 | 74.5765 | 0.1311 | 128.1562 | 58.2% |
 * | 4096 | 0.8459 | 79.3965 | 0.5018 | 133.8236 | 59.3% |
 *
 * <svg id="bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,217.0 208.3,209.0 283.4,178.5 358.6,105.6 433.7,124.9 457.9,128.6 508.9,120.6 584.0,114.1"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,214.5 208.3,198.7 283.4,148.2 358.6,57.8 433.7,68.4 457.9,97.0 508.9,49.1 584.0,41.6"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="178.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="105.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="124.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="128.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="120.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="114.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="148.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="57.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="68.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="97.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="49.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="41.6" r="4"/>
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
 * <svg id="bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-uploupper-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.3 358.6,217.5 433.7,208.2 457.9,200.8 508.9,174.9 584.0,50.8"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.0 358.6,218.3 433.7,212.6 457.9,205.8 508.9,193.8 584.0,119.6"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="200.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="174.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="50.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="212.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="193.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="119.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/uplo.ssyr2.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/uplo.ssyr2.c) — CUDA / cuBLAS uplo-sweep reference script
 *
 * ## Lda sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda` (no padding). Padding the row stride changes throughput here — the exact mechanism and shape of that effect is routine-specific (see TODO.md in the repo for the measured mechanism) — collapsed below by default, expand a `pad` value to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7179 | 0.0040 | 1.1200 | 64.1% |
 * | 64 | 0.0064 | 2.6935 | 0.0041 | 4.1875 | 64.3% |
 * | 128 | 0.0066 | 10.1256 | 0.0041 | 16.3750 | 61.8% |
 * | 256 | 0.0079 | 33.4869 | 0.0049 | 53.9935 | 62.0% |
 * | 512 | 0.0100 | 105.6410 | 0.0082 | 128.7500 | 82.1% |
 * | 1024 | 0.0341 | 123.2015 | 0.0357 | 117.7921 | 104.6% |
 * | 1280 | 0.0513 | 128.1398 | 0.0721 | 91.0736 | 140.7% |
 * | 2048 | 0.1165 | 144.1669 | 0.1322 | 127.1322 | 113.4% |
 * | 4096 | 0.4325 | 155.2801 | 0.5066 | 132.5641 | 117.1% |
 *
 * <svg id="bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.3 208.3,209.9 283.4,186.5 358.6,114.4 433.7,96.8 457.9,91.9 508.9,75.8 584.0,64.7"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,215.8 208.3,203.6 283.4,166.0 358.6,91.2 433.7,102.2 457.9,128.9 508.9,92.9 584.0,87.4"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="186.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="114.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="96.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="91.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="75.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="64.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="203.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="166.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="91.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="102.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="128.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="92.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="87.4" r="4"/>
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
 * <svg id="bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,217.9 133.1,217.9 208.3,217.8 283.4,217.4 358.6,216.7 433.7,208.6 457.9,202.9 508.9,181.2 584.0,75.8"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,218.6 208.3,218.6 283.4,218.4 358.6,217.3 433.7,208.1 457.9,196.0 508.9,175.9 584.0,51.1"/>
 * <circle class="mk1" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="181.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="75.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="196.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="175.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="51.1" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7179 | 0.0040 | 1.1290 | 63.6% |
 * | 64 | 0.0063 | 2.7071 | 0.0041 | 4.1875 | 64.6% |
 * | 128 | 0.0068 | 9.9336 | 0.0041 | 16.2481 | 61.1% |
 * | 256 | 0.0081 | 32.6299 | 0.0050 | 52.9585 | 61.6% |
 * | 512 | 0.0103 | 102.6791 | 0.0084 | 125.3232 | 81.9% |
 * | 1024 | 0.0555 | 75.7453 | 0.0448 | 93.8301 | 80.7% |
 * | 1280 | 0.0898 | 73.1184 | 0.0806 | 81.4765 | 89.7% |
 * | 2048 | 0.2150 | 78.1333 | 0.1555 | 108.0473 | 72.3% |
 * | 4096 | 0.8373 | 80.2036 | 0.7870 | 85.3333 | 94.0% |
 *
 * <svg id="bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,219.0 133.1,216.4 208.3,206.8 283.4,176.5 358.6,83.1 433.7,119.0 457.9,122.5 508.9,115.8 584.0,113.1"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,214.4 208.3,198.3 283.4,149.4 358.6,52.9 433.7,94.9 457.9,111.4 508.9,75.9 584.0,106.2"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="206.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="176.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="83.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="119.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="122.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="115.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="113.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="149.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="52.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="94.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="111.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="75.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="106.2" r="4"/>
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
 * <svg id="bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.7 208.3,218.6 283.4,218.4 358.6,217.9 433.7,208.9 457.9,202.0 508.9,177.0 584.0,52.5"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.0 358.6,218.3 433.7,211.0 457.9,203.9 508.9,188.9 584.0,62.6"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="52.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="211.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="203.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="188.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="62.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0062 | 0.7179 | 0.0041 | 1.0938 | 65.6% |
 * | 64 | 0.0063 | 2.7071 | 0.0041 | 4.1712 | 64.9% |
 * | 128 | 0.0072 | 9.2949 | 0.0042 | 16.1231 | 57.6% |
 * | 256 | 0.0082 | 32.3750 | 0.0052 | 50.8466 | 63.7% |
 * | 512 | 0.0102 | 103.0000 | 0.0084 | 126.2835 | 81.6% |
 * | 1024 | 0.0594 | 70.8276 | 0.0475 | 88.4928 | 80.0% |
 * | 1280 | 0.0963 | 68.2447 | 0.0763 | 86.1255 | 79.2% |
 * | 2048 | 0.2145 | 78.3198 | 0.1797 | 93.4929 | 83.8% |
 * | 4096 | 0.8446 | 79.5138 | 0.7629 | 88.0304 | 90.3% |
 *
 * <svg id="bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,219.0 133.1,216.4 208.3,207.6 283.4,176.8 358.6,82.7 433.7,125.6 457.9,129.0 508.9,115.6 584.0,114.0"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,214.4 208.3,198.5 283.4,152.2 358.6,51.6 433.7,102.0 457.9,105.2 508.9,95.3 584.0,102.6"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="207.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="176.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="82.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="125.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="129.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="115.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="114.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="152.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="51.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="102.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="105.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="95.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="102.6" r="4"/>
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
 * <svg id="bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.7 208.3,218.6 283.4,218.4 358.6,218.0 433.7,208.1 457.9,200.7 508.9,177.1 584.0,51.1"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.0 358.6,218.3 433.7,210.5 457.9,204.7 508.9,184.1 584.0,67.4"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="218.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="200.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="51.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="184.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="67.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2785 | 57.0% |
 * | 64 | 0.0061 | 2.7917 | 0.0038 | 4.5042 | 62.0% |
 * | 128 | 0.0066 | 10.1256 | 0.0038 | 17.4667 | 58.0% |
 * | 256 | 0.0077 | 34.2479 | 0.0041 | 64.7500 | 52.9% |
 * | 512 | 0.0096 | 109.8667 | 0.0067 | 156.9524 | 70.0% |
 * | 1024 | 0.0560 | 75.0534 | 0.0448 | 93.7967 | 80.0% |
 * | 1280 | 0.0886 | 74.1083 | 0.0695 | 94.5120 | 78.4% |
 * | 2048 | 0.2171 | 77.3848 | 0.1444 | 116.3172 | 66.5% |
 * | 4096 | 0.7887 | 85.1498 | 0.7446 | 90.1963 | 94.4% |
 *
 * <svg id="bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.9 283.4,185.8 358.6,110.1 433.7,144.9 457.9,145.9 508.9,142.6 584.0,134.9"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.5 208.3,202.5 283.4,155.2 358.6,63.0 433.7,126.2 457.9,125.5 508.9,103.7 584.0,129.8"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="110.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="144.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="145.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="142.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="134.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="202.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="155.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="63.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="126.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="125.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="103.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="129.8" r="4"/>
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
 * <svg id="bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.800</text>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.3 283.4,218.1 358.6,217.6 433.7,206.0 457.9,197.8 508.9,165.7 584.0,22.8"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,219.0 208.3,219.0 283.4,219.0 358.6,218.3 433.7,208.8 457.9,202.6 508.9,183.9 584.0,33.9"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="206.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="197.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="165.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="22.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="183.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0034 | 1.3084 | 55.7% |
 * | 64 | 0.0061 | 2.7917 | 0.0036 | 4.7857 | 58.3% |
 * | 128 | 0.0065 | 10.3251 | 0.0036 | 18.4670 | 55.9% |
 * | 256 | 0.0077 | 34.5333 | 0.0041 | 64.2481 | 53.7% |
 * | 512 | 0.0098 | 108.0656 | 0.0066 | 160.0000 | 67.5% |
 * | 1024 | 0.0343 | 122.5126 | 0.0392 | 107.3110 | 114.2% |
 * | 1280 | 0.0512 | 128.3000 | 0.0598 | 109.9224 | 116.7% |
 * | 2048 | 0.1154 | 145.6466 | 0.1414 | 118.8447 | 122.6% |
 * | 4096 | 0.4485 | 149.7458 | 0.6225 | 107.8878 | 138.8% |
 *
 * <svg id="bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.7 283.4,185.5 358.6,111.9 433.7,97.5 457.9,91.7 508.9,74.4 584.0,70.3"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.2 208.3,201.5 283.4,155.8 358.6,60.0 433.7,112.7 457.9,110.1 508.9,101.2 584.0,112.1"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="111.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="97.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="91.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="74.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="70.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="201.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="155.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="60.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="112.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="110.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="101.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="112.1" r="4"/>
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
 * <svg id="bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.800</text>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.1 358.6,217.6 433.7,211.4 457.9,207.2 508.9,191.2 584.0,107.9"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.1 208.3,219.1 283.4,219.0 358.6,218.3 433.7,210.2 457.9,205.1 508.9,184.7 584.0,64.4"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="191.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="107.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="184.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="64.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2903 | 56.5% |
 * | 64 | 0.0061 | 2.7917 | 0.0036 | 4.7434 | 58.9% |
 * | 128 | 0.0065 | 10.3251 | 0.0036 | 18.7982 | 54.9% |
 * | 256 | 0.0077 | 34.5333 | 0.0041 | 64.7500 | 53.3% |
 * | 512 | 0.0097 | 108.9587 | 0.0067 | 158.4615 | 68.8% |
 * | 1024 | 0.0587 | 71.6772 | 0.0455 | 92.4120 | 77.6% |
 * | 1280 | 0.0874 | 75.1941 | 0.0696 | 94.3382 | 79.7% |
 * | 2048 | 0.2160 | 77.7918 | 0.1658 | 101.3426 | 76.8% |
 * | 4096 | 0.8060 | 83.3226 | 0.8364 | 80.2987 | 103.8% |
 *
 * <svg id="bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.7 283.4,185.5 358.6,111.0 433.7,148.3 457.9,144.8 508.9,142.2 584.0,136.7"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.3 208.3,201.2 283.4,155.2 358.6,61.5 433.7,127.6 457.9,125.7 508.9,118.7 584.0,139.7"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="111.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="148.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="144.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="142.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="136.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="201.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="155.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="61.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="127.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="125.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="118.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="139.7" r="4"/>
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
 * <svg id="bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad48-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.8 208.3,218.7 283.4,218.5 358.6,218.1 433.7,208.3 457.9,202.5 508.9,176.8 584.0,58.8"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.3 283.4,219.2 358.6,218.7 433.7,210.9 457.9,206.1 508.9,186.8 584.0,52.7"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="218.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="176.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="206.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="186.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="52.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2727 | 57.3% |
 * | 64 | 0.0061 | 2.7917 | 0.0036 | 4.7644 | 58.6% |
 * | 128 | 0.0065 | 10.2745 | 0.0038 | 17.7627 | 57.8% |
 * | 256 | 0.0077 | 34.6054 | 0.0041 | 64.7500 | 53.4% |
 * | 512 | 0.0096 | 109.5017 | 0.0067 | 158.4615 | 69.1% |
 * | 1024 | 0.0348 | 120.7126 | 0.0412 | 102.1414 | 118.2% |
 * | 1280 | 0.0500 | 131.2532 | 0.0592 | 110.9622 | 118.3% |
 * | 2048 | 0.1198 | 140.2955 | 0.1498 | 112.1435 | 125.1% |
 * | 4096 | 0.4436 | 151.3877 | 0.5980 | 112.3014 | 134.8% |
 *
 * <svg id="bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">200</text>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.7 283.4,185.4 358.6,110.5 433.7,99.3 457.9,88.7 508.9,79.7 584.0,68.6"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.2 208.3,202.2 283.4,155.2 358.6,61.5 433.7,117.9 457.9,109.0 508.9,107.9 584.0,107.7"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="110.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="99.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="88.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="79.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="202.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="155.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="61.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="117.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="109.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="107.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="107.7" r="4"/>
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
 * <svg id="bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.0 133.1,218.0 208.3,217.8 283.4,217.4 358.6,216.8 433.7,208.4 457.9,203.3 508.9,180.1 584.0,72.1"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,218.8 208.3,218.7 283.4,218.6 358.6,217.8 433.7,206.3 457.9,200.3 508.9,170.1 584.0,20.7"/>
 * <circle class="mk1" cx="58.0" cy="218.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="203.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="180.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="72.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="170.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="20.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7292 | 0.0035 | 1.2670 | 57.6% |
 * | 64 | 0.0063 | 2.7347 | 0.0037 | 4.6207 | 59.2% |
 * | 128 | 0.0065 | 10.3251 | 0.0037 | 18.0690 | 57.1% |
 * | 256 | 0.0075 | 35.2681 | 0.0041 | 64.7500 | 54.5% |
 * | 512 | 0.0099 | 106.3226 | 0.0071 | 147.8027 | 71.9% |
 * | 1024 | 0.0347 | 121.3813 | 0.0420 | 100.2716 | 121.1% |
 * | 1280 | 0.0512 | 128.3000 | 0.0631 | 104.1238 | 123.2% |
 * | 2048 | 0.1206 | 139.3091 | 0.1837 | 91.4572 | 152.3% |
 * | 4096 | 0.4859 | 138.2080 | 0.6361 | 105.5731 | 130.9% |
 *
 * <svg id="bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
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
 * <polyline class="ln1" points="58.0,219.0 133.1,216.4 208.3,206.2 283.4,173.0 358.6,78.2 433.7,58.2 457.9,48.9 508.9,34.3 584.0,35.7"/>
 * <polyline class="ln2" points="58.0,218.3 133.1,213.8 208.3,195.9 283.4,133.7 358.6,22.9 433.7,86.3 457.9,81.2 508.9,98.1 584.0,79.2"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="206.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="173.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="78.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="58.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="48.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="34.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="35.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="195.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="133.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="22.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="86.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="81.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="98.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="79.2" r="4"/>
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
 * <svg id="bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr2-pad128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.800</text>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.4 208.3,218.4 283.4,218.1 358.6,217.5 433.7,211.3 457.9,207.2 508.9,189.8 584.0,98.5"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,219.1 208.3,219.1 283.4,219.0 358.6,218.2 433.7,209.5 457.9,204.2 508.9,174.1 584.0,61.0"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="189.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="98.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="209.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="174.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="61.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/wgblas/lda.ssyr2.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr2/cuda/lda.ssyr2.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr2
 */
