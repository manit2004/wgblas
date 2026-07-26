/**
 * Benchmark results for ssymv on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.4062 | 0.0041 | 0.6094 | 66.7% |
 * | 64 | 0.0061 | 1.4792 | 0.0041 | 2.2188 | 66.7% |
 * | 128 | 0.0072 | 4.8214 | 0.0051 | 6.7500 | 71.4% |
 * | 256 | 0.0082 | 16.4375 | 0.0061 | 21.9167 | 75.0% |
 * | 512 | 0.0102 | 51.9000 | 0.0092 | 57.6667 | 90.0% |
 * | 1024 | 0.0215 | 98.1905 | 0.0164 | 128.8750 | 76.2% |
 * | 1280 | 0.0297 | 110.9483 | 0.0256 | 128.7000 | 86.2% |
 * | 2048 | 0.0584 | 144.2105 | 0.0287 | 293.5714 | 49.1% |
 * | 4096 | 0.4731 | 71.0476 | 0.1239 | 271.2727 | 26.2% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">50</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">100</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">150</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">200</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">250</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">300</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.7 133.1,219.0 208.3,216.8 283.4,209.0 358.6,185.4 433.7,154.5 457.9,146.0 508.9,123.9 584.0,172.6"/>
 * <polyline class="ln2" points="58.0,219.6 133.1,218.5 208.3,215.5 283.4,205.4 358.6,181.6 433.7,134.1 457.9,134.2 508.9,24.3 584.0,39.2"/>
 * <circle class="mk1" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="185.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="154.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="146.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="123.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="172.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="205.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="181.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="134.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="134.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="24.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="39.2" r="4"/>
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
 * <svg id="bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-ssymv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.500</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.5 133.1,217.5 208.3,217.1 283.4,216.7 358.6,215.9 433.7,211.4 457.9,208.1 508.9,196.7 584.0,30.8"/>
 * <polyline class="ln2" points="58.0,218.4 133.1,218.4 208.3,218.0 283.4,217.6 358.6,216.3 433.7,213.4 457.9,209.8 508.9,208.5 584.0,170.4"/>
 * <circle class="mk1" cx="58.0" cy="217.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="215.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="208.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="196.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="216.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="213.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="209.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="208.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="170.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.ssymv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/benchmark.ssymv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/ssymv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/ssymv
 */
