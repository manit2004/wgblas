/**
 * Benchmark results for strmv on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.3854 | 0.0051 | 0.4654 | 82.8% |
 * | 64 | 0.0061 | 1.4375 | 0.0061 | 1.4375 | 100.0% |
 * | 128 | 0.0072 | 4.7500 | 0.0092 | 3.6944 | 128.6% |
 * | 256 | 0.0072 | 18.6429 | 0.0256 | 5.2200 | 357.1% |
 * | 512 | 0.0092 | 57.4444 | 0.0635 | 8.3387 | 688.9% |
 * | 1024 | 0.0133 | 158.3077 | 0.2340 | 9.0066 | 1757.7% |
 * | 1280 | 0.0154 | 214.1667 | 0.1341 | 24.5229 | 873.3% |
 * | 2048 | 0.0236 | 357.0435 | 0.2150 | 39.1048 | 913.0% |
 * | 4096 | 0.0942 | 356.6087 | 0.2386 | 140.8069 | 253.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">200</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">300</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">400</text>
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
 * <polyline class="ln1" points="58.0,219.8 133.1,219.3 208.3,217.6 283.4,210.7 358.6,191.3 433.7,140.8 457.9,112.9 508.9,41.5 584.0,41.7"/>
 * <polyline class="ln2" points="58.0,219.8 133.1,219.3 208.3,218.2 283.4,217.4 358.6,215.8 433.7,215.5 457.9,207.7 508.9,200.4 584.0,149.6"/>
 * <circle class="mk1" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="191.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="140.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="112.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="41.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="41.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="219.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="207.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="200.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="149.6" r="4"/>
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
 * <svg id="bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-strmv-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.0500</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.150</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.250</text>
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
 * <polyline class="ln1" points="58.0,215.1 133.1,215.1 208.3,214.3 283.4,214.3 358.6,212.6 433.7,209.4 457.9,207.7 508.9,201.2 584.0,144.6"/>
 * <polyline class="ln2" points="58.0,215.9 133.1,215.1 208.3,212.6 283.4,199.5 358.6,169.2 433.7,32.8 457.9,112.7 508.9,48.0 584.0,29.1"/>
 * <circle class="mk1" cx="58.0" cy="215.1" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="207.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="201.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="144.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="212.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="199.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="169.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="32.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="112.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="48.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="29.1" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.strmv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/benchmark.strmv.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/strmv/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/strmv
 */
