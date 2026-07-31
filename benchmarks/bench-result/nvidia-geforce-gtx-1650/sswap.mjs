/**
 * Benchmark results for sswap on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0058 | 0.0879 | 0.0029 | 0.1768 | 49.7% |
 * | 64 | 0.0060 | 0.1720 | 0.0027 | 0.3743 | 46.0% |
 * | 128 | 0.0060 | 0.3395 | 0.0028 | 0.7191 | 47.2% |
 * | 512 | 0.0058 | 1.4066 | 0.0029 | 2.7978 | 50.3% |
 * | 1024 | 0.0070 | 2.3540 | 0.0029 | 5.5956 | 42.1% |
 * | 4096 | 0.0074 | 8.8467 | 0.0029 | 22.7556 | 38.9% |
 * | 16384 | 0.0079 | 33.0990 | 0.0042 | 62.0606 | 53.3% |
 * | 65536 | 0.0099 | 105.7032 | 0.0074 | 142.1605 | 74.4% |
 * | 262144 | 0.0298 | 140.9376 | 0.0278 | 150.8308 | 93.4% |
 * | 1048576 | 0.1024 | 163.8656 | 0.1024 | 163.8912 | 100.0% |
 * | 4194304 | 0.3909 | 171.6655 | 0.4155 | 161.5306 | 106.3% |
 * | 16777216 | 1.5503 | 173.1466 | 1.7935 | 149.6750 | 115.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sswap-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sswap-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sswap-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sswap-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sswap-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sswap-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sswap-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sswap-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sswap-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sswap-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sswap-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sswap-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sswap-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sswap-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sswap-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sswap-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sswap-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sswap-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sswap-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.8 113.4,219.7 168.7,218.6 196.4,217.6 251.8,211.2 307.2,186.9 362.5,114.3 417.9,79.1 473.3,56.1 528.6,48.3 584.0,46.9"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.6 113.4,219.3 168.7,217.2 196.4,214.4 251.8,197.2 307.2,157.9 362.5,77.8 417.9,69.2 473.3,56.1 528.6,58.5 584.0,70.3"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="186.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="114.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="79.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.1" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="197.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="157.9" r="4"/>
 * <circle class="mk2" cx="362.5" cy="77.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="69.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="56.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="58.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="70.3" r="4"/>
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
 * <svg id="bc-sswap-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sswap-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sswap-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sswap-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sswap-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sswap-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sswap-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sswap-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sswap-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sswap-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sswap-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sswap-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sswap-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sswap-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sswap-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sswap-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sswap-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sswap-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sswap-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sswap-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">2.00</text>
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
 * <polyline class="ln1" points="58.0,219.4 85.7,219.4 113.4,219.4 168.7,219.4 196.4,219.3 251.8,219.3 307.2,219.2 362.5,219.0 417.9,217.0 473.3,209.8 528.6,180.9 584.0,65.0"/>
 * <polyline class="ln2" points="58.0,219.7 85.7,219.7 113.4,219.7 168.7,219.7 196.4,219.7 251.8,219.7 307.2,219.6 362.5,219.3 417.9,217.2 473.3,209.8 528.6,178.4 584.0,40.6"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="219.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="180.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="65.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="217.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="178.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.6" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.sswap.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/benchmark.sswap.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sswap/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sswap
 */
