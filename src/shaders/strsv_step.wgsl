// strsv_step: one block of the blocked triangular solve, in a single
// dispatch — replaces the strsv_apply_inverse + strsv_update pair, halving
// the number of sequential dispatches the solve is limited by.
//
// The old apply pass solved the block (Ainv · x_block) in one workgroup and
// the update pass then read the solution back from x. Here every workgroup
// solves the block itself (a 64×64 matvec against the inverse from
// strsv_invert_block.wgsl), then subtracts its contribution from its own
// tile of TILE_ROWS remaining rows. The solution is written to `sol`, not x:
// other workgroups are still reading this block's unsolved values from x in
// the same dispatch. strsv.mjs copies sol into x after the last block.
//
// Workgroup 0 writes `sol`; when no rows remain (the last block) a single
// workgroup runs just the solve.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       Ainv: array<f32>;
@group(0) @binding(2) var<storage, read_write> x: array<f32>;
@group(0) @binding(3) var<storage, read_write> sol: array<f32>;

struct Params {
  incx:       u32,
  lda:        u32,
  trans:      u32,  // 0 = no-transpose, 1 = transpose
  blockIndex: u32,
  blockStart: u32,
  blockEnd:   u32,  // exclusive
  rangeStart: u32,  // first remaining row this block updates
  rowCount:   u32,  // number of remaining rows (0 for the last block)
}

@group(0) @binding(4) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const TILE_ROWS: u32 = 64u;   // remaining rows per workgroup (one per thread)
const COLS: u32 = 16u;        // no-transpose A tile is staged 16 columns at a time
const TILE_PITCH: u32 = 17u;  // COLS + 1: per-row reads stay bank-conflict-free

var<workgroup> xr: array<f32, 64>;     // this block's unsolved x
var<workgroup> xs: array<f32, 64>;     // this block's solution
var<workgroup> tileA: array<f32, 1088>; // TILE_ROWS × TILE_PITCH

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let t = lid.x;
  let blockLen = params.blockEnd - params.blockStart;

  xr[t] = select(0.0, x[min(params.blockStart + t, params.blockEnd - 1u) * params.incx], t < blockLen);
  workgroupBarrier();

  // Solve the block: xs = Ainv · xr. Ainv is staged 16 columns at a time
  // (coalesced, 16 independent loads per thread) rather than each thread
  // walking its own row — that was 64 serially dependent L2 round trips.
  // Rows/cols past blockLen are zero in Ainv (written so by
  // strsv_invert_block.wgsl) and in xr, so no masking is needed.
  let ainvBase = params.blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  var s = 0.0f;
  for (var cc = 0u; cc < BLOCK_SIZE; cc += COLS) {
    for (var e = 0u; e < COLS; e++) {
      let idx = e * TILE_ROWS + t;
      let r = idx / COLS;
      let c = idx % COLS;
      tileA[r * TILE_PITCH + c] = Ainv[ainvBase + r * BLOCK_SIZE + cc + c];
    }
    workgroupBarrier();
    for (var c = 0u; c < COLS; c++) {
      s += tileA[t * TILE_PITCH + c] * xr[cc + c];
    }
    workgroupBarrier();
  }
  xs[t] = s;
  if (wid.x == 0u && t < blockLen) { sol[params.blockStart + t] = s; }
  workgroupBarrier();

  // Update this workgroup's tile of remaining rows: x[i] -= op(A)[i, block] · xs.
  // rowCount is dispatch-uniform, so the barriers inside stay uniform.
  if (params.rowCount == 0u) { return; }
  let lastRow = params.rowCount - 1u;
  let local = wid.x * TILE_ROWS + t;
  let rowOK = local < params.rowCount;
  let i = params.rangeStart + min(local, lastRow);
  var acc = 0.0f;
  if (params.trans != 0u) {
    // A[j,i]: at each j the 64 lanes read 64 consecutive i — coalesced.
    // Eight independent accumulators so a thread has 8 loads in flight
    // instead of waiting out 64 global-memory latencies back to back.
    var a = array<f32, 8>(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
    let col = params.blockStart * params.lda + i;
    var j = 0u;
    while (j + 7u < blockLen) {
      for (var u = 0u; u < 8u; u++) {
        a[u] += A[col + (j + u) * params.lda] * xs[j + u];
      }
      j += 8u;
    }
    while (j < blockLen) {
      a[0] += A[col + j * params.lda] * xs[j];
      j += 1u;
    }
    acc = ((a[0] + a[1]) + (a[2] + a[3])) + ((a[4] + a[5]) + (a[6] + a[7]));
  } else {
    // A[i,j]: a lane's row is contiguous but lanes are lda apart, so stage
    // the tile through workgroup memory 16 columns at a time — each load
    // instruction then covers 4 rows × 16 contiguous columns.
    for (var cc = 0u; cc < BLOCK_SIZE; cc += COLS) {
      for (var e = 0u; e < COLS; e++) {
        let idx = e * TILE_ROWS + t;
        let r = idx / COLS;
        let c = idx % COLS;
        let tileLocal = wid.x * TILE_ROWS + r;
        let ok = tileLocal < params.rowCount && cc + c < blockLen;
        let gi = params.rangeStart + min(tileLocal, lastRow);
        let gj = params.blockStart + min(cc + c, blockLen - 1u);
        tileA[r * TILE_PITCH + c] = select(0.0, A[gi * params.lda + gj], ok);
      }
      workgroupBarrier();
      for (var c = 0u; c < COLS; c++) {
        acc += tileA[t * TILE_PITCH + c] * xs[cc + c];
      }
      workgroupBarrier();
    }
  }
  if (rowOK) { x[i * params.incx] -= acc; }
}
