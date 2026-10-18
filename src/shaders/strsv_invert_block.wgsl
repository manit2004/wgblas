// strsv_invert_block: computes the explicit inverse of every BLOCK_SIZE ×
// BLOCK_SIZE diagonal block of op(A), one workgroup per block (dispatch
// x = numBlocks), writing each to a dense COLUMN-major scratch region of
// Ainv (inv[r][c] at c*64 + r) — strsv_step.wgsl's matvec then reads each
// column coalesced across its lanes.
// Shared by strsv and strsm.
//
// Blocked inversion inside the workgroup, LAPACK trtri-style. The block is
// staged once into workgroup memory as a LOWER triangle L (an effectively-
// upper block U is reversed into one: J·U·J is lower and inv(U) = J·inv(L)·J),
// then:
//   1. the four 16×16 diagonal sub-blocks are inverted by column
//      substitution, one thread per column — serial chains of ≤ 16 rows;
//   2. the off-diagonal sub-blocks follow by distance d from the diagonal,
//      all blocks at one distance in parallel:
//        inv(L)_ij = -inv(L)_ii · Σ_{k=j}^{i-1} L_ik · inv(L)_kj.
// (The version this replaced had each thread solve a whole 64-row column
// serially — ~2000 dependent FMAs per thread, ~85 µs even for one block.)
//
// Workgroup memory holds exactly one 64×64 block (16 KB, the WebGPU default
// limit), so inv(L) is built in place: its strict lower part goes into the
// unused upper half of `blk`, transposed (inv(L)[r][c] at blk(c, r)), and
// its diagonal overwrites L's once step 1 no longer needs it. Indices are
// XOR-swizzled (see `at`) so both row and column walks are conflict-free.
//
// Every row of a column is written, the structural zeros as literal 0 —
// strsv_step.wgsl's and strsm's dense matvecs depend on that.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> Ainv: array<f32>;

struct Params {
  n:     u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(2) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const SUB: u32 = 16u;          // diagonal sub-block size
const NUM_THREADS: u32 = 256u;
var<workgroup> blk: array<f32, 4096>;

// Element (r, c) of the 64×64 block. Column c is XOR-swizzled by the row so
// a warp walking down a column hits 32 distinct banks, not one.
fn at(r: u32, c: u32) -> u32 {
  return r * BLOCK_SIZE + (c ^ (r & 31u));
}

// inv(L)[r][c] for r >= c, from where it's built in place.
fn linv(r: u32, c: u32) -> f32 {
  return select(blk[at(c, r)], blk[at(r, r)], r == c);
}

// Σ_{k in [k0,k1)} blk(r1, k) · blk(r2, k) — two row walks. Four independent
// accumulators so the workgroup-memory loads overlap instead of forming one
// serial latency chain (every dot here sits on a dependency chain).
fn rowRowDot(r1: u32, r2: u32, k0: u32, k1: u32) -> f32 {
  var a0 = 0.0f;
  var a1 = 0.0f;
  var a2 = 0.0f;
  var a3 = 0.0f;
  var k = k0;
  while (k + 3u < k1) {
    a0 += blk[at(r1, k)]      * blk[at(r2, k)];
    a1 += blk[at(r1, k + 1u)] * blk[at(r2, k + 1u)];
    a2 += blk[at(r1, k + 2u)] * blk[at(r2, k + 2u)];
    a3 += blk[at(r1, k + 3u)] * blk[at(r2, k + 3u)];
    k += 4u;
  }
  while (k < k1) {
    a0 += blk[at(r1, k)] * blk[at(r2, k)];
    k += 1u;
  }
  return (a0 + a1) + (a2 + a3);
}

// Σ_{k in [k0,k1)} blk(k, c) · blk(r, k) — a column walk against a row walk.
fn colRowDot(c: u32, r: u32, k0: u32, k1: u32) -> f32 {
  var a0 = 0.0f;
  var a1 = 0.0f;
  var a2 = 0.0f;
  var a3 = 0.0f;
  var k = k0;
  while (k + 3u < k1) {
    a0 += blk[at(k, c)]      * blk[at(r, k)];
    a1 += blk[at(k + 1u, c)] * blk[at(r, k + 1u)];
    a2 += blk[at(k + 2u, c)] * blk[at(r, k + 2u)];
    a3 += blk[at(k + 3u, c)] * blk[at(r, k + 3u)];
    k += 4u;
  }
  while (k < k1) {
    a0 += blk[at(k, c)] * blk[at(r, k)];
    k += 1u;
  }
  return (a0 + a1) + (a2 + a3);
}

@compute @workgroup_size(256)
fn strsv_invert_block_main(
  @builtin(workgroup_id)          wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockIndex = wid.x;
  let blockStart = blockIndex * BLOCK_SIZE;
  let blockLen = min(blockStart + BLOCK_SIZE, params.n) - blockStart;
  let forward = (params.trans == 0u) == (params.uplo == 0u);
  let unit = params.diag == 1u;
  // Sub-blocks a partial last block actually touches — the rest is padding
  // nothing reads. Uniform (workgroup id + params), so barriers stay legal.
  let numSub = (blockLen + SUB - 1u) / SUB;

  // Stage op(A_block) as L. Reads walk stored rows (coalesced); transpose
  // and reversal are applied on the workgroup-memory side. Rows/cols past a
  // partial block stay zero with a unit diagonal, keeping L invertible —
  // they only ever feed padding entries, which are never written out.
  // All 16 of a thread's loads are issued before any store, so they overlap
  // instead of each waiting out a full global-memory round trip.
  const PER_THREAD: u32 = BLOCK_SIZE * BLOCK_SIZE / NUM_THREADS; // 16
  var vals: array<f32, PER_THREAD>;
  for (var u = 0u; u < PER_THREAD; u++) {
    let e = tid + u * NUM_THREADS;
    let sr = min(e / BLOCK_SIZE, blockLen - 1u);
    let sc = min(e % BLOCK_SIZE, blockLen - 1u);
    vals[u] = A[(blockStart + sr) * params.lda + blockStart + sc];
  }
  for (var u = 0u; u < PER_THREAD; u++) {
    let e = tid + u * NUM_THREADS;
    let sr = e / BLOCK_SIZE;
    let sc = e % BLOCK_SIZE;
    if (sr < blockLen && sc < blockLen) {
      let R = select(sr, sc, params.trans != 0u);
      let C = select(sc, sr, params.trans != 0u);
      let r = select(blockLen - 1u - R, R, forward);
      let c = select(blockLen - 1u - C, C, forward);
      // The diagonal is stored as its reciprocal: that is inv(L)'s diagonal
      // outright, and step 1 multiplies by it instead of dividing.
      let v = vals[u];
      blk[at(r, c)] = select(v, select(1.0 / v, 1.0, unit), r == c);
    }
  }
  if (tid >= blockLen && tid < BLOCK_SIZE) { blk[at(tid, tid)] = 1.0; }
  workgroupBarrier();

  // 1) Diagonal sub-blocks, one thread per column (global column gc, its
  // sub-block starting at o). x_r for r > c goes to its in-place slot
  // blk(gc, gr) — strictly upper, which nothing else reads during this step
  // — and is read back from there; the diagonal (1/L_cc) is already final.
  if (tid < numSub * SUB) {
    let gc = tid;
    let o = (tid / SUB) * SUB;
    let dinv = blk[at(gc, gc)];
    for (var gr = gc + 1u; gr < o + SUB; gr++) {
      let s = -blk[at(gr, gc)] * dinv - rowRowDot(gr, gc, gc + 1u, gr);
      blk[at(gc, gr)] = s * blk[at(gr, gr)];
    }
  }
  workgroupBarrier();

  // 2) Off-diagonal sub-blocks (i, j = i - d), one distance at a time.
  // Thread e owns element (q, c) of block j: q fastest, so a warp walks
  // L's rows and the in-place slots down columns (conflict-free via `at`).
  for (var d = 1u; d < numSub; d++) {
    let total = (numSub - d) * SUB * SUB;

    // T := Σ_g L[row][g] · inv(L)[g][col] over the already-known blocks
    // (g from col, where inv(L)'s column starts, to block i's first row),
    // parked in inv(L)_ij's own slot until the next phase consumes it.
    for (var e = tid; e < total; e += NUM_THREADS) {
      let j = e / (SUB * SUB);
      let i = j + d;
      let row = i * SUB + e % SUB;
      let col = j * SUB + (e / SUB) % SUB;
      // g = col is inv(L)'s diagonal; past it, inv(L)[g][col] is the row
      // walk blk(col, g).
      blk[at(col, row)] = blk[at(row, col)] * blk[at(col, col)]
        + rowRowDot(row, col, col + 1u, i * SUB);
    }
    workgroupBarrier();

    // inv(L)_ij := -inv(L)_ii · T — every thread reads all it needs, then a
    // barrier, then the writes (they overwrite T in place).
    var acc: array<f32, 3>; // total <= 3 * NUM_THREADS
    for (var n = 0u; n < 3u; n++) {
      let e = tid + n * NUM_THREADS;
      if (e < total) {
        let i = e / (SUB * SUB) + d;
        let q = e % SUB;
        let col = (e / (SUB * SUB)) * SUB + (e / SUB) % SUB;
        // inv(L)_ii[q][p] for p < q is blk(i·16+p, i·16+q) — a column walk;
        // p = q is the diagonal. T[p] is the row walk blk(col, i·16+p).
        let iq = i * SUB + q;
        acc[n] = -(blk[at(iq, iq)] * blk[at(col, iq)]
          + colRowDot(iq, col, i * SUB, iq));
      }
    }
    workgroupBarrier();
    for (var n = 0u; n < 3u; n++) {
      let e = tid + n * NUM_THREADS;
      if (e < total) {
        let i = e / (SUB * SUB) + d;
        let col = (e / (SUB * SUB)) * SUB + (e / SUB) % SUB;
        blk[at(col, i * SUB + e % SUB)] = acc[n];
      }
    }
    workgroupBarrier();
  }

  // Write the block's inverse out column-major (coalesced along R), undoing
  // the reversal for an effectively-upper block; structural zeros included.
  let base = blockIndex * BLOCK_SIZE * BLOCK_SIZE;
  for (var e = tid; e < BLOCK_SIZE * BLOCK_SIZE; e += NUM_THREADS) {
    let R = e % BLOCK_SIZE;
    let C = e / BLOCK_SIZE;
    if (R < blockLen && C < blockLen) {
      let r = select(blockLen - 1u - R, R, forward);
      let c = select(blockLen - 1u - C, C, forward);
      Ainv[base + C * BLOCK_SIZE + R] = select(0.0, linv(r, c), r >= c);
    }
  }
}
