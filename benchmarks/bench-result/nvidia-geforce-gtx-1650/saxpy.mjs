/**
 * Benchmark results for saxpy on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0071 | 0.0539 | 0.0031 | 0.1224 | 44.1% |
 * | 64 | 0.0069 | 0.1119 | 0.0032 | 0.2388 | 46.9% |
 * | 128 | 0.0071 | 0.2167 | 0.0032 | 0.4752 | 45.6% |
 * | 512 | 0.0073 | 0.8384 | 0.0034 | 1.7860 | 46.9% |
 * | 1024 | 0.0073 | 1.6805 | 0.0034 | 3.6398 | 46.2% |
 * | 4096 | 0.0073 | 6.7221 | 0.0035 | 14.1567 | 47.5% |
 * | 16384 | 0.0081 | 24.1890 | 0.0040 | 49.1520 | 49.2% |
 * | 65536 | 0.0102 | 76.9202 | 0.0059 | 132.8432 | 57.9% |
 * | 262144 | 0.0246 | 128.0000 | 0.0212 | 148.0482 | 86.5% |
 * | 1048576 | 0.0778 | 161.6842 | 0.0741 | 169.8557 | 95.2% |
 * | 4194304 | 0.2922 | 172.2743 | 0.2863 | 175.8274 | 98.0% |
 * | 16777216 | 1.1489 | 175.2299 | 1.1323 | 177.8051 | 98.6% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-saxpy-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-saxpy-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.9 85.7,219.9 113.4,219.8 168.7,219.2 196.4,218.3 251.8,213.3 307.2,195.8 362.5,143.1 417.9,92.0 473.3,58.3 528.6,47.7 584.0,44.8"/>
 * <polyline class="ln2" points="58.0,219.9 85.7,219.8 113.4,219.5 168.7,218.2 196.4,216.4 251.8,205.8 307.2,170.8 362.5,87.2 417.9,72.0 473.3,50.1 528.6,44.2 584.0,42.2"/>
 * <circle class="mk1" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk1" cx="85.7" cy="219.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="219.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="219.2" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.3" r="4"/>
 * <circle class="mk1" cx="251.8" cy="213.3" r="4"/>
 * <circle class="mk1" cx="307.2" cy="195.8" r="4"/>
 * <circle class="mk1" cx="362.5" cy="143.1" r="4"/>
 * <circle class="mk1" cx="417.9" cy="92.0" r="4"/>
 * <circle class="mk1" cx="473.3" cy="58.3" r="4"/>
 * <circle class="mk1" cx="528.6" cy="47.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="44.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.9" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.8" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="168.7" cy="218.2" r="4"/>
 * <circle class="mk2" cx="196.4" cy="216.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="205.8" r="4"/>
 * <circle class="mk2" cx="307.2" cy="170.8" r="4"/>
 * <circle class="mk2" cx="362.5" cy="87.2" r="4"/>
 * <circle class="mk2" cx="417.9" cy="72.0" r="4"/>
 * <circle class="mk2" cx="473.3" cy="50.1" r="4"/>
 * <circle class="mk2" cx="528.6" cy="44.2" r="4"/>
 * <circle class="mk2" cx="584.0" cy="42.2" r="4"/>
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
 * <svg id="bc-saxpy-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-saxpy-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-saxpy-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-saxpy-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-saxpy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-saxpy-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 85.7,218.9 113.4,218.8 168.7,218.8 196.4,218.8 251.8,218.8 307.2,218.6 362.5,218.3 417.9,215.9 473.3,207.0 528.6,171.3 584.0,28.5"/>
 * <polyline class="ln2" points="58.0,219.5 85.7,219.5 113.4,219.5 168.7,219.4 196.4,219.4 251.8,219.4 307.2,219.3 362.5,219.0 417.9,216.5 473.3,207.7 528.6,172.3 584.0,31.3"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="85.7" cy="218.9" r="4"/>
 * <circle class="mk1" cx="113.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="168.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="196.4" cy="218.8" r="4"/>
 * <circle class="mk1" cx="251.8" cy="218.8" r="4"/>
 * <circle class="mk1" cx="307.2" cy="218.6" r="4"/>
 * <circle class="mk1" cx="362.5" cy="218.3" r="4"/>
 * <circle class="mk1" cx="417.9" cy="215.9" r="4"/>
 * <circle class="mk1" cx="473.3" cy="207.0" r="4"/>
 * <circle class="mk1" cx="528.6" cy="171.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="28.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="85.7" cy="219.5" r="4"/>
 * <circle class="mk2" cx="113.4" cy="219.5" r="4"/>
 * <circle class="mk2" cx="168.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="196.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="251.8" cy="219.4" r="4"/>
 * <circle class="mk2" cx="307.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="362.5" cy="219.0" r="4"/>
 * <circle class="mk2" cx="417.9" cy="216.5" r="4"/>
 * <circle class="mk2" cx="473.3" cy="207.7" r="4"/>
 * <circle class="mk2" cx="528.6" cy="172.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="31.3" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/saxpy.js) — WebGPU benchmark script
 * - [saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/saxpy.c) — CUDA / cuBLAS reference script
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
 * | 32 | 0.0069 | 0.0554 | 0.0033 | 0.1171 | 47.3% |
 * | 64 | 0.0071 | 0.1084 | 0.0034 | 0.2233 | 48.5% |
 * | 128 | 0.0073 | 0.2115 | 0.0038 | 0.4034 | 52.4% |
 * | 512 | 0.0072 | 0.8571 | 0.0034 | 1.7944 | 47.8% |
 * | 1024 | 0.0072 | 1.6954 | 0.0035 | 3.5556 | 47.7% |
 * | 4096 | 0.0079 | 6.2061 | 0.0039 | 12.5902 | 49.3% |
 * | 16384 | 0.0094 | 21.0051 | 0.0054 | 36.1412 | 58.1% |
 * | 65536 | 0.0227 | 34.6141 | 0.0211 | 37.3495 | 92.7% |
 * | 262144 | 0.0759 | 41.4435 | 0.0741 | 42.4273 | 97.7% |
 * | 1048576 | 0.2886 | 43.5986 | 0.2883 | 43.6422 | 99.9% |
 * | 4194304 | 1.1384 | 44.2114 | 1.1425 | 44.0541 | 100.4% |
 *
 * <svg id="bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.8 88.9,219.6 119.9,219.2 181.8,216.6 212.7,213.2 274.6,195.2 336.5,136.0 398.4,81.5 460.2,54.2 522.1,45.6 584.0,43.2"/>
 * <polyline class="ln2" points="58.0,219.5 88.9,219.1 119.9,218.4 181.8,212.8 212.7,205.8 274.6,169.6 336.5,75.4 398.4,70.6 460.2,50.3 522.1,45.4 584.0,43.8"/>
 * <circle class="mk1" cx="58.0" cy="219.8" r="4"/>
 * <circle class="mk1" cx="88.9" cy="219.6" r="4"/>
 * <circle class="mk1" cx="119.9" cy="219.2" r="4"/>
 * <circle class="mk1" cx="181.8" cy="216.6" r="4"/>
 * <circle class="mk1" cx="212.7" cy="213.2" r="4"/>
 * <circle class="mk1" cx="274.6" cy="195.2" r="4"/>
 * <circle class="mk1" cx="336.5" cy="136.0" r="4"/>
 * <circle class="mk1" cx="398.4" cy="81.5" r="4"/>
 * <circle class="mk1" cx="460.2" cy="54.2" r="4"/>
 * <circle class="mk1" cx="522.1" cy="45.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="43.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.1" r="4"/>
 * <circle class="mk2" cx="119.9" cy="218.4" r="4"/>
 * <circle class="mk2" cx="181.8" cy="212.8" r="4"/>
 * <circle class="mk2" cx="212.7" cy="205.8" r="4"/>
 * <circle class="mk2" cx="274.6" cy="169.6" r="4"/>
 * <circle class="mk2" cx="336.5" cy="75.4" r="4"/>
 * <circle class="mk2" cx="398.4" cy="70.6" r="4"/>
 * <circle class="mk2" cx="460.2" cy="50.3" r="4"/>
 * <circle class="mk2" cx="522.1" cy="45.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="43.8" r="4"/>
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
 * <svg id="bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride4-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,218.8 88.9,218.8 119.9,218.8 181.8,218.8 212.7,218.8 274.6,218.7 336.5,218.4 398.4,216.2 460.2,207.3 522.1,171.9 584.0,30.3"/>
 * <polyline class="ln2" points="58.0,219.4 88.9,219.4 119.9,219.4 181.8,219.4 212.7,219.4 274.6,219.3 336.5,219.1 398.4,216.5 460.2,207.7 522.1,172.0 584.0,29.6"/>
 * <circle class="mk1" cx="58.0" cy="218.8" r="4"/>
 * <circle class="mk1" cx="88.9" cy="218.8" r="4"/>
 * <circle class="mk1" cx="119.9" cy="218.8" r="4"/>
 * <circle class="mk1" cx="181.8" cy="218.8" r="4"/>
 * <circle class="mk1" cx="212.7" cy="218.8" r="4"/>
 * <circle class="mk1" cx="274.6" cy="218.7" r="4"/>
 * <circle class="mk1" cx="336.5" cy="218.4" r="4"/>
 * <circle class="mk1" cx="398.4" cy="216.2" r="4"/>
 * <circle class="mk1" cx="460.2" cy="207.3" r="4"/>
 * <circle class="mk1" cx="522.1" cy="171.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="30.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="88.9" cy="219.4" r="4"/>
 * <circle class="mk2" cx="119.9" cy="219.4" r="4"/>
 * <circle class="mk2" cx="181.8" cy="219.4" r="4"/>
 * <circle class="mk2" cx="212.7" cy="219.4" r="4"/>
 * <circle class="mk2" cx="274.6" cy="219.3" r="4"/>
 * <circle class="mk2" cx="336.5" cy="219.1" r="4"/>
 * <circle class="mk2" cx="398.4" cy="216.5" r="4"/>
 * <circle class="mk2" cx="460.2" cy="207.7" r="4"/>
 * <circle class="mk2" cx="522.1" cy="172.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="29.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0061 | 0.0625 | 0.0027 | 0.1429 | 43.7% |
 * | 64 | 0.0061 | 0.1250 | 0.0028 | 0.2791 | 44.8% |
 * | 128 | 0.0061 | 0.2500 | 0.0030 | 0.5134 | 48.7% |
 * | 512 | 0.0061 | 1.0000 | 0.0034 | 1.8199 | 54.9% |
 * | 1024 | 0.0062 | 1.9692 | 0.0036 | 3.4286 | 57.4% |
 * | 4096 | 0.0082 | 5.9767 | 0.0047 | 10.4490 | 57.2% |
 * | 16384 | 0.0247 | 7.9483 | 0.0229 | 8.5810 | 92.6% |
 * | 65536 | 0.0881 | 8.9302 | 0.0858 | 9.1633 | 97.5% |
 * | 262144 | 0.3394 | 9.2683 | 0.3356 | 9.3730 | 98.9% |
 * | 1048576 | 1.3435 | 9.3659 | 1.3505 | 9.3171 | 100.5% |
 *
 * <svg id="bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,219.0 93.1,217.9 128.1,215.8 198.3,203.3 233.3,187.2 303.5,120.4 373.6,87.5 443.7,71.2 513.9,65.5 584.0,63.9"/>
 * <polyline class="ln2" points="58.0,217.6 93.1,215.3 128.1,211.4 198.3,189.7 233.3,162.9 303.5,45.8 373.6,77.0 443.7,67.3 513.9,63.8 584.0,64.7"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="93.1" cy="217.9" r="4"/>
 * <circle class="mk1" cx="128.1" cy="215.8" r="4"/>
 * <circle class="mk1" cx="198.3" cy="203.3" r="4"/>
 * <circle class="mk1" cx="233.3" cy="187.2" r="4"/>
 * <circle class="mk1" cx="303.5" cy="120.4" r="4"/>
 * <circle class="mk1" cx="373.6" cy="87.5" r="4"/>
 * <circle class="mk1" cx="443.7" cy="71.2" r="4"/>
 * <circle class="mk1" cx="513.9" cy="65.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="63.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="217.6" r="4"/>
 * <circle class="mk2" cx="93.1" cy="215.3" r="4"/>
 * <circle class="mk2" cx="128.1" cy="211.4" r="4"/>
 * <circle class="mk2" cx="198.3" cy="189.7" r="4"/>
 * <circle class="mk2" cx="233.3" cy="162.9" r="4"/>
 * <circle class="mk2" cx="303.5" cy="45.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="77.0" r="4"/>
 * <circle class="mk2" cx="443.7" cy="67.3" r="4"/>
 * <circle class="mk2" cx="513.9" cy="63.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="64.7" r="4"/>
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
 * <svg id="bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="93.1" y="236" text-anchor="middle">64</text>
 * <text class="at" x="128.1" y="236" text-anchor="middle">128</text>
 * <text class="at" x="198.3" y="236" text-anchor="middle">512</text>
 * <text class="at" x="233.3" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="303.5" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="443.7" y="236" text-anchor="middle">65K</text>
 * <text class="at" x="513.9" y="236" text-anchor="middle">262K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0M</text>
 * <polyline class="ln1" points="58.0,219.2 93.1,219.2 128.1,219.2 198.3,219.2 233.3,219.2 303.5,218.9 373.6,216.7 443.7,208.3 513.9,174.7 584.0,40.9"/>
 * <polyline class="ln2" points="58.0,219.6 93.1,219.6 128.1,219.6 198.3,219.5 233.3,219.5 303.5,219.4 373.6,216.9 443.7,208.6 513.9,175.3 584.0,39.9"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="93.1" cy="219.2" r="4"/>
 * <circle class="mk1" cx="128.1" cy="219.2" r="4"/>
 * <circle class="mk1" cx="198.3" cy="219.2" r="4"/>
 * <circle class="mk1" cx="233.3" cy="219.2" r="4"/>
 * <circle class="mk1" cx="303.5" cy="218.9" r="4"/>
 * <circle class="mk1" cx="373.6" cy="216.7" r="4"/>
 * <circle class="mk1" cx="443.7" cy="208.3" r="4"/>
 * <circle class="mk1" cx="513.9" cy="174.7" r="4"/>
 * <circle class="mk1" cx="584.0" cy="40.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="93.1" cy="219.6" r="4"/>
 * <circle class="mk2" cx="128.1" cy="219.6" r="4"/>
 * <circle class="mk2" cx="198.3" cy="219.5" r="4"/>
 * <circle class="mk2" cx="233.3" cy="219.5" r="4"/>
 * <circle class="mk2" cx="303.5" cy="219.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.9" r="4"/>
 * <circle class="mk2" cx="443.7" cy="208.6" r="4"/>
 * <circle class="mk2" cx="513.9" cy="175.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="39.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — stride = 256</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 512 | 0.0061 | 1.0000 | 0.0036 | 1.7067 | 58.6% |
 * | 1024 | 0.0063 | 1.9394 | 0.0035 | 3.5229 | 55.1% |
 * | 4096 | 0.0086 | 5.7100 | 0.0046 | 10.5931 | 53.9% |
 * | 16384 | 0.0416 | 4.7262 | 0.0452 | 4.3497 | 108.7% |
 * | 65536 | 0.1768 | 4.4477 | 0.1921 | 4.0929 | 108.7% |
 *
 * <svg id="bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <polyline class="ln1" points="58.0,203.3 133.1,187.7 283.4,124.8 433.7,141.2 584.0,145.9"/>
 * <polyline class="ln2" points="58.0,191.6 133.1,161.3 283.4,43.4 433.7,147.5 584.0,151.8"/>
 * <circle class="mk1" cx="58.0" cy="203.3" r="4"/>
 * <circle class="mk1" cx="133.1" cy="187.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="124.8" r="4"/>
 * <circle class="mk1" cx="433.7" cy="141.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="145.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="191.6" r="4"/>
 * <circle class="mk2" cx="133.1" cy="161.3" r="4"/>
 * <circle class="mk2" cx="283.4" cy="43.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="147.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="151.8" r="4"/>
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
 * <svg id="bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-saxpy-stride256-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="58.0" y="236" text-anchor="middle">512</text>
 * <text class="at" x="133.1" y="236" text-anchor="middle">1.0K</text>
 * <text class="at" x="283.4" y="236" text-anchor="middle">4.1K</text>
 * <text class="at" x="433.7" y="236" text-anchor="middle">16K</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">65K</text>
 * <polyline class="ln1" points="58.0,213.9 133.1,213.7 283.4,211.4 433.7,178.4 584.0,43.2"/>
 * <polyline class="ln2" points="58.0,216.4 133.1,216.5 283.4,215.4 433.7,174.8 584.0,27.9"/>
 * <circle class="mk1" cx="58.0" cy="213.9" r="4"/>
 * <circle class="mk1" cx="133.1" cy="213.7" r="4"/>
 * <circle class="mk1" cx="283.4" cy="211.4" r="4"/>
 * <circle class="mk1" cx="433.7" cy="178.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="43.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="216.4" r="4"/>
 * <circle class="mk2" cx="133.1" cy="216.5" r="4"/>
 * <circle class="mk2" cx="283.4" cy="215.4" r="4"/>
 * <circle class="mk2" cx="433.7" cy="174.8" r="4"/>
 * <circle class="mk2" cx="584.0" cy="27.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * **See also:**
 *
 * - [stride.saxpy.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/wgblas/stride.saxpy.js) — WebGPU stride-sweep benchmark script
 * - [stride.saxpy.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/saxpy/cuda/stride.saxpy.c) — CUDA / cuBLAS stride-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/saxpy
 */
