/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0076 | 0.0678 | 0.0040 | 0.1280 | 53.0% |
 * | 64 | 0.0074 | 0.1391 | 0.0039 | 0.2623 | 53.0% |
 * | 128 | 0.0076 | 0.2712 | 0.0038 | 0.5378 | 50.4% |
 * | 512 | 0.0076 | 1.0734 | 0.0038 | 2.1333 | 50.3% |
 * | 1024 | 0.0076 | 2.1649 | 0.0039 | 4.1967 | 51.6% |
 * | 4096 | 0.0077 | 8.5511 | 0.0040 | 16.3840 | 52.2% |
 * | 16384 | 0.0083 | 31.6293 | 0.0047 | 55.9181 | 56.6% |
 * | 65536 | 0.0105 | 99.7504 | 0.0087 | 120.4706 | 82.8% |
 * | 262144 | 0.0349 | 120.1944 | 0.0329 | 127.3162 | 94.4% |
 * | 1048576 | 0.1229 | 136.5333 | 0.1206 | 139.0869 | 98.2% |
 * | 4194304 | 0.4739 | 141.6229 | 0.4751 | 141.2414 | 100.3% |
 * | 16777216 | 1.9046 | 140.9376 | 1.8631 | 144.0784 | 97.8% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.8 113.4,219.6 168.7,218.6 196.4,217.1 251.8,208.6 307.2,177.8 362.5,87.0 417.9,59.7 473.3,38.0 528.6,31.2 584.0,32.1"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.7 113.4,219.3 168.7,217.2 196.4,214.4 251.8,198.2 307.2,145.4 362.5,59.4 417.9,50.2 473.3,34.6 528.6,31.7 584.0,27.9"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.1" r="4"/>
 * <circle class="mk1" cx="251.8" cy="208.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="177.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="87.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="59.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="38.0" r="4"/>
 * <circle class="mk1" cx="528.6" cy="31.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="32.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="198.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="145.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="59.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="50.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="34.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="31.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="27.9" r="4"/>
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
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.2 85.7,219.3 113.4,219.2 168.7,219.2 196.4,219.2 251.8,219.2 307.2,219.2 362.5,218.9 417.9,216.5 473.3,207.7 528.6,172.6 584.0,29.5"/>
 * <polyline class="ln2" points="58.0,219.6 85.7,219.6 113.4,219.6 168.7,219.6 196.4,219.6 251.8,219.6 307.2,219.5 362.5,219.1 417.9,216.7 473.3,207.9 528.6,172.5 584.0,33.7"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.2" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.2" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.2" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="216.5" r="4"/>
 * <circle class="mk1" cx="473.3" cy="207.7" r="4"/>
 * <circle class="mk1" cx="528.6" cy="172.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="29.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="207.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="172.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/benchmark.srotm.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srotm
 */
