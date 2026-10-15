// ssymv (pass 1 of 2): y = alpha * A * x + beta * y, A n×n symmetric with only
// its lower (uplo=0) or upper (uplo=1) triangle stored.
//
// Tiled over the stored triangle: one workgroup per TILE×TILE tile, read once
// with coalesced loads into registers, then applied twice — as tile·x (to the
// tile's rows) and, for off-diagonal tiles, as tileᵀ·x (to its columns: the
// mirrored half A[j,i] = A[i,j]). So A is read once, half of n², and never
// through a strided column walk. (The per-row kernel this replaced read all
// n² elements, the mirrored half lda-strided.)
//
// Several tiles feed the same rows, and WGSL has no f32 atomics, so each
// contribution goes to its own partial slot and reduce_partials.wgsl sums
// them and applies alpha/beta. With p >= q the stored-block pair of a tile:
// the tile adds slot q to block p's rows and slot p to block q's rows (one
// slot only, p, when p == q). Every (block, slot) pair is written exactly
// once, so `partial` needs no clearing.
//
// x must be unit-stride (ssymv.mjs packs a strided x first).

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> partial: array<f32>;

struct Params {
  n:         u32,
  lda:       u32,
  uplo:      u32,  // 0 = lower, 1 = upper
  numBlocks: u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const TILE: u32 = 32u;
const ROWS_PER_THREAD: u32 = 4u; // TILE / workgroup height (8)

var<workgroup> xr: array<f32, 32>;       // x over the tile's rows
var<workgroup> xc: array<f32, 32>;       // x over the tile's columns
var<workgroup> rowRed: array<f32, 1056>; // TILE x (TILE+1): per-element row products
var<workgroup> rowRed2: array<f32, 256>; // TILE x 8: row partials, 4 columns each
var<workgroup> colRed: array<f32, 256>;  // 8 x TILE: column partials, 4 rows each

@compute @workgroup_size(32, 8)
fn main(
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

  if (ty == 0u) { xr[tx] = select(0.0, x[min(r0 + tx, n - 1u)], r0 + tx < n); }
  if (ty == 1u) { xc[tx] = select(0.0, x[min(c0 + tx, n - 1u)], c0 + tx < n); }
  workgroupBarrier();

  // Each thread loads rows ty, ty+8, ty+16, ty+24 of column tx — 32 lanes per
  // row, so each warp reads one contiguous 128-byte row segment — and keeps
  // them in registers. A diagonal tile has only one triangle stored: a stored
  // element feeds its own row, a strictly-stored one also feeds its mirror
  // (column) — the same two sums as an off-diagonal tile, just masked.
  var colPart = 0.0f;
  for (var k = 0u; k < ROWS_PER_THREAD; k++) {
    let r = ty + 8u * k;
    let gr = r0 + r;
    let gc = c0 + tx;
    let a = select(0.0, A[min(gr, n - 1u) * params.lda + min(gc, n - 1u)], gr < n && gc < n);
    let stored = !diag || select(tx >= r, tx <= r, lower);
    let strict = !diag || select(tx > r, tx < r, lower);
    rowRed[r * (TILE + 1u) + tx] = select(0.0, a, stored) * xc[tx];
    colPart += select(0.0, a, strict) * xr[r];
  }
  colRed[ty * TILE + tx] = colPart;
  workgroupBarrier();

  // Row sums: 8 lanes per row each add 4 columns, then one lane adds the 8.
  let row = tid / 8u;
  let seg = tid % 8u;
  let base = row * (TILE + 1u) + seg * 4u;
  rowRed2[row * 8u + seg] = (rowRed[base] + rowRed[base + 1u]) + (rowRed[base + 2u] + rowRed[base + 3u]);
  workgroupBarrier();

  if (ty == 0u) {
    var rs = 0.0f;
    var cs = 0.0f;
    for (var k = 0u; k < 8u; k++) {
      rs += rowRed2[tx * 8u + k];
      cs += colRed[k * TILE + tx];
    }
    if (diag) {
      // Both sums land on the same rows (and slot) for a diagonal tile.
      if (r0 + tx < n) { partial[p * n + r0 + tx] = rs + cs; }
    } else {
      // tile · x → the tile's rows (block rb), slot cb
      if (r0 + tx < n) { partial[cb * n + r0 + tx] = rs; }
      // tileᵀ · x → the tile's columns (block cb), slot rb
      if (c0 + tx < n) { partial[rb * n + c0 + tx] = cs; }
    }
  }
}
