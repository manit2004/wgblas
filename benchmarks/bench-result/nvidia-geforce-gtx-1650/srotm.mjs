/**
 * Benchmark results for srotm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0842 | 0.0029 | 0.1778 | 47.4% |
 * | 64 | 0.0061 | 0.1667 | 0.0028 | 0.3657 | 45.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0028 | 0.7314 | 45.6% |
 * | 512 | 0.0061 | 1.3333 | 0.0029 | 2.8132 | 47.4% |
 * | 1024 | 0.0061 | 2.6667 | 0.0029 | 5.6264 | 47.4% |
 * | 4096 | 0.0061 | 10.6667 | 0.0031 | 21.3333 | 50.0% |
 * | 16384 | 0.0069 | 38.0139 | 0.0039 | 67.4239 | 56.4% |
 * | 65536 | 0.0085 | 123.6528 | 0.0072 | 145.6356 | 84.9% |
 * | 262144 | 0.0289 | 145.3126 | 0.0274 | 153.1215 | 94.9% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1008 | 166.5199 | 98.4% |
 * | 4194304 | 0.3963 | 169.3437 | 0.3936 | 170.4863 | 99.3% |
 * | 16777216 | 1.5601 | 172.0617 | 1.5664 | 171.3692 | 100.4% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.8 113.4,219.7 168.7,218.7 196.4,217.3 251.8,209.3 307.2,182.0 362.5,96.3 417.9,74.7 473.3,56.2 528.6,50.7 584.0,47.9"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.6 113.4,219.3 168.7,217.2 196.4,214.4 251.8,198.7 307.2,152.6 362.5,74.4 417.9,66.9 473.3,53.5 528.6,49.5 584.0,48.6"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="209.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="182.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="96.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="74.7" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="50.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="47.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="214.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="198.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="152.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="74.4" r="4"/>
 * <circle class="mk2" cx="417.9" cy="66.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="53.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="49.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.6" r="4"/>
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
 * <svg id="bc-srotm-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srotm-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.4 85.7,219.4 113.4,219.4 168.7,219.4 196.4,219.4 251.8,219.4 307.2,219.3 362.5,219.2 417.9,217.1 473.3,209.8 528.6,180.4 584.0,64.0"/>
 * <polyline class="ln2" points="58.0,219.7 85.7,219.7 113.4,219.7 168.7,219.7 196.4,219.7 251.8,219.7 307.2,219.6 362.5,219.3 417.9,217.3 473.3,209.9 528.6,180.6 584.0,63.4"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.4" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk1" cx="362.5" cy="219.2" r="4"/>
 * <circle class="mk1" cx="417.9" cy="217.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="180.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="64.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="217.3" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="180.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="63.4" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/srotm.js) — WebGPU benchmark script
 * - [srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/srotm.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately.
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 4
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0031 | 0.1633 | 51.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0029 | 0.3536 | 47.1% |
 * | 128 | 0.0061 | 0.3333 | 0.0037 | 0.5590 | 59.6% |
 * | 512 | 0.0061 | 1.3333 | 0.0032 | 2.5347 | 52.6% |
 * | 1024 | 0.0061 | 2.6667 | 0.0035 | 4.7407 | 56.3% |
 * | 4096 | 0.0066 | 9.8937 | 0.0038 | 17.3559 | 57.0% |
 * | 16384 | 0.0085 | 30.6816 | 0.0054 | 48.9075 | 62.7% |
 * | 65536 | 0.0304 | 34.5290 | 0.0270 | 38.8707 | 88.8% |
 * | 262144 | 0.1024 | 40.9600 | 0.1005 | 41.7360 | 98.1% |
 * | 1048576 | 0.3921 | 42.7833 | 0.3950 | 42.4765 | 100.7% |
 * | 4194304 | 1.5442 | 43.4589 | 1.5708 | 42.7240 | 101.7% |
 *
 * <svg id="bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.7 88.9,219.3 119.9,218.7 181.8,214.7 212.7,209.3 274.6,180.4 336.5,97.3 398.4,81.9 460.2,56.2 522.1,48.9 584.0,46.2"/>
 * <polyline class="ln2" points="58.0,219.3 88.9,218.6 119.9,217.8 181.8,209.9 212.7,201.0 274.6,150.6 336.5,24.4 398.4,64.5 460.2,53.1 522.1,50.1 584.0,49.1"/>
 * <circle class="mk1" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.3" r="4"/>
 * <circle class="mk1" cx="119.9" cy="218.7" r="4"/>
 * <circle class="mk1" cx="181.8" cy="214.7" r="4"/>
 * <circle class="mk1" cx="212.7" cy="209.3" r="4"/>
 * <circle class="mk1" cx="274.6" cy="180.4" r="4"/>
 * <circle class="mk1" cx="336.5" cy="97.3" r="4"/>
 * <circle class="mk1" cx="398.4" cy="81.9" r="4"/>
 * <circle class="mk1" cx="460.2" cy="56.2" r="4"/>
 * <circle class="mk1" cx="522.1" cy="48.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="88.9" cy="218.6" r="4"/>
 * <circle class="mk2" cx="119.9" cy="217.8" r="4"/>
 * <circle class="mk2" cx="181.8" cy="209.9" r="4"/>
 * <circle class="mk2" cx="212.7" cy="201.0" r="4"/>
 * <circle class="mk2" cx="274.6" cy="150.6" r="4"/>
 * <circle class="mk2" cx="336.5" cy="24.4" r="4"/>
 * <circle class="mk2" cx="398.4" cy="64.5" r="4"/>
 * <circle class="mk2" cx="460.2" cy="53.1" r="4"/>
 * <circle class="mk2" cx="522.1" cy="50.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="49.1" r="4"/>
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
 * <svg id="bc-srotm-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.4 88.9,219.4 119.9,219.4 181.8,219.4 212.7,219.4 274.6,219.3 336.5,219.1 398.4,217.0 460.2,209.8 522.1,180.8 584.0,65.6"/>
 * <polyline class="ln2" points="58.0,219.7 88.9,219.7 119.9,219.6 181.8,219.7 212.7,219.7 274.6,219.6 336.5,219.5 398.4,217.3 460.2,209.9 522.1,180.5 584.0,62.9"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.4" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.4" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.4" r="4"/>
 * <circle class="mk1" cx="212.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="274.6" cy="219.3" r="4"/>
 * <circle class="mk1" cx="336.5" cy="219.1" r="4"/>
 * <circle class="mk1" cx="398.4" cy="217.0" r="4"/>
 * <circle class="mk1" cx="460.2" cy="209.8" r="4"/>
 * <circle class="mk1" cx="522.1" cy="180.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="65.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.7" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.6" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="274.6" cy="219.6" r="4"/>
 * <circle class="mk2" cx="336.5" cy="219.5" r="4"/>
 * <circle class="mk2" cx="398.4" cy="217.3" r="4"/>
 * <circle class="mk2" cx="460.2" cy="209.9" r="4"/>
 * <circle class="mk2" cx="522.1" cy="180.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="62.9" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 32
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0032 | 0.1616 | 51.6% |
 * | 64 | 0.0061 | 0.1667 | 0.0032 | 0.3168 | 52.6% |
 * | 128 | 0.0061 | 0.3333 | 0.0037 | 0.5590 | 59.6% |
 * | 512 | 0.0065 | 1.2611 | 0.0040 | 2.0645 | 61.1% |
 * | 1024 | 0.0067 | 2.4498 | 0.0040 | 4.0960 | 59.8% |
 * | 4096 | 0.0099 | 6.6278 | 0.0058 | 11.2527 | 58.9% |
 * | 16384 | 0.0362 | 7.2367 | 0.0348 | 7.5294 | 96.1% |
 * | 65536 | 0.1331 | 7.8769 | 0.1340 | 7.8243 | 100.7% |
 * | 262144 | 0.5156 | 8.1348 | 0.5330 | 7.8694 | 103.4% |
 * | 1048576 | 2.1496 | 7.8049 | 2.1507 | 7.8007 | 100.1% |
 *
 * <svg id="bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 93.1,217.2 128.1,214.4 198.3,199.0 233.3,179.2 303.5,109.5 373.6,99.4 443.7,88.7 513.9,84.4 584.0,89.9"/>
 * <polyline class="ln2" points="58.0,217.3 93.1,214.7 128.1,210.7 198.3,185.6 233.3,151.7 303.5,32.5 373.6,94.5 443.7,89.6 513.9,88.8 584.0,90.0"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="93.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="128.1" cy="214.4" r="4"/>
 * <circle class="mk1" cx="198.3" cy="199.0" r="4"/>
 * <circle class="mk1" cx="233.3" cy="179.2" r="4"/>
 * <circle class="mk1" cx="303.5" cy="109.5" r="4"/>
 * <circle class="mk1" cx="373.6" cy="99.4" r="4"/>
 * <circle class="mk1" cx="443.7" cy="88.7" r="4"/>
 * <circle class="mk1" cx="513.9" cy="84.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="89.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.3" r="4"/>
 * <circle class="mk2" cx="93.1" cy="214.7" r="4"/>
 * <circle class="mk2" cx="128.1" cy="210.7" r="4"/>
 * <circle class="mk2" cx="198.3" cy="185.6" r="4"/>
 * <circle class="mk2" cx="233.3" cy="151.7" r="4"/>
 * <circle class="mk2" cx="303.5" cy="32.5" r="4"/>
 * <circle class="mk2" cx="373.6" cy="94.5" r="4"/>
 * <circle class="mk2" cx="443.7" cy="89.6" r="4"/>
 * <circle class="mk2" cx="513.9" cy="88.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="90.0" r="4"/>
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
 * <svg id="bc-srotm-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">2.50</text>
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
 * <polyline class="ln1" points="58.0,219.5 93.1,219.5 128.1,219.5 198.3,219.5 233.3,219.5 303.5,219.2 373.6,217.1 443.7,209.4 513.9,178.8 584.0,48.0"/>
 * <polyline class="ln2" points="58.0,219.7 93.1,219.7 128.1,219.7 198.3,219.7 233.3,219.7 303.5,219.5 373.6,217.2 443.7,209.3 513.9,177.4 584.0,47.9"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.5" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk1" cx="198.3" cy="219.5" r="4"/>
 * <circle class="mk1" cx="233.3" cy="219.5" r="4"/>
 * <circle class="mk1" cx="303.5" cy="219.2" r="4"/>
 * <circle class="mk1" cx="373.6" cy="217.1" r="4"/>
 * <circle class="mk1" cx="443.7" cy="209.4" r="4"/>
 * <circle class="mk1" cx="513.9" cy="178.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.7" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.7" r="4"/>
 * <circle class="mk2" cx="198.3" cy="219.7" r="4"/>
 * <circle class="mk2" cx="233.3" cy="219.7" r="4"/>
 * <circle class="mk2" cx="303.5" cy="219.5" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.2" r="4"/>
 * <circle class="mk2" cx="443.7" cy="209.3" r="4"/>
 * <circle class="mk2" cx="513.9" cy="177.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="47.9" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 256
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0065 | 1.2549 | 0.0041 | 2.0157 | 62.3% |
 * | 1024 | 0.0067 | 2.4381 | 0.0038 | 4.2667 | 57.1% |
 * | 4096 | 0.0113 | 5.7935 | 0.0084 | 7.7576 | 74.7% |
 * | 16384 | 0.0635 | 4.1301 | 0.0672 | 3.9000 | 105.9% |
 * | 65536 | 0.2888 | 3.6312 | 0.3006 | 3.4878 | 104.1% |
 *
 * <svg id="bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">6.0</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">8.0</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,188.6 133.1,159.0 283.4,75.2 433.7,116.7 584.0,129.2"/>
 * <polyline class="ln2" points="58.0,169.6 133.1,113.3 283.4,26.1 433.7,122.5 584.0,132.8"/>
 * <circle class="mk1" cx="58.0" cy="188.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="159.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="75.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="116.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="129.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="169.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="113.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="26.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="122.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="132.8" r="4"/>
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
 * <svg id="bc-srotm-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srotm-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,216.7 133.1,216.6 283.4,214.3 433.7,188.3 584.0,75.6"/>
 * <polyline class="ln2" points="58.0,218.0 133.1,218.1 283.4,215.8 433.7,186.4 584.0,69.7"/>
 * <circle class="mk1" cx="58.0" cy="216.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="214.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="188.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="75.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="186.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="69.7" r="4"/>
 * </svg>
 *
 * **See also:**
 *
 * - [stride.srotm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/wgblas/stride.srotm.js) — WebGPU stride-sweep benchmark script
 * - [stride.srotm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srotm/cuda/stride.srotm.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srotm
 */
