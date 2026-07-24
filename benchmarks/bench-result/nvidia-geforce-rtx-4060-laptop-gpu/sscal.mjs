/**
 * Benchmark results for sscal on Nvidia Geforce Rtx 4060 Laptop Gpu.
 *
 * ## Nvidia Geforce Rtx 4060 Laptop Gpu — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0417 | 0.0174 | 0.0147 | 283.4% |
 * | 64 | 0.0051 | 0.1000 | 0.0051 | 0.1000 | 100.0% |
 * | 128 | 0.0051 | 0.2000 | 0.0051 | 0.2000 | 100.0% |
 * | 512 | 0.0051 | 0.8000 | 0.0051 | 0.8000 | 100.0% |
 * | 1024 | 0.0051 | 1.6000 | 0.0051 | 1.6000 | 100.0% |
 * | 4096 | 0.0051 | 6.4000 | 0.0051 | 6.4000 | 100.0% |
 * | 16384 | 0.0061 | 21.3333 | 0.0051 | 25.6000 | 83.3% |
 * | 65536 | 0.0072 | 73.1429 | 0.0051 | 102.4000 | 71.4% |
 * | 262144 | 0.0102 | 204.8000 | 0.0061 | 341.3333 | 60.0% |
 * | 1048576 | 0.0236 | 356.1739 | 0.0123 | 682.6666 | 52.2% |
 * | 4194304 | 0.0788 | 425.5584 | 0.0410 | 819.2000 | 51.9% |
 * | 16777216 | 0.5571 | 240.9412 | 0.6789 | 197.6953 | 121.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#fcfcfb}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .at{fill:#898781}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln2{stroke:#008300}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.7 251.8,218.7 307.2,215.7 362.5,205.4 417.9,179.0 473.3,148.8 528.6,134.9 584.0,171.8"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.7 251.8,218.7 307.2,214.9 362.5,199.5 417.9,151.7 473.3,83.5 528.6,56.2 584.0,180.5"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="205.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="179.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="148.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="134.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="171.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="214.9" r="4"/>
 * <circle class="mk2" cx="362.5" cy="199.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="151.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="83.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="56.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="180.5" r="4"/>
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
 * <svg id="bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#fcfcfb}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .at{fill:#898781}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln2{stroke:#008300}#bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_rtx_4060_laptop_gpu-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.5 85.7,218.7 113.4,218.7 168.7,218.7 196.4,218.7 251.8,218.7 307.2,218.5 362.5,218.2 417.9,217.4 473.3,214.1 528.6,200.3 584.0,80.7"/>
 * <polyline class="ln2" points="58.0,215.6 85.7,218.7 113.4,218.7 168.7,218.7 196.4,218.7 251.8,218.7 307.2,218.7 362.5,218.7 417.9,218.5 473.3,216.9 528.6,209.8 584.0,50.3"/>
 * <circle class="mk1" cx="58.0" cy="218.5" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.7" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="214.1" r="4"/>
 * <circle class="mk1" cx="528.6" cy="200.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="80.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.6" r="4"/>
 * <circle class="mk2" cx="85.7" cy="218.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="218.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="218.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="218.7" r="4"/>
 * <circle class="mk2" cx="362.5" cy="218.7" r="4"/>
 * <circle class="mk2" cx="417.9" cy="218.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="216.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="209.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.3" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/benchmark.sscal.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-rtx-4060-laptop-gpu/sscal
 */
