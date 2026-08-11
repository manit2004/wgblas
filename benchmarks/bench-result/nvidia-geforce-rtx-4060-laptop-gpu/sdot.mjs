/**
 * Benchmark results for sdot on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0154 | 0.0167 | 0.0143 | 0.0179 | 93.1% |
 * | 64 | 0.0164 | 0.0313 | 0.0143 | 0.0358 | 87.3% |
 * | 128 | 0.0174 | 0.0588 | 0.0143 | 0.0716 | 82.2% |
 * | 512 | 0.0174 | 0.2353 | 0.0138 | 0.2970 | 79.2% |
 * | 1024 | 0.0174 | 0.4706 | 0.0132 | 0.6229 | 75.5% |
 * | 4096 | 0.0184 | 1.7778 | 0.0152 | 2.1603 | 82.3% |
 * | 16384 | 0.0164 | 8.0000 | 0.0138 | 9.4815 | 84.4% |
 * | 65536 | 0.0154 | 34.1333 | 0.0154 | 34.1333 | 100.0% |
 * | 262144 | 0.0174 | 120.4706 | 0.0232 | 90.2700 | 133.5% |
 * | 1048576 | 0.0225 | 372.3636 | 0.0241 | 348.5957 | 106.8% |
 * | 4194304 | 0.0543 | 618.2642 | 0.0411 | 815.6950 | 75.8% |
 * | 16777216 | 0.6318 | 212.4344 | 0.5581 | 240.4715 | 88.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1000</text>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,220.0 196.4,219.9 251.8,219.6 307.2,218.4 362.5,213.2 417.9,195.9 473.3,145.5 528.6,96.3 584.0,177.5"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.9 251.8,219.6 307.2,218.1 362.5,213.2 417.9,201.9 473.3,150.3 528.6,56.9 584.0,171.9"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="195.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="145.5" r="4"/>
 * <circle class="mk1" cx="528.6" cy="96.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="177.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="218.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="213.2" r="4"/>
 * <circle class="mk2" cx="417.9" cy="201.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="150.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="56.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="171.9" r="4"/>
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
 * <svg id="bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sdot-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.800</text>
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
 * <polyline class="ln1" points="58.0,216.2 85.7,215.9 113.4,215.6 168.7,215.6 196.4,215.6 251.8,215.4 307.2,215.9 362.5,216.2 417.9,215.6 473.3,214.4 528.6,206.4 584.0,62.0"/>
 * <polyline class="ln2" points="58.0,216.4 85.7,216.4 113.4,216.4 168.7,216.6 196.4,216.7 251.8,216.2 307.2,216.6 362.5,216.2 417.9,214.2 473.3,214.0 528.6,209.7 584.0,80.5"/>
 * <circle class="mk1" cx="58.0" cy="216.2" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="215.6" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="216.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="215.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="214.4" r="4"/>
 * <circle class="mk1" cx="528.6" cy="206.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="62.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="216.4" r="4"/>
 * <circle class="mk2" cx="113.4" cy="216.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="216.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="216.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="216.2" r="4"/>
 * <circle class="mk2" cx="417.9" cy="214.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="214.0" r="4"/>
 * <circle class="mk2" cx="528.6" cy="209.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="80.5" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [sdot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/wgblas/sdot.js) — WebGPU benchmark script
 * - [sdot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sdot/cuda/sdot.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sdot
 */
