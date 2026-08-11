/**
 * Benchmark results for srot on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0069 | 0.0739 | 0.0029 | 0.1758 | 42.0% |
 * | 64 | 0.0073 | 0.1400 | 0.0028 | 0.3636 | 38.5% |
 * | 128 | 0.0074 | 0.2753 | 0.0028 | 0.7191 | 38.3% |
 * | 512 | 0.0072 | 1.1353 | 0.0029 | 2.8444 | 39.9% |
 * | 1024 | 0.0069 | 2.3649 | 0.0037 | 4.3761 | 54.0% |
 * | 4096 | 0.0074 | 8.8086 | 0.0035 | 18.6182 | 47.3% |
 * | 16384 | 0.0082 | 32.0000 | 0.0039 | 66.6016 | 48.0% |
 * | 65536 | 0.0102 | 102.4000 | 0.0070 | 150.3119 | 68.1% |
 * | 262144 | 0.0302 | 138.9210 | 0.0283 | 148.2715 | 93.7% |
 * | 1048576 | 0.1024 | 163.8400 | 0.1016 | 165.1821 | 99.2% |
 * | 4194304 | 0.3911 | 171.5813 | 0.3969 | 169.0842 | 101.5% |
 * | 16777216 | 1.5503 | 173.1466 | 1.5915 | 168.6644 | 102.7% |
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.7 168.7,218.9 196.4,217.6 251.8,211.2 307.2,188.0 362.5,117.6 417.9,81.1 473.3,56.2 528.6,48.4 584.0,46.9"/>
 * <polyline class="ln2" points="58.0,219.8 85.7,219.6 113.4,219.3 168.7,217.2 196.4,215.6 251.8,201.4 307.2,153.4 362.5,69.7 417.9,71.7 473.3,54.8 528.6,50.9 584.0,51.3"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="217.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="188.0" r="4"/>
 * <circle class="mk1" cx="362.5" cy="117.6" r="4"/>
 * <circle class="mk1" cx="417.9" cy="81.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="56.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="48.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="217.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="215.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="201.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="153.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="69.7" r="4"/>
 * <circle class="mk2" cx="417.9" cy="71.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="54.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="50.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="51.3" r="4"/>
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
 * <polyline class="ln1" points="58.0,219.3 85.7,219.3 113.4,219.3 168.7,219.3 196.4,219.3 251.8,219.3 307.2,219.2 362.5,219.0 417.9,217.0 473.3,209.8 528.6,180.9 584.0,65.0"/>
 * <polyline class="ln2" points="58.0,219.7 85.7,219.7 113.4,219.7 168.7,219.7 196.4,219.6 251.8,219.7 307.2,219.6 362.5,219.3 417.9,217.2 473.3,209.8 528.6,180.3 584.0,60.9"/>
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
 * <circle class="mk1" cx="584.0" cy="65.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.6" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="417.9" cy="217.2" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.8" r="4"/>
 * <circle class="mk2" cx="528.6" cy="180.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="60.9" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/srot.js) — WebGPU benchmark script
 * - [srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/srot.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately.
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 4
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0072 | 0.0714 | 0.0034 | 0.1509 | 47.3% |
 * | 64 | 0.0073 | 0.1407 | 0.0034 | 0.3005 | 46.8% |
 * | 128 | 0.0070 | 0.2929 | 0.0035 | 0.5792 | 50.6% |
 * | 512 | 0.0073 | 1.1179 | 0.0037 | 2.1880 | 51.1% |
 * | 1024 | 0.0073 | 2.2407 | 0.0038 | 4.3025 | 52.1% |
 * | 4096 | 0.0081 | 8.0630 | 0.0041 | 16.0000 | 50.4% |
 * | 16384 | 0.0103 | 25.5202 | 0.0066 | 39.4795 | 64.6% |
 * | 65536 | 0.0287 | 36.5714 | 0.0272 | 38.5053 | 95.0% |
 * | 262144 | 0.1010 | 41.5113 | 0.0996 | 42.1115 | 98.6% |
 * | 1048576 | 0.3908 | 42.9287 | 0.3871 | 43.3403 | 99.1% |
 * | 4194304 | 1.5422 | 43.5139 | 1.5391 | 43.6030 | 99.8% |
 *
 * <svg id="bc-srot-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.7 88.9,219.4 119.9,218.8 181.8,215.5 212.7,211.0 274.6,187.7 336.5,117.9 398.4,73.7 460.2,54.0 522.1,48.3 584.0,45.9"/>
 * <polyline class="ln2" points="58.0,219.4 88.9,218.8 119.9,217.7 181.8,211.2 212.7,202.8 274.6,156.0 336.5,62.1 398.4,66.0 460.2,51.6 522.1,46.6 584.0,45.6"/>
 * <circle class="mk1" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.4" r="4"/>
 * <circle class="mk1" cx="119.9" cy="218.8" r="4"/>
 * <circle class="mk1" cx="181.8" cy="215.5" r="4"/>
 * <circle class="mk1" cx="212.7" cy="211.0" r="4"/>
 * <circle class="mk1" cx="274.6" cy="187.7" r="4"/>
 * <circle class="mk1" cx="336.5" cy="117.9" r="4"/>
 * <circle class="mk1" cx="398.4" cy="73.7" r="4"/>
 * <circle class="mk1" cx="460.2" cy="54.0" r="4"/>
 * <circle class="mk1" cx="522.1" cy="48.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="88.9" cy="218.8" r="4"/>
 * <circle class="mk2" cx="119.9" cy="217.7" r="4"/>
 * <circle class="mk2" cx="181.8" cy="211.2" r="4"/>
 * <circle class="mk2" cx="212.7" cy="202.8" r="4"/>
 * <circle class="mk2" cx="274.6" cy="156.0" r="4"/>
 * <circle class="mk2" cx="336.5" cy="62.1" r="4"/>
 * <circle class="mk2" cx="398.4" cy="66.0" r="4"/>
 * <circle class="mk2" cx="460.2" cy="51.6" r="4"/>
 * <circle class="mk2" cx="522.1" cy="46.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="45.6" r="4"/>
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
 * <svg id="bc-srot-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srot-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 88.9,219.3 119.9,219.3 181.8,219.3 212.7,219.3 274.6,219.2 336.5,219.0 398.4,217.1 460.2,209.9 522.1,180.9 584.0,65.8"/>
 * <polyline class="ln2" points="58.0,219.7 88.9,219.7 119.9,219.7 181.8,219.6 212.7,219.6 274.6,219.6 336.5,219.3 398.4,217.3 460.2,210.0 522.1,181.3 584.0,66.1"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.3" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.3" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.3" r="4"/>
 * <circle class="mk1" cx="212.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="274.6" cy="219.2" r="4"/>
 * <circle class="mk1" cx="336.5" cy="219.0" r="4"/>
 * <circle class="mk1" cx="398.4" cy="217.1" r="4"/>
 * <circle class="mk1" cx="460.2" cy="209.9" r="4"/>
 * <circle class="mk1" cx="522.1" cy="180.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="65.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.7" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.7" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.6" r="4"/>
 * <circle class="mk2" cx="274.6" cy="219.6" r="4"/>
 * <circle class="mk2" cx="336.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="398.4" cy="217.3" r="4"/>
 * <circle class="mk2" cx="460.2" cy="210.0" r="4"/>
 * <circle class="mk2" cx="522.1" cy="181.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="66.1" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 32
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0833 | 0.0030 | 0.1702 | 49.0% |
 * | 64 | 0.0061 | 0.1667 | 0.0030 | 0.3368 | 49.5% |
 * | 128 | 0.0061 | 0.3333 | 0.0032 | 0.6337 | 52.6% |
 * | 512 | 0.0063 | 1.3061 | 0.0042 | 1.9542 | 66.8% |
 * | 1024 | 0.0065 | 2.5222 | 0.0042 | 3.9084 | 64.5% |
 * | 4096 | 0.0095 | 6.9306 | 0.0057 | 11.4413 | 60.6% |
 * | 16384 | 0.0349 | 7.5122 | 0.0339 | 7.7393 | 97.1% |
 * | 65536 | 0.1411 | 7.4338 | 0.1331 | 7.8760 | 94.4% |
 * | 262144 | 0.5513 | 7.6083 | 0.5293 | 7.9245 | 96.0% |
 * | 1048576 | 2.2176 | 7.5656 | 2.1139 | 7.9367 | 95.3% |
 *
 * <svg id="bc-srot-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 93.1,217.2 128.1,214.4 198.3,198.2 233.3,178.0 303.5,104.5 373.6,94.8 443.7,96.1 513.9,93.2 584.0,93.9"/>
 * <polyline class="ln2" points="58.0,217.2 93.1,214.4 128.1,209.4 198.3,187.4 233.3,154.9 303.5,29.3 373.6,91.0 443.7,88.7 513.9,87.9 584.0,87.7"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="93.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="128.1" cy="214.4" r="4"/>
 * <circle class="mk1" cx="198.3" cy="198.2" r="4"/>
 * <circle class="mk1" cx="233.3" cy="178.0" r="4"/>
 * <circle class="mk1" cx="303.5" cy="104.5" r="4"/>
 * <circle class="mk1" cx="373.6" cy="94.8" r="4"/>
 * <circle class="mk1" cx="443.7" cy="96.1" r="4"/>
 * <circle class="mk1" cx="513.9" cy="93.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="93.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk2" cx="93.1" cy="214.4" r="4"/>
 * <circle class="mk2" cx="128.1" cy="209.4" r="4"/>
 * <circle class="mk2" cx="198.3" cy="187.4" r="4"/>
 * <circle class="mk2" cx="233.3" cy="154.9" r="4"/>
 * <circle class="mk2" cx="303.5" cy="29.3" r="4"/>
 * <circle class="mk2" cx="373.6" cy="91.0" r="4"/>
 * <circle class="mk2" cx="443.7" cy="88.7" r="4"/>
 * <circle class="mk2" cx="513.9" cy="87.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="87.7" r="4"/>
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
 * <svg id="bc-srot-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srot-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.5 93.1,219.5 128.1,219.5 198.3,219.5 233.3,219.5 303.5,219.2 373.6,217.2 443.7,208.7 513.9,175.9 584.0,42.6"/>
 * <polyline class="ln2" points="58.0,219.8 93.1,219.8 128.1,219.7 198.3,219.7 233.3,219.7 303.5,219.5 373.6,217.3 443.7,209.4 513.9,177.7 584.0,50.9"/>
 * <circle class="mk1" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.5" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk1" cx="198.3" cy="219.5" r="4"/>
 * <circle class="mk1" cx="233.3" cy="219.5" r="4"/>
 * <circle class="mk1" cx="303.5" cy="219.2" r="4"/>
 * <circle class="mk1" cx="373.6" cy="217.2" r="4"/>
 * <circle class="mk1" cx="443.7" cy="208.7" r="4"/>
 * <circle class="mk1" cx="513.9" cy="175.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="42.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.8" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.7" r="4"/>
 * <circle class="mk2" cx="198.3" cy="219.7" r="4"/>
 * <circle class="mk2" cx="233.3" cy="219.7" r="4"/>
 * <circle class="mk2" cx="303.5" cy="219.5" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.3" r="4"/>
 * <circle class="mk2" cx="443.7" cy="209.4" r="4"/>
 * <circle class="mk2" cx="513.9" cy="177.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.9" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 256
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0063 | 1.2995 | 0.0042 | 1.9542 | 66.5% |
 * | 1024 | 0.0065 | 2.5222 | 0.0042 | 3.9084 | 64.5% |
 * | 4096 | 0.0106 | 6.1873 | 0.0090 | 7.3143 | 84.6% |
 * | 16384 | 0.0614 | 4.2667 | 0.0690 | 3.7979 | 112.3% |
 * | 65536 | 0.2888 | 3.6312 | 0.2950 | 3.5540 | 102.2% |
 *
 * <svg id="bc-srot-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,187.5 133.1,156.9 283.4,65.3 433.7,113.3 584.0,129.2"/>
 * <polyline class="ln2" points="58.0,171.1 133.1,122.3 283.4,37.1 433.7,125.1 584.0,131.1"/>
 * <circle class="mk1" cx="58.0" cy="187.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="156.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="65.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="113.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="129.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="171.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="122.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="37.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="125.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="131.1" r="4"/>
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
 * <svg id="bc-srot-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-srot-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-srot-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.0500</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.150</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">0.250</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.300</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,215.8 133.1,215.7 283.4,212.9 433.7,179.0 584.0,27.5"/>
 * <polyline class="ln2" points="58.0,217.2 133.1,217.2 283.4,214.0 433.7,174.0 584.0,23.3"/>
 * <circle class="mk1" cx="58.0" cy="215.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="212.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="179.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="27.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="214.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="174.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="23.3" r="4"/>
 * </svg>
 *
 * **See also:**
 *
 * - [stride.srot.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/wgblas/stride.srot.js) — WebGPU stride-sweep benchmark script
 * - [stride.srot.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/srot/cuda/stride.srot.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/srot
 */
