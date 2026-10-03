// dtrsv_invert_block: double-double (Dekker) f64 emulation of
// strsv_invert_block.wgsl — computes ONE column (workgroup_id.x) of ONE
// block's (workgroup_id.y) explicit inverse, via the same one-row-at-a-time
// substitution, solving against a unit basis vector e_col. A, Ainv, and the
// running accumulation are each split into an f32 (hi, lo) pair; WGSL has no
// f64 type.
//
// This is the first routine in the f64 port order to use ddDivProtected (the
// non-unit-diagonal division) — deliberately last per TODO.md, since
// division is where dnrm2 found real double-double edge-case bugs during
// the L1 port. The division only runs once per (column, step) — same
// barrier-uniformity requirement as every other protected op here — so
// every thread in the workgroup computes it redundantly from the
// already-shared `tile[0]` reduction result (same pattern dgemv_n uses for
// its O(1) alpha/beta combine after the per-row reduction), with only
// `lid.x==0` writing the result. `params.diag` is uniform across the whole
// dispatch (not per-thread), so branching on it to skip the division
// entirely for a unit diagonal is safe — unlike dtrmv.wgsl's per-element
// diag check, which varies per thread and needed select() instead.

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> AinvHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> AinvLo: array<f32>;

struct Params {
  n:     u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;
const BLOCK_SIZE: u32 = 64u;
var<workgroup> tile: array<DD, 64>;

fn readA(i: u32, j: u32) -> DD {
  let idx = select(j * params.lda + i, i * params.lda + j, params.trans == 0u);
  return DD(AHi[idx], ALo[idx]);
}

@compute @workgroup_size(64)
fn dtrsv_invert_block_main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
) {
  let col = wgid.x;
  let blockIndex = wgid.y;
  let blockStart = blockIndex * BLOCK_SIZE;
  var blockEnd = blockStart + BLOCK_SIZE;
  if (blockEnd > params.n) { blockEnd = params.n; }
  let blockLen = blockEnd - blockStart;

  if (col >= blockLen) { return; }

  let ainvBase = blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  let forward = (params.trans == 0u) == (params.uplo == 0u);

  if forward {
    for (var r = lid.x; r < col; r += WGS) {
      AinvHi[ainvBase + r * BLOCK_SIZE + col] = 0.0;
      AinvLo[ainvBase + r * BLOCK_SIZE + col] = 0.0;
    }
  } else {
    for (var r = col + 1u + lid.x; r < blockLen; r += WGS) {
      AinvHi[ainvBase + r * BLOCK_SIZE + col] = 0.0;
      AinvLo[ainvBase + r * BLOCK_SIZE + col] = 0.0;
    }
  }
  storageBarrier();
  workgroupBarrier();

  let numSteps = select(col + 1u, blockLen - col, forward);
  for (var step = 0u; step < numSteps; step++) {
    let localRow = select(col - step, col + step, forward);
    let i = blockStart + localRow;

    // Accumulation range over lj: [col, localRow) forward, [localRow+1, col+1) backward.
    // Range length varies per step, but every thread runs the SAME step at
    // the same time, so the main/tail split is already uniform for this
    // step — just not the same across different steps (see dsyr.wgsl).
    let ljStart = select(localRow + 1u, col, forward);
    let ljEnd   = select(col + 1u, localRow, forward);
    let rangeLen    = ljEnd - ljStart;
    let range_floor = ljStart + (rangeLen / WGS) * WGS;
    let mainIters   = (range_floor - ljStart) / WGS;
    let hasTail     = select(0u, 1u, range_floor < ljEnd);

    var acc = DD(0.0, 0.0);

    for (var iter = 0u; iter < mainIters; iter++) {
      let lj = ljStart + lid.x + iter * WGS;
      let aij = readA(i, blockStart + lj);
      let aidx = ainvBase + lj * BLOCK_SIZE + col;
      let ainv = DD(AinvHi[aidx], AinvLo[aidx]);
      let prod = ddMulProtected(aij, ainv, lid.x);
      acc = ddAddProtected(acc, prod, lid.x);
    }

    for (var iter = 0u; iter < hasTail; iter++) {
      let lj    = range_floor + lid.x;
      let valid = lj < ljEnd;
      let safeLj = select(ljStart, lj, valid); // ljStart is always in-range when rangeLen > 0, the only case hasTail can be 1
      let aij = readA(i, blockStart + safeLj);
      let aidx = ainvBase + safeLj * BLOCK_SIZE + col;
      let ainv = DD(AinvHi[aidx], AinvLo[aidx]);
      let prod = ddMulProtected(aij, ainv, lid.x);
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

    // tile[0] now holds the full accumulation, visible to every lane — every
    // thread redundantly finishes the O(1) rhs/division so the protected
    // ops below stay uniformly called (only the write is gated).
    let e = DD(select(0.0, 1.0, localRow == col), 0.0);
    let rhs = ddSubProtected(e, tile[0], lid.x);

    var val: DD;
    if params.diag == 1u {
      val = rhs;
    } else {
      val = ddDivProtected(rhs, readA(i, i), lid.x);
    }

    if (lid.x == 0u) {
      AinvHi[ainvBase + localRow * BLOCK_SIZE + col] = val.hi;
      AinvLo[ainvBase + localRow * BLOCK_SIZE + col] = val.lo;
    }
    storageBarrier();
    workgroupBarrier();
  }
}
