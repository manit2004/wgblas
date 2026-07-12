// sgemv_t: y = alpha * A^T * x + beta * y  (A is m×n row-major, transposed)
// each thread owns one column of A → one element of y (length n)
// tiles over x (length m) using shared memory

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  m:     u32,
  n:     u32,
  alpha: f32,
  beta:  f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> x_tile: array<f32, 64>;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id)  lid: vec3u,
) {
  // each thread owns column col of A → output y[col]
  let col     = gid.x;
  // tile over x (length m, the rows of A)
  let m_floor = (params.m / WGS) * WGS;
  var acc: f32 = 0.0;

  for (var base = 0u; base < m_floor; base += WGS) {
    // cooperative load: all 64 threads fill x_tile with x[base..base+WGS]
    x_tile[lid.x] = x[(base + lid.x) * params.incx];
    workgroupBarrier();

    if (col < params.n) {
      for (var j = 0u; j < WGS; j++) {
        acc += A[(base + j) * params.lda + col] * x_tile[j]; // A^T[col] · x_tile
      }
    }
    workgroupBarrier();
  }

  if (col < params.n) {
    for (var k = m_floor; k < params.m; k++) {
      acc += A[k * params.lda + col] * x[k * params.incx]; // A^T[col] · x remainder
    }
    let yi = col * params.incy;
    y[yi] = params.alpha * acc + params.beta * y[yi]; // alpha*(A^T[col]·x) + beta*y[col]
  }
}
