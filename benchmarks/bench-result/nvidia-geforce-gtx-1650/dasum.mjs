/**
 * Benchmark results for dasum on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0226 | 0.0113 | 0.0181 | 0.0141 | 80.4% |
 * | 64 | 0.0226 | 0.0226 | 0.0180 | 0.0285 | 79.4% |
 * | 128 | 0.0225 | 0.0456 | 0.0180 | 0.0567 | 80.4% |
 * | 512 | 0.0229 | 0.1791 | 0.0180 | 0.2272 | 78.8% |
 * | 1024 | 0.0226 | 0.3631 | 0.0180 | 0.4563 | 79.6% |
 * | 4096 | 0.0228 | 1.4402 | 0.0181 | 1.8076 | 79.7% |
 * | 16384 | 0.0237 | 5.5277 | 0.0182 | 7.2049 | 76.7% |
 * | 65536 | 0.0265 | 19.7755 | 0.0182 | 28.8705 | 68.5% |
 * | 262144 | 0.0398 | 52.7029 | 0.0347 | 60.4297 | 87.2% |
 * | 1048576 | 0.0755 | 111.1251 | 0.0772 | 108.6833 | 102.2% |
 * | 4194304 | 0.2153 | 155.8757 | 0.2365 | 141.8816 | 109.9% |
 * | 16777216 | 0.7864 | 170.6736 | 0.8782 | 152.8314 | 111.7% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-dasum-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-dasum-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.8 196.4,219.6 251.8,218.6 307.2,214.5 362.5,200.2 417.9,167.3 473.3,108.9 528.6,64.1 584.0,49.3"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,219.9 168.7,219.8 196.4,219.5 251.8,218.2 307.2,212.8 362.5,191.1 417.9,159.6 473.3,111.3 528.6,78.1 584.0,67.2"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="214.5" r="4"/>
 * <circle class="mk1" cx="362.5" cy="200.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="167.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="108.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="64.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="218.2" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="191.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="159.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="111.3" r="4"/>
 * <circle class="mk2" cx="528.6" cy="78.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="67.2" r="4"/>
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
 * <svg id="bc-dasum-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-dasum-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.00</text>
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
 * <polyline class="ln1" points="58.0,215.5 85.7,215.5 113.4,215.5 168.7,215.4 196.4,215.5 251.8,215.4 307.2,215.3 362.5,214.7 417.9,212.0 473.3,204.9 528.6,176.9 584.0,62.7"/>
 * <polyline class="ln2" points="58.0,216.4 85.7,216.4 113.4,216.4 168.7,216.4 196.4,216.4 251.8,216.4 307.2,216.4 362.5,216.4 417.9,213.1 473.3,204.6 528.6,172.7 584.0,44.4"/>
 * <circle class="mk1" cx="58.0" cy="215.5" r="4"/>
 * <circle class="mk1" cx="85.7" cy="215.5" r="4"/>
 * <circle class="mk1" cx="113.4" cy="215.5" r="4"/>
 * <circle class="mk1" cx="168.7" cy="215.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="215.5" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="215.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="214.7" r="4"/>
 * <circle class="mk1" cx="417.9" cy="212.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="204.9" r="4"/>
 * <circle class="mk1" cx="528.6" cy="176.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="62.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="216.4" r="4"/>
 * <circle class="mk2" cx="113.4" cy="216.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="216.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="216.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="216.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="213.1" r="4"/>
 * <circle class="mk2" cx="473.3" cy="204.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="172.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="44.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/dasum.js) — WebGPU benchmark script
 * - [dasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/cuda/dasum.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately.
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 4
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0225 | 0.0114 | 0.0184 | 0.0139 | 81.8% |
 * | 64 | 0.0225 | 0.0228 | 0.0187 | 0.0274 | 83.2% |
 * | 128 | 0.0221 | 0.0464 | 0.0190 | 0.0538 | 86.2% |
 * | 512 | 0.0222 | 0.1843 | 0.0189 | 0.2166 | 85.1% |
 * | 1024 | 0.0220 | 0.3724 | 0.0180 | 0.4539 | 82.0% |
 * | 4096 | 0.0226 | 1.4484 | 0.0181 | 1.8140 | 79.8% |
 * | 16384 | 0.0254 | 5.1652 | 0.0187 | 7.0197 | 73.6% |
 * | 65536 | 0.0379 | 13.8262 | 0.0314 | 16.6843 | 82.9% |
 * | 262144 | 0.0716 | 29.2702 | 0.0642 | 32.6700 | 89.6% |
 * | 1048576 | 0.2061 | 40.6961 | 0.1993 | 42.0811 | 96.7% |
 * | 4194304 | 0.7434 | 45.1389 | 0.7347 | 45.6697 | 98.8% |
 *
 * <svg id="bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 88.9,219.9 119.9,219.8 181.8,219.3 212.7,218.5 274.6,214.2 336.5,199.3 398.4,164.7 460.2,102.9 522.1,57.2 584.0,39.4"/>
 * <polyline class="ln2" points="58.0,219.9 88.9,219.9 119.9,219.8 181.8,219.1 212.7,218.2 274.6,212.7 336.5,191.9 398.4,153.3 460.2,89.3 522.1,51.7 584.0,37.3"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.8" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.3" r="4"/>
 * <circle class="mk1" cx="212.7" cy="218.5" r="4"/>
 * <circle class="mk1" cx="274.6" cy="214.2" r="4"/>
 * <circle class="mk1" cx="336.5" cy="199.3" r="4"/>
 * <circle class="mk1" cx="398.4" cy="164.7" r="4"/>
 * <circle class="mk1" cx="460.2" cy="102.9" r="4"/>
 * <circle class="mk1" cx="522.1" cy="57.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="39.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.8" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="212.7" cy="218.2" r="4"/>
 * <circle class="mk2" cx="274.6" cy="212.7" r="4"/>
 * <circle class="mk2" cx="336.5" cy="191.9" r="4"/>
 * <circle class="mk2" cx="398.4" cy="153.3" r="4"/>
 * <circle class="mk2" cx="460.2" cy="89.3" r="4"/>
 * <circle class="mk2" cx="522.1" cy="51.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="37.3" r="4"/>
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
 * <svg id="bc-dasum-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,214.4 88.9,214.4 119.9,214.5 181.8,214.4 212.7,214.5 274.6,214.3 336.5,213.7 398.4,210.5 460.2,202.1 522.1,168.5 584.0,34.2"/>
 * <polyline class="ln2" points="58.0,215.4 88.9,215.3 119.9,215.2 181.8,215.3 212.7,215.5 274.6,215.5 336.5,215.3 398.4,212.2 460.2,204.0 522.1,170.2 584.0,36.3"/>
 * <circle class="mk1" cx="58.0" cy="214.4" r="4"/>
 * <circle class="mk1" cx="88.9" cy="214.4" r="4"/>
 * <circle class="mk1" cx="119.9" cy="214.5" r="4"/>
 * <circle class="mk1" cx="181.8" cy="214.4" r="4"/>
 * <circle class="mk1" cx="212.7" cy="214.5" r="4"/>
 * <circle class="mk1" cx="274.6" cy="214.3" r="4"/>
 * <circle class="mk1" cx="336.5" cy="213.7" r="4"/>
 * <circle class="mk1" cx="398.4" cy="210.5" r="4"/>
 * <circle class="mk1" cx="460.2" cy="202.1" r="4"/>
 * <circle class="mk1" cx="522.1" cy="168.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="34.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.4" r="4"/>
 * <circle class="mk2" cx="88.9" cy="215.3" r="4"/>
 * <circle class="mk2" cx="119.9" cy="215.2" r="4"/>
 * <circle class="mk2" cx="181.8" cy="215.3" r="4"/>
 * <circle class="mk2" cx="212.7" cy="215.5" r="4"/>
 * <circle class="mk2" cx="274.6" cy="215.5" r="4"/>
 * <circle class="mk2" cx="336.5" cy="215.3" r="4"/>
 * <circle class="mk2" cx="398.4" cy="212.2" r="4"/>
 * <circle class="mk2" cx="460.2" cy="204.0" r="4"/>
 * <circle class="mk2" cx="522.1" cy="170.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.3" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 32
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0228 | 0.0112 | 0.0182 | 0.0141 | 79.5% |
 * | 64 | 0.0228 | 0.0224 | 0.0181 | 0.0282 | 79.5% |
 * | 128 | 0.0225 | 0.0455 | 0.0180 | 0.0569 | 79.9% |
 * | 512 | 0.0228 | 0.1799 | 0.0173 | 0.2370 | 75.9% |
 * | 1024 | 0.0225 | 0.3642 | 0.0179 | 0.4580 | 79.5% |
 * | 4096 | 0.0279 | 1.1757 | 0.0179 | 1.8286 | 64.3% |
 * | 16384 | 0.0408 | 3.2151 | 0.0211 | 6.2249 | 51.6% |
 * | 65536 | 0.0743 | 7.0590 | 0.0393 | 13.3420 | 52.9% |
 * | 262144 | 0.2141 | 9.7939 | 0.1064 | 19.7071 | 49.7% |
 *
 * <svg id="bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">20</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="98.5" y="236" text-anchor="middle">64</text>
 * <text class="at" x="138.9" y="236" text-anchor="middle">128</text>
 * <text class="at" x="219.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="260.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="341.2" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="422.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="503.1" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">262K</text>
 * <polyline class="ln1" points="58.0,219.9 98.5,219.8 138.9,219.5 219.8,218.2 260.3,216.4 341.2,208.2 422.2,187.8 503.1,149.4 584.0,122.1"/>
 * <polyline class="ln2" points="58.0,219.9 98.5,219.7 138.9,219.4 219.8,217.6 260.3,215.4 341.2,201.7 422.2,157.8 503.1,86.6 584.0,22.9"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="98.5" cy="219.8" r="4"/>
 * <circle class="mk1" cx="138.9" cy="219.5" r="4"/>
 * <circle class="mk1" cx="219.8" cy="218.2" r="4"/>
 * <circle class="mk1" cx="260.3" cy="216.4" r="4"/>
 * <circle class="mk1" cx="341.2" cy="208.2" r="4"/>
 * <circle class="mk1" cx="422.2" cy="187.8" r="4"/>
 * <circle class="mk1" cx="503.1" cy="149.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="122.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="98.5" cy="219.7" r="4"/>
 * <circle class="mk2" cx="138.9" cy="219.4" r="4"/>
 * <circle class="mk2" cx="219.8" cy="217.6" r="4"/>
 * <circle class="mk2" cx="260.3" cy="215.4" r="4"/>
 * <circle class="mk2" cx="341.2" cy="201.7" r="4"/>
 * <circle class="mk2" cx="422.2" cy="157.8" r="4"/>
 * <circle class="mk2" cx="503.1" cy="86.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="22.9" r="4"/>
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
 * <svg id="bc-dasum-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="98.5" y="236" text-anchor="middle">64</text>
 * <text class="at" x="138.9" y="236" text-anchor="middle">128</text>
 * <text class="at" x="219.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="260.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="341.2" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="422.2" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="503.1" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">262K</text>
 * <polyline class="ln1" points="58.0,201.7 98.5,201.7 138.9,202.0 219.8,201.8 260.3,202.0 341.2,197.7 422.2,187.4 503.1,160.6 584.0,48.7"/>
 * <polyline class="ln2" points="58.0,205.4 98.5,205.5 138.9,205.6 219.8,206.2 260.3,205.7 341.2,205.7 422.2,203.1 503.1,188.6 584.0,134.9"/>
 * <circle class="mk1" cx="58.0" cy="201.7" r="4"/>
 * <circle class="mk1" cx="98.5" cy="201.7" r="4"/>
 * <circle class="mk1" cx="138.9" cy="202.0" r="4"/>
 * <circle class="mk1" cx="219.8" cy="201.8" r="4"/>
 * <circle class="mk1" cx="260.3" cy="202.0" r="4"/>
 * <circle class="mk1" cx="341.2" cy="197.7" r="4"/>
 * <circle class="mk1" cx="422.2" cy="187.4" r="4"/>
 * <circle class="mk1" cx="503.1" cy="160.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="205.4" r="4"/>
 * <circle class="mk2" cx="98.5" cy="205.5" r="4"/>
 * <circle class="mk2" cx="138.9" cy="205.6" r="4"/>
 * <circle class="mk2" cx="219.8" cy="206.2" r="4"/>
 * <circle class="mk2" cx="260.3" cy="205.7" r="4"/>
 * <circle class="mk2" cx="341.2" cy="205.7" r="4"/>
 * <circle class="mk2" cx="422.2" cy="203.1" r="4"/>
 * <circle class="mk2" cx="503.1" cy="188.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.9" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 256
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0299 | 0.1371 | 0.0181 | 0.2261 | 60.6% |
 * | 1024 | 0.0303 | 0.2705 | 0.0175 | 0.4693 | 57.6% |
 * | 4096 | 0.0336 | 0.9743 | 0.0180 | 1.8253 | 53.4% |
 * | 16384 | 0.0508 | 2.5810 | 0.0221 | 5.9362 | 43.5% |
 * | 65536 | 0.1176 | 4.4594 | 0.0503 | 10.4257 | 42.8% |
 *
 * <svg id="bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,217.7 133.1,215.5 283.4,203.8 433.7,177.0 584.0,145.7"/>
 * <polyline class="ln2" points="58.0,216.2 133.1,212.2 283.4,189.6 433.7,121.1 584.0,46.2"/>
 * <circle class="mk1" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="177.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="145.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="212.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="189.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="121.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="46.2" r="4"/>
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
 * <svg id="bc-dasum-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-dasum-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.0200</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.0400</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.0600</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.0800</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.120</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,170.2 133.1,169.5 283.4,163.9 433.7,135.4 584.0,24.1"/>
 * <polyline class="ln2" points="58.0,189.8 133.1,190.8 283.4,190.0 433.7,183.2 584.0,136.2"/>
 * <circle class="mk1" cx="58.0" cy="170.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="169.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="163.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="135.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="24.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="189.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="190.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="190.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="183.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="136.2" r="4"/>
 * </svg>
 *
 * **See also:**
 *
 * - [stride.dasum.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/wgblas/stride.dasum.js) — WebGPU stride-sweep benchmark script
 * - [stride.dasum.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/dasum/cuda/stride.dasum.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/dasum
 */
