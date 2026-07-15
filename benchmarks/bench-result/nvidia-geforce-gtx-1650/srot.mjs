/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0736 | 0.0028 | 0.1798 | 40.9% |
 * | 64 | 0.0071 | 0.1451 | 0.0028 | 0.3657 | 39.7% |
 * | 128 | 0.0071 | 0.2876 | 0.0029 | 0.7072 | 40.7% |
 * | 512 | 0.0072 | 1.1353 | 0.0029 | 2.8132 | 40.4% |
 * | 1024 | 0.0071 | 2.2960 | 0.0030 | 5.4759 | 41.9% |
 * | 4096 | 0.0074 | 8.9043 | 0.0030 | 21.9037 | 40.7% |
 * | 16384 | 0.0082 | 32.1255 | 0.0038 | 68.2667 | 47.1% |
 * | 65536 | 0.0101 | 103.3691 | 0.0069 | 152.4093 | 67.8% |
 * | 262144 | 0.0301 | 139.1423 | 0.0279 | 150.3119 | 92.6% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1011 | 165.8877 | 98.8% |
 * | 4194304 | 0.3909 | 171.6726 | 0.4009 | 167.3772 | 102.6% |
 * | 16777216 | 1.5502 | 173.1627 | 1.8224 | 147.2965 | 117.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-srot-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for srot">
 * <style>#bc-srot-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-srot-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-srot-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-srot-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-srot-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-srot-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-srot-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-srot-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.7 168.7,218.9 196.4,217.7 251.8,211.1 307.2,187.9 362.5,116.6 417.9,80.9 473.3,56.2 528.6,48.3 584.0,46.8"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.6 113.4,219.3 168.7,217.2 196.4,214.5 251.8,198.1 307.2,151.7 362.5,67.6 417.9,69.7 473.3,54.1 528.6,52.6 584.0,72.7"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="187.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="116.6" r="4"/>
 * <circle class="mk1" cx="417.9" cy="80.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="198.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="151.7" r="4"/>
 * <circle class="mk2" cx="362.5" cy="67.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="69.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="54.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="52.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="72.7" r="4"/>
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
 * - [benchmark.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/benchmark.srot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
