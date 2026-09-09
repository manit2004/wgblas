// dscal: x := alpha * x, double-double (Dekker) f64 emulation of sscal.
// alpha and x are each an f32 (hi, lo) pair. See f64/utils/multiply.wgsl for
// ddMulProtected and why plain ddMulRaw isn't safe without a renormalizing
// barrier — that barrier needs a provably uniform loop trip count across
// every thread in the workgroup, so (like dasum.wgsl's reduction loop) this
// splits into a uniform main pass plus a ragged, select-masked tail rather
// than a plain `id < params.n` grid-stride loop.

@group(0) @binding(0) var<storage, read_write> xHi: array<f32>;
@group(0) @binding(1) var<storage, read_write> xLo: array<f32>;
@group(0) @binding(2) var<uniform> params: Params;

struct Params {
  n:       u32,
  alphaHi: f32,
  alphaLo: f32,
  x_inc:   u32,
}

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn dscal_main(
  @builtin(global_invocation_id) gid:    vec3u,
  @builtin(local_invocation_id)  lid:    vec3u,
  @builtin(workgroup_id)         wgid:   vec3u,
  @builtin(num_workgroups)       num_wg: vec3u,
) {
  let alpha = DD(params.alphaHi, params.alphaLo);
  let stride = num_wg.x * WGS;

  let n_floor = (params.n / stride) * stride;
  let mainIters = n_floor / stride;
  for (var iter = 0u; iter < mainIters; iter++) {
    let id = gid.x + iter * stride;
    let i = id * params.x_inc;
    let result = ddMulProtected(alpha, DD(xHi[i], xLo[i]), lid.x);
    xHi[i] = result.hi;
    xLo[i] = result.lo;
  }

  // Tail is ragged (0 or 1 extra per thread) — pad to this workgroup's worst
  // case so every thread in the workgroup still calls ddMulProtected the
  // same number of times (its barrier needs that), masking only the write.
  let wgBaseGid = wgid.x * WGS;
  var tailIters = 0u;
  if (n_floor + wgBaseGid < params.n) {
    tailIters = (params.n - 1u - n_floor - wgBaseGid) / stride + 1u;
  }
  for (var iter = 0u; iter < tailIters; iter++) {
    let id = n_floor + gid.x + iter * stride;
    let valid = id < params.n;
    let i = select(0u, id * params.x_inc, valid); // index 0 always in-bounds
    let result = ddMulProtected(alpha, DD(xHi[i], xLo[i]), lid.x);
    if (valid) {
      xHi[i] = result.hi;
      xLo[i] = result.lo;
    }
  }
}
