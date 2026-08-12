/**
 * Benchmark results for sasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0186 | 0.0069 | 0.0176 | 0.0073 | 94.1% |
 * | 64 | 0.0189 | 0.0135 | 0.0186 | 0.0138 | 97.9% |
 * | 128 | 0.0186 | 0.0275 | 0.0182 | 0.0281 | 97.8% |
 * | 512 | 0.0191 | 0.1074 | 0.0182 | 0.1126 | 95.4% |
 * | 1024 | 0.0190 | 0.2157 | 0.0176 | 0.2327 | 92.7% |
 * | 4096 | 0.0192 | 0.8533 | 0.0179 | 0.9159 | 93.2% |
 * | 16384 | 0.0197 | 3.3328 | 0.0179 | 3.6571 | 91.1% |
 * | 65536 | 0.0198 | 13.2557 | 0.0185 | 14.1608 | 93.6% |
 * | 262144 | 0.0257 | 40.8324 | 0.0191 | 54.9799 | 74.3% |
 * | 1048576 | 0.0453 | 92.6631 | 0.0432 | 97.0185 | 95.5% |
 * | 4194304 | 0.1161 | 144.5514 | 0.1312 | 127.9063 | 113.0% |
 * | 16777216 | 0.4064 | 165.1171 | 0.5340 | 125.6796 | 131.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.7 362.5,206.7 417.9,179.2 473.3,127.3 528.6,75.4 584.0,54.9"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.3 362.5,205.8 417.9,165.0 473.3,123.0 528.6,92.1 584.0,94.3"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="206.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="179.2" r="4"/>
 * <circle class="mk1" cx="473.3" cy="127.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="75.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="54.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="165.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="123.0" r="4"/>
 * <circle class="mk2" cx="528.6" cy="92.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="94.3" r="4"/>
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
 * <svg id="bc-sasum-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.300</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.600</text>
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
 * <polyline class="ln1" points="58.0,213.8 85.7,213.7 113.4,213.8 168.7,213.6 196.4,213.7 251.8,213.6 307.2,213.4 362.5,213.4 417.9,211.4 473.3,204.9 528.6,181.3 584.0,84.5"/>
 * <polyline class="ln2" points="58.0,214.1 85.7,213.8 113.4,213.9 168.7,213.9 196.4,214.1 251.8,214.0 307.2,214.0 362.5,213.8 417.9,213.6 473.3,205.6 528.6,176.3 584.0,42.0"/>
 * <circle class="mk1" cx="58.0" cy="213.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="213.7" r="4"/>
 * <circle class="mk1" cx="113.4" cy="213.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="213.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="213.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="213.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="213.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="211.4" r="4"/>
 * <circle class="mk1" cx="473.3" cy="204.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="181.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="84.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="214.1" r="4"/>
 * <circle class="mk2" cx="85.7" cy="213.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="213.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="213.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.1" r="4"/>
 * <circle class="mk2" cx="251.8" cy="214.0" r="4"/>
 * <circle class="mk2" cx="307.2" cy="214.0" r="4"/>
 * <circle class="mk2" cx="362.5" cy="213.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="205.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="176.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="42.0" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/sasum.js) — WebGPU benchmark script
 * - [sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/sasum.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately, collapsed below by default — expand a stride to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 4</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0189 | 0.0068 | 0.0181 | 0.0071 | 95.4% |
 * | 64 | 0.0193 | 0.0132 | 0.0177 | 0.0145 | 91.3% |
 * | 128 | 0.0189 | 0.0271 | 0.0179 | 0.0286 | 94.7% |
 * | 512 | 0.0193 | 0.1059 | 0.0179 | 0.1143 | 92.6% |
 * | 1024 | 0.0192 | 0.2130 | 0.0179 | 0.2286 | 93.2% |
 * | 4096 | 0.0193 | 0.8484 | 0.0182 | 0.9014 | 94.1% |
 * | 16384 | 0.0201 | 3.2534 | 0.0180 | 3.6312 | 89.6% |
 * | 65536 | 0.0248 | 10.5635 | 0.0182 | 14.4225 | 73.2% |
 * | 262144 | 0.0430 | 24.3810 | 0.0358 | 29.3226 | 83.1% |
 * | 1048576 | 0.1104 | 37.9864 | 0.1050 | 39.9366 | 95.1% |
 * | 4194304 | 0.3788 | 44.2942 | 0.3729 | 44.9936 | 98.4% |
 *
 * <svg id="bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">40</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">50</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="88.9" y="236" text-anchor="middle">64</text>
 * <text class="at" x="119.9" y="236" text-anchor="middle">128</text>
 * <text class="at" x="181.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="212.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="274.6" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="336.5" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="398.4" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="460.2" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="522.1" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.2M</text>
 * <polyline class="ln1" points="58.0,220.0 88.9,219.9 119.9,219.9 181.8,219.6 212.7,219.1 274.6,216.6 336.5,207.0 398.4,177.7 460.2,122.5 522.1,68.1 584.0,42.8"/>
 * <polyline class="ln2" points="58.0,220.0 88.9,219.9 119.9,219.9 181.8,219.5 212.7,219.1 274.6,216.4 336.5,205.5 398.4,162.3 460.2,102.7 522.1,60.3 584.0,40.0"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.6" r="4"/>
 * <circle class="mk1" cx="212.7" cy="219.1" r="4"/>
 * <circle class="mk1" cx="274.6" cy="216.6" r="4"/>
 * <circle class="mk1" cx="336.5" cy="207.0" r="4"/>
 * <circle class="mk1" cx="398.4" cy="177.7" r="4"/>
 * <circle class="mk1" cx="460.2" cy="122.5" r="4"/>
 * <circle class="mk1" cx="522.1" cy="68.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="42.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.5" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.1" r="4"/>
 * <circle class="mk2" cx="274.6" cy="216.4" r="4"/>
 * <circle class="mk2" cx="336.5" cy="205.5" r="4"/>
 * <circle class="mk2" cx="398.4" cy="162.3" r="4"/>
 * <circle class="mk2" cx="460.2" cy="102.7" r="4"/>
 * <circle class="mk2" cx="522.1" cy="60.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.0" r="4"/>
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
 * <svg id="bc-sasum-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="88.9" y="236" text-anchor="middle">64</text>
 * <text class="at" x="119.9" y="236" text-anchor="middle">128</text>
 * <text class="at" x="181.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="212.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="274.6" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="336.5" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="398.4" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="460.2" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="522.1" y="236" text-anchor="middle">1.0M</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.2M</text>
 * <polyline class="ln1" points="58.0,210.6 88.9,210.3 119.9,210.5 181.8,210.3 212.7,210.4 274.6,210.3 336.5,209.9 398.4,207.6 460.2,198.5 522.1,164.8 584.0,30.6"/>
 * <polyline class="ln2" points="58.0,210.9 88.9,211.2 119.9,211.1 181.8,211.1 212.7,211.1 274.6,210.9 336.5,211.0 398.4,210.9 460.2,202.1 522.1,167.5 584.0,33.5"/>
 * <circle class="mk1" cx="58.0" cy="210.6" r="4"/>
 * <circle class="mk1" cx="88.9" cy="210.3" r="4"/>
 * <circle class="mk1" cx="119.9" cy="210.5" r="4"/>
 * <circle class="mk1" cx="181.8" cy="210.3" r="4"/>
 * <circle class="mk1" cx="212.7" cy="210.4" r="4"/>
 * <circle class="mk1" cx="274.6" cy="210.3" r="4"/>
 * <circle class="mk1" cx="336.5" cy="209.9" r="4"/>
 * <circle class="mk1" cx="398.4" cy="207.6" r="4"/>
 * <circle class="mk1" cx="460.2" cy="198.5" r="4"/>
 * <circle class="mk1" cx="522.1" cy="164.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.9" r="4"/>
 * <circle class="mk2" cx="88.9" cy="211.2" r="4"/>
 * <circle class="mk2" cx="119.9" cy="211.1" r="4"/>
 * <circle class="mk2" cx="181.8" cy="211.1" r="4"/>
 * <circle class="mk2" cx="212.7" cy="211.1" r="4"/>
 * <circle class="mk2" cx="274.6" cy="210.9" r="4"/>
 * <circle class="mk2" cx="336.5" cy="211.0" r="4"/>
 * <circle class="mk2" cx="398.4" cy="210.9" r="4"/>
 * <circle class="mk2" cx="460.2" cy="202.1" r="4"/>
 * <circle class="mk2" cx="522.1" cy="167.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0190 | 0.0068 | 0.0180 | 0.0071 | 95.1% |
 * | 64 | 0.0193 | 0.0133 | 0.0182 | 0.0141 | 94.0% |
 * | 128 | 0.0192 | 0.0266 | 0.0181 | 0.0282 | 94.4% |
 * | 512 | 0.0189 | 0.1082 | 0.0181 | 0.1131 | 95.7% |
 * | 1024 | 0.0189 | 0.2164 | 0.0181 | 0.2265 | 95.5% |
 * | 4096 | 0.0196 | 0.8366 | 0.0180 | 0.9110 | 91.8% |
 * | 16384 | 0.0273 | 2.3981 | 0.0210 | 3.1148 | 77.0% |
 * | 65536 | 0.0432 | 6.0681 | 0.0394 | 6.6602 | 91.1% |
 * | 262144 | 0.1155 | 9.0758 | 0.1069 | 9.8064 | 92.5% |
 * | 1048576 | 0.4003 | 10.4778 | 0.3748 | 11.1917 | 93.6% |
 *
 * <svg id="bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">6.0</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">8.0</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">10</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">12</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="93.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="128.1" y="236" text-anchor="middle">128</text>
 * <text class="at" x="198.3" y="236" text-anchor="middle">512</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="303.5" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="443.7" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="513.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0M</text>
 * <polyline class="ln1" points="58.0,219.9 93.1,219.8 128.1,219.6 198.3,218.2 233.3,216.4 303.5,206.1 373.6,180.0 443.7,118.9 513.9,68.7 584.0,45.4"/>
 * <polyline class="ln2" points="58.0,219.9 93.1,219.8 128.1,219.5 198.3,218.1 233.3,216.2 303.5,204.8 373.6,168.1 443.7,109.0 513.9,56.6 584.0,33.5"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.8" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.6" r="4"/>
 * <circle class="mk1" cx="198.3" cy="218.2" r="4"/>
 * <circle class="mk1" cx="233.3" cy="216.4" r="4"/>
 * <circle class="mk1" cx="303.5" cy="206.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="180.0" r="4"/>
 * <circle class="mk1" cx="443.7" cy="118.9" r="4"/>
 * <circle class="mk1" cx="513.9" cy="68.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.8" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="198.3" cy="218.1" r="4"/>
 * <circle class="mk2" cx="233.3" cy="216.2" r="4"/>
 * <circle class="mk2" cx="303.5" cy="204.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="168.1" r="4"/>
 * <circle class="mk2" cx="443.7" cy="109.0" r="4"/>
 * <circle class="mk2" cx="513.9" cy="56.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.5" r="4"/>
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
 * <svg id="bc-sasum-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="93.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="128.1" y="236" text-anchor="middle">128</text>
 * <text class="at" x="198.3" y="236" text-anchor="middle">512</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="303.5" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="443.7" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="513.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0M</text>
 * <polyline class="ln1" points="58.0,212.4 93.1,212.3 128.1,212.3 198.3,212.4 233.3,212.4 303.5,212.2 373.6,209.1 443.7,202.7 513.9,173.8 584.0,59.9"/>
 * <polyline class="ln2" points="58.0,212.8 93.1,212.7 128.1,212.8 198.3,212.8 233.3,212.8 303.5,212.8 373.6,211.6 443.7,204.2 513.9,177.2 584.0,70.1"/>
 * <circle class="mk1" cx="58.0" cy="212.4" r="4"/>
 * <circle class="mk1" cx="93.1" cy="212.3" r="4"/>
 * <circle class="mk1" cx="128.1" cy="212.3" r="4"/>
 * <circle class="mk1" cx="198.3" cy="212.4" r="4"/>
 * <circle class="mk1" cx="233.3" cy="212.4" r="4"/>
 * <circle class="mk1" cx="303.5" cy="212.2" r="4"/>
 * <circle class="mk1" cx="373.6" cy="209.1" r="4"/>
 * <circle class="mk1" cx="443.7" cy="202.7" r="4"/>
 * <circle class="mk1" cx="513.9" cy="173.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="59.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="212.8" r="4"/>
 * <circle class="mk2" cx="93.1" cy="212.7" r="4"/>
 * <circle class="mk2" cx="128.1" cy="212.8" r="4"/>
 * <circle class="mk2" cx="198.3" cy="212.8" r="4"/>
 * <circle class="mk2" cx="233.3" cy="212.8" r="4"/>
 * <circle class="mk2" cx="303.5" cy="212.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="211.6" r="4"/>
 * <circle class="mk2" cx="443.7" cy="204.2" r="4"/>
 * <circle class="mk2" cx="513.9" cy="177.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="70.1" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0270 | 0.0758 | 0.0180 | 0.1135 | 66.8% |
 * | 1024 | 0.0276 | 0.1485 | 0.0174 | 0.2357 | 63.0% |
 * | 4096 | 0.0286 | 0.5730 | 0.0177 | 0.9250 | 61.9% |
 * | 16384 | 0.0384 | 1.7067 | 0.0215 | 3.0544 | 55.9% |
 * | 65536 | 0.0652 | 4.0196 | 0.0500 | 5.2429 | 76.7% |
 *
 * <svg id="bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">1.0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">3.0</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">6.0</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,217.5 133.1,215.1 283.4,200.9 433.7,163.1 584.0,86.0"/>
 * <polyline class="ln2" points="58.0,216.2 133.1,212.1 283.4,189.2 433.7,118.2 584.0,45.2"/>
 * <circle class="mk1" cx="58.0" cy="217.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="200.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="163.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="86.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="212.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="189.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="118.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="45.2" r="4"/>
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
 * <svg id="bc-sasum-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sasum-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.0200</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.0400</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.0600</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.0800</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,152.5 133.1,151.0 283.4,148.5 433.7,124.0 584.0,57.0"/>
 * <polyline class="ln2" points="58.0,175.0 133.1,176.5 283.4,175.8 433.7,166.2 584.0,95.0"/>
 * <circle class="mk1" cx="58.0" cy="152.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="151.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="148.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="124.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="175.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="176.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="175.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="166.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="95.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/wgblas/stride.sasum.js) — WebGPU stride-sweep benchmark script
 * - [stride.sasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sasum/cuda/stride.sasum.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sasum
 */
