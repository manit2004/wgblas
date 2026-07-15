/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 0.0542 | 0.0032 | 0.1188 | 45.6% |
 * | 64 | 0.0072 | 0.1074 | 0.0033 | 0.2353 | 45.6% |
 * | 128 | 0.0073 | 0.2115 | 0.0034 | 0.4465 | 47.4% |
 * | 512 | 0.0073 | 0.8458 | 0.0033 | 1.8641 | 45.4% |
 * | 1024 | 0.0070 | 1.7494 | 0.0032 | 3.8209 | 45.8% |
 * | 4096 | 0.0072 | 6.8267 | 0.0035 | 14.2222 | 48.0% |
 * | 16384 | 0.0080 | 24.5269 | 0.0040 | 49.5484 | 49.5% |
 * | 65536 | 0.0101 | 77.8954 | 0.0059 | 134.2951 | 58.0% |
 * | 262144 | 0.0246 | 128.0000 | 0.0212 | 148.4955 | 86.2% |
 * | 1048576 | 0.0778 | 161.6842 | 0.0739 | 170.2234 | 95.0% |
 * | 4194304 | 0.2929 | 171.8601 | 0.2867 | 175.5625 | 97.9% |
 * | 16777216 | 1.1495 | 175.1495 | 1.1308 | 178.0391 | 98.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. Higher means wgblas is closer to cuBLAS throughput.
 *
 * <svg id="bc-saxpy-nvidia_geforce_gtx_1650" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n for saxpy">
 * <style>#bc-saxpy-nvidia_geforce_gtx_1650 .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_gtx_1650 .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650 .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650 .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650 .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650 .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650 .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_gtx_1650 .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_gtx_1650 .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_gtx_1650 .at{fill:#898781}#bc-saxpy-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650 .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_gtx_1650 .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650 .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.8 168.7,219.2 196.4,218.3 251.8,213.2 307.2,195.5 362.5,142.1 417.9,92.0 473.3,58.3 528.6,48.1 584.0,44.9"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.6 168.7,218.1 196.4,216.2 251.8,205.8 307.2,170.5 362.5,85.7 417.9,71.5 473.3,49.8 528.6,44.4 584.0,42.0"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.2" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="195.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="142.1" r="4"/>
 * <circle class="mk1" cx="417.9" cy="92.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="58.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="44.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.1" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="205.8" r="4"/>
 * <circle class="mk2" cx="307.2" cy="170.5" r="4"/>
 * <circle class="mk2" cx="362.5" cy="85.7" r="4"/>
 * <circle class="mk2" cx="417.9" cy="71.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="49.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="44.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="42.0" r="4"/>
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
 * - [benchmark.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/benchmark.saxpy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
