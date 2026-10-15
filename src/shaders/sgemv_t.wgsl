// sgemv_t: y = alpha * A^T * x + beta * y  (A is m×n row-major, transposed)
// One thread per column of A (one element of y, length n): at each row j the
// 64 lanes of a workgroup read A[j*lda + col..col+63] — contiguous, coalesced.
//
// Rows (length m) are split into chunks along wid.y (split-K): with only one
// thread per output, n=4096 is just 4096 threads each walking every row —
// too few memory requests in flight to saturate bandwidth. Each chunk writes
// its share to partial[chunk*n + col] and reduce_partials.wgsl sums them and
// applies alpha/beta. A single chunk (`direct` = 1) skips the second pass and
// writes y here instead. Four independent accumulators keep A reads
// pipelined within a thread (ILP=4).

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read>       x: array<f32>;
@group(0) @binding(2) var<storage, read_write> out: array<f32>; // y, or partials

struct Params {
  m:         u32,
  n:         u32,
  alpha:     f32,
  beta:      f32,
  incx:      u32,
  incy:      u32,
  lda:       u32,
  chunkRows: u32,
  direct:    u32,  // 1 = single chunk, write y directly
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
) {
  let col = wid.x * WGS + lid.x;
  if (col >= params.n) { return; } // no barriers below, so an early exit is safe

  let jStart = wid.y * params.chunkRows;
  let jEnd = min(jStart + params.chunkRows, params.m);

  var acc0: f32 = 0.0;
  var acc1: f32 = 0.0;
  var acc2: f32 = 0.0;
  var acc3: f32 = 0.0;
  var j = jStart;
  while (j + 3u < jEnd) {
    acc0 += A[ j       * params.lda + col] * x[ j       * params.incx];
    acc1 += A[(j + 1u) * params.lda + col] * x[(j + 1u) * params.incx];
    acc2 += A[(j + 2u) * params.lda + col] * x[(j + 2u) * params.incx];
    acc3 += A[(j + 3u) * params.lda + col] * x[(j + 3u) * params.incx];
    j += 4u;
  }
  while (j < jEnd) {
    acc0 += A[j * params.lda + col] * x[j * params.incx];
    j += 1u;
  }
  let sum = (acc0 + acc1) + (acc2 + acc3);

  if (params.direct == 1u) {
    let yi = col * params.incy;
    // BLAS beta==0 semantics: y is written, not accumulated — must not read y.
    let acc = params.alpha * sum;
    out[yi] = select(acc, acc + params.beta * out[yi], params.beta != 0.0);
  } else {
    out[wid.y * params.n + col] = sum;
  }
}
