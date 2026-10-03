// dtrsv_apply_inverse: double-double (Dekker) f64 emulation of
// strsv_apply_inverse.wgsl — given a precomputed block inverse (from
// dtrsv_invert_block.wgsl), computes this block's solution as a dense
// matrix-vector multiply against the block's current remainder in x.
// Ainv, x, and the per-row accumulation are each split into an f32 (hi, lo)
// pair; WGSL has no f64 type.
//
// Unlike dsymv/dtrmv's per-row reduction across 64 threads, each thread here
// owns one whole row's dot product independently (blockLen <= WGS, so one
// thread per row already covers it, no tree reduction needed) — same shape
// as dgemv_t.wgsl's per-thread accumulation. The f32 original early-returns
// threads with `lid.x >= blockLen` (the last, possibly-short block); DD
// can't do that, since every thread must call ddMulProtected/ddAddProtected
// the same number of times. Instead every thread runs the identical
// `blockLen`-iteration loop (reading past-blockLen rows of Ainv, which the
// zero-initialized, never-written buffer backing them makes safe garbage —
// see dgemv_t.wgsl's clamped-dummy-index technique) and only the final
// write is gated.

@group(0) @binding(0) var<storage, read>       AinvHi: array<f32>;
@group(0) @binding(1) var<storage, read>       AinvLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> xLo: array<f32>;

struct Params {
  incx:       u32,
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,
}

@group(0) @binding(4) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
var<workgroup> xLocal: array<DD, 64>;

@compute @workgroup_size(64)
fn dtrsv_apply_inverse_main(@builtin(local_invocation_id) lid: vec3u) {
  let blockLen = params.blockEnd - params.blockStart;

  if (lid.x < blockLen) {
    let ix = (params.blockStart + lid.x) * params.incx;
    xLocal[lid.x] = DD(xHi[ix], xLo[ix]);
  }
  workgroupBarrier();

  let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  var acc = DD(0.0, 0.0);
  for (var j = 0u; j < blockLen; j++) {
    let aidx = ainvBase + lid.x * BLOCK_SIZE + j;
    let prod = ddMulProtected(DD(AinvHi[aidx], AinvLo[aidx]), xLocal[j], lid.x);
    acc = ddAddProtected(acc, prod, lid.x);
  }

  if (lid.x < blockLen) {
    let ix = (params.blockStart + lid.x) * params.incx;
    xHi[ix] = acc.hi;
    xLo[ix] = acc.lo;
  }
}
