/**
 * Benchmark results for sscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0424 | 0.0026 | 0.1000 | 42.4% |
 * | 64 | 0.0059 | 0.0870 | 0.0025 | 0.2025 | 42.9% |
 * | 128 | 0.0059 | 0.1739 | 0.0026 | 0.3951 | 44.0% |
 * | 512 | 0.0059 | 0.6957 | 0.0031 | 1.3061 | 53.3% |
 * | 1024 | 0.0060 | 1.3653 | 0.0027 | 3.0843 | 44.3% |
 * | 4096 | 0.0059 | 5.5202 | 0.0027 | 12.3373 | 44.7% |
 * | 16384 | 0.0063 | 20.8980 | 0.0033 | 39.7670 | 52.6% |
 * | 65536 | 0.0082 | 64.0000 | 0.0043 | 122.7266 | 52.1% |
 * | 262144 | 0.0164 | 128.0000 | 0.0103 | 203.8445 | 62.8% |
 * | 1048576 | 0.0570 | 147.1892 | 0.0522 | 160.5782 | 91.7% |
 * | 4194304 | 0.2105 | 159.3823 | 0.1989 | 168.7305 | 94.5% |
 * | 16777216 | 0.8143 | 164.8316 | 0.7869 | 170.5695 | 96.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-sscal-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sscal-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sscal-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sscal-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sscal-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">200</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">250</text>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.9 168.7,219.4 196.4,218.9 251.8,215.6 307.2,203.3 362.5,168.8 417.9,117.6 473.3,102.2 528.6,92.5 584.0,88.1"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.7 168.7,219.0 196.4,217.5 251.8,210.1 307.2,188.2 362.5,121.8 417.9,56.9 473.3,91.5 528.6,85.0 584.0,83.5"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.9" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="203.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="168.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="117.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="102.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="92.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="88.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.0" r="4"/>
 * <circle class="mk2" cx="196.4" cy="217.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="210.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="188.2" r="4"/>
 * <circle class="mk2" cx="362.5" cy="121.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="56.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="91.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="85.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="83.5" r="4"/>
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
 * <svg id="bc-sscal-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sscal-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sscal-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sscal-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sscal-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sscal-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 85.7,218.8 113.4,218.8 168.7,218.8 196.4,218.8 251.8,218.8 307.2,218.7 362.5,218.4 417.9,216.7 473.3,208.6 528.6,177.9 584.0,57.1"/>
 * <polyline class="ln2" points="58.0,219.5 85.7,219.5 113.4,219.5 168.7,219.4 196.4,219.5 251.8,219.5 307.2,219.3 362.5,219.1 417.9,217.9 473.3,209.6 528.6,180.2 584.0,62.6"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="216.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="208.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="177.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.5" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="217.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="180.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="62.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/benchmark.sscal.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sscal
 */
