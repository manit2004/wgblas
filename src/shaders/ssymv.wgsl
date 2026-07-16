// ssymv: y = alpha * A * x + beta * y
// A is n×n symmetric, lower (uplo=0) or upper (uplo=1) triangle stored.
// One workgroup per row, grid-stride outer loop. ILP=4 on each sub-range.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> y: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  beta:  f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
  uplo:  u32,  // 0 = lower, 1 = upper
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
    var acc0 = 0.0f; var acc1 = 0.0f; var acc2 = 0.0f; var acc3 = 0.0f;

    if params.uplo == 0u {
      // Row part (j = 0..row): sequential reads along stored lower triangle.
      let rfloor = (row + 1u) / (4u * WGS) * (4u * WGS);
      for (var j = lid.x; j < rfloor; j += 4u * WGS) {
        acc0 += A[rb + j          ] * x[ j           * params.incx];
        acc1 += A[rb + j +    WGS ] * x[(j +    WGS) * params.incx];
        acc2 += A[rb + j + 2u*WGS ] * x[(j + 2u*WGS) * params.incx];
        acc3 += A[rb + j + 3u*WGS ] * x[(j + 3u*WGS) * params.incx];
      }
      for (var j = rfloor + lid.x; j <= row; j += WGS) {
        acc0 += A[rb + j] * x[j * params.incx];
      }

      // Column part (j = row+1..n-1): A[i,j] = A[j,i] → strided column reads.
      let cs = row + 1u;
      if cs < params.n {
        let cfloor = cs + (params.n - cs) / (4u * WGS) * (4u * WGS);
        for (var j = cs + lid.x; j < cfloor; j += 4u * WGS) {
          acc0 += A[ j           * params.lda + row] * x[ j           * params.incx];
          acc1 += A[(j +    WGS) * params.lda + row] * x[(j +    WGS) * params.incx];
          acc2 += A[(j + 2u*WGS) * params.lda + row] * x[(j + 2u*WGS) * params.incx];
          acc3 += A[(j + 3u*WGS) * params.lda + row] * x[(j + 3u*WGS) * params.incx];
        }
        for (var j = cfloor + lid.x; j < params.n; j += WGS) {
          acc0 += A[j * params.lda + row] * x[j * params.incx];
        }
      }
    } else {
      // Row part (j = row..n-1): sequential reads along stored upper triangle.
      let rfloor = row + (params.n - row) / (4u * WGS) * (4u * WGS);
      for (var j = row + lid.x; j < rfloor; j += 4u * WGS) {
        acc0 += A[rb + j          ] * x[ j           * params.incx];
        acc1 += A[rb + j +    WGS ] * x[(j +    WGS) * params.incx];
        acc2 += A[rb + j + 2u*WGS ] * x[(j + 2u*WGS) * params.incx];
        acc3 += A[rb + j + 3u*WGS ] * x[(j + 3u*WGS) * params.incx];
      }
      for (var j = rfloor + lid.x; j < params.n; j += WGS) {
        acc0 += A[rb + j] * x[j * params.incx];
      }

      // Column part (j = 0..row-1): A[i,j] = A[j,i] → strided column reads.
      if row > 0u {
        let cfloor = row / (4u * WGS) * (4u * WGS);
        for (var j = lid.x; j < cfloor; j += 4u * WGS) {
          acc0 += A[ j           * params.lda + row] * x[ j           * params.incx];
          acc1 += A[(j +    WGS) * params.lda + row] * x[(j +    WGS) * params.incx];
          acc2 += A[(j + 2u*WGS) * params.lda + row] * x[(j + 2u*WGS) * params.incx];
          acc3 += A[(j + 3u*WGS) * params.lda + row] * x[(j + 3u*WGS) * params.incx];
        }
        for (var j = cfloor + lid.x; j < row; j += WGS) {
          acc0 += A[j * params.lda + row] * x[j * params.incx];
        }
      }
    }

    // Parallel reduction: 64 → 1
    scratch[lid.x] = acc0 + acc1 + acc2 + acc3;
    workgroupBarrier();
    for (var stride = WGS >> 1u; stride > 0u; stride >>= 1u) {
      if lid.x < stride { scratch[lid.x] += scratch[lid.x + stride]; }
      workgroupBarrier();
    }

    if lid.x == 0u {
      let yi = row * params.incy;
      y[yi] = params.alpha * scratch[0] + params.beta * y[yi];
    }
    workgroupBarrier();
  }
}