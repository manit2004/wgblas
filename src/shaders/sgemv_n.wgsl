// sgemv: y = alpha * A * x + beta * y  (A is m×n row-major)

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
  let row     = gid.x;
  let n_floor = (params.n / WGS) * WGS;
  var acc: f32 = 0.0;

  for (var base = 0u; base < n_floor; base += WGS) {
    // cooperative load: all 64 threads fill x_tile with x[base..base+WGS]
    x_tile[lid.x] = x[(base + lid.x) * params.incx];
    workgroupBarrier();

    if (row < params.m) {
      for (var j = 0u; j < WGS; j++) {
        acc += A[row * params.lda + base + j] * x_tile[j]; // A[row] · x_tile
      }
    }
    workgroupBarrier();
  }

  if (row < params.m) {
    for (var k = n_floor; k < params.n; k++) {
      acc += A[row * params.lda + k] * x[k * params.incx]; // A[row] · x remainder
    }
    let yi = row * params.incy;
    y[yi] = params.alpha * acc + params.beta * y[yi]; // alpha*(A[row]·x) + beta*y[row]
  }
}
