/**
 * Benchmark results for snrm2 on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0154 | 0.0083 | 0.0212 | 0.0060 | 138.9% |
 * | 64 | 0.0154 | 0.0167 | 0.0216 | 0.0118 | 141.2% |
 * | 128 | 0.0154 | 0.0333 | 0.0216 | 0.0237 | 140.6% |
 * | 512 | 0.0154 | 0.1333 | 0.0222 | 0.0923 | 144.5% |
 * | 1024 | 0.0154 | 0.2667 | 0.0231 | 0.1770 | 150.7% |
 * | 4096 | 0.0154 | 1.0667 | 0.0216 | 0.7596 | 140.4% |
 * | 16384 | 0.0154 | 4.2667 | 0.0226 | 2.9008 | 147.1% |
 * | 65536 | 0.0154 | 17.0667 | 0.0235 | 11.1380 | 153.2% |
 * | 262144 | 0.0164 | 64.0000 | 0.0234 | 44.8569 | 142.7% |
 * | 1048576 | 0.0215 | 195.0476 | 0.0236 | 177.7247 | 109.7% |
 * | 4194304 | 0.0369 | 455.1111 | 0.0401 | 417.9258 | 108.9% |
 * | 16777216 | 0.3338 | 201.0307 | 0.2949 | 227.5803 | 88.3% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">200</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">300</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">400</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">500</text>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.9 251.8,219.6 307.2,218.3 362.5,213.2 417.9,194.4 473.3,142.0 528.6,38.0 584.0,139.6"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,220.0 196.4,219.9 251.8,219.7 307.2,218.8 362.5,215.5 417.9,202.1 473.3,148.9 528.6,52.8 584.0,129.0"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="194.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="142.0" r="4"/>
 * <circle class="mk1" cx="528.6" cy="38.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="139.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="218.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="202.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="148.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="52.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="129.0" r="4"/>
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
 * <svg id="bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,212.3 85.7,212.3 113.4,212.3 168.7,212.3 196.4,212.3 251.8,212.3 307.2,212.3 362.5,212.3 417.9,211.8 473.3,209.2 528.6,201.6 584.0,53.1"/>
 * <polyline class="ln2" points="58.0,209.4 85.7,209.2 113.4,209.2 168.7,208.9 196.4,208.5 251.8,209.2 307.2,208.7 362.5,208.2 417.9,208.3 473.3,208.2 528.6,200.0 584.0,72.6"/>
 * <circle class="mk1" cx="58.0" cy="212.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="212.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="212.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="212.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="212.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="212.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="212.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="212.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.8" r="4"/>
 * <circle class="mk1" cx="473.3" cy="209.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="201.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="53.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="209.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="209.2" r="4"/>
 * <circle class="mk2" cx="113.4" cy="209.2" r="4"/>
 * <circle class="mk2" cx="168.7" cy="208.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="208.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="209.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="208.7" r="4"/>
 * <circle class="mk2" cx="362.5" cy="208.2" r="4"/>
 * <circle class="mk2" cx="417.9" cy="208.3" r="4"/>
 * <circle class="mk2" cx="473.3" cy="208.2" r="4"/>
 * <circle class="mk2" cx="528.6" cy="200.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="72.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/snrm2.js) — WebGPU benchmark script
 * - [snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/snrm2.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/snrm2
 */
