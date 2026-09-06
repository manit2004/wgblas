import { maxUlp } from "../helpers/fixtures.js";
import { interleaveComplex32 } from "../../src/util/complex.mjs";

// maxUlp needs plain numeric indexing — flatten both sides to interleaved
// f32 first. Only meaningful away from cancellation; see cscalForwardFactor.
export function cscalUlp(gpu, ref) {
  return maxUlp(interleaveComplex32(gpu.x), interleaveComplex32(ref.x)).max;
}

// Forward error factor: each output component is alphaRe*re -/+ alphaIm*im,
// a sum/difference of two products, so raw ULP isn't the right tool near
// cancellation (observed up to 139 ULP where this factor stayed under 1) —
// same eps*(sum of term magnitudes) shape as sgemv/sgemm's own bounds.
const eps = 2 ** -23;

export function cscalForwardFactor(gpu, ref, a) {
  let maxFactor = 0;
  for (let i = 0; i < a.n; i++) {
    const idx = i * a.incx;
    const g = gpu.x[idx], r = ref.x[idx], in_ = a.x[idx];

    const reErr = Math.abs(g.re - r.re);
    const reBound = eps * (Math.abs(a.alpha.re * in_.re) + Math.abs(a.alpha.im * in_.im));
    const imErr = Math.abs(g.im - r.im);
    const imBound = eps * (Math.abs(a.alpha.re * in_.im) + Math.abs(a.alpha.im * in_.re));

    for (const [err, bound] of [[reErr, reBound], [imErr, imBound]]) {
      if (bound === 0) { if (err !== 0) maxFactor = Infinity; }
      else maxFactor = Math.max(maxFactor, err / bound);
    }
  }
  return maxFactor;
}
