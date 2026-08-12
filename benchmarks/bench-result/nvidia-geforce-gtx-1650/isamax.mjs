/**
 * Benchmark results for isamax on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0205 | 0.0063 | 0.0169 | 0.0076 | 82.3% |
 * | 64 | 0.0209 | 0.0122 | 0.0166 | 0.0154 | 79.4% |
 * | 128 | 0.0203 | 0.0252 | 0.0168 | 0.0304 | 82.9% |
 * | 512 | 0.0209 | 0.0980 | 0.0171 | 0.1200 | 81.7% |
 * | 1024 | 0.0207 | 0.1978 | 0.0170 | 0.2406 | 82.2% |
 * | 4096 | 0.0206 | 0.7950 | 0.0182 | 0.9014 | 88.2% |
 * | 16384 | 0.0210 | 3.1267 | 0.0181 | 3.6152 | 86.5% |
 * | 65536 | 0.0215 | 12.1724 | 0.0181 | 14.4991 | 84.0% |
 * | 262144 | 0.0284 | 36.9425 | 0.0209 | 50.1423 | 73.7% |
 * | 1048576 | 0.0473 | 88.6520 | 0.0403 | 104.0667 | 85.2% |
 * | 4194304 | 0.1181 | 142.0450 | 0.1094 | 153.3006 | 92.7% |
 * | 16777216 | 0.4094 | 163.9040 | 0.4007 | 167.4640 | 97.9% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.2 307.2,216.9 362.5,207.8 417.9,183.1 473.3,131.3 528.6,78.0 584.0,56.1"/>
 * <polyline class="ln2" points="58.0,220.0 85.7,220.0 113.4,220.0 168.7,219.9 196.4,219.8 251.8,219.1 307.2,216.4 362.5,205.5 417.9,169.9 473.3,115.9 528.6,66.7 584.0,52.5"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk1" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="219.2" r="4"/>
 * <circle class="mk1" cx="307.2" cy="216.9" r="4"/>
 * <circle class="mk1" cx="362.5" cy="207.8" r="4"/>
 * <circle class="mk1" cx="417.9" cy="183.1" r="4"/>
 * <circle class="mk1" cx="473.3" cy="131.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="78.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="85.7" cy="220.0" r="4"/>
 * <circle class="mk2" cx="113.4" cy="220.0" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.9" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.8" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.1" r="4"/>
 * <circle class="mk2" cx="307.2" cy="216.4" r="4"/>
 * <circle class="mk2" cx="362.5" cy="205.5" r="4"/>
 * <circle class="mk2" cx="417.9" cy="169.9" r="4"/>
 * <circle class="mk2" cx="473.3" cy="115.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="66.7" r="4"/>
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
 * <svg id="bc-isamax-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-isamax-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,211.8 85.7,211.6 113.4,211.9 168.7,211.6 196.4,211.7 251.8,211.8 307.2,211.6 362.5,211.4 417.9,208.6 473.3,201.1 528.6,172.8 584.0,56.2"/>
 * <polyline class="ln2" points="58.0,213.2 85.7,213.4 113.4,213.3 168.7,213.2 196.4,213.2 251.8,212.7 307.2,212.8 362.5,212.8 417.9,211.6 473.3,203.9 528.6,176.2 584.0,59.7"/>
 * <circle class="mk1" cx="58.0" cy="211.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="211.6" r="4"/>
 * <circle class="mk1" cx="113.4" cy="211.9" r="4"/>
 * <circle class="mk1" cx="168.7" cy="211.6" r="4"/>
 * <circle class="mk1" cx="196.4" cy="211.7" r="4"/>
 * <circle class="mk1" cx="251.8" cy="211.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="211.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="211.4" r="4"/>
 * <circle class="mk1" cx="417.9" cy="208.6" r="4"/>
 * <circle class="mk1" cx="473.3" cy="201.1" r="4"/>
 * <circle class="mk1" cx="528.6" cy="172.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.2" r="4"/>
 * <circle class="mk2" cx="85.7" cy="213.4" r="4"/>
 * <circle class="mk2" cx="113.4" cy="213.3" r="4"/>
 * <circle class="mk2" cx="168.7" cy="213.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="213.2" r="4"/>
 * <circle class="mk2" cx="251.8" cy="212.7" r="4"/>
 * <circle class="mk2" cx="307.2" cy="212.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="212.8" r="4"/>
 * <circle class="mk2" cx="417.9" cy="211.6" r="4"/>
 * <circle class="mk2" cx="473.3" cy="203.9" r="4"/>
 * <circle class="mk2" cx="528.6" cy="176.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="59.7" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/isamax.js) — WebGPU benchmark script
 * - [isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/isamax.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0210 | 0.0061 | 0.0138 | 0.0093 | 65.6% |
 * | 64 | 0.0205 | 0.0125 | 0.0165 | 0.0155 | 80.5% |
 * | 128 | 0.0206 | 0.0248 | 0.0162 | 0.0317 | 78.3% |
 * | 512 | 0.0216 | 0.0948 | 0.0166 | 0.1234 | 76.8% |
 * | 1024 | 0.0211 | 0.1942 | 0.0164 | 0.2505 | 77.5% |
 * | 4096 | 0.0208 | 0.7877 | 0.0175 | 0.9343 | 84.3% |
 * | 16384 | 0.0215 | 3.0476 | 0.0179 | 3.6637 | 83.2% |
 * | 65536 | 0.0273 | 9.5925 | 0.0193 | 13.5629 | 70.7% |
 * | 262144 | 0.0452 | 23.1986 | 0.0408 | 25.7105 | 90.2% |
 * | 1048576 | 0.1126 | 37.2364 | 0.1103 | 38.0305 | 97.9% |
 * | 4194304 | 0.3804 | 44.1004 | 0.3764 | 44.5747 | 98.9% |
 *
 * <svg id="bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,220.0 88.9,220.0 119.9,219.9 181.8,219.6 212.7,219.2 274.6,216.8 336.5,207.8 398.4,181.6 460.2,127.2 522.1,71.1 584.0,43.6"/>
 * <polyline class="ln2" points="58.0,220.0 88.9,219.9 119.9,219.9 181.8,219.5 212.7,219.0 274.6,216.3 336.5,205.3 398.4,165.7 460.2,117.2 522.1,67.9 584.0,41.7"/>
 * <circle class="mk1" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk1" cx="88.9" cy="220.0" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.9" r="4"/>
 * <circle class="mk1" cx="181.8" cy="219.6" r="4"/>
 * <circle class="mk1" cx="212.7" cy="219.2" r="4"/>
 * <circle class="mk1" cx="274.6" cy="216.8" r="4"/>
 * <circle class="mk1" cx="336.5" cy="207.8" r="4"/>
 * <circle class="mk1" cx="398.4" cy="181.6" r="4"/>
 * <circle class="mk1" cx="460.2" cy="127.2" r="4"/>
 * <circle class="mk1" cx="522.1" cy="71.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="43.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="220.0" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.9" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.5" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.0" r="4"/>
 * <circle class="mk2" cx="274.6" cy="216.3" r="4"/>
 * <circle class="mk2" cx="336.5" cy="205.3" r="4"/>
 * <circle class="mk2" cx="398.4" cy="165.7" r="4"/>
 * <circle class="mk2" cx="460.2" cy="117.2" r="4"/>
 * <circle class="mk2" cx="522.1" cy="67.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="41.7" r="4"/>
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
 * <svg id="bc-isamax-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,209.5 88.9,209.7 119.9,209.7 181.8,209.2 212.7,209.5 274.6,209.6 336.5,209.2 398.4,206.3 460.2,197.4 522.1,163.7 584.0,29.8"/>
 * <polyline class="ln2" points="58.0,213.1 88.9,211.8 119.9,211.9 181.8,211.7 212.7,211.8 274.6,211.2 336.5,211.1 398.4,210.3 460.2,199.6 522.1,164.9 584.0,31.8"/>
 * <circle class="mk1" cx="58.0" cy="209.5" r="4"/>
 * <circle class="mk1" cx="88.9" cy="209.7" r="4"/>
 * <circle class="mk1" cx="119.9" cy="209.7" r="4"/>
 * <circle class="mk1" cx="181.8" cy="209.2" r="4"/>
 * <circle class="mk1" cx="212.7" cy="209.5" r="4"/>
 * <circle class="mk1" cx="274.6" cy="209.6" r="4"/>
 * <circle class="mk1" cx="336.5" cy="209.2" r="4"/>
 * <circle class="mk1" cx="398.4" cy="206.3" r="4"/>
 * <circle class="mk1" cx="460.2" cy="197.4" r="4"/>
 * <circle class="mk1" cx="522.1" cy="163.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="29.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="213.1" r="4"/>
 * <circle class="mk2" cx="88.9" cy="211.8" r="4"/>
 * <circle class="mk2" cx="119.9" cy="211.9" r="4"/>
 * <circle class="mk2" cx="181.8" cy="211.7" r="4"/>
 * <circle class="mk2" cx="212.7" cy="211.8" r="4"/>
 * <circle class="mk2" cx="274.6" cy="211.2" r="4"/>
 * <circle class="mk2" cx="336.5" cy="211.1" r="4"/>
 * <circle class="mk2" cx="398.4" cy="210.3" r="4"/>
 * <circle class="mk2" cx="460.2" cy="199.6" r="4"/>
 * <circle class="mk2" cx="522.1" cy="164.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="31.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0207 | 0.0062 | 0.0169 | 0.0076 | 81.2% |
 * | 64 | 0.0209 | 0.0123 | 0.0162 | 0.0158 | 77.7% |
 * | 128 | 0.0211 | 0.0243 | 0.0166 | 0.0308 | 78.9% |
 * | 512 | 0.0205 | 0.1000 | 0.0164 | 0.1252 | 79.9% |
 * | 1024 | 0.0209 | 0.1957 | 0.0172 | 0.2381 | 82.2% |
 * | 4096 | 0.0213 | 0.7682 | 0.0179 | 0.9176 | 83.7% |
 * | 16384 | 0.0293 | 2.2334 | 0.0223 | 2.9404 | 76.0% |
 * | 65536 | 0.0458 | 5.7287 | 0.0400 | 6.5510 | 87.4% |
 * | 262144 | 0.1145 | 9.1582 | 0.1074 | 9.7655 | 93.8% |
 * | 1048576 | 0.3861 | 10.8643 | 0.3768 | 11.1323 | 97.6% |
 *
 * <svg id="bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 93.1,219.8 128.1,219.6 198.3,218.3 233.3,216.7 303.5,207.2 373.6,182.8 443.7,124.5 513.9,67.4 584.0,38.9"/>
 * <polyline class="ln2" points="58.0,219.9 93.1,219.7 128.1,219.5 198.3,217.9 233.3,216.0 303.5,204.7 373.6,171.0 443.7,110.8 513.9,57.2 584.0,34.5"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.8" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.6" r="4"/>
 * <circle class="mk1" cx="198.3" cy="218.3" r="4"/>
 * <circle class="mk1" cx="233.3" cy="216.7" r="4"/>
 * <circle class="mk1" cx="303.5" cy="207.2" r="4"/>
 * <circle class="mk1" cx="373.6" cy="182.8" r="4"/>
 * <circle class="mk1" cx="443.7" cy="124.5" r="4"/>
 * <circle class="mk1" cx="513.9" cy="67.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="38.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.7" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.5" r="4"/>
 * <circle class="mk2" cx="198.3" cy="217.9" r="4"/>
 * <circle class="mk2" cx="233.3" cy="216.0" r="4"/>
 * <circle class="mk2" cx="303.5" cy="204.7" r="4"/>
 * <circle class="mk2" cx="373.6" cy="171.0" r="4"/>
 * <circle class="mk2" cx="443.7" cy="110.8" r="4"/>
 * <circle class="mk2" cx="513.9" cy="57.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="34.5" r="4"/>
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
 * <svg id="bc-isamax-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,209.6 93.1,209.6 128.1,209.5 198.3,209.8 233.3,209.5 303.5,209.3 373.6,205.3 443.7,197.1 513.9,162.8 584.0,27.0"/>
 * <polyline class="ln2" points="58.0,211.6 93.1,211.9 128.1,211.7 198.3,211.8 233.3,211.4 303.5,211.1 373.6,208.8 443.7,200.0 513.9,166.3 584.0,31.6"/>
 * <circle class="mk1" cx="58.0" cy="209.6" r="4"/>
 * <circle class="mk1" cx="93.1" cy="209.6" r="4"/>
 * <circle class="mk1" cx="128.1" cy="209.5" r="4"/>
 * <circle class="mk1" cx="198.3" cy="209.8" r="4"/>
 * <circle class="mk1" cx="233.3" cy="209.5" r="4"/>
 * <circle class="mk1" cx="303.5" cy="209.3" r="4"/>
 * <circle class="mk1" cx="373.6" cy="205.3" r="4"/>
 * <circle class="mk1" cx="443.7" cy="197.1" r="4"/>
 * <circle class="mk1" cx="513.9" cy="162.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="27.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="211.6" r="4"/>
 * <circle class="mk2" cx="93.1" cy="211.9" r="4"/>
 * <circle class="mk2" cx="128.1" cy="211.7" r="4"/>
 * <circle class="mk2" cx="198.3" cy="211.8" r="4"/>
 * <circle class="mk2" cx="233.3" cy="211.4" r="4"/>
 * <circle class="mk2" cx="303.5" cy="211.1" r="4"/>
 * <circle class="mk2" cx="373.6" cy="208.8" r="4"/>
 * <circle class="mk2" cx="443.7" cy="200.0" r="4"/>
 * <circle class="mk2" cx="513.9" cy="166.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="31.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0213 | 0.0960 | 0.0164 | 0.1252 | 76.6% |
 * | 1024 | 0.0227 | 0.1803 | 0.0164 | 0.2490 | 72.4% |
 * | 4096 | 0.0258 | 0.6356 | 0.0181 | 0.9046 | 70.3% |
 * | 16384 | 0.0363 | 1.8076 | 0.0288 | 2.2756 | 79.4% |
 * | 65536 | 0.0645 | 4.0635 | 0.0508 | 5.1554 | 78.8% |
 *
 * <svg id="bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,216.8 133.1,214.0 283.4,198.8 433.7,159.7 584.0,84.6"/>
 * <polyline class="ln2" points="58.0,215.8 133.1,211.7 283.4,189.8 433.7,144.1 584.0,48.2"/>
 * <circle class="mk1" cx="58.0" cy="216.8" r="4"/>
 * <circle class="mk1" cx="133.1" cy="214.0" r="4"/>
 * <circle class="mk1" cx="283.4" cy="198.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="159.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="84.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="215.8" r="4"/>
 * <circle class="mk2" cx="133.1" cy="211.7" r="4"/>
 * <circle class="mk2" cx="283.4" cy="189.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="144.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="48.2" r="4"/>
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
 * <svg id="bc-isamax-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-isamax-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,166.6 133.1,163.2 283.4,155.6 433.7,129.4 584.0,58.7"/>
 * <polyline class="ln2" points="58.0,179.0 133.1,179.0 283.4,174.8 433.7,148.0 584.0,93.0"/>
 * <circle class="mk1" cx="58.0" cy="166.6" r="4"/>
 * <circle class="mk1" cx="133.1" cy="163.2" r="4"/>
 * <circle class="mk1" cx="283.4" cy="155.6" r="4"/>
 * <circle class="mk1" cx="433.7" cy="129.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="58.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="179.0" r="4"/>
 * <circle class="mk2" cx="133.1" cy="179.0" r="4"/>
 * <circle class="mk2" cx="283.4" cy="174.8" r="4"/>
 * <circle class="mk2" cx="433.7" cy="148.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="93.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.isamax.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/wgblas/stride.isamax.js) — WebGPU stride-sweep benchmark script
 * - [stride.isamax.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/isamax/cuda/stride.isamax.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/isamax
 */
