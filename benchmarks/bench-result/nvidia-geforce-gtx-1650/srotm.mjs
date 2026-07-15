/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0029 | 0.1788 | 46.6% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3516 | 47.4% |
 * | 128 | 0.0061 | 0.3333 | 0.0029 | 0.6957 | 47.9% |
 * | 512 | 0.0061 | 1.3333 | 0.0030 | 2.7676 | 48.2% |
 * | 1024 | 0.0061 | 2.6667 | 0.0031 | 5.3613 | 49.7% |
 * | 4096 | 0.0061 | 10.6667 | 0.0032 | 20.2772 | 52.6% |
 * | 16384 | 0.0068 | 38.7329 | 0.0039 | 67.9834 | 57.0% |
 * | 65536 | 0.0084 | 124.1212 | 0.0067 | 156.0381 | 79.5% |
 * | 262144 | 0.0289 | 145.1517 | 0.0275 | 152.4093 | 95.2% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1006 | 166.7052 | 98.3% |
 * | 4194304 | 0.3960 | 169.4531 | 0.3946 | 170.0577 | 99.6% |
 * | 16777216 | 1.5503 | 173.1556 | 1.5649 | 171.5356 | 100.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for srotm">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.8 113.4,219.7 168.7,218.7 196.4,217.3 251.8,209.3 307.2,181.3 362.5,95.9 417.9,74.8 473.3,56.2 528.6,50.5 584.0,46.8"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.6 113.4,219.3 168.7,217.2 196.4,214.6 251.8,199.7 307.2,152.0 362.5,64.0 417.9,67.6 473.3,53.3 528.6,49.9 584.0,48.5"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="209.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="181.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="95.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="74.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="50.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="199.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="152.0" r="4"/>
 * <circle class="mk2" cx="362.5" cy="64.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="67.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="53.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="49.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.5" r="4"/>
 * <line class="ln1" x1="58" y1="252" x2="74" y2="252"/>
 * <circle class="mk1" cx="66" cy="252" r="4"/>
 * <text class="lt" x="80" y="256">wgblas</text>
 * <line class="ln2" x1="132" y1="252" x2="148" y2="252"/>
 * <circle class="mk2" cx="140" cy="252" r="4"/>
 * <text class="lt" x="154" y="256">cuBLAS</text>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/benchmark.srotm.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srotm
 */
