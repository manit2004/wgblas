/**
 * Benchmark results for isamax on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0164 | 0.0078 | 0.0125 | 0.0102 | 76.6% |
 * | 64 | 0.0164 | 0.0156 | 0.0123 | 0.0209 | 74.8% |
 * | 128 | 0.0164 | 0.0313 | 0.0122 | 0.0419 | 74.6% |
 * | 512 | 0.0164 | 0.1250 | 0.0123 | 0.1667 | 75.0% |
 * | 1024 | 0.0164 | 0.2500 | 0.0120 | 0.3400 | 73.5% |
 * | 4096 | 0.0164 | 1.0000 | 0.0173 | 0.9455 | 105.8% |
 * | 16384 | 0.0164 | 4.0000 | 0.0215 | 3.0499 | 131.2% |
 * | 65536 | 0.0164 | 16.0000 | 0.0222 | 11.7955 | 135.6% |
 * | 262144 | 0.0184 | 56.8889 | 0.0239 | 43.8075 | 129.9% |
 * | 1048576 | 0.0236 | 178.0870 | 0.0239 | 175.5820 | 101.4% |
 * | 4194304 | 0.0389 | 431.1579 | 0.0329 | 510.0078 | 84.5% |
 * | 16777216 | 0.3348 | 200.4159 | 0.3302 | 203.2419 | 98.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">300</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">400</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">500</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">600</text>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,220.0 196.4,219.9 251.8,219.7 307.2,218.7 362.5,214.7 417.9,201.0 473.3,160.6 528.6,76.3 584.0,153.2"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.9 251.8,219.7 307.2,219.0 362.5,216.1 417.9,205.4 473.3,161.5 528.6,50.0 584.0,152.3"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="214.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="201.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="160.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="76.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="153.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.0" r="4"/>
 * <circle class="mk2" cx="362.5" cy="216.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="205.4" r="4"/>
 * <circle class="mk2" cx="473.3" cy="161.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="50.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="152.3" r="4"/>
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
 * <svg id="bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.400</text>
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
 * <polyline class="ln1" points="58.0,211.8 85.7,211.8 113.4,211.8 168.7,211.8 196.4,211.8 251.8,211.8 307.2,211.8 362.5,211.8 417.9,210.8 473.3,208.2 528.6,200.5 584.0,52.6"/>
 * <polyline class="ln2" points="58.0,213.8 85.7,213.8 113.4,213.9 168.7,213.8 196.4,214.0 251.8,211.3 307.2,209.2 362.5,208.9 417.9,208.1 473.3,208.1 528.6,203.6 584.0,54.9"/>
 * <circle class="mk1" cx="58.0" cy="211.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="211.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="211.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="211.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="211.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="211.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="211.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="210.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="208.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="200.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="52.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="213.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="213.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="213.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.0" r="4"/>
 * <circle class="mk2" cx="251.8" cy="211.3" r="4"/>
 * <circle class="mk2" cx="307.2" cy="209.2" r="4"/>
 * <circle class="mk2" cx="362.5" cy="208.9" r="4"/>
 * <circle class="mk2" cx="417.9" cy="208.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="208.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="203.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="54.9" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/benchmark.isamax.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/isamax
 */
