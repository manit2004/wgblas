/**
 * Benchmark results for snrm2 on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0189 | 0.0068 | 0.0181 | 0.0071 | 95.6% |
 * | 64 | 0.0193 | 0.0133 | 0.0178 | 0.0143 | 92.8% |
 * | 128 | 0.0189 | 0.0271 | 0.0178 | 0.0287 | 94.6% |
 * | 512 | 0.0192 | 0.1066 | 0.0179 | 0.1144 | 93.2% |
 * | 1024 | 0.0192 | 0.2128 | 0.0181 | 0.2267 | 93.9% |
 * | 4096 | 0.0190 | 0.8605 | 0.0182 | 0.8982 | 95.8% |
 * | 16384 | 0.0196 | 3.3437 | 0.0182 | 3.5930 | 93.1% |
 * | 65536 | 0.0198 | 13.2664 | 0.0179 | 14.6810 | 90.4% |
 * | 262144 | 0.0256 | 40.9089 | 0.0185 | 56.6430 | 72.2% |
 * | 1048576 | 0.0454 | 92.3042 | 0.0448 | 93.5560 | 98.7% |
 * | 4194304 | 0.1160 | 144.6711 | 0.1433 | 117.1070 | 123.5% |
 * | 16777216 | 0.4066 | 165.0456 | 0.6264 | 107.1342 | 154.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-snrm2-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-snrm2-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-snrm2-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.7 362.5,206.7 417.9,179.1 473.3,127.7 528.6,75.3 584.0,55.0"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.4 362.5,205.3 417.9,163.4 473.3,126.4 528.6,102.9 584.0,112.9"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="206.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="179.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="127.7" r="4"/>
 * <circle class="mk1" cx="528.6" cy="75.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="163.4" r="4"/>
 * <circle class="mk2" cx="473.3" cy="126.4" r="4"/>
 * <circle class="mk2" cx="528.6" cy="102.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="112.9" r="4"/>
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
 * <svg id="bc-snrm2-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-snrm2-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-snrm2-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-snrm2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-snrm2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-snrm2-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-snrm2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-snrm2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-snrm2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-snrm2-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,215.3 85.7,215.2 113.4,215.3 168.7,215.2 196.4,215.2 251.8,215.2 307.2,215.1 362.5,215.1 417.9,213.6 473.3,208.6 528.6,191.0 584.0,118.3"/>
 * <polyline class="ln2" points="58.0,215.5 85.7,215.6 113.4,215.6 168.7,215.5 196.4,215.5 251.8,215.4 307.2,215.4 362.5,215.5 417.9,215.4 473.3,208.8 528.6,184.2 584.0,63.4"/>
 * <circle class="mk1" cx="58.0" cy="215.3" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.2" r="4"/>
 * <circle class="mk1" cx="113.4" cy="215.3" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.2" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.2" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.1" r="4"/>
 * <circle class="mk1" cx="362.5" cy="215.1" r="4"/>
 * <circle class="mk1" cx="417.9" cy="213.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="208.6" r="4"/>
 * <circle class="mk1" cx="528.6" cy="191.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="118.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.5" r="4"/>
 * <circle class="mk2" cx="85.7" cy="215.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="215.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="215.5" r="4"/>
 * <circle class="mk2" cx="196.4" cy="215.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="215.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="215.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="215.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="215.4" r="4"/>
 * <circle class="mk2" cx="473.3" cy="208.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="184.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="63.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/snrm2.js) — WebGPU benchmark script
 * - [snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/snrm2.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0190 | 0.0067 | 0.0188 | 0.0068 | 98.9% |
 * | 64 | 0.0192 | 0.0133 | 0.0188 | 0.0136 | 98.0% |
 * | 128 | 0.0190 | 0.0269 | 0.0188 | 0.0273 | 98.6% |
 * | 512 | 0.0192 | 0.1067 | 0.0187 | 0.1096 | 97.3% |
 * | 1024 | 0.0190 | 0.2153 | 0.0188 | 0.2184 | 98.6% |
 * | 4096 | 0.0189 | 0.8649 | 0.0187 | 0.8752 | 98.8% |
 * | 16384 | 0.0194 | 3.3795 | 0.0181 | 3.6248 | 93.2% |
 * | 65536 | 0.0246 | 10.6667 | 0.0190 | 13.8145 | 77.2% |
 * | 262144 | 0.0426 | 24.6283 | 0.0442 | 23.7277 | 103.8% |
 * | 1048576 | 0.1104 | 37.9919 | 0.1074 | 39.0677 | 97.2% |
 * | 4194304 | 0.3783 | 44.3523 | 0.3766 | 44.5501 | 99.6% |
 *
 * <svg id="bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 88.9,219.9 119.9,219.9 181.8,219.6 212.7,219.1 274.6,216.5 336.5,206.5 398.4,177.3 460.2,121.5 522.1,68.0 584.0,42.6"/>
 * <polyline class="ln2" points="58.0,220.0 88.9,219.9 119.9,219.9 181.8,219.6 212.7,219.1 274.6,216.5 336.5,205.5 398.4,164.7 460.2,125.1 522.1,63.7 584.0,41.8"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.6" r="4"/>
 * <circle class="mk1" cx="212.7" cy="219.1" r="4"/>
 * <circle class="mk1" cx="274.6" cy="216.5" r="4"/>
 * <circle class="mk1" cx="336.5" cy="206.5" r="4"/>
 * <circle class="mk1" cx="398.4" cy="177.3" r="4"/>
 * <circle class="mk1" cx="460.2" cy="121.5" r="4"/>
 * <circle class="mk1" cx="522.1" cy="68.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="42.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.1" r="4"/>
 * <circle class="mk2" cx="274.6" cy="216.5" r="4"/>
 * <circle class="mk2" cx="336.5" cy="205.5" r="4"/>
 * <circle class="mk2" cx="398.4" cy="164.7" r="4"/>
 * <circle class="mk2" cx="460.2" cy="125.1" r="4"/>
 * <circle class="mk2" cx="522.1" cy="63.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="41.8" r="4"/>
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
 * <svg id="bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,210.5 88.9,210.4 119.9,210.5 181.8,210.4 212.7,210.5 274.6,210.5 336.5,210.3 398.4,207.7 460.2,198.7 522.1,164.8 584.0,30.9"/>
 * <polyline class="ln2" points="58.0,210.6 88.9,210.6 119.9,210.6 181.8,210.7 212.7,210.6 274.6,210.7 336.5,210.9 398.4,210.5 460.2,197.9 522.1,166.3 584.0,31.7"/>
 * <circle class="mk1" cx="58.0" cy="210.5" r="4"/>
 * <circle class="mk1" cx="88.9" cy="210.4" r="4"/>
 * <circle class="mk1" cx="119.9" cy="210.5" r="4"/>
 * <circle class="mk1" cx="181.8" cy="210.4" r="4"/>
 * <circle class="mk1" cx="212.7" cy="210.5" r="4"/>
 * <circle class="mk1" cx="274.6" cy="210.5" r="4"/>
 * <circle class="mk1" cx="336.5" cy="210.3" r="4"/>
 * <circle class="mk1" cx="398.4" cy="207.7" r="4"/>
 * <circle class="mk1" cx="460.2" cy="198.7" r="4"/>
 * <circle class="mk1" cx="522.1" cy="164.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.6" r="4"/>
 * <circle class="mk2" cx="88.9" cy="210.6" r="4"/>
 * <circle class="mk2" cx="119.9" cy="210.6" r="4"/>
 * <circle class="mk2" cx="181.8" cy="210.7" r="4"/>
 * <circle class="mk2" cx="212.7" cy="210.6" r="4"/>
 * <circle class="mk2" cx="274.6" cy="210.7" r="4"/>
 * <circle class="mk2" cx="336.5" cy="210.9" r="4"/>
 * <circle class="mk2" cx="398.4" cy="210.5" r="4"/>
 * <circle class="mk2" cx="460.2" cy="197.9" r="4"/>
 * <circle class="mk2" cx="522.1" cy="166.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="31.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0192 | 0.0067 | 0.0184 | 0.0070 | 95.1% |
 * | 64 | 0.0188 | 0.0136 | 0.0182 | 0.0141 | 96.4% |
 * | 128 | 0.0189 | 0.0271 | 0.0180 | 0.0284 | 95.5% |
 * | 512 | 0.0186 | 0.1101 | 0.0180 | 0.1137 | 96.8% |
 * | 1024 | 0.0191 | 0.2142 | 0.0184 | 0.2220 | 96.5% |
 * | 4096 | 0.0196 | 0.8373 | 0.0180 | 0.9078 | 92.2% |
 * | 16384 | 0.0276 | 2.3786 | 0.0388 | 1.6898 | 140.8% |
 * | 65536 | 0.0433 | 6.0480 | 0.0572 | 4.5868 | 131.9% |
 * | 262144 | 0.1120 | 9.3609 | 0.1213 | 8.6448 | 108.3% |
 * | 1048576 | 0.3836 | 10.9336 | 0.3888 | 10.7865 | 101.4% |
 *
 * <svg id="bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 93.1,219.8 128.1,219.5 198.3,218.2 233.3,216.4 303.5,206.0 373.6,180.4 443.7,119.2 513.9,64.0 584.0,37.8"/>
 * <polyline class="ln2" points="58.0,219.9 93.1,219.8 128.1,219.5 198.3,218.1 233.3,216.3 303.5,204.9 373.6,191.8 443.7,143.6 513.9,75.9 584.0,40.2"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.8" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk1" cx="198.3" cy="218.2" r="4"/>
 * <circle class="mk1" cx="233.3" cy="216.4" r="4"/>
 * <circle class="mk1" cx="303.5" cy="206.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="180.4" r="4"/>
 * <circle class="mk1" cx="443.7" cy="119.2" r="4"/>
 * <circle class="mk1" cx="513.9" cy="64.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="37.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.8" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="198.3" cy="218.1" r="4"/>
 * <circle class="mk2" cx="233.3" cy="216.3" r="4"/>
 * <circle class="mk2" cx="303.5" cy="204.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="191.8" r="4"/>
 * <circle class="mk2" cx="443.7" cy="143.6" r="4"/>
 * <circle class="mk2" cx="513.9" cy="75.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="40.2" r="4"/>
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
 * <svg id="bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="93.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="128.1" y="236" text-anchor="middle">128</text>
 * <text class="at" x="198.3" y="236" text-anchor="middle">512</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="303.5" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="443.7" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="513.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0M</text>
 * <polyline class="ln1" points="58.0,210.4 93.1,210.6 128.1,210.6 198.3,210.7 233.3,210.4 303.5,210.2 373.6,206.2 443.7,198.3 513.9,164.0 584.0,28.2"/>
 * <polyline class="ln2" points="58.0,210.8 93.1,210.9 128.1,211.0 198.3,211.0 233.3,210.8 303.5,211.0 373.6,200.6 443.7,191.4 513.9,159.3 584.0,25.6"/>
 * <circle class="mk1" cx="58.0" cy="210.4" r="4"/>
 * <circle class="mk1" cx="93.1" cy="210.6" r="4"/>
 * <circle class="mk1" cx="128.1" cy="210.6" r="4"/>
 * <circle class="mk1" cx="198.3" cy="210.7" r="4"/>
 * <circle class="mk1" cx="233.3" cy="210.4" r="4"/>
 * <circle class="mk1" cx="303.5" cy="210.2" r="4"/>
 * <circle class="mk1" cx="373.6" cy="206.2" r="4"/>
 * <circle class="mk1" cx="443.7" cy="198.3" r="4"/>
 * <circle class="mk1" cx="513.9" cy="164.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.8" r="4"/>
 * <circle class="mk2" cx="93.1" cy="210.9" r="4"/>
 * <circle class="mk2" cx="128.1" cy="211.0" r="4"/>
 * <circle class="mk2" cx="198.3" cy="211.0" r="4"/>
 * <circle class="mk2" cx="233.3" cy="210.8" r="4"/>
 * <circle class="mk2" cx="303.5" cy="211.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="200.6" r="4"/>
 * <circle class="mk2" cx="443.7" cy="191.4" r="4"/>
 * <circle class="mk2" cx="513.9" cy="159.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="25.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0193 | 0.1063 | 0.0174 | 0.1179 | 90.2% |
 * | 1024 | 0.0205 | 0.2000 | 0.0181 | 0.2261 | 88.5% |
 * | 4096 | 0.0225 | 0.7273 | 0.0181 | 0.9046 | 80.4% |
 * | 16384 | 0.0329 | 1.9932 | 0.0497 | 1.3187 | 151.1% |
 * | 65536 | 0.0599 | 4.3796 | 0.0738 | 3.5525 | 123.3% |
 *
 * <svg id="bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">1.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">3.0</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">5.0</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,215.7 133.1,212.0 283.4,190.9 433.7,140.3 584.0,44.8"/>
 * <polyline class="ln2" points="58.0,215.3 133.1,211.0 283.4,183.8 433.7,167.3 584.0,77.9"/>
 * <circle class="mk1" cx="58.0" cy="215.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="212.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="190.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="140.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="44.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="211.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="183.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="167.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="77.9" r="4"/>
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
 * <svg id="bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-snrm2-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,171.8 133.1,168.8 283.4,163.7 433.7,137.8 584.0,70.4"/>
 * <polyline class="ln2" points="58.0,176.5 133.1,174.8 283.4,174.8 433.7,95.8 584.0,35.5"/>
 * <circle class="mk1" cx="58.0" cy="171.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="168.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="163.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="137.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="70.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="176.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="174.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="174.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="95.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="35.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.snrm2.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/wgblas/stride.snrm2.js) — WebGPU stride-sweep benchmark script
 * - [stride.snrm2.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/snrm2/cuda/stride.snrm2.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/snrm2
 */
