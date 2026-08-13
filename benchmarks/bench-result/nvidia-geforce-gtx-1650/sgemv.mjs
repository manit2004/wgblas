/**
 * Benchmark results for sgemv on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0138 | 0.3256 | 0.0066 | 0.6813 | 47.8% |
 * | 64 | 0.0106 | 1.6145 | 0.0067 | 2.5769 | 62.7% |
 * | 128 | 0.0149 | 4.4930 | 0.0076 | 8.8626 | 50.7% |
 * | 256 | 0.0219 | 12.1258 | 0.0144 | 18.4178 | 65.8% |
 * | 512 | 0.0512 | 20.6000 | 0.0204 | 51.6614 | 39.9% |
 * | 1024 | 0.1109 | 37.9382 | 0.2082 | 20.2038 | 187.8% |
 * | 1280 | 0.1372 | 47.8731 | 0.2274 | 28.8923 | 165.7% |
 * | 2048 | 0.2172 | 77.3734 | 0.4363 | 38.5122 | 200.9% |
 * | 4096 | 0.4731 | 141.9567 | 0.4774 | 140.6816 | 100.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sgemv-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.6 133.1,217.8 208.3,214.0 283.4,203.8 358.6,192.5 433.7,169.4 457.9,156.2 508.9,116.8 584.0,30.7"/>
 * <polyline class="ln2" points="58.0,219.1 133.1,216.6 208.3,208.2 283.4,195.4 358.6,151.1 433.7,193.1 457.9,181.5 508.9,168.7 584.0,32.4"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="203.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="192.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="169.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="156.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="116.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="208.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="195.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="151.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="193.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="181.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="168.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="32.4" r="4"/>
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
 * <svg id="bc-sgemv-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,214.5 133.1,215.8 208.3,214.0 283.4,211.3 358.6,199.5 433.7,175.6 457.9,165.1 508.9,133.1 584.0,30.8"/>
 * <polyline class="ln2" points="58.0,217.4 133.1,217.3 208.3,217.0 283.4,214.2 358.6,211.8 433.7,136.7 457.9,129.0 508.9,45.5 584.0,29.0"/>
 * <circle class="mk1" cx="58.0" cy="214.5" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="199.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="175.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="165.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="133.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="214.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="211.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="136.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="129.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="45.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="29.0" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/sgemv.js) — WebGPU benchmark script
 * - [sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/sgemv.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0137 | 0.3263 | 0.0082 | 0.5479 | 59.6% |
 * | 64 | 0.0108 | 1.5952 | 0.0076 | 2.2521 | 70.8% |
 * | 128 | 0.0150 | 4.4596 | 0.0082 | 8.1875 | 54.5% |
 * | 256 | 0.0221 | 11.9855 | 0.0141 | 18.7511 | 63.9% |
 * | 512 | 0.0540 | 19.5203 | 0.0151 | 69.9788 | 27.9% |
 * | 1024 | 0.1180 | 35.6491 | 0.0417 | 100.9647 | 35.3% |
 * | 1280 | 0.1475 | 44.5486 | 0.0569 | 115.4231 | 38.6% |
 * | 2048 | 0.2337 | 71.8959 | 0.3777 | 44.4831 | 161.6% |
 * | 4096 | 0.5230 | 128.4112 | 0.4793 | 140.1274 | 91.6% |
 *
 * <svg id="bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.6 133.1,217.9 208.3,214.1 283.4,204.0 358.6,194.0 433.7,172.5 457.9,160.6 508.9,124.1 584.0,48.8"/>
 * <polyline class="ln2" points="58.0,219.3 133.1,217.0 208.3,209.1 283.4,195.0 358.6,126.7 433.7,85.4 457.9,66.1 508.9,160.7 584.0,33.2"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="204.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="194.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="172.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="160.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="124.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="48.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="209.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="195.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="126.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="85.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="66.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="160.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="33.2" r="4"/>
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
 * <svg id="bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,215.4 133.1,216.4 208.3,215.0 283.4,212.6 358.6,202.0 433.7,180.7 457.9,170.8 508.9,142.1 584.0,45.7"/>
 * <polyline class="ln2" points="58.0,217.3 133.1,217.5 208.3,217.3 283.4,215.3 358.6,215.0 433.7,206.1 457.9,201.0 508.9,94.1 584.0,60.2"/>
 * <circle class="mk1" cx="58.0" cy="215.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="212.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="202.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="180.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="170.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="142.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="45.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="201.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="94.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="60.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0138 | 0.3244 | 0.0078 | 0.5738 | 56.5% |
 * | 64 | 0.0108 | 1.5881 | 0.0078 | 2.2058 | 72.0% |
 * | 128 | 0.0155 | 4.3216 | 0.0082 | 8.1398 | 53.1% |
 * | 256 | 0.0223 | 11.9080 | 0.0149 | 17.7473 | 67.1% |
 * | 512 | 0.0619 | 17.0512 | 0.0192 | 55.0250 | 31.0% |
 * | 1024 | 0.1183 | 35.5623 | 0.0451 | 93.2643 | 38.1% |
 * | 1280 | 0.1472 | 44.6261 | 0.0593 | 110.8423 | 40.3% |
 * | 2048 | 0.2314 | 72.6018 | 0.3795 | 44.2712 | 164.0% |
 * | 4096 | 0.5258 | 127.7235 | 1.1871 | 56.5730 | 225.8% |
 *
 * <svg id="bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.6 133.1,217.9 208.3,214.2 283.4,204.1 358.6,197.3 433.7,172.6 457.9,160.5 508.9,123.2 584.0,49.7"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,217.1 208.3,209.1 283.4,196.3 358.6,146.6 433.7,95.6 457.9,72.2 508.9,161.0 584.0,144.6"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="204.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="197.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="172.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="160.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="123.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="209.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="196.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="146.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="95.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="72.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="161.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="144.6" r="4"/>
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
 * <svg id="bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.7 133.1,218.2 208.3,217.4 283.4,216.3 358.6,209.7 433.7,200.3 457.9,195.5 508.9,181.4 584.0,132.4"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,218.7 208.3,218.6 283.4,217.5 358.6,216.8 433.7,212.5 457.9,210.1 508.9,156.8 584.0,22.2"/>
 * <circle class="mk1" cx="58.0" cy="217.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="217.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="209.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="200.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="195.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="181.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="132.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="216.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="212.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="210.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="156.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="22.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0137 | 0.3271 | 0.0079 | 0.5645 | 57.9% |
 * | 64 | 0.0113 | 1.5227 | 0.0077 | 2.2195 | 68.6% |
 * | 128 | 0.0152 | 4.4034 | 0.0080 | 8.4008 | 52.4% |
 * | 256 | 0.0314 | 8.4571 | 0.0149 | 17.7854 | 47.6% |
 * | 512 | 0.0799 | 13.2051 | 0.0184 | 57.2222 | 23.1% |
 * | 1024 | 0.1604 | 26.2335 | 0.0430 | 97.8095 | 26.8% |
 * | 1280 | 0.1986 | 33.0830 | 0.0586 | 112.0830 | 29.5% |
 * | 2048 | 0.3277 | 51.2675 | 0.1249 | 134.4918 | 38.1% |
 * | 4096 | 0.5359 | 125.3247 | 0.4679 | 143.5295 | 87.3% |
 *
 * <svg id="bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,219.6 133.1,218.0 208.3,214.1 283.4,208.7 358.6,202.4 433.7,185.0 457.9,175.9 508.9,151.6 584.0,52.9"/>
 * <polyline class="ln2" points="58.0,219.2 133.1,217.0 208.3,208.8 283.4,196.3 358.6,143.7 433.7,89.6 457.9,70.6 508.9,40.7 584.0,28.6"/>
 * <circle class="mk1" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="218.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="208.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="202.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="185.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="175.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="151.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="52.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="208.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="196.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="143.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="89.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="70.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="40.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="28.6" r="4"/>
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
 * <svg id="bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,215.4 133.1,216.2 208.3,214.9 283.4,209.5 358.6,193.4 433.7,166.5 457.9,153.8 508.9,110.8 584.0,41.4"/>
 * <polyline class="ln2" points="58.0,217.4 133.1,217.4 208.3,217.3 283.4,215.0 358.6,213.9 433.7,205.7 457.9,200.5 508.9,178.4 584.0,64.0"/>
 * <circle class="mk1" cx="58.0" cy="215.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="193.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="166.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="153.8" r="4"/>
 * <circle class="mk1" cx="508.9" cy="110.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="41.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="213.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="205.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="178.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="64.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/stride.sgemv.js) — WebGPU stride-sweep benchmark script
 * - [stride.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/stride.sgemv.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `trans = "no-transpose"`. `trans = "transpose"`'s parallelism is bounded by `n` (one workgroup per output-column tile) rather than `m`, so it's slower at matched square shapes and substantially slower on tall-narrow shapes — this section sweeps every `(m, n)` pair for both `trans` values to characterize that shape sensitivity, not just a single square-shape A/B. Collapsed by default since it's 18 shape combinations — expand a `trans` value, then a shape, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = no-transpose (9 shapes)</summary>
 *
 * <details>
 * <summary>m = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0083 | 0.5426 | 0.0132 | 0.3402 | 159.5% |
 * | 64 | 0.0083 | 1.0502 | 0.0132 | 0.6570 | 159.8% |
 * | 128 | 0.0084 | 2.0303 | 0.0128 | 1.3350 | 152.1% |
 * | 256 | 0.0085 | 4.0000 | 0.0143 | 2.3750 | 168.4% |
 * | 512 | 0.0089 | 7.5986 | 0.0141 | 4.8073 | 158.1% |
 * | 1024 | 0.0097 | 13.8982 | 0.0141 | 9.6182 | 144.5% |
 * | 1280 | 0.0101 | 16.8140 | 0.0135 | 12.5308 | 134.2% |
 * | 2048 | 0.0105 | 25.7021 | 0.0142 | 19.0665 | 134.8% |
 * | 4096 | 0.0125 | 43.2327 | 0.0143 | 37.7321 | 114.6% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.8 133.1,215.8 208.3,211.9 283.4,204.0 358.6,189.6 433.7,164.4 457.9,152.7 508.9,117.2 584.0,47.1"/>
 * <polyline class="ln2" points="58.0,218.6 133.1,217.4 208.3,214.7 283.4,210.5 358.6,200.8 433.7,181.5 457.9,169.9 508.9,143.7 584.0,69.1"/>
 * <circle class="mk1" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="204.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="189.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="164.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="152.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="117.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="47.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="214.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="210.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="200.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="181.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="169.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="143.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="69.1" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.0100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.0200</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,137.4 133.1,137.1 208.3,135.5 283.4,134.9 358.6,130.7 433.7,122.6 457.9,119.4 508.9,114.7 584.0,94.9"/>
 * <polyline class="ln2" points="58.0,88.0 133.1,88.0 208.3,92.0 283.4,77.0 358.6,79.0 433.7,79.0 457.9,85.0 508.9,78.0 584.0,77.0"/>
 * <circle class="mk1" cx="58.0" cy="137.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="137.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="135.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="134.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="130.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="122.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="119.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="114.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="94.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="88.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="88.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="92.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="77.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="79.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="79.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="85.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="78.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="77.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0084 | 1.0534 | 0.0090 | 0.9822 | 107.3% |
 * | 64 | 0.0084 | 2.0458 | 0.0093 | 1.8451 | 110.9% |
 * | 128 | 0.0086 | 3.9111 | 0.0091 | 3.7249 | 105.0% |
 * | 256 | 0.0087 | 7.6777 | 0.0141 | 4.7636 | 161.2% |
 * | 512 | 0.0094 | 14.1800 | 0.0137 | 9.7229 | 145.8% |
 * | 1024 | 0.0102 | 26.0500 | 0.0138 | 19.3635 | 134.5% |
 * | 1280 | 0.0103 | 32.3478 | 0.0143 | 23.2500 | 139.1% |
 * | 2048 | 0.0112 | 47.5886 | 0.0145 | 36.6469 | 129.9% |
 * | 4096 | 0.0169 | 63.1803 | 0.1817 | 5.8646 | 1077.3% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">25</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">75</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.2 133.1,214.5 208.3,209.6 283.4,199.5 358.6,182.2 433.7,150.5 457.9,133.7 508.9,93.1 584.0,51.5"/>
 * <polyline class="ln2" points="58.0,217.4 133.1,215.1 208.3,210.1 283.4,207.3 358.6,194.1 433.7,168.4 457.9,158.0 508.9,122.3 584.0,204.4"/>
 * <circle class="mk1" cx="58.0" cy="217.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="209.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="199.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="182.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="150.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="133.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="93.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="51.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="215.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="210.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="207.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="194.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="168.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="158.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="122.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="204.4" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.0500</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.200</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,211.6 133.1,211.6 208.3,211.4 283.4,211.3 358.6,210.6 433.7,209.8 457.9,209.7 508.9,208.8 584.0,203.1"/>
 * <polyline class="ln2" points="58.0,211.0 133.1,210.7 208.3,210.9 283.4,205.9 358.6,206.3 433.7,206.2 457.9,205.7 508.9,205.5 584.0,38.3"/>
 * <circle class="mk1" cx="58.0" cy="211.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="211.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="210.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="209.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="208.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="203.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="211.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="210.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="210.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="205.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="206.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="205.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="205.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="38.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0087 | 2.0073 | 0.0102 | 1.7125 | 117.2% |
 * | 64 | 0.0088 | 3.8691 | 0.0098 | 3.4771 | 111.3% |
 * | 128 | 0.0094 | 7.1658 | 0.0101 | 6.6540 | 107.7% |
 * | 256 | 0.0093 | 14.2955 | 0.0137 | 9.7196 | 147.1% |
 * | 512 | 0.0102 | 26.0629 | 0.0147 | 18.0961 | 144.0% |
 * | 1024 | 0.0110 | 48.2332 | 0.0161 | 32.9234 | 146.5% |
 * | 1280 | 0.0118 | 55.8703 | 0.0161 | 41.1793 | 135.7% |
 * | 2048 | 0.0154 | 68.8667 | 0.0214 | 49.5221 | 139.1% |
 * | 4096 | 0.0246 | 86.0417 | 0.1952 | 10.8346 | 794.1% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">100</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,216.0 133.1,212.3 208.3,205.7 283.4,191.4 358.6,167.9 433.7,123.5 457.9,108.3 508.9,82.3 584.0,47.9"/>
 * <polyline class="ln2" points="58.0,216.6 133.1,213.0 208.3,206.7 283.4,200.6 358.6,183.8 433.7,154.2 457.9,137.6 508.9,121.0 584.0,198.3"/>
 * <circle class="mk1" cx="58.0" cy="216.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="212.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="205.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="191.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="167.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="123.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="108.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="82.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="47.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="206.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="200.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="183.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="154.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="137.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="121.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="198.3" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">0.0500</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.100</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">0.150</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.200</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,211.3 133.1,211.2 208.3,210.6 283.4,210.7 358.6,209.8 433.7,209.0 457.9,208.2 508.9,204.6 584.0,195.4"/>
 * <polyline class="ln2" points="58.0,209.8 133.1,210.2 208.3,209.9 283.4,206.3 358.6,205.3 433.7,203.9 457.9,203.9 508.9,198.6 584.0,24.8"/>
 * <circle class="mk1" cx="58.0" cy="211.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="211.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="210.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="209.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="208.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="204.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="195.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="209.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="210.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="209.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="206.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="205.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="203.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="203.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="198.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="24.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0103 | 3.3860 | 0.0175 | 1.9945 | 169.8% |
 * | 64 | 0.0104 | 6.5432 | 0.0165 | 4.1205 | 158.8% |
 * | 128 | 0.0112 | 11.9485 | 0.0167 | 8.0000 | 149.4% |
 * | 256 | 0.0115 | 23.1508 | 0.0174 | 15.2073 | 152.2% |
 * | 512 | 0.0124 | 42.5567 | 0.0197 | 26.8488 | 158.5% |
 * | 1024 | 0.0164 | 64.3750 | 0.2212 | 4.7689 | 1349.9% |
 * | 1280 | 0.0218 | 60.4758 | 0.0267 | 49.2926 | 122.7% |
 * | 2048 | 0.0267 | 78.8695 | 0.2417 | 8.7192 | 904.5% |
 * | 4096 | 0.0430 | 97.9524 | 0.2886 | 14.5984 | 671.0% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">100</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,213.2 133.1,206.9 208.3,196.1 283.4,173.7 358.6,134.9 433.7,91.2 457.9,99.0 508.9,62.3 584.0,24.1"/>
 * <polyline class="ln2" points="58.0,216.0 133.1,211.8 208.3,204.0 283.4,189.6 358.6,166.3 433.7,210.5 457.9,121.4 508.9,202.6 584.0,190.8"/>
 * <circle class="mk1" cx="58.0" cy="213.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="206.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="196.1" r="4"/>
 * <circle class="mk1" cx="283.4" cy="173.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="134.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="91.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="99.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="62.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="24.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="211.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="204.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="189.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="166.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="210.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="121.4" r="4"/>
 * <circle class="mk2" cx="508.9" cy="202.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="190.8" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,213.1 133.1,213.1 208.3,212.5 283.4,212.4 358.6,211.7 433.7,209.1 457.9,205.5 508.9,202.2 584.0,191.3"/>
 * <polyline class="ln2" points="58.0,208.3 133.1,209.0 208.3,208.9 283.4,208.4 358.6,206.9 433.7,72.5 457.9,202.2 508.9,58.9 584.0,27.6"/>
 * <circle class="mk1" cx="58.0" cy="213.1" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="212.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="212.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="211.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="205.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="202.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="191.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="208.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="209.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="208.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="208.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="206.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="72.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="202.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="58.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="27.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 512</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0124 | 5.6041 | 0.0161 | 4.3254 | 129.6% |
 * | 64 | 0.0127 | 10.6332 | 0.0157 | 8.6456 | 123.0% |
 * | 128 | 0.0139 | 19.1412 | 0.0165 | 16.1550 | 118.5% |
 * | 256 | 0.0143 | 36.9286 | 0.0155 | 34.1818 | 108.0% |
 * | 512 | 0.0168 | 62.7810 | 0.0225 | 46.8182 | 134.1% |
 * | 1024 | 0.0267 | 78.9820 | 0.2417 | 8.7119 | 906.6% |
 * | 1280 | 0.0307 | 85.6333 | 0.2630 | 10.0028 | 856.1% |
 * | 2048 | 0.0484 | 86.9418 | 0.2868 | 14.6665 | 592.8% |
 * | 4096 | 0.0776 | 108.3869 | 0.2539 | 33.1233 | 327.2% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">125</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,211.0 133.1,203.0 208.3,189.4 283.4,160.9 358.6,119.6 433.7,93.6 457.9,83.0 508.9,80.9 584.0,46.6"/>
 * <polyline class="ln2" points="58.0,213.1 133.1,206.2 208.3,194.2 283.4,165.3 358.6,145.1 433.7,206.1 457.9,204.0 508.9,196.5 584.0,167.0"/>
 * <circle class="mk1" cx="58.0" cy="211.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="203.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="189.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="160.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="119.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="93.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="83.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="80.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="206.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="194.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="165.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="145.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="206.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="204.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="196.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="167.0" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m512-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,211.7 133.1,211.5 208.3,210.7 283.4,210.4 358.6,208.8 433.7,202.2 457.9,199.5 508.9,187.7 584.0,168.3"/>
 * <polyline class="ln2" points="58.0,209.3 133.1,209.5 208.3,209.0 283.4,209.7 358.6,205.0 433.7,58.9 457.9,44.7 508.9,28.8 584.0,50.7"/>
 * <circle class="mk1" cx="58.0" cy="211.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="211.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="210.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.4" r="4"/>
 * <circle class="mk1" cx="358.6" cy="208.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="199.5" r="4"/>
 * <circle class="mk1" cx="508.9" cy="187.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="168.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="209.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="209.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="209.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="209.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="205.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="58.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="44.7" r="4"/>
 * <circle class="mk2" cx="508.9" cy="28.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="50.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 1024</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0250 | 5.5846 | 0.0136 | 10.2615 | 54.4% |
 * | 64 | 0.0267 | 10.1513 | 0.0173 | 15.6303 | 64.9% |
 * | 128 | 0.0284 | 18.7885 | 0.0199 | 26.8213 | 70.1% |
 * | 256 | 0.0304 | 34.7958 | 0.0186 | 56.9931 | 61.1% |
 * | 512 | 0.0372 | 56.6503 | 0.2319 | 9.0880 | 623.4% |
 * | 1024 | 0.2241 | 18.7741 | 0.2681 | 15.6887 | 119.7% |
 * | 1280 | 0.2737 | 19.2022 | 0.2852 | 18.4309 | 104.2% |
 * | 2048 | 0.4239 | 19.8268 | 0.3474 | 24.1923 | 82.0% |
 * | 4096 | 0.8212 | 20.4589 | 0.4739 | 35.4552 | 57.7% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,201.4 133.1,186.2 208.3,157.4 283.4,104.0 358.6,31.2 433.7,157.4 457.9,156.0 508.9,153.9 584.0,151.8"/>
 * <polyline class="ln2" points="58.0,185.8 133.1,167.9 208.3,130.6 283.4,30.0 358.6,189.7 433.7,167.7 457.9,158.6 508.9,139.4 584.0,101.8"/>
 * <circle class="mk1" cx="58.0" cy="201.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="186.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="157.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="104.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="31.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="157.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="156.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="153.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="151.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="185.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="167.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="130.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="30.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="189.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="167.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="158.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="139.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="101.8" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,215.0 133.1,214.7 208.3,214.3 283.4,213.9 358.6,212.6 433.7,175.2 457.9,165.3 508.9,135.2 584.0,55.8"/>
 * <polyline class="ln2" points="58.0,217.3 133.1,216.5 208.3,216.0 283.4,216.3 358.6,173.6 433.7,166.4 457.9,163.0 508.9,150.5 584.0,125.2"/>
 * <circle class="mk1" cx="58.0" cy="215.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="213.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="175.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="165.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="135.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="173.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="166.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="163.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="150.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="125.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 1280</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0350 | 4.9808 | 0.0127 | 13.7649 | 36.2% |
 * | 64 | 0.0354 | 9.5465 | 0.0142 | 23.7750 | 40.2% |
 * | 128 | 0.0389 | 17.1184 | 0.0161 | 41.4661 | 41.3% |
 * | 256 | 0.0886 | 14.9222 | 0.1614 | 8.1895 | 182.2% |
 * | 512 | 0.1525 | 17.2744 | 0.2130 | 12.3654 | 139.7% |
 * | 1024 | 0.2782 | 18.9000 | 0.2736 | 19.2116 | 98.4% |
 * | 1280 | 0.3379 | 19.4412 | 0.2905 | 22.6142 | 86.0% |
 * | 2048 | 1.1589 | 9.0641 | 0.3503 | 29.9859 | 30.2% |
 * | 4096 | 1.0199 | 20.5884 | 0.4989 | 42.0865 | 48.9% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,200.1 133.1,181.8 208.3,151.5 283.4,160.3 358.6,150.9 433.7,144.4 457.9,142.2 508.9,183.7 584.0,137.6"/>
 * <polyline class="ln2" points="58.0,164.9 133.1,124.9 208.3,54.1 283.4,187.2 358.6,170.5 433.7,143.2 457.9,129.5 508.9,100.1 584.0,51.7"/>
 * <circle class="mk1" cx="58.0" cy="200.1" r="4"/>
 * <circle class="mk1" cx="133.1" cy="181.8" r="4"/>
 * <circle class="mk1" cx="208.3" cy="151.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="160.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="150.9" r="4"/>
 * <circle class="mk1" cx="433.7" cy="144.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="142.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="183.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="137.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="164.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="124.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="54.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="187.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="170.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="143.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="129.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="100.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="51.7" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,214.2 133.1,214.1 208.3,213.5 283.4,205.2 358.6,194.6 433.7,173.6 457.9,163.7 508.9,26.9 584.0,50.0"/>
 * <polyline class="ln2" points="58.0,217.9 133.1,217.6 208.3,217.3 283.4,193.1 358.6,184.5 433.7,174.4 457.9,171.6 508.9,161.6 584.0,136.9"/>
 * <circle class="mk1" cx="58.0" cy="214.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.1" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="205.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="194.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="173.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="163.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="26.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="50.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="193.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="184.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="174.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="171.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="161.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="136.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 2048</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0433 | 6.4289 | 0.0103 | 27.0015 | 23.8% |
 * | 64 | 0.0401 | 13.5016 | 0.0098 | 55.1517 | 24.5% |
 * | 128 | 0.0471 | 22.6349 | 0.0153 | 69.5841 | 32.5% |
 * | 256 | 0.0485 | 43.5597 | 0.1359 | 15.5592 | 280.0% |
 * | 512 | 0.0576 | 73.1175 | 0.1677 | 25.1213 | 291.1% |
 * | 1024 | 0.0802 | 104.8829 | 0.3050 | 27.5715 | 380.4% |
 * | 1280 | 0.0933 | 112.5843 | 0.2908 | 36.1263 | 311.6% |
 * | 2048 | 0.1331 | 126.2457 | 0.4367 | 38.4727 | 328.1% |
 * | 4096 | 0.2437 | 137.8332 | 0.6313 | 53.2022 | 259.1% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,211.4 133.1,202.0 208.3,189.8 283.4,161.9 358.6,122.5 433.7,80.2 457.9,69.9 508.9,51.7 584.0,36.2"/>
 * <polyline class="ln2" points="58.0,184.0 133.1,146.5 208.3,127.2 283.4,199.3 358.6,186.5 433.7,183.2 457.9,171.8 508.9,168.7 584.0,149.1"/>
 * <circle class="mk1" cx="58.0" cy="211.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="202.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="189.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="161.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="122.5" r="4"/>
 * <circle class="mk1" cx="433.7" cy="80.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="69.9" r="4"/>
 * <circle class="mk1" cx="508.9" cy="51.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="36.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="184.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="146.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="127.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="199.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="186.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="183.2" r="4"/>
 * <circle class="mk2" cx="457.9" cy="171.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="168.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="149.1" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,209.2 133.1,210.0 208.3,208.2 283.4,207.9 358.6,205.6 433.7,200.0 457.9,196.7 508.9,186.7 584.0,159.1"/>
 * <polyline class="ln2" points="58.0,217.4 133.1,217.6 208.3,216.2 283.4,186.0 358.6,178.1 433.7,143.8 457.9,147.3 508.9,110.8 584.0,62.2"/>
 * <circle class="mk1" cx="58.0" cy="209.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="210.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="208.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="207.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="205.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="200.0" r="4"/>
 * <circle class="mk1" cx="457.9" cy="196.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="186.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="159.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="186.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="178.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="143.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="147.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="110.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="62.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 4096</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0671 | 8.3033 | 0.0103 | 54.0745 | 15.4% |
 * | 64 | 0.0711 | 15.2115 | 0.0145 | 74.6137 | 20.4% |
 * | 128 | 0.0815 | 26.1339 | 0.0252 | 84.6484 | 30.9% |
 * | 256 | 0.0814 | 51.9575 | 0.0392 | 107.7716 | 48.2% |
 * | 512 | 0.0998 | 84.4369 | 0.1815 | 46.4213 | 181.9% |
 * | 1024 | 0.1413 | 119.0125 | 0.3220 | 52.2202 | 227.9% |
 * | 1280 | 1.0260 | 20.4760 | 0.1649 | 127.3853 | 16.1% |
 * | 2048 | 1.6223 | 20.7091 | 0.4833 | 69.5085 | 29.8% |
 * | 4096 | 0.4559 | 147.3177 | 1.0926 | 61.4658 | 239.7% |
 *
 * <svg id="bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,208.9 133.1,199.7 208.3,185.2 283.4,150.7 358.6,107.4 433.7,61.3 457.9,192.7 508.9,192.4 584.0,23.6"/>
 * <polyline class="ln2" points="58.0,147.9 133.1,120.5 208.3,107.1 283.4,76.3 358.6,158.1 433.7,150.4 457.9,50.2 508.9,127.3 584.0,138.0"/>
 * <circle class="mk1" cx="58.0" cy="208.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="199.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="185.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="150.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="107.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="61.3" r="4"/>
 * <circle class="mk1" cx="457.9" cy="192.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="192.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="147.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="120.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="107.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="76.3" r="4"/>
 * <circle class="mk2" cx="358.6" cy="158.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="150.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="50.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="127.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="138.0" r="4"/>
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
 * <svg id="bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-no-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,213.3 133.1,212.9 208.3,211.8 283.4,211.9 358.6,210.0 433.7,205.9 457.9,117.4 508.9,57.8 584.0,174.4"/>
 * <polyline class="ln2" points="58.0,219.0 133.1,218.6 208.3,217.5 283.4,216.1 358.6,201.8 433.7,187.8 457.9,203.5 508.9,171.7 584.0,110.7"/>
 * <circle class="mk1" cx="58.0" cy="213.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="212.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="211.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="210.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="205.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="117.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="57.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="174.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="217.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="216.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="201.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="187.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="203.5" r="4"/>
 * <circle class="mk2" cx="508.9" cy="171.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="110.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — trans = transpose (9 shapes)</summary>
 *
 * <details>
 * <summary>m = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0184 | 0.2433 | 0.0120 | 0.3738 | 65.1% |
 * | 64 | 0.0184 | 0.4800 | 0.0121 | 0.7292 | 65.8% |
 * | 128 | 0.0184 | 0.9514 | 0.0116 | 1.5076 | 63.1% |
 * | 256 | 0.0184 | 1.8958 | 0.0123 | 2.8438 | 66.7% |
 * | 512 | 0.0187 | 3.7297 | 0.0122 | 5.6993 | 65.4% |
 * | 1024 | 0.0187 | 7.4462 | 0.0126 | 11.0840 | 67.2% |
 * | 1280 | 0.0187 | 9.3139 | 0.0131 | 13.3431 | 69.8% |
 * | 2048 | 0.0188 | 14.7844 | 0.0145 | 19.1806 | 77.1% |
 * | 4096 | 0.0192 | 29.0200 | 0.0154 | 36.1620 | 80.2% |
 *
 * <svg id="bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.8 133.1,217.6 208.3,215.2 283.4,210.5 358.6,201.4 433.7,182.8 457.9,173.4 508.9,146.1 584.0,74.9"/>
 * <polyline class="ln2" points="58.0,218.1 133.1,216.4 208.3,212.5 283.4,205.8 358.6,191.5 433.7,164.6 457.9,153.3 508.9,124.1 584.0,39.2"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.5" r="4"/>
 * <circle class="mk1" cx="358.6" cy="201.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="182.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="173.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="146.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="74.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="212.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="205.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="191.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="164.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="153.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="124.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="39.2" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">0.0100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.0200</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,35.8 133.1,36.0 208.3,35.7 283.4,35.7 358.6,33.0 433.7,32.8 457.9,33.0 508.9,31.5 584.0,28.0"/>
 * <polyline class="ln2" points="58.0,100.0 133.1,99.0 208.3,104.0 283.4,97.0 358.6,98.0 433.7,94.0 457.9,89.0 508.9,75.0 584.0,66.0"/>
 * <circle class="mk1" cx="58.0" cy="35.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="36.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="35.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="35.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="33.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="32.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="33.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="31.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="100.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="99.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="104.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="97.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="98.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="94.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="89.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="75.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="66.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0146 | 0.5965 | 0.0084 | 1.0303 | 57.9% |
 * | 64 | 0.0150 | 1.1453 | 0.0087 | 1.9779 | 57.9% |
 * | 128 | 0.0158 | 2.1560 | 0.0087 | 3.9262 | 54.9% |
 * | 256 | 0.0158 | 4.2915 | 0.0125 | 5.4082 | 79.4% |
 * | 512 | 0.0160 | 8.4555 | 0.0127 | 10.6734 | 79.2% |
 * | 1024 | 0.0164 | 16.5318 | 0.0142 | 19.0236 | 86.9% |
 * | 1280 | 0.0165 | 20.5204 | 0.0145 | 23.3289 | 88.0% |
 * | 2048 | 0.0168 | 32.2595 | 0.0163 | 33.2429 | 97.0% |
 * | 4096 | 0.0212 | 51.0574 | 0.0207 | 52.2411 | 97.7% |
 *
 * <svg id="bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.0 133.1,216.2 208.3,212.8 283.4,205.7 358.6,191.8 433.7,164.9 457.9,151.6 508.9,112.5 584.0,49.8"/>
 * <polyline class="ln2" points="58.0,216.6 133.1,213.4 208.3,206.9 283.4,202.0 358.6,184.4 433.7,156.6 457.9,142.2 508.9,109.2 584.0,45.9"/>
 * <circle class="mk1" cx="58.0" cy="218.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="212.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="205.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="191.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="164.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="151.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="112.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="49.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="206.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="202.0" r="4"/>
 * <circle class="mk2" cx="358.6" cy="184.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="156.6" r="4"/>
 * <circle class="mk2" cx="457.9" cy="142.2" r="4"/>
 * <circle class="mk2" cx="508.9" cy="109.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="45.9" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">0.0100</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">0.0200</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">0.0300</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,122.7 133.1,120.2 208.3,114.7 283.4,114.6 358.6,113.2 433.7,110.9 457.9,110.1 508.9,108.2 584.0,78.8"/>
 * <polyline class="ln2" points="58.0,164.0 133.1,162.0 208.3,162.0 283.4,136.7 358.6,135.3 433.7,125.3 457.9,123.3 508.9,111.3 584.0,82.0"/>
 * <circle class="mk1" cx="58.0" cy="122.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="120.2" r="4"/>
 * <circle class="mk1" cx="208.3" cy="114.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="114.6" r="4"/>
 * <circle class="mk1" cx="358.6" cy="113.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="110.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="110.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="108.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="78.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="164.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="162.0" r="4"/>
 * <circle class="mk2" cx="208.3" cy="162.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="136.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="135.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="125.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="123.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="111.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="82.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 128</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0249 | 0.6894 | 0.0133 | 1.2854 | 53.6% |
 * | 64 | 0.0267 | 1.2677 | 0.0131 | 2.5725 | 49.3% |
 * | 128 | 0.0278 | 2.4092 | 0.0137 | 4.9029 | 49.1% |
 * | 256 | 0.0277 | 4.8194 | 0.0101 | 13.2782 | 36.3% |
 * | 512 | 0.0276 | 9.6593 | 0.0122 | 21.8793 | 44.1% |
 * | 1024 | 0.0287 | 18.5686 | 0.0142 | 37.4713 | 49.6% |
 * | 1280 | 0.0299 | 22.2512 | 0.0143 | 46.4643 | 47.9% |
 * | 2048 | 0.0640 | 16.6522 | 0.0152 | 70.2447 | 23.7% |
 * | 4096 | 0.1237 | 17.2254 | 0.1161 | 18.3557 | 93.8% |
 *
 * <svg id="bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="153.3" x2="584" y2="153.3"/>
 * <line class="gr" x1="58" y1="86.7" x2="584" y2="86.7"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">25</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">75</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.2 133.1,216.6 208.3,213.6 283.4,207.1 358.6,194.2 433.7,170.5 457.9,160.7 508.9,175.6 584.0,174.1"/>
 * <polyline class="ln2" points="58.0,216.6 133.1,213.1 208.3,206.9 283.4,184.6 358.6,161.7 433.7,120.1 457.9,96.1 508.9,32.7 584.0,171.1"/>
 * <circle class="mk1" cx="58.0" cy="218.2" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.6" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="207.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="194.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="170.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="160.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="175.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="174.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="213.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="206.9" r="4"/>
 * <circle class="mk2" cx="283.4" cy="184.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="161.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="120.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="96.1" r="4"/>
 * <circle class="mk2" cx="508.9" cy="32.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="171.1" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m128-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,186.8 133.1,184.5 208.3,182.9 283.4,183.0 358.6,183.2 433.7,181.7 457.9,180.1 508.9,134.7 584.0,55.1"/>
 * <polyline class="ln2" points="58.0,202.3 133.1,202.5 208.3,201.7 283.4,206.5 358.6,203.7 433.7,201.1 457.9,200.9 508.9,199.7 584.0,65.2"/>
 * <circle class="mk1" cx="58.0" cy="186.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="184.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="182.9" r="4"/>
 * <circle class="mk1" cx="283.4" cy="183.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="183.2" r="4"/>
 * <circle class="mk1" cx="433.7" cy="181.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="180.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="134.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="55.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="202.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="202.5" r="4"/>
 * <circle class="mk2" cx="208.3" cy="201.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="206.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="203.7" r="4"/>
 * <circle class="mk2" cx="433.7" cy="201.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="200.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="199.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="65.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0415 | 0.8204 | 0.0093 | 3.6627 | 22.4% |
 * | 64 | 0.0425 | 1.5777 | 0.0089 | 7.5396 | 20.9% |
 * | 128 | 0.0430 | 3.0975 | 0.0098 | 13.5505 | 22.9% |
 * | 256 | 0.0430 | 6.1667 | 0.0127 | 20.9293 | 29.5% |
 * | 512 | 0.0448 | 11.8171 | 0.0116 | 45.6386 | 25.9% |
 * | 1024 | 0.0946 | 11.1808 | 0.0137 | 76.9639 | 14.5% |
 * | 1280 | 0.1147 | 11.5252 | 0.0184 | 71.8470 | 16.0% |
 * | 2048 | 0.2600 | 8.1344 | 0.0233 | 90.5826 | 9.0% |
 * | 4096 | 0.4848 | 8.7205 | 0.0369 | 114.6944 | 7.6% |
 *
 * <svg id="bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">125</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.7 133.1,217.5 208.3,215.0 283.4,210.1 358.6,201.1 433.7,202.1 457.9,201.6 508.9,207.0 584.0,206.0"/>
 * <polyline class="ln2" points="58.0,214.1 133.1,207.9 208.3,198.3 283.4,186.5 358.6,147.0 433.7,96.9 457.9,105.0 508.9,75.1 584.0,36.5"/>
 * <circle class="mk1" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.5" r="4"/>
 * <circle class="mk1" cx="208.3" cy="215.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.1" r="4"/>
 * <circle class="mk1" cx="358.6" cy="201.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="202.1" r="4"/>
 * <circle class="mk1" cx="457.9" cy="201.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="207.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="206.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="214.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="207.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="198.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="186.5" r="4"/>
 * <circle class="mk2" cx="358.6" cy="147.0" r="4"/>
 * <circle class="mk2" cx="433.7" cy="96.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="105.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="75.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.5" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,203.4 133.1,203.0 208.3,202.8 283.4,202.8 358.6,202.1 433.7,182.2 457.9,174.1 508.9,116.0 584.0,26.1"/>
 * <polyline class="ln2" points="58.0,216.3 133.1,216.4 208.3,216.1 283.4,214.9 358.6,215.4 433.7,214.5 457.9,212.6 508.9,210.7 584.0,205.2"/>
 * <circle class="mk1" cx="58.0" cy="203.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="203.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="202.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="202.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="202.1" r="4"/>
 * <circle class="mk1" cx="433.7" cy="182.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="174.1" r="4"/>
 * <circle class="mk1" cx="508.9" cy="116.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="26.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.4" r="4"/>
 * <circle class="mk2" cx="208.3" cy="216.1" r="4"/>
 * <circle class="mk2" cx="283.4" cy="214.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="215.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="214.5" r="4"/>
 * <circle class="mk2" cx="457.9" cy="212.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="210.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="205.2" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 512</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0751 | 0.9037 | 0.0096 | 7.0903 | 12.7% |
 * | 64 | 0.0781 | 1.7104 | 0.0097 | 13.8278 | 12.4% |
 * | 128 | 0.0791 | 3.3514 | 0.0101 | 26.1451 | 12.8% |
 * | 256 | 0.0788 | 6.7040 | 0.0115 | 45.9944 | 14.6% |
 * | 512 | 0.2280 | 4.6266 | 0.0135 | 78.3829 | 5.9% |
 * | 1024 | 0.3215 | 6.5541 | 0.0257 | 81.9614 | 8.0% |
 * | 1280 | 0.3499 | 7.5263 | 0.0287 | 91.8571 | 8.2% |
 * | 2048 | 0.4895 | 8.6056 | 0.0390 | 108.0854 | 8.0% |
 * | 4096 | 0.9585 | 8.7885 | 0.0680 | 123.7865 | 7.1% |
 *
 * <svg id="bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">25</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">50</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">100</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">125</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.6 133.1,217.3 208.3,214.6 283.4,209.3 358.6,212.6 433.7,209.5 457.9,208.0 508.9,206.2 584.0,205.9"/>
 * <polyline class="ln2" points="58.0,208.7 133.1,197.9 208.3,178.2 283.4,146.4 358.6,94.6 433.7,88.9 457.9,73.0 508.9,47.1 584.0,21.9"/>
 * <circle class="mk1" cx="58.0" cy="218.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.6" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.3" r="4"/>
 * <circle class="mk1" cx="358.6" cy="212.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="209.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="208.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="206.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="205.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="208.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="197.9" r="4"/>
 * <circle class="mk2" cx="208.3" cy="178.2" r="4"/>
 * <circle class="mk2" cx="283.4" cy="146.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="94.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="88.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="73.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="47.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="21.9" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m512-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,205.0 133.1,204.4 208.3,204.2 283.4,204.2 358.6,174.4 433.7,155.7 457.9,150.0 508.9,122.1 584.0,28.3"/>
 * <polyline class="ln2" points="58.0,218.1 133.1,218.1 208.3,218.0 283.4,217.7 358.6,217.3 433.7,214.9 457.9,214.3 508.9,212.2 584.0,206.4"/>
 * <circle class="mk1" cx="58.0" cy="205.0" r="4"/>
 * <circle class="mk1" cx="133.1" cy="204.4" r="4"/>
 * <circle class="mk1" cx="208.3" cy="204.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="204.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="174.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="155.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="150.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="122.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.1" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.7" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.3" r="4"/>
 * <circle class="mk2" cx="433.7" cy="214.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="214.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="212.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="206.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 1024</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.1669 | 0.8113 | 0.0107 | 12.6517 | 6.4% |
 * | 64 | 0.1713 | 1.5573 | 0.0130 | 20.4816 | 7.6% |
 * | 128 | 0.1761 | 3.0058 | 0.0143 | 36.9286 | 8.1% |
 * | 256 | 0.4523 | 2.3320 | 0.0141 | 74.9091 | 3.1% |
 * | 512 | 0.6145 | 3.4261 | 0.0236 | 89.2095 | 3.8% |
 * | 1024 | 0.6578 | 6.3952 | 0.0415 | 101.3539 | 6.3% |
 * | 1280 | 0.7037 | 7.4707 | 0.0467 | 112.5646 | 6.6% |
 * | 2048 | 0.9659 | 8.7056 | 0.0655 | 128.3125 | 6.8% |
 * | 4096 | 1.8526 | 9.0759 | 0.1209 | 139.0237 | 6.5% |
 *
 * <svg id="bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,218.9 133.1,217.9 208.3,216.0 283.4,216.9 358.6,215.4 433.7,211.5 457.9,210.0 508.9,208.4 584.0,207.9"/>
 * <polyline class="ln2" points="58.0,203.1 133.1,192.7 208.3,170.8 283.4,120.1 358.6,101.1 433.7,84.9 457.9,69.9 508.9,48.9 584.0,34.6"/>
 * <circle class="mk1" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="216.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="216.9" r="4"/>
 * <circle class="mk1" cx="358.6" cy="215.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="211.5" r="4"/>
 * <circle class="mk1" cx="457.9" cy="210.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="208.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="207.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="203.1" r="4"/>
 * <circle class="mk2" cx="133.1" cy="192.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="170.8" r="4"/>
 * <circle class="mk2" cx="283.4" cy="120.1" r="4"/>
 * <circle class="mk2" cx="358.6" cy="101.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="84.9" r="4"/>
 * <circle class="mk2" cx="457.9" cy="69.9" r="4"/>
 * <circle class="mk2" cx="508.9" cy="48.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="34.6" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1024-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,203.3 133.1,202.9 208.3,202.4 283.4,174.8 358.6,158.6 433.7,154.2 457.9,149.6 508.9,123.4 584.0,34.7"/>
 * <polyline class="ln2" points="58.0,218.9 133.1,218.7 208.3,218.6 283.4,218.6 358.6,217.6 433.7,215.8 457.9,215.3 508.9,213.4 584.0,207.9"/>
 * <circle class="mk1" cx="58.0" cy="203.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="202.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="202.4" r="4"/>
 * <circle class="mk1" cx="283.4" cy="174.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="158.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="154.2" r="4"/>
 * <circle class="mk1" cx="457.9" cy="149.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="123.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="34.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.7" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="218.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="217.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="215.8" r="4"/>
 * <circle class="mk2" cx="457.9" cy="215.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="213.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="207.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 1280</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.1052 | 1.6093 | 0.0121 | 14.0265 | 11.5% |
 * | 64 | 0.1084 | 3.0753 | 0.0123 | 27.1250 | 11.3% |
 * | 128 | 0.1102 | 6.0006 | 0.0125 | 53.0051 | 11.3% |
 * | 256 | 0.1753 | 7.5181 | 0.0189 | 69.5676 | 10.8% |
 * | 512 | 0.1738 | 15.1354 | 0.0280 | 94.1133 | 16.1% |
 * | 1024 | 0.1827 | 28.7714 | 0.0450 | 116.7420 | 24.6% |
 * | 1280 | 0.1841 | 35.6792 | 0.0538 | 122.0089 | 29.2% |
 * | 2048 | 0.1864 | 56.3694 | 0.0800 | 131.3671 | 42.9% |
 * | 4096 | 0.2025 | 103.7604 | 0.1455 | 144.4065 | 71.9% |
 *
 * <svg id="bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.9 133.1,215.9 208.3,212.0 283.4,210.0 358.6,199.8 433.7,181.6 457.9,172.4 508.9,144.8 584.0,81.7"/>
 * <polyline class="ln2" points="58.0,201.3 133.1,183.8 208.3,149.3 283.4,127.2 358.6,94.5 433.7,64.3 457.9,57.3 508.9,44.8 584.0,27.5"/>
 * <circle class="mk1" cx="58.0" cy="217.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="212.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="210.0" r="4"/>
 * <circle class="mk1" cx="358.6" cy="199.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="181.6" r="4"/>
 * <circle class="mk1" cx="457.9" cy="172.4" r="4"/>
 * <circle class="mk1" cx="508.9" cy="144.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="81.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="201.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="183.8" r="4"/>
 * <circle class="mk2" cx="208.3" cy="149.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="127.2" r="4"/>
 * <circle class="mk2" cx="358.6" cy="94.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="64.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="57.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="44.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="27.5" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m1280-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,135.9 133.1,133.3 208.3,131.8 283.4,79.8 358.6,81.0 433.7,73.8 457.9,72.7 508.9,70.9 584.0,58.0"/>
 * <polyline class="ln2" points="58.0,210.3 133.1,210.2 208.3,210.0 283.4,204.9 358.6,197.6 433.7,184.0 457.9,177.0 508.9,156.0 584.0,103.6"/>
 * <circle class="mk1" cx="58.0" cy="135.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="133.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="131.8" r="4"/>
 * <circle class="mk1" cx="283.4" cy="79.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="81.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="73.8" r="4"/>
 * <circle class="mk1" cx="457.9" cy="72.7" r="4"/>
 * <circle class="mk1" cx="508.9" cy="70.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="210.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="210.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="204.9" r="4"/>
 * <circle class="mk2" cx="358.6" cy="197.6" r="4"/>
 * <circle class="mk2" cx="433.7" cy="184.0" r="4"/>
 * <circle class="mk2" cx="457.9" cy="177.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="156.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="103.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 2048</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.1620 | 1.6698 | 0.0130 | 20.7764 | 8.0% |
 * | 64 | 0.1666 | 3.1994 | 0.0143 | 37.3453 | 8.6% |
 * | 128 | 0.2346 | 4.5081 | 0.0143 | 73.7857 | 6.1% |
 * | 256 | 0.2723 | 7.7382 | 0.0244 | 86.3685 | 9.0% |
 * | 512 | 0.2704 | 15.5560 | 0.0375 | 112.1160 | 13.9% |
 * | 1024 | 0.2864 | 29.3421 | 0.0674 | 124.7179 | 23.5% |
 * | 1280 | 0.2877 | 36.5135 | 0.0797 | 131.8033 | 27.7% |
 * | 2048 | 0.8387 | 20.0334 | 0.1222 | 137.4492 | 14.6% |
 * | 4096 | 1.6117 | 20.8445 | 0.2265 | 148.3162 | 14.1% |
 *
 * <svg id="bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,217.8 133.1,215.7 208.3,214.0 283.4,209.7 358.6,199.3 433.7,180.9 457.9,171.3 508.9,193.3 584.0,192.2"/>
 * <polyline class="ln2" points="58.0,192.3 133.1,170.2 208.3,121.6 283.4,104.8 358.6,70.5 433.7,53.7 457.9,44.3 508.9,36.7 584.0,22.2"/>
 * <circle class="mk1" cx="58.0" cy="217.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="215.7" r="4"/>
 * <circle class="mk1" cx="208.3" cy="214.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="209.7" r="4"/>
 * <circle class="mk1" cx="358.6" cy="199.3" r="4"/>
 * <circle class="mk1" cx="433.7" cy="180.9" r="4"/>
 * <circle class="mk1" cx="457.9" cy="171.3" r="4"/>
 * <circle class="mk1" cx="508.9" cy="193.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="192.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="192.3" r="4"/>
 * <circle class="mk2" cx="133.1" cy="170.2" r="4"/>
 * <circle class="mk2" cx="208.3" cy="121.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="104.8" r="4"/>
 * <circle class="mk2" cx="358.6" cy="70.5" r="4"/>
 * <circle class="mk2" cx="433.7" cy="53.7" r="4"/>
 * <circle class="mk2" cx="457.9" cy="44.3" r="4"/>
 * <circle class="mk2" cx="508.9" cy="36.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="22.2" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m2048-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,203.8 133.1,203.3 208.3,196.5 283.4,192.8 358.6,193.0 433.7,191.4 457.9,191.2 508.9,136.1 584.0,58.8"/>
 * <polyline class="ln2" points="58.0,218.7 133.1,218.6 208.3,218.6 283.4,217.6 358.6,216.2 433.7,213.3 457.9,212.0 508.9,207.8 584.0,197.3"/>
 * <circle class="mk1" cx="58.0" cy="203.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="203.3" r="4"/>
 * <circle class="mk1" cx="208.3" cy="196.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="192.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="193.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="191.4" r="4"/>
 * <circle class="mk1" cx="457.9" cy="191.2" r="4"/>
 * <circle class="mk1" cx="508.9" cy="136.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="218.7" r="4"/>
 * <circle class="mk2" cx="133.1" cy="218.6" r="4"/>
 * <circle class="mk2" cx="208.3" cy="218.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="217.6" r="4"/>
 * <circle class="mk2" cx="358.6" cy="216.2" r="4"/>
 * <circle class="mk2" cx="433.7" cy="213.3" r="4"/>
 * <circle class="mk2" cx="457.9" cy="212.0" r="4"/>
 * <circle class="mk2" cx="508.9" cy="207.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="197.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>m = 4096</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.2257 | 2.3971 | 0.0184 | 29.3472 | 8.2% |
 * | 64 | 0.3548 | 3.0034 | 0.0162 | 65.8024 | 4.6% |
 * | 128 | 0.4232 | 4.9962 | 0.0265 | 79.9033 | 6.3% |
 * | 256 | 0.4249 | 9.9136 | 0.0397 | 106.2106 | 9.3% |
 * | 512 | 0.4260 | 19.7404 | 0.0655 | 128.3125 | 15.4% |
 * | 1024 | 0.4457 | 37.7006 | 0.1254 | 133.9770 | 28.1% |
 * | 1280 | 0.4559 | 46.0631 | 0.1510 | 139.0237 | 33.1% |
 * | 2048 | 0.4582 | 73.2986 | 0.2357 | 142.5215 | 51.4% |
 * | 4096 | 0.5281 | 127.1701 | 1.1035 | 60.8580 | 209.0% |
 *
 * <svg id="bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">25</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">50</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">75</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">100</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">125</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">150</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,216.8 133.1,216.0 208.3,213.3 283.4,206.8 358.6,193.7 433.7,169.7 457.9,158.6 508.9,122.3 584.0,50.4"/>
 * <polyline class="ln2" points="58.0,180.9 133.1,132.3 208.3,113.5 283.4,78.4 358.6,48.9 433.7,41.4 457.9,34.6 508.9,30.0 584.0,138.9"/>
 * <circle class="mk1" cx="58.0" cy="216.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="216.0" r="4"/>
 * <circle class="mk1" cx="208.3" cy="213.3" r="4"/>
 * <circle class="mk1" cx="283.4" cy="206.8" r="4"/>
 * <circle class="mk1" cx="358.6" cy="193.7" r="4"/>
 * <circle class="mk1" cx="433.7" cy="169.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="158.6" r="4"/>
 * <circle class="mk1" cx="508.9" cy="122.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="50.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="180.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="132.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="113.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="78.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="48.9" r="4"/>
 * <circle class="mk2" cx="433.7" cy="41.4" r="4"/>
 * <circle class="mk2" cx="457.9" cy="34.6" r="4"/>
 * <circle class="mk2" cx="508.9" cy="30.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="138.9" r="4"/>
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
 * <svg id="bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemv-trans-transpose-m4096-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="133.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="208.3" y="236" text-anchor="middle">128</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">256</text>
 * <text class="at" x="358.6" y="236" text-anchor="middle">512</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="457.9" y="236" text-anchor="middle">1.3K</text>
 * <text class="at" x="508.9" y="236" text-anchor="middle">2.0K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">4.1K</text>
 * <polyline class="ln1" points="58.0,182.4 133.1,160.9 208.3,149.5 283.4,149.2 358.6,149.0 433.7,145.7 457.9,144.0 508.9,143.6 584.0,132.0"/>
 * <polyline class="ln2" points="58.0,216.9 133.1,217.3 208.3,215.6 283.4,213.4 358.6,209.1 433.7,199.1 457.9,194.8 508.9,180.7 584.0,36.1"/>
 * <circle class="mk1" cx="58.0" cy="182.4" r="4"/>
 * <circle class="mk1" cx="133.1" cy="160.9" r="4"/>
 * <circle class="mk1" cx="208.3" cy="149.5" r="4"/>
 * <circle class="mk1" cx="283.4" cy="149.2" r="4"/>
 * <circle class="mk1" cx="358.6" cy="149.0" r="4"/>
 * <circle class="mk1" cx="433.7" cy="145.7" r="4"/>
 * <circle class="mk1" cx="457.9" cy="144.0" r="4"/>
 * <circle class="mk1" cx="508.9" cy="143.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="132.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.9" r="4"/>
 * <circle class="mk2" cx="133.1" cy="217.3" r="4"/>
 * <circle class="mk2" cx="208.3" cy="215.6" r="4"/>
 * <circle class="mk2" cx="283.4" cy="213.4" r="4"/>
 * <circle class="mk2" cx="358.6" cy="209.1" r="4"/>
 * <circle class="mk2" cx="433.7" cy="199.1" r="4"/>
 * <circle class="mk2" cx="457.9" cy="194.8" r="4"/>
 * <circle class="mk2" cx="508.9" cy="180.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="36.1" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.sgemv.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/wgblas/trans.sgemv.js) — WebGPU trans-sweep benchmark script
 * - [trans.sgemv.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemv/cuda/trans.sgemv.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemv
 */
