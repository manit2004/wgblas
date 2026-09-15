// scaledSum reduction (f64, double-double): collapses 2*WGS (scale, ssq) DD
// partials from dnrm2.wgsl into the final norm — sqrt(scale² · ssq) ==
// scale · sqrt(ssq), via ddMulProtected/ddSqrtProtected. Mirrors
// reduction/scaledSum.wgsl's shape exactly; ssqMergeProtected is duplicated
// from dnrm2.wgsl rather than shared via f64/utils/ — see that file's own
// header for why (same convention the f32 pair already uses).
// dispatch: 1 workgroup of WGS threads.
// partialsScale*/partialsSsq* must have exactly 2*WGS entries each.

@group(0) @binding(0) var<storage, read>       partialsScaleHi: array<f32>;
@group(0) @binding(1) var<storage, read>       partialsScaleLo: array<f32>;
@group(0) @binding(2) var<storage, read>       partialsSsqHi:   array<f32>;
@group(0) @binding(3) var<storage, read>       partialsSsqLo:   array<f32>;
@group(0) @binding(4) var<storage, read_write> resultHi:        array<f32, 1>;
@group(0) @binding(5) var<storage, read_write> resultLo:        array<f32, 1>;

const WGS: u32 = 64;

struct ScaleSsq {
  scale: DD,
  ssq:   DD,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Associative merge of two independent (scale, ssq) partials — see
// dnrm2.wgsl for the derivation and why this is branch-free.
fn ssqMergeProtected(a: ScaleSsq, b: ScaleSsq, threadSlot: u32) -> ScaleSsq {
  let isBigger = !ddGreater(b.scale, a.scale); // a.scale >= b.scale
  let bigger = ddSelect(b.scale, a.scale, isBigger);
  let smaller = ddSelect(a.scale, b.scale, isBigger);
  let biggerSsq = ddSelect(b.ssq, a.ssq, isBigger);
  let smallerSsq = ddSelect(a.ssq, b.ssq, isBigger);
  let biggerIsZero = bigger.hi == 0.0;
  let safeBigger = ddSelect(bigger, DD(1.0, 0.0), biggerIsZero);
  let r = ddDivProtected(smaller, safeBigger, threadSlot);
  let rsq = ddMulProtected(r, r, threadSlot);
  let smallerSsqTimesRsq = ddMulProtected(smallerSsq, rsq, threadSlot);
  let newSsq = ddAddProtected(biggerSsq, smallerSsqTimesRsq, threadSlot);
  return ScaleSsq(bigger, newSsq);
}

var<workgroup> tileScaleHi: array<f32, 64>;
var<workgroup> tileScaleLo: array<f32, 64>;
var<workgroup> tileSsqHi:   array<f32, 64>;
var<workgroup> tileSsqLo:   array<f32, 64>;

@compute @workgroup_size(64)
fn reduce_scaled_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  let a = ScaleSsq(DD(partialsScaleHi[i], partialsScaleLo[i]), DD(partialsSsqHi[i], partialsSsqLo[i]));
  let b = ScaleSsq(DD(partialsScaleHi[i + WGS], partialsScaleLo[i + WGS]), DD(partialsSsqHi[i + WGS], partialsSsqLo[i + WGS]));
  let merged0 = ssqMergeProtected(a, b, i);
  tileScaleHi[i] = merged0.scale.hi;
  tileScaleLo[i] = merged0.scale.lo;
  tileSsqHi[i]   = merged0.ssq.hi;
  tileSsqLo[i]   = merged0.ssq.lo;
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(i, i + s, i < s);
    let ai = ScaleSsq(DD(tileScaleHi[i], tileScaleLo[i]), DD(tileSsqHi[i], tileSsqLo[i]));
    let bi = ScaleSsq(DD(tileScaleHi[partner], tileScaleLo[partner]), DD(tileSsqHi[partner], tileSsqLo[partner]));
    let merged = ssqMergeProtected(ai, bi, i);
    workgroupBarrier();
    if (i < s) {
      tileScaleHi[i] = merged.scale.hi;
      tileScaleLo[i] = merged.scale.lo;
      tileSsqHi[i]   = merged.ssq.hi;
      tileSsqLo[i]   = merged.ssq.lo;
    }
    workgroupBarrier();
  }

  // ddSqrtProtected/ddMulProtected's own workgroupBarrier()s need every
  // thread to call them — every thread redundantly computes the same final
  // scale·sqrt(ssq) from tile[0] (still visible to all after the reduction
  // above), and only the write-back is conditional. Guarding the calls
  // themselves behind `if (i == 0u)` (as the plain-f32 original safely
  // does with its unprotected `sqrt()`) would leave 63 threads never
  // reaching a barrier the one remaining thread still needs.
  let scale = DD(tileScaleHi[0], tileScaleLo[0]);
  let ssq = DD(tileSsqHi[0], tileSsqLo[0]);
  let result = ddMulProtected(scale, ddSqrtProtected(ssq, i), i);
  if (i == 0u) {
    resultHi[0] = result.hi;
    resultLo[0] = result.lo;
  }
}
