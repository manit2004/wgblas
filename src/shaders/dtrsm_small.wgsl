// dtrsm_small: substitution over one diagonal block of the triangular solve,
// many right-hand sides, double-double (Dekker) f64 — the f64 counterpart of
// strsm_small.wgsl. dtrsm's whole solve when the order fits one block
// (n <= 64), and each diagonal block of its blocked solve, in place on B
// through a strided view; optionally it leaves a packed copy of the block's
// solution in X for the trailing update (dtrsm.mjs), which can't read B
// while it writes it. Plain substitution, no explicit inverse, as in
// strsm_small.wgsl.
//
// An effectively-upper block is reversed into a lower one first (J·U·J, as
// in strsv_invert_block.wgsl), so the loop always runs forward.
//
// Thread (i, r) owns row i of right-hand side r: RHS_PER_WG right-hand sides
// per workgroup, as many workgroups as it takes. Step j, as in
// dtrsv_small.wgsl's solve mode: every thread forms b_i / L_ii (as b_i times
// the reciprocal it computed up front), row j's owner publishes it as x_j,
// and every row below folds it in, b_i -= L_ij·x_j. The protected ops carry
// a workgroupBarrier(), so every thread makes the same calls and selects —
// only the stores are conditional.
//
// A and B are addressed through strided views in the solve frame (element
// (i, j) at off + i*rs + j*cs), so either layout and either side need no
// gather or scatter.

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> BHi: array<f32>;
@group(0) @binding(3) var<storage, read_write> BLo: array<f32>;
// Packed copy of the solution (row i of the block at i * xLd + rhs), for the
// blocked solve's trailing update. Unused when xLd = 0.
@group(0) @binding(4) var<storage, read_write> XHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> XLo: array<f32>;

struct Params {
  n:        u32, // the block's order, <= BLOCK_SIZE
  nrhs:     u32,
  aOff:     u32, // op(A) element (i, j) of the block at aOff + i*aRs + j*aCs
  aRs:      u32,
  aCs:      u32,
  bOff:     u32, // B element (i, rhs) of the block at bOff + i*bRs + rhs*bCs
  bRs:      u32,
  bCs:      u32,
  backward: u32, // 1 = effectively upper: solve on the reversed system
  unit:     u32, // 1 = unit diagonal (not read)
  alphaHi:  f32, // applied as B is read in (alpha = 0 never reaches here)
  alphaLo:  f32,
  xLd:      u32, // 0 = no packed copy
}

@group(0) @binding(6) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const RHS_PER_WG: u32 = 4u;

var<workgroup> published: array<DD, 4>; // x_j per right-hand side

fn ddSelect(a: DD, b: DD, cond: bool) -> DD {
  return DD(select(a.hi, b.hi, cond), select(a.lo, b.lo, cond));
}

fn loadA(idx: u32) -> DD {
  return DD(AHi[idx], ALo[idx]);
}

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let len = params.n;
  let back = params.backward == 1u;

  let i = tid % BLOCK_SIZE;
  let r = tid / BLOCK_SIZE;
  let rhs = wid.x * RHS_PER_WG + r;
  let live = i < len && rhs < params.nrhs;
  let li = min(i, len - 1u);
  let oi = select(li, len - 1u - li, back); // frame row -> block row
  let rowBase = params.aOff + oi * params.aRs;
  let bIdx = params.bOff + oi * params.bRs + min(rhs, params.nrhs - 1u) * params.bCs;

  let one = DD(1.0, 0.0);
  let rinv = ddDivProtected(one, ddSelect(loadA(rowBase + oi * params.aCs), one, params.unit == 1u), tid);

  var bRead = DD(0.0, 0.0);
  if (live) { bRead = DD(BHi[bIdx], BLo[bIdx]); }
  // Every thread multiplies (the protected op's barrier needs them all);
  // threads with no element multiply 0.
  var b = ddMulProtected(DD(params.alphaHi, params.alphaLo), bRead, tid);
  var xi = DD(0.0, 0.0);

  // L_ij for the next step is loaded at the end of this one, after `a`'s last
  // use, not a step ahead at the top — the form D3D12's WARP ran wrongly
  // under DXC (see dtrsv_small.wgsl).
  var aCur = loadA(rowBase + select(0u, len - 1u, back) * params.aCs);
  for (var j = 0u; j < len; j++) {
    let a = aCur;
    let cand = ddMulProtected(b, rinv, tid);
    if (i == j) {
      published[r] = cand;
      xi = cand;
    }
    workgroupBarrier();
    // The next write to published[r] comes after the barriers in the ops
    // below, so every thread has read this one by then.
    let xj = published[r];
    // a is L_ij only below the diagonal (above it, the unstored triangle —
    // possibly anything, even NaN); select() keeps it out of b.
    let nb = ddSubProtected(b, ddMulProtected(a, xj, tid), tid);
    b = ddSelect(b, nb, i > j);
    let jn = min(j + 1u, len - 1u); // the last step reloads its own; unused
    aCur = loadA(rowBase + select(jn, len - 1u - jn, back) * params.aCs);
  }

  if (live) {
    BHi[bIdx] = xi.hi;
    BLo[bIdx] = xi.lo;
    if (params.xLd != 0u) {
      let xIdx = oi * params.xLd + rhs;
      XHi[xIdx] = xi.hi;
      XLo[xIdx] = xi.lo;
    }
  }
}
