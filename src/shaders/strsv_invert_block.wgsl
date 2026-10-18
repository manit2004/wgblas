// strsv_invert_block: computes the explicit inverse of every BLOCK_SIZE ×
// BLOCK_SIZE diagonal block of op(A), one workgroup per block (dispatch
// x = numBlocks), writing each to a dense row-major scratch region of Ainv.
// Shared by strsv and strsm.
//
// The block is staged once into workgroup memory (coalesced loads), then
// thread c solves column c of the inverse, op(A_block) · inv[:,c] = e_c, by
// plain substitution against that copy — no barriers inside the solve, no
// global round trips. (The version this replaced ran one workgroup per
// column and did a 6-barrier tree reduction plus a global write/read for
// every row, ~1.4 ms at n=4096 vs a few tens of µs here.)
//
// A triangular block's inverse is itself triangular: forward (effectively-
// lower, e.g. no-trans+lower) blocks have inverse column c nonzero only for
// row >= c, solved in increasing row order; backward (effectively-upper)
// ones only for row <= c, solved in decreasing order. Every row of a column
// is written, the structural zeros as literal 0 — strsv_step.wgsl's and
// strsm's dense matvecs depend on that.

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
// op(A)'s diagonal block, row-major: exactly 16 KB, the WebGPU default
// maxComputeWorkgroupStorageSize — so nothing else may live in workgroup memory.
var<workgroup> blk: array<f32, 4096>;
// This thread's column of the block inverse.
var<private> inv: array<f32, 64>;

// Σ_{k in [k0,k1)} blk[r,k] * inv[k], four independent accumulators so the
// inv[] loads (private array, likely spilled to local memory) overlap instead
// of forming one serial latency chain.
fn rowDot(r: u32, k0: u32, k1: u32) -> f32 {
  var a0 = 0.0f;
  var a1 = 0.0f;
  var a2 = 0.0f;
  var a3 = 0.0f;
  var k = k0;
  while (k + 3u < k1) {
    a0 += blk[r * BLOCK_SIZE + k]      * inv[k];
    a1 += blk[r * BLOCK_SIZE + k + 1u] * inv[k + 1u];
    a2 += blk[r * BLOCK_SIZE + k + 2u] * inv[k + 2u];
    a3 += blk[r * BLOCK_SIZE + k + 3u] * inv[k + 3u];
    k += 4u;
  }
  while (k < k1) {
    a0 += blk[r * BLOCK_SIZE + k] * inv[k];
    k += 1u;
  }
  return (a0 + a1) + (a2 + a3);
}

@compute @workgroup_size(64)
fn strsv_invert_block_main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let t = lid.x;
  let blockIndex = wid.x;
  let blockStart = blockIndex * BLOCK_SIZE;
  let blockEnd = min(blockStart + BLOCK_SIZE, params.n);
  let blockLen = blockEnd - blockStart;

  // Stage op(A_block). Lanes always read along a stored row (coalesced);
  // the transpose is applied when storing to workgroup memory.
  for (var r = 0u; r < BLOCK_SIZE; r++) {
    let ok = r < blockLen && t < blockLen;
    let gi = blockStart + min(r, blockLen - 1u);
    let gj = blockStart + min(t, blockLen - 1u);
    let v = select(0.0, A[gi * params.lda + gj], ok); // stored A[r, t]
    if (params.trans == 0u) {
      blk[r * BLOCK_SIZE + t] = v;
    } else {
      blk[t * BLOCK_SIZE + r] = v;
    }
  }
  workgroupBarrier();

  let c = t;
  if (c >= blockLen) { return; } // no barriers below
  let unit = params.diag == 1u;
  let forward = (params.trans == 0u) == (params.uplo == 0u);
  let base = blockIndex * BLOCK_SIZE * BLOCK_SIZE;

  if (forward) {
    for (var r = 0u; r < c; r++) { Ainv[base + r * BLOCK_SIZE + c] = 0.0; }
    for (var r = c; r < blockLen; r++) {
      let s = select(0.0, 1.0, r == c) - rowDot(r, c, r);
      let v = select(s / blk[r * BLOCK_SIZE + r], s, unit);
      inv[r] = v;
      Ainv[base + r * BLOCK_SIZE + c] = v;
    }
  } else {
    for (var r = c + 1u; r < blockLen; r++) { Ainv[base + r * BLOCK_SIZE + c] = 0.0; }
    for (var step = 0u; step <= c; step++) {
      let r = c - step;
      let s = select(0.0, 1.0, r == c) - rowDot(r, r + 1u, c + 1u);
      let v = select(s / blk[r * BLOCK_SIZE + r], s, unit);
      inv[r] = v;
      Ainv[base + r * BLOCK_SIZE + c] = v;
    }
  }
}
