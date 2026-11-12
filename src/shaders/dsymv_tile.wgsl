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
// of dekkerScratch4): out-of-range and off-triangle elements are masked to
// 0, and every reduction step runs on every thread, with only the writes
// conditional. Each thread's four elements go through the batched ops
// (f64/utils/batch.wgsl), one barrier per four results — ~22 barriers a
// tile against ~46 with the scalar ops.

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
const LD: u32 = TILE + 1u;       // rowRed row stride (padded)

var<workgroup> xr: array<DD, 32>; // x over the tile's rows; reused for row sums
var<workgroup> xc: array<DD, 32>; // x over the tile's columns; reused for column sums
// TILE x (TILE+1): per-element row products, then (in place) the 8-way row
// and column partials — see partialIdx.
var<workgroup> rowRed: array<DD, 1056>;

fn ddMask(a: DD, keep: bool) -> DD {
  return DD(select(0.0, a.hi, keep), select(0.0, a.lo, keep));
}

fn xAt(i: u32) -> DD {
  let n = params.n;
  let ix = min(i, n - 1u) * params.incx;
  return ddMask(DD(xHi[ix], xLo[ix]), i < n);
}

struct Elem {
  stored: DD, // feeds its own row
  strict: DD, // also feeds its mirror (column)
}

// Tile element (r, tx), masked: out of range → 0; on a diagonal tile only the
// stored triangle is stored, only its strict part strict.
fn loadElem(r0: u32, c0: u32, r: u32, tx: u32, diag: bool, lower: bool) -> Elem {
  let n = params.n;
  let gr = r0 + r;
  let gc = c0 + tx;
  let ia = min(gr, n - 1u) * params.lda + min(gc, n - 1u);
  let a = ddMask(DD(AHi[ia], ALo[ia]), gr < n && gc < n);
  return Elem(
    ddMask(a, !diag || select(tx >= r, tx <= r, lower)),
    ddMask(a, !diag || select(tx > r, tx < r, lower)),
  );
}

// Thread t's row partial goes to the first of the four rowRed slots it summed,
// its column partial to the second — both read only by the tree.
fn partialIdx(t: u32) -> u32 {
  return (t / 8u) * LD + (t % 8u) * 4u;
}

// Partial s of group g: row g's segment s (g < 32), or column g-32's from
// row-group s, i.e. thread s*32 + (g-32).
fn groupPart(g: u32, s: u32) -> DD {
  let colIdx = partialIdx(s * 32u + max(g, 32u) - 32u) + 1u;
  return rowRed[select(colIdx, g * LD + s * 4u, g < 32u)];
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
  let e0 = loadElem(r0, c0, ty, tx, diag, lower);
  let e1 = loadElem(r0, c0, ty + 8u, tx, diag, lower);
  let e2 = loadElem(r0, c0, ty + 16u, tx, diag, lower);
  let e3 = loadElem(r0, c0, ty + 24u, tx, diag, lower);
  let rowProd = ddMul4Protected(dd4Of(e0.stored, e1.stored, e2.stored, e3.stored), dd4Splat(xc[tx]), tid); // tile · x
  let colProd = ddMul4Protected(
    dd4Of(e0.strict, e1.strict, e2.strict, e3.strict),
    dd4Of(xr[ty], xr[ty + 8u], xr[ty + 16u], xr[ty + 24u]),
    tid,
  ); // tileᵀ · x
  rowRed[ty * LD + tx] = dd4Lane(rowProd, 0u);
  rowRed[(ty + 8u) * LD + tx] = dd4Lane(rowProd, 1u);
  rowRed[(ty + 16u) * LD + tx] = dd4Lane(rowProd, 2u);
  rowRed[(ty + 24u) * LD + tx] = dd4Lane(rowProd, 3u);
  workgroupBarrier();

  // Row partials (8 lanes per row, 4 columns each) and this thread's column
  // partial (its 4 rows), summed side by side: [r0+r1, r2+r3, c0+c1, c2+c3],
  // then [row, col].
  let base = partialIdx(tid);
  let pairs = ddAdd4Protected(
    dd4Of(rowRed[base], rowRed[base + 2u], dd4Lane(colProd, 0u), dd4Lane(colProd, 2u)),
    dd4Of(rowRed[base + 1u], rowRed[base + 3u], dd4Lane(colProd, 1u), dd4Lane(colProd, 3u)),
    tid,
  );
  let zero = DD(0.0, 0.0);
  let parts = ddAdd4Protected(
    dd4Of(dd4Lane(pairs, 0u), dd4Lane(pairs, 2u), zero, zero),
    dd4Of(dd4Lane(pairs, 1u), dd4Lane(pairs, 3u), zero, zero),
    tid,
  );
  // Every rowRed read above came before the adds' barriers, so the slots
  // can be overwritten now.
  rowRed[base] = dd4Lane(parts, 0u);      // row tid/8, segment tid%8
  rowRed[base + 1u] = dd4Lane(parts, 1u); // column tx, rows ty+8k
  workgroupBarrier();

  // Threads 0..31 sum row tid's 8 partials, 32..63 column (tid-32)'s 8 (one
  // per ty, i.e. from thread ty*32 + column); the rest add a throwaway group.
  let g = min(tid, 63u);
  let l1 = ddAdd4Protected(
    dd4Of(groupPart(g, 0u), groupPart(g, 1u), groupPart(g, 2u), groupPart(g, 3u)),
    dd4Of(groupPart(g, 4u), groupPart(g, 5u), groupPart(g, 6u), groupPart(g, 7u)),
    tid,
  );
  let l2 = ddAdd4Protected(
    dd4Of(dd4Lane(l1, 0u), dd4Lane(l1, 1u), zero, zero),
    dd4Of(dd4Lane(l1, 2u), dd4Lane(l1, 3u), zero, zero),
    tid,
  );
  let l3 = ddAdd4Protected(
    dd4Of(dd4Lane(l2, 0u), zero, zero, zero),
    dd4Of(dd4Lane(l2, 1u), zero, zero, zero),
    tid,
  );
  // xr/xc were last read before the first multiply's barrier.
  if (tid < 32u) { xr[tid] = dd4Lane(l3, 0u); }
  else if (tid < 64u) { xc[tid - 32u] = dd4Lane(l3, 0u); }
  workgroupBarrier();

  // Lanes tx of row ty == 0 write row tx's and column tx's sums.
  let rs = xr[tx];
  let cs = xc[tx];
  let both = dd4Lane(ddAdd4Protected(dd4Splat(rs), dd4Splat(cs), tid), 0u);
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
