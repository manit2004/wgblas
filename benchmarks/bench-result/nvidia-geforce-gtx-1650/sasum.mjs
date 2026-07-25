/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0185 | 0.0069 | 0.0183 | 0.0070 | 99.0% |
 * | 64 | 0.0186 | 0.0138 | 0.0189 | 0.0136 | 101.3% |
 * | 128 | 0.0184 | 0.0278 | 0.0220 | 0.0232 | 119.7% |
 * | 512 | 0.0184 | 0.1112 | 0.0214 | 0.0957 | 116.2% |
 * | 1024 | 0.0180 | 0.2278 | 0.0189 | 0.2169 | 105.0% |
 * | 4096 | 0.0184 | 0.8912 | 0.0186 | 0.8797 | 101.3% |
 * | 16384 | 0.0185 | 3.5341 | 0.0189 | 3.4741 | 101.7% |
 * | 65536 | 0.0198 | 13.2236 | 0.0195 | 13.4737 | 98.1% |
 * | 262144 | 0.0308 | 34.0624 | 0.0215 | 48.6894 | 70.0% |
 * | 1048576 | 0.0679 | 61.7681 | 0.0446 | 93.9584 | 65.7% |
 * | 4194304 | 0.2204 | 76.1327 | 0.1410 | 118.9806 | 64.0% |
 * | 16777216 | 0.8648 | 77.6019 | 0.5677 | 118.2093 | 65.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.6 251.8,218.6 307.2,214.3 362.5,198.8 417.9,165.5 473.3,121.2 528.6,98.2 584.0,95.8"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.7 251.8,218.6 307.2,214.4 362.5,198.4 417.9,142.1 473.3,69.7 528.6,29.6 584.0,30.9"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="198.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="165.5" r="4"/>
 * <circle class="mk1" cx="473.3" cy="121.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="98.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="95.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="214.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="198.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="142.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="69.7" r="4"/>
 * <circle class="mk2" cx="528.6" cy="29.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="30.9" r="4"/>
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
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,216.3 85.7,216.3 113.4,216.3 168.7,216.3 196.4,216.4 251.8,216.3 307.2,216.3 362.5,216.0 417.9,213.8 473.3,206.4 528.6,175.9 584.0,47.0"/>
 * <polyline class="ln2" points="58.0,216.3 85.7,216.2 113.4,215.6 168.7,215.7 196.4,216.2 251.8,216.3 307.2,216.2 362.5,216.1 417.9,215.7 473.3,211.1 528.6,191.8 584.0,106.5"/>
 * <circle class="mk1" cx="58.0" cy="216.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="216.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="216.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="216.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="216.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="216.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="216.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="213.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="206.4" r="4"/>
 * <circle class="mk1" cx="528.6" cy="175.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="47.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.3" r="4"/>
 * <circle class="mk2" cx="85.7" cy="216.2" r="4"/>
 * <circle class="mk2" cx="113.4" cy="215.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="215.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="216.3" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.2" r="4"/>
 * <circle class="mk2" cx="362.5" cy="216.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="215.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="211.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="191.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="106.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/benchmark.sasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
