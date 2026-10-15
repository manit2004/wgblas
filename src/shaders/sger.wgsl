// sger: A := alpha * x * y^T + A  (rank-1 update, A is m×n general/dense)

@group(0) @binding(0) var<storage, read>       x: array<f32>;
@group(0) @binding(1) var<storage, read>       y: array<f32>;
@group(0) @binding(2) var<storage, read_write> A: array<f32>;

struct Params {
  m:     u32,
  n:     u32,
  alpha: f32,
  incx:  u32,
  incy:  u32,
  lda:   u32,
}

@group(0) @binding(3) var<uniform> params: Params;

const WGS: u32 = 64u;
// Aligned row walk — see ssyr.wgsl for why. Here it's lda padding that
// knocks row starts off the 128-byte boundary.
const ALIGN_MASK: u32 = ~31u;

fn update(idx: u32, xi: f32, col: u32) {
  A[idx] = xi * y[col * params.incy] + A[idx];
}

@compute @workgroup_size(64)
fn main(
  @builtin(workgroup_id)        wgid: vec3u,
  @builtin(local_invocation_id) lid:  vec3u,
  @builtin(num_workgroups)      nwg:  vec3u,
) {
  for (var row = wgid.x; row < params.m; row += nwg.x) {
    let xi = params.alpha * x[row * params.incx];
    let row_base = row * params.lda;

    // 4-unrolled loop: each iteration issues 4 independent A/y accesses,
    // in aligned absolute indices.
    let first = row_base;
    let last = row_base + params.n;
    let aligned = first & ALIGN_MASK;
    let floor4 = aligned + ((last - aligned) / (4u * WGS)) * (4u * WGS);
    for (var base = aligned; base < floor4; base += 4u * WGS) {
      for (var k = 0u; k < 4u; k++) {
        let idx = base + k * WGS + lid.x;
        if (idx >= first) { update(idx, xi, idx - row_base); }
      }
    }
    // Scalar tail: at most 3*WGS elements left after the unrolled block.
    for (var idx = floor4 + lid.x; idx < last; idx += WGS) {
      if (idx >= first) { update(idx, xi, idx - row_base); }
    }
  }
}
