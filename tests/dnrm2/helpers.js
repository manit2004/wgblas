// Double-double gives ~48 mantissa bits, not f64's 53, so the working epsilon
// for a dnrm2 result is 2^-48 rather than 2^-52 — see shaders/f64/dekker.wgsl.
// Raw ULP64 (dasum's own convention, tests/dasum/helpers.js) is the wrong
// tool here: a norm's result is a square root of a sum of squares, so a
// relative-error factor against eps — same shape as drot's/drotm's own
// bound — is the natural measure.
const eps = 2 ** -48;

export function forwardFactor(gpu, ref) {
  const err = Math.abs(gpu.nrm2 - ref);
  const bound = eps * Math.abs(ref);
  if (bound === 0) return err === 0 ? 0 : Infinity;
  return err / bound;
}
