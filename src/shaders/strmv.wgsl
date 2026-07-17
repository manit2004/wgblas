// strmv: y = op(A) * x
// A is n×n triangular, lower (uplo=0) or upper (uplo=1) triangle stored.
// op(A) is A (trans=0) or A^T (trans=1).
// diag=1 (unit) treats the diagonal as 1 without reading A's diagonal values.
// One workgroup per row, grid-stride outer loop.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.n; row += nwg.x) {
    let rb = row * params.lda;
    var acc = 0.0f;

    if params.trans == 0u {
      // No-transpose: y[i] = Σ_j A[i,j] * x[j]
      if params.uplo == 0u {
        // Lower: A[i,j] stored at A[i*lda+j] for j ≤ i
        for (var j = lid.x; j <= row; j += WGS) {
          let aVal = select(A[rb + j], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      } else {
        // Upper: A[i,j] stored at A[i*lda+j] for j ≥ i
        for (var j = row + lid.x; j < params.n; j += WGS) {
          let aVal = select(A[rb + j], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      }
    } else {
      // Transpose: y[i] = Σ_j A[j,i] * x[j]
      if params.uplo == 0u {
        // Lower: A[j,i] stored at A[j*lda+i] for j ≥ i
        for (var j = row + lid.x; j < params.n; j += WGS) {
          let aVal = select(A[j * params.lda + row], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      } else {
        // Upper: A[j,i] stored at A[j*lda+i] for j ≤ i
        for (var j = lid.x; j <= row; j += WGS) {
          let aVal = select(A[j * params.lda + row], 1.0, params.diag == 1u && j == row);
          acc += aVal * x[j * params.incx];
        }
      }
    }

    // Parallel reduction: 64 → 1
    scratch[lid.x] = acc;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      let yi = row * params.incy;
      y[yi] = scratch[0];
    }
    workgroupBarrier();
  }
}
