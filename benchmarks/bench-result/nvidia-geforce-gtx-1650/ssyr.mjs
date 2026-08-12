/**
 * Benchmark results for ssyr on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5751 | 0.0041 | 1.0625 | 54.1% |
 * | 64 | 0.0076 | 2.2185 | 0.0041 | 4.1250 | 53.8% |
 * | 128 | 0.0080 | 8.3702 | 0.0041 | 16.2500 | 51.5% |
 * | 256 | 0.0086 | 30.6914 | 0.0044 | 60.7059 | 50.6% |
 * | 512 | 0.0118 | 89.5129 | 0.0077 | 135.9339 | 65.9% |
 * | 1024 | 0.0572 | 73.4086 | 0.0342 | 122.7364 | 59.8% |
 * | 1280 | 0.0938 | 69.9710 | 0.0715 | 91.8174 | 76.2% |
 * | 2048 | 0.2246 | 74.7738 | 0.1247 | 134.6504 | 55.5% |
 * | 4096 | 0.8136 | 82.5241 | 0.4865 | 138.0016 | 59.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssyr-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,217.0 208.3,208.8 283.4,179.1 358.6,100.6 433.7,122.1 457.9,126.7 508.9,120.3 584.0,110.0"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,214.5 208.3,198.3 283.4,139.1 358.6,38.8 433.7,56.4 457.9,97.6 508.9,40.5 584.0,36.0"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="179.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="100.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="122.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="126.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="120.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="110.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="139.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="38.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="56.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="97.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="40.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.0" r="4"/>
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
 * <svg id="bc-ssyr-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.3 358.6,217.6 433.7,208.6 457.9,201.2 508.9,175.1 584.0,57.3"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.1 358.6,218.5 433.7,213.2 457.9,205.7 508.9,195.1 584.0,122.7"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="213.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="195.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="122.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/ssyr.js) — WebGPU benchmark script
 * - [ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/ssyr.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0078 | 0.5608 | 0.0041 | 1.0667 | 52.6% |
 * | 64 | 0.0076 | 2.2185 | 0.0041 | 4.1250 | 53.8% |
 * | 128 | 0.0081 | 8.2540 | 0.0041 | 16.2500 | 50.8% |
 * | 256 | 0.0092 | 28.8671 | 0.0044 | 59.8261 | 48.3% |
 * | 512 | 0.0119 | 88.6685 | 0.0079 | 133.1822 | 66.6% |
 * | 1024 | 0.0365 | 115.1495 | 0.0345 | 121.9387 | 94.4% |
 * | 1280 | 0.0540 | 121.4446 | 0.0716 | 91.7147 | 132.4% |
 * | 2048 | 0.1208 | 138.9831 | 0.1251 | 134.2886 | 103.5% |
 * | 4096 | 0.4443 | 151.1164 | 0.4867 | 137.9517 | 109.5% |
 *
 * <svg id="bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.4 133.1,217.8 208.3,211.7 283.4,191.1 358.6,131.3 433.7,104.9 457.9,98.6 508.9,81.0 584.0,68.9"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,215.9 208.3,203.8 283.4,160.2 358.6,86.8 433.7,98.1 457.9,128.3 508.9,85.7 584.0,82.0"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="191.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="131.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="104.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="98.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="81.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="203.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="160.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="86.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="98.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="128.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="85.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="82.0" r="4"/>
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
 * <svg id="bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-uplolower-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.500</text>
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
 * <polyline class="ln1" points="58.0,216.9 133.1,217.0 208.3,216.8 283.4,216.3 358.6,215.3 433.7,205.4 457.9,198.4 508.9,171.7 584.0,42.3"/>
 * <polyline class="ln2" points="58.0,218.4 133.1,218.4 208.3,218.4 283.4,218.2 358.6,216.8 433.7,206.2 457.9,191.4 508.9,170.0 584.0,25.3"/>
 * <circle class="mk1" cx="58.0" cy="216.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="215.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="205.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="198.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="171.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="42.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="191.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="170.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="25.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — uplo = upper</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0075 | 0.5824 | 0.0040 | 1.0924 | 53.3% |
 * | 64 | 0.0077 | 2.1863 | 0.0041 | 4.1089 | 53.2% |
 * | 128 | 0.0078 | 8.4898 | 0.0045 | 14.6479 | 58.0% |
 * | 256 | 0.0084 | 31.3916 | 0.0044 | 60.7059 | 51.7% |
 * | 512 | 0.0120 | 87.6059 | 0.0079 | 133.1822 | 65.8% |
 * | 1024 | 0.0558 | 75.3676 | 0.0350 | 119.9342 | 62.8% |
 * | 1280 | 0.0922 | 71.2222 | 0.0701 | 93.6194 | 76.1% |
 * | 2048 | 0.2245 | 74.8165 | 0.1199 | 140.0587 | 53.4% |
 * | 4096 | 0.8049 | 83.4198 | 0.4669 | 143.7944 | 58.0% |
 *
 * <svg id="bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,217.1 208.3,208.7 283.4,178.1 358.6,103.2 433.7,119.5 457.9,125.0 508.9,120.2 584.0,108.8"/>
 * <polyline class="ln2" points="58.0,218.5 133.1,214.5 208.3,200.5 283.4,139.1 358.6,42.4 433.7,60.1 457.9,95.2 508.9,33.3 584.0,28.3"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="178.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="103.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="119.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="125.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="120.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="108.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="200.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="139.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="42.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="60.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="95.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="33.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="28.3" r="4"/>
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
 * <svg id="bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-uploupper-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.3 358.6,217.6 433.7,208.8 457.9,201.6 508.9,175.1 584.0,59.0"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.1 283.4,219.1 358.6,218.4 433.7,213.0 457.9,206.0 508.9,196.0 584.0,126.6"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="59.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="213.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="206.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="196.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="126.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [uplo.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/uplo.ssyr.js) — WebGPU uplo-sweep benchmark script
 * - [uplo.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/uplo.ssyr.c) — CUDA / cuBLAS uplo-sweep reference script
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
 * | 32 | 0.0075 | 0.5787 | 0.0041 | 1.0709 | 54.0% |
 * | 64 | 0.0078 | 2.1728 | 0.0041 | 4.1250 | 52.7% |
 * | 128 | 0.0080 | 8.2704 | 0.0041 | 16.2500 | 50.9% |
 * | 256 | 0.0090 | 29.3808 | 0.0044 | 60.2628 | 48.8% |
 * | 512 | 0.0119 | 88.7881 | 0.0076 | 137.9287 | 64.4% |
 * | 1024 | 0.0367 | 114.4969 | 0.0343 | 122.3933 | 93.5% |
 * | 1280 | 0.0538 | 122.0226 | 0.0716 | 91.6328 | 133.2% |
 * | 2048 | 0.1208 | 138.9831 | 0.1249 | 134.4435 | 103.4% |
 * | 4096 | 0.4428 | 151.6187 | 0.4862 | 138.0879 | 109.8% |
 *
 * <svg id="bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.4 133.1,217.8 208.3,211.7 283.4,190.6 358.6,131.2 433.7,105.5 457.9,98.0 508.9,81.0 584.0,68.4"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,215.9 208.3,203.8 283.4,159.7 358.6,82.1 433.7,97.6 457.9,128.4 508.9,85.6 584.0,81.9"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="190.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="131.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="105.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="98.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="81.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="203.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="159.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="82.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="97.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="128.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="85.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="81.9" r="4"/>
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
 * <svg id="bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.500</text>
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
 * <polyline class="ln1" points="58.0,217.0 133.1,216.9 208.3,216.8 283.4,216.4 358.6,215.3 433.7,205.3 457.9,198.5 508.9,171.7 584.0,42.9"/>
 * <polyline class="ln2" points="58.0,218.4 133.1,218.4 208.3,218.4 283.4,218.2 358.6,217.0 433.7,206.3 457.9,191.4 508.9,170.0 584.0,25.5"/>
 * <circle class="mk1" cx="58.0" cy="217.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="215.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="205.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="198.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="171.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="42.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="191.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="170.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="25.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.5726 | 0.0041 | 1.0709 | 53.5% |
 * | 64 | 0.0076 | 2.2138 | 0.0041 | 4.1250 | 53.7% |
 * | 128 | 0.0082 | 8.1250 | 0.0041 | 16.2500 | 50.0% |
 * | 256 | 0.0091 | 28.9177 | 0.0048 | 55.2241 | 52.4% |
 * | 512 | 0.0123 | 85.6667 | 0.0082 | 128.5000 | 66.7% |
 * | 1024 | 0.0594 | 70.7586 | 0.0432 | 97.1720 | 72.8% |
 * | 1280 | 0.0967 | 67.8644 | 0.0800 | 82.0973 | 82.7% |
 * | 2048 | 0.2260 | 74.3080 | 0.1516 | 110.7757 | 67.1% |
 * | 4096 | 0.8512 | 78.8832 | 0.7779 | 86.3127 | 91.4% |
 *
 * <svg id="bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,217.0 208.3,209.2 283.4,181.4 358.6,105.8 433.7,125.7 457.9,129.5 508.9,120.9 584.0,114.8"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,214.5 208.3,198.3 283.4,146.4 358.6,48.7 433.7,90.4 457.9,110.5 508.9,72.3 584.0,104.9"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="181.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="105.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="125.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="129.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="120.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="114.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="146.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="48.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="90.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="110.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="72.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="104.9" r="4"/>
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
 * <svg id="bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.2 358.6,217.5 433.7,208.1 457.9,200.7 508.9,174.8 584.0,49.8"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.0 358.6,218.4 433.7,211.4 457.9,204.0 508.9,189.7 584.0,64.4"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="200.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="174.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="189.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="64.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0073 | 0.5939 | 0.0040 | 1.0794 | 55.0% |
 * | 64 | 0.0072 | 2.3363 | 0.0041 | 4.1575 | 56.2% |
 * | 128 | 0.0077 | 8.5950 | 0.0041 | 16.2500 | 52.9% |
 * | 256 | 0.0086 | 30.8060 | 0.0045 | 58.9714 | 52.2% |
 * | 512 | 0.0113 | 92.7955 | 0.0076 | 137.6402 | 67.4% |
 * | 1024 | 0.0593 | 70.8159 | 0.0470 | 89.4605 | 79.2% |
 * | 1280 | 0.0942 | 69.6857 | 0.0746 | 87.9400 | 79.2% |
 * | 2048 | 0.2171 | 77.3414 | 0.1787 | 93.9828 | 82.3% |
 * | 4096 | 0.8072 | 83.1751 | 0.7619 | 88.1290 | 94.4% |
 *
 * <svg id="bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 133.1,216.9 208.3,208.5 283.4,178.9 358.6,96.3 433.7,125.6 457.9,127.1 508.9,116.9 584.0,109.1"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,214.5 208.3,198.3 283.4,141.4 358.6,36.5 433.7,100.7 457.9,102.7 508.9,94.7 584.0,102.5"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="178.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="96.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="125.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="127.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="116.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="109.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="141.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="36.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="100.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="102.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="94.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="102.5" r="4"/>
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
 * <svg id="bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.6 208.3,218.5 283.4,218.3 358.6,217.7 433.7,208.1 457.9,201.2 508.9,176.6 584.0,58.6"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,219.2 208.3,219.2 283.4,219.1 358.6,218.5 433.7,210.6 457.9,205.1 508.9,184.3 584.0,67.6"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="176.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="184.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="67.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.6182 | 0.0035 | 1.2593 | 49.1% |
 * | 64 | 0.0062 | 2.7216 | 0.0035 | 4.8664 | 55.9% |
 * | 128 | 0.0067 | 10.0000 | 0.0035 | 19.0826 | 52.4% |
 * | 256 | 0.0077 | 34.4000 | 0.0040 | 66.5807 | 51.7% |
 * | 512 | 0.0100 | 105.7749 | 0.0061 | 172.2304 | 61.4% |
 * | 1024 | 0.0554 | 75.8683 | 0.0444 | 94.5486 | 80.2% |
 * | 1280 | 0.0860 | 76.3095 | 0.0687 | 95.5602 | 79.9% |
 * | 2048 | 0.2086 | 80.4970 | 0.1409 | 119.1509 | 67.6% |
 * | 4096 | 0.7577 | 88.6129 | 0.7432 | 90.3471 | 98.1% |
 *
 * <svg id="bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.4 133.1,217.3 208.3,210.0 283.4,185.6 358.6,114.2 433.7,144.1 457.9,143.7 508.9,139.5 584.0,131.4"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.1 208.3,200.9 283.4,153.4 358.6,47.8 433.7,125.5 457.9,124.4 508.9,100.8 584.0,129.7"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="210.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="114.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="144.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="143.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="139.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="131.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="200.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="153.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="47.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="125.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="124.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="100.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="129.7" r="4"/>
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
 * <svg id="bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.2 133.1,218.4 208.3,218.3 283.4,218.1 358.6,217.5 433.7,206.2 457.9,198.5 508.9,167.8 584.0,30.6"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,219.1 208.3,219.1 283.4,219.0 358.6,218.5 433.7,208.9 457.9,202.8 508.9,184.8 584.0,34.2"/>
 * <circle class="mk1" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="206.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="198.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="167.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="208.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="184.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="34.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0036 | 1.2197 | 58.1% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8440 | 56.8% |
 * | 128 | 0.0065 | 10.2970 | 0.0037 | 17.7778 | 57.9% |
 * | 256 | 0.0076 | 34.8354 | 0.0039 | 67.1219 | 51.9% |
 * | 512 | 0.0096 | 110.0201 | 0.0061 | 172.6824 | 63.7% |
 * | 1024 | 0.0343 | 122.6791 | 0.0384 | 109.5770 | 112.0% |
 * | 1280 | 0.0512 | 128.2000 | 0.0580 | 113.1073 | 113.3% |
 * | 2048 | 0.1151 | 145.8588 | 0.1374 | 122.1886 | 119.4% |
 * | 4096 | 0.4480 | 149.8590 | 0.6183 | 108.5900 | 138.0% |
 *
 * <svg id="bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.7 283.4,185.2 358.6,110.0 433.7,97.3 457.9,91.8 508.9,74.1 584.0,70.1"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,215.2 208.3,202.2 283.4,152.9 358.6,47.3 433.7,110.4 457.9,106.9 508.9,97.8 584.0,111.4"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="110.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="97.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="91.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="74.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="70.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="202.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="152.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="47.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="110.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="106.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="97.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="111.4" r="4"/>
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
 * <svg id="bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.1 358.6,217.6 433.7,211.4 457.9,207.2 508.9,191.2 584.0,108.0"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,219.1 208.3,219.1 283.4,219.0 358.6,218.5 433.7,210.4 457.9,205.5 508.9,185.7 584.0,65.4"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="191.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="108.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="185.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="65.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 48</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2477 | 56.8% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8889 | 56.2% |
 * | 128 | 0.0065 | 10.1961 | 0.0035 | 18.8235 | 54.2% |
 * | 256 | 0.0076 | 34.9091 | 0.0039 | 68.2314 | 51.2% |
 * | 512 | 0.0097 | 108.5677 | 0.0061 | 171.3333 | 63.4% |
 * | 1024 | 0.0556 | 75.6498 | 0.0451 | 93.2727 | 81.1% |
 * | 1280 | 0.0853 | 76.9248 | 0.0690 | 95.0950 | 80.9% |
 * | 2048 | 0.2126 | 78.9945 | 0.1636 | 102.6504 | 77.0% |
 * | 4096 | 0.7858 | 85.4480 | 0.8350 | 80.4099 | 106.3% |
 *
 * <svg id="bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.8 283.4,185.1 358.6,111.4 433.7,144.4 457.9,143.1 508.9,141.0 584.0,134.6"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,215.1 208.3,201.2 283.4,151.8 358.6,48.7 433.7,126.7 457.9,124.9 508.9,117.3 584.0,139.6"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="111.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="144.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="143.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="141.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="134.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="201.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="151.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="48.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="126.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="124.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="117.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="139.6" r="4"/>
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
 * <svg id="bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad48-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 133.1,218.8 208.3,218.7 283.4,218.5 358.6,218.1 433.7,208.9 457.9,202.9 508.9,177.5 584.0,62.8"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,219.3 208.3,219.3 283.4,219.2 358.6,218.8 433.7,211.0 457.9,206.2 508.9,187.3 584.0,53.0"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="218.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="202.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="177.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="62.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="211.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="206.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="187.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="53.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0034 | 1.2651 | 56.0% |
 * | 64 | 0.0061 | 2.7500 | 0.0035 | 4.8889 | 56.2% |
 * | 128 | 0.0065 | 10.2970 | 0.0035 | 19.1705 | 53.7% |
 * | 256 | 0.0076 | 34.7621 | 0.0038 | 69.3782 | 50.1% |
 * | 512 | 0.0096 | 109.2890 | 0.0061 | 171.3333 | 63.8% |
 * | 1024 | 0.0348 | 120.7059 | 0.0406 | 103.5302 | 116.6% |
 * | 1280 | 0.0492 | 133.3680 | 0.0573 | 114.5922 | 116.4% |
 * | 2048 | 0.1192 | 140.8670 | 0.1469 | 114.3480 | 123.2% |
 * | 4096 | 0.4432 | 151.4983 | 0.5932 | 113.1855 | 133.8% |
 *
 * <svg id="bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.7 283.4,185.2 358.6,110.7 433.7,99.3 457.9,86.6 508.9,79.1 584.0,68.5"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,215.1 208.3,200.8 283.4,150.6 358.6,48.7 433.7,116.5 457.9,105.4 508.9,105.7 584.0,106.8"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="110.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="99.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="86.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="79.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="68.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="200.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="150.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="48.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="116.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="105.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="105.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="106.8" r="4"/>
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
 * <svg id="bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.0 133.1,218.0 208.3,217.8 283.4,217.5 358.6,216.8 433.7,208.4 457.9,203.6 508.9,180.3 584.0,72.3"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,218.8 208.3,218.8 283.4,218.7 358.6,218.0 433.7,206.5 457.9,200.9 508.9,171.0 584.0,22.3"/>
 * <circle class="mk1" cx="58.0" cy="218.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="217.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="208.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="203.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="180.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="72.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="171.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="22.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — pad = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.7083 | 0.0035 | 1.2364 | 57.3% |
 * | 64 | 0.0061 | 2.7500 | 0.0036 | 4.7354 | 58.1% |
 * | 128 | 0.0064 | 10.3226 | 0.0036 | 18.6547 | 55.3% |
 * | 256 | 0.0077 | 34.2573 | 0.0038 | 69.9661 | 49.0% |
 * | 512 | 0.0097 | 108.2105 | 0.0061 | 171.3333 | 63.2% |
 * | 1024 | 0.0343 | 122.6218 | 0.0410 | 102.4399 | 119.7% |
 * | 1280 | 0.0512 | 128.2000 | 0.0615 | 106.6667 | 120.2% |
 * | 2048 | 0.1193 | 140.7537 | 0.1817 | 92.4188 | 152.3% |
 * | 4096 | 0.4855 | 138.2835 | 0.6323 | 106.1884 | 130.2% |
 *
 * <svg id="bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 133.1,217.2 208.3,209.7 283.4,185.7 358.6,111.8 433.7,97.4 457.9,91.8 508.9,79.2 584.0,81.7"/>
 * <polyline class="ln2" points="58.0,218.8 133.1,215.3 208.3,201.3 283.4,150.0 358.6,48.7 433.7,117.6 457.9,113.3 508.9,127.6 584.0,113.8"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="185.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="111.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="97.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="91.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="79.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="81.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="201.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="150.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="48.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="117.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="113.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="127.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="113.8" r="4"/>
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
 * <svg id="bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssyr-pad128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 133.1,218.5 208.3,218.4 283.4,218.1 358.6,217.6 433.7,211.4 457.9,207.2 508.9,190.2 584.0,98.6"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,219.1 208.3,219.1 283.4,219.0 358.6,218.5 433.7,209.8 457.9,204.6 508.9,174.6 584.0,61.9"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="218.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="190.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="98.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="219.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="218.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="209.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="174.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="61.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [lda.ssyr.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/wgblas/lda.ssyr.js) — WebGPU lda-sweep benchmark script
 * - [lda.ssyr.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssyr/cuda/lda.ssyr.c) — CUDA / cuBLAS lda-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/ssyr
 */
