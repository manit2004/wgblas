// dtrsv_update: double-double (Dekker) f64 emulation of strsv_update.wgsl —
// subtracts a solved block's contribution from every remaining row in
// parallel (one workgroup per row, like dtrmv.wgsl). A, x, and the per-row
// accumulation are each split into an f32 (hi, lo) pair; WGSL has no f64
// type. No diag/masking needed: this region never touches the diagonal.
//
// The column range [blockStart, blockEnd) is the same fixed width for every
// row in a dispatch (not per-row-varying the way dtrmv's triangular range
// is), so the main/tail split is computed once, outside the row loop — same
// shape as dger.wgsl's column loop.

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> xLo: array<f32>;

struct Params {
  n:          u32,
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  uplo:       u32,  // 0 = lower, 1 = upper
  blockStart: u32,
  blockEnd:   u32,  // exclusive
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

@compute @workgroup_size(64)
fn dtrsv_update_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  // forward: remaining rows are [blockEnd,n); backward: [0,blockStart).
  // Uniform across the whole dispatch (derived from params only), so an
  // early return here is safe — never a partial-workgroup divergence.
  let forward = (params.trans == 0u) == (params.uplo == 0u);

  var rangeStart: u32;
  var rangeEnd: u32;
  if forward {
    rangeStart = params.blockEnd;
    rangeEnd = params.n;
  } else {
    rangeStart = 0u;
    rangeEnd = params.blockStart;
  }

  if (rangeStart >= rangeEnd) { return; }
  let count = rangeEnd - rangeStart;

  let colCount    = params.blockEnd - params.blockStart;
  let col_floor   = (colCount / WGS) * WGS;
  let mainIters   = col_floor / WGS;
  let hasTail     = select(0u, 1u, col_floor < colCount);

  for (var idx = wgid.x; idx < count; idx += nwg.x) {
    let i = rangeStart + idx;
    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let j = params.blockStart + lid.x + iter * WGS;
      let aidx = select(j * params.lda + i, i * params.lda + j, params.trans == 0u);
      let ix = j * params.incx;
      let prod = ddMulProtected(DD(AHi[aidx], ALo[aidx]), DD(xHi[ix], xLo[ix]), lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let j     = params.blockStart + col_floor + lid.x;
      let valid = j < params.blockEnd;
      let safeJ = select(params.blockStart, j, valid);
      let aidx  = select(safeJ * params.lda + i, i * params.lda + safeJ, params.trans == 0u);
      let ix    = safeJ * params.incx;
      let prod  = ddMulProtected(DD(AHi[aidx], ALo[aidx]), DD(xHi[ix], xLo[ix]), lid.x);
      let contribution = DD(select(0.0, prod.hi, valid), select(0.0, prod.lo, valid));
      acc = ddAddProtected(acc, contribution, lid.x);
    }

    tile[lid.x] = acc;
    workgroupBarrier();

    // Inactive threads combine against a throwaway partner and discard it
    // (ddAddProtected must be called unconditionally by every thread).
    for (var s = WGS / 2u; s > 0u; s >>= 1u) {
      let partner = select(lid.x, lid.x + s, lid.x < s);
      let combined = ddAddProtected(tile[lid.x], tile[partner], lid.x);
      workgroupBarrier(); // all threads must read tile[] above before any write below
      if (lid.x < s) { tile[lid.x] = combined; }
      workgroupBarrier();
    }

    let ix_i = i * params.incx;
    let xVal = DD(xHi[ix_i], xLo[ix_i]);
    // tile[0] now holds the full subtracted term, visible to every lane —
    // every thread redundantly finishes the O(1) subtraction so the
    // protected op below stays uniformly called (only the write is gated).
    let result = ddSubProtected(xVal, tile[0], lid.x);

    if (lid.x == 0u) {
      xHi[ix_i] = result.hi;
      xLo[ix_i] = result.lo;
    }
    // All 64 threads must agree before the next row (grid-stride) reuses tile[].
    workgroupBarrier();
  }
}
