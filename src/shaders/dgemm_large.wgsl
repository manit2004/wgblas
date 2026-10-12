// dgemm_large: C = alpha * op(A) * op(B) + beta * C — double-double (Dekker)
// f64 emulation of sgemm_large.wgsl, same tile config and structure:
// BM=BN=64, BK=8, TM=8, TN=4, 128 threads. Paired with dgemm_small.wgsl in
// the same two-tier dispatch sgemm uses (see dgemm.mjs).
//
// Same two unavoidable differences from sgemm_large.wgsl as dgemm_small.wgsl
// has from sgemm_small.wgsl: vec4 views on the Hi halves only (Lo too would
// exceed maxStorageBuffersPerShaderStage = 8), and protected multiply-
// accumulate with a clamped-index final write for barrier uniformity.

const BM: u32 = 64u;
const BN: u32 = 64u;
const BK: u32 = 8u;
const TM: u32 = 8u;
const TN: u32 = 4u;
const THREADS_X: u32 = BN / TN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 128
const STRIDE_A: u32 = NUM_THREADS / BK; // rows of As covered per load-loop step
const STRIDE_B: u32 = NUM_THREADS / BN; // rows of Bs covered per load-loop step

@group(0) @binding(0) var<storage, read>       AHi:  array<f32>;
@group(0) @binding(1) var<storage, read>       AHi4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       ALo:  array<f32>;
@group(0) @binding(3) var<storage, read>       BHi:  array<f32>;
@group(0) @binding(4) var<storage, read>       BHi4: array<vec4<f32>>;
@group(0) @binding(5) var<storage, read>       BLo:  array<f32>;
@group(0) @binding(6) var<storage, read_write> CHi:  array<f32>;
@group(0) @binding(7) var<storage, read_write> CLo:  array<f32>;

struct Params {
  m:       u32,
  n:       u32,
  k:       u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
  lda:     u32,
  ldb:     u32,
  ldc:     u32,
  transA:  u32, // 0 = no-transpose, 1 = transpose
  transB:  u32,
  useVecA: u32, // 1 = AHi's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = BHi's vec4 view covers every in-bounds element
}

@group(0) @binding(8) var<uniform> params: Params;

var<workgroup> AsHi: array<f32, BM * BK>;
var<workgroup> AsLo: array<f32, BM * BK>;
var<workgroup> BsHi: array<f32, BK * BN>;
var<workgroup> BsLo: array<f32, BK * BN>;

@compute @workgroup_size(THREADS_X, THREADS_Y)
fn main(
  @builtin(workgroup_id) wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(local_invocation_index) tid: u32,
) {
  let blockRow = wid.y * BM;
  let blockCol = wid.x * BN;
  let threadCol = lid.x;
  let threadRow = lid.y;

  // Load indices, independent of the compute thread shape — a loop since
  // NUM_THREADS doesn't match the tile size 1:1 at this config.
  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<DD, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = DD(0.0, 0.0);
  }
  var regM: array<DD, TM>;
  var regN: array<DD, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    // ── Load the BM×BK A tile into As (every branch here is dispatch-uniform) ──
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous. Each thread loads one vec4 of 4
      // columns; 64 rows × 2 column-lanes = NUM_THREADS exactly, single pass.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      let gRow = blockRow + r4;
      let gCol = t * BK + c4 * 4u;
      let base = gRow * params.lda + gCol;
      let rowOK = gRow < params.m;
      let ok0 = rowOK &&  gCol        < params.k;
      let ok1 = rowOK && (gCol + 1u) < params.k;
      let ok2 = rowOK && (gCol + 2u) < params.k;
      let ok3 = rowOK && (gCol + 3u) < params.k;
      let v = AHi4[base / 4u];
      let dst = r4 * BK + c4 * 4u;
      AsHi[dst]      = select(0.0, v.x, ok0);
      AsHi[dst + 1u] = select(0.0, v.y, ok1);
      AsHi[dst + 2u] = select(0.0, v.z, ok2);
      AsHi[dst + 3u] = select(0.0, v.w, ok3);
      AsLo[dst]      = select(0.0, ALo[base],      ok0);
      AsLo[dst + 1u] = select(0.0, ALo[base + 1u], ok1);
      AsLo[dst + 2u] = select(0.0, ALo[base + 2u], ok2);
      AsLo[dst + 3u] = select(0.0, ALo[base + 3u], ok3);
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. Each thread loads one
      // vec4 of 4 rows; 16 row-lanes × 8 columns = NUM_THREADS, single pass.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      let gRow = blockRow + r4 * 4u;
      let gCol = t * BK + c;
      let base = gCol * params.lda + gRow;
      let colOK = gCol < params.k;
      let ok0 = colOK &&  gRow        < params.m;
      let ok1 = colOK && (gRow + 1u) < params.m;
      let ok2 = colOK && (gRow + 2u) < params.m;
      let ok3 = colOK && (gRow + 3u) < params.m;
      let v = AHi4[base / 4u];
      AsHi[(r4 * 4u) * BK + c]      = select(0.0, v.x, ok0);
      AsHi[(r4 * 4u + 1u) * BK + c] = select(0.0, v.y, ok1);
      AsHi[(r4 * 4u + 2u) * BK + c] = select(0.0, v.z, ok2);
      AsHi[(r4 * 4u + 3u) * BK + c] = select(0.0, v.w, ok3);
      AsLo[(r4 * 4u) * BK + c]      = select(0.0, ALo[base],      ok0);
      AsLo[(r4 * 4u + 1u) * BK + c] = select(0.0, ALo[base + 1u], ok1);
      AsLo[(r4 * 4u + 2u) * BK + c] = select(0.0, ALo[base + 2u], ok2);
      AsLo[(r4 * 4u + 3u) * BK + c] = select(0.0, ALo[base + 3u], ok3);
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        let inA = gRowA < params.m && gColA < params.k;
        let dst = (innerRowA + loadOffset) * BK + innerColA;
        AsHi[dst] = select(0.0, AHi[aIdx], inA);
        AsLo[dst] = select(0.0, ALo[aIdx], inA);
      }
    }

    // ── Load the BK×BN B tile into Bs ──
    if (params.useVecB == 1u && params.transB == 0u) {
      // No-transpose: columns contiguous. 8 rows × 16 column-lanes cover the
      // tile in one pass (BK = NUM_THREADS / (BN/4)).
      let r  = tid / (BN / 4u);
      let c4 = tid % (BN / 4u);
      let gRow = t * BK + r;
      let gCol = blockCol + c4 * 4u;
      let base = gRow * params.ldb + gCol;
      let rowOK = gRow < params.k;
      let ok0 = rowOK &&  gCol        < params.n;
      let ok1 = rowOK && (gCol + 1u) < params.n;
      let ok2 = rowOK && (gCol + 2u) < params.n;
      let ok3 = rowOK && (gCol + 3u) < params.n;
      let v = BHi4[base / 4u];
      let dst = r * BN + c4 * 4u;
      BsHi[dst]      = select(0.0, v.x, ok0);
      BsHi[dst + 1u] = select(0.0, v.y, ok1);
      BsHi[dst + 2u] = select(0.0, v.z, ok2);
      BsHi[dst + 3u] = select(0.0, v.w, ok3);
      BsLo[dst]      = select(0.0, BLo[base],      ok0);
      BsLo[dst + 1u] = select(0.0, BLo[base + 1u], ok1);
      BsLo[dst + 2u] = select(0.0, BLo[base + 2u], ok2);
      BsLo[dst + 3u] = select(0.0, BLo[base + 3u], ok3);
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column. 2 row-lanes × 64 columns
      // cover the tile in one pass (BN = NUM_THREADS / (BK/4)).
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      let gRow = t * BK + r4 * 4u;
      let gCol = blockCol + c;
      let base = gCol * params.ldb + gRow;
      let colOK = gCol < params.n;
      let ok0 = colOK &&  gRow        < params.k;
      let ok1 = colOK && (gRow + 1u) < params.k;
      let ok2 = colOK && (gRow + 2u) < params.k;
      let ok3 = colOK && (gRow + 3u) < params.k;
      let v = BHi4[base / 4u];
      BsHi[(r4 * 4u) * BN + c]      = select(0.0, v.x, ok0);
      BsHi[(r4 * 4u + 1u) * BN + c] = select(0.0, v.y, ok1);
      BsHi[(r4 * 4u + 2u) * BN + c] = select(0.0, v.z, ok2);
      BsHi[(r4 * 4u + 3u) * BN + c] = select(0.0, v.w, ok3);
      BsLo[(r4 * 4u) * BN + c]      = select(0.0, BLo[base],      ok0);
      BsLo[(r4 * 4u + 1u) * BN + c] = select(0.0, BLo[base + 1u], ok1);
      BsLo[(r4 * 4u + 2u) * BN + c] = select(0.0, BLo[base + 2u], ok2);
      BsLo[(r4 * 4u + 3u) * BN + c] = select(0.0, BLo[base + 3u], ok3);
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        let inB = gRowB < params.k && gColB < params.n;
        let dst = (innerRowB + loadOffset) * BN + innerColB;
        BsHi[dst] = select(0.0, BHi[bIdx], inB);
        BsLo[dst] = select(0.0, BLo[bIdx], inB);
      }
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        let idx = (threadRow * TM + i) * BK + dotIdx;
        regM[i] = DD(AsHi[idx], AsLo[idx]);
      }
      for (var i = 0u; i < TN; i++) {
        let idx = dotIdx * BN + threadCol * TN + i;
        regN[i] = DD(BsHi[idx], BsLo[idx]);
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          let ri = resIdxM * TN + resIdxN;
          let prod = ddMulProtected(regM[resIdxM], regN[resIdxN], tid);
          threadResults[ri] = ddAddProtected(threadResults[ri], prod, tid);
        }
      }
    }

    workgroupBarrier();
  }

  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta = DD(params.betaHi, params.betaLo);
  let betaIsZero = params.betaHi == 0.0 && params.betaLo == 0.0;

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
      let row = blockRow + threadRow * TM + resIdxM;
      let col = blockCol + threadCol * TN + resIdxN;
      let inBounds = row < params.m && col < params.n;
      let cIdx = min(row, params.m - 1u) * params.ldc + min(col, params.n - 1u);

      let acc = ddMulProtected(alpha, threadResults[resIdxM * TN + resIdxN], tid);
      // BLAS beta==0 semantics: C is written, not accumulated — select rather
      // than multiply so stale NaN/Inf in C can't survive as 0 * NaN.
      let betaTerm = ddMulProtected(beta, DD(CHi[cIdx], CLo[cIdx]), tid);
      let withBeta = ddAddProtected(acc, betaTerm, tid);
      if (inBounds) {
        CHi[cIdx] = select(withBeta.hi, acc.hi, betaIsZero);
        CLo[cIdx] = select(withBeta.lo, acc.lo, betaIsZero);
      }
    }
  }
}
