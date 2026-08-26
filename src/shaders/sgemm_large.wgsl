// sgemm_large: C = alpha * op(A) * op(B) + beta * C — large-tile half of
// the two-tier autotuned dispatch (see sgemm.mjs and sgemm_small.wgsl).
// BM=BN=64, BK=8, TM=8, TN=4 (128 threads/workgroup) — the kernel 9
// autotuning winner (temp/autotune_sweep.mjs, temp/gen_sweep_kernel.mjs,
// swept BM/BN/BK/TM/TN and warp-tiled variants), +69% over the old BM=32
// single-tier baseline at n=512, +84% at n=1024. But BM=64 loses to BM=32
// below a 6x6=36 workgroup grid (not enough workgroups to fill the GPU at
// that tile size), hence the two-tier split rather than one global config.
//
// A and B are bound twice — scalar array<f32> and array<vec4<f32>> views of
// the same GPUBuffer (see vec4ViewBinding) — so each tile load can issue
// 16-byte vector reads along op(A)/op(B)'s contiguous dimension when the
// stride allows it (stride % 4 == 0 keeps every row base 16-byte aligned).
// Transposed or odd-stride operands take the scalar path; both paths
// zero-fill out-of-bounds components identically.

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

@group(0) @binding(0) var<storage, read>       A:  array<f32>;
@group(0) @binding(1) var<storage, read>       A4: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read>       B:  array<f32>;
@group(0) @binding(3) var<storage, read>       B4: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> C:  array<f32>;

struct Params {
  m:      u32,
  n:      u32,
  k:      u32,
  alpha:  f32,
  beta:   f32,
  lda:    u32,
  ldb:    u32,
  ldc:    u32,
  transA: u32, // 0 = no-transpose, 1 = transpose
  transB: u32,
  useVecA: u32, // 1 = A's vec4 view covers every in-bounds element (see vec4Usable)
  useVecB: u32, // 1 = B's vec4 view covers every in-bounds element
}

@group(0) @binding(5) var<uniform> params: Params;

var<workgroup> As: array<f32, BM * BK>;
var<workgroup> Bs: array<f32, BK * BN>;

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

  var threadResults: array<f32, TM * TN>;
  for (var i = 0u; i < TM * TN; i++) {
    threadResults[i] = 0.0;
  }
  var regM: array<f32, TM>;
  var regN: array<f32, TN>;

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    // ── Load the BM×BK A tile into As (vectorized along op(A)'s fast dim
    // when lda allows; every branch here is dispatch-uniform) ──
    if (params.useVecA == 1u && params.transA == 0u) {
      // No-transpose: columns contiguous. Each thread loads one vec4 of 4
      // columns; 64 rows × 2 column-lanes = NUM_THREADS exactly, single pass.
      let r4 = tid / (BK / 4u);
      let c4 = tid % (BK / 4u);
      let gRow = blockRow + r4;
      let gCol = t * BK + c4 * 4u;
      var v = A4[(gRow * params.lda + gCol) / 4u];
      let rowOK = gRow < params.m;
      v.x = select(0.0, v.x, rowOK &&  gCol            < params.k);
      v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.k);
      v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.k);
      v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.k);
      As[r4 * BK + c4 * 4u]      = v.x;
      As[r4 * BK + c4 * 4u + 1u] = v.y;
      As[r4 * BK + c4 * 4u + 2u] = v.z;
      As[r4 * BK + c4 * 4u + 3u] = v.w;
    } else if (params.useVecA == 1u && params.transA != 0u) {
      // Transpose: rows contiguous within a column. Each thread loads one
      // vec4 of 4 rows; 16 row-lanes × 8 columns = NUM_THREADS, single pass.
      let r4 = tid % (BM / 4u);
      let c  = tid / (BM / 4u);
      let gRow = blockRow + r4 * 4u;
      let gCol = t * BK + c;
      var v = A4[(gCol * params.lda + gRow) / 4u];
      let colOK = gCol < params.k;
      v.x = select(0.0, v.x, colOK &&  gRow            < params.m);
      v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.m);
      v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.m);
      v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.m);
      As[(r4 * 4u) * BK + c]      = v.x;
      As[(r4 * 4u + 1u) * BK + c] = v.y;
      As[(r4 * 4u + 2u) * BK + c] = v.z;
      As[(r4 * 4u + 3u) * BK + c] = v.w;
    } else {
      // Scalar fallback: odd stride or unhandled orientation.
      for (var loadOffset = 0u; loadOffset < BM; loadOffset += STRIDE_A) {
        let gRowA = blockRow + innerRowA + loadOffset;
        let gColA = t * BK + innerColA;
        let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
        As[(innerRowA + loadOffset) * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);
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
      var v = B4[(gRow * params.ldb + gCol) / 4u];
      let rowOK = gRow < params.k;
      v.x = select(0.0, v.x, rowOK &&  gCol            < params.n);
      v.y = select(0.0, v.y, rowOK && (gCol + 1u) < params.n);
      v.z = select(0.0, v.z, rowOK && (gCol + 2u) < params.n);
      v.w = select(0.0, v.w, rowOK && (gCol + 3u) < params.n);
      Bs[r * BN + c4 * 4u]      = v.x;
      Bs[r * BN + c4 * 4u + 1u] = v.y;
      Bs[r * BN + c4 * 4u + 2u] = v.z;
      Bs[r * BN + c4 * 4u + 3u] = v.w;
    } else if (params.useVecB == 1u && params.transB != 0u) {
      // Transpose: rows contiguous within a column. 2 row-lanes × 64 columns
      // cover the tile in one pass (BN = NUM_THREADS / (BK/4)).
      let r4 = tid % (BK / 4u);
      let c  = tid / (BK / 4u);
      let gRow = t * BK + r4 * 4u;
      let gCol = blockCol + c;
      var v = B4[(gCol * params.ldb + gRow) / 4u];
      let colOK = gCol < params.n;
      v.x = select(0.0, v.x, colOK &&  gRow            < params.k);
      v.y = select(0.0, v.y, colOK && (gRow + 1u) < params.k);
      v.z = select(0.0, v.z, colOK && (gRow + 2u) < params.k);
      v.w = select(0.0, v.w, colOK && (gRow + 3u) < params.k);
      Bs[(r4 * 4u) * BN + c]     = v.x;
      Bs[(r4 * 4u + 1u) * BN + c] = v.y;
      Bs[(r4 * 4u + 2u) * BN + c] = v.z;
      Bs[(r4 * 4u + 3u) * BN + c] = v.w;
    } else {
      // Scalar fallback.
      for (var loadOffset = 0u; loadOffset < BK; loadOffset += STRIDE_B) {
        let gRowB = t * BK + innerRowB + loadOffset;
        let gColB = blockCol + innerColB;
        let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
        Bs[(innerRowB + loadOffset) * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);
      }
    }

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var i = 0u; i < TM; i++) {
        regM[i] = As[(threadRow * TM + i) * BK + dotIdx];
      }
      for (var i = 0u; i < TN; i++) {
        regN[i] = Bs[dotIdx * BN + threadCol * TN + i];
      }
      for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
        for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
          threadResults[resIdxM * TN + resIdxN] += regM[resIdxM] * regN[resIdxN];
        }
      }
    }

    workgroupBarrier();
  }

  for (var resIdxM = 0u; resIdxM < TM; resIdxM++) {
    let row = blockRow + threadRow * TM + resIdxM;
    if (row < params.m) {
      for (var resIdxN = 0u; resIdxN < TN; resIdxN++) {
        let col = blockCol + threadCol * TN + resIdxN;
        if (col < params.n) {
          let cIdx = row * params.ldc + col;
          // BLAS beta==0 semantics: C is written, not accumulated — must not
          // read C (stale NaN/Inf bits would survive 0 * C as NaN).
          let acc = params.alpha * threadResults[resIdxM * TN + resIdxN];
          C[cIdx] = select(acc, acc + params.beta * C[cIdx], params.beta != 0.0);
        }
      }
    }
  }
}
