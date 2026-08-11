/**
 * Benchmark results for sscal on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0364 | 0.0030 | 0.0860 | 42.4% |
 * | 64 | 0.0068 | 0.0751 | 0.0031 | 0.1649 | 45.6% |
 * | 128 | 0.0070 | 0.1471 | 0.0031 | 0.3351 | 43.9% |
 * | 512 | 0.0072 | 0.5689 | 0.0032 | 1.2995 | 43.8% |
 * | 1024 | 0.0069 | 1.1852 | 0.0031 | 2.6667 | 44.4% |
 * | 4096 | 0.0072 | 4.5714 | 0.0034 | 9.5701 | 47.8% |
 * | 16384 | 0.0080 | 16.3840 | 0.0037 | 35.6174 | 46.0% |
 * | 65536 | 0.0102 | 51.5220 | 0.0051 | 102.4000 | 50.3% |
 * | 262144 | 0.0203 | 103.3691 | 0.0126 | 166.3350 | 62.1% |
 * | 1048576 | 0.0661 | 126.8234 | 0.0589 | 142.3922 | 89.1% |
 * | 4194304 | 0.2449 | 137.0061 | 0.2235 | 150.1505 | 91.2% |
 * | 16777216 | 0.8372 | 160.3174 | 0.8833 | 151.9455 | 105.5% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sscal-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sscal-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sscal-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sscal-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sscal-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sscal-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,219.9 113.4,219.9 168.7,219.4 196.4,218.8 251.8,215.4 307.2,203.6 362.5,168.5 417.9,116.6 473.3,93.2 528.6,83.0 584.0,59.7"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.7 168.7,218.7 196.4,217.3 251.8,210.4 307.2,184.4 362.5,117.6 417.9,53.7 473.3,77.6 528.6,69.8 584.0,68.1"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="215.4" r="4"/>
 * <circle class="mk1" cx="307.2" cy="203.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="168.5" r="4"/>
 * <circle class="mk1" cx="417.9" cy="116.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="93.2" r="4"/>
 * <circle class="mk1" cx="528.6" cy="83.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="59.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.7" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.7" r="4"/>
 * <circle class="mk2" cx="196.4" cy="217.3" r="4"/>
 * <circle class="mk2" cx="251.8" cy="210.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="184.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="117.6" r="4"/>
 * <circle class="mk2" cx="417.9" cy="53.7" r="4"/>
 * <circle class="mk2" cx="473.3" cy="77.6" r="4"/>
 * <circle class="mk2" cx="528.6" cy="69.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="68.1" r="4"/>
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
 * <svg id="bc-sscal-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sscal-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sscal-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sscal-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sscal-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sscal-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sscal-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.6 85.7,218.6 113.4,218.6 168.7,218.6 196.4,218.6 251.8,218.6 307.2,218.4 362.5,218.0 417.9,215.9 473.3,206.8 528.6,171.0 584.0,52.6"/>
 * <polyline class="ln2" points="58.0,219.4 85.7,219.4 113.4,219.4 168.7,219.4 196.4,219.4 251.8,219.3 307.2,219.3 362.5,219.0 417.9,217.5 473.3,208.2 528.6,175.3 584.0,43.3"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.6" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.6" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.6" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.6" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.4" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.0" r="4"/>
 * <circle class="mk1" cx="417.9" cy="215.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="206.8" r="4"/>
 * <circle class="mk1" cx="528.6" cy="171.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="52.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.3" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="217.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="208.2" r="4"/>
 * <circle class="mk2" cx="528.6" cy="175.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="43.3" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/wgblas/sscal.js) — WebGPU benchmark script
 * - [sscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/sscal.c) — CUDA / cuBLAS reference script
 *
 * ## Stride sweep
 *
 * Unless noted otherwise, every result above uses unit stride (`incx = incy = 1`) — the normal case, and the coalesced, best-case GPU access pattern. Real usage sometimes passes a non-unit stride (e.g. operating on a row or column of a larger matrix, where `incx = lda`), which breaks memory coalescing and costs measurably more. This section sweeps a few representative strides to characterize that cost separately.
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 4
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0367 | 0.0034 | 0.0755 | 48.6% |
 * | 64 | 0.0071 | 0.0719 | 0.0033 | 0.1538 | 46.8% |
 * | 128 | 0.0070 | 0.1468 | 0.0034 | 0.2991 | 49.1% |
 * | 512 | 0.0072 | 0.5714 | 0.0035 | 1.1636 | 49.1% |
 * | 1024 | 0.0072 | 1.1353 | 0.0038 | 2.1333 | 53.2% |
 * | 4096 | 0.0076 | 4.3207 | 0.0038 | 8.5690 | 50.4% |
 * | 16384 | 0.0084 | 15.6935 | 0.0048 | 27.3067 | 57.5% |
 * | 65536 | 0.0144 | 36.2879 | 0.0095 | 55.0723 | 65.9% |
 * | 262144 | 0.0532 | 39.3846 | 0.0512 | 40.9600 | 96.2% |
 * | 1048576 | 0.1971 | 42.5628 | 0.1950 | 43.0273 | 98.9% |
 * | 4194304 | 0.7743 | 43.3350 | 0.7705 | 43.5509 | 99.5% |
 *
 * <svg id="bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">10</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">20</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">30</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">40</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">60</text>
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
 * <polyline class="ln1" points="58.0,219.9 88.9,219.8 119.9,219.5 181.8,218.1 212.7,216.2 274.6,205.6 336.5,167.7 398.4,99.0 460.2,88.7 522.1,78.1 584.0,75.6"/>
 * <polyline class="ln2" points="58.0,219.7 88.9,219.5 119.9,219.0 181.8,216.1 212.7,212.9 274.6,191.4 336.5,129.0 398.4,36.4 460.2,83.5 522.1,76.6 584.0,74.8"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.8" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.5" r="4"/>
 * <circle class="mk1" cx="181.8" cy="218.1" r="4"/>
 * <circle class="mk1" cx="212.7" cy="216.2" r="4"/>
 * <circle class="mk1" cx="274.6" cy="205.6" r="4"/>
 * <circle class="mk1" cx="336.5" cy="167.7" r="4"/>
 * <circle class="mk1" cx="398.4" cy="99.0" r="4"/>
 * <circle class="mk1" cx="460.2" cy="88.7" r="4"/>
 * <circle class="mk1" cx="522.1" cy="78.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="75.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.7" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.5" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.0" r="4"/>
 * <circle class="mk2" cx="181.8" cy="216.1" r="4"/>
 * <circle class="mk2" cx="212.7" cy="212.9" r="4"/>
 * <circle class="mk2" cx="274.6" cy="191.4" r="4"/>
 * <circle class="mk2" cx="336.5" cy="129.0" r="4"/>
 * <circle class="mk2" cx="398.4" cy="36.4" r="4"/>
 * <circle class="mk2" cx="460.2" cy="83.5" r="4"/>
 * <circle class="mk2" cx="522.1" cy="76.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="74.8" r="4"/>
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
 * <svg id="bc-sscal-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.3 88.9,218.2 119.9,218.3 181.8,218.2 212.7,218.2 274.6,218.1 336.5,217.9 398.4,216.4 460.2,206.7 522.1,170.7 584.0,26.4"/>
 * <polyline class="ln2" points="58.0,219.2 88.9,219.2 119.9,219.2 181.8,219.1 212.7,219.0 274.6,219.0 336.5,218.8 398.4,217.6 460.2,207.2 522.1,171.2 584.0,27.4"/>
 * <circle class="mk1" cx="58.0" cy="218.3" r="4"/>
 * <circle class="mk1" cx="88.9" cy="218.2" r="4"/>
 * <circle class="mk1" cx="119.9" cy="218.3" r="4"/>
 * <circle class="mk1" cx="181.8" cy="218.2" r="4"/>
 * <circle class="mk1" cx="212.7" cy="218.2" r="4"/>
 * <circle class="mk1" cx="274.6" cy="218.1" r="4"/>
 * <circle class="mk1" cx="336.5" cy="217.9" r="4"/>
 * <circle class="mk1" cx="398.4" cy="216.4" r="4"/>
 * <circle class="mk1" cx="460.2" cy="206.7" r="4"/>
 * <circle class="mk1" cx="522.1" cy="170.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="26.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.2" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.2" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.0" r="4"/>
 * <circle class="mk2" cx="274.6" cy="219.0" r="4"/>
 * <circle class="mk2" cx="336.5" cy="218.8" r="4"/>
 * <circle class="mk2" cx="398.4" cy="217.6" r="4"/>
 * <circle class="mk2" cx="460.2" cy="207.2" r="4"/>
 * <circle class="mk2" cx="522.1" cy="171.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="27.4" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 32
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0070 | 0.0364 | 0.0028 | 0.0909 | 40.0% |
 * | 64 | 0.0072 | 0.0713 | 0.0028 | 0.1860 | 38.3% |
 * | 128 | 0.0074 | 0.1388 | 0.0030 | 0.3459 | 40.1% |
 * | 512 | 0.0074 | 0.5553 | 0.0035 | 1.1797 | 47.1% |
 * | 1024 | 0.0077 | 1.0579 | 0.0034 | 2.4381 | 43.4% |
 * | 4096 | 0.0085 | 3.8496 | 0.0041 | 7.9073 | 48.7% |
 * | 16384 | 0.0205 | 6.4000 | 0.0167 | 7.8618 | 81.4% |
 * | 65536 | 0.0677 | 7.7393 | 0.0635 | 8.2581 | 93.7% |
 * | 262144 | 0.2601 | 8.0630 | 0.2476 | 8.4710 | 95.2% |
 * | 1048576 | 1.0230 | 8.2003 | 0.9807 | 8.5539 | 95.9% |
 *
 * <svg id="bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.3 93.1,218.6 128.1,217.2 198.3,208.9 233.3,198.8 303.5,143.0 373.6,92.0 443.7,65.2 513.9,58.7 584.0,56.0"/>
 * <polyline class="ln2" points="58.0,218.2 93.1,216.3 128.1,213.1 198.3,196.4 233.3,171.2 303.5,61.9 373.6,62.8 443.7,54.8 513.9,50.6 584.0,48.9"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="93.1" cy="218.6" r="4"/>
 * <circle class="mk1" cx="128.1" cy="217.2" r="4"/>
 * <circle class="mk1" cx="198.3" cy="208.9" r="4"/>
 * <circle class="mk1" cx="233.3" cy="198.8" r="4"/>
 * <circle class="mk1" cx="303.5" cy="143.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="92.0" r="4"/>
 * <circle class="mk1" cx="443.7" cy="65.2" r="4"/>
 * <circle class="mk1" cx="513.9" cy="58.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk2" cx="93.1" cy="216.3" r="4"/>
 * <circle class="mk2" cx="128.1" cy="213.1" r="4"/>
 * <circle class="mk2" cx="198.3" cy="196.4" r="4"/>
 * <circle class="mk2" cx="233.3" cy="171.2" r="4"/>
 * <circle class="mk2" cx="303.5" cy="61.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="62.8" r="4"/>
 * <circle class="mk2" cx="443.7" cy="54.8" r="4"/>
 * <circle class="mk2" cx="513.9" cy="50.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.9" r="4"/>
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
 * <svg id="bc-sscal-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 93.1,218.8 128.1,218.8 198.3,218.8 233.3,218.7 303.5,218.6 373.6,216.6 443.7,208.7 513.9,176.7 584.0,49.5"/>
 * <polyline class="ln2" points="58.0,219.5 93.1,219.5 128.1,219.5 198.3,219.4 233.3,219.4 303.5,219.3 373.6,217.2 443.7,209.4 513.9,178.7 584.0,56.6"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="93.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="128.1" cy="218.8" r="4"/>
 * <circle class="mk1" cx="198.3" cy="218.8" r="4"/>
 * <circle class="mk1" cx="233.3" cy="218.7" r="4"/>
 * <circle class="mk1" cx="303.5" cy="218.6" r="4"/>
 * <circle class="mk1" cx="373.6" cy="216.6" r="4"/>
 * <circle class="mk1" cx="443.7" cy="208.7" r="4"/>
 * <circle class="mk1" cx="513.9" cy="176.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="198.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="233.3" cy="219.4" r="4"/>
 * <circle class="mk2" cx="303.5" cy="219.3" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.2" r="4"/>
 * <circle class="mk2" cx="443.7" cy="209.4" r="4"/>
 * <circle class="mk2" cx="513.9" cy="178.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="56.6" r="4"/>
 * </svg>
 *
 * ### Nvidia Geforce Gtx 1650 — stride = 256
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0076 | 0.5412 | 0.0033 | 1.2549 | 43.1% |
 * | 1024 | 0.0078 | 1.0535 | 0.0033 | 2.4615 | 42.8% |
 * | 4096 | 0.0085 | 3.8352 | 0.0041 | 8.0000 | 47.9% |
 * | 16384 | 0.0307 | 4.2667 | 0.0306 | 4.2823 | 99.6% |
 * | 65536 | 0.1428 | 3.6711 | 0.1390 | 3.7708 | 97.4% |
 *
 * <svg id="bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,206.5 133.1,193.7 283.4,124.1 433.7,113.3 584.0,128.2"/>
 * <polyline class="ln2" points="58.0,188.6 133.1,158.5 283.4,20.0 433.7,112.9 584.0,125.7"/>
 * <circle class="mk1" cx="58.0" cy="206.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="193.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="124.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="113.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="128.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="188.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="158.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="20.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="112.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="125.7" r="4"/>
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
 * <svg id="bc-sscal-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sscal-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,209.9 133.1,209.6 283.4,208.6 433.7,179.0 584.0,29.6"/>
 * <polyline class="ln2" points="58.0,215.6 133.1,215.6 283.4,214.5 433.7,179.2 584.0,34.7"/>
 * <circle class="mk1" cx="58.0" cy="209.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="209.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="208.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="179.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="29.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="214.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="179.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="34.7" r="4"/>
 * </svg>
 *
 * **See also:**
 *
 * - [stride.sscal.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/wgblas/stride.sscal.js) — WebGPU stride-sweep benchmark script
 * - [stride.sscal.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sscal/cuda/stride.sscal.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sscal
 */
