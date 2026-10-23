// dtrsv_small: substitution over one 64-row diagonal block, double-double
// (Dekker) f64 — the f64 counterpart of strsm_small.wgsl as strsv uses it.
// Two modes, picked by the uniform `invert` param:
//   solve  (invert = 0): one block of the system, in place on x through a
//          strided view (dtrsv's whole solve when n <= 64, and each diagonal
//          block of the few-block path), optionally leaving a packed copy of
//          the solution in X for the presolved dtrsv_step update.
//   invert (invert = 1): every block's explicit inverse at once (dispatch
//          y = numBlocks), solving op(A_block)·X = I four columns per
//          workgroup, written COLUMN-major (inv[r][c] at c*64 + r) for
//          dtrsv_step.wgsl's coalesced matvec. Rows above a column's
//          diagonal are structural zeros, so a workgroup's steps start at
//          its first column — and every row is written, zeros included.
// An effectively-upper block is reversed into a lower one first (J·U·J, as
// in strsv_invert_block.wgsl), so the loop always runs forward.
//
// Thread (i, r) owns row i of right-hand side r. Step j: every thread forms
// b_i / L_ii (as b_i times the reciprocal it computed up front), row j's
// owner publishes it as x_j, and every row below folds it in,
// b_i -= L_ij·x_j. The protected ops carry a workgroupBarrier(), so every
// thread makes the same calls and selects — strsm_small.wgsl's 4×4 chunking
// would add protected ops, not save barriers. Each step's L_ij load is
// issued a step ahead, off the dependency chain. (The per-column inversion
// this replaced ran a 64-lane tree reduction plus a division per step:
// ~38 barriers per step against ~9 here.)

@group(0) @binding(0) var<storage, read>       AHi: array<f32>;
@group(0) @binding(1) var<storage, read>       ALo: array<f32>;
@group(0) @binding(2) var<storage, read_write> BHi: array<f32>; // x (solve) or Ainv (invert)
@group(0) @binding(3) var<storage, read_write> BLo: array<f32>;
// Packed copy of the solution (row i at i), solve mode with xLd = 1: the
// presolved dtrsv_step reads the block's solution from there, contiguous —
// where the inverse path's step leaves it too. Unused when inverting.
@group(0) @binding(4) var<storage, read_write> XHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> XLo: array<f32>;

struct Params {
  n:        u32, // solve: the block's order (<= BLOCK_SIZE); invert: the full order
  aOff:     u32, // solve: the block's A offset (invert derives it per block)
  aRs:      u32, // op(A) element (i, j) at off + i*aRs + j*aCs
  aCs:      u32,
  bOff:     u32, // solve: x's view
  bInc:     u32,
  backward: u32, // 1 = effectively upper: solve on the reversed system
  unit:     u32, // 1 = unit diagonal (not read)
  invert:   u32,
  xLd:      u32, // solve: 1 = also write the packed copy to X
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
fn dtrsv_small_main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let inv = params.invert == 1u;
  let blockStart = wid.y * BLOCK_SIZE;
  let len = select(params.n, min(BLOCK_SIZE, params.n - blockStart), inv);
  // Invert: this workgroup's columns are [c0, c0+4); past the block it has
  // none. Uniform (workgroup id + params), so the barriers below stay legal.
  let c0 = wid.x * RHS_PER_WG;
  if (inv && c0 >= len) { return; }
  let aBase = select(params.aOff, blockStart * (params.aRs + params.aCs), inv);
  let back = params.backward == 1u;

  let i = tid % BLOCK_SIZE;
  let r = tid / BLOCK_SIZE;
  let rhs = c0 + r; // invert: this thread's column of the frame
  let live = i < len && select(r == 0u, rhs < len, inv);
  let li = min(i, len - 1u);
  let oi = select(li, len - 1u - li, back); // frame row -> block row
  let rowBase = aBase + oi * params.aRs;

  let one = DD(1.0, 0.0);
  let rinv = ddDivProtected(one, ddSelect(loadA(rowBase + oi * params.aCs), one, params.unit == 1u), tid);

  var b = DD(0.0, 0.0);
  if (inv) {
    b = ddSelect(b, one, i == rhs);
  } else if (live) {
    let bi = params.bOff + oi * params.bInc;
    b = DD(BHi[bi], BLo[bi]);
  }
  var xi = DD(0.0, 0.0); // rows above jStart are structural zeros

  let jStart = select(0u, c0, inv);
  var aNext = loadA(rowBase + select(jStart, len - 1u - jStart, back) * params.aCs);
  for (var j = jStart; j < len; j++) {
    let a = aNext;
    let jn = min(j + 1u, len - 1u);
    aNext = loadA(rowBase + select(jn, len - 1u - jn, back) * params.aCs);

    let cand = ddMulProtected(b, rinv, tid);
    if (i == j) {
      published[r] = cand;
      xi = cand;
    }
    workgroupBarrier();
    // The next write to published[r] comes after the barriers in the ops below,
    // so every thread has read this one by then.
    let xj = published[r];
    // a is L_ij only below the diagonal (above it, the unstored triangle —
    // possibly anything, even NaN); select() keeps it out of b.
    let nb = ddSubProtected(b, ddMulProtected(a, xj, tid), tid);
    b = ddSelect(b, nb, i > j);
  }

  if (live) {
    if (inv) {
      let oc = select(rhs, len - 1u - rhs, back);
      let idx = wid.y * BLOCK_SIZE * BLOCK_SIZE + oc * BLOCK_SIZE + oi;
      BHi[idx] = xi.hi;
      BLo[idx] = xi.lo;
    } else {
      let bi = params.bOff + oi * params.bInc;
      BHi[bi] = xi.hi;
      BLo[bi] = xi.lo;
      if (params.xLd != 0u) {
        XHi[oi] = xi.hi;
        XLo[oi] = xi.lo;
      }
    }
  }
}
