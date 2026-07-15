/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0193 | 0.0066 | 0.0187 | 0.0068 | 97.3% |
 * | 64 | 0.0196 | 0.0131 | 0.0185 | 0.0139 | 94.1% |
 * | 128 | 0.0195 | 0.0263 | 0.0183 | 0.0279 | 94.1% |
 * | 512 | 0.0197 | 0.1039 | 0.0182 | 0.1125 | 92.4% |
 * | 1024 | 0.0197 | 0.2081 | 0.0186 | 0.2207 | 94.3% |
 * | 4096 | 0.0195 | 0.8393 | 0.0186 | 0.8790 | 95.5% |
 * | 16384 | 0.0201 | 3.2663 | 0.0188 | 3.4830 | 93.8% |
 * | 65536 | 0.0205 | 12.8000 | 0.0183 | 14.3468 | 89.2% |
 * | 262144 | 0.0267 | 39.2666 | 0.0191 | 55.0260 | 71.4% |
 * | 1048576 | 0.0468 | 89.5301 | 0.0444 | 94.4323 | 94.8% |
 * | 4194304 | 0.1167 | 143.7193 | 0.1402 | 119.6458 | 120.1% |
 * | 16777216 | 0.4055 | 165.4819 | 0.5659 | 118.5904 | 139.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for sasum">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,216.7 362.5,207.2 417.9,180.7 473.3,130.5 528.6,76.3 584.0,54.5"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.5 362.5,205.7 417.9,165.0 473.3,125.6 528.6,100.4 584.0,101.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="207.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="180.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="130.5" r="4"/>
 * <circle class="mk1" cx="528.6" cy="76.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="54.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.7" r="4"/>
 * <circle class="mk2" cx="417.9" cy="165.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="125.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="100.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="101.4" r="4"/>
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
 * - [benchmark.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/benchmark.sasum.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
