/**
 * Benchmark results for sgemm on Nvidia Geforce Gtx 1650.
 *
 * ## Nvidia Geforce Gtx 1650 — wgblas vs cuBLAS
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0106 | 1.5515 | 0.0090 | 1.8221 | 85.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0101 | 6.4606 | 70.8% |
 * | 128 | 0.0237 | 11.0553 | 0.0134 | 19.5513 | 56.5% |
 * | 256 | 0.0796 | 13.1651 | 0.0438 | 23.9445 | 55.0% |
 * | 512 | 0.2985 | 14.0515 | 0.1998 | 20.9917 | 66.9% |
 * | 1024 | 2.0314 | 8.2588 | 0.9976 | 16.8168 | 49.1% |
 *
 * > Efficiency = wgblas GB/s ÷ cuBLAS GB/s × 100. 100% means parity with cuBLAS; values above 100% mean wgblas achieved greater throughput.
 *
 * <svg id="bc-sgemm-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.6 163.2,183.4 268.4,131.6 373.6,114.7 478.8,107.6 584.0,153.9"/>
 * <polyline class="ln2" points="58.0,205.4 163.2,168.3 268.4,63.6 373.6,28.4 478.8,52.1 584.0,85.5"/>
 * <circle class="mk1" cx="58.0" cy="207.6" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="131.6" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="153.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="205.4" r="4"/>
 * <circle class="mk2" cx="163.2" cy="168.3" r="4"/>
 * <circle class="mk2" cx="268.4" cy="63.6" r="4"/>
 * <circle class="mk2" cx="373.6" cy="28.4" r="4"/>
 * <circle class="mk2" cx="478.8" cy="52.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.5" r="4"/>
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
 * <svg id="bc-sgemm-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.6 478.8,196.1 584.0,57.5"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,218.9 373.6,216.5 478.8,204.0 584.0,140.2"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.5" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.2" r="4"/>
 * </svg>
 *
 * ## See also
 *
 * - [sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/sgemm.js) — WebGPU benchmark script
 * - [sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/sgemm.c) — CUDA / cuBLAS reference script
 *
 * ## Transpose sweep
 *
 * Unless noted otherwise, every result above uses `transA = transB = "no-transpose"`. Both shaders load A/B into shared memory with a transpose-dependent index that scatters what would otherwise be a coalesced load — but it's asymmetric: `transB` dominates (measured +22-57% at n=1024) while `transA` is small and can even be *faster* than no-transpose, because B's tile dimension spans a full warp in the coalesced case (so transpose scatters every warp) while A's never gets a full-warp-coalesced load to begin with. All 4 `(transA, transB)` combinations are swept — collapsed below by default, expand a `transA` value, then a `transB`, to see its table and chart (4 combinations total).
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = no-transpose (2 transB values)</summary>
 *
 * <details>
 * <summary>transB = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5657 | 0.0083 | 1.9807 | 79.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0096 | 6.8495 | 66.7% |
 * | 128 | 0.0238 | 11.0256 | 0.0127 | 20.6088 | 53.5% |
 * | 256 | 0.0797 | 13.1625 | 0.0432 | 24.2816 | 54.2% |
 * | 512 | 0.2990 | 14.0274 | 0.1987 | 21.1134 | 66.4% |
 * | 1024 | 2.0347 | 8.2456 | 0.9964 | 16.8386 | 49.0% |
 *
 * <svg id="bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.5 163.2,183.4 268.4,131.8 373.6,114.7 478.8,107.8 584.0,154.0"/>
 * <polyline class="ln2" points="58.0,204.2 163.2,165.2 268.4,55.1 373.6,25.7 478.8,51.1 584.0,85.3"/>
 * <circle class="mk1" cx="58.0" cy="207.5" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="131.8" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="154.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="165.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="55.1" r="4"/>
 * <circle class="mk2" cx="373.6" cy="25.7" r="4"/>
 * <circle class="mk2" cx="478.8" cy="51.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.3" r="4"/>
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
 * <svg id="bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.6 478.8,196.1 584.0,57.2"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,219.0 373.6,216.5 478.8,204.1 584.0,140.3"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.5" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>transB = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0115 | 1.4202 | 0.0086 | 1.8998 | 74.8% |
 * | 64 | 0.0150 | 4.3574 | 0.0096 | 6.8040 | 64.0% |
 * | 128 | 0.0287 | 9.1429 | 0.0122 | 21.4731 | 42.6% |
 * | 256 | 0.1331 | 7.8769 | 0.0330 | 31.7366 | 24.8% |
 * | 512 | 0.4396 | 9.5405 | 0.1868 | 22.4573 | 42.5% |
 * | 1024 | 3.1890 | 5.2609 | 0.9844 | 17.0425 | 30.9% |
 *
 * <svg id="bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,212.9 163.2,198.2 268.4,174.3 373.6,180.6 478.8,172.3 584.0,193.7"/>
 * <polyline class="ln2" points="58.0,210.5 163.2,186.0 268.4,112.6 373.6,61.3 478.8,107.7 584.0,134.8"/>
 * <circle class="mk1" cx="58.0" cy="212.9" r="4"/>
 * <circle class="mk1" cx="163.2" cy="198.2" r="4"/>
 * <circle class="mk1" cx="268.4" cy="174.3" r="4"/>
 * <circle class="mk1" cx="373.6" cy="180.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="172.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="193.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.5" r="4"/>
 * <circle class="mk2" cx="163.2" cy="186.0" r="4"/>
 * <circle class="mk2" cx="268.4" cy="112.6" r="4"/>
 * <circle class="mk2" cx="373.6" cy="61.3" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.8" r="4"/>
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
 * <svg id="bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-no-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">4.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.4 163.2,219.2 268.4,218.6 373.6,213.3 478.8,198.0 584.0,60.5"/>
 * <polyline class="ln2" points="58.0,219.6 163.2,219.5 268.4,219.4 373.6,218.3 478.8,210.7 584.0,170.8"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.6" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.3" r="4"/>
 * <circle class="mk1" cx="478.8" cy="198.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="60.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.5" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="218.3" r="4"/>
 * <circle class="mk2" cx="478.8" cy="210.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="170.8" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transA = transpose (2 transB values)</summary>
 *
 * <details>
 * <summary>transB = no-transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0107 | 1.5329 | 0.0084 | 1.9431 | 78.9% |
 * | 64 | 0.0148 | 4.4329 | 0.0098 | 6.7148 | 66.0% |
 * | 128 | 0.0246 | 10.6667 | 0.0136 | 19.2980 | 55.3% |
 * | 256 | 0.0856 | 12.2520 | 0.0492 | 21.3333 | 57.4% |
 * | 512 | 0.3052 | 13.7421 | 0.2439 | 17.1988 | 79.9% |
 * | 1024 | 2.1678 | 7.7392 | 1.0079 | 16.6451 | 46.5% |
 *
 * <svg id="bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.7 163.2,184.5 268.4,134.7 373.6,122.0 478.8,110.1 584.0,158.1"/>
 * <polyline class="ln2" points="58.0,204.5 163.2,166.3 268.4,65.6 373.6,49.3 478.8,82.4 584.0,86.8"/>
 * <circle class="mk1" cx="58.0" cy="207.7" r="4"/>
 * <circle class="mk1" cx="163.2" cy="184.5" r="4"/>
 * <circle class="mk1" cx="268.4" cy="134.7" r="4"/>
 * <circle class="mk1" cx="373.6" cy="122.0" r="4"/>
 * <circle class="mk1" cx="478.8" cy="110.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="158.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.5" r="4"/>
 * <circle class="mk2" cx="163.2" cy="166.3" r="4"/>
 * <circle class="mk2" cx="268.4" cy="65.6" r="4"/>
 * <circle class="mk2" cx="373.6" cy="49.3" r="4"/>
 * <circle class="mk2" cx="478.8" cy="82.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="86.8" r="4"/>
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
 * <svg id="bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-no-transpose-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.1 163.2,218.8 268.4,218.0 373.6,213.2 478.8,195.6 584.0,46.6"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,218.9 373.6,216.1 478.8,200.5 584.0,139.4"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.8" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.2" r="4"/>
 * <circle class="mk1" cx="478.8" cy="195.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="46.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.1" r="4"/>
 * <circle class="mk2" cx="478.8" cy="200.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="139.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>transB = transpose</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0115 | 1.4222 | 0.0084 | 1.9431 | 73.2% |
 * | 64 | 0.0156 | 4.2010 | 0.0099 | 6.5958 | 63.7% |
 * | 128 | 0.0294 | 8.9043 | 0.0125 | 20.8980 | 42.6% |
 * | 256 | 0.1396 | 7.5096 | 0.0562 | 18.6553 | 40.3% |
 * | 512 | 0.4631 | 9.0576 | 0.2336 | 17.9588 | 50.4% |
 * | 1024 | 3.3841 | 4.9576 | 0.9873 | 16.9934 | 29.2% |
 *
 * <svg id="bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,208.6 163.2,186.4 268.4,148.8 373.6,159.9 478.8,147.5 584.0,180.3"/>
 * <polyline class="ln2" points="58.0,204.5 163.2,167.2 268.4,52.8 373.6,70.8 478.8,76.3 584.0,84.1"/>
 * <circle class="mk1" cx="58.0" cy="208.6" r="4"/>
 * <circle class="mk1" cx="163.2" cy="186.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="148.8" r="4"/>
 * <circle class="mk1" cx="373.6" cy="159.9" r="4"/>
 * <circle class="mk1" cx="478.8" cy="147.5" r="4"/>
 * <circle class="mk1" cx="584.0" cy="180.3" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.5" r="4"/>
 * <circle class="mk2" cx="163.2" cy="167.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="52.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="70.8" r="4"/>
 * <circle class="mk2" cx="478.8" cy="76.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="84.1" r="4"/>
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
 * <svg id="bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-trans-transpose-transpose-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">4.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.4 163.2,219.2 268.4,218.5 373.6,213.0 478.8,196.8 584.0,50.8"/>
 * <polyline class="ln2" points="58.0,219.6 163.2,219.5 268.4,219.4 373.6,217.2 478.8,208.3 584.0,170.6"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.5" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.0" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="50.8" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.5" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.2" r="4"/>
 * <circle class="mk2" cx="478.8" cy="208.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="170.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [trans.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/trans.sgemm.js) — WebGPU trans-sweep benchmark script
 * - [trans.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/trans.sgemm.c) — CUDA / cuBLAS trans-sweep reference script
 *
 * ## Ldb sweep
 *
 * Unless noted otherwise, every result above uses a tight `lda`/`ldb`/`ldc` (no padding). `lda` and `ldc` were scoped and found to be non-effects; padding `ldb` only matters for `transB = "transpose"` here (swept at both `transB` values below so that's visible in the data). Collapsed below by default — expand a `transB` value, then a `pad`, to see its table and chart.
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = no-transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0103 | 1.5876 | 0.0086 | 1.9033 | 83.4% |
 * | 64 | 0.0143 | 4.5714 | 0.0097 | 6.7479 | 67.7% |
 * | 128 | 0.0233 | 11.2605 | 0.0134 | 19.5981 | 57.5% |
 * | 256 | 0.0795 | 13.1969 | 0.0436 | 24.0587 | 54.9% |
 * | 512 | 0.2970 | 14.1241 | 0.1986 | 21.1219 | 66.9% |
 * | 1024 | 2.0308 | 8.2613 | 0.9967 | 16.8327 | 49.1% |
 *
 * <svg id="bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.3 163.2,183.4 268.4,129.9 373.6,114.4 478.8,107.0 584.0,153.9"/>
 * <polyline class="ln2" points="58.0,204.8 163.2,166.0 268.4,63.2 373.6,27.5 478.8,51.0 584.0,85.3"/>
 * <circle class="mk1" cx="58.0" cy="207.3" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="129.9" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.4" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="153.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.8" r="4"/>
 * <circle class="mk2" cx="163.2" cy="166.0" r="4"/>
 * <circle class="mk2" cx="268.4" cy="63.2" r="4"/>
 * <circle class="mk2" cx="373.6" cy="27.5" r="4"/>
 * <circle class="mk2" cx="478.8" cy="51.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.3" r="4"/>
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
 * <svg id="bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.6 478.8,196.2 584.0,57.5"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,218.9 373.6,216.5 478.8,204.1 584.0,140.3"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.5" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5657 | 0.0083 | 1.9807 | 79.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0097 | 6.7702 | 67.5% |
 * | 128 | 0.0238 | 11.0182 | 0.0136 | 19.2980 | 57.1% |
 * | 256 | 0.0795 | 13.1969 | 0.0444 | 23.6251 | 55.9% |
 * | 512 | 0.2985 | 14.0530 | 0.2009 | 20.8780 | 67.3% |
 * | 1024 | 2.0350 | 8.2445 | 1.0002 | 16.7735 | 49.2% |
 *
 * <svg id="bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.5 163.2,183.4 268.4,131.9 373.6,114.4 478.8,107.6 584.0,154.0"/>
 * <polyline class="ln2" points="58.0,204.2 163.2,165.8 268.4,65.6 373.6,31.0 478.8,53.0 584.0,85.8"/>
 * <circle class="mk1" cx="58.0" cy="207.5" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="131.9" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.4" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.6" r="4"/>
 * <circle class="mk1" cx="584.0" cy="154.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="165.8" r="4"/>
 * <circle class="mk2" cx="268.4" cy="65.6" r="4"/>
 * <circle class="mk2" cx="373.6" cy="31.0" r="4"/>
 * <circle class="mk2" cx="478.8" cy="53.0" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.8" r="4"/>
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
 * <svg id="bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.6 478.8,196.1 584.0,57.2"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,218.9 373.6,216.4 478.8,203.9 584.0,140.0"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.9" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.4" r="4"/>
 * <circle class="mk2" cx="478.8" cy="203.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.0" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5657 | 0.0085 | 1.9357 | 80.9% |
 * | 64 | 0.0143 | 4.5714 | 0.0100 | 6.5746 | 69.5% |
 * | 128 | 0.0236 | 11.1153 | 0.0130 | 20.2022 | 55.0% |
 * | 256 | 0.0794 | 13.1996 | 0.0431 | 24.3357 | 54.2% |
 * | 512 | 0.2970 | 14.1241 | 0.1923 | 21.8090 | 64.8% |
 * | 1024 | 2.0316 | 8.2581 | 0.9891 | 16.9626 | 48.7% |
 *
 * <svg id="bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.5 163.2,183.4 268.4,131.1 373.6,114.4 478.8,107.0 584.0,153.9"/>
 * <polyline class="ln2" points="58.0,204.5 163.2,167.4 268.4,58.4 373.6,25.3 478.8,45.5 584.0,84.3"/>
 * <circle class="mk1" cx="58.0" cy="207.5" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="131.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.4" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="153.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.5" r="4"/>
 * <circle class="mk2" cx="163.2" cy="167.4" r="4"/>
 * <circle class="mk2" cx="268.4" cy="58.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="25.3" r="4"/>
 * <circle class="mk2" cx="478.8" cy="45.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="84.3" r="4"/>
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
 * <svg id="bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.6 478.8,196.2 584.0,57.5"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,219.0 373.6,216.6 478.8,204.6 584.0,140.9"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.6" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.5" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.6" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5586 | 0.0087 | 1.8928 | 82.3% |
 * | 64 | 0.0143 | 4.5714 | 0.0100 | 6.5641 | 69.6% |
 * | 128 | 0.0235 | 11.1380 | 0.0126 | 20.8183 | 53.5% |
 * | 256 | 0.0792 | 13.2369 | 0.0430 | 24.3810 | 54.3% |
 * | 512 | 0.2967 | 14.1356 | 0.1950 | 21.5137 | 65.7% |
 * | 1024 | 2.0383 | 8.2309 | 0.9892 | 16.9609 | 48.5% |
 *
 * <svg id="bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.5 163.2,183.4 268.4,130.9 373.6,114.1 478.8,106.9 584.0,154.2"/>
 * <polyline class="ln2" points="58.0,204.9 163.2,167.5 268.4,53.5 373.6,25.0 478.8,47.9 584.0,84.3"/>
 * <circle class="mk1" cx="58.0" cy="207.5" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="130.9" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.1" r="4"/>
 * <circle class="mk1" cx="478.8" cy="106.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="154.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.9" r="4"/>
 * <circle class="mk2" cx="163.2" cy="167.5" r="4"/>
 * <circle class="mk2" cx="268.4" cy="53.5" r="4"/>
 * <circle class="mk2" cx="373.6" cy="25.0" r="4"/>
 * <circle class="mk2" cx="478.8" cy="47.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="84.3" r="4"/>
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
 * <svg id="bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.7 478.8,196.3 584.0,56.9"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,219.0 373.6,216.6 478.8,204.4 584.0,140.9"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="56.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.6" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.9" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0105 | 1.5586 | 0.0083 | 1.9692 | 79.1% |
 * | 64 | 0.0143 | 4.5714 | 0.0096 | 6.8495 | 66.7% |
 * | 128 | 0.0236 | 11.1304 | 0.0125 | 20.9782 | 53.1% |
 * | 256 | 0.0792 | 13.2369 | 0.0432 | 24.2726 | 54.5% |
 * | 512 | 0.2978 | 14.0862 | 0.1987 | 21.1134 | 66.7% |
 * | 1024 | 2.0366 | 8.2378 | 0.9942 | 16.8752 | 48.8% |
 *
 * <svg id="bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,207.5 163.2,183.4 268.4,131.0 373.6,114.1 478.8,107.3 584.0,154.1"/>
 * <polyline class="ln2" points="58.0,204.2 163.2,165.2 268.4,52.2 373.6,25.8 478.8,51.1 584.0,85.0"/>
 * <circle class="mk1" cx="58.0" cy="207.5" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="131.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.1" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="154.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="165.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="52.2" r="4"/>
 * <circle class="mk2" cx="373.6" cy="25.8" r="4"/>
 * <circle class="mk2" cx="478.8" cy="51.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.0" r="4"/>
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
 * <svg id="bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,218.9 268.4,218.1 373.6,213.7 478.8,196.2 584.0,57.1"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,219.0 373.6,216.5 478.8,204.1 584.0,140.5"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.5" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0113 | 1.4484 | 0.0083 | 1.9730 | 73.4% |
 * | 64 | 0.0143 | 4.5714 | 0.0097 | 6.7368 | 67.9% |
 * | 128 | 0.0235 | 11.1532 | 0.0125 | 20.8980 | 53.4% |
 * | 256 | 0.0792 | 13.2316 | 0.0430 | 24.3810 | 54.3% |
 * | 512 | 0.2977 | 14.0900 | 0.1984 | 21.1372 | 66.7% |
 * | 1024 | 2.0375 | 8.2344 | 0.9950 | 16.8622 | 48.8% |
 *
 * <svg id="bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="184.0" text-anchor="end">5.0</text>
 * <text class="at" x="52" y="144.0" text-anchor="end">10</text>
 * <text class="at" x="52" y="104.0" text-anchor="end">15</text>
 * <text class="at" x="52" y="64.0" text-anchor="end">20</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">25</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">GB/s</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,208.4 163.2,183.4 268.4,130.8 373.6,114.1 478.8,107.3 584.0,154.1"/>
 * <polyline class="ln2" points="58.0,204.2 163.2,166.1 268.4,52.8 373.6,25.0 478.8,50.9 584.0,85.1"/>
 * <circle class="mk1" cx="58.0" cy="208.4" r="4"/>
 * <circle class="mk1" cx="163.2" cy="183.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="130.8" r="4"/>
 * <circle class="mk1" cx="373.6" cy="114.1" r="4"/>
 * <circle class="mk1" cx="478.8" cy="107.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="154.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="204.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="166.1" r="4"/>
 * <circle class="mk2" cx="268.4" cy="52.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="25.0" r="4"/>
 * <circle class="mk2" cx="478.8" cy="50.9" r="4"/>
 * <circle class="mk2" cx="584.0" cy="85.1" r="4"/>
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
 * <svg id="bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-no-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.1 163.2,218.9 268.4,218.1 373.6,213.7 478.8,196.2 584.0,57.0"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,219.0 373.6,216.6 478.8,204.1 584.0,140.4"/>
 * <circle class="mk1" cx="58.0" cy="219.1" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="57.0" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.6" r="4"/>
 * <circle class="mk2" cx="478.8" cy="204.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="140.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * <details>
 * <summary>Nvidia Geforce Gtx 1650 — transB = transpose (6 pads)</summary>
 *
 * <details>
 * <summary>pad = 0</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0111 | 1.4734 | 0.0082 | 2.0000 | 73.7% |
 * | 64 | 0.0159 | 4.1207 | 0.0098 | 6.6928 | 61.6% |
 * | 128 | 0.0287 | 9.1480 | 0.0124 | 21.1953 | 43.2% |
 * | 256 | 0.1332 | 7.8694 | 0.0329 | 31.8290 | 24.7% |
 * | 512 | 0.4389 | 9.5561 | 0.1864 | 22.5055 | 42.5% |
 * | 1024 | 3.1770 | 5.2808 | 0.9851 | 17.0317 | 31.0% |
 *
 * <svg id="bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,212.6 163.2,199.4 268.4,174.3 373.6,180.7 478.8,172.2 584.0,193.6"/>
 * <polyline class="ln2" points="58.0,210.0 163.2,186.5 268.4,114.0 373.6,60.9 478.8,107.5 584.0,134.8"/>
 * <circle class="mk1" cx="58.0" cy="212.6" r="4"/>
 * <circle class="mk1" cx="163.2" cy="199.4" r="4"/>
 * <circle class="mk1" cx="268.4" cy="174.3" r="4"/>
 * <circle class="mk1" cx="373.6" cy="180.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="172.2" r="4"/>
 * <circle class="mk1" cx="584.0" cy="193.6" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.0" r="4"/>
 * <circle class="mk2" cx="163.2" cy="186.5" r="4"/>
 * <circle class="mk2" cx="268.4" cy="114.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="60.9" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.8" r="4"/>
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
 * <svg id="bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad0-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
 * <rect class="bg" width="600" height="260"/>
 * <line class="gr" x1="58" y1="220.0" x2="584" y2="220.0"/>
 * <line class="gr" x1="58" y1="170.0" x2="584" y2="170.0"/>
 * <line class="gr" x1="58" y1="120.0" x2="584" y2="120.0"/>
 * <line class="gr" x1="58" y1="70.0" x2="584" y2="70.0"/>
 * <line class="gr" x1="58" y1="20.0" x2="584" y2="20.0"/>
 * <line class="ax" x1="58" y1="20" x2="58" y2="220"/>
 * <line class="ax" x1="58" y1="220" x2="584" y2="220"/>
 * <text class="at" x="52" y="224.0" text-anchor="end">0</text>
 * <text class="at" x="52" y="174.0" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="74.0" text-anchor="end">3.00</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">4.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.4 163.2,219.2 268.4,218.6 373.6,213.3 478.8,198.1 584.0,61.1"/>
 * <polyline class="ln2" points="58.0,219.6 163.2,219.5 268.4,219.4 373.6,218.4 478.8,210.7 584.0,170.7"/>
 * <circle class="mk1" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk1" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.6" r="4"/>
 * <circle class="mk1" cx="373.6" cy="213.3" r="4"/>
 * <circle class="mk1" cx="478.8" cy="198.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="61.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.6" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.5" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="218.4" r="4"/>
 * <circle class="mk2" cx="478.8" cy="210.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="170.7" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 1</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0100 | 1.6463 | 0.0084 | 1.9542 | 84.2% |
 * | 64 | 0.0123 | 5.3333 | 0.0098 | 6.6819 | 79.8% |
 * | 128 | 0.0208 | 12.6031 | 0.0123 | 21.3333 | 59.1% |
 * | 256 | 0.0771 | 13.5939 | 0.0341 | 30.7536 | 44.2% |
 * | 512 | 0.2668 | 15.7236 | 0.1864 | 22.5055 | 69.9% |
 * | 1024 | 1.9606 | 8.5572 | 0.9851 | 17.0309 | 50.2% |
 *
 * <svg id="bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,211.8 163.2,193.3 268.4,157.0 373.6,152.0 478.8,141.4 584.0,177.2"/>
 * <polyline class="ln2" points="58.0,210.2 163.2,186.6 268.4,113.3 373.6,66.2 478.8,107.5 584.0,134.8"/>
 * <circle class="mk1" cx="58.0" cy="211.8" r="4"/>
 * <circle class="mk1" cx="163.2" cy="193.3" r="4"/>
 * <circle class="mk1" cx="268.4" cy="157.0" r="4"/>
 * <circle class="mk1" cx="373.6" cy="152.0" r="4"/>
 * <circle class="mk1" cx="478.8" cy="141.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="177.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="186.6" r="4"/>
 * <circle class="mk2" cx="268.4" cy="113.3" r="4"/>
 * <circle class="mk2" cx="373.6" cy="66.2" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.8" r="4"/>
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
 * <svg id="bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad1-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.0 163.2,218.8 268.4,217.9 373.6,212.3 478.8,193.3 584.0,23.9"/>
 * <polyline class="ln2" points="58.0,219.2 163.2,219.0 268.4,218.8 373.6,216.6 478.8,201.4 584.0,121.5"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.8" r="4"/>
 * <circle class="mk1" cx="268.4" cy="217.9" r="4"/>
 * <circle class="mk1" cx="373.6" cy="212.3" r="4"/>
 * <circle class="mk1" cx="478.8" cy="193.3" r="4"/>
 * <circle class="mk1" cx="584.0" cy="23.9" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.0" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.6" r="4"/>
 * <circle class="mk2" cx="478.8" cy="201.4" r="4"/>
 * <circle class="mk2" cx="584.0" cy="121.5" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 8</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0101 | 1.6254 | 0.0083 | 1.9655 | 82.7% |
 * | 64 | 0.0123 | 5.3333 | 0.0099 | 6.6494 | 80.2% |
 * | 128 | 0.0219 | 11.9766 | 0.0123 | 21.3333 | 56.1% |
 * | 256 | 0.0906 | 11.5768 | 0.0336 | 31.1779 | 37.1% |
 * | 512 | 0.2499 | 16.7869 | 0.1867 | 22.4650 | 74.7% |
 * | 1024 | 1.8726 | 8.9592 | 0.9835 | 17.0583 | 52.5% |
 *
 * <svg id="bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,211.9 163.2,193.3 268.4,160.1 373.6,162.1 478.8,136.1 584.0,175.2"/>
 * <polyline class="ln2" points="58.0,210.2 163.2,186.8 268.4,113.3 373.6,64.1 478.8,107.7 584.0,134.7"/>
 * <circle class="mk1" cx="58.0" cy="211.9" r="4"/>
 * <circle class="mk1" cx="163.2" cy="193.3" r="4"/>
 * <circle class="mk1" cx="268.4" cy="160.1" r="4"/>
 * <circle class="mk1" cx="373.6" cy="162.1" r="4"/>
 * <circle class="mk1" cx="478.8" cy="136.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="175.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="186.8" r="4"/>
 * <circle class="mk2" cx="268.4" cy="113.3" r="4"/>
 * <circle class="mk2" cx="373.6" cy="64.1" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.7" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.7" r="4"/>
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
 * <svg id="bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad8-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.0 163.2,218.8 268.4,217.8 373.6,210.9 478.8,195.0 584.0,32.7"/>
 * <polyline class="ln2" points="58.0,219.2 163.2,219.0 268.4,218.8 373.6,216.6 478.8,201.3 584.0,121.6"/>
 * <circle class="mk1" cx="58.0" cy="219.0" r="4"/>
 * <circle class="mk1" cx="163.2" cy="218.8" r="4"/>
 * <circle class="mk1" cx="268.4" cy="217.8" r="4"/>
 * <circle class="mk1" cx="373.6" cy="210.9" r="4"/>
 * <circle class="mk1" cx="478.8" cy="195.0" r="4"/>
 * <circle class="mk1" cx="584.0" cy="32.7" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.0" r="4"/>
 * <circle class="mk2" cx="268.4" cy="218.8" r="4"/>
 * <circle class="mk2" cx="373.6" cy="216.6" r="4"/>
 * <circle class="mk2" cx="478.8" cy="201.3" r="4"/>
 * <circle class="mk2" cx="584.0" cy="121.6" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 16</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0100 | 1.6358 | 0.0084 | 1.9468 | 84.0% |
 * | 64 | 0.0128 | 5.1393 | 0.0096 | 6.8040 | 75.5% |
 * | 128 | 0.0228 | 11.5137 | 0.0122 | 21.4731 | 53.6% |
 * | 256 | 0.1018 | 10.3012 | 0.0331 | 31.6599 | 32.5% |
 * | 512 | 0.2888 | 14.5248 | 0.1864 | 22.5055 | 64.5% |
 * | 1024 | 2.1069 | 7.9629 | 0.9836 | 17.0575 | 46.7% |
 *
 * <svg id="bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,211.8 163.2,194.3 268.4,162.4 373.6,168.5 478.8,147.4 584.0,180.2"/>
 * <polyline class="ln2" points="58.0,210.3 163.2,186.0 268.4,112.6 373.6,61.7 478.8,107.5 584.0,134.7"/>
 * <circle class="mk1" cx="58.0" cy="211.8" r="4"/>
 * <circle class="mk1" cx="163.2" cy="194.3" r="4"/>
 * <circle class="mk1" cx="268.4" cy="162.4" r="4"/>
 * <circle class="mk1" cx="373.6" cy="168.5" r="4"/>
 * <circle class="mk1" cx="478.8" cy="147.4" r="4"/>
 * <circle class="mk1" cx="584.0" cy="180.2" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="186.0" r="4"/>
 * <circle class="mk2" cx="268.4" cy="112.6" r="4"/>
 * <circle class="mk2" cx="373.6" cy="61.7" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.7" r="4"/>
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
 * <svg id="bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad16-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.2 163.2,219.0 268.4,218.2 373.6,211.9 478.8,196.9 584.0,51.4"/>
 * <polyline class="ln2" points="58.0,219.3 163.2,219.2 268.4,219.0 373.6,217.4 478.8,205.1 584.0,141.3"/>
 * <circle class="mk1" cx="58.0" cy="219.2" r="4"/>
 * <circle class="mk1" cx="163.2" cy="219.0" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.2" r="4"/>
 * <circle class="mk1" cx="373.6" cy="211.9" r="4"/>
 * <circle class="mk1" cx="478.8" cy="196.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="51.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.2" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.0" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.4" r="4"/>
 * <circle class="mk2" cx="478.8" cy="205.1" r="4"/>
 * <circle class="mk2" cx="584.0" cy="141.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 32</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0102 | 1.6101 | 0.0082 | 1.9961 | 80.7% |
 * | 64 | 0.0136 | 4.8245 | 0.0102 | 6.4000 | 75.4% |
 * | 128 | 0.0246 | 10.6667 | 0.0122 | 21.4731 | 49.7% |
 * | 256 | 0.1132 | 9.2630 | 0.0341 | 30.7392 | 30.1% |
 * | 512 | 0.3740 | 11.2142 | 0.1864 | 22.5036 | 49.8% |
 * | 1024 | 2.7133 | 6.1833 | 0.9851 | 17.0312 | 36.3% |
 *
 * <svg id="bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,211.9 163.2,195.9 268.4,166.7 373.6,173.7 478.8,163.9 584.0,189.1"/>
 * <polyline class="ln2" points="58.0,210.0 163.2,188.0 268.4,112.6 373.6,66.3 478.8,107.5 584.0,134.8"/>
 * <circle class="mk1" cx="58.0" cy="211.9" r="4"/>
 * <circle class="mk1" cx="163.2" cy="195.9" r="4"/>
 * <circle class="mk1" cx="268.4" cy="166.7" r="4"/>
 * <circle class="mk1" cx="373.6" cy="173.7" r="4"/>
 * <circle class="mk1" cx="478.8" cy="163.9" r="4"/>
 * <circle class="mk1" cx="584.0" cy="189.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.0" r="4"/>
 * <circle class="mk2" cx="163.2" cy="188.0" r="4"/>
 * <circle class="mk2" cx="268.4" cy="112.6" r="4"/>
 * <circle class="mk2" cx="373.6" cy="66.3" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.5" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.8" r="4"/>
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
 * <svg id="bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad32-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">2.50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">3.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.3 163.2,219.1 268.4,218.4 373.6,212.5 478.8,195.1 584.0,39.1"/>
 * <polyline class="ln2" points="58.0,219.5 163.2,219.3 268.4,219.2 373.6,217.7 478.8,207.6 584.0,154.3"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="163.2" cy="219.1" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="373.6" cy="212.5" r="4"/>
 * <circle class="mk1" cx="478.8" cy="195.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="39.1" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.5" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.7" r="4"/>
 * <circle class="mk2" cx="478.8" cy="207.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="154.3" r="4"/>
 * </svg>
 *
 * </details>
 *
 * <details>
 * <summary>pad = 64</summary>
 *
 * | n | wgblas ms | wgblas GB/s | cuBLAS ms | cuBLAS GB/s | efficiency |
 * |---|-----------|-------------|-----------|-------------|------------|
 * | 32 | 0.0102 | 1.6000 | 0.0083 | 1.9655 | 81.4% |
 * | 64 | 0.0135 | 4.8473 | 0.0098 | 6.6928 | 72.4% |
 * | 128 | 0.0246 | 10.6667 | 0.0121 | 21.7294 | 49.1% |
 * | 256 | 0.1147 | 9.1429 | 0.0337 | 31.1187 | 29.4% |
 * | 512 | 0.3735 | 11.2301 | 0.1866 | 22.4804 | 50.0% |
 * | 1024 | 2.7383 | 6.1269 | 0.9846 | 17.0403 | 36.0% |
 *
 * <svg id="bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="GB/s vs n">
 * <style>#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .at{fill:#898781}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-gbs .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,212.0 163.2,195.8 268.4,166.7 373.6,174.3 478.8,163.8 584.0,189.4"/>
 * <polyline class="ln2" points="58.0,210.2 163.2,186.5 268.4,111.4 373.6,64.4 478.8,107.6 584.0,134.8"/>
 * <circle class="mk1" cx="58.0" cy="212.0" r="4"/>
 * <circle class="mk1" cx="163.2" cy="195.8" r="4"/>
 * <circle class="mk1" cx="268.4" cy="166.7" r="4"/>
 * <circle class="mk1" cx="373.6" cy="174.3" r="4"/>
 * <circle class="mk1" cx="478.8" cy="163.8" r="4"/>
 * <circle class="mk1" cx="584.0" cy="189.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="210.2" r="4"/>
 * <circle class="mk2" cx="163.2" cy="186.5" r="4"/>
 * <circle class="mk2" cx="268.4" cy="111.4" r="4"/>
 * <circle class="mk2" cx="373.6" cy="64.4" r="4"/>
 * <circle class="mk2" cx="478.8" cy="107.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="134.8" r="4"/>
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
 * <svg id="bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="600" height="260" role="img" aria-label="ms vs n">
 * <style>#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#fcfcfb}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#e1e0d9;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#c3c2b7;stroke-width:1;fill:none}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#52514e;font:11px/1 system-ui,sans-serif}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#2a78d6;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#2a78d6;stroke:#fcfcfb;stroke-width:2}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300;fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#fcfcfb;stroke-width:2}@media(prefers-color-scheme:dark){#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .at{fill:#898781}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln2{stroke:#008300}#bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{fill:#008300;stroke:#1a1a19}}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .bg{fill:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .gr{stroke:#2c2c2a}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ax{stroke:#383835}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .lt{fill:#c3c2b7}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .ln1{stroke:#3987e5}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk1{fill:#3987e5;stroke:#1a1a19}:root[data-theme=dark] #bc-sgemm-ldb-transpose-pad64-nvidia_geforce_gtx_1650-ms .mk2{stroke:#1a1a19}</style>
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
 * <text class="at" x="52" y="190.7" text-anchor="end">0.500</text>
 * <text class="at" x="52" y="157.3" text-anchor="end">1.00</text>
 * <text class="at" x="52" y="124.0" text-anchor="end">1.50</text>
 * <text class="at" x="52" y="90.7" text-anchor="end">2.00</text>
 * <text class="at" x="52" y="57.3" text-anchor="end">2.50</text>
 * <text class="at" x="52" y="24.0" text-anchor="end">3.00</text>
 * <text class="lt" x="12" y="120.0" text-anchor="middle" transform="rotate(-90 12 120.0)">ms</text>
 * <text class="at" x="58.0" y="236" text-anchor="middle">32</text>
 * <text class="at" x="163.2" y="236" text-anchor="middle">64</text>
 * <text class="at" x="268.4" y="236" text-anchor="middle">128</text>
 * <text class="at" x="373.6" y="236" text-anchor="middle">256</text>
 * <text class="at" x="478.8" y="236" text-anchor="middle">512</text>
 * <text class="at" x="584.0" y="236" text-anchor="middle">1.0K</text>
 * <polyline class="ln1" points="58.0,219.3 163.2,219.1 268.4,218.4 373.6,212.4 478.8,195.1 584.0,37.4"/>
 * <polyline class="ln2" points="58.0,219.4 163.2,219.3 268.4,219.2 373.6,217.8 478.8,207.6 584.0,154.4"/>
 * <circle class="mk1" cx="58.0" cy="219.3" r="4"/>
 * <circle class="mk1" cx="163.2" cy="219.1" r="4"/>
 * <circle class="mk1" cx="268.4" cy="218.4" r="4"/>
 * <circle class="mk1" cx="373.6" cy="212.4" r="4"/>
 * <circle class="mk1" cx="478.8" cy="195.1" r="4"/>
 * <circle class="mk1" cx="584.0" cy="37.4" r="4"/>
 * <circle class="mk2" cx="58.0" cy="219.4" r="4"/>
 * <circle class="mk2" cx="163.2" cy="219.3" r="4"/>
 * <circle class="mk2" cx="268.4" cy="219.2" r="4"/>
 * <circle class="mk2" cx="373.6" cy="217.8" r="4"/>
 * <circle class="mk2" cx="478.8" cy="207.6" r="4"/>
 * <circle class="mk2" cx="584.0" cy="154.4" r="4"/>
 * </svg>
 *
 * </details>
 *
 * </details>
 *
 * **See also:**
 *
 * - [ldb.sgemm.js](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/wgblas/ldb.sgemm.js) — WebGPU ldb-sweep benchmark script
 * - [ldb.sgemm.c](https://github.com/manit2004/wgblas/blob/main/benchmarks/sgemm/cuda/ldb.sgemm.c) — CUDA / cuBLAS ldb-sweep reference script
 *
 * @module benchmarks/nvidia-geforce-gtx-1650/sgemm
 */
