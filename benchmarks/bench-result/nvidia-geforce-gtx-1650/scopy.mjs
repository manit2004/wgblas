/**
 * Benchmark results for scopy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0426 | 0.0026 | 0.1000 | 42.6% |
 * | 64 | 0.0060 | 0.0860 | 0.0026 | 0.1988 | 43.3% |
 * | 128 | 0.0060 | 0.1707 | 0.0026 | 0.3902 | 43.7% |
 * | 512 | 0.0060 | 0.6845 | 0.0026 | 1.5610 | 43.8% |
 * | 1024 | 0.0059 | 1.3838 | 0.0027 | 3.0843 | 44.9% |
 * | 4096 | 0.0061 | 5.4037 | 0.0027 | 12.3373 | 43.8% |
 * | 16384 | 0.0064 | 20.5829 | 0.0036 | 36.9009 | 55.8% |
 * | 65536 | 0.0082 | 64.0000 | 0.0043 | 121.3630 | 52.7% |
 * | 262144 | 0.0184 | 113.7778 | 0.0155 | 135.1258 | 84.2% |
 * | 1048576 | 0.0594 | 141.2414 | 0.0532 | 157.5385 | 89.7% |
 * | 4194304 | 0.2171 | 154.5660 | 0.2028 | 165.4949 | 93.4% |
 * | 16777216 | 0.8097 | 165.7598 | 0.8013 | 167.5075 | 99.0% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-scopy-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-scopy-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-scopy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-scopy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-scopy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-scopy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.8 168.7,219.3 196.4,218.6 251.8,214.6 307.2,199.4 362.5,156.0 417.9,106.2 473.3,78.8 528.6,65.4 584.0,54.2"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.6 168.7,218.4 196.4,216.9 251.8,207.7 307.2,183.1 362.5,98.6 417.9,84.9 473.3,62.5 528.6,54.5 584.0,52.5"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.3" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="214.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="199.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="156.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="106.2" r="4"/>
 * <circle class="mk1" cx="473.3" cy="78.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="65.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="54.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.6" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.9" r="4"/>
 * <circle class="mk2" cx="251.8" cy="207.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="183.1" r="4"/>
 * <circle class="mk2" cx="362.5" cy="98.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="84.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="62.5" r="4"/>
 * <circle class="mk2" cx="528.6" cy="54.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="52.5" r="4"/>
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
 * <svg id="bc-scopy-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-scopy-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-scopy-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-scopy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-scopy-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-scopy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-scopy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 85.7,218.8 113.4,218.8 168.7,218.8 196.4,218.8 251.8,218.8 307.2,218.7 362.5,218.4 417.9,216.3 473.3,208.1 528.6,176.6 584.0,58.1"/>
 * <polyline class="ln2" points="58.0,219.5 85.7,219.5 113.4,219.5 168.7,219.5 196.4,219.5 251.8,219.5 307.2,219.3 362.5,219.1 417.9,216.9 473.3,209.4 528.6,179.4 584.0,59.7"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.7" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="216.3" r="4"/>
 * <circle class="mk1" cx="473.3" cy="208.1" r="4"/>
 * <circle class="mk1" cx="528.6" cy="176.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.5" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.5" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.5" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.1" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="209.4" r="4"/>
 * <circle class="mk2" cx="528.6" cy="179.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="59.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/scopy.js) — WebGPU benchmark script
 * - [scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/scopy.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately.
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 4
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0060 | 0.0427 | 0.0031 | 0.0833 | 51.2% |
 * | 64 | 0.0060 | 0.0847 | 0.0034 | 0.1495 | 56.6% |
 * | 128 | 0.0060 | 0.1702 | 0.0030 | 0.3422 | 49.7% |
 * | 512 | 0.0060 | 0.6772 | 0.0032 | 1.2929 | 52.4% |
 * | 1024 | 0.0060 | 1.3653 | 0.0034 | 2.3925 | 57.1% |
 * | 4096 | 0.0061 | 5.3333 | 0.0034 | 9.5701 | 55.7% |
 * | 16384 | 0.0069 | 18.8756 | 0.0041 | 32.0000 | 59.0% |
 * | 65536 | 0.0200 | 26.2775 | 0.0224 | 23.3723 | 112.4% |
 * | 262144 | 0.0778 | 26.9474 | 0.0793 | 26.4578 | 101.9% |
 * | 1048576 | 0.3070 | 27.3223 | 0.3087 | 27.1722 | 100.6% |
 * | 4194304 | 1.2220 | 27.4586 | 1.2173 | 27.5647 | 99.6% |
 *
 * <svg id="bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">40</text>
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
 * <polyline class="ln1" points="58.0,219.8 88.9,219.6 119.9,219.1 181.8,216.6 212.7,213.2 274.6,193.3 336.5,125.6 398.4,88.6 460.2,85.3 522.1,83.4 584.0,82.7"/>
 * <polyline class="ln2" points="58.0,219.6 88.9,219.3 119.9,218.3 181.8,213.5 212.7,208.0 274.6,172.1 336.5,60.0 398.4,103.1 460.2,87.7 522.1,84.1 584.0,82.2"/>
 * <circle class="mk1" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.6" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.1" r="4"/>
 * <circle class="mk1" cx="181.8" cy="216.6" r="4"/>
 * <circle class="mk1" cx="212.7" cy="213.2" r="4"/>
 * <circle class="mk1" cx="274.6" cy="193.3" r="4"/>
 * <circle class="mk1" cx="336.5" cy="125.6" r="4"/>
 * <circle class="mk1" cx="398.4" cy="88.6" r="4"/>
 * <circle class="mk1" cx="460.2" cy="85.3" r="4"/>
 * <circle class="mk1" cx="522.1" cy="83.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="82.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.3" r="4"/>
 * <circle class="mk2" cx="119.9" cy="218.3" r="4"/>
 * <circle class="mk2" cx="181.8" cy="213.5" r="4"/>
 * <circle class="mk2" cx="212.7" cy="208.0" r="4"/>
 * <circle class="mk2" cx="274.6" cy="172.1" r="4"/>
 * <circle class="mk2" cx="336.5" cy="60.0" r="4"/>
 * <circle class="mk2" cx="398.4" cy="103.1" r="4"/>
 * <circle class="mk2" cx="460.2" cy="87.7" r="4"/>
 * <circle class="mk2" cx="522.1" cy="84.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="82.2" r="4"/>
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
 * <svg id="bc-scopy-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.50</text>
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
 * <polyline class="ln1" points="58.0,219.2 88.9,219.2 119.9,219.2 181.8,219.2 212.7,219.2 274.6,219.2 336.5,219.1 398.4,217.3 460.2,209.6 522.1,179.1 584.0,57.1"/>
 * <polyline class="ln2" points="58.0,219.6 88.9,219.5 119.9,219.6 181.8,219.6 212.7,219.5 274.6,219.5 336.5,219.5 398.4,217.0 460.2,209.4 522.1,178.8 584.0,57.7"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.2" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.2" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="212.7" cy="219.2" r="4"/>
 * <circle class="mk1" cx="274.6" cy="219.2" r="4"/>
 * <circle class="mk1" cx="336.5" cy="219.1" r="4"/>
 * <circle class="mk1" cx="398.4" cy="217.3" r="4"/>
 * <circle class="mk1" cx="460.2" cy="209.6" r="4"/>
 * <circle class="mk1" cx="522.1" cy="179.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.5" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.6" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.6" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.5" r="4"/>
 * <circle class="mk2" cx="274.6" cy="219.5" r="4"/>
 * <circle class="mk2" cx="336.5" cy="219.5" r="4"/>
 * <circle class="mk2" cx="398.4" cy="217.0" r="4"/>
 * <circle class="mk2" cx="460.2" cy="209.4" r="4"/>
 * <circle class="mk2" cx="522.1" cy="178.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="57.7" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 32
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 0.0361 | 0.0028 | 0.0909 | 39.7% |
 * | 64 | 0.0061 | 0.0833 | 0.0029 | 0.1758 | 47.4% |
 * | 128 | 0.0061 | 0.1667 | 0.0030 | 0.3441 | 48.4% |
 * | 512 | 0.0061 | 0.6667 | 0.0034 | 1.1963 | 55.7% |
 * | 1024 | 0.0061 | 1.3333 | 0.0035 | 2.3273 | 57.3% |
 * | 4096 | 0.0082 | 4.0000 | 0.0044 | 7.5294 | 53.1% |
 * | 16384 | 0.0188 | 6.9838 | 0.0182 | 7.2113 | 96.8% |
 * | 65536 | 0.0676 | 7.7576 | 0.0654 | 8.0117 | 96.8% |
 * | 262144 | 0.2601 | 8.0630 | 0.2508 | 8.3613 | 96.4% |
 * | 1048576 | 1.0281 | 8.1594 | 0.9941 | 8.4380 | 96.7% |
 *
 * <svg id="bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">2.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">4.0</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">6.0</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">8.0</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">10</text>
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
 * <polyline class="ln1" points="58.0,219.3 93.1,218.3 128.1,216.7 198.3,206.7 233.3,193.3 303.5,140.0 373.6,80.3 443.7,64.8 513.9,58.7 584.0,56.8"/>
 * <polyline class="ln2" points="58.0,218.2 93.1,216.5 128.1,213.1 198.3,196.1 233.3,173.5 303.5,69.4 373.6,75.8 443.7,59.8 513.9,52.8 584.0,51.2"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="93.1" cy="218.3" r="4"/>
 * <circle class="mk1" cx="128.1" cy="216.7" r="4"/>
 * <circle class="mk1" cx="198.3" cy="206.7" r="4"/>
 * <circle class="mk1" cx="233.3" cy="193.3" r="4"/>
 * <circle class="mk1" cx="303.5" cy="140.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="80.3" r="4"/>
 * <circle class="mk1" cx="443.7" cy="64.8" r="4"/>
 * <circle class="mk1" cx="513.9" cy="58.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk2" cx="93.1" cy="216.5" r="4"/>
 * <circle class="mk2" cx="128.1" cy="213.1" r="4"/>
 * <circle class="mk2" cx="198.3" cy="196.1" r="4"/>
 * <circle class="mk2" cx="233.3" cy="173.5" r="4"/>
 * <circle class="mk2" cx="303.5" cy="69.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="75.8" r="4"/>
 * <circle class="mk2" cx="443.7" cy="59.8" r="4"/>
 * <circle class="mk2" cx="513.9" cy="52.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="51.2" r="4"/>
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
 * <svg id="bc-scopy-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.200</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.400</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.600</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.800</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">1.20</text>
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
 * <polyline class="ln1" points="58.0,218.8 93.1,219.0 128.1,219.0 198.3,219.0 233.3,219.0 303.5,218.6 373.6,216.9 443.7,208.7 513.9,176.7 584.0,48.7"/>
 * <polyline class="ln2" points="58.0,219.5 93.1,219.5 128.1,219.5 198.3,219.4 233.3,219.4 303.5,219.3 373.6,217.0 443.7,209.1 513.9,178.2 584.0,54.3"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.0" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.0" r="4"/>
 * <circle class="mk1" cx="198.3" cy="219.0" r="4"/>
 * <circle class="mk1" cx="233.3" cy="219.0" r="4"/>
 * <circle class="mk1" cx="303.5" cy="218.6" r="4"/>
 * <circle class="mk1" cx="373.6" cy="216.9" r="4"/>
 * <circle class="mk1" cx="443.7" cy="208.7" r="4"/>
 * <circle class="mk1" cx="513.9" cy="176.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="198.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="233.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="303.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.0" r="4"/>
 * <circle class="mk2" cx="443.7" cy="209.1" r="4"/>
 * <circle class="mk2" cx="513.9" cy="178.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="54.3" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 256
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0061 | 0.6667 | 0.0034 | 1.2075 | 55.2% |
 * | 1024 | 0.0063 | 1.2995 | 0.0035 | 2.3594 | 55.1% |
 * | 4096 | 0.0082 | 3.9922 | 0.0044 | 7.4203 | 53.8% |
 * | 16384 | 0.0286 | 4.5765 | 0.0310 | 4.2292 | 108.2% |
 * | 65536 | 0.1432 | 3.6604 | 0.1407 | 3.7274 | 98.2% |
 *
 * <svg id="bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,203.3 133.1,187.5 283.4,120.2 433.7,105.6 584.0,128.5"/>
 * <polyline class="ln2" points="58.0,189.8 133.1,161.0 283.4,34.5 433.7,114.3 584.0,126.8"/>
 * <circle class="mk1" cx="58.0" cy="203.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="187.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="120.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="105.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="128.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="189.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="161.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="34.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="114.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="126.8" r="4"/>
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
 * <svg id="bc-scopy-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-scopy-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.0500</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,211.8 133.1,211.6 283.4,209.1 433.7,181.8 584.0,29.0"/>
 * <polyline class="ln2" points="58.0,215.5 133.1,215.3 283.4,214.1 433.7,178.7 584.0,32.4"/>
 * <circle class="mk1" cx="58.0" cy="211.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="211.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="181.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="29.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.5" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="214.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="178.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="32.4" r="4"/>
 * </svg>
 *
 * **See also:**
 *
 * - [stride.scopy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/wgblas/stride.scopy.js) — WebGPU stride-sweep benchmark script
 * - [stride.scopy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/scopy/cuda/stride.scopy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/scopy
 */
