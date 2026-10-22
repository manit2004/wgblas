// dsymv_tile (pass 1 of 2): y = alpha * A * x + beta * y, double-double
// (Dekker) f64 emulation of ssymv.wgsl — A n×n symmetric with only its lower
// (uplo=0) or upper (uplo=1) triangle stored; A and x are (hi, lo) f32 pairs.
//
// Same tiling as ssymv.wgsl: one workgroup per TILE×TILE tile of the stored
// triangle, read once with coalesced loads, applied as tile·x (to the tile's
// rows) and, off the diagonal, as tileᵀ·x (to its columns: the mirrored half
// A[j,i] = A[i,j]). So A is read once, half of n², and never through a
// strided column walk. Each contribution goes to its own partial slot —
// with p >= q the stored-block pair of a tile, slot q of block p's rows and
// slot p of block q's rows (only slot p when p == q) — and
// reduce_partials_f64.wgsl sums them and applies alpha/beta. Every
// (block, slot) pair is written exactly once, so the partials need no
// clearing.
//
// The protected ops carry a workgroupBarrier(), so every thread makes the
// same calls (threadSlot = local_invocation_index, 256 threads — the size
// of dekkerScratch): out-of-range and off-triangle elements are masked to 0,
// and the final 8-way row/column sums are a tree every thread steps through
// (ssymv.wgsl's `ty == 0` loop would be divergent), with only the writes
// conditional.

@group(0) @binding(0) var<storage, read>       AHi:       array<f32>;
@group(0) @binding(1) var<storage, read>       ALo:       array<f32>;
@group(0) @binding(2) var<storage, read>       xHi:       array<f32>;
@group(0) @binding(3) var<storage, read>       xLo:       array<f32>;
@group(0) @binding(4) var<storage, read_write> partialHi: array<f32>;
@group(0) @binding(5) var<storage, read_write> partialLo: array<f32>;

struct Params {
  n:         u32,
  lda:       u32,
  uplo:      u32,  // 0 = lower, 1 = upper
  numBlocks: u32,
  incx:      u32,
}

@group(0) @binding(6) var<uniform> params: Params;

const TILE: u32 = 32u;
const ROWS_PER_THREAD: u32 = 4u; // TILE / workgroup height (8)

var<workgroup> xr: array<DD, 32>;       // x over the tile's rows
var<workgroup> xc: array<DD, 32>;       // x over the tile's columns
var<workgroup> rowRed: array<DD, 1056>; // TILE x (TILE+1): per-element row products
// 64 groups of 8: groups 0..31 are row r's partials (4 columns each), groups
// 32..63 column c's partials (4 rows each); the tree sums each group to its
// first element.
var<workgroup> red: array<DD, 512>;

fn ddMask(a: DD, keep: bool) -> DD {
  return DD(select(0.0, a.hi, keep), select(0.0, a.lo, keep));
}

fn xAt(i: u32) -> DD {
  let n = params.n;
  let ix = min(i, n - 1u) * params.incx;
  return ddMask(DD(xHi[ix], xLo[ix]), i < n);
}

@compute @workgroup_size(32, 8)
fn dsymv_tile_main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(num_workgroups)         nwg: vec3u,
  @builtin(local_invocation_index) tid: u32,
  @builtin(local_invocation_id)    lid: vec3u,
) {
  // Only the stored triangle's tiles are dispatched: linear tile index t over
  // T(T+1)/2 tiles (laid out 2D to stay under the per-dimension limit) → the
  // block pair (p, q), q <= p, row by row: t = p(p+1)/2 + q.
  let t = wid.y * nwg.x + wid.x;
  if (t >= params.numBlocks * (params.numBlocks + 1u) / 2u) { return; } // whole workgroup: uniform
  var p = u32((sqrt(8.0 * f32(t) + 1.0) - 1.0) * 0.5);
  // f32 sqrt can land one off near a row boundary — correct it exactly.
  if (p * (p + 1u) / 2u > t) { p -= 1u; }
  if ((p + 1u) * (p + 2u) / 2u <= t) { p += 1u; }
  let q = t - p * (p + 1u) / 2u;

  let n = params.n;
  let lower = params.uplo == 0u;
  let diag = p == q;
  // Stored tile at block (p, q) for lower, (q, p) for upper.
  let rb = select(q, p, lower);
  let cb = select(p, q, lower);
  let r0 = rb * TILE;
  let c0 = cb * TILE;
  let tx = lid.x;
  let ty = lid.y;

  if (ty == 0u) { xr[tx] = xAt(r0 + tx); }
  if (ty == 1u) { xc[tx] = xAt(c0 + tx); }
  workgroupBarrier();

  // Each thread takes rows ty, ty+8, ty+16, ty+24 of column tx — 32 lanes per
  // row, so each warp reads one contiguous 128-byte segment per half. A
  // diagonal tile has only one triangle stored: a stored element feeds its
  // own row, a strictly-stored one also feeds its mirror (column) — the same
  // two sums as an off-diagonal tile, just masked.
  var colPart = DD(0.0, 0.0);
  let gc = c0 + tx;
  for (var k = 0u; k < ROWS_PER_THREAD; k++) {
    let r = ty + 8u * k;
    let gr = r0 + r;
    let ia = min(gr, n - 1u) * params.lda + min(gc, n - 1u);
    let a = ddMask(DD(AHi[ia], ALo[ia]), gr < n && gc < n);
    let stored = !diag || select(tx >= r, tx <= r, lower);
    let strict = !diag || select(tx > r, tx < r, lower);
    rowRed[r * (TILE + 1u) + tx] = ddMulProtected(ddMask(a, stored), xc[tx], tid);
    colPart = ddAddProtected(colPart, ddMulProtected(ddMask(a, strict), xr[r], tid), tid);
  }
  red[256u + tx * 8u + ty] = colPart;
  workgroupBarrier();

  // Row sums: 8 lanes per row each add 4 columns.
  let row = tid / 8u;
  let seg = tid % 8u;
  let base = row * (TILE + 1u) + seg * 4u;
  red[row * 8u + seg] = ddAddProtected(
    ddAddProtected(rowRed[base], rowRed[base + 1u], tid),
    ddAddProtected(rowRed[base + 2u], rowRed[base + 3u], tid),
    tid,
  );
  workgroupBarrier();

  // Tree over each group of 8: width 4, 2, 1 — 256, 128, then 64 live
  // pairs; idle threads add a throwaway pair and discard it.
  for (var w = 4u; w > 0u; w >>= 1u) {
    let live = tid < 64u * w;
    let g = min(tid / w, 63u);
    let i = g * 8u + tid % w;
    let s = ddAddProtected(red[i], red[i + w], tid);
    workgroupBarrier();
    if (live) { red[i] = s; }
    workgroupBarrier();
  }

  // Lanes tx of row ty == 0 write row tx's and column tx's sums.
  let rs = red[tx * 8u];
  let cs = red[(32u + tx) * 8u];
  let both = ddAddProtected(rs, cs, tid);
  if (ty == 0u) {
    if (diag) {
      // Both sums land on the same rows (and slot) for a diagonal tile.
      if (r0 + tx < n) {
        partialHi[p * n + r0 + tx] = both.hi;
        partialLo[p * n + r0 + tx] = both.lo;
      }
    } else {
      // tile · x → the tile's rows (block rb), slot cb
      if (r0 + tx < n) {
        partialHi[cb * n + r0 + tx] = rs.hi;
        partialLo[cb * n + r0 + tx] = rs.lo;
      }
      // tileᵀ · x → the tile's columns (block cb), slot rb
      if (c0 + tx < n) {
        partialHi[rb * n + c0 + tx] = cs.hi;
        partialLo[rb * n + c0 + tx] = cs.lo;
      }
    }
  }
}
