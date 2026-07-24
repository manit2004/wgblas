/**
 * Benchmark results for saxpy on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0625 | 0.0041 | 0.0938 | 66.6% |
 * | 64 | 0.0072 | 0.1071 | 0.0041 | 0.1875 | 57.1% |
 * | 128 | 0.0072 | 0.2143 | 0.0041 | 0.3750 | 57.1% |
 * | 512 | 0.0072 | 0.8571 | 0.0041 | 1.5000 | 57.1% |
 * | 1024 | 0.0072 | 1.7143 | 0.0041 | 3.0000 | 57.1% |
 * | 4096 | 0.0072 | 6.8571 | 0.0041 | 12.0000 | 57.1% |
 * | 16384 | 0.0072 | 27.4286 | 0.0041 | 48.0000 | 57.1% |
 * | 65536 | 0.0092 | 85.3333 | 0.0041 | 191.2529 | 44.6% |
 * | 262144 | 0.0133 | 236.3077 | 0.0061 | 512.0000 | 46.2% |
 * | 1048576 | 0.0266 | 472.6154 | 0.0153 | 820.9103 | 57.6% |
 * | 4194304 | 0.0870 | 578.2588 | 0.0528 | 954.1183 | 60.6% |
 * | 16777216 | 0.8970 | 224.4384 | 1.0158 | 198.1936 | 113.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.7 251.8,218.6 307.2,214.5 362.5,202.9 417.9,172.7 473.3,125.5 528.6,104.3 584.0,175.1"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.7 196.4,219.4 251.8,217.6 307.2,210.4 362.5,181.7 417.9,117.6 473.3,55.8 528.6,29.2 584.0,180.4"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="202.9" r="4"/>
 * <circle class="mk1" cx="417.9" cy="172.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="125.5" r="4"/>
 * <circle class="mk1" cx="528.6" cy="104.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="175.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="217.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="210.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="181.7" r="4"/>
 * <circle class="mk2" cx="417.9" cy="117.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="55.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="29.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="180.4" r="4"/>
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
 * <svg id="bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.20</text>
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
 * <polyline class="ln1" points="58.0,219.0 85.7,218.8 113.4,218.8 168.7,218.8 196.4,218.8 251.8,218.8 307.2,218.8 362.5,218.5 417.9,217.8 473.3,215.6 528.6,205.5 584.0,70.5"/>
 * <polyline class="ln2" points="58.0,219.3 85.7,219.3 113.4,219.3 168.7,219.3 196.4,219.3 251.8,219.3 307.2,219.3 362.5,219.3 417.9,219.0 473.3,217.4 528.6,211.2 584.0,50.7"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.5" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="215.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="205.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="70.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.3" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.3" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.3" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="219.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="217.4" r="4"/>
 * <circle class="mk2" cx="528.6" cy="211.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/benchmark.saxpy.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/saxpy
 */
