/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.0744 | 0.0033 | 0.1553 | 47.9% |
 * | 64 | 0.0071 | 0.1435 | 0.0033 | 0.3062 | 46.9% |
 * | 128 | 0.0071 | 0.2883 | 0.0033 | 0.6154 | 46.8% |
 * | 512 | 0.0069 | 1.1797 | 0.0038 | 2.1333 | 55.3% |
 * | 1024 | 0.0070 | 2.3486 | 0.0035 | 4.6972 | 50.0% |
 * | 4096 | 0.0073 | 9.0220 | 0.0037 | 17.5043 | 51.5% |
 * | 16384 | 0.0081 | 32.3156 | 0.0044 | 58.9353 | 54.8% |
 * | 65536 | 0.0101 | 104.0254 | 0.0084 | 124.1212 | 83.8% |
 * | 262144 | 0.0300 | 139.5868 | 0.0308 | 136.1080 | 102.6% |
 * | 1048576 | 0.1023 | 163.9937 | 0.1138 | 147.3961 | 111.3% |
 * | 4194304 | 0.3907 | 171.7780 | 0.4607 | 145.6558 | 117.9% |
 * | 16777216 | 1.5483 | 173.3757 | 1.8104 | 148.2741 | 116.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-srot-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srot-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srot-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srot-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.7 168.7,218.8 196.4,217.7 251.8,211.0 307.2,187.7 362.5,116.0 417.9,80.4 473.3,56.0 528.6,48.2 584.0,46.6"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.7 113.4,219.4 168.7,217.9 196.4,215.3 251.8,202.5 307.2,161.1 362.5,95.9 417.9,83.9 473.3,72.6 528.6,74.3 584.0,71.7"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.0" r="4"/>
 * <circle class="mk1" cx="307.2" cy="187.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="116.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="80.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.0" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="215.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="202.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="161.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="95.9" r="4"/>
 * <circle class="mk2" cx="417.9" cy="83.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="72.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="74.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="71.7" r="4"/>
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
 * <svg id="bc-srot-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srot-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srot-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srot-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srot-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 85.7,219.3 113.4,219.3 168.7,219.3 196.4,219.3 251.8,219.3 307.2,219.2 362.5,219.0 417.9,217.0 473.3,209.8 528.6,180.9 584.0,65.2"/>
 * <polyline class="ln2" points="58.0,219.7 85.7,219.7 113.4,219.7 168.7,219.6 196.4,219.7 251.8,219.6 307.2,219.6 362.5,219.2 417.9,216.9 473.3,208.6 528.6,173.9 584.0,39.0"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="362.5" cy="219.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="180.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="65.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.2" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="208.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="173.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="39.0" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [benchmark.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/benchmark.srot.js) — WebGPU benchmark script
 * - [benchmark.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/benchmark.c) — CUDA / cuBLAS reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
