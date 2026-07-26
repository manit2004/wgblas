// strsv: solve op(A) * x = b for x, in place (x holds b on input, the
// solution on output).
// A is n×n triangular, lower (uplo=0) or upper (uplo=1) triangle stored.
// op(A) is A (trans=0) or A^T (trans=1).
// diag=1 (unit) treats the diagonal as 1 without reading A's diagonal values.
//
// Unlike strmv (one workgroup per row, rows fully independent), each row's
// solution here depends on every previously-solved row, so this dispatches
// as a SINGLE workgroup that walks the rows in the order each triangular
// case requires (forward or backward substitution), with a barrier after
// each row so x[i] is fully written before any thread reads it while
// solving row i±1. This caps available parallelism at one workgroup's
// threads (WGS, used for each row's dot-product reduction) regardless of
// n — an inherent property of triangular solve (each row is a real
// dependency, not something to parallelize away), not an oversight.

@group(0) @binding(0) var<storage, read>       A: array<f32>;
@group(0) @binding(1) var<storage, read_write> x: array<f32>;

struct Params {
  n:     u32,
  incx:  u32,
  lda:   u32,
  trans: u32,  // 0 = no-transpose, 1 = transpose
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(2) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;

@compute @workgroup_size(64)
fn main(@builtin(local_invocation_id) lid: vec3u) {
  // Forward substitution (i = 0..n-1) solves no-trans+lower and trans+upper;
  // backward substitution (i = n-1..0) solves no-trans+upper and trans+lower
  // — same pairing strmv uses to decide which off-diagonal half to read.
  let forward = (params.trans == 0u) == (params.uplo == 0u);

  for (var step = 0u; step < params.n; step++) {
    var i: u32;
    if forward {
      i = step;
    } else {
      i = params.n - 1u - step;
    }

    // Dot product against the already-solved x[j] this row depends on.
    var acc = 0.0f;
    if params.trans == 0u {
      if params.uplo == 0u {
        // Lower, no-trans: row i = Σ_{j<i} A[i,j]*x[j] + A[i,i]*x[i]
        for (var j = lid.x; j < i; j += WGS) {
          acc += A[i * params.lda + j] * x[j * params.incx];
        }
      } else {
        // Upper, no-trans: row i = A[i,i]*x[i] + Σ_{j>i} A[i,j]*x[j]
        for (var j = i + 1u + lid.x; j < params.n; j += WGS) {
          acc += A[i * params.lda + j] * x[j * params.incx];
        }
      }
    } else {
      if params.uplo == 0u {
        // Lower, trans (== upper A^T): A[i,i]*x[i] + Σ_{j>i} A[j,i]*x[j]
        for (var j = i + 1u + lid.x; j < params.n; j += WGS) {
          acc += A[j * params.lda + i] * x[j * params.incx];
        }
      } else {
        // Upper, trans (== lower A^T): Σ_{j<i} A[j,i]*x[j] + A[i,i]*x[i]
        for (var j = lid.x; j < i; j += WGS) {
          acc += A[j * params.lda + i] * x[j * params.incx];
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
      let rhs = x[i * params.incx] - scratch[0];
      // A[i,i] is unaffected by transpose, so both op(A) cases divide by the same element.
      if params.diag == 1u {
        x[i * params.incx] = rhs;
      } else {
        x[i * params.incx] = rhs / A[i * params.lda + i];
      }
    }
    workgroupBarrier(); // x[i] must be visible to every thread before the next row reads it
  }
}
