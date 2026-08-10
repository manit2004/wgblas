// sgemm_naive: C = alpha * op(A) * op(B) + beta * C
// 1. col mapped to gid.x for coalesced B/C access (row-major: col is contiguous).
// 2. TILE x TILE tiles of op(A)/op(B) cached in workgroup memory, reused TILE times each before the next fetch from global memory.

const TILE: u32 = 8u;

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

var<workgroup> As: array<f32, TILE * TILE>;
var<workgroup> Bs: array<f32, TILE * TILE>;

@compute @workgroup_size(TILE, TILE)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let row = gid.y;
  let col = gid.x;
  let threadRow = lid.y;
  let threadCol = lid.x;

  var acc: f32 = 0.0;

  let numTiles = (params.k + TILE - 1u) / TILE;
  for (var t = 0u; t < numTiles; t++) {
    // Cooperative load into the shared tile, zero-padded past m/n/k.
    let aIdx = select(row * params.lda + (t * TILE + threadCol), (t * TILE + threadCol) * params.lda + row, params.transA != 0u);
    As[threadRow * TILE + threadCol] = select(0.0, A[aIdx], row < params.m && t * TILE + threadCol < params.k);

    let bIdx = select((t * TILE + threadRow) * params.ldb + col, col * params.ldb + (t * TILE + threadRow), params.transB != 0u);
    Bs[threadRow * TILE + threadCol] = select(0.0, B[bIdx], t * TILE + threadRow < params.k && col < params.n);

    workgroupBarrier();

    for (var i = 0u; i < TILE; i++) {
      acc += As[threadRow * TILE + i] * Bs[i * TILE + threadCol];
    }

    workgroupBarrier();
  }

  if (row < params.m && col < params.n) {
    let cIdx = row * params.ldc + col;
    C[cIdx] = params.alpha * acc + params.beta * C[cIdx];
  }
}
