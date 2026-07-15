/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0205 | 0.0063 | 0.0170 | 0.0075 | 83.3% |
 * | 64 | 0.0206 | 0.0125 | 0.0170 | 0.0151 | 82.5% |
 * | 128 | 0.0205 | 0.0250 | 0.0173 | 0.0296 | 84.5% |
 * | 512 | 0.0204 | 0.1005 | 0.0172 | 0.1190 | 84.4% |
 * | 1024 | 0.0205 | 0.2002 | 0.0170 | 0.2415 | 82.9% |
 * | 4096 | 0.0203 | 0.8063 | 0.0180 | 0.9094 | 88.7% |
 * | 16384 | 0.0209 | 3.1339 | 0.0187 | 3.4979 | 89.6% |
 * | 65536 | 0.0216 | 12.1633 | 0.0180 | 14.5248 | 83.7% |
 * | 262144 | 0.0285 | 36.7973 | 0.0202 | 51.8071 | 71.0% |
 * | 1048576 | 0.0472 | 88.8022 | 0.0404 | 103.6962 | 85.6% |
 * | 4194304 | 0.1178 | 142.4309 | 0.1083 | 154.8857 | 92.0% |
 * | 16777216 | 0.4053 | 165.5864 | 0.4051 | 165.6453 | 100.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for isamax">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,216.9 362.5,207.8 417.9,183.2 473.3,131.2 528.6,77.6 584.0,54.4"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.5 362.5,205.5 417.9,168.2 473.3,116.3 528.6,65.1 584.0,54.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="207.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="183.2" r="4"/>
 * <circle class="mk1" cx="473.3" cy="131.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="77.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="54.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="168.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="116.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="65.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="54.4" r="4"/>
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
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
