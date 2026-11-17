/**
 * Each GPU's roofline: every routine at its arithmetic intensity (FLOPs per
 * byte of compulsory memory traffic) against the GFLOP/s it achieved, under
 * the GPU's two ceilings, a sloped memory roof and a flat compute roof, both
 * measured by the roofline probes. They meet at the ridge point: a routine to
 * its left can only be memory-bound, so its only lever is bandwidth
 * efficiency. Level 1 and Level 2 sit left of the ridge by construction;
 * Level 3 is the only level with enough data reuse to cross it.
 *
 * <div data-wgblas-roofline></div>
 *
 * Computed in your browser from each GPU's results on GitHub: the probes'
 * `fma.json` and `bandwidth.json` for the roofs, each routine's base run, and
 * the FLOP counts in `assets/routines/routine_params.json` for routines whose
 * benchmarks record bytes only. Nothing is stored or generated. The method is
 * in the `benchmarks` page's Roofline section; the per-routine results are on
 * the `benchmarks/results` page.
 *
 * @module benchmarks/roofline
 */
export {};
