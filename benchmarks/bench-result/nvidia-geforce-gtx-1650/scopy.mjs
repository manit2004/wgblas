/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0423 | 0.0036 | 0.0711 | 59.5% |
 * | 64 | 0.0059 | 0.0863 | 0.0039 | 0.1301 | 66.3% |
 * | 128 | 0.0061 | 0.1689 | 0.0027 | 0.3832 | 44.1% |
 * | 512 | 0.0060 | 0.6827 | 0.0028 | 1.4463 | 47.2% |
 * | 1024 | 0.0060 | 1.3690 | 0.0037 | 2.1880 | 62.6% |
 * | 4096 | 0.0061 | 5.3333 | 0.0027 | 12.1905 | 43.7% |
 * | 16384 | 0.0064 | 20.5829 | 0.0034 | 38.4601 | 53.5% |
 * | 65536 | 0.0082 | 64.0000 | 0.0043 | 120.9151 | 52.9% |
 * | 262144 | 0.0185 | 113.3841 | 0.0156 | 134.2951 | 84.4% |
 * | 1048576 | 0.0592 | 141.6229 | 0.0531 | 158.0133 | 89.6% |
 * | 4194304 | 0.2171 | 154.5660 | 0.2028 | 165.4427 | 93.4% |
 * | 16777216 | 0.8111 | 165.4688 | 0.8024 | 167.2603 | 98.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-scopy-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for scopy">
 * <style>#bc-scopy-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-scopy-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-scopy-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-scopy-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-scopy-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-scopy-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-scopy-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-scopy-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.8 168.7,219.3 196.4,218.6 251.8,214.7 307.2,199.4 362.5,156.0 417.9,106.6 473.3,78.4 528.6,65.4 584.0,54.5"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.9 113.4,219.6 168.7,218.6 196.4,217.8 251.8,207.8 307.2,181.5 362.5,99.1 417.9,85.7 473.3,62.0 528.6,54.6 584.0,52.7"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="214.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="199.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="156.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="106.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="78.4" r="4"/>
 * <circle class="mk1" cx="528.6" cy="65.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="54.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="217.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="207.8" r="4"/>
 * <circle class="mk2" cx="307.2" cy="181.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="99.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="85.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="62.0" r="4"/>
 * <circle class="mk2" cx="528.6" cy="54.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="52.7" r="4"/>
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
 * - [benchmark.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/benchmark.scopy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/scopy
 */
