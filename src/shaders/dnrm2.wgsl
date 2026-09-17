// dnrm2: result = sqrt(sum(x[i] * x[i])), double-double (Dekker) f64
// emulation of snrm2 — same scaled accumulation (Blue's algorithm), just
// with `scale`/`ssq` as DD pairs (via ddDivProtected/ddMulProtected/
// ddAddProtected/ddSqrtProtected) instead of plain f32. Squaring still
// saturates an f32 hi component above ~1.8e19 regardless of DD precision
// (DD widens the mantissa, not the exponent range), so the scaling is
// still needed here for the same reason it was in snrm2.
//
// snrm2.wgsl's ssqAccum/ssqMerge each branch on which operand is bigger —
// can't carry over directly, since a protected op's workgroupBarrier()
// needs every thread to reach the same call site, and here different
// threads could take different branches. Both formulas are computed
// unconditionally below; only the final combine (`ddSelect`) differs per
// thread — same fix shape as drot's/drotm's own per-dispatch flags, just
// applied to a per-element branch instead.
//
// pass 1 dispatches 2*WGS workgroups; pass 2 (reduction/scaledSumF64.wgsl)
// duplicates ssqAccumProtected/ssqMergeProtected rather than sharing them,
// same as the plain-f32 pair already does.

@group(0) @binding(0) var<storage, read>       xHi:           array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:           array<f32>;
@group(0) @binding(2) var<storage, read_write> partialsScaleHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> partialsScaleLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> partialsSsqHi:   array<f32>;
@group(0) @binding(5) var<storage, read_write> partialsSsqLo:   array<f32>;
@group(0) @binding(6) var<uniform>             params:        Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;

struct ScaleSsq {
  scale: DD,
  ssq:   DD,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Folds one more |value| (DD) into a running (scale, ssq) pair — branch-free,
// see file header. `bigger`/`smaller` name the two operands by magnitude
// (not by which one was "acc" vs "new"), and biggerIsZero==true only when
// both scale and absxi are still exactly zero (the very first zero
// elements, before any nonzero value has been seen) — substituting a safe
// denominator there avoids a 0/0 without needing a separate branch/return;
// the arithmetic already reduces to a correct no-op in that case.
fn ssqAccumProtected(acc: ScaleSsq, absxi: DD, threadSlot: u32) -> ScaleSsq {
  let isBigger = ddGreater(absxi, acc.scale);
  let bigger = ddSelect(acc.scale, absxi, isBigger);
  let smaller = ddSelect(absxi, acc.scale, isBigger);
  let biggerIsZero = bigger.hi == 0.0;
  let safeBigger = ddSelect(bigger, DD(1.0, 0.0), biggerIsZero);
  let r = ddDivProtected(smaller, safeBigger, threadSlot);
  let rsq = ddMulProtected(r, r, threadSlot);
  let ssqTimesRsq = ddMulProtected(acc.ssq, rsq, threadSlot);
  let sumIfBigger = ddAddProtected(DD(1.0, 0.0), ssqTimesRsq, threadSlot);
  let sumIfNotBigger = ddAddProtected(acc.ssq, rsq, threadSlot);
  let newSsq = ddSelect(sumIfNotBigger, sumIfBigger, isBigger);
  return ScaleSsq(bigger, newSsq);
}

// Associative merge of two independent (scale, ssq) partials — same
// branch-free shape, for combining ILP lanes and the tree reduction.
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
fn dnrm2_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));
  var acc1 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));
  var acc2 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));
  var acc3 = ScaleSsq(DD(0.0, 0.0), DD(1.0, 0.0));

  let stride   = num_wg.x * WGS;
  let n4_floor = (params.n / (4u * stride)) * (4u * stride);

  // Same trip count for every thread, driven by a counter (protected ops'
  // barriers need a provably-uniform loop bound) — see dasum.wgsl.
  let mainIters = n4_floor / (4u * stride);
  for (var iter = 0u; iter < mainIters; iter++) {
    let id =  gid.x + iter * 4u * stride;
    let i0 =  id                * params.x_inc;
    let i1 = (id +      stride) * params.x_inc;
    let i2 = (id + 2u * stride) * params.x_inc;
    let i3 = (id + 3u * stride) * params.x_inc;
    acc0 = ssqAccumProtected(acc0, ddAbs(DD(xHi[i0], xLo[i0])), lid.x);
    acc1 = ssqAccumProtected(acc1, ddAbs(DD(xHi[i1], xLo[i1])), lid.x);
    acc2 = ssqAccumProtected(acc2, ddAbs(DD(xHi[i2], xLo[i2])), lid.x);
    acc3 = ssqAccumProtected(acc3, ddAbs(DD(xHi[i3], xLo[i3])), lid.x);
  }

  // Tail is ragged (0-3 extra per thread) — pad to this workgroup's worst
  // case, masking an invalid element to exactly 0 (contributes nothing).
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n4_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n4_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id    = n4_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let i     = select(0u, id * params.x_inc, valid); // index 0 always in-bounds
    let loaded = ddAbs(DD(xHi[i], xLo[i]));
    let contribution = DD(select(0.0, loaded.hi, valid), select(0.0, loaded.lo, valid));
    acc0 = ssqAccumProtected(acc0, contribution, lid.x);
  }

  let combined01 = ssqMergeProtected(acc0, acc1, lid.x);
  let combined23 = ssqMergeProtected(acc2, acc3, lid.x);
  let combined = ssqMergeProtected(combined01, combined23, lid.x);
  tileScaleHi[lid.x] = combined.scale.hi;
  tileScaleLo[lid.x] = combined.scale.lo;
  tileSsqHi[lid.x]   = combined.ssq.hi;
  tileSsqLo[lid.x]   = combined.ssq.lo;
  workgroupBarrier();

  // Inactive threads merge against a throwaway partner and discard it
  // (ssqMergeProtected must be called unconditionally by every thread).
  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(lid.x, lid.x + s, lid.x < s);
    let a = ScaleSsq(DD(tileScaleHi[lid.x], tileScaleLo[lid.x]), DD(tileSsqHi[lid.x], tileSsqLo[lid.x]));
    let b = ScaleSsq(DD(tileScaleHi[partner], tileScaleLo[partner]), DD(tileSsqHi[partner], tileSsqLo[partner]));
    let merged = ssqMergeProtected(a, b, lid.x);
    workgroupBarrier(); // all threads must read tile[] above before any write below
    if (lid.x < s) {
      tileScaleHi[lid.x] = merged.scale.hi;
      tileScaleLo[lid.x] = merged.scale.lo;
      tileSsqHi[lid.x]   = merged.ssq.hi;
      tileSsqLo[lid.x]   = merged.ssq.lo;
    }
    workgroupBarrier();
  }

  if (lid.x == 0u) {
    partialsScaleHi[wgid.x] = tileScaleHi[0];
    partialsScaleLo[wgid.x] = tileScaleLo[0];
    partialsSsqHi[wgid.x]   = tileSsqHi[0];
    partialsSsqLo[wgid.x]   = tileSsqLo[0];
  }
}
