// dtrsv_step: one block of the blocked triangular solve in a single
// dispatch, double-double (Dekker) f64 emulation of strsv_step.wgsl —
// replaces the dtrsv_apply_inverse + dtrsv_update pair, halving the number
// of sequential dispatches the solve is limited by.
//
// Every workgroup solves the block itself (a 64×64 matvec against the
// column-major inverse from dtrsv_small.wgsl's invert mode), then subtracts
// its contribution from its own tile of TILE_ROWS remaining rows. The
// solution goes to `sol`, not x: other workgroups are still reading this
// block's unsolved values from x in the same dispatch. dtrsv.mjs copies sol
// into x after the last block. Workgroup 0 writes `sol`; when no rows remain
// (the last block) a single workgroup runs just the solve. Presolved
// (few-block path): the block is already solved into sol by dtrsv_small.wgsl,
// and only the update runs.
//
// Four threads per row (256 per workgroup): each covers 16 of the block's 64
// columns in both the solve and the update, and the four partial sums meet
// in workgroup memory — a 16-term serial chain per thread instead of 64
// (dtrsv_apply_inverse) or a 64-lane tree per row (dtrsv_update). The
// protected ops carry a workgroupBarrier(), so every thread runs the same
// calls on clamped indices with masked terms; only writes are conditional.
// A thread's 16 loads are issued before its chain starts.

@group(0) @binding(0) var<storage, read>       AHi:    array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:    array<f32>;
@group(0) @binding(2) var<storage, read>       AinvHi: array<f32>;
@group(0) @binding(3) var<storage, read>       AinvLo: array<f32>;
@group(0) @binding(4) var<storage, read_write> xHi:    array<f32>;
@group(0) @binding(5) var<storage, read_write> xLo:    array<f32>;
@group(0) @binding(6) var<storage, read_write> solHi:  array<f32>;
@group(0) @binding(7) var<storage, read_write> solLo:  array<f32>;

struct Params {
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,  // exclusive
  rangeStart: u32,  // first remaining row this block updates
  rowCount:   u32,  // number of remaining rows (0 for the last block)
  presolved:  u32,  // 1 = block already solved into sol: update only
}

@group(0) @binding(8) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const TILE_ROWS: u32 = 64u;  // remaining rows per workgroup
const SPLIT: u32 = 4u;       // threads per row
const SPAN: u32 = BLOCK_SIZE / SPLIT; // columns per thread

var<workgroup> xr: array<DD, 64>;    // this block's unsolved x
var<workgroup> xs: array<DD, 64>;    // this block's solution
var<workgroup> part: array<DD, 256>; // partial sums, [quarter][row]

fn ddMask(a: DD, keep: bool) -> DD {
  return DD(select(0.0, a.hi, keep), select(0.0, a.lo, keep));
}

// xr[c] as row r's term of Ainv · xr, or 0 at the inverse's structural zeros
// (c > r for a lower-triangular inverse, c < r for upper): those must add
// exactly 0, where 0 · Inf or 0 · NaN from an Infinity or NaN in x would
// otherwise reach rows the true solve never touches.
fn solveTerm(r: u32, c: u32, lowerInv: bool) -> DD {
  return ddMask(xr[c], select(c >= r, c <= r, lowerInv));
}

// Row r's four quarter sums, every thread (the protected adds need it).
fn sumParts(r: u32, tid: u32) -> DD {
  return dd4Sum(
    dd4Of(part[r], part[BLOCK_SIZE + r], part[2u * BLOCK_SIZE + r], part[3u * BLOCK_SIZE + r]),
    tid,
  );
}

// ±0 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like `v == 0.0` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

@compute @workgroup_size(256)
fn dtrsv_step_main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockLen = params.blockEnd - params.blockStart;
  let lane = tid % BLOCK_SIZE;
  let laneOK = lane < blockLen;
  let laneIdx = params.blockStart + min(lane, blockLen - 1u);

  if (params.presolved == 1u) {
    // Uniform branch.
    if (tid < BLOCK_SIZE) {
      xs[tid] = ddMask(DD(solHi[laneIdx], solLo[laneIdx]), laneOK);
    }
    workgroupBarrier();
  } else {
    if (tid < BLOCK_SIZE) {
      let ix = laneIdx * params.incx;
      xr[tid] = ddMask(DD(xHi[ix], xLo[ix]), laneOK);
    }
    workgroupBarrier();

    // Solve the block: xs = Ainv · xr. Thread (r, q) sums columns
    // [q·16, q·16+16) of row r. Ainv is column-major, so at each column the
    // lanes (consecutive r) read consecutive floats. Rows/cols past blockLen
    // are zero in Ainv (never written; buffers start zeroed) and in xr.
    let r = lane;
    let q = tid / BLOCK_SIZE;
    let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE + r;
    var av: array<DD, SPAN>;
    for (var u = 0u; u < SPAN; u++) {
      let ia = ainvBase + (q * SPAN + u) * BLOCK_SIZE;
      av[u] = DD(AinvHi[ia], AinvLo[ia]);
    }
    let xb = q * SPAN;
    // Forward solves update the rows after the block, so their inverse is
    // lower triangular; backward ones (rangeStart = 0) upper.
    let lowerInv = params.rangeStart == params.blockEnd;
    var acc = ddMul4Protected(dd4Of(av[0], av[1], av[2], av[3]), dd4Of(solveTerm(r, xb, lowerInv), solveTerm(r, xb + 1u, lowerInv), solveTerm(r, xb + 2u, lowerInv), solveTerm(r, xb + 3u, lowerInv)), tid);
    acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[4], av[5], av[6], av[7]), dd4Of(solveTerm(r, xb + 4u, lowerInv), solveTerm(r, xb + 5u, lowerInv), solveTerm(r, xb + 6u, lowerInv), solveTerm(r, xb + 7u, lowerInv)), tid), tid);
    acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[8], av[9], av[10], av[11]), dd4Of(solveTerm(r, xb + 8u, lowerInv), solveTerm(r, xb + 9u, lowerInv), solveTerm(r, xb + 10u, lowerInv), solveTerm(r, xb + 11u, lowerInv)), tid), tid);
    acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[12], av[13], av[14], av[15]), dd4Of(solveTerm(r, xb + 12u, lowerInv), solveTerm(r, xb + 13u, lowerInv), solveTerm(r, xb + 14u, lowerInv), solveTerm(r, xb + 15u, lowerInv)), tid), tid);
    part[q * BLOCK_SIZE + r] = dd4Sum(acc, tid);
    workgroupBarrier();
    let v = sumParts(lane, tid);
    if (tid < BLOCK_SIZE) {
      xs[tid] = v;
      if (wid.x == 0u && laneOK) {
        solHi[params.blockStart + tid] = v.hi;
        solLo[params.blockStart + tid] = v.lo;
      }
    }
    workgroupBarrier();
  }

  // Update this workgroup's tile of remaining rows: x[i] -= op(A)[i, block] · xs.
  // rowCount is dispatch-uniform, so the barriers below stay uniform.
  if (params.rowCount == 0u) { return; }
  let lastRow = params.rowCount - 1u;
  var av: array<DD, SPAN>;
  var q: u32;
  var r: u32;
  if (params.trans != 0u) {
    // A[j,i]: rows fastest across lanes, so at each j consecutive lanes read
    // consecutive i — coalesced.
    r = tid % TILE_ROWS;
    q = tid / TILE_ROWS;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let col = params.blockStart * params.lda + i;
    for (var u = 0u; u < SPAN; u++) {
      let j = q * SPAN + u;
      let ia = col + min(j, blockLen - 1u) * params.lda;
      // Reference BLAS (and stdlib) skips the column of a solved unknown that
      // is 0 in this transposed form, so 0 · Infinity or 0 · NaN never
      // happens: A is zeroed where xs is, making the term 0 · 0.
      let xj = xs[min(j, BLOCK_SIZE - 1u)];
      av[u] = ddMask(DD(AHi[ia], ALo[ia]), j < blockLen && !(isZeroBits(xj.hi) && isZeroBits(xj.lo)));
    }
  } else {
    // A[i,j]: quarters fastest across lanes, interleaved — lane q takes
    // columns q, q+4, q+8, … — so at each step a row's four lanes read 16
    // contiguous bytes per half.
    r = tid / SPLIT;
    q = tid % SPLIT;
    let i = params.rangeStart + min(wid.x * TILE_ROWS + r, lastRow);
    let rowBase = i * params.lda + params.blockStart;
    for (var u = 0u; u < SPAN; u++) {
      let j = q + u * SPLIT;
      let ia = rowBase + min(j, blockLen - 1u);
      av[u] = ddMask(DD(AHi[ia], ALo[ia]), j < blockLen);
    }
  }
  // xs index of term u: q + 4u (interleaved) or q·16 + u (blocked).
  let tr = params.trans != 0u;
  let x0 = select(q, q * SPAN, tr);
  let xd = select(SPLIT, 1u, tr);
  var acc = ddMul4Protected(dd4Of(av[0], av[1], av[2], av[3]), dd4Of(xs[x0], xs[x0 + xd], xs[x0 + 2u * xd], xs[x0 + 3u * xd]), tid);
  acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[4], av[5], av[6], av[7]), dd4Of(xs[x0 + 4u * xd], xs[x0 + 5u * xd], xs[x0 + 6u * xd], xs[x0 + 7u * xd]), tid), tid);
  acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[8], av[9], av[10], av[11]), dd4Of(xs[x0 + 8u * xd], xs[x0 + 9u * xd], xs[x0 + 10u * xd], xs[x0 + 11u * xd]), tid), tid);
  acc = ddAdd4Protected(acc, ddMul4Protected(dd4Of(av[12], av[13], av[14], av[15]), dd4Of(xs[x0 + 12u * xd], xs[x0 + 13u * xd], xs[x0 + 14u * xd], xs[x0 + 15u * xd]), tid), tid);
  part[q * TILE_ROWS + r] = dd4Sum(acc, tid);
  workgroupBarrier();

  let local = wid.x * TILE_ROWS + lane;
  let ix = (params.rangeStart + min(local, lastRow)) * params.incx;
  let updated = ddSubProtected(DD(xHi[ix], xLo[ix]), sumParts(lane, tid), tid);
  if (tid < TILE_ROWS && local < params.rowCount) {
    xHi[ix] = updated.hi;
    xLo[ix] = updated.lo;
  }
}
