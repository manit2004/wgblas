/**
 * Benchmark results for snrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0190 | 0.0067 | 0.0181 | 0.0071 | 94.7% |
 * | 64 | 0.0192 | 0.0133 | 0.0182 | 0.0141 | 94.6% |
 * | 128 | 0.0185 | 0.0277 | 0.0181 | 0.0283 | 97.9% |
 * | 512 | 0.0189 | 0.1086 | 0.0180 | 0.1136 | 95.6% |
 * | 1024 | 0.0189 | 0.2166 | 0.0180 | 0.2282 | 94.9% |
 * | 4096 | 0.0190 | 0.8641 | 0.0181 | 0.9030 | 95.7% |
 * | 16384 | 0.0198 | 3.3112 | 0.0181 | 3.6248 | 91.3% |
 * | 65536 | 0.0200 | 13.0758 | 0.0181 | 14.4480 | 90.5% |
 * | 262144 | 0.0259 | 40.4294 | 0.0190 | 55.2580 | 73.2% |
 * | 1048576 | 0.0451 | 93.0909 | 0.0449 | 93.4560 | 99.6% |
 * | 4194304 | 0.1154 | 145.3731 | 0.1430 | 117.3560 | 123.9% |
 * | 16777216 | 0.4040 | 166.0913 | 0.5895 | 113.8488 | 145.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-snrm2-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for snrm2">
 * <style>#bc-snrm2-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-snrm2-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-snrm2-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-snrm2-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-snrm2-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-snrm2-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-snrm2-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-snrm2-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-snrm2-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.7 362.5,206.9 417.9,179.6 473.3,126.9 528.6,74.6 584.0,53.9"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.4 362.5,205.6 417.9,164.7 473.3,126.5 528.6,102.6 584.0,106.2"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="206.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="179.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="126.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="74.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="53.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="164.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="126.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="102.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="106.2" r="4"/>
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
 * - [benchmark.snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/benchmark.snrm2.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/snrm2
 */
