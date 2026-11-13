// strsm_small: the whole triangular solve in one dispatch when the order
// fits one block (n <= 64) — strsv (one right-hand side) and strsm (many) —
// and each diagonal block of strsm's blocked solve (through offset views).
// No explicit inverse: plain column-oriented substitution, backward stable
// and, at this size, much shorter than the inverse-then-apply chain (which
// is three dependent dispatches plus a 64×64 inversion).
//
// Each workgroup solves RHS_PER_WG right-hand sides: thread (i, r) owns row
// i of right-hand side r in a register. Rows go in chunks of CHUNK: the
// chunk's owners publish their (fully updated) values, one barrier, then
// every thread solves the tiny CHUNK×CHUNK diagonal system itself, in
// registers, and folds the whole chunk into its own row — one barrier per
// chunk instead of per row (each barrier step cost ~0.2 µs, the rows'
// dependency chain dominated).
// An effectively-upper system is reversed into a lower one first (J·U·J,
// as in strsv_invert_block.wgsl), so the loop always runs forward.
//
// op(A) is staged as a column-packed lower triangle, so step j's reads —
// column j, rows below it, one per lane — are contiguous and conflict-free.
// A and B are addressed through strided views in the solve frame (element
// (i, j) at off + i*rs + j*cs), so strided x, either layout, and either
// side need no gather or scatter.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> B: array<f32>;
// Optional packed copy of the solution (row i of the block at i * xLd): the
// blocked strsm's trailing update reads it, since that dispatch can't bind
// B read-only while it writes B.
@group(0) @binding(3) var<storage, read_write> X: array<f32>;

struct Params {
  n:        u32, // order, <= BLOCK_SIZE
  nrhs:     u32,
  aOff:     u32,
  aRs:      u32,
  aCs:      u32,
  bOff:     u32,
  bRs:      u32,
  bCs:      u32,
  backward: u32, // 1 = effectively upper: solve on the reversed system
  unit:     u32, // 1 = unit diagonal (not read)
  alpha:    f32, // applied as B is read in (alpha = 0 never reaches here)
  xLd:      u32, // 0 = no packed copy
  skipZero: u32, // 1 = reference BLAS's zero-unknown skip (strsv; see solveDiv)
}

@group(0) @binding(2) var<uniform> params: Params;

const BLOCK_SIZE: u32 = 64u;
const RHS_PER_WG: u32 = 4u;
const NUM_THREADS: u32 = BLOCK_SIZE * RHS_PER_WG; // 256
const CHUNK: u32 = 4u;
const PACKED: u32 = BLOCK_SIZE * (BLOCK_SIZE + 1u) / 2u;

var<workgroup> L: array<f32, PACKED>; // column-packed lower triangle
// Published chunk values per RHS, double-buffered: a chunk's writers can't
// pass the next barrier until every reader of the previous chunk has.
var<workgroup> chunkVals: array<f32, 2u * RHS_PER_WG * CHUNK>;

// Start of column j in the packed triangle: columns 0..j-1 hold 64, 63, ... entries.
fn colStart(j: u32) -> u32 {
  return j * BLOCK_SIZE - j * (j - 1u) / 2u;
}

// Solve-frame index -> original index (identity, or reversed for backward).
fn orig(i: u32) -> u32 {
  return select(i, params.n - 1u - i, params.backward == 1u);
}

// ±0 exactly, by its bits: WGSL lets a compiler assume no NaN, so a float
// comparison like `v == 0.0` can't be trusted to keep NaN out.
fn isZeroBits(v: f32) -> bool {
  return (bitcast<u32>(v) & 0x7fffffffu) == 0u;
}

// skipZero (strsv, when the solve is transposed in the row-major frame —
// the column-by-column form of reference BLAS and stdlib): an unknown whose
// value is 0 before the division stays 0 (no division, so a 0 or NaN diagonal
// can't reach it), and its column's updates are skipped, so 0 · Infinity or
// 0 · NaN there never happens.
fn solveDiv(v: f32, d: f32) -> f32 {
  return select(v / d, 0.0, isZeroBits(v));
}
fn mulSkip(l: f32, x: f32) -> f32 {
  return select(l, 0.0, isZeroBits(x)) * x; // l zeroed where x is: 0 · 0
}

@compute @workgroup_size(256)
fn main(
  @builtin(workgroup_id)           wid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let n = params.n;

  // Stage the lower triangle (diagonal included) of the solve-frame matrix.
  for (var e = tid; e < BLOCK_SIZE * BLOCK_SIZE; e += NUM_THREADS) {
    let i = e % BLOCK_SIZE;
    let j = e / BLOCK_SIZE;
    if (j <= i && i < n) {
      var v = A[params.aOff + orig(i) * params.aRs + orig(j) * params.aCs];
      if (i == j && params.unit == 1u) { v = 1.0; }
      L[colStart(j) + i - j] = v;
    }
  }
  // Rows past n get a unit diagonal, so the last chunk's padding solves
  // cleanly (it only ever feeds other padding rows).
  if (tid >= n && tid < BLOCK_SIZE) { L[colStart(tid)] = 1.0; }

  let i = tid % BLOCK_SIZE;
  let r = tid / BLOCK_SIZE;
  let rhs = wid.x * RHS_PER_WG + r;
  let live = i < n && rhs < params.nrhs;
  let bIdx = params.bOff + orig(min(i, n - 1u)) * params.bRs + rhs * params.bCs;
  var b = 0.0f;
  if (live) { b = params.alpha * B[bIdx]; }
  var xi = 0.0f;
  workgroupBarrier();

  for (var j = 0u; j < n; j += CHUNK) {
    let slot = ((j / CHUNK) % 2u) * RHS_PER_WG * CHUNK + r * CHUNK;
    if (i >= j && i < j + CHUNK) { chunkVals[slot + i - j] = b; }
    workgroupBarrier();
    // The chunk's 4×4 forward solve, unrolled so x0..x3 stay in registers.
    let c0 = colStart(j);
    let c1 = colStart(j + 1u);
    let c2 = colStart(j + 2u);
    let c3 = colStart(j + 3u);
    // skipZero is uniform, so the checked arithmetic is a separate branch:
    // per-operation selects cost strsv up to 15% at small n (and strsm, which
    // never skips, too).
    var x0: f32;
    var x1: f32;
    var x2: f32;
    var x3: f32;
    if (params.skipZero == 1u) {
      x0 = solveDiv(chunkVals[slot], L[c0]);
      x1 = solveDiv(chunkVals[slot + 1u] - mulSkip(L[c0 + 1u], x0), L[c1]);
      x2 = solveDiv(chunkVals[slot + 2u] - mulSkip(L[c0 + 2u], x0) - mulSkip(L[c1 + 1u], x1), L[c2]);
      x3 = solveDiv(chunkVals[slot + 3u] - mulSkip(L[c0 + 3u], x0) - mulSkip(L[c1 + 2u], x1) - mulSkip(L[c2 + 1u], x2), L[c3]);
    } else {
      x0 = chunkVals[slot] / L[c0];
      x1 = (chunkVals[slot + 1u] - L[c0 + 1u] * x0) / L[c1];
      x2 = (chunkVals[slot + 2u] - L[c0 + 2u] * x0 - L[c1 + 1u] * x1) / L[c2];
      x3 = (chunkVals[slot + 3u] - L[c0 + 3u] * x0 - L[c1 + 2u] * x1 - L[c2 + 1u] * x2) / L[c3];
    }
    if (i >= j && i < j + CHUNK) {
      xi = select(select(x3, x2, i == j + 2u), select(x1, x0, i == j), i < j + 2u);
    } else if (i >= j + CHUNK) {
      let d = i - j;
      if (params.skipZero == 1u) {
        b = b - mulSkip(L[c0 + d], x0) - mulSkip(L[c1 + d - 1u], x1) - mulSkip(L[c2 + d - 2u], x2) - mulSkip(L[c3 + d - 3u], x3);
      } else {
        b = b - L[c0 + d] * x0 - L[c1 + d - 1u] * x1 - L[c2 + d - 2u] * x2 - L[c3 + d - 3u] * x3;
      }
    }
  }

  if (live) {
    B[bIdx] = xi;
    if (params.xLd != 0u) { X[orig(i) * params.xLd + rhs] = xi; }
  }
}
