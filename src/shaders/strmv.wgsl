// strmv: y = A * x — strmv's no-transpose path (transpose runs strmv_t.wgsl).
// A is n×n triangular, lower (uplo=0) or upper (uplo=1) triangle stored.
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
  trans: u32,  // unused — always 0 here; kept so the Params layout is unchanged
  uplo:  u32,  // 0 = lower, 1 = upper
  diag:  u32,  // 0 = non-unit, 1 = unit
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
var<workgroup> scratch: array<f32, 64>;
const ALIGN_MASK: u32 = ~31u;

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var i = wgid.x; i < params.n; i += nwg.x) {
    var acc = 0.0f;

    // y[i] = Σ_j A[i,j] * x[j] over the stored range: lower j <= i, upper j >= i.
    // Walked in aligned absolute indices — see ssyr.wgsl for why.
    let row_base = i * params.lda;
    let first = row_base + select(i, 0u, params.uplo == 0u);
    let last = row_base + select(params.n, i + 1u, params.uplo == 0u);
    for (var idx = (first & ALIGN_MASK) + lid.x; idx < last; idx += WGS) {
      if (idx >= first) {
        let j = idx - row_base;
        // unit diagonal: use 1 instead of A's actual diagonal value
        let aVal = select(A[idx], 1.0, params.diag == 1u && j == i);
        acc += aVal * x[j * params.incx];
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
      y[ i * params.incy ] = scratch[0];
    }
  }
}
