// Requires f64/dekker.wgsl concatenated first for the DD struct.
//
// Batched protected double-double ops: four independent operations per
// workgroupBarrier() instead of one. Same algorithms and the same compiler-bug
// protections as add.wgsl/multiply.wgsl — bitcast subtraction (NVIDIA) and
// values materialized through workgroup memory + a barrier (Mesa) — applied
// lane-wise to vec4s. The barrier only has to separate a thread's store from
// its own load, so one barrier serves all four lanes. ddMulProtected costs 3
// barriers and ddAddProtected 2; ddMul4Protected/ddAdd4Protected cost the
// same for four results.
//
// Same uniformity contract as the scalar ops: `threadSlot` unique per thread
// (local_invocation_index), every thread calls each op the same number of
// times, only write-backs conditional. Sized for 256-thread workgroups.

struct DD4 {
  hi: vec4<f32>,
  lo: vec4<f32>,
}

var<workgroup> dekkerScratch4: array<vec4<f32>, 256>;

fn negf4(x: vec4<f32>) -> vec4<f32> {
  return bitcast<vec4<f32>>(bitcast<vec4<u32>>(x) ^ vec4<u32>(0x80000000u));
}
fn fsub4(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
  return a + negf4(b);
}

// Rounds v to stored f32s the compiler can't re-derive or re-fuse.
fn materialize4(v: vec4<f32>, threadSlot: u32) -> vec4<f32> {
  dekkerScratch4[threadSlot] = v;
  workgroupBarrier();
  return dekkerScratch4[threadSlot];
}

fn twoSum4Protected(a: vec4<f32>, b: vec4<f32>, threadSlot: u32) -> DD4 {
  let s = materialize4(a + b, threadSlot);
  let v = fsub4(s, a);
  let e = fsub4(a, fsub4(s, v)) + fsub4(b, v);
  return DD4(s, e);
}

fn fastTwoSum4Protected(a: vec4<f32>, b: vec4<f32>, threadSlot: u32) -> DD4 {
  let s = materialize4(a + b, threadSlot);
  let e = fsub4(b, fsub4(s, a));
  return DD4(s, e);
}

// Four ddAddProtected at once.
fn ddAdd4Protected(a: DD4, b: DD4, threadSlot: u32) -> DD4 {
  let s = twoSum4Protected(a.hi, b.hi, threadSlot);
  let loSum = a.lo + b.lo;
  return fastTwoSum4Protected(s.hi, s.lo + loSum, threadSlot);
}

// multiply.wgsl's bitSplit/twoProdBit, lane-wise.
fn bitSplit4(a: vec4<f32>) -> DD4 {
  let hi = bitcast<vec4<f32>>(bitcast<vec4<u32>>(a) & vec4<u32>(0xFFFFF000u));
  return DD4(hi, fsub4(a, hi));
}

fn twoProdBit4(a: vec4<f32>, b: vec4<f32>) -> DD4 {
  let s = a * b;
  let as_ = bitSplit4(a);
  let bs = bitSplit4(b);
  let e = fsub4(fsub4(fsub4(fsub4(s, as_.hi * bs.hi), as_.lo * bs.hi), as_.hi * bs.lo), as_.lo * bs.lo);
  return DD4(s, negf4(e));
}

// Four ddMulProtected at once: p.lo materialized before it feeds the cross
// terms, p.hi before the final fastTwoSum — the two values ddMulRaw and
// ddMulProtected each force through memory.
fn ddMul4Protected(a: DD4, b: DD4, threadSlot: u32) -> DD4 {
  let p = twoProdBit4(a.hi, b.hi);
  let pLo = materialize4(p.lo, threadSlot);
  let crossAndLo = pLo + (a.hi * b.lo + a.lo * b.hi);
  let rawHi = materialize4(p.hi, threadSlot);
  return fastTwoSum4Protected(rawHi, crossAndLo, threadSlot);
}

// A DD4 with every lane set to d.
fn dd4Splat(d: DD) -> DD4 {
  return DD4(vec4<f32>(d.hi), vec4<f32>(d.lo));
}

// Lane i of a DD4 as a DD.
fn dd4Lane(v: DD4, i: u32) -> DD {
  return DD(v.hi[i], v.lo[i]);
}

// Four DDs as the lanes of a DD4.
fn dd4Of(a: DD, b: DD, c: DD, d: DD) -> DD4 {
  return DD4(vec4<f32>(a.hi, b.hi, c.hi, d.hi), vec4<f32>(a.lo, b.lo, c.lo, d.lo));
}

// v's four lanes summed, (x+z) + (y+w): two batched adds, four barriers.
fn dd4Sum(v: DD4, threadSlot: u32) -> DD {
  let z = vec4<f32>(0.0);
  let half = ddAdd4Protected(
    DD4(vec4<f32>(v.hi.xy, 0.0, 0.0), vec4<f32>(v.lo.xy, 0.0, 0.0)),
    DD4(vec4<f32>(v.hi.zw, 0.0, 0.0), vec4<f32>(v.lo.zw, 0.0, 0.0)),
    threadSlot,
  );
  let s = ddAdd4Protected(
    DD4(vec4<f32>(half.hi.x, z.yzw), vec4<f32>(half.lo.x, z.yzw)),
    DD4(vec4<f32>(half.hi.y, z.yzw), vec4<f32>(half.lo.y, z.yzw)),
    threadSlot,
  );
  return dd4Lane(s, 0u);
}
