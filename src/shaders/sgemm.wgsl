// sgemm_naive: C = alpha * op(A) * op(B) + beta * C
// 1. col mapped to gid.x for coalesced B/C access (row-major: col is contiguous).
// 2. BM x BK / BK x BN tiles of op(A)/op(B) cached in workgroup memory, reused each K-tile before the next fetch from global memory.
// 3. Each thread computes TM output rows (1D register blocking) instead of 1, reusing each Bs read TM times via a register.

const BM: u32 = 32u;
const BN: u32 = 32u;
const BK: u32 = 8u;
const TM: u32 = 4u;
const THREADS_X: u32 = BN;
const THREADS_Y: u32 = BM / TM;
const NUM_THREADS: u32 = THREADS_X * THREADS_Y; // 256, WebGPU's guaranteed-portable workgroup-invocation minimum

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       B: array<f32>;
@group(0) @binding(2) var<storage, read_write> C: array<f32>;

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
}

@group(0) @binding(3) var<uniform> params: Params;

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
  let col = blockCol + threadCol;

  let innerRowA = tid / BK;
  let innerColA = tid % BK;
  let innerRowB = tid / BN;
  let innerColB = tid % BN;

  var threadResults: array<f32, TM>;
  for (var i = 0u; i < TM; i++) {
    threadResults[i] = 0.0;
  }

  let numTiles = (params.k + BK - 1u) / BK;
  for (var t = 0u; t < numTiles; t++) {
    let gRowA = blockRow + innerRowA;
    let gColA = t * BK + innerColA;
    let aIdx = select(gRowA * params.lda + gColA, gColA * params.lda + gRowA, params.transA != 0u);
    As[innerRowA * BK + innerColA] = select(0.0, A[aIdx], gRowA < params.m && gColA < params.k);

    let gRowB = t * BK + innerRowB;
    let gColB = blockCol + innerColB;
    let bIdx = select(gRowB * params.ldb + gColB, gColB * params.ldb + gRowB, params.transB != 0u);
    Bs[innerRowB * BN + innerColB] = select(0.0, B[bIdx], gRowB < params.k && gColB < params.n);

    workgroupBarrier();

    for (var dotIdx = 0u; dotIdx < BK; dotIdx++) {
      for (var resIdx = 0u; resIdx < TM; resIdx++) {
        threadResults[resIdx] += As[(threadRow * TM + resIdx) * BK + dotIdx] * Bs[dotIdx * BN + threadCol];
      }
    }

    workgroupBarrier();
  }

  for (var resIdx = 0u; resIdx < TM; resIdx++) {
    let row = blockRow + threadRow * TM + resIdx;
    if (row < params.m && col < params.n) {
      let cIdx = row * params.ldc + col;
      C[cIdx] = params.alpha * threadResults[resIdx] + params.beta * C[cIdx];
    }
  }
}
