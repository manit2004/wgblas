/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0068 | 0.0561 | 0.0038 | 0.1000 | 56.1% |
 * | 64 | 0.0068 | 0.1121 | 0.0038 | 0.2017 | 55.6% |
 * | 128 | 0.0069 | 0.2212 | 0.0036 | 0.4286 | 51.6% |
 * | 512 | 0.0070 | 0.8767 | 0.0034 | 1.8028 | 48.6% |
 * | 1024 | 0.0070 | 1.7615 | 0.0034 | 3.5721 | 49.3% |
 * | 4096 | 0.0074 | 6.6638 | 0.0035 | 14.0917 | 47.3% |
 * | 16384 | 0.0080 | 24.6253 | 0.0040 | 48.7619 | 50.5% |
 * | 65536 | 0.0101 | 77.7722 | 0.0061 | 129.6887 | 60.0% |
 * | 262144 | 0.0246 | 128.0000 | 0.0214 | 147.1617 | 87.0% |
 * | 1048576 | 0.0779 | 161.6178 | 0.0739 | 170.1865 | 95.0% |
 * | 4194304 | 0.2925 | 172.0481 | 0.2887 | 174.3172 | 98.7% |
 * | 16777216 | 1.1510 | 174.9181 | 1.1308 | 178.0366 | 98.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-saxpy-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-saxpy-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.8 168.7,219.1 196.4,218.2 251.8,213.3 307.2,195.4 362.5,142.2 417.9,92.0 473.3,58.4 528.6,48.0 584.0,45.1"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.6 168.7,218.2 196.4,216.4 251.8,205.9 307.2,171.2 362.5,90.3 417.9,72.8 473.3,49.8 528.6,45.7 584.0,42.0"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.1" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.2" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="195.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="142.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="92.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="58.4" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="205.9" r="4"/>
 * <circle class="mk2" cx="307.2" cy="171.2" r="4"/>
 * <circle class="mk2" cx="362.5" cy="90.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="72.8" r="4"/>
 * <circle class="mk2" cx="473.3" cy="49.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="45.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="42.0" r="4"/>
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
 * <svg id="bc-saxpy-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-saxpy-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-saxpy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.20</text>
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
 * <polyline class="ln1" points="58.0,218.9 85.7,218.9 113.4,218.8 168.7,218.8 196.4,218.8 251.8,218.8 307.2,218.7 362.5,218.3 417.9,215.9 473.3,207.0 528.6,171.2 584.0,28.2"/>
 * <polyline class="ln2" points="58.0,219.4 85.7,219.4 113.4,219.4 168.7,219.4 196.4,219.4 251.8,219.4 307.2,219.3 362.5,219.0 417.9,216.4 473.3,207.7 528.6,171.9 584.0,31.5"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="215.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="207.0" r="4"/>
 * <circle class="mk1" cx="528.6" cy="171.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.4" r="4"/>
 * <circle class="mk2" cx="473.3" cy="207.7" r="4"/>
 * <circle class="mk2" cx="528.6" cy="171.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="31.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/benchmark.saxpy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
