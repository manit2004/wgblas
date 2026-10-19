// scaledSumF64 reduction: collapses dnrm2.wgsl's 2*WGS (big, medium, small,
// flag) DD partials into the final norm — the double-double counterpart of
// reduction/scaledSum.wgsl. Partials merge by DD addition (fixed power-of-
// two scales), then the three sums combine as in LAPACK 3.10's dnrm2: big
// dominates if present (medium folded in at big's scale); otherwise small
// and medium meet through their square roots; otherwise medium alone. A
// NaN seen anywhere gives NaN, else an Inf gives Inf (see dnrm2.wgsl).
//
// Protected ops need every thread at the same call site, so every thread
// evaluates all three cases and select() picks — only thread 0 writes.
// dispatch: 1 workgroup of WGS threads.
// partials must hold exactly PARTIAL_LEN * 2*WGS entries.

@group(0) @binding(0) var<storage, read>       partials: array<f32>;
@group(0) @binding(1) var<storage, read_write> resultHi: array<f32, 1>;
@group(0) @binding(2) var<storage, read_write> resultLo: array<f32, 1>;

const WGS: u32 = 64;
const PARTIAL_LEN: u32 = 7; // must match dnrm2.wgsl

const SSML: f32 = 0x1p64f;  // must match dnrm2.wgsl
const SBIG: f32 = 0x1p-76f; // must match dnrm2.wgsl
const SBIG_SQ_EXP: i32 = -152; // log2(SBIG²)

struct Acc3 {
  big:  DD,
  med:  DD,
  sml:  DD,
  flag: f32,
}

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

// Exact scaling of a DD value by a power of two.
fn ddScale(a: DD, s: f32) -> DD {
  return DD(a.hi * s, a.lo * s);
}

fn mergeProtected(a: Acc3, b: Acc3, threadSlot: u32) -> Acc3 {
  return Acc3(
    ddAddProtected(a.big, b.big, threadSlot),
    ddAddProtected(a.med, b.med, threadSlot),
    ddAddProtected(a.sml, b.sml, threadSlot),
    max(a.flag, b.flag),
  );
}

fn partialAt(i: u32) -> Acc3 {
  let b = i * PARTIAL_LEN;
  return Acc3(DD(partials[b], partials[b + 1u]), DD(partials[b + 2u], partials[b + 3u]),
              DD(partials[b + 4u], partials[b + 5u]), partials[b + 6u]);
}

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
fn reduce_scaled_f64(
  @builtin(local_invocation_id) lid: vec3u,
) {
  let i = lid.x;
  tileStore(i, mergeProtected(partialAt(i), partialAt(i + WGS), i));
  workgroupBarrier();

  for (var s = WGS / 2u; s > 0u; s >>= 1u) {
    let partner = select(i, i + s, i < s);
    let merged = mergeProtected(tileLoad(i), tileLoad(partner), i);
    workgroupBarrier();
    if (i < s) { tileStore(i, merged); }
    workgroupBarrier();
  }

  // Final combine — every thread computes it (protected ops), thread 0 writes.
  let t = tileLoad(0u);
  let medLive = t.med.hi > 0.0;
  let one = DD(1.0, 0.0);

  // Medium's norm (0 if empty; ddSqrtProtected handles 0 exactly).
  let rMed = ddSqrtProtected(t.med, i);

  // Case big: medium in big's units is amed·SBIG² = amed·2^-152 — one exact
  // ldexp. Never as (amed·SBIG)·SBIG: a compiler may fold that into
  // amed·(SBIG·SBIG), and the constant 2^-152 underflows f32 to 0 (it did,
  // on NVIDIA/Vulkan). Not via sqrt(amed) squared either: the DD sqrt is
  // markedly less accurate on some backends. If the scaled value underflows,
  // medium was below big's rounding anyway (big's smallest square is 2^-52).
  let medInBig = DD(ldexp(t.med.hi, SBIG_SQ_EXP), ldexp(t.med.lo, SBIG_SQ_EXP));
  let bigTotal = ddAddProtected(t.big, medInBig, i);
  let resBig = ddScale(ddSqrtProtected(bigTotal, i), 1.0 / SBIG);

  // Case small: with medium present, the two meet through their roots,
  // ymax·sqrt(1 + (ymin/ymax)²); alone, small's root scaled back down.
  let rSml = ddScale(ddSqrtProtected(t.sml, i), 1.0 / SSML);
  let smlBigger = ddGreater(rSml, rMed);
  let ymax = ddSelect(rMed, rSml, smlBigger);
  let ymin = ddSelect(rSml, rMed, smlBigger);
  let q = ddDivProtected(ymin, ddSelect(ymax, one, ymax.hi == 0.0), i);
  let q2 = ddMulProtected(q, q, i);
  let resMix = ddMulProtected(ymax, ddSqrtProtected(ddAddProtected(one, q2, i), i), i);
  let resSml = ddSelect(rSml, resMix, medLive);

  var res = ddSelect(ddSelect(rMed, resSml, t.sml.hi > 0.0), resBig, t.big.hi > 0.0);
  // Built from a runtime value: a const-expression that evaluates to Inf or
  // NaN is a shader-creation error in WGSL.
  let rt = i & 0u;
  let inf = bitcast<f32>(0x7f800000u | rt);
  let nan = bitcast<f32>(0x7fc00000u | rt);
  res = ddSelect(res, DD(inf, 0.0), t.flag >= 1.0);
  res = ddSelect(res, DD(nan, 0.0), t.flag >= 2.0);

  if (i == 0u) {
    resultHi[0] = res.hi;
    resultLo[0] = res.lo;
  }
}
