// sgemm_naive: C = alpha * op(A) * op(B) + beta * C — naive baseline (no
// tiling/blocking), the first of several sgemm implementations building up
// to a tuned version (see new-routine.md). One thread computes one output
// element C[row, col] via its own independent length-k loop, reading A and
// B straight from global memory — no data reuse across threads, so every
// A/B element gets reread from global memory O(n) / O(m) times
// respectively. That's expected here: this file exists to be a correct,
// benchmarkable floor to compare later (workgroup-tiled, register-blocked)
// versions against, not to be fast.
//
// A, B, C are all row-major. transA/transB select op(A)/op(B) via a runtime
// branch per thread, rather than specializing into separate NN/NT/TN/TT
// kernel files the way sgemv_n/sgemv_t do — that specialization is deferred
// to the tiled/optimized versions, where it'll actually matter for
// performance; premature here while still validating correctness.

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
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups)       nwg: vec3u,
) {
  // col is fastest-varying in row-major C, so it maps to gid.x for
  // coalesced access. Grid-stride both dims in case m/n exceed the dispatch.
  let stride_x = nwg.x * 8u;
  let stride_y = nwg.y * 8u;

  for (var row = gid.y; row < params.m; row += stride_y) {
    for (var col = gid.x; col < params.n; col += stride_x) {
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
}
