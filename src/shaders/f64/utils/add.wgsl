// Requires f64/dekker.wgsl concatenated first for the DD struct.

// ── A real compiler bug — read before touching anything below ──────────────
//
// twoSum/fastTwoSum's error term `e` should be nonzero (that's the point —
// `s` is rounded). A front-end-optimizer bug zeros it anyway, on both NVIDIA
// and Mesa (ANV + llvmpipe), via two different mechanisms needing two fixes:
// bitcast-based subtraction (`fsub`/`negf`, fixes NVIDIA) and materializing
// the sum through workgroup memory + workgroupBarrier() (fixes Mesa). Metal
// needs a third, hide() (see the protected variants below). Use the protected
// ops, which apply all three — the plain twoSum/fastTwoSum/ddAdd below are
// reference-only, not safe to use.
fn negf(x: f32) -> f32 {
  return bitcast<f32>(bitcast<u32>(x) ^ 0x80000000u);
}
fn fsub(a: f32, b: f32) -> f32 {
  return a + negf(b);
}

// IEEE special values: once a rounded result is ±Inf or NaN, the error-free
// transformations' error term is meaningless (Inf - Inf = NaN) — the value
// alone is the answer, so its error is 0. Without this an Inf turns into NaN
// at the next DD op, where f32 (and real f64) would carry the Inf through.
fn isFiniteF(x: f32) -> bool {
  return (bitcast<u32>(x) & 0x7f800000u) != 0x7f800000u;
}

// Knuth/Møller's TwoSum: s = fl(a+b), e = exact rounding error, a+b == s+e.
// Works for any a, b. UNPROTECTED — see header above.
fn twoSum(a: f32, b: f32) -> DD {
  let s = a + b;
  let v = s - a;
  let e = (a - (s - v)) + (b - v);
  return DD(s, e);
}

// Dekker's Fast-Two-Sum: same contract, but only correct when |a| >= |b|.
// UNPROTECTED — see header above.
fn fastTwoSum(a: f32, b: f32) -> DD {
  let s = a + b;
  let e = b - (s - a);
  return DD(s, e);
}

// Double-double addition (Dekker's Add2). UNPROTECTED — see header above.
fn ddAdd(a: DD, b: DD) -> DD {
  let s = twoSum(a.hi, b.hi);
  let loSum = a.lo + b.lo;
  return fastTwoSum(s.hi, s.lo + loSum);
}

// ── Protected variants — use these ──────────────────────────────────────────
//
// Bitcast subtraction + workgroup-barrier materialization (verified on
// NVIDIA, Mesa ANV and llvmpipe) + hide() for Metal. Costs a real barrier:
// fine for O(1)-per-thread or O(log n) reduction use, not a long
// per-element loop. A
// workgroupBarrier() requires uniform control flow, so:
//   - `threadSlot` must be unique per concurrent caller (e.g. local_invocation_index).
//   - Every thread in the workgroup must call this the same number of times
//     — including ones whose result gets discarded. Compute unconditionally;
//     only the write-back should be conditional.
// Sized for the largest DD workgroup (dgemm_small, 256 threads), plus
// DEKKER_ZERO_SLOT, which nothing writes (see hide() below).
const DEKKER_ZERO_SLOT: u32 = 256u;
var<workgroup> dekkerScratch: array<f32, 257>;

// ── Metal: relaxed math ──────────────────────────────────────────────────────
//
// Dawn compiles every Metal shader under `#pragma METAL fp math_mode(relaxed)`
// (strict math is a native-only Dawn option WebGPU doesn't expose), which
// lets the compiler reassociate and simplify float algebra. That folds the
// error terms away by algebra alone, whatever `s` is: `a - (s - (s - a))`
// is `a - a` = 0. Materializing `s` can't stop it; the formula itself has to
// be opaque. hide() makes a value opaque: an XOR with a zero the compiler
// can't prove is zero (DEKKER_ZERO_SLOT — WebGPU zero-initializes workgroup
// memory, and the runtime-indexed stores into the same array keep the
// compiler from knowing that slot's contents). Every input and intermediate
// of an error-free transformation goes through it, so each float op stands
// alone and rounds exactly as written: nothing to reassociate or fuse.
fn dekkerZero() -> u32 {
  return bitcast<u32>(dekkerScratch[DEKKER_ZERO_SLOT]);
}
fn hide(x: f32, zero: u32) -> f32 {
  return bitcast<f32>(bitcast<u32>(x) ^ zero);
}

fn twoSumProtected(a: f32, b: f32, threadSlot: u32) -> DD {
  let z = dekkerZero();
  let ha = hide(a, z);
  let hb = hide(b, z);
  dekkerScratch[threadSlot] = ha + hb;
  workgroupBarrier();
  let s = dekkerScratch[threadSlot];
  let v = hide(fsub(s, ha), z);
  let e = hide(fsub(ha, hide(fsub(s, v), z)), z) + hide(fsub(hb, v), z);
  return DD(s, select(0.0, e, isFiniteF(s)));
}

fn fastTwoSumProtected(a: f32, b: f32, threadSlot: u32) -> DD {
  let z = dekkerZero();
  let ha = hide(a, z);
  let hb = hide(b, z);
  dekkerScratch[threadSlot] = ha + hb;
  workgroupBarrier();
  let s = dekkerScratch[threadSlot];
  let e = fsub(hb, hide(fsub(s, ha), z));
  return DD(s, select(0.0, e, isFiniteF(s)));
}

// Protected double-double addition — same contract as ddAdd, but exact.
fn ddAddProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  let s = twoSumProtected(a.hi, b.hi, threadSlot);
  let loSum = a.lo + b.lo;
  return fastTwoSumProtected(s.hi, s.lo + loSum, threadSlot);
}

// Double-double subtraction — a - b, via exact negation (a sign-bit flip,
// no rounding) then ddAddProtected. Same protection contract.
fn ddSubProtected(a: DD, b: DD, threadSlot: u32) -> DD {
  return ddAddProtected(a, DD(negf(b.hi), negf(b.lo)), threadSlot);
}
