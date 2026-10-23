// reduce_partials_f64: y[i] = alpha * Σ_c partial[c*n + i] + beta * y[i],
// double-double (Dekker) f64 emulation of reduce_partials.wgsl — the second
// pass for the split-K f64 Level 2 kernels (dgemv_t). Partials and y are
// (hi, lo) f32 pairs; reads are coalesced across i.
//
// The protected ops carry a workgroupBarrier(), so the grid-stride and
// chunk loops run a workgroup-uniform trip count, and lanes past n compute
// against a clamped index and skip only the write.

@group(0) @binding(0) var<storage, read>       partialHi: array<f32>;
@group(0) @binding(1) var<storage, read>       partialLo: array<f32>;
@group(0) @binding(2) var<storage, read_write> yHi:       array<f32>;
@group(0) @binding(3) var<storage, read_write> yLo:       array<f32>;

struct Params {
  n:       u32,
  chunks:  u32,
  incy:    u32,
  alphaHi: f32,
  alphaLo: f32,
  betaHi:  f32,
  betaLo:  f32,
}

@group(0) @binding(4) var<uniform> params: Params;

const WGS: u32 = 64u;

@compute @workgroup_size(64)
fn reduce_partials_f64(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id)  lid: vec3u,
  @builtin(num_workgroups)       nwg: vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let beta  = DD(params.betaHi, params.betaLo);
  let isBetaNonzero = params.betaHi != 0.0 || params.betaLo != 0.0;

  let stride = nwg.x * WGS;
  let iters  = (params.n + stride - 1u) / stride;
  for (var it = 0u; it < iters; it++) {
    let i     = gid.x + it * stride;
    let valid = i < params.n;
    let si    = select(0u, i, valid);

    var s = DD(0.0, 0.0);
    for (var c = 0u; c < params.chunks; c++) {
      let pi = c * params.n + si;
      s = ddAddProtected(s, DD(partialHi[pi], partialLo[pi]), lid.x);
    }

    let yi = si * params.incy;
    let scaled = ddMulProtected(alpha, s, lid.x);
    let betaTimesY = ddMulProtected(beta, DD(yHi[yi], yLo[yi]), lid.x);
    let withBeta = ddAddProtected(scaled, betaTimesY, lid.x);
    // BLAS beta==0 semantics: y is written, not accumulated — the result
    // must not depend on y's prior value (though it is still read above).
    let result = DD(
      select(scaled.hi, withBeta.hi, isBetaNonzero),
      select(scaled.lo, withBeta.lo, isBetaNonzero),
    );
    if (valid) {
      yHi[yi] = result.hi;
      yLo[yi] = result.lo;
    }
  }
}
