// dnrm2: result = sqrt(sum(x[i] * x[i])), double-double (Dekker) f64
// emulation of snrm2 — the same fixed-scale Blue's algorithm (Anderson
// 2017; LAPACK 3.10's dnrm2), with each accumulator a DD pair. DD widens the
// mantissa, not the exponent range, so the scaling is still needed:
//   big:    |x| > TBIG  → (|x| · SBIG)²
//   medium: in between  → |x|²
//   small:  |x| < TSML  → (|x| · SSML)²
// The big side matches snrm2. The small side doesn't: a square's lo half is
// ~2^-48 below it, and the GPU flushes denormals, so every square must stay
// >= 2^-78 to keep its full DD precision (with snrm2's TSML = 2^-63, medium
// inputs near 1e-15 lost ~17 bits). Here medium starts at 2^-38 (squares
// >= 2^-76), and SSML = 2^64 maps small inputs down to 2^-102 into
// [2^-38, 2^26). Below 2^-102 an input's own lo half is already a denormal
// (flushed on load), so no scaling can recover it.
// Scaling by a power of two is exact on both DD halves, so each element
// costs one protected square and one protected add (into whichever
// accumulator its magnitude picks, via select — protected ops' barriers need
// every thread at the same call site). The running-max (scale, ssq) update
// this replaced cost a protected divide, three multiplies and two adds per
// element.
//
// Inf and NaN would turn into NaN inside the DD error terms (inf - inf), so
// they're kept out of the sums and tracked in a flag instead (0 = none,
// 1 = Inf seen, 2 = NaN seen; merged by max) — reduction/scaledSumF64.wgsl
// returns NaN, else Inf, if set.
//
// pass 1 dispatches 2*WGS workgroups; pass 2 is reduction/scaledSumF64.wgsl.

@group(0) @binding(0) var<storage, read>       xHi:      array<f32>;
@group(0) @binding(1) var<storage, read>       xLo:      array<f32>;
@group(0) @binding(2) var<storage, read_write> partials: array<f32>; // PARTIAL_LEN per workgroup
@group(0) @binding(3) var<uniform>             params:   Params;

struct Params {
  n:     u32,
  x_inc: u32,
}

const WGS: u32 = 64;
// Per-workgroup partial: big.hi, big.lo, med.hi, med.lo, sml.hi, sml.lo, flag.
const PARTIAL_LEN: u32 = 7;

// Thresholds and scales (powers of two) — see the header for the DD-specific
// small side; TBIG/SBIG are snrm2.wgsl's.
const TSML: f32 = 0x1p-38f;
const TBIG: f32 = 0x1p50f;
const SSML: f32 = 0x1p64f;
const SBIG: f32 = 0x1p-76f;

struct Acc3 {
  big:  DD,
  med:  DD,
  sml:  DD,
  flag: f32,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Bit-pattern tests: `v != v` style checks can be folded away by a shader
// compiler that assumes no NaNs (it was, for snrm2, on NVIDIA/Vulkan).
fn isNan(v: f32) -> bool { return (bitcast<u32>(v) & 0x7fffffffu) > 0x7f800000u; }
fn isInf(v: f32) -> bool { return (bitcast<u32>(v) & 0x7fffffffu) == 0x7f800000u; }

// Adds one element to the accumulators. Every thread makes the same two
// protected calls whatever the element's magnitude.
fn accumProtected(acc: Acc3, xi: DD, threadSlot: u32) -> Acc3 {
  let ax = ddAbs(xi);
  let nan = isNan(ax.hi);
  let inf = isInf(ax.hi);
  let finite = !(nan || inf);
  let big = finite && ax.hi > TBIG;
  let sml = finite && ax.hi < TSML;
  let med = finite && !big && !sml;
  let s = select(select(1.0, SSML, sml), SBIG, big);
  let y = DD(select(0.0, ax.hi * s, finite), select(0.0, ax.lo * s, finite));
  let sq = ddMulProtected(y, y, threadSlot);
  let dest = ddSelect(ddSelect(acc.med, acc.sml, sml), acc.big, big);
  let sum = ddAddProtected(dest, sq, threadSlot);
  return Acc3(
    ddSelect(acc.big, sum, big),
    ddSelect(acc.med, sum, med),
    ddSelect(acc.sml, sum, sml),
    max(acc.flag, select(select(0.0, 1.0, inf), 2.0, nan)),
  );
}

// Partials merge by addition — their scales are fixed powers of two.
fn mergeProtected(a: Acc3, b: Acc3, threadSlot: u32) -> Acc3 {
  return Acc3(
    ddAddProtected(a.big, b.big, threadSlot),
    ddAddProtected(a.med, b.med, threadSlot),
    ddAddProtected(a.sml, b.sml, threadSlot),
    max(a.flag, b.flag),
  );
}

const ZERO3 = Acc3(DD(0.0, 0.0), DD(0.0, 0.0), DD(0.0, 0.0), 0.0);

var<workgroup> tile: array<f32, 448>; // WGS × PARTIAL_LEN

fn tileLoad(i: u32) -> Acc3 {
  let b = i * PARTIAL_LEN;
  return Acc3(DD(tile[b], tile[b + 1u]), DD(tile[b + 2u], tile[b + 3u]),
              DD(tile[b + 4u], tile[b + 5u]), tile[b + 6u]);
}

fn tileStore(i: u32, v: Acc3) {
  let b = i * PARTIAL_LEN;
  tile[b] = v.big.hi;
  tile[b + 1u] = v.big.lo;
  tile[b + 2u] = v.med.hi;
  tile[b + 3u] = v.med.lo;
  tile[b + 4u] = v.sml.hi;
  tile[b + 5u] = v.sml.lo;
  tile[b + 6u] = v.flag;
}

@compute @workgroup_size(64)
fn dnrm2_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  var acc0 = ZERO3;
  var acc1 = ZERO3;
  var acc2 = ZERO3;
  var acc3 = ZERO3;

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
    acc0 = accumProtected(acc0, DD(xHi[i0], xLo[i0]), lid.x);
    acc1 = accumProtected(acc1, DD(xHi[i1], xLo[i1]), lid.x);
    acc2 = accumProtected(acc2, DD(xHi[i2], xLo[i2]), lid.x);
    acc3 = accumProtected(acc3, DD(xHi[i3], xLo[i3]), lid.x);
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
    let v = DD(select(0.0, xHi[i], valid), select(0.0, xLo[i], valid));
    acc0 = accumProtected(acc0, v, lid.x);
  }

  let combined = mergeProtected(
    mergeProtected(acc0, acc1, lid.x),
    mergeProtected(acc2, acc3, lid.x),
    lid.x,
  );
  tileStore(lid.x, combined);
  workgroupBarrier();

  // Inactive threads merge against a throwaway partner and discard it
  // (mergeProtected must be called unconditionally by every thread).
  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(lid.x, lid.x + s, lid.x < s);
    let merged = mergeProtected(tileLoad(lid.x), tileLoad(partner), lid.x);
    workgroupBarrier(); // all threads must read tile[] above before any write below
    if (lid.x < s) { tileStore(lid.x, merged); }
    workgroupBarrier();
  }

  if (lid.x < PARTIAL_LEN) {
    partials[wgid.x * PARTIAL_LEN + lid.x] = tile[lid.x];
  }
}
