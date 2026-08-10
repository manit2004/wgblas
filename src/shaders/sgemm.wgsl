// sgemm_naive: C = alpha * op(A) * op(B) + beta * C
// 1. col mapped to gid.x for coalesced B/C access (row-major: col is contiguous).

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

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let row = gid.y;
  let col = gid.x;

  // guard is necessary for when m or n aren't multiples of the workgroup size.
  if (row < params.m && col < params.n) {
    var acc: f32 = 0.0;
    for (var p = 0u; p < params.k; p++) {
      // No-transpose: A is m×k stored, A[row,p] = A[row*lda+p].
      // Transpose:    A is stored k×m (op(A) is m×k), so logical A[row,p]
      //               sits at stored position [p,row] = p*lda+row.
      let aIdx = select(row * params.lda + p, p * params.lda + row, params.transA != 0u);
      // Same shape for B, mirrored (no-transpose B is k×n stored).
      let bIdx = select(p * params.ldb + col, col * params.ldb + p, params.transB != 0u);
      acc += A[aIdx] * B[bIdx];
    }
    let cIdx = row * params.ldc + col;
    C[cIdx] = params.alpha * acc + params.beta * C[cIdx];
  }
}
